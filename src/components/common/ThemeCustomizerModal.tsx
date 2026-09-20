import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Sliders,
  Sun,
  RotateCcw,
  Check,
  X,
  Maximize2,
  Minimize2,
  TrendingUp,
  ShieldCheck,
  Eye,
  Layers,
  Sparkle,
  Zap,
  Box,
  Shapes,
  Flame,
  Diamond,
  Compass,
  Type,
  Italic,
  SlidersHorizontal,
  Coins,
  Wallet,
} from 'lucide-react';
import { useTheme, THEME_PRESETS } from '../../context/ThemeContext';
import {
  ThemeId,
  GlassBlurIntensity,
  CardCornerRadius,
  ShadowGlowDepth,
  CardTextSize,
  CardFontWeight,
} from '../../types/erp';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CARD_TEXT_COLOR_PRESETS = [
  {
    name: 'Theme Auto Default',
    desc: 'High-contrast theme default colors',
    title: '',
    value: '',
    label: '',
    dotColor: '#3b82f6',
  },
  {
    name: 'Pure Obsidian Black',
    desc: 'Deep crisp solid black headers & numbers',
    title: '#0f172a',
    value: '#000000',
    label: '#334155',
    dotColor: '#000000',
  },
  {
    name: 'Royal Bullion 24K Gold',
    desc: 'Rich amber and warm luxury gold tones',
    title: '#92400e',
    value: '#b45309',
    label: '#78350f',
    dotColor: '#d97706',
  },
  {
    name: 'Sapphire & Imperial Navy',
    desc: 'Executive royal navy & cobalt blue',
    title: '#1e3a8a',
    value: '#1d4ed8',
    label: '#1e40af',
    dotColor: '#2563eb',
  },
  {
    name: 'Emerald Gemstone',
    desc: 'Deep forest green luxury jewellery tone',
    title: '#065f46',
    value: '#047857',
    label: '#064e3b',
    dotColor: '#059669',
  },
  {
    name: 'Radiant Amber Glow',
    desc: 'Luminous warm amber numbers (OLED / Dark)',
    title: '#fef3c7',
    value: '#f59e0b',
    label: '#fde68a',
    dotColor: '#f59e0b',
  },
  {
    name: 'Amethyst & Ruby',
    desc: 'Luxury magenta & violet gemstone accents',
    title: '#581c87',
    value: '#7c3aed',
    label: '#6b21a8',
    dotColor: '#7c3aed',
  },
];

const QUICK_BG_SWATCHES = [
  { name: 'Apple Ice Ambient', hex: '#b8cadc' },
  { name: 'Champagne Silk', hex: '#f1e6cd' },
  { name: 'Obsidian OLED Black', hex: '#070b14' },
  { name: 'Pearl Cream', hex: '#faf3ec' },
  { name: 'Titanium Ice', hex: '#dce5ee' },
  { name: 'Sapphire Crystal', hex: '#cbd8e8' },
  { name: 'Midnight Navy', hex: '#0a192f' },
  { name: 'Pure OLED Black', hex: '#000000' },
];

