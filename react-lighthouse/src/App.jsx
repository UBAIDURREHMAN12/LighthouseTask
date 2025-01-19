import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import { useApi } from './Contexts/ApiContext'; // Context for API base URL
import { ApiProvider } from "./Contexts/ApiContext"; // Ensure the context is properly set up

import { Login } from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";

// Import GoogleOAuthProvider
import { GoogleOAuthProvider } from '@react-oauth/google';

// PrivateRoute component to protect the Dashboard route
const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useApi(); // Access isLoggedIn from context
  
  // If the user is not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the children (Dashboard)
  return children;
};

// Router setup
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
]);

// Main App Component wrapped in GoogleOAuthProvider
const App = () => {
  return (
    <GoogleOAuthProvider clientId="829050868130-h1kqahthl8pfiqhcvf2l2v8jeh247327.apps.googleusercontent.com">
      <ApiProvider>
        <RouterProvider router={router} />
      </ApiProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
