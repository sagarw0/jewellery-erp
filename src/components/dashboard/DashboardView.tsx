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
  ChevronDown,
  ArrowRight,
  Banknote,
  ShoppingCart,
  FileText,
  Copy,
  Check,
  MessageCircle,
  PhoneCall,
  ExternalLink,
  Building2
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { NewOrderBookingRecord, SundryDebtorRow, StockItem, ThemeId } from '../../types/erp';
import { useTheme } from '../../context/ThemeContext';
import { WhatsAppShareModal } from '../common/WhatsAppShareModal';
import {
  GoldBars3DVisual,
  SilverBars3DVisual,
  GoldScrap3DVisual,
  SilverScrap3DVisual,
  ImitationBar3DVisual,
  LuxuryRingsBannerVisual
} from './Bullion3DVisuals';

interface DashboardViewProps {
  onQuickAction: (actionId: string) => void;
  gold24kRate: number;
  gold22kRate: number;
  silverRate: number;
  orders: NewOrderBookingRecord[];
  debtors: SundryDebtorRow[];
  stockItems: StockItem[];
  currentUser?: { code: string; name: string; role: string; branch: string } | null;
  onOpenBullionRates?: () => void;
  onOpenThemePicker?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onQuickAction,
  gold24kRate,
  gold22kRate,
  silverRate,
  orders,
  debtors,
  stockItems,
  currentUser,
  onOpenBullionRates,
  onOpenThemePicker,
}) => {
  const { currentTheme, isDark, setTheme } = useTheme();
  const [activeNoticeTab, setActiveNoticeTab] = useState<'all' | 'receivables' | 'orders' | 'birthdays' | 'bhishi'>('all');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // WhatsApp modal state for interactive alerts
  const [whatsAppModal, setWhatsAppModal] = useState<{
    isOpen: boolean;
    recipientName: string;
    phone: string;
    defaultMessage: string;
  }>({
    isOpen: false,
    recipientName: '',
    phone: '',
    defaultMessage: '',
  });

  // Dynamic Date calculations for top banner
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'short' });
  const dayOfMonth = today.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Ramesh';

  // Calculations for dynamic dashboard metrics
  const pendingOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const totalStockFineWt = stockItems.reduce((s, it) => s + (it.fine_wt || 0), 0) || 1009.694;

  // Bank Balances (Itemized)
  const bankAccounts = [
    { bank_name: 'HDFC Bank (Current A/c - Zaveri)', account_no: '4920881920', mask: '•••• 4920', balance: 485200, type: 'Current' },
    { bank_name: 'State Bank of India (Bullion Clearing)', account_no: '8831990211', mask: '•••• 8831', balance: 245000, type: 'Current' },
    { bank_name: 'ICICI Bank (POS Counter Swipe)', account_no: '1209348821', mask: '•••• 1209', balance: 132400, type: 'OD / CC' },
    { bank_name: 'Kotak Mahindra (Showroom Petty Cash)', account_no: '6542119024', mask: '•••• 6542', balance: 78500, type: 'Savings' },
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
      fine_wt: 1308.9,
      pcs: 148,
      valuation: 18195688.30,
      visual: <GoldBars3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-105 duration-300" />,
      color: 'from-amber-500 to-yellow-600',
      bgGlow: 'bg-white/80 backdrop-blur-xl border border-white/90 hover:border-amber-400 hover:shadow-lg',
      badge: 'bg-amber-100/80 text-amber-900 border-amber-300/80 font-bold',
      barColor: 'bg-gradient-to-r from-amber-400 to-amber-600',
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
      valuation: 2755171.35,
      visual: <SilverBars3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-105 duration-300" />,
      color: 'from-slate-400 to-slate-600',
      bgGlow: 'bg-white/80 backdrop-blur-xl border border-white/90 hover:border-sky-400 hover:shadow-lg',
      badge: 'bg-sky-100/80 text-sky-900 border-sky-300/80 font-bold',
      barColor: 'bg-gradient-to-r from-slate-400 to-sky-500',
    },
    {
      name: 'URD Gold (Old Scrap)',
      category: 'URD Gold',
      purity_label: '83.0% Touch',
      purity_pct: 82.6,
      gross_wt: 184.5,
      net_wt: 178.0,
      fine_wt: 152.4,
      pcs: 22,
      valuation: 2088986.42,
      visual: <GoldScrap3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-105 duration-300" />,
      color: 'from-yellow-600 to-amber-700',
      bgGlow: 'bg-white/80 backdrop-blur-xl border border-white/90 hover:border-amber-500 hover:shadow-lg',
      badge: 'bg-amber-100/80 text-amber-900 border-amber-300/80 font-bold',
      barColor: 'bg-gradient-to-r from-amber-500 to-amber-700',
    },
    {
      name: 'URD Silver (Old Scrap)',
      category: 'URD Silver',
      purity_label: '77.7% Touch',
      purity_pct: 77.7,
      gross_wt: 2450.0,
      net_wt: 2380.0,
      fine_wt: 1904.0,
      pcs: 16,
      valuation: 380752.40,
      visual: <SilverScrap3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-105 duration-300" />,
      color: 'from-zinc-500 to-zinc-700',
      bgGlow: 'bg-white/80 backdrop-blur-xl border border-white/90 hover:border-slate-400 hover:shadow-lg',
      badge: 'bg-slate-100 text-slate-800 border-slate-300 font-bold',
      barColor: 'bg-gradient-to-r from-slate-400 to-slate-600',
    },
    {
      name: 'Imitation (1gm Micro-Plate)',
      category: 'Imitation (1 gm)',
      purity_label: '1gm Micro-Plate',
      purity_pct: 0.0,
      gross_wt: 3200.0,
      net_wt: 3200.0,
      fine_wt: 0,
      pcs: 420,
      valuation: 189000.00,
      visual: <ImitationBar3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-105 duration-300" />,
      color: 'from-pink-500 to-rose-600',
      bgGlow: 'bg-white/80 backdrop-blur-xl border border-white/90 hover:border-pink-400 hover:shadow-lg',
      badge: 'bg-pink-100/80 text-pink-900 border-pink-300/80 font-bold',
      barColor: 'bg-gradient-to-r from-pink-400 to-rose-500',
    },
  ];

  const totalVaultValuation = 23609598.47;

  // Notice Panel Items (Interactive with actions)
  const noticeItems = [
    {
      id: 'n-1',
      type: 'order_due',
      title: 'Order Delivery Due Today (#ORD-2026-904)',
      subtitle: 'Customer: Mrs. Sunita Deshmukh • 22K Bridal Necklace (45g)',
      amount: 45000,
      tag: 'Order to be Given',
      actionLabel: 'View Order (F7)',
      actionType: 'order',
      phone: '9820011223',
      name: 'Mrs. Sunita Deshmukh',
      color: 'border-l-blue-500',
    },
    {
      id: 'n-2',
      type: 'receivable',
      title: 'Debtor Balance Due (#AC-104)',
      subtitle: 'Party: Rajesh Gems & Bullion Wholesale • Pending WT: 42.500g',
      amount: 285000,
      tag: "Today's Receivable",
      actionLabel: 'Send Reminder',
      actionType: 'reminder',
      phone: '9811055432',
      name: 'Rajesh Gems & Bullion',
      color: 'border-l-emerald-500',
    },
    {
      id: 'n-3',
      type: 'birthday',
      title: 'Customer Birthday Today 🎂',
      subtitle: 'Mrs. Ananya Kulkarni (Gold Scheme #GS-1029) • 10% Discount Offer',
      tag: 'Birthday Alert',
      actionLabel: 'Send WhatsApp Wish',
      actionType: 'wish',
      phone: '9842299881',
      name: 'Mrs. Ananya Kulkarni',
      color: 'border-l-pink-500',
    },
    {
      id: 'n-4',
      type: 'anniversary',
      title: 'Wedding Anniversary Greeting 💍',
      subtitle: 'Mr. & Mrs. Deepak Mehta (VIP Customer) • 15th Anniversary',
      tag: 'Anniversary Alert',
      actionLabel: 'Send Greeting',
      actionType: 'anniversary',
      phone: '9825044321',
      name: 'Mr. & Mrs. Deepak Mehta',
      color: 'border-l-purple-500',
    },
    {
      id: 'n-5',
      type: 'bhishi',
      title: 'Bhishi (Gold Scheme) Monthly Installment Due',
      subtitle: '18 Members pending for Swarna Nidhi 11+1 Scheme (August Cycle)',
      amount: 90000,
      tag: 'Bhishi Due',
      actionLabel: 'View Scheme',
      actionType: 'bhishi',
      phone: '9833012345',
      name: 'Swarna Nidhi Group A',
      color: 'border-l-amber-500',
    },
  ];

  const handleCopyAccount = (acc: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedAccount(acc);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleAlertAction = (n: typeof noticeItems[0]) => {
    if (n.actionType === 'order') {
      onQuickAction('new_order');
    } else if (n.actionType === 'bhishi') {
      onQuickAction('gold_scheme');
    } else {
      let msg = '';
      if (n.actionType === 'wish') {
        msg = `Dear ${n.name}, wishing you a very Happy Birthday from Swarna Jewellers! Enjoy a special 10% making charge waiver on your birthday purchase today! ✨`;
      } else if (n.actionType === 'anniversary') {
        msg = `Warmest congratulations on your Wedding Anniversary, ${n.name}! May your bond shine brighter each year. Best wishes from Swarna Jewellers! 💍`;
      } else if (n.actionType === 'reminder') {
        msg = `Dear ${n.name}, friendly reminder regarding outstanding balance of ${formatCurrency(n.amount || 0)} against invoice. Kindly remit via NEFT/RTGS. Thank you!`;
      }
      setWhatsAppModal({
        isOpen: true,
        recipientName: n.name,
        phone: n.phone,
        defaultMessage: msg,
      });
    }
  };

  const filteredNotices = noticeItems.filter((n) => {
    if (activeNoticeTab === 'all') return true;
    if (activeNoticeTab === 'receivables') return n.type === 'receivable';
    if (activeNoticeTab === 'orders') return n.type === 'order_due';
    if (activeNoticeTab === 'birthdays') return n.type === 'birthday' || n.type === 'anniversary';
    if (activeNoticeTab === 'bhishi') return n.type === 'bhishi';
    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 0. TOP WELCOME CARD (Apple iOS Translucent Frosted Glass Banner with Rings Art) */}
      <div className="relative overflow-hidden rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Date Capsule & Greeting */}
        <div className="flex items-center space-x-3.5 sm:space-x-4 z-10">
          {/* Date Capsule */}
          <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-2xl px-3.5 py-2 text-center shadow-xs min-w-[65px] flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-tight">
              {dayOfWeek}
            </span>
            <span className="text-sm sm:text-base font-black text-slate-900 leading-tight">
              {dayOfMonth}
            </span>
          </div>

          {/* Greeting and Subtitle */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Good Morning, {userName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Here's what's happening at your showroom today.
            </p>
          </div>
        </div>

        {/* Right: Subtle Rings Visual + Showroom & Theme Buttons */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 z-10">
          {/* Luxury Gold Rings Decorative Render */}
          <div className="hidden lg:block opacity-90 -my-4 -mr-2 pointer-events-none">
            <LuxuryRingsBannerVisual className="w-36 h-16" />
          </div>

          {/* Main Showroom Button */}
          <button
            onClick={() => onQuickAction('account_display')}
            className="bg-white/85 hover:bg-white border border-slate-200/90 rounded-full px-4 py-2 flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-800 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
          >
            <Building2 className="w-4 h-4 text-blue-600 group-hover:scale-105 transition-transform" />
            <span>Main Showroom</span>
          </button>

          {/* Theme Selector Button */}
          <button
            onClick={() => {
              if (onOpenThemePicker) {
                onOpenThemePicker();
              } else {
                const themeList: ThemeId[] = ['apple-glass', 'light-blue', 'royal-gold', 'emerald-luxury', 'rose-gold', 'velvet-purple', 'platinum-ice', 'ruby-regal', 'obsidian-velvet'];
                const curIdx = themeList.indexOf(currentTheme.id);
                const nextTheme = themeList[(curIdx + 1) % themeList.length];
                setTheme(nextTheme);
              }
            }}
            className="bg-white/85 hover:bg-white border border-slate-200/90 rounded-full px-4 py-2 flex items-center space-x-2 text-xs sm:text-sm font-bold text-slate-800 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
            title="Switch ERP Theme (Includes Apple iOS Frosted Glass)"
          >
            <Sparkles className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
            <span>Theme</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* 1. TOP METRICS STRIP (7 Floating Frosted Glass Metric Cards matching reference UI) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 items-stretch">
        {/* Card 1: Today's Cash */}
        <div
          onClick={() => onQuickAction('day_book')}
          className="bg-white/80 backdrop-blur-xl border border-white/90 p-3.5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[126px] group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold tracking-tight text-slate-900 truncate">
                Today's Cash
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950">
              ₹1,42,600
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px]">
              ↑ 8.5%
            </span>
            <span className="text-slate-500 font-medium truncate">vs yesterday</span>
          </div>
        </div>

        {/* Card 2: Today's Bank */}
        <div
          onClick={() => onQuickAction('day_book')}
          className="bg-white/80 backdrop-blur-xl border border-white/90 p-3.5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[126px] group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-sky-50 text-sky-600 border border-sky-200/60 shadow-2xs group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
                <Building className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold tracking-tight text-slate-900 truncate">
                Today's Bank
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950">
              ₹9,41,100.00
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-sky-50 text-sky-700 border border-sky-200/80 text-[10px]">
              ↑ 4.2%
            </span>
            <span className="text-slate-500 font-medium truncate">4 Active A/cs</span>
          </div>
        </div>

        {/* Card 3: Today's Sales */}
        <div
          onClick={() => onQuickAction('sales_invoice')}
          className="bg-white/80 backdrop-blur-xl border border-white/90 p-3.5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[126px] group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600 border border-amber-200/60 shadow-2xs group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold tracking-tight text-slate-900 truncate">
                Today's Sales
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950">
              ₹2,84,500
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px]">
              ↑ 12.4%
            </span>
            <span className="text-slate-500 font-medium truncate">vs yesterday</span>
          </div>
        </div>

        {/* Card 4: Today's Purchase */}
        <div
          onClick={() => onQuickAction('purchase')}
          className="bg-white/80 backdrop-blur-xl border border-white/90 p-3.5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[126px] group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-rose-50 text-rose-600 border border-rose-200/60 shadow-2xs group-hover:bg-rose-600 group-hover:text-white transition-colors shrink-0">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold tracking-tight text-slate-900 truncate">
                Today's Purchase
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950">
              ₹1,95,000
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200/80 text-[10px]">
              ↓ 6.3%
            </span>
            <span className="text-slate-500 font-medium truncate">Bullion Inward</span>
          </div>
        </div>

        {/* Card 5: Orders Pending */}
        <div
          onClick={() => onQuickAction('new_order')}
          className="bg-white/80 backdrop-blur-xl border border-white/90 p-3.5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[126px] group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-pink-50 text-pink-600 border border-pink-200/60 shadow-2xs group-hover:bg-pink-600 group-hover:text-white transition-colors shrink-0">
                <Package className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold tracking-tight text-slate-900 truncate">
                Orders Pending
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950">
              {pendingOrdersCount || 2} Orders
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200/80 text-[10px]">
              2 Due
            </span>
            <span className="text-slate-500 font-medium truncate">Delivery Today</span>
          </div>
        </div>

        {/* Card 6: New Walk-Ins */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/90 p-3.5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-[126px] group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-cyan-50 text-cyan-600 border border-cyan-200/60 shadow-2xs group-hover:bg-cyan-600 group-hover:text-white transition-colors shrink-0">
                <UserPlus className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold tracking-tight text-slate-900 truncate">
                New Walk-ins
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950">
              14 Visitors
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px]">
              ↑ 27%
            </span>
            <span className="text-slate-500 font-medium truncate">New Profiles</span>
          </div>
        </div>

        {/* Card 7: Total Footfall */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/90 p-3.5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-[126px] group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600 border border-purple-200/60 shadow-2xs group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold tracking-tight text-slate-900 truncate">
                Total Footfall
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950">
              38 Guests
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px]">
              ↑ 16%
            </span>
            <span className="text-slate-500 font-medium truncate">Showroom Total</span>
          </div>
        </div>
      </div>

      {/* 2. CURRENT STOCK VAULT BREAKDOWN (Executive-Grade Bullion Dashboard with 3D Photorealistic Bullion Renders) */}
      <div className="rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/90 p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
        {/* Header Bar */}
        <div className="flex flex-wrap justify-between items-center border-b border-slate-200/80 pb-3 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/20">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">
                  CURRENT STOCK VAULT BREAKDOWN
                </h2>
                <button
                  onClick={onOpenBullionRates}
                  className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full px-2.5 py-0.5 text-xs font-bold flex items-center space-x-1.5 cursor-pointer hover:bg-emerald-100 transition-all shadow-2xs"
                  title="Click to view live market rate center"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <span>Live Market Rates</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pure Gold 24K: ₹13987/g • 22K (916): ₹12812/g • Pure Silver: ₹210.5/g
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
            {onOpenBullionRates && (
              <button
                onClick={onOpenBullionRates}
                className="bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 border border-amber-300/80 rounded-full px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-amber-700" />
                <span>Rate Center</span>
              </button>
            )}

            <div className="bg-sky-50 text-sky-900 border border-sky-200/80 rounded-full px-3.5 py-1.5 text-xs font-mono font-bold shadow-xs flex items-center space-x-1.5">
              <span className="font-sans text-[11px] font-medium text-sky-700">Total Fine Bullion:</span>
              <span className="font-black text-sky-950">{formatWeight(totalStockFineWt)}</span>
            </div>

            <div className="bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-full px-3.5 py-1.5 text-xs font-mono font-bold shadow-xs flex items-center space-x-1.5">
              <span className="font-sans text-[11px] font-medium text-emerald-700">Vault Valuation:</span>
              <span className="font-black text-emerald-950">{formatCurrency(totalVaultValuation)}</span>
            </div>
          </div>
        </div>

        {/* 5 Stock Category Cards with 3D Bullion Visuals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {stockCategories.map((stk, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl transition-all duration-200 space-y-2.5 shadow-xs hover:shadow-md group ${stk.bgGlow}`}
            >
              {/* Card Header: Category & Pcs */}
              <div className="flex justify-between items-start">
                <div className="min-w-0 pr-1">
                  <div className="font-black text-xs font-sans text-slate-900 truncate" title={stk.name}>
                    {stk.name}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500">
                    {stk.purity_label}
                  </div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border shadow-2xs shrink-0 ${stk.badge}`}>
                  {stk.pcs} Pcs
                </span>
              </div>

              {/* 3D Photorealistic Bullion Render */}
              <div className="flex items-center justify-center py-1">
                {stk.visual}
              </div>

              {/* Live Est. Value Pill */}
              <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-xs font-bold shadow-2xs">
                <span className="font-sans text-[10.5px] font-medium text-slate-600">Live Est. Value:</span>
                <span className="font-mono font-black text-slate-950">
                  {formatCurrency(stk.valuation)}
                </span>
              </div>

              {/* Weights Monospace Breakdown */}
              <div className="space-y-1 font-mono text-xs p-2 rounded-xl border border-slate-200/80 bg-white/90 shadow-2xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-sans text-[10.5px] font-medium text-slate-600">Gross Wt:</span>
                  <span className="font-bold text-slate-950">{formatWeight(stk.gross_wt)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-sans text-[10.5px] font-medium text-slate-600">Net Wt:</span>
                  <span className="font-bold text-slate-950">{formatWeight(stk.net_wt)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200/80 font-bold text-[11px]">
                  <span className="font-sans text-[10.5px] font-medium text-slate-600">Fine Metal:</span>
                  <span className="font-black text-slate-950">{formatWeight(stk.fine_wt)}</span>
                </div>
              </div>

              {/* Purity Equiv Bar */}
              <div className="space-y-1 pt-0.5">
                <div className="flex justify-between text-[10.5px] font-mono">
                  <span className="font-bold font-sans text-slate-600">Purity Equiv</span>
                  <span className="font-black text-slate-950">{stk.purity_pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-200/80">
                  <div
                    className={`h-full rounded-full ${stk.barColor}`}
                    style={{ width: `${Math.max(stk.purity_pct, 4)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TABULAR FORMAT (Cash in Hand & Cash in Bank) & 4. NOTICE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left (7 Cols): Tabular Cash in Hand & Cash in Bank */}
        <div className="lg:col-span-7 rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/90 p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 shadow-2xs">
                <CreditCard className="w-4 h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                Financial Balances: Cash in Hand & Bank A/cs
              </h2>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full border bg-emerald-50 border-emerald-200/80 text-emerald-900 shadow-2xs">
              Total: {formatCurrency(cashInHand + totalBankBalance)}
            </span>
          </div>

          {/* Cash in Hand Banner */}
          <div className="p-3.5 rounded-2xl flex justify-between items-center shadow-2xs border bg-emerald-50/80 border-emerald-200/80 text-emerald-950">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-2xs">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-black text-xs sm:text-sm text-emerald-950">
                  Physical Cash in Hand (Till)
                </div>
                <div className="text-[11px] font-medium text-emerald-800">
                  Counter Opening + Sales Collections Reconciled
                </div>
              </div>
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-950">
              {formatCurrency(cashInHand)}
            </div>
          </div>

          {/* Cash in Bank Table (Individual Bank Breakdown) */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Cash in Bank (Individual Accounts)
            </div>

            <div className="overflow-x-auto border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs bg-white/90">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="font-bold border-b border-slate-200/90 bg-slate-50/90 text-slate-800 select-none">
                  <tr>
                    <th className="p-3 border-r border-slate-200/80">Bank Name & Branch</th>
                    <th className="p-3 border-r border-slate-200/80 w-28 text-center">A/c No</th>
                    <th className="p-3 border-r border-slate-200/80 w-20 text-center">Type</th>
                    <th className="p-3 text-right w-32">Live Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {bankAccounts.map((b, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-sky-50/40">
                      <td className="p-3 border-r border-slate-200/60 font-sans font-bold text-slate-900">
                        {b.bank_name}
                      </td>
                      <td className="p-3 border-r border-slate-200/60 text-center text-slate-700">
                        <button
                          onClick={() => handleCopyAccount(b.account_no)}
                          className="inline-flex items-center space-x-1 hover:text-blue-600 font-bold transition-colors cursor-pointer group"
                          title="Click to copy account number"
                        >
                          <span>{b.mask}</span>
                          {copiedAccount === b.account_no ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                          )}
                        </button>
                      </td>
                      <td className="p-3 border-r border-slate-200/60 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {b.type}
                        </span>
                      </td>
                      <td className="p-3 text-right font-black text-slate-950">
                        {formatCurrency(b.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="font-mono border-t border-slate-200 bg-slate-50/90 text-slate-950 font-bold text-xs">
                  <tr>
                    <td colSpan={3} className="p-3 font-sans uppercase text-right font-bold text-slate-700">
                      Total Cash in Bank:
                    </td>
                    <td className="p-3 text-right font-black text-slate-950">
                      {formatCurrency(totalBankBalance)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right (5 Cols): NOTICE PANEL */}
        <div className="lg:col-span-5 rounded-3xl bg-white/75 backdrop-blur-2xl border border-white/90 p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3.5">
          <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-2xs">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                Showroom Alerts & Reminders
              </h2>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold border bg-rose-50 border-rose-200/80 text-rose-700 shadow-2xs">
              {noticeItems.length} Pending
            </span>
          </div>

          {/* Notice Filter Tabs */}
          <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
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
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer ${
                  activeNoticeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notices List with interactive quick actions */}
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {filteredNotices.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border border-l-4 transition-all space-y-2 bg-white/90 hover:bg-white border-slate-200/90 shadow-2xs ${n.color}`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs sm:text-sm font-sans text-slate-900">
                    {n.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs bg-slate-100 border-slate-200 text-slate-800">
                    {n.tag}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 leading-tight">
                  {n.subtitle}
                </p>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                  {n.amount ? (
                    <div className="text-xs font-mono font-black text-slate-950">
                      Amount: {formatCurrency(n.amount)}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 font-medium font-sans">Action pending</div>
                  )}

                  {/* Interactive Action Button */}
                  <button
                    onClick={() => handleAlertAction(n)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      n.type === 'birthday' || n.type === 'anniversary'
                        ? 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200'
                        : n.type === 'receivable'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    {n.type === 'birthday' || n.type === 'anniversary' || n.type === 'receivable' ? (
                      <MessageCircle className="w-3.5 h-3.5" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5" />
                    )}
                    <span>{n.actionLabel}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp Share / Dispatch Modal for interactive actions */}
      <WhatsAppShareModal
        isOpen={whatsAppModal.isOpen}
        onClose={() => setWhatsAppModal((prev) => ({ ...prev, isOpen: false }))}
        recipientName={whatsAppModal.recipientName}
        phone={whatsAppModal.phone}
        defaultMessage={whatsAppModal.defaultMessage}
      />
    </div>
  );
};
