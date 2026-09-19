import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ThemeId,
  ThemeConfig,
  UiDensity,
  CustomThemeConfig,
  GlassBlurIntensity,
  CardCornerRadius,
  ShadowGlowDepth,
} from '../types/erp';
import {
  computeThemeTokens,
  applyCssTokensToDocument,
  ThemeTokens,
  adjustColorLightness,
} from '../utils/colorUtils';

export const THEME_PRESETS: Record<ThemeId, {
  id: ThemeId;
  name: string;
  subtitle: string;
  isDark: boolean;
  bgBaseHex: string;
  accentHex: string;
  swatchPrimary: string;
  swatchSecondary: string;
}> = {
  'apple-glass': {
    id: 'apple-glass',
    name: 'Apple iOS Frosted Glass',
    subtitle: 'Liquid ambient glass with frosted clarity & crystal typography',
    isDark: false,
    bgBaseHex: '#b8cadc',
    accentHex: '#007aff',
    swatchPrimary: '#007aff',
    swatchSecondary: '#38bdf8',
  },
  'cyber-diamond': {
    id: 'cyber-diamond',
    name: 'Cyber Diamond & Neon Cyan',
    subtitle: 'Ultra-sleek OLED dark space with radiant diamond cyan laser accents',
    isDark: true,
    bgBaseHex: '#050b14',
    accentHex: '#00f2fe',
    swatchPrimary: '#00f2fe',
    swatchSecondary: '#38bdf8',
  },
  'champagne-pearl': {
    id: 'champagne-pearl',
    name: 'Champagne Pearl & Rose Silk',
    subtitle: 'Ultra-luxe showroom bridal theme with iridescent pearl cream & gold',
    isDark: false,
    bgBaseHex: '#faf3ec',
    accentHex: '#d97706',
    swatchPrimary: '#e6a87c',
    swatchSecondary: '#d97706',
  },
  'titanium-sunset': {
    id: 'titanium-sunset',
    name: 'Titanium Sunset & Coral Gold',
    subtitle: 'California Apple aesthetic with titanium ice & warm coral sunset glow',
    isDark: false,
    bgBaseHex: '#dce5ee',
    accentHex: '#f97316',
    swatchPrimary: '#f97316',
    swatchSecondary: '#fbbf24',
  },
  'emerald-neon': {
    id: 'emerald-neon',
    name: 'Deep Forest & Mint Neon',
    subtitle: 'Rich botanical luxury with electric neon emerald luminescence',
    isDark: true,
    bgBaseHex: '#061a14',
    accentHex: '#10b981',
    swatchPrimary: '#10b981',
    swatchSecondary: '#34d399',
  },
  'cosmic-aurora': {
    id: 'cosmic-aurora',
    name: 'Cosmic Aurora & Nebula Violet',
    subtitle: 'Deep space indigo with dynamic aurora violet & emerald hues',
    isDark: true,
    bgBaseHex: '#0b091a',
    accentHex: '#8b5cf6',
    swatchPrimary: '#8b5cf6',
    swatchSecondary: '#ec4899',
  },
  'nordic-slate': {
    id: 'nordic-slate',
    name: 'Nordic Minimalist Slate & Ice',
    subtitle: 'Scandinavian architectural studio gray with ice blue accents',
    isDark: false,
    bgBaseHex: '#e2e8f0',
    accentHex: '#0284c7',
    swatchPrimary: '#0284c7',
    swatchSecondary: '#475569',
  },
  'mughal-ruby': {
    id: 'mughal-ruby',
    name: 'Imperial Mughal Ruby & Gold',
    subtitle: 'Traditional royal Indian heritage luxury with crimson & antique gold',
    isDark: true,
    bgBaseHex: '#1f0707',
    accentHex: '#e11d48',
    swatchPrimary: '#dc2626',
    swatchSecondary: '#d97706',
  },
  'light-blue': {
    id: 'light-blue',
    name: 'Sapphire Classic Blue',
    subtitle: 'Crisp corporate clarity & modern contrast',
    isDark: false,
    bgBaseHex: '#cbd8e8',
    accentHex: '#2563eb',
    swatchPrimary: '#2563eb',
    swatchSecondary: '#0284c7',
  },
  'royal-gold': {
    id: 'royal-gold',
    name: 'Royal 24K Gold & Champagne',
    subtitle: 'Warm luxury aesthetic tailored for premium bullion showrooms',
    isDark: false,
    bgBaseHex: '#f1e6cd',
    accentHex: '#d97706',
    swatchPrimary: '#d97706',
    swatchSecondary: '#eab308',
  },
  'emerald-luxury': {
    id: 'emerald-luxury',
    name: 'Emerald Gemstone & Pearl',
    subtitle: 'Regal gemstone emerald tones with crisp contrast',
    isDark: false,
    bgBaseHex: '#cfeee0',
    accentHex: '#059669',
    swatchPrimary: '#059669',
    swatchSecondary: '#10b981',
  },
  'rose-gold': {
    id: 'rose-gold',
    name: 'Rose Gold & Champagne Silk',
    subtitle: 'Blush rose gold with refined warm luxury accents',
    isDark: false,
    bgBaseHex: '#fce4e8',
    accentHex: '#e11d48',
    swatchPrimary: '#e11d48',
    swatchSecondary: '#fb7185',
  },
  'velvet-purple': {
    id: 'velvet-purple',
    name: 'Amethyst Velvet & Lavender',
    subtitle: 'Royal amethyst purple with subtle silver radiance',
    isDark: false,
    bgBaseHex: '#e9e3f8',
    accentHex: '#7c3aed',
    swatchPrimary: '#7c3aed',
    swatchSecondary: '#a855f7',
  },
  'platinum-ice': {
    id: 'platinum-ice',
    name: 'Platinum Titanium & Ice Glass',
    subtitle: 'Ultra-modern minimalist monochrome platinum',
    isDark: false,
    bgBaseHex: '#d8dfe6',
    accentHex: '#334155',
    swatchPrimary: '#475569',
    swatchSecondary: '#64748b',
  },
  'ruby-regal': {
    id: 'ruby-regal',
    name: 'Regal Ruby & Crimson Gold',
    subtitle: 'Deep ceremonial crimson with golden jewel highlights',
    isDark: false,
    bgBaseHex: '#fbdcdc',
    accentHex: '#be123c',
    swatchPrimary: '#be123c',
    swatchSecondary: '#dc2626',
  },
  'obsidian-velvet': {
    id: 'obsidian-velvet',
    name: 'Obsidian Midnight & Slate',
    subtitle: 'Ultra-clear frosted glass with luminous gold accents & OLED contrast',
    isDark: true,
    bgBaseHex: '#070b14',
    accentHex: '#f59e0b',
    swatchPrimary: '#0f172a',
    swatchSecondary: '#f59e0b',
  },
  'midnight-blue': {
    id: 'midnight-blue',
    name: 'Midnight Blue Studio',
    subtitle: 'Deep oceanic navy with futuristic cyan luminescence',
    isDark: true,
    bgBaseHex: '#081326',
    accentHex: '#06b6d4',
    swatchPrimary: '#081326',
    swatchSecondary: '#06b6d4',
  },
  'high-contrast': {
    id: 'high-contrast',
    name: 'High Contrast OLED Gold',
    subtitle: 'Pure OLED black, neon gold, and ultra-high legibility typography',
    isDark: true,
    bgBaseHex: '#000000',
    accentHex: '#fbbf24',
    swatchPrimary: '#000000',
    swatchSecondary: '#fbbf24',
  },
  'custom': {
    id: 'custom',
    name: 'Custom Studio Palette',
    subtitle: 'User personalized background, accent, and fine-tuned brightness',
    isDark: false,
    bgBaseHex: '#b8cadc',
    accentHex: '#007aff',
    swatchPrimary: '#007aff',
    swatchSecondary: '#b8cadc',
  },
};

