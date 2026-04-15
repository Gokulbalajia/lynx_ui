import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://pet-shop-api-t1hm.onrender.com';
axios.defaults.baseURL = API_BASE_URL;

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'admin@lynxpetshop.com';
const ADMIN_ROLE_ID = 1;

const parseJwtPayload = (token) => {
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (identifier, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', identifier);
      formData.append('password', password);
      formData.append('scope', '');
      formData.append('client_id', '');
      formData.append('client_secret', '');

      const response = await axios.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      const payload = parseJwtPayload(access_token);

      const loginIdentifier = identifier.toLowerCase().trim();
      const jwtEmail = payload?.email?.toLowerCase() || '';

      const isAdminUser =
        loginIdentifier === ADMIN_EMAIL.toLowerCase() ||
        jwtEmail === ADMIN_EMAIL.toLowerCase();

      const profile = {
        id: payload?.sub || payload?.user_id || payload?.id || null,
        name: payload?.name || payload?.username || loginIdentifier.split('@')[0],
        email: jwtEmail || loginIdentifier,
        phone: payload?.phone || '',
        role_id: isAdminUser ? ADMIN_ROLE_ID : 2,
        role: isAdminUser ? 'admin' : 'user',
      };

      setUser(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('isAdmin', String(isAdminUser));

      return { success: true, isAdmin: isAdminUser };
    } catch (error) {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userProfile');
      delete axios.defaults.headers.common['Authorization'];
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed. Check your credentials.',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        password: userData.password,
        is_active: true,
        role_id: 2,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isAdmin');
    delete axios.defaults.headers.common['Authorization'];
  };

  const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
  const isAdmin = storedIsAdmin || user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const isUser = !!token;

  const value = {
    user,
    token,
    userId: user?.id || parseJwtPayload(token)?.sub || null,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isAdmin,
    isUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
