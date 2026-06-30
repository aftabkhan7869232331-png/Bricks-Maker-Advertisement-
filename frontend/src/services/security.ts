// ============================================================
// 🛡️  Brikes Maker Advertisement - Advance Super v1.0.0
// Security Service
// File: frontend/src/services/security.ts
// ============================================================

import { getConfig } from '../config/wan21.config';

// ============================================================
// 🔑 ENCRYPTION  (AES-GCM via Web Crypto API)
// ============================================================

const Encryption = {

  /** Derive a CryptoKey from the app's VITE_ENCRYPTION_KEY env var. */
  async _deriveKey(): Promise<CryptoKey> {
    const rawKey = getConfig().security.encryptionKey;
    if (!rawKey) throw new Error('VITE_ENCRYPTION_KEY is not set');

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(rawKey.slice(0, 32).padEnd(32, '0')),
      'PBKDF2',
      false,
      ['deriveKey'],
    );

    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: new TextEncoder().encode('brk_salt_v1'), iterations: 100_000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
  },

  /** Encrypt a string → Base64 ciphertext (IV prepended). */
  async encrypt(plaintext: string): Promise<string> {
    const key = await this._deriveKey();
    const iv  = crypto.getRandomValues(new Uint8Array(12));
    const enc = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(plaintext),
    );

    // Combine iv (12 bytes) + ciphertext → Base64
    const combined = new Uint8Array(iv.length + enc.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(enc), iv.length);
    return btoa(String.fromCharCode(...combined));
  },

  /** Decrypt a Base64 ciphertext (IV prepended) → plaintext. */
  async decrypt(ciphertext: string): Promise<string> {
    const key  = await this._deriveKey();
    const data = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const iv   = data.slice(0, 12);
    const enc  = data.slice(12);

    const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, enc);
    return new TextDecoder().decode(dec);
  },

  /** HMAC-SHA256 signature for a message. Returns Base64. */
  async sign(message: string): Promise<string> {
    const rawKey = getConfig().security.encryptionKey;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(rawKey.slice(0, 32).padEnd(32, '0')),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
    return btoa(String.fromCharCode(...new Uint8Array(sig)));
  },

  /** Verify an HMAC-SHA256 signature. */
  async verify(message: string, signature: string): Promise<boolean> {
    try {
      const expected = await this.sign(message);
      return expected === signature;
    } catch { return false; }
  },
};

// ============================================================
// 🚧 XSS / INPUT SANITIZATION
// ============================================================

const Sanitizer = {

  /** Strip HTML tags — use before rendering untrusted strings in the DOM. */
  stripHtml(input: string): string {
    return input.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
  },

  /** Escape HTML entities to prevent XSS. */
  escapeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /** Remove SQL-injection-style characters (extra defense for query params). */
  sanitizeSql(input: string): string {
    return input.replace(/['";\\]/g, '').trim();
  },

  /** Sanitize a URL — allow only http(s) and relative paths. */
  sanitizeUrl(url: string): string {
    try {
      const parsed = new URL(url, window.location.origin);
      if (!['http:', 'https:'].includes(parsed.protocol)) return '#';
      return parsed.href;
    } catch { return '#'; }
  },

  /** Deep-sanitize all string values in an object. */
  sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k,
        typeof v === 'string' ? this.escapeHtml(v)
          : v && typeof v === 'object' ? this.sanitizeObject(v as Record<string, unknown>)
          : v,
      ]),
    ) as T;
  },
};

// ============================================================
// 🔒 CSRF TOKEN MANAGEMENT
// ============================================================

const CSRF = {
  TOKEN_KEY: 'brk_csrf_token',

  generate(): string {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    sessionStorage.setItem(this.TOKEN_KEY, token);
    return token;
  },

  get(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  },

  validate(incoming: string): boolean {
    const stored = this.get();
    if (!stored || !incoming) return false;
    // Constant-time comparison
    if (stored.length !== incoming.length) return false;
    let diff = 0;
    for (let i = 0; i < stored.length; i++) diff |= stored.charCodeAt(i) ^ incoming.charCodeAt(i);
    return diff === 0;
  },

  getHeader(): Record<string, string> {
    const token = this.get() ?? this.generate();
    return { 'X-CSRF-Token': token };
  },
};

// ============================================================
// ⏱️  RATE LIMITER  (client-side sliding-window)
// ============================================================

class RateLimiter {
  private calls: number[] = [];
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit?: number, windowMs = 60_000) {
    this.limit    = limit ?? getConfig().security.rateLimitPerMinute;
    this.windowMs = windowMs;
  }

  /** Returns true if the call is allowed, false if rate-limited. */
  allow(): boolean {
    const now  = Date.now();
    this.calls = this.calls.filter(t => now - t < this.windowMs);
    if (this.calls.length >= this.limit) return false;
    this.calls.push(now);
    return true;
  }

  remaining(): number {
    const now = Date.now();
    this.calls = this.calls.filter(t => now - t < this.windowMs);
    return Math.max(0, this.limit - this.calls.length);
  }

  reset(): void { this.calls = []; }
}

