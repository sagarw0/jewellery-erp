import React, { useState } from 'react';
import { Coins, Plus, Calendar, Wallet } from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';

export const GoldSchemeView: React.FC = () => {
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
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-300">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span>Swarna Nidhi - Monthly Gold Savings Scheme</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold border border-amber-300">
                11+1 Bonus Plan
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Customer monthly deposit scheme with pure gold weight accrual and showroom bonus contribution.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('New member enrolled into Swarna Nidhi Scheme.')}
          className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Enroll New Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeMembers.map((m) => (
          <div
            key={m.id}
            className="p-5 bg-white border border-sky-200/80 rounded-xl shadow-sm space-y-4 hover:border-blue-400 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-50 text-blue-800 font-bold border border-sky-200">
                    {m.member_no}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Ph: {m.phone} | Plan: {formatCurrency(m.monthly_amt)}/mo</p>
              </div>

              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                m.status.includes('Matured')
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {m.status}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1 font-mono">
                <span>Installments Cleared: {m.installments_paid} of {m.tenure_months}</span>
                <span className="text-blue-700 font-bold">{Math.round((m.installments_paid / m.tenure_months) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${(m.installments_paid / m.tenure_months) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block text-[9px]">Accumulated</span>
                <strong className="text-slate-800">{formatCurrency(m.accumulated_amt)}</strong>
              </div>
              <div className="p-2 bg-amber-50 rounded border border-amber-200">
                <span className="text-amber-700 block text-[9px]">Gold Accrued</span>
                <strong className="text-amber-900">{formatWeight(m.gold_wt_accrued)}</strong>
              </div>
              <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                <span className="text-emerald-700 block text-[9px]">Showroom Bonus</span>
                <strong className="text-emerald-800">+{formatCurrency(m.bonus_contribution)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
