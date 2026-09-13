import React, { useState, useEffect } from 'react';
import {
  Hammer,
  X,
  Scale,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Sparkles,
  Phone,
  User,
  AlertCircle
} from 'lucide-react';
import { NewOrderBookingRecord, KaragirAssignment } from '../../types/erp';
import { formatCurrency, formatWeight, roundTo } from '../../utils/calculations';

export interface KaragirMasterProfile {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  location: string;
  default_rate: number;
  default_wastage: number;
  active_jobs: number;
}

export const DEFAULT_KARAGIRS: KaragirMasterProfile[] = [
  {
    id: 'KARA-01',
    name: 'Soni Govindbhai & Sons',
    phone: '9892044556',
    specialty: 'Mangalsutra & Antique Filigree',
    location: 'Dadar Jewellery Workshop',
    default_rate: 380,
    default_wastage: 1.5,
    active_jobs: 2,
  },
  {
    id: 'KARA-02',
    name: 'Ramesh Sutar Goldsmith',
    phone: '9820144321',
    specialty: 'Bangles, Kada & CNC Machine',
    location: 'Zaveri Bazaar Hub',
    default_rate: 280,
    default_wastage: 1.2,
    active_jobs: 1,
  },
  {
    id: 'KARA-03',
    name: 'Vijay Patwardhan Temple Jewellery',
    phone: '9819277665',
    specialty: 'Nakas, Temple Jewellery & Choker',
    location: 'Kolhapur Nakas Hub',
    default_rate: 480,
    default_wastage: 2.0,
    active_jobs: 3,
  },
  {
    id: 'KARA-04',
    name: 'Babu Rao Casted Specialist',
    phone: '9833599112',
    specialty: 'Casting Rings, Solitaires & Studs',
    location: 'Malad Industrial Estate',
    default_rate: 220,
    default_wastage: 1.0,
    active_jobs: 1,
  },
  {
    id: 'KARA-05',
    name: 'Ganesh Polish & Rhodium Works',
    phone: '9869100234',
    specialty: 'Micro-Prong Setting & Rhodium',
    location: 'Andheri West Workshop',
    default_rate: 150,
    default_wastage: 0.5,
    active_jobs: 0,
  },
];

interface AssignKaragirModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: NewOrderBookingRecord;
  onAssign: (orderId: string, assignment: KaragirAssignment) => void;
  onPrintJobCard?: (order: NewOrderBookingRecord, assignment: KaragirAssignment) => void;
}

