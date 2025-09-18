import { useState, useEffect } from 'react';
import axios from 'axios';

// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        withCredentials: true
      });
      setAuthState({
        user: response.data.user,
        loading: false,
        error: null
      });
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
        withCredentials: true
      });
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    logout,
    checkAuth
  };
};