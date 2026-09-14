import React, { useState } from 'react';
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
  AlertCircle,
  MessageCircle,
  Image,
  Upload,
  Camera,
  ExternalLink,
  Eye
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

export const JEWELLERY_SAMPLE_PRESETS = [
  {
    name: '22K Traditional Mangalsutra',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Temple Nakas Choker Necklace',
    url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Diamond Solitaire Ring',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Royal Filigree Kada Bangle',
    url: 'https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?w=600&auto=format&fit=crop&q=80',
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
      'Strict 916 BIS Hallmark stamping. Handcrafted traditional filigree finish. Clean joint soldering.'
  );

  // Design Picture state
  const existingPhoto =
    order.karagir_assignment?.design_photo ||
    order.design_photo ||
    order.header?.design_photo ||
    order.items[0]?.image_url ||
    JEWELLERY_SAMPLE_PRESETS[0].url;

  const [designPhoto, setDesignPhoto] = useState<string>(existingPhoto);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setDesignPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const buildAssignmentData = (): KaragirAssignment => {
    const karagirProfile = DEFAULT_KARAGIRS.find((k) => k.id === selectedKaragirId);
    const karagirName =
      selectedKaragirId === 'CUSTOM'
        ? customKaragirName || 'Custom Goldsmith'
        : karagirProfile?.name || 'Soni Govindbhai & Sons';

    return {
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
      design_photo: designPhoto,
    };
  };

  const handleSave = (shouldPrint = false) => {
    const assignmentData = buildAssignmentData();
    onAssign(order.id, assignmentData);
    if (shouldPrint && onPrintJobCard) {
      onPrintJobCard(order, assignmentData);
    }
    onClose();
  };

  const handleSendWhatsAppToKaragir = () => {
    const assignmentData = buildAssignmentData();
    onAssign(order.id, assignmentData);

    const itemsSummary = order.items
      .map((it, idx) => `${idx + 1}. *${it.item_name}* (Qty: ${it.qty}, Net Wt: ${formatWeight(it.net_wt)}, Purity: ${it.purity}%)`)
      .join('\n');

    const cleanPhone = karagirPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const message = `*SWARNA JEWELLERS & WORKSHOP - ARTISAN WORK ORDER* 🔨\n` +
      `----------------------------------------\n` +
      `*Job Voucher:* ${assignmentData.voucher_no}\n` +
      `*Order Ref:* ${order.order_no}\n` +
      `*Karagir Name:* ${assignmentData.karagir_name}\n` +
      `*Customer Ref:* ${order.header.customer_n || 'Showroom Custom'}\n` +
      `----------------------------------------\n` +
      `*ORNAMENTS TO MAKE:*\n${itemsSummary}\n` +
      `*Total Net Wt:* ${formatWeight(totalRequiredNetWt)}\n` +
      `----------------------------------------\n` +
      `*RAW BULLION METAL ISSUED:*\n` +
      `• Metal Type: ${assignmentData.issued_metal_type}\n` +
      `• Issued Gross Wt: ${formatWeight(assignmentData.issued_gross_wt)}\n` +
      `• Purity: ${assignmentData.issued_purity}%\n` +
      `• Fine Metal Wt: ${formatWeight(assignmentData.issued_fine_wt)}\n` +
      `----------------------------------------\n` +
      `*MAKING & LABOUR TERMS:*\n` +
      `• Rate: ₹${assignmentData.karagir_rate_per_gm}/gm\n` +
      `• Agreed Labour: ${formatCurrency(assignmentData.agreed_making_charges)}\n` +
      `• Wastage Tolerance: ${assignmentData.wastage_pct}%\n` +
      `• *Delivery Deadline:* ${assignmentData.promised_date}\n` +
      `----------------------------------------\n` +
      `*ARTISAN INSTRUCTIONS:*\n` +
      `"${assignmentData.special_instructions || 'Strict 916 BIS Hallmark stamping mandatory.'}"\n\n` +
      (designPhoto ? `*Design Reference Photo:* Attached with this dispatch order.` : '') +
      `\n\n_Please confirm receipt of metal and delivery date schedule._`;

    const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-amber-300 rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800 flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/20 text-white shadow-2xs">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wide">
                Assign Order to Karagir / Goldsmith
              </h3>
              <p className="text-[11px] text-amber-100 mt-0.5">
                Allocate workshop artisan, issue raw metal & dispatch photo/specs to Karagir WhatsApp.
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
              <div className="font-semibold text-blue-950 text-xs">
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
              <div className="text-sm font-semibold font-mono text-blue-900">
                {formatWeight(totalRequiredNetWt)} (22K)
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Customer Promised: {order.header.delivery_date}
              </div>
            </div>
          </div>

          {/* Section 0: Ornament Design Photo & Reference */}
          <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-semibold text-amber-950 uppercase tracking-wider flex items-center space-x-1.5">
                <Image className="w-3.5 h-3.5 text-amber-700" />
                <span>Ornament Design Sample Picture for Karagir</span>
              </label>
              <span className="text-[10px] text-amber-800 font-medium">
                Sent to Karagir WhatsApp & printed on Job Card
              </span>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
              {/* Photo Thumbnail */}
              <div className="relative group w-24 h-24 rounded-xl border-2 border-amber-300 bg-white overflow-hidden shadow-2xs shrink-0 flex items-center justify-center">
                {designPhoto ? (
                  <>
                    <img
                      src={designPhoto}
                      alt="Ornament Design Sample"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPhotoPreview(true)}
                      className="absolute inset-0 bg-slate-900/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      title="Enlarge Photo"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <Image className="w-6 h-6 mx-auto mb-1 text-amber-400" />
                    <span className="text-[9px] font-bold block leading-none">No Picture</span>
                  </div>
                )}
              </div>

              {/* Upload Controls & Presets */}
              <div className="space-y-2 flex-1 min-w-[200px]">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
                  <label className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Design Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {designPhoto && (
                    <button
                      type="button"
                      onClick={() => setDesignPhoto('')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Preset suggestions */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold block">
                    Or select from design catalogue samples:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {JEWELLERY_SAMPLE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDesignPhoto(p.url)}
                        className={`text-[10px] px-2 py-0.5 rounded-md border font-medium transition-all ${
                          designPhoto === p.url
                            ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Karagir Selection & WhatsApp Phone */}
          <div className="space-y-2 border-b border-slate-100 pb-3">
            <label className="text-[11px] font-semibold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-amber-700" />
              <span>Select Artisan / Karagir Master & WhatsApp Contact</span>
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
                <label className="text-[10px] text-slate-500 font-bold flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>Karagir WhatsApp No (for Direct Dispatch)</span>
                </label>
                <input
                  type="text"
                  value={karagirPhone}
                  onChange={(e) => setKaragirPhone(e.target.value)}
                  placeholder="e.g. 9892044556"
                  className="w-full bg-emerald-50/60 border border-emerald-300 rounded-lg px-2.5 py-1.5 text-emerald-950 font-mono font-bold text-xs"
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
            <label className="text-[11px] font-semibold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-700" />
              <span>Raw Metal & Bullion Allocation</span>
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
              <span className="font-mono font-semibold text-amber-950 text-sm">
                {formatWeight(issuedFineWt)}
              </span>
            </div>
          </div>

          {/* Section 3: Labour & Wastage Agreement */}
          <div className="space-y-2 border-b border-slate-100 pb-3">
            <label className="text-[11px] font-semibold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
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
                <div className="w-full bg-emerald-50 border border-emerald-300 rounded-lg px-2.5 py-1.5 text-emerald-950 font-mono text-right text-xs font-semibold">
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
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-bold text-xs"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <button
              onClick={handleSendWhatsAppToKaragir}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer"
              title="Send full specs, metal issue & picture to Karagir WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-200" />
              <span>Send to Karagir WhatsApp</span>
            </button>

            <button
              onClick={() => handleSave(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sky-50 text-sky-800 border border-sky-300 hover:bg-sky-100 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-sky-600" />
              <span>Save & Print Job Card</span>
            </button>

            <button
              onClick={() => handleSave(false)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Assignment</span>
            </button>
          </div>
        </div>

        {/* Enlarged Photo Modal */}
        {showPhotoPreview && (
          <div className="fixed inset-0 bg-slate-900/80 z-60 flex items-center justify-center p-4">
            <div className="bg-white p-3 rounded-2xl max-w-lg w-full space-y-3 shadow-xl border border-slate-200/90">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-xs">Design Reference Preview</span>
                <button
                  onClick={() => setShowPhotoPreview(false)}
                  className="p-1 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <img
                src={designPhoto}
                alt="Enlarged Design Sample"
                className="w-full max-h-[70vh] object-contain rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
