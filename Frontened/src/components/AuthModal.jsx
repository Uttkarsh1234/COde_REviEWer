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
    loginWithGoogle,
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
        <div className="modal-body">
          {/* OAuth Provider Section */}
          <div className="oauth-container">
            <button
              type="button"
              className="oauth-btn oauth-btn-google"
              onClick={loginWithGoogle}
              id="btn-google-oauth"
              title="Sign in with your Google account"
            >
              <svg className="oauth-icon" viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{authModalTab === 'login' ? 'Continue with Google' : 'Sign up with Google'}</span>
            </button>
          </div>

          <div className="auth-divider">
            <span className="auth-divider-line"></span>
            <span className="auth-divider-text">OR CONTINUE WITH EMAIL</span>
            <span className="auth-divider-line"></span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
  </div>
  );
};
