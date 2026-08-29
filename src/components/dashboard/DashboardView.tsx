import React from 'react';
import {
  Gem,
  Coins,
  Wallet,
  TrendingUp,
  Receipt,
  Scale,
  ShoppingBag,
  Flame,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { QuickActionMenu } from '../layout/QuickActionMenu';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { NewOrderBookingRecord, SundryDebtorRow, StockItem } from '../../types/erp';

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
  const totalStockFineWt = stockItems.reduce((s, it) => s + (it.fine_wt || 0), 0);
  const totalDebtorPendingWt = debtors.reduce((s, d) => s + (d.pending_wt || 0), 0);
  const totalDebtorBalance = debtors.reduce((s, d) => s + (d.balance || 0), 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Today's Counter Sales */}
        <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-bold uppercase tracking-wider text-slate-600">Today's Sales (POS)</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-slate-900 mb-1">
            ₹1,92,500
          </div>
          <div className="flex items-center text-[11px] text-emerald-700 space-x-1 font-medium">
            <span>+14.2% vs yesterday</span>
            <span className="text-slate-400">• 4 bills settled</span>
          </div>
        </div>

        {/* 2. Pure Bullion In Hand */}
        <div className="bg-white border border-amber-200/90 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-bold uppercase tracking-wider text-amber-900">Pure Gold Vault Stock</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-300">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-amber-700 mb-1">
            {formatWeight(totalStockFineWt)}
          </div>
          <div className="flex items-center text-[11px] text-slate-600 space-x-1">
            <span>Valuation: ~{formatCurrency(totalStockFineWt * gold24kRate)}</span>
          </div>
        </div>

        {/* 3. Physical Cash in Till */}
        <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-bold uppercase tracking-wider text-slate-600">Cash in Drawer</span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-sky-700 mb-1">
            ₹1,34,600
          </div>
          <div className="flex items-center text-[11px] text-slate-500 space-x-1">
            <span>Bank: ₹1,83,500</span>
            <span className="text-slate-400">• Reconciled</span>
          </div>
        </div>

        {/* 4. Pending Bullion Weight from Debtors (Spec #8) */}
        <div className="bg-white border border-rose-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-bold uppercase tracking-wider text-rose-800">Debtor Pending WT</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-mono font-extrabold text-rose-700 mb-1">
            {formatWeight(totalDebtorPendingWt)}
          </div>
          <div className="flex items-center text-[11px] text-slate-600 space-x-1">
            <span>Balance: {formatCurrency(totalDebtorBalance)}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Launchpad */}
      <QuickActionMenu onAction={onQuickAction} />

      {/* Live Bullion Market Rates & Active Orders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Recent Customer Orders */}
        <div className="lg:col-span-8 bg-white border border-sky-200/80 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Active Custom Orders & Karagir Workshop
              </h3>
            </div>
            <button
              onClick={() => onQuickAction('new_order')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>+ Book New Order</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => onQuickAction('new_order')}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-300 hover:bg-sky-50/40 cursor-pointer transition-all space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{ord.header.customer_n}</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-blue-800 border border-sky-200">
                        {ord.order_no}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {ord.items[0]?.item_name} ({ord.items[0]?.description || 'Custom Jewellery'})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      ord.status === 'With Karagir'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      {ord.status}
                    </span>
                    <div className="text-xs font-mono font-extrabold text-slate-800 mt-1">
                      Due: {formatCurrency(ord.payment.balance_amount)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-[11px] font-mono text-slate-600">
                  <div>Gross: <strong className="text-slate-800">{formatWeight(ord.items[0]?.gross_wt)}</strong></div>
                  <div>Net: <strong className="text-amber-700">{formatWeight(ord.items[0]?.net_wt)}</strong></div>
                  <div>Advance: <strong className="text-emerald-700">{formatCurrency(ord.payment.advance_amt)}</strong></div>
                  <div>Delivery: <strong className="text-slate-800">{ord.header.delivery_date}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Daily Market Board & Security Audit */}
        <div className="lg:col-span-4 space-y-4">
          {/* Live Bullion Board */}
          <div className="bg-white border border-sky-200/80 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-amber-700 border-b border-slate-100 pb-2">
              <Coins className="w-4 h-4" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Showroom Bullion Rates
              </h3>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200 flex justify-between items-center">
                <span className="text-slate-700 font-sans font-semibold">Gold 24K (999.9 Pure):</span>
                <span className="font-extrabold text-amber-800 text-sm">₹{gold24kRate}/g</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200 flex justify-between items-center">
                <span className="text-slate-700 font-sans font-semibold">Gold 22K (916 Hallmark):</span>
                <span className="font-extrabold text-amber-800 text-sm">₹{gold22kRate}/g</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-700 font-sans font-semibold">Silver (92.5 Sterling):</span>
                <span className="font-extrabold text-slate-800 text-sm">₹{silverRate}/g</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 pt-1 text-center">
              Market rates linked automatically to billing calculations.
            </div>
          </div>

          {/* Cloud Auto-Backup Telemetry */}
          <div className="bg-white border border-sky-200/80 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-sky-700 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Backup Status (Spec #5)
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Default Location:</span>
                <span className="text-emerald-700 font-mono font-semibold">Today, 05:30 PM ✓</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Google Drive Cloud:</span>
                <span className="text-emerald-700 font-mono font-semibold">Synced ✓</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>USB Locker Drive:</span>
                <span className="text-slate-700 font-mono">Yesterday ✓</span>
              </div>
            </div>

            <button
              onClick={() => onQuickAction('usb_backup')}
              className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold rounded-lg transition-colors mt-2"
            >
              Open Backup Media Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
