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
  onOpenAiAssistant?: () => void;
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
  onOpenAiAssistant,
}) => {
  const {
    currentTheme,
    customConfig,
    computedTokens,
    isDark,
    density,
    setTheme,
    setDensity,
    setIsCustomizerOpen,
  } = useTheme();
  const [showHotkeys, setShowHotkeys] = useState(false);

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
                <span className={`font-extrabold tracking-wider uppercase text-sm font-sans ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  SWARNA ERP
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border hidden sm:inline-block ${
                  isDark
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 backdrop-blur-sm'
                    : 'bg-amber-100 text-amber-950 border border-amber-400'
                }`}>
                  v2.6 Luxury
                </span>
              </div>
              <span className={`text-[10.5px] font-semibold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                ogaworld.in • Showroom Cloud Edition
              </span>
            </div>
          </div>

          <span className={`${isDark ? 'text-white/20' : 'text-slate-400'} hidden md:inline`}>|</span>

          {/* Cloud Database Connected Badge */}
          <div className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
            isDark
              ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300 backdrop-blur-sm'
              : 'bg-emerald-100 border-emerald-400 text-emerald-950'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase Cloud Sync</span>
          </div>

          {/* Showroom Branch context */}
          {currentUser && (
            <div className={`hidden xl:flex items-center space-x-2 text-[11px] px-2.5 py-1 rounded-lg border shadow-2xs ${
              isDark
                ? 'bg-white/10 text-slate-200 border-white/15'
                : 'bg-white text-slate-950 border-slate-300 font-bold'
            }`}>
              <Building2 className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
              <span className={`font-bold truncate max-w-[200px] ${isDark ? 'text-white' : 'text-slate-950'}`} title={currentUser.branch}>
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
            className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl shadow-xs border cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 group ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 backdrop-blur-md border-white/20 text-white'
                : 'bg-white hover:bg-amber-50 border-amber-300 text-slate-950 shadow-2xs'
            }`}
            title="Click to open Live Bullion Rates Center & Showroom Board (Real-Time MCX/IBJA Rates)"
          >
            <div className={`flex items-center space-x-1.5 pr-1.5 border-r ${isDark ? 'border-white/15 text-amber-400' : 'border-amber-300 text-amber-900 font-bold'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <TrendingUp className="w-3.5 h-3.5 text-amber-600 group-hover:scale-105 transition-transform" />
              <span className={`text-[10.5px] font-black uppercase tracking-wider ${isDark ? 'text-amber-300' : 'text-amber-950'}`}>
                Rates:
              </span>
            </div>

            <div className="flex items-center space-x-2.5 font-mono text-[11.5px]">
              <div className="flex items-center space-x-1">
                <span className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>24K:</span>
                <span className={`font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>₹{gold24kRate.toLocaleString('en-IN')}</span>
              </div>
              <span className={isDark ? 'text-white/30' : 'text-slate-400'}>•</span>
              <div className="flex items-center space-x-1">
                <span className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>22K 916:</span>
                <span className={`font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>₹{gold22kRate.toLocaleString('en-IN')}</span>
              </div>
              <span className={isDark ? 'text-white/30' : 'text-slate-400'}>•</span>
              <div className="flex items-center space-x-1">
                <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Sil:</span>
                <span className={`font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>₹{silverRate.toLocaleString('en-IN')}/g</span>
              </div>
            </div>

            <span className={`text-[9.5px] px-1.5 py-0.5 rounded-md font-black uppercase transition-colors hidden md:inline-block ${
              isDark ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 group-hover:bg-amber-400 group-hover:text-slate-950' : 'bg-amber-100 text-amber-950 border border-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950'
            }`}>
              Live ↻
            </span>
          </div>

          {/* Swarna AI Copilot Assistant Button */}
          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer group"
              title="Swarna AI ERP Copilot (Ctrl+Space)"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">AI Copilot</span>
              <span className="text-[9px] bg-black/20 text-slate-900 px-1 py-0.2 rounded font-mono font-normal">AI</span>
            </button>
          )}

          {/* Executive Analytics Button */}
          <button
            onClick={onOpenAnalytics}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer"
            title="Executive Analytics (F1)"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Analytics</span>
            <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded font-mono">F1</span>
          </button>

          {/* Theme & UI Customizer Modal Trigger */}
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className={`px-3 py-1.5 rounded-xl border shadow-2xs flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20 border-white/20 shadow-xs'
                : 'bg-white text-slate-800 hover:bg-slate-50 border-slate-300 font-bold'
            }`}
            title="Open Global Theme & UI Customizer (Colors, Brightness & Presets)"
          >
            <Palette className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
            <div className="flex items-center space-x-1.5">
              <span className="text-[11.5px] font-bold hidden sm:inline">Customize / Theme</span>
              <span className="text-[11.5px] font-bold sm:hidden">Theme</span>
              {customConfig.brightness !== 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-400/25 text-amber-950 dark:text-amber-300">
                  {customConfig.brightness > 0 ? `+${customConfig.brightness}%` : `${customConfig.brightness}%`}
                </span>
              )}
            </div>
            <div
              className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs shrink-0"
              style={{ backgroundColor: computedTokens.appPrimary }}
            />
          </button>

          {/* User Profile & Logout */}
          {currentUser && (
            <div className={`flex items-center space-x-2 pl-2 border-l ${isDark ? 'border-white/15' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <div className={`font-semibold text-[11px] leading-tight flex items-center justify-end space-x-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <UserCheck className="w-3 h-3 text-emerald-500 inline" />
                  <span>{currentUser.name}</span>
                </div>
                <div className={`text-[10px] font-mono font-medium ${isDark ? 'text-amber-300' : 'text-blue-700'}`}>{currentUser.code} ({currentUser.role})</div>
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
          : 'bg-white/95 backdrop-blur-md border-slate-300 shadow-2xs'
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
                    ? 'text-slate-200 hover:text-white hover:bg-white/10'
                    : 'text-slate-800 hover:text-slate-950 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-inherit' : isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                <span>{item.label}</span>
                {item.hotkey && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ml-0.5 ${
                    isActive ? 'bg-black/25 text-white' : isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-900 border border-slate-400'
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
        <div className={`absolute right-4 top-16 border rounded-2xl shadow-lg p-4 w-76 z-50 text-xs animate-in fade-in duration-150 ${
          isDark
            ? 'bg-[#0f172a]/95 backdrop-blur-2xl border-white/20 text-white'
            : 'bg-white border-slate-200/90 text-slate-800'
        }`}>
          <div className={`flex justify-between items-center pb-2 mb-2 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
            <span className={`font-semibold flex items-center space-x-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Keyboard className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
              <span>Keyboard Hotkeys (F1–F12)</span>
            </span>
            <button onClick={() => setShowHotkeys(false)} className={`p-1 rounded ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>✕</button>
          </div>
          <div className={`space-y-1.5 font-mono text-[11px] ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-semibold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F1</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Executive Analytics</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-semibold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F2</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Item Creation Master</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-semibold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F3</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Barcode Studio</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-semibold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F4</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Sales Invoice / POS</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-semibold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F5</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Purchase Invoice</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-semibold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F6</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Refinery In</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-semibold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F7</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>New Order Booking</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-semibold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F8</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Account Master</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-semibold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F9</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Stock Report</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-semibold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F10</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Day Book</span></div>
            <div className={`flex justify-between items-center py-0.5 border-b ${isDark ? 'border-white/10' : 'border-slate-50'}`}><span className={`font-semibold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F11</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>Debtors Ledger</span></div>
            <div className="flex justify-between items-center py-0.5"><span className={`font-semibold px-1.5 rounded ${isDark ? 'bg-amber-500/20 text-amber-300' : 'text-blue-700 bg-blue-50'}`}>F12</span><span className={`font-sans ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>USB Backup Manager</span></div>
          </div>
        </div>
      )}
    </header>
  );
};