const QUICK_ACCENT_SWATCHES = [
  { name: 'Apple iOS Blue', hex: '#007aff' },
  { name: 'Royal 24K Bullion Gold', hex: '#d97706' },
  { name: 'Luminous Amber Gold', hex: '#f59e0b' },
  { name: 'Diamond Cyan', hex: '#00f2fe' },
  { name: 'Emerald Gemstone', hex: '#059669' },
  { name: 'Imperial Ruby', hex: '#e11d48' },
];

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentTheme,
    customConfig,
    computedTokens,
    isDark,
    density,
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
    customizerTab,
    setCustomizerTab,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'presets' | 'surface' | 'colors' | 'fine_tune' | 'card_typography'>(
    customizerTab || 'presets'
  );
  const [presetCategory, setPresetCategory] = useState<'all' | 'light' | 'dark'>('all');

  // Sync activeTab when customizerTab changes externally
  React.useEffect(() => {
    if (customizerTab) {
      setActiveTab(customizerTab);
    }
  }, [customizerTab]);

  if (!isOpen) return null;

  const allPresetIds = (Object.keys(THEME_PRESETS) as ThemeId[]).filter((id) => id !== 'custom');
  const filteredPresets = allPresetIds.filter((id) => {
    if (presetCategory === 'light') return !THEME_PRESETS[id].isDark;
    if (presetCategory === 'dark') return THEME_PRESETS[id].isDark;
    return true;
  });

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 no-print"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-4xl max-h-[88vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all duration-300 animate-in zoom-in-95 duration-200"
        style={{
          background: computedTokens.appSurface,
          borderColor: computedTokens.appCardBorder,
          color: computedTokens.appTextPrimary,
          boxShadow: computedTokens.appCardShadow,
        }}
      >
        {/* Top Specular Highlight Glow */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${computedTokens.appPrimary} 50%, transparent 100%)`,
          }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-xl shrink-0">
          <div className="flex items-center space-x-3">
            <div
              className="p-2.5 rounded-2xl flex items-center justify-center shadow-md transition-all"
              style={{
                backgroundColor: computedTokens.appPrimary,
                color: computedTokens.appPrimaryText,
              }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base tracking-tight">
                  Global Theme & UI Customizer
                </h3>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border shadow-2xs"
                  style={{
                    backgroundColor: computedTokens.appAccentBg,
                    color: computedTokens.appAccent,
                    borderColor: computedTokens.appAccent,
                  }}
                >
                  {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </span>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-white/15 font-mono">
                  {allPresetIds.length} Luxury Themes
                </span>
              </div>
              <p className="text-xs font-medium opacity-75">
                Modern luxury themes, frosted glass styling, brightness slider & design tokens
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={resetToDefault}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all opacity-80 hover:opacity-100 hover:bg-white/10 border border-transparent hover:border-white/20 cursor-pointer"
              title="Reset all colors and brightness to Apple Glass Default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Default</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-all opacity-70 hover:opacity-100 hover:bg-white/10 cursor-pointer font-bold"
              title="Close Customizer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 pt-3 pb-1 space-x-2 border-b border-white/10 overflow-x-auto text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'presets' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'presets' ? computedTokens.appPrimary : 'transparent',
              color: activeTab === 'presets' ? computedTokens.appPrimaryText : 'inherit',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Theme Presets ({allPresetIds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('surface')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'surface' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'surface' ? computedTokens.appPrimary : 'transparent',
              color: activeTab === 'surface' ? computedTokens.appPrimaryText : 'inherit',
            }}
          >
            <Shapes className="w-3.5 h-3.5" />
            <span>Glass & Surface Physics</span>
          </button>

          <button
            onClick={() => setActiveTab('fine_tune')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'fine_tune' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'fine_tune' ? computedTokens.appPrimary : 'transparent',
              color: activeTab === 'fine_tune' ? computedTokens.appPrimaryText : 'inherit',
            }}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Lightness / Darken Slider</span>
            {customConfig.brightness !== 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-white/20">
                {customConfig.brightness > 0 ? `+${customConfig.brightness}%` : `${customConfig.brightness}%`}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('colors');
              setCustomizerTab('colors');
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'colors' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'colors' ? computedTokens.appPrimary : 'transparent',
              color: activeTab === 'colors' ? computedTokens.appPrimaryText : 'inherit',
            }}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Custom Colors & Accents</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('card_typography');
              setCustomizerTab('card_typography');
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'card_typography' ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'card_typography' ? computedTokens.appPrimary : 'transparent',
              color: activeTab === 'card_typography' ? computedTokens.appPrimaryText : 'inherit',
            }}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Card Typography & Text Styling</span>
            {(cardTypography.textSize !== 'medium' ||
              cardTypography.fontWeight !== 'bold' ||
              cardTypography.isItalic ||
              Boolean(cardTypography.titleColorHex) ||
              Boolean(cardTypography.valueColorHex) ||
              Boolean(cardTypography.labelColorHex)) && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-slate-950 font-bold">
                Custom
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto scrollbar-thin">
          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                  Select Pre-Configured Luxury Theme
                </span>
                {/* Filter Pills */}
                <div className="flex items-center space-x-1 bg-black/10 dark:bg-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => setPresetCategory('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      presetCategory === 'all'
                        ? 'bg-white text-slate-950 shadow-2xs dark:bg-slate-800 dark:text-white'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    All ({allPresetIds.length})
                  </button>
                  <button
                    onClick={() => setPresetCategory('light')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      presetCategory === 'light'
                        ? 'bg-white text-slate-950 shadow-2xs dark:bg-slate-800 dark:text-white'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    ☀️ Light
                  </button>
                  <button
                    onClick={() => setPresetCategory('dark')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      presetCategory === 'dark'
                        ? 'bg-white text-slate-950 shadow-2xs dark:bg-slate-800 dark:text-white'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    🌙 Dark / OLED
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPresets.map((presetId) => {
                  const p = THEME_PRESETS[presetId];
                  const isSelected = customConfig.presetId === presetId && !customConfig.isCustom;

                  return (
                    <button
                      key={presetId}
                      onClick={() => applyPreset(presetId)}
                      className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between h-[112px] ${
                        isSelected
                          ? 'ring-2 shadow-md scale-[1.02]'
                          : 'hover:scale-[1.01] hover:shadow-xs'
                      }`}
                      style={{
                        background: p.isDark ? 'rgba(15, 23, 42, 0.80)' : 'rgba(255, 255, 255, 0.88)',
                        borderColor: isSelected ? p.accentHex : (p.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'),
                      }}
                    >
                      <div className="flex items-start justify-between">
                        {/* Dual Color Swatch Dot */}
                        <div className="flex items-center space-x-1.5">
                          <div
                            className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                            style={{ backgroundColor: p.swatchPrimary }}
                          />
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-white shadow-xs -ml-2"
                            style={{ backgroundColor: p.swatchSecondary }}
                          />
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-white shadow-xs -ml-2 opacity-80"
                            style={{ backgroundColor: p.bgBaseHex }}
                            title="Background tone"
                          />
                        </div>

                        <div className="flex items-center space-x-1">
                          {p.isDark ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/15 text-slate-200">
                              Dark
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                              Light
                            </span>
                          )}
                          {isSelected && (
                            <div
                              className="p-1 rounded-full text-white"
                              style={{ backgroundColor: p.accentHex }}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className={`text-xs font-bold truncate ${p.isDark ? 'text-white' : 'text-slate-900'}`}>
                          {p.name}
                        </div>
                        <div className={`text-[10px] font-medium truncate opacity-70 ${p.isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {p.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SURFACE & GLASS PHYSICS */}
          {activeTab === 'surface' && (
            <div className="space-y-6">
              {/* Glass Blur Intensity */}
              <div
                className="p-5 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: computedTokens.appBorder,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkle className="w-4 h-4 text-sky-400" />
                    <span className="font-bold text-sm">Frosted Glass Blur Intensity</span>
                  </div>
                  <span className="text-xs font-mono font-bold uppercase opacity-80">
                    Blur: {customConfig.glassBlur || 'standard'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {[
                    { id: 'low' as GlassBlurIntensity, label: 'Low Frost (12px)', desc: 'Fast & subtle' },
                    { id: 'standard' as GlassBlurIntensity, label: 'Standard (24px)', desc: 'Apple glass' },
                    { id: 'ultra' as GlassBlurIntensity, label: 'Ultra Frost (36px)', desc: 'Max depth' },
                    { id: 'solid' as GlassBlurIntensity, label: 'Solid Opaque', desc: 'No blur (OLED)' },
                  ].map((item) => {
                    const isSelected = (customConfig.glassBlur || 'standard') === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => updateGlassBlur(item.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected ? 'shadow-md ring-2 scale-[1.02]' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: isSelected ? computedTokens.appPrimary : 'transparent',
                          color: isSelected ? computedTokens.appPrimaryText : 'inherit',
                          borderColor: isSelected ? computedTokens.appPrimary : computedTokens.appBorder,
                        }}
                      >
                        <div className="font-bold text-xs">{item.label}</div>
                        <div className="text-[10px] opacity-75">{item.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Corner Radius & Squircles */}
              <div
                className="p-5 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: computedTokens.appBorder,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Box className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-sm">Card & Container Corner Radius</span>
                  </div>
                  <span className="text-xs font-mono font-bold uppercase opacity-80">
                    Radius: {customConfig.cornerRadius || 'squircle'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {[
                    { id: 'standard' as CardCornerRadius, label: 'Standard (12px)', desc: 'Crisp corporate' },
                    { id: 'squircle' as CardCornerRadius, label: 'Squircle (20px)', desc: 'iOS Apple curve' },
                    { id: 'ultra' as CardCornerRadius, label: 'Ultra Round (28px)', desc: 'Pill capsule' },
                  ].map((item) => {
                    const isSelected = (customConfig.cornerRadius || 'squircle') === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => updateCornerRadius(item.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected ? 'shadow-md ring-2 scale-[1.02]' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: isSelected ? computedTokens.appPrimary : 'transparent',
                          color: isSelected ? computedTokens.appPrimaryText : 'inherit',
                          borderColor: isSelected ? computedTokens.appPrimary : computedTokens.appBorder,
                        }}
                      >
                        <div className="font-bold text-xs">{item.label}</div>
                        <div className="text-[10px] opacity-75">{item.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Glow & Elevation Shadows */}
              <div
                className="p-5 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: computedTokens.appBorder,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm">Glow & Elevation Shadow Depth</span>
                  </div>
                  <span className="text-xs font-mono font-bold uppercase opacity-80">
                    Depth: {customConfig.shadowDepth || 'deep'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {[
                    { id: 'minimal' as ShadowGlowDepth, label: 'Minimalist Flat', desc: 'Subtle clean shadow' },
                    { id: 'deep' as ShadowGlowDepth, label: 'Deep 3D Luxury', desc: 'Floating glass depth' },
                    { id: 'glow' as ShadowGlowDepth, label: 'Ambient Neon Glow', desc: 'Laser jewel aura' },
                  ].map((item) => {
                    const isSelected = (customConfig.shadowDepth || 'deep') === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => updateShadowDepth(item.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected ? 'shadow-md ring-2 scale-[1.02]' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: isSelected ? computedTokens.appPrimary : 'transparent',
                          color: isSelected ? computedTokens.appPrimaryText : 'inherit',
                          borderColor: isSelected ? computedTokens.appPrimary : computedTokens.appBorder,
                        }}
                      >
                        <div className="font-bold text-xs">{item.label}</div>
                        <div className="text-[10px] opacity-75">{item.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINE-TUNING SLIDER */}
          {activeTab === 'fine_tune' && (
            <div className="space-y-6">
              {/* Brightness Adjustment Box */}
              <div
                className="p-5 rounded-2xl border space-y-4"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: computedTokens.appBorder,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-sm">
                      Brightness & Contrast Fine-Tuning
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold border"
                      style={{
                        backgroundColor: computedTokens.appAccentBg,
                        color: computedTokens.appAccent,
                        borderColor: computedTokens.appAccent,
                      }}
                    >
                      {customConfig.brightness > 0
                        ? `+${customConfig.brightness}% Light`
                        : customConfig.brightness < 0
                        ? `${customConfig.brightness}% Dark`
                        : '0% Default Balance'}
                    </span>
                  </div>
                </div>

                <p className="text-xs opacity-75">
                  Dynamically brighten or deepen the application background and surface translucency. Text and border contrast automatically adjust to guarantee maximum readability.
                </p>

                {/* Range Slider */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[11px] font-bold opacity-60">
                    <span>🌑 -50% Ultra Dark</span>
                    <span>⚖️ 0% Normal</span>
                    <span>☀️ +50% Pure Light</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="1"
                    value={customConfig.brightness}
                    onChange={(e) => updateBrightness(parseInt(e.target.value, 10))}
                    className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-slate-300 dark:bg-slate-700 accent-blue-600 transition-all"
                  />
                </div>

                {/* Quick Step Steppers */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-bold opacity-75 mr-1">Quick Steps:</span>
                  {[-30, -20, -10, -5, 0, 5, 10, 20, 30].map((step) => (
                    <button
                      key={step}
                      onClick={() => updateBrightness(step)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        customConfig.brightness === step
                          ? 'shadow-xs font-bold'
                          : 'opacity-70 hover:opacity-100 hover:bg-white/10'
                      }`}
                      style={{
                        backgroundColor: customConfig.brightness === step ? computedTokens.appPrimary : 'transparent',
                        color: customConfig.brightness === step ? computedTokens.appPrimaryText : 'inherit',
                        borderColor: customConfig.brightness === step ? computedTokens.appPrimary : computedTokens.appBorder,
                      }}
                    >
                      {step > 0 ? `+${step}%` : step === 0 ? 'Reset (0%)' : `${step}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* UI Density Switcher */}
              <div
                className="p-5 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: computedTokens.appBorder,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-sm">UI Density & Form Spacing</span>
                  </div>
                  <span className="text-xs font-mono font-bold uppercase opacity-80">
                    Mode: {density}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => setDensity('compact')}
                    className={`p-3 rounded-2xl border flex items-center justify-center space-x-2.5 text-xs font-bold transition-all cursor-pointer ${
                      density === 'compact' ? 'shadow-md ring-2' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: density === 'compact' ? computedTokens.appPrimary : 'transparent',
                      color: density === 'compact' ? computedTokens.appPrimaryText : 'inherit',
                      borderColor: density === 'compact' ? computedTokens.appPrimary : computedTokens.appBorder,
                    }}
                  >
                    <Minimize2 className="w-4 h-4 shrink-0" />
                    <span>Compact POS (Dense Tables)</span>
                  </button>

                  <button
                    onClick={() => setDensity('comfortable')}
                    className={`p-3 rounded-2xl border flex items-center justify-center space-x-2.5 text-xs font-bold transition-all cursor-pointer ${
                      density === 'comfortable' ? 'shadow-md ring-2' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: density === 'comfortable' ? computedTokens.appPrimary : 'transparent',
                      color: density === 'comfortable' ? computedTokens.appPrimaryText : 'inherit',
                      borderColor: density === 'comfortable' ? computedTokens.appPrimary : computedTokens.appBorder,
                    }}
                  >
                    <Maximize2 className="w-4 h-4 shrink-0" />
                    <span>Comfortable Luxury</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Background Color Picker */}
              <div
                className="p-5 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: computedTokens.appBorder,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-sm">Background Screen Tone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={customConfig.bgBaseHex}
                      onChange={(e) => updateBgColor(e.target.value)}
                      className="w-7 h-7 rounded-lg border border-white/30 cursor-pointer overflow-hidden p-0"
                      title="Pick any custom background color"
                    />
                    <span className="font-mono text-xs font-bold opacity-80">
                      {customConfig.bgBaseHex.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {QUICK_BG_SWATCHES.map((swatch) => {
                    const isSelected = customConfig.bgBaseHex.toLowerCase() === swatch.hex.toLowerCase();
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => updateBgColor(swatch.hex)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected ? 'ring-2 shadow-xs scale-105' : 'hover:scale-[1.02]'
                        }`}
                        style={{
                          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
                          borderColor: isSelected ? computedTokens.appPrimary : computedTokens.appBorder,
                        }}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span>{swatch.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent & Dashboard Highlights Picker */}
              <div
                className="p-5 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: computedTokens.appBorder,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-sm">Accent & Brand Color</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={customConfig.accentHex}
                      onChange={(e) => updateAccentColor(e.target.value)}
                      className="w-7 h-7 rounded-lg border border-white/30 cursor-pointer overflow-hidden p-0"
                      title="Pick any custom accent color"
                    />
                    <span className="font-mono text-xs font-bold opacity-80">
                      {customConfig.accentHex.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {QUICK_ACCENT_SWATCHES.map((swatch) => {
                    const isSelected = customConfig.accentHex.toLowerCase() === swatch.hex.toLowerCase();
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => updateAccentColor(swatch.hex)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected ? 'ring-2 shadow-xs scale-105' : 'hover:scale-[1.02]'
                        }`}
                        style={{
                          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)',
                          borderColor: isSelected ? computedTokens.appPrimary : computedTokens.appBorder,
                        }}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span>{swatch.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CARD TYPOGRAPHY & TEXT STYLING */}
          {activeTab === 'card_typography' && (
            <div className="space-y-6">
              {/* Header Box with Quick Reset */}
              <div
                className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: computedTokens.appBorder,
                }}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-500">
                    <Type className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Dashboard Card Typography & Styling</h4>
                    <p className="text-xs opacity-75">
                      Customize text size, font weight boldness, italic accent slant, and title/metric colors across all dashboard cards.
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetCardTypography}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 opacity-80 hover:opacity-100 hover:bg-white/10 shrink-0 cursor-pointer"
                  style={{ borderColor: computedTokens.appBorder }}
                  title="Reset Card Typography back to ERP Defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Typography</span>
                </button>
              </div>

              {/* 1. Quick One-Click Color & Style Presets */}
              <div
                className="p-5 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: computedTokens.appBorder,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-sm">Quick Typography & Color Palettes</span>
                  </div>
                  <span className="text-xs font-mono font-bold opacity-75">
                    {CARD_TEXT_COLOR_PRESETS.length} Curated Presets
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {CARD_TEXT_COLOR_PRESETS.map((preset) => {
                    const isSelected =
                      (cardTypography.titleColorHex || '') === preset.title &&
                      (cardTypography.valueColorHex || '') === preset.value &&
                      (cardTypography.labelColorHex || '') === preset.label;

                    return (
                      <button
                        key={preset.name}
                        onClick={() =>
                          setCardTypographyPreset({
                            title: preset.title,
                            value: preset.value,
                            label: preset.label,
                          })
                        }
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected ? 'shadow-md ring-2 scale-[1.02]' : 'opacity-75 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.9)',
                          borderColor: isSelected ? computedTokens.appPrimary : computedTokens.appBorder,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs shrink-0"
                              style={{ backgroundColor: preset.dotColor }}
                            />
                            <span className="font-bold text-xs truncate">{preset.name}</span>
                          </div>
                          {isSelected && (
                            <div
                              className="p-0.5 rounded-full text-white shrink-0"
                              style={{ backgroundColor: computedTokens.appPrimary }}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] opacity-75 mt-1">{preset.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Text Size Scaling & Font Weight Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Text Size Scaling */}
                <div
                  className="p-5 rounded-2xl border space-y-3"
                  style={{
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                    borderColor: computedTokens.appBorder,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Type className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-sm">Card Text Sizing Scale</span>
                    </div>
                    <span className="text-xs font-mono font-bold uppercase opacity-80">
                      {cardTypography.textSize === 'small'
                        ? '90% (Small)'
                        : cardTypography.textSize === 'large'
                        ? '112% (Large)'
                        : cardTypography.textSize === 'xlarge'
                        ? '125% (X-Large)'
                        : '100% (Standard)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { id: 'small' as CardTextSize, label: 'Small (90%)', sub: 'Compact dense' },
                      { id: 'medium' as CardTextSize, label: 'Standard (100%)', sub: 'ERP Default' },
                      { id: 'large' as CardTextSize, label: 'Large (112%)', sub: 'High visibility' },
                      { id: 'xlarge' as CardTextSize, label: 'Extra Large (125%)', sub: 'Senior / Big display' },
                    ].map((sz) => {
                      const isSelected = (cardTypography.textSize || 'medium') === sz.id;
                      return (
                        <button
                          key={sz.id}
                          onClick={() => updateCardTextSize(sz.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected ? 'shadow-md ring-2 scale-[1.02]' : 'opacity-75 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: isSelected ? computedTokens.appPrimary : 'transparent',
                            color: isSelected ? computedTokens.appPrimaryText : 'inherit',
                            borderColor: isSelected ? computedTokens.appPrimary : computedTokens.appBorder,
                          }}
                        >
                          <div className="font-bold text-xs">{sz.label}</div>
                          <div className="text-[10px] opacity-75">{sz.sub}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Font Weight & Boldness */}
                <div
                  className="p-5 rounded-2xl border space-y-3"
                  style={{
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                    borderColor: computedTokens.appBorder,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-sm">Font Weight & Boldness</span>
                    </div>
                    <span className="text-xs font-mono font-bold uppercase opacity-80">
                      {cardTypography.fontWeight || 'bold'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { id: 'normal' as CardFontWeight, label: 'Regular (400)', sub: 'Light weight' },
                      { id: 'medium' as CardFontWeight, label: 'Medium (500)', sub: 'Balanced crisp' },
                      { id: 'semibold' as CardFontWeight, label: 'Semibold (600)', sub: 'Clean emphasis' },
                      { id: 'bold' as CardFontWeight, label: 'Bold (700)', sub: 'High contrast default' },
                    ].map((wt) => {
                      const isSelected = (cardTypography.fontWeight || 'bold') === wt.id;
                      return (
                        <button
                          key={wt.id}
                          onClick={() => updateCardFontWeight(wt.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected ? 'shadow-md ring-2 scale-[1.02]' : 'opacity-75 hover:opacity-100'
                          }`}
                          style={{
                            backgroundColor: isSelected ? computedTokens.appPrimary : 'transparent',
                            color: isSelected ? computedTokens.appPrimaryText : 'inherit',
                            borderColor: isSelected ? computedTokens.appPrimary : computedTokens.appBorder,
                          }}
                        >
                          <div
                            className={`text-xs ${
                              wt.id === 'normal'
                                ? 'font-normal'
                                : wt.id === 'medium'
                                ? 'font-medium'
                                : wt.id === 'semibold'
                                ? 'font-semibold'
                                : 'font-bold'
                            }`}
                          >
                            {wt.label}
                          </div>
                          <div className="text-[10px] opacity-75">{wt.sub}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. Italic Slant Accent Toggle */}
              <div
                className="p-4 rounded-2xl border flex items-center justify-between"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: computedTokens.appBorder,
                }}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-500">
                    <Italic className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm">Italic Style Slant</span>
                    <p className="text-[11px] opacity-75">
                      Add luxury italic slant to card titles and descriptive accents
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 bg-black/10 dark:bg-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => updateCardItalic(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !cardTypography.isItalic
                        ? 'bg-white text-slate-950 shadow-2xs dark:bg-slate-800 dark:text-white'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    Upright (Normal)
                  </button>
                  <button
                    onClick={() => updateCardItalic(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold italic transition-all cursor-pointer ${
                      cardTypography.isItalic
                        ? 'bg-white text-slate-950 shadow-2xs dark:bg-slate-800 dark:text-white'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    Italic Slant ✨
                  </button>
                </div>
              </div>

              {/* 4. Fine-Tuned Custom Color Pickers */}
              <div
                className="p-5 rounded-2xl border space-y-4"
                style={{
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                  borderColor: computedTokens.appBorder,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-pink-500" />
                    <span className="font-bold text-sm">Fine-Tuned Card Text Colors</span>
                  </div>
                  <span className="text-[11px] font-semibold opacity-70">
                    Pick exact hex or leave empty for theme contrast
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Title Color Picker */}
                  <div className="p-3.5 rounded-xl border bg-black/5 dark:bg-white/5 space-y-2" style={{ borderColor: computedTokens.appBorder }}>
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>Card Title / Headings</span>
                      {cardTypography.titleColorHex && (
                        <button
                          onClick={() => updateCardTitleColor('')}
                          className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={cardTypography.titleColorHex || '#0f172a'}
                        onChange={(e) => updateCardTitleColor(e.target.value)}
                        className="w-7 h-7 rounded-lg border border-white/30 cursor-pointer overflow-hidden p-0"
                        title="Pick title color"
                      />
                      <input
                        type="text"
                        placeholder="Auto (Theme)"
                        value={cardTypography.titleColorHex || ''}
                        onChange={(e) => updateCardTitleColor(e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border bg-white dark:bg-slate-900 border-slate-300 dark:border-white/20 text-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Value / Big Number Color Picker */}
                  <div className="p-3.5 rounded-xl border bg-black/5 dark:bg-white/5 space-y-2" style={{ borderColor: computedTokens.appBorder }}>
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>Metrics / Big Numbers</span>
                      {cardTypography.valueColorHex && (
                        <button
                          onClick={() => updateCardValueColor('')}
                          className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={cardTypography.valueColorHex || '#000000'}
                        onChange={(e) => updateCardValueColor(e.target.value)}
                        className="w-7 h-7 rounded-lg border border-white/30 cursor-pointer overflow-hidden p-0"
                        title="Pick metric value color"
                      />
                      <input
                        type="text"
                        placeholder="Auto (Theme)"
                        value={cardTypography.valueColorHex || ''}
                        onChange={(e) => updateCardValueColor(e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border bg-white dark:bg-slate-900 border-slate-300 dark:border-white/20 text-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Label / Subtitle Color Picker */}
                  <div className="p-3.5 rounded-xl border bg-black/5 dark:bg-white/5 space-y-2" style={{ borderColor: computedTokens.appBorder }}>
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>Subtitles & Badges</span>
                      {cardTypography.labelColorHex && (
                        <button
                          onClick={() => updateCardLabelColor('')}
                          className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={cardTypography.labelColorHex || '#475569'}
                        onChange={(e) => updateCardLabelColor(e.target.value)}
                        className="w-7 h-7 rounded-lg border border-white/30 cursor-pointer overflow-hidden p-0"
                        title="Pick subtitle/label color"
                      />
                      <input
                        type="text"
                        placeholder="Auto (Theme)"
                        value={cardTypography.labelColorHex || ''}
                        onChange={(e) => updateCardLabelColor(e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border bg-white dark:bg-slate-900 border-slate-300 dark:border-white/20 text-slate-950 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Live Interactive Preview of Cards with active Typography */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 opacity-75" />
                  <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                    Live Dashboard Card Typography Preview
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Sample KPI Card */}
                  <div
                    className="p-4 rounded-2xl border backdrop-blur-2xl space-y-3 transition-all duration-200 shadow-sm"
                    style={{
                      background: computedTokens.appSurfaceGlass,
                      borderColor: computedTokens.appCardBorder,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-emerald-600 text-white shadow-2xs">
                          <Wallet className="w-3.5 h-3.5" />
                        </div>
                        <span
                          className={`truncate ${
                            cardTypography.textSize === 'small'
                              ? 'text-[11px]'
                              : cardTypography.textSize === 'large'
                              ? 'text-sm'
                              : cardTypography.textSize === 'xlarge'
                              ? 'text-base'
                              : 'text-xs'
                          } ${
                            cardTypography.fontWeight === 'normal'
                              ? 'font-normal'
                              : cardTypography.fontWeight === 'medium'
                              ? 'font-medium'
                              : cardTypography.fontWeight === 'semibold'
                              ? 'font-semibold'
                              : 'font-bold'
                          } ${cardTypography.isItalic ? 'italic' : ''}`}
                          style={{
                            color: cardTypography.titleColorHex || computedTokens.appTextPrimary,
                          }}
                        >
                          Today's Cash Collection
                        </span>
                      </div>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>

                    <div
                      className={`font-mono ${
                        cardTypography.textSize === 'small'
                          ? 'text-base sm:text-lg'
                          : cardTypography.textSize === 'large'
                          ? 'text-xl sm:text-2xl'
                          : cardTypography.textSize === 'xlarge'
                          ? 'text-2xl sm:text-3xl'
                          : 'text-lg sm:text-xl'
                      } ${
                        cardTypography.fontWeight === 'normal'
                          ? 'font-normal'
                          : cardTypography.fontWeight === 'medium'
                          ? 'font-medium'
                          : cardTypography.fontWeight === 'semibold'
                          ? 'font-semibold'
                          : 'font-bold'
                      }`}
                      style={{
                        color:
                          cardTypography.valueColorHex ||
                          (isDark ? '#6ee7b7' : computedTokens.appTextPrimary),
                      }}
                    >
                      ₹3,15,200
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span
                        className="px-2 py-0.5 rounded font-semibold border"
                        style={{
                          backgroundColor: computedTokens.appAccentBg,
                          color: cardTypography.labelColorHex || computedTokens.appAccent,
                          borderColor: computedTokens.appAccent,
                        }}
                      >
                        Till Reconciled • Verified
                      </span>
                      <span
                        className="font-medium"
                        style={{
                          color: cardTypography.labelColorHex || computedTokens.appTextSecondary,
                        }}
                      >
                        ↑ 12.4% vs yday
                      </span>
                    </div>
                  </div>

                  {/* Sample Bullion Vault Breakdown Card */}
                  <div
                    className="p-4 rounded-2xl border backdrop-blur-2xl space-y-2.5 transition-all duration-200 shadow-sm"
                    style={{
                      background: computedTokens.appSurfaceGlass,
                      borderColor: computedTokens.appCardBorder,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`truncate ${
                          cardTypography.textSize === 'small'
                            ? 'text-[11px]'
                            : cardTypography.textSize === 'large'
                            ? 'text-sm'
                            : cardTypography.textSize === 'xlarge'
                            ? 'text-base'
                            : 'text-xs'
                        } ${
                          cardTypography.fontWeight === 'normal'
                            ? 'font-normal'
                            : cardTypography.fontWeight === 'medium'
                            ? 'font-medium'
                            : cardTypography.fontWeight === 'semibold'
                            ? 'font-semibold'
                            : 'font-bold'
                        } ${cardTypography.isItalic ? 'italic' : ''}`}
                        style={{
                          color: cardTypography.titleColorHex || computedTokens.appTextPrimary,
                        }}
                      >
                        Pure Gold (916 / 999 Vault)
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                        style={{
                          backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7',
                          color: isDark ? '#fcd34d' : '#78350f',
                          borderColor: '#f59e0b',
                        }}
                      >
                        148 Pcs
                      </span>
                    </div>

                    <div
                      className="p-2 rounded-xl border flex items-center justify-between text-xs"
                      style={{
                        backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)',
                        borderColor: computedTokens.appBorder,
                      }}
                    >
                      <span
                        className="font-bold text-[10.5px]"
                        style={{
                          color: cardTypography.labelColorHex || computedTokens.appTextSecondary,
                        }}
                      >
                        Est. Value:
                      </span>
                      <span
                        className={`font-mono ${
                          cardTypography.textSize === 'small'
                            ? 'text-xs font-bold'
                            : cardTypography.textSize === 'large'
                            ? 'text-sm font-bold'
                            : cardTypography.textSize === 'xlarge'
                            ? 'text-base font-bold'
                            : 'text-xs font-bold'
                        } ${
                          cardTypography.fontWeight === 'normal'
                            ? 'font-normal'
                            : cardTypography.fontWeight === 'medium'
                            ? 'font-medium'
                            : cardTypography.fontWeight === 'semibold'
                            ? 'font-semibold'
                            : 'font-bold'
                        }`}
                        style={{
                          color:
                            cardTypography.valueColorHex ||
                            (isDark ? '#fcd34d' : computedTokens.appTextPrimary),
                        }}
                      >
                        ₹98,16,750
                      </span>
                    </div>

                    <div
                      className="space-y-1 font-mono text-xs p-2 rounded-xl border"
                      style={{
                        backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                        borderColor: computedTokens.appBorder,
                      }}
                    >
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span
                          className="font-sans font-bold"
                          style={{
                            color: cardTypography.labelColorHex || computedTokens.appTextSecondary,
                          }}
                        >
                          Fine Metal:
                        </span>
                        <span
                          className="font-bold"
                          style={{
                            color:
                              cardTypography.valueColorHex ||
                              (isDark ? '#fcd34d' : computedTokens.appTextPrimary),
                          }}
                        >
                          1,308.900 g
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LIVE COMPONENT PREVIEW BOX */}
          <div className="pt-2">
            <div className="flex items-center space-x-2 mb-2.5">
              <Eye className="w-4 h-4 opacity-75" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                Real-Time Menu & Component Preview
              </span>
            </div>

            <div
              className="p-4 rounded-2xl border backdrop-blur-2xl space-y-3.5 transition-all duration-300"
              style={{
                background: computedTokens.appSurfaceGlass,
                borderColor: computedTokens.appCardBorder,
                boxShadow: computedTokens.appCardShadow,
              }}
            >
              {/* Sample Subnav Segment */}
              <div
                className="flex items-center p-1 rounded-xl border space-x-1 backdrop-blur-2xl"
                style={{
                  backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
                  borderColor: computedTokens.appBorder,
                }}
              >
                <div
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow-sm"
                  style={{
                    backgroundColor: computedTokens.appPrimary,
                    color: computedTokens.appPrimaryText,
                  }}
                >
                  <Diamond className="w-3.5 h-3.5" />
                  <span>Account Master</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-black/25 text-white font-mono">F8</span>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold opacity-75">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Vendor Master</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-200 dark:bg-white/10 font-mono">F1</span>
                </div>
              </div>

              {/* Sample Metric & Action */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
                    style={{
                      backgroundColor: computedTokens.appPrimary,
                      color: computedTokens.appPrimaryText,
                    }}
                  >
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">22K Gold Bullion Vault</div>
                    <div className="text-[10px] font-semibold opacity-70">
                      ₹7,45,200 • 108.450 g Net
                    </div>
                  </div>
                </div>

                <span
                  className="px-2.5 py-1 rounded-full text-[10.5px] font-bold border"
                  style={{
                    backgroundColor: computedTokens.appAccentBg,
                    color: computedTokens.appAccent,
                    borderColor: computedTokens.appAccent,
                  }}
                >
                  ↑ 14.8% Margin
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  className="w-full py-2 px-3 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
                  style={{
                    backgroundColor: computedTokens.appPrimary,
                    color: computedTokens.appPrimaryText,
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Primary ERP Button</span>
                </button>

                <input
                  type="text"
                  readOnly
                  value="Sample High-Contrast Input"
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold border shadow-inner text-center"
                  style={{
                    backgroundColor: computedTokens.appInputBg,
                    borderColor: computedTokens.appInputBorder,
                    color: computedTokens.appTextPrimary,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 backdrop-blur-xl shrink-0">
          <div className="text-[11px] opacity-70 flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Theme auto-saved to browser localStorage</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center space-x-1.5"
            style={{
              backgroundColor: computedTokens.appPrimary,
              color: computedTokens.appPrimaryText,
            }}
          >
            <span>Apply & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
