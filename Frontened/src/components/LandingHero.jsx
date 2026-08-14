import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Bug, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Terminal, 
  Layers, 
  Play, 
  ChevronRight, 
  Flame, 
  Compass,
  FileCode,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DEMO_SNIPPETS = [
  {
    id: 'auth-js',
    tab: 'authService.js',
    lang: 'JavaScript',
    code: `async function handleUserLogin(req, res) {
  const { username, password } = req.body;

  // ⚠️ SQL Injection risk & Missing await
  const query = "SELECT * FROM users WHERE user = '" + username + "'";
  const user = db.query(query);

  if (user) {
    return res.json({ status: 200, user });
  }
}`,
    issues: [
      { type: 'critical', line: 5, text: 'CRITICAL: SQL Injection via string concatenation' },
      { type: 'warning', line: 6, text: 'ASYNC BUG: Missing `await` on database promise' },
    ],
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    confidence: '99.8%',
    fixSummary: 'Convert to parameterized prepared statement + async/await'
  },
  {
    id: 'fib-py',
    tab: 'fibonacci.py',
    lang: 'Python',
    code: `def calculate_fibonacci(n):
    if n <= 1:
        return n
    
    # ⚠️ Exponential Tree Recalculation
    # Causes severe CPU freeze on n > 35
    return calculate_fibonacci(n - 1) + calculate_fibonacci(n - 2)

print(calculate_fibonacci(40))`,
    issues: [
      { type: 'warning', line: 7, text: 'ALGORITHM: Exponential O(2^N) recursion without memoization' },
      { type: 'info', line: 9, text: 'PERFORMANCE: Stack overflow risk for large n' }
    ],
    timeComplexity: 'O(2^N) ➔ O(N)',
    spaceComplexity: 'O(N) ➔ O(1)',
    confidence: '99.4%',
    fixSummary: 'Refactored to DP Iterative with O(1) space auxiliary array'
  },
  {
    id: 'leak-ts',
    tab: 'streamManager.ts',
    lang: 'TypeScript',
    code: `class DataSyncManager {
  private eventBus = new EventEmitter();

  public trackSession(userId: string) {
    const buffer = new Array(100000).fill("chunk");
    
    // ⚠️ Unreleased event listener leak
    this.eventBus.on('sync', (data) => {
      this.syncUserBuffer(userId, buffer, data);
    });
  }
}`,
    issues: [
      { type: 'critical', line: 8, text: 'MEMORY LEAK: Event listener retains closure heap buffer' },
      { type: 'info', line: 4, text: 'TYPE: Add explicit interface for user payload' }
    ],
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(N) Unbounded',
    confidence: '99.1%',
    fixSummary: 'Add cleanup unsubscribe handler on session termination'
  }
];