export function buildThemeConfig(presetId: ThemeId, tokens: ThemeTokens): ThemeConfig {
  const preset = THEME_PRESETS[presetId] || THEME_PRESETS['apple-glass'];
  const isDark = tokens.isDark;

  return {
    id: presetId,
    name: preset.name,
    subtitle: preset.subtitle,
    isDark,
    swatchPrimary: preset.swatchPrimary,
    swatchSecondary: preset.swatchSecondary,
    bgBaseHex: preset.bgBaseHex,
    bgGradient: isDark
      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white'
      : 'bg-gradient-to-br from-[#b8cadc] via-[#acc0d8] to-[#c4d2e0] text-slate-950',
    cardBg: isDark
      ? 'bg-white/[0.08] backdrop-blur-xl border border-white/15 text-white'
      : 'bg-white/96 backdrop-blur-2xl border border-white/98 shadow-[0_12px_40px_rgba(15,23,42,0.10)] text-slate-950',
    cardBorder: isDark ? 'border-white/15' : 'border-white/98',
    cardHover: isDark
      ? 'hover:border-white/35 hover:bg-white/[0.12] hover:shadow-xs'
      : 'hover:border-blue-400 hover:shadow-[0_18px_50px_rgba(0,0,0,0.14)] hover:-translate-y-0.5',
    primaryBtn: isDark
      ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-semibold shadow-xs'
      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold shadow-sm border border-blue-400/40 active:scale-[0.98]',
    secondaryBtn: isDark
      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm font-medium'
      : 'bg-white/95 hover:bg-white text-slate-800 border border-slate-200/90 backdrop-blur-md shadow-2xs font-bold',
    accentText: isDark ? 'text-amber-300 font-bold' : 'text-blue-900 font-bold',
    badgeBg: isDark
      ? 'bg-white/15 text-white border-white/25 font-semibold backdrop-blur-sm'
      : 'bg-blue-100 text-blue-950 border border-blue-300 font-bold backdrop-blur-md',
    headerBg: isDark
      ? 'bg-[#070b14]/90 backdrop-blur-xl border-b border-white/10 text-white'
      : 'bg-white/95 backdrop-blur-2xl border-b border-white/90 text-slate-950 shadow-[0_4px_20px_rgba(0,0,0,0.06)]',
    appBg: tokens.appBg,
    textPrimary: isDark ? 'text-white' : 'text-slate-950 font-bold',
    textSecondary: isDark ? 'text-slate-200 font-medium' : 'text-slate-700 font-medium',
    textMuted: isDark ? 'text-slate-400' : 'text-slate-500',
    subnavBg: isDark
      ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 text-white'
      : 'bg-white/90 backdrop-blur-xl border-b border-white/80 text-slate-900',
    activePill: isDark
      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-semibold shadow-xs'
      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xs border border-blue-400/50',
    inputBorder: isDark
      ? 'border-white/20 focus:border-amber-400 focus:ring-amber-400/20'
      : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
    inputBg: isDark
      ? 'bg-white/[0.08] text-white placeholder-slate-400'
      : 'bg-white text-slate-950 placeholder-slate-400 shadow-inner font-medium',
    tableHeaderBg: isDark
      ? 'bg-white/[0.08] text-slate-200 border-b border-white/15'
      : 'bg-slate-100/95 backdrop-blur-md text-slate-900 font-bold border-b border-slate-200',
    tableRowHover: isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-blue-50/70',
    glassCard: isDark
      ? 'bg-white/[0.08] backdrop-blur-xl border border-white/15 shadow-xs text-white'
      : 'bg-white/96 backdrop-blur-2xl border border-white/98 shadow-[0_12px_40px_rgba(15,23,42,0.10)] text-slate-950',
    glassBorder: isDark ? 'border-white/15' : 'border-white/98',
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = Object.keys(THEME_PRESETS).reduce((acc, key) => {
  const p = THEME_PRESETS[key as ThemeId];
  const tokens = computeThemeTokens(p.bgBaseHex, p.accentHex, 0);
  acc[key as ThemeId] = buildThemeConfig(key as ThemeId, tokens);
  return acc;
}, {} as Record<ThemeId, ThemeConfig>);

interface ThemeContextType {
  currentTheme: ThemeConfig;
  customConfig: CustomThemeConfig;
  computedTokens: ThemeTokens;
  isDark: boolean;
  density: UiDensity;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
  setTheme: (themeId: ThemeId) => void;
  setDensity: (density: UiDensity) => void;
  applyPreset: (themeId: ThemeId) => void;
  updateBrightness: (brightness: number) => void;
  updateBgColor: (hex: string) => void;
  updateAccentColor: (hex: string) => void;
  updateGlassBlur: (blur: GlassBlurIntensity) => void;
  updateCornerRadius: (radius: CardCornerRadius) => void;
  updateShadowDepth: (shadow: ShadowGlowDepth) => void;
  resetToDefault: () => void;
}

const DEFAULT_CUSTOM_CONFIG: CustomThemeConfig = {
  presetId: 'apple-glass',
  bgBaseHex: '#b8cadc',
  accentHex: '#007aff',
  brightness: 0,
  glassBlur: 'standard',
  cornerRadius: 'squircle',
  shadowDepth: 'deep',
  isCustom: false,
};

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: THEMES['apple-glass'],
  customConfig: DEFAULT_CUSTOM_CONFIG,
  computedTokens: computeThemeTokens('#b8cadc', '#007aff', 0),
  isDark: false,
  density: 'comfortable',
  isCustomizerOpen: false,
  setIsCustomizerOpen: () => {},
  setTheme: () => {},
  setDensity: () => {},
  applyPreset: () => {},
  updateBrightness: () => {},
  updateBgColor: () => {},
  updateAccentColor: () => {},
  updateGlassBlur: () => {},
  updateCornerRadius: () => {},
  updateShadowDepth: () => {},
  resetToDefault: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initialize Custom Theme Config from localStorage
  const [customConfig, setCustomConfig] = useState<CustomThemeConfig>(() => {
    try {
      const savedConfig = localStorage.getItem('swarna_erp_theme_customizer');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig) as CustomThemeConfig;
        if (parsed.presetId && THEME_PRESETS[parsed.presetId]) {
          return {
            ...DEFAULT_CUSTOM_CONFIG,
            ...parsed,
          };
        }
      }
      const legacyTheme = localStorage.getItem('swarna_erp_theme') as ThemeId;
      if (legacyTheme && THEME_PRESETS[legacyTheme]) {
        const preset = THEME_PRESETS[legacyTheme];
        return {
          ...DEFAULT_CUSTOM_CONFIG,
          presetId: legacyTheme,
          bgBaseHex: preset.bgBaseHex,
          accentHex: preset.accentHex,
          brightness: 0,
          isCustom: false,
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CUSTOM_CONFIG;
  });

  const [density, setDensityState] = useState<UiDensity>(() => {
    return (localStorage.getItem('swarna_erp_density') as UiDensity) || 'comfortable';
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // 2. Dynamically calculate design tokens based on current config
  const computedTokens = computeThemeTokens(
    customConfig.bgBaseHex,
    customConfig.accentHex,
    customConfig.brightness,
    customConfig.glassBlur || 'standard',
    customConfig.cornerRadius || 'squircle',
    customConfig.shadowDepth || 'deep'
  );

  const isDark = computedTokens.isDark;
  const currentTheme = buildThemeConfig(customConfig.presetId, computedTokens);

  // 3. Inject CSS Variables and update DOM attributes on state changes
  useEffect(() => {
    applyCssTokensToDocument(computedTokens);

    // Sync theme classes directly on documentElement and body
    const allThemeClasses = Object.keys(THEME_PRESETS).map((k) => `theme-${k}`);
    document.documentElement.classList.remove(...allThemeClasses);
    document.body.classList.remove(...allThemeClasses);

    const activeThemeClass = `theme-${customConfig.presetId}`;
    document.documentElement.classList.add(activeThemeClass);
    document.body.classList.add(activeThemeClass);

    // Save to localStorage
    localStorage.setItem('swarna_erp_theme', customConfig.presetId);
    localStorage.setItem('swarna_erp_theme_customizer', JSON.stringify(customConfig));
  }, [customConfig, computedTokens]);

  const setDensity = (d: UiDensity) => {
    setDensityState(d);
    localStorage.setItem('swarna_erp_density', d);
  };

  const applyPreset = (id: ThemeId) => {
    const preset = THEME_PRESETS[id] || THEME_PRESETS['apple-glass'];
    setCustomConfig((prev) => ({
      ...prev,
      presetId: id,
      bgBaseHex: preset.bgBaseHex,
      accentHex: preset.accentHex,
      brightness: 0,
      isCustom: false,
    }));
  };

  const setTheme = (id: ThemeId) => {
    applyPreset(id);
  };

  const updateBrightness = (delta: number) => {
    const clamped = Math.max(-50, Math.min(50, Math.round(delta)));
    setCustomConfig((prev) => ({
      ...prev,
      brightness: clamped,
      isCustom: true,
      presetId: prev.presetId === 'apple-glass' && clamped === 0 ? 'apple-glass' : 'custom',
    }));
  };

  const updateBgColor = (hex: string) => {
    setCustomConfig((prev) => ({
      ...prev,
      bgBaseHex: hex,
      isCustom: true,
      presetId: 'custom',
    }));
  };

  const updateAccentColor = (hex: string) => {
    setCustomConfig((prev) => ({
      ...prev,
      accentHex: hex,
      isCustom: true,
      presetId: 'custom',
    }));
  };

  const updateGlassBlur = (blur: GlassBlurIntensity) => {
    setCustomConfig((prev) => ({
      ...prev,
      glassBlur: blur,
      isCustom: true,
    }));
  };

  const updateCornerRadius = (radius: CardCornerRadius) => {
    setCustomConfig((prev) => ({
      ...prev,
      cornerRadius: radius,
      isCustom: true,
    }));
  };

  const updateShadowDepth = (shadow: ShadowGlowDepth) => {
    setCustomConfig((prev) => ({
      ...prev,
      shadowDepth: shadow,
      isCustom: true,
    }));
  };

  const resetToDefault = () => {
    setCustomConfig(DEFAULT_CUSTOM_CONFIG);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        customConfig,
        computedTokens,
        isDark,
        density,
        isCustomizerOpen,
        setIsCustomizerOpen,
        setTheme,
        setDensity,
        applyPreset,
        updateBrightness,
        updateBgColor,
        updateAccentColor,
        updateGlassBlur,
        updateCornerRadius,
        updateShadowDepth,
        resetToDefault,
      }}
    >
      <div
        className={`theme-${customConfig.presetId} density-${density} ${
          isDark ? 'dark' : ''
        } min-h-screen transition-colors duration-200`}
        style={{
          background: 'var(--color-bg-gradient)',
          color: 'var(--color-text-primary)',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
