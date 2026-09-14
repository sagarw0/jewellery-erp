import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Hammer,
  Truck,
  Flame,
  X,
  Calendar,
  Sparkles,
  ArrowUpRight,
  PieChart
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { useTheme } from '../../context/ThemeContext';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'Today' | 'Week' | 'Month' | 'Year'>('Month');

  if (!isOpen) return null;

  const topSuppliers = [
    { name: 'Kalyan Bullion Refinery & Supply', orders: 28, total_wt: 1450.5, rating: 4.9, location: 'Zaveri Bazaar, Mumbai' },
    { name: 'Manav Diamond & Gem Importers', orders: 19, total_wt: 620.0, rating: 4.8, location: 'Surat SEZ' },
    { name: 'Shree Radhe Casting & Chains', orders: 15, total_wt: 890.2, rating: 4.7, location: 'Rajkot, Gujarat' },
    { name: 'Swarna Syndicate Bullion Desk', orders: 12, total_wt: 540.8, rating: 4.6, location: 'Ahmedabad' },
  ];

  const topKaragirs = [
    { name: 'Gopal Karagir (Kolkata Filigree Unit)', jobs: 42, loss_pct: 0.42, on_time: 98, specialty: 'Handcrafted Antique' },
    { name: 'Manoj Studio (Rajkot Laser Casting)', jobs: 36, loss_pct: 0.38, on_time: 96, specialty: 'Casted Bangles' },
    { name: 'Santosh & Brothers (Mumbai Workshop)', jobs: 29, loss_pct: 0.45, on_time: 94, specialty: 'Bridal Chokers' },
    { name: 'Rameshwar Setting (Diamond Micro-pave)', jobs: 24, loss_pct: 0.28, on_time: 99, specialty: 'Solitaire Rings' },
  ];

  const mostDemanded = [
    { name: '22K 916 Royal Peacock Choker Necklace', category: 'Gold', inquiries: 64, sold: 18, stock_status: 'High Demand / Low Stock' },
    { name: '916 Antique Temple Lakshmi Bangle (Set of 2)', category: 'Gold', inquiries: 52, sold: 22, stock_status: 'Restock Recommended' },
    { name: '1 Gram Micro-Plated Bridal Mangalsutra', category: '1gm Imitation', inquiries: 47, sold: 38, stock_status: 'In Stock' },
    { name: 'Pure 999 Silver Pooja Thali Set (500g)', category: 'Silver', inquiries: 39, sold: 14, stock_status: 'In Stock' },
    { name: 'EF VVS Diamond Solitaire Engagement Ring', category: 'Diamond', inquiries: 31, sold: 9, stock_status: 'Made to Order' },
  ];

  const totalSoldData = {
    Today: { gold_wt: 64.2, silver_wt: 520.0, imitation_qty: 12, revenue: 468000 },
    Week: { gold_wt: 410.8, silver_wt: 2850.0, imitation_qty: 84, revenue: 2985000 },
    Month: { gold_wt: 1680.5, silver_wt: 12400.0, imitation_qty: 320, revenue: 12240000 },
    Year: { gold_wt: 18450.0, silver_wt: 145000.0, imitation_qty: 3800, revenue: 134200000 },
  };

  const currentSold = totalSoldData[selectedPeriod];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl w-full max-w-5xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]`}>
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <BarChart3 className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide flex items-center space-x-2">
                <span>Executive Jewellery Business Analytics</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-200 border border-amber-300/40 font-mono">
                  Live Intelligence
                </span>
              </h2>
              <p className="text-xs text-blue-100">
                Top suppliers, job workers (Karagirs), sales volume, and ornament demand trends.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Period Selector Tabs */}
            <div className="bg-blue-900/40 p-1 rounded-lg flex space-x-1 text-xs">
              {(['Today', 'Week', 'Month', 'Year'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    selectedPeriod === p
                      ? 'bg-white text-blue-900 shadow-xs font-bold'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
          {/* Top Performance Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-sky-50/80 border border-sky-200 p-4 rounded-xl">
              <div className="text-slate-500 font-semibold text-[11px] uppercase">Total Sales Revenue ({selectedPeriod})</div>
              <div className="text-xl font-bold font-mono text-blue-900 mt-1">
                {formatCurrency(currentSold.revenue)}
              </div>
              <div className="text-[10px] text-emerald-700 font-medium mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 inline" />
                <span>+18.4% growth vs previous {selectedPeriod.toLowerCase()}</span>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl">
              <div className="text-slate-500 font-semibold text-[11px] uppercase">Total Gold Sold ({selectedPeriod})</div>
              <div className="text-xl font-bold font-mono text-amber-800 mt-1">
                {formatWeight(currentSold.gold_wt)}
              </div>
              <div className="text-[10px] text-amber-700 font-medium mt-1">
                Avg realization: ₹7,285/g
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <div className="text-slate-500 font-semibold text-[11px] uppercase">Total Silver Sold ({selectedPeriod})</div>
              <div className="text-xl font-bold font-mono text-slate-800 mt-1">
                {formatWeight(currentSold.silver_wt)}
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-1">
                Avg rate: ₹86.50/g
              </div>
            </div>

            <div className="bg-rose-50/80 border border-rose-200 p-4 rounded-xl">
              <div className="text-slate-500 font-semibold text-[11px] uppercase">1gm Imitation Sold</div>
              <div className="text-xl font-bold font-mono text-rose-800 mt-1">
                {currentSold.imitation_qty} Pcs
              </div>
              <div className="text-[10px] text-rose-700 font-medium mt-1">
                Fast-moving counter category
              </div>
            </div>
          </div>

          {/* Section 1: Most Demanded & Top Sold Ornaments */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Most Demanded & Ornament-Wise Top Sold
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">Ranked by Customer Inquiries & Counter Volume</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Ornament Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-center">Customer Inquiries</th>
                    <th className="p-2.5 text-center">Units Sold</th>
                    <th className="p-2.5">Demand Meter</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mostDemanded.map((it, idx) => {
                    const demandScore = Math.round((it.inquiries / 64) * 100);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-semibold text-slate-900">{it.name}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded bg-sky-100 text-blue-800 font-semibold text-[10px]">
                            {it.category}
                          </span>
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-blue-700">{it.inquiries}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-emerald-700">{it.sold}</td>
                        <td className="p-2.5 w-48">
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-rose-500 h-2 rounded-full"
                              style={{ width: `${demandScore}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="p-2.5 text-right font-medium">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            it.stock_status.includes('Low Stock') || it.stock_status.includes('Restock')
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {it.stock_status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Top Suppliers & Top Job Workers (Karagirs) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Suppliers */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Top Bullion & Ornament Suppliers
                </h3>
              </div>
              <div className="space-y-2">
                {topSuppliers.map((sup, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">{sup.name}</div>
                      <div className="text-[10px] text-slate-500">{sup.location} • {sup.orders} Lots Inwarded</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-blue-800">{formatWeight(sup.total_wt)}</div>
                      <div className="text-[10px] text-emerald-700 font-bold">★ {sup.rating} Rating</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Job Workers (Karagirs) */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Hammer className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Top Job Workers (Karagir Efficiency)
                </h3>
              </div>
              <div className="space-y-2">
                {topKaragirs.map((kg, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">{kg.name}</div>
                      <div className="text-[10px] text-slate-500">{kg.specialty} • {kg.jobs} Orders Completed</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-[11px] font-bold text-slate-800">{kg.on_time}% On-Time</div>
                      <div className="text-[10px] text-emerald-700 font-bold">Loss: {kg.loss_pct}% (A+ Grade)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <div className="text-slate-500">
            Export full reporting from <strong>Reports ➔ MIS Reports</strong> menu.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
};
