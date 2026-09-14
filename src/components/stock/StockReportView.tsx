import React, { useState } from 'react';
import { StockItem, ColumnSetting } from '../../types/erp';
import {
  Boxes,
  Printer,
  Download,
  XCircle,
  HelpCircle,
  Search,
  Sliders
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { ColumnSettingsModal } from '../common/ColumnSettingsModal';
import { FieldHelpModal } from '../common/FieldHelpModal';

interface StockReportViewProps {
  stockItems: StockItem[];
  onClose: () => void;
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

export const StockReportView: React.FC<StockReportViewProps> = ({ stockItems, onClose }) => {
  const [reportType, setReportType] = useState<string>('Item wise');
  const [reportDetails, setReportDetails] = useState<string>('Only Tag Details');
  const [reportFormat, setReportFormat] = useState<string>('Format 1');
  const [reportPer, setReportPer] = useState<string>('Fine Wt.');
  const [showAllItems, setShowAllItems] = useState(true);
  const [dontShowUrdItem, setDontShowUrdItem] = useState(false);
  const [stockValueMode, setStockValueMode] = useState<'Cost' | 'Market' | 'WAC'>('Market');

  const [searchTerm, setSearchTerm] = useState('');
  const [columns, setColumns] = useState<ColumnSetting[]>(DEFAULT_STOCK_COLUMNS);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const filteredItems = stockItems.filter((it) => {
    if (dontShowUrdItem && it.is_urd) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        it.item_name.toLowerCase().includes(term) ||
        (it.tag_no && it.tag_no.toLowerCase().includes(term)) ||
        it.category.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const totalQty = filteredItems.reduce((s, it) => s + (it.qty || 0), 0);
  const totalGrossWt = filteredItems.reduce((s, it) => s + (it.gross_wt || 0), 0);
  const totalNetWt = filteredItems.reduce((s, it) => s + (it.net_wt || 0), 0);
  const totalFineWt = filteredItems.reduce((s, it) => s + (it.fine_wt || 0), 0);
  const totalValuation = filteredItems.reduce((s, it) => s + (it.total_value || 0), 0);

  const handleExportCSV = () => {
    const headers = ['Item Name', 'Tag No', 'Qty', 'Gross Wt.', 'Net Wt.', 'Purity', 'Fine Wt.', 'Value'];
    const rows = filteredItems.map((i) => [
      `"${i.item_name}"`,
      i.tag_no || '',
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
      <div className="bg-white border border-sky-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-300">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Loose and Tag Item Stock Report</h1>
            <p className="text-xs text-slate-500">
              Live inventory balances, purity audit, URD filters, and pure gold valuation.
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

      {/* Filter Parameters Strip (Spec #15) */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs"
            >
              <option value="Item wise">Item wise</option>
              <option value="Tag wise">Tag wise</option>
              <option value="Category wise">Category wise</option>
              <option value="Tray wise">Tray wise</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Details</label>
            <select
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs"
            >
              <option value="Only Tag Details">Only Tag Details</option>
              <option value="All Details">All Details</option>
              <option value="Summary Only">Summary Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Format</label>
            <select
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
              className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs"
            >
              <option value="Format 1">Format 1</option>
              <option value="Format 2">Format 2</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Per</label>
            <select
              value={reportPer}
              onChange={(e) => setReportPer(e.target.value)}
              className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs"
            >
              <option value="Fine Wt.">Fine Wt.</option>
              <option value="Net Wt.">Net Wt.</option>
              <option value="Gross Wt.">Gross Wt.</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Value</label>
            <select
              value={stockValueMode}
              onChange={(e) => setStockValueMode(e.target.value as any)}
              className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs"
            >
              <option value="Market">Market Rate</option>
              <option value="Cost">Cost Rate</option>
              <option value="WAC">Weighted Average</option>
            </select>
          </div>

          <div className="flex flex-col justify-end space-y-1">
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={dontShowUrdItem}
                onChange={(e) => setDontShowUrdItem(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 w-4 h-4"
              />
              <span>Don't Show URD Item</span>
            </label>
          </div>
        </div>
      </div>

      {/* Stock Items Table */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2 border-r border-slate-200 w-10 text-center">#</th>
                <th className="p-2 border-r border-slate-200 min-w-[200px]">Item Name</th>
                <th className="p-2 border-r border-slate-200 w-16 text-center">Qty</th>
                <th className="p-2 border-r border-slate-200 w-28 text-right">Gross Wt.</th>
                <th className="p-2 border-r border-slate-200 w-28 text-right font-bold text-blue-800">Net Wt.</th>
                <th className="p-2 border-r border-slate-200 w-20 text-center">Purity (%)</th>
                <th className="p-2 border-r border-slate-200 w-28 text-right font-bold text-amber-800">Fine Wt.</th>
                <th className="p-2 text-right w-36 font-bold text-emerald-700">Stock Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
              {filteredItems.map((item, idx) => (
                <tr key={item.id} className="hover:bg-sky-50/30">
                  <td className="p-2 border-r border-slate-200 text-center text-slate-400">{idx + 1}</td>
                  <td className="p-2 border-r border-slate-200 font-sans">
                    <div className="font-semibold text-slate-900">{item.item_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Tag: {item.tag_no} | {item.category}</div>
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center text-slate-800">{item.qty}</td>
                  <td className="p-2 border-r border-slate-200 text-right">{formatWeight(item.gross_wt)}</td>
                  <td className="p-2 border-r border-slate-200 text-right font-bold text-blue-800">
                    {formatWeight(item.net_wt)}
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center">{item.purity}%</td>
                  <td className="p-2 border-r border-slate-200 text-right font-bold text-amber-800">
                    {formatWeight(item.fine_wt)}
                  </td>
                  <td className="p-2 text-right font-bold text-emerald-700">{formatCurrency(item.total_value)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-bold font-mono border-t-2 border-slate-300 text-xs">
              <tr>
                <td colSpan={2} className="p-2 text-right font-sans uppercase">Total Stock Summary:</td>
                <td className="p-2 text-center text-slate-900">{totalQty}</td>
                <td className="p-2 text-right text-slate-900">{formatWeight(totalGrossWt)}</td>
                <td className="p-2 text-right text-blue-800 font-semibold">{formatWeight(totalNetWt)}</td>
                <td className="p-2"></td>
                <td className="p-2 text-right text-amber-800 font-semibold">{formatWeight(totalFineWt)}</td>
                <td className="p-2 text-right text-emerald-800 font-semibold">{formatCurrency(totalValuation)}</td>
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
        screenName="Stock Report"
      />
    </div>
  );
};
