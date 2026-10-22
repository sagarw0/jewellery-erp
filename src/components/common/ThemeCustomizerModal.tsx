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
import { useTheme } from '../../context/ThemeContext';
import { UiDensity } from '../../types/erp';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { density, setDensity, resetToDefault, themeMode, setThemeMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 text-slate-800">
        {/* Header */}
        <div className="px-5 py-4 bg-blue-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-white/20 text-white">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">Enterprise Design System</h2>
              <p className="text-[11px] text-blue-100 font-medium">
                Switch Theme & Adjust Display Density
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-5 text-xs">
          {/* Theme Selector Section */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
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
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                {themeMode === 'existing' && (
                  <span className="absolute top-2.5 right-2.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-700 text-white text-[9px]">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <div className="flex items-center space-x-2 mb-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-xs text-slate-900">Existing Theme</span>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-snug mb-2.5">
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
                    ? 'border-[#55D6C2] bg-[#292F32] shadow-xs ring-2 ring-[#55D6C2]/30 text-white'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                {themeMode === 'modern-dark' && (
                  <span className="absolute top-2.5 right-2.5 flex items-center justify-center w-4 h-4 rounded-full bg-[#55D6C2] text-[#142321] text-[9px] font-bold">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <div className="flex items-center space-x-2 mb-1.5">
                  <Moon className="w-4 h-4 text-[#55D6C2]" />
                  <span className={`font-bold text-xs ${themeMode === 'modern-dark' ? 'text-white' : 'text-slate-900'}`}>
                    Modern Dark
                  </span>
                </div>
                <p className={`text-[10.5px] leading-snug mb-2.5 ${themeMode === 'modern-dark' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Charcoal & dark slate surfaces with turquoise accents and restrained coral status tags.
                </p>
                <div className="flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#171C1F] border border-[#414B4F]" title="#171C1F" />
                  <span className="w-4 h-4 rounded-full bg-[#292F32] border border-[#414B4F]" title="#292F32" />
                  <span className="w-4 h-4 rounded-full bg-[#55D6C2]" title="#55D6C2" />
                  <span className="w-4 h-4 rounded-full bg-[#F4B183]" title="#F4B183" />
                </div>
              </button>
            </div>
          </div>

          {/* Display Density Switcher */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
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
                      ? 'bg-blue-50 border-blue-700 text-blue-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs mb-1">
                    <span>{d.label}</span>
                    {density === d.id && <Check className="w-3.5 h-3.5 text-blue-700" />}
                  </div>
                  <div className="text-[10px] text-slate-500">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              resetToDefault();
            }}
            className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standards</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs cursor-pointer transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
