import React from 'react';
import { Printer, X, Download, ShieldCheck, QrCode } from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';

interface PrintVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucherType: 'Order' | 'Purchase' | 'Refinery' | 'DayBook' | 'Sales Invoice' | 'Sales';
  title?: string;
  data?: any;
  voucherNo?: string;
  date?: string;
  partyName?: string;
  amount?: number;
}

export const PrintVoucherModal: React.FC<PrintVoucherModalProps> = ({
  isOpen,
  onClose,
  voucherType,
  title = 'Tax Invoice & Jewellery Voucher',
  data,
  voucherNo,
  date,
  partyName,
  amount,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-sky-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800">
        <div className="px-5 py-3.5 bg-gradient-to-r from-blue-600 to-sky-600 text-white flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5" />
            <h3 className="text-sm font-bold tracking-wide">{title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-white text-blue-900 font-bold rounded-lg text-xs hover:bg-slate-100 flex items-center space-x-1 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-voucher" className="p-8 max-h-[75vh] overflow-y-auto font-sans text-xs space-y-5 bg-white text-slate-900">
          <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold tracking-wide uppercase text-blue-950">
                SWARNA JEWELLERS & BULLION MART
              </h2>
              <p className="text-[11px] text-slate-600">
                14-18, Zaveri Bazaar Bullion Tower, Kalbadevi Road, Mumbai - 400002
              </p>
              <p className="text-[11px] text-slate-600 font-mono">
                GSTIN: <strong>27AAACS1234F1Z8</strong> | BIS Hallmark License: <strong>HM-916-MH-4421</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold px-2 py-1 bg-slate-100 border border-slate-300 rounded block">
                {data.order_no || data.header?.invoice_no || 'VCH-2026-081'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Date: {data.header?.bill_date || data.header?.invoice_date || new Date().toISOString().split('T')[0]}
              </span>
            </div>
          </div>

          {/* Customer / Party details */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Party / Customer:</span>
              <strong className="text-slate-900 text-sm">
                {data.header?.customer_n || data.header?.supplier_name || data.header?.refinery_name || 'Walk-in Customer'}
              </strong>
              {data.header?.ph_no && <div className="text-slate-600 font-mono">Ph: {data.header.ph_no}</div>}
              {data.header?.address && <div className="text-slate-600">{data.header.address}</div>}
            </div>
            <div className="text-right space-y-0.5">
              {data.header?.delivery_date && (
                <div>Delivery Date: <strong className="text-blue-900">{data.header.delivery_date}</strong></div>
              )}
              {data.header?.pan_card && <div>PAN: <strong className="font-mono">{data.header.pan_card}</strong></div>}
              {data.header?.salesman && <div>Salesman: {data.header.salesman}</div>}
            </div>
          </div>

          {/* Itemized Table */}
          {data.items && data.items.length > 0 && (
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300 text-[11px]">
                  <tr>
                    <th className="p-2 border-r border-slate-300">#</th>
                    <th className="p-2 border-r border-slate-300">Description</th>
                    <th className="p-2 border-r border-slate-300 text-right">Gross Wt</th>
                    <th className="p-2 border-r border-slate-300 text-right">Net Wt</th>
                    <th className="p-2 border-r border-slate-300 text-center">Purity</th>
                    <th className="p-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {data.items.map((it: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-2 border-r border-slate-200 text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-sans font-medium">{it.item_name}</td>
                      <td className="p-2 border-r border-slate-200 text-right">{formatWeight(it.gross_wt)}</td>
                      <td className="p-2 border-r border-slate-200 text-right font-bold">{formatWeight(it.net_wt)}</td>
                      <td className="p-2 border-r border-slate-200 text-center">{it.purity}%</td>
                      <td className="p-2 text-right font-bold">
                        {formatCurrency(it.item_amt || it.total_amt || it.amount || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Financial summary */}
          {data.payment && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center text-xs">
              <div className="space-y-1 text-slate-600">
                <div>Subtotal: <strong className="text-slate-900">{formatCurrency(data.payment.amount || 0)}</strong></div>
                <div>GST: <strong className="text-slate-900">{formatCurrency(data.payment.gst_amt || 0)}</strong></div>
                {data.payment.purchase_amt > 0 && (
                  <div>Old Gold Credit: <strong className="text-amber-800">-{formatCurrency(data.payment.purchase_amt)}</strong></div>
                )}
                {data.payment.advance_amt > 0 && (
                  <div>Advance Paid: <strong className="text-emerald-700">-{formatCurrency(data.payment.advance_amt)}</strong></div>
                )}
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Balance Due</span>
                <span className="text-xl font-mono font-extrabold text-blue-950">
                  {formatCurrency(data.payment.balance_amount || 0)}
                </span>
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-[11px] text-slate-600">
            <div className="border-t border-slate-300 pt-1 text-center">
              Customer Signature
            </div>
            <div className="border-t border-slate-300 pt-1 text-center font-semibold text-slate-900">
              For SWARNA JEWELLERS (Authorized Signatory)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