export const AssignKaragirModal: React.FC<AssignKaragirModalProps> = ({
  isOpen,
  onClose,
  order,
  onAssign,
  onPrintJobCard,
}) => {
  if (!isOpen) return null;

  const totalRequiredNetWt = order.items.reduce((s, it) => s + (it.net_wt || 0), 0) || 10;
  const initialKaragir = DEFAULT_KARAGIRS[0];

  const [selectedKaragirId, setSelectedKaragirId] = useState<string>(
    order.karagir_assignment?.karagir_id || initialKaragir.id
  );
  const [customKaragirName, setCustomKaragirName] = useState<string>('');
  const [karagirPhone, setKaragirPhone] = useState<string>(
    order.karagir_assignment?.karagir_phone || initialKaragir.phone
  );

  const [metalType, setMetalType] = useState<string>(
    order.karagir_assignment?.issued_metal_type || '24K Pure Gold Granules (999)'
  );
  const [issuedGrossWt, setIssuedGrossWt] = useState<number>(
    order.karagir_assignment?.issued_gross_wt || roundTo(totalRequiredNetWt + 1.2, 3)
  );
  const [issuedPurity, setIssuedPurity] = useState<number>(
    order.karagir_assignment?.issued_purity || 99.9
  );
  const [makingRatePerGm, setMakingRatePerGm] = useState<number>(
    order.karagir_assignment?.karagir_rate_per_gm || initialKaragir.default_rate
  );
  const [wastagePct, setWastagePct] = useState<number>(
    order.karagir_assignment?.wastage_pct || initialKaragir.default_wastage
  );
  const [promisedDate, setPromisedDate] = useState<string>(
    order.karagir_assignment?.promised_date || order.header.delivery_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [issueDate, setIssueDate] = useState<string>(
    order.karagir_assignment?.assigned_date || new Date().toISOString().split('T')[0]
  );
  const [specialInstructions, setSpecialInstructions] = useState<string>(
    order.karagir_assignment?.special_instructions ||
      'Ensure strict 916 hallmarking. Handcrafted traditional filigree finish. Clean joint soldering.'
  );

  // Auto-calculated fields
  const issuedFineWt = roundTo((issuedGrossWt * issuedPurity) / 100, 3);
  const totalAgreedMaking = roundTo(totalRequiredNetWt * makingRatePerGm, 2);

  // When Karagir selection changes, update defaults
  const handleKaragirChange = (id: string) => {
    setSelectedKaragirId(id);
    const k = DEFAULT_KARAGIRS.find((x) => x.id === id);
    if (k) {
      setKaragirPhone(k.phone);
      setMakingRatePerGm(k.default_rate);
      setWastagePct(k.default_wastage);
    }
  };

  const handleSave = (shouldPrint = false) => {
    const karagirProfile = DEFAULT_KARAGIRS.find((k) => k.id === selectedKaragirId);
    const karagirName =
      selectedKaragirId === 'CUSTOM'
        ? customKaragirName || 'Custom Goldsmith'
        : karagirProfile?.name || 'Soni Govindbhai & Sons';

    const assignmentData: KaragirAssignment = {
      karagir_id: selectedKaragirId,
      karagir_name: karagirName,
      karagir_phone: karagirPhone,
      assigned_date: issueDate,
      promised_date: promisedDate,
      issued_metal_type: metalType,
      issued_gross_wt: issuedGrossWt,
      issued_purity: issuedPurity,
      issued_fine_wt: issuedFineWt,
      karagir_rate_per_gm: makingRatePerGm,
      agreed_making_charges: totalAgreedMaking,
      wastage_pct: wastagePct,
      special_instructions: specialInstructions,
      voucher_no: `ISS-KARA-${order.order_no.replace('ORD-', '')}`,
      status: 'Assigned',
    };

    onAssign(order.id, assignmentData);
    if (shouldPrint && onPrintJobCard) {
      onPrintJobCard(order, assignmentData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-amber-300 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/20 text-white shadow-2xs">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-wide">
                Assign Order to Karagir / Goldsmith
              </h3>
              <p className="text-[11px] text-amber-100 mt-0.5">
                Allocate workshop artisan, issue raw metal & generate Job Card.
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

        {/* Modal Body Form */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Order Summary Strip */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-blue-700 font-bold uppercase block">
                Target Customer Order:
              </span>
              <div className="font-extrabold text-blue-950 text-xs">
                {order.order_no} • {order.header.customer_n || 'Patron Order'}
              </div>
              <div className="text-[11px] text-blue-800 font-medium truncate max-w-md">
                {order.items.map((i) => i.item_name).join(', ')}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-blue-700 font-bold uppercase block">
                Required Net Metal:
              </span>
              <div className="text-sm font-black font-mono text-blue-900">
                {formatWeight(totalRequiredNetWt)} (22K)
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Due: {order.header.delivery_date}
              </div>
            </div>
          </div>

          {/* Section 1: Karagir Selection */}
          <div className="space-y-2 border-b border-slate-100 pb-3">
            <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-amber-700" />
              <span>Select Artisan / Karagir Master</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <select
                  value={selectedKaragirId}
                  onChange={(e) => handleKaragirChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  {DEFAULT_KARAGIRS.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name} ({k.specialty})
                    </option>
                  ))}
                  <option value="CUSTOM">+ Add Custom Karagir Name</option>
                </select>
              </div>

              <div>
                {selectedKaragirId === 'CUSTOM' ? (
                  <input
                    type="text"
                    value={customKaragirName}
                    onChange={(e) => setCustomKaragirName(e.target.value)}
                    placeholder="Enter Custom Karagir Name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs font-bold"
                  />
                ) : (
                  <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium text-[11px] flex justify-between items-center">
                    <span>
                      {DEFAULT_KARAGIRS.find((k) => k.id === selectedKaragirId)?.location}
                    </span>
                    <span className="font-bold text-amber-800">
                      {DEFAULT_KARAGIRS.find((k) => k.id === selectedKaragirId)?.active_jobs} Active Jobs
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-500 font-bold">Karagir Phone / WhatsApp</label>
                <input
                  type="text"
                  value={karagirPhone}
                  onChange={(e) => setKaragirPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold">Expected Workshop Delivery</label>
                <input
                  type="date"
                  value={promisedDate}
                  onChange={(e) => setPromisedDate(e.target.value)}
                  className="w-full bg-rose-50 border border-rose-300 rounded-lg px-2.5 py-1.5 text-rose-900 font-mono font-bold text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Metal Issue Allocation */}
          <div className="space-y-2 border-b border-slate-100 pb-3">
            <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-700" />
              <span>Raw Metal & Alloy Allocation</span>
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-500 font-bold">Metal Type to Issue</label>
                <select
                  value={metalType}
                  onChange={(e) => setMetalType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 text-xs"
                >
                  <option value="24K Pure Gold Granules (999)">24K Pure Gold Granules (999)</option>
                  <option value="916 Fine Gold Wire / Plate">916 Fine Gold Wire / Plate</option>
                  <option value="999 Fine Silver Granules">999 Fine Silver Granules</option>
                  <option value="92.5 Sterling Silver Ingot">92.5 Sterling Silver Ingot</option>
                  <option value="Copper/Zinc Master Alloy">Copper/Zinc Master Alloy</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold">Issued Gross Weight (g)</label>
                <input
                  type="number"
                  step={0.001}
                  value={issuedGrossWt}
                  onChange={(e) => setIssuedGrossWt(parseFloat(e.target.value) || 0)}
                  className="w-full bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1.5 text-amber-950 font-mono font-bold text-right text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold">Purity (%)</label>
                <input
                  type="number"
                  step={0.1}
                  value={issuedPurity}
                  onChange={(e) => setIssuedPurity(parseFloat(e.target.value) || 99.9)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-mono text-center text-xs"
                />
              </div>
            </div>

            {/* Calculated Fine Weight Banner */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center text-xs">
              <span className="text-amber-900 font-bold">Issued Fine Bullion:</span>
              <span className="font-mono font-black text-amber-950 text-sm">
                {formatWeight(issuedFineWt)}
              </span>
            </div>
          </div>

          {/* Section 3: Labour & Wastage Agreement */}
          <div className="space-y-2 border-b border-slate-100 pb-3">
            <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Labour Charges & Wastage Agreement</span>
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-500 font-bold">Making Rate (₹/g)</label>
                <input
                  type="number"
                  value={makingRatePerGm}
                  onChange={(e) => setMakingRatePerGm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-mono text-right text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold">Wastage Allowance (%)</label>
                <input
                  type="number"
                  step={0.1}
                  value={wastagePct}
                  onChange={(e) => setWastagePct(parseFloat(e.target.value) || 0)}
                  className="w-full bg-rose-50 border border-rose-300 rounded-lg px-2.5 py-1.5 text-rose-900 font-mono text-right text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold">Agreed Labour Amount (₹)</label>
                <div className="w-full bg-emerald-50 border border-emerald-300 rounded-lg px-2.5 py-1.5 text-emerald-950 font-mono text-right text-xs font-black">
                  {formatCurrency(totalAgreedMaking)}
                </div>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
              Workshop & Hallmark Stamping Instructions:
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              placeholder="e.g. 916 BIS Hallmark stamping mandatory, deliver by 4 PM on due date..."
            />
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

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSave(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sky-50 text-sky-800 border border-sky-300 hover:bg-sky-100 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-sky-600" />
              <span>Save & Print Job Card</span>
            </button>

            <button
              onClick={() => handleSave(false)}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Karagir Assignment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
