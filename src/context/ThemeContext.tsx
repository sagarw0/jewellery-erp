import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeId, ThemeConfig, UiDensity } from '../types/erp';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'light-blue': {
    id: 'light-blue',
    name: 'Sapphire Classic Blue',
    subtitle: 'Crisp corporate clarity & modern contrast',
    isDark: false,
    swatchPrimary: '#2563eb',
    swatchSecondary: '#0284c7',
    bgGradient: 'bg-gradient-to-br from-sky-100 via-blue-50 to-slate-100',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200/90',
    cardHover: 'hover:border-blue-400 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-sky-50 text-blue-800 hover:bg-sky-100 border border-sky-200 font-medium',
    accentText: 'text-blue-900',
    badgeBg: 'bg-sky-100 text-blue-900 border-sky-300 font-medium',
    headerBg: 'bg-white/95 border-b border-slate-200',
    appBg: 'bg-slate-50',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    subnavBg: 'bg-slate-100/90 border-b border-slate-200',
    activePill: 'bg-blue-600 text-white font-semibold shadow-xs',
    inputBorder: 'border-slate-300 focus:border-blue-500 focus:ring-blue-200',
    inputBg: 'bg-white text-slate-900',
    tableHeaderBg: 'bg-slate-50 text-slate-700 border-b border-slate-200',
    tableRowHover: 'hover:bg-sky-50/40',
    glassCard: 'bg-white/95 border border-slate-200/90 shadow-xs',
    glassBorder: 'border-slate-200/90',
  },
  'royal-gold': {
    id: 'royal-gold',
    name: 'Royal 24K Gold & Silk Cream',
    subtitle: 'Warm luxury aesthetic tailored for premium showrooms',
    isDark: false,
    swatchPrimary: '#d97706',
    swatchSecondary: '#eab308',
    bgGradient: 'bg-gradient-to-br from-amber-100 via-yellow-50 to-stone-100',
    cardBg: 'bg-white',
    cardBorder: 'border-amber-200/90',
    cardHover: 'hover:border-amber-400 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-300 font-medium',
    accentText: 'text-amber-950',
    badgeBg: 'bg-amber-100 text-amber-950 border-amber-300 font-medium',
    headerBg: 'bg-amber-50/90 border-b border-amber-200',
    appBg: 'bg-amber-50/30',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-600',
    textMuted: 'text-stone-400',
    subnavBg: 'bg-amber-100/60 border-b border-amber-200',
    activePill: 'bg-amber-600 text-white font-semibold shadow-xs',
    inputBorder: 'border-amber-300 focus:border-amber-500 focus:ring-amber-200',
    inputBg: 'bg-white text-stone-900',
    tableHeaderBg: 'bg-amber-50/70 text-amber-950 border-b border-amber-200',
    tableRowHover: 'hover:bg-amber-50/40',
    glassCard: 'bg-white/95 border border-amber-200/90 shadow-xs',
    glassBorder: 'border-amber-200/90',
  },
  'emerald-luxury': {
    id: 'emerald-luxury',
    name: 'Emerald Gemstone & Mint Pearl',
    subtitle: 'Regal gemstone emerald tones with crisp contrast',
    isDark: false,
    swatchPrimary: '#059669',
    swatchSecondary: '#10b981',
    bgGradient: 'bg-gradient-to-br from-emerald-100 via-teal-50 to-slate-100',
    cardBg: 'bg-white',
    cardBorder: 'border-emerald-200/90',
    cardHover: 'hover:border-emerald-400 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100 border border-emerald-300 font-medium',
    accentText: 'text-emerald-950',
    badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-medium',
    headerBg: 'bg-emerald-50/80 border-b border-emerald-200',
    appBg: 'bg-emerald-50/20',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    subnavBg: 'bg-emerald-100/50 border-b border-emerald-200',
    activePill: 'bg-emerald-600 text-white font-semibold shadow-xs',
    inputBorder: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200',
    inputBg: 'bg-white text-slate-900',
    tableHeaderBg: 'bg-emerald-50/60 text-emerald-950 border-b border-emerald-200',
    tableRowHover: 'hover:bg-emerald-50/30',
    glassCard: 'bg-white/95 border border-emerald-200/90 shadow-xs',
    glassBorder: 'border-emerald-200/90',
  },
  'rose-gold': {
    id: 'rose-gold',
    name: 'Rose Gold & Champagne Silk',
    subtitle: 'Blush rose gold with refined warm accents',
    isDark: false,
    swatchPrimary: '#e11d48',
    swatchSecondary: '#fb7185',
    bgGradient: 'bg-gradient-to-br from-rose-100 via-pink-50 to-stone-100',
    cardBg: 'bg-white',
    cardBorder: 'border-rose-200/90',
    cardHover: 'hover:border-rose-400 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-rose-50 text-rose-950 hover:bg-rose-100 border border-rose-300 font-medium',
    accentText: 'text-rose-950',
    badgeBg: 'bg-rose-100 text-rose-950 border-rose-300 font-medium',
    headerBg: 'bg-rose-50/80 border-b border-rose-200',
    appBg: 'bg-rose-50/20',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-600',
    textMuted: 'text-stone-400',
    subnavBg: 'bg-rose-100/50 border-b border-rose-200',
    activePill: 'bg-rose-600 text-white font-semibold shadow-xs',
    inputBorder: 'border-rose-300 focus:border-rose-500 focus:ring-rose-200',
    inputBg: 'bg-white text-stone-900',
    tableHeaderBg: 'bg-rose-50/60 text-rose-950 border-b border-rose-200',
    tableRowHover: 'hover:bg-rose-50/30',
    glassCard: 'bg-white/95 border border-rose-200/90 shadow-xs',
    glassBorder: 'border-rose-200/90',
  },
  'velvet-purple': {
    id: 'velvet-purple',
    name: 'Amethyst Velvet & Lavender',
    subtitle: 'Royal amethyst purple with subtle silver radiance',
    isDark: false,
    swatchPrimary: '#7c3aed',
    swatchSecondary: '#a855f7',
    bgGradient: 'bg-gradient-to-br from-purple-100 via-violet-50 to-slate-100',
    cardBg: 'bg-white',
    cardBorder: 'border-purple-200/90',
    cardHover: 'hover:border-purple-400 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-purple-50 text-purple-950 hover:bg-purple-100 border border-purple-300 font-medium',
    accentText: 'text-purple-950',
    badgeBg: 'bg-purple-100 text-purple-950 border-purple-300 font-medium',
    headerBg: 'bg-purple-50/80 border-b border-purple-200',
    appBg: 'bg-purple-50/20',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    subnavBg: 'bg-purple-100/50 border-b border-purple-200',
    activePill: 'bg-purple-600 text-white font-semibold shadow-xs',
    inputBorder: 'border-purple-300 focus:border-purple-500 focus:ring-purple-200',
    inputBg: 'bg-white text-slate-900',
    tableHeaderBg: 'bg-purple-50/60 text-purple-950 border-b border-purple-200',
    tableRowHover: 'hover:bg-purple-50/30',
    glassCard: 'bg-white/95 border border-purple-200/90 shadow-xs',
    glassBorder: 'border-purple-200/90',
  },
  'platinum-ice': {
    id: 'platinum-ice',
    name: 'Platinum Titanium & Ice Glass',
    subtitle: 'Ultra-modern minimalist monochrome platinum',
    isDark: false,
    swatchPrimary: '#475569',
    swatchSecondary: '#64748b',
    bgGradient: 'bg-gradient-to-br from-slate-200 via-zinc-100 to-slate-100',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-300',
    cardHover: 'hover:border-slate-500 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 font-medium',
    accentText: 'text-slate-900',
    badgeBg: 'bg-slate-200 text-slate-900 border-slate-400 font-medium',
    headerBg: 'bg-slate-100/90 border-b border-slate-300',
    appBg: 'bg-slate-100/70',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    subnavBg: 'bg-slate-200/60 border-b border-slate-300',
    activePill: 'bg-slate-900 text-white font-semibold shadow-xs',
    inputBorder: 'border-slate-400 focus:border-slate-700 focus:ring-slate-300',
    inputBg: 'bg-white text-slate-900',
    tableHeaderBg: 'bg-slate-100 text-slate-800 border-b border-slate-300',
    tableRowHover: 'hover:bg-slate-100',
    glassCard: 'bg-white/95 border border-slate-300 shadow-xs',
    glassBorder: 'border-slate-300',
  },
  'ruby-regal': {
    id: 'ruby-regal',
    name: 'Regal Ruby & Crimson Gold',
    subtitle: 'Deep ceremonial crimson with golden jewel highlights',
    isDark: false,
    swatchPrimary: '#be123c',
    swatchSecondary: '#dc2626',
    bgGradient: 'bg-gradient-to-br from-red-100 via-rose-50 to-amber-50',
    cardBg: 'bg-white',
    cardBorder: 'border-red-200/90',
    cardHover: 'hover:border-red-400 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-800 hover:to-rose-800 text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-red-50 text-red-950 hover:bg-red-100 border border-red-300 font-medium',
    accentText: 'text-red-950',
    badgeBg: 'bg-red-100 text-red-950 border-red-300 font-medium',
    headerBg: 'bg-red-50/80 border-b border-red-200',
    appBg: 'bg-red-50/20',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-600',
    textMuted: 'text-stone-400',
    subnavBg: 'bg-red-100/50 border-b border-red-200',
    activePill: 'bg-red-700 text-white font-semibold shadow-xs',
    inputBorder: 'border-red-300 focus:border-red-500 focus:ring-red-200',
    inputBg: 'bg-white text-stone-900',
    tableHeaderBg: 'bg-red-50/60 text-red-950 border-b border-red-200',
    tableRowHover: 'hover:bg-red-50/30',
    glassCard: 'bg-white/95 border border-red-200/90 shadow-xs',
    glassBorder: 'border-red-200/90',
  },
  'obsidian-velvet': {
    id: 'obsidian-velvet',
    name: 'Obsidian Midnight & Glass White',
    subtitle: 'Ultra-clear frosted glass white with luminous accents & OLED contrast',
    isDark: true,
    swatchPrimary: '#0f172a',
    swatchSecondary: '#f59e0b',
    bgGradient: 'bg-gradient-to-br from-[#070b14] via-[#0b1120] to-[#030712] text-white',
    cardBg: 'bg-white/[0.08] backdrop-blur-xl text-white',
    cardBorder: 'border-white/15',
    cardHover: 'hover:border-white/35 hover:bg-white/[0.12] hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-semibold shadow-xs',
    secondaryBtn: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm font-medium',
    accentText: 'text-amber-300',
    badgeBg: 'bg-white/15 text-white border-white/25 font-semibold backdrop-blur-sm',
    headerBg: 'bg-[#070b14]/90 backdrop-blur-xl border-b border-white/10 text-white',
    appBg: 'bg-[#070b14]',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-200',
    textMuted: 'text-slate-400',
    subnavBg: 'bg-white/[0.04] backdrop-blur-md border-b border-white/10 text-white',
    activePill: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-semibold shadow-xs',
    inputBorder: 'border-white/20 focus:border-amber-400 focus:ring-amber-400/20',
    inputBg: 'bg-white/[0.08] text-white placeholder-slate-400',
    tableHeaderBg: 'bg-white/[0.08] text-slate-200 border-b border-white/15',
    tableRowHover: 'hover:bg-white/[0.06]',
    glassCard: 'bg-white/[0.08] backdrop-blur-xl border border-white/15 shadow-xs text-white',
    glassBorder: 'border-white/15',
  },
  'apple-glass': {
    id: 'apple-glass',
    name: 'Apple iOS Frosted Glass',
    subtitle: 'Ambient gray blur with translucent glass screen surfaces & crisp typography',
    isDark: false,
    swatchPrimary: '#0284c7',
    swatchSecondary: '#38bdf8',
    bgGradient: 'bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200 text-slate-900',
    cardBg: 'bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-sm text-slate-900',
    cardBorder: 'border-slate-200/90',
    cardHover: 'hover:border-sky-400 hover:shadow-md hover:-translate-y-0.5',
    primaryBtn: 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-semibold shadow-xs border border-sky-400 active:scale-[0.98]',
    secondaryBtn: 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 backdrop-blur-md shadow-2xs font-semibold',
    accentText: 'text-sky-950',
    badgeBg: 'bg-sky-100 text-sky-950 border border-sky-300 font-bold backdrop-blur-md',
    headerBg: 'bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 text-slate-900',
    appBg: 'bg-slate-100/70',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    subnavBg: 'bg-slate-100/90 backdrop-blur-xl border-b border-slate-200/90 text-slate-900',
    activePill: 'bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold shadow-xs border border-sky-500',
    inputBorder: 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-300',
    inputBg: 'bg-white text-slate-900 placeholder-slate-400 shadow-inner',
    tableHeaderBg: 'bg-slate-100/90 backdrop-blur-md text-slate-800 border-b border-slate-200/90',
    tableRowHover: 'hover:bg-sky-50/50',
    glassCard: 'bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-sm text-slate-900',
    glassBorder: 'border-slate-200/90',
  },
};

