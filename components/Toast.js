/**
 * @fileoverview Toast Notification System
 * @description Lightweight toast notifications rendered at app root.
 *   Supports success, error, info, and warning types with auto-dismiss.
 */

import { useState, useCallback, createContext, useContext, useRef, useEffect } from 'react';
import styles from '../styles/Toast.module.css';

// ── Context ────────────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

/**
 * Custom hook — call anywhere in the app to show a toast.
 * @returns {{ addToast: (message: string, type?: string, duration?: number) => void }}
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

// ── Icons for each toast type ──────────────────────────────────────────────────
const ICONS = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
};

// ── Single Toast Item ──────────────────────────────────────────────────────────

/**
 * @param {{ id: number, message: string, type: string, onRemove: (id: number) => void }} props
 */
function ToastItem({ id, message, type, onRemove }) {
  const [exiting, setExiting] = useState(false);

  /** Trigger exit animation then call onRemove */
  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onRemove(id), 300);
  }, [id, onRemove]);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${exiting ? styles.exiting : ''}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <span className={styles.icon} aria-hidden="true">
        {ICONS[type] || ICONS.info}
      </span>
      <p className={styles.message}>{message}</p>
      <button
        className={styles.closeBtn}
        onClick={dismiss}
        aria-label="Dismiss notification"
        type="button"
      >
        ✕
      </button>
    </div>
  );
}

// ── Toast Container + Provider ─────────────────────────────────────────────────

/**
 * Wraps the app and provides `addToast()` to all children.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Show a toast notification.
   *
   * @param {string} message  - Text to display
   * @param {'success'|'error'|'info'|'warning'} [type='info'] - Toast style
   * @param {number} [duration=3000] - Auto-dismiss delay in ms (0 = no auto-dismiss)
   */
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        // Trigger exit animation
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        );
        setTimeout(() => removeToast(id), 300);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast portal — always renders at bottom of body */}
      <div
        className={styles.container}
        aria-label="Notifications"
        role="region"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
