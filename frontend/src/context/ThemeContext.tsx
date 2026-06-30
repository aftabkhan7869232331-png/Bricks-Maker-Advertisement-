// ============================================================
// 🎨 Brikes Maker Advertisement - Advance Super v1.0.0
// Advanced Theme System
// File: frontend/src/context/ThemeContext.tsx
// ============================================================

import React, {
  createContext, useContext, useState,
  useEffect, useCallback, useMemo, type ReactNode,
} from 'react';

// ============================================================
// 🎨 THEME DEFINITIONS
// ============================================================

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeName =
  | 'default' | 'midnight' | 'ocean' | 'forest'
  | 'sunset'  | 'rose'     | 'high-contrast' | 'dyslexia';
export type FontFamily = 'inter' | 'roboto' | 'poppins' | 'open-dyslexic';
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type AnimationSpeed = 'none' | 'slow' | 'normal' | 'fast';

export interface ThemeColors {
  primary:     string;
  secondary:   string;
  accent:      string;
  background:  string;
  surface:     string;
  text:        string;
  textMuted:   string;
  border:      string;
  success:     string;
  warning:     string;
  error:       string;
  info:        string;
}

export interface ThemeConfig {
  name:           ThemeName;
  label:          string;
  mode:           ThemeMode;
  colors:         { light: ThemeColors; dark: ThemeColors };
  font:           FontFamily;
  borderRadius:   BorderRadius;
  animationSpeed: AnimationSpeed;
  isAccessibility: boolean;
  description:    string;
}

export interface CustomTheme {
  primary:    string;
  secondary:  string;
  accent:     string;
  font:       FontFamily;
  radius:     BorderRadius;
}

// ============================================================
// 🎨 BUILT-IN THEMES
// ============================================================

