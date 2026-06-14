import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('careercraft_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data.data);
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: userToken, ...userData } = res.data.data;
      localStorage.setItem('careercraft_token', userToken);
      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed. Please check credentials.' 
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      const { token: userToken, ...userData } = res.data.data;
      localStorage.setItem('careercraft_token', userToken);
      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      console.error('Signup error:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Sign up failed.' 
      };
    }
  };

  const googleLoginSimulate = async (name, email, googleId) => {
    try {
      const res = await api.post('/auth/google', { name, email, googleId });
      const { token: userToken, ...userData } = res.data.data;
      localStorage.setItem('careercraft_token', userToken);
      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (err) {
      console.error('Google Auth simulation error:', err);
      return { success: false, message: 'Google authentication failed.' };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      setUser(res.data.data);
      return { success: true };
    } catch (err) {
      console.error('Profile update error:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Profile update failed.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('careercraft_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, googleLoginSimulate, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
