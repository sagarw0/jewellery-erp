import React, { useState } from 'react';
import { BookType, SundryDebtorRow, ColumnSetting } from '../../types/erp';
import {
  BookOpen,
  Printer,
  XCircle,
  HelpCircle,
  Search,
  Sliders,
  Scale
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { ColumnSettingsModal } from '../common/ColumnSettingsModal';
import { FieldHelpModal } from '../common/FieldHelpModal';

interface BookDisplayViewProps {
  debtors: SundryDebtorRow[];
  onClose: () => void;
}

const DEFAULT_DEBTOR_COLUMNS: ColumnSetting[] = [
  { id: 'customer_name', label: 'Customer Name', visible: true, width: 220, order: 0 },
  { id: 'code', label: 'Code', visible: true, width: 100, order: 1 },
  { id: 'balance', label: 'Balance', visible: true, width: 120, order: 2 },
  { id: 'pending_wt', label: 'Pending WT', visible: true, width: 130, order: 3 },
  { id: 'phone', label: 'Phone', visible: true, width: 120, order: 4 },
];

export const BookDisplayView: React.FC<BookDisplayViewProps> = ({ debtors, onClose }) => {
  const [bookType, setBookType] = useState<BookType>('Sundry Debtor');
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-27');
  const [searchTerm, setSearchTerm] = useState('');
  const [columns, setColumns] = useState<ColumnSetting[]>(DEFAULT_DEBTOR_COLUMNS);

  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const filteredDebtors = debtors.filter((d) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      d.customer_name.toLowerCase().includes(term) ||
      d.code.toLowerCase().includes(term) ||
      d.phone.includes(term)
    );
  });

  const totalBalance = filteredDebtors.reduce((s, d) => s + (d.balance || 0), 0);
  const totalPendingWt = filteredDebtors.reduce((s, d) => s + (d.pending_wt || 0), 0);

  const bookTypes: BookType[] = [
    'Sales Book',
    'Cash Book',
    'Sales Return Book',
    'Sundry Debtor',
    'Purchase',
    'Sundry Creditor',
    'Purchase Return Book',
    'Credit Limit Locking',
    'Journal',
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Toolbar */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Book Display Register</h1>
            <p className="text-xs text-slate-500">
              9 financial registers with Sundry Debtors and pure gold bullion <strong className="text-rose-700 font-mono font-bold">Pending WT</strong> in grams.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={() => setShowColumnSettings(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200 hover:bg-slate-200"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>GS</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-200 hover:bg-sky-100"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
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

      {/* Book Type Strip */}
      <div className="flex border-b border-sky-200 bg-white rounded-t-xl px-2 pt-2 space-x-1 overflow-x-auto scrollbar-none shadow-2xs">
        {bookTypes.map((bt) => (
          <button
            key={bt}
            onClick={() => setBookType(bt)}
            className={`px-3.5 py-1.5 rounded-t-lg text-xs font-semibold whitespace-nowrap transition-all ${
              bookType === bt
                ? 'bg-blue-50/80 text-blue-700 border-b-2 border-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {bt}
          </button>
        ))}
      </div>

      {/* Search & Date Filter Bar */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 flex-wrap">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-semibold">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono text-xs"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-semibold">To:</span>
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
            placeholder="Search customer name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2 border-r border-slate-200 w-10 text-center">#</th>
                <th className="p-2 border-r border-slate-200 min-w-[200px]">Customer Name</th>
                <th className="p-2 border-r border-slate-200 w-24">Code</th>
                <th className="p-2 border-r border-slate-200 w-32 text-right">Balance</th>
                <th className="p-2 border-r border-slate-200 w-36 text-right font-bold text-rose-800 bg-rose-50/50 flex items-center justify-end space-x-1">
                  <Scale className="w-3 h-3 text-rose-600 inline" />
                  <span>Pending WT (g)</span>
                </th>
                <th className="p-2">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
              {filteredDebtors.map((row, idx) => (
                <tr key={row.code || idx} className="hover:bg-sky-50/30">
                  <td className="p-2 border-r border-slate-200 text-center text-slate-400">{row.sr_no || idx + 1}</td>
                  <td className="p-2 border-r border-slate-200 font-sans font-semibold text-slate-900">{row.customer_name}</td>
                  <td className="p-2 border-r border-slate-200 text-blue-700 font-bold">{row.code}</td>
                  <td className="p-2 border-r border-slate-200 text-right font-bold text-slate-800">{formatCurrency(row.balance)}</td>
                  <td className="p-2 border-r border-slate-200 text-right font-semibold text-rose-700 bg-rose-50/30">
                    {formatWeight(row.pending_wt)}
                  </td>
                  <td className="p-2 text-slate-600">{row.phone}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-bold font-mono border-t-2 border-slate-300 text-xs">
              <tr>
                <td colSpan={3} className="p-2 text-right font-sans uppercase">Total ({filteredDebtors.length} parties):</td>
                <td className="p-2 text-right font-semibold text-slate-900">{formatCurrency(totalBalance)}</td>
                <td className="p-2 text-right font-semibold text-rose-800 bg-rose-50/70">{formatWeight(totalPendingWt)}</td>
                <td className="p-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <ColumnSettingsModal
        isOpen={showColumnSettings}
        onClose={() => setShowColumnSettings(false)}
        columns={columns}
        onSave={(c) => setColumns(c)}
      />

      <FieldHelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        screenName="Book Display"
      />
    </div>
  );
};
