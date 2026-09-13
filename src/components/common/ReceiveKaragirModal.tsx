import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  Scale,
  Hammer,
  ShieldCheck,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { NewOrderBookingRecord, KaragirAssignment } from '../../types/erp';
import { formatCurrency, formatWeight, roundTo } from '../../utils/calculations';

interface ReceiveKaragirModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: NewOrderBookingRecord;
  onReceive: (
    orderId: string,
    receivedData: {
      received_gross_wt: number;
      received_net_wt: number;
      return_scrap_wt: number;
      actual_wastage_wt: number;
      making_charges_paid: number;
      received_date: string;
      hallmark_verified: boolean;
    }
  ) => void;
}

export const ReceiveKaragirModal: React.FC<ReceiveKaragirModalProps> = ({
  isOpen,
  onClose,
  order,
  onReceive,
}) => {
  if (!isOpen) return null;

  const assignment = order.karagir_assignment;
  const targetNetWt = order.items.reduce((s, it) => s + (it.net_wt || 0), 0) || 10;
  const issuedGrossWt = assignment?.issued_gross_wt || targetNetWt + 1.2;

  const [receivedGrossWt, setReceivedGrossWt] = useState<number>(targetNetWt);
  const [receivedNetWt, setReceivedNetWt] = useState<number>(targetNetWt);
  const [returnScrapWt, setReturnScrapWt] = useState<number>(
    roundTo(issuedGrossWt - targetNetWt - (issuedGrossWt * (assignment?.wastage_pct || 1.5)) / 100, 3)
  );
  const [makingChargesPaid, setMakingChargesPaid] = useState<number>(
    assignment?.agreed_making_charges || targetNetWt * (assignment?.karagir_rate_per_gm || 380)
  );
  const [receiveDate, setReceiveDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [hallmarkVerified, setHallmarkVerified] = useState<boolean>(true);

  // Metal Reconciliation
  const totalMetalAccounted = roundTo(receivedGrossWt + returnScrapWt, 3);
  const actualWastageWt = Math.max(0, roundTo(issuedGrossWt - totalMetalAccounted, 3));
  const allowedWastageWt = roundTo((issuedGrossWt * (assignment?.wastage_pct || 1.5)) / 100, 3);
  const wastageDiscrepancy = roundTo(actualWastageWt - allowedWastageWt, 3);

  const handleConfirm = () => {
    onReceive(order.id, {
      received_gross_wt: receivedGrossWt,
      received_net_wt: receivedNetWt,
      return_scrap_wt: returnScrapWt,
      actual_wastage_wt: actualWastageWt,
      making_charges_paid: makingChargesPaid,
      received_date: receiveDate,
      hallmark_verified: hallmarkVerified,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-emerald-300 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/20 text-white shadow-2xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-wide">
                Receive Finished Jewellery from Karagir
              </h3>
              <p className="text-[11px] text-emerald-100 mt-0.5">
                Reconcile finished weights, returned scrap bullion, wastage & labour payment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Order & Karagir Summary */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">
                Order & Artisan:
              </span>
              <div className="font-extrabold text-emerald-950 text-xs">
                {order.order_no} • {assignment?.karagir_name || order.assigned_karagir || 'Assigned Karagir'}
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {order.items.map((i) => i.item_name).join(', ')}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">
                Issued Metal Weight:
              </span>
              <div className="text-sm font-black font-mono text-emerald-950">
                {formatWeight(issuedGrossWt)} (Purity: {assignment?.issued_purity || 99.9}%)
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Issued Voucher: {assignment?.voucher_no || 'ISS-KARA-01'}
              </div>
            </div>
          </div>

          {/* Section 1: Received Weights */}
          <div className="space-y-2 border-b border-slate-100 pb-3">
            <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-700" />
              <span>Finished Ornament & Scrap Weights</span>
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-500 font-bold">Received Gross Wt (g)</label>
                <input
                  type="number"
                  step={0.001}
                  value={receivedGrossWt}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 0;
                    setReceivedGrossWt(v);
                    setReceivedNetWt(v);
                  }}
                  className="w-full bg-emerald-50 border border-emerald-300 rounded-lg px-2.5 py-1.5 text-emerald-950 font-mono font-bold text-right text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold">Received Net Wt (g)</label>
                <input
                  type="number"
                  step={0.001}
                  value={receivedNetWt}
                  onChange={(e) => setReceivedNetWt(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-mono font-bold text-right text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold">Scrap / Dust Returned (g)</label>
                <input
                  type="number"
                  step={0.001}
                  value={returnScrapWt}
                  onChange={(e) => setReturnScrapWt(parseFloat(e.target.value) || 0)}
                  className="w-full bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1.5 text-amber-950 font-mono font-bold text-right text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Metal Reconciliation & Wastage Audit */}
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
            <span className="font-bold text-slate-900 uppercase text-[10.5px] flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Metal Reconciliation & Wastage Analysis</span>
            </span>

            <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-sans block">Total Accounted Wt</span>
                <strong className="text-slate-900">{formatWeight(totalMetalAccounted)}</strong>
              </div>

              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-sans block">Actual Wastage</span>
                <strong className="text-rose-700">{formatWeight(actualWastageWt)}</strong>
              </div>

              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-sans block">Allowed Wastage</span>
                <strong className="text-emerald-700">{formatWeight(allowedWastageWt)}</strong>
              </div>
            </div>

            {wastageDiscrepancy > 0.05 && (
              <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  Notice: Karagir wastage is <strong>+{formatWeight(wastageDiscrepancy)}</strong> above agreed {assignment?.wastage_pct || 1.5}% limit.
                </span>
              </div>
            )}
          </div>

          {/* Section 3: Labour Charges & Receipt Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 font-bold">Making Charges Payable (₹)</label>
              <input
                type="number"
                value={makingChargesPaid}
                onChange={(e) => setMakingChargesPaid(parseFloat(e.target.value) || 0)}
                className="w-full bg-emerald-50 border border-emerald-300 rounded-lg px-2.5 py-1.5 text-emerald-950 font-mono font-bold text-right text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold">Received Date</label>
              <input
                type="date"
                value={receiveDate}
                onChange={(e) => setReceiveDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-mono text-xs"
              />
            </div>
          </div>

          {/* Hallmark Checkbox */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center space-x-2">
            <input
              type="checkbox"
              id="chk-hallmark"
              checked={hallmarkVerified}
              onChange={(e) => setHallmarkVerified(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded"
            />
            <label htmlFor="chk-hallmark" className="text-xs font-bold text-amber-950 cursor-pointer">
              BIS 916 Hallmark & Purity Stamping Verified on Ornament
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold text-xs"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Receipt & Ready for Delivery</span>
          </button>
        </div>
      </div>
    </div>
  );
};
