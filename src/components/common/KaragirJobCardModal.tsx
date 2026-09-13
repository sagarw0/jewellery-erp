import React from 'react';
import {
  Printer,
  X,
  Hammer,
  ShieldCheck,
  QrCode,
  Calendar,
  Scale,
  Scissors,
  AlertCircle,
  MessageCircle,
  Image
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { NewOrderBookingRecord, KaragirAssignment } from '../../types/erp';

interface KaragirJobCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: NewOrderBookingRecord;
  assignment?: KaragirAssignment;
}

export const KaragirJobCardModal: React.FC<KaragirJobCardModalProps> = ({
  isOpen,
  onClose,
  order,
  assignment,
}) => {
  if (!isOpen) return null;

  const currentAssignment = assignment || order.karagir_assignment || {
    karagir_id: 'KARA-01',
    karagir_name: order.assigned_karagir || 'Soni Govindbhai & Sons (Karagir)',
    karagir_phone: '9892044556',
    assigned_date: order.karagir_issue_date || new Date().toISOString().split('T')[0],
    promised_date: order.header.delivery_date,
    issued_metal_type: '24K Pure Gold Granules (999)',
    issued_gross_wt: order.items.reduce((s, it) => s + (it.gross_wt || 0), 0) + 1.5,
    issued_purity: 99.9,
    issued_fine_wt: (order.items.reduce((s, it) => s + (it.gross_wt || 0), 0) + 1.5) * 0.999,
    alloy_added_wt: 1.25,
    karagir_rate_per_gm: 380,
    agreed_making_charges: order.items.reduce((s, it) => s + (it.mkg_amt || 0), 0) || 11025,
    wastage_pct: 1.5,
    special_instructions: 'Strict 916 BIS Hallmark stamping. Handcrafted traditional filigree finish. Clean joint soldering.',
    voucher_no: `ISS-KARA-${order.order_no.replace('ORD-', '')}`,
    status: 'Assigned' as const,
    design_photo: order.design_photo || order.header?.design_photo || order.items[0]?.image_url,
  };

  const designPhoto =
    currentAssignment.design_photo ||
    order.design_photo ||
    order.header?.design_photo ||
    order.items[0]?.image_url;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const itemsSummary = order.items
      .map((it, idx) => `${idx + 1}. *${it.item_name}* (Qty: ${it.qty}, Net Wt: ${formatWeight(it.net_wt)}, Purity: ${it.purity}%)`)
      .join('\n');

    const cleanPhone = (currentAssignment.karagir_phone || '9892044556').replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const message = `*SWARNA JEWELLERS - WORKSHOP JOB CARD & DISPATCH SLIP* 🔨\n` +
      `----------------------------------------\n` +
      `*Job Voucher:* ${currentAssignment.voucher_no}\n` +
      `*Order Ref:* ${order.order_no}\n` +
      `*Artisan:* ${currentAssignment.karagir_name}\n` +
      `*Customer Ref:* ${order.header.customer_n || 'Showroom Custom'}\n` +
      `----------------------------------------\n` +
      `*ORNAMENTS SPECIFICATIONS:*\n${itemsSummary}\n` +
      `*Total Net Wt:* ${formatWeight(order.items.reduce((s, it) => s + (it.net_wt || 0), 0))}\n` +
      `----------------------------------------\n` +
      `*RAW BULLION METAL ISSUED:*\n` +
      `• Metal: ${currentAssignment.issued_metal_type}\n` +
      `• Gross Wt: ${formatWeight(currentAssignment.issued_gross_wt)}\n` +
      `• Purity: ${currentAssignment.issued_purity}%\n` +
      `• Fine Gold: ${formatWeight(currentAssignment.issued_fine_wt)}\n` +
      `----------------------------------------\n` +
      `*MAKING TERMS:*\n` +
      `• Labour Rate: ₹${currentAssignment.karagir_rate_per_gm}/gm\n` +
      `• Total Labour: ${formatCurrency(currentAssignment.agreed_making_charges)}\n` +
      `• Wastage Tolerance: ${currentAssignment.wastage_pct}%\n` +
      `• *Delivery Date:* ${currentAssignment.promised_date}\n` +
      `----------------------------------------\n` +
      `*INSTRUCTIONS:* "${currentAssignment.special_instructions || 'Strict 916 BIS Hallmark stamping mandatory.'}"\n\n` +
      (designPhoto ? `*Design Reference Photo:* Attached with Job Card.` : '') +
      `\n\n_Please confirm delivery schedule._`;

    const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const totalRequiredNetWt = order.items.reduce((s, it) => s + (it.net_wt || 0), 0);
  const totalQty = order.items.reduce((s, it) => s + (it.qty || 0), 0);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-amber-300 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white flex items-center justify-between no-print shadow-xs">
          <div className="flex items-center space-x-2">
            <Hammer className="w-5 h-5 text-amber-200" />
            <h3 className="text-sm font-bold tracking-wide">
              Official Karagir Workshop Job Card & Issue Voucher
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSendWhatsApp}
              className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700 flex items-center space-x-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>WhatsApp to Karagir</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white text-amber-950 font-bold rounded-lg text-xs hover:bg-amber-50 flex items-center space-x-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-amber-700" />
              <span>Print Job Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Workshop Slip Content */}
        <div id="printable-job-card" className="p-7 overflow-y-auto font-sans text-xs space-y-4 bg-white text-slate-900 flex-1">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-wide uppercase text-amber-950">
                  SWARNA JEWELLERS & WORKSHOP
                </h2>
                <span className="px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold rounded uppercase">
                  KARAGIR JOB CARD
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                14-18, Zaveri Bazaar Bullion Tower, Kalbadevi Road, Mumbai - 400002
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Artisan Metal Control Voucher • GSTIN: 27AAACS1234F1Z8
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="text-xs font-mono font-black px-2.5 py-1 bg-amber-50 border border-amber-300 rounded text-amber-950">
                VOUCHER: {currentAssignment.voucher_no}
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                Order Ref: <strong>{order.order_no}</strong>
              </div>
              <div className="text-[10px] text-slate-500">
                Issue Date: {currentAssignment.assigned_date}
              </div>
            </div>
          </div>

          {/* Karagir & Delivery Target Box */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-900 block mb-0.5">
                Assigned Artisan / Karagir:
              </span>
              <div className="text-sm font-extrabold text-slate-900 flex items-center space-x-1.5">
                <span>{currentAssignment.karagir_name}</span>
              </div>
              {currentAssignment.karagir_phone && (
                <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                  WhatsApp: <strong>{currentAssignment.karagir_phone}</strong>
                </div>
              )}
              <div className="text-[10px] text-slate-500">
                Customer Reference: {order.header.customer_n || 'Showroom Custom Order'}
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-900 block mb-0.5">
                Delivery Schedule:
              </span>
              <div className="text-xs font-bold text-slate-800">
                Promised Date: <strong className="text-rose-700 font-mono text-sm">{currentAssignment.promised_date}</strong>
              </div>
              <div className="text-[10px] text-slate-600">
                Customer Promised Delivery: {order.header.delivery_date}
              </div>
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded text-[10px] font-bold">
                <span>Status: {currentAssignment.status}</span>
              </div>
            </div>
          </div>

          {/* Design Photo & Ornament Specs Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
            {/* Left: Design Reference Image */}
            {designPhoto && (
              <div className="md:col-span-4 p-2.5 bg-slate-50 border border-slate-300 rounded-xl space-y-1.5 text-center">
                <span className="text-[10px] font-bold text-slate-700 uppercase block">
                  Design Reference Photo
                </span>
                <div className="w-full h-32 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center">
                  <img
                    src={designPhoto}
                    alt="Design Spec"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[9px] text-slate-500 italic block">
                  Manufacture exactly per sample design
                </span>
              </div>
            )}

            {/* Right: Job Specifications & Line Items */}
            <div className={`${designPhoto ? 'md:col-span-8' : 'md:col-span-12'} space-y-1.5`}>
              <div className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Scissors className="w-3.5 h-3.5 text-amber-700" />
                <span>Ornaments to be Manufactured</span>
              </div>

              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-300 w-8 text-center">#</th>
                      <th className="p-2 border-r border-slate-300">Item Description</th>
                      <th className="p-2 border-r border-slate-300 w-12 text-center">QTY</th>
                      <th className="p-2 border-r border-slate-300 w-20 text-right">Net Wt</th>
                      <th className="p-2 border-r border-slate-300 w-16 text-center">Purity</th>
                      <th className="p-2 text-right w-24">Making</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {order.items.map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td className="p-2 border-r border-slate-300 text-center font-mono">{idx + 1}</td>
                        <td className="p-2 border-r border-slate-300 font-medium">
                          <div className="font-bold text-slate-900">{it.item_name}</div>
                          {it.description && <div className="text-[10px] text-slate-500 italic">{it.description}</div>}
                          {it.black_beats > 0 && <span className="text-[9.5px] text-amber-800">Black Beads: {it.black_beats}g • </span>}
                          {it.stone_wt > 0 && <span className="text-[9.5px] text-slate-600">Stone Wt: {it.stone_wt}g</span>}
                        </td>
                        <td className="p-2 border-r border-slate-300 text-center font-mono font-bold">{it.qty}</td>
                        <td className="p-2 border-r border-slate-300 text-right font-mono font-bold text-blue-900">
                          {formatWeight(it.net_wt)}
                        </td>
                        <td className="p-2 border-r border-slate-300 text-center font-mono font-semibold">
                          {it.purity}% (22K)
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-slate-800">
                          {formatCurrency(it.mkg_amt || (it.net_wt * (currentAssignment.karagir_rate_per_gm || 380)))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-mono font-bold border-t border-slate-300 text-[11px]">
                    <tr>
                      <td colSpan={2} className="p-2 text-right border-r border-slate-300">Total:</td>
                      <td className="p-2 text-center border-r border-slate-300">{totalQty}</td>
                      <td className="p-2 text-right border-r border-slate-300 text-blue-900">{formatWeight(totalRequiredNetWt)}</td>
                      <td className="p-2 border-r border-slate-300"></td>
                      <td className="p-2 text-right text-emerald-800">{formatCurrency(currentAssignment.agreed_making_charges)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Raw Metal Issued & Wastage Agreement */}
          <div className="grid grid-cols-2 gap-3">
            {/* Left: Issued Raw Metal */}
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1.5">
              <span className="font-bold text-slate-900 uppercase text-[10.5px] flex items-center space-x-1">
                <Scale className="w-3.5 h-3.5 text-amber-700" />
                <span>Raw Bullion Material Issued</span>
              </span>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Metal Type:</span>
                  <span className="font-bold text-slate-800">{currentAssignment.issued_metal_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Issued Gross Wt:</span>
                  <span className="font-bold text-slate-900">{formatWeight(currentAssignment.issued_gross_wt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Issued Purity:</span>
                  <span className="font-bold text-slate-800">{currentAssignment.issued_purity}%</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-amber-950 font-bold">
                  <span className="text-amber-900 font-sans">Fine Gold Issued:</span>
                  <span className="font-black text-amber-900">{formatWeight(currentAssignment.issued_fine_wt)}</span>
                </div>
              </div>
            </div>

            {/* Right: Making Terms & Wastage */}
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1.5">
              <span className="font-bold text-slate-900 uppercase text-[10.5px] flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>Labour & Wastage Terms</span>
              </span>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Making Rate:</span>
                  <span className="font-bold text-slate-800">₹{currentAssignment.karagir_rate_per_gm}/gm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Agreed Wastage Allowance:</span>
                  <span className="font-bold text-rose-700">{currentAssignment.wastage_pct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Total Labour Payable:</span>
                  <span className="font-bold text-emerald-800">{formatCurrency(currentAssignment.agreed_making_charges)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-[10px] text-slate-500 font-sans">
                  <span>Reconciliation:</span>
                  <span className="font-bold text-slate-700">Gross Wt + Dust = Issued Wt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Artisan Instructions */}
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px]">
            <strong className="text-amber-950 block mb-0.5">Special Artisan Instructions:</strong>
            <p className="text-amber-900 italic font-medium">
              "{currentAssignment.special_instructions || 'Ensure hallmark stamping 916. Handle diamonds/beads with extreme precision.'}"
            </p>
          </div>

          {/* Signatures & Barcode footer */}
          <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-3 items-end text-center text-[10.5px] text-slate-700">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mx-3 mb-1"></div>
              <span className="font-bold">Issued By (Store Manager)</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="p-1 bg-white border border-slate-300 rounded shadow-2xs mb-1">
                <QrCode className="w-8 h-8 text-slate-800" />
              </div>
              <span className="font-mono text-[9px] text-slate-500">JOB-{currentAssignment.voucher_no}</span>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mx-3 mb-1"></div>
              <span className="font-bold">Artisan (Karagir) Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
