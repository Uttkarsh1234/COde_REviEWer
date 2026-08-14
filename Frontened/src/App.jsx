import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { CodeEditor } from './components/CodeEditor';
import { ReviewPanel } from './components/ReviewPanel';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AuthModal } from './components/AuthModal';
import { SAMPLE_CODES } from './data/sampleCodes';
import api from './api/client';

const initialDefaultCode = `// Welcome to BugLens AI Code Debugger!
// Write or paste any JavaScript, Python, C++, TypeScript, or Go code below.

function calculateAverage(items) {
  let sum = 0;
  
  // Potential bug: No length check before division (Divide by zero if empty)
  for (let i = 0; i <= items.length; i++) { // Bug: Off-by-one boundary index
    sum += items[i];
  }
  
  return sum / items.length;
}

console.log(calculateAverage([10, 20, 30]));
`;

function MainApp() {
  const { user, openLogin } = useAuth();
  const { showToast } = useToast();

  const [code, setCode] = useState(initialDefaultCode);
  const [language, setLanguage] = useState('javascript');
  const [reviewResult, setReviewResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Fetch reviews history whenever user changes
  const fetchHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      return;
    }
    setIsHistoryLoading(true);
    try {
      const data = await api.getReviews();
      if (data.success && Array.isArray(data.reviews)) {
        setHistory(data.reviews);
      }
    } catch (err) {
      console.warn('Could not fetch history:', err.message);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Execute Code Review
  const handleReviewCode = async () => {
    if (!code.trim()) {
      showToast('Please enter some code to review', 'warning');
      return;
    }

    if (!user) {
      showToast('Please log in or create an account to review and save code', 'info');
      openLogin();
      return;
    }

    setIsLoading(true);
    setReviewResult(null);

    try {
      const data = await api.reviewCode(code, language);
      if (data.success && data.result) {
        setReviewResult(data.result);
        showToast('Code analysis completed successfully!', 'success');
        // Refresh history
        fetchHistory();
      } else {
        showToast(data.message || 'Failed to review code', 'error');
      }
    } catch (err) {
      console.error('Review error:', err);
      showToast(err.message || 'An error occurred while reviewing code', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Load preset sample
  const handleLoadSample = (sampleId) => {
    const sample = SAMPLE_CODES.find((s) => s.id === sampleId);
    if (sample) {
      setCode(sample.code);
      setLanguage(sample.language);
      setReviewResult(null);
      showToast(`Loaded "${sample.name}"`, 'info');
    }
  };

  // Clear Editor
  const handleClearEditor = () => {
    setCode('');
    setReviewResult(null);
    showToast('Editor cleared', 'info');
  };

  // Select from history
  const handleSelectHistoryItem = (item) => {
    setCode(item.code || '');
    setLanguage(item.language || 'javascript');
    if (item.output) {
      setReviewResult(item.output);
    }
    showToast(`Loaded review from ${new Date(item.createdAt).toLocaleDateString()}`, 'info');
  };

  // Delete from history
  const handleDeleteReview = async (id) => {
    try {
      const data = await api.deleteReview(id);
      if (data.success) {
        setHistory((prev) => prev.filter((r) => r._id !== id));
        showToast('Review removed from history', 'success');
      } else {
        showToast(data.message || 'Failed to delete review', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete review', 'error');
    }
  };

  // Calculate high-level stats
  const totalBugsFound = history.reduce(
    (acc, curr) => acc + (curr.output?.bugs?.length || 0),
    reviewResult?.bugs?.length || 0
  );

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        onOpenHistory={() => {
          if (!user) {
            showToast('Please sign in to view your saved review history', 'info');
            openLogin();
          } else {
            setIsHistoryOpen(true);
          }
        }}
        historyCount={history.length}
        onLoadSample={handleLoadSample}
        onClearEditor={handleClearEditor}
      />

      {/* Main Workspace Area */}
      <main className="main-content">
        {/* Quick Stats Bar */}
        <StatsBar
          totalReviews={history.length}
          totalBugsFound={totalBugsFound}
          currentComplexity={{
            time: reviewResult?.timeComplexity,
            space: reviewResult?.spaceComplexity,
          }}
          currentLanguage={language}
        />

        {/* 2-Column Responsive Workspace Grid */}
        <div className="workspace-grid">
          {/* Left Column: Code Editor */}
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            onReview={handleReviewCode}
            isLoading={isLoading}
            onClear={handleClearEditor}
          />

          {/* Right Column: AI Review & Debugging Results */}
          <ReviewPanel
            result={reviewResult}
            isLoading={isLoading}
            onReScan={handleReviewCode}
          />
        </div>
      </main>

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectReview={handleSelectHistoryItem}
        onDeleteReview={handleDeleteReview}
        isLoading={isHistoryLoading}
      />

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
