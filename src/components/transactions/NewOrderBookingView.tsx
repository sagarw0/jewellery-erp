import React, { useState, useEffect } from 'react';
import {
  NewOrderBookingRecord,
  NewOrderHeader,
  NewOrderItem,
  NewOrderPayment,
  NewOrderTab,
  ColumnSetting,
  KaragirAssignment
} from '../../types/erp';
import {
  Save,
  Printer,
  XCircle,
  Plus,
  HelpCircle,
  MessageCircle,
  Youtube,
  Sliders,
  Calculator,
  Hammer,
  ArrowRightLeft,
  Receipt,
  FileSpreadsheet,
  Coins,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  User,
  CreditCard,
  Sparkles,
  Search,
  Filter,
  ArrowUpRight,
  FileText,
  Calendar,
  Scale,
  Download,
  AlertCircle,
  Image,
  Upload,
  Eye,
  X,
  Send
} from 'lucide-react';
import {
  calculateNetWeight,
  calculateFineWeight,
  calculateMakingAmount,
  calculateOrderItemTotal,
  calculateTaxes,
  formatCurrency,
  formatWeight,
  roundTo
} from '../../utils/calculations';
import { ColumnSettingsModal } from '../common/ColumnSettingsModal';
import { FieldHelpModal } from '../common/FieldHelpModal';
import { PrintVoucherModal } from '../common/PrintVoucherModal';
import { WhatsAppShareModal } from '../common/WhatsAppShareModal';
import { AssignKaragirModal, DEFAULT_KARAGIRS, JEWELLERY_SAMPLE_PRESETS } from '../common/AssignKaragirModal';
import { KaragirJobCardModal } from '../common/KaragirJobCardModal';
import { ReceiveKaragirModal } from '../common/ReceiveKaragirModal';

interface NewOrderBookingViewProps {
  orders: NewOrderBookingRecord[];
  onSaveOrder: (order: NewOrderBookingRecord) => void;
  onDeleteOrder: (id: string) => void;
  onClose: () => void;
  goldRate: number;
}

const DEFAULT_ORDER_COLUMNS: ColumnSetting[] = [
  { id: 'trans_type', label: 'TransType', visible: true, width: 100, order: 0 },
  { id: 'item_name', label: 'Item Name', visible: true, width: 220, order: 1 },
  { id: 'qty', label: 'QTY', visible: true, width: 60, order: 2 },
  { id: 'gross_wt', label: 'GrossWt', visible: true, width: 90, order: 3 },
  { id: 'black_beats', label: 'Black.Beats', visible: true, width: 90, order: 4 },
  { id: 'stone_wt', label: 'StoneWt', visible: true, width: 85, order: 5 },
  { id: 'net_wt', label: 'NetWt', visible: true, width: 90, order: 6 },
  { id: 'purity', label: 'Purity', visible: true, width: 75, order: 7 },
  { id: 'mkg_per_gm', label: 'Mkg/Gm', visible: true, width: 85, order: 8 },
  { id: 'mkg_amt', label: 'MkgAmt', visible: true, width: 95, order: 9 },
  { id: 'hallm_charges', label: 'HallM.Charges', visible: true, width: 95, order: 10 },
  { id: 'item_amt', label: 'Total.Amt', visible: true, width: 110, order: 11 },
];

