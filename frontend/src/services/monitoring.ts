// ============================================================
// 📊 Brikes Maker Advertisement - Advance Super v1.0.0
// Monitoring Service
// File: frontend/src/services/monitoring.ts
// ============================================================

import { getConfig } from '../config/wan21.config';
import { AuditLogger } from './security';

// ============================================================
// 📦 TYPES
// ============================================================

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type EventCategory =
  | 'navigation' | 'user_action' | 'campaign' | 'video'
  | 'auth' | 'api' | 'performance' | 'error' | 'feature';

export interface AppError {
  id:         string;
  message:    string;
  stack?:     string;
  severity:   ErrorSeverity;
  context:    Record<string, unknown>;
  userId?:    string;
  timestamp:  number;
  reported:   boolean;
}

export interface UserEvent {
  id:         string;
  category:   EventCategory;
  action:     string;
  label?:     string;
  value?:     number;
  metadata?:  Record<string, unknown>;
  userId?:    string;
  sessionId:  string;
  timestamp:  number;
}

export interface PerformanceMark {
  name:       string;
  startTime:  number;
  duration:   number;
  type:       'navigation' | 'api_call' | 'render' | 'custom';
  metadata?:  Record<string, unknown>;
}

export interface HealthStatus {
  status:     'healthy' | 'degraded' | 'unhealthy';
  checks:     HealthCheck[];
  checkedAt:  number;
}

export interface HealthCheck {
  name:    string;
  ok:      boolean;
  latency: number;         // ms
  message?: string;
}

// ============================================================
// 🔴 ERROR TRACKER
// ============================================================

class ErrorTracker {
  private static readonly STORAGE_KEY = 'brk_error_log';
  private static readonly MAX_ERRORS  = 100;
  private static queue: AppError[]    = [];

  static capture(
    error: Error | string,
    severity: ErrorSeverity = 'medium',
    context: Record<string, unknown> = {},
    userId?: string,
  ): string {
    const entry: AppError = {
      id:        crypto.randomUUID(),
      message:   typeof error === 'string' ? error : error.message,
      stack:     error instanceof Error ? error.stack : undefined,
      severity,
      context:   { ...context, url: window.location.href, userAgent: navigator.userAgent },
      userId,
      timestamp: Date.now(),
      reported:  false,
    };

    this.queue.push(entry);
    this._persist();

    // Ship critical errors immediately
    if (severity === 'critical') this._ship(entry).catch(() => {});

    console.error(`[ERROR TRACKER] ${severity.toUpperCase()}: ${entry.message}`, entry);
    return entry.id;
  }

  static getErrors(severity?: ErrorSeverity): AppError[] {
    const all = this._load();
    return severity ? all.filter(e => e.severity === severity) : all;
  }

  static clearErrors(): void {
    this.queue = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static async flush(): Promise<void> {
    const unreported = this._load().filter(e => !e.reported);
    for (const entry of unreported) {
      const ok = await this._ship(entry).catch(() => false);
      if (ok) entry.reported = true;
    }
    this._persist();
  }

  private static _persist(): void {
    const all = [...this._load(), ...this.queue]
      .slice(-this.MAX_ERRORS);
    this.queue = [];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
  }

  private static _load(): AppError[] {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]'); }
    catch { return []; }
  }

