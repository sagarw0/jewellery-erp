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
  const { currentTheme, isDark } = useTheme();
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div
        className={`rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] border ${
          isDark
            ? 'bg-[#181C20] border-[#23282D] text-[#F8FAFC]'
            : 'bg-white border-slate-300 text-slate-950'
        }`}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-blue-700 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-xs">
              <BarChart3 className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-normal flex items-center space-x-2">
                <span>Executive Jewellery Business Analytics</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-200 border border-amber-300/40 font-mono font-semibold">
                  Live Intelligence
                </span>
              </h2>
              <p className="text-xs text-blue-100 font-medium">
                Top suppliers, job workers (Karagirs), sales volume, and ornament demand trends.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Period Selector Tabs */}
            <div className="bg-blue-900/40 p-1 rounded-xl flex space-x-1 text-xs font-semibold">
              {(['Today', 'Week', 'Month', 'Year'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedPeriod === p
                      ? 'bg-white text-blue-950 shadow-xs'
                      : 'text-blue-100 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Top Performance Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#13171A] border-[#23282D] text-white shadow-xl' : 'bg-sky-50 border-sky-300 text-slate-950 shadow-xs'
            }`}>
              <div className={`font-semibold text-[11px] uppercase tracking-wider ${isDark ? 'text-[#8492A6]' : 'text-slate-700'}`}>
                Total Sales Revenue ({selectedPeriod})
              </div>
              <div className={`text-xl italic font-bold font-mono tracking-tight mt-1.5 ${isDark ? 'text-white' : 'text-blue-800'}`}>
                {formatCurrency(currentSold.revenue)}
              </div>
              <div className={`text-[10.5px] font-semibold mt-1 flex items-center ${isDark ? 'text-[#4EF2D2]' : 'text-emerald-700'}`}>
                <TrendingUp className="w-3.5 h-3.5 mr-1 inline shrink-0" />
                <span>+18.4% growth vs previous {selectedPeriod.toLowerCase()}</span>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#13171A] border-[#23282D] text-white shadow-xl' : 'bg-amber-50 border-amber-300 text-slate-950 shadow-xs'
            }`}>
              <div className={`font-semibold text-[11px] uppercase tracking-wider ${isDark ? 'text-[#8492A6]' : 'text-slate-700'}`}>
                Total Gold Sold ({selectedPeriod})
              </div>
              <div className={`text-xl italic font-bold font-mono tracking-tight mt-1.5 ${isDark ? 'text-white' : 'text-amber-800'}`}>
                {formatWeight(currentSold.gold_wt)}
              </div>
              <div className={`text-[10.5px] font-semibold mt-1 ${isDark ? 'text-[#4EF2D2]' : 'text-amber-800'}`}>
                Avg realization: ₹7,285/g
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#13171A] border-[#23282D] text-white shadow-xl' : 'bg-slate-100 border-slate-300 text-slate-950 shadow-xs'
            }`}>
              <div className={`font-semibold text-[11px] uppercase tracking-wider ${isDark ? 'text-[#8492A6]' : 'text-slate-700'}`}>
                Total Silver Sold ({selectedPeriod})
              </div>
              <div className={`text-xl italic font-bold font-mono tracking-tight mt-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {formatWeight(currentSold.silver_wt)}
              </div>
              <div className={`text-[10.5px] font-semibold mt-1 ${isDark ? 'text-[#8492A6]' : 'text-slate-600'}`}>
                Avg rate: ₹86.50/g
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#13171A] border-[#23282D] text-white shadow-xl' : 'bg-rose-50 border-rose-300 text-slate-950 shadow-xs'
            }`}>
              <div className={`font-semibold text-[11px] uppercase tracking-wider ${isDark ? 'text-[#8492A6]' : 'text-slate-700'}`}>
                1gm Imitation Sold
              </div>
              <div className={`text-xl italic font-bold font-mono tracking-tight mt-1.5 ${isDark ? 'text-white' : 'text-rose-800'}`}>
                {currentSold.imitation_qty} Pcs
              </div>
              <div className={`text-[10.5px] font-semibold mt-1 ${isDark ? 'text-[#F78154]' : 'text-rose-800'}`}>
                Fast-moving counter category
              </div>
            </div>
          </div>

          {/* Section 1: Most Demanded & Top Sold Ornaments */}
          <div className={`border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 ${
            isDark ? 'bg-[#13171A] border-[#23282D] text-white' : 'bg-white border-slate-300 text-slate-950'
          }`}>
            <div className="flex justify-between items-center border-b border-black/10  pb-2.5">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-950 text-slate-900">
                  Most Demanded & Ornament-Wise Top Sold
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-600 text-slate-600">
                Ranked by Customer Inquiries & Counter Volume
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-300  rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className={`font-bold border-b select-none ${
                  isDark ? 'bg-white/10 border-white/15 text-white' : 'bg-slate-100 border-slate-300 text-slate-950'
                }`}>
                  <tr>
                    <th className="p-3 border-r border-slate-200 ">Ornament Name</th>
                    <th className="p-3 border-r border-slate-200 ">Category</th>
                    <th className="p-3 border-r border-slate-200  text-center">Customer Inquiries</th>
                    <th className="p-3 border-r border-slate-200  text-center">Units Sold</th>
                    <th className="p-3 border-r border-slate-200 ">Demand Meter</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 ">
                  {mostDemanded.map((it, idx) => {
                    const demandScore = Math.round((it.inquiries / 64) * 100);
                    return (
                      <tr key={idx} className={isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}>
                        <td className="p-3 border-r border-slate-200  font-semibold text-slate-950 text-slate-900">{it.name}</td>
                        <td className="p-3 border-r border-slate-200 ">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-950  text-blue-700 border border-blue-300  font-semibold text-[10.5px]">
                            {it.category}
                          </span>
                        </td>
                        <td className="p-3 border-r border-slate-200  text-center font-mono font-bold text-blue-800 text-blue-700">{it.inquiries}</td>
                        <td className="p-3 border-r border-slate-200  text-center font-mono font-bold text-emerald-800 text-emerald-700">{it.sold}</td>
                        <td className="p-3 border-r border-slate-200  w-48">
                          <div className="w-full bg-slate-200 dark:bg-white/15 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-rose-500 h-2.5 rounded-full"
                              style={{ width: `${demandScore}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="p-3 text-right font-medium">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${
                            it.stock_status.includes('Low Stock') || it.stock_status.includes('Restock')
                              ? 'bg-rose-100 text-rose-950  text-rose-800 border-rose-300 '
                              : 'bg-emerald-100 text-emerald-950  text-emerald-700 border-emerald-300 '
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
            <div className={`border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 ${
              isDark ? 'bg-slate-900/90 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-950'
            }`}>
              <div className="flex items-center space-x-2 border-b border-black/10  pb-2.5">
                <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-950 text-slate-900">
                  Top Bullion & Ornament Suppliers
                </h3>
              </div>
              <div className="space-y-2">
                {topSuppliers.map((sup, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border flex justify-between items-center ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-300'
                  }`}>
                    <div>
                      <div className="font-semibold text-xs text-slate-950 text-slate-900">{sup.name}</div>
                      <div className="text-[10.5px] font-medium text-slate-600 text-slate-600 mt-0.5">{sup.location} • {sup.orders} Lots Inwarded</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-slate-950 text-slate-900 text-xs">{formatWeight(sup.total_wt)}</div>
                      <div className="text-[10.5px] text-emerald-800 text-emerald-700 font-semibold">★ {sup.rating} Rating</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Job Workers (Karagirs) */}
            <div className={`border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5 ${
              isDark ? 'bg-slate-900/90 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-950'
            }`}>
              <div className="flex items-center space-x-2 border-b border-black/10  pb-2.5">
                <Hammer className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-950 text-slate-900">
                  Top Job Workers (Karagir Efficiency)
                </h3>
              </div>
              <div className="space-y-2">
                {topKaragirs.map((kg, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border flex justify-between items-center ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-300'
                  }`}>
                    <div>
                      <div className="font-semibold text-xs text-slate-950 text-slate-900">{kg.name}</div>
                      <div className="text-[10.5px] font-medium text-slate-600 text-slate-600 mt-0.5">{kg.specialty} • {kg.jobs} Orders Completed</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-slate-950 text-slate-900">{kg.on_time}% On-Time</div>
                      <div className="text-[10.5px] text-emerald-800 text-emerald-700 font-semibold">Loss: {kg.loss_pct}% (A+ Grade)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex justify-between items-center text-xs shrink-0 ${
          isDark ? 'bg-[#070b14] border-white/10 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-700'
        }`}>
          <div className="font-medium text-slate-700 text-slate-700">
            Export full reporting from <strong>Reports ➔ MIS Reports</strong> menu.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md cursor-pointer transition"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
};
