import React, { useState } from 'react';
import {
  Gem,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Palette,
  ChevronDown
} from 'lucide-react';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { ThemeId, UserRole, BranchId, AuthUser } from '../../types/erp';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const BRANCHES_LIST: { id: BranchId; label: string; city: string }[] = [
  { id: 'mumbai', label: 'Mumbai Flagship Showroom (HM-916-MH-4421)', city: 'Mumbai' },
  { id: 'pune', label: 'Pune Camp Showroom (HM-916-PN-1102)', city: 'Pune' },
  { id: 'thane', label: 'Thane West Luxury Boutique (HM-916-TH-8833)', city: 'Thane' },
];

export const DEMO_USERS: {
  code: string;
  name: string;
  role: UserRole;
  branch: string;
  branchId: BranchId;
  pass: string;
  desc: string;
}[] = [
  {
    code: 'OWNER-01',
    name: 'Sagar Wadkar',
    role: 'Owner',
    branch: 'Mumbai Flagship Showroom (HM-916-MH-4421)',
    branchId: 'all',
    pass: 'admin123',
    desc: 'Full Access to all 11 Modules + Multi-Branch Switching + All Controls',
  },
  {
    code: 'CASH-101',
    name: 'Ramesh Kulkarni',
    role: 'Cashier',
    branch: 'Mumbai Flagship Showroom (HM-916-MH-4421)',
    branchId: 'mumbai',
    pass: 'demo123',
    desc: 'Sales POS Counter (F4), Day Book, Gold Scheme & Messenger',
  },
  {
    code: 'MGR-201',
    name: 'Pravin Shah',
    role: 'Manager',
    branch: 'Mumbai Flagship Showroom (HM-916-MH-4421)',
    branchId: 'mumbai',
    pass: 'demo123',
    desc: 'Sales, Purchases, Orders, Stock, Barcodes, Daybook & Masters',
  },
  {
    code: 'ACCT-301',
    name: 'Sunil Agrawal',
    role: 'Accountant',
    branch: 'Mumbai Flagship Showroom (HM-916-MH-4421)',
    branchId: 'mumbai',
    pass: 'demo123',
    desc: 'Accounts, Ledgers, Purchases, Day Book, Sundry Debtors & Reports',
  },
  {
    code: 'KARA-401',
    name: 'Govind Soni',
    role: 'Karagir',
    branch: 'Central Workshop Unit',
    branchId: 'mumbai',
    pass: 'demo123',
    desc: 'Workshop Job Cards, Refinery In, Material Melting & Stock Vault',
  },
];

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { currentTheme, isDark, setTheme } = useTheme();
  const [employeeCode, setEmployeeCode] = useState('OWNER-01');
  const [branch, setBranch] = useState(BRANCHES_LIST[0].label);
  const [branchId, setBranchId] = useState<BranchId>('all');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!employeeCode.trim()) {
      setErrorMsg('Please enter Employee Code');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your Password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const matched = DEMO_USERS.find(
        (u) => u.code.toLowerCase() === employeeCode.trim().toLowerCase()
      );
      const userName = matched ? matched.name : 'Authorized Staff';
      const userRole: UserRole = matched ? matched.role : 'Cashier';
      const bId = matched ? matched.branchId : branchId;

      onLoginSuccess({
        code: employeeCode.trim().toUpperCase(),
        name: userName,
        role: userRole,
        branch,
        branchId: bId,
      });
    }, 400);
  };

  const handleQuickDemo = (user: typeof DEMO_USERS[0]) => {
    setEmployeeCode(user.code);
    setBranch(user.branch);
    setBranchId(user.branchId);
    setPassword(user.pass);
    setErrorMsg('');
  };

  return (
    <div className={`min-h-screen ${currentTheme.bgGradient} flex flex-col justify-center items-center p-4 sm:p-6 ${currentTheme.textPrimary} transition-colors duration-300 relative`}>
      {/* Top Floating Theme Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowThemePicker(!showThemePicker)}
            className={`px-3 py-1.5 rounded-xl border shadow-xs flex items-center space-x-2 cursor-pointer transition-all ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-md'
                : 'bg-white/90 text-slate-700 hover:bg-white border-slate-300 shadow-sm'
            }`}
            title="Switch ERP Theme"
          >
            <Palette className={`w-3.5 h-3.5 ${isDark ? 'text-sky-300' : 'text-blue-600'}`} />
            <span className="text-xs font-semibold">{currentTheme.name}</span>
            <div
              className="w-3 h-3 rounded-full border border-white shadow-2xs"
              style={{ backgroundColor: currentTheme.swatchPrimary }}
            />
            <ChevronDown className={`w-3 h-3 ${isDark ? 'text-slate-300' : 'text-slate-400'}`} />
          </button>

          {showThemePicker && (
            <div className={`absolute right-0 mt-2 w-72 rounded-2xl p-3 border shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
              isDark
                ? 'bg-[#111827]/95 border-white/20 text-white backdrop-blur-2xl'
                : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <span className="text-xs font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Choose ERP Theme</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowThemePicker(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto">
                {Object.values(THEMES)
                  .filter((theme) => theme.id !== 'custom')
                  .map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setTheme(theme.id as ThemeId);
                      setShowThemePicker(false);
                    }}
                    className={`w-full p-2 rounded-lg text-left flex items-center justify-between transition-colors ${
                      currentTheme.id === theme.id
                        ? isDark ? 'bg-white/15 text-white font-bold' : 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                        : isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/30"
                        style={{ backgroundColor: theme.swatchPrimary }}
                      />
                      <span className="text-xs">{theme.name}</span>
                    </div>
                    {currentTheme.id === theme.id && (
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Container Card */}
      <div className={`w-full max-w-md ${
        isDark
          ? 'bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-200 border border-white/20 shadow-2xl shadow-black/40 ring-1 ring-white/10'
          : 'bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5'
      } rounded-2xl overflow-hidden transition-all`}>
        {/* Header Branding */}
        <div className={`px-6 py-6 text-white text-center relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 border-b border-white/15'
            : 'bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700'
        }`}>
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex justify-center mb-2">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur border border-white/30 shadow-inner">
              <Gem className="w-8 h-8 text-amber-300 animate-pulse" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-wider uppercase font-sans">
            SWARNA ERP
          </h1>
          <p className="text-xs text-sky-100 mt-1 font-medium">
            Jewellery Enterprise Management Platform
          </p>
          <div className="mt-2 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] text-sky-100 border border-white/20">
            <ShieldCheck className="w-3 h-3 text-amber-300" />
            <span>Staff Secure Authentication</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {errorMsg && (
            <div className={`p-3 rounded-lg text-xs font-medium flex items-center space-x-2 ${
              isDark
                ? 'bg-rose-950/50 border border-rose-500/40 text-rose-200'
                : 'bg-rose-50 border border-rose-200 text-rose-700'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* 1. Employee Code */}
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}>
                Employee Code <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className={`w-4 h-4 absolute left-3 top-2.5 ${isDark ? 'text-sky-400' : 'text-sky-500'}`} />
                <input
                  type="text"
                  placeholder="e.g. EMP-101"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg font-semibold transition-colors focus:outline-none ${
                    isDark
                      ? 'bg-white/[0.09] border border-white/20 text-white placeholder-slate-400 focus:border-sky-400 focus:bg-white/[0.14]'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            {/* 2. Branch Selection */}
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}>
                Showroom Branch <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className={`w-4 h-4 absolute left-3 top-2.5 ${isDark ? 'text-sky-400' : 'text-sky-500'}`} />
                <select
                  value={branch}
                  onChange={(e) => {
                    const selected = BRANCHES_LIST.find((b) => b.label === e.target.value);
                    setBranch(e.target.value);
                    if (selected) setBranchId(selected.id);
                  }}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg font-medium transition-colors focus:outline-none ${
                    isDark
                      ? 'bg-white/[0.09] border border-white/20 text-white focus:border-sky-400 focus:bg-[#1f2937]'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white'
                  }`}
                >
                  {BRANCHES_LIST.map((b) => (
                    <option key={b.id} value={b.label} className={isDark ? 'bg-[#1f2937] text-white' : 'bg-white text-slate-900'}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Password Authentication */}
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}>
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3 top-2.5 ${isDark ? 'text-sky-400' : 'text-sky-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter employee password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-10 py-2 rounded-lg transition-colors focus:outline-none ${
                    isDark
                      ? 'bg-white/[0.09] border border-white/20 text-white placeholder-slate-400 focus:border-sky-400 focus:bg-white/[0.14]'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-2.5 ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 ${currentTheme.primaryBtn} text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-70 mt-2`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Authenticate & Launch ERP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Chips with Role details */}
          <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
            <span className={`block text-[11px] font-semibold uppercase tracking-wider mb-2 text-center ${
              isDark ? 'text-slate-300' : 'text-slate-400'
            }`}>
              Quick Switch Demo Roles
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.code}
                  type="button"
                  onClick={() => handleQuickDemo(user)}
                  className={`p-2 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer ${
                    employeeCode === user.code
                      ? isDark
                        ? 'bg-amber-500/20 border-2 border-amber-400 text-white shadow-xs'
                        : 'bg-blue-50 border-2 border-blue-500 text-slate-950 shadow-xs'
                      : isDark
                      ? 'bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white'
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-xs flex items-center space-x-1.5 flex-wrap">
                      <span className={isDark ? 'text-white' : 'text-slate-900'}>{user.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        user.role === 'Owner'
                          ? 'bg-amber-400/25 text-amber-900 dark:text-amber-300 border border-amber-400/40'
                          : user.role === 'Cashier'
                          ? 'bg-emerald-400/25 text-emerald-900 dark:text-emerald-300 border border-emerald-400/40'
                          : 'bg-sky-400/25 text-sky-900 dark:text-sky-300 border border-sky-400/40'
                      }`}>
                        {user.role} ({user.code})
                      </span>
                    </div>
                    <div className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {user.desc}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold shrink-0 ${
                    employeeCode === user.code
                      ? isDark ? 'text-amber-300' : 'text-blue-700'
                      : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'
                  }`}>
                    {employeeCode === user.code ? '✓ Active' : 'Select →'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className={`px-6 py-3 border-t text-center text-[10px] flex items-center justify-center space-x-2 ${
          isDark
            ? 'bg-black/20 border-white/10 text-slate-400'
            : 'bg-slate-50 border-slate-100 text-slate-500'
        }`}>
          <span>BIS Hallmark License: HM-916-MH-4421</span>
          <span>•</span>
          <span>FY 2026-27 Active</span>
        </div>
      </div>
    </div>
  );
};
