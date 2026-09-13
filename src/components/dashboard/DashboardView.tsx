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
  Package
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
      <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-sm">
            <Gem className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span>Showroom Operations & Financial Dashboard</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                Live Enterprise Sync
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Real-time cash, bank balances, stock breakdown, daily visitor footfall, and live alerts.
            </p>
          </div>
        </div>

        {/* Top Analytics Button */}
        <button
          onClick={() => setShowAnalytics(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <BarChart3 className="w-4 h-4 text-amber-300" />
          <span>Executive Analytics</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md font-mono">F1</span>
        </button>
      </div>

      {/* 1. TOP METRICS STRIP (7 Mandatory Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Today's Cash */}
        <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3.5 rounded-xl shadow-2xs hover:shadow-sm transition-all`}>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-bold uppercase">Today's Cash</span>
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-base font-bold font-mono text-emerald-700">₹1,42,600</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Cash Drawer In-Hand</div>
        </div>

        {/* Today's Bank */}
        <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3.5 rounded-xl shadow-2xs hover:shadow-sm transition-all`}>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-bold uppercase">Today's Bank</span>
            <Building className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-base font-bold font-mono text-blue-800">{formatCurrency(totalBankBalance)}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">4 Active Bank A/cs</div>
        </div>

        {/* Today's Sales */}
        <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3.5 rounded-xl shadow-2xs hover:shadow-sm transition-all`}>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-bold uppercase">Today's Sales</span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-base font-bold font-mono text-slate-900">₹2,84,500</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">+12.4% vs y'day</div>
        </div>

        {/* Today's Purchase */}
        <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3.5 rounded-xl shadow-2xs hover:shadow-sm transition-all`}>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-bold uppercase">Today's Purchase</span>
            <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-base font-bold font-mono text-amber-800">₹1,95,000</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Bullion & Lots Inward</div>
        </div>

        {/* Order Pending */}
        <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3.5 rounded-xl shadow-2xs hover:shadow-sm transition-all`}>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-bold uppercase">Order Pending</span>
            <Clock className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-base font-bold font-mono text-rose-700">{pendingOrdersCount} Orders</div>
          <div className="text-[10px] text-rose-600 font-semibold mt-0.5">2 Due for Delivery</div>
        </div>

        {/* New Visitors */}
        <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3.5 rounded-xl shadow-2xs hover:shadow-sm transition-all`}>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-bold uppercase">New Visitors</span>
            <UserPlus className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-base font-bold font-mono text-sky-800">14 Walk-ins</div>
          <div className="text-[10px] text-sky-700 mt-0.5">New KYC profiles</div>
        </div>

        {/* Today Visitors */}
        <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} p-3.5 rounded-xl shadow-2xs hover:shadow-sm transition-all`}>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-bold uppercase">Today Visitors</span>
            <Users className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-base font-bold font-mono text-purple-800">38 Footfall</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Showroom Counter Total</div>
        </div>
      </div>

      {/* 2. CURRENT STOCK BREAKDOWN (5 Categories: Imitation 1gm, URD Silver, URD Gold, Silver, Gold) */}
      <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm space-y-3`}>
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <Coins className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Current Stock Breakdown by Category
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Total Vault Weight: <strong className="text-blue-900 font-bold">{formatWeight(totalStockFineWt)}</strong> Pure Fine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {stockCategories.map((stk, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-xs truncate" title={stk.name}>
                  {stk.name}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${stk.badge}`}>
                  {stk.pcs} Pcs
                </span>
              </div>

              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Wt:</span>
                  <span className="font-bold text-slate-800">{formatWeight(stk.gross_wt)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Net Wt:</span>
                  <span className="font-bold text-blue-800">{formatWeight(stk.net_wt)}</span>
                </div>
                <div className="flex justify-between text-amber-800 pt-1 border-t border-slate-200 font-bold">
                  <span>Fine Wt:</span>
                  <span>{formatWeight(stk.fine_wt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TABULAR FORMAT (Cash in Hand & Cash in Bank) & 4. NOTICE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (7 Cols): Tabular Cash in Hand & Cash in Bank (Individual Bank Ledgers) */}
        <div className={`lg:col-span-7 ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm space-y-4`}>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Financial Balances: Cash in Hand & Cash in Bank
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800">
              Total Liquidity: {formatCurrency(cashInHand + totalBankBalance)}
            </span>
          </div>

          {/* Cash in Hand Banner */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex justify-between items-center">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-emerald-600 text-white">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-emerald-950 text-xs">Physical Cash in Hand (Till)</div>
                <div className="text-[10px] text-emerald-700">Counter Opening + Sales Collections Reconciled</div>
              </div>
            </div>
            <div className="text-lg font-bold font-mono text-emerald-800">
              {formatCurrency(cashInHand)}
            </div>
          </div>

          {/* Cash in Bank Table (Individual Bank Breakdown) */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Cash in Bank (Individual Accounts)
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
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
                    <tr key={idx} className="hover:bg-sky-50/30">
                      <td className="p-2.5 border-r border-slate-200 font-sans font-semibold text-slate-900">
                        {b.bank_name}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-slate-500">{b.account_no}</td>
                      <td className="p-2.5 border-r border-slate-200">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {b.type}
                        </span>
                      </td>
                      <td className="p-2.5 text-right font-bold text-blue-900">
                        {formatCurrency(b.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold font-mono border-t border-slate-300 text-xs">
                  <tr>
                    <td colSpan={3} className="p-2.5 font-sans uppercase text-right">
                      Total Cash in Bank:
                    </td>
                    <td className="p-2.5 text-right text-blue-900 font-extrabold">
                      {formatCurrency(totalBankBalance)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right (5 Cols): NOTICE PANEL */}
        <div className={`lg:col-span-5 ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm space-y-3`}>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-600 animate-bounce" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Showroom Notice & Alerts Panel
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
              {noticeItems.length} Pending
            </span>
          </div>

          {/* Notice Filter Tabs */}
          <div className="flex space-x-1 overflow-x-auto pb-1 text-[11px]">
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
                className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium transition-all ${
                  activeNoticeTab === tab.id
                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
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
                className={`p-3 rounded-xl border border-slate-200 border-l-4 ${n.color} transition-all space-y-1`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-700">
                    {n.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">{n.subtitle}</p>
                {n.amount && (
                  <div className="text-[11px] font-mono font-bold text-blue-900 pt-1">
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
