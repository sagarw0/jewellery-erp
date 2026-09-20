import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ThemeId,
  ThemeConfig,
  UiDensity,
  CustomThemeConfig,
  GlassBlurIntensity,
  CardCornerRadius,
  ShadowGlowDepth,
  CardTextSize,
  CardFontWeight,
  DashboardCardTypographyConfig,
} from '../types/erp';
import {
  computeThemeTokens,
  applyCssTokensToDocument,
  ThemeTokens,
  adjustColorLightness,
} from '../utils/colorUtils';

export type CustomizerTab = 'presets' | 'surface' | 'fine_tune' | 'colors' | 'card_typography';

export const DEFAULT_CARD_TYPOGRAPHY: DashboardCardTypographyConfig = {
  textSize: 'medium',
  fontWeight: 'bold',
  isItalic: false,
  titleColorHex: '',
  valueColorHex: '',
  labelColorHex: '',
};

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
    subtitle: 'Liquid ambient ice glass with crystal clarity, pure white cards & iOS blue',
    isDark: false,
    bgBaseHex: '#b8cadc',
    accentHex: '#007aff',
    swatchPrimary: '#007aff',
    swatchSecondary: '#38bdf8',
  },
  'royal-gold': {
    id: 'royal-gold',
    name: 'Royal 24K Gold & Champagne Silk',
    subtitle: 'Warm luxury aesthetic tailored for premium bullion & bridal showrooms',
    isDark: false,
    bgBaseHex: '#f1e6cd',
    accentHex: '#d97706',
    swatchPrimary: '#d97706',
    swatchSecondary: '#f59e0b',
  },
  'sapphire-glass': {
    id: 'sapphire-glass',
    name: 'Sapphire Ice & Royal Glass',
    subtitle: 'Original executive showroom blue with crystalline contrast & sapphire glow',
    isDark: false,
    bgBaseHex: '#cbd8e8',
    accentHex: '#2563eb',
    swatchPrimary: '#2563eb',
    swatchSecondary: '#0284c7',
  },
  'obsidian-velvet': {
    id: 'obsidian-velvet',
    name: 'Obsidian Midnight OLED Dark',
    subtitle: 'Ultra-clear frosted dark glass with radiant amber gold & OLED contrast',
    isDark: true,
    bgBaseHex: '#070b14',
    accentHex: '#f59e0b',
    swatchPrimary: '#0f172a',
    swatchSecondary: '#f59e0b',
  },
  'custom': {
    id: 'custom',
    name: 'Custom Studio Palette',
    subtitle: 'Personalized background tone, accent color, and fine-tuned brightness',
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
  customizerTab: CustomizerTab;
  setIsCustomizerOpen: (open: boolean) => void;
  setCustomizerTab: (tab: CustomizerTab) => void;
  openCustomizerWithTab: (tab?: CustomizerTab) => void;
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
  // Card Typography Customization
  cardTypography: DashboardCardTypographyConfig;
  updateCardTextSize: (size: CardTextSize) => void;
  updateCardFontWeight: (weight: CardFontWeight) => void;
  updateCardItalic: (isItalic: boolean) => void;
  updateCardTitleColor: (hex: string) => void;
  updateCardValueColor: (hex: string) => void;
  updateCardLabelColor: (hex: string) => void;
  setCardTypographyPreset: (preset: { title?: string; value?: string; label?: string }) => void;
  resetCardTypography: () => void;
}

