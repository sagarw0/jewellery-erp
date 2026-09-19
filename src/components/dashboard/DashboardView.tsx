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
  Zap,
  Layers,
  MapPin,
  Send,
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import {
  NewOrderBookingRecord,
  SundryDebtorRow,
  StockItem,
  StockRefillItem,
  BranchId,
  AuthUser,
} from '../../types/erp';
import { useTheme } from '../../context/ThemeContext';
import { WhatsAppShareModal } from '../common/WhatsAppShareModal';
import {
  GoldBars3DVisual,
  SilverBars3DVisual,
  GoldScrap3DVisual,
  SilverScrap3DVisual,
  ImitationBar3DVisual,
} from './Bullion3DVisuals';

interface DashboardViewProps {
  onQuickAction: (actionId: string) => void;
  gold24kRate: number;
  gold22kRate: number;
  silverRate: number;
  orders: NewOrderBookingRecord[];
  debtors: SundryDebtorRow[];
  stockItems: StockItem[];
  refillItems?: StockRefillItem[];
  onOpenStockRefill?: () => void;
  currentUser?: AuthUser | null;
  selectedBranch?: BranchId;
  onSelectBranch?: (branchId: BranchId) => void;
  onOpenBullionRates?: () => void;
  onOpenThemePicker?: () => void;
}

interface BranchDashboardData {
  branchName: string;
  shortName: string;
  city: string;
  cashInHand: number;
  bankTotal: number;
  todaySales: number;
  todayPurchase: number;
  pendingOrders: number;
  visitors: number;
  footfall: number;
  vaultValuation: number;
  goldFineWt: number;
  silverFineWt: number;
  goldScrapFineWt: number;
  silverScrapFineWt: number;
  imitationPcs: number;
  bankAccounts: {
    bank_name: string;
    account_no: string;
    mask: string;
    balance: number;
    type: string;
    ifsc: string;
    iconColor: string;
    badgeColor: string;
  }[];
}