const THEMES: Record<ThemeName, ThemeConfig> = {

  default: {
    name: 'default', label: '⚡ Default', mode: 'light',
    isAccessibility: false, animationSpeed: 'normal', font: 'inter', borderRadius: 'md',
    description: 'Clean professional look',
    colors: {
      light: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899',
               background: '#ffffff', surface: '#f8fafc', text: '#0f172a',
               textMuted: '#64748b', border: '#e2e8f0', success: '#22c55e',
               warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' },
      dark:  { primary: '#818cf8', secondary: '#a78bfa', accent: '#f472b6',
               background: '#0f172a', surface: '#1e293b', text: '#f8fafc',
               textMuted: '#94a3b8', border: '#334155', success: '#4ade80',
               warning: '#fbbf24', error: '#f87171', info: '#60a5fa' },
    },
  },

  midnight: {
    name: 'midnight', label: '🌙 Midnight', mode: 'dark',
    isAccessibility: false, animationSpeed: 'normal', font: 'inter', borderRadius: 'lg',
    description: 'Deep dark theme for night owls',
    colors: {
      light: { primary: '#7c3aed', secondary: '#5b21b6', accent: '#c026d3',
               background: '#faf5ff', surface: '#f3e8ff', text: '#1e1b4b',
               textMuted: '#6b7280', border: '#ddd6fe', success: '#16a34a',
               warning: '#d97706', error: '#dc2626', info: '#2563eb' },
      dark:  { primary: '#a78bfa', secondary: '#8b5cf6', accent: '#e879f9',
               background: '#0a0014', surface: '#130027', text: '#ede9fe',
               textMuted: '#a78bfa', border: '#2e1065', success: '#4ade80',
               warning: '#fbbf24', error: '#f87171', info: '#60a5fa' },
    },
  },

  ocean: {
    name: 'ocean', label: '🌊 Ocean', mode: 'light',
    isAccessibility: false, animationSpeed: 'normal', font: 'roboto', borderRadius: 'md',
    description: 'Calm ocean-inspired palette',
    colors: {
      light: { primary: '#0284c7', secondary: '#0369a1', accent: '#06b6d4',
               background: '#f0f9ff', surface: '#e0f2fe', text: '#0c4a6e',
               textMuted: '#0369a1', border: '#bae6fd', success: '#059669',
               warning: '#d97706', error: '#dc2626', info: '#0284c7' },
      dark:  { primary: '#38bdf8', secondary: '#7dd3fc', accent: '#22d3ee',
               background: '#0c1a2e', surface: '#0f2744', text: '#e0f2fe',
               textMuted: '#7dd3fc', border: '#1e4060', success: '#34d399',
               warning: '#fbbf24', error: '#f87171', info: '#38bdf8' },
    },
  },

  forest: {
    name: 'forest', label: '🌿 Forest', mode: 'light',
    isAccessibility: false, animationSpeed: 'slow', font: 'poppins', borderRadius: 'lg',
    description: 'Earthy greens and warm tones',
    colors: {
      light: { primary: '#16a34a', secondary: '#15803d', accent: '#84cc16',
               background: '#f0fdf4', surface: '#dcfce7', text: '#14532d',
               textMuted: '#166534', border: '#bbf7d0', success: '#22c55e',
               warning: '#ca8a04', error: '#dc2626', info: '#0284c7' },
      dark:  { primary: '#4ade80', secondary: '#86efac', accent: '#bef264',
               background: '#071a0d', surface: '#0d2818', text: '#dcfce7',
               textMuted: '#86efac', border: '#14532d', success: '#4ade80',
               warning: '#fbbf24', error: '#f87171', info: '#60a5fa' },
    },
  },

  sunset: {
    name: 'sunset', label: '🌅 Sunset', mode: 'light',
    isAccessibility: false, animationSpeed: 'normal', font: 'poppins', borderRadius: 'full',
    description: 'Warm oranges and golden tones',
    colors: {
      light: { primary: '#ea580c', secondary: '#c2410c', accent: '#f59e0b',
               background: '#fff7ed', surface: '#ffedd5', text: '#431407',
               textMuted: '#9a3412', border: '#fed7aa', success: '#16a34a',
               warning: '#d97706', error: '#dc2626', info: '#0284c7' },
      dark:  { primary: '#fb923c', secondary: '#fdba74', accent: '#fcd34d',
               background: '#1c0a00', surface: '#2d1200', text: '#fff7ed',
               textMuted: '#fdba74', border: '#7c2d12', success: '#4ade80',
               warning: '#fbbf24', error: '#f87171', info: '#60a5fa' },
    },
  },

  rose: {
    name: 'rose', label: '🌹 Rose', mode: 'light',
    isAccessibility: false, animationSpeed: 'fast', font: 'inter', borderRadius: 'full',
    description: 'Elegant pink and rose palette',
    colors: {
      light: { primary: '#e11d48', secondary: '#be123c', accent: '#f43f5e',
               background: '#fff1f2', surface: '#ffe4e6', text: '#4c0519',
               textMuted: '#9f1239', border: '#fecdd3', success: '#16a34a',
               warning: '#d97706', error: '#dc2626', info: '#0284c7' },
      dark:  { primary: '#fb7185', secondary: '#fda4af', accent: '#ff6b81',
               background: '#190008', surface: '#26000e', text: '#fff1f2',
               textMuted: '#fda4af', border: '#4c0519', success: '#4ade80',
               warning: '#fbbf24', error: '#f87171', info: '#60a5fa' },
    },
  },

  'high-contrast': {
    name: 'high-contrast', label: '⬛ High Contrast', mode: 'light',
    isAccessibility: true, animationSpeed: 'none', font: 'inter', borderRadius: 'sm',
    description: 'Maximum contrast for visual accessibility',
    colors: {
      light: { primary: '#000000', secondary: '#1a1a1a', accent: '#0000cc',
               background: '#ffffff', surface: '#f0f0f0', text: '#000000',
               textMuted: '#333333', border: '#000000', success: '#006600',
               warning: '#885500', error: '#cc0000', info: '#0000cc' },
      dark:  { primary: '#ffffff', secondary: '#e0e0e0', accent: '#ffff00',
               background: '#000000', surface: '#0a0a0a', text: '#ffffff',
               textMuted: '#cccccc', border: '#ffffff', success: '#00ff00',
               warning: '#ffff00', error: '#ff4444', info: '#4444ff' },
    },
  },

  dyslexia: {
    name: 'dyslexia', label: '📖 Dyslexia Friendly', mode: 'light',
    isAccessibility: true, animationSpeed: 'none', font: 'open-dyslexic', borderRadius: 'lg',
    description: 'Optimized for dyslexia readability',
    colors: {
      light: { primary: '#4a4a8a', secondary: '#6a6aaa', accent: '#8a4a8a',
               background: '#fefbf0', surface: '#fdf5d5', text: '#1a1a2e',
               textMuted: '#4a4a6a', border: '#d5c8a0', success: '#2d6a2d',
               warning: '#8a6a00', error: '#8a2d2d', info: '#2d2d8a' },
      dark:  { primary: '#9a9aca', secondary: '#babaea', accent: '#ca9aca',
               background: '#1a1a0a', surface: '#2a2a1a', text: '#fefbf0',
               textMuted: '#c0b890', border: '#4a4a2a', success: '#6aaa6a',
               warning: '#caaa2a', error: '#ca6a6a', info: '#6a6aca' },
    },
  },
};

