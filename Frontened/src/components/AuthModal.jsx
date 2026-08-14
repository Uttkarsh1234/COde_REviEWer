import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    closeAuthModal,
    login,
    register,
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (authModalTab === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.message || 'Invalid email or password');
        }
      } else {
        if (!name.trim()) {
          setError('Name is required');
          setIsLoading(false);
          return;
        }
        if (password.length < 5) {
          setError('Password must be at least 5 characters');
          setIsLoading(false);
          return;
        }
        const res = await register(name, email, password);
        if (!res.success) {
          setError(res.message || 'Registration failed');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <button
            className="modal-close-btn"
            onClick={closeAuthModal}
            title="Close modal"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <h3 className="modal-title">
            {authModalTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <p className="modal-subtitle">
            {authModalTab === 'login'
              ? 'Log in to save and sync your code review history'
              : 'Sign up to unlock AI-powered automated code debugging'}
          </p>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            type="button"
            className={`modal-tab ${authModalTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setAuthModalTab('login');
              setError('');
            }}
          >
            Log In
          </button>
          <button
            type="button"
            className={`modal-tab ${authModalTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setAuthModalTab('register');
              setError('');
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form Body */}
        <form className="modal-body" onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
              }}
            >
              {error}
            </div>
          )}

          {authModalTab === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-name">
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Linus Torvalds"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              className="form-input"
              placeholder="developer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={5}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Sparkles size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{authModalTab === 'login' ? 'Log In' : 'Create Free Account'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
