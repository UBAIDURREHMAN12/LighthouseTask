import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../Contexts/ApiContext';
import axios from 'axios';

export const Login = () => {
  const navigate = useNavigate();
  const { baseURL, setLoggedIn } = useApi();

  // Handle successful login
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${baseURL}/auth/google/callback`,
        { token: credentialResponse.credential },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
  
      const { token } = res.data.user; 
      localStorage.setItem('auth_token', token); 
      setLoggedIn(true); 
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };
  

  // Handle failed login
  const handleLoginFailure = (error) => {
    console.error('Google login failed:', error);
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body">
              <h2 className="text-center mb-4">Login with Google</h2>

              <div className="d-flex justify-content-center">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginFailure}
                  useOneTap
                />
              </div>

              <p className="text-center mt-4">
                <span className="text-muted">By logging in, you agree to our </span>
                <a href="#" className="text-primary">Terms & Conditions</a> 
                <span className="text-muted"> and </span>
                <a href="#" className="text-primary">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
