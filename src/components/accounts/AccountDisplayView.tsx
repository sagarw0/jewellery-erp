import React, { useState } from 'react';
import {
  DebitLedgerEntry,
  CreditLedgerEntry,
  AccountMaster
} from '../../types/erp';
import {
  Users,
  Printer,
  XCircle,
  HelpCircle,
  MessageCircle,
  Columns3,
  Calendar,
  Send,
  Building2,
  TrendingUp,
  Download
} from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { WhatsAppShareModal } from '../common/WhatsAppShareModal';
import { FieldHelpModal } from '../common/FieldHelpModal';
import { useTheme } from '../../context/ThemeContext';

interface AccountDisplayViewProps {
  accounts: AccountMaster[];
  debitEntries: DebitLedgerEntry[];
  creditEntries: CreditLedgerEntry[];
  onClose: () => void;
}

export const AccountDisplayView: React.FC<AccountDisplayViewProps> = ({
  accounts,
  debitEntries,
  creditEntries,
  onClose,
}) => {
  const { currentTheme, computedTokens, isDark } = useTheme();
  const [selectedAccount, setSelectedAccount] = useState<string>(
    accounts[0]?.account_name || 'Shri Ganesh Jewellers Wholesale'
  );
  const [oneColumnDisplay, setOneColumnDisplay] = useState(false);
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-27');

  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const totalDebit = debitEntries.reduce((s, e) => s + (e.rs || 0), 0);
  const totalCredit = creditEntries.reduce((s, e) => s + (e.rs || 0), 0);
  const netClosingBalance = totalDebit - totalCredit;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Toolbar */}
      <div
        className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-xs ${
          isDark
            ? 'bg-[#0f172a]/90 border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
        }`}
      >
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold tracking-normal">
                General Ledger & T-Account Display
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-400/30">
                Double Entry
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Debit / Credit T-account display with One Column Display mode toggle and instant WhatsApp ledger statements.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          {/* One Column Display Toggle (Spec #18) */}
          <label
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              oneColumnDisplay
                ? isDark
                  ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                  : 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                : isDark
                ? 'bg-white/5 text-slate-300 border-white/10'
                : 'bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <input
              type="checkbox"
              checked={oneColumnDisplay}
              onChange={(e) => setOneColumnDisplay(e.target.checked)}
              className="sr-only"
            />
            <Columns3 className="w-3.5 h-3.5" />
            <span>{oneColumnDisplay ? 'Single Column' : 'T-Format (Two Column)'}</span>
          </label>

          <button
            onClick={() => setShowWhatsApp(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Ledger</span>
          </button>

          <button
            onClick={() => window.print()}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDark
                ? 'bg-white/5 text-slate-200 hover:bg-white/10 border-white/10'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300 shadow-2xs'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-400/40 hover:bg-amber-500/20 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Account Selector & Date Range Filter */}
      <div
        className={`p-4 rounded-2xl border space-y-3 shadow-xs ${
          isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Select Ledger Account
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className={`w-full px-3 py-1.5 rounded-xl border font-bold ${
                isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            >
              {accounts.map((a) => (
                <option key={a.account_code} value={a.account_name} className="dark:bg-slate-900">
                  {a.account_name} ({a.account_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-xl border font-mono ${
                isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-xl border font-mono ${
                isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>
        </div>
      </div>

      {/* T-Account Two Column or One Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DEBIT SIDE (Left) */}
        <div
          className={`rounded-2xl border overflow-hidden shadow-xs ${
            isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <div className="p-3 bg-rose-500/10 border-b border-rose-500/20 flex items-center justify-between">
            <span className="font-bold text-rose-600 dark:text-rose-400 text-xs uppercase tracking-wider">
              Debit Entries (Dr)
            </span>
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">
              Total Dr: {formatCurrency(totalDebit)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono text-[11px]">
              <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 font-bold border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-2.5 pl-3">Date</th>
                  <th className="p-2.5 font-sans">Particulars</th>
                  <th className="p-2.5">Ref No</th>
                  <th className="p-2.5 text-right pr-3 font-bold text-rose-600 dark:text-rose-400">
                    Debit (Rs.)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {debitEntries.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-rose-50/50'
                    }`}
                  >
                    <td className="p-2.5 pl-3 text-slate-400">{row.date}</td>
                    <td className="p-2.5 font-sans font-semibold text-slate-900 dark:text-white">
                      {row.particulars}
                    </td>
                    <td className="p-2.5 text-slate-500 font-bold">{row.r_no}</td>
                    <td className="p-2.5 text-right pr-3 font-bold text-rose-600 dark:text-rose-400">
                      {formatCurrency(row.rs)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CREDIT SIDE (Right) */}
        <div
          className={`rounded-2xl border overflow-hidden shadow-xs ${
            isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider">
              Credit Entries (Cr)
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
              Total Cr: {formatCurrency(totalCredit)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono text-[11px]">
              <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 font-bold border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-2.5 pl-3">Date</th>
                  <th className="p-2.5 font-sans">Particulars</th>
                  <th className="p-2.5">Voucher No</th>
                  <th className="p-2.5 text-right pr-3 font-bold text-emerald-600 dark:text-emerald-400">
                    Credit (Rs.)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {creditEntries.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-emerald-50/50'
                    }`}
                  >
                    <td className="p-2.5 pl-3 text-slate-400">{row.date}</td>
                    <td className="p-2.5 font-sans font-semibold text-slate-900 dark:text-white">
                      {row.particulars}
                    </td>
                    <td className="p-2.5 text-slate-500 font-bold">{row.v_no}</td>
                    <td className="p-2.5 text-right pr-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(row.rs)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Net Closing Balance Summary Card */}
      <div
        className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-xs ${
          isDark
            ? 'bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-emerald-500/10 border-amber-400/20'
            : 'bg-white border-amber-300 shadow-2xs'
        }`}
      >
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Net Ledger Position ({selectedAccount})
          </span>
          <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">
            Total Debit: {formatCurrency(totalDebit)} • Total Credit: {formatCurrency(totalCredit)}
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 block">Closing Balance (c/f)</span>
          <span
            className={`text-lg sm:text-xl font-bold font-mono ${
              netClosingBalance >= 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {formatCurrency(Math.abs(netClosingBalance))} {netClosingBalance >= 0 ? 'Dr (Due)' : 'Cr (Advance)'}
          </span>
        </div>
      </div>

      <WhatsAppShareModal
        isOpen={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        recipientName={selectedAccount}
        phone="9820123456"
        defaultMessage={`*SWARNA JEWELLERS - ACCOUNT STATEMENT* 🏆\n\nDear *${selectedAccount}*,\n\nYour current ledger balance is ${formatCurrency(Math.abs(netClosingBalance))} ${netClosingBalance >= 0 ? 'Dr (Due)' : 'Cr (Advance)'}.\n\n_Thank you for doing business with us._`}
      />

      <FieldHelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        screenName="Account Display"
      />
    </div>
  );
};
