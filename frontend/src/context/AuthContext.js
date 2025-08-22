import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (localStorage.getItem('token')) {
        setAuthToken(localStorage.getItem('token'));
        try {
          const res = await authAPI.getUser();
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
          setError('Authentication failed. Please log in again.');
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Set auth token for all axios requests
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await authAPI.register(formData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await authAPI.login(formData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};