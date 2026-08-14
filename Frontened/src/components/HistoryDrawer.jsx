import React, { useState } from 'react';
import { 
  X, 
  History, 
  Search, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  Code2, 
  Bug, 
  Sparkles 
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const HistoryDrawer = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelectReview, 
  onDeleteReview, 
  isLoading 
}) => {
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const term = search.toLowerCase();
    const lang = (item.language || '').toLowerCase();
    const code = (item.code || '').toLowerCase();
    const summary = (item.output?.summary || '').toLowerCase();
    return lang.includes(term) || code.includes(term) || summary.includes(term);
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <History size={20} color="#38bdf8" />
            <span>Review History</span>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                fontWeight: 700,
              }}
            >
              {history.length}
            </span>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            title="Close History"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="drawer-search">
          <div className="search-input-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by language, code, or issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Content List */}
        <div className="drawer-content">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
              <Sparkles size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem', color: '#38bdf8' }} />
              <p>Loading history records...</p>
            </div>
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((item) => {
              const bugCount = item.output?.bugs?.length || 0;

              return (
                <div
                  key={item._id}
                  className="history-item"
                  onClick={() => {
                    onSelectReview(item);
                    onClose();
                  }}
                >
                  <div className="history-item-top">
                    <span className="history-lang-badge">{item.language || 'Code'}</span>
                    <span className="history-date">
                      <Calendar size={11} style={{ display: 'inline', marginRight: '4px' }} />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div className="history-code-preview">
                    {item.code.slice(0, 100).replace(/\n/g, ' ')}...
                  </div>

                  <div className="history-item-bottom">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Bug size={13} color={bugCount > 0 ? '#fb7185' : '#34d399'} />
                      <span>
                        {bugCount} {bugCount === 1 ? 'issue' : 'issues'}
                      </span>
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        className="btn btn-outline btn-icon"
                        style={{ padding: '4px 6px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this review from history?')) {
                            onDeleteReview(item._id);
                          }
                        }}
                        title="Delete Review"
                        aria-label="Delete Review"
                      >
                        <Trash2 size={13} color="#fb7185" />
                      </button>
                      <ArrowRight size={14} color="#94a3b8" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#94a3b8' }}>
              <History size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 600, color: '#f1f5f9' }}>No reviews found</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {search ? 'Try adjusting your search query' : 'Your saved reviews will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
