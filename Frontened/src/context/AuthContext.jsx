import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const { showToast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 1. Check if returning from OAuth redirect with token or error
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');
        const authError = params.get('auth_error');

        if (urlToken) {
          api.setToken(urlToken);
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            showToast(`Welcome, ${res.user.name || 'Developer'}!`, 'success');
          }
          // Clean token from URL bar for security and cleanliness
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        if (authError) {
          showToast(
            authError === 'google_failed'
              ? 'Google sign-in was cancelled or failed. Please try again.'
              : `Authentication error: ${decodeURIComponent(authError)}`,
            'error'
          );
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // 2. Check existing token in localStorage
        const token = api.getToken();
        if (token) {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          }
        }
      } catch (err) {
        // Token might be invalid or expired
        api.setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [showToast]);

  const loginWithGoogle = () => {
    window.location.href = api.getGoogleAuthUrl();
  };

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      if (data.success && data.user) {
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name || 'Developer'}!`, 'success');
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      return { success: false, message: err.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await api.register(name, email, password);
      if (data.success && data.user) {
        setUser(data.user);
        showToast('Account created successfully! You are now logged in.', 'success');
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      showToast('Logged out successfully', 'info');
    } catch (err) {
      setUser(null);
      api.setToken(null);
    }
  };

  const openLogin = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalTab('register');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openLogin,
        openRegister,
        closeAuthModal,
        login,
        register,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