export const LandingHero = ({ onGetStarted, onTrySample }) => {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(100);
  const canvasRef = useRef(null);
  const currentDemo = DEMO_SNIPPETS[activeTabIdx];

  // Particle mesh canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = Math.min(Math.floor(width / 22), 55);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        color: Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(168, 85, 247, ',
        baseAlpha: Math.random() * 0.35 + 0.2
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 3;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle cyber grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.baseAlpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / 130) * 0.18;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.stroke();
          }
        }

        // Connect to mouse if close
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 160) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          const mAlpha = (1 - mdist / 160) * 0.35;
          ctx.strokeStyle = `rgba(168, 85, 247, ${mAlpha})`;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Simulator scanner pulse cycle
  const triggerRescan = (idx) => {
    setActiveTabIdx(idx);
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  const handleLaunchClick = () => {
    // Celebratory confetti blast
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#38bdf8', '#818cf8', '#c084fc', '#34d399', '#f43f5e']
    });

    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <div className="landing-container">
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="landing-canvas" />

      {/* Ambient Glow Orbs */}
      <div className="landing-glow landing-glow-1" />
      <div className="landing-glow landing-glow-2" />
      <div className="landing-glow landing-glow-3" />

      {/* Main Hero Viewport */}
      <div className="landing-content">
        {/* Top Hero Pill Badge */}
        <div className="hero-badge-pill animate-fade-in-up">
          <span className="badge-pulsar" />
          <Sparkles size={14} className="badge-icon-sparkle" />
          <span>GEMINI 2.0 AI POWERED • REAL-TIME CODE AUDITOR</span>
          <span className="badge-tag-v2">v2.0 PRO</span>
        </div>

        {/* Hero Title */}
        <h1 className="hero-headline animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Automate Code Debugging.<br />
          <span className="hero-gradient-text">Eliminate Vulnerabilities.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-subtext animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Instantly identify critical bugs, calculate exact Big-O complexity, detect security flaws,
          and receive clean, optimized refactored code powered by deep AST intelligence.
        </p>

        {/* Primary Action Buttons */}
        <div className="hero-actions animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button 
            id="btn-get-started-hero"
            className="btn-launch-primary"
            onClick={handleLaunchClick}
          >
            <span>Get Started — Launch Reviewer</span>
            <div className="btn-icon-circle">
              <ArrowRight size={18} />
            </div>
          </button>

          <button 
            id="btn-try-sample-hero"
            className="btn-launch-secondary"
            onClick={() => {
              handleLaunchClick();
              if (onTrySample) onTrySample('sql-injection-bug');
            }}
          >
            <Zap size={16} color="#38bdf8" />
            <span>Try Sample Demo</span>
          </button>
        </div>

        {/* Social Proof Metric Highlights */}
        <div className="hero-metrics animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="metric-pill">
            <span className="metric-num">50K+</span>
            <span className="metric-desc">Lines Audited</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-pill">
            <span className="metric-num">&lt; 2.0s</span>
            <span className="metric-desc">Avg Review Speed</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-pill">
            <span className="metric-num">99.4%</span>
            <span className="metric-desc">Catch Accuracy</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-pill">
            <span className="metric-num">5+</span>
            <span className="metric-desc">Languages Supported</span>
          </div>
        </div>

        {/* Live Interactive Cyber Scanner Demo Widget */}
        <div className="landing-demo-section animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="demo-window-card">
            {/* Window Header */}
            <div className="demo-window-header">
              <div className="demo-window-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>

              {/* Language / File Tabs */}
              <div className="demo-tabs">
                {DEMO_SNIPPETS.map((snippet, idx) => (
                  <button
                    key={snippet.id}
                    className={`demo-tab-btn ${activeTabIdx === idx ? 'active' : ''}`}
                    onClick={() => triggerRescan(idx)}
                  >
                    <FileCode size={13} />
                    <span>{snippet.tab}</span>
                    {activeTabIdx === idx && <span className="tab-indicator" />}
                  </button>
                ))}
              </div>

              {/* Scanner Status Badge */}
              <div className="demo-status-pill">
                <span className={`status-led ${isScanning ? 'scanning' : 'ready'}`} />
                <span>{isScanning ? 'Scanning AST...' : 'Audit Complete'}</span>
              </div>
            </div>

            {/* Window Body: Code + Live Diagnostic Overlay */}
            <div className="demo-window-body">
              {/* Code Panel */}
              <div className="demo-code-area">
                {/* Laser Scanning Line */}
                <div className={`cyber-scan-beam ${isScanning ? 'scanning' : 'idle'}`} />

                <pre className="demo-pre">
                  <code>{currentDemo.code}</code>
                </pre>
              </div>

              {/* Live AI Analysis Sidebar / Overlay */}
              <div className="demo-analysis-area">
                <div className="analysis-header">
                  <div className="analysis-title-box">
                    <Cpu size={15} color="#38bdf8" />
                    <span>AI Diagnostic Output</span>
                  </div>
                  <button 
                    className="demo-rescan-btn"
                    onClick={() => triggerRescan(activeTabIdx)}
                    title="Rerun scanner simulation"
                  >
                    <Play size={12} fill="#94a3b8" />
                    <span>Re-Scan</span>
                  </button>
                </div>

                {/* Detected Issues List */}
                <div className="analysis-issues">
                  <div className="issues-label">Detected Inefficiencies:</div>
                  {currentDemo.issues.map((iss, i) => (
                    <div 
                      key={i} 
                      className={`issue-chip-preview ${iss.type}`}
                      style={{ animationDelay: `${i * 0.15}s` }}
                    >
                      <Bug size={13} />
                      <span>{iss.text}</span>
                    </div>
                  ))}
                </div>

                {/* Algorithmic Complexity Metrics */}
                <div className="analysis-complexity-box">
                  <div className="complexity-item">
                    <span className="c-label">Time Complexity</span>
                    <span className="c-val text-cyan">{currentDemo.timeComplexity}</span>
                  </div>
                  <div className="complexity-item">
                    <span className="c-label">Space Complexity</span>
                    <span className="c-val text-purple">{currentDemo.spaceComplexity}</span>
                  </div>
                </div>

                {/* Fix Summary & CTA */}
                <div className="analysis-fix-banner">
                  <div className="fix-text">
                    <CheckCircle2 size={14} color="#10b981" />
                    <span>{currentDemo.fixSummary}</span>
                  </div>
                  <button 
                    className="demo-apply-btn"
                    onClick={handleLaunchClick}
                  >
                    <span>Test In Workspace</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Feature Cards Grid */}
        <div className="landing-features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper cyan">
              <Bug size={24} />
            </div>
            <h3 className="feature-title">AST Vulnerability Detection</h3>
            <p className="feature-desc">
              Uncovers deep logic bugs, memory leaks, off-by-one errors, unhandled promise rejections, and security hazards before deployment.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper purple">
              <Zap size={24} />
            </div>
            <h3 className="feature-title">Big-O Complexity Audit</h3>
            <p className="feature-desc">
              Measures algorithmic execution time and auxiliary space consumption with precise Big-O notation and performance ratings.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper emerald">
              <Sparkles size={24} />
            </div>
            <h3 className="feature-title">One-Click AI Refactor</h3>
            <p className="feature-desc">
              Generates clean, readable, documented, and production-ready code with complete syntax highlighting and side-by-side comparison.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper indigo">
              <Layers size={24} />
            </div>
            <h3 className="feature-title">Cloud History Vault</h3>
            <p className="feature-desc">
              Every audit is securely preserved in your cloud history. Revisit past reviews, monitor fixes, and export markdown reports with one click.
            </p>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="landing-bottom-cta">
          <div className="bottom-cta-card">
            <div className="bottom-cta-text">
              <h2>Ready to Write Flawless Code?</h2>
              <p>Experience fast, comprehensive AI code reviews right in your browser.</p>
            </div>
            <button 
              className="btn-launch-primary"
              onClick={handleLaunchClick}
            >
              <span>Launch Reviewer Now</span>
              <div className="btn-icon-circle">
                <ArrowRight size={18} />
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="footer-brand">
            <Bug size={18} color="#38bdf8" />
            <span>BugLens AI • Intelligent Automated Code Debugger</span>
          </div>
          <div className="footer-meta">
            <span>Powered by Google Gemini 2.0 Flash</span>
            <span>•</span>
            <span>Built for Modern Software Engineers</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