interface ThemeContextType {
  currentTheme: ThemeConfig;
  isDark: boolean;
  density: UiDensity;
  setTheme: (themeId: ThemeId) => void;
  setDensity: (density: UiDensity) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: THEMES['light-blue'],
  isDark: false,
  density: 'comfortable',
  setTheme: () => {},
  setDensity: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    return (localStorage.getItem('swarna_erp_theme') as ThemeId) || 'light-blue';
  });

  const [density, setDensityState] = useState<UiDensity>(() => {
    return (localStorage.getItem('swarna_erp_density') as UiDensity) || 'comfortable';
  });

  const setTheme = (id: ThemeId) => {
    setThemeId(id);
    localStorage.setItem('swarna_erp_theme', id);
  };

  const setDensity = (d: UiDensity) => {
    setDensityState(d);
    localStorage.setItem('swarna_erp_density', d);
  };

  const currentTheme = THEMES[themeId] || THEMES['light-blue'];
  const isDark = !!currentTheme.isDark;

  useEffect(() => {
    // 1. Set standard browser color-scheme on root document to inform OS/Chromium native controls & dropdowns
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

    // 2. Sync theme classes directly on documentElement and body for full OS/browser native control theming
    const allThemeClasses = Object.keys(THEMES).map((k) => `theme-${k}`);
    document.documentElement.classList.remove(...allThemeClasses, 'dark');
    document.body.classList.remove(...allThemeClasses, 'dark');

    document.documentElement.classList.add(`theme-${themeId}`);
    document.body.classList.add(`theme-${themeId}`);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }
  }, [isDark, themeId]);

  return (
    <ThemeContext.Provider value={{ currentTheme, isDark, density, setTheme, setDensity }}>
      <div className={`theme-${themeId} density-${density} ${isDark ? 'dark' : ''} min-h-screen transition-colors duration-200`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
