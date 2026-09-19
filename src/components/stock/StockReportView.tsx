import React, { useState } from 'react';
import { StockItem, ColumnSetting } from '../../types/erp';
import {
  Boxes,
  Printer,
  Download,
  XCircle,
  HelpCircle,
  Search,
  Sliders,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Layers,
  Scale,
  Gem,
  Tag,
  Eye,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { ColumnSettingsModal } from '../common/ColumnSettingsModal';
import { FieldHelpModal } from '../common/FieldHelpModal';
import { useTheme } from '../../context/ThemeContext';

interface StockReportViewProps {
  stockItems: StockItem[];
  onClose: () => void;
  onNavigateToRefill?: () => void;
}

const DEFAULT_STOCK_COLUMNS: ColumnSetting[] = [
  { id: 'item_name', label: 'Item Name', visible: true, width: 220, order: 0 },
  { id: 'qty', label: 'Qty', visible: true, width: 70, order: 1 },
  { id: 'gross_wt', label: 'Gross Wt.', visible: true, width: 110, order: 2 },
  { id: 'net_wt', label: 'Net Wt.', visible: true, width: 110, order: 3 },
  { id: 'purity', label: 'Purity (%)', visible: true, width: 90, order: 4 },
  { id: 'fine_wt', label: 'Fine Wt.', visible: true, width: 110, order: 5 },
  { id: 'total_value', label: 'Stock Value', visible: true, width: 130, order: 6 },
];

export const StockReportView: React.FC<StockReportViewProps> = ({
  stockItems,
  onClose,
  onNavigateToRefill,
}) => {
  const { currentTheme, computedTokens, isDark } = useTheme();
  const [reportType, setReportType] = useState<string>('Item wise');
  const [reportDetails, setReportDetails] = useState<string>('Only Tag Details');
  const [reportFormat, setReportFormat] = useState<string>('Format 1');
  const [reportPer, setReportPer] = useState<string>('Fine Wt.');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dontShowUrdItem, setDontShowUrdItem] = useState(false);
  const [stockValueMode, setStockValueMode] = useState<'Cost' | 'Market' | 'WAC'>('Market');

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof StockItem>('item_name');
  const [sortAsc, setSortAsc] = useState(true);

  const [columns, setColumns] = useState<ColumnSetting[]>(DEFAULT_STOCK_COLUMNS);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Sorting and Filtering
  const filteredItems = stockItems
    .filter((it) => {
      if (dontShowUrdItem && it.is_urd) return false;
      if (categoryFilter !== 'all' && it.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          it.item_name.toLowerCase().includes(term) ||
          (it.tag_no && it.tag_no.toLowerCase().includes(term)) ||
          it.category.toLowerCase().includes(term) ||
          (it.huid && it.huid.toLowerCase().includes(term))
        );
      }
      return true;
    })
    .sort((a, b) => {
      let aVal = a[sortField] ?? '';
      let bVal = b[sortField] ?? '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });

  const totalQty = filteredItems.reduce((s, it) => s + (it.qty || 0), 0);
  const totalGrossWt = filteredItems.reduce((s, it) => s + (it.gross_wt || 0), 0);
  const totalNetWt = filteredItems.reduce((s, it) => s + (it.net_wt || 0), 0);
  const totalFineWt = filteredItems.reduce((s, it) => s + (it.fine_wt || 0), 0);
  const totalValuation = filteredItems.reduce((s, it) => s + (it.total_value || 0), 0);

  const handleSort = (field: keyof StockItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Item Name', 'Tag No', 'Category', 'Qty', 'Gross Wt.', 'Net Wt.', 'Purity', 'Fine Wt.', 'Value'];
    const rows = filteredItems.map((i) => [
      `"${i.item_name}"`,
      i.tag_no || '',
      i.category,
      i.qty,
      i.gross_wt,
      i.net_wt,
      i.purity,
      i.fine_wt,
      i.total_value,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Stock_Report_${Date.now()}.csv`);
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
          <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 shadow-xs">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black tracking-tight">
                Loose and Tagged Item Stock Valuation Report
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/30">
                {filteredItems.length} SKUs Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live inventory balances, purity audit, URD scrap filters, and real-time fine gold valuation.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          {onNavigateToRefill && (
            <button
              onClick={onNavigateToRefill}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 text-xs font-bold transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <span>Stock Refill Targets</span>
            </button>
          )}

          <button
            onClick={() => setShowColumnSettings(true)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              isDark
                ? 'bg-white/5 text-slate-200 hover:bg-white/10 border-white/10'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300 shadow-2xs'
            }`}
            title="Grid Column Settings"
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

      {/* 4 Summary Frosted KPI Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Quantity</span>
            <Boxes className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black mt-1 text-slate-900 dark:text-white">
            {totalQty} <span className="text-xs font-normal text-slate-500">Pcs</span>
          </div>
          <span className="text-[10.5px] text-slate-400 block mt-0.5">Filtered stock inventory</span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Gross / Net Wt</span>
            <Scale className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black mt-1 text-slate-900 dark:text-white font-mono">
            {formatWeight(totalNetWt)}{' '}
            <span className="text-xs font-normal text-slate-500 font-sans">
              (Gross: {formatWeight(totalGrossWt)})
            </span>
          </div>
          <span className="text-[10.5px] text-slate-400 block mt-0.5">Showroom metal weight</span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Pure Fine Gold</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black mt-1 text-amber-600 dark:text-amber-400 font-mono">
            {formatWeight(totalFineWt)}
          </div>
          <span className="text-[10.5px] text-slate-400 block mt-0.5">100% fine bullion equivalent</span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Stock Valuation</span>
            <Gem className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black mt-1 text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrency(totalValuation)}
          </div>
          <span className="text-[10.5px] text-slate-400 block mt-0.5">Market rate valuation</span>
        </div>
      </div>

      {/* Filter Parameters Strip */}
      <div
        className={`p-4 rounded-2xl border shadow-xs space-y-3 text-xs ${
          isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Select Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-xl border text-xs ${
                isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <option value="Item wise">Item wise</option>
              <option value="Tag wise">Tag wise</option>
              <option value="Category wise">Category wise</option>
              <option value="Tray wise">Tray wise</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-xl border text-xs ${
                isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <option value="all">All Categories</option>
              <option value="Gold">Gold Ornaments</option>
              <option value="Silver">Silver Articles</option>
              <option value="Diamond">Diamond Sets</option>
              <option value="URD Gold">URD Scrap Gold</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Select Details</label>
            <select
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-xl border text-xs ${
                isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <option value="Only Tag Details">Only Tag Details</option>
              <option value="All Details">All Details</option>
              <option value="Summary Only">Summary Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Format</label>
            <select
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-xl border text-xs ${
                isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <option value="Format 1">Format 1 (Detailed)</option>
              <option value="Format 2">Format 2 (Compact)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Report Per</label>
            <select
              value={reportPer}
              onChange={(e) => setReportPer(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-xl border text-xs ${
                isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <option value="Fine Wt.">Fine Wt.</option>
              <option value="Net Wt.">Net Wt.</option>
              <option value="Gross Wt.">Gross Wt.</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Valuation</label>
            <select
              value={stockValueMode}
              onChange={(e) => setStockValueMode(e.target.value as any)}
              className={`w-full px-2.5 py-1.5 rounded-xl border text-xs ${
                isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <option value="Market">Market Rate</option>
              <option value="Cost">Cost Rate</option>
              <option value="WAC">Weighted Average</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center space-x-1.5 cursor-pointer font-bold pb-2">
              <input
                type="checkbox"
                checked={dontShowUrdItem}
                onChange={(e) => setDontShowUrdItem(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer"
              />
              <span>Hide URD Scrap</span>
            </label>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stock by item name, barcode tag #, purity, or category..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border transition-all ${
              isDark
                ? 'bg-white/5 border-white/15 text-white placeholder-slate-500 focus:border-amber-400'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
            }`}
          />
        </div>
      </div>

      {/* Main Stock Table */}
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
                <th
                  onClick={() => handleSort('item_name')}
                  className="p-3.5 min-w-[240px] cursor-pointer hover:text-amber-500 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Item Name & Specification</span>
                    {sortField === 'item_name' ? (
                      sortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('category')}
                  className="p-3.5 text-center cursor-pointer hover:text-amber-500"
                >
                  Category
                </th>
                <th
                  onClick={() => handleSort('qty')}
                  className="p-3.5 text-center w-20 cursor-pointer hover:text-amber-500"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Qty</span>
                    {sortField === 'qty' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('gross_wt')}
                  className="p-3.5 text-right w-28 cursor-pointer hover:text-amber-500"
                >
                  Gross Wt.
                </th>
                <th
                  onClick={() => handleSort('net_wt')}
                  className="p-3.5 text-right w-28 cursor-pointer hover:text-amber-500 font-black text-blue-600 dark:text-blue-400"
                >
                  Net Wt.
                </th>
                <th
                  onClick={() => handleSort('purity')}
                  className="p-3.5 text-center w-24 cursor-pointer hover:text-amber-500"
                >
                  Purity (%)
                </th>
                <th
                  onClick={() => handleSort('fine_wt')}
                  className="p-3.5 text-right w-28 cursor-pointer hover:text-amber-500 font-black text-amber-600 dark:text-amber-400"
                >
                  Fine Wt.
                </th>
                <th
                  onClick={() => handleSort('total_value')}
                  className="p-3.5 text-right pr-4 w-36 cursor-pointer hover:text-amber-500 font-black text-emerald-600 dark:text-emerald-400"
                >
                  Stock Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10 font-mono text-[11px]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-slate-500 font-sans">
                    No matching stock items found for current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      item.is_urd
                        ? 'bg-amber-500/5 hover:bg-amber-500/10'
                        : isDark
                        ? 'hover:bg-white/5'
                        : 'hover:bg-blue-50/70'
                    }`}
                  >
                    <td className="p-3.5 pl-4 text-center text-slate-400">{idx + 1}</td>
                    <td className="p-3.5 font-sans">
                      <div className="font-bold text-slate-900 dark:text-white">{item.item_name}</div>
                      <div className="text-[10.5px] text-slate-400 font-mono flex items-center space-x-2 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/10">
                          Tag: {item.tag_no || 'Loose'}
                        </span>
                        {item.huid && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            HUID: {item.huid}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-black text-slate-800 dark:text-slate-200">
                      {item.qty}
                    </td>
                    <td className="p-3.5 text-right text-slate-600 dark:text-slate-300">
                      {formatWeight(item.gross_wt)}
                    </td>
                    <td className="p-3.5 text-right font-black text-blue-600 dark:text-blue-400">
                      {formatWeight(item.net_wt)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                        {item.purity}%
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-black text-amber-600 dark:text-amber-400">
                      {formatWeight(item.fine_wt)}
                    </td>
                    <td className="p-3.5 text-right pr-4 font-black text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(item.total_value)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {/* Table Footer Totals */}
            <tfoot>
              <tr
                className={`border-t font-mono font-black text-xs ${
                  isDark
                    ? 'bg-[#070b14]/95 text-white border-white/20'
                    : 'bg-slate-100 text-slate-950 border-slate-300'
                }`}
              >
                <td colSpan={3} className="p-3.5 pl-4 uppercase font-sans tracking-wider">
                  Total Summary ({filteredItems.length} SKUs)
                </td>
                <td className="p-3.5 text-center">{totalQty} Pcs</td>
                <td className="p-3.5 text-right">{formatWeight(totalGrossWt)}</td>
                <td className="p-3.5 text-right text-blue-600 dark:text-blue-400">
                  {formatWeight(totalNetWt)}
                </td>
                <td className="p-3.5 text-center">—</td>
                <td className="p-3.5 text-right text-amber-600 dark:text-amber-400">
                  {formatWeight(totalFineWt)}
                </td>
                <td className="p-3.5 text-right pr-4 text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalValuation)}
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
        screenName="Stock Report"
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
};
