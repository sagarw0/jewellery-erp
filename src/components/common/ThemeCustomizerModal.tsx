import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Sliders,
  Sun,
  Moon,
  RotateCcw,
  Check,
  X,
  Maximize2,
  Minimize2,
  TrendingUp,
  ShieldCheck,
  Eye,
  Layers,
} from 'lucide-react';
import { useTheme, THEME_PRESETS } from '../../context/ThemeContext';
import { ThemeId } from '../../types/erp';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_BG_SWATCHES = [
  { name: 'Apple Ice', hex: '#b8cadc', isDark: false },
  { name: 'Sapphire', hex: '#cbd8e8', isDark: false },
  { name: '24K Gold', hex: '#f1e6cd', isDark: false },
  { name: 'Emerald', hex: '#cfeee0', isDark: false },
  { name: 'Rose Gold', hex: '#fce4e8', isDark: false },
  { name: 'Amethyst', hex: '#e9e3f8', isDark: false },
  { name: 'Platinum', hex: '#d8dfe6', isDark: false },
  { name: 'Ruby Silk', hex: '#fbdcdc', isDark: false },
  { name: 'Midnight', hex: '#070b14', isDark: true },
  { name: 'Ocean Navy', hex: '#081326', isDark: true },
  { name: 'OLED Black', hex: '#000000', isDark: true },
];

const QUICK_ACCENT_SWATCHES = [
  { name: 'iOS Blue', hex: '#007aff' },
  { name: 'Royal Gold', hex: '#d97706' },
  { name: 'Gem Emerald', hex: '#059669' },
  { name: 'Rose Ruby', hex: '#e11d48' },
  { name: 'Amethyst', hex: '#7c3aed' },
  { name: 'Cyan Neon', hex: '#06b6d4' },
  { name: 'Topaz Amber', hex: '#f59e0b' },
  { name: 'OLED Gold', hex: '#fbbf24' },
  { name: 'Slate Gray', hex: '#475569' },
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
    resetToDefault,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<'presets' | 'fine_tune' | 'colors'>('presets');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col my-auto transition-all duration-300"
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-xl">
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
                <h3 className="font-extrabold text-base tracking-tight">
                  Global Theme & UI Customizer
                </h3>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs"
                  style={{
                    backgroundColor: computedTokens.appAccentBg,
                    color: computedTokens.appAccent,
                    borderColor: computedTokens.appAccent,
                  }}
                >
                  {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </span>
              </div>
              <p className="text-xs font-medium opacity-75">
                Dynamic design tokens, contrast engine & real-time brightness tuning
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
        <div className="flex items-center px-6 pt-3 pb-1 space-x-2 border-b border-white/10 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'presets'
                ? 'shadow-xs'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'presets' ? computedTokens.appPrimary : 'transparent',
              color: activeTab === 'presets' ? computedTokens.appPrimaryText : 'inherit',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Theme Presets ({Object.keys(THEME_PRESETS).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fine_tune')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'fine_tune'
                ? 'shadow-xs'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'fine_tune' ? computedTokens.appPrimary : 'transparent',
              color: activeTab === 'fine_tune' ? computedTokens.appPrimaryText : 'inherit',
            }}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Lightness & Darken Slider</span>
            {customConfig.brightness !== 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-white/20">
                {customConfig.brightness > 0 ? `+${customConfig.brightness}%` : `${customConfig.brightness}%`}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('colors')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'colors'
                ? 'shadow-xs'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeTab === 'colors' ? computedTokens.appPrimary : 'transparent',
              color: activeTab === 'colors' ? computedTokens.appPrimaryText : 'inherit',
            }}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Custom Colors & Accents</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                  Select Pre-Configured Luxury Palette
                </span>
                <span className="text-xs font-semibold opacity-60">
                  Click any theme to instantly apply
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(Object.keys(THEME_PRESETS) as ThemeId[])
                  .filter((id) => id !== 'custom')
                  .map((presetId) => {
                    const p = THEME_PRESETS[presetId];
                    const isSelected = customConfig.presetId === presetId && !customConfig.isCustom;

                    return (
                      <button
                        key={presetId}
                        onClick={() => applyPreset(presetId)}
                        className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer relative group flex flex-col justify-between h-[108px] ${
                          isSelected
                            ? 'ring-2 shadow-md scale-[1.02]'
                            : 'hover:scale-[1.01] hover:shadow-xs'
                        }`}
                        style={{
                          background: p.isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
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
                          <div className={`text-xs font-black truncate ${p.isDark ? 'text-white' : 'text-slate-900'}`}>
                            {p.name}
                          </div>
                          <div className={`text-[10.5px] font-medium truncate opacity-70 ${p.isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {p.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 2: FINE-TUNING SLIDER */}
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
                    <span className="font-extrabold text-sm">
                      Brightness & Contrast Fine-Tuning
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-mono font-black border"
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
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        customConfig.brightness === step
                          ? 'shadow-xs font-black'
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
                    <span className="font-extrabold text-sm">UI Density & Form Spacing</span>
                  </div>
                  <span className="text-xs font-mono font-bold uppercase opacity-80">
                    Mode: {density}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => setDensity('compact')}
                    className={`p-3 rounded-2xl border flex items-center justify-center space-x-2.5 text-xs font-bold transition-all cursor-pointer ${
                      density === 'compact'
                        ? 'shadow-md ring-2'
                        : 'opacity-70 hover:opacity-100'
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
                      density === 'comfortable'
                        ? 'shadow-md ring-2'
                        : 'opacity-70 hover:opacity-100'
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

          {/* TAB 3: CUSTOM COLORS */}
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
                    <span className="font-extrabold text-sm">Background Screen Tone</span>
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
                          isSelected
                            ? 'ring-2 shadow-xs scale-105'
                            : 'hover:scale-[1.02]'
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
                    <span className="font-extrabold text-sm">Accent & Brand Color</span>
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
                          isSelected
                            ? 'ring-2 shadow-xs scale-105'
                            : 'hover:scale-[1.02]'
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

          {/* LIVE COMPONENT PREVIEW BOX */}
          <div className="pt-2">
            <div className="flex items-center space-x-2 mb-2.5">
              <Eye className="w-4 h-4 opacity-75" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                Real-Time Component Preview
              </span>
            </div>

            <div
              className="p-4 rounded-2xl border backdrop-blur-2xl space-y-3 transition-all duration-300"
              style={{
                background: computedTokens.appSurfaceGlass,
                borderColor: computedTokens.appCardBorder,
                boxShadow: computedTokens.appCardShadow,
              }}
            >
              <div className="flex items-center justify-between">
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
                    <div className="text-xs font-black">22K Gold Bullion Vault</div>
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 backdrop-blur-xl">
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
