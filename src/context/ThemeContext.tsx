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
  titleColorHex: '#1E293B',
  valueColorHex: '#1E293B',
  labelColorHex: '#475569',
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
    name: 'Enterprise Clean Light',
    subtitle: 'Standardized enterprise design system with #1D4ED8 brand and solid #FFFFFF cards',
    isDark: false,
    bgBaseHex: '#F8FAFC',
    accentHex: '#1D4ED8',
    swatchPrimary: '#1D4ED8',
    swatchSecondary: '#3B82F6',
  },
  'royal-gold': {
    id: 'royal-gold',
    name: 'Enterprise Clean Light',
    subtitle: 'Standardized enterprise design system with #1D4ED8 brand and solid #FFFFFF cards',
    isDark: false,
    bgBaseHex: '#F8FAFC',
    accentHex: '#1D4ED8',
    swatchPrimary: '#1D4ED8',
    swatchSecondary: '#3B82F6',
  },
  'sapphire-glass': {
    id: 'sapphire-glass',
    name: 'Enterprise Clean Light',
    subtitle: 'Standardized enterprise design system with #1D4ED8 brand and solid #FFFFFF cards',
    isDark: false,
    bgBaseHex: '#F8FAFC',
    accentHex: '#1D4ED8',
    swatchPrimary: '#1D4ED8',
    swatchSecondary: '#3B82F6',
  },
  'obsidian-velvet': {
    id: 'obsidian-velvet',
    name: 'Enterprise Clean Light',
    subtitle: 'Standardized enterprise design system with #1D4ED8 brand and solid #FFFFFF cards',
    isDark: false,
    bgBaseHex: '#F8FAFC',
    accentHex: '#1D4ED8',
    swatchPrimary: '#1D4ED8',
    swatchSecondary: '#3B82F6',
  },
  'custom': {
    id: 'custom',
    name: 'Enterprise Clean Light',
    subtitle: 'Standardized enterprise design system with #1D4ED8 brand and solid #FFFFFF cards',
    isDark: false,
    bgBaseHex: '#F8FAFC',
    accentHex: '#1D4ED8',
    swatchPrimary: '#1D4ED8',
    swatchSecondary: '#3B82F6',
  },
};

export function buildThemeConfig(presetId: ThemeId, tokens: ThemeTokens): ThemeConfig {
  const preset = THEME_PRESETS[presetId] || THEME_PRESETS['apple-glass'];

  return {
    id: presetId,
    name: preset.name,
    subtitle: preset.subtitle,
    isDark: false,
    swatchPrimary: '#1D4ED8',
    swatchSecondary: '#3B82F6',
    bgBaseHex: '#F8FAFC',
    bgGradient: 'bg-slate-50 text-slate-800',
    cardBg: 'bg-white border border-slate-300 text-slate-800 shadow-xs',
    cardBorder: 'border-slate-300',
    cardHover: 'hover:border-blue-700 hover:shadow-xs transition-colors',
    primaryBtn: 'bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-xs active:scale-[0.99] transition-all',
    secondaryBtn: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-medium transition-all',
    accentText: 'text-blue-700 font-bold',
    badgeBg: 'bg-blue-50 text-blue-700 border border-blue-200 font-medium',
    headerBg: 'bg-white border-b border-slate-300 text-slate-800 shadow-xs',
    appBg: '#F8FAFC',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-500',
    subnavBg: 'bg-white border-b border-slate-300 text-slate-700',
    activePill: 'bg-blue-700 text-white font-semibold shadow-xs',
    inputBorder: 'border-slate-300 focus:border-blue-700 focus:ring-1 focus:ring-blue-700',
    inputBg: 'bg-white text-slate-800 placeholder-slate-400',
    tableHeaderBg: 'bg-slate-100 text-slate-700 font-semibold border-b border-slate-300',
    tableRowHover: 'hover:bg-slate-50',
    glassCard: 'bg-white border border-slate-300 text-slate-800 shadow-xs',
    glassBorder: 'border-slate-300',
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
  bgBaseHex: '#F8FAFC',
  accentHex: '#1D4ED8',
  brightness: 0,
  glassBlur: 'solid',
  cornerRadius: 'standard',
  shadowDepth: 'minimal',
  cardTypography: DEFAULT_CARD_TYPOGRAPHY,
  isCustom: false,
};

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: THEMES['apple-glass'],
  customConfig: DEFAULT_CUSTOM_CONFIG,
  computedTokens: computeThemeTokens('#F8FAFC', '#1D4ED8', 0),
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
        className={`density-${density} min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
