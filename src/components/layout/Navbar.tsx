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
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme, THEMES, MODERN_DARK_ACCENTS, ModernDarkAccentId } from '../../context/ThemeContext';

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
    themeMode,
    setThemeMode,
    modernDarkAccent,
    setModernDarkAccent,
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
    <header className="sticky top-0 z-40 no-print border-b bg-white border-slate-300 text-slate-800 shadow-xs">
      {/* Top Utility Bar: Brand, Live Rates & Switchers */}
      <div className="px-4 py-2 flex items-center justify-between text-xs border-b bg-white border-slate-200 text-slate-800">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg flex items-center justify-center bg-blue-700 text-white shadow-xs">
              <Gem className="w-4 h-4 text-inherit" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold tracking-wide uppercase text-sm font-sans text-slate-900">
                  SWARNA ERP
                </span>
              </div>
              <span className="text-[10.5px] font-medium block text-slate-500">
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
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 cursor-pointer transition-colors shadow-xs"
            title="Click to open Live Bullion Rates Center & Showroom Board"
          >
            <div className="flex items-center space-x-1.5 pr-2 border-r border-slate-300 text-amber-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Rates:
              </span>
            </div>

            <div className="flex items-center space-x-2 font-mono text-[11px]">
              <div className="flex items-center space-x-1">
                <span className="text-slate-600 font-semibold">24K:</span>
                <span className="font-bold text-slate-900">₹{gold24kRate.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center space-x-1">
                <span className="text-slate-600 font-semibold">22K:</span>
                <span className="font-bold text-slate-900">₹{gold22kRate.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center space-x-1">
                <span className="text-slate-600 font-semibold">Sil:</span>
                <span className="font-bold text-slate-900">₹{silverRate.toLocaleString('en-IN')}/g</span>
              </div>
            </div>
          </div>

          {/* Executive Analytics */}
          <button
            onClick={onOpenAnalytics}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer bg-blue-700 hover:bg-blue-800 text-white shadow-xs"
            title="Executive Analytics (F1)"
          >
            <BarChart3 className="w-3.5 h-3.5 text-white" />
            <span className="hidden md:inline">Analytics</span>
            <span className="text-[9.5px] bg-blue-900/50 text-white px-1 py-0.2 rounded font-mono">F1</span>
          </button>

          {/* Dual Theme Selector: Existing Theme vs Modern Dark */}
          <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 p-0.5 text-xs shadow-xs">
            <button
              type="button"
              onClick={() => setThemeMode('existing')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                themeMode === 'existing'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Switch to Existing Theme (Light Enterprise)"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Existing</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('modern-dark')}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                themeMode === 'modern-dark'
                  ? 'shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              style={
                themeMode === 'modern-dark'
                  ? {
                      backgroundColor: MODERN_DARK_ACCENTS[modernDarkAccent]?.hex || '#62DBCA',
                      color: MODERN_DARK_ACCENTS[modernDarkAccent]?.textColor || '#0E2320',
                    }
                  : undefined
              }
              title="Switch to Modern Dark Theme"
            >
              <Moon
                className="w-3.5 h-3.5"
                style={{
                  color:
                    themeMode === 'modern-dark'
                      ? MODERN_DARK_ACCENTS[modernDarkAccent]?.textColor || '#0E2320'
                      : MODERN_DARK_ACCENTS[modernDarkAccent]?.hex || '#62DBCA',
                }}
              />
              <span className="hidden sm:inline">Modern Dark</span>
            </button>
          </div>

          {/* Accent Color Selector for Modern Dark */}
          {themeMode === 'modern-dark' && (
            <div
              className="flex items-center space-x-1 px-2 py-1 rounded-lg border border-[#2E363D] bg-[#1A1F24] shadow-xs"
              title="Select Modern Dark Accent Color"
            >
              <span className="text-[10px] font-bold text-slate-400 mr-0.5 hidden xl:inline">Accent:</span>
              {(Object.keys(MODERN_DARK_ACCENTS) as ModernDarkAccentId[]).map((accId) => {
                const acc = MODERN_DARK_ACCENTS[accId];
                const isSelected = modernDarkAccent === accId;
                return (
                  <button
                    key={accId}
                    type="button"
                    onClick={() => setModernDarkAccent(accId)}
                    className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                      isSelected
                        ? 'scale-125 ring-2 ring-white/80 shadow-xs'
                        : 'hover:scale-110 opacity-75 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: acc.hex }}
                    title={`${acc.name} (${acc.hex})`}
                  >
                    {isSelected && <span className="w-1 h-1 rounded-full bg-black/70" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Dynamic Role Switcher & User Profile */}
          {currentUser && (
            <div className="relative pl-1">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-left cursor-pointer transition-colors shadow-xs"
                title={
                  activeRole === 'Owner'
                    ? 'Showroom Owner - Click to manage employee roles'
                    : `Logged in as ${currentUser.name} (${activeRole})`
                }
              >
                <div className="text-right">
                  <div className="font-bold text-[11px] leading-tight flex items-center justify-end space-x-1">
                    <UserCheck className="w-3 h-3 text-emerald-600 inline shrink-0" />
                    <span className="truncate max-w-[100px] text-slate-900">{currentUser.name}</span>
                  </div>
                  <div
                    className={`text-[9.5px] font-bold uppercase tracking-wider flex items-center justify-end space-x-0.5 ${
                      activeRole === 'Owner'
                        ? 'text-amber-700'
                        : activeRole === 'Cashier'
                        ? 'text-emerald-700'
                        : 'text-blue-700'
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
                <div className="absolute right-0 mt-2 w-72 rounded-xl p-2.5 border border-slate-300 bg-white text-slate-800 shadow-xl z-50">
                  <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-200 mb-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        User & Access Control
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {currentUser.name} ({activeRole})
                      </span>
                    </div>
                    <button
                      onClick={() => setShowRoleDropdown(false)}
                      className="text-xs text-slate-400 hover:text-slate-700 p-1"
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
                        className="w-full p-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs flex items-center justify-between shadow-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-4 h-4 text-white" />
                          <span>Manage Staff Roles</span>
                        </div>
                        <span className="text-[10px] bg-blue-900/60 text-white px-1.5 py-0.5 rounded font-mono">
                          Owner
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Perspective testing quick switch for Owner */}
                  {activeRole === 'Owner' && (
                    <div className="space-y-1">
                      <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
                              className={`w-full p-2 rounded-lg text-left transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
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
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1 mb-2">
                      <div className="font-bold text-slate-800">Staff Access Level</div>
                      <div>Roles and permissions are managed by the Showroom Owner (<span className="text-blue-700 font-bold">Sagar Wadkar</span>).</div>
                    </div>
                  )}

                  {/* Theme Selector inside User Menu */}
                  <div className="pt-2 mt-2 border-t border-slate-200">
                    <div className="px-1 mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Interface Theme:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-50 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setThemeMode('existing')}
                        className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                          themeMode === 'existing'
                            ? 'bg-white text-slate-900 shadow-xs border border-slate-300 font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Existing</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setThemeMode('modern-dark')}
                        className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                          themeMode === 'modern-dark'
                            ? 'bg-[#55D6C2] text-[#142321] shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5 text-[#55D6C2]" />
                        <span>Modern Dark</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between items-center px-1">
                    <button
                      onClick={onLogout}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center space-x-1 cursor-pointer"
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
            className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-colors"
            title="ERP Keyboard Shortcuts (F1-F12)"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="px-4 py-1.5 flex items-center justify-between overflow-x-auto scrollbar-none bg-white">
        <div className="flex items-center space-x-1 p-1 rounded-xl border border-slate-200 bg-slate-100 min-w-max shadow-2xs">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer select-none border ${
                  isActive
                    ? 'bg-blue-700 text-white font-bold border-blue-700 shadow-xs'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-white border-transparent'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-white' : 'text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.hotkey && (
                  <span
                    className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono font-semibold tracking-normal border ${
                      isActive
                        ? 'bg-blue-900/40 text-white border-blue-600'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
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
        <div className="absolute right-4 top-20 border border-slate-300 rounded-xl shadow-xl p-4 w-76 z-50 text-xs bg-white text-slate-800">
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-200">
            <span className="font-bold flex items-center space-x-1.5 text-slate-900">
              <Keyboard className="w-4 h-4 text-blue-700" />
              <span>Keyboard Hotkeys (F1–F12)</span>
            </span>
            <button
              onClick={() => setShowHotkeys(false)}
              className="p-1 rounded text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            {[
              { key: 'F1', label: 'Executive Analytics' },
              { key: 'F2', label: 'Item Creation Master' },
              { key: 'F3', label: 'Barcode Studio' },
              { key: 'F4', label: 'Sales Invoice / POS' },
              { key: 'F5', label: 'Purchase Invoice' },
              { key: 'F6', label: 'Refinery In' },
              { key: 'F7', label: 'New Order Booking' },
              { key: 'F8', label: 'Account Master' },
              { key: 'F9', label: 'Stock Report' },
              { key: 'F10', label: 'Day Book' },
              { key: 'F11', label: 'Debtors Ledger' },
              { key: 'F12', label: 'USB Backup Manager' },
            ].map((hk, idx, arr) => (
              <div
                key={hk.key}
                className={`flex justify-between items-center py-1 ${
                  idx < arr.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <span className="font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {hk.key}
                </span>
                <span className="font-sans text-slate-700">{hk.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

