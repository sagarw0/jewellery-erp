import React, { useState, useMemo, useEffect } from 'react';
import {
  PurchaseRecord,
  PurchaseHeader,
  PurchaseItem,
  PurchasePayment,
  PurchaseTab,
  ColumnSetting,
  AccountMaster,
  StockItem,
  Vendor,
  VendorType,
} from '../../types/erp';
import { INITIAL_VENDORS } from '../../utils/mockData';
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
  ChevronUp,
  UserCheck,
  CreditCard,
  BookOpen,
  Layers,
  PackageCheck,
  Scale,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  FileText,
  Filter,
  Calendar,
  Building2,
  Phone,
  Mail,
  MapPin,
  Download,
  Share2,
  Check,
  AlertCircle,
  Tag,
  Copy,
  LayoutGrid,
  Columns,
  X,
  Sparkles
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
import { useTheme } from '../../context/ThemeContext';

interface PurchaseInvoiceViewProps {
  purchases: PurchaseRecord[];
  onSavePurchase: (purchase: PurchaseRecord) => void;
  onDeletePurchase: (id: string) => void;
  onClose: () => void;
  goldRate: number;
  accounts?: AccountMaster[];
  stockItems?: StockItem[];
  vendors?: Vendor[];
  onSaveVendor?: (vendor: Vendor) => void;
  onNavigateToBarcode?: () => void;
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

interface SupplierProfile {
  code: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  credit_limit: number;
  credit_days: number;
  opening_balance: number;
  balance_type: 'Cr' | 'Dr';
  bank_name: string;
  account_no: string;
  ifsc: string;
  branch: string;
}

const PRESET_SUPPLIERS: SupplierProfile[] = [
  {
    code: 'SUP-101',
    name: 'MMTC-PAMP India Bullion Ltd',
    contact_person: 'Rajesh Sharma',
    phone: '+91 98200 11223',
    email: 'bullion.sales@mmtcpamp.com',
    gstin: '27AABCM8921J1ZX',
    pan: 'AABCM8921J',
    address: 'Plot 14, Bullion Complex, Zaveri Bazaar',
    city: 'Mumbai',
    state: 'Maharashtra (27)',
    pincode: '400002',
    credit_limit: 50000000,
    credit_days: 15,
    opening_balance: 1250000,
    balance_type: 'Cr',
    bank_name: 'HDFC Bank Ltd',
    account_no: '50200089211244',
    ifsc: 'HDFC0000145',
    branch: 'Fort Mumbai',
  },
  {
    code: 'SUP-102',
    name: 'Kundan Gold Refinery & Mint',
    contact_person: 'Anil Gupta',
    phone: '+91 98110 55432',
    email: 'kundan.mint@kundanrefinery.com',
    gstin: '07AAACK1298H1ZT',
    pan: 'AAACK1298H',
    address: 'Industrial Area Phase 2',
    city: 'New Delhi',
    state: 'Delhi (07)',
    pincode: '110020',
    credit_limit: 25000000,
    credit_days: 30,
    opening_balance: 680000,
    balance_type: 'Cr',
    bank_name: 'State Bank of India',
    account_no: '30982210045',
    ifsc: 'SBIN0001245',
    branch: 'Connaught Place',
  },
  {
    code: 'SUP-103',
    name: 'Emerald Jewel Industry India Ltd',
    contact_person: 'K. Srinivasan',
    phone: '+91 98422 99881',
    email: 'orders@ejindia.com',
    gstin: '33AABCE1122M1ZY',
    pan: 'AABCE1122M',
    address: 'Coimbatore Jewellery Park',
    city: 'Coimbatore',
    state: 'Tamil Nadu (33)',
    pincode: '641018',
    credit_limit: 35000000,
    credit_days: 21,
    opening_balance: 420000,
    balance_type: 'Cr',
    bank_name: 'ICICI Bank Ltd',
    account_no: '001205011982',
    ifsc: 'ICIC0000012',
    branch: 'Coimbatore Main',
  },
  {
    code: 'SUP-104',
    name: 'Rajkot 916 CNC Bangles Syndicate',
    contact_person: 'Pravinbhai Patel',
    phone: '+91 98250 44321',
    email: 'rajkotbangles@syn.in',
    gstin: '24AABCR7712K1Z9',
    pan: 'AABCR7712K',
    address: 'Soni Bazar, Old City',
    city: 'Rajkot',
    state: 'Gujarat (24)',
    pincode: '360001',
    credit_limit: 20000000,
    credit_days: 14,
    opening_balance: 185000,
    balance_type: 'Cr',
    bank_name: 'Axis Bank Ltd',
    account_no: '91402008892113',
    ifsc: 'UTIB0000341',
    branch: 'Rajkot Soni Bazar',
  },
];

interface ConsignmentItem {
  id: string;
  memo_no: string;
  memo_date: string;
  returnable_date: string;
  item_name: string;
  category: string;
  purity: number;
  qty: number;
  gross_wt: number;
  net_wt: number;
  estimated_rate: number;
  estimated_amount: number;
  status: 'Pending Inspection' | 'Approved for Invoicing' | 'Returned to Supplier';
  selected: boolean;
}

const vendorToSupplierProfile = (v: Vendor): SupplierProfile => ({
  code: v.vendor_code,
  name: v.vendor_name,
  contact_person: v.contact_person || '',
  phone: v.phone,
  email: v.email || '',
  gstin: v.gstin || '',
  pan: v.pan_no || '',
  address: v.address || '',
  city: v.city,
  state: v.state,
  pincode: v.pincode || '',
  credit_limit: v.credit_limit || 0,
  credit_days: v.credit_days || 0,
  opening_balance: v.opening_balance_cash || 0,
  balance_type: v.balance_type || 'Cr',
  bank_name: v.bank_name || '',
  account_no: v.bank_account_no || '',
  ifsc: v.ifsc_code || '',
  branch: v.branch_name || '',
});

export const PurchaseInvoiceView: React.FC<PurchaseInvoiceViewProps> = ({
  purchases,
  onSavePurchase,
  onDeletePurchase,
  onClose,
  goldRate,
  accounts = [],
  stockItems = [],
  vendors = [],
  onSaveVendor,
  onNavigateToBarcode,
}) => {
  const { currentTheme, isDark } = useTheme();
  // Dynamic Vendors from Master
  const availableVendors = useMemo(() => {
    if (vendors && vendors.length > 0) return vendors;
    return INITIAL_VENDORS;
  }, [vendors]);

  // View layout mode: 'tabbed' (tab by tab) vs 'single_screen' (all 7 sections on 1 screen)
  const [viewMode, setViewMode] = useState<'tabbed' | 'single_screen'>('tabbed');
  const [activeTab, setActiveTab] = useState<PurchaseTab>('purchase_bill');
  const [purchaseCols, setPurchaseCols] = useState<ColumnSetting[]>(DEFAULT_PURCHASE_COLUMNS);
  const [showMoreHeader, setShowMoreHeader] = useState(false);

  // Modals
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showQuickVendorModal, setShowQuickVendorModal] = useState(false);

  // Quick Vendor Form State
  const [quickVendor, setQuickVendor] = useState({
    name: '',
    code: '',
    type: 'Bullion Dealer' as VendorType,
    phone: '',
    city: 'Mumbai',
    state: 'Maharashtra (27)',
    gstin: '',
    opening_balance_cash: 0,
    balance_type: 'Cr' as 'Cr' | 'Dr',
  });

  // Active Supplier Profile State
  const [currentSupplier, setCurrentSupplier] = useState<SupplierProfile>(() => {
    return vendorToSupplierProfile(availableVendors[0]);
  });

