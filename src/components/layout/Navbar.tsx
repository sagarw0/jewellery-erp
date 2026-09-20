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
  onOpenStockRefill?: () => void;
  onOpenUserRoleManagement?: () => void;
  stockDeficitCount?: number;
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
  onOpenStockRefill,
  onOpenUserRoleManagement,
  stockDeficitCount = 0,
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
        {/* Brand */}
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
                  className={`font-bold tracking-wide uppercase text-sm font-sans ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  SWARNA ERP
                </span>
              </div>
              <span
                className={`text-[10.5px] font-medium block ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                ogaworld.in • Enterprise Suite
              </span>
            </div>
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
                className={`text-[10.5px] font-bold uppercase tracking-wide ${
                  isDark ? 'text-amber-300' : 'text-amber-950'
                }`}
              >
                Rates:
              </span>
            </div>

            <div className="flex items-center space-x-2 font-mono text-[11px]">
              <div className="flex items-center space-x-1">
                <span className={isDark ? 'text-amber-300' : 'text-amber-900 font-semibold'}>
                  24K:
                </span>
                <span className="font-bold">₹{gold24kRate.toLocaleString('en-IN')}</span>
              </div>
              <span className={isDark ? 'text-white/30' : 'text-slate-300'}>•</span>
              <div className="flex items-center space-x-1">
                <span className={isDark ? 'text-amber-300' : 'text-amber-900 font-semibold'}>
                  22K:
                </span>
                <span className="font-bold">₹{gold22kRate.toLocaleString('en-IN')}</span>
              </div>
              <span className={isDark ? 'text-white/30' : 'text-slate-300'}>•</span>
              <div className="flex items-center space-x-1">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700 font-semibold'}>
                  Sil:
                </span>
                <span className="font-bold">₹{silverRate.toLocaleString('en-IN')}/g</span>
              </div>
            </div>
          </div>

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
                title={
                  activeRole === 'Owner'
                    ? 'Showroom Owner - Click to manage employee roles'
                    : `Logged in as ${currentUser.name} (${activeRole})`
                }
              >
                <div className="text-right">
                  <div className="font-bold text-[11px] leading-tight flex items-center justify-end space-x-1">
                    <UserCheck className="w-3 h-3 text-emerald-500 inline shrink-0" />
                    <span className="truncate max-w-[100px]">{currentUser.name}</span>
                  </div>
                  <div
                    className={`text-[9.5px] font-bold uppercase tracking-wider flex items-center justify-end space-x-0.5 ${
                      activeRole === 'Owner'
                        ? 'text-amber-600 dark:text-amber-300'
                        : activeRole === 'Cashier'
                        ? 'text-emerald-600 dark:text-emerald-300'
                        : 'text-blue-600 dark:text-sky-300'
                    }`}
                  >
                    <span>{activeRole}</span>
                    {activeRole === 'Owner' && <span className="text-[8.5px] ml-0.5 font-bold">👑</span>}
                    <ChevronDown className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                  </div>
                </div>
              </button>

              {/* Role Switcher & Management Menu */}
              {showRoleDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-72 rounded-2xl p-2.5 border shadow-2xl z-50 animate-in fade-in duration-150 ${
                    isDark
                      ? 'bg-[#0f172a]/98 border-white/20 text-white backdrop-blur-2xl'
                      : 'bg-white border-slate-200 text-slate-900 backdrop-blur-2xl shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-white/10 mb-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        User & Access Control
                      </span>
                      <span className="text-xs font-bold truncate block">
                        {currentUser.name} ({activeRole})
                      </span>
                    </div>
                    <button
                      onClick={() => setShowRoleDropdown(false)}
                      className="text-xs text-slate-400 hover:text-white p-1"
                    >
                      ✕
                    </button>
                  </div>

                  {/* If Owner: Prominent Button to open full Employee Role Management modal */}
                  {activeRole === 'Owner' && onOpenUserRoleManagement && (
                    <div className="mb-2">
                      <button
                        onClick={() => {
                          setShowRoleDropdown(false);
                          onOpenUserRoleManagement();
                        }}
                        className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-bold text-xs flex items-center justify-between shadow-xs cursor-pointer transition-all"
                      >
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-4 h-4 text-slate-950" />
                          <span>Manage Staff Roles</span>
                        </div>
                        <span className="text-[10px] bg-black/20 text-slate-950 px-1.5 py-0.5 rounded font-mono">
                          Owner
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Perspective testing quick switch for Owner */}
                  {activeRole === 'Owner' && (
                    <div className="space-y-1">
                      <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Test Role Perspective:
                      </div>
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
                                  {role === 'Owner' && '👑 Protected (Full 11 Modules)'}
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
                  )}

                  {/* Non-Owner Notice */}
                  {activeRole !== 'Owner' && (
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 space-y-1 mb-2">
                      <div className="font-bold text-slate-300">Staff Access Level</div>
                      <div>Roles and permissions are managed by the Showroom Owner (<span className="text-amber-400 font-bold">Sagar Wadkar</span>).</div>
                    </div>
                  )}

                  <div className="pt-2 mt-1 border-t border-white/10 flex justify-between items-center px-1">
                    <button
                      onClick={onLogout}
                      className="text-[11px] font-bold text-rose-500 hover:text-rose-400 hover:underline flex items-center space-x-1 cursor-pointer"
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
          className="flex items-center space-x-1 p-1 rounded-2xl border min-w-max transition-all shadow-2xs"
          style={{
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.50)' : 'rgba(241, 245, 249, 0.95)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)',
          }}
        >
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer select-none border ${
                  isActive
                    ? isDark
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-sm'
                      : 'bg-blue-600 text-white font-bold border-blue-700 shadow-sm'
                    : isDark
                    ? 'text-slate-200 hover:text-white hover:bg-white/15 border-transparent'
                    : 'text-slate-950 hover:text-blue-700 hover:bg-white hover:shadow-2xs border-transparent'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-inherit' : isDark ? 'text-slate-300' : 'text-slate-800'
                  }`}
                />
                <span className="truncate font-semibold">{item.label}</span>
                {item.hotkey && (
                  <span
                    className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono font-semibold tracking-normal border ${
                      isActive
                        ? isDark
                          ? 'bg-black/25 text-slate-950 border-black/10'
                          : 'bg-white/25 text-white border-white/20'
                        : isDark
                        ? 'bg-white/15 text-slate-200 border-white/10'
                        : 'bg-slate-200/90 text-slate-900 border-slate-300'
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

