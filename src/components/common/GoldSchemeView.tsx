import React, { useState } from 'react';
import { Coins, Plus, Calendar, Wallet } from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { useTheme } from '../../context/ThemeContext';

export const GoldSchemeView: React.FC = () => {
  const { isDark } = useTheme();
  const [activeMembers, setActiveMembers] = useState([
    {
      id: 'sch-1',
      member_no: 'SN-2026-081',
      name: 'Sunita Patil',
      phone: '9820556677',
      monthly_amt: 5000,
      tenure_months: 11,
      installments_paid: 8,
      accumulated_amt: 40000,
      gold_wt_accrued: 5.625,
      bonus_contribution: 5000,
      status: 'Active',
    },
    {
      id: 'sch-2',
      member_no: 'SN-2026-092',
      name: 'Kavita Joshi',
      phone: '9819443322',
      monthly_amt: 10000,
      tenure_months: 11,
      installments_paid: 11,
      accumulated_amt: 110000,
      gold_wt_accrued: 15.420,
      bonus_contribution: 10000,
      status: 'Matured - Ready for Jewellery Redemption',
    },
  ]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className={`border rounded-xl p-4 flex items-center justify-between shadow-sm transition-all ${
        isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/80 text-slate-800'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg border ${
            isDark ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' : 'bg-amber-50 text-amber-700 border-amber-300'
          }`}>
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span>Swarna Nidhi - Monthly Gold Savings Scheme</span>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold border ${
                isDark ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                11+1 Bonus Plan
              </span>
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Customer monthly deposit scheme with pure gold weight accrual and showroom bonus contribution.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('New member enrolled into Swarna Nidhi Scheme.')}
          className={`flex items-center space-x-1 px-4 py-1.5 rounded-lg text-xs font-bold shadow cursor-pointer transition-all ${
            isDark
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-extrabold'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Enroll New Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeMembers.map((m) => (
          <div
            key={m.id}
            className={`p-5 border rounded-xl shadow-sm space-y-4 transition-all ${
              isDark
                ? 'bg-[#0f172a]/90 border-white/10 text-white hover:border-amber-400/50'
                : 'bg-white border-sky-200/80 text-slate-900 hover:border-blue-400'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{m.name}</span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold border ${
                    isDark ? 'bg-white/10 text-amber-300 border-white/15' : 'bg-sky-50 text-blue-800 border-sky-200'
                  }`}>
                    {m.member_no}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Ph: {m.phone} | Plan: {formatCurrency(m.monthly_amt)}/mo
                </p>
              </div>

              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                m.status.includes('Matured')
                  ? isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : isDark ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {m.status}
              </span>
            </div>

            <div>
              <div className={`flex justify-between text-xs mb-1 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span>Installments Cleared: {m.installments_paid} of {m.tenure_months}</span>
                <span className={`font-bold ${isDark ? 'text-amber-300' : 'text-blue-700'}`}>
                  {Math.round((m.installments_paid / m.tenure_months) * 100)}%
                </span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden border ${
                isDark ? 'bg-white/10 border-white/10' : 'bg-slate-100 border-slate-200'
              }`}>
                <div
                  className={`h-full rounded-full transition-all ${
                    isDark ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${(m.installments_paid / m.tenure_months) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className={`grid grid-cols-3 gap-2 pt-2 border-t text-[11px] font-mono ${
              isDark ? 'border-white/10' : 'border-slate-100'
            }`}>
              <div className={`p-2 rounded border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`block text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Accumulated</span>
                <strong className={isDark ? 'text-white' : 'text-slate-800'}>{formatCurrency(m.accumulated_amt)}</strong>
              </div>
              <div className={`p-2 rounded border ${isDark ? 'bg-amber-400/10 border-amber-400/30' : 'bg-amber-50 border-amber-200'}`}>
                <span className={`block text-[9px] ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>Gold Accrued</span>
                <strong className={isDark ? 'text-amber-300' : 'text-amber-900'}>{formatWeight(m.gold_wt_accrued)}</strong>
              </div>
              <div className={`p-2 rounded border ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <span className={`block text-[9px] ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Showroom Bonus</span>
                <strong className={isDark ? 'text-emerald-300' : 'text-emerald-800'}>+{formatCurrency(m.bonus_contribution)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
