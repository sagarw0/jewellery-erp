import React, { useState } from 'react';
import {
  NavSection,
  ThemeId,
  UiDensity,
  UserRole,
  BranchId,
  AuthUser,
} from '../../types/erp';
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
  ChevronDown,
  ShieldCheck,
  Building,
  UserCog,
  RefreshCw,
} from 'lucide-react';
import { useTheme, THEMES } from '../../context/ThemeContext';

export const ROLE_NAV_PERMISSIONS: Record<UserRole, NavSection[]> = {
  Owner: [
    'dashboard',
    'masters',
    'transactions',
    'accounts',
    'stock',
    'reports',
    'gold_scheme',
    'messenger',
    'backup',
    'settings',
    'field_dictionary',
  ],
  Manager: [
    'dashboard',
    'masters',
    'transactions',
    'accounts',
    'stock',
    'reports',
    'gold_scheme',
    'messenger',
  ],
  Cashier: ['dashboard', 'transactions', 'accounts', 'gold_scheme', 'messenger'],
  Accountant: ['dashboard', 'transactions', 'accounts', 'reports', 'messenger'],
  Karagir: ['transactions', 'stock', 'messenger'],
};

export const BRANCHES_CONFIG: {
  id: BranchId;
  label: string;
  shortName: string;
  city: string;
  tag: string;
}[] = [
  {
    id: 'all',
    label: 'All Branches (Consolidated View)',
    shortName: 'All Branches (Consolidated)',
    city: 'Multi-Location Hub',
    tag: 'Combined (Mumbai + Pune + Thane)',
  },
  {
    id: 'mumbai',
    label: 'Mumbai Flagship Showroom (HM-916-MH-4421)',
    shortName: 'Mumbai Flagship (Zaveri)',
    city: 'Mumbai',
    tag: 'Zaveri Bazaar',
  },
  {
    id: 'pune',
    label: 'Pune Camp Showroom (HM-916-PN-1102)',
    shortName: 'Pune Camp Branch',
    city: 'Pune',
    tag: 'Camp MG Road',
  },
  {
    id: 'thane',
    label: 'Thane West Luxury Boutique (HM-916-TH-8833)',
    shortName: 'Thane West Boutique',
    city: 'Thane',
    tag: 'Naupada Luxury',
  },
];