// ============================================================
// 💾 THEME PERSISTENCE
// ============================================================

const STORAGE_KEY = 'brk_theme_prefs';

interface StoredPrefs {
  themeName:      ThemeName;
  mode:           ThemeMode;
  customTheme:    CustomTheme | null;
  scheduledLight: string | null;   // "HH:MM"
  scheduledDark:  string | null;   // "HH:MM"
}

function loadPrefs(): StoredPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredPrefs;
  } catch { /* ignore */ }
  return { themeName: 'default', mode: 'system', customTheme: null,
           scheduledLight: null, scheduledDark: null };
}

function savePrefs(prefs: StoredPrefs): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

// ============================================================
// 🎨 CSS VARIABLE INJECTOR
// ============================================================

function applyThemeToDOM(colors: ThemeColors, radius: BorderRadius, speed: AnimationSpeed, font: FontFamily): void {
  const r = document.documentElement.style;

  // Colors
  Object.entries(colors).forEach(([key, val]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    r.setProperty(`--color-${cssKey}`, val);
  });

  // Border radius
  const radii: Record<BorderRadius, string> = {
    none: '0px', sm: '4px', md: '8px', lg: '16px', full: '9999px',
  };
  r.setProperty('--radius', radii[radius]);
  r.setProperty('--radius-sm', radius === 'full' ? '9999px' : `calc(${radii[radius]} * 0.5)`);
  r.setProperty('--radius-lg', radius === 'full' ? '9999px' : `calc(${radii[radius]} * 2)`);

  // Animation
  const speeds: Record<AnimationSpeed, string> = {
    none: '0ms', slow: '500ms', normal: '200ms', fast: '80ms',
  };
  r.setProperty('--transition-speed', speeds[speed]);

  // Font
  const fonts: Record<FontFamily, string> = {
    inter:          "'Inter', sans-serif",
    roboto:         "'Roboto', sans-serif",
    poppins:        "'Poppins', sans-serif",
    'open-dyslexic':"'OpenDyslexic', sans-serif",
  };
  r.setProperty('--font-family', fonts[font]);
  document.documentElement.style.fontFamily = fonts[font];
}

// ============================================================
// ⚙️  CONTEXT
// ============================================================

interface ThemeContextValue {
  // State
  theme:         ThemeConfig;
  mode:          ThemeMode;
  resolvedMode:  'light' | 'dark';
  activeColors:  ThemeColors;
  customTheme:   CustomTheme | null;

  // Theme switching
  setTheme:      (name: ThemeName) => void;
  setMode:       (mode: ThemeMode) => void;
  toggleMode:    () => void;

  // Custom theme
  applyCustom:   (custom: CustomTheme) => void;
  resetCustom:   () => void;

  // Scheduling
  setSchedule:   (light: string | null, dark: string | null) => void;

