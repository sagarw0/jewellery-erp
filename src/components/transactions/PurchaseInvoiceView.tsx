import React, { useState } from 'react';
import {
  PurchaseRecord,
  PurchaseHeader,
  PurchaseItem,
  PurchasePayment,
  PurchaseTab,
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
  ShoppingBag,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  calculateNetWeight,
  calculateFinePlusWastage,
  calculateTaxes,
  formatCurrency,
  formatWeight,
  roundTo
} from '../../utils/calculations';
import { ColumnSettingsModal } from '../common/ColumnSettingsModal';
import { FieldHelpModal } from '../common/FieldHelpModal';
import { PrintVoucherModal } from '../common/PrintVoucherModal';
import { WhatsAppShareModal } from '../common/WhatsAppShareModal';

interface PurchaseInvoiceViewProps {
  purchases: PurchaseRecord[];
  onSavePurchase: (purchase: PurchaseRecord) => void;
  onDeletePurchase: (id: string) => void;
  onClose: () => void;
  goldRate: number;
}

const DEFAULT_PURCHASE_COLUMNS: ColumnSetting[] = [
  { id: 'trans_type', label: 'TransType', visible: true, width: 110, order: 0 },
  { id: 'item_name', label: 'Itemname', visible: true, width: 220, order: 1 },
  { id: 'qty', label: 'QTY', visible: true, width: 60, order: 2 },
  { id: 'gross_wt', label: 'GrossWt', visible: true, width: 90, order: 3 },
  { id: 'black_b', label: 'Black.B', visible: true, width: 85, order: 4 },
  { id: 'stone_wt', label: 'StoneWt', visible: true, width: 85, order: 5 },
  { id: 'net_wt', label: 'NetWt', visible: true, width: 90, order: 6 },
  { id: 'purity', label: 'Purity', visible: true, width: 75, order: 7 },
  { id: 'rate', label: 'Rate', visible: true, width: 85, order: 8 },
  { id: 'amount', label: 'Amount', visible: true, width: 100, order: 9 },
  { id: 'wastage_pct', label: 'Wastage%', visible: true, width: 85, order: 10 },
  { id: 'fin_plus_wastage', label: 'Fin+Wastage', visible: true, width: 100, order: 11 },
  { id: 'total_amt', label: 'Total.Amt', visible: true, width: 110, order: 12 },
  { id: 'huid', label: 'HUID', visible: true, width: 90, order: 13 },
];

