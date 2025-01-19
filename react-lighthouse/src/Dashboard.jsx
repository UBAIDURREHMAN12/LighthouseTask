import React from 'react';
import { useAuth } from './AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth(); // Access user from context

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <p>Hello, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
