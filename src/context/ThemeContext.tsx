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
    bgGradient: 'bg-gradient-to-br from-sky-200/90 via-blue-100 to-slate-200',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-300',
    cardHover: 'hover:border-blue-400 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-sky-50 text-blue-800 hover:bg-sky-100 border border-sky-200 font-medium',
    accentText: 'text-blue-900',
    badgeBg: 'bg-sky-100 text-blue-900 border-sky-300 font-medium',
    headerBg: 'bg-white/95 border-b border-slate-200',
    appBg: 'bg-slate-200/70',
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
    bgGradient: 'bg-gradient-to-br from-amber-200/90 via-yellow-100 to-stone-200',
    cardBg: 'bg-white',
    cardBorder: 'border-amber-300',
    cardHover: 'hover:border-amber-400 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-300 font-medium',
    accentText: 'text-amber-950',
    badgeBg: 'bg-amber-100 text-amber-950 border-amber-300 font-medium',
    headerBg: 'bg-amber-50/90 border-b border-amber-200',
    appBg: 'bg-amber-100/50',
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
    bgGradient: 'bg-gradient-to-br from-emerald-200/90 via-teal-100 to-slate-200',
    cardBg: 'bg-white',
    cardBorder: 'border-emerald-300',
    cardHover: 'hover:border-emerald-400 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100 border border-emerald-300 font-medium',
    accentText: 'text-emerald-950',
    badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-medium',
    headerBg: 'bg-emerald-50/80 border-b border-emerald-200',
    appBg: 'bg-emerald-100/40',
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
    bgGradient: 'bg-gradient-to-br from-rose-200/90 via-pink-100 to-stone-200',
    cardBg: 'bg-white',
    cardBorder: 'border-rose-300',
    cardHover: 'hover:border-rose-400 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-rose-50 text-rose-950 hover:bg-rose-100 border border-rose-300 font-medium',
    accentText: 'text-rose-950',
    badgeBg: 'bg-rose-100 text-rose-950 border-rose-300 font-medium',
    headerBg: 'bg-rose-50/80 border-b border-rose-200',
    appBg: 'bg-rose-100/40',
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
    bgGradient: 'bg-gradient-to-br from-purple-200/90 via-violet-100 to-slate-200',
    cardBg: 'bg-white',
    cardBorder: 'border-purple-300',
    cardHover: 'hover:border-purple-400 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-purple-50 text-purple-950 hover:bg-purple-100 border border-purple-300 font-medium',
    accentText: 'text-purple-950',
    badgeBg: 'bg-purple-100 text-purple-950 border-purple-300 font-medium',
    headerBg: 'bg-purple-50/80 border-b border-purple-200',
    appBg: 'bg-purple-100/40',
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
    bgGradient: 'bg-gradient-to-br from-slate-300 via-gray-200 to-zinc-300',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-300',
    cardHover: 'hover:border-slate-500 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 font-medium',
    accentText: 'text-slate-900',
    badgeBg: 'bg-slate-200 text-slate-900 border-slate-400 font-medium',
    headerBg: 'bg-slate-100/90 border-b border-slate-300',
    appBg: 'bg-slate-300/60',
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
    bgGradient: 'bg-gradient-to-br from-red-200/90 via-rose-100 to-amber-100',
    cardBg: 'bg-white',
    cardBorder: 'border-red-300',
    cardHover: 'hover:border-red-400 hover:shadow-xs',
    primaryBtn: 'bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-800 hover:to-rose-800 text-white font-semibold shadow-xs',
    secondaryBtn: 'bg-red-50 text-red-950 hover:bg-red-100 border border-red-300 font-medium',
    accentText: 'text-red-950',
    badgeBg: 'bg-red-100 text-red-950 border-red-300 font-medium',
    headerBg: 'bg-red-50/80 border-b border-red-200',
    appBg: 'bg-red-100/40',
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
    subtitle: 'Liquid ambient glass with iOS frosted surfaces & crystal typography',
    isDark: false,
    swatchPrimary: '#007aff',
    swatchSecondary: '#38bdf8',
    bgGradient: 'bg-gradient-to-br from-[#b8cadc] via-[#acc0d8] to-[#c4d2e0] text-slate-950',
    cardBg: 'bg-white/96 backdrop-blur-2xl border border-white/98 shadow-[0_12px_40px_rgba(15,23,42,0.10)] text-slate-950',
    cardBorder: 'border-white/98',
    cardHover: 'hover:border-blue-400 hover:shadow-[0_18px_50px_rgba(0,0,0,0.14)] hover:-translate-y-0.5',
    primaryBtn: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold shadow-sm border border-blue-400/40 active:scale-[0.98]',
    secondaryBtn: 'bg-white/95 hover:bg-white text-slate-800 border border-slate-200/90 backdrop-blur-md shadow-2xs font-bold',
    accentText: 'text-blue-900 font-bold',
    badgeBg: 'bg-blue-100 text-blue-950 border border-blue-300 font-bold backdrop-blur-md',
    headerBg: 'bg-white/95 backdrop-blur-2xl border-b border-white/90 text-slate-950 shadow-[0_4px_20px_rgba(0,0,0,0.06)]',
    appBg: 'bg-[#b8cadc]',
    textPrimary: 'text-slate-950 font-bold',
    textSecondary: 'text-slate-700 font-medium',
    textMuted: 'text-slate-500',
    subnavBg: 'bg-white/92 backdrop-blur-xl border-b border-white/90 text-slate-900',
    activePill: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xs border border-blue-400/50',
    inputBorder: 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
    inputBg: 'bg-white text-slate-950 placeholder-slate-400 shadow-inner font-medium',
    tableHeaderBg: 'bg-slate-100/95 backdrop-blur-md text-slate-900 font-bold border-b border-slate-200',
    tableRowHover: 'hover:bg-blue-50/70',
    glassCard: 'bg-white/96 backdrop-blur-2xl border border-white/98 shadow-[0_12px_40px_rgba(15,23,42,0.10)] text-slate-950',
    glassBorder: 'border-white/98',
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
    const saved = localStorage.getItem('swarna_erp_theme') as ThemeId;
    if (saved && THEMES[saved]) {
      return saved;
    }
    return 'light-blue';
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
