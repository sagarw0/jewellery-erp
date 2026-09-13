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

// Reusable SVG Sparkline / Wave Graph Component matching reference UI
const SparklineWave: React.FC<{ color: string; id: string; waveType?: number }> = ({ color, id, waveType = 1 }) => {
  const pathD =
    waveType === 1
      ? 'M0 46 C35 44, 55 52, 85 40 C115 28, 140 44, 165 30 C185 18, 195 24, 200 14'
      : waveType === 2
      ? 'M0 50 C40 48, 65 38, 95 42 C125 46, 150 24, 175 22 C190 20, 195 16, 200 10'
      : 'M0 48 C30 46, 50 36, 80 44 C110 52, 140 32, 165 24 C185 16, 195 20, 200 12';

  return (
    <svg
      viewBox="0 0 200 60"
      className="absolute bottom-0 left-0 right-0 w-full h-11 overflow-hidden pointer-events-none"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`sparkline-grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={`${pathD} L200 60 L0 60 Z`} fill={`url(#sparkline-grad-${id})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
};

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

  // Stock Category Breakdown: Imitation (1gm), URD Silver, URD Gold, Silver, Gold
  const stockCategories = [
    {
      name: 'Pure Gold (916 / 999)',
      category: 'Gold',
      gross_wt: 1450.8,
      net_wt: 1420.2,
      fine_wt: 1300.9,
      pcs: 148,
      color: 'from-amber-500 to-yellow-600',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      name: 'Pure Silver (925 / 999)',
      category: 'Silver',
      gross_wt: 14200.0,
      net_wt: 14150.0,
      fine_wt: 13088.7,
      pcs: 84,
      color: 'from-slate-400 to-slate-600',
      badge: 'bg-slate-100 text-slate-800 border-slate-300',
    },
    {
      name: 'URD Gold (Old Scrap)',
      category: 'URD Gold',
      gross_wt: 184.5,
      net_wt: 178.0,
      fine_wt: 152.4,
      pcs: 22,
      color: 'from-yellow-600 to-amber-700',
      badge: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    },
    {
      name: 'URD Silver (Old Scrap)',
      category: 'URD Silver',
      gross_wt: 2450.0,
      net_wt: 2380.0,
      fine_wt: 1904.0,
      pcs: 16,
      color: 'from-zinc-500 to-zinc-700',
      badge: 'bg-zinc-100 text-zinc-800 border-zinc-300',
    },
    {
      name: 'Imitation (1gm Jewellery)',
      category: 'Imitation (1 gm)',
      gross_wt: 3200.0,
      net_wt: 3200.0,
      fine_wt: 0,
      pcs: 420,
      color: 'from-rose-500 to-pink-600',
      badge: 'bg-rose-100 text-rose-900 border-rose-300',
    },
  ];

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

      {/* 1. TOP METRICS STRIP (7 Cards Formatted Exactly as Reference Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-3.5">
        {/* Card 1: Today's Cash */}
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-white via-emerald-50/20 to-emerald-50/50 border border-emerald-200/90 p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between min-h-[148px]">
          <div>
            {/* Header: Icon + Title + Action Chevron */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Banknote className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-tight font-sans">
                  Today's Cash
                </span>
              </div>
              <button
                onClick={() => onQuickAction('day_book')}
                className="w-6 h-6 rounded-lg border border-emerald-200/80 bg-white/90 text-emerald-600 flex items-center justify-center hover:bg-emerald-100/60 transition-colors shadow-2xs cursor-pointer"
                title="View Day Book"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Value */}
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-800 tracking-tight mt-2 mb-1.5">
              ₹1,42,600
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center space-x-1.5 text-[11px] relative z-10">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                ↑ 8.5%
              </span>
              <span className="text-slate-400 font-medium text-[11px]">vs yesterday</span>
            </div>
          </div>

          {/* Bottom Sparkline Wave */}
          <SparklineWave color="#10b981" id="cash" waveType={1} />
        </div>

        {/* Card 2: Today's Bank */}
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-white via-sky-50/20 to-sky-50/50 border border-sky-200/90 p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between min-h-[148px]">
          <div>
            {/* Header: Icon + Title + Action Chevron */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Building className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-tight font-sans">
                  Today's Bank
                </span>
              </div>
              <button
                onClick={() => onQuickAction('day_book')}
                className="w-6 h-6 rounded-lg border border-sky-200/80 bg-white/90 text-sky-600 flex items-center justify-center hover:bg-sky-100/60 transition-colors shadow-2xs cursor-pointer"
                title="View Bank Balances"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Value */}
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-blue-900 tracking-tight mt-2 mb-1.5">
              {formatCurrency(totalBankBalance)}
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center space-x-1.5 text-[11px] relative z-10">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-extrabold text-[10px]">
                ↑ 4.2%
              </span>
              <span className="text-slate-400 font-medium text-[11px]">vs yesterday</span>
            </div>
          </div>

          {/* Bottom Sparkline Wave */}
          <SparklineWave color="#0284c7" id="bank" waveType={2} />
        </div>

        {/* Card 3: Today's Sales */}
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-white via-amber-50/20 to-amber-50/50 border border-amber-200/90 p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between min-h-[148px]">
          <div>
            {/* Header: Icon + Title + Action Chevron */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-tight font-sans">
                  Today's Sales
                </span>
              </div>
              <button
                onClick={() => onQuickAction('sales_invoice')}
                className="w-6 h-6 rounded-lg border border-amber-200/80 bg-white/90 text-amber-600 flex items-center justify-center hover:bg-amber-100/60 transition-colors shadow-2xs cursor-pointer"
                title="View Sales Invoices (F4)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Value */}
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-900 tracking-tight mt-2 mb-1.5">
              ₹2,84,500
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center space-x-1.5 text-[11px] relative z-10">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                ↑ 12.4%
              </span>
              <span className="text-slate-400 font-medium text-[11px]">vs yesterday</span>
            </div>
          </div>

          {/* Bottom Sparkline Wave */}
          <SparklineWave color="#f59e0b" id="sales" waveType={3} />
        </div>

        {/* Card 4: Today's Purchase */}
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-white via-orange-50/20 to-orange-50/50 border border-orange-200/90 p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between min-h-[148px]">
          <div>
            {/* Header: Icon + Title + Action Chevron */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-tight font-sans">
                  Today's Purchase
                </span>
              </div>
              <button
                onClick={() => onQuickAction('purchase')}
                className="w-6 h-6 rounded-lg border border-orange-200/80 bg-white/90 text-orange-600 flex items-center justify-center hover:bg-orange-100/60 transition-colors shadow-2xs cursor-pointer"
                title="View Purchases (F5)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Value */}
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-orange-950 tracking-tight mt-2 mb-1.5">
              ₹1,95,000
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center space-x-1.5 text-[11px] relative z-10">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[10px]">
                ↓ 6.3%
              </span>
              <span className="text-slate-400 font-medium text-[11px]">vs yesterday</span>
            </div>
          </div>

          {/* Bottom Sparkline Wave */}
          <SparklineWave color="#ea580c" id="purchase" waveType={1} />
        </div>

        {/* Card 5: Orders Pending */}
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-white via-rose-50/20 to-rose-50/50 border border-rose-200/90 p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between min-h-[148px]">
          <div>
            {/* Header: Icon + Title + Action Chevron */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-tight font-sans">
                  Orders Pending
                </span>
              </div>
              <button
                onClick={() => onQuickAction('new_order')}
                className="w-6 h-6 rounded-lg border border-rose-200/80 bg-white/90 text-rose-600 flex items-center justify-center hover:bg-rose-100/60 transition-colors shadow-2xs cursor-pointer"
                title="View Orders (F7)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Value */}
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-rose-600 tracking-tight mt-2 mb-1.5">
              {pendingOrdersCount} Orders
            </div>

            {/* Subtitle / Delivery Alert */}
            <div className="flex items-center space-x-1 text-rose-600 text-[11px] font-bold relative z-10">
              <Clock className="w-3.5 h-3.5" />
              <span>2 Due for Delivery</span>
            </div>
          </div>

          {/* Bottom Right Arrow Link */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onQuickAction('new_order')}
              className="text-rose-600 hover:text-rose-800 transition-colors p-1"
              title="Open Orders"
            >
              <ArrowRight className="w-4 h-4 text-rose-600" />
            </button>
          </div>
        </div>

        {/* Card 6: New Walk-Ins */}
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-white via-teal-50/20 to-teal-50/50 border border-teal-200/90 p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between min-h-[148px]">
          <div>
            {/* Header: Icon + Title + Action Chevron */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-tight font-sans">
                  New Walk-Ins
                </span>
              </div>
              <button
                className="w-6 h-6 rounded-lg border border-teal-200/80 bg-white/90 text-teal-600 flex items-center justify-center hover:bg-teal-100/60 transition-colors shadow-2xs cursor-pointer"
                title="Visitor CRM"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Value */}
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-teal-950 tracking-tight mt-2 mb-1.5">
              14 Visitors
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center space-x-1.5 text-[11px] relative z-10">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                ↑ 27%
              </span>
              <span className="text-slate-400 font-medium text-[11px]">vs yesterday</span>
            </div>
          </div>

          {/* Bottom Sparkline Wave */}
          <SparklineWave color="#0d9488" id="walkins" waveType={2} />
        </div>

        {/* Card 7: Total Footfall */}
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-b from-white via-purple-50/20 to-purple-50/50 border border-purple-200/90 p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between min-h-[148px]">
          <div>
            {/* Header: Icon + Title + Action Chevron */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-tight font-sans">
                  Total Footfall
                </span>
              </div>
              <button
                className="w-6 h-6 rounded-lg border border-purple-200/80 bg-white/90 text-purple-600 flex items-center justify-center hover:bg-purple-100/60 transition-colors shadow-2xs cursor-pointer"
                title="Footfall Counter"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Value */}
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-purple-950 tracking-tight mt-2 mb-1.5">
              38 Guests
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center space-x-1.5 text-[11px] relative z-10">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                ↑ 16%
              </span>
              <span className="text-slate-400 font-medium text-[11px]">vs yesterday</span>
            </div>
          </div>

          {/* Bottom Sparkline Wave */}
          <SparklineWave color="#9333ea" id="footfall" waveType={3} />
        </div>
      </div>

      {/* 2. CURRENT STOCK BREAKDOWN (5 Categories: Imitation 1gm, URD Silver, URD Gold, Silver, Gold) */}
      <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl p-4 sm:p-5 shadow-xs space-y-4`}>
        <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3 gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Current Stock Vault Breakdown
              </h2>
              <span className="text-[10px] text-slate-400">Pure Gold, Silver, URD Scraps, and Imitation</span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-[11px] font-mono font-bold text-blue-950 flex items-center space-x-1.5">
            <span className="text-slate-500 font-sans font-normal text-[10px]">Total Fine Bullion:</span>
            <strong className="text-blue-900 font-extrabold">{formatWeight(totalStockFineWt)}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {stockCategories.map((stk, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all duration-150 space-y-2.5"
            >
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900 text-xs truncate font-sans" title={stk.name}>
                  {stk.name}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shadow-2xs ${stk.badge}`}>
                  {stk.pcs} Pcs
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span className="font-sans text-[10px] text-slate-400">Gross Wt:</span>
                  <span className="font-bold text-slate-800">{formatWeight(stk.gross_wt)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-sans text-[10px] text-slate-400">Net Wt:</span>
                  <span className="font-bold text-blue-900">{formatWeight(stk.net_wt)}</span>
                </div>
                <div className="flex justify-between text-amber-900 pt-1.5 border-t border-slate-200/80 font-bold">
                  <span className="font-sans text-[10px] text-amber-800 font-semibold">Fine Gold/Sil:</span>
                  <span className="font-extrabold">{formatWeight(stk.fine_wt)}</span>
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

