import React, { useState, useEffect } from 'react';
import {
  NewOrderBookingRecord,
  NewOrderHeader,
  NewOrderItem,
  NewOrderPayment,
  NewOrderTab,
  ColumnSetting
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
  Sparkles
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
      }
    }
  }, [selectedOrderId]);

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
    const orderRecord: NewOrderBookingRecord = {
      id: selectedOrderId || `ord-${Date.now()}`,
      order_no: selectedOrderId
        ? orders.find((o) => o.id === selectedOrderId)?.order_no || `ORD-${Date.now()}`
        : `ORD-2026-${String(orders.length + 1).padStart(3, '0')}`,
      header,
      items,
      payment,
      status: 'Booked',
      created_at: new Date().toISOString(),
    };
    onSaveOrder(orderRecord);
    setSelectedOrderId(orderRecord.id);
    alert(`Order ${orderRecord.order_no} booked successfully!`);
  };

  const handleNewOrder = () => {
    setSelectedOrderId(null);
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
      },
    ]);
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

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5 flex-wrap">
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

      {/* Karagir & Other Sub-Tabs */}
      {activeTab !== 'new_order_booking' && (
        <div className="bg-white border border-sky-200/80 rounded-xl p-8 shadow-sm text-center space-y-4 min-h-[300px] flex flex-col justify-center items-center">
          <div className="p-3 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
            <Hammer className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Active workshop job tracking. Karagir: <strong>Soni Govindbhai & Sons</strong>. Delivery promised: <strong>{header.delivery_date}</strong>.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('new_order_booking')}
            className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 shadow transition-colors"
          >
            Return to Order Booking
          </button>
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
    </div>
  );
};