  // Keep supplier synced if availableVendors changes
  useEffect(() => {
    if (availableVendors.length > 0 && !availableVendors.find((v) => v.vendor_code === currentSupplier.code)) {
      const first = availableVendors[0];
      setCurrentSupplier(vendorToSupplierProfile(first));
      setHeader((prev) => ({
        ...prev,
        supplier_name: first.vendor_name,
        state: first.state,
      }));
    }
  }, [availableVendors]);

  // Header State (Spec #34)
  const [header, setHeader] = useState<PurchaseHeader>(() => ({
    supplier_name: availableVendors[0]?.vendor_name || 'MMTC-PAMP India Bullion Ltd',
    remark: 'Lot of 22K 916 CNC Bangles + Jhumkas',
    payment_mode: 'Credit',
    invoice_prefix: 'PUR',
    manual_no: 'CH-892',
    invoice_date: new Date().toISOString().split('T')[0],
    invoice_no: 'PUR-2026-104',
    state: availableVendors[0]?.state || 'Maharashtra (27)',
    gst_not_required: false,
    weightwise: true,
  }));

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

  // Consignment / Approvals State
  const [consignmentItems, setConsignmentItems] = useState<ConsignmentItem[]>([
    {
      id: 'cs-1',
      memo_no: 'MEMO-901',
      memo_date: '2026-09-08',
      returnable_date: '2026-09-22',
      item_name: '22K Antique Temple Choker Necklace',
      category: 'Necklace',
      purity: 91.6,
      qty: 1,
      gross_wt: 68.400,
      net_wt: 65.200,
      estimated_rate: 7050,
      estimated_amount: 459660,
      status: 'Approved for Invoicing',
      selected: false,
    },
    {
      id: 'cs-2',
      memo_no: 'MEMO-902',
      memo_date: '2026-09-10',
      returnable_date: '2026-09-25',
      item_name: '18K Diamond Solitaire Studs Pair (0.80ct)',
      category: 'Earrings',
      purity: 75.0,
      qty: 2,
      gross_wt: 14.200,
      net_wt: 13.800,
      estimated_rate: 5800,
      estimated_amount: 145000,
      status: 'Pending Inspection',
      selected: false,
    },
    {
      id: 'cs-3',
      memo_no: 'MEMO-889',
      memo_date: '2026-09-01',
      returnable_date: '2026-09-15',
      item_name: '24K Pure Bullion Mint Bar 50g',
      category: 'Bullion',
      purity: 99.9,
      qty: 1,
      gross_wt: 50.000,
      net_wt: 50.000,
      estimated_rate: 7650,
      estimated_amount: 382500,
      status: 'Approved for Invoicing',
      selected: false,
    },
  ]);

  // Cash / Metal Settlement State
  const [bhavCutRate, setBhavCutRate] = useState<number>(goldRate || 7650);
  const [bhavCutGrams, setBhavCutGrams] = useState<number>(50.0);
  const [surrenderMetalPurity, setSurrenderMetalPurity] = useState<number>(99.9);
  const [surrenderMetalGrossWt, setSurrenderMetalGrossWt] = useState<number>(25.0);
  const [settlementRemark, setSettlementRemark] = useState<string>('Bhav Cut @ 7650 for remaining fine gold');

  // Supplier Ledger Filter State
  const [ledgerDateFilter, setLedgerDateFilter] = useState<'all' | '30days' | 'quarter' | 'fy'>('all');
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<string>('All');

