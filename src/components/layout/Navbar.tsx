import React, { useState } from 'react';
import { NavSection, ThemeId, UiDensity } from '../../types/erp';
import {
  Gem,
  LayoutDashboard,
  Layers,
  Receipt,
  BookOpen,
  Boxes,
  BarChart3,
  Coins,
  MessageSquare,
  HardDrive,
  Settings,
  BookMarked,
  Keyboard,
  TrendingUp,
  LogOut,
  Building2,
  UserCheck,
  Database,
  Palette,
  Check,
  Sliders,
  Maximize2,
  Minimize2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useTheme, THEMES } from '../../context/ThemeContext';

interface NavbarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  gold24kRate: number;
  gold22kRate: number;
  silverRate: number;
  currentUser: { code: string; name: string; role: string; branch: string } | null;
  onLogout: () => void;
  onOpenAnalytics: () => void;
  onOpenBullionRates?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onSelectSection,
  gold24kRate,
  gold22kRate,
  silverRate,
  currentUser,
  onLogout,
  onOpenAnalytics,
  onOpenBullionRates,
}) => {
  const { currentTheme, isDark, density, setTheme, setDensity } = useTheme();
  const [showHotkeys, setShowHotkeys] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const navItems: { id: NavSection; label: string; icon: React.FC<{ className?: string }>; hotkey?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'masters', label: 'Masters', icon: Layers, hotkey: 'F2/F3' },
    { id: 'transactions', label: 'Transactions', icon: Receipt, hotkey: 'F4-F7' },
    { id: 'accounts', label: 'Accounts', icon: BookOpen, hotkey: 'F8/F10' },
    { id: 'stock', label: 'Stock', icon: Boxes, hotkey: 'F9' },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'gold_scheme', label: 'Gold Scheme', icon: Coins },
    { id: 'messenger', label: 'Messenger', icon: MessageSquare },
    { id: 'backup', label: 'Backup', icon: HardDrive, hotkey: 'F12' },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'field_dictionary', label: 'Field Dictionary', icon: BookMarked },
  ];

  return (
    <header className={`sticky top-0 z-40 shadow-xs no-print transition-colors duration-200 ${
      isDark
        ? 'bg-[#070b14]/90 backdrop-blur-xl border-b border-white/10 text-white'
        : 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-800'
    }`}>
      {/* Top Utility Bar & Live Bullion Ticker */}
      <div className={`px-4 py-2 ${currentTheme.headerBg} flex items-center justify-between text-xs`}>
        {/* Brand & Showroom Branch */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl ${currentTheme.primaryBtn} flex items-center justify-center shadow-xs`}>
              <Gem className="w-4 h-4 text-inherit" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className={`font-extrabold tracking-wider uppercase text-sm font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  SWARNA ERP
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border hidden sm:inline-block ${
                  isDark
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 backdrop-blur-sm'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  v2.6 Luxury
                </span>
              </div>
              <span className={`text-[10px] font-medium block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ogaworld.in • Showroom Cloud Edition
              </span>
            </div>
          </div>

          <span className={`${isDark ? 'text-white/20' : 'text-slate-300'} hidden md:inline`}>|</span>

          {/* Cloud Database Connected Badge */}
          <div className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
            isDark
              ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300 backdrop-blur-sm'
              : 'bg-emerald-50 border-emerald-300 text-emerald-800'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>Supabase Cloud Sync</span>
          </div>

          {/* Showroom Branch context */}
          {currentUser && (
            <div className={`hidden xl:flex items-center space-x-2 text-[11px] px-2.5 py-0.5 rounded-lg border shadow-2xs ${
              isDark
                ? 'bg-white/10 text-slate-200 border-white/15'
                : 'bg-white/70 text-slate-600 border-slate-200/60'
            }`}>
              <Building2 className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
              <span className={`font-bold truncate max-w-[200px] ${isDark ? 'text-white' : 'text-slate-800'}`} title={currentUser.branch}>
                {currentUser.branch.split(' - ')[0]}
              </span>
            </div>
          )}
        </div>

        {/* Live Bullion Ticker & Customization Controls */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Live Bullion Ticker (Clickable to open BullionRateModal) */}
          <div
            onClick={onOpenBullionRates}
            role="button"
            tabIndex={0}
            className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl shadow-xs border cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 group ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 backdrop-blur-md border-white/20 text-white'
                : 'bg-white hover:bg-amber-50/50 backdrop-blur-xs border-amber-300/80 shadow-amber-100/50 text-slate-800'
            }`}
            title="Click to open Live Bullion Rates Center & Showroom Board (Real-Time MCX/IBJA Rates)"
          >
            <div className={`flex items-center space-x-1.5 pr-1.5 border-r ${isDark ? 'border-white/15 text-amber-400' : 'border-amber-200 text-amber-800'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <TrendingUp className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                Rates:
              </span>
            </div>

            <div className="flex items-center space-x-2.5 font-mono text-[11px]">
              <div className="flex items-center space-x-1">
                <span className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>24K:</span>
                <span className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>₹{gold24kRate.toLocaleString('en-IN')}</span>
              </div>
              <span className={isDark ? 'text-white/20' : 'text-slate-300'}>•</span>
              <div className="flex items-center space-x-1">
                <span className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>22K 916:</span>
                <span className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>₹{gold22kRate.toLocaleString('en-IN')}</span>
              </div>
              <span className={isDark ? 'text-white/20' : 'text-slate-300'}>•</span>
              <div className="flex items-center space-x-1">
                <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Sil:</span>
                <span className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>₹{silverRate.toLocaleString('en-IN')}/g</span>
              </div>
            </div>

            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase transition-colors hidden md:inline-block ${
              isDark ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 group-hover:bg-amber-400 group-hover:text-slate-950' : 'bg-amber-100 text-amber-900 border border-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950'
            }`}>
              Live ↻
            </span>
          </div>

          {/* Executive Analytics Button */}
          <button
            onClick={onOpenAnalytics}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer"
            title="Executive Analytics (F1)"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Analytics</span>
            <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded font-mono">F1</span>
          </button>

          {/* Theme & Palette Customizer Modal Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className={`px-2.5 py-1.5 rounded-xl border shadow-2xs flex items-center space-x-1.5 cursor-pointer transition-all ${
                isDark
                  ? 'bg-white/10 text-white hover:bg-white/20 border-white/15'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200/80'
              }`}
              title="Theme, Colors & Density Customizer"
            >
              <Palette className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
              <span className="hidden lg:inline text-[11px] font-bold">Theme</span>
              <div
                className="w-3 h-3 rounded-full border border-white shadow-2xs"
                style={{ backgroundColor: currentTheme.swatchPrimary }}
              />
              <ChevronDown className={`w-3 h-3 ${isDark ? 'text-slate-300' : 'text-slate-400'}`} />
            </button>

            {/* Expanded Theme & UI Density Customizer Popup */}
            {showThemePicker && (
              <div className={`absolute right-0 top-10 border rounded-2xl shadow-2xl p-4 w-80 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 ${
                isDark
                  ? 'bg-[#0f172a]/95 backdrop-blur-2xl border-white/20 text-white'
                  : 'bg-white border-slate-200/90 text-slate-800'
              }`}>
                <div className={`flex justify-between items-center pb-2.5 mb-3 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <div>
                      <h4 className={`font-extrabold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Theme & Display Settings</h4>
                      <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Personalize ERP appearance & layout</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowThemePicker(false)}
                    className={`p-1 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                  >
                    ✕
                  </button>
                </div>

                {/* UI Density Switcher */}
                <div className={`mb-3.5 p-2.5 rounded-xl border ${isDark ? 'bg-white/[0.06] border-white/10' : 'bg-slate-50 border-slate-200/70'}`}>
                  <div className={`text-[11px] font-bold mb-1.5 flex items-center justify-between ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    <span>UI Spacing & Density</span>
                    <span className={`text-[10px] font-mono font-semibold uppercase ${isDark ? 'text-amber-300' : 'text-blue-700'}`}>{density}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setDensity('compact')}
                      className={`px-2 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                        density === 'compact'
                          ? currentTheme.activePill
                          : isDark ? 'bg-white/10 text-slate-200 hover:bg-white/15' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Minimize2 className="w-3 h-3" />
                      <span>Compact (Counter)</span>
                    </button>
                    <button
                      onClick={() => setDensity('comfortable')}
                      className={`px-2 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                        density === 'comfortable'
                          ? currentTheme.activePill
                          : isDark ? 'bg-white/10 text-slate-200 hover:bg-white/15' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Comfortable</span>
                    </button>
                  </div>
                </div>

                {/* 8 Luxury Themes Palette Grid */}
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Luxury Themes ({Object.keys(THEMES).length} Styles)
                  </div>
                  {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                    const t = THEMES[tId];
                    const isSelected = currentTheme.id === tId;
                    return (
                      <button
                        key={tId}
                        onClick={() => {
                          setTheme(tId);
                          setShowThemePicker(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer border ${
                          isSelected
                            ? isDark ? 'bg-white/20 text-white font-extrabold border-amber-400/50 shadow-md' : 'bg-blue-50/80 text-blue-950 font-bold border-blue-300 shadow-xs'
                            : isDark ? 'hover:bg-white/10 text-slate-200 border-transparent' : 'hover:bg-slate-50 text-slate-700 border-transparent hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {/* Dual Color Swatch Dot */}
                          <div className="relative flex items-center justify-center">
                            <div
                              className="w-4 h-4 rounded-full border border-white shadow-xs"
                              style={{ backgroundColor: t.swatchPrimary }}
                            />
                            <div
                              className="w-2.5 h-2.5 rounded-full border border-white shadow-xs -ml-1.5 -mt-2"
                              style={{ backgroundColor: t.swatchSecondary }}
                            />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold leading-tight">{t.name}</div>
                            <div className={`text-[9px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{t.subtitle}</div>
                          </div>
                        </div>
                        {isSelected && <Check className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Logout */}
          {currentUser && (
            <div className={`flex items-center space-x-2 pl-2 border-l ${isDark ? 'border-white/15' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <div className={`font-bold text-[11px] leading-tight flex items-center justify-end space-x-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <UserCheck className="w-3 h-3 text-emerald-500 inline" />
                  <span>{currentUser.name}</span>
                </div>
                <div className={`text-[10px] font-mono font-semibold ${isDark ? 'text-amber-300' : 'text-blue-700'}`}>{currentUser.code} ({currentUser.role})</div>
              </div>
              <button
                onClick={onLogout}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-white/10' : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'}`}
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Hotkey Helper Button */}
          <button
            onClick={() => setShowHotkeys(!showHotkeys)}
            className={`p-1.5 rounded-xl border transition-colors ${isDark ? 'text-slate-300 hover:text-white hover:bg-white/10 border-white/15' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100 border-slate-200'}`}
            title="ERP Keyboard Shortcuts (F1-F12)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar (Horizontal Top Menus) */}
      <nav className={`px-4 py-1.5 flex items-center justify-between overflow-x-auto scrollbar-none border-t ${
        isDark
          ? 'bg-[#070b14]/95 border-white/10'
          : 'bg-white border-slate-100'
      }`}>
        <div className="flex items-center space-x-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? `${currentTheme.activePill} shadow-xs`
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-inherit' : isDark ? 'text-slate-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.hotkey && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-normal ml-0.5 ${
                    isActive ? 'bg-black/20 text-white' : isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {item.hotkey}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Hotkeys Floating Cheat Sheet */}
      {showHotkeys && (
        <div className={`absolute right-4 top-16 border rounded-2xl shadow-2xl p-4 w-76 z-50 text-xs animate-in fade-in duration-150 ${
          isDark
            ? 'bg-[#0f172a]/95 backdrop-blur-2xl border-white/20 text-white'
            : 'bg-white border-slate-200/90 text-slate-800'
        }`}>
          <div className={`flex justify-between items-center pb-2 mb-2 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
            <span className={`font-extrabold flex items-center space-x-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Keyboard className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
              <span>Keyboard Hotkeys (F1–F12)</span>
            </span>
            <button onClick={() => setShowHotkeys(false)} className={`p-1 rounded ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>✕</button>
          </div>
          <div className={`space-y-1.5 font-mono text-[11px] ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-bold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F1</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Executive Analytics</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-bold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F2</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Item Creation Master</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-bold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F3</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Barcode Studio</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-bold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F4</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Sales Invoice / POS</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-bold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F5</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Purchase Invoice</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-bold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F6</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Refinery In</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-bold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F7</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>New Order Booking</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-bold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F8</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Account Master</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-bold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F9</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Stock Report</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-bold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F10</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Day Book</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-bold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F11</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Debtors Ledger</span></div>
            <div className="flex justify-between items-center py-0.5"><span className={`font-bold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F12</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>USB Backup Manager</span></div>
          </div>
        </div>
      )}
    </header>
  );
};
