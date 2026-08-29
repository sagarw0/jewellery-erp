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
  CheckCircle2
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: { code: string; name: string; role: string; branch: string }) => void;
}

export const BRANCHES = [
  'Main Showroom - Zaveri Bazaar, Mumbai',
  'Bandra West Flagship Showroom',
  'Vile Parle Heritage Jewellery Store',
  'Pune Camp Bullion Branch',
  'Central Workshop & Karagir Unit'
];

export const DEMO_USERS = [
  { code: 'EMP-101', name: 'Ramesh Kulkarni', role: 'Head Cashier', branch: 'Main Showroom - Zaveri Bazaar, Mumbai', pass: 'demo123' },
  { code: 'EMP-204', name: 'Sanjay Verma', role: 'Senior Sales Executive', branch: 'Bandra West Flagship Showroom', pass: 'demo123' },
  { code: 'EMP-001', name: 'Pravin Shah', role: 'Showroom Manager / Admin', branch: 'Main Showroom - Zaveri Bazaar, Mumbai', pass: 'admin123' },
];

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [employeeCode, setEmployeeCode] = useState('EMP-101');
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const userRole = matched ? matched.role : 'Billing Executive';

      onLoginSuccess({
        code: employeeCode.trim().toUpperCase(),
        name: userName,
        role: userRole,
        branch,
      });
    }, 600);
  };

  const handleQuickDemo = (user: typeof DEMO_USERS[0]) => {
    setEmployeeCode(user.code);
    setBranch(user.branch);
    setPassword(user.pass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-800">
      {/* Container Card */}
      <div className="w-full max-w-md bg-white border border-sky-200/80 rounded-2xl shadow-xl shadow-sky-900/5 overflow-hidden">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 px-6 py-6 text-white text-center relative overflow-hidden">
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
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* 1. Employee Code */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Employee Code <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-sky-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. EMP-101"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* 2. Branch Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Showroom Branch <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-sky-500 absolute left-3 top-2.5" />
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Password Authentication */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-sky-500 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter employee password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold text-xs rounded-lg shadow-md shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-70 mt-2"
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

          {/* Quick Demo Login Chips */}
          <div className="pt-4 border-t border-slate-100">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick Demo Staff Profiles
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.code}
                  type="button"
                  onClick={() => handleQuickDemo(user)}
                  className="p-2 rounded-lg bg-sky-50/70 hover:bg-sky-100/80 border border-sky-200/60 text-left transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold text-slate-800 text-xs flex items-center space-x-1.5">
                      <span>{user.name}</span>
                      <span className="text-[10px] text-sky-700 bg-sky-200/60 px-1.5 py-0.2 rounded font-mono font-bold">
                        {user.code}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">{user.role}</div>
                  </div>
                  <span className="text-[10px] text-blue-600 group-hover:underline font-semibold font-mono">
                    Select
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500 flex items-center justify-center space-x-2">
          <span>BIS Hallmark License: HM-916-MH-4421</span>
          <span>•</span>
          <span>FY 2026-27 Active</span>
        </div>
      </div>
    </div>
  );
};
