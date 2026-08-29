import React, { useState } from 'react';
import { NavSection } from '../../types/erp';
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
  Database
} from 'lucide-react';

interface NavbarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  gold24kRate: number;
  gold22kRate: number;
  silverRate: number;
  currentUser: { code: string; name: string; role: string; branch: string } | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onSelectSection,
  gold24kRate,
  gold22kRate,
  silverRate,
  currentUser,
  onLogout,
}) => {
  const [showHotkeys, setShowHotkeys] = useState(false);

  const navItems: { id: NavSection; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'masters', label: 'Masters', icon: Layers },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'accounts', label: 'Accounts', icon: BookOpen },
    { id: 'stock', label: 'Stock', icon: Boxes },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'gold_scheme', label: 'Gold Scheme', icon: Coins },
    { id: 'messenger', label: 'Messenger', icon: MessageSquare },
    { id: 'backup', label: 'Backup', icon: HardDrive },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'field_dictionary', label: 'Field Dictionary', icon: BookMarked },
  ];

  return (
    <header className="bg-white border-b border-sky-200 text-slate-800 sticky top-0 z-40 shadow-sm no-print">
      {/* Top Utility Bar & Live Bullion Ticker */}
      <div className="px-4 py-2 bg-gradient-to-r from-sky-50 via-blue-50/70 to-slate-50 border-b border-sky-100 flex items-center justify-between text-xs">
        {/* Brand & Branch */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-sm">
              <Gem className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold tracking-wider text-blue-900 uppercase text-sm">
                SWARNA ERP
              </span>
              <span className="text-[10px] text-sky-700 font-semibold ml-2 bg-sky-100 px-1.5 py-0.5 rounded border border-sky-200 hidden sm:inline">
                ogaworld.in
              </span>
            </div>
          </div>

          <span className="text-slate-300 hidden md:inline">|</span>

          {/* Cloud Database Connected Badge */}
          <div className="hidden lg:flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <Database className="w-3 h-3 text-emerald-600" />
            <span>Supabase Cloud DB</span>
          </div>

          {/* Showroom Branch context */}
          {currentUser && (
            <div className="hidden md:flex items-center space-x-2 text-[11px] text-slate-600">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-slate-800 truncate max-w-[200px]" title={currentUser.branch}>
                {currentUser.branch.split(' - ')[0]}
              </span>
            </div>
          )}
        </div>

        {/* Live Bullion Ticker */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1 text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline text-[11px] font-semibold">Bullion Rates:</span>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <div className="bg-white border border-amber-300 px-2 py-0.5 rounded-md shadow-2xs flex items-center space-x-1">
              <span className="text-amber-700 font-bold">24K:</span>
              <span className="text-slate-800 font-extrabold">₹{gold24kRate.toLocaleString('en-IN')}/g</span>
            </div>
            <div className="bg-white border border-amber-300 px-2 py-0.5 rounded-md shadow-2xs flex items-center space-x-1">
              <span className="text-amber-700 font-bold">22K 916:</span>
              <span className="text-slate-800 font-extrabold">₹{gold22kRate.toLocaleString('en-IN')}/g</span>
            </div>
            <div className="bg-white border border-slate-300 px-2 py-0.5 rounded-md shadow-2xs flex items-center space-x-1 hidden lg:flex">
              <span className="text-slate-500 font-semibold">Silver:</span>
              <span className="text-slate-800 font-bold">₹{silverRate.toLocaleString('en-IN')}/g</span>
            </div>
          </div>

          {/* User Profile & Logout */}
          {currentUser && (
            <div className="flex items-center space-x-2 pl-2 border-l border-sky-200">
              <div className="text-right hidden sm:block">
                <div className="font-bold text-slate-800 text-[11px] leading-tight flex items-center space-x-1">
                  <UserCheck className="w-3 h-3 text-emerald-600 inline" />
                  <span>{currentUser.name}</span>
                </div>
                <div className="text-[10px] text-sky-700 font-mono">{currentUser.code} ({currentUser.role})</div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Hotkey Helper Button */}
          <button
            onClick={() => setShowHotkeys(!showHotkeys)}
            className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-white transition-colors"
            title="ERP Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="px-4 py-1.5 flex items-center justify-between overflow-x-auto scrollbar-none bg-white">
        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-sky-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Simplified Indicator */}
        <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-blue-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-md font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Field-Preserved & Multi-Device Cloud Sync</span>
        </div>
      </nav>

      {/* Hotkeys Floating Cheat Sheet */}
      {showHotkeys && (
        <div className="absolute right-4 top-16 bg-white border border-sky-200 rounded-xl shadow-xl p-4 w-72 z-50 text-xs animate-in fade-in duration-150 text-slate-800">
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-100">
            <span className="font-bold text-blue-900 flex items-center space-x-1.5">
              <Keyboard className="w-4 h-4 text-blue-600" />
              <span>Keyboard Hotkeys</span>
            </span>
            <button onClick={() => setShowHotkeys(false)} className="text-slate-400 hover:text-slate-600">
              ✕
            </button>
          </div>
          <div className="space-y-1 text-slate-600 font-mono text-[11px]">
            <div className="flex justify-between"><span>F2</span><span className="text-slate-400">Item Creation</span></div>
            <div className="flex justify-between"><span>F3</span><span className="text-slate-400">Barcode Tag</span></div>
            <div className="flex justify-between"><span>F4</span><span className="text-slate-400">Sales Invoice</span></div>
            <div className="flex justify-between"><span>F5</span><span className="text-slate-400">Purchase</span></div>
            <div className="flex justify-between"><span>F6</span><span className="text-slate-400">Refinery In</span></div>
            <div className="flex justify-between"><span>F7</span><span className="text-slate-400">New Order</span></div>
            <div className="flex justify-between"><span>F8</span><span className="text-slate-400">Account Master</span></div>
            <div className="flex justify-between"><span>F9</span><span className="text-slate-400">Stock Report</span></div>
            <div className="flex justify-between"><span>F10</span><span className="text-slate-400">Day Book</span></div>
            <div className="flex justify-between"><span>F11</span><span className="text-slate-400">Debtors Ledger</span></div>
            <div className="flex justify-between"><span>F12</span><span className="text-slate-400">USB Backup</span></div>
          </div>
        </div>
      )}
    </header>
  );
};
