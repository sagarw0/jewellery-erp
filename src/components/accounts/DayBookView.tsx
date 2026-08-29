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
  Building
} from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { FieldHelpModal } from '../common/FieldHelpModal';

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
      <div className="bg-white border border-sky-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Day Book Register</h1>
            <p className="text-xs text-slate-500">
              Daily audit register with all 12 columns, URD scrap deductions, and Cash/Bank EOD reconciliation.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 hover:bg-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-200 hover:bg-sky-100"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Register</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-300 hover:bg-amber-100"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sky-200 bg-white rounded-t-xl px-2 pt-2 space-x-1 overflow-x-auto scrollbar-none shadow-2xs">
        {[
          { id: 'cash_book', label: '1. Cash Book' },
          { id: 'stock_book', label: '2. Stock Book' },
          { id: 'sales_book', label: '3. Sales Book' },
          { id: 'summary', label: '4. Summary' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DayBookTab)}
            className={`px-3.5 py-1.5 rounded-t-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-50/80 text-blue-700 border-b-2 border-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 flex-wrap">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-semibold">From Date:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono text-xs"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-semibold">To Date:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono text-xs"
            />
          </div>
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search invoice or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Day Book Table with all 12 Columns */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2 border-r border-slate-200">InvoiceType</th>
                <th className="p-2 border-r border-slate-200 font-mono">Invoice.No</th>
                <th className="p-2 border-r border-slate-200 text-right">Total.Amt</th>
                <th className="p-2 border-r border-slate-200 text-right text-amber-800">URD.Amt</th>
                <th className="p-2 border-r border-slate-200 text-right font-bold text-slate-900">Net.Amt</th>
                <th className="p-2 border-r border-slate-200 text-right text-emerald-700 bg-emerald-50/40">Cash.Rec</th>
                <th className="p-2 border-r border-slate-200 text-right text-rose-700">Cash.Pay</th>
                <th className="p-2 border-r border-slate-200 text-right text-blue-700 bg-sky-50/40">Bank.Rec</th>
                <th className="p-2 border-r border-slate-200 text-right text-rose-700">Bank.Pay</th>
                <th className="p-2 border-r border-slate-200">Date</th>
                <th className="p-2 border-r border-slate-200 min-w-[180px]">Details</th>
                <th className="p-2 text-right">Total w/o Disc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
              {filteredEntries.map((row) => (
                <tr key={row.id} className="hover:bg-sky-50/30">
                  <td className="p-2 border-r border-slate-200 font-sans">{row.invoice_type}</td>
                  <td className="p-2 border-r border-slate-200 font-bold text-blue-800">{row.invoice_no}</td>
                  <td className="p-2 border-r border-slate-200 text-right">{formatCurrency(row.total_amt)}</td>
                  <td className="p-2 border-r border-slate-200 text-right text-amber-800">{formatCurrency(row.urd_amt)}</td>
                  <td className="p-2 border-r border-slate-200 text-right font-bold text-slate-900">{formatCurrency(row.net_amt)}</td>
                  <td className="p-2 border-r border-slate-200 text-right text-emerald-700 bg-emerald-50/20">{formatCurrency(row.cash_received)}</td>
                  <td className="p-2 border-r border-slate-200 text-right text-rose-700">{formatCurrency(row.cash_payment)}</td>
                  <td className="p-2 border-r border-slate-200 text-right text-blue-700 bg-sky-50/20">{formatCurrency(row.bank_received)}</td>
                  <td className="p-2 border-r border-slate-200 text-right text-rose-700">{formatCurrency(row.bank_payment)}</td>
                  <td className="p-2 border-r border-slate-200">{row.date}</td>
                  <td className="p-2 border-r border-slate-200 font-sans text-slate-700 truncate max-w-[200px]">{row.details}</td>
                  <td className="p-2 text-right text-slate-600">{formatCurrency(row.total_amt_without_disc)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash & Bank Balances Strip (Spec #13) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cash Drawer */}
        <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-emerald-700 border-b border-slate-100 pb-1.5">
            <Wallet className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">Cash Register Reconciliation</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-600 font-mono">
            <div>Opening: <strong className="text-slate-900">{formatCurrency(summary.total_cash_opening)}</strong></div>
            <div>Closing: <strong className="text-emerald-700 font-extrabold">{formatCurrency(summary.total_cash_closing)}</strong></div>
          </div>
        </div>

        {/* Bank Account */}
        <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-blue-700 border-b border-slate-100 pb-1.5">
            <Building className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">Bank Ledger Reconciliation</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-600 font-mono">
            <div>Opening: <strong className="text-slate-900">{formatCurrency(summary.bank_opening)}</strong></div>
            <div>Closing: <strong className="text-blue-700 font-extrabold">{formatCurrency(summary.bank_closing)}</strong></div>
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
