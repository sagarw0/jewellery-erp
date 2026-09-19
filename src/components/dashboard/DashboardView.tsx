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
  Building2,
  TrendingDown,
  ArrowUpRight,
  ShieldCheck,
  Flame
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
  ImitationBar3DVisual
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

  // Calculations for dynamic dashboard metrics
  const pendingOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const totalStockFineWt = stockItems.reduce((s, it) => s + (it.fine_wt || 0), 0) || 1009.694;

  // Bank Balances (Itemized)
  const bankAccounts = [
    { bank_name: 'HDFC Bank (Current A/c - Zaveri)', account_no: '4920881920', mask: '•••• 4920', balance: 485200, type: 'Current', ifsc: 'HDFC0000128', iconColor: 'bg-blue-600' },
    { bank_name: 'State Bank of India (Bullion Clearing)', account_no: '8831990211', mask: '•••• 8831', balance: 245000, type: 'Current', ifsc: 'SBIN0001402', iconColor: 'bg-sky-600' },
    { bank_name: 'ICICI Bank (POS Counter Swipe)', account_no: '1209348821', mask: '•••• 1209', balance: 132400, type: 'OD / CC', ifsc: 'ICIC0000045', iconColor: 'bg-amber-600' },
    { bank_name: 'Kotak Mahindra (Showroom Petty Cash)', account_no: '6542119024', mask: '•••• 6542', balance: 78500, type: 'Savings', ifsc: 'KKBK0000212', iconColor: 'bg-red-600' },
  ];

  const totalBankBalance = bankAccounts.reduce((s, b) => s + b.balance, 0);
  const cashInHand = 142600;

  // Stock Category Breakdown with live market valuations
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
      visual: <GoldBars3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-108 duration-300 drop-shadow-lg" />,
      glowGrad: 'from-amber-400/15 via-yellow-300/10 to-transparent',
      borderColor: 'border-amber-200/80 hover:border-amber-400',
      badge: 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-300/80 font-bold',
      barColor: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
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
      visual: <SilverBars3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-108 duration-300 drop-shadow-lg" />,
      glowGrad: 'from-sky-400/15 via-slate-300/10 to-transparent',
      borderColor: 'border-sky-200/80 hover:border-sky-400',
      badge: 'bg-sky-500/15 text-sky-900 dark:text-sky-200 border-sky-300/80 font-bold',
      barColor: 'bg-gradient-to-r from-slate-400 via-sky-300 to-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]',
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
      visual: <GoldScrap3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-108 duration-300 drop-shadow-lg" />,
      glowGrad: 'from-amber-600/15 via-orange-300/10 to-transparent',
      borderColor: 'border-amber-300/80 hover:border-amber-500',
      badge: 'bg-amber-600/15 text-amber-900 dark:text-amber-200 border-amber-400/80 font-bold',
      barColor: 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]',
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
      visual: <SilverScrap3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-108 duration-300 drop-shadow-lg" />,
      glowGrad: 'from-zinc-400/15 via-slate-300/10 to-transparent',
      borderColor: 'border-slate-300/80 hover:border-slate-500',
      badge: 'bg-slate-500/15 text-slate-800 dark:text-slate-200 border-slate-300 font-bold',
      barColor: 'bg-gradient-to-r from-slate-400 via-zinc-400 to-slate-600 shadow-[0_0_10px_rgba(148,163,184,0.5)]',
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
      visual: <ImitationBar3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-108 duration-300 drop-shadow-lg" />,
      glowGrad: 'from-pink-400/15 via-rose-300/10 to-transparent',
      borderColor: 'border-pink-200/80 hover:border-pink-400',
      badge: 'bg-pink-500/15 text-pink-900 dark:text-pink-200 border-pink-300/80 font-bold',
      barColor: 'bg-gradient-to-r from-pink-400 via-rose-400 to-pink-600 shadow-[0_0_10px_rgba(244,114,182,0.5)]',
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
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
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
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
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
      badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
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
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
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
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
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
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
      {/* 1. TOP EXECUTIVE METRICS STRIP (7 Floating Luxury Frosted Glass Cards with Glow Accents) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 items-stretch">
        {/* Card 1: Today's Cash */}
        <div
          onClick={() => onQuickAction('day_book')}
          className="relative overflow-hidden bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/90 dark:border-slate-700/80 p-3.5 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 hover:border-emerald-400 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[132px] group"
        >
          {/* Subtle ambient accent glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-400/20 transition-all" />
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-400 to-teal-500 opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-700/60 shadow-xs group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white truncate">
                Today's Cash
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950 dark:text-emerald-300">
              ₹1,42,600
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 text-[10px]">
              ↑ 8.5%
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium truncate">vs yesterday</span>
          </div>
        </div>

        {/* Card 2: Today's Bank */}
        <div
          onClick={() => onQuickAction('day_book')}
          className="relative overflow-hidden bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/90 dark:border-slate-700/80 p-3.5 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 hover:border-sky-400 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[132px] group"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-sky-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-sky-400/20 transition-all" />
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-sky-400 to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950 dark:to-sky-900 text-sky-600 dark:text-sky-400 border border-sky-200/80 dark:border-sky-700/60 shadow-xs group-hover:scale-105 group-hover:bg-sky-600 group-hover:text-white transition-all shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white truncate">
                Today's Bank
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950 dark:text-sky-300">
              ₹9,41,100.00
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-300/80 text-[10px]">
              ↑ 4.2%
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium truncate">4 Active A/cs</span>
          </div>
        </div>

        {/* Card 3: Today's Sales */}
        <div
          onClick={() => onQuickAction('sales_invoice')}
          className="relative overflow-hidden bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/90 dark:border-slate-700/80 p-3.5 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[132px] group"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-amber-400/20 transition-all" />
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-400 to-yellow-500 opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-700/60 shadow-xs group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white truncate">
                Today's Sales
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950 dark:text-amber-300">
              ₹2,84,500
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 text-[10px]">
              ↑ 12.4%
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium truncate">vs yesterday</span>
          </div>
        </div>

        {/* Card 4: Today's Purchase */}
        <div
          onClick={() => onQuickAction('purchase')}
          className="relative overflow-hidden bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/90 dark:border-slate-700/80 p-3.5 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 hover:border-rose-400 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[132px] group"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-rose-400/20 transition-all" />
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-rose-400 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-700/60 shadow-xs group-hover:scale-105 group-hover:bg-rose-600 group-hover:text-white transition-all shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white truncate">
                Today's Purchase
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950 dark:text-rose-300">
              ₹1,95,000
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-300/80 text-[10px]">
              ↓ 6.3%
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium truncate">Bullion Inward</span>
          </div>
        </div>

        {/* Card 5: Orders Pending */}
        <div
          onClick={() => onQuickAction('new_order')}
          className="relative overflow-hidden bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/90 dark:border-slate-700/80 p-3.5 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 hover:border-indigo-400 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[132px] group"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-400/20 transition-all" />
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-indigo-400 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-700/60 shadow-xs group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white truncate">
                Orders Pending
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950 dark:text-indigo-300">
              {pendingOrdersCount || 2} Orders
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-300/80 text-[10px]">
              2 Due Today
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium truncate">Delivery</span>
          </div>
        </div>

        {/* Card 6: New Walk-Ins */}
        <div className="relative overflow-hidden bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/90 dark:border-slate-700/80 p-3.5 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 hover:border-teal-400 transition-all duration-300 flex flex-col justify-between h-[132px] group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-teal-400/20 transition-all" />
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-teal-400 to-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 text-teal-600 dark:text-teal-400 border border-teal-200/80 dark:border-teal-700/60 shadow-xs group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all shrink-0">
                <UserPlus className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white truncate">
                New Walk-ins
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950 dark:text-teal-300">
              14 Visitors
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 text-[10px]">
              ↑ 27%
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium truncate">New Profiles</span>
          </div>
        </div>

        {/* Card 7: Total Footfall */}
        <div className="relative overflow-hidden bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/90 dark:border-slate-700/80 p-3.5 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 hover:border-violet-400 transition-all duration-300 flex flex-col justify-between h-[132px] group">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-violet-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-violet-400/20 transition-all" />
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-violet-400 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 text-violet-600 dark:text-violet-400 border border-violet-200/80 dark:border-violet-700/60 shadow-xs group-hover:scale-105 group-hover:bg-violet-600 group-hover:text-white transition-all shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white truncate">
                Total Footfall
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-slate-950 dark:text-violet-300">
              38 Guests
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 text-[10px]">
              ↑ 16%
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium truncate">Showroom Total</span>
          </div>
        </div>
      </div>

      {/* 2. CURRENT STOCK VAULT BREAKDOWN (Executive-Grade Bullion Dashboard with 3D Photorealistic Bullion Renders) */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.04)] space-y-4">
        {/* Subtle Luxury Gold Radiant Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-48 bg-gradient-to-b from-amber-400/10 via-yellow-400/5 to-transparent blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="relative z-10 flex flex-wrap justify-between items-center border-b border-slate-200/80 dark:border-slate-800 pb-3.5 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 ring-2 ring-amber-300/40">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  CURRENT STOCK VAULT BREAKDOWN
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                </h2>
                <button
                  onClick={onOpenBullionRates}
                  className="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-400/80 rounded-full px-2.5 py-0.5 text-xs font-bold flex items-center space-x-1.5 cursor-pointer hover:bg-emerald-500/25 transition-all shadow-2xs"
                  title="Click to view live market rate center"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-ping" />
                  <span>Live Market Rates</span>
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                Pure Gold 24K: <span className="font-bold text-slate-900 dark:text-slate-200">₹13,987/g</span> • 22K (916): <span className="font-bold text-slate-900 dark:text-slate-200">₹12,812/g</span> • Pure Silver: <span className="font-bold text-slate-900 dark:text-slate-200">₹210.5/g</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
            {onOpenBullionRates && (
              <button
                onClick={onOpenBullionRates}
                className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200 border border-amber-400/80 rounded-full px-4 py-1.5 text-xs font-black flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer group"
              >
                <Scale className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
                <span>Rate Center</span>
              </button>
            )}

            <div className="bg-sky-500/15 text-sky-950 dark:text-sky-200 border border-sky-300/80 rounded-full px-3.5 py-1.5 text-xs font-mono font-bold shadow-xs flex items-center space-x-1.5">
              <span className="font-sans text-[11px] font-semibold text-sky-700 dark:text-sky-300">Total Fine Bullion:</span>
              <span className="font-black text-sky-950 dark:text-white">{formatWeight(totalStockFineWt)}</span>
            </div>

            <div className="bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 border border-emerald-300/80 rounded-full px-4 py-1.5 text-xs font-mono font-bold shadow-xs flex items-center space-x-1.5">
              <span className="font-sans text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Vault Valuation:</span>
              <span className="font-black text-emerald-950 dark:text-white">{formatCurrency(totalVaultValuation)}</span>
            </div>
          </div>
        </div>

        {/* 5 Stock Category Cards with 3D Bullion Visuals */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {stockCategories.map((stk, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden p-3.5 rounded-2xl transition-all duration-300 space-y-2.5 shadow-sm hover:shadow-xl hover:-translate-y-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border ${stk.borderColor} group`}
            >
              {/* Card ambient flare */}
              <div className={`absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br ${stk.glowGrad} rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform`} />

              {/* Card Header: Category & Pcs */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="min-w-0 pr-1">
                  <div className="font-black text-xs font-sans text-slate-900 dark:text-white truncate" title={stk.name}>
                    {stk.name}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    {stk.purity_label}
                  </div>
                </div>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-black border shadow-2xs shrink-0 ${stk.badge}`}>
                  {stk.pcs} Pcs
                </span>
              </div>

              {/* 3D Photorealistic Bullion Render */}
              <div className="relative z-10 flex items-center justify-center py-1">
                {stk.visual}
              </div>

              {/* Live Est. Value Pill */}
              <div className="relative z-10 bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-xs font-bold shadow-2xs">
                <span className="font-sans text-[10.5px] font-semibold text-slate-600 dark:text-slate-400">Live Est. Value:</span>
                <span className="font-mono font-black text-slate-950 dark:text-amber-300">
                  {formatCurrency(stk.valuation)}
                </span>
              </div>

              {/* Weights Monospace Breakdown */}
              <div className="relative z-10 space-y-1 font-mono text-xs p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/90 shadow-2xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-sans text-[10.5px] font-medium text-slate-600 dark:text-slate-400">Gross Wt:</span>
                  <span className="font-bold text-slate-950 dark:text-white">{formatWeight(stk.gross_wt)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-sans text-[10.5px] font-medium text-slate-600 dark:text-slate-400">Net Wt:</span>
                  <span className="font-bold text-slate-950 dark:text-white">{formatWeight(stk.net_wt)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200/80 dark:border-slate-800 font-bold text-[11px]">
                  <span className="font-sans text-[10.5px] font-medium text-slate-600 dark:text-slate-400">Fine Metal:</span>
                  <span className="font-black text-slate-950 dark:text-amber-300">{formatWeight(stk.fine_wt)}</span>
                </div>
              </div>

              {/* Purity Equiv Bar */}
              <div className="relative z-10 space-y-1 pt-0.5">
                <div className="flex justify-between text-[10.5px] font-mono">
                  <span className="font-bold font-sans text-slate-600 dark:text-slate-400">Purity Equiv</span>
                  <span className="font-black text-slate-950 dark:text-white">{stk.purity_pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-200/80 dark:bg-slate-700/80">
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
        <div className="lg:col-span-7 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-700/60 shadow-2xs">
                <CreditCard className="w-4 h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Financial Balances: Cash in Hand & Bank A/cs
              </h2>
            </div>
            <span className="text-xs font-mono font-black px-3.5 py-1 rounded-full border bg-emerald-500/15 border-emerald-300/80 text-emerald-950 dark:text-emerald-300 shadow-2xs">
              Total: {formatCurrency(cashInHand + totalBankBalance)}
            </span>
          </div>

          {/* Cash in Hand Banner */}
          <div className="p-3.5 rounded-2xl flex justify-between items-center shadow-xs border bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 border-emerald-300/80 text-emerald-950 dark:text-emerald-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-black text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
                  Physical Cash in Hand (Showroom Till)
                </div>
                <div className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400">
                  Counter Opening + Daily Sales Collections Reconciled
                </div>
              </div>
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-950 dark:text-emerald-300">
              {formatCurrency(cashInHand)}
            </div>
          </div>

          {/* Cash in Bank Table (Individual Bank Breakdown) */}
          <div className="space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Cash in Bank (Individual Accounts)</span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">4 Active Linked Accounts</span>
            </div>

            <div className="overflow-x-auto border border-slate-200/90 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-2xs bg-white/95 dark:bg-slate-800/90">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="font-bold border-b border-slate-200/90 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 select-none">
                  <tr>
                    <th className="p-3 border-r border-slate-200/80 dark:border-slate-700">Bank Name & Branch</th>
                    <th className="p-3 border-r border-slate-200/80 dark:border-slate-700 w-28 text-center">A/c No</th>
                    <th className="p-3 border-r border-slate-200/80 dark:border-slate-700 w-20 text-center">Type</th>
                    <th className="p-3 text-right w-32">Live Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-mono text-xs">
                  {bankAccounts.map((b, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-sky-50/40 dark:hover:bg-sky-950/30">
                      <td className="p-3 border-r border-slate-200/60 dark:border-slate-700/60 font-sans font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${b.iconColor}`} />
                        <span>{b.bank_name}</span>
                      </td>
                      <td className="p-3 border-r border-slate-200/60 dark:border-slate-700/60 text-center text-slate-700 dark:text-slate-300">
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
                      <td className="p-3 border-r border-slate-200/60 dark:border-slate-700/60 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                          {b.type}
                        </span>
                      </td>
                      <td className="p-3 text-right font-black text-slate-950 dark:text-sky-300">
                        {formatCurrency(b.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="font-mono border-t border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/90 text-slate-950 dark:text-white font-bold text-xs">
                  <tr>
                    <td colSpan={3} className="p-3 font-sans uppercase text-right font-bold text-slate-700 dark:text-slate-300">
                      Total Cash in Bank:
                    </td>
                    <td className="p-3 text-right font-black text-slate-950 dark:text-sky-300">
                      {formatCurrency(totalBankBalance)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right (5 Cols): NOTICE PANEL */}
        <div className="lg:col-span-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/90 dark:border-slate-700/80 p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.04)] space-y-3.5">
          <div className="flex justify-between items-center border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-700/60 shadow-2xs">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Showroom Alerts & Reminders
              </h2>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold border bg-rose-500/15 border-rose-300/80 text-rose-700 dark:text-rose-300 shadow-2xs">
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
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
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
                className={`p-3.5 rounded-2xl border border-l-4 transition-all space-y-2 bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 shadow-2xs hover:shadow-md ${n.color}`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs sm:text-sm font-sans text-slate-900 dark:text-white">
                    {n.title}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${n.badgeColor}`}>
                    {n.tag}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-tight">
                  {n.subtitle}
                </p>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                  {n.amount ? (
                    <div className="text-xs font-mono font-black text-slate-950 dark:text-emerald-300">
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
                        ? 'bg-pink-500/15 text-pink-700 dark:text-pink-300 hover:bg-pink-500/25 border border-pink-300/80'
                        : n.type === 'receivable'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 border border-emerald-300/80'
                        : 'bg-blue-500/15 text-blue-700 dark:text-blue-300 hover:bg-blue-500/25 border border-blue-300/80'
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
