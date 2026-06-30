import React, { createContext, useContext, useState, useEffect } from "react";

export interface ThemeConfig {
  id: string;
  name: string;
  icon: string;
  primary: string;
  hover: string;
  gradient: string;
  btnGradient: string;
  navbarBorder: string;
  navbarActiveBg: string;
  shimmer1: string;
  shimmer2: string;
  shimmer3: string;
  glow: string;
  btnText: string;
  bgBody: string;
  bgElevated: string;
  bgPanel: string;
  bgSurface: string;
  borderSoft: string;
  textBody: string;
  textMuted: string;
  textSubtle: string;
  fontFamily: string;
}

export type ThemeMode = "light" | "dark";

export const THEMES: Record<string, ThemeConfig> = {
  sunrise: {
    id: "sunrise",
    name: "Sunrise",
    icon: "🌅",
    primary:        "#FF7A18",
    hover:          "#FF9A3D",
    gradient:       "linear-gradient(135deg, #FFB347 0%, #FF7A18 48%, #8B5CF6 100%)",
    btnGradient:    "linear-gradient(to right, #FF7A18, #A855F7)",
    navbarBorder:   "rgba(255, 122, 24, 0.28)",
    navbarActiveBg: "rgba(168, 85, 247, 0.14)",
    shimmer1:       "#FFD08A",
    shimmer2:       "#FF7A18",
    shimmer3:       "#A855F7",
    glow:           "rgba(255, 122, 24, 0.42)",
    btnText:        "#FFFFFF",
    bgBody:         "#0B0710",
    bgElevated:     "#15101D",
    bgPanel:        "#1D1429",
    bgSurface:      "#100A17",
    borderSoft:     "rgba(255, 145, 77, 0.20)",
    textBody:       "#FFF8F3",
    textMuted:      "#D8C5DE",
    textSubtle:     "#9B859F",
    fontFamily:     '"Outfit", "Inter", sans-serif',
  },
  black: {
    id: "black",
    name: "Midnight Black",
    icon: "⚫",
    primary:        "#D4D4D8",
    hover:          "#F4F4F5",
    gradient:       "linear-gradient(135deg, #FFFFFF 0%, #A1A1AA 50%, #52525B 100%)",
    btnGradient:    "linear-gradient(to right, #27272A, #52525B)",
    navbarBorder:   "rgba(255, 255, 255, 0.20)",
    navbarActiveBg: "rgba(255, 255, 255, 0.08)",
    shimmer1:       "#FFFFFF",
    shimmer2:       "#A1A1AA",
    shimmer3:       "#52525B",
    glow:           "rgba(255, 255, 255, 0.20)",
    btnText:        "#FFFFFF",
    bgBody:         "#080808",
    bgElevated:     "#111113",
    bgPanel:        "#18181B",
    bgSurface:      "#0C0C0E",
    borderSoft:     "rgba(255, 255, 255, 0.14)",
    textBody:       "#FAFAFA",
    textMuted:      "#C9C9CF",
    textSubtle:     "#8C8C94",
    fontFamily:     '"Space Grotesk", "Inter", sans-serif',
  },
  purple: {
    id: "purple",
    name: "Blue Purple",
    icon: "🔷",
    primary:        "#6366F1",
    hover:          "#8B5CF6",
    gradient:       "linear-gradient(135deg, #38BDF8 0%, #6366F1 48%, #A855F7 100%)",
    btnGradient:    "linear-gradient(to right, #2563EB, #9333EA)",
    navbarBorder:   "rgba(99, 102, 241, 0.28)",
    navbarActiveBg: "rgba(168, 85, 247, 0.13)",
    shimmer1:       "#7DD3FC",
    shimmer2:       "#6366F1",
    shimmer3:       "#C084FC",
    glow:           "rgba(99, 102, 241, 0.45)",
    btnText:        "#FFFFFF",
    bgBody:         "#07040B",
    bgElevated:     "#120B1B",
    bgPanel:        "#1A1027",
    bgSurface:      "#0B0710",
    borderSoft:     "rgba(192, 132, 252, 0.18)",
    textBody:       "#FAF5FF",
    textMuted:      "#D5C3EA",
    textSubtle:     "#9880AE",
    fontFamily:     '"Outfit", "Inter", sans-serif',
  },
  blue: {
    id: "blue",
    name: "Orange Blue",
    icon: "🌊",
    primary:        "#F97316",
    hover:          "#FB923C",
    gradient:       "linear-gradient(135deg, #FDBA74 0%, #F97316 46%, #2563EB 100%)",
    btnGradient:    "linear-gradient(to right, #F97316, #2563EB)",
    navbarBorder:   "rgba(249, 115, 22, 0.26)",
    navbarActiveBg: "rgba(37, 99, 235, 0.13)",
    shimmer1:       "#FED7AA",
    shimmer2:       "#F97316",
    shimmer3:       "#60A5FA",
    glow:           "rgba(37, 99, 235, 0.40)",
    btnText:        "#FFFFFF",
    bgBody:         "#050914",
    bgElevated:     "#0B1220",
    bgPanel:        "#111B2E",
    bgSurface:      "#080E1B",
    borderSoft:     "rgba(96, 165, 250, 0.20)",
    textBody:       "#F0F9FF",
    textMuted:      "#B8D7E8",
    textSubtle:     "#7895A8",
    fontFamily:     '"Space Grotesk", "Inter", sans-serif',
  },
  green: {
    id: "green",
    name: "Emerald Green",
    icon: "🟢",
    primary:        "#34D399",
    hover:          "#10B981",
    gradient:       "linear-gradient(135deg, #A7F3D0 0%, #10B981 50%, #047857 100%)",
    btnGradient:    "linear-gradient(to right, #10B981, #047857)",
    navbarBorder:   "rgba(16, 185, 129, 0.25)",
    navbarActiveBg: "rgba(16, 185, 129, 0.12)",
    shimmer1:       "#A7F3D0",
    shimmer2:       "#10B981",
    shimmer3:       "#047857",
    glow:           "rgba(16, 185, 129, 0.45)",
    btnText:        "#111111",
    bgBody:         "#020604",
    bgElevated:     "#07130E",
    bgPanel:        "#0B1C15",
    bgSurface:      "#040A07",
    borderSoft:     "rgba(52, 211, 153, 0.18)",
    textBody:       "#ECFDF5",
    textMuted:      "#B7DDCF",
    textSubtle:     "#75A08F",
    fontFamily:     '"Space Grotesk", "Inter", sans-serif',
  },
};

