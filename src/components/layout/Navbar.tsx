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
}) => {
  const { currentTheme, density, setTheme, setDensity } = useTheme();
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
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-800 sticky top-0 z-40 shadow-xs no-print transition-colors duration-200">
      {/* Top Utility Bar & Live Bullion Ticker */}
      <div className={`px-4 py-2 ${currentTheme.headerBg} flex items-center justify-between text-xs`}>
        {/* Brand & Showroom Branch */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl ${currentTheme.primaryBtn} flex items-center justify-center shadow-xs`}>
              <Gem className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold tracking-wider text-slate-900 uppercase text-sm font-sans">
                  SWARNA ERP
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 hidden sm:inline-block">
                  v2.6 Luxury
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block">
                ogaworld.in • Showroom Cloud Edition
              </span>
            </div>
          </div>

          <span className="text-slate-300 hidden md:inline">|</span>

          {/* Cloud Database Connected Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase Cloud Sync</span>
          </div>

          {/* Showroom Branch context */}
          {currentUser && (
            <div className="hidden xl:flex items-center space-x-2 text-[11px] text-slate-600 bg-white/70 px-2.5 py-0.5 rounded-lg border border-slate-200/60 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-bold text-slate-800 truncate max-w-[200px]" title={currentUser.branch}>
                {currentUser.branch.split(' - ')[0]}
              </span>
            </div>
          )}
        </div>

        {/* Live Bullion Ticker & Customization Controls */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Live Bullion Ticker */}
          <div className="hidden sm:flex items-center space-x-2 bg-white/80 backdrop-blur-xs border border-slate-200/80 px-2.5 py-1 rounded-xl shadow-2xs">
            <div className="flex items-center space-x-1 text-slate-500 pr-1 border-r border-slate-200">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Live Rates:</span>
            </div>

            <div className="flex items-center space-x-2 font-mono text-[11px]">
              <div className="flex items-center space-x-1">
                <span className="text-amber-700 font-bold">24K:</span>
                <span className="text-slate-900 font-extrabold">₹{gold24kRate.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center space-x-1">
                <span className="text-amber-700 font-bold">22K 916:</span>
                <span className="text-slate-900 font-extrabold">₹{gold22kRate.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center space-x-1">
                <span className="text-slate-600 font-bold">Silver:</span>
                <span className="text-slate-900 font-extrabold">₹{silverRate.toLocaleString('en-IN')}/g</span>
              </div>
            </div>
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
              className="px-2.5 py-1.5 text-slate-700 hover:text-blue-600 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center space-x-1.5 cursor-pointer transition-all"
              title="Theme, Colors & Density Customizer"
            >
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden lg:inline text-[11px] font-bold">Theme</span>
              <div
                className="w-3 h-3 rounded-full border border-white shadow-2xs"
                style={{ backgroundColor: currentTheme.swatchPrimary }}
              />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Expanded Theme & UI Density Customizer Popup */}
            {showThemePicker && (
              <div className="absolute right-0 top-10 bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-4 w-80 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">Theme & Display Settings</h4>
                      <p className="text-[10px] text-slate-400">Personalize ERP appearance & layout</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowThemePicker(false)}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* UI Density Switcher */}
                <div className="mb-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>UI Spacing & Density</span>
                    <span className="text-[10px] font-mono text-blue-700 font-semibold uppercase">{density}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setDensity('compact')}
                      className={`px-2 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                        density === 'compact'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Minimize2 className="w-3 h-3" />
                      <span>Compact (Counter)</span>
                    </button>
                    <button
                      onClick={() => setDensity('comfortable')}
                      className={`px-2 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                        density === 'comfortable'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Comfortable</span>
                    </button>
                  </div>
                </div>

                {/* 8 Luxury Themes Palette Grid */}
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Luxury Themes (8 Styles)
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
                            ? 'bg-blue-50/80 text-blue-950 font-bold border-blue-300 shadow-xs'
                            : 'hover:bg-slate-50 text-slate-700 border-transparent hover:border-slate-200'
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
                            <div className="text-[9px] text-slate-400 leading-tight">{t.subtitle}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Logout */}
          {currentUser && (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="font-bold text-slate-900 text-[11px] leading-tight flex items-center justify-end space-x-1">
                  <UserCheck className="w-3 h-3 text-emerald-600 inline" />
                  <span>{currentUser.name}</span>
                </div>
                <div className="text-[10px] text-blue-700 font-mono font-semibold">{currentUser.code} ({currentUser.role})</div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Hotkey Helper Button */}
          <button
            onClick={() => setShowHotkeys(!showHotkeys)}
            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
            title="ERP Keyboard Shortcuts (F1-F12)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar (Horizontal Top Menus) */}
      <nav className="px-4 py-1.5 flex items-center justify-between overflow-x-auto scrollbar-none bg-white border-t border-slate-100">
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
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-inherit' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.hotkey && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-normal ml-0.5 ${
                    isActive ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-400'
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
        <div className="absolute right-4 top-16 bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-4 w-76 z-50 text-xs animate-in fade-in duration-150 text-slate-800">
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-100">
            <span className="font-extrabold text-slate-900 flex items-center space-x-1.5">
              <Keyboard className="w-4 h-4 text-blue-600" />
              <span>Keyboard Hotkeys (F1–F12)</span>
            </span>
            <button onClick={() => setShowHotkeys(false)} className="text-slate-400 hover:text-slate-700">✕</button>
          </div>
          <div className="space-y-1.5 text-slate-600 font-mono text-[11px]">
            <div className="flex justify-between items-center py-0.5 border-b border-slate-50"><span className="font-bold text-blue-700 bg-blue-50 px-1.5 rounded">F1</span><span className="text-slate-600 font-sans">Executive Analytics</span></div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-50"><span className="font-bold text-blue-700 bg-blue-50 px-1.5 rounded">F2</span><span className="text-slate-600 font-sans">Item Creation Master</span></div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-50"><span className="font-bold text-blue-700 bg-blue-50 px-1.5 rounded">F3</span><span className="text-slate-600 font-sans">Barcode Studio</span></div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-50"><span className="font-bold text-blue-700 bg-blue-50 px-1.5 rounded">F4</span><span className="text-slate-600 font-sans">Sales Invoice / POS</span></div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-50"><span className="font-bold text-blue-700 bg-blue-50 px-1.5 rounded">F5</span><span className="text-slate-600 font-sans">Purchase Invoice</span></div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-50"><span className="font-bold text-blue-700 bg-blue-50 px-1.5 rounded">F6</span><span className="text-slate-600 font-sans">Refinery In</span></div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-50"><span className="font-bold text-blue-700 bg-blue-50 px-1.5 rounded">F7</span><span className="text-slate-600 font-sans">New Order Booking</span></div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-50"><span className="font-bold text-blue-700 bg-blue-50 px-1.5 rounded">F8</span><span className="text-slate-600 font-sans">Account Master</span></div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-50"><span className="font-bold text-blue-700 bg-blue-50 px-1.5 rounded">F9</span><span className="text-slate-600 font-sans">Stock Report</span></div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-50"><span className="font-bold text-blue-700 bg-blue-50 px-1.5 rounded">F10</span><span className="text-slate-600 font-sans">Day Book</span></div>
            <div className="flex justify-between items-center py-0.5 border-b border-slate-50"><span className="font-bold text-blue-700 bg-blue-50 px-1.5 rounded">F11</span><span className="text-slate-600 font-sans">Debtors Ledger</span></div>
            <div className="flex justify-between items-center py-0.5"><span className="font-bold text-blue-700 bg-blue-50 px-1.5 rounded">F12</span><span className="text-slate-600 font-sans">USB Backup Manager</span></div>
          </div>
        </div>
      )}
    </header>
  );
};

