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
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { UiDensity } from '../../types/erp';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { density, setDensity, resetToDefault } = useTheme();

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
                Standardized Enterprise Theme & Display Density
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
          {/* Active Palette Summary */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Unified Enterprise Theme</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              The application uses a centralized design system with high-contrast typography, solid white cards, and accessible colors across all screens.
            </p>
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 font-mono text-[10px] text-center">
              <div className="p-1.5 rounded bg-white border border-slate-200">
                <div className="w-3.5 h-3.5 mx-auto rounded-full bg-[#1D4ED8] mb-1" />
                <span className="text-slate-600 block">Primary</span>
                <span className="font-bold text-slate-900">#1D4ED8</span>
              </div>
              <div className="p-1.5 rounded bg-white border border-slate-200">
                <div className="w-3.5 h-3.5 mx-auto rounded-full bg-[#F8FAFC] border border-slate-300 mb-1" />
                <span className="text-slate-600 block">Page Bg</span>
                <span className="font-bold text-slate-900">#F8FAFC</span>
              </div>
              <div className="p-1.5 rounded bg-white border border-slate-200">
                <div className="w-3.5 h-3.5 mx-auto rounded-full bg-[#1E293B] mb-1" />
                <span className="text-slate-600 block">Text</span>
                <span className="font-bold text-slate-900">#1E293B</span>
              </div>
              <div className="p-1.5 rounded bg-white border border-slate-200">
                <div className="w-3.5 h-3.5 mx-auto rounded-full bg-[#CBD5E1] mb-1" />
                <span className="text-slate-600 block">Border</span>
                <span className="font-bold text-slate-900">#CBD5E1</span>
              </div>
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
