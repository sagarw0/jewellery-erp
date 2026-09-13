import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeId, ThemeConfig } from '../types/erp';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'light-blue': {
    id: 'light-blue',
    name: 'Light Sky Blue & White',
    bgGradient: 'bg-gradient-to-br from-sky-100 via-blue-50 to-slate-100',
    cardBg: 'bg-white',
    cardBorder: 'border-sky-200/80',
    primaryBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
    accentText: 'text-blue-900',
    badgeBg: 'bg-sky-100 text-blue-800 border-sky-200',
    headerBg: 'bg-gradient-to-r from-sky-50 via-blue-50/70 to-slate-50',
    appBg: 'bg-slate-100',
    textPrimary: 'text-slate-800',
  },
  'royal-gold': {
    id: 'royal-gold',
    name: 'Royal Gold & Silk Cream',
    bgGradient: 'bg-gradient-to-br from-amber-100 via-yellow-50 to-stone-100',
    cardBg: 'bg-white',
    cardBorder: 'border-amber-300/80',
    primaryBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
    accentText: 'text-amber-900',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    headerBg: 'bg-gradient-to-r from-amber-50 via-yellow-50/70 to-stone-50',
    appBg: 'bg-amber-50/40',
    textPrimary: 'text-slate-900',
  },
  'emerald-luxury': {
    id: 'emerald-luxury',
    name: 'Emerald Green & Pearl',
    bgGradient: 'bg-gradient-to-br from-emerald-100 via-teal-50 to-slate-100',
    cardBg: 'bg-white',
    cardBorder: 'border-emerald-200/80',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    accentText: 'text-emerald-900',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    headerBg: 'bg-gradient-to-r from-emerald-50 via-teal-50/70 to-slate-50',
    appBg: 'bg-emerald-50/30',
    textPrimary: 'text-slate-900',
  },
  'rose-gold': {
    id: 'rose-gold',
    name: 'Rose Gold & Champagne',
    bgGradient: 'bg-gradient-to-br from-rose-100 via-pink-50 to-stone-100',
    cardBg: 'bg-white',
    cardBorder: 'border-rose-200/80',
    primaryBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
    accentText: 'text-rose-900',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
    headerBg: 'bg-gradient-to-r from-rose-50 via-pink-50/70 to-stone-50',
    appBg: 'bg-rose-50/30',
    textPrimary: 'text-slate-900',
  },
  'obsidian-velvet': {
    id: 'obsidian-velvet',
    name: 'Obsidian Velvet Dark',
    bgGradient: 'bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-slate-100',
    cardBg: 'bg-slate-800/90 text-slate-100',
    cardBorder: 'border-slate-700',
    primaryBtn: 'bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold',
    accentText: 'text-amber-400',
    badgeBg: 'bg-slate-700 text-amber-300 border-slate-600',
    headerBg: 'bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 text-slate-100',
    appBg: 'bg-slate-900',
    textPrimary: 'text-slate-100',
  },
};

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (themeId: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: THEMES['light-blue'],
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    return (localStorage.getItem('swarna_erp_theme') as ThemeId) || 'light-blue';
  });

  const setTheme = (id: ThemeId) => {
    setThemeId(id);
    localStorage.setItem('swarna_erp_theme', id);
  };

  const currentTheme = THEMES[themeId] || THEMES['light-blue'];

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      <div className={`theme-${themeId} min-h-screen transition-colors duration-200`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
