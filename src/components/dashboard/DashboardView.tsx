import React from 'react';
import {
  Gem,
  Keyboard,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
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
}) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-10 animate-in fade-in duration-300">
      {/* Clean, Minimalist Welcome Canvas */}
      <div className="max-w-3xl w-full bg-white border border-sky-200/80 rounded-2xl p-8 shadow-sm text-center space-y-6">
        {/* Brand Icon & Greeting */}
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-md">
            <Gem className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Welcome to Swarna Jewellery ERP
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Your workspace is ready. Select any module from the horizontal menu bar at the top to begin transactions, stock audit, or ledger management.
          </p>
        </div>

        {/* Date & Branch Context Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 bg-sky-50/60 border border-sky-100 rounded-xl py-2.5 px-4 font-medium">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentDate}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center space-x-1.5 font-mono">
            <span className="text-amber-700 font-bold">24K Gold:</span>
            <span className="text-slate-800 font-bold">₹{gold24kRate.toLocaleString('en-IN')}/g</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center space-x-1.5 font-mono">
            <span className="text-amber-700 font-bold">22K 916:</span>
            <span className="text-slate-800 font-bold">₹{gold22kRate.toLocaleString('en-IN')}/g</span>
          </div>
        </div>

        {/* Quick Keyboard Hotkeys Strip */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 mb-3">
            <Keyboard className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Quick Access Function Keys</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <button
              onClick={() => onQuickAction('item_creation')}
              className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer"
            >
              <strong className="text-blue-600">F2</strong> Item Creation
            </button>
            <button
              onClick={() => onQuickAction('barcode')}
              className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer"
            >
              <strong className="text-blue-600">F3</strong> Barcode Tag
            </button>
            <button
              onClick={() => onQuickAction('sales_invoice')}
              className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer"
            >
              <strong className="text-blue-600">F4</strong> Sales POS
            </button>
            <button
              onClick={() => onQuickAction('purchase')}
              className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer"
            >
              <strong className="text-blue-600">F5</strong> Purchase
            </button>
            <button
              onClick={() => onQuickAction('new_order')}
              className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer"
            >
              <strong className="text-blue-600">F7</strong> New Order
            </button>
            <button
              onClick={() => onQuickAction('ac_master')}
              className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer"
            >
              <strong className="text-blue-600">F8</strong> Account Master
            </button>
            <button
              onClick={() => onQuickAction('day_book')}
              className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer"
            >
              <strong className="text-blue-600">F10</strong> Day Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
