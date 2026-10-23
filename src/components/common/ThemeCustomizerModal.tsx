import React from 'react';
import {
  Palette,
  Check,
  X,
  ShieldCheck,
  Sliders,
  Sparkles,
  Layers,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme, MODERN_DARK_ACCENTS, ModernDarkAccentId } from '../../context/ThemeContext';
import { UiDensity } from '../../types/erp';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { density, setDensity, resetToDefault, themeMode, setThemeMode, modernDarkAccent, setModernDarkAccent, isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className={`w-full max-w-lg rounded-xl border overflow-hidden animate-in zoom-in-95 duration-150 shadow-2xl transition-all ${
        isDark ? 'bg-[#181C20] border-[#2E363D] text-white' : 'bg-white border-slate-300 text-slate-800'
      }`}>
        {/* Header */}
        <div className={`px-5 py-4 flex items-center justify-between shadow-xs ${
          isDark ? 'bg-[#13171A] text-white border-b border-[#23282D]' : 'bg-blue-700 text-white'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-[#E879F9]/20 text-[#E879F9]' : 'bg-white/20 text-white'}`}>
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">Enterprise Design System</h2>
              <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-blue-100'}`}>
                Switch Theme & Adjust Display Density
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/20'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-5 text-xs">
          {/* Theme Selector Section */}
          <div className="space-y-2">
            <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Select Interface Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Existing Theme Card */}
              <button
                type="button"
                onClick={() => setThemeMode('existing')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  themeMode === 'existing'
                    ? 'border-blue-700 bg-blue-50/50 shadow-xs ring-2 ring-blue-700/20'
                    : isDark ? 'border-[#2E363D] bg-[#13171A] hover:bg-[#1A1F24]' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                {themeMode === 'existing' && (
                  <span className="absolute top-2.5 right-2.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-700 text-white text-[9px]">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <div className="flex items-center space-x-2 mb-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Existing Theme</span>
                </div>
                <p className={`text-[10.5px] leading-snug mb-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Standard enterprise light theme with solid pure white cards and royal blue brand accents.
                </p>
                <div className="flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#F8FAFC] border border-slate-300" title="#F8FAFC" />
                  <span className="w-4 h-4 rounded-full bg-[#FFFFFF] border border-slate-300" title="#FFFFFF" />
                  <span className="w-4 h-4 rounded-full bg-[#1D4ED8]" title="#1D4ED8" />
                  <span className="w-4 h-4 rounded-full bg-[#1E293B]" title="#1E293B" />
                </div>
              </button>

              {/* Modern Dark Theme Card */}
              <button
                type="button"
                onClick={() => setThemeMode('modern-dark')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  themeMode === 'modern-dark'
                    ? 'border-[#E879F9] bg-[#181C20] shadow-xs ring-2 ring-[#E879F9]/30 text-white'
                    : isDark ? 'border-[#2E363D] bg-[#13171A] hover:bg-[#1A1F24]' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                {themeMode === 'modern-dark' && (
                  <span className="absolute top-2.5 right-2.5 flex items-center justify-center w-4 h-4 rounded-full bg-[#E879F9] text-[#15031E] text-[9px] font-bold">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <div className="flex items-center space-x-2 mb-1.5">
                  <Moon className="w-4 h-4 text-[#E879F9]" />
                  <span className={`font-bold text-xs ${themeMode === 'modern-dark' ? 'text-white' : 'text-slate-900'}`}>
                    Modern Dark
                  </span>
                </div>
                <p className={`text-[10.5px] leading-snug mb-2.5 ${themeMode === 'modern-dark' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Obsidian charcoal surfaces with pinkish violet accents and warm coral status tags.
                </p>
                <div className="flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#0D1013] border border-[#23282D]" title="#0D1013" />
                  <span className="w-4 h-4 rounded-full bg-[#181C20] border border-[#23282D]" title="#181C20" />
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: MODERN_DARK_ACCENTS[modernDarkAccent]?.hex || '#E879F9' }} title="Selected Accent" />
                  <span className="w-4 h-4 rounded-full bg-[#F78154]" title="#F78154" />
                </div>
              </button>
            </div>
          </div>

          {/* Accent Color Section (for Modern Dark) */}
          {themeMode === 'modern-dark' && (
            <div className={`space-y-2 p-3.5 rounded-xl border ${isDark ? 'border-[#2E363D] bg-[#13171A]' : 'border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-center justify-between">
                <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Modern Dark Accent Color
                </label>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${isDark ? 'bg-[#181C20] text-[#E879F9] border border-[#2E363D]' : 'bg-slate-200 text-slate-700'}`}>
                  {MODERN_DARK_ACCENTS[modernDarkAccent]?.name} ({MODERN_DARK_ACCENTS[modernDarkAccent]?.hex})
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                {(Object.keys(MODERN_DARK_ACCENTS) as ModernDarkAccentId[]).map((accId) => {
                  const acc = MODERN_DARK_ACCENTS[accId];
                  const isSelected = modernDarkAccent === accId;
                  return (
                    <button
                      key={accId}
                      type="button"
                      onClick={() => setModernDarkAccent(accId)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center space-y-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'border-[#E879F9] bg-[#181C20] shadow-xs ring-2 ring-[#E879F9]/40'
                            : 'border-slate-800 bg-white shadow-xs ring-2 ring-slate-400'
                          : isDark
                          ? 'border-[#2E363D] bg-[#181C20] hover:bg-[#22272C]'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full shadow-2xs flex items-center justify-center relative"
                        style={{ backgroundColor: acc.hex }}
                      >
                        {isSelected && <Check className="w-3 h-3 text-black/80 font-bold" />}
                      </span>
                      <span className={`text-[10px] font-semibold text-center leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {acc.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Display Density Switcher */}
          <div className="space-y-2">
            <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Display Grid Density
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  id: 'comfortable' as UiDensity,
                  label: 'Comfortable',
                  desc: 'Standard padding and font scale for showroom POS and desktops',
                },
                {
                  id: 'compact' as UiDensity,
                  label: 'Compact',
                  desc: 'Dense financial grid for high-volume ledger and stock audits',
                },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDensity(d.id)}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    density === d.id
                      ? isDark
                        ? 'bg-[#181C20] border-[#E879F9] text-white shadow-xs ring-1 ring-[#E879F9]/30'
                        : 'bg-blue-50 border-blue-700 text-blue-900 shadow-2xs'
                      : isDark
                      ? 'bg-[#13171A] border-[#2E363D] text-slate-300 hover:bg-[#1A1F24]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs mb-1">
                    <span>{d.label}</span>
                    {density === d.id && (
                      <Check className={`w-3.5 h-3.5 ${isDark ? 'text-[#E879F9]' : 'text-blue-700'}`} />
                    )}
                  </div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{d.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-5 py-3 border-t flex items-center justify-between text-xs ${
          isDark ? 'bg-[#13171A] border-[#23282D]' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            onClick={() => {
              resetToDefault();
            }}
            className={`flex items-center space-x-1 font-semibold cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standards</span>
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg font-semibold text-xs shadow-xs cursor-pointer transition-colors ${
              isDark ? 'bg-[#E879F9] hover:bg-[#F0ABFC] text-[#15031E] font-bold' : 'bg-blue-700 hover:bg-blue-800 text-white'
            }`}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
