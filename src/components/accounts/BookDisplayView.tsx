import React, { useState } from 'react';
import { BookType, SundryDebtorRow, ColumnSetting } from '../../types/erp';
import {
  BookOpen,
  Printer,
  XCircle,
  HelpCircle,
  Search,
  Sliders,
  Scale,
  Send,
  Phone,
  User,
  ArrowUpDown,
  Download,
  Building2,
  Check
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { ColumnSettingsModal } from '../common/ColumnSettingsModal';
import { FieldHelpModal } from '../common/FieldHelpModal';
import { useTheme } from '../../context/ThemeContext';

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
  const { currentTheme, computedTokens, isDark } = useTheme();
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

  const handleSendWhatsAppReminder = (debtor: SundryDebtorRow) => {
    const cleanPhone = debtor.phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = `*SWARNA JEWELLERS - ACCOUNT BALANCE STATEMENT* 🏆\n\nDear *${debtor.customer_name}*,\n\nFriendly reminder regarding your ledger account (${debtor.code}):\n💰 *Outstanding Balance:* ${formatCurrency(debtor.balance)}\n⚖️ *Pending Fine Gold:* ${formatWeight(debtor.pending_wt)}\n\nKindly clear the dues at your earliest convenience via NEFT/UPI or showroom visit.\n\n_Thank you for your valued patronage._`;
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleExportCSV = () => {
    const headers = ['Customer Name', 'Account Code', 'Balance (Rs)', 'Pending Gold (gm)', 'Phone'];
    const rows = filteredDebtors.map((d) => [
      `"${d.customer_name}"`,
      d.code,
      d.balance,
      d.pending_wt,
      `"${d.phone}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Sundry_Debtors_${Date.now()}.csv`);
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
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black tracking-tight">Book Display Register & Debtors</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-400/30">
                9 Ledger Books
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Financial registers with Sundry Debtors ledger and pure gold bullion <strong className="text-rose-600 dark:text-rose-400 font-mono font-bold">Pending WT</strong> in grams.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={() => setShowColumnSettings(true)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              isDark
                ? 'bg-white/5 text-slate-200 hover:bg-white/10 border-white/10'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300 shadow-2xs'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-blue-500" />
            <span>GS</span>
          </button>

          <button
            onClick={handleExportCSV}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
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
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
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
            className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-400/40 hover:bg-amber-500/20 cursor-pointer"
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

      {/* Book Type Selectors & Date Range Strip */}
      <div
        className={`p-4 rounded-2xl border space-y-3 shadow-xs ${
          isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {bookTypes.map((type) => (
            <button
              key={type}
              onClick={() => setBookType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                bookType === type
                  ? isDark
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-blue-600 text-white font-black shadow-xs'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
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

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Search Debtor / Account</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer name, code or phone..."
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs ${
                  isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
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
                <th className="p-3.5 pl-4 w-12 text-center">#</th>
                <th className="p-3.5 min-w-[200px]">Customer Name</th>
                <th className="p-3.5 font-mono">Account Code</th>
                <th className="p-3.5 text-right font-black">Current Balance (₹)</th>
                <th className="p-3.5 text-right font-black text-rose-600 dark:text-rose-400">
                  Pending WT (gm)
                </th>
                <th className="p-3.5">Contact Phone</th>
                <th className="p-3.5 text-right pr-4">WhatsApp Statement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-mono text-[11px]">
              {filteredDebtors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500 font-sans">
                    No debtors matching criteria.
                  </td>
                </tr>
              ) : (
                filteredDebtors.map((row, idx) => (
                  <tr
                    key={row.code || idx}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50/70'
                    }`}
                  >
                    <td className="p-3.5 pl-4 text-center text-slate-400">{idx + 1}</td>
                    <td className="p-3.5 font-sans font-bold text-slate-900 dark:text-white">
                      {row.customer_name}
                    </td>
                    <td className="p-3.5 font-bold text-blue-600 dark:text-blue-400">
                      {row.code}
                    </td>
                    <td className="p-3.5 text-right font-black text-slate-900 dark:text-white">
                      {formatCurrency(row.balance)}
                    </td>
                    <td className="p-3.5 text-right font-black text-rose-600 dark:text-rose-400">
                      {formatWeight(row.pending_wt)}
                    </td>
                    <td className="p-3.5 font-sans text-slate-600 dark:text-slate-300">
                      {row.phone}
                    </td>
                    <td className="p-3.5 text-right pr-4">
                      <button
                        onClick={() => handleSendWhatsAppReminder(row)}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs shadow-xs inline-flex items-center space-x-1.5 transition-all cursor-pointer"
                        title="Send balance statement via WhatsApp"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send WhatsApp</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Totals */}
            <tfoot>
              <tr
                className={`border-t font-mono font-black text-xs ${
                  isDark
                    ? 'bg-[#070b14]/95 text-white border-white/20'
                    : 'bg-slate-100 text-slate-950 border-slate-300'
                }`}
              >
                <td colSpan={3} className="p-3.5 pl-4 uppercase font-sans tracking-wider">
                  Total Outstanding ({filteredDebtors.length} Customers)
                </td>
                <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalBalance)}
                </td>
                <td className="p-3.5 text-right text-rose-600 dark:text-rose-400">
                  {formatWeight(totalPendingWt)}
                </td>
                <td colSpan={2} className="p-3.5 text-right pr-4 text-slate-400 font-sans">
                  Total Bullion Fine Due
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <ColumnSettingsModal
        isOpen={showColumnSettings}
        columns={columns}
        onSave={setColumns}
        onClose={() => setShowColumnSettings(false)}
      />

      <FieldHelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        screenName="Book Display"
      />
    </div>
  );
};
