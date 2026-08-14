import React from 'react';
import { ShieldCheck, Bug, Zap, Clock, Terminal } from 'lucide-react';

export const StatsBar = ({ totalReviews, totalBugsFound, currentComplexity, currentLanguage }) => {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-icon-box" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
          <Terminal size={18} />
        </div>
        <div className="stat-meta">
          <span className="stat-value">{totalReviews || '0'}</span>
          <span className="stat-label">Saved Reviews</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-box" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185' }}>
          <Bug size={18} />
        </div>
        <div className="stat-meta">
          <span className="stat-value">{totalBugsFound ?? '0'}</span>
          <span className="stat-label">Issues Detected</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
          <Clock size={18} />
        </div>
        <div className="stat-meta">
          <span className="stat-value" style={{ fontFamily: 'var(--font-mono)' }}>
            {currentComplexity?.time || 'O(1)'}
          </span>
          <span className="stat-label">Est. Time Complexity</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
          <Zap size={18} />
        </div>
        <div className="stat-meta">
          <span className="stat-value" style={{ textTransform: 'capitalize' }}>
            {currentLanguage || 'JavaScript'}
          </span>
          <span className="stat-label">Active Target</span>
        </div>
      </div>
    </div>
  );
};
