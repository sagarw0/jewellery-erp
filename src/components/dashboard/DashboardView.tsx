import React, { useState } from 'react';
import {
  Wallet,
  Building,
  TrendingUp,
  ShoppingBag,
  Clock,
  UserPlus,
  Users,
  Coins,
  Gem,
  Bell,
  Cake,
  HeartHandshake,
  CalendarCheck,
  AlertCircle,
  CreditCard,
  BarChart3,
  Scale,
  Sparkles,
  CheckCircle2,
  Package,
  ChevronRight,
  ArrowRight,
  Banknote,
  ShoppingCart,
  FileText
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { NewOrderBookingRecord, SundryDebtorRow, StockItem } from '../../types/erp';
import { useTheme } from '../../context/ThemeContext';
import { AnalyticsModal } from './AnalyticsModal';

interface DashboardViewProps {
  onQuickAction: (actionId: string) => void;
  gold24kRate: number;
  gold22kRate: number;
  silverRate: number;
  orders: NewOrderBookingRecord[];
  debtors: SundryDebtorRow[];
  stockItems: StockItem[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onQuickAction,
  gold24kRate,
  gold22kRate,
  silverRate,
  orders,
  debtors,
  stockItems,
}) => {
  const { currentTheme } = useTheme();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeNoticeTab, setActiveNoticeTab] = useState<'all' | 'receivables' | 'orders' | 'birthdays' | 'bhishi'>('all');

  // Calculations for dynamic dashboard metrics
  const pendingOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const totalStockFineWt = stockItems.reduce((s, it) => s + (it.fine_wt || 0), 0);

  // Bank Balances (Itemized)
  const bankAccounts = [
    { bank_name: 'HDFC Bank (Current A/c - Zaveri)', account_no: '•••• 4920', balance: 485200, type: 'Current' },
    { bank_name: 'State Bank of India (Bullion Clearing)', account_no: '•••• 8831', balance: 245000, type: 'Current' },
    { bank_name: 'ICICI Bank (POS Counter Swipe)', account_no: '•••• 1209', balance: 132400, type: 'OD / CC' },
    { bank_name: 'Kotak Mahindra (Showroom Petty Cash)', account_no: '•••• 6542', balance: 78500, type: 'Savings' },
  ];

  const totalBankBalance = bankAccounts.reduce((s, b) => s + b.balance, 0);
  const cashInHand = 142600;

  // Stock Category Breakdown with live market valuations
  const goldGramRate = gold24kRate || 7250;
  const silverGramRate = silverRate || 86;

  const stockCategories = [
    {
      name: 'Pure Gold (916 / 999)',
      category: 'Gold',
      purity_label: '91.6% - 99.9%',
      purity_pct: 99.5,
      gross_wt: 1450.8,
      net_wt: 1420.2,
      fine_wt: 1300.9,
      pcs: 148,
      valuation: 1300.9 * goldGramRate,
      color: 'from-amber-500 to-yellow-600',
      bgGlow: 'bg-amber-50/70 border-amber-200/90 hover:border-amber-400',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      barColor: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    },
    {
      name: 'Pure Silver (925 / 999)',
      category: 'Silver',
      purity_label: '92.5% - 99.9%',
      purity_pct: 92.5,
      gross_wt: 14200.0,
      net_wt: 14150.0,
      fine_wt: 13088.7,
      pcs: 84,
      valuation: 13088.7 * silverGramRate,
      color: 'from-slate-400 to-slate-600',
      bgGlow: 'bg-slate-50/70 border-slate-200/90 hover:border-slate-400',
      badge: 'bg-slate-100 text-slate-800 border-slate-300',
      barColor: 'bg-gradient-to-r from-slate-300 to-slate-500',
    },
    {
      name: 'URD Gold (Old Scrap)',
      category: 'URD Gold',
      purity_label: '83.0% Melt Touch',
      purity_pct: 82.6,
      gross_wt: 184.5,
      net_wt: 178.0,
      fine_wt: 152.4,
      pcs: 22,
      valuation: 152.4 * goldGramRate * 0.98,
      color: 'from-yellow-600 to-amber-700',
      bgGlow: 'bg-yellow-50/60 border-yellow-200/90 hover:border-yellow-400',
      badge: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      barColor: 'bg-gradient-to-r from-yellow-500 to-amber-600',
    },
    {
      name: 'URD Silver (Old Scrap)',
      category: 'URD Silver',
      purity_label: '77.7% Melt Touch',
      purity_pct: 77.7,
      gross_wt: 2450.0,
      net_wt: 2380.0,
      fine_wt: 1904.0,
      pcs: 16,
      valuation: 1904.0 * silverGramRate * 0.95,
      color: 'from-zinc-500 to-zinc-700',
      bgGlow: 'bg-zinc-50/60 border-zinc-200/90 hover:border-zinc-400',
      badge: 'bg-zinc-100 text-zinc-800 border-zinc-300',
      barColor: 'bg-gradient-to-r from-zinc-400 to-zinc-600',
    },
    {
      name: 'Imitation (1gm Jewellery)',
      category: 'Imitation (1 gm)',
      purity_label: '1gm Gold Micro-Plate',
      purity_pct: 100,
      gross_wt: 3200.0,
      net_wt: 3200.0,
      fine_wt: 0,
      pcs: 420,
      valuation: 420 * 450,
      color: 'from-rose-500 to-pink-600',
      bgGlow: 'bg-rose-50/50 border-rose-200/90 hover:border-rose-400',
      badge: 'bg-rose-100 text-rose-900 border-rose-300',
      barColor: 'bg-gradient-to-r from-rose-400 to-pink-500',
    },
  ];

  const totalVaultValuation = stockCategories.reduce((s, c) => s + c.valuation, 0);

  // Notice Panel Items (Spec requirement)
  const noticeItems = [
    {
      id: 'n-1',
      type: 'order_due',
      title: 'Order Delivery Due Today (#ORD-2026-904)',
      subtitle: 'Customer: Mrs. Sunita Deshmukh • 22K Bridal Necklace (45g)',
      amount: 45000,
      tag: 'Order to be Given',
      color: 'border-l-blue-600 bg-blue-50/50',
    },
    {
      id: 'n-2',
      type: 'receivable',
      title: 'Debtor Balance Due (#AC-104)',
      subtitle: 'Party: Rajesh Gems & Bullion Wholesale • Pending WT: 42.500g',
      amount: 285000,
      tag: "Today's Receivable",
      color: 'border-l-emerald-600 bg-emerald-50/50',
    },
    {
      id: 'n-3',
      type: 'birthday',
      title: 'Customer Birthday Today 🎂',
      subtitle: 'Mrs. Ananya Kulkarni (Gold Scheme Member #GS-1029) • Send WhatsApp Wishes',
      tag: 'Birthday Alert',
      color: 'border-l-pink-600 bg-pink-50/50',
    },
    {
      id: 'n-4',
      type: 'anniversary',
      title: 'Wedding Anniversary Greeting 💍',
      subtitle: 'Mr. & Mrs. Deepak Mehta (VIP Customer) • 15th Anniversary',
      tag: 'Anniversary Alert',
      color: 'border-l-purple-600 bg-purple-50/50',
    },
    {
      id: 'n-5',
      type: 'bhishi',
      title: 'Bhishi (Gold Scheme) Monthly Installment Due',
      subtitle: '18 Members pending for Swarna Nidhi 11+1 Scheme (August Cycle)',
      amount: 90000,
      tag: 'Bhishi Due',
      color: 'border-l-amber-600 bg-amber-50/50',
    },
  ];

  const filteredNotices = noticeItems.filter((n) => {
    if (activeNoticeTab === 'all') return true;
    if (activeNoticeTab === 'receivables') return n.type === 'receivable';
    if (activeNoticeTab === 'orders') return n.type === 'order_due';
    if (activeNoticeTab === 'birthdays') return n.type === 'birthday' || n.type === 'anniversary';
    if (activeNoticeTab === 'bhishi') return n.type === 'bhishi';
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Banner with Executive Analytics Action */}
      <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4 transition-all duration-200`}>
        <div className="flex items-center space-x-3.5">
          <div className={`p-3 rounded-2xl ${currentTheme.primaryBtn} text-white shadow-xs flex items-center justify-center`}>
            <Gem className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 font-sans tracking-tight">
                Showroom Operations & Live Financial Center
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-300 hidden sm:inline-block">
                ● Live Cloud Synced
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time bullion weights, till cash, bank positions, category stock breakdown, and daily alerts.
            </p>
          </div>
        </div>

        {/* Top Analytics Action */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAnalytics(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-amber-300" />
            <span>Executive Analytics</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md font-mono">F1</span>
          </button>
        </div>
      </div>

      {/* 1. TOP METRICS STRIP (7 Compact, Perfectly Aligned Luxury Metric Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-2.5 items-stretch">
        {/* Card 1: Today's Cash */}
        <div
          onClick={() => onQuickAction('day_book')}
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[125px] group`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 shadow-2xs">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10.5px] font-bold uppercase tracking-tight text-slate-600 font-sans truncate">
                Today's Cash
              </span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto">
            <div className="text-base sm:text-lg font-black font-mono text-emerald-700 tracking-tight leading-tight">
              ₹1,42,600
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[9px]">
              ↑ 8.5%
            </span>
            <span className="text-slate-400 font-medium truncate">vs yesterday</span>
          </div>
        </div>

        {/* Card 2: Today's Bank */}
        <div
          onClick={() => onQuickAction('day_book')}
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[125px] group`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 shadow-2xs">
                <Building className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10.5px] font-bold uppercase tracking-tight text-slate-600 font-sans truncate">
                Today's Bank
              </span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto">
            <div className="text-base sm:text-lg font-black font-mono text-blue-900 tracking-tight leading-tight">
              {formatCurrency(totalBankBalance)}
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[9px]">
              ↑ 4.2%
            </span>
            <span className="text-slate-400 font-medium truncate">4 Active A/cs</span>
          </div>
        </div>

        {/* Card 3: Today's Sales */}
        <div
          onClick={() => onQuickAction('sales_invoice')}
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[125px] group`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0 shadow-2xs">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10.5px] font-bold uppercase tracking-tight text-slate-600 font-sans truncate">
                Today's Sales
              </span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto">
            <div className="text-base sm:text-lg font-black font-mono text-amber-900 tracking-tight leading-tight">
              ₹2,84,500
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[9px]">
              ↑ 12.4%
            </span>
            <span className="text-slate-400 font-medium truncate">vs yesterday</span>
          </div>
        </div>

        {/* Card 4: Today's Purchase */}
        <div
          onClick={() => onQuickAction('purchase')}
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[125px] group`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors shrink-0 shadow-2xs">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10.5px] font-bold uppercase tracking-tight text-slate-600 font-sans truncate">
                Today's Purchase
              </span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto">
            <div className="text-base sm:text-lg font-black font-mono text-orange-950 tracking-tight leading-tight">
              ₹1,95,000
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[9px]">
              ↓ 6.3%
            </span>
            <span className="text-slate-400 font-medium truncate">Bullion Inward</span>
          </div>
        </div>

        {/* Card 5: Orders Pending */}
        <div
          onClick={() => onQuickAction('new_order')}
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[125px] group`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors shrink-0 shadow-2xs">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10.5px] font-bold uppercase tracking-tight text-slate-600 font-sans truncate">
                Orders Pending
              </span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto">
            <div className="text-base sm:text-lg font-black font-mono text-rose-700 tracking-tight leading-tight">
              {pendingOrdersCount} Orders
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[9px]">
              2 Due
            </span>
            <span className="text-slate-400 font-medium truncate">Delivery Today</span>
          </div>
        </div>

        {/* Card 6: New Walk-Ins */}
        <div
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-[125px] group`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0 shadow-2xs">
                <UserPlus className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10.5px] font-bold uppercase tracking-tight text-slate-600 font-sans truncate">
                New Walk-ins
              </span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto">
            <div className="text-base sm:text-lg font-black font-mono text-sky-950 tracking-tight leading-tight">
              14 Visitors
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[9px]">
              ↑ 27%
            </span>
            <span className="text-slate-400 font-medium truncate">New Profiles</span>
          </div>
        </div>

        {/* Card 7: Total Footfall */}
        <div
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-[125px] group`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0 shadow-2xs">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10.5px] font-bold uppercase tracking-tight text-slate-600 font-sans truncate">
                Total Footfall
              </span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto">
            <div className="text-base sm:text-lg font-black font-mono text-purple-950 tracking-tight leading-tight">
              38 Guests
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9.5px]">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[9px]">
              ↑ 16%
            </span>
            <span className="text-slate-400 font-medium truncate">Showroom Total</span>
          </div>
        </div>
      </div>

      {/* 2. CURRENT STOCK VAULT BREAKDOWN (Executive-Grade Bullion Dashboard with Live Market Valuation) */}
      <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl p-4 sm:p-5 shadow-xs space-y-4`}>
        <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3 gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-2xs">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Current Stock Vault Breakdown
                </h2>
                <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  Live Market Rates
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                Pure Gold 24K: ₹{goldGramRate}/g • Pure Silver: ₹{silverGramRate}/g • Real-time Fine Metal Accounting
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <div className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-[11px] font-mono font-bold text-blue-950 flex items-center space-x-1.5 shadow-2xs">
              <span className="text-slate-500 font-sans font-medium text-[10px]">Total Fine Bullion:</span>
              <strong className="text-blue-900 font-extrabold">{formatWeight(totalStockFineWt)}</strong>
            </div>

            <div className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-[11px] font-mono font-bold text-emerald-950 flex items-center space-x-1.5 shadow-2xs">
              <span className="text-emerald-700 font-sans font-medium text-[10px]">Vault Valuation:</span>
              <strong className="text-emerald-900 font-extrabold">{formatCurrency(totalVaultValuation)}</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {stockCategories.map((stk, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all duration-200 space-y-2.5 shadow-2xs hover:shadow-md ${stk.bgGlow}`}
            >
              {/* Card Header: Category & Pcs */}
              <div className="flex justify-between items-start">
                <div className="min-w-0 pr-1">
                  <div className="font-extrabold text-slate-900 text-xs truncate font-sans" title={stk.name}>
                    {stk.name}
                  </div>
                  <div className="text-[9.5px] font-medium text-slate-500 flex items-center space-x-1">
                    <span>{stk.purity_label}</span>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shadow-2xs shrink-0 ${stk.badge}`}>
                  {stk.pcs} Pcs
                </span>
              </div>

              {/* Valuation Banner */}
              <div className="p-1.5 rounded-lg bg-white/80 border border-slate-200/80 flex items-center justify-between text-[10px] shadow-2xs">
                <span className="text-slate-500 font-sans">Live Est. Value:</span>
                <span className="font-mono font-black text-slate-900">
                  {formatCurrency(stk.valuation)}
                </span>
              </div>

              {/* Weights Monospace Breakdown */}
              <div className="space-y-1 font-mono text-[11px] bg-white/60 p-2 rounded-xl border border-slate-200/60">
                <div className="flex justify-between items-center text-slate-600 text-[10.5px]">
                  <span className="font-sans text-[10px] text-slate-400">Gross Wt:</span>
                  <span className="font-bold text-slate-800">{formatWeight(stk.gross_wt)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 text-[10.5px]">
                  <span className="font-sans text-[10px] text-slate-400">Net Wt:</span>
                  <span className="font-bold text-blue-900">{formatWeight(stk.net_wt)}</span>
                </div>
                <div className="flex justify-between items-center text-amber-950 pt-1 border-t border-slate-200/80 font-bold text-[10.5px]">
                  <span className="font-sans text-[10px] text-amber-800 font-semibold">Fine Metal:</span>
                  <span className="font-extrabold text-amber-900">{formatWeight(stk.fine_wt)}</span>
                </div>
              </div>

              {/* Metallic Purity Bar */}
              <div className="space-y-1 pt-0.5">
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>Purity / Purity Equiv</span>
                  <span className="font-bold text-slate-700">{stk.purity_pct}%</span>
                </div>
                <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stk.barColor}`}
                    style={{ width: `${stk.purity_pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TABULAR FORMAT (Cash in Hand & Cash in Bank) & 4. NOTICE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (7 Cols): Tabular Cash in Hand & Cash in Bank */}
        <div className={`lg:col-span-7 ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl p-4 sm:p-5 shadow-xs space-y-4`}>
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                <CreditCard className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Financial Balances: Cash in Hand & Bank A/cs
              </h2>
            </div>
            <span className="text-xs font-mono font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              Total: {formatCurrency(cashInHand + totalBankBalance)}
            </span>
          </div>

          {/* Cash in Hand Banner */}
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-300/80 rounded-2xl flex justify-between items-center shadow-2xs">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-2xs">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-emerald-950 text-xs">Physical Cash in Hand (Till)</div>
                <div className="text-[10px] text-emerald-700">Counter Opening + Sales Collections Reconciled</div>
              </div>
            </div>
            <div className="text-lg font-extrabold font-mono text-emerald-900">
              {formatCurrency(cashInHand)}
            </div>
          </div>

          {/* Cash in Bank Table (Individual Bank Breakdown) */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Cash in Bank (Individual Accounts)
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200">Bank Name & Branch</th>
                    <th className="p-2.5 border-r border-slate-200 w-24">A/c No</th>
                    <th className="p-2.5 border-r border-slate-200 w-24">Type</th>
                    <th className="p-2.5 text-right w-36">Live Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
                  {bankAccounts.map((b, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/40 transition-colors">
                      <td className="p-2.5 border-r border-slate-200 font-sans font-bold text-slate-900">
                        {b.bank_name}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-slate-500">{b.account_no}</td>
                      <td className="p-2.5 border-r border-slate-200">
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {b.type}
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-extrabold text-blue-900">
                        {formatCurrency(b.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold font-mono border-t border-slate-300 text-xs">
                  <tr>
                    <td colSpan={3} className="p-2.5 font-sans uppercase text-right font-extrabold text-slate-700">
                      Total Cash in Bank:
                    </td>
                    <td className="p-2.5 text-right text-blue-950 font-extrabold">
                      {formatCurrency(totalBankBalance)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right (5 Cols): NOTICE PANEL */}
        <div className={`lg:col-span-5 ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5`}>
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Showroom Alerts & Reminders
              </h2>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 font-extrabold border border-rose-200">
              {noticeItems.length} Pending
            </span>
          </div>

          {/* Notice Filter Tabs */}
          <div className="flex space-x-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
            {[
              { id: 'all', label: 'All Alerts' },
              { id: 'receivables', label: 'Receivables' },
              { id: 'orders', label: 'Orders Due' },
              { id: 'birthdays', label: 'Birthdays' },
              { id: 'bhishi', label: 'Bhishi' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveNoticeTab(tab.id as any)}
                className={`px-3 py-1 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer ${
                  activeNoticeTab === tab.id
                    ? `${currentTheme.activePill} shadow-2xs`
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notices List */}
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {filteredNotices.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border border-slate-200 border-l-4 ${n.color} transition-all space-y-1.5 hover:shadow-2xs`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-slate-900 text-xs font-sans">{n.title}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/90 border border-slate-200 text-slate-700 shadow-2xs">
                    {n.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">{n.subtitle}</p>
                {n.amount && (
                  <div className="text-[11px] font-mono font-extrabold text-blue-900 pt-0.5">
                    Amount: {formatCurrency(n.amount)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Modal */}
      <AnalyticsModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} />
    </div>
  );
};