  // Re-calculate totals when items change
  const recalculatePayment = (currentItems: PurchaseItem[], curPayment: PurchasePayment = payment) => {
    const totalPurchaseAmt = currentItems.reduce((sum, it) => sum + (it.total_amt || 0), 0);
    const taxes = calculateTaxes(
      totalPurchaseAmt,
      header.gst_not_required,
      curPayment.gst_pct,
      curPayment.tds_pct,
      curPayment.tcs_tax_pct
    );

    const billAmt = roundTo(totalPurchaseAmt + taxes.gstAmt + taxes.tcsAmt - curPayment.discount, 2);
    const paidAmt = (curPayment.by_cash || 0) + (curPayment.by_cheque || 0);
    const netBal = roundTo(billAmt - paidAmt, 2);

    const updatedPayment: PurchasePayment = {
      ...curPayment,
      purchase_amt: roundTo(totalPurchaseAmt, 2),
      gst_amt: taxes.gstAmt,
      hgst_amt: taxes.hgstAmt,
      mgst_amt: taxes.mgstAmt,
      tds_amt: taxes.tdsAmt,
      sub_tax: taxes.gstAmt,
      bill_amount: billAmt,
      paid_amount: paidAmt,
      net_balance: netBal,
    };
    setPayment(updatedPayment);
  };

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
    recalculatePayment(updated);
  };

  const addItemRow = (preset?: Partial<PurchaseItem>) => {
    const newItem: PurchaseItem = {
      id: `pi-${Date.now()}`,
      trans_type: preset?.trans_type || 'Wholesale Purchase',
      item_name: preset?.item_name || '22K Gold Bullion Lot',
      qty: preset?.qty || 1,
      gross_wt: preset?.gross_wt || 50.000,
      black_b: preset?.black_b || 0,
      stone_wt: preset?.stone_wt || 0,
      net_wt: preset?.net_wt || 50.000,
      purity: preset?.purity || 91.6,
      rate: preset?.rate || goldRate || 7020,
      amount: roundTo((preset?.net_wt || 50.0) * (preset?.rate || goldRate || 7020), 2),
      wastage_pct: preset?.wastage_pct || 1.0,
      fin_plus_wastage: calculateFinePlusWastage(preset?.net_wt || 50.0, preset?.purity || 91.6, preset?.wastage_pct || 1.0),
      total_amt: roundTo((preset?.net_wt || 50.0) * (preset?.rate || goldRate || 7020) * 1.01, 2),
      huid: preset?.huid || `H${Math.floor(10000 + Math.random() * 90000)}`,
    };
    const updated = [...items, newItem];
    setItems(updated);
    recalculatePayment(updated);
  };

  const duplicateItem = (idx: number) => {
    const source = items[idx];
    const cloned: PurchaseItem = {
      ...source,
      id: `pi-${Date.now()}`,
      huid: `H${Math.floor(10000 + Math.random() * 90000)}`,
    };
    const updated = [...items, cloned];
    setItems(updated);
    recalculatePayment(updated);
  };

  const handleSelectSupplier = (sup: SupplierProfile) => {
    setCurrentSupplier(sup);
    setHeader((prev) => ({
      ...prev,
      supplier_name: sup.name,
      state: sup.state,
    }));
  };

  const handleSave = () => {
    if (!header.supplier_name.trim()) {
      alert('Please enter or select a Supplier Name');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one line item in the Purchase Bill');
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
    alert(`✅ Purchase Invoice ${header.invoice_no} successfully saved! Inward items added to stock.`);
  };

  // Convert selected consignment items into purchase items
  const handleConvertConsignmentToPurchase = () => {
    const selected = consignmentItems.filter((c) => c.selected && c.status === 'Approved for Invoicing');
    if (selected.length === 0) {
      alert('Please select at least one "Approved for Invoicing" consignment item to convert.');
      return;
    }

    const converted: PurchaseItem[] = selected.map((c) => ({
      id: `pi-${Date.now()}-${c.id}`,
      trans_type: 'Consignment Inward',
      item_name: `[${c.memo_no}] ${c.item_name}`,
      qty: c.qty,
      gross_wt: c.gross_wt,
      black_b: 0,
      stone_wt: roundTo(c.gross_wt - c.net_wt, 3),
      net_wt: c.net_wt,
      purity: c.purity,
      rate: c.estimated_rate,
      amount: roundTo(c.net_wt * c.estimated_rate, 2),
      wastage_pct: 1.0,
      fin_plus_wastage: calculateFinePlusWastage(c.net_wt, c.purity, 1.0),
      total_amt: roundTo(c.net_wt * c.estimated_rate * 1.01, 2),
      huid: `C${Math.floor(10000 + Math.random() * 90000)}`,
    }));

    const updatedItems = [...items, ...converted];
    setItems(updatedItems);
    recalculatePayment(updatedItems);

    // Remove converted from consignment list
    setConsignmentItems(consignmentItems.filter((c) => !c.selected));
    alert(`🎉 Converted ${converted.length} consignment lots into Purchase Bill lines!`);
    setActiveTab('purchase_bill');
  };

  // Bhav Cut Rate Fixation
  const handleApplyBhavCut = () => {
    const fixedAmount = roundTo(bhavCutGrams * bhavCutRate, 2);
    const updatedPayment = {
      ...payment,
      paid_amount: roundTo(payment.paid_amount + fixedAmount, 2),
      net_balance: roundTo(Math.max(0, payment.bill_amount - (payment.paid_amount + fixedAmount)), 2),
      details: `${payment.details} | Bhav Cut: ${bhavCutGrams}g @ ₹${bhavCutRate}/g (₹${fixedAmount})`,
    };
    setPayment(updatedPayment);
    alert(`⚖️ Bhav Cut Applied: ${bhavCutGrams}g Fine Gold fixed @ ₹${bhavCutRate}/g = ${formatCurrency(fixedAmount)} credited.`);
  };

  const tabs: { id: PurchaseTab; label: string; icon: any; count?: number }[] = [
    { id: 'supplier', label: 'Supplier', icon: UserCheck },
    { id: 'purchase_bill', label: 'Purchase Bill', icon: ShoppingBag, count: items.length },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'account_display', label: 'Account Display', icon: BookOpen },
    { id: 'account_cum_stock_display', label: 'Stock Display', icon: Layers, count: stockItems.length || items.length },
    { id: 'purchase_consignment', label: 'Consignment', icon: PackageCheck, count: consignmentItems.length },
    { id: 'stock_cash_settlement', label: 'Cash Settlement', icon: Scale },
  ];

  // Calculations for Totals
  const totalQty = items.reduce((acc, it) => acc + (it.qty || 0), 0);
  const totalGrossWt = items.reduce((acc, it) => acc + (it.gross_wt || 0), 0);
  const totalNetWt = items.reduce((acc, it) => acc + (it.net_wt || 0), 0);
  const totalFineWt = items.reduce((acc, it) => acc + (it.fin_plus_wastage || 0), 0);
  const totalTaxableAmt = items.reduce((acc, it) => acc + (it.total_amt || 0), 0);

  // Supplier Ledger Transactions Data
  const supplierLedger = [
    {
      date: '2026-08-15',
      voucher_no: 'PUR-2026-088',
      type: 'Purchase Invoice',
      narration: '22K 916 Temple Jewellery Inward (120g)',
      debit: 0,
      credit: 845000,
      metal_dr: 0,
      metal_cr: 109.92,
      balance: 845000,
    },
    {
      date: '2026-08-20',
      voucher_no: 'PMT-892',
      type: 'Bank Payment',
      narration: 'RTGS via HDFC Bank A/c #502000',
      debit: 500000,
      credit: 0,
      metal_dr: 0,
      metal_cr: 0,
      balance: 345000,
    },
    {
      date: '2026-08-28',
      voucher_no: 'DN-104',
      type: 'Debit Note / Return',
      narration: 'Weight difference in Lot #2 (2.1g Ghat)',
      debit: 14700,
      credit: 0,
      metal_dr: 1.92,
      metal_cr: 0,
      balance: 330300,
    },
    {
      date: '2026-09-02',
      voucher_no: 'BC-201',
      type: 'Bhav Cut Settlement',
      narration: 'Fixed 40.0g @ ₹7,050/g (Bullion adjustment)',
      debit: 282000,
      credit: 0,
      metal_dr: 40.0,
      metal_cr: 0,
      balance: 48300,
    },
    {
      date: header.invoice_date,
      voucher_no: header.invoice_no,
      type: 'Purchase Invoice',
      narration: header.remark,
      debit: 0,
      credit: payment.bill_amount,
      metal_dr: 0,
      metal_cr: totalFineWt,
      balance: roundTo(48300 + payment.bill_amount, 2),
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. TOP CONTROL & METRIC TOOLBAR */}
      <div className={`border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm transition-all ${
        isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/90 text-slate-900'
      }`}>
        <div className="flex items-center space-x-3.5">
          <div className={`p-2.5 rounded-xl text-white shadow-md ${
            isDark ? 'bg-amber-400 text-slate-950 font-bold shadow-amber-500/20' : 'bg-gradient-to-br from-indigo-600 to-blue-700 shadow-indigo-500/20'
          }`}>
            <ShoppingBag className={`w-6 h-6 ${isDark ? 'text-slate-950' : 'text-white'}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className={`text-base font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Purchase Invoice
              </h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border shadow-2xs ${
                isDark ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                {header.invoice_no}
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${
                isDark ? 'bg-white/10 text-slate-300 border-white/15' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                F5
              </span>
            </div>
            <p className={`text-xs mt-0.5 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span>Wholesale lots inwards</span>
              <span>•</span>
              <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{header.supplier_name}</span>
              <span>•</span>
              <span className={`font-semibold font-mono ${isDark ? 'text-amber-300' : 'text-emerald-700'}`}>
                ₹{payment.bill_amount.toLocaleString('en-IN')}
              </span>
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Actions */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* View Mode Switcher: Tabbed vs Single Screen */}
          <div className={`p-1 rounded-xl border flex items-center space-x-1 ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('tabbed')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'tabbed'
                  ? isDark
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-xs'
                    : 'bg-white text-blue-700 shadow-xs border border-blue-200'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="View tabs one-by-one"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tabbed View</span>
            </button>
            <button
              onClick={() => setViewMode('single_screen')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'single_screen'
                  ? isDark
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'bg-blue-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Show all 7 options unified on 1 single continuous screen"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>All-in-1 Screen</span>
            </button>
          </div>

          <button
            onClick={handleSave}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs active:scale-98 transition-all cursor-pointer ${
              isDark
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-bold'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Invoice</span>
          </button>

          <button
            onClick={() => setShowPrint(true)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 text-white border-white/15'
                : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={() => setShowWhatsApp(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => setShowColumnSettings(true)}
            className="flex items-center space-x-1 px-2.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-medium border border-slate-200 hover:bg-slate-200 transition-colors"
            title="Column Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>GS</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center space-x-1 px-2.5 py-2 rounded-xl bg-amber-50 text-amber-800 text-xs font-medium border border-amber-300 hover:bg-amber-100 transition-colors"
            title="Keyboard Shortcuts & Help"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>H</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Close"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. TAB NAVIGATION BAR (When in Tabbed View Mode) */}
      {viewMode === 'tabbed' && (
        <div className="flex border-b border-sky-200 bg-white rounded-2xl p-1.5 space-x-1 overflow-x-auto scrollbar-none shadow-2xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. SUB-VIEW RENDERING (Tabbed or Unified Single Screen) */}
      <div className="space-y-4">
        {/* ========================================================== */}
        {/* TAB 1: SUPPLIER PROFILE & MASTER DETAILS */}
        {/* ========================================================== */}
        {(viewMode === 'single_screen' || activeTab === 'supplier') && (
          <div className="bg-white border border-sky-200/90 rounded-2xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 border border-blue-200">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-blue-950 uppercase tracking-wider">
                    Supplier Profile & Master Registry
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Manage Bullion dealer, Manufacturer & Wholesaler account records
                  </p>
                </div>
              </div>

              {/* Quick Supplier Selector with + Add New Vendor */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Select Vendor:</span>
                <select
                  value={currentSupplier.code}
                  onChange={(e) => {
                    const found = availableVendors.find((s) => s.vendor_code === e.target.value);
                    if (found) handleSelectSupplier(vendorToSupplierProfile(found));
                  }}
                  className="px-3 py-1.5 bg-sky-50/70 border border-sky-200 rounded-xl text-xs font-semibold text-blue-900 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {availableVendors.map((s) => (
                    <option key={s.id} value={s.vendor_code}>
                      {s.vendor_name} ({s.vendor_code}) - {s.city || s.vendor_type}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setQuickVendor({
                      name: '',
                      code: `SUP-${availableVendors.length + 101}`,
                      type: 'Bullion Dealer',
                      phone: '',
                      city: 'Mumbai',
                      state: 'Maharashtra (27)',
                      gstin: '',
                      opening_balance_cash: 0,
                      balance_type: 'Cr',
                    });
                    setShowQuickVendorModal(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs flex items-center space-x-1 cursor-pointer"
                  title="Add New Vendor to Master"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Vendor</span>
                </button>
              </div>
            </div>

            {/* Supplier Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card A: Identity & Contact */}
              <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Identity & Contact
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono text-[10px] font-bold">
                    {currentSupplier.code}
                  </span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div>
                    <label className="block text-[10px] text-slate-500">Legal Entity Name</label>
                    <input
                      type="text"
                      value={currentSupplier.name}
                      onChange={(e) => {
                        const updated = { ...currentSupplier, name: e.target.value };
                        setCurrentSupplier(updated);
                        setHeader({ ...header, supplier_name: e.target.value });
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500">Contact Person</label>
                      <input
                        type="text"
                        value={currentSupplier.contact_person}
                        onChange={(e) => setCurrentSupplier({ ...currentSupplier, contact_person: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Phone / Mobile</label>
                      <input
                        type="text"
                        value={currentSupplier.phone}
                        onChange={(e) => setCurrentSupplier({ ...currentSupplier, phone: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card B: GSTIN, PAN & Address */}
              <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5 text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Taxation & Location
                </span>
                <div className="space-y-1.5 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500">GSTIN No</label>
                      <input
                        type="text"
                        value={currentSupplier.gstin}
                        onChange={(e) => setCurrentSupplier({ ...currentSupplier, gstin: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-blue-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">PAN No</label>
                      <input
                        type="text"
                        value={currentSupplier.pan}
                        onChange={(e) => setCurrentSupplier({ ...currentSupplier, pan: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Full Address & State</label>
                    <input
                      type="text"
                      value={currentSupplier.address}
                      onChange={(e) => setCurrentSupplier({ ...currentSupplier, address: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs mb-1"
                    />
                    <input
                      type="text"
                      value={currentSupplier.state}
                      onChange={(e) => {
                        setCurrentSupplier({ ...currentSupplier, state: e.target.value });
                        setHeader({ ...header, state: e.target.value });
                      }}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Card C: Banking & Credit Terms */}
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-2.5 text-xs">
                <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> Banking & Credit Terms
                </span>
                <div className="space-y-1.5 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500">Credit Limit (₹)</label>
                      <input
                        type="number"
                        value={currentSupplier.credit_limit}
                        onChange={(e) => setCurrentSupplier({ ...currentSupplier, credit_limit: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Credit Days</label>
                      <input
                        type="number"
                        value={currentSupplier.credit_days}
                        onChange={(e) => setCurrentSupplier({ ...currentSupplier, credit_days: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Bank Name & A/c No</label>
                    <input
                      type="text"
                      value={`${currentSupplier.bank_name} - ${currentSupplier.account_no} (IFSC: ${currentSupplier.ifsc})`}
                      readOnly
                      className="w-full px-2 py-1 bg-white/70 border border-slate-200 rounded text-[11px] text-slate-700 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier Balances KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-blue-700 block">Opening Balance</span>
                <span className="text-base font-mono font-semibold text-blue-950">
                  {formatCurrency(currentSupplier.opening_balance)} {currentSupplier.balance_type}
                </span>
              </div>
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-indigo-700 block">Credit Limit Available</span>
                <span className="text-base font-mono font-semibold text-indigo-950">
                  {formatCurrency(currentSupplier.credit_limit - currentSupplier.opening_balance)}
                </span>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-amber-700 block">Fine Gold Balance</span>
                <span className="text-base font-mono font-semibold text-amber-950">
                  148.520 g (Cr)
                </span>
              </div>
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-emerald-700 block">YTD Purchase Volume</span>
                <span className="text-base font-mono font-semibold text-emerald-950">
                  ₹1,48,20,000
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: PURCHASE BILL & INWARD GRID */}
        {/* ========================================================== */}
        {(viewMode === 'single_screen' || activeTab === 'purchase_bill') && (
          <div className="space-y-4">
            {/* Header Form */}
            <div className="bg-white border border-sky-200/90 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-semibold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" /> Invoice Header & Dispatch Parameters
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Date: {header.invoice_date} | No: {header.invoice_no}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="sm:col-span-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-600">
                      Supplier / Vendor <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickVendor({
                          name: '',
                          code: `SUP-${availableVendors.length + 101}`,
                          type: 'Bullion Dealer',
                          phone: '',
                          city: 'Mumbai',
                          state: 'Maharashtra (27)',
                          gstin: '',
                          opening_balance_cash: 0,
                          balance_type: 'Cr',
                        });
                        setShowQuickVendorModal(true);
                      }}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-0.5 cursor-pointer"
                      title="Add New Vendor"
                    >
                      <Plus className="w-3 h-3" />
                      <span>New Vendor</span>
                    </button>
                  </div>
                  <select
                    value={currentSupplier.code}
                    onChange={(e) => {
                      const found = availableVendors.find((s) => s.vendor_code === e.target.value);
                      if (found) handleSelectSupplier(vendorToSupplierProfile(found));
                    }}
                    className="w-full px-2.5 py-1.5 bg-sky-50/60 border border-sky-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 text-xs cursor-pointer shadow-2xs"
                  >
                    {availableVendors.map((s) => (
                      <option key={s.id} value={s.vendor_code}>
                        {s.vendor_name} ({s.vendor_code}) - {s.city || s.vendor_type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={header.invoice_date}
                    onChange={(e) => setHeader({ ...header, invoice_date: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Invoice No</label>
                  <input
                    type="text"
                    value={header.invoice_no}
                    onChange={(e) => setHeader({ ...header, invoice_no: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-indigo-700 font-mono font-bold"
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
                    <span className="font-bold text-blue-800 text-xs">Weightwise Billing</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={header.gst_not_required}
                      onChange={(e) => {
                        const notReq = e.target.checked;
                        setHeader({ ...header, gst_not_required: notReq });
                        recalculatePayment(items);
                      }}
                      className="rounded border-slate-300 text-blue-600 w-4 h-4"
                    />
                    <span className="text-xs">GST Not Required</span>
                  </label>
                </div>
              </div>

              {/* Collapsible More Header */}
              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMoreHeader(!showMoreHeader)}
                  className="flex items-center space-x-1 text-xs text-blue-600 font-bold hover:text-blue-800 cursor-pointer"
                >
                  {showMoreHeader ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>{showMoreHeader ? 'Hide Additional Details' : 'Show Additional Details (Prefix, Manual Challan No, Mode, State, Remark)'}</span>
                </button>

                {showMoreHeader && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mt-2 pt-2 border-t border-dashed border-slate-200 bg-sky-50/40 p-3 rounded-xl animate-in fade-in duration-150">
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
                      <label className="block text-[10px] text-slate-500 mb-1">Manual Challan No</label>
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
                        <option value="Credit">Credit (Standard)</option>
                        <option value="Cash">Cash (Immediate)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">State & GST Code</label>
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

            {/* Wholesale Items Grid */}
            <div className="bg-white border border-sky-200/90 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-blue-950 uppercase tracking-wider">
                    Wholesale Inward Grid ({items.length} lots)
                  </span>
                  <span className="text-[11px] px-2 py-0.5 bg-sky-50 text-blue-700 font-bold rounded-md border border-sky-200">
                    Total Gross: {formatWeight(totalGrossWt)}
                  </span>
                </div>

                {/* Fast Action Buttons */}
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <button
                    onClick={() => addItemRow()}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Purchase Lot</span>
                  </button>
                  <button
                    onClick={() =>
                      addItemRow({
                        item_name: '24K Pure Bullion 999 Bar',
                        purity: 99.9,
                        gross_wt: 100.0,
                        net_wt: 100.0,
                        rate: goldRate,
                        wastage_pct: 0,
                      })
                    }
                    className="px-2.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-semibold border border-amber-200"
                    title="Quick add 24K Bullion 100g Bar"
                  >
                    + 24K Bullion (100g)
                  </button>
                  <button
                    onClick={() =>
                      addItemRow({
                        item_name: '22K 916 CNC Bangles',
                        purity: 91.6,
                        gross_wt: 50.0,
                        net_wt: 50.0,
                        rate: 7020,
                        wastage_pct: 1.5,
                      })
                    }
                    className="px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 hover:bg-indigo-100 text-xs font-semibold border border-indigo-200"
                    title="Quick add 22K 916 CNC Bangles"
                  >
                    + 22K Bangles (50g)
                  </button>
                  <button
                    onClick={() =>
                      addItemRow({
                        item_name: '999 Pure Silver Ingot',
                        purity: 99.9,
                        gross_wt: 1000.0,
                        net_wt: 1000.0,
                        rate: 92,
                        wastage_pct: 0,
                      })
                    }
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-semibold border border-slate-300"
                    title="Quick add 999 Fine Silver 1kg"
                  >
                    + 999 Silver (1kg)
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 select-none">
                    <tr>
                      <th className="p-2.5 border-r border-slate-200 w-10 text-center">#</th>
                      <th className="p-2.5 border-r border-slate-200 min-w-[130px]">TransType</th>
                      <th className="p-2.5 border-r border-slate-200 min-w-[190px]">Item Name</th>
                      <th className="p-2.5 border-r border-slate-200 w-16 text-center">QTY</th>
                      <th className="p-2.5 border-r border-slate-200 w-24 text-right">GrossWt</th>
                      <th className="p-2.5 border-r border-slate-200 w-20 text-right">StoneWt</th>
                      <th className="p-2.5 border-r border-slate-200 w-24 text-right font-bold text-blue-800">NetWt</th>
                      <th className="p-2.5 border-r border-slate-200 w-20 text-center">Purity</th>
                      <th className="p-2.5 border-r border-slate-200 w-24 text-right">Rate</th>
                      <th className="p-2.5 border-r border-slate-200 w-20 text-right text-indigo-700 font-bold">Wast%</th>
                      <th className="p-2.5 border-r border-slate-200 w-24 text-right font-semibold text-indigo-900">Fin+Wast</th>
                      <th className="p-2.5 border-r border-slate-200 w-28 text-right font-bold text-emerald-700">Total.Amt</th>
                      <th className="p-2.5 border-r border-slate-200 w-24 text-center font-bold text-amber-700">HUID</th>
                      <th className="p-2.5 w-16 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
                    {items.map((it, idx) => (
                      <tr key={it.id} className="hover:bg-sky-50/30 transition-colors">
                        <td className="p-2 border-r border-slate-200 text-center text-slate-400 font-bold">{idx + 1}</td>
                        <td className="p-1.5 border-r border-slate-200 font-sans">
                          <select
                            value={it.trans_type}
                            onChange={(e) => updateItem(idx, 'trans_type', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-800 text-[11px]"
                          >
                            <option value="Wholesale Purchase">Wholesale Purchase</option>
                            <option value="Bullion Inward">Bullion Inward</option>
                            <option value="Consignment Inward">Consignment Inward</option>
                            <option value="Jobwork Inward">Jobwork Inward</option>
                          </select>
                        </td>
                        <td className="p-1.5 border-r border-slate-200 font-sans">
                          <input
                            type="text"
                            value={it.item_name}
                            onChange={(e) => updateItem(idx, 'item_name', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-900 font-medium text-xs"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="number"
                            value={it.qty}
                            onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 1)}
                            className="w-full bg-slate-50 border border-slate-300 rounded px-1 py-1 text-center text-slate-900 text-xs font-bold"
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
                            value={it.stone_wt}
                            onChange={(e) => updateItem(idx, 'stone_wt', parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 text-right text-slate-700 text-xs"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-200 text-right font-semibold text-blue-800">
                          {formatWeight(it.net_wt)}
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="number"
                            step={0.1}
                            value={it.purity}
                            onChange={(e) => updateItem(idx, 'purity', parseFloat(e.target.value) || 91.6)}
                            className="w-full bg-slate-50 border border-slate-300 rounded px-1 py-1 text-center text-slate-800 text-xs font-semibold"
                          />
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="number"
                            value={it.rate}
                            onChange={(e) => updateItem(idx, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-50 border border-slate-300 rounded px-1.5 py-1 text-right text-slate-900 text-xs font-bold"
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
                        <td className="p-2 border-r border-slate-200 text-right font-bold text-indigo-900">
                          {formatWeight(it.fin_plus_wastage)}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-right font-semibold text-emerald-700">
                          ₹{Math.round(it.total_amt).toLocaleString('en-IN')}
                        </td>
                        <td className="p-1.5 border-r border-slate-200">
                          <input
                            type="text"
                            maxLength={6}
                            value={it.huid}
                            onChange={(e) => updateItem(idx, 'huid', e.target.value.toUpperCase())}
                            className="w-full bg-amber-50/60 border border-amber-300 rounded px-1 py-1 text-center font-mono font-bold text-amber-800 text-xs uppercase"
                          />
                        </td>
                        <td className="p-1 text-center space-x-1">
                          <button
                            onClick={() => duplicateItem(idx)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Duplicate Row"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              const updated = items.filter((_, i) => i !== idx);
                              setItems(updated);
                              recalculatePayment(updated);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Delete Row"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Totals Footer */}
                  <tfoot className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300 font-mono text-xs">
                    <tr>
                      <td colSpan={3} className="p-2.5 text-right font-sans font-semibold text-blue-950 uppercase">
                        Totals ({items.length} lots):
                      </td>
                      <td className="p-2.5 text-center text-slate-900 font-semibold">{totalQty}</td>
                      <td className="p-2.5 text-right text-slate-900">{formatWeight(totalGrossWt)}</td>
                      <td className="p-2.5 text-right text-slate-500">—</td>
                      <td className="p-2.5 text-right text-blue-900 font-semibold">
                        {formatWeight(totalNetWt)}
                      </td>
                      <td colSpan={2} className="p-2.5 text-right text-slate-500 font-sans text-[11px]">
                        Fine Gold Eq:
                      </td>
                      <td className="p-2.5 text-right text-indigo-700 font-semibold">—</td>
                      <td className="p-2.5 text-right text-indigo-950 font-semibold">
                        {formatWeight(totalFineWt)}
                      </td>
                      <td className="p-2.5 text-right text-emerald-800 font-semibold text-sm">
                        {formatCurrency(totalTaxableAmt)}
                      </td>
                      <td colSpan={2} className="p-2.5 text-center text-slate-500 text-[10px] font-sans">
                        All HUID Validated
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: PAYMENT & TAX SETTLEMENT */}
        {/* ========================================================== */}
        {(viewMode === 'single_screen' || activeTab === 'payment') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Payment Method Distribution (Left Col 7) */}
            <div className="lg:col-span-7 bg-white border border-sky-200/90 rounded-2xl p-4 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" /> Payment & Settlement Distribution
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                  {header.payment_mode} Mode
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">By Cash (₹)</label>
                  <input
                    type="number"
                    value={payment.by_cash}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const updated = { ...payment, by_cash: val };
                      const paid = val + (payment.by_cheque || 0);
                      updated.paid_amount = paid;
                      updated.net_balance = roundTo(payment.bill_amount - paid, 2);
                      setPayment(updated);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-right text-xs font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400">Cash-in-hand account deduction</span>
                </div>

                <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">By Cheque / RTGS (₹)</label>
                  <input
                    type="number"
                    value={payment.by_cheque}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const updated = { ...payment, by_cheque: val };
                      const paid = (payment.by_cash || 0) + val;
                      updated.paid_amount = paid;
                      updated.net_balance = roundTo(payment.bill_amount - paid, 2);
                      setPayment(updated);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-right text-xs font-bold text-blue-900"
                  />
                  <span className="text-[10px] text-slate-400">Bank clearing transaction</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">Bank Name & A/c</label>
                  <input
                    type="text"
                    value={payment.bank_name}
                    onChange={(e) => setPayment({ ...payment, bank_name: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">Cheque / UTR Ref No</label>
                  <input
                    type="text"
                    value={payment.cheque_no}
                    onChange={(e) => setPayment({ ...payment, cheque_no: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">Settlement Narration</label>
                  <input
                    type="text"
                    value={payment.details}
                    onChange={(e) => setPayment({ ...payment, details: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 flex-wrap gap-2">
                <button
                  onClick={() => {
                    const full = payment.bill_amount;
                    const updated = {
                      ...payment,
                      by_cheque: full,
                      by_cash: 0,
                      paid_amount: full,
                      net_balance: 0,
                      details: `Full payment cleared via RTGS UTR#${Math.floor(100000 + Math.random() * 900000)}`,
                    };
                    setPayment(updated);
                  }}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  ⚡ Mark Full Payment (RTGS)
                </button>
                <span className="text-[11px] text-slate-500 font-mono">
                  Current Supplier Limit: {formatCurrency(currentSupplier.credit_limit)}
                </span>
              </div>
            </div>

            {/* Tax Engine & Balance Summary (Right Col 5) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-white border border-indigo-200 rounded-2xl p-4 shadow-xs space-y-3 text-xs flex flex-col justify-between">
              <div>
                <span className="font-semibold text-indigo-950 uppercase tracking-wider block border-b border-indigo-200/80 pb-2">
                  Statutory Taxes & Balance Ledger
                </span>

                <div className="space-y-1.5 pt-2.5 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Taxable Purchase Value:</span>
                    <span className="font-mono font-bold text-slate-900">{formatCurrency(payment.purchase_amt)}</span>
                  </div>

                  {!header.gst_not_required && (
                    <>
                      <div className="flex justify-between text-indigo-900">
                        <span>CGST (1.5%):</span>
                        <span className="font-mono font-semibold">{formatCurrency(payment.hgst_amt)}</span>
                      </div>
                      <div className="flex justify-between text-indigo-900">
                        <span>SGST (1.5%):</span>
                        <span className="font-mono font-semibold">{formatCurrency(payment.mgst_amt)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-indigo-950 border-t border-dashed border-indigo-200 pt-1">
                        <span>Total GST (3.0%):</span>
                        <span className="font-mono">{formatCurrency(payment.gst_amt)}</span>
                      </div>
                    </>
                  )}

                  {payment.tds_pct > 0 && (
                    <div className="flex justify-between text-amber-800">
                      <span>TDS Sec 194Q ({payment.tds_pct}%):</span>
                      <span className="font-mono font-semibold">{formatCurrency(payment.tds_amt)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-rose-700">
                    <span>Discount / Round-off:</span>
                    <span className="font-mono font-semibold">- {formatCurrency(payment.discount)}</span>
                  </div>

                  <div className="flex justify-between text-sm font-semibold text-slate-900 border-t border-slate-300 pt-1.5">
                    <span>Grand Bill Amount:</span>
                    <span className="font-mono text-indigo-950">{formatCurrency(payment.bill_amount)}</span>
                  </div>

                  <div className="flex justify-between font-semibold text-emerald-700">
                    <span>Total Amount Paid:</span>
                    <span className="font-mono">{formatCurrency(payment.paid_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Net Balance Callout */}
              <div className="p-3.5 bg-white border border-indigo-300 rounded-xl flex justify-between items-center shadow-2xs mt-2">
                <div>
                  <span className="font-semibold text-indigo-950 text-xs uppercase block">Net Balance Due</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {payment.net_balance === 0 ? 'Fully Cleared' : 'Payable to Supplier'}
                  </span>
                </div>
                <span className={`text-xl font-mono font-semibold ${payment.net_balance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {formatCurrency(payment.net_balance)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: ACCOUNT DISPLAY / SUPPLIER LEDGER */}
        {/* ========================================================== */}
        {(viewMode === 'single_screen' || activeTab === 'account_display') && (
          <div className="bg-white border border-sky-200/90 rounded-2xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-200">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-blue-950 uppercase tracking-wider">
                    Supplier Account Ledger Statement
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Chronological financial and metal ledger with {header.supplier_name}
                  </p>
                </div>
              </div>

              {/* Ledger Actions & Export */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert('Printing Supplier Ledger Statement...')}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Statement</span>
                </button>
                <button
                  onClick={() => alert('Exporting statement in CSV/Excel...')}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-blue-700 text-xs font-medium border border-sky-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Ledger Transactions Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 select-none">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200 w-24">Date</th>
                    <th className="p-2.5 border-r border-slate-200 w-32">Voucher No</th>
                    <th className="p-2.5 border-r border-slate-200 w-36">Type</th>
                    <th className="p-2.5 border-r border-slate-200 min-w-[200px]">Particulars / Narration</th>
                    <th className="p-2.5 border-r border-slate-200 w-24 text-right text-indigo-700">Metal (g)</th>
                    <th className="p-2.5 border-r border-slate-200 w-28 text-right text-emerald-700">Debit (₹)</th>
                    <th className="p-2.5 border-r border-slate-200 w-28 text-right text-rose-700">Credit (₹)</th>
                    <th className="p-2.5 w-32 text-right font-semibold text-slate-900">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
                  {supplierLedger.map((row, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/40 transition-colors">
                      <td className="p-2.5 border-r border-slate-200 text-slate-600">{row.date}</td>
                      <td className="p-2.5 border-r border-slate-200 font-semibold text-indigo-700">{row.voucher_no}</td>
                      <td className="p-2.5 border-r border-slate-200 font-sans font-medium text-slate-700">{row.type}</td>
                      <td className="p-2.5 border-r border-slate-200 font-sans text-slate-800">{row.narration}</td>
                      <td className="p-2.5 border-r border-slate-200 text-right text-indigo-900 font-medium">
                        {row.metal_cr > 0 ? `+${formatWeight(row.metal_cr)}` : row.metal_dr > 0 ? `-${formatWeight(row.metal_dr)}` : '—'}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-right text-emerald-700 font-medium">
                        {row.debit > 0 ? formatCurrency(row.debit) : '—'}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-right text-rose-700 font-medium">
                        {row.credit > 0 ? formatCurrency(row.credit) : '—'}
                      </td>
                      <td className="p-2.5 text-right font-semibold text-blue-950">
                        {formatCurrency(row.balance)} Cr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 5: STOCK DISPLAY / INVENTORY RECEIVED */}
        {/* ========================================================== */}
        {(viewMode === 'single_screen' || activeTab === 'account_cum_stock_display') && (
          <div className="bg-white border border-sky-200/90 rounded-2xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-200">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-blue-950 uppercase tracking-wider">
                    Stock Inwards & Inventory Breakdown
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Live tracking of loose lots, purity classifications, and barcode status
                  </p>
                </div>
              </div>

              {onNavigateToBarcode && (
                <button
                  onClick={onNavigateToBarcode}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs transition-colors"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Open Barcode Studio (F3)</span>
                </button>
              )}
            </div>

            {/* Metal Categories KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">24K Fine Bullion</span>
                <span className="text-base font-mono font-semibold text-amber-950">50.000 g</span>
                <span className="text-[10px] text-amber-600 block mt-0.5">1 Lot Inward</span>
              </div>
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-indigo-800 block">22K 916 Jewellery</span>
                <span className="text-base font-mono font-semibold text-indigo-950">223.300 g</span>
                <span className="text-[10px] text-indigo-600 block mt-0.5">18 Pcs Bangles/Jhumkas</span>
              </div>
              <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-sky-800 block">18K Diamond Studded</span>
                <span className="text-base font-mono font-semibold text-sky-950">14.200 g</span>
                <span className="text-[10px] text-sky-600 block mt-0.5">2 Pairs Solitaires</span>
              </div>
              <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-700 block">999 Pure Silver</span>
                <span className="text-base font-mono font-semibold text-slate-900">1,000.000 g</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">1 Ingot Bar</span>
              </div>
            </div>

            {/* Inward Items Inventory Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200 w-12 text-center">#</th>
                    <th className="p-2.5 border-r border-slate-200 min-w-[200px]">Item Description</th>
                    <th className="p-2.5 border-r border-slate-200 w-20 text-center">Purity</th>
                    <th className="p-2.5 border-r border-slate-200 w-24 text-right">Gross Wt</th>
                    <th className="p-2.5 border-r border-slate-200 w-24 text-right">Net Wt</th>
                    <th className="p-2.5 border-r border-slate-200 w-24 text-right text-indigo-900 font-bold">Fine Wt</th>
                    <th className="p-2.5 border-r border-slate-200 w-24 text-center text-amber-700 font-bold">HUID</th>
                    <th className="p-2.5 w-36 text-center">Barcode Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
                  {items.map((it, idx) => (
                    <tr key={it.id} className="hover:bg-sky-50/30">
                      <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-sans font-bold text-slate-900">
                        {it.item_name}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-700">
                        {it.purity}%
                      </td>
                      <td className="p-2 border-r border-slate-200 text-right">{formatWeight(it.gross_wt)}</td>
                      <td className="p-2 border-r border-slate-200 text-right font-bold text-blue-900">
                        {formatWeight(it.net_wt)}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-right font-bold text-indigo-900">
                        {formatWeight(it.fin_plus_wastage)}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-amber-800">
                        {it.huid}
                      </td>
                      <td className="p-2 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Loose Stock (F3 Ready)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 6: CONSIGNMENT & APPROVAL INWARDS */}
        {/* ========================================================== */}
        {(viewMode === 'single_screen' || activeTab === 'purchase_consignment') && (
          <div className="bg-white border border-sky-200/90 rounded-2xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600 border border-amber-200">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-blue-950 uppercase tracking-wider">
                    Consignment & Approval Inwards (Kaccha Inward)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Items received on trial/approval basis from suppliers before confirming purchase
                  </p>
                </div>
              </div>

              {/* Conversion Action */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleConvertConsignmentToPurchase}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Convert Approved to Purchase Bill</span>
                </button>
              </div>
            </div>

            {/* Consignment Items Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200 w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setConsignmentItems(consignmentItems.map((c) => ({ ...c, selected: checked })));
                        }}
                        className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5"
                      />
                    </th>
                    <th className="p-2.5 border-r border-slate-200 w-28">Memo No</th>
                    <th className="p-2.5 border-r border-slate-200 w-24">Date</th>
                    <th className="p-2.5 border-r border-slate-200 w-28">Returnable</th>
                    <th className="p-2.5 border-r border-slate-200 min-w-[200px]">Item Description</th>
                    <th className="p-2.5 border-r border-slate-200 w-20 text-center">Purity</th>
                    <th className="p-2.5 border-r border-slate-200 w-24 text-right">Net Wt</th>
                    <th className="p-2.5 border-r border-slate-200 w-28 text-right">Est. Value (₹)</th>
                    <th className="p-2.5 border-r border-slate-200 w-36 text-center">Approval Status</th>
                    <th className="p-2.5 w-20 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
                  {consignmentItems.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-2.5 border-r border-slate-200 text-center">
                        <input
                          type="checkbox"
                          checked={c.selected}
                          onChange={(e) => {
                            const updated = [...consignmentItems];
                            updated[idx].selected = e.target.checked;
                            setConsignmentItems(updated);
                          }}
                          className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5"
                        />
                      </td>
                      <td className="p-2.5 border-r border-slate-200 font-bold text-amber-800">{c.memo_no}</td>
                      <td className="p-2.5 border-r border-slate-200 text-slate-500">{c.memo_date}</td>
                      <td className="p-2.5 border-r border-slate-200 text-rose-600 font-bold">{c.returnable_date}</td>
                      <td className="p-2.5 border-r border-slate-200 font-sans font-bold text-slate-900">
                        {c.item_name}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-center font-bold text-slate-700">
                        {c.purity}%
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-right font-bold text-blue-900">
                        {formatWeight(c.net_wt)}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-right font-bold text-emerald-700">
                        {formatCurrency(c.estimated_amount)}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 text-center font-sans">
                        <select
                          value={c.status}
                          onChange={(e) => {
                            const updated = [...consignmentItems];
                            updated[idx].status = e.target.value as any;
                            setConsignmentItems(updated);
                          }}
                          className={`px-2 py-1 rounded text-xs font-bold border ${
                            c.status === 'Approved for Invoicing'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : c.status === 'Returned to Supplier'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="Pending Inspection">Pending Inspection</option>
                          <option value="Approved for Invoicing">Approved for Invoicing</option>
                          <option value="Returned to Supplier">Returned to Supplier</option>
                        </select>
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => setConsignmentItems(consignmentItems.filter((_, i) => i !== idx))}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Remove Memo"
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
        )}

        {/* ========================================================== */}
        {/* TAB 7: CASH & METAL SETTLEMENT / BHAV CUT */}
        {/* ========================================================== */}
        {(viewMode === 'single_screen' || activeTab === 'stock_cash_settlement') && (
          <div className="bg-white border border-sky-200/90 rounded-2xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-200">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-blue-950 uppercase tracking-wider">
                    Metal Cut (Bhav Cut) & Cash Arbitrage Settlement
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Fix metal rates for outstanding fine gold grams or surrender pure bullion bars
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                  Current Market 24K: ₹{goldRate || 7650}/g
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bhav Cut Rate Fixation Calculator */}
              <div className="p-4 bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200 rounded-2xl space-y-3 text-xs">
                <span className="font-semibold text-amber-950 uppercase tracking-wider block border-b border-amber-200 pb-1.5 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-700" /> Bhav Cut (Gold Rate Fixation)
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">Fine Gold Grams to Fix</label>
                    <input
                      type="number"
                      step={0.001}
                      value={bhavCutGrams}
                      onChange={(e) => setBhavCutGrams(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl font-mono font-semibold text-amber-950 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">Agreed Bhav Cut Rate (₹/g)</label>
                    <input
                      type="number"
                      value={bhavCutRate}
                      onChange={(e) => setBhavCutRate(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl font-mono font-semibold text-slate-900 text-xs text-right"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white border border-amber-300 rounded-xl flex justify-between items-center">
                  <span className="font-semibold text-amber-900 text-xs">Calculated Settlement Value:</span>
                  <span className="text-base font-mono font-semibold text-amber-950">
                    {formatCurrency(bhavCutGrams * bhavCutRate)}
                  </span>
                </div>

                <button
                  onClick={handleApplyBhavCut}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Apply Bhav Cut & Credit to Invoice
                </button>
              </div>

              {/* Pure Bullion Physical Surrender */}
              <div className="p-4 bg-gradient-to-br from-indigo-50/60 to-blue-50/40 border border-indigo-200 rounded-2xl space-y-3 text-xs">
                <span className="font-semibold text-indigo-950 uppercase tracking-wider block border-b border-indigo-200 pb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-700" /> Pure Bullion Bar Surrender
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">Surrender Bar Gross Wt (g)</label>
                    <input
                      type="number"
                      step={0.001}
                      value={surrenderMetalGrossWt}
                      onChange={(e) => setSurrenderMetalGrossWt(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 bg-white border border-indigo-300 rounded-xl font-mono font-semibold text-indigo-950 text-xs text-right"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-600 block mb-1">Purity (%)</label>
                    <input
                      type="number"
                      step={0.1}
                      value={surrenderMetalPurity}
                      onChange={(e) => setSurrenderMetalPurity(parseFloat(e.target.value) || 99.9)}
                      className="w-full px-2.5 py-1.5 bg-white border border-indigo-300 rounded-xl font-mono font-semibold text-slate-900 text-xs text-center"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white border border-indigo-300 rounded-xl flex justify-between items-center">
                  <span className="font-semibold text-indigo-900 text-xs">Fine Weight Equivalent:</span>
                  <span className="text-base font-mono font-semibold text-indigo-950">
                    {formatWeight((surrenderMetalGrossWt * surrenderMetalPurity) / 100)}
                  </span>
                </div>

                <button
                  onClick={() =>
                    alert(`✅ Physical Pure Bar Surrender of ${surrenderMetalGrossWt}g recorded in Metal Ledger.`)
                  }
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Record Bullion Surrender to Supplier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. MODALS */}
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
        phone={currentSupplier.phone}
        defaultMessage={`Purchase Invoice ${header.invoice_no} acknowledged. Total: ${formatCurrency(payment.bill_amount)}, Balance: ${formatCurrency(payment.net_balance)}.`}
      />

      {/* Quick Add Vendor Modal */}
      {showQuickVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl shadow-2xl border bg-white border-slate-200 text-slate-900 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-white/20 text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">Add New Vendor to Master</h2>
                  <p className="text-[11px] text-blue-100">Once saved, vendor appears in purchase dropdown automatically</p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickVendorModal(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!quickVendor.name.trim()) {
                  alert('Please enter Vendor / Supplier Name');
                  return;
                }
                const newVendor: Vendor = {
                  id: `ven-${Date.now()}`,
                  vendor_code: quickVendor.code.trim().toUpperCase() || `SUP-${Date.now().toString().slice(-3)}`,
                  vendor_name: quickVendor.name.trim(),
                  vendor_type: quickVendor.type,
                  phone: quickVendor.phone.trim() || '+91 98200 11223',
                  city: quickVendor.city.trim() || 'Mumbai',
                  state: quickVendor.state || 'Maharashtra (27)',
                  gstin: quickVendor.gstin.trim().toUpperCase() || '',
                  opening_balance_cash: Number(quickVendor.opening_balance_cash) || 0,
                  balance_type: quickVendor.balance_type,
                  status: 'Active',
                  created_at: new Date().toISOString().slice(0, 10),
                };

                if (onSaveVendor) {
                  onSaveVendor(newVendor);
                }
                handleSelectSupplier(vendorToSupplierProfile(newVendor));
                setShowQuickVendorModal(false);
                alert(`✅ Vendor "${newVendor.vendor_name}" (${newVendor.vendor_code}) added and selected for this purchase!`);
              }}
              className="p-5 space-y-3.5 text-xs overflow-y-auto font-sans"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Vendor / Supplier Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={quickVendor.name}
                    onChange={(e) => setQuickVendor({ ...quickVendor, name: e.target.value })}
                    placeholder="e.g. Omkar Ornaments Rajkot"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Vendor Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={quickVendor.code}
                    onChange={(e) => setQuickVendor({ ...quickVendor, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SUP-108"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Category / Type</label>
                  <select
                    value={quickVendor.type}
                    onChange={(e) => setQuickVendor({ ...quickVendor, type: e.target.value as VendorType })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 cursor-pointer"
                  >
                    <option value="Bullion Dealer">Bullion Dealer</option>
                    <option value="Manufacturer / Karigar">Manufacturer / Karigar</option>
                    <option value="Casting Unit">Casting Unit</option>
                    <option value="Diamond Merchant">Diamond Merchant</option>
                    <option value="Silver Artisan">Silver Artisan</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Packaging & Others">Packaging & Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={quickVendor.phone}
                    onChange={(e) => setQuickVendor({ ...quickVendor, phone: e.target.value })}
                    placeholder="e.g. 9825012345"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={quickVendor.city}
                    onChange={(e) => setQuickVendor({ ...quickVendor, city: e.target.value })}
                    placeholder="e.g. Rajkot / Mumbai / Surat"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    maxLength={15}
                    value={quickVendor.gstin}
                    onChange={(e) => setQuickVendor({ ...quickVendor, gstin: e.target.value.toUpperCase() })}
                    placeholder="e.g. 24AABCO1234K1Z2"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={quickVendor.state}
                    onChange={(e) => setQuickVendor({ ...quickVendor, state: e.target.value })}
                    placeholder="e.g. Gujarat (24) / Maharashtra (27)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Opening Cash Balance (₹)</label>
                  <input
                    type="number"
                    value={quickVendor.opening_balance_cash}
                    onChange={(e) => setQuickVendor({ ...quickVendor, opening_balance_cash: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Balance Type</label>
                  <select
                    value={quickVendor.balance_type}
                    onChange={(e) => setQuickVendor({ ...quickVendor, balance_type: e.target.value as 'Cr' | 'Dr' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 cursor-pointer"
                  >
                    <option value="Cr">Cr - Payable (आपण देणे)</option>
                    <option value="Dr">Dr - Advance (आगाऊ दिली)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowQuickVendorModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Select Vendor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