  private static async _ship(entry: AppError): Promise<boolean> {
    const cfg = getConfig();
    if (!cfg.analytics.errorTracking.enabled) return false;

    try {
      const res = await fetch(`${cfg.api.baseUrl}/monitoring/errors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
        keepalive: true,
      });
      return res.ok;
    } catch { return false; }
  }
}

// ============================================================
// 📈 PERFORMANCE MONITOR
// ============================================================

class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();
  private static log:   PerformanceMark[]   = [];

  /** Start a named timer. */
  static start(name: string): void {
    this.marks.set(name, performance.now());
  }

  /** End timer, record duration, return ms elapsed. */
  static end(
    name: string,
    type: PerformanceMark['type'] = 'custom',
    metadata?: Record<string, unknown>,
  ): number {
    const start = this.marks.get(name);
    if (start === undefined) return -1;

    const duration = performance.now() - start;
    this.marks.delete(name);

    const mark: PerformanceMark = {
      name, startTime: start, duration, type, metadata,
    };
    this.log.push(mark);

    // Warn on slow operations
    const thresholds: Record<PerformanceMark['type'], number> = {
      navigation: 3_000, api_call: 500, render: 100, custom: 1_000,
    };
    if (duration > thresholds[type]) {
      console.warn(`[PERF] Slow ${type}: "${name}" took ${duration.toFixed(1)}ms`);
    }

    return duration;
  }

  /** Wrap an async function with automatic timing. */
  static async measure<T>(
    name: string,
    fn: () => Promise<T>,
    type: PerformanceMark['type'] = 'api_call',
  ): Promise<T> {
    this.start(name);
    try {
      return await fn();
    } finally {
      this.end(name, type);
    }
  }

  /** Observe real browser navigation timings on page load. */
  static observeNavigation(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const nav = entry as PerformanceNavigationTiming;
          this.log.push({
            name:      'page_load',
            startTime: nav.startTime,
            duration:  nav.loadEventEnd - nav.startTime,
            type:      'navigation',
            metadata: {
              dns:     nav.domainLookupEnd - nav.domainLookupStart,
              tcp:     nav.connectEnd - nav.connectStart,
              ttfb:    nav.responseStart - nav.requestStart,
              domLoad: nav.domContentLoadedEventEnd - nav.startTime,
            },
          });
        }
      }
    });
    observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint'] });
  }

  static getLog(type?: PerformanceMark['type']): PerformanceMark[] {
    return type ? this.log.filter(m => m.type === type) : [...this.log];
  }

  static averageDuration(name: string): number {
    const matching = this.log.filter(m => m.name === name);
    if (!matching.length) return -1;
    return matching.reduce((sum, m) => sum + m.duration, 0) / matching.length;
  }

  static clearLog(): void { this.log = []; }
}

// ============================================================
// 🎯 USER EVENT TRACKER
// ============================================================

class EventTracker {
  private static readonly SESSION_KEY = 'brk_session_id';
  private static buffer: UserEvent[]  = [];
  private static flushTimer: ReturnType<typeof setTimeout> | null = null;
  private static readonly FLUSH_INTERVAL = 10_000;   // 10 s
  private static readonly BUFFER_MAX     = 50;

  private static get sessionId(): string {
    let id = sessionStorage.getItem(this.SESSION_KEY);
    if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(this.SESSION_KEY, id); }
    return id;
  }

  static track(
    category: EventCategory,
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, unknown>,
    userId?: string,
  ): void {
    const cfg = getConfig();
    if (!cfg.analytics.enabled) return;
    if (!cfg.analytics.trackingEvents.includes(action) &&
        !cfg.analytics.trackingEvents.includes('*')) return;

    const event: UserEvent = {
      id:        crypto.randomUUID(),
      category, action, label, value, metadata, userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
    };

    this.buffer.push(event);
    if (this.buffer.length >= this.BUFFER_MAX) {
      this._flush();
    } else {
      this._scheduleFlush();
    }
  }

  /** Convenience — track a page view. */
  static page(path: string, userId?: string): void {
    this.track('navigation', 'page_view', path, undefined, {
      referrer: document.referrer, title: document.title,
    }, userId);
  }

  /** Convenience — track a feature usage. */
  static feature(name: string, userId?: string, metadata?: Record<string, unknown>): void {
    this.track('feature', 'feature_used', name, undefined, metadata, userId);
  }

  static async flush(): Promise<void> { await this._flush(); }

  private static _scheduleFlush(): void {
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => { this._flush(); this.flushTimer = null; }, this.FLUSH_INTERVAL);
  }

  private static async _flush(): Promise<void> {
    if (!this.buffer.length) return;
    const batch = this.buffer.splice(0);

    try {
      const cfg = getConfig();
      await fetch(`${cfg.api.baseUrl}/monitoring/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: batch }),
        keepalive: true,
      });
    } catch {
      // Re-add to buffer on failure (best-effort)
      this.buffer.unshift(...batch);
    }
  }
}