// ============================================================
// 📋 AUDIT LOGGER
// ============================================================

type AuditAction =
  | 'login' | 'logout' | 'oauth_login'
  | 'campaign_create' | 'campaign_update' | 'campaign_delete' | 'campaign_publish'
  | 'api_key_create' | 'api_key_revoke'
  | '2fa_enable' | '2fa_disable'
  | 'export_start' | 'settings_change';

interface AuditEntry {
  id: string;
  action: AuditAction;
  userId: string | null;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
  ipHint?: string;            // last octet masked for privacy
  userAgent: string;
}

const AuditLogger = {
  STORAGE_KEY: 'brk_audit_log',
  MAX_ENTRIES: 200,

  log(action: AuditAction, userId: string | null, extra?: Partial<AuditEntry>): void {
    const entry: AuditEntry = {
      id:        crypto.randomUUID(),
      action,
      userId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      ...extra,
    };

    const log = this._load();
    log.unshift(entry);
    if (log.length > this.MAX_ENTRIES) log.splice(this.MAX_ENTRIES);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(log));

    if (getConfig().analytics.enabled) {
      console.info(`[AUDIT] ${action}`, entry);
    }

    // Also send to backend (best-effort, don't block)
    this._ship(entry).catch(() => {});
  },

  getLog(limit = 50): AuditEntry[] {
    return this._load().slice(0, limit);
  },

  clearLog(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  _load(): AuditEntry[] {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]'); }
    catch { return []; }
  },

  async _ship(entry: AuditEntry): Promise<void> {
    const { baseUrl, endpoints } = getConfig().api;
    await fetch(`${baseUrl}${endpoints.users}/audit`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(entry),
      keepalive: true,   // survives page unload
    });
  },
};

// ============================================================
// 🛡️  SECURITY HEADERS HELPER  (for Vite dev-server middleware)
// ============================================================

const SecurityHeaders = {
  /** Returns recommended HTTP security headers as a plain object. */
  getHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options':    'nosniff',
      'X-Frame-Options':           'DENY',
      'X-XSS-Protection':          '1; mode=block',
      'Referrer-Policy':           'strict-origin-when-cross-origin',
      'Permissions-Policy':        'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy':   [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",  // tighten in production
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self' https://api.brikesmaker.com",
        "frame-ancestors 'none'",
      ].join('; '),
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    };
  },

  /** Apply headers to a fetch Response (for service-worker use). */
  apply(response: Response): Response {
    const headers = new Headers(response.headers);
    Object.entries(this.getHeaders())
      .forEach(([k, v]) => headers.set(k, String(v)));
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};

// ============================================================
// 🏷️  COMPLIANCE VALIDATOR
// ============================================================

const Compliance = {

  /** Check GDPR consent is stored before tracking. */
  hasGDPRConsent(): boolean {
    return localStorage.getItem('brk_gdpr_consent') === 'true';
  },

  grantGDPRConsent(): void {
    localStorage.setItem('brk_gdpr_consent', 'true');
    localStorage.setItem('brk_gdpr_consent_date', new Date().toISOString());
  },

  revokeGDPRConsent(): void {
    ['brk_gdpr_consent', 'brk_gdpr_consent_date'].forEach(k => localStorage.removeItem(k));
  },

  /** Anonymize a ProUser object for logging / analytics. */
  anonymize<T extends { email?: string; firstName?: string; lastName?: string; id?: string }>(user: T): T {
    return {
      ...user,
      email:     user.email     ? `${user.email.slice(0, 2)}***@***.***` : undefined,
      firstName: user.firstName ? `${user.firstName[0]}***` : undefined,
      lastName:  user.lastName  ? `${user.lastName[0]}***`  : undefined,
    };
  },

  /** Run all compliance checks; returns list of failures. */
  runChecks(): string[] {
    const issues: string[] = [];
    const cfg = getConfig();

    if (cfg.app.environment === 'production') {
      if (!cfg.security.requireHttps)             issues.push('HTTPS is required in production');
      if (!cfg.security.csrfEnabled)              issues.push('CSRF protection must be enabled');
      if (!cfg.security.encryptionKey)            issues.push('Encryption key is missing');
      if (!this.hasGDPRConsent())                 issues.push('GDPR consent not recorded');
      if (cfg.security.corsAllowedOrigins.includes('*'))
                                                  issues.push('Wildcard CORS origin is not allowed in production');
    }
    return issues;
  },
};

// ============================================================
// 📤 EXPORTS
// ============================================================

export const SecurityService = {
  encryption:    Encryption,
  sanitizer:     Sanitizer,
  csrf:          CSRF,
  audit:         AuditLogger,
  headers:       SecurityHeaders,
  compliance:    Compliance,
  RateLimiter,
};

export default SecurityService;
export { Encryption, Sanitizer, CSRF, RateLimiter, AuditLogger, SecurityHeaders, Compliance };
