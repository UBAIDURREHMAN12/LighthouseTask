import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApi } from "../Contexts/ApiContext"; 
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap"; 
import { useNavigate } from "react-router-dom"; 
import { Chart } from "chart.js/auto";
import { Line, Pie } from "react-chartjs-2";

const Dashboard = () => {
  const { baseURL, setLoggedIn } = useApi(); 
  const navigate = useNavigate(); 
  const [performanceScore, setPerformanceScore] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State to manage user input
  const [url, setUrl] = useState(""); // URL input
  const [platform, setPlatform] = useState("Desktop"); // Platform input (Desktop or Mobile)

  // Function to fetch performance score from the backend
  const fetchPerformanceScore = async () => {
    const token = localStorage.getItem("auth_token"); // Retrieve token from localStorage

    setLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/lighthouse/test`,
        {
          url: url, // URL entered by the user
          platform: platform, // Platform selected by the user
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass Bearer token
            "Content-Type": "application/json", // Set content type
          },
        }
      );

      const { performance_score, metrics, categories } = response.data;

      setPerformanceScore(performance_score); 
      setMetrics(metrics); // Update metrics
      setCategories(categories); // Update categories
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred"); // Handle error
    } finally {
      setLoading(false); // Stop loading once the request completes
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPerformanceScore(); // Fetch performance score on form submission
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token found");

      await axios.post(
        `${baseURL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear token from localStorage and update state
      localStorage.removeItem("auth_token");
      setLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Data for Pie Chart
  const pieChartData = categories
    ? {
        labels: Object.keys(categories),
        datasets: [
          {
            label: "Category Scores",
            data: Object.values(categories).map(
              (category) => category.score * 100
            ),
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  // Data for Line Chart
  const lineChartData = metrics
    ? {
        labels: Object.keys(metrics),
        datasets: [
          {
            label: "Metrics Scores",
            data: Object.values(metrics).map(
              (metric) => metric.score * 100
            ),
            fill: false,
            borderColor: "rgba(75,192,192,1)",
            tension: 0.1,
          },
        ],
      }
    : null;

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Container className="p-4">
        <Card className="shadow" style={{ width: "100%" }}>
          <Card.Body>
            <h2 className="text-center mb-4">Dashboard</h2>

            {/* Logout Button */}
            <Button
              variant="danger"
              onClick={handleLogout}
              className="w-10 mb-4"
            >
              Logout
            </Button>

            <h4>Test Performance</h4>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={8} sm={12}>
                  <Form.Group controlId="url">
                    <Form.Label>URL to Test</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="Enter a valid URL"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4} sm={12}>
                  <Form.Group controlId="platform">
                    <Form.Label>Platform</Form.Label>
                    <Form.Control
                      as="select"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                    >
                      <option value="Desktop">Desktop</option>
                      <option value="Mobile">Mobile</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100"
              >
                {loading ? "Loading..." : "Test Performance"}
              </Button>
            </Form>

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

            {performanceScore !== null && (
              <>
                <Card className="mt-4">
                  <Card.Body>
                    <h5>Score</h5>
                    <p>{performanceScore}%</p>
                  </Card.Body>
                </Card>

                <Row className="mt-4">
                  {/* Left Column for Pie Chart */}
                  <Col md={6}>
                    {pieChartData && (
                      <div>
                        <h5>Category Scores</h5>
                        <Pie data={pieChartData} />
                      </div>
                    )}
                  </Col>

                  {/* Right Column for Line Chart */}
                  <Col md={6}>
                    {lineChartData && (
                      <div>
                        <h5>Metrics Trends</h5>
                        <Line data={lineChartData} />
                      </div>
                    )}
                  </Col>
                </Row>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Dashboard;
