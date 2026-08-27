import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is in localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const userData = response.data.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      const newUser = response.data.data;
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    return response.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
