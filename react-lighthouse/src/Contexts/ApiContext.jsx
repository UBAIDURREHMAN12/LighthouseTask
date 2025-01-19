import React, { createContext, useState, useContext } from 'react';

// Create Context
const ApiContext = createContext();

// ApiProvider component to manage authentication state
export const ApiProvider = ({ children }) => {
  const [baseURL, setBaseURL] = useState('http://127.0.0.1:8000/api'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const setLoggedIn = (status) => {
    setIsLoggedIn(status); // Update login status
  };

  return (
    <ApiContext.Provider value={{ baseURL, isLoggedIn, setLoggedIn }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  return useContext(ApiContext);
};
