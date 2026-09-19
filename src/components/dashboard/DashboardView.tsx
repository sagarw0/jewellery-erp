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
  Flame,
  Zap
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
    { bank_name: 'HDFC Bank (Current A/c - Zaveri)', account_no: '4920881920', mask: '•••• 4920', balance: 485200, type: 'Current', ifsc: 'HDFC0000128', iconColor: 'bg-blue-600', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
    { bank_name: 'State Bank of India (Bullion Clearing)', account_no: '8831990211', mask: '•••• 8831', balance: 245000, type: 'Current', ifsc: 'SBIN0001402', iconColor: 'bg-sky-600', badgeColor: 'bg-sky-50 text-sky-700 border-sky-200' },
    { bank_name: 'ICICI Bank (POS Counter Swipe)', account_no: '1209348821', mask: '•••• 1209', balance: 132400, type: 'OD / CC', ifsc: 'ICIC0000045', iconColor: 'bg-amber-600', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
    { bank_name: 'Kotak Mahindra (Showroom Petty Cash)', account_no: '6542119024', mask: '•••• 6542', balance: 78500, type: 'Savings', ifsc: 'KKBK0000212', iconColor: 'bg-red-600', badgeColor: 'bg-red-50 text-red-700 border-red-200' },
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
      visual: <GoldBars3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-110 duration-300 drop-shadow-xl" />,
      cardBg: 'bg-gradient-to-br from-amber-500/8 via-white/98 to-yellow-500/4 dark:from-amber-950/70 dark:to-slate-900',
      glowGrad: 'from-amber-400/20 via-yellow-300/10 to-transparent',
      borderColor: 'border-amber-200/90 hover:border-amber-400 hover:shadow-[0_15px_35px_rgba(245,158,11,0.20)]',
      badge: 'bg-amber-500/15 text-amber-950 dark:text-amber-200 border-amber-300/90 font-black',
      barColor: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.6)]',
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
      visual: <SilverBars3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-110 duration-300 drop-shadow-xl" />,
      cardBg: 'bg-gradient-to-br from-sky-500/8 via-white/98 to-blue-500/4 dark:from-sky-950/70 dark:to-slate-900',
      glowGrad: 'from-sky-400/20 via-slate-300/10 to-transparent',
      borderColor: 'border-sky-200/90 hover:border-sky-400 hover:shadow-[0_15px_35px_rgba(14,165,233,0.20)]',
      badge: 'bg-sky-500/15 text-sky-950 dark:text-sky-200 border-sky-300/90 font-black',
      barColor: 'bg-gradient-to-r from-slate-400 via-sky-300 to-sky-500 shadow-[0_0_12px_rgba(56,189,248,0.6)]',
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
      visual: <GoldScrap3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-110 duration-300 drop-shadow-xl" />,
      cardBg: 'bg-gradient-to-br from-orange-500/8 via-white/98 to-amber-600/4 dark:from-orange-950/70 dark:to-slate-900',
      glowGrad: 'from-amber-600/20 via-orange-300/10 to-transparent',
      borderColor: 'border-amber-300/90 hover:border-amber-500 hover:shadow-[0_15px_35px_rgba(217,119,6,0.20)]',
      badge: 'bg-amber-600/15 text-amber-950 dark:text-amber-200 border-amber-400/90 font-black',
      barColor: 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 shadow-[0_0_12px_rgba(217,119,6,0.6)]',
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
      visual: <SilverScrap3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-110 duration-300 drop-shadow-xl" />,
      cardBg: 'bg-gradient-to-br from-slate-400/8 via-white/98 to-zinc-500/4 dark:from-slate-950/70 dark:to-slate-900',
      glowGrad: 'from-zinc-400/20 via-slate-300/10 to-transparent',
      borderColor: 'border-slate-200/90 hover:border-slate-400 hover:shadow-[0_15px_35px_rgba(100,116,139,0.20)]',
      badge: 'bg-slate-500/15 text-slate-900 dark:text-slate-200 border-slate-300 font-black',
      barColor: 'bg-gradient-to-r from-slate-400 via-zinc-400 to-slate-600 shadow-[0_0_12px_rgba(148,163,184,0.6)]',
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
      visual: <ImitationBar3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-110 duration-300 drop-shadow-xl" />,
      cardBg: 'bg-gradient-to-br from-pink-500/8 via-white/98 to-rose-500/4 dark:from-pink-950/70 dark:to-slate-900',
      glowGrad: 'from-pink-400/20 via-rose-300/10 to-transparent',
      borderColor: 'border-pink-200/90 hover:border-pink-400 hover:shadow-[0_15px_35px_rgba(244,114,182,0.20)]',
      badge: 'bg-pink-500/15 text-pink-950 dark:text-pink-200 border-pink-300/90 font-black',
      barColor: 'bg-gradient-to-r from-pink-400 via-rose-400 to-pink-600 shadow-[0_0_12px_rgba(244,114,182,0.6)]',
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
      color: 'border-l-blue-500 bg-blue-50/40',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 font-bold',
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
      color: 'border-l-emerald-500 bg-emerald-50/40',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
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
      color: 'border-l-pink-500 bg-pink-50/40',
      badgeColor: 'bg-pink-100 text-pink-800 border-pink-300 font-bold',
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
      color: 'border-l-purple-500 bg-purple-50/40',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300 font-bold',
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
      color: 'border-l-amber-500 bg-amber-50/40',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
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
      {/* 1. TOP EXECUTIVE METRICS STRIP (7 Floating Jewel-Tone Frosted Glass Cards with 3D Depth & Shimmer) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 items-stretch">
        {/* Card 1: Today's Cash */}
        <div
          onClick={() => onQuickAction('day_book')}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-white/98 to-teal-500/5 dark:from-emerald-950/70 dark:to-slate-900 backdrop-blur-2xl border border-white/98 dark:border-emerald-700/70 p-3.5 rounded-2xl shadow-[0_12px_32px_rgba(16,185,129,0.08),0_2px_6px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_18px_45px_rgba(16,185,129,0.20)] hover:-translate-y-1.5 hover:border-emerald-400 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[134px] group"
        >
          {/* Ambient Corner Flare */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-400/15 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/25 group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-950 dark:text-white truncate">
                Today's Cash
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-emerald-950 dark:text-emerald-300">
              ₹1,42,600
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 border border-emerald-300/80 text-[10px] shadow-2xs">
              ↑ 8.5%
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-semibold truncate">vs yesterday</span>
          </div>
        </div>

        {/* Card 2: Today's Bank */}
        <div
          onClick={() => onQuickAction('day_book')}
          className="relative overflow-hidden bg-gradient-to-br from-sky-500/10 via-white/98 to-blue-500/5 dark:from-sky-950/70 dark:to-slate-900 backdrop-blur-2xl border border-white/98 dark:border-sky-700/70 p-3.5 rounded-2xl shadow-[0_12px_32px_rgba(14,165,233,0.08),0_2px_6px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_18px_45px_rgba(14,165,233,0.20)] hover:-translate-y-1.5 hover:border-sky-400 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[134px] group"
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-sky-400/15 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-400 via-blue-400 to-sky-600 shadow-[0_0_8px_rgba(14,165,233,0.4)]" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-600/25 group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-950 dark:text-white truncate">
                Today's Bank
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-sky-950 dark:text-sky-300">
              ₹9,41,100.00
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-sky-500/15 text-sky-900 dark:text-sky-200 border border-sky-300/80 text-[10px] shadow-2xs">
              ↑ 4.2%
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-semibold truncate">4 Active A/cs</span>
          </div>
        </div>

        {/* Card 3: Today's Sales */}
        <div
          onClick={() => onQuickAction('sales_invoice')}
          className="relative overflow-hidden bg-gradient-to-br from-amber-500/12 via-white/98 to-yellow-500/5 dark:from-amber-950/70 dark:to-slate-900 backdrop-blur-2xl border border-white/98 dark:border-amber-700/70 p-3.5 rounded-2xl shadow-[0_12px_32px_rgba(245,158,11,0.08),0_2px_6px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_18px_45px_rgba(245,158,11,0.20)] hover:-translate-y-1.5 hover:border-amber-400 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[134px] group"
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/15 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-md shadow-amber-600/25 group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-950 dark:text-white truncate">
                Today's Sales
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-amber-950 dark:text-amber-300">
              ₹2,84,500
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 border border-emerald-300/80 text-[10px] shadow-2xs">
              ↑ 12.4%
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-semibold truncate">vs yesterday</span>
          </div>
        </div>

        {/* Card 4: Today's Purchase */}
        <div
          onClick={() => onQuickAction('purchase')}
          className="relative overflow-hidden bg-gradient-to-br from-rose-500/10 via-white/98 to-pink-500/5 dark:from-rose-950/70 dark:to-slate-900 backdrop-blur-2xl border border-white/98 dark:border-rose-700/70 p-3.5 rounded-2xl shadow-[0_12px_32px_rgba(244,63,94,0.08),0_2px_6px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_18px_45px_rgba(244,63,94,0.20)] hover:-translate-y-1.5 hover:border-rose-400 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[134px] group"
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-400/15 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-400 via-pink-400 to-rose-600 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-600/25 group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-950 dark:text-white truncate">
                Today's Purchase
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-rose-950 dark:text-rose-300">
              ₹1,95,000
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-rose-500/15 text-rose-900 dark:text-rose-200 border border-rose-300/80 text-[10px] shadow-2xs">
              ↓ 6.3%
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-semibold truncate">Bullion Inward</span>
          </div>
        </div>

        {/* Card 5: Orders Pending */}
        <div
          onClick={() => onQuickAction('new_order')}
          className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-white/98 to-purple-500/5 dark:from-indigo-950/70 dark:to-slate-900 backdrop-blur-2xl border border-white/98 dark:border-indigo-700/70 p-3.5 rounded-2xl shadow-[0_12px_32px_rgba(99,102,241,0.08),0_2px_6px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_18px_45px_rgba(99,102,241,0.20)] hover:-translate-y-1.5 hover:border-indigo-400 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[134px] group"
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-400/15 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-600/25 group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-950 dark:text-white truncate">
                Orders Pending
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-indigo-950 dark:text-indigo-300">
              {pendingOrdersCount || 2} Orders
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-indigo-500/15 text-indigo-900 dark:text-indigo-200 border border-indigo-300/80 text-[10px] shadow-2xs">
              2 Due Today
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-semibold truncate">Delivery</span>
          </div>
        </div>

        {/* Card 6: New Walk-Ins */}
        <div className="relative overflow-hidden bg-gradient-to-br from-teal-500/10 via-white/98 to-cyan-500/5 dark:from-teal-950/70 dark:to-slate-900 backdrop-blur-2xl border border-white/98 dark:border-teal-700/70 p-3.5 rounded-2xl shadow-[0_12px_32px_rgba(20,184,166,0.08),0_2px_6px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_18px_45px_rgba(20,184,166,0.20)] hover:-translate-y-1.5 hover:border-teal-400 transition-all duration-300 flex flex-col justify-between h-[134px] group">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-teal-400/15 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-600 shadow-[0_0_8px_rgba(20,184,166,0.4)]" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-md shadow-teal-600/25 group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0">
                <UserPlus className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-950 dark:text-white truncate">
                New Walk-ins
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-teal-950 dark:text-teal-300">
              14 Visitors
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 border border-emerald-300/80 text-[10px] shadow-2xs">
              ↑ 27%
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-semibold truncate">New Profiles</span>
          </div>
        </div>

        {/* Card 7: Total Footfall */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 via-white/98 to-purple-500/5 dark:from-violet-950/70 dark:to-slate-900 backdrop-blur-2xl border border-white/98 dark:border-violet-700/70 p-3.5 rounded-2xl shadow-[0_12px_32px_rgba(139,92,246,0.08),0_2px_6px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_18px_45px_rgba(139,92,246,0.20)] hover:-translate-y-1.5 hover:border-violet-400 transition-all duration-300 flex flex-col justify-between h-[134px] group">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-violet-400/15 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-400 via-purple-400 to-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.4)]" />

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-600/25 group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-tight text-slate-950 dark:text-white truncate">
                Total Footfall
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-violet-600 dark:text-violet-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>

          <div className="my-auto pt-1 z-10">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-violet-950 dark:text-violet-300">
              38 Guests
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-black bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 border border-emerald-300/80 text-[10px] shadow-2xs">
              ↑ 16%
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-semibold truncate">Showroom Total</span>
          </div>
        </div>
      </div>

      {/* 2. CURRENT STOCK VAULT BREAKDOWN (Executive-Grade Bullion Dashboard with 3D Photorealistic Bullion Renders) */}
      <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/95 dark:border-slate-700/90 p-4 sm:p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,1)] space-y-4">
        {/* Subtle Luxury Gold Radiant Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-48 bg-gradient-to-b from-amber-400/15 via-yellow-400/8 to-transparent blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="relative z-10 flex flex-wrap justify-between items-center border-b border-slate-200/80 dark:border-slate-800 pb-3.5 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 ring-2 ring-amber-300/60">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-950 dark:text-white flex items-center gap-1.5">
                  CURRENT STOCK VAULT BREAKDOWN
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                </h2>
                <button
                  onClick={onOpenBullionRates}
                  className="bg-emerald-500/20 text-emerald-950 dark:text-emerald-200 border border-emerald-400/90 rounded-full px-3 py-0.5 text-xs font-black flex items-center space-x-1.5 cursor-pointer hover:bg-emerald-500/30 transition-all shadow-2xs"
                  title="Click to view live market rate center"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-ping" />
                  <span>Live Market Rates</span>
                </button>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                Pure Gold 24K: <span className="font-bold text-slate-950 dark:text-slate-100">₹13,987/g</span> • 22K (916): <span className="font-bold text-slate-950 dark:text-slate-100">₹12,812/g</span> • Pure Silver: <span className="font-bold text-slate-950 dark:text-slate-100">₹210.5/g</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
            {onOpenBullionRates && (
              <button
                onClick={onOpenBullionRates}
                className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-950 dark:text-amber-200 border border-amber-400/90 rounded-full px-4 py-1.5 text-xs font-black flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer group"
              >
                <Scale className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Rate Center</span>
              </button>
            )}

            <div className="bg-sky-500/15 text-sky-950 dark:text-sky-200 border border-sky-300/90 rounded-full px-4 py-1.5 text-xs font-mono font-bold shadow-xs flex items-center space-x-1.5">
              <span className="font-sans text-[11px] font-bold text-sky-800 dark:text-sky-300">Total Fine Bullion:</span>
              <span className="font-black text-sky-950 dark:text-white">{formatWeight(totalStockFineWt)}</span>
            </div>

            <div className="bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 border border-emerald-300/90 rounded-full px-4 py-1.5 text-xs font-mono font-bold shadow-xs flex items-center space-x-1.5">
              <span className="font-sans text-[11px] font-bold text-emerald-800 dark:text-emerald-300">Vault Valuation:</span>
              <span className="font-black text-emerald-950 dark:text-white">{formatCurrency(totalVaultValuation)}</span>
            </div>
          </div>
        </div>

        {/* 5 Stock Category Cards with 3D Bullion Visuals */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {stockCategories.map((stk, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden p-3.5 rounded-2xl transition-all duration-300 space-y-2.5 shadow-md hover:shadow-2xl hover:-translate-y-1.5 ${stk.cardBg} backdrop-blur-xl border ${stk.borderColor} group`}
            >
              {/* Card ambient flare */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stk.glowGrad} rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform`} />

              {/* Card Header: Category & Pcs */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="min-w-0 pr-1">
                  <div className="font-black text-xs font-sans text-slate-950 dark:text-white truncate" title={stk.name}>
                    {stk.name}
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
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
              <div className="relative z-10 bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700/80 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-xs font-bold shadow-2xs">
                <span className="font-sans text-[10.5px] font-bold text-slate-700 dark:text-slate-300">Live Est. Value:</span>
                <span className="font-mono font-black text-slate-950 dark:text-amber-300">
                  {formatCurrency(stk.valuation)}
                </span>
              </div>

              {/* Weights Monospace Breakdown */}
              <div className="relative z-10 space-y-1 font-mono text-xs p-2 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 shadow-2xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-sans text-[10.5px] font-semibold text-slate-600 dark:text-slate-400">Gross Wt:</span>
                  <span className="font-bold text-slate-950 dark:text-white">{formatWeight(stk.gross_wt)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-sans text-[10.5px] font-semibold text-slate-600 dark:text-slate-400">Net Wt:</span>
                  <span className="font-bold text-slate-950 dark:text-white">{formatWeight(stk.net_wt)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-800 font-bold text-[11px]">
                  <span className="font-sans text-[10.5px] font-bold text-slate-800 dark:text-slate-300">Fine Metal:</span>
                  <span className="font-black text-slate-950 dark:text-amber-300">{formatWeight(stk.fine_wt)}</span>
                </div>
              </div>

              {/* Purity Equiv Bar */}
              <div className="relative z-10 space-y-1 pt-0.5">
                <div className="flex justify-between text-[10.5px] font-mono">
                  <span className="font-bold font-sans text-slate-700 dark:text-slate-300">Purity Equiv</span>
                  <span className="font-black text-slate-950 dark:text-white">{stk.purity_pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden bg-slate-200/90 dark:bg-slate-700/90">
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
        <div className="lg:col-span-7 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/95 dark:border-slate-700/90 p-4 sm:p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,1)] space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300/80 dark:border-blue-700/60 shadow-2xs">
                <CreditCard className="w-4 h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 dark:text-white">
                Financial Balances: Cash in Hand & Bank A/cs
              </h2>
            </div>
            <span className="text-xs font-mono font-black px-3.5 py-1 rounded-full border bg-emerald-500/20 border-emerald-300/90 text-emerald-950 dark:text-emerald-200 shadow-2xs">
              Total: {formatCurrency(cashInHand + totalBankBalance)}
            </span>
          </div>

          {/* Cash in Hand Banner */}
          <div className="p-3.5 rounded-2xl flex justify-between items-center shadow-md border bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/10 border-emerald-300/90 text-emerald-950 dark:text-emerald-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/30">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-black text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
                  Physical Cash in Hand (Showroom Till)
                </div>
                <div className="text-[11px] font-semibold text-emerald-850 dark:text-emerald-400">
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
            <div className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Cash in Bank (Individual Accounts)</span>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">4 Active Linked Accounts</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-slate-800/95">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="font-bold border-b border-slate-200/90 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-200 select-none">
                  <tr>
                    <th className="p-3 border-r border-slate-200 dark:border-slate-700">Bank Name & Branch</th>
                    <th className="p-3 border-r border-slate-200 dark:border-slate-700 w-28 text-center">A/c No</th>
                    <th className="p-3 border-r border-slate-200 dark:border-slate-700 w-20 text-center">Type</th>
                    <th className="p-3 text-right w-32">Live Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-mono text-xs">
                  {bankAccounts.map((b, idx) => (
                    <tr key={idx} className="transition-colors hover:bg-sky-50/70 dark:hover:bg-sky-950/40">
                      <td className="p-3 border-r border-slate-200/60 dark:border-slate-700/60 font-sans font-bold text-slate-950 dark:text-slate-100 flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${b.iconColor}`} />
                        <span>{b.bank_name}</span>
                      </td>
                      <td className="p-3 border-r border-slate-200/60 dark:border-slate-700/60 text-center text-slate-800 dark:text-slate-300">
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
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border shadow-2xs ${b.badgeColor}`}>
                          {b.type}
                        </span>
                      </td>
                      <td className="p-3 text-right font-black text-slate-950 dark:text-sky-300">
                        {formatCurrency(b.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="font-mono border-t border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-900/90 text-slate-950 dark:text-white font-bold text-xs">
                  <tr>
                    <td colSpan={3} className="p-3 font-sans uppercase text-right font-bold text-slate-800 dark:text-slate-300">
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
        <div className="lg:col-span-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/95 dark:border-slate-700/90 p-4 sm:p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,1)] space-y-3.5">
          <div className="flex justify-between items-center border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300/80 dark:border-amber-700/60 shadow-2xs">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 dark:text-white">
                Showroom Alerts & Reminders
              </h2>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-black border bg-rose-500/20 border-rose-300/90 text-rose-800 dark:text-rose-300 shadow-2xs">
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
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-black transition-all cursor-pointer ${
                  activeNoticeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
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
                className={`p-3.5 rounded-2xl border border-l-4 transition-all space-y-2 bg-white dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-md ${n.color}`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-black text-xs sm:text-sm font-sans text-slate-950 dark:text-white">
                    {n.title}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shadow-2xs ${n.badgeColor}`}>
                    {n.tag}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                  {n.subtitle}
                </p>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                  {n.amount ? (
                    <div className="text-xs font-mono font-black text-slate-950 dark:text-emerald-300">
                      Amount: {formatCurrency(n.amount)}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500 font-semibold font-sans">Action pending</div>
                  )}

                  {/* Interactive Action Button */}
                  <button
                    onClick={() => handleAlertAction(n)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95 ${
                      n.type === 'birthday' || n.type === 'anniversary'
                        ? 'bg-pink-500/20 text-pink-900 dark:text-pink-200 hover:bg-pink-500/30 border border-pink-400/90'
                        : n.type === 'receivable'
                        ? 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-500/30 border border-emerald-400/90'
                        : 'bg-blue-500/20 text-blue-900 dark:text-blue-200 hover:bg-blue-500/30 border border-blue-400/90'
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