interface NavbarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  gold24kRate: number;
  gold22kRate: number;
  silverRate: number;
  currentUser: AuthUser | null;
  selectedBranch: BranchId;
  onSelectBranch: (branchId: BranchId) => void;
  onChangeUserRole?: (role: UserRole) => void;
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
  selectedBranch,
  onSelectBranch,
  onChangeUserRole,
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
    setIsCustomizerOpen,
  } = useTheme();

  const [showHotkeys, setShowHotkeys] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);

  const activeRole: UserRole = currentUser?.role || 'Owner';
  const allowedSections = ROLE_NAV_PERMISSIONS[activeRole] || ROLE_NAV_PERMISSIONS['Owner'];

  const allNavItems: {
    id: NavSection;
    label: string;
    icon: React.FC<{ className?: string }>;
    hotkey?: string;
  }[] = [
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

  const visibleNavItems = allNavItems.filter((item) =>
    allowedSections.includes(item.id)
  );

  const currentBranchObj =
    BRANCHES_CONFIG.find((b) => b.id === selectedBranch) || BRANCHES_CONFIG[0];

  return (
    <header
      className={`sticky top-0 z-40 no-print transition-colors duration-200 border-b backdrop-blur-xl ${
        isDark
          ? 'bg-[#070b14]/95 border-white/10 text-white shadow-md'
          : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-2xs'
      }`}
    >
      {/* Top Utility Bar: Brand, Live Rates & Switchers */}
      <div
        className={`px-4 py-2 flex items-center justify-between text-xs border-b ${
          isDark
            ? 'bg-[#070b14]/90 border-white/10 text-white'
            : 'bg-white/95 border-slate-200/80 text-slate-900'
        }`}
      >
        {/* Brand & Showroom Branch */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <div
              className="p-2 rounded-xl flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: computedTokens.appPrimary,
                color: computedTokens.appPrimaryText,
              }}
            >
              <Gem className="w-4 h-4 text-inherit" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span
                  className={`font-black tracking-wider uppercase text-sm font-sans ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  SWARNA ERP
                </span>
                <span
                  className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-full border hidden sm:inline-block ${
                    isDark
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                      : 'bg-amber-100 text-amber-950 border border-amber-400'
                  }`}
                >
                  v2.6 Luxury
                </span>
              </div>
              <span
                className={`text-[10.5px] font-semibold block ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                ogaworld.in • Enterprise Suite
              </span>
            </div>
          </div>

          <span className={`${isDark ? 'text-white/20' : 'text-slate-300'} hidden md:inline`}>
            |
          </span>

          {/* Multi-Branch Switcher Dropdown (Accessible to Owner & Staff) */}
          <div className="relative">
            <button
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              className={`flex items-center space-x-2 text-[11px] px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/10 text-slate-200 border-white/15 hover:bg-white/15'
                  : 'bg-slate-50 text-slate-950 border-slate-300 hover:bg-slate-100 font-bold shadow-2xs'
              }`}
              title="Switch Showroom Branch (or view Consolidated Multi-Branch Totals)"
            >
              <Building2
                className={`w-3.5 h-3.5 ${
                  selectedBranch === 'all'
                    ? 'text-amber-500'
                    : isDark
                    ? 'text-sky-400'
                    : 'text-blue-600'
                }`}
              />
              <div className="text-left">
                <span className="font-bold truncate max-w-[150px] sm:max-w-[200px] block leading-tight">
                  {currentBranchObj.shortName}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
            </button>

            {showBranchDropdown && (
              <div
                className={`absolute left-0 mt-2 w-72 rounded-2xl p-2 border shadow-xl z-50 animate-in fade-in duration-150 ${
                  isDark
                    ? 'bg-[#0f172a]/95 border-white/20 text-white backdrop-blur-2xl'
                    : 'bg-white border-slate-200 text-slate-900 backdrop-blur-2xl shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-white/10 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Showroom Branch
                  </span>
                  <button
                    onClick={() => setShowBranchDropdown(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1">
                  {BRANCHES_CONFIG.map((b) => {
                    const isSelected = selectedBranch === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          onSelectBranch(b.id);
                          setShowBranchDropdown(false);
                        }}
                        className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                              : 'bg-blue-50 text-blue-900 border border-blue-300 font-bold'
                            : isDark
                            ? 'hover:bg-white/10 text-slate-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="min-w-0 pr-1">
                          <div className="text-xs font-bold truncate flex items-center space-x-1.5">
                            <span>{b.shortName}</span>
                            {b.id === 'all' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-300 font-mono">
                                3 Hubs
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] opacity-70 truncate">{b.tag}</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Bullion Ticker & Utility Action Controls */}
        <div className="flex items-center space-x-2.5 text-xs">
          {/* Live Bullion Ticker */}
          <div
            onClick={onOpenBullionRates}
            role="button"
            tabIndex={0}
            className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all duration-150 group ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                : 'bg-white hover:bg-amber-50 border-amber-300 text-slate-950 shadow-2xs'
            }`}
            title="Click to open Live Bullion Rates Center & Showroom Board"
          >
            <div
              className={`flex items-center space-x-1.5 pr-1.5 border-r ${
                isDark
                  ? 'border-white/15 text-amber-400'
                  : 'border-amber-300 text-amber-900 font-bold'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span
                className={`text-[10.5px] font-black uppercase tracking-wider ${
                  isDark ? 'text-amber-300' : 'text-amber-950'
                }`}
              >
                Rates:
              </span>
            </div>

            <div className="flex items-center space-x-2 font-mono text-[11px]">
              <div className="flex items-center space-x-1">
                <span className={isDark ? 'text-amber-300' : 'text-amber-900 font-bold'}>
                  24K:
                </span>
                <span className="font-black">₹{gold24kRate.toLocaleString('en-IN')}</span>
              </div>
              <span className={isDark ? 'text-white/30' : 'text-slate-300'}>•</span>
              <div className="flex items-center space-x-1">
                <span className={isDark ? 'text-amber-300' : 'text-amber-900 font-bold'}>
                  22K:
                </span>
                <span className="font-black">₹{gold22kRate.toLocaleString('en-IN')}</span>
              </div>
              <span className={isDark ? 'text-white/30' : 'text-slate-300'}>•</span>
              <div className="flex items-center space-x-1">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700 font-bold'}>
                  Sil:
                </span>
                <span className="font-black">₹{silverRate.toLocaleString('en-IN')}/g</span>
              </div>
            </div>
          </div>

          {/* AI Copilot Button */}
          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 shadow-2xs"
              title="Swarna AI ERP Copilot (Ctrl+Space)"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden md:inline">AI Copilot</span>
              <span className="text-[9px] bg-black/20 text-slate-900 px-1 py-0.2 rounded font-mono">
                AI
              </span>
            </button>
          )}

          {/* Executive Analytics */}
          <button
            onClick={onOpenAnalytics}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xs"
            title="Executive Analytics (F1)"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Analytics</span>
            <span className="text-[9.5px] bg-white/20 px-1 py-0.2 rounded font-mono">F1</span>
          </button>

          {/* Theme & UI Customizer Modal Trigger */}
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className={`px-3 py-1.5 rounded-xl border flex items-center space-x-2 cursor-pointer transition-all ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                : 'bg-white text-slate-800 hover:bg-slate-50 border-slate-300 font-bold shadow-2xs'
            }`}
            title="Open Global Theme & UI Customizer (3 Luxury Themes & Color Customizer)"
          >
            <Palette className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
            <span className="text-[11px] font-bold hidden sm:inline">Theme</span>
            <div
              className="w-3 h-3 rounded-full border border-white shadow-2xs shrink-0"
              style={{ backgroundColor: computedTokens.appPrimary }}
            />
          </button>

          {/* Dynamic Role Switcher & User Profile */}
          {currentUser && (
            <div className="relative pl-1">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`flex items-center space-x-2 px-2.5 py-1 rounded-xl border text-left cursor-pointer transition-all ${
                  isDark
                    ? 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                    : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50 shadow-2xs'
                }`}
                title="Click to switch role or view permissions"
              >
                <div className="text-right">
                  <div className="font-bold text-[11px] leading-tight flex items-center justify-end space-x-1">
                    <UserCheck className="w-3 h-3 text-emerald-500 inline shrink-0" />
                    <span className="truncate max-w-[100px]">{currentUser.name}</span>
                  </div>
                  <div
                    className={`text-[9.5px] font-bold uppercase tracking-wider ${
                      activeRole === 'Owner'
                        ? 'text-amber-600 dark:text-amber-300'
                        : activeRole === 'Cashier'
                        ? 'text-emerald-600 dark:text-emerald-300'
                        : 'text-blue-600 dark:text-sky-300'
                    }`}
                  >
                    {activeRole} • Switch ▾
                  </div>
                </div>
              </button>

              {/* Role Switcher Menu */}
              {showRoleDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-64 rounded-2xl p-2 border shadow-xl z-50 animate-in fade-in duration-150 ${
                    isDark
                      ? 'bg-[#0f172a]/95 border-white/20 text-white backdrop-blur-2xl'
                      : 'bg-white border-slate-200 text-slate-900 backdrop-blur-2xl shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-white/10 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role (RBAC)
                    </span>
                    <button
                      onClick={() => setShowRoleDropdown(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-1">
                    {(['Owner', 'Manager', 'Cashier', 'Accountant', 'Karagir'] as UserRole[]).map(
                      (role) => {
                        const isSelected = activeRole === role;
                        return (
                          <button
                            key={role}
                            onClick={() => {
                              if (onChangeUserRole) onChangeUserRole(role);
                              setShowRoleDropdown(false);
                            }}
                            className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? isDark
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                                  : 'bg-blue-50 text-blue-900 border border-blue-300 font-bold'
                                : isDark
                                ? 'hover:bg-white/10 text-slate-200'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold">{role}</div>
                              <div className="text-[10px] opacity-70">
                                {role === 'Owner' && 'Full 11 Modules + All Branches'}
                                {role === 'Manager' && 'Masters, Sales, Purchases, Stock'}
                                {role === 'Cashier' && 'Sales POS Counter, Day Book'}
                                {role === 'Accountant' && 'Financial Ledgers, Purchase, Reports'}
                                {role === 'Karagir' && 'Workshop Job Cards, Refinery In'}
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <div className="pt-2 mt-1 border-t border-white/10 flex justify-between items-center px-1">
                    <button
                      onClick={onLogout}
                      className="text-[11px] font-bold text-rose-600 hover:underline flex items-center space-x-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hotkey Cheat Sheet */}
          <button
            onClick={() => setShowHotkeys(!showHotkeys)}
            className={`p-1.5 rounded-xl border transition-colors ${
              isDark
                ? 'text-slate-300 hover:text-white hover:bg-white/10 border-white/15'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 border-slate-200'
            }`}
            title="ERP Keyboard Shortcuts (F1-F12)"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar (Horizontal Top Menus - Crisp luxury, no fuzzy glow) */}
      <nav
        className="px-4 py-1.5 flex items-center justify-between overflow-x-auto scrollbar-none transition-all duration-200"
        style={{
          backgroundColor: isDark ? 'rgba(7, 11, 20, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        }}
      >
        <div
          className="flex items-center space-x-1 p-0.5 rounded-2xl border min-w-max transition-all"
          style={{
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.40)' : 'rgba(241, 245, 249, 0.90)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.06)',
          }}
        >
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer select-none border ${
                  isActive
                    ? isDark
                      ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-2xs'
                      : 'bg-blue-600 text-white font-black border-blue-700 shadow-2xs'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-white/10 border-transparent'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white border-transparent'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-inherit' : 'opacity-70'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.hotkey && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold tracking-tight ${
                      isActive
                        ? isDark
                          ? 'bg-black/20 text-slate-950'
                          : 'bg-white/25 text-white'
                        : isDark
                        ? 'bg-white/10 text-slate-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
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
        <div
          className={`absolute right-4 top-20 border rounded-2xl shadow-xl p-4 w-76 z-50 text-xs animate-in fade-in duration-150 ${
            isDark
              ? 'bg-[#0f172a]/95 backdrop-blur-2xl border-white/20 text-white'
              : 'bg-white border-slate-200 text-slate-800 shadow-xl'
          }`}
        >
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-white/10">
            <span className="font-bold flex items-center space-x-1.5">
              <Keyboard className="w-4 h-4 text-amber-400" />
              <span>Keyboard Hotkeys (F1–F12)</span>
            </span>
            <button
              onClick={() => setShowHotkeys(false)}
              className="p-1 rounded opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between items-center py-0.5 border-b border-white/5">
              <span className="font-bold px-1.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">F1</span>
              <span className="font-sans">Executive Analytics</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/5">
              <span className="font-bold px-1.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">F2</span>
              <span className="font-sans">Item Creation Master</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/5">
              <span className="font-bold px-1.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">F3</span>
              <span className="font-sans">Barcode Studio</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/5">
              <span className="font-bold px-1.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">F4</span>
              <span className="font-sans">Sales Invoice / POS</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/5">
              <span className="font-bold px-1.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">F5</span>
              <span className="font-sans">Purchase Invoice</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/5">
              <span className="font-bold px-1.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">F6</span>
              <span className="font-sans">Refinery In</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/5">
              <span className="font-bold px-1.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">F7</span>
              <span className="font-sans">New Order Booking</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/5">
              <span className="font-bold px-1.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">F8</span>
              <span className="font-sans">Account Master</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/5">
              <span className="font-bold px-1.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">F9</span>
              <span className="font-sans">Stock Report</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/5">
              <span className="font-bold px-1.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">F10</span>
              <span className="font-sans">Day Book</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-white/5">
              <span className="font-bold px-1.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">F11</span>
              <span className="font-sans">Debtors Ledger</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="font-bold px-1.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">F12</span>
              <span className="font-sans">USB Backup Manager</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

