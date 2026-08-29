import React, { useState } from 'react';
import {
  ReceiptText,
  Save,
  Trash2,
  XCircle,
  HelpCircle,
  MessageCircle,
  Barcode,
  Coins
} from 'lucide-react';
import { formatCurrency, formatWeight, calculateTaxes, roundTo } from '../../utils/calculations';
import { PrintVoucherModal } from '../common/PrintVoucherModal';
import { WhatsAppShareModal } from '../common/WhatsAppShareModal';
import { FieldHelpModal } from '../common/FieldHelpModal';

interface SalesInvoiceViewProps {
  onClose: () => void;
  goldRate: number;
}

export const SalesInvoiceView: React.FC<SalesInvoiceViewProps> = ({ onClose, goldRate }) => {
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [phone, setPhone] = useState('9820123456');
  const [invoiceNo, setInvoiceNo] = useState(`INV-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [barcodeInput, setBarcodeInput] = useState('');

  const [items, setItems] = useState([
    {
      id: 'it-1',
      item_name: '22K 916 Royal Peacock Choker Necklace',
      gross_wt: 32.500,
      black_beats: 0,
      stone_wt: 1.200,
      net_wt: 31.300,
      purity: 91.6,
      rate: goldRate,
      making_per_gm: 450,
      making_amt: 14085,
      hallmark_charges: 45,
      total_amt: 241010,
    },
  ]);

  const [urdAmount, setUrdAmount] = useState(15000);
  const [discount, setDiscount] = useState(1010);
  const [cashTendered, setCashTendered] = useState(25000);
  const [bankTendered, setBankTendered] = useState(200000);

  const [showPrint, setShowPrint] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const subtotal = items.reduce((s, it) => s + it.total_amt, 0);
  const taxes = calculateTaxes(subtotal, false, 3.0);
  const totalBill = subtotal + taxes.gstAmt - discount;
  const netDue = Math.max(0, roundTo(totalBill - urdAmount - cashTendered - bankTendered, 2));

  const handleScanBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const newItem = {
      id: `it-${Date.now()}`,
      item_name: `Tagged Ornament (${barcodeInput.toUpperCase()})`,
      gross_wt: 15.000,
      black_beats: 0,
      stone_wt: 0,
      net_wt: 15.000,
      purity: 91.6,
      rate: goldRate,
      making_per_gm: 400,
      making_amt: 6000,
      hallmark_charges: 45,
      total_amt: roundTo(15.0 * goldRate + 6000 + 45, 2),
    };
    setItems([...items, newItem]);
    setBarcodeInput('');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
            <ReceiptText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-800">Sales Invoice (POS Counter Billing)</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                {invoiceNo}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Counter billing with instant barcode scanning, URD old gold deduction, and tax invoices.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={() => {
              alert(`Sales Invoice ${invoiceNo} generated and ledger updated!`);
              setShowPrint(true);
            }}
            className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Complete Sale & Print</span>
          </button>

          <button
            onClick={() => setShowWhatsApp(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 text-xs font-bold"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Customer & Barcode Scanner Strip */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Customer Name & Mobile</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-2/3 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold text-xs"
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-1/3 px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Invoice Date</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-blue-700 mb-1 flex items-center space-x-1">
            <Barcode className="w-3.5 h-3.5" />
            <span>Scan Tag / Barcode (Enter key to add)</span>
          </label>
          <form onSubmit={handleScanBarcode} className="flex space-x-2">
            <input
              type="text"
              placeholder="e.g. TAG-GLD-8801..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-sky-50 border border-sky-300 rounded-lg text-blue-900 font-mono font-bold text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </form>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-blue-900 uppercase tracking-wider">
            Billed Ornaments ({items.length})
          </span>
          <span className="text-slate-500 font-mono">Gold 22K: ₹{goldRate}/g</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2 border-r border-slate-200 w-10 text-center">#</th>
                <th className="p-2 border-r border-slate-200 min-w-[220px]">Item Description</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right">Gross Wt</th>
                <th className="p-2 border-r border-slate-200 w-20 text-right">Stone Wt</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right font-bold text-blue-800 bg-sky-50">Net Wt</th>
                <th className="p-2 border-r border-slate-200 w-20 text-center">Purity</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right">Mkg/Gm</th>
                <th className="p-2 border-r border-slate-200 w-24 text-right">Hallmark</th>
                <th className="p-2 border-r border-slate-200 w-28 text-right font-bold text-emerald-700 bg-emerald-50/50">Amount (₹)</th>
                <th className="p-2 w-10 text-center">✕</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
              {items.map((it, idx) => (
                <tr key={it.id} className="hover:bg-sky-50/30">
                  <td className="p-2 border-r border-slate-200 text-center text-slate-400">{idx + 1}</td>
                  <td className="p-2 border-r border-slate-200 font-sans text-slate-900 font-medium">{it.item_name}</td>
                  <td className="p-2 border-r border-slate-200 text-right">{formatWeight(it.gross_wt)}</td>
                  <td className="p-2 border-r border-slate-200 text-right text-slate-500">{formatWeight(it.stone_wt)}</td>
                  <td className="p-2 border-r border-slate-200 text-right font-bold text-blue-800 bg-sky-50">
                    {formatWeight(it.net_wt)}
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center">{it.purity}%</td>
                  <td className="p-2 border-r border-slate-200 text-right">₹{it.making_per_gm}</td>
                  <td className="p-2 border-r border-slate-200 text-right">₹{it.hallmark_charges}</td>
                  <td className="p-2 border-r border-slate-200 text-right font-bold text-emerald-700 bg-emerald-50/50">
                    ₹{it.total_amt.toLocaleString('en-IN')}
                  </td>
                  <td className="p-2 text-center">
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

      {/* Bill Calculation & Tender Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3 text-xs">
          <span className="font-bold text-blue-900 uppercase tracking-wider block border-b border-slate-100 pb-1">
            Trade-In (URD) & Payment Tenders
          </span>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-amber-800 font-bold">URD Old Gold Trade-In (₹):</span>
              <input
                type="number"
                value={urdAmount}
                onChange={(e) => setUrdAmount(parseFloat(e.target.value) || 0)}
                className="w-32 px-2 py-1 bg-amber-50 border border-amber-300 rounded font-mono text-right text-amber-900 font-bold"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">Customer Cash Paid (₹):</span>
              <input
                type="number"
                value={cashTendered}
                onChange={(e) => setCashTendered(parseFloat(e.target.value) || 0)}
                className="w-32 px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono text-right text-slate-900"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">Bank / Card / UPI Paid (₹):</span>
              <input
                type="number"
                value={bankTendered}
                onChange={(e) => setBankTendered(parseFloat(e.target.value) || 0)}
                className="w-32 px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono text-right text-slate-900"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Bill Discount (₹):</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-32 px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono text-right text-emerald-700 font-bold"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-4 shadow-sm space-y-2 text-xs flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="font-bold text-blue-900 uppercase tracking-wider block border-b border-sky-200 pb-1">
              Invoice Summary
            </span>

            <div className="flex justify-between text-slate-600">
              <span>Subtotal Metal & Labour:</span>
              <span className="font-mono font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>GST 3% (1.5% CGST + 1.5% SGST):</span>
              <span className="font-mono font-semibold text-slate-900">{formatCurrency(taxes.gstAmt)}</span>
            </div>

            <div className="flex justify-between text-amber-800 font-medium">
              <span>URD Old Gold Trade Credit:</span>
              <span className="font-mono font-bold">-{formatCurrency(urdAmount)}</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-sky-300 rounded-lg flex justify-between items-center">
            <span className="font-bold text-blue-900 text-xs uppercase">Net Due</span>
            <span className="font-mono font-extrabold text-blue-900 text-lg">
              {formatCurrency(netDue)}
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <FieldHelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        screenName="New Order Booking"
      />

      <PrintVoucherModal
        isOpen={showPrint}
        onClose={() => setShowPrint(false)}
        voucherType="Order"
        data={{
          order_no: invoiceNo,
          header: { customer_n: customerName, ph_no: phone, bill_date: invoiceDate },
          items,
          payment: {
            amount: subtotal,
            gst_amt: taxes.gstAmt,
            purchase_amt: urdAmount,
            total_discount: discount,
            balance_amount: netDue,
            left_payment_type: 'Bank/Card',
            left_amount: bankTendered,
          },
        }}
      />
    </div>
  );
};
