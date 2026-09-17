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
  FileText,
  Copy,
  Check,
  MessageCircle,
  PhoneCall,
  ExternalLink
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { NewOrderBookingRecord, SundryDebtorRow, StockItem } from '../../types/erp';
import { useTheme } from '../../context/ThemeContext';
import { WhatsAppShareModal } from '../common/WhatsAppShareModal';

interface DashboardViewProps {
  onQuickAction: (actionId: string) => void;
  gold24kRate: number;
  gold22kRate: number;
  silverRate: number;
  orders: NewOrderBookingRecord[];
  debtors: SundryDebtorRow[];
  stockItems: StockItem[];
  onOpenBullionRates?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onQuickAction,
  gold24kRate,
  gold22kRate,
  silverRate,
  orders,
  debtors,
  stockItems,
  onOpenBullionRates,
}) => {
  const { currentTheme, isDark } = useTheme();
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
  const totalStockFineWt = stockItems.reduce((s, it) => s + (it.fine_wt || 0), 0);

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
      fine_wt: 1300.9,
      pcs: 148,
      valuation: 1300.9 * goldGramRate,
      color: 'from-amber-500 to-yellow-600',
      bgGlow: 'bg-amber-50/90 border-amber-300 hover:border-amber-500',
      badge: 'bg-amber-100 text-amber-950 border-amber-400 font-bold',
      barColor: 'bg-gradient-to-r from-amber-500 to-yellow-600',
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
      bgGlow: 'bg-slate-50/90 border-slate-300 hover:border-slate-500',
      badge: 'bg-slate-200 text-slate-950 border-slate-400 font-bold',
      barColor: 'bg-gradient-to-r from-slate-400 to-slate-600',
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
      valuation: 152.4 * goldGramRate * 0.98,
      color: 'from-yellow-600 to-amber-700',
      bgGlow: 'bg-yellow-50/90 border-yellow-300 hover:border-yellow-500',
      badge: 'bg-yellow-100 text-yellow-950 border-yellow-400 font-bold',
      barColor: 'bg-gradient-to-r from-yellow-500 to-amber-600',
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
      valuation: 1904.0 * silverGramRate * 0.95,
      color: 'from-zinc-500 to-zinc-700',
      bgGlow: 'bg-zinc-100/90 border-zinc-300 hover:border-zinc-500',
      badge: 'bg-zinc-200 text-zinc-950 border-zinc-400 font-bold',
      barColor: 'bg-gradient-to-r from-zinc-400 to-zinc-600',
    },
    {
      name: 'Imitation (1gm Micro-Plate)',
      category: 'Imitation (1 gm)',
      purity_label: '1gm Micro-Plate',
      purity_pct: 100,
      gross_wt: 3200.0,
      net_wt: 3200.0,
      fine_wt: 0,
      pcs: 420,
      valuation: 420 * 450,
      color: 'from-rose-500 to-pink-600',
      bgGlow: 'bg-rose-50/90 border-rose-300 hover:border-rose-500',
      badge: 'bg-rose-100 text-rose-950 border-rose-400 font-bold',
      barColor: 'bg-gradient-to-r from-rose-500 to-pink-600',
    },
  ];

  const totalVaultValuation = stockCategories.reduce((s, c) => s + c.valuation, 0);

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
      {/* 1. TOP METRICS STRIP (7 Sleek, Elegant, Balanced Metric Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-2.5 items-stretch">
        {/* Card 1: Today's Cash */}
        <div
          onClick={() => onQuickAction('day_book')}
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[120px] group ${
            isDark ? 'hover:border-emerald-500/40 hover:bg-white/[0.09]' : 'hover:border-emerald-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 shadow-2xs ${
                isDark ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/20 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white'
              }`}>
                <Wallet className="w-3 h-3" />
              </div>
              <span className={`text-[11px] font-bold tracking-tight font-sans truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Today's Cash
              </span>
            </div>
            <ChevronRight className={`w-3 h-3 group-hover:translate-x-0.5 transition-all shrink-0 ${isDark ? 'text-slate-400 group-hover:text-emerald-400' : 'text-slate-500 group-hover:text-emerald-700'}`} />
          </div>

          <div className="my-auto">
            <div className={`text-base font-extrabold font-mono tracking-tight leading-tight ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
              ₹1,42,600
            </div>
          </div>

          <div className={`pt-1 border-t flex items-center justify-between text-[9.5px] ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full font-bold text-[9px] ${
              isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}>
              ↑ 8.5%
            </span>
            <span className={`font-semibold truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>vs yesterday</span>
          </div>
        </div>

        {/* Card 2: Today's Bank */}
        <div
          onClick={() => onQuickAction('day_book')}
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[120px] group ${
            isDark ? 'hover:border-sky-500/40 hover:bg-white/[0.09]' : 'hover:border-blue-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 shadow-2xs ${
                isDark ? 'bg-sky-500/15 text-sky-300 border border-sky-400/20 group-hover:bg-sky-500 group-hover:text-white' : 'bg-blue-100 text-blue-800 group-hover:bg-blue-600 group-hover:text-white'
              }`}>
                <Building className="w-3 h-3" />
              </div>
              <span className={`text-[11px] font-bold tracking-tight font-sans truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Today's Bank
              </span>
            </div>
            <ChevronRight className={`w-3 h-3 group-hover:translate-x-0.5 transition-all shrink-0 ${isDark ? 'text-slate-400 group-hover:text-sky-300' : 'text-slate-500 group-hover:text-blue-700'}`} />
          </div>

          <div className="my-auto">
            <div className={`text-base font-extrabold font-mono tracking-tight leading-tight ${isDark ? 'text-sky-300' : 'text-blue-950'}`}>
              {formatCurrency(totalBankBalance)}
            </div>
          </div>

          <div className={`pt-1 border-t flex items-center justify-between text-[9.5px] ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full font-bold text-[9px] ${
              isDark ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30' : 'bg-blue-100 text-blue-900 border border-blue-300'
            }`}>
              ↑ 4.2%
            </span>
            <span className={`font-semibold truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>4 Active A/cs</span>
          </div>
        </div>

        {/* Card 3: Today's Sales */}
        <div
          onClick={() => onQuickAction('sales_invoice')}
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[120px] group ${
            isDark ? 'hover:border-amber-500/40 hover:bg-white/[0.09]' : 'hover:border-amber-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 shadow-2xs ${
                isDark ? 'bg-amber-500/15 text-amber-300 border border-amber-400/20 group-hover:bg-amber-500 group-hover:text-slate-950' : 'bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white'
              }`}>
                <TrendingUp className="w-3 h-3" />
              </div>
              <span className={`text-[11px] font-bold tracking-tight font-sans truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Today's Sales
              </span>
            </div>
            <ChevronRight className={`w-3 h-3 group-hover:translate-x-0.5 transition-all shrink-0 ${isDark ? 'text-slate-400 group-hover:text-amber-300' : 'text-slate-500 group-hover:text-amber-700'}`} />
          </div>

          <div className="my-auto">
            <div className={`text-base font-extrabold font-mono tracking-tight leading-tight ${isDark ? 'text-amber-300' : 'text-amber-950'}`}>
              ₹2,84,500
            </div>
          </div>

          <div className={`pt-1 border-t flex items-center justify-between text-[9.5px] ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full font-bold text-[9px] ${
              isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}>
              ↑ 12.4%
            </span>
            <span className={`font-semibold truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>vs yesterday</span>
          </div>
        </div>

        {/* Card 4: Today's Purchase */}
        <div
          onClick={() => onQuickAction('purchase')}
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[120px] group ${
            isDark ? 'hover:border-orange-500/40 hover:bg-white/[0.09]' : 'hover:border-orange-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 shadow-2xs ${
                isDark ? 'bg-orange-500/15 text-orange-300 border border-orange-400/20 group-hover:bg-orange-500 group-hover:text-slate-950' : 'bg-orange-100 text-orange-800 group-hover:bg-orange-600 group-hover:text-white'
              }`}>
                <ShoppingBag className="w-3 h-3" />
              </div>
              <span className={`text-[11px] font-bold tracking-tight font-sans truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Today's Purchase
              </span>
            </div>
            <ChevronRight className={`w-3 h-3 group-hover:translate-x-0.5 transition-all shrink-0 ${isDark ? 'text-slate-400 group-hover:text-orange-300' : 'text-slate-500 group-hover:text-orange-700'}`} />
          </div>

          <div className="my-auto">
            <div className={`text-base font-extrabold font-mono tracking-tight leading-tight ${isDark ? 'text-orange-300' : 'text-orange-950'}`}>
              ₹1,95,000
            </div>
          </div>

          <div className={`pt-1 border-t flex items-center justify-between text-[9.5px] ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full font-bold text-[9px] ${
              isDark ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30' : 'bg-rose-100 text-rose-900 border border-rose-300'
            }`}>
              ↓ 6.3%
            </span>
            <span className={`font-semibold truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Bullion Inward</span>
          </div>
        </div>

        {/* Card 5: Orders Pending */}
        <div
          onClick={() => onQuickAction('new_order')}
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[120px] group ${
            isDark ? 'hover:border-rose-500/40 hover:bg-white/[0.09]' : 'hover:border-rose-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 shadow-2xs ${
                isDark ? 'bg-rose-500/15 text-rose-300 border border-rose-400/20 group-hover:bg-rose-500 group-hover:text-white' : 'bg-rose-100 text-rose-800 group-hover:bg-rose-600 group-hover:text-white'
              }`}>
                <Clock className="w-3 h-3" />
              </div>
              <span className={`text-[11px] font-bold tracking-tight font-sans truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Orders Pending
              </span>
            </div>
            <ChevronRight className={`w-3 h-3 group-hover:translate-x-0.5 transition-all shrink-0 ${isDark ? 'text-slate-400 group-hover:text-rose-400' : 'text-slate-500 group-hover:text-rose-700'}`} />
          </div>

          <div className="my-auto">
            <div className={`text-base font-extrabold font-mono tracking-tight leading-tight ${isDark ? 'text-rose-400' : 'text-rose-900'}`}>
              {pendingOrdersCount} Orders
            </div>
          </div>

          <div className={`pt-1 border-t flex items-center justify-between text-[9.5px] ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full font-bold text-[9px] ${
              isDark ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30' : 'bg-rose-100 text-rose-900 border border-rose-300'
            }`}>
              2 Due
            </span>
            <span className={`font-semibold truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Delivery Today</span>
          </div>
        </div>

        {/* Card 6: New Walk-Ins */}
        <div
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-[120px] group ${
            isDark ? 'hover:border-teal-500/40 hover:bg-white/[0.09]' : 'hover:border-sky-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 shadow-2xs ${
                isDark ? 'bg-teal-500/15 text-teal-300 border border-teal-400/20 group-hover:bg-teal-500 group-hover:text-white' : 'bg-sky-100 text-sky-800 group-hover:bg-sky-600 group-hover:text-white'
              }`}>
                <UserPlus className="w-3 h-3" />
              </div>
              <span className={`text-[11px] font-bold tracking-tight font-sans truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                New Walk-ins
              </span>
            </div>
            <ChevronRight className={`w-3 h-3 group-hover:translate-x-0.5 transition-all shrink-0 ${isDark ? 'text-slate-400 group-hover:text-teal-300' : 'text-slate-500 group-hover:text-sky-700'}`} />
          </div>

          <div className="my-auto">
            <div className={`text-base font-extrabold font-mono tracking-tight leading-tight ${isDark ? 'text-teal-300' : 'text-sky-950'}`}>
              14 Visitors
            </div>
          </div>

          <div className={`pt-1 border-t flex items-center justify-between text-[9.5px] ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full font-bold text-[9px] ${
              isDark ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}>
              ↑ 27%
            </span>
            <span className={`font-semibold truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>New Profiles</span>
          </div>
        </div>

        {/* Card 7: Total Footfall */}
        <div
          className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-[120px] group ${
            isDark ? 'hover:border-purple-500/40 hover:bg-white/[0.09]' : 'hover:border-purple-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 shadow-2xs ${
                isDark ? 'bg-purple-500/15 text-purple-300 border border-purple-400/20 group-hover:bg-purple-500 group-hover:text-white' : 'bg-purple-100 text-purple-800 group-hover:bg-purple-600 group-hover:text-white'
              }`}>
                <Users className="w-3 h-3" />
              </div>
              <span className={`text-[11px] font-bold tracking-tight font-sans truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Total Footfall
              </span>
            </div>
            <ChevronRight className={`w-3 h-3 group-hover:translate-x-0.5 transition-all shrink-0 ${isDark ? 'text-slate-400 group-hover:text-purple-300' : 'text-slate-500 group-hover:text-purple-700'}`} />
          </div>

          <div className="my-auto">
            <div className={`text-base font-extrabold font-mono tracking-tight leading-tight ${isDark ? 'text-purple-300' : 'text-purple-950'}`}>
              38 Guests
            </div>
          </div>

          <div className={`pt-1 border-t flex items-center justify-between text-[9.5px] ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full font-bold text-[9px] ${
              isDark ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}>
              ↑ 16%
            </span>
            <span className={`font-semibold truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Showroom Total</span>
          </div>
        </div>
      </div>

      {/* 2. CURRENT STOCK VAULT BREAKDOWN (Executive-Grade Bullion Dashboard with Live Market Valuation) */}
      <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl p-4 sm:p-4.5 shadow-xs space-y-3.5`}>
        <div className={`flex flex-wrap justify-between items-center border-b pb-2.5 gap-2.5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-2xs">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>
                  Current Stock Vault Breakdown
                </h2>
                <button
                  onClick={onOpenBullionRates}
                  className={`text-[9.5px] px-2.5 py-0.5 rounded-full font-bold border transition-all flex items-center space-x-1.5 cursor-pointer hover:scale-105 active:scale-95 ${
                    isDark
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
                      : 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200'
                  }`}
                  title="Click to view full bullion market board, 18K/22K rates, and showroom premiums"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Live Market Rates ↗</span>
                </button>
              </div>
              <span className={`text-[10.5px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Pure Gold 24K: ₹{goldGramRate}/g • 22K (916): ₹{gold22kRate || Math.round(goldGramRate * 0.916)}/g • Pure Silver: ₹{silverGramRate}/g
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            {onOpenBullionRates && (
              <button
                onClick={onOpenBullionRates}
                className={`px-3 py-1 rounded-xl border text-[11px] font-bold flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer ${
                  isDark
                    ? 'bg-amber-500/20 border-amber-400/30 text-amber-300 hover:bg-amber-500/30'
                    : 'bg-amber-100 border-amber-400 text-amber-950 hover:bg-amber-200'
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Rate Center</span>
              </button>
            )}

            <div className={`px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold flex items-center space-x-1.5 shadow-2xs ${
              isDark
                ? 'bg-white/[0.06] border-white/15 text-slate-200'
                : 'bg-blue-50 border-blue-300 text-blue-950'
            }`}>
              <span className={`font-sans text-[10px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Total Fine Bullion:</span>
              <span className={`font-black ${isDark ? 'text-sky-300' : 'text-blue-950'}`}>{formatWeight(totalStockFineWt)}</span>
            </div>

            <div className={`px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold flex items-center space-x-1.5 shadow-2xs ${
              isDark
                ? 'bg-white/[0.06] border-white/15 text-slate-200'
                : 'bg-emerald-50 border-emerald-400 text-emerald-950'
            }`}>
              <span className={`font-sans text-[10px] font-semibold ${isDark ? 'text-emerald-300/80' : 'text-emerald-800'}`}>Vault Valuation:</span>
              <span className={`font-black ${isDark ? 'text-emerald-300' : 'text-emerald-950'}`}>{formatCurrency(totalVaultValuation)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {stockCategories.map((stk, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border transition-all duration-200 space-y-2 shadow-2xs hover:shadow-md ${
                isDark
                  ? 'bg-white/[0.05] backdrop-blur-md border-white/10 hover:border-white/25 hover:bg-white/[0.08] text-white'
                  : stk.bgGlow
              }`}
            >
              {/* Card Header: Category & Pcs */}
              <div className="flex justify-between items-start">
                <div className="min-w-0 pr-1">
                  <div className={`font-bold text-xs truncate font-sans ${isDark ? 'text-slate-100' : 'text-slate-950'}`} title={stk.name}>
                    {stk.name}
                  </div>
                  <div className={`text-[9.5px] font-semibold flex items-center space-x-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span>{stk.purity_label}</span>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold border shadow-2xs shrink-0 ${
                  isDark ? 'bg-white/10 text-slate-200 border-white/15 backdrop-blur-sm' : stk.badge
                }`}>
                  {stk.pcs} Pcs
                </span>
              </div>

              {/* Valuation Banner */}
              <div className={`p-1.5 rounded-lg border flex items-center justify-between text-[10px] shadow-2xs ${
                isDark ? 'bg-white/[0.06] border-white/10 text-white' : 'bg-white/95 border-slate-300'
              }`}>
                <span className={`font-sans font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Live Est. Value:</span>
                <span className={`font-mono font-black ${isDark ? 'text-amber-300' : 'text-slate-950'}`}>
                  {formatCurrency(stk.valuation)}
                </span>
              </div>

              {/* Weights Monospace Breakdown */}
              <div className={`space-y-0.5 font-mono text-[11px] p-2 rounded-xl border ${
                isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/90 border-slate-300'
              }`}>
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className={`font-sans text-[10px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Gross Wt:</span>
                  <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-950'}`}>{formatWeight(stk.gross_wt)}</span>
                </div>
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className={`font-sans text-[10px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Net Wt:</span>
                  <span className={`font-bold ${isDark ? 'text-sky-300' : 'text-blue-950'}`}>{formatWeight(stk.net_wt)}</span>
                </div>
                <div className={`flex justify-between items-center pt-0.5 border-t font-bold text-[10.5px] ${
                  isDark ? 'border-white/10 text-amber-300' : 'border-slate-300 text-amber-950'
                }`}>
                  <span className={`font-sans text-[10px] font-bold ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>Fine Metal:</span>
                  <span className={`font-black ${isDark ? 'text-amber-300' : 'text-amber-950'}`}>{formatWeight(stk.fine_wt)}</span>
                </div>
              </div>

              {/* Metallic Purity Bar */}
              <div className="space-y-0.5 pt-0.5">
                <div className={`flex justify-between text-[9.5px] font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="font-semibold font-sans">Purity Equiv</span>
                  <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-950'}`}>{stk.purity_pct}%</span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-300'}`}>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left (7 Cols): Tabular Cash in Hand & Cash in Bank */}
        <div className={`lg:col-span-7 ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl p-4 sm:p-4.5 shadow-xs space-y-3.5`}>
          <div className={`flex justify-between items-center border-b pb-2.5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-sky-500/15 text-sky-300 border border-sky-400/20' : 'bg-blue-100 text-blue-900 border border-blue-300'}`}>
                <CreditCard className="w-4 h-4" />
              </div>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>
                Financial Balances: Cash in Hand & Bank A/cs
              </h2>
            </div>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-xl border ${
              isDark
                ? 'bg-white/[0.06] border-white/15 text-emerald-300'
                : 'bg-emerald-100 border-emerald-400 text-emerald-950'
            }`}>
              Total: {formatCurrency(cashInHand + totalBankBalance)}
            </span>
          </div>

          {/* Cash in Hand Banner */}
          <div className={`p-3 rounded-2xl flex justify-between items-center shadow-2xs border ${
            isDark
              ? 'bg-emerald-950/30 border-emerald-500/25 text-white'
              : 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
          }`}>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-2xs">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className={`font-bold text-xs ${isDark ? 'text-slate-100' : 'text-emerald-950'}`}>
                  Physical Cash in Hand (Till)
                </div>
                <div className={`text-[10px] font-semibold ${isDark ? 'text-emerald-300/80' : 'text-emerald-800'}`}>
                  Counter Opening + Sales Collections Reconciled
                </div>
              </div>
            </div>
            <div className={`text-base font-black font-mono ${isDark ? 'text-emerald-300' : 'text-emerald-950'}`}>
              {formatCurrency(cashInHand)}
            </div>
          </div>

          {/* Cash in Bank Table (Individual Bank Breakdown) */}
          <div className="space-y-1.5">
            <div className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              Cash in Bank (Individual Accounts)
            </div>

            <div className={`overflow-x-auto border rounded-xl overflow-hidden shadow-2xs ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-300 bg-white'}`}>
              <table className="w-full text-left text-xs border-collapse">
                <thead className={`font-bold border-b select-none ${isDark ? 'bg-white/[0.05] text-slate-200 border-white/10' : 'bg-slate-100 text-slate-900 border-slate-300'}`}>
                  <tr>
                    <th className={`p-2.5 border-r ${isDark ? 'border-white/10' : 'border-slate-300'}`}>Bank Name & Branch</th>
                    <th className={`p-2.5 border-r w-28 text-center ${isDark ? 'border-white/10' : 'border-slate-300'}`}>A/c No</th>
                    <th className={`p-2.5 border-r w-20 text-center ${isDark ? 'border-white/10' : 'border-slate-300'}`}>Type</th>
                    <th className="p-2.5 text-right w-32">Live Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className={`divide-y font-mono text-[11px] ${isDark ? 'divide-white/10 bg-transparent' : 'divide-slate-200 bg-white'}`}>
                  {bankAccounts.map((b, idx) => (
                    <tr key={idx} className={`transition-colors ${isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-sky-50/50'}`}>
                      <td className={`p-2.5 border-r font-sans font-bold ${isDark ? 'border-white/10 text-slate-200' : 'border-slate-200 text-slate-950'}`}>
                        {b.bank_name}
                      </td>
                      <td className={`p-2.5 border-r text-center ${isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-700'}`}>
                        <button
                          onClick={() => handleCopyAccount(b.account_no)}
                          className="inline-flex items-center space-x-1 hover:text-amber-500 font-bold transition-colors cursor-pointer group"
                          title="Click to copy account number"
                        >
                          <span>{b.mask}</span>
                          {copiedAccount === b.account_no ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                          )}
                        </button>
                      </td>
                      <td className={`p-2.5 border-r text-center ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isDark ? 'bg-white/10 text-slate-300 border border-white/15' : 'bg-slate-100 text-slate-900 border border-slate-300'}`}>
                          {b.type}
                        </span>
                      </td>
                      <td className={`p-2.5 text-right font-black ${isDark ? 'text-sky-300' : 'text-blue-950'}`}>
                        {formatCurrency(b.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className={`font-mono border-t text-xs ${isDark ? 'bg-white/[0.05] text-white border-white/10' : 'bg-slate-100 text-slate-950 border-slate-300'}`}>
                  <tr>
                    <td colSpan={3} className={`p-2.5 font-sans uppercase text-right font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                      Total Cash in Bank:
                    </td>
                    <td className={`p-2.5 text-right font-black ${isDark ? 'text-sky-300' : 'text-blue-950'}`}>
                      {formatCurrency(totalBankBalance)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right (5 Cols): NOTICE PANEL (Iterative with interactive action buttons) */}
        <div className={`lg:col-span-5 ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl p-4 sm:p-4.5 shadow-xs space-y-3`}>
          <div className={`flex justify-between items-center border-b pb-2.5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-amber-500/15 text-amber-300 border border-amber-400/20' : 'bg-amber-100 text-amber-900 border border-amber-300'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <h2 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>
                Showroom Alerts & Reminders
              </h2>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
              isDark ? 'bg-rose-500/20 border-rose-400/30 text-rose-300' : 'bg-rose-100 border-rose-300 text-rose-950'
            }`}>
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
                className={`px-2.5 py-1 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer ${
                  activeNoticeTab === tab.id
                    ? `${currentTheme.activePill} shadow-2xs`
                    : isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notices List with interactive quick actions */}
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {filteredNotices.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border border-l-4 transition-all space-y-1.5 ${n.color} ${
                  isDark
                    ? 'bg-white/[0.04] hover:bg-white/[0.07] border-white/10 hover:border-white/20 text-white shadow-2xs'
                    : 'bg-white hover:bg-slate-50/90 border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`font-bold text-xs font-sans ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>
                    {n.title}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${
                    isDark ? 'bg-white/10 text-slate-300 border-white/15' : 'bg-slate-100 border-slate-300 text-slate-900'
                  }`}>
                    {n.tag}
                  </span>
                </div>
                <p className={`text-[11px] font-medium leading-tight ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {n.subtitle}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  {n.amount ? (
                    <div className={`text-[11px] font-mono font-black ${isDark ? 'text-amber-300' : 'text-blue-950'}`}>
                      Amount: {formatCurrency(n.amount)}
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500 font-semibold font-sans">Action pending</div>
                  )}

                  {/* Interactive Action Button */}
                  <button
                    onClick={() => handleAlertAction(n)}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer shadow-2xs ${
                      n.type === 'birthday' || n.type === 'anniversary'
                        ? 'bg-pink-100 text-pink-950 hover:bg-pink-200 border border-pink-400'
                        : n.type === 'receivable'
                        ? 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200 border border-emerald-400'
                        : 'bg-blue-100 text-blue-950 hover:bg-blue-200 border border-blue-400'
                    }`}
                  >
                    {n.type === 'birthday' || n.type === 'anniversary' || n.type === 'receivable' ? (
                      <MessageCircle className="w-3 h-3" />
                    ) : (
                      <ExternalLink className="w-3 h-3" />
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
