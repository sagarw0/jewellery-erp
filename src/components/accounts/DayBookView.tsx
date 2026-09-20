import React, { useState } from 'react';
import { DayBookEntry, DayBookSummary, DayBookTab } from '../../types/erp';
import {
  CalendarCheck,
  Printer,
  Download,
  XCircle,
  HelpCircle,
  Search,
  Wallet,
  Building,
  ArrowUpDown,
  Filter,
  Receipt,
  Sparkles,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { FieldHelpModal } from '../common/FieldHelpModal';
import { useTheme } from '../../context/ThemeContext';

interface DayBookViewProps {
  entries: DayBookEntry[];
  summary: DayBookSummary;
  onClose: () => void;
}

export const DayBookView: React.FC<DayBookViewProps> = ({
  entries,
  summary,
  onClose,
}) => {
  const { currentTheme, computedTokens, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<DayBookTab>('cash_book');
  const [fromDate, setFromDate] = useState('2026-08-27');
  const [toDate, setToDate] = useState('2026-08-27');
  const [searchTerm, setSearchTerm] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const filteredEntries = entries.filter((e) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      e.invoice_no.toLowerCase().includes(term) ||
      e.details.toLowerCase().includes(term) ||
      e.invoice_type.toLowerCase().includes(term)
    );
  });

  const totalCashRec = filteredEntries.reduce((s, it) => s + (it.cash_received || 0), 0);
  const totalCashPay = filteredEntries.reduce((s, it) => s + (it.cash_payment || 0), 0);
  const totalBankRec = filteredEntries.reduce((s, it) => s + (it.bank_received || 0), 0);
  const totalBankPay = filteredEntries.reduce((s, it) => s + (it.bank_payment || 0), 0);
  const totalNet = filteredEntries.reduce((s, it) => s + (it.net_amt || 0), 0);

  const handleExportCSV = () => {
    const headers = [
      'InvoiceType',
      'Invoice.No',
      'Total.Amt',
      'URD.Amt',
      'Net.Amt',
      'Cash.Received',
      'Cash.Payment',
      'Bank.Received',
      'Bank.Payment',
      'Date',
      'Details',
      'Total Amt without Disc',
    ];
    const rows = filteredEntries.map((e) => [
      e.invoice_type,
      e.invoice_no,
      e.total_amt,
      e.urd_amt,
      e.net_amt,
      e.cash_received,
      e.cash_payment,
      e.bank_received,
      e.bank_payment,
      e.date,
      `"${e.details.replace(/"/g, '""')}"`,
      e.total_amt_without_disc,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DayBook_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold tracking-normal">Day Book & Cashflow Register</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-400/30">
                12-Column EOD Audit
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily transaction ledger with URD scrap deductions, Cash/Bank reconciliation, and counter vouchers.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDark
                ? 'bg-white/5 text-slate-200 hover:bg-white/10 border-white/10'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300 shadow-2xs'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>Export CSV</span>
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

      {/* Tabs & Filters Bar */}
      <div
        className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-xs ${
          isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
          {[
            { id: 'cash_book', label: '1. Cash Book' },
            { id: 'stock_book', label: '2. Stock Book' },
            { id: 'sales_book', label: '3. Sales Book' },
            { id: 'summary', label: '4. Summary' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DayBookTab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? isDark
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2.5 flex-wrap">
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 font-bold">Date:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={`px-2 py-1 rounded-xl border font-mono text-xs ${
                isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            />
          </div>

          <div className="relative w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search invoice or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/15 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main Day Book Table */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-xs ${
          isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white border-slate-200'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={`border-b font-mono font-bold uppercase tracking-wider text-[10.5px] ${
                  isDark
                    ? 'bg-[#070b14]/90 text-slate-300 border-white/10'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <th className="p-3.5 pl-4">Invoice Type</th>
                <th className="p-3.5 font-mono">Invoice No</th>
                <th className="p-3.5 text-right">Total Amt</th>
                <th className="p-3.5 text-right text-amber-600 dark:text-amber-400">URD Amt</th>
                <th className="p-3.5 text-right font-bold">Net Billed</th>
                <th className="p-3.5 text-right text-emerald-600 dark:text-emerald-400">Cash Rec</th>
                <th className="p-3.5 text-right text-rose-600 dark:text-rose-400">Cash Pay</th>
                <th className="p-3.5 text-right text-blue-600 dark:text-blue-400">Bank Rec</th>
                <th className="p-3.5 text-right text-rose-600 dark:text-rose-400">Bank Pay</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 min-w-[180px]">Details</th>
                <th className="p-3.5 text-right pr-4">Total w/o Disc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-mono text-[11px]">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-10 text-center text-slate-500 font-sans">
                    No transactions found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50/70'
                    }`}
                  >
                    <td className="p-3.5 pl-4 font-sans font-semibold text-slate-900 dark:text-white">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-white/10">
                        {row.invoice_type}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-blue-600 dark:text-blue-400">
                      {row.invoice_no}
                    </td>
                    <td className="p-3.5 text-right text-slate-700 dark:text-slate-300">
                      {formatCurrency(row.total_amt)}
                    </td>
                    <td className="p-3.5 text-right text-amber-600 dark:text-amber-400">
                      {row.urd_amt > 0 ? formatCurrency(row.urd_amt) : '—'}
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900 dark:text-white">
                      {formatCurrency(row.net_amt)}
                    </td>
                    <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                      {row.cash_received > 0 ? formatCurrency(row.cash_received) : '—'}
                    </td>
                    <td className="p-3.5 text-right text-rose-600 dark:text-rose-400">
                      {row.cash_payment > 0 ? formatCurrency(row.cash_payment) : '—'}
                    </td>
                    <td className="p-3.5 text-right text-blue-600 dark:text-blue-400 font-bold">
                      {row.bank_received > 0 ? formatCurrency(row.bank_received) : '—'}
                    </td>
                    <td className="p-3.5 text-right text-rose-600 dark:text-rose-400">
                      {row.bank_payment > 0 ? formatCurrency(row.bank_payment) : '—'}
                    </td>
                    <td className="p-3.5 font-sans text-slate-500">{row.date}</td>
                    <td className="p-3.5 font-sans text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                      {row.details}
                    </td>
                    <td className="p-3.5 text-right pr-4 text-slate-500">
                      {formatCurrency(row.total_amt_without_disc)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer Totals */}
            <tfoot>
              <tr
                className={`border-t font-mono font-bold text-xs ${
                  isDark
                    ? 'bg-[#070b14]/95 text-white border-white/20'
                    : 'bg-slate-100 text-slate-950 border-slate-300'
                }`}
              >
                <td colSpan={2} className="p-3.5 pl-4 uppercase font-sans tracking-wider">
                  Totals ({filteredEntries.length} Invoices)
                </td>
                <td className="p-3.5 text-right">—</td>
                <td className="p-3.5 text-right text-amber-600 dark:text-amber-400">—</td>
                <td className="p-3.5 text-right">{formatCurrency(totalNet)}</td>
                <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalCashRec)}
                </td>
                <td className="p-3.5 text-right text-rose-600 dark:text-rose-400">
                  {formatCurrency(totalCashPay)}
                </td>
                <td className="p-3.5 text-right text-blue-600 dark:text-blue-400">
                  {formatCurrency(totalBankRec)}
                </td>
                <td className="p-3.5 text-right text-rose-600 dark:text-rose-400">
                  {formatCurrency(totalBankPay)}
                </td>
                <td colSpan={3} className="p-3.5 text-right pr-4">
                  Net Cashflow: {formatCurrency(totalCashRec + totalBankRec - totalCashPay - totalBankPay)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Cash & Bank Reconciliation Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cash Register */}
        <div
          className={`p-4 rounded-2xl border space-y-2 text-xs shadow-xs ${
            isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 border-b border-white/10 pb-2">
            <Wallet className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">Cash Register Reconciliation</span>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Opening Till</span>
              <strong className="text-slate-900 dark:text-white text-sm">
                {formatCurrency(summary.total_cash_opening)}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Closing Till</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-sm">
                {formatCurrency(summary.total_cash_closing)}
              </strong>
            </div>
          </div>
        </div>

        {/* Bank Ledger */}
        <div
          className={`p-4 rounded-2xl border space-y-2 text-xs shadow-xs ${
            isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 border-b border-white/10 pb-2">
            <Building className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">Bank Ledger Reconciliation</span>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Opening Bank</span>
              <strong className="text-slate-900 dark:text-white text-sm">
                {formatCurrency(summary.bank_opening)}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Closing Bank</span>
              <strong className="text-blue-600 dark:text-blue-400 text-sm">
                {formatCurrency(summary.bank_closing)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <FieldHelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        screenName="Day Book"
      />
    </div>
  );
};