export const PurchaseInvoiceView: React.FC<PurchaseInvoiceViewProps> = ({
  purchases,
  onSavePurchase,
  onDeletePurchase,
  onClose,
  goldRate,
}) => {
  const [activeTab, setActiveTab] = useState<PurchaseTab>('purchase_bill');
  const [purchaseCols, setPurchaseCols] = useState<ColumnSetting[]>(DEFAULT_PURCHASE_COLUMNS);
  const [showMoreHeader, setShowMoreHeader] = useState(false);

  // Modals
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  // Header State (Spec #34)
  const [header, setHeader] = useState<PurchaseHeader>({
    supplier_name: 'MMTC-PAMP India Bullion Ltd',
    remark: 'Lot of 22K 916 CNC Bangles + Jhumkas',
    payment_mode: 'Credit',
    invoice_prefix: 'PUR',
    manual_no: 'CH-892',
    invoice_date: new Date().toISOString().split('T')[0],
    invoice_no: 'PUR-2026-104',
    state: 'Maharashtra (27)',
    gst_not_required: false,
    weightwise: true,
  });

  // Items State (Spec #35)
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      id: 'pi-1',
      trans_type: 'Wholesale Purchase',
      item_name: '22K 916 CNC Bangles Lot A',
      qty: 12,
      gross_wt: 148.800,
      black_b: 0,
      stone_wt: 0,
      net_wt: 148.800,
      purity: 91.6,
      rate: 7020,
      amount: 1044576.00,
      wastage_pct: 1.5,
      fin_plus_wastage: 138.532,
      total_amt: 1060244.64,
      huid: 'B9K2M7',
    },
    {
      id: 'pi-2',
      trans_type: 'Wholesale Purchase',
      item_name: '22K Handcrafted Jhumka Pair',
      qty: 6,
      gross_wt: 74.500,
      black_b: 0,
      stone_wt: 2.100,
      net_wt: 72.400,
      purity: 91.6,
      rate: 7020,
      amount: 508248.00,
      wastage_pct: 2.0,
      fin_plus_wastage: 67.766,
      total_amt: 518412.96,
      huid: 'H4L9P1',
    },
  ]);

  // Payment & Calculation State (Spec #36)
  const [payment, setPayment] = useState<PurchasePayment>({
    by_cash: 50000,
    payment_type: 'Wholesale Settlement',
    by_cheque: 1200000,
    bank_name: 'HDFC Current Account',
    cheque_no: 'NEFT-MMTC-771',
    cheque_date: new Date().toISOString().split('T')[0],
    details: 'Part payment via RTGS',
    gst_pct: 3.0,
    hgst_pct: 1.5,
    mgst_pct: 1.5,
    tds_pct: 0.1,
    gst_amt: 47359.73,
    hgst_amt: 23679.86,
    mgst_amt: 23679.86,
    tds_amt: 1578.66,
    purchase_amt: 1578657.60,
    discount: 3657.60,
    sales_amt: 0,
    bill_amount: 1622359.73,
    sub_tax: 47359.73,
    tcs_tax_pct: 0,
    tcs_tax_amt: 0,
    paid_amount: 1250000,
    net_balance: 372359.73,
  });

  const updateItem = (index: number, field: keyof PurchaseItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };

    const net = calculateNetWeight(item.gross_wt, item.black_b, item.stone_wt);
    item.net_wt = net;
    item.amount = roundTo(item.net_wt * (item.rate || 0), 2);
    item.fin_plus_wastage = calculateFinePlusWastage(item.net_wt, item.purity, item.wastage_pct);

    const wastageMetalVal = (item.net_wt * (item.wastage_pct || 0) / 100) * (item.rate || 0);
    item.total_amt = roundTo(item.amount + wastageMetalVal, 2);

    updated[index] = item;
    setItems(updated);
  };

  const addItemRow = () => {
    const newItem: PurchaseItem = {
      id: `pi-${Date.now()}`,
      trans_type: 'Wholesale Purchase',
      item_name: '22K Gold Bullion Lot',
      qty: 1,
      gross_wt: 50.000,
      black_b: 0,
      stone_wt: 0,
      net_wt: 50.000,
      purity: 91.6,
      rate: goldRate,
      amount: roundTo(50.0 * goldRate, 2),
      wastage_pct: 1.0,
      fin_plus_wastage: calculateFinePlusWastage(50.0, 91.6, 1.0),
      total_amt: roundTo(50.0 * goldRate * 1.01, 2),
      huid: 'B2X9Y1',
    };
    setItems([...items, newItem]);
  };

  const handleSave = () => {
    if (!header.supplier_name.trim()) {
      alert('Please enter Supplier Name');
      return;
    }
    const record: PurchaseRecord = {
      id: `pur-${Date.now()}`,
      header,
      items,
      payment,
      created_at: new Date().toISOString(),
    };
    onSavePurchase(record);
    alert(`Purchase Invoice ${header.invoice_no} saved!`);
  };

  const tabs: { id: PurchaseTab; label: string }[] = [
    { id: 'supplier', label: 'Supplier' },
    { id: 'purchase_bill', label: 'Purchase Bill' },
    { id: 'payment', label: 'Payment' },
    { id: 'account_display', label: 'Account Display' },
    { id: 'account_cum_stock_display', label: 'Stock Display' },
    { id: 'purchase_consignment', label: 'Consignment' },
    { id: 'stock_cash_settlement', label: 'Cash Settlement' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Toolbar */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-800">Purchase Invoice</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200">
                {header.invoice_no}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Wholesale lot inwards, wastage calculations, HUID, and bullion settlement.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 flex-wrap">
          <button
            onClick={handleSave}
            className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Invoice</span>
          </button>

          <button
            onClick={() => setShowPrint(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-200 hover:bg-sky-100"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={() => setShowWhatsApp(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 hover:bg-emerald-100"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => setShowColumnSettings(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200 hover:bg-slate-200"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>GS</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-300 hover:bg-amber-100"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>H</span>
          </button>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sky-200 bg-white rounded-t-xl px-2 pt-2 space-x-1 overflow-x-auto scrollbar-none shadow-2xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Header Form */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Supplier Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={header.supplier_name}
              onChange={(e) => setHeader({ ...header, supplier_name: e.target.value })}
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
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-indigo-700 font-mono font-bold"
            />
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={header.weightwise}
                onChange={(e) => setHeader({ ...header, weightwise: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 w-4 h-4"
              />
              <span className="font-bold text-blue-800">Weightwise Billing</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={header.gst_not_required}
                onChange={(e) => setHeader({ ...header, gst_not_required: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 w-4 h-4"
              />
              <span>GST Not Required</span>
            </label>
          </div>
        </div>

        {/* Collapsible More Header */}
        <div className="pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowMoreHeader(!showMoreHeader)}
            className="flex items-center space-x-1 text-xs text-blue-600 font-bold hover:text-blue-800"
          >
            {showMoreHeader ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{showMoreHeader ? 'Hide Additional Details' : 'Show Additional Details (Prefix, Manual No, Mode, State, Remark)'}</span>
          </button>

          {showMoreHeader && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mt-2 pt-2 border-t border-dashed border-slate-200 bg-sky-50/40 p-3 rounded-lg">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Prefix</label>
                <input
                  type="text"
                  value={header.invoice_prefix}
                  onChange={(e) => setHeader({ ...header, invoice_prefix: e.target.value })}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Manual No</label>
                <input
                  type="text"
                  value={header.manual_no}
                  onChange={(e) => setHeader({ ...header, manual_no: e.target.value })}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Payment Mode</label>
                <select
                  value={header.payment_mode}
                  onChange={(e) => setHeader({ ...header, payment_mode: e.target.value as any })}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs"
                >
                  <option value="Credit">Credit</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">State</label>
                <input
                  type="text"
                  value={header.state}
                  onChange={(e) => setHeader({ ...header, state: e.target.value })}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Item Grid */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            Wholesale Items Grid ({items.length} lots)
          </span>
          <button
            onClick={addItemRow}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold border border-indigo-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Purchase Lot</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 select-none">
              <tr>
                <th className="p-2 border-r border-slate-200 w-10 text-center">#</th>
                <th className="p-2 border-r border-slate-200 min-w-[180px]">Itemname</th>
                <th className="p-2 border-r border-slate-200 w-16 text-center">QTY</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right">GrossWt</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right font-bold text-blue-800 bg-sky-50">NetWt</th>
                <th className="p-2 border-r border-slate-200 w-20 text-center">Purity</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right">Rate</th>
                <th className="p-2 border-r border-slate-200 w-20 text-right text-indigo-700 font-bold">Wastage%</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right font-semibold text-indigo-900 bg-indigo-50/50">Fin+Wastage</th>
                <th className="p-2 border-r border-slate-200 w-28 text-right font-bold text-emerald-700 bg-emerald-50/50">Total.Amt</th>
                <th className="p-2 border-r border-slate-200 w-24 text-center font-bold text-amber-700">HUID</th>
                <th className="p-2 w-10 text-center">✕</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
              {items.map((it, idx) => (
                <tr key={it.id} className="hover:bg-sky-50/30">
                  <td className="p-2 border-r border-slate-200 text-center text-slate-400">{idx + 1}</td>
                  <td className="p-1.5 border-r border-slate-200 font-sans">
                    <input
                      type="text"
                      value={it.item_name}
                      onChange={(e) => updateItem(idx, 'item_name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 text-xs"
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <input
                      type="number"
                      value={it.qty}
                      onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-1 py-1 text-center text-slate-900 text-xs"
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <input
                      type="number"
                      step={0.001}
                      value={it.gross_wt}
                      onChange={(e) => updateItem(idx, 'gross_wt', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 text-right text-slate-900 text-xs font-bold"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200 text-right font-bold text-blue-800 bg-sky-50">
                    {formatWeight(it.net_wt)}
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <input
                      type="number"
                      step={0.1}
                      value={it.purity}
                      onChange={(e) => updateItem(idx, 'purity', parseFloat(e.target.value) || 91.6)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-1 py-1 text-center text-slate-800 text-xs"
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <input
                      type="number"
                      value={it.rate}
                      onChange={(e) => updateItem(idx, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 text-right text-slate-900 text-xs"
                    />
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <input
                      type="number"
                      step={0.1}
                      value={it.wastage_pct}
                      onChange={(e) => updateItem(idx, 'wastage_pct', parseFloat(e.target.value) || 0)}
                      className="w-full bg-indigo-50 border border-indigo-300 rounded px-1 py-1 text-right text-indigo-900 text-xs font-bold"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200 text-right font-bold text-indigo-900 bg-indigo-50/50">
                    {formatWeight(it.fin_plus_wastage)}
                  </td>
                  <td className="p-2 border-r border-slate-200 text-right font-bold text-emerald-700 bg-emerald-50/50">
                    ₹{Math.round(it.total_amt).toLocaleString('en-IN')}
                  </td>
                  <td className="p-1.5 border-r border-slate-200">
                    <input
                      type="text"
                      maxLength={6}
                      value={it.huid}
                      onChange={(e) => updateItem(idx, 'huid', e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-1 py-1 text-center font-mono font-bold text-amber-700 text-xs uppercase"
                    />
                  </td>
                  <td className="p-1 text-center">
                    <button
                      onClick={() => setItems(items.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settlement Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-2 text-xs">
          <span className="font-bold text-blue-900 uppercase tracking-wider block border-b border-slate-100 pb-1">
            Settlement & Payments
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-500">By Cash (₹)</label>
              <input
                type="number"
                value={payment.by_cash}
                onChange={(e) => setPayment({ ...payment, by_cash: parseFloat(e.target.value) || 0 })}
                className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono text-right text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500">By Cheque / RTGS (₹)</label>
              <input
                type="number"
                value={payment.by_cheque}
                onChange={(e) => setPayment({ ...payment, by_cheque: parseFloat(e.target.value) || 0 })}
                className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono text-right text-xs"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] text-slate-500">Bank Name & Details</label>
              <input
                type="text"
                value={payment.details}
                onChange={(e) => setPayment({ ...payment, details: e.target.value })}
                className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4 shadow-sm space-y-2 text-xs flex flex-col justify-between">
          <div>
            <span className="font-bold text-indigo-900 uppercase tracking-wider block border-b border-indigo-200/60 pb-1">
              Invoice Balance Summary
            </span>
            <div className="flex justify-between text-slate-600 mt-2">
              <span>Bill Amount:</span>
              <span className="font-mono font-bold text-slate-900">{formatCurrency(payment.bill_amount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Paid Amount:</span>
              <span className="font-mono font-semibold text-emerald-700">{formatCurrency(payment.paid_amount)}</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-indigo-300 rounded-lg flex justify-between items-center">
            <span className="font-bold text-indigo-900 text-xs uppercase">Net Balance Due</span>
            <span className="text-xl font-mono font-extrabold text-indigo-900">
              {formatCurrency(payment.net_balance)}
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ColumnSettingsModal
        isOpen={showColumnSettings}
        onClose={() => setShowColumnSettings(false)}
        columns={purchaseCols}
        onSave={(c) => setPurchaseCols(c)}
      />

      <FieldHelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        screenName="Purchase Invoice"
      />

      <PrintVoucherModal
        isOpen={showPrint}
        onClose={() => setShowPrint(false)}
        voucherType="Purchase"
        data={{ header, items, payment }}
      />

      <WhatsAppShareModal
        isOpen={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        recipientName={header.supplier_name}
        phone="9820011223"
        defaultMessage={`Purchase Invoice ${header.invoice_no} acknowledged. Total: ${formatCurrency(payment.bill_amount)}, Balance: ${formatCurrency(payment.net_balance)}.`}
      />
    </div>
  );
};
