import React, { useRef, useEffect } from 'react';
import { 
  Code2, 
  Play, 
  Trash2, 
  Copy, 
  Upload, 
  Sparkles, 
  FileCode,
  Check
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/sampleCodes';
import { useToast } from '../context/ToastContext';

export const CodeEditor = ({
  code,
  setCode,
  language,
  setLanguage,
  onReview,
  isLoading,
  onClear
}) => {
  const { showToast } = useToast();
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const fileInputRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Sync scroll between line numbers and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter to run review
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && code.trim()) {
        onReview();
      }
    }
    // Support Tab key indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      // Move cursor
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast('Code copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect language from extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    const extMap = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      cpp: 'cpp',
      c: 'cpp',
      java: 'java',
      rs: 'rust',
      go: 'go',
      sql: 'sql',
      php: 'php',
      html: 'html',
      css: 'css',
    };

    if (extMap[ext]) {
      setLanguage(extMap[ext]);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setCode(content);
        showToast(`Loaded ${file.name} successfully`, 'success');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="glass-panel editor-wrapper">
      {/* Panel Top Header */}
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <Code2 size={18} color="#38bdf8" />
            <span>Source Code</span>
          </div>

          {/* Language Selector */}
          <select
            className="custom-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Target Programming Language"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Toolbar Controls */}
        <div className="panel-controls">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            accept=".js,.jsx,.ts,.tsx,.py,.cpp,.c,.java,.rs,.go,.sql,.php,.html,.css,.json,.txt"
          />

          <button
            className="btn btn-outline btn-icon"
            onClick={() => fileInputRef.current?.click()}
            title="Upload code file"
            aria-label="Upload File"
          >
            <Upload size={15} />
          </button>

          <button
            className="btn btn-outline btn-icon"
            onClick={handleCopy}
            title="Copy code"
            aria-label="Copy Code"
            disabled={!code}
          >
            {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
          </button>

          <button
            className="btn btn-outline btn-icon"
            onClick={onClear}
            title="Clear editor"
            aria-label="Clear Code"
            disabled={!code}
          >
            <Trash2 size={15} />
          </button>

          <button
            className="btn btn-glow"
            onClick={onReview}
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? (
              <>
                <Sparkles size={16} className="animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                <span>Review & Debug</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="editor-body">
        {/* Line Numbers Bar */}
        <div className="line-numbers" ref={lineNumbersRef} aria-hidden="true">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>

        {/* Code Textarea */}
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          placeholder={`// Paste or write your ${language} code here...\n// Press Ctrl + Enter or click "Review & Debug" to inspect for bugs, memory leaks, security issues, and complexity.`}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>

      {/* Editor Footer Status Bar */}
      <div className="editor-footer">
        <div className="editor-stats">
          <span>{lineCount} lines</span>
          <span>{code.length} characters</span>
          <span style={{ textTransform: 'capitalize' }}>Mode: {language}</span>
        </div>
        <div>
          <span style={{ opacity: 0.7 }}>Shortcut: </span>
          <kbd
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Ctrl + Enter
          </kbd>
        </div>
      </div>
    </div>
  );
};