export const NewOrderBookingView: React.FC<NewOrderBookingViewProps> = ({
  orders,
  onSaveOrder,
  onDeleteOrder,
  onClose,
  goldRate,
}) => {
  const [activeTab, setActiveTab] = useState<NewOrderTab>('new_order_booking');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders[0]?.id || null);
  const [orderColumns, setOrderColumns] = useState<ColumnSetting[]>(DEFAULT_ORDER_COLUMNS);
  const [showAdvancedKyc, setShowAdvancedKyc] = useState(false);

  // Modals
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  // Karagir Modals & State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showJobCardModal, setShowJobCardModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [modalTargetOrder, setModalTargetOrder] = useState<NewOrderBookingRecord | null>(null);
  const [activeJobAssignment, setActiveJobAssignment] = useState<KaragirAssignment | undefined>(undefined);

  // Design Photo State & Enlarged Preview
  const [designPhoto, setDesignPhoto] = useState<string>(
    orders[0]?.design_photo ||
    orders[0]?.header?.design_photo ||
    orders[0]?.items[0]?.image_url ||
    JEWELLERY_SAMPLE_PRESETS[0].url
  );
  const [enlargedPhotoUrl, setEnlargedPhotoUrl] = useState<string | null>(null);

  // Sub-tabs Filter & Search
  const [filterKaragir, setFilterKaragir] = useState<string>('all');
  const [searchOrderQuery, setSearchOrderQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Quick Issue Metal Drawer (Tab 3)
  const [showQuickIssueModal, setShowQuickIssueModal] = useState(false);
  const [quickIssueMetalType, setQuickIssueMetalType] = useState('24K Pure Gold Granules (999)');
  const [quickIssueKaragir, setQuickIssueKaragir] = useState(DEFAULT_KARAGIRS[0].name);
  const [quickIssueGrossWt, setQuickIssueGrossWt] = useState<number>(50.0);
  const [quickIssuePurity, setQuickIssuePurity] = useState<number>(99.9);

  // Header State (Spec #21)
  const [header, setHeader] = useState<NewOrderHeader>({
    customer_n: '',
    address: '',
    ph_no: '',
    remark: '',
    area: '',
    aadhar_no: '',
    pan_card: '',
    bill_type: 'Order',
    n5: 'N5',
    bill_date: new Date().toISOString().split('T')[0],
    delivery_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    manual_no: '',
    state: 'Maharashtra (27)',
    salesman: 'Sanjay Verma',
    gst_not_required: false,
    close_order: false,
    design_photo: orders[0]?.design_photo || JEWELLERY_SAMPLE_PRESETS[0].url,
  });

  // Items State (Spec #22)
  const [items, setItems] = useState<NewOrderItem[]>([
    {
      id: 'it-1',
      trans_type: 'Order',
      item_name: '22K Gold Traditional Mangalsutra',
      description: 'Floral Vati with 2-line black beads and CZ stones',
      qty: 1,
      gross_wt: 28.500,
      black_beats: 3.200,
      stone_wt: 0.800,
      stone_amt: 2500,
      net_wt: 24.500,
      purity: 91.6,
      mkg_per_gm: 450,
      mkg_amt: 11025,
      hallm_charges: 45,
      making_pct: 0,
      item_amt: 184545,
      image_url: orders[0]?.design_photo || JEWELLERY_SAMPLE_PRESETS[0].url,
    },
  ]);

  // Payment State (Spec #23)
  const [payment, setPayment] = useState<NewOrderPayment>({
    left_payment_type: 'UPI Transfer',
    left_amount: 30000,
    left_bank_name: 'HDFC Current Account',
    left_voucher_no: 'UPI-9821033',
    left_cheque_date: new Date().toISOString().split('T')[0],

    cash_received: 20000,
    cash_payment_type: 'Cash Deposit',
    cash_amount: 20000,
    cash_bank_name: 'Cash Drawer',
    cash_cheque_no: '',
    cash_cheque_date: '',

    gst_pct: 3.0,
    hgst_pct: 1.5,
    mgst_pct: 1.5,
    gst_amt: 5536.35,
    hgst_amt: 2768.18,
    mgst_amt: 2768.18,

    advance_amt: 50000,
    other_amt: 0,
    urd_bill_no: 'URD-2026-012',
    bank_amt: 30000,

    amount: 184545,
    bill_discount: 1045,
    total_discount: 1045,
    purchase_amt: 25000,
    cash_final_amount: 20000,
    balance_amount: 114000,
    manual_urd_amt: 25000,
  });

  // Load selected order
  useEffect(() => {
    if (selectedOrderId) {
      const ord = orders.find((o) => o.id === selectedOrderId);
      if (ord) {
        setHeader({ ...ord.header });
        setItems([...ord.items]);
        setPayment({ ...ord.payment });
        setDesignPhoto(
          ord.design_photo ||
          ord.header?.design_photo ||
          ord.karagir_assignment?.design_photo ||
          ord.items[0]?.image_url ||
          ''
        );
      }
    }
  }, [selectedOrderId, orders]);

  // Photo upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const photoUrl = reader.result;
          setDesignPhoto(photoUrl);
          setHeader((prev) => ({ ...prev, design_photo: photoUrl }));
          if (items.length > 0) {
            const updatedItems = [...items];
            updatedItems[0] = { ...updatedItems[0], image_url: photoUrl };
            setItems(updatedItems);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Recalculate line items
  const updateItem = (index: number, field: keyof NewOrderItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };

    // Net Wt = GrossWt - Black.Beats - StoneWt
    const net = calculateNetWeight(item.gross_wt, item.black_beats, item.stone_wt);
    item.net_wt = net;

    // Making Amt
    const mkg = calculateMakingAmount(item.net_wt, item.mkg_per_gm, goldRate, item.making_pct);
    item.mkg_amt = mkg;

    // Line amount
    item.item_amt = calculateOrderItemTotal(
      item.net_wt,
      goldRate,
      item.stone_amt,
      item.mkg_amt,
      item.hallm_charges
    );

    updated[index] = item;
    setItems(updated);
  };

  const addItemRow = () => {
    const newItem: NewOrderItem = {
      id: `it-${Date.now()}`,
      trans_type: 'Order',
      item_name: '22K Gold Custom Ornament',
      description: '',
      qty: 1,
      gross_wt: 10.000,
      black_beats: 0,
      stone_wt: 0,
      stone_amt: 0,
      net_wt: 10.000,
      purity: 91.6,
      mkg_per_gm: 400,
      mkg_amt: 4000,
      hallm_charges: 45,
      making_pct: 0,
      item_amt: calculateOrderItemTotal(10.0, goldRate, 0, 4000, 45),
      image_url: designPhoto,
    };
    setItems([...items, newItem]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Recalculate totals automatically
  useEffect(() => {
    const totalItemAmt = items.reduce((sum, it) => sum + (it.item_amt || 0), 0);
    const taxes = calculateTaxes(totalItemAmt, header.gst_not_required, payment.gst_pct);

    const totalDisc = payment.bill_discount || 0;
    const effectiveAdvances = (payment.advance_amt || 0) + (payment.purchase_amt || 0);
    const netBill = totalItemAmt + taxes.gstAmt + (payment.other_amt || 0) - totalDisc;
    const balance = Math.max(0, roundTo(netBill - effectiveAdvances, 2));

    setPayment((prev) => ({
      ...prev,
      amount: roundTo(totalItemAmt, 2),
      gst_amt: taxes.gstAmt,
      hgst_amt: taxes.hgstAmt,
      mgst_amt: taxes.mgstAmt,
      total_discount: totalDisc,
      balance_amount: balance,
    }));
  }, [items, header.gst_not_required, payment.bill_discount, payment.advance_amt, payment.purchase_amt, payment.other_amt]);

  const handleSave = () => {
    if (!header.customer_n.trim()) {
      alert('Please enter Customer Name');
      return;
    }
    const updatedItems = items.map((it, idx) =>
      idx === 0 && !it.image_url && designPhoto ? { ...it, image_url: designPhoto } : it
    );
    const updatedHeader = {
      ...header,
      design_photo: designPhoto || header.design_photo,
    };

    const existingOrd = selectedOrderId ? orders.find((o) => o.id === selectedOrderId) : null;
    const orderRecord: NewOrderBookingRecord = {
      id: selectedOrderId || `ord-${Date.now()}`,
      order_no: selectedOrderId
        ? existingOrd?.order_no || `ORD-${Date.now()}`
        : `ORD-2026-${String(orders.length + 1).padStart(3, '0')}`,
      header: updatedHeader,
      items: updatedItems,
      payment,
      status: existingOrd?.status || 'Booked',
      assigned_karagir: existingOrd?.assigned_karagir,
      karagir_issue_date: existingOrd?.karagir_issue_date,
      karagir_delivery_date: existingOrd?.karagir_delivery_date,
      karagir_assignment: existingOrd?.karagir_assignment
        ? {
            ...existingOrd.karagir_assignment,
            design_photo: designPhoto || existingOrd.karagir_assignment.design_photo,
          }
        : undefined,
      design_photo: designPhoto || undefined,
      created_at: existingOrd?.created_at || new Date().toISOString(),
    };
    onSaveOrder(orderRecord);
    setSelectedOrderId(orderRecord.id);
    alert(`Order ${orderRecord.order_no} booked successfully!`);
  };

  const handleNewOrder = () => {
    setSelectedOrderId(null);
    setDesignPhoto('');
    setHeader({
      customer_n: '',
      address: '',
      ph_no: '',
      remark: '',
      area: '',
      aadhar_no: '',
      pan_card: '',
      bill_type: 'Order',
      n5: 'N5',
      bill_date: new Date().toISOString().split('T')[0],
      delivery_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      manual_no: '',
      state: 'Maharashtra (27)',
      salesman: 'Sanjay Verma',
      gst_not_required: false,
      close_order: false,
      design_photo: '',
    });
    setItems([
      {
        id: `it-${Date.now()}`,
        trans_type: 'Order',
        item_name: '',
        description: '',
        qty: 1,
        gross_wt: 0,
        black_beats: 0,
        stone_wt: 0,
        stone_amt: 0,
        net_wt: 0,
        purity: 91.6,
        mkg_per_gm: 400,
        mkg_amt: 0,
        hallm_charges: 45,
        making_pct: 0,
        item_amt: 0,
        image_url: '',
      },
    ]);
  };

  const currentSelectedOrder = selectedOrderId ? orders.find((o) => o.id === selectedOrderId) : null;

  const handleOpenAssign = (order?: NewOrderBookingRecord | null) => {
    if (order) {
      const enrichedOrder = {
        ...order,
        design_photo: order.design_photo || order.header?.design_photo || designPhoto,
      };
      setModalTargetOrder(enrichedOrder);
      setShowAssignModal(true);
    } else {
      const activeRecord: NewOrderBookingRecord = {
        id: selectedOrderId || `ord-${Date.now()}`,
        order_no: selectedOrderId
          ? orders.find((o) => o.id === selectedOrderId)?.order_no || `ORD-${Date.now()}`
          : `ORD-2026-${String(orders.length + 1).padStart(3, '0')}`,
        header: { ...header, design_photo: designPhoto || header.design_photo },
        items,
        payment,
        design_photo: designPhoto,
        status: 'Booked',
        created_at: new Date().toISOString(),
      };
      setModalTargetOrder(activeRecord);
      setShowAssignModal(true);
    }
  };

  const handleAssignKaragir = (orderId: string, assignment: KaragirAssignment) => {
    const existingOrder = orders.find((o) => o.id === orderId);
    const photo = assignment.design_photo || designPhoto || existingOrder?.design_photo;
    const updatedOrder: NewOrderBookingRecord = existingOrder
      ? {
          ...existingOrder,
          assigned_karagir: assignment.karagir_name,
          karagir_issue_date: assignment.assigned_date,
          karagir_delivery_date: assignment.promised_date,
          karagir_assignment: assignment,
          design_photo: photo,
          status: 'In Workshop',
        }
      : {
          id: orderId,
          order_no: `ORD-2026-${String(orders.length + 1).padStart(3, '0')}`,
          header: { ...header, design_photo: photo },
          items,
          payment,
          assigned_karagir: assignment.karagir_name,
          karagir_issue_date: assignment.assigned_date,
          karagir_delivery_date: assignment.promised_date,
          karagir_assignment: assignment,
          design_photo: photo,
          status: 'In Workshop',
          created_at: new Date().toISOString(),
        };

    onSaveOrder(updatedOrder);
    setSelectedOrderId(updatedOrder.id);
    if (photo) setDesignPhoto(photo);
  };

  const handleOpenJobCard = (order: NewOrderBookingRecord, assignment?: KaragirAssignment) => {
    setModalTargetOrder(order);
    setActiveJobAssignment(assignment || order.karagir_assignment);
    setShowJobCardModal(true);
  };

  const handleOpenReceive = (order: NewOrderBookingRecord) => {
    setModalTargetOrder(order);
    setShowReceiveModal(true);
  };

  const handleReceiveFromKaragir = (
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
  ) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const updated: NewOrderBookingRecord = {
      ...target,
      status: 'Received (Ready for Delivery)',
      karagir_assignment: target.karagir_assignment
        ? {
            ...target.karagir_assignment,
            status: 'Received',
            received_gross_wt: receivedData.received_gross_wt,
            received_net_wt: receivedData.received_net_wt,
            return_scrap_wt: receivedData.return_scrap_wt,
            received_date: receivedData.received_date,
          }
        : undefined,
    };
    onSaveOrder(updated);
    alert(`Order ${target.order_no} received from Karagir and marked ready for hallmark/delivery!`);
  };

  // Direct 1-Click WhatsApp Dispatch to Karagir from Tab 2 Table
  const handleSendWhatsAppToKaragirFromTable = (ord: NewOrderBookingRecord) => {
    const asg = ord.karagir_assignment;
    const targetKaragirName = ord.assigned_karagir || asg?.karagir_name;
    const matchedProfile = DEFAULT_KARAGIRS.find((k) => k.name === targetKaragirName);
    const phone = asg?.karagir_phone || matchedProfile?.phone || '9892044556';

    const cleanPhone = phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const photo = ord.design_photo || ord.header.design_photo || asg?.design_photo || ord.items[0]?.image_url;
    const totalNet = ord.items.reduce((s, i) => s + (i.net_wt || 0), 0);
    const itemsSummary = ord.items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.item_name}* (Qty: ${it.qty}, Net Wt: ${formatWeight(it.net_wt)}, Purity: ${it.purity}%)`
      )
      .join('\n');

    const message =
      `*SWARNA JEWELLERS & WORKSHOP - ARTISAN WORK ORDER* 🔨\n` +
      `----------------------------------------\n` +
      `*Job Voucher:* ${asg?.voucher_no || `ISS-KARA-${ord.order_no.replace('ORD-', '')}`}\n` +
      `*Order Ref:* ${ord.order_no}\n` +
      `*Karagir Name:* ${targetKaragirName || 'Artisan Workshop'}\n` +
      `*Customer Ref:* ${ord.header.customer_n || 'Showroom Custom'}\n` +
      `----------------------------------------\n` +
      `*ORNAMENTS TO MAKE:*\n${itemsSummary}\n` +
      `*Total Net Wt:* ${formatWeight(totalNet)}\n` +
      `----------------------------------------\n` +
      `*RAW BULLION METAL ISSUED:*\n` +
      `• Metal: ${asg?.issued_metal_type || '24K Pure Gold Granules (999)'}\n` +
      `• Issued Gross Wt: ${formatWeight(asg?.issued_gross_wt || totalNet + 1.2)}\n` +
      `• Purity: ${asg?.issued_purity || 99.9}%\n` +
      `• Fine Metal Wt: ${formatWeight(asg?.issued_fine_wt || (totalNet + 1.2) * 0.999)}\n` +
      `----------------------------------------\n` +
      `*MAKING & LABOUR TERMS:*\n` +
      `• Labour Rate: ₹${asg?.karagir_rate_per_gm || 380}/gm\n` +
      `• Agreed Labour: ${formatCurrency(asg?.agreed_making_charges || totalNet * 380)}\n` +
      `• Wastage Tolerance: ${asg?.wastage_pct || 1.5}%\n` +
      `• *Delivery Deadline:* ${ord.karagir_delivery_date || ord.header.delivery_date}\n` +
      `----------------------------------------\n` +
      `*ARTISAN INSTRUCTIONS:*\n` +
      `"${asg?.special_instructions || 'Strict 916 BIS Hallmark stamping mandatory. Clean joint soldering.'}"\n\n` +
      (photo ? `*Design Reference Photo:* Attached with this dispatch order.` : '') +
      `\n\n_Please confirm receipt of metal and delivery schedule._`;

    const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const tabs: { id: NewOrderTab; label: string }[] = [
    { id: 'new_order_booking', label: '1. New Order Booking' },
    { id: 'submit_order_to_karagir', label: '2. Submit to Karagir' },
    { id: 'issue_material_to_karagir', label: '3. Issue Material' },
    { id: 'receive_order_from_karagir', label: '4. Receive from Karagir' },
    { id: 'new_order_sales_invoice', label: '5. Sales Invoice' },
    { id: 'new_order_report', label: '6. Order Report' },
    { id: 'advance', label: '7. Advance Ledger' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Action Toolbar */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-800">New Order Booking</h1>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold border border-blue-200">
                {selectedOrderId ? orders.find((o) => o.id === selectedOrderId)?.order_no : 'NEW BOOKING'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Simplified & sorted order flow. All 45+ fields preserved and accessible.
            </p>
          </div>
        </div>

        {/* Action Buttons & Karagir Status */}
        <div className="flex items-center space-x-1.5 flex-wrap">
          {/* Karagir Assignment Action */}
          <button
            onClick={() => handleOpenAssign(currentSelectedOrder)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            title="Assign Order to Karagir / Goldsmith (Alt+K)"
          >
            <Hammer className="w-3.5 h-3.5 text-amber-200" />
            <span>Assign Karagir (Alt+K)</span>
          </button>

          {/* Assigned Karagir Badge */}
          {currentSelectedOrder?.assigned_karagir && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
              <span>🔨 {currentSelectedOrder.assigned_karagir}</span>
              <button
                onClick={() => handleOpenJobCard(currentSelectedOrder)}
                className="text-amber-700 underline hover:text-amber-950 text-[10px]"
                title="Print Karagir Job Card"
              >
                (Job Card)
              </button>
              {currentSelectedOrder.status !== 'Received (Ready for Delivery)' && (
                <button
                  onClick={() => handleOpenReceive(currentSelectedOrder)}
                  className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[10px] hover:bg-emerald-700 ml-1 font-bold"
                  title="Receive from Karagir"
                >
                  Receive
                </button>
              )}
            </div>
          )}

          <button
            onClick={handleNewOrder}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>New (Alt+N)</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Order (Alt+S)</span>
          </button>

          <button
            onClick={() => setShowPrint(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold border border-sky-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-sky-600" />
            <span>Print Slip</span>
          </button>

          <button
            onClick={() => setShowWhatsApp(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => setShowColumnSettings(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold border border-slate-200"
            title="Gridsetting (GS)"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>GS</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 text-xs font-bold"
            title="Field Dictionary (H)"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>H</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7 Workflow Sub-Tabs */}
      <div className="flex border-b border-sky-200 bg-white rounded-t-xl px-2 pt-2 space-x-1 overflow-x-auto scrollbar-none shadow-2xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-t-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-50/80 text-blue-700 border-b-2 border-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Booking Form Layout */}
      {activeTab === 'new_order_booking' && (
        <div className="space-y-4">
          {/* SECTION 1: SORTED CUSTOMER & ORDER DETAILS */}
          <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>1. Customer & Order Details (Primary Fields)</span>
              </span>

              <div className="flex items-center space-x-4 text-xs font-semibold">
                <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={header.gst_not_required}
                    onChange={(e) => setHeader({ ...header, gst_not_required: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>GST Not Required</span>
                </label>

                <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={header.close_order}
                    onChange={(e) => setHeader({ ...header, close_order: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Close Order</span>
                </label>
              </div>
            </div>

            {/* Core Primary Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Customer N (Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={header.customer_n}
                  onChange={(e) => setHeader({ ...header, customer_n: e.target.value })}
                  placeholder="e.g. Pooja Mehta"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Ph.No (Mobile) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={header.ph_no}
                  onChange={(e) => setHeader({ ...header, ph_no: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Area / Locality</label>
                <input
                  type="text"
                  value={header.area}
                  onChange={(e) => setHeader({ ...header, area: e.target.value })}
                  placeholder="e.g. Vile Parle"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-blue-700 mb-1">Delivery Promised Date</label>
                <input
                  type="date"
                  value={header.delivery_date}
                  onChange={(e) => setHeader({ ...header, delivery_date: e.target.value })}
                  className="w-full px-2 py-1.5 bg-sky-50 border border-sky-300 rounded-lg text-blue-900 font-mono font-bold focus:border-blue-500 focus:outline-none text-[11px]"
                />
              </div>
            </div>

            {/* Collapsible Accordion for Advanced & Legacy Fields (Spec #21 & #38) */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAdvancedKyc(!showAdvancedKyc)}
                className="flex items-center space-x-1 text-xs text-blue-600 font-bold hover:text-blue-800 focus:outline-none cursor-pointer"
              >
                {showAdvancedKyc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>
                  {showAdvancedKyc ? 'Hide Secondary Details' : 'Show More Details (N5, Address, Aadhar, PAN, Manual No, State, Salesman, Remark)'}
                </span>
              </button>

              {showAdvancedKyc && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs mt-3 pt-3 border-t border-dashed border-sky-100 bg-sky-50/40 p-3 rounded-lg animate-in fade-in duration-150">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Address</label>
                    <input
                      type="text"
                      value={header.address}
                      onChange={(e) => setHeader({ ...header, address: e.target.value })}
                      placeholder="Dispatch address"
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Aadhar No</label>
                    <input
                      type="text"
                      value={header.aadhar_no}
                      onChange={(e) => setHeader({ ...header, aadhar_no: e.target.value })}
                      placeholder="Govt KYC"
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Pan Card</label>
                    <input
                      type="text"
                      value={header.pan_card}
                      onChange={(e) => setHeader({ ...header, pan_card: e.target.value.toUpperCase() })}
                      placeholder="PAN"
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono text-xs uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-amber-700 mb-1">N5 (Legacy Code)</label>
                    <input
                      type="text"
                      value={header.n5}
                      onChange={(e) => setHeader({ ...header, n5: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-amber-300 rounded text-amber-900 font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Manual No</label>
                    <input
                      type="text"
                      value={header.manual_no}
                      onChange={(e) => setHeader({ ...header, manual_no: e.target.value })}
                      placeholder="Pad ref"
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Bill Date</label>
                    <input
                      type="date"
                      value={header.bill_date}
                      onChange={(e) => setHeader({ ...header, bill_date: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">State</label>
                    <input
                      type="text"
                      value={header.state}
                      onChange={(e) => setHeader({ ...header, state: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Salesman</label>
                    <input
                      type="text"
                      value={header.salesman}
                      onChange={(e) => setHeader({ ...header, salesman: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs"
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Remark</label>
                    <input
                      type="text"
                      value={header.remark}
                      onChange={(e) => setHeader({ ...header, remark: e.target.value })}
                      placeholder="Customer special notes"
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 1.5: ORNAMENT DESIGN SAMPLE & PHOTO UPLOAD */}
          <div className="bg-white border border-amber-300/90 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center space-x-1.5">
                <Image className="w-4 h-4 text-amber-600" />
                <span>Customer Design Sample & Photo Upload (Auto-Sent to Karagir WhatsApp)</span>
              </span>
              <span className="text-[11px] text-amber-800 font-medium">
                Embedded on Job Card Slip & Dispatched directly to Karagir WhatsApp
              </span>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
              {/* Photo Thumbnail with Enlarge capability */}
              <div className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-2 border-amber-300 bg-amber-50/50 overflow-hidden shadow-2xs shrink-0 flex items-center justify-center">
                {designPhoto ? (
                  <>
                    <img
                      src={designPhoto}
                      alt="Customer Ornament Sample"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setEnlargedPhotoUrl(designPhoto)}
                      className="absolute inset-0 bg-slate-900/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      title="Enlarge Photo"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <Image className="w-7 h-7 mx-auto mb-1 text-amber-400" />
                    <span className="text-[10px] font-bold block leading-tight text-amber-800/70">No Picture Attached</span>
                  </div>
                )}
              </div>

              {/* Actions: Upload, Presets, Clear */}
              <div className="space-y-2.5 flex-1 min-w-[240px]">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
                  <label className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-2xs transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Customer Photo / Sketch</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {designPhoto && (
                    <>
                      <button
                        type="button"
                        onClick={() => setEnlargedPhotoUrl(designPhoto)}
                        className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-600" />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDesignPhoto('');
                          setHeader((prev) => ({ ...prev, design_photo: '' }));
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>

                {/* Preset Catalogue Samples */}
                <div className="space-y-1">
                  <span className="text-[10.5px] text-slate-500 font-bold block">
                    Or pick from Design Catalogue Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {JEWELLERY_SAMPLE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setDesignPhoto(p.url);
                          setHeader((prev) => ({ ...prev, design_photo: p.url }));
                          if (items.length > 0) {
                            const updatedItems = [...items];
                            updatedItems[0] = { ...updatedItems[0], image_url: p.url };
                            setItems(updatedItems);
                          }
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-md border font-medium transition-all cursor-pointer ${
                          designPhoto === p.url
                            ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
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

          {/* SECTION 2: SORTED ORDER ITEM GRID (Spec #22) */}
          <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Calculator className="w-3.5 h-3.5 text-blue-600" />
                <span>2. Order Items & Automatic Weight Calculations (Spec #22)</span>
              </span>
              <button
                onClick={addItemRow}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item Line</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 select-none">
                  <tr>
                    <th className="p-2 border-r border-slate-200 w-10 text-center">#</th>
                    <th className="p-2 border-r border-slate-200 min-w-[100px]">TransType</th>
                    <th className="p-2 border-r border-slate-200 min-w-[200px]">Item Name</th>
                    <th className="p-2 border-r border-slate-200 w-16 text-center">QTY</th>
                    <th className="p-2 border-r border-slate-200 w-24 text-right font-bold">GrossWt</th>
                    <th className="p-2 border-r border-slate-200 w-24 text-right text-amber-800">Black.Beats</th>
                    <th className="p-2 border-r border-slate-200 w-20 text-right">StoneWt</th>
                    <th className="p-2 border-r border-slate-200 w-24 text-right font-bold text-blue-800 bg-sky-50">NetWt</th>
                    <th className="p-2 border-r border-slate-200 w-20 text-center">Purity</th>
                    <th className="p-2 border-r border-slate-200 w-20 text-right">Mkg/Gm</th>
                    <th className="p-2 border-r border-slate-200 w-24 text-right">Hallmark</th>
                    <th className="p-2 border-r border-slate-200 w-28 text-right font-bold text-emerald-700 bg-emerald-50/50">Total.Amt</th>
                    <th className="p-2 w-10 text-center">✕</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
                  {items.map((it, idx) => (
                    <tr key={it.id} className="hover:bg-sky-50/30">
                      <td className="p-2 border-r border-slate-200 text-center text-slate-400">{idx + 1}</td>
                      <td className="p-1.5 border-r border-slate-200">
                        <select
                          value={it.trans_type}
                          onChange={(e) => updateItem(idx, 'trans_type', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 text-slate-800 text-xs"
                        >
                          <option value="Order">Order</option>
                          <option value="Repair">Repair</option>
                          <option value="Jobwork">Jobwork</option>
                        </select>
                      </td>
                      <td className="p-1.5 border-r border-slate-200 font-sans">
                        <input
                          type="text"
                          value={it.item_name}
                          onChange={(e) => updateItem(idx, 'item_name', e.target.value)}
                          placeholder="e.g. 22K Traditional Mangalsutra"
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 font-medium text-xs"
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
                      <td className="p-1.5 border-r border-slate-200">
                        <input
                          type="number"
                          step={0.001}
                          value={it.black_beats}
                          onChange={(e) => updateItem(idx, 'black_beats', parseFloat(e.target.value) || 0)}
                          className="w-full bg-amber-50/60 border border-amber-300 rounded px-1.5 py-1 text-right text-amber-900 text-xs font-semibold"
                        />
                      </td>
                      <td className="p-1.5 border-r border-slate-200">
                        <input
                          type="number"
                          step={0.001}
                          value={it.stone_wt}
                          onChange={(e) => updateItem(idx, 'stone_wt', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 text-right text-slate-700 text-xs"
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
                          value={it.mkg_per_gm}
                          onChange={(e) => updateItem(idx, 'mkg_per_gm', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 text-right text-slate-800 text-xs"
                        />
                      </td>
                      <td className="p-1.5 border-r border-slate-200">
                        <input
                          type="number"
                          value={it.hallm_charges}
                          onChange={(e) => updateItem(idx, 'hallm_charges', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-1 py-1 text-right text-slate-700 text-xs"
                        />
                      </td>
                      <td className="p-2 border-r border-slate-200 text-right font-bold text-emerald-800 bg-emerald-50/50">
                        ₹{Math.round(it.item_amt).toLocaleString('en-IN')}
                      </td>
                      <td className="p-1 text-center">
                        <button
                          onClick={() => removeItemRow(idx)}
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

          {/* SECTION 3: SORTED SETTLEMENT & BILLING SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Advance Deposit & Old Gold Trade */}
            <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3 text-xs">
              <span className="font-bold text-blue-900 uppercase tracking-wider block border-b border-slate-100 pb-1.5 flex items-center space-x-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Advance & Old Gold (URD)</span>
              </span>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-600">Advance Deposit (₹)</label>
                  <input
                    type="number"
                    value={payment.advance_amt}
                    onChange={(e) => setPayment({ ...payment, advance_amt: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 font-mono font-bold text-right"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-amber-800">Old Gold Trade-In / URD (₹)</label>
                  <input
                    type="number"
                    value={payment.purchase_amt}
                    onChange={(e) => setPayment({ ...payment, purchase_amt: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 font-mono font-bold text-right"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">Mode</label>
                    <input
                      type="text"
                      value={payment.left_payment_type}
                      onChange={(e) => setPayment({ ...payment, left_payment_type: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Bank / Ref</label>
                    <input
                      type="text"
                      value={payment.left_bank_name}
                      onChange={(e) => setPayment({ ...payment, left_bank_name: e.target.value })}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tax & Discount Breakdown */}
            <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3 text-xs">
              <span className="font-bold text-blue-900 uppercase tracking-wider block border-b border-slate-100 pb-1.5">
                Taxes & Concessions
              </span>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Gross Metal & Labour:</span>
                  <span className="font-mono font-semibold text-slate-900">{formatCurrency(payment.amount)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>GST 3% (1.5% CGST + 1.5% SGST):</span>
                  <span className="font-mono font-semibold text-slate-900">{formatCurrency(payment.gst_amt)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Bill Discount (₹):</span>
                  <input
                    type="number"
                    value={payment.bill_discount}
                    onChange={(e) => setPayment({ ...payment, bill_discount: parseFloat(e.target.value) || 0 })}
                    className="w-24 px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono text-right text-emerald-700 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Final Balance Due Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border-2 border-amber-300 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                  Remaining Balance Payable
                </span>
                <p className="text-xs text-amber-800/80">
                  Amount due from customer upon pickup & hallmark delivery.
                </p>
              </div>

              <div>
                <div className="text-2xl font-mono font-extrabold text-amber-900">
                  {formatCurrency(payment.balance_amount)}
                </div>
                <div className="text-[11px] text-amber-800 mt-1 flex items-center space-x-1 font-mono">
                  <span>Total Bill: {formatCurrency(payment.amount + payment.gst_amt - payment.bill_discount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBMIT ORDER TO KARAGIR */}
      {activeTab === 'submit_order_to_karagir' && (
        <div className="bg-white border border-sky-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-tight block">
                Total Orders Booked
              </span>
              <div className="text-xl font-black font-mono text-slate-900 mt-1">{orders.length} Orders</div>
              <span className="text-[10px] text-slate-400">All customer bookings</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10.5px] font-bold text-amber-800 uppercase tracking-tight block">
                Assigned to Karagirs
              </span>
              <div className="text-xl font-black font-mono text-amber-950 mt-1">
                {orders.filter((o) => o.assigned_karagir || o.karagir_assignment).length} Orders
              </div>
              <span className="text-[10px] text-amber-700">Allocated to workshops</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10.5px] font-bold text-blue-800 uppercase tracking-tight block">
                Active in Workshop
              </span>
              <div className="text-xl font-black font-mono text-blue-950 mt-1">
                {orders.filter((o) => o.status === 'In Workshop' || (o.assigned_karagir && o.status !== 'Received (Ready for Delivery)')).length} Orders
              </div>
              <span className="text-[10px] text-blue-700">Currently in manufacturing</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10.5px] font-bold text-emerald-800 uppercase tracking-tight block">
                Received / Ready
              </span>
              <div className="text-xl font-black font-mono text-emerald-950 mt-1">
                {orders.filter((o) => o.status === 'Received (Ready for Delivery)' || o.karagir_assignment?.status === 'Received').length} Orders
              </div>
              <span className="text-[10px] text-emerald-700">Ready for hallmarking/pickup</span>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search order no, customer name, ornament..."
                  value={searchOrderQuery}
                  onChange={(e) => setSearchOrderQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <select
                value={filterKaragir}
                onChange={(e) => setFilterKaragir(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold"
              >
                <option value="all">All Karagirs</option>
                {DEFAULT_KARAGIRS.map((k) => (
                  <option key={k.id} value={k.name}>
                    {k.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleOpenAssign(currentSelectedOrder || orders[0])}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Hammer className="w-3.5 h-3.5 text-amber-200" />
              <span>+ Assign Selected Order to Karagir</span>
            </button>
          </div>

          {/* Dispatch Register Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-2.5 border-r border-slate-200 w-10 text-center">#</th>
                  <th className="p-2.5 border-r border-slate-200 w-14 text-center">Design</th>
                  <th className="p-2.5 border-r border-slate-200 w-28">Order No</th>
                  <th className="p-2.5 border-r border-slate-200">Customer & Ornament</th>
                  <th className="p-2.5 border-r border-slate-200 text-right w-24">Target Wt</th>
                  <th className="p-2.5 border-r border-slate-200 w-44">Assigned Karagir</th>
                  <th className="p-2.5 border-r border-slate-200 text-right w-24">Issued Metal</th>
                  <th className="p-2.5 border-r border-slate-200 w-28">Workshop Due</th>
                  <th className="p-2.5 border-r border-slate-200 text-center w-28">Status</th>
                  <th className="p-2.5 text-center min-w-[220px]">Workshop Actions & Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white font-sans text-xs">
                {orders
                  .filter((ord) => {
                    const matchSearch =
                      !searchOrderQuery ||
                      ord.order_no.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
                      ord.header.customer_n.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
                      ord.items.some((i) => i.item_name.toLowerCase().includes(searchOrderQuery.toLowerCase()));
                    const matchKaragir =
                      filterKaragir === 'all' ||
                      ord.assigned_karagir === filterKaragir ||
                      ord.karagir_assignment?.karagir_name === filterKaragir;
                    return matchSearch && matchKaragir;
                  })
                  .map((ord, idx) => {
                    const isAssigned = !!(ord.assigned_karagir || ord.karagir_assignment);
                    const totalNet = ord.items.reduce((s, i) => s + (i.net_wt || 0), 0);
                    const issuedWt = ord.karagir_assignment?.issued_gross_wt || (isAssigned ? totalNet + 1.2 : 0);
                    const karagirName = ord.assigned_karagir || ord.karagir_assignment?.karagir_name;
                    const isReceived = ord.status === 'Received (Ready for Delivery)' || ord.karagir_assignment?.status === 'Received';
                    const itemPhoto = ord.design_photo || ord.header.design_photo || ord.karagir_assignment?.design_photo || ord.items[0]?.image_url;

                    return (
                      <tr key={ord.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="p-2.5 border-r border-slate-200 text-center font-mono text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="p-1.5 border-r border-slate-200 text-center">
                          {itemPhoto ? (
                            <button
                              type="button"
                              onClick={() => setEnlargedPhotoUrl(itemPhoto)}
                              className="w-10 h-10 rounded-lg overflow-hidden border border-amber-300 mx-auto hover:opacity-80 transition-opacity flex items-center justify-center bg-white shadow-2xs group cursor-pointer"
                              title="Click to Enlarge Photo"
                            >
                              <img
                                src={itemPhoto}
                                alt="Design Thumbnail"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </button>
                          ) : (
                            <div className="w-10 h-10 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                              <Image className="w-4 h-4" />
                            </div>
                          )}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 font-mono font-bold text-blue-900">
                          {ord.order_no}
                        </td>
                        <td className="p-2.5 border-r border-slate-200">
                          <div className="font-bold text-slate-900">{ord.header.customer_n || 'Patron Order'}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">
                            {ord.items.map((i) => i.item_name).join(', ')}
                          </div>
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-right font-mono font-bold text-slate-800">
                          {formatWeight(totalNet)}
                        </td>
                        <td className="p-2.5 border-r border-slate-200">
                          {isAssigned ? (
                            <div>
                              <div className="font-bold text-amber-950 flex items-center space-x-1">
                                <span>🔨 {karagirName}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Vch: {ord.karagir_assignment?.voucher_no || 'ISS-KARA-01'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Not Assigned</span>
                          )}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-right font-mono font-bold text-amber-900">
                          {issuedWt > 0 ? formatWeight(issuedWt) : '—'}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 font-mono text-[11px] text-slate-700">
                          {ord.karagir_delivery_date || ord.header.delivery_date}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isReceived
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : isAssigned
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {isReceived ? 'Received' : isAssigned ? 'In Workshop' : 'Pending Assign'}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          <div className="flex items-center justify-center space-x-1.5 flex-wrap gap-y-1">
                            {!isAssigned ? (
                              <button
                                onClick={() => handleOpenAssign(ord)}
                                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold text-xs flex items-center space-x-1 shadow-2xs cursor-pointer"
                              >
                                <Hammer className="w-3.5 h-3.5 text-amber-200" />
                                <span>Assign Karagir</span>
                              </button>
                            ) : (
                              <>
                                {/* WhatsApp to Karagir Button */}
                                <button
                                  onClick={() => handleSendWhatsAppToKaragirFromTable(ord)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center space-x-1 shadow-2xs cursor-pointer transition-colors"
                                  title="Send Specs & Photo directly to Karagir WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
                                  <span>WhatsApp Karagir</span>
                                </button>

                                <button
                                  onClick={() => handleOpenJobCard(ord)}
                                  className="px-2 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-300 hover:bg-sky-100 font-bold text-[10px] flex items-center space-x-1 cursor-pointer"
                                  title="Print Workshop Job Card"
                                >
                                  <Printer className="w-3 h-3 text-sky-600" />
                                  <span>Job Card</span>
                                </button>

                                <button
                                  onClick={() => handleOpenAssign(ord)}
                                  className="px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 font-bold text-[10px] flex items-center space-x-1 cursor-pointer"
                                  title="Edit Assignment / Issue More Metal"
                                >
                                  <Hammer className="w-3 h-3 text-amber-600" />
                                  <span>Edit</span>
                                </button>

                                {!isReceived && (
                                  <button
                                    onClick={() => handleOpenReceive(ord)}
                                    className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center space-x-1 shadow-2xs cursor-pointer"
                                    title="Receive Finished Ornament"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Receive</span>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ISSUE MATERIAL TO KARAGIR */}
      {activeTab === 'issue_material_to_karagir' && (
        <div className="bg-white border border-sky-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3 gap-2">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>Workshop Bullion & Raw Material Issue Ledger</span>
              </h2>
              <p className="text-xs text-slate-500">
                Track pure gold granules, 916 wire, silver ingots, and running metal balances with Karagirs.
              </p>
            </div>

            <button
              onClick={() => handleOpenAssign(currentSelectedOrder || orders[0])}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Material for Order</span>
            </button>
          </div>

          {/* 3 Bullion Pool Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 flex justify-between items-center shadow-2xs">
              <div>
                <span className="text-[10px] font-bold text-amber-900 uppercase block">
                  24K Fine Gold Issued to Karagirs
                </span>
                <div className="text-xl font-black font-mono text-amber-950 mt-1">185.450 g</div>
                <span className="text-[10px] text-amber-700 font-medium">99.9% Pure Granules</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500 text-white">
                <Coins className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-yellow-50/80 border border-yellow-300 flex justify-between items-center shadow-2xs">
              <div>
                <span className="text-[10px] font-bold text-yellow-900 uppercase block">
                  916 Alloyed Wire in Workshop
                </span>
                <div className="text-xl font-black font-mono text-yellow-950 mt-1">94.200 g</div>
                <span className="text-[10px] text-yellow-800 font-medium">22K Standard Wire / Plate</span>
              </div>
              <div className="p-2.5 rounded-xl bg-yellow-600 text-white">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 flex justify-between items-center shadow-2xs">
              <div>
                <span className="text-[10px] font-bold text-slate-700 uppercase block">
                  Fine Silver Issued to Karagirs
                </span>
                <div className="text-xl font-black font-mono text-slate-900 mt-1">1,640.000 g</div>
                <span className="text-[10px] text-slate-500 font-medium">99.9% / 92.5% Silver Stock</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-600 text-white">
                <Scale className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Metal Issue Vouchers Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Recent Workshop Material Issue Vouchers
            </span>

            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200 w-28">Voucher No</th>
                    <th className="p-2.5 border-r border-slate-200 w-24">Date</th>
                    <th className="p-2.5 border-r border-slate-200">Karagir Name</th>
                    <th className="p-2.5 border-r border-slate-200">Metal Type</th>
                    <th className="p-2.5 border-r border-slate-200 text-right w-28">Gross Wt (g)</th>
                    <th className="p-2.5 border-r border-slate-200 text-center w-20">Purity</th>
                    <th className="p-2.5 border-r border-slate-200 text-right w-28">Fine Metal Wt</th>
                    <th className="p-2.5 border-r border-slate-200 w-28">Order Ref</th>
                    <th className="p-2.5 text-center w-24">Print</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-mono text-xs">
                  {orders
                    .filter((o) => o.assigned_karagir || o.karagir_assignment)
                    .map((ord) => {
                      const asg = ord.karagir_assignment;
                      const gWt = asg?.issued_gross_wt || 29.7;
                      const pur = asg?.issued_purity || 99.9;
                      const fWt = asg?.issued_fine_wt || roundTo((gWt * pur) / 100, 3);

                      return (
                        <tr key={ord.id} className="hover:bg-sky-50/30">
                          <td className="p-2.5 border-r border-slate-200 font-bold text-amber-950">
                            {asg?.voucher_no || `ISS-KARA-${ord.order_no.replace('ORD-', '')}`}
                          </td>
                          <td className="p-2.5 border-r border-slate-200 text-slate-600 font-sans">
                            {asg?.assigned_date || ord.header.bill_date}
                          </td>
                          <td className="p-2.5 border-r border-slate-200 font-sans font-bold text-slate-900">
                            {ord.assigned_karagir || asg?.karagir_name}
                          </td>
                          <td className="p-2.5 border-r border-slate-200 font-sans text-slate-700">
                            {asg?.issued_metal_type || '24K Pure Gold Granules (999)'}
                          </td>
                          <td className="p-2.5 border-r border-slate-200 text-right font-bold text-slate-900">
                            {formatWeight(gWt)}
                          </td>
                          <td className="p-2.5 border-r border-slate-200 text-center text-slate-700">
                            {pur}%
                          </td>
                          <td className="p-2.5 border-r border-slate-200 text-right font-black text-amber-900">
                            {formatWeight(fWt)}
                          </td>
                          <td className="p-2.5 border-r border-slate-200 font-bold text-blue-900">
                            {ord.order_no}
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => handleOpenJobCard(ord)}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                              title="Print Material Issue Slip"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RECEIVE ORDER FROM KARAGIR */}
      {activeTab === 'receive_order_from_karagir' && (
        <div className="bg-white border border-sky-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Workshop Returns, Finished Ornament Receiving & Wastage Audit</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Reconcile finished weights from Karagir, audit wastage tolerance, and settle artisan labour charges.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-2.5 border-r border-slate-200 w-28">Order No</th>
                  <th className="p-2.5 border-r border-slate-200">Customer & Ornament</th>
                  <th className="p-2.5 border-r border-slate-200 w-44">Karagir Name</th>
                  <th className="p-2.5 border-r border-slate-200 text-right w-28">Issued Metal</th>
                  <th className="p-2.5 border-r border-slate-200 text-right w-28">Target Net Wt</th>
                  <th className="p-2.5 border-r border-slate-200 w-28">Promised Date</th>
                  <th className="p-2.5 border-r border-slate-200 text-center w-28">Status</th>
                  <th className="p-2.5 text-center w-36">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white font-sans text-xs">
                {orders
                  .filter((o) => o.assigned_karagir || o.karagir_assignment)
                  .map((ord) => {
                    const totalNet = ord.items.reduce((s, i) => s + (i.net_wt || 0), 0);
                    const isReceived = ord.status === 'Received (Ready for Delivery)' || ord.karagir_assignment?.status === 'Received';

                    return (
                      <tr key={ord.id} className="hover:bg-emerald-50/20">
                        <td className="p-2.5 border-r border-slate-200 font-mono font-bold text-blue-900">
                          {ord.order_no}
                        </td>
                        <td className="p-2.5 border-r border-slate-200">
                          <div className="font-bold text-slate-900">{ord.header.customer_n || 'Patron Order'}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">
                            {ord.items.map((i) => i.item_name).join(', ')}
                          </div>
                        </td>
                        <td className="p-2.5 border-r border-slate-200 font-bold text-slate-800">
                          🔨 {ord.assigned_karagir || ord.karagir_assignment?.karagir_name}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-right font-mono font-bold text-amber-900">
                          {formatWeight(ord.karagir_assignment?.issued_gross_wt || totalNet + 1.2)}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-right font-mono font-bold text-blue-900">
                          {formatWeight(totalNet)}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 font-mono text-[11px] text-slate-600">
                          {ord.karagir_delivery_date || ord.header.delivery_date}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isReceived
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}
                          >
                            {isReceived ? 'Received & Stamped' : 'In Workshop'}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          {isReceived ? (
                            <span className="text-emerald-700 font-bold text-xs flex items-center justify-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Ready</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleOpenReceive(ord)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-2xs transition-colors flex items-center space-x-1 mx-auto"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Receive & Settle</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SALES INVOICE CONVERSION */}
      {activeTab === 'new_order_sales_invoice' && (
        <div className="bg-white border border-sky-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Generate Sales Tax Invoice for Completed Orders
              </h2>
              <p className="text-xs text-slate-500">
                Convert delivered and hallmarked custom jewellery orders into official GST Tax Invoices.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              {orders.length} Total Bookings
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-2.5 border-r border-slate-200 w-28">Order No</th>
                  <th className="p-2.5 border-r border-slate-200">Customer Name</th>
                  <th className="p-2.5 border-r border-slate-200 text-right w-28">Gross Value (₹)</th>
                  <th className="p-2.5 border-r border-slate-200 text-right w-28">Advance Paid</th>
                  <th className="p-2.5 border-r border-slate-200 text-right w-28">Balance Due</th>
                  <th className="p-2.5 border-r border-slate-200 text-center w-28">Workshop Status</th>
                  <th className="p-2.5 text-center w-36">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white font-mono text-xs">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-sky-50/30">
                    <td className="p-2.5 border-r border-slate-200 font-bold text-blue-900">
                      {ord.order_no}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-sans font-bold text-slate-900">
                      {ord.header.customer_n || 'Patron'}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-right font-bold text-slate-800">
                      {formatCurrency(ord.payment.amount)}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-right font-bold text-emerald-800">
                      {formatCurrency(ord.payment.advance_amt)}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-right font-black text-rose-800">
                      {formatCurrency(ord.payment.balance_amount)}
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-center font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-sans">
                      <button
                        onClick={() => {
                          setSelectedOrderId(ord.id);
                          setShowPrint(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-2xs"
                      >
                        Create Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: ORDER REPORT */}
      {activeTab === 'new_order_report' && (
        <div className="bg-white border border-sky-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-wrap justify-between items-center gap-2">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Comprehensive Order Tracking & Workshop Status Register
              </h2>
              <p className="text-xs text-slate-500">
                Real-time visibility across customer orders, karagir allocations, delivery dates, and balances.
              </p>
            </div>
            <button
              onClick={() => alert('Order Register exported successfully to CSV!')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 border border-slate-300 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-2.5 border-r border-slate-200 w-28">Order No</th>
                  <th className="p-2.5 border-r border-slate-200 w-24">Date</th>
                  <th className="p-2.5 border-r border-slate-200">Customer Name & Phone</th>
                  <th className="p-2.5 border-r border-slate-200">Ornaments</th>
                  <th className="p-2.5 border-r border-slate-200 text-right w-24">Net Wt</th>
                  <th className="p-2.5 border-r border-slate-200 w-36">Karagir</th>
                  <th className="p-2.5 border-r border-slate-200 w-28">Delivery Date</th>
                  <th className="p-2.5 border-r border-slate-200 text-right w-28">Balance Due</th>
                  <th className="p-2.5 text-center w-28">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white font-sans text-xs">
                {orders.map((ord) => {
                  const totalNet = ord.items.reduce((s, i) => s + (i.net_wt || 0), 0);
                  return (
                    <tr key={ord.id} className="hover:bg-sky-50/20">
                      <td className="p-2.5 border-r border-slate-200 font-mono font-bold text-blue-900">
                        {ord.order_no}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 font-mono text-slate-600">
                        {ord.header.bill_date}
                      </td>
                      <td className="p-2.5 border-r border-slate-200">
                        <div className="font-bold text-slate-900">{ord.header.customer_n || 'Patron'}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{ord.header.ph_no}</div>
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-[11px] text-slate-700">
                        {ord.items.map((i) => i.item_name).join(', ')}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-right font-mono font-bold text-slate-800">
                        {formatWeight(totalNet)}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-[11px] font-bold text-amber-950">
                        {ord.assigned_karagir ? `🔨 ${ord.assigned_karagir}` : '—'}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 font-mono text-[11px] text-slate-700">
                        {ord.header.delivery_date}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-right font-mono font-bold text-rose-800">
                        {formatCurrency(ord.payment.balance_amount)}
                      </td>
                      <td className="p-2.5 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: ADVANCE LEDGER */}
      {activeTab === 'advance' && (
        <div className="bg-white border border-sky-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Customer Advance Deposits & Old Gold (URD) Ledger
              </h2>
              <p className="text-xs text-slate-500">
                Audit trail of cash advances, bank transfers, and old scrap trade-in receipts.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="p-2.5 border-r border-slate-200 w-28">Order No</th>
                  <th className="p-2.5 border-r border-slate-200">Customer Name</th>
                  <th className="p-2.5 border-r border-slate-200 text-right w-32">Cash Advance (₹)</th>
                  <th className="p-2.5 border-r border-slate-200 text-right w-32">Bank / UPI Advance</th>
                  <th className="p-2.5 border-r border-slate-200 text-right w-32">Old Gold (URD) (₹)</th>
                  <th className="p-2.5 border-r border-slate-200 text-right w-32 font-bold text-emerald-900">
                    Total Advance
                  </th>
                  <th className="p-2.5 text-right w-32 font-bold text-rose-900">Balance Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white font-mono text-xs">
                {orders.map((ord) => {
                  const cashAdv = ord.payment.cash_received || 0;
                  const bankAdv = ord.payment.advance_amt || 0;
                  const urdAdv = ord.payment.purchase_amt || 0;
                  const totAdv = bankAdv + urdAdv;

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50">
                      <td className="p-2.5 border-r border-slate-200 font-bold text-blue-900">
                        {ord.order_no}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 font-sans font-bold text-slate-900">
                        {ord.header.customer_n || 'Patron'}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-right text-slate-700">
                        {formatCurrency(cashAdv)}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-right text-blue-900 font-bold">
                        {formatCurrency(bankAdv)}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-right text-amber-900 font-bold">
                        {formatCurrency(urdAdv)}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-right font-black text-emerald-900 bg-emerald-50/40">
                        {formatCurrency(totAdv)}
                      </td>
                      <td className="p-2.5 text-right font-black text-rose-900 bg-rose-50/40">
                        {formatCurrency(ord.payment.balance_amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <ColumnSettingsModal
        isOpen={showColumnSettings}
        onClose={() => setShowColumnSettings(false)}
        columns={orderColumns}
        onSave={(newCols) => setOrderColumns(newCols)}
      />

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
          order_no: selectedOrderId ? orders.find((o) => o.id === selectedOrderId)?.order_no : 'ORD-2026-084',
          header,
          items,
          payment,
        }}
      />

      <WhatsAppShareModal
        isOpen={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        recipientName={header.customer_n || 'Valued Patron'}
        phone={header.ph_no || '9819033445'}
        defaultMessage={`Namaste ${header.customer_n || 'Sir/Madam'}, Order ORD-2026-084 (${items[0]?.item_name}) confirmed at Swarna Jewellers. Advance: ${formatCurrency(payment.advance_amt)}. Balance: ${formatCurrency(payment.balance_amount)}. Delivery: ${header.delivery_date}.`}
      />

      {/* Karagir Modals */}
      {modalTargetOrder && (
        <>
          <AssignKaragirModal
            isOpen={showAssignModal}
            onClose={() => {
              setShowAssignModal(false);
              setModalTargetOrder(null);
            }}
            order={modalTargetOrder}
            onAssign={handleAssignKaragir}
            onPrintJobCard={(ord, asg) => handleOpenJobCard(ord, asg)}
          />

          <KaragirJobCardModal
            isOpen={showJobCardModal}
            onClose={() => {
              setShowJobCardModal(false);
              setModalTargetOrder(null);
              setActiveJobAssignment(undefined);
            }}
            order={modalTargetOrder}
            assignment={activeJobAssignment}
          />

          <ReceiveKaragirModal
            isOpen={showReceiveModal}
            onClose={() => {
              setShowReceiveModal(false);
              setModalTargetOrder(null);
            }}
            order={modalTargetOrder}
            onReceive={handleReceiveFromKaragir}
          />
        </>
      )}

      {/* Enlarged Photo Preview Modal */}
      {enlargedPhotoUrl && (
        <div className="fixed inset-0 bg-slate-900/80 z-60 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-2xl max-w-lg w-full space-y-3 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                <Image className="w-4 h-4 text-amber-600" />
                <span>Ornament Design Sample Preview</span>
              </span>
              <button
                onClick={() => setEnlargedPhotoUrl(null)}
                className="p-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full max-h-[70vh] rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-200">
              <img
                src={enlargedPhotoUrl}
                alt="Enlarged Ornament Sample"
                className="w-full h-full max-h-[68vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