interface ThemeContextType {
  theme: string;
  setTheme: (id: string) => void;
  mode: ThemeMode;
  toggleMode: () => void;
  themes: Record<string, ThemeConfig>;
  currentTheme: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("brick-maker-theme");
      if (saved === "gold") return "sunrise";
      return saved && THEMES[saved] ? saved : "sunrise";
    } catch { return "sunrise"; }
  });
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem("brick-maker-theme-mode");
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    } catch { return "dark"; }
  });

  const setTheme = (id: string) => {
    if (THEMES[id]) setThemeState(id);
  };
  const toggleMode = () => setMode((current) => current === "dark" ? "light" : "dark");

  const baseTheme = THEMES[theme] ?? THEMES.sunrise;
  const currentTheme: ThemeConfig = mode === "dark"
    ? baseTheme
    : {
        ...baseTheme,
        bgBody: "#FFF8F2",
        bgElevated: "#FFFFFF",
        bgPanel: "#FFF1E8",
        bgSurface: "#F8F3FF",
        borderSoft: "rgba(109, 40, 217, 0.18)",
        textBody: "#24162B",
        textMuted: "#67556E",
        textSubtle: "#8B7891",
        navbarActiveBg: "rgba(255, 122, 24, 0.10)",
        glow: "rgba(168, 85, 247, 0.24)",
      };

  useEffect(() => {
    const config = currentTheme;
    const root = document.documentElement;

    root.style.setProperty("--primary-color",        config.primary);
    root.style.setProperty("--primary-hover",        config.hover);
    root.style.setProperty("--primary-gradient",     config.gradient);
    root.style.setProperty("--primary-btn-gradient", config.btnGradient);
    root.style.setProperty("--navbar-border",        config.navbarBorder);
    root.style.setProperty("--navbar-active-bg",     config.navbarActiveBg);
    root.style.setProperty("--text-shimmer-color1",  config.shimmer1);
    root.style.setProperty("--text-shimmer-color2",  config.shimmer2);
    root.style.setProperty("--text-shimmer-color3",  config.shimmer3);
    root.style.setProperty("--accent-glow",          config.glow);
    root.style.setProperty("--btn-text",             config.btnText);
    root.style.setProperty("--bg-body",              config.bgBody);
    root.style.setProperty("--bg-elevated",          config.bgElevated);
    root.style.setProperty("--bg-panel",             config.bgPanel);
    root.style.setProperty("--bg-surface",           config.bgSurface);
    root.style.setProperty("--border-soft",          config.borderSoft);
    root.style.setProperty("--text-body",            config.textBody);
    root.style.setProperty("--text-muted",           config.textMuted);
    root.style.setProperty("--text-subtle",          config.textSubtle);
    root.style.setProperty("--font-family-current",  config.fontFamily);

    document.body.style.backgroundColor = config.bgBody;
    document.body.style.color           = config.textBody;
    root.dataset.theme = theme;
    root.dataset.mode = mode;
    root.classList.toggle("dark", mode === "dark");

    try { localStorage.setItem("brick-maker-theme", theme); }
    catch { /* private browsing */ }
    try { localStorage.setItem("brick-maker-theme-mode", mode); }
    catch { /* private browsing */ }
  }, [theme, mode, currentTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, toggleMode, themes: THEMES, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
