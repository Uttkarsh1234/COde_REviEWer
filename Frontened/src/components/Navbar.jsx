import React from 'react';
import { 
  Bug, 
  Sparkles, 
  History, 
  User as UserIcon, 
  LogOut, 
  Code2, 
  Layers, 
  Zap,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_CODES } from '../data/sampleCodes';

export const Navbar = ({ onOpenHistory, historyCount, onLoadSample, onClearEditor }) => {
  const { user, logout, openLogin, openRegister } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="nav-brand">
          <div className="brand-icon-wrapper">
            <Bug size={22} color="#ffffff" />
          </div>
          <div className="brand-text-col">
            <div className="brand-title">
              BugLens <span style={{ color: '#38bdf8' }}>AI</span>
              <span className="brand-tag">v2.0</span>
            </div>
            <div className="brand-subtitle">Automated Code Debugger & Complexity Engine</div>
          </div>
        </div>

        {/* Right Nav Actions */}
        <div className="nav-actions">
          {/* Status Indicator */}
          <div className="status-badge" title="AI Gemini Engine Connected">
            <span className="status-dot"></span>
            <span>AI Online</span>
          </div>

          {/* Preset Samples Selector */}
          <div style={{ position: 'relative' }}>
            <select
              className="custom-select"
              style={{ fontSize: '0.8rem', padding: '0.45rem 2rem 0.45rem 0.75rem' }}
              onChange={(e) => {
                if (e.target.value) {
                  onLoadSample(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              aria-label="Load Sample Buggy Code"
            >
              <option value="" disabled>✨ Load Sample Buggy Code...</option>
              {SAMPLE_CODES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* History Button */}
          <button
            className="btn btn-secondary"
            onClick={onOpenHistory}
            title="Open Review History"
          >
            <History size={16} />
            <span>History</span>
            {historyCount > 0 && (
              <span
                style={{
                  background: 'rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  marginLeft: '2px',
                }}
              >
                {historyCount}
              </span>
            )}
          </button>

          {/* User Auth Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0284c7, #818cf8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9' }}>
                  {user.name}
                </span>
              </div>
              <button
                className="btn btn-outline btn-icon"
                onClick={logout}
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button className="btn btn-outline" onClick={openLogin}>
                <LogIn size={15} />
                <span>Log In</span>
              </button>
              <button className="btn btn-primary" onClick={openRegister}>
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
