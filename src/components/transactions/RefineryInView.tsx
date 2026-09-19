import React, { useState } from 'react';
import {
  RefineryRecord,
  RefineryHeader,
  RefineryMaterialInItem,
  RefineryWeightSummary,
  RefineryCalculation,
  RefineryTab,
  ColumnSetting
} from '../../types/erp';
import {
  Save,
  Printer,
  XCircle,
  Plus,
  HelpCircle,
  MessageCircle,
  Sliders,
  Flame,
  Scale
} from 'lucide-react';
import {
  calculateFineWeight,
  calculateTaxes,
  formatCurrency,
  formatWeight,
  roundTo
} from '../../utils/calculations';
import { ColumnSettingsModal } from '../common/ColumnSettingsModal';
import { FieldHelpModal } from '../common/FieldHelpModal';
import { PrintVoucherModal } from '../common/PrintVoucherModal';
import { WhatsAppShareModal } from '../common/WhatsAppShareModal';
import { useTheme } from '../../context/ThemeContext';

interface RefineryInViewProps {
  refineries: RefineryRecord[];
  onSaveRefinery: (record: RefineryRecord) => void;
  onClose: () => void;
  goldRate: number;
}

const DEFAULT_REFINERY_COLUMNS: ColumnSetting[] = [
  { id: 'no', label: 'No', visible: true, width: 50, order: 0 },
  { id: 'trans_type', label: 'TransType', visible: true, width: 120, order: 1 },
  { id: 'item_name', label: 'Itemname', visible: true, width: 200, order: 2 },
  { id: 'gross_wt', label: 'GrossWt', visible: true, width: 90, order: 3 },
  { id: 'net_wt', label: 'NetWt', visible: true, width: 90, order: 4 },
  { id: 'purity', label: 'Purity', visible: true, width: 75, order: 5 },
  { id: 'fin_wt', label: 'FinWt', visible: true, width: 90, order: 6 },
  { id: 'rate', label: 'Rate', visible: true, width: 85, order: 7 },
  { id: 'amount', label: 'Amount', visible: true, width: 100, order: 8 },
  { id: 'refinery_loss', label: 'RefineryLoss', visible: true, width: 95, order: 9 },
  { id: 'refinery_profit', label: 'RefineryProfit', visible: true, width: 95, order: 10 },
  { id: 'total_amt', label: 'Total.Amt', visible: true, width: 110, order: 11 },
];

