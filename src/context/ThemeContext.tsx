import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeId, ThemeConfig, UiDensity } from '../types/erp';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'light-blue': {
    id: 'light-blue',
    name: 'Sapphire Classic Blue',
    subtitle: 'Crisp corporate clarity & modern contrast',
    swatchPrimary: '#2563eb',
    swatchSecondary: '#0284c7',
    bgGradient: 'bg-gradient-to-br from-sky-100 via-blue-50 to-slate-100',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200/90',
    cardHover: 'hover:border-blue-400 hover:shadow-md',
    primaryBtn: 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-xs',
    secondaryBtn: 'bg-sky-50 text-blue-800 hover:bg-sky-100 border border-sky-200',
    accentText: 'text-blue-900',
    badgeBg: 'bg-sky-100 text-blue-900 border-sky-300',
    headerBg: 'bg-white/95 border-b border-slate-200',
    appBg: 'bg-slate-50',
    textPrimary: 'text-slate-800',
    subnavBg: 'bg-slate-100/90 border-b border-slate-200',
    activePill: 'bg-blue-600 text-white font-bold shadow-xs',
    inputBorder: 'border-slate-300 focus:border-blue-500 focus:ring-blue-200',
  },
  'royal-gold': {
    id: 'royal-gold',
    name: 'Royal 24K Gold & Silk Cream',
    subtitle: 'Warm luxury aesthetic tailored for premium showrooms',
    swatchPrimary: '#d97706',
    swatchSecondary: '#eab308',
    bgGradient: 'bg-gradient-to-br from-amber-100 via-yellow-50 to-stone-100',
    cardBg: 'bg-white',
    cardBorder: 'border-amber-200/90',
    cardHover: 'hover:border-amber-400 hover:shadow-md',
    primaryBtn: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-700 hover:to-yellow-700 text-white shadow-xs',
    secondaryBtn: 'bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-300',
    accentText: 'text-amber-950',
    badgeBg: 'bg-amber-100 text-amber-950 border-amber-300 font-bold',
    headerBg: 'bg-amber-50/90 border-b border-amber-200',
    appBg: 'bg-amber-50/30',
    textPrimary: 'text-stone-900',
    subnavBg: 'bg-amber-100/60 border-b border-amber-200',
    activePill: 'bg-amber-600 text-white font-bold shadow-xs',
    inputBorder: 'border-amber-300 focus:border-amber-500 focus:ring-amber-200',
  },
  'emerald-luxury': {
    id: 'emerald-luxury',
    name: 'Emerald Gemstone & Mint Pearl',
    subtitle: 'Regal gemstone emerald tones with crisp contrast',
    swatchPrimary: '#059669',
    swatchSecondary: '#10b981',
    bgGradient: 'bg-gradient-to-br from-emerald-100 via-teal-50 to-slate-100',
    cardBg: 'bg-white',
    cardBorder: 'border-emerald-200/90',
    cardHover: 'hover:border-emerald-400 hover:shadow-md',
    primaryBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xs',
    secondaryBtn: 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100 border border-emerald-300',
    accentText: 'text-emerald-950',
    badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold',
    headerBg: 'bg-emerald-50/80 border-b border-emerald-200',
    appBg: 'bg-emerald-50/20',
    textPrimary: 'text-slate-900',
    subnavBg: 'bg-emerald-100/50 border-b border-emerald-200',
    activePill: 'bg-emerald-600 text-white font-bold shadow-xs',
    inputBorder: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200',
  },
  'rose-gold': {
    id: 'rose-gold',
    name: 'Rose Gold & Champagne Silk',
    subtitle: 'Blush rose gold with refined warm accents',
    swatchPrimary: '#e11d48',
    swatchSecondary: '#fb7185',
    bgGradient: 'bg-gradient-to-br from-rose-100 via-pink-50 to-stone-100',
    cardBg: 'bg-white',
    cardBorder: 'border-rose-200/90',
    cardHover: 'hover:border-rose-400 hover:shadow-md',
    primaryBtn: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-xs',
    secondaryBtn: 'bg-rose-50 text-rose-950 hover:bg-rose-100 border border-rose-300',
    accentText: 'text-rose-950',
    badgeBg: 'bg-rose-100 text-rose-950 border-rose-300 font-bold',
    headerBg: 'bg-rose-50/80 border-b border-rose-200',
    appBg: 'bg-rose-50/20',
    textPrimary: 'text-stone-900',
    subnavBg: 'bg-rose-100/50 border-b border-rose-200',
    activePill: 'bg-rose-600 text-white font-bold shadow-xs',
    inputBorder: 'border-rose-300 focus:border-rose-500 focus:ring-rose-200',
  },
  'velvet-purple': {
    id: 'velvet-purple',
    name: 'Amethyst Velvet & Lavender',
    subtitle: 'Royal amethyst purple with subtle silver radiance',
    swatchPrimary: '#7c3aed',
    swatchSecondary: '#a855f7',
    bgGradient: 'bg-gradient-to-br from-purple-100 via-violet-50 to-slate-100',
    cardBg: 'bg-white',
    cardBorder: 'border-purple-200/90',
    cardHover: 'hover:border-purple-400 hover:shadow-md',
    primaryBtn: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xs',
    secondaryBtn: 'bg-purple-50 text-purple-950 hover:bg-purple-100 border border-purple-300',
    accentText: 'text-purple-950',
    badgeBg: 'bg-purple-100 text-purple-950 border-purple-300 font-bold',
    headerBg: 'bg-purple-50/80 border-b border-purple-200',
    appBg: 'bg-purple-50/20',
    textPrimary: 'text-slate-900',
    subnavBg: 'bg-purple-100/50 border-b border-purple-200',
    activePill: 'bg-purple-600 text-white font-bold shadow-xs',
    inputBorder: 'border-purple-300 focus:border-purple-500 focus:ring-purple-200',
  },
  'platinum-ice': {
    id: 'platinum-ice',
    name: 'Platinum Titanium & Ice Glass',
    subtitle: 'Ultra-modern minimalist monochrome platinum',
    swatchPrimary: '#475569',
    swatchSecondary: '#64748b',
    bgGradient: 'bg-gradient-to-br from-slate-200 via-zinc-100 to-slate-100',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-300',
    cardHover: 'hover:border-slate-500 hover:shadow-md',
    primaryBtn: 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white shadow-xs',
    secondaryBtn: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300',
    accentText: 'text-slate-900',
    badgeBg: 'bg-slate-200 text-slate-900 border-slate-400 font-bold',
    headerBg: 'bg-slate-100/90 border-b border-slate-300',
    appBg: 'bg-slate-100/70',
    textPrimary: 'text-slate-900',
    subnavBg: 'bg-slate-200/60 border-b border-slate-300',
    activePill: 'bg-slate-900 text-white font-bold shadow-xs',
    inputBorder: 'border-slate-400 focus:border-slate-700 focus:ring-slate-300',
  },
  'ruby-regal': {
    id: 'ruby-regal',
    name: 'Regal Ruby & Crimson Gold',
    subtitle: 'Deep ceremonial crimson with golden jewel highlights',
    swatchPrimary: '#be123c',
    swatchSecondary: '#dc2626',
    bgGradient: 'bg-gradient-to-br from-red-100 via-rose-50 to-amber-50',
    cardBg: 'bg-white',
    cardBorder: 'border-red-200/90',
    cardHover: 'hover:border-red-400 hover:shadow-md',
    primaryBtn: 'bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-800 hover:to-rose-800 text-white shadow-xs',
    secondaryBtn: 'bg-red-50 text-red-950 hover:bg-red-100 border border-red-300',
    accentText: 'text-red-950',
    badgeBg: 'bg-red-100 text-red-950 border-red-300 font-bold',
    headerBg: 'bg-red-50/80 border-b border-red-200',
    appBg: 'bg-red-50/20',
    textPrimary: 'text-stone-900',
    subnavBg: 'bg-red-100/50 border-b border-red-200',
    activePill: 'bg-red-700 text-white font-bold shadow-xs',
    inputBorder: 'border-red-300 focus:border-red-500 focus:ring-red-200',
  },
  'obsidian-velvet': {
    id: 'obsidian-velvet',
    name: 'Obsidian Midnight & Gold Leaf',
    subtitle: 'High-contrast dark OLED mode with glowing gold accents',
    swatchPrimary: '#0f172a',
    swatchSecondary: '#f59e0b',
    bgGradient: 'bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-slate-100',
    cardBg: 'bg-slate-900/95 text-slate-100',
    cardBorder: 'border-slate-800',
    cardHover: 'hover:border-amber-500/50 hover:shadow-lg hover:shadow-black/50',
    primaryBtn: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold shadow-xs',
    secondaryBtn: 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700',
    accentText: 'text-amber-400',
    badgeBg: 'bg-slate-800 text-amber-300 border-amber-500/30 font-bold',
    headerBg: 'bg-slate-950/95 border-b border-slate-800 text-slate-100',
    appBg: 'bg-slate-950',
    textPrimary: 'text-slate-100',
    subnavBg: 'bg-slate-900 border-b border-slate-800',
    activePill: 'bg-amber-500 text-slate-950 font-extrabold shadow-xs',
    inputBorder: 'border-slate-700 focus:border-amber-500 focus:ring-amber-500/20',
  },
};

interface ThemeContextType {
  currentTheme: ThemeConfig;
  density: UiDensity;
  setTheme: (themeId: ThemeId) => void;
  setDensity: (density: UiDensity) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: THEMES['light-blue'],
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

  return (
    <ThemeContext.Provider value={{ currentTheme, density, setTheme, setDensity }}>
      <div className={`theme-${themeId} density-${density} min-h-screen transition-colors duration-200`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