  // Utilities
  allThemes:     ThemeConfig[];
  accessibilityThemes: ThemeConfig[];
  previewTheme:  (name: ThemeName) => void;
  stopPreview:   () => void;
  isPreviewActive: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const fallbackThemeValue: ThemeContextValue = {
  theme: THEMES.default,
  mode: 'light',
  resolvedMode: 'light',
  activeColors: THEMES.default.colors.light,
  customTheme: null,
  setTheme: () => {},
  setMode: () => {},
  toggleMode: () => {},
  applyCustom: () => {},
  resetCustom: () => {},
  setSchedule: () => {},
  allThemes: Object.values(THEMES),
  accessibilityThemes: Object.values(THEMES).filter(t => t.isAccessibility),
  previewTheme: () => {},
  stopPreview: () => {},
  isPreviewActive: false,
};

// ============================================================
// 🏗️  PROVIDER
// ============================================================

export function ThemeProvider({ children }: { children: ReactNode }) {
  const prefs = loadPrefs();

  const [themeName,    setThemeName]    = useState<ThemeName>(prefs.themeName);
  const [mode,         setModeState]    = useState<ThemeMode>(prefs.mode);
  const [customTheme,  setCustomTheme]  = useState<CustomTheme | null>(prefs.customTheme);
  const [scheduledL,   setScheduledL]   = useState<string | null>(prefs.scheduledLight);
  const [scheduledD,   setScheduledD]   = useState<string | null>(prefs.scheduledDark);
  const [previewName,  setPreviewName]  = useState<ThemeName | null>(null);

  // Resolve system preference
  const systemDark = useMemo(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    [],
  );

  const resolvedMode: 'light' | 'dark' = useMemo(() => {
    if (mode === 'system') return systemDark ? 'dark' : 'light';
    return mode;
  }, [mode, systemDark]);

  const activeThemeName = previewName ?? themeName;
  const theme = THEMES[activeThemeName];

  // Merge custom overrides into colors
  const activeColors: ThemeColors = useMemo(() => {
    const base = { ...theme.colors[resolvedMode] };
    if (customTheme && !previewName) {
      base.primary   = customTheme.primary;
      base.secondary = customTheme.secondary;
      base.accent    = customTheme.accent;
    }
    return base;
  }, [theme, resolvedMode, customTheme, previewName]);

  // Apply to DOM whenever anything changes
  useEffect(() => {
    applyThemeToDOM(
      activeColors,
      customTheme && !previewName ? customTheme.radius : theme.borderRadius,
      theme.animationSpeed,
      customTheme && !previewName ? customTheme.font : theme.font,
    );
    document.documentElement.setAttribute('data-theme', activeThemeName);
    document.documentElement.classList.toggle('dark', resolvedMode === 'dark');
  }, [activeColors, theme, activeThemeName, resolvedMode, customTheme, previewName]);

  // Listen for system preference changes
  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setModeState('system'); // re-trigger resolution
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  // Scheduled theme switching
  useEffect(() => {
    if (!scheduledL && !scheduledD) return;

    const check = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      if (scheduledL && hhmm === scheduledL) setModeState('light');
      if (scheduledD && hhmm === scheduledD) setModeState('dark');
    };

    const id = setInterval(check, 60_000);
    check();
    return () => clearInterval(id);
  }, [scheduledL, scheduledD]);

  // Persist prefs (but not preview)
  useEffect(() => {
    if (previewName) return;
    savePrefs({ themeName, mode, customTheme,
                scheduledLight: scheduledL, scheduledDark: scheduledD });
  }, [themeName, mode, customTheme, scheduledL, scheduledD, previewName]);

  // ── Actions ────────────────────────────────────────────────

  const setTheme = useCallback((name: ThemeName) => {
    setThemeName(name);
    setPreviewName(null);
  }, []);

  const setMode = useCallback((m: ThemeMode) => setModeState(m), []);

  const toggleMode = useCallback(() => {
    setModeState(prev =>
      prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light',
    );
  }, []);

  const applyCustom = useCallback((custom: CustomTheme) => setCustomTheme(custom), []);
  const resetCustom = useCallback(() => setCustomTheme(null), []);

  const setSchedule = useCallback((light: string | null, dark: string | null) => {
    setScheduledL(light);
    setScheduledD(dark);
  }, []);

  const previewTheme = useCallback((name: ThemeName) => setPreviewName(name), []);
  const stopPreview  = useCallback(() => setPreviewName(null), []);

  // ── Derived lists ──────────────────────────────────────────

  const allThemes            = Object.values(THEMES);
  const accessibilityThemes  = allThemes.filter(t => t.isAccessibility);

  const value: ThemeContextValue = {
    theme, mode, resolvedMode, activeColors, customTheme,
    setTheme, setMode, toggleMode,
    applyCustom, resetCustom,
    setSchedule,
    allThemes, accessibilityThemes,
    previewTheme, stopPreview,
    isPreviewActive: !!previewName,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ============================================================
// 🪝 HOOKS
// ============================================================

/** Main hook — access everything. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  return ctx ?? fallbackThemeValue;
}

/** Lightweight hook — just the active colors. */
export function useColors(): ThemeColors {
  return useTheme().activeColors;
}

/** Lightweight hook — just the resolved mode. */
export function useResolvedMode(): 'light' | 'dark' {
  return useTheme().resolvedMode;
}

export { THEMES };
export default ThemeProvider;
