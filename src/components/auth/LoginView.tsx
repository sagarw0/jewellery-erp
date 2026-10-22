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
  ChevronDown,
  Sun,
  Moon,
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
  const { currentTheme, isDark, themeMode, setThemeMode } = useTheme();
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
    <div className={`min-h-screen ${isDark ? 'bg-[#171C1F] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#1E293B]'} flex flex-col justify-center items-center p-4 sm:p-6 relative transition-colors duration-150`}>
      {/* Top Right Theme Selector */}
      <div className="absolute top-4 right-4 z-10 flex items-center rounded-lg border border-slate-300 bg-slate-50 p-0.5 text-xs shadow-xs">
        <button
          type="button"
          onClick={() => setThemeMode('existing')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
            themeMode === 'existing'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Existing Theme (Light Enterprise)"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Existing Theme</span>
        </button>
        <button
          type="button"
          onClick={() => setThemeMode('modern-dark')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
            themeMode === 'modern-dark'
              ? 'bg-[#55D6C2] text-[#142321] shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Modern Dark Theme (Charcoal & Teal)"
        >
          <Moon className="w-3.5 h-3.5 text-[#55D6C2]" />
          <span>Modern Dark</span>
        </button>
      </div>

      {/* Container Card */}
      <div className="w-full max-w-md bg-white border border-slate-300 shadow-sm rounded-xl overflow-hidden transition-all">
        {/* Header Branding */}
        <div className="px-6 py-6 text-white text-center bg-blue-700 relative overflow-hidden">
          <div className="flex justify-center mb-2">
            <div className="p-2.5 rounded-lg bg-white/20 border border-white/30 shadow-inner">
              <Gem className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-wider uppercase font-sans">
            SWARNA ERP
          </h1>
          <p className="text-xs text-blue-100 mt-1 font-medium">
            Jewellery Enterprise Management Platform
          </p>
          <div className="mt-2.5 inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-white/15 text-[11px] text-white border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
            <span>Staff Secure Authentication</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg text-xs font-medium flex items-center space-x-2 bg-rose-50 border border-rose-200 text-rose-700">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* 1. Employee Code */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-700">
                Employee Code <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. OWNER-01"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg font-semibold bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors"
                />
              </div>
            </div>

            {/* 2. Branch Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-700">
                Showroom Branch <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <select
                  value={branch}
                  onChange={(e) => {
                    const selected = BRANCHES_LIST.find((b) => b.label === e.target.value);
                    setBranch(e.target.value);
                    if (selected) setBranchId(selected.id);
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-lg font-medium bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors"
                >
                  {BRANCHES_LIST.map((b) => (
                    <option key={b.id} value={b.label} className="bg-white text-slate-900">
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Password Authentication */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter employee password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer disabled:opacity-70 mt-2 shadow-xs"
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
          <div className="pt-4 border-t border-slate-200">
            <span className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-center text-slate-500">
              Quick Switch Demo Roles
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.code}
                  type="button"
                  onClick={() => handleQuickDemo(user)}
                  className={`p-2 rounded-lg text-left transition-colors flex items-center justify-between group cursor-pointer border ${
                    employeeCode === user.code
                      ? 'bg-blue-50 border-blue-600 text-slate-950 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-xs flex items-center space-x-1.5 flex-wrap">
                      <span className="text-slate-900">{user.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        user.role === 'Owner'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : user.role === 'Cashier'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {user.role} ({user.code})
                      </span>
                    </div>
                    <div className="text-[10px] truncate text-slate-500">
                      {user.desc}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold shrink-0 ${
                    employeeCode === user.code
                      ? 'text-blue-700'
                      : 'text-slate-500 group-hover:text-slate-800'
                  }`}>
                    {employeeCode === user.code ? '✓ Active' : 'Select →'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="px-6 py-3 border-t text-center text-[10px] flex items-center justify-center space-x-2 bg-slate-50 border-slate-200 text-slate-500">
          <span>BIS Hallmark License: HM-916-MH-4421</span>
          <span>•</span>
          <span>FY 2026-27 Active</span>
        </div>
      </div>
    </div>
  );
};