// ============================================================
// 💥 CRASH REPORTER
// ============================================================

const CrashReporter = {

  /** Install global unhandled error / promise rejection handlers. */
  install(userId?: string): void {
    window.addEventListener('error', (e) => {
      ErrorTracker.capture(
        e.error ?? new Error(e.message),
        'critical',
        { filename: e.filename, lineno: e.lineno, colno: e.colno },
        userId,
      );
      AuditLogger.log('settings_change', userId ?? null, {
        metadata: { type: 'crash', message: e.message },
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      const err = e.reason instanceof Error
        ? e.reason
        : new Error(String(e.reason));
      ErrorTracker.capture(err, 'high', { type: 'unhandled_promise' }, userId);
    });

    console.info('[CRASH REPORTER] Installed ✅');
  },
};

// ============================================================
// 🏥 HEALTH CHECKER
// ============================================================

const HealthChecker = {

  async run(): Promise<HealthStatus> {
    const checks: HealthCheck[] = await Promise.all([
      this._checkApi(),
      this._checkLocalStorage(),
      this._checkOnline(),
      this._checkAuthToken(),
    ]);

    const allOk = checks.every(c => c.ok);
    const anyDown = checks.filter(c => !c.ok).length > 1;

    return {
      status:    allOk ? 'healthy' : anyDown ? 'unhealthy' : 'degraded',
      checks,
      checkedAt: Date.now(),
    };
  },

  async _checkApi(): Promise<HealthCheck> {
    const start = performance.now();
    try {
      const cfg = getConfig();
      const res = await fetch(`${cfg.api.baseUrl}/health`, {
        signal: AbortSignal.timeout(5_000),
      });
      return { name: 'api', ok: res.ok, latency: performance.now() - start };
    } catch (e) {
      return { name: 'api', ok: false, latency: performance.now() - start,
               message: (e as Error).message };
    }
  },

  _checkLocalStorage(): HealthCheck {
    const start = performance.now();
    try {
      const key = '__brk_health__';
      localStorage.setItem(key, '1');
      localStorage.removeItem(key);
      return { name: 'localStorage', ok: true, latency: performance.now() - start };
    } catch (e) {
      return { name: 'localStorage', ok: false, latency: performance.now() - start,
               message: (e as Error).message };
    }
  },

  _checkOnline(): HealthCheck {
    return { name: 'network', ok: navigator.onLine, latency: 0,
             message: navigator.onLine ? undefined : 'Device is offline' };
  },

  _checkAuthToken(): HealthCheck {
    const token = localStorage.getItem('brk_access_token');
    const expiry = Number(localStorage.getItem('brk_token_expiry') || 0);
    const ok = !!token && Date.now() < expiry;
    return { name: 'auth_token', ok, latency: 0,
             message: ok ? undefined : 'Token missing or expired' };
  },
};

// ============================================================
// 🎛️  MONITORING SERVICE  (unified facade)
// ============================================================

const MonitoringService = {
  errors:      ErrorTracker,
  performance: PerformanceMonitor,
  events:      EventTracker,
  crash:       CrashReporter,
  health:      HealthChecker,

  /** Bootstrap everything in one call (call from main.tsx). */
  init(userId?: string): void {
    CrashReporter.install(userId);
    PerformanceMonitor.observeNavigation();
    EventTracker.page(window.location.pathname, userId);
    console.info('[MONITORING] Initialized ✅');
  },
};

export default MonitoringService;
export {
  ErrorTracker, PerformanceMonitor, EventTracker,
  CrashReporter, HealthChecker,
};