export const RefineryInView: React.FC<RefineryInViewProps> = ({
  refineries,
  onSaveRefinery,
  onClose,
  goldRate,
}) => {
  const { currentTheme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<RefineryTab>('refinery_in');
  const [columns, setColumns] = useState<ColumnSetting[]>(DEFAULT_REFINERY_COLUMNS);

  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const [header, setHeader] = useState<RefineryHeader>({
    refinery_name: 'National Bullion Refinery Pvt Ltd',
    remark: 'Scrap lot melting: customer exchange & bench scrap',
    payment_mode: 'Credit',
    invoice_prefix: 'REF',
    manual_no: 'RF-2026-089',
    invoice_date: new Date().toISOString().split('T')[0],
    invoice_no: 'REF-2026-089',
    state: 'Maharashtra (27)',
    gst_not_required: false,
  });

  const [items, setItems] = useState<RefineryMaterialInItem[]>([
    {
      id: 'ri-1',
      no: 1,
      trans_type: 'Old Gold Scrap 22K',
      item_name: 'Scrap Bangles & Chains',
      gross_wt: 120.5,
      net_wt: 118.2,
      purity: 91.6,
      fin_wt: 108.271,
      rate: 7650,
      amount: 828273.15,
      refinery_loss: 0.95,
      refinery_profit: 0,
      making_on_qty: 1200,
      total_amt: 829473.15,
    },
    {
      id: 'ri-2',
      no: 2,
      trans_type: 'Old Melting Bits 18K',
      item_name: 'Broken Rings & Castings',
      gross_wt: 75.8,
      net_wt: 74.5,
      purity: 75.0,
      fin_wt: 55.875,
      rate: 6500,
      amount: 363187.5,
      refinery_loss: 0.65,
      refinery_profit: 0,
      making_on_qty: 850,
      total_amt: 364037.5,
    },
  ]);

  const [weightSummary, setWeightSummary] = useState<RefineryWeightSummary>({
    balance_wgt_grswt: 196.3,
    net_wgt: 192.7,
    fin_wgt: 164.355,
  });

  const [calculation, setCalculation] = useState<RefineryCalculation>({
    against_refout_bill_no: 'REFOUT-2026-44',
    by_cash: 25000,
    payment_type: 'Refinery Settlement',
    by_cheque: 1000000,
    bank_name: 'HDFC Current Account',
    cheque_no: 'CHQ-445588',
    cheque_date: new Date().toISOString().split('T')[0],
    details: 'RTGS Advance against 999.9 Bullion Bar Receipt',
    gst_pct: 3.0,
    hgst_pct: 1.5,
    mgst_pct: 1.5,
    tds_pct: 0.1,
    gst_amt: 35747.21,
    hgst_amt: 17873.61,
    mgst_amt: 17873.61,
    tds_amt: 1191.57,
    purchase_amt: 1191573.75,
    discount: 1573.75,
    sales_amt: 0,
    bill_amount: 1227320.96,
    sub_tax: 35747.21,
    tcs_tax_pct: 0,
    tcs_tax_amt: 0,
    paid_amount: 1025000,
    net_balance: 202320.96,
  });

  const updateItem = (index: number, field: keyof RefineryMaterialInItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    item.fin_wt = calculateFineWeight(item.net_wt, item.purity);
    item.amount = roundTo(item.fin_wt * (item.rate || 0), 2);
    item.total_amt = roundTo(item.amount + (item.making_on_qty || 0), 2);

    updated[index] = item;
    setItems(updated);

    const totGross = updated.reduce((s, it) => s + (it.gross_wt || 0), 0);
    const totNet = updated.reduce((s, it) => s + (it.net_wt || 0), 0);
    const totFin = updated.reduce((s, it) => s + (it.fin_wt || 0), 0);

    setWeightSummary({
      balance_wgt_grswt: roundTo(totGross, 3),
      net_wgt: roundTo(totNet, 3),
      fin_wgt: roundTo(totFin, 3),
    });
  };

  const handleSave = () => {
    const record: RefineryRecord = {
      id: `ref-${Date.now()}`,
      header,
      items,
      weight_summary: weightSummary,
      calculation,
      created_at: new Date().toISOString(),
    };
    onSaveRefinery(record);
    alert(`Refinery batch ${header.invoice_no} saved!`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Toolbar */}
      <div
        className={`p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-sm border ${
          isDark
            ? 'bg-[#0f172a]/90 border-white/10 text-white shadow-xs'
            : 'bg-white border-sky-200/80 text-slate-800'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg border ${
              isDark
                ? 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                : 'bg-orange-50 text-orange-600 border-orange-200'
            }`}
          >
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Refinery Inward
              </h1>
              <span
                className={`text-xs px-2 py-0.5 rounded font-mono font-bold border ${
                  isDark
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                    : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}
              >
                {header.invoice_no}
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Melting scrap recovery, fine pure weight yield, and assayer accounts.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 flex-wrap">
          <button
            onClick={handleSave}
            className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Refinery Batch</span>
          </button>

          <button
            onClick={() => setShowPrint(true)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isDark
                ? 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border-sky-500/20'
                : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
            }`}
          >
            <Printer className="w-3.5 h-3.5 text-sky-400" />
            <span>Print</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border ${
              isDark
                ? 'bg-amber-400/10 border-amber-400/30 text-amber-300 hover:bg-amber-400/20'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>H</span>
          </button>

          <button
            onClick={onClose}
            className={`p-1.5 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header Form */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Refinery Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={header.refinery_name}
              onChange={(e) => setHeader({ ...header, refinery_name: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Invoice Date</label>
            <input
              type="date"
              value={header.invoice_date}
              onChange={(e) => setHeader({ ...header, invoice_date: e.target.value })}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Invoice No</label>
            <input
              type="text"
              value={header.invoice_no}
              onChange={(e) => setHeader({ ...header, invoice_no: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-orange-700 font-mono font-bold"
            />
          </div>
        </div>
      </div>

      {/* Weight Summary Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-blue-50 border border-amber-300 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
          <Scale className="w-4 h-4 text-amber-700" />
          <span>Refinery Weight Summary (Spec #29)</span>
        </div>
        <div className="flex items-center space-x-6 text-xs font-mono">
          <div>
            <span className="text-slate-500">Gross Wt:</span>{' '}
            <strong className="text-slate-800">{formatWeight(weightSummary.balance_wgt_grswt)}</strong>
          </div>
          <div>
            <span className="text-slate-500">Net Wt:</span>{' '}
            <strong className="text-slate-800">{formatWeight(weightSummary.net_wgt)}</strong>
          </div>
          <div>
            <span className="text-amber-800 font-bold">Pure Fin Wt:</span>{' '}
            <strong className="text-amber-900 font-semibold text-sm">{formatWeight(weightSummary.fin_wgt)}</strong>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2 border-r border-slate-200 w-10 text-center">No</th>
                <th className="p-2 border-r border-slate-200 min-w-[120px]">TransType</th>
                <th className="p-2 border-r border-slate-200 min-w-[180px]">Itemname</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right">GrossWt</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right">NetWt</th>
                <th className="p-2 border-r border-slate-200 w-20 text-center">Purity</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right font-bold text-amber-800">FinWt</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right">Rate</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right text-rose-700">RefineryLoss</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right text-emerald-700">RefineryProfit</th>
                <th className="p-2 w-28 text-right font-bold text-emerald-700">Total.Amt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
              {items.map((it, idx) => (
                <tr key={it.id} className="hover:bg-sky-50/30">
                  <td className="p-2 border-r border-slate-200 text-center text-slate-400">{it.no}</td>
                  <td className="p-1.5 border-r border-slate-200 font-sans">{it.trans_type}</td>
                  <td className="p-1.5 border-r border-slate-200 font-sans font-medium text-slate-900">{it.item_name}</td>
                  <td className="p-2 border-r border-slate-200 text-right">{formatWeight(it.gross_wt)}</td>
                  <td className="p-2 border-r border-slate-200 text-right font-semibold text-slate-800">{formatWeight(it.net_wt)}</td>
                  <td className="p-2 border-r border-slate-200 text-center">{it.purity}%</td>
                  <td className="p-2 border-r border-slate-200 text-right font-bold text-amber-800">
                    {formatWeight(it.fin_wt)}
                  </td>
                  <td className="p-2 border-r border-slate-200 text-right">₹{it.rate}</td>
                  <td className="p-2 border-r border-slate-200 text-right text-rose-700">{it.refinery_loss}g</td>
                  <td className="p-2 border-r border-slate-200 text-right text-emerald-700">{it.refinery_profit}g</td>
                  <td className="p-2 text-right font-bold text-emerald-700">
                    ₹{Math.round(it.total_amt).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <FieldHelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        screenName="Refinery In"
      />

      <PrintVoucherModal
        isOpen={showPrint}
        onClose={() => setShowPrint(false)}
        voucherType="Refinery"
        data={{ header, items, calculation }}
      />
    </div>
  );
};