const DEFAULT_CUSTOM_CONFIG: CustomThemeConfig = {
  presetId: 'apple-glass',
  bgBaseHex: '#b8cadc',
  accentHex: '#007aff',
  brightness: 0,
  glassBlur: 'standard',
  cornerRadius: 'squircle',
  shadowDepth: 'deep',
  cardTypography: DEFAULT_CARD_TYPOGRAPHY,
  isCustom: false,
};

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: THEMES['apple-glass'],
  customConfig: DEFAULT_CUSTOM_CONFIG,
  computedTokens: computeThemeTokens('#b8cadc', '#007aff', 0),
  isDark: false,
  density: 'comfortable',
  isCustomizerOpen: false,
  customizerTab: 'presets',
  setIsCustomizerOpen: () => {},
  setCustomizerTab: () => {},
  openCustomizerWithTab: () => {},
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
  cardTypography: DEFAULT_CARD_TYPOGRAPHY,
  updateCardTextSize: () => {},
  updateCardFontWeight: () => {},
  updateCardItalic: () => {},
  updateCardTitleColor: () => {},
  updateCardValueColor: () => {},
  updateCardLabelColor: () => {},
  setCardTypographyPreset: () => {},
  resetCardTypography: () => {},
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

  // Card Typography state from localStorage
  const [cardTypography, setCardTypography] = useState<DashboardCardTypographyConfig>(() => {
    try {
      const savedTypo = localStorage.getItem('swarna_erp_card_typography');
      if (savedTypo) {
        const parsed = JSON.parse(savedTypo) as DashboardCardTypographyConfig;
        return {
          ...DEFAULT_CARD_TYPOGRAPHY,
          ...parsed,
        };
      }
      if (customConfig.cardTypography) {
        return {
          ...DEFAULT_CARD_TYPOGRAPHY,
          ...customConfig.cardTypography,
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CARD_TYPOGRAPHY;
  });

  const [density, setDensityState] = useState<UiDensity>(() => {
    return (localStorage.getItem('swarna_erp_density') as UiDensity) || 'comfortable';
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerTab, setCustomizerTab] = useState<CustomizerTab>('presets');

  const openCustomizerWithTab = (tab?: CustomizerTab) => {
    if (tab) {
      setCustomizerTab(tab);
    }
    setIsCustomizerOpen(true);
  };

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
    localStorage.setItem(
      'swarna_erp_theme_customizer',
      JSON.stringify({
        ...customConfig,
        cardTypography,
      })
    );
    localStorage.setItem('swarna_erp_card_typography', JSON.stringify(cardTypography));
  }, [customConfig, computedTokens, cardTypography]);

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

  // Card Typography Updaters
  const updateCardTextSize = (size: CardTextSize) => {
    setCardTypography((prev) => ({
      ...prev,
      textSize: size,
    }));
  };

  const updateCardFontWeight = (weight: CardFontWeight) => {
    setCardTypography((prev) => ({
      ...prev,
      fontWeight: weight,
    }));
  };

  const updateCardItalic = (isItalic: boolean) => {
    setCardTypography((prev) => ({
      ...prev,
      isItalic,
    }));
  };

  const updateCardTitleColor = (hex: string) => {
    setCardTypography((prev) => ({
      ...prev,
      titleColorHex: hex,
    }));
  };

  const updateCardValueColor = (hex: string) => {
    setCardTypography((prev) => ({
      ...prev,
      valueColorHex: hex,
    }));
  };

  const updateCardLabelColor = (hex: string) => {
    setCardTypography((prev) => ({
      ...prev,
      labelColorHex: hex,
    }));
  };

  const setCardTypographyPreset = (preset: { title?: string; value?: string; label?: string }) => {
    setCardTypography((prev) => ({
      ...prev,
      titleColorHex: preset.title || '',
      valueColorHex: preset.value || '',
      labelColorHex: preset.label || '',
    }));
  };

  const resetCardTypography = () => {
    setCardTypography(DEFAULT_CARD_TYPOGRAPHY);
    localStorage.removeItem('swarna_erp_card_typography');
  };

  const resetToDefault = () => {
    setCustomConfig(DEFAULT_CUSTOM_CONFIG);
    resetCardTypography();
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
        customizerTab,
        setIsCustomizerOpen,
        setCustomizerTab,
        openCustomizerWithTab,
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
        cardTypography,
        updateCardTextSize,
        updateCardFontWeight,
        updateCardItalic,
        updateCardTitleColor,
        updateCardValueColor,
        updateCardLabelColor,
        setCardTypographyPreset,
        resetCardTypography,
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