const BRANCH_DATA: Record<BranchId, BranchDashboardData> = {
  all: {
    branchName: 'All Branches (Consolidated Multi-Location Hub)',
    shortName: 'All Branches (Consolidated)',
    city: 'Mumbai, Pune & Thane Hubs',
    cashInHand: 315200,
    bankTotal: 1736100,
    todaySales: 574500,
    todayPurchase: 395000,
    pendingOrders: 5,
    visitors: 34,
    footfall: 78,
    vaultValuation: 23609598.47,
    goldFineWt: 1308.9,
    silverFineWt: 13088.7,
    goldScrapFineWt: 152.4,
    silverScrapFineWt: 1904.0,
    imitationPcs: 420,
    bankAccounts: [
      {
        bank_name: 'HDFC Bank (Zaveri Main - 4920)',
        account_no: '4920881920',
        mask: '•••• 4920',
        balance: 685200,
        type: 'Current',
        ifsc: 'HDFC0000128',
        iconColor: 'bg-blue-600',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      },
      {
        bank_name: 'State Bank of India (Bullion Clearing - 8831)',
        account_no: '8831990211',
        mask: '•••• 8831',
        balance: 545000,
        type: 'Current',
        ifsc: 'SBIN0001402',
        iconColor: 'bg-sky-600',
        badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      },
      {
        bank_name: 'ICICI Bank (Pune Camp - 1209)',
        account_no: '1209348821',
        mask: '•••• 1209',
        balance: 327400,
        type: 'OD / CC',
        ifsc: 'ICIC0000045',
        iconColor: 'bg-amber-600',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      },
      {
        bank_name: 'Kotak Mahindra (Thane West - 6542)',
        account_no: '6542119024',
        mask: '•••• 6542',
        balance: 178500,
        type: 'Savings',
        ifsc: 'KKBK0000212',
        iconColor: 'bg-red-600',
        badgeColor: 'bg-red-50 text-red-700 border-red-200',
      },
    ],
  },
  mumbai: {
    branchName: 'Mumbai Flagship Showroom (Zaveri Bazaar - HM-916-MH-4421)',
    shortName: 'Mumbai Flagship (Zaveri)',
    city: 'Mumbai',
    cashInHand: 142600,
    bankTotal: 941100,
    todaySales: 284500,
    todayPurchase: 195000,
    pendingOrders: 2,
    visitors: 14,
    footfall: 38,
    vaultValuation: 14850000.0,
    goldFineWt: 850.5,
    silverFineWt: 8200.0,
    goldScrapFineWt: 98.2,
    silverScrapFineWt: 1100.0,
    imitationPcs: 220,
    bankAccounts: [
      {
        bank_name: 'HDFC Bank (Current A/c - Zaveri)',
        account_no: '4920881920',
        mask: '•••• 4920',
        balance: 485200,
        type: 'Current',
        ifsc: 'HDFC0000128',
        iconColor: 'bg-blue-600',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      },
      {
        bank_name: 'State Bank of India (Bullion Clearing)',
        account_no: '8831990211',
        mask: '•••• 8831',
        balance: 245000,
        type: 'Current',
        ifsc: 'SBIN0001402',
        iconColor: 'bg-sky-600',
        badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      },
      {
        bank_name: 'ICICI Bank (POS Counter Swipe)',
        account_no: '1209348821',
        mask: '•••• 1209',
        balance: 132400,
        type: 'OD / CC',
        ifsc: 'ICIC0000045',
        iconColor: 'bg-amber-600',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      },
      {
        bank_name: 'Kotak Mahindra (Showroom Petty Cash)',
        account_no: '6542119024',
        mask: '•••• 6542',
        balance: 78500,
        type: 'Savings',
        ifsc: 'KKBK0000212',
        iconColor: 'bg-red-600',
        badgeColor: 'bg-red-50 text-red-700 border-red-200',
      },
    ],
  },
  pune: {
    branchName: 'Pune Camp Showroom (HM-916-PN-1102)',
    shortName: 'Pune Camp Branch',
    city: 'Pune',
    cashInHand: 98400,
    bankTotal: 480000,
    todaySales: 178000,
    todayPurchase: 120000,
    pendingOrders: 2,
    visitors: 12,
    footfall: 24,
    vaultValuation: 5200000.0,
    goldFineWt: 290.4,
    silverFineWt: 3100.0,
    goldScrapFineWt: 34.2,
    silverScrapFineWt: 450.0,
    imitationPcs: 110,
    bankAccounts: [
      {
        bank_name: 'ICICI Bank (Pune Camp Current)',
        account_no: '1209348821',
        mask: '•••• 1209',
        balance: 295000,
        type: 'Current',
        ifsc: 'ICIC0000045',
        iconColor: 'bg-amber-600',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      },
      {
        bank_name: 'HDFC Bank (Pune Main Collection)',
        account_no: '4920881920',
        mask: '•••• 4920',
        balance: 185000,
        type: 'Current',
        ifsc: 'HDFC0000128',
        iconColor: 'bg-blue-600',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      },
    ],
  },
  thane: {
    branchName: 'Thane West Luxury Boutique (HM-916-TH-8833)',
    shortName: 'Thane West Boutique',
    city: 'Thane',
    cashInHand: 74200,
    bankTotal: 315000,
    todaySales: 112000,
    todayPurchase: 80000,
    pendingOrders: 1,
    visitors: 8,
    footfall: 16,
    vaultValuation: 3559598.47,
    goldFineWt: 168.0,
    silverFineWt: 1788.7,
    goldScrapFineWt: 20.0,
    silverScrapFineWt: 354.0,
    imitationPcs: 90,
    bankAccounts: [
      {
        bank_name: 'Kotak Mahindra (Thane West)',
        account_no: '6542119024',
        mask: '•••• 6542',
        balance: 215000,
        type: 'Current',
        ifsc: 'KKBK0000212',
        iconColor: 'bg-red-600',
        badgeColor: 'bg-red-50 text-red-700 border-red-200',
      },
      {
        bank_name: 'SBI (Thane Branch Swipe)',
        account_no: '8831990211',
        mask: '•••• 8831',
        balance: 100000,
        type: 'Savings',
        ifsc: 'SBIN0001402',
        iconColor: 'bg-sky-600',
        badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      },
    ],
  },
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  onQuickAction,
  gold24kRate,
  gold22kRate,
  silverRate,
  orders,
  debtors,
  stockItems,
  refillItems = [],
  onOpenStockRefill,
  currentUser,
  selectedBranch = 'all',
  onSelectBranch,
  onOpenBullionRates,
  onOpenThemePicker,
}) => {
  const { currentTheme, computedTokens, isDark } = useTheme();
  const [dashboardPerspective, setDashboardPerspective] = useState<
    'overview' | 'vault' | 'banking' | 'sales' | 'crm'
  >('overview');
  const [activeNoticeTab, setActiveNoticeTab] = useState<
    'all' | 'receivables' | 'orders' | 'birthdays' | 'bhishi'
  >('all');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Active branch data
  const branchData = BRANCH_DATA[selectedBranch] || BRANCH_DATA.all;

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

  // Dynamic stock category breakdown derived from branch
  const stockCategories = [
    {
      name: 'Pure Gold (916 / 999)',
      category: 'Gold',
      purity_label: '91.6% - 99.9%',
      purity_pct: 99.5,
      gross_wt: Number((branchData.goldFineWt * 1.1).toFixed(1)),
      net_wt: Number((branchData.goldFineWt * 1.08).toFixed(1)),
      fine_wt: branchData.goldFineWt,
      pcs: selectedBranch === 'all' ? 148 : selectedBranch === 'mumbai' ? 96 : 32,
      valuation: branchData.goldFineWt * gold24kRate,
      visual: (
        <GoldBars3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-105 duration-300 drop-shadow-md" />
      ),
      cardBg: isDark
        ? 'bg-[#0f172a]/80 border-white/15 text-white'
        : 'bg-white/96 border-slate-200/80 text-slate-950 shadow-xs',
      borderColor: isDark ? 'border-amber-500/30' : 'border-amber-200 hover:border-amber-400',
      badge: isDark
        ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
        : 'bg-amber-100 text-amber-950 border border-amber-300 font-bold',
      barColor: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    },
    {
      name: 'Pure Silver (925 / 999)',
      category: 'Silver',
      purity_label: '92.5% - 99.9%',
      purity_pct: 92.5,
      gross_wt: Number((branchData.silverFineWt * 1.08).toFixed(1)),
      net_wt: Number((branchData.silverFineWt * 1.07).toFixed(1)),
      fine_wt: branchData.silverFineWt,
      pcs: selectedBranch === 'all' ? 84 : 46,
      valuation: branchData.silverFineWt * silverRate,
      visual: (
        <SilverBars3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-105 duration-300 drop-shadow-md" />
      ),
      cardBg: isDark
        ? 'bg-[#0f172a]/80 border-white/15 text-white'
        : 'bg-white/96 border-slate-200/80 text-slate-950 shadow-xs',
      borderColor: isDark ? 'border-sky-500/30' : 'border-sky-200 hover:border-sky-400',
      badge: isDark
        ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
        : 'bg-sky-100 text-sky-950 border border-sky-300 font-bold',
      barColor: 'bg-gradient-to-r from-slate-400 to-sky-400',
    },
    {
      name: 'URD Gold (Old Scrap)',
      category: 'URD Gold',
      purity_label: '83.0% Touch',
      purity_pct: 82.6,
      gross_wt: Number((branchData.goldScrapFineWt * 1.2).toFixed(1)),
      net_wt: Number((branchData.goldScrapFineWt * 1.16).toFixed(1)),
      fine_wt: branchData.goldScrapFineWt,
      pcs: selectedBranch === 'all' ? 22 : 12,
      valuation: branchData.goldScrapFineWt * gold22kRate,
      visual: (
        <GoldScrap3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-105 duration-300 drop-shadow-md" />
      ),
      cardBg: isDark
        ? 'bg-[#0f172a]/80 border-white/15 text-white'
        : 'bg-white/96 border-slate-200/80 text-slate-950 shadow-xs',
      borderColor: isDark ? 'border-amber-600/30' : 'border-amber-200 hover:border-amber-500',
      badge: isDark
        ? 'bg-amber-600/20 text-amber-300 border-amber-400/40'
        : 'bg-amber-100 text-amber-950 border border-amber-300 font-bold',
      barColor: 'bg-gradient-to-r from-amber-500 to-amber-600',
    },
    {
      name: 'URD Silver (Old Scrap)',
      category: 'URD Silver',
      purity_label: '77.7% Touch',
      purity_pct: 77.7,
      gross_wt: Number((branchData.silverScrapFineWt * 1.28).toFixed(1)),
      net_wt: Number((branchData.silverScrapFineWt * 1.25).toFixed(1)),
      fine_wt: branchData.silverScrapFineWt,
      pcs: selectedBranch === 'all' ? 16 : 8,
      valuation: branchData.silverScrapFineWt * (silverRate * 0.85),
      visual: (
        <SilverScrap3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-105 duration-300 drop-shadow-md" />
      ),
      cardBg: isDark
        ? 'bg-[#0f172a]/80 border-white/15 text-white'
        : 'bg-white/96 border-slate-200/80 text-slate-950 shadow-xs',
      borderColor: isDark ? 'border-slate-500/30' : 'border-slate-200 hover:border-slate-400',
      badge: isDark
        ? 'bg-slate-500/20 text-slate-200 border-slate-400/40'
        : 'bg-slate-100 text-slate-900 border border-slate-300 font-bold',
      barColor: 'bg-gradient-to-r from-slate-400 to-zinc-500',
    },
    {
      name: 'Imitation (1gm Micro-Plate)',
      category: 'Imitation',
      purity_label: '1gm Micro-Plate',
      purity_pct: 0.0,
      gross_wt: branchData.imitationPcs * 7.5,
      net_wt: branchData.imitationPcs * 7.5,
      fine_wt: 0,
      pcs: branchData.imitationPcs,
      valuation: branchData.imitationPcs * 450,
      visual: (
        <ImitationBar3DVisual className="w-full h-24 sm:h-28 transition-transform group-hover:scale-105 duration-300 drop-shadow-md" />
      ),
      cardBg: isDark
        ? 'bg-[#0f172a]/80 border-white/15 text-white'
        : 'bg-white/96 border-slate-200/80 text-slate-950 shadow-xs',
      borderColor: isDark ? 'border-pink-500/30' : 'border-pink-200 hover:border-pink-400',
      badge: isDark
        ? 'bg-pink-500/20 text-pink-300 border-pink-400/40'
        : 'bg-pink-100 text-pink-950 border border-pink-300 font-bold',
      barColor: 'bg-gradient-to-r from-pink-400 to-rose-500',
    },
  ];

  // Notice Panel Items
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
      badgeColor: isDark
        ? 'bg-blue-500/20 text-blue-300 border-blue-400/40 font-bold'
        : 'bg-blue-100 text-blue-900 border-blue-300 font-bold',
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
      badgeColor: isDark
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 font-bold'
        : 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
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
      badgeColor: isDark
        ? 'bg-pink-500/20 text-pink-300 border-pink-400/40 font-bold'
        : 'bg-pink-100 text-pink-900 border-pink-300 font-bold',
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
      badgeColor: isDark
        ? 'bg-purple-500/20 text-purple-300 border-purple-400/40 font-bold'
        : 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
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
      badgeColor: isDark
        ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 font-bold'
        : 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
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
        msg = `Dear ${n.name}, friendly reminder regarding outstanding balance of ${formatCurrency(
          n.amount || 0
        )} against invoice. Kindly remit via NEFT/RTGS. Thank you!`;
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
    if (activeNoticeTab === 'birthdays')
      return n.type === 'birthday' || n.type === 'anniversary';
    if (activeNoticeTab === 'bhishi') return n.type === 'bhishi';
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      {/* Branch Active Context Ribbon */}
      <div
        className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-2.5 backdrop-blur-xl ${
          isDark
            ? 'bg-[#0f172a]/85 border-white/15 text-white'
            : 'bg-white/96 border-slate-200/90 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <div
            className="p-2 rounded-xl"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.06)',
            }}
          >
            <Building2 className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xs sm:text-sm">{branchData.branchName}</span>
              <span
                className={`text-[9.5px] font-mono px-2 py-0.2 rounded-full font-bold border ${
                  selectedBranch === 'all'
                    ? isDark
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                    : isDark
                    ? 'bg-sky-400/20 text-sky-300 border-sky-400/40'
                    : 'bg-blue-100 text-blue-900 border-blue-300'
                }`}
              >
                {selectedBranch === 'all' ? 'Multi-Branch Consolidated' : 'Single Showroom'}
              </span>
            </div>
            <div className="text-[11px] opacity-70">
              Real-time stock valuation, sales ledger & till balance synchronized
            </div>
          </div>
        </div>

        {/* Quick Branch Switcher Buttons */}
        {onSelectBranch && (
          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            {[
              { id: 'all' as BranchId, label: 'All Branches' },
              { id: 'mumbai' as BranchId, label: 'Mumbai' },
              { id: 'pune' as BranchId, label: 'Pune' },
              { id: 'thane' as BranchId, label: 'Thane' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => onSelectBranch(b.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedBranch === b.id
                    ? isDark
                      ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                      : 'bg-blue-600 text-white font-black shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Perspective Selector Strip */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 pt-0.5">
        <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 text-xs overflow-x-auto shadow-2xs backdrop-blur-md">
          {[
            { id: 'overview', label: 'Executive 360°', icon: Sparkles },
            { id: 'vault', label: 'Bullion Vault & 3D', icon: Coins },
            { id: 'banking', label: 'Banks & Cashflow', icon: Building },
            { id: 'sales', label: 'Sales & Invoicing', icon: ShoppingBag },
            { id: 'crm', label: 'CRM & Notices', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = dashboardPerspective === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setDashboardPerspective(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  isTabActive
                    ? isDark
                      ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                      : 'bg-blue-600 text-white font-black shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Rates Quick Trigger */}
        <div className="flex items-center space-x-2">
          {onOpenBullionRates && (
            <button
              onClick={onOpenBullionRates}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? 'bg-amber-500/10 text-amber-300 border-amber-400/40 hover:bg-amber-500/20'
                  : 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100 shadow-2xs'
              }`}
              title="Open Live Showroom Bullion Rates Board"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>Live Bullion Board</span>
            </button>
          )}
        </div>
      </div>

      {/* Stock Refill Alert Banner (Displayed when items are below desired level) */}
      {(() => {
        const deficitList = refillItems.filter((i) => i.current_stock < i.desired_stock);
        if (deficitList.length === 0) return null;
        const totalDefPcs = deficitList.reduce((acc, it) => acc + (it.desired_stock - it.current_stock), 0);

        return (
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs animate-in fade-in duration-150 ${
              isDark
                ? 'bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-purple-950/30 border-rose-500/40 text-white'
                : 'bg-gradient-to-r from-amber-500/10 via-amber-50 to-rose-50 border-amber-300 text-slate-900 shadow-2xs'
            }`}
          >
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 shadow-xs shrink-0 animate-pulse">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="font-black text-xs sm:text-sm tracking-tight">
                    Stock Refill Alert: {deficitList.length} SKUs Below Target
                  </span>
                  <span className="px-2 py-0.2 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-400/30">
                    +{totalDefPcs} Pcs Shortfall
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center space-x-1.5 flex-wrap mt-0.5">
                  <span className="font-bold text-amber-700 dark:text-amber-300">Rule:</span>
                  <span className="font-mono text-[10.5px]">
                    Desired ({deficitList.reduce((s, i) => s + i.desired_stock, 0)}) − Sold ({deficitList.reduce((s, i) => s + i.sold_stock, 0)}) = Current Floor ({deficitList.reduce((s, i) => s + i.current_stock, 0)})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
              {onOpenStockRefill && (
                <button
                  onClick={onOpenStockRefill}
                  className="w-full md:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black text-xs shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Refill via WhatsApp ({totalDefPcs} pcs)</span>
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* 1. TOP EXECUTIVE METRICS STRIP (7 Clean Luxury Frosted Glass Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 items-stretch">
        {/* Card 1: Today's Cash */}
        <div
          onClick={() => onQuickAction('day_book')}
          className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[128px] ${
            isDark
              ? 'bg-[#0f172a]/85 hover:bg-[#0f172a] border-emerald-500/30 hover:border-emerald-400 text-white'
              : 'bg-white/96 hover:bg-white border-slate-200/90 hover:border-emerald-500 text-slate-950 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-emerald-600 text-white shadow-xs shrink-0">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold truncate">Today's Cash</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-300">
              {formatCurrency(branchData.cashInHand)}
            </div>
          </div>

          <div className="flex items-center space-x-1 text-[10px] opacity-75">
            <span className="px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300">
              Till Reconciled
            </span>
          </div>
        </div>

        {/* Card 2: Today's Bank */}
        <div
          onClick={() => onQuickAction('day_book')}
          className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[128px] ${
            isDark
              ? 'bg-[#0f172a]/85 hover:bg-[#0f172a] border-sky-500/30 hover:border-sky-400 text-white'
              : 'bg-white/96 hover:bg-white border-slate-200/90 hover:border-sky-500 text-slate-950 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-sky-600 text-white shadow-xs shrink-0">
                <Building className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold truncate">Bank Balances</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-sky-600 dark:text-sky-300">
              {formatCurrency(branchData.bankTotal)}
            </div>
          </div>

          <div className="flex items-center space-x-1 text-[10px] opacity-75">
            <span className="px-1.5 py-0.2 rounded font-bold bg-sky-100 text-sky-950 dark:bg-sky-950/60 dark:text-sky-300">
              {branchData.bankAccounts.length} Active Accounts
            </span>
          </div>
        </div>

        {/* Card 3: Today's Sales */}
        <div
          onClick={() => onQuickAction('sales_invoice')}
          className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[128px] ${
            isDark
              ? 'bg-[#0f172a]/85 hover:bg-[#0f172a] border-amber-500/30 hover:border-amber-400 text-white'
              : 'bg-white/96 hover:bg-white border-slate-200/90 hover:border-amber-500 text-slate-950 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-amber-600 text-white shadow-xs shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold truncate">Today's Sales</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-300">
              {formatCurrency(branchData.todaySales)}
            </div>
          </div>

          <div className="flex items-center space-x-1 text-[10px] opacity-75">
            <span className="px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300">
              ↑ 12.4% vs yday
            </span>
          </div>
        </div>

        {/* Card 4: Today's Purchase */}
        <div
          onClick={() => onQuickAction('purchase')}
          className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[128px] ${
            isDark
              ? 'bg-[#0f172a]/85 hover:bg-[#0f172a] border-rose-500/30 hover:border-rose-400 text-white'
              : 'bg-white/96 hover:bg-white border-slate-200/90 hover:border-rose-500 text-slate-950 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-rose-600 text-white shadow-xs shrink-0">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold truncate">Purchases</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-rose-600 dark:text-rose-300">
              {formatCurrency(branchData.todayPurchase)}
            </div>
          </div>

          <div className="flex items-center space-x-1 text-[10px] opacity-75">
            <span className="px-1.5 py-0.2 rounded font-bold bg-rose-100 text-rose-950 dark:bg-rose-950/60 dark:text-rose-300">
              Bullion Inward
            </span>
          </div>
        </div>

        {/* Card 5: Orders Pending */}
        <div
          onClick={() => onQuickAction('new_order')}
          className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[128px] ${
            isDark
              ? 'bg-[#0f172a]/85 hover:bg-[#0f172a] border-indigo-500/30 hover:border-indigo-400 text-white'
              : 'bg-white/96 hover:bg-white border-slate-200/90 hover:border-indigo-500 text-slate-950 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-indigo-600 text-white shadow-xs shrink-0">
                <Package className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold truncate">Pending Orders</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-indigo-600 dark:text-indigo-300">
              {branchData.pendingOrders} Orders
            </div>
          </div>

          <div className="flex items-center space-x-1 text-[10px] opacity-75">
            <span className="px-1.5 py-0.2 rounded font-bold bg-indigo-100 text-indigo-950 dark:bg-indigo-950/60 dark:text-indigo-300">
              2 Due Today
            </span>
          </div>
        </div>

        {/* Card 6: New Walk-Ins */}
        <div
          className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between h-[128px] ${
            isDark
              ? 'bg-[#0f172a]/85 border-teal-500/30 text-white'
              : 'bg-white/96 border-slate-200/90 text-slate-950 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-teal-600 text-white shadow-xs shrink-0">
                <UserPlus className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold truncate">New Walk-ins</span>
            </div>
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-teal-600 dark:text-teal-300">
              {branchData.visitors} Visitors
            </div>
          </div>

          <div className="flex items-center space-x-1 text-[10px] opacity-75">
            <span className="px-1.5 py-0.2 rounded font-bold bg-teal-100 text-teal-950 dark:bg-teal-950/60 dark:text-teal-300">
              New Profiles
            </span>
          </div>
        </div>

        {/* Card 7: Total Footfall */}
        <div
          className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between h-[128px] ${
            isDark
              ? 'bg-[#0f172a]/85 border-violet-500/30 text-white'
              : 'bg-white/96 border-slate-200/90 text-slate-950 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-violet-600 text-white shadow-xs shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold truncate">Total Guests</span>
            </div>
          </div>

          <div className="my-auto pt-1">
            <div className="text-lg sm:text-xl font-black font-mono tracking-tight text-violet-600 dark:text-violet-300">
              {branchData.footfall} Guests
            </div>
          </div>

          <div className="flex items-center space-x-1 text-[10px] opacity-75">
            <span className="px-1.5 py-0.2 rounded font-bold bg-violet-100 text-violet-950 dark:bg-violet-950/60 dark:text-violet-300">
              Showroom Total
            </span>
          </div>
        </div>
      </div>

      {/* 2. CURRENT STOCK VAULT BREAKDOWN (3D Visuals & Purity Metrics) */}
      <div
        className={`rounded-3xl border p-4 sm:p-5 backdrop-blur-2xl space-y-4 ${
          isDark
            ? 'bg-[#0f172a]/90 border-white/15 text-white'
            : 'bg-white/96 border-slate-200/90 text-slate-950 shadow-xs'
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-wrap justify-between items-center border-b border-black/5 dark:border-white/10 pb-3 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-sm">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider">
                  CURRENT STOCK VAULT BREAKDOWN
                </h2>
                <button
                  onClick={onOpenBullionRates}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center space-x-1.5 cursor-pointer border ${
                    isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Live Bullion Market</span>
                </button>
              </div>
              <p className="text-xs opacity-75 font-medium mt-0.5">
                Pure Gold 24K:{' '}
                <span className="font-bold">₹{gold24kRate.toLocaleString('en-IN')}/g</span> •
                22K (916):{' '}
                <span className="font-bold">₹{gold22kRate.toLocaleString('en-IN')}/g</span> •
                Silver:{' '}
                <span className="font-bold">₹{silverRate.toLocaleString('en-IN')}/g</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 flex-wrap">
            <div
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border ${
                isDark
                  ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                  : 'bg-sky-50 text-sky-950 border-sky-200'
              }`}
            >
              <span className="opacity-70 mr-1">Fine Metal:</span>
              <span className="font-black">{formatWeight(branchData.goldFineWt)}</span>
            </div>

            <div
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border ${
                isDark
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  : 'bg-emerald-50 text-emerald-950 border-emerald-200'
              }`}
            >
              <span className="opacity-70 mr-1">Vault Valuation:</span>
              <span className="font-black">{formatCurrency(branchData.vaultValuation)}</span>
            </div>
          </div>
        </div>

        {/* 5 Stock Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {stockCategories.map((stk, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all duration-200 space-y-2.5 group ${stk.cardBg}`}
            >
              <div className="flex justify-between items-start">
                <div className="min-w-0 pr-1">
                  <div className="font-bold text-xs truncate" title={stk.name}>
                    {stk.name}
                  </div>
                  <div className="text-[10px] opacity-70 font-semibold">{stk.purity_label}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${stk.badge}`}>
                  {stk.pcs} Pcs
                </span>
              </div>

              {/* 3D Visual */}
              <div className="flex items-center justify-center py-1">{stk.visual}</div>

              {/* Est Value */}
              <div
                className={`p-2 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  isDark
                    ? 'bg-black/30 border-white/10'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <span className="text-[10px] opacity-75">Est. Value:</span>
                <span className="font-mono font-black text-amber-600 dark:text-amber-300">
                  {formatCurrency(stk.valuation)}
                </span>
              </div>

              {/* Weights Breakdown */}
              <div
                className={`space-y-1 font-mono text-xs p-2 rounded-xl border ${
                  isDark
                    ? 'bg-black/20 border-white/10'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="opacity-70 font-sans">Gross Wt:</span>
                  <span className="font-bold">{formatWeight(stk.gross_wt)}</span>
                </div>
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="opacity-70 font-sans">Net Wt:</span>
                  <span className="font-bold">{formatWeight(stk.net_wt)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-black/5 dark:border-white/10 font-bold text-[10.5px]">
                  <span className="font-sans">Fine Metal:</span>
                  <span className="text-amber-600 dark:text-amber-300">
                    {formatWeight(stk.fine_wt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. FINANCIAL BALANCES & 4. NOTICE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left (7 Cols): Cash in Hand & Cash in Bank */}
        <div
          className={`lg:col-span-7 rounded-3xl border p-4 sm:p-5 backdrop-blur-2xl space-y-4 ${
            isDark
              ? 'bg-[#0f172a]/90 border-white/15 text-white'
              : 'bg-white/96 border-slate-200/90 text-slate-950 shadow-xs'
          }`}
        >
          <div className="flex justify-between items-center border-b border-black/5 dark:border-white/10 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                Financial Balances (Cash & Bank)
              </h2>
            </div>
            <span
              className={`text-xs font-mono font-black px-3 py-1 rounded-full border ${
                isDark
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  : 'bg-emerald-50 text-emerald-950 border-emerald-200'
              }`}
            >
              Total: {formatCurrency(branchData.cashInHand + branchData.bankTotal)}
            </span>
          </div>

          {/* Cash in Hand Banner */}
          <div
            className={`p-3 rounded-2xl flex justify-between items-center border ${
              isDark
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm">
                  Physical Cash in Hand (Showroom Till)
                </div>
                <div className="text-[10px] opacity-75">
                  Opening balance + Counter collections reconciled
                </div>
              </div>
            </div>
            <div className="text-base sm:text-lg font-black font-mono">
              {formatCurrency(branchData.cashInHand)}
            </div>
          </div>

          {/* Cash in Bank Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center justify-between">
              <span>Cash in Bank (Individual Accounts)</span>
              <span>{branchData.bankAccounts.length} Linked Accounts</span>
            </div>

            <div className="overflow-x-auto border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead
                  className={`font-bold border-b select-none ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-slate-200'
                      : 'bg-slate-100/90 border-slate-200 text-slate-900'
                  }`}
                >
                  <tr>
                    <th className="p-3 border-r border-black/5 dark:border-white/10">Bank Name & Branch</th>
                    <th className="p-3 border-r border-black/5 dark:border-white/10 w-28 text-center">A/c No</th>
                    <th className="p-3 border-r border-black/5 dark:border-white/10 w-20 text-center">Type</th>
                    <th className="p-3 text-right w-32">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10 font-mono text-xs">
                  {branchData.bankAccounts.map((b, idx) => (
                    <tr
                      key={idx}
                      className={isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}
                    >
                      <td className="p-3 border-r border-black/5 dark:border-white/10 font-sans font-bold flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${b.iconColor}`} />
                        <span>{b.bank_name}</span>
                      </td>
                      <td className="p-3 border-r border-black/5 dark:border-white/10 text-center">
                        <button
                          onClick={() => handleCopyAccount(b.account_no)}
                          className="inline-flex items-center space-x-1 hover:underline cursor-pointer"
                        >
                          <span>{b.mask}</span>
                          {copiedAccount === b.account_no ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3 opacity-50" />
                          )}
                        </button>
                      </td>
                      <td className="p-3 border-r border-black/5 dark:border-white/10 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold border ${b.badgeColor}`}>
                          {b.type}
                        </span>
                      </td>
                      <td className="p-3 text-right font-black text-sky-600 dark:text-sky-300">
                        {formatCurrency(b.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot
                  className={`font-mono border-t font-bold text-xs ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-slate-100 border-slate-200 text-slate-900'
                  }`}
                >
                  <tr>
                    <td colSpan={3} className="p-3 font-sans uppercase text-right">
                      Total Cash in Bank:
                    </td>
                    <td className="p-3 text-right font-black text-sky-600 dark:text-sky-300">
                      {formatCurrency(branchData.bankTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right (5 Cols): NOTICE & ALERTS PANEL */}
        <div
          className={`lg:col-span-5 rounded-3xl border p-4 sm:p-5 backdrop-blur-2xl space-y-3.5 ${
            isDark
              ? 'bg-[#0f172a]/90 border-white/15 text-white'
              : 'bg-white/96 border-slate-200/90 text-slate-950 shadow-xs'
          }`}
        >
          <div className="flex justify-between items-center border-b border-black/5 dark:border-white/10 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                Showroom Alerts & Notices
              </h2>
            </div>
            <span
              className={`text-[10.5px] px-2.5 py-0.5 rounded-full font-bold border ${
                isDark
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}
            >
              {noticeItems.length} Pending
            </span>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 overflow-x-auto pb-1 text-xs scrollbar-none">
            {[
              { id: 'all', label: 'All' },
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
                    ? isDark
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-blue-600 text-white shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notices List */}
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {filteredNotices.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-2xl border transition-all space-y-1.5 ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 border-white/10'
                    : 'bg-slate-50 hover:bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs">{n.title}</span>
                  <span className={`text-[9.5px] font-bold px-2 py-0.2 rounded-full border ${n.badgeColor}`}>
                    {n.tag}
                  </span>
                </div>
                <p className="text-[11px] opacity-75">{n.subtitle}</p>

                <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/10">
                  {n.amount ? (
                    <div className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-300">
                      Amount: {formatCurrency(n.amount)}
                    </div>
                  ) : (
                    <div className="text-[10px] opacity-60">Action pending</div>
                  )}

                  <button
                    onClick={() => handleAlertAction(n)}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                        : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-2xs'
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

      {/* WhatsApp Modal */}
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
