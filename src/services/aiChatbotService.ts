import {
  AccountMaster,
  Vendor,
  NewOrderBookingRecord,
  RefineryRecord,
  PurchaseRecord,
  DayBookEntry,
  DayBookSummary,
  SundryDebtorRow,
  StockItem,
} from '../types/erp';
import { formatCurrency, formatWeight, calculateTaxes, roundTo } from '../utils/calculations';

export type ChatLanguage = 'auto' | 'en' | 'mr' | 'hi';

export interface BhishiMember {
  id: string;
  member_no: string;
  name: string;
  phone: string;
  monthly_amt: number;
  tenure_months: number;
  installments_paid: number;
  accumulated_amt: number;
  gold_wt_accrued: number;
  bonus_contribution: number;
  status: string;
}

export const INITIAL_BHISHI_MEMBERS: BhishiMember[] = [
  {
    id: 'sch-1',
    member_no: 'SN-2026-081',
    name: 'Sunita Patil',
    phone: '9820556677',
    monthly_amt: 5000,
    tenure_months: 11,
    installments_paid: 8,
    accumulated_amt: 40000,
    gold_wt_accrued: 5.625,
    bonus_contribution: 5000,
    status: 'Active (8/11)',
  },
  {
    id: 'sch-2',
    member_no: 'SN-2026-092',
    name: 'Kavita Joshi',
    phone: '9819443322',
    monthly_amt: 10000,
    tenure_months: 11,
    installments_paid: 11,
    accumulated_amt: 110000,
    gold_wt_accrued: 15.420,
    bonus_contribution: 10000,
    status: 'Matured - Ready for Jewellery Redemption',
  },
  {
    id: 'sch-3',
    member_no: 'SN-2026-104',
    name: 'Anjali Deshmukh',
    phone: '9822114477',
    monthly_amt: 5000,
    tenure_months: 11,
    installments_paid: 5,
    accumulated_amt: 25000,
    gold_wt_accrued: 3.510,
    bonus_contribution: 5000,
    status: 'Active (5/11)',
  },
  {
    id: 'sch-4',
    member_no: 'SN-2026-115',
    name: 'Pooja Kulkarni',
    phone: '9823998811',
    monthly_amt: 15000,
    tenure_months: 11,
    installments_paid: 10,
    accumulated_amt: 150000,
    gold_wt_accrued: 21.050,
    bonus_contribution: 15000,
    status: 'Active (10/11 - Due Next Month)',
  },
];

export interface CustomerVisitRecord {
  id: string;
  time: string;
  name: string;
  phone: string;
  purpose: string;
  item_details: string;
  invoice_or_ref: string;
  amount: number;
  payment_mode: string;
  salesman: string;
  status: string;
}

export const INITIAL_TODAY_VISITS: CustomerVisitRecord[] = [
  {
    id: 'vis-1',
    time: '10:30 AM',
    name: 'Sunita Patil',
    phone: '9820556677',
    purpose: '🪙 Bhishi Installment Deposit',
    item_details: 'Swarna Nidhi Month #8 Installment',
    invoice_or_ref: 'SN-2026-081',
    amount: 5000,
    payment_mode: 'UPI (GPay)',
    salesman: 'Pooja Sharma (EMP-204)',
    status: 'Receipt Issued',
  },
  {
    id: 'vis-2',
    time: '11:15 AM',
    name: 'Rajesh Sharma',
    phone: '9820199887',
    purpose: '🛍️ Counter Sales Purchase',
    item_details: '22K 916 Royal Peacock Choker (31.3g)',
    invoice_or_ref: 'INV-2026-104',
    amount: 241010,
    payment_mode: 'Split (Cash + UPI)',
    salesman: 'Sagar Kulkarni (EMP-102)',
    status: 'Billed & Delivered',
  },
  {
    id: 'vis-3',
    time: '12:45 PM',
    name: 'Kavita Joshi',
    phone: '9819443322',
    purpose: '🪙 Bhishi Maturity & Redemption',
    item_details: '22K Gold Bangles Selection',
    invoice_or_ref: 'SN-2026-092',
    amount: 110000,
    payment_mode: 'Scheme Redemption',
    salesman: 'Pooja Sharma (EMP-204)',
    status: 'Selecting Ornaments',
  },
  {
    id: 'vis-4',
    time: '02:20 PM',
    name: 'Smt. Ananya Joshi',
    phone: '9820123456',
    purpose: '📋 Custom Bridal Order Booking',
    item_details: '22K Temple Haar (45g) with Ruby',
    invoice_or_ref: 'ORD-2026-108',
    amount: 25000,
    payment_mode: 'Cash Advance',
    salesman: 'Amit Verma (EMP-105)',
    status: 'In Workshop Queue',
  },
  {
    id: 'vis-5',
    time: '03:40 PM',
    name: 'Pooja Mehta',
    phone: '9819033445',
    purpose: '🔥 Old Gold Exchange & Scrap Sale',
    item_details: 'Old 20K Bangles (18.5g Scrap)',
    invoice_or_ref: 'REF-2026-074',
    amount: 115200,
    payment_mode: 'Metal Adjusted in Bill',
    salesman: 'Sagar Kulkarni (EMP-102)',
    status: 'Assay Completed',
  },
  {
    id: 'vis-6',
    time: '04:30 PM',
    name: 'Amit Deshmukh',
    phone: '9822114488',
    purpose: '🔍 24K Bullion Rate Inquiry',
    item_details: '10g 24K Gold Bar IBJA Rate',
    invoice_or_ref: 'Enquiry #442',
    amount: 0,
    payment_mode: 'Walk-in Consultation',
    salesman: 'Pooja Sharma (EMP-204)',
    status: 'Quotation Given',
  },
  {
    id: 'vis-7',
    time: '05:15 PM',
    name: 'Ramesh Kulkarni',
    phone: '9823456789',
    purpose: '💵 Debtors Ledger Part Payment',
    item_details: 'Ledger Clearance (Bill #INV-88)',
    invoice_or_ref: 'DB-REC-309',
    amount: 15000,
    payment_mode: 'Cash Received',
    salesman: 'Counter Cashier',
    status: 'Receipt Issued',
  },
  {
    id: 'vis-8',
    time: '06:00 PM',
    name: 'Walk-in Patron (Mrs. Shinde)',
    phone: '9820771122',
    purpose: '🛠️ Earring Stem Repair & Laser Polish',
    item_details: '22K Jhumka Repair',
    invoice_or_ref: 'JOB-REP-12',
    amount: 450,
    payment_mode: 'Cash',
    salesman: 'Karagir Desk',
    status: 'Delivered',
  },
];

export interface ChatTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  format?: 'text' | 'weight' | 'currency' | 'badge' | 'number';
}

export interface ChatTableData {
  title: string;
  subtitle?: string;
  columns: ChatTableColumn[];
  rows: Record<string, any>[];
  footerSummary?: Record<string, any>;
  navigationAction?: { label: string; section: string; subView?: string };
}

// Step definition for guided interactive task flows
export interface WorkflowStep {
  id: string;
  field: string;
  question: string;
  questionMr?: string;
  questionHi?: string;
  subtext?: string;
  type: 'text' | 'number' | 'select' | 'date' | 'currency' | 'weight' | 'purity';
  options?: { label: string; value: string | number; sub?: string }[];
  placeholder?: string;
  defaultValue?: string | number | ((data: Record<string, any>, context: ErpContext) => string | number);
  validate?: (value: any, data: Record<string, any>) => { valid: boolean; error?: string };
  computeDerived?: (value: any, currentData: Record<string, any>, context: ErpContext) => Record<string, any>;
  quickPresets?: (string | number)[];
}

export type TaskType =
  | 'purchase_inward'
  | 'barcode_generate'
  | 'sales_invoice'
  | 'order_booking'
  | 'refinery_melting'
  | 'account_create'
  | 'daybook_expense';

export interface TaskWorkflow {
  id: TaskType;
  name: string;
  icon: string;
  description: string;
  steps: WorkflowStep[];
  successMessage: string;
  navigationTarget: { section: string; subView?: string };
}

export interface ErpContext {
  accounts: AccountMaster[];
  orders: NewOrderBookingRecord[];
  purchases: PurchaseRecord[];
  stockItems: StockItem[];
  daybook: DayBookEntry[];
  daybookSummary?: DayBookSummary;
  debtors: SundryDebtorRow[];
  refineries: RefineryRecord[];
  gold24kRate: number;
  gold22kRate: number;
  silverRate: number;
  branchName?: string;
  bhishiMembers?: BhishiMember[];
  customerVisits?: CustomerVisitRecord[];
  vendors?: Vendor[];
}

export interface ScreenDirectionData {
  screenId: string;
  screenName: string;
  section: string;
  subView?: string;
  shortcut: string;
  icon: string;
  description: string;
  reason?: string;
  relatedActions?: { label: string; action: string; payload?: any }[];
}

export interface ErpScreenDefinition {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  section: string;
  subView?: string;
  shortcut: string;
  icon: string;
  description: string;
  descriptionMr: string;
  descriptionHi: string;
  keywords: string[];
  tasks?: TaskType[];
  actions?: { label: string; action: string; payload?: any }[];
}

export const ERP_SCREENS: ErpScreenDefinition[] = [
  {
    id: 'sales_invoice',
    name: 'Sales POS Counter & Hallmarking Billing',
    nameMr: 'विक्री बिलिंग व हॉलमार्किंग (Sales POS)',
    nameHi: 'बिक्री बिलिंग व हॉलमार्किंग (Sales POS)',
    section: 'transactions',
    subView: 'sales_invoice',
    shortcut: 'F4',
    icon: '💰',
    description: 'Counter POS sales, 3% GST calculation, barcode tag scanning, BIS HUID 6-digit hallmarking, old gold exchange deduction, multi-mode payment settlements.',
    descriptionMr: 'दागिने विक्री बिलिंग, ३% जीएसटी हिशोब, बारकोड स्कॅनिंग, BIS HUID नोंद, जुने सोने वजावट आणि बिल प्रिंट.',
    descriptionHi: 'आभूषण बिक्री बिलिंग, ३% जीएसटी गणना, बारकोड स्कैनिंग, BIS HUID सत्यापन, पुराना सोना एक्सचेंज और बिल प्रिंट।',
    keywords: [
      'sale', 'sales', 'pos', 'bill', 'billing', 'invoice', 'counter', 'gst bill', 'cash memo', 'tax invoice', 'sell', 'customer bill', 'jewellery bill', 'retail', 'counter sales',
      'विक्री', 'बिल', 'बिलिंग', 'पावती', 'बिक्री', 'काउंटर', 'हॉलमार्क बिल', 'जीएसटी बिल', 'विक्री बिल', 'सोने विक्री', 'कस्टमर बिल'
    ],
    tasks: ['sales_invoice'],
    actions: [
      { label: '🚀 Open Sales POS (F4)', action: 'navigate', payload: { section: 'transactions', subView: 'sales_invoice' } },
      { label: '💰 Start AI POS Bill', action: 'start_task', payload: 'sales_invoice' }
    ]
  },
  {
    id: 'purchase',
    name: 'Purchase Inward & Supplier Lot Entry',
    nameMr: 'खरेदी नोंद व सप्लायर लॉट इनवर्ड (Purchase)',
    nameHi: 'खरीद इनवर्ड व सप्लायर लॉट प्रविष्टि (Purchase)',
    section: 'transactions',
    subView: 'purchase',
    shortcut: 'F5',
    icon: '🛒',
    description: 'Bullion dealer & manufacturer purchase inward, weight-wise & lot-wise entry, fine gold calculation, melting touch recovery, supplier vouchers.',
    descriptionMr: 'सप्लायर व बुलियन व्यापाऱ्यांकडून माल खरेदी, ग्रॅम व लॉट नोंद, शुद्ध सोने हिशोब आणि खरेदी पावती.',
    descriptionHi: 'थोक सप्लायर व बुलियन व्यापारियों से खरीद इनवर्ड, ग्राम व लॉट प्रविष्टि, शुद्ध सोना गणना और खरीद वाउचर।',
    keywords: [
      'purchase', 'buy', 'inward', 'supplier', 'bullion', 'wholesale', 'lot', 'dealer', 'vendor', 'purchase bill', 'stock inward',
      'खरेदी', 'सप्लायर', 'माल इनवर्ड', 'खरीद', 'बुलियन व्यापारी', 'कच्चा माल', 'खरेदी बिल', 'माल खरेदी'
    ],
    tasks: ['purchase_inward'],
    actions: [
      { label: '🚀 Open Purchase (F5)', action: 'navigate', payload: { section: 'transactions', subView: 'purchase' } },
      { label: '🛒 Record Inward with AI', action: 'start_task', payload: 'purchase_inward' }
    ]
  },
  {
    id: 'barcode',
    name: 'Barcode Studio & Thermal Label Printing',
    nameMr: 'बारकोड स्टुडिओ व थर्मल लेबल प्रिंटिंग (Barcode Studio)',
    nameHi: 'बारकोड स्टूडियो व थर्मल लेबल प्रिंटिंग (Barcode Studio)',
    section: 'masters',
    subView: 'barcode',
    shortcut: 'F3',
    icon: '🏷️',
    description: 'Jewellery barcode tag generation, BIS HUID 6-digit alphanumeric tagging, QR codes, 50x25mm / butterfly label printing, unprinted queue management.',
    descriptionMr: 'दागिन्यांचे बारकोड टॅग, BIS HUID ६-अंकी कोड, QR कोड जनरेशन आणि थर्मल स्टिकर लेबल प्रिंटिंग.',
    descriptionHi: 'आभूषण बारकोड टैग, BIS HUID ६-अंक कोड, QR कोड और थर्मल स्टीकर लेबल प्रिंटिंग।',
    keywords: [
      'barcode', 'tag', 'label', 'huid', 'thermal', 'print tag', 'stickers', 'bar code', 'unprinted', 'tagging', 'qr code', 'thermal printer',
      'बारकोड', 'टॅग', 'लेबल', 'प्रिंट', 'टैग', 'स्टिकर', 'अनप्रिंटेड', 'हॉलमार्क टॅग', 'बारकोड स्टुडिओ', 'प्रिंटर'
    ],
    tasks: ['barcode_generate'],
    actions: [
      { label: '🚀 Open Barcode Studio (F3)', action: 'navigate', payload: { section: 'masters', subView: 'barcode' } },
      { label: '✨ Create Barcode with AI', action: 'start_task', payload: 'barcode_generate' }
    ]
  },
  {
    id: 'item_creation',
    name: 'Item Creation & Master Directory',
    nameMr: 'नवीन आयटम व दागिना निर्मिती (Item Creation)',
    nameHi: 'नया आइटम व आभूषण निर्माण (Item Creation)',
    section: 'masters',
    subView: 'item_creation',
    shortcut: 'F2',
    icon: '💎',
    description: 'Ornament master directory, category setup (22K/24K/18K Gold, Silver, Diamond, 1gm Imitation), HSN 7113 codes, standard wastage % and making charge presets.',
    descriptionMr: 'दागिना प्रकार मास्टर, कॅटेगरी (सोने, चांदी, हिरे, १ ग्रॅम), HSN कोड, मानक घट (Wastage %) व मजुरी दर सेटिंग.',
    descriptionHi: 'आभूषण मास्टर, श्रेणी (सोना, चांदी, हीरा, १ ग्राम), HSN कोड, मानक वेस्टेज % और मजदूरी दर सेटिंग।',
    keywords: [
      'item creation', 'create item', 'new ornament', 'ornament master', 'hsn', 'wastage', 'making charge preset', 'product category',
      'आयटम निर्मिती', 'नवीन दागिना', 'दागिना प्रकार', 'कॅटेगरी', 'आइटम निर्माण', 'नया जेवर', 'वेस्टेज सेटिंग'
    ],
    actions: [
      { label: '🚀 Open Item Creation (F2)', action: 'navigate', payload: { section: 'masters', subView: 'item_creation' } }
    ]
  },
  {
    id: 'new_order',
    name: 'Custom Customer Order Booking',
    nameMr: 'कस्टम ग्राहक ऑर्डर बुकिंग (Order Booking)',
    nameHi: 'कस्टम ग्राहक ऑर्डर बुकिंग (Order Booking)',
    section: 'transactions',
    subView: 'new_order',
    shortcut: 'F7',
    icon: '📋',
    description: 'Custom bridal jewellery orders, Karigar job work assignment, delivery schedule tracking, advance cash/metal booking, rate lock-in protection.',
    descriptionMr: 'ग्राहकांची कस्टम ऑर्डर, कारागीर वर्क ऑर्डर, डिलिव्हरी तारीख, ॲडव्हान्स कॅश/सोने जमा आणि भाव लॉक सुविधा.',
    descriptionHi: 'ग्राहक कस्टम ऑर्डर, कारीगर वर्क ऑर्डर, डिलीवरी दिनांक, एडवांस कैश/सोना जमा और रेट लॉक सुविधा।',
    keywords: [
      'order', 'booking', 'custom order', 'karigar order', 'advance', 'promised date', 'job work', 'bridal order', 'custom design',
      'ऑर्डर', 'बुकिंग', 'कस्टम दागिना', 'ॲडव्हान्स', 'कारागीर ऑर्डर', 'ग्राहक ऑर्डर', 'कामाचा आदेश'
    ],
    tasks: ['order_booking'],
    actions: [
      { label: '🚀 Open Order Booking (F7)', action: 'navigate', payload: { section: 'transactions', subView: 'new_order' } },
      { label: '📋 Book Order with AI', action: 'start_task', payload: 'order_booking' }
    ]
  },
  {
    id: 'refinery_in',
    name: 'Refinery, Old Gold Melting & Touch Recovery',
    nameMr: 'जुने सोने गाळणे, रिफायनरी व टंच तपासणी (Refinery)',
    nameHi: 'पुराना सोना गलाई, रिफाइनरी व टंच जांच (Refinery)',
    section: 'transactions',
    subView: 'refinery_in',
    shortcut: 'F6',
    icon: '🔥',
    description: 'Old gold scrap (URD) inward, melting weight loss computation, fire assay touch %, fine gold 24K bar recovery, refinery settlement vouchers.',
    descriptionMr: 'जुने मोड सोने गाळणे (Melting), टंच तपासणी, २४ कॅरेट शुद्ध सोने रिकव्हरी आणि रिफायनरी पावती हिशोब.',
    descriptionHi: 'पुराना स्क्रैप सोना गलाई, टंच टेस्टिंग, २४ कैरेट शुद्ध सोना रिकवरी और रिफाइनरी वाउचर हिसाब।',
    keywords: [
      'refinery', 'melting', 'touch', 'old gold', 'scrap', 'urd', 'assay', 'fine gold recovery', 'goldsmith melting', 'fire assay',
      'रिफायनरी', 'गाळणे', 'टंच', 'जुने सोने', 'स्क्रॅप', 'शुद्धता चाचणी', 'गलाई', 'सोने गाळणे', 'मोड'
    ],
    tasks: ['refinery_melting'],
    actions: [
      { label: '🚀 Open Refinery (F6)', action: 'navigate', payload: { section: 'transactions', subView: 'refinery_in' } },
      { label: '🔥 Record Old Gold with AI', action: 'start_task', payload: 'refinery_melting' }
    ]
  },
  {
    id: 'account_master',
    name: 'Account Master & Ledger Directory',
    nameMr: 'खाते वही व पार्टी मास्टर (Account Master)',
    nameHi: 'खाता बही व पार्टी मास्टर (Account Master)',
    section: 'masters',
    subView: 'account_master',
    shortcut: 'Alt+M',
    icon: '👤',
    description: 'Directory for customers, suppliers, Karigars (goldsmiths), banks, expense ledgers, credit limits, PAN/GSTIN records.',
    descriptionMr: 'ग्राहक, सप्लायर, कारागीर, बँक व खर्चाची नवीन खाती उघडणे, फोन नंबर, पत्ता आणि जीएसटी नोंद.',
    descriptionHi: 'ग्राहक, सप्लायर, कारीगर, बैंक व खर्च के नए खाते खोलना, फोन नंबर, पता और जीएसटी प्रविष्टि।',
    keywords: [
      'account', 'party', 'customer master', 'supplier master', 'karigar master', 'ledger master', 'party creation', 'new account',
      'खाते', 'ग्राहक नोंद', 'सप्लायर खाते', 'कारागीर', 'पार्टी मास्टर', 'खाता', 'नवीन खाते', 'खातेदार'
    ],
    tasks: ['account_create'],
    actions: [
      { label: '🚀 Open Account Master', action: 'navigate', payload: { section: 'masters', subView: 'account_master' } },
      { label: '👤 Create Account with AI', action: 'start_task', payload: 'account_create' }
    ]
  },
  {
    id: 'vendor_master',
    name: 'Vendor & Bullion Supplier Master Management',
    nameMr: 'सप्लायर व व्हेंडर मास्टर (Vendor Master)',
    nameHi: 'सप्लायर व वेंडर मास्टर (Vendor Master)',
    section: 'masters',
    subView: 'vendor_master',
    shortcut: 'Alt+V',
    icon: '🏢',
    description: 'Comprehensive directory of Bullion Dealers, Manufacturers, Casting Units, Diamond Merchants, and Silver Artisans with GSTIN state routing, bank RTGS/NEFT details, and metal/cash credit balances.',
    descriptionMr: 'बुलियन व्यापारी, मॅन्युफॅक्चरर, कास्टिंग युनिट, डायमंड मर्चंट आणि चांदी कारागिरांची संपूर्ण नोंद, बँक खाती व येणे/देणे सोने-कॅश हिशोब.',
    descriptionHi: 'बुलियन व्यापारी, मैन्युफैक्चरर, कास्टिंग यूनिट, डायमंड मर्चेंट और चांदी कारीगरों की विस्तृत सूची, बैंक खाते और सोना/कैश बकाया हिसाब।',
    keywords: [
      'vendor', 'vendors', 'supplier', 'suppliers', 'vendor master', 'supplier master', 'bullion dealer', 'manufacturer', 'karigar vendor', 'casting unit', 'diamond merchant', 'dealer list', 'wholesaler',
      'व्हेंडर', 'सप्लायर', 'सप्लायर मास्टर', 'व्यापारी', 'बुलियन डीलर', 'व्हेंडर यादी', 'सप्लायर यादी', 'कारखानदार', 'होलसेलर', 'सप्लायर लिस्ट', 'वेंडर'
    ],
    actions: [
      { label: '🚀 Open Vendor Master', action: 'navigate', payload: { section: 'masters', subView: 'vendor_master' } },
      { label: '🛒 Go to Purchase Invoice (F5)', action: 'navigate', payload: { section: 'transactions', subView: 'purchase' } }
    ]
  },
  {
    id: 'day_book',
    name: 'Day Book Register & Cash Counter',
    nameMr: 'डे बुक रजिस्टर व दैनिक कॅश काउंटर (Day Book)',
    nameHi: 'डे बुक रजिस्टर व दैनिक कैश काउंटर (Day Book)',
    section: 'accounts',
    subView: 'day_book',
    shortcut: 'F10',
    icon: '💵',
    description: 'Daily transaction journal, counter cash collections & disbursements, bank/UPI entries, drawer reconciliation, daily audit summary.',
    descriptionMr: 'दैनिक जमा-खर्च वही, गल्ल्यातील कॅश हिशोब, बँक/UPI जमा, व्हाउचर नोंद आणि दिवसअखेर ताळेबंद.',
    descriptionHi: 'दैनिक जमा-खर्च बही, गल्ले का नकद हिसाब, बैंक/UPI जमा, वाउचर प्रविष्टि और दैनिक ऑडिट।',
    keywords: [
      'daybook', 'day book', 'till', 'cash counter', 'daily cash', 'journal', 'vouchers', 'cash in', 'cash out', 'galla', 'drawer balance',
      'डे बुक', 'गल्ला', 'दैनिक व्यवहार', 'कॅश काउंटर', 'जमा खर्च', 'दैनिक हिशोब', 'व्हाउचर', 'कॅश जमा'
    ],
    tasks: ['daybook_expense'],
    actions: [
      { label: '🚀 Open Day Book (F10)', action: 'navigate', payload: { section: 'accounts', subView: 'day_book' } },
      { label: '💵 Record Voucher with AI', action: 'start_task', payload: 'daybook_expense' }
    ]
  },
  {
    id: 'stock_report',
    name: 'Live Stock Report & Metal Valuation',
    nameMr: 'थेट स्टॉक रिपोर्ट व धातू मूल्यांकन (Stock Report)',
    nameHi: 'लाइव स्टॉक रिपोर्ट व धातु मूल्यांकन (Stock Report)',
    section: 'stock',
    subView: 'stock_report',
    shortcut: 'F9',
    icon: '📦',
    description: 'Live physical inventory by category (24K Bullion, 22K 916, 18K, Silver, Diamond, Loose Lots), gross/net/fine weights, live valuation.',
    descriptionMr: 'शोरूममधील उपलब्ध सोने-चांदी शिल्लक, ग्रॅम व तोळे वजन, २४K/२२K/१८K प्रकार, विना-टॅग लूज स्टॉक आणि एकूण भांडवली मूल्य.',
    descriptionHi: 'शोरूम में उपलब्ध सोना-चांदी स्टॉक, ग्राम व तोला वजन, २४K/२२K/१८K प्रकार, बिना-टैग लूज स्टॉक और कुल स्टॉक मूल्य।',
    keywords: [
      'stock', 'inventory', 'total gold', 'stock report', 'metal balance', 'loose stock', 'valuation', 'gold weight', 'available gold', 'tola',
      'स्टॉक', 'शिल्लक सोने', 'माल साठा', 'एकूण सोनं', 'मूल्यांकन', 'उपलब्ध सोने', 'तोळा', 'सोने वजन'
    ],
    actions: [
      { label: '🚀 Open Stock Report (F9)', action: 'navigate', payload: { section: 'stock', subView: 'stock_report' } }
    ]
  },
  {
    id: 'account_display',
    name: 'Multi-Account T-Ledger Display',
    nameMr: 'खाते लेजर व कारागीर हिशोब (Account Display)',
    nameHi: 'खाता लेजर व कारीगर हिसाब (Account Display)',
    section: 'accounts',
    subView: 'account_display',
    shortcut: 'F8',
    icon: '📖',
    description: 'Detailed debit/credit ledger statement, Karigar fine gold balances, supplier payment records, party-wise running balance.',
    descriptionMr: 'पार्टीनिहाय लेजर स्टेटमेंट, कारागीर शुद्ध सोने जमा-उधार हिशोब, सप्लायर पेमेंट आणि संपूर्ण खाते उतारा.',
    descriptionHi: 'पार्टी अनुसार लेजर स्टेटमेंट, कारीगर शुद्ध सोना हिसाब, सप्लायर पेमेंट और विस्तृत खाता विवरण।',
    keywords: [
      'ledger', 'statement', 'account display', 'karigar ledger', 't-ledger', 'running balance', 'party statement', 'account copy',
      'लेजर', 'खाते उतारा', 'कारागीर हिशोब', 'स्टेटमेंट', 'पार्टी लेजर', 'खाता बही'
    ],
    actions: [
      { label: '🚀 Open Account Ledger (F8)', action: 'navigate', payload: { section: 'accounts', subView: 'account_display' } }
    ]
  },
  {
    id: 'book_display',
    name: 'Sundry Debtors & Outstanding Credit Book',
    nameMr: 'उधारी ग्राहक यादी व बाकी सोने/रक्कम (Book Display)',
    nameHi: 'उधारी ग्राहक सूची व बकाया सोना/रकम (Book Display)',
    section: 'accounts',
    subView: 'book_display',
    shortcut: 'F11',
    icon: '👥',
    description: 'Customer credit ledger, outstanding receivables, pending metal weights in grams, credit aging, collection contact directory.',
    descriptionMr: 'उधारीवर गेलेला माल, ग्राहकांकडे येणे असलेली बाकी रक्कम व प्रलंबित सोने ग्रॅम, फोन नंबर व वसुली यादी.',
    descriptionHi: 'उधारी पर गया माल, ग्राहकों से बकाया नकद व लंबित सोना ग्राम, फोन नंबर और वसूली सूची।',
    keywords: [
      'debtor', 'debtors', 'sundry debtors', 'outstanding', 'credit', 'pending payment', 'udhari', 'receivables', 'customer balance',
      'उधारी', 'बाकी रक्कम', 'ग्राहक बाकी', 'थकबाकी', 'उधारी यादी', 'येणे रक्कम', 'उधारी ग्राहक'
    ],
    actions: [
      { label: '🚀 Open Debtors Register (F11)', action: 'navigate', payload: { section: 'accounts', subView: 'book_display' } }
    ]
  },
  {
    id: 'gold_scheme',
    name: 'Swarna Nidhi - Monthly Gold Savings Scheme (Bhishi)',
    nameMr: 'सुवर्ण निधी मासिक भिशी योजना (Gold Scheme)',
    nameHi: 'स्वर्ण निधि मासिक भिशी योजना (Gold Scheme)',
    section: 'gold_scheme',
    shortcut: 'Gold Scheme',
    icon: '🪙',
    description: '11+1 Monthly Gold Accumulation Scheme, customer passbooks, monthly installment collection, bonus gold disbursement, maturity redemption.',
    descriptionMr: '११+१ मासिक सुवर्ण ठेव योजना, ग्राहक पासबुक, मासिक हप्ता पावती, १ महिन्याचा बोनस आणि मुदतपूर्ती दागिना खरेदी.',
    descriptionHi: '११+१ मासिक स्वर्ण बचत योजना, ग्राहक पासबुक, मासिक किश्त पावती, १ माह बोनस और परिपक्वता आभूषण खरीद।',
    keywords: [
      'gold scheme', 'bhishi', 'swarna nidhi', 'savings scheme', 'monthly installment', 'passbook', 'gold saving', 'scheme member',
      'भिशी', 'सुवर्ण निधी', 'मासिक योजना', 'बचत योजना', 'भिशी हप्ता', 'सुवर्ण संचय'
    ],
    actions: [
      { label: '🚀 Open Gold Scheme Center', action: 'navigate', payload: { section: 'gold_scheme' } }
    ]
  },
  {
    id: 'backup',
    name: 'Encrypted Cloud & USB Backup Manager',
    nameMr: 'डेटा बॅकअप मॅनेजर व क्लाउड सिंक (Backup Manager)',
    nameHi: 'डेटा बैकअप मैनेजर व क्लाउड सिंक (Backup Manager)',
    section: 'backup',
    shortcut: 'F12',
    icon: '💾',
    description: 'Automated daily encrypted SQL/JSON backups, USB flash drive export, Supabase cloud sync, disaster recovery safeguards.',
    descriptionMr: 'दैनंदिन डेटा बॅकअप, पेनड्राईव्ह / USB एक्सपोर्ट, क्लाउड ऑटो-सिंक आणि आपत्कालीन डेटा रिकव्हरी.',
    descriptionHi: 'दैनिक डेटा बैकअप, पेनड्राइव / USB निर्यात, क्लाउड ऑटो-सिंक और आपातकालीन डेटा सुरक्षा।',
    keywords: [
      'backup', 'data backup', 'usb', 'export data', 'restore', 'cloud sync', 'database backup', 'save data',
      'बॅकअप', 'डेटा सुरक्षितता', 'पेनड्राईव्ह', 'क्लाउड सिंक', 'डेटा सेव्ह', 'बॅकअप मॅनेजर'
    ],
    actions: [
      { label: '🚀 Open Backup Manager (F12)', action: 'navigate', payload: { section: 'backup' } }
    ]
  },
  {
    id: 'settings',
    name: 'Showroom Settings & Theme Customization',
    nameMr: 'शोरूम सेटिंग्ज व थीम कस्टमायझेशन (Settings)',
    nameHi: 'शोरूम सेटिंग्स व थीम कस्टमाइजेशन (Settings)',
    section: 'settings',
    shortcut: 'Settings',
    icon: '⚙️',
    description: 'Showroom name, GSTIN, BIS Hallmark license, thermal printer dimensions, theme switcher (Apple iOS Frosted Glass, Classic Gold, etc.).',
    descriptionMr: 'शोरूम नाव, पत्ता, जीएसटी नंबर, बीआयएस हॉलमार्क लायसन्स, प्रिंटर साइज आणि ॲपल आयओएस / क्लासिक गोल्ड थीम्स.',
    descriptionHi: 'दुकान का नाम, पता, जीएसटी नंबर, बीआईएस हॉलमार्क लाइसेंस, प्रिंटर आकार और ऐप्पल आईओएस / क्लासिक गोल्ड थीम्स।',
    keywords: [
      'setting', 'settings', 'theme', 'profile', 'gstin', 'printer', 'apple theme', 'ios theme', 'frosted glass', 'setup', 'preferences',
      'सेटिंग्ज', 'थीम', 'प्रोफाइल', 'प्रिंटर सेटिंग', 'शोरूम माहिती', 'ॲपल थीम', 'कस्टमायझेशन'
    ],
    actions: [
      { label: '🚀 Open ERP Settings', action: 'navigate', payload: { section: 'settings' } }
    ]
  },
  {
    id: 'messenger',
    name: 'Internal Showroom Messenger & Staff Chat',
    nameMr: 'अंतर्गत मेसेंजर व स्टाफ चॅट (Internal Messenger)',
    nameHi: 'आंतरिक मैसेंजर व स्टाफ चैट (Internal Messenger)',
    section: 'messenger',
    shortcut: 'Messenger',
    icon: '💬',
    description: 'Counter-to-counter instant messaging, Karigar job work instructions, urgent showroom alerts, owner broadcast messages.',
    descriptionMr: 'काउंन्टर ते काउंन्टर अंतर्गत मेसेजिंग, स्टाफ चॅट, कारागीर सूचना आणि मालक ब्रॉडकास्ट अलर्ट.',
    descriptionHi: 'काउंटर से काउंटर आंतरिक मैसेजिंग, स्टाफ चैट, कारीगर निर्देश और ओनर ब्रॉडकास्ट अलर्ट।',
    keywords: [
      'message', 'messenger', 'chat', 'staff', 'internal message', 'counter chat', 'communication',
      'मेसेंजर', 'चॅट', 'स्टाफ संदेश', 'निरोप', 'अंतर्गत मेसेज'
    ],
    actions: [
      { label: '🚀 Open Internal Messenger', action: 'navigate', payload: { section: 'messenger' } }
    ]
  },
  {
    id: 'dashboard',
    name: 'Executive Dashboard & Live Bullion Monitor',
    nameMr: 'मुख्य डॅशबोर्ड व थेट बाजार भाव (Dashboard)',
    nameHi: 'मुख्य डैशबोर्ड व लाइव बाजार भाव (Dashboard)',
    section: 'dashboard',
    shortcut: 'Home',
    icon: '📊',
    description: 'Real-time 24K/22K/Silver bullion ticker, daily turnover, top-selling ornaments, low stock alerts, quick ERP action launcher.',
    descriptionMr: 'थेट २४K/२२K सोने व चांदी भाव टिकर, आजची एकूण विक्री उलाढाल, टॉप दागिने आणि जलद ॲक्शन बटन्स.',
    descriptionHi: 'लाइव २४K/२२K सोना व चांदी दर टिकर, आज की कुल बिक्री टर्नओवर, टॉप आभूषण और त्वरित एक्शन बटन्स।',
    keywords: [
      'dashboard', 'home', 'overview', 'live rate', 'ticker', 'turnover', 'rates', 'gold rate', 'silver rate', 'market price',
      'डॅशबोर्ड', 'मुख्य पान', 'थेट भाव', 'उलाढाल', 'लाईव्ह भाव', 'बाजार भाव', 'सोने भाव', 'चांदी भाव'
    ],
    actions: [
      { label: '🚀 Open Main Dashboard', action: 'navigate', payload: { section: 'dashboard' } }
    ]
  },
  {
    id: 'field_dictionary',
    name: 'Field Preservation Audit & ERP Schema',
    nameMr: 'फील्ड ऑडिट व सिस्टीम डिक्शनरी (Field Dictionary)',
    nameHi: 'फील्ड ऑडिट व सिस्टम डिक्शनरी (Field Dictionary)',
    section: 'field_dictionary',
    shortcut: 'Dictionary',
    icon: '📚',
    description: 'Audit of 40+ jewellery ERP field preservation rules, database schema specifications, and compliance standards.',
    descriptionMr: '४०+ ज्वेलरी ईआरपी फील्ड ऑडिट नियम, डेटाबेस स्कीमा आणि सुवर्ण मानके तपासणी.',
    descriptionHi: '४०+ ज्वेलरी ईआरपी फील्ड ऑडिट नियम, डेटाबेस स्कीमा और मानक अनुपालन।',
    keywords: [
      'dictionary', 'field dictionary', 'audit', 'schema', 'preservation', 'spec',
      'डिक्शनरी', 'फील्ड ऑडिट', 'स्कीमा'
    ],
    actions: [
      { label: '🚀 Open Field Dictionary', action: 'navigate', payload: { section: 'field_dictionary' } }
    ]
  }
];

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  language?: 'en' | 'mr' | 'hi';
  activeTask?: {
    taskType: TaskType;
    stepIndex: number;
    collectedData: Record<string, any>;
  };
  tableData?: ChatTableData;
  screenDirection?: ScreenDirectionData;
  cardData?: {
    type: 'purchase_receipt' | 'barcode_tag' | 'sales_receipt' | 'order_receipt' | 'refinery_receipt' | 'account_receipt' | 'daybook_receipt' | 'stock_summary' | 'debtor_summary' | 'info_card';
    title: string;
    details: Record<string, any>;
    actions?: { label: string; actionId: string; primary?: boolean }[];
  };
  quickChips?: { label: string; action: string; payload?: any }[];
}

// ----------------------------------------------------
// 1. WORKFLOW DEFINITIONS (1-by-1 Questioning)
// ----------------------------------------------------
export const TASK_WORKFLOWS: Record<TaskType, TaskWorkflow> = {
  purchase_inward: {
    id: 'purchase_inward',
    name: 'Purchase Inward & Inventory Lot',
    icon: '🛒',
    description: 'Record wholesale/bullion purchase, inward lots into stock, and log Day Book payout.',
    navigationTarget: { section: 'transactions', subView: 'purchase' },
    successMessage: 'Purchase voucher successfully created and loose stock inwarded into inventory!',
    steps: [
      {
        id: 'step_supplier',
        field: 'supplier_name',
        question: 'Who is the Bullion Supplier / Karagir Vendor?',
        questionMr: 'बुलियन सप्लायर / कारागिराचे नाव काय आहे?',
        questionHi: 'बुलियन सप्लायर / कारीगर का नाम क्या है?',
        subtext: 'Select a registered creditor account or enter a new supplier name.',
        type: 'text',
        placeholder: 'e.g., Apex Bullion Traders, Choksi Bullion, Kundan Jewellers',
        defaultValue: 'Apex Bullion Traders',
        validate: (val) => ({
          valid: typeof val === 'string' && val.trim().length > 0,
          error: 'Supplier name is mandatory.',
        }),
      },
      {
        id: 'step_item_name',
        field: 'item_name',
        question: 'What is the ornament or metal lot being purchased?',
        questionMr: 'कोणता दागिना किंवा धातू खरेदी करत आहात?',
        questionHi: 'कौन सा जेवर या मेटल लॉट खरीदा जा रहा है?',
        subtext: 'Specify item description (e.g. 22K 916 Casted Bangles, 24K Pure Gold Bar 100g, 999 Fine Silver Bar).',
        type: 'text',
        placeholder: 'e.g., 22K Fancy Bangle Lot, 24K Gold Bar, 18K Diamond Ring Lot',
        defaultValue: '22K Gold Bangles Lot',
        validate: (val) => ({
          valid: typeof val === 'string' && val.trim().length > 0,
          error: 'Item lot name is required.',
        }),
      },
      {
        id: 'step_category',
        field: 'category',
        question: 'Select the Asset Category:',
        questionMr: 'दागिन्यांचा प्रकार निवडा:',
        questionHi: 'ज्वेलरी केटेगरी चुनें:',
        subtext: 'Classifies the asset in stock and ledger reporting.',
        type: 'select',
        options: [
          { label: 'Gold (22K / 18K / 24K)', value: 'Gold', sub: 'Standard Hallmarked Gold' },
          { label: 'Silver (925 / 999)', value: 'Silver', sub: 'Fine & Sterling Silver' },
          { label: 'Diamond / Solitaire', value: 'Diamond', sub: 'Precious Stones & Solitaire' },
          { label: 'URD Gold (Old Gold Scrap)', value: 'URD Gold', sub: 'Unregistered Dealer Metal' },
          { label: '1gm Imitation / Micro-Plated', value: '1gm Imitation', sub: 'Fashion Jewellery' },
        ],
        defaultValue: 'Gold',
      },
      {
        id: 'step_gross_wt',
        field: 'gross_wt',
        question: 'Enter the Gross Weight in Grams:',
        questionMr: 'एकूण वजन (Gross Weight) टाका (ग्रॅम मध्ये):',
        questionHi: 'कुल वजन (Gross Weight) ग्राम में दर्ज करें:',
        subtext: 'Total physical weight on the certified weighing scale.',
        type: 'weight',
        placeholder: '0.000',
        defaultValue: 25.500,
        quickPresets: [10.000, 25.000, 50.000, 100.000, 250.000],
        validate: (val) => ({
          valid: Number(val) > 0,
          error: 'Gross weight must be greater than 0.',
        }),
      },
      {
        id: 'step_stone_wt',
        field: 'stone_wt',
        question: 'Enter Less / Stone / Dust Weight (in Grams):',
        questionMr: 'खडे / दोरा / धूळ घट वजन (Stone Weight) टाका:',
        questionHi: 'नग / धागा / लेस वजन (Stone Weight) दर्ज करें:',
        subtext: 'Weight of stones, thread, or wax. Enter 0 if plain solid gold.',
        type: 'weight',
        placeholder: '0.000',
        defaultValue: 0.000,
        quickPresets: [0.000, 0.250, 0.500, 1.000, 1.500],
        computeDerived: (stoneVal, currentData) => {
          const gross = Number(currentData.gross_wt) || 0;
          const stone = Number(stoneVal) || 0;
          const net = Math.max(0, Number((gross - stone).toFixed(3)));
          return { net_wt: net };
        },
      },
      {
        id: 'step_purity',
        field: 'purity',
        question: 'What is the Purity / Touch %?',
        questionMr: 'टंच / शुद्धता (Purity %) निवडा:',
        questionHi: 'टंच / शुद्धता (Purity %) चुनें:',
        subtext: 'Hallmark Touch percentage for calculating fine gold equivalent.',
        type: 'select',
        options: [
          { label: '91.6% (22 Karat - Standard)', value: 91.6, sub: '916 Hallmark' },
          { label: '99.9% (24 Karat - Fine Bullion)', value: 99.9, sub: '999 Pure Bullion' },
          { label: '75.0% (18 Karat - Diamond Jewellery)', value: 75.0, sub: '750 Hallmark' },
          { label: '84.0% (20 Karat)', value: 84.0, sub: '840 Touch' },
          { label: '58.5% (14 Karat)', value: 58.5, sub: '585 Hallmark' },
        ],
        defaultValue: 91.6,
      },
      {
        id: 'step_rate',
        field: 'rate',
        question: 'Enter the Purchase Rate per Gram (₹):',
        questionMr: 'खरेदीचा भाव प्रति ग्रॅम (₹) टाका:',
        questionHi: 'खरीद दर प्रति ग्राम (₹) दर्ज करें:',
        subtext: 'Metal purchase rate agreed with supplier.',
        type: 'currency',
        placeholder: 'e.g. 7450',
        defaultValue: (data, ctx) => (data.category === 'Silver' ? ctx.silverRate : (Number(data.purity) >= 99 ? ctx.gold24kRate : ctx.gold22kRate)),
        validate: (val) => ({
          valid: Number(val) > 0,
          error: 'Rate must be a positive number.',
        }),
      },
      {
        id: 'step_payment_mode',
        field: 'payment_mode',
        question: 'Payment & Settlement Mode:',
        questionMr: 'पेमेंट पद्धत निवडा:',
        questionHi: 'भुगतान माध्यम चुनें:',
        subtext: 'How will this purchase lot be settled?',
        type: 'select',
        options: [
          { label: 'Cash Payment (Immediate Outward)', value: 'Cash', sub: 'Deduct from showroom cash counter' },
          { label: 'Bank RTGS / NEFT / Cheque', value: 'Bank', sub: 'Transferred via registered bank account' },
          { label: 'Credit to Supplier Ledger (Pay Later)', value: 'Credit', sub: 'Add to Sundry Creditors ledger' },
        ],
        defaultValue: 'Bank',
      },
    ],
  },

  barcode_generate: {
    id: 'barcode_generate',
    name: 'Generate Barcode & HUID Tag',
    icon: '🏷️',
    description: 'Create a unique barcode tag with HUID, weight, making charges, and hallmark details.',
    navigationTarget: { section: 'masters', subView: 'barcode' },
    successMessage: 'Barcode tag generated with unique SVG code and added to showroom stock!',
    steps: [
      {
        id: 'step_tag_name',
        field: 'item_name',
        question: 'What is the Ornament Description for the tag?',
        questionMr: 'टॅगवर छापण्यासाठी दागिन्याचे नाव काय आहे?',
        questionHi: 'टैग पर प्रिंट करने के लिए आभूषण का नाम क्या है?',
        subtext: 'Item name as it will appear on the barcode tag label.',
        type: 'text',
        placeholder: 'e.g., 22K Antique Lakshmi Choker, 18K Diamond Solitaire Ring',
        defaultValue: '22K Royal Antique Choker',
        validate: (val) => ({
          valid: typeof val === 'string' && val.trim().length > 0,
          error: 'Ornament name is required for tagging.',
        }),
      },
      {
        id: 'step_tag_cat',
        field: 'category',
        question: 'Select the Jewellery Category:',
        questionMr: 'कॅटेगरी निवडा:',
        questionHi: 'केटेगरी चुनें:',
        type: 'select',
        options: [
          { label: 'Gold Jewellery', value: 'Gold' },
          { label: 'Diamond Jewellery', value: 'Diamond' },
          { label: 'Silver Articles & Ornaments', value: 'Silver' },
          { label: '1gm Imitation Jewellery', value: '1gm Imitation' },
        ],
        defaultValue: 'Gold',
      },
      {
        id: 'step_tag_gross',
        field: 'gross_wt',
        question: 'Enter Gross Weight (Grams):',
        questionMr: 'एकूण वजन टाका (ग्रॅम):',
        questionHi: 'कुल वजन दर्ज करें (ग्राम):',
        type: 'weight',
        placeholder: '0.000',
        defaultValue: 16.450,
        quickPresets: [4.500, 8.200, 15.000, 22.500, 35.000],
        validate: (val) => ({ valid: Number(val) > 0, error: 'Gross weight required.' }),
      },
      {
        id: 'step_tag_net',
        field: 'net_wt',
        question: 'Enter Net Weight (Grams):',
        questionMr: 'निव्वळ वजन (Net Weight) टाका:',
        questionHi: 'शुद्ध वजन (Net Weight) दर्ज करें:',
        subtext: 'Pure metal weight excluding stones and beads.',
        type: 'weight',
        placeholder: '0.000',
        defaultValue: (data) => Number(data.gross_wt) || 16.450,
        validate: (val, data) => ({
          valid: Number(val) > 0 && Number(val) <= (Number(data.gross_wt) || Infinity),
          error: 'Net weight cannot exceed gross weight.',
        }),
      },
      {
        id: 'step_tag_purity',
        field: 'purity',
        question: 'Select Purity & Hallmark Standard:',
        questionMr: 'हॉलमार्क शुद्धता निवडा:',
        questionHi: 'हॉलमार्क शुद्धता चुनें:',
        type: 'select',
        options: [
          { label: '22K 916 (91.6% Pure Gold)', value: 91.6, sub: 'BIS Hallmarked' },
          { label: '18K 750 (75.0% Pure Gold)', value: 75.0, sub: 'Diamond Ornaments' },
          { label: '24K 999 (99.9% Pure Gold)', value: 99.9, sub: 'Coins & Bars' },
          { label: '92.5% Sterling Silver', value: 92.5, sub: 'Fine Silver' },
        ],
        defaultValue: 91.6,
      },
      {
        id: 'step_tag_huid',
        field: 'huid',
        question: 'Enter or Generate 6-Character BIS HUID Code:',
        questionMr: '६ अक्षरी BIS HUID कोड टाका किंवा जनरेट करा:',
        questionHi: '६ अक्षरों का BIS HUID कोड दर्ज करें या जनरेट करें:',
        subtext: 'Mandatory 6-character alphanumeric Hallmarking Unique ID (e.g. B9K8L1).',
        type: 'text',
        placeholder: 'e.g., B9K8L1, X4M9Q2',
        defaultValue: () => {
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
          let res = '';
          for (let i = 0; i < 6; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
          return res;
        },
        validate: (val) => ({
          valid: typeof val === 'string' && val.trim().length === 6,
          error: 'HUID must be exactly 6 alphanumeric characters.',
        }),
      },
      {
        id: 'step_tag_making',
        field: 'making_per_gm',
        question: 'Enter Selling Making Charges (₹ per Gram):',
        questionMr: 'विक्री मजुरी दर (₹ प्रति ग्रॅम) टाका:',
        questionHi: 'बिक्री मजदूरी दर (₹ प्रति ग्राम) दर्ज करें:',
        subtext: 'Default craftsmanship charge applied during sales billing.',
        type: 'currency',
        placeholder: 'e.g., 450',
        defaultValue: 450,
        quickPresets: [250, 350, 450, 550, 750],
      },
    ],
  },

  sales_invoice: {
    id: 'sales_invoice',
    name: 'Sales POS Counter Billing',
    icon: '💰',
    description: 'Create a GST Tax Invoice, scan barcode or select ornament, deduct stock, and settle payment.',
    navigationTarget: { section: 'transactions', subView: 'sales_invoice' },
    successMessage: 'Sales Tax Invoice created, stock deducted, and Day Book updated!',
    steps: [
      {
        id: 'step_sale_cust',
        field: 'customer_name',
        question: 'Enter Customer Name:',
        questionMr: 'ग्राहकाचे नाव टाका:',
        questionHi: 'ग्राहक का नाम दर्ज करें:',
        subtext: 'Select an existing debtor account or enter a new customer.',
        type: 'text',
        placeholder: 'e.g., Rajesh Mehta, Ananya Joshi, Walk-in Customer',
        defaultValue: 'Walk-in Customer',
        validate: (val) => ({ valid: typeof val === 'string' && val.trim().length > 0, error: 'Customer name required.' }),
      },
      {
        id: 'step_sale_phone',
        field: 'phone',
        question: 'Customer Mobile Number:',
        questionMr: 'ग्राहकाचा मोबाईल नंबर:',
        questionHi: 'ग्राहक का मोबाइल नंबर:',
        subtext: 'Required for e-invoice and WhatsApp bill sharing.',
        type: 'text',
        placeholder: '10-digit mobile number',
        defaultValue: '9820123456',
        validate: (val) => ({
          valid: typeof val === 'string' && val.replace(/\D/g, '').length >= 10,
          error: 'Please enter a valid 10-digit phone number.',
        }),
      },
      {
        id: 'step_sale_item',
        field: 'item_name',
        question: 'Select or Enter Ornament to Sell:',
        questionMr: 'विक्री करावयाच्या दागिन्याचे नाव किंवा बारकोड:',
        questionHi: 'बेचे जाने वाले आभूषण का नाम या बारकोड:',
        subtext: 'Enter the item name or scan a tagged barcode.',
        type: 'text',
        placeholder: 'e.g., 22K Royal Peacock Choker, TAG-GLD-102',
        defaultValue: '22K 916 Royal Peacock Choker Necklace',
      },
      {
        id: 'step_sale_net_wt',
        field: 'net_wt',
        question: 'Enter Net Metal Weight (Grams):',
        questionMr: 'निव्वळ धातू वजन (Net Weight) टाका (ग्रॅम):',
        questionHi: 'शुद्ध धातु का वजन दर्ज करें (ग्राम):',
        subtext: 'Pure gold weight to calculate metal value.',
        type: 'weight',
        placeholder: '0.000',
        defaultValue: 15.500,
        quickPresets: [5.000, 10.000, 15.500, 22.000, 31.300],
        validate: (val) => ({ valid: Number(val) > 0, error: 'Weight must be > 0.' }),
      },
      {
        id: 'step_sale_rate',
        field: 'rate',
        question: 'Today\'s Gold Billing Rate per Gram (₹):',
        questionMr: 'आजचा सोन्याचा बिलिंग भाव प्रति ग्रॅम (₹):',
        questionHi: 'आज का सोना बिलिंग भाव प्रति ग्राम (₹):',
        subtext: 'Live 22K 916 rate from bullion market.',
        type: 'currency',
        defaultValue: (data, ctx) => ctx.gold22kRate,
        validate: (val) => ({ valid: Number(val) > 0, error: 'Valid rate required.' }),
      },
      {
        id: 'step_sale_making',
        field: 'making_per_gm',
        question: 'Enter Making Charge (₹ per Gram):',
        questionMr: 'घडणावळ / मजुरी दर (₹ प्रति ग्रॅम):',
        questionHi: 'मजदूरी / मेकिंग चार्ज (₹ प्रति ग्राम):',
        type: 'currency',
        placeholder: 'e.g., 450',
        defaultValue: 450,
        quickPresets: [300, 450, 600, 850],
      },
      {
        id: 'step_sale_old_gold',
        field: 'old_gold_amount',
        question: 'Any Old Gold (URD Exchange) Deduction (₹)?',
        questionMr: 'जुने सोने (URD) वजावट रक्कम (₹):',
        questionHi: 'पुराना सोना (URD) कटौती राशि (₹):',
        subtext: 'Enter value of old scrap gold returned by customer. Enter 0 if none.',
        type: 'currency',
        placeholder: '0',
        defaultValue: 0,
        quickPresets: [0, 5000, 15000, 25000, 50000],
      },
      {
        id: 'step_sale_pay_mode',
        field: 'payment_mode',
        question: 'Primary Payment Method:',
        questionMr: 'पेमेंट पद्धत निवडा:',
        questionHi: 'पेमेंट का प्रकार चुनें:',
        subtext: 'Select how the customer is paying.',
        type: 'select',
        options: [
          { label: 'UPI / Digital Payment (GPay, PhonePe, Card)', value: 'UPI/Card', sub: 'Instant bank deposit' },
          { label: 'Cash Tendered', value: 'Cash', sub: 'Received in showroom drawer' },
          { label: 'Split (50% Cash + 50% UPI)', value: 'Split', sub: 'Combination payment' },
          { label: 'Debit to Customer Ledger (Credit Sale)', value: 'Credit', sub: 'Add to unpaid balance' },
        ],
        defaultValue: 'UPI/Card',
      },
    ],
  },

  order_booking: {
    id: 'order_booking',
    name: 'Custom Order Booking',
    icon: '📋',
    description: 'Book customized jewellery order with customer specifications, promise date, and advance.',
    navigationTarget: { section: 'transactions', subView: 'new_order' },
    successMessage: 'Custom order booked successfully with unique Order No and added to workshop queue!',
    steps: [
      {
        id: 'step_ord_cust',
        field: 'customer_name',
        question: 'Enter Customer Name & Mobile Number:',
        questionMr: 'ग्राहकाचे नाव आणि मोबाईल नंबर टाका:',
        questionHi: 'ग्राहक का नाम और मोबाइल नंबर दर्ज करें:',
        type: 'text',
        placeholder: 'e.g. Smt. Kavita Patil (9822334455)',
        defaultValue: 'Smt. Kavita Patil',
        validate: (val) => ({ valid: typeof val === 'string' && val.trim().length > 0, error: 'Customer name required.' }),
      },
      {
        id: 'step_ord_item',
        field: 'item_name',
        question: 'Describe the Custom Ornament to Craft:',
        questionMr: 'ऑर्डर द्यायच्या दागिन्याचे डिझाईन वर्णन:',
        questionHi: 'कस्टम आभूषण का विवरण दर्ज करें:',
        subtext: 'Include details like karat, design pattern, stone type, or length.',
        type: 'text',
        placeholder: 'e.g. 22K Temple Design Bridal Haar with Ruby Stones (45g)',
        defaultValue: '22K Temple Design Bridal Haar with Ruby Stones',
      },
      {
        id: 'step_ord_approx_wt',
        field: 'approx_wt',
        question: 'Enter Approximate Target Weight (Grams):',
        questionMr: 'अंदाजे टार्गेट वजन (ग्रॅम):',
        questionHi: 'अनुमानित वजन (ग्राम):',
        type: 'weight',
        placeholder: '0.000',
        defaultValue: 45.000,
        quickPresets: [15.000, 25.000, 35.000, 45.000, 60.000],
      },
      {
        id: 'step_ord_date',
        field: 'delivery_date',
        question: 'Promise / Delivery Due Date:',
        questionMr: 'दागिना देण्याची तारीख (Promise Date):',
        questionHi: 'डिलीवरी की तारीख (Promise Date):',
        subtext: 'When should the workshop finish crafting and polishing?',
        type: 'date',
        defaultValue: () => {
          const d = new Date();
          d.setDate(d.getDate() + 10);
          return d.toISOString().split('T')[0];
        },
      },
      {
        id: 'step_ord_advance',
        field: 'advance_amount',
        question: 'Enter Advance Payment Received (₹):',
        questionMr: 'मिळालेली ॲडव्हान्स रक्कम (₹):',
        questionHi: 'प्राप्त एडवांस राशि (₹):',
        subtext: 'Booking token advance received via Cash/UPI.',
        type: 'currency',
        placeholder: 'e.g., 25000',
        defaultValue: 25000,
        quickPresets: [5000, 15000, 25000, 50000, 100000],
      },
    ],
  },

  refinery_melting: {
    id: 'refinery_melting',
    name: 'Old Gold & Refinery Inward',
    icon: '🔥',
    description: 'Record old gold scrap inward, assay testing purity, and fine metal settlement.',
    navigationTarget: { section: 'transactions', subView: 'refinery_in' },
    successMessage: 'Refinery scrap voucher recorded and fine gold balance credited to metal ledger!',
    steps: [
      {
        id: 'step_ref_name',
        field: 'refinery_name',
        question: 'Refinery / Assayer / Party Name:',
        questionMr: 'रिफायनरी / टंच तपासणी केंद्राचे नाव:',
        questionHi: 'रिफाइनरी / टंच टेस्टिंग सेंटर का नाम:',
        type: 'text',
        placeholder: 'e.g. Shree Ganesh Refinery & Assaying Centre',
        defaultValue: 'Shree Ganesh Refinery',
        validate: (val) => ({ valid: typeof val === 'string' && val.trim().length > 0, error: 'Refinery name required.' }),
      },
      {
        id: 'step_ref_gross',
        field: 'gross_wt',
        question: 'Enter Scrap Gross Weight (Grams):',
        questionMr: 'जुन्या स्क्रॅप सोन्याचे वजन (ग्रॅम):',
        questionHi: 'पुराने स्क्रैप सोने का वजन (ग्राम):',
        type: 'weight',
        placeholder: '0.000',
        defaultValue: 50.000,
        quickPresets: [20.000, 50.000, 100.000, 250.000],
        validate: (val) => ({ valid: Number(val) > 0, error: 'Weight must be > 0.' }),
      },
      {
        id: 'step_ref_purity',
        field: 'purity',
        question: 'Tested Melting Touch / Purity %:',
        questionMr: 'तपासणी नंतर आलेली शुद्धता / टंच %:',
        questionHi: 'टेस्टिंग के बाद शुद्धता / टंच %:',
        subtext: 'Laboratory assay testing purity report result.',
        type: 'select',
        options: [
          { label: '84.0% (Standard 20K Old Gold Melting)', value: 84.0 },
          { label: '91.6% (22K Old Jewellery)', value: 91.6 },
          { label: '75.0% (18K Studded Scrap)', value: 75.0 },
          { label: '99.5% (Refined Pure Bullion Recovery)', value: 99.5 },
        ],
        defaultValue: 84.0,
      },
      {
        id: 'step_ref_settlement',
        field: 'settlement_mode',
        question: 'Settlement Option:',
        questionMr: 'जमा पद्धत निवडा:',
        questionHi: 'सेटलमेंट माध्यम चुनें:',
        type: 'select',
        options: [
          { label: 'Credit Fine Metal to Stock (Issue to Karagir)', value: 'Metal' },
          { label: 'Cash Settlement at Scrap Bullion Rate', value: 'Cash' },
        ],
        defaultValue: 'Metal',
      },
    ],
  },

  account_create: {
    id: 'account_create',
    name: 'New Customer / Supplier Account Master',
    icon: '👤',
    description: 'Register a new customer, karagir, or supplier in the master ledger.',
    navigationTarget: { section: 'masters', subView: 'account_master' },
    successMessage: 'Account master created and synchronized with cloud database!',
    steps: [
      {
        id: 'step_acc_name',
        field: 'account_name',
        question: 'Enter Full Account / Party Name:',
        questionMr: 'खातेदाराचे / ग्राहकाचे पूर्ण नाव टाका:',
        questionHi: 'खाताधारक / ग्राहक का पूरा नाम दर्ज करें:',
        type: 'text',
        placeholder: 'e.g. Ramesh Kulkarni, Shreeji Crafts Karagir',
        defaultValue: 'Ramesh Kulkarni',
        validate: (val) => ({ valid: typeof val === 'string' && val.trim().length > 0, error: 'Name is required.' }),
      },
      {
        id: 'step_acc_group',
        field: 'account_group',
        question: 'Select Account Ledger Group:',
        questionMr: 'खाते गट (Ledger Group) निवडा:',
        questionHi: 'खाता समूह (Ledger Group) चुनें:',
        type: 'select',
        options: [
          { label: 'Sundry Debtors (Customer)', value: 'Sundry Debtors', sub: 'Customers who purchase ornaments' },
          { label: 'Sundry Creditors (Supplier / Bullion Dealer)', value: 'Sundry Creditors', sub: 'Bullion & raw metal suppliers' },
          { label: 'Karagir / Artisan Workshop', value: 'Karagir Account', sub: 'Jewellery craftsmen' },
          { label: 'Bank Account (Current / Savings)', value: 'Bank Account', sub: 'Showroom banking' },
        ],
        defaultValue: 'Sundry Debtors',
      },
      {
        id: 'step_acc_phone',
        field: 'phone',
        question: 'Contact Phone Number & City:',
        questionMr: 'मोबाईल नंबर आणि गाव/शहर:',
        questionHi: 'मोबाइल नंबर और शहर:',
        type: 'text',
        placeholder: 'e.g. 9823456789, Pune',
        defaultValue: '9823456789, Pune',
      },
      {
        id: 'step_acc_opening',
        field: 'opening_balance',
        question: 'Enter Opening Balance (₹):',
        questionMr: 'सुरुवातीची बाकी रक्कम (Opening Balance ₹):',
        questionHi: 'शुरुआती शेष राशि (Opening Balance ₹):',
        subtext: 'Enter 0 if fresh account with zero balance.',
        type: 'currency',
        placeholder: '0',
        defaultValue: 0,
        quickPresets: [0, 5000, 15000, 50000],
      },
    ],
  },

  daybook_expense: {
    id: 'daybook_expense',
    name: 'Day Book Cash / Bank Voucher',
    icon: '📖',
    description: 'Record petty cash expense, counter withdrawal, or direct receipt.',
    navigationTarget: { section: 'accounts', subView: 'day_book' },
    successMessage: 'Day Book voucher recorded and cash drawer totals re-balanced!',
    steps: [
      {
        id: 'step_db_type',
        field: 'invoice_type',
        question: 'Select Voucher Type:',
        questionMr: 'व्हाउचरचा प्रकार निवडा:',
        questionHi: 'वाउचर का प्रकार चुनें:',
        type: 'select',
        options: [
          { label: 'Cash Payment / Expense Voucher', value: 'Cash Payment' },
          { label: 'Cash Receipt Voucher', value: 'Cash Receipt' },
          { label: 'Bank Contra (Cash to Bank Deposit)', value: 'Bank Deposit' },
          { label: 'Bank Withdrawal (Bank to Cash)', value: 'Bank Withdrawal' },
        ],
        defaultValue: 'Cash Payment',
      },
      {
        id: 'step_db_details',
        field: 'details',
        question: 'Enter Particulars / Purpose Description:',
        questionMr: 'खर्चाचा किंवा प्राप्तीचा तपशील टाका:',
        questionHi: 'खर्च या प्राप्ति का विवरण दर्ज करें:',
        type: 'text',
        placeholder: 'e.g. Showroom Electricity Bill, Tea & Refreshments, Staff Advance',
        defaultValue: 'Showroom Electricity Bill',
        validate: (val) => ({ valid: typeof val === 'string' && val.trim().length > 0, error: 'Particulars required.' }),
      },
      {
        id: 'step_db_amount',
        field: 'amount',
        question: 'Enter Transaction Amount (₹):',
        questionMr: 'रक्कम (₹) टाका:',
        questionHi: 'राशि (₹) दर्ज करें:',
        type: 'currency',
        placeholder: 'e.g. 3500',
        defaultValue: 3500,
        quickPresets: [500, 1500, 3500, 7500, 15000],
        validate: (val) => ({ valid: Number(val) > 0, error: 'Amount must be > 0.' }),
      },
    ],
  },
};

// ----------------------------------------------------
// 2. KNOWLEDGE BASE & MULTILINGUAL NLU ENGINE
// ----------------------------------------------------
export class AiChatbotEngine {
  private context: ErpContext;
  private bhishiMembers: BhishiMember[];
  private customerVisits: CustomerVisitRecord[];

  constructor(context: ErpContext) {
    this.context = context;
    this.bhishiMembers = context.bhishiMembers || INITIAL_BHISHI_MEMBERS;
    this.customerVisits = context.customerVisits || INITIAL_TODAY_VISITS;
  }

  public updateContext(context: ErpContext) {
    this.context = context;
    if (context.bhishiMembers) {
      this.bhishiMembers = context.bhishiMembers;
    }
    if (context.customerVisits) {
      this.customerVisits = context.customerVisits;
    }
  }

  // Detect language of user query
  public detectLanguage(text: string, manualPreference: ChatLanguage = 'auto'): 'en' | 'mr' | 'hi' {
    if (manualPreference && manualPreference !== 'auto') {
      return manualPreference;
    }

    const lower = text.toLowerCase();

    // Marathi keywords & Devanagari patterns
    const marathiKeywords = [
      'दाखवा', 'करा', 'आहे', 'नाही', 'सोनं', 'सोने', 'भिशी', 'ग्राहकांची', 'योजना',
      'गल्ला', 'टंच', 'मजुरी', 'हिशोब', 'तपशील', 'शिल्लक', 'खरेदी', 'विक्री', 'भाव',
      'अनप्रिंटेड', 'तोळा', 'तोळे', 'आलेले', 'भेट', 'ग्राहक'
    ];
    if (marathiKeywords.some((w) => lower.includes(w))) return 'mr';

    // Hindi keywords & Devanagari patterns
    const hindiKeywords = [
      'दिखाओ', 'कितना', 'सोना', 'भिशी', 'योजना', 'गल्ला', 'दुकान', 'हिसाब', 'बकाया',
      'खरीद', 'बिक्री', 'तोला', 'बिना', 'प्रिंट', 'आए', 'विजिट'
    ];
    if (hindiKeywords.some((w) => lower.includes(w))) return 'hi';

    // Check Devanagari script presence
    if (/[\u0900-\u097F]/.test(text)) {
      if (lower.includes('कॅश') || lower.includes('सोनं') || lower.includes('दाखवा') || lower.includes('करा') || lower.includes('आलेले')) return 'mr';
      return 'hi';
    }

    return 'en';
  }

  // Match and score ERP screens based on user query keywords and intent
  public findScreenMatch(text: string): {
    matchedScreen: ErpScreenDefinition;
    isExplicitNavRequest: boolean;
    score: number;
  } | null {
    const clean = text.toLowerCase().replace(/[?'"!.,]/g, '');
    const isExplicit =
      clean.includes('screen') ||
      clean.includes('open') ||
      clean.includes('go to') ||
      clean.includes('goto') ||
      clean.includes('take me to') ||
      clean.includes('navigate') ||
      clean.includes('show me') ||
      clean.includes('where is') ||
      clean.includes('window') ||
      clean.includes('view') ||
      clean.includes('screenवर') ||
      clean.includes('स्क्रीनवर') ||
      clean.includes('उघडा') ||
      clean.includes('दाखवा') ||
      clean.includes('जा') ||
      clean.includes('घेऊन चला') ||
      clean.includes('कुठे आहे') ||
      clean.includes('कसे जायचे') ||
      clean.includes('खोलो') ||
      clean.includes('दिखाओ') ||
      clean.includes('पर जाओ') ||
      clean.includes('ले चलो') ||
      clean.includes('कहाँ है') ||
      clean.includes('डायरेक्ट') ||
      clean.includes('direct');

    let bestScreen: ErpScreenDefinition | null = null;
    let highestScore = 0;

    for (const sc of ERP_SCREENS) {
      let score = 0;
      // Direct id, shortcut or name match
      if (clean.includes(sc.id.replace('_', ' ')) || clean.includes(sc.shortcut.toLowerCase())) {
        score += 15;
      }
      if (clean.includes(sc.name.toLowerCase())) {
        score += 20;
      }
      if (clean.includes(sc.nameMr.toLowerCase()) || clean.includes(sc.nameHi.toLowerCase())) {
        score += 20;
      }

      // Keyword scoring
      for (const kw of sc.keywords) {
        const kwLower = kw.toLowerCase();
        if (clean === kwLower) {
          score += 12;
        } else if (clean.includes(kwLower)) {
          score += kwLower.length > 4 ? 6 : 3;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestScreen = sc;
      }
    }

    if (bestScreen && highestScore > 0) {
      return { matchedScreen: bestScreen, isExplicitNavRequest: isExplicit, score: highestScore };
    }
    return null;
  }

  // Process User Input with Multi-lingual capability, table generation, screen detection & calculations
  public processUserInput(
    input: string,
    forcedLang: ChatLanguage = 'auto'
  ): {
    response: string;
    language: 'en' | 'mr' | 'hi';
    taskToStart?: TaskType;
    tableData?: ChatTableData;
    cardData?: ChatMessage['cardData'];
    screenDirection?: ScreenDirectionData;
    quickChips?: ChatMessage['quickChips'];
  } {
    const raw = input.trim();
    const text = raw.toLowerCase().replace(/[?'"!.,]/g, '');
    const lang = this.detectLanguage(raw, forcedLang);

    // ----------------------------------------------------
    // 1. TODAY'S VISITED CUSTOMERS & FOOTFALL LOG QUERY
    // Matches: "todays visited customers", "today visited customers", "visited customers",
    // "today's customer list", "who visited today", "walk-in customers", "आज आलेले ग्राहक", "आज के ग्राहक"
    // ----------------------------------------------------
    const isBhishiSchemeQuery =
      text.includes('bhishi') ||
      text.includes('gold scheme') ||
      text.includes('swarna nidhi') ||
      text.includes('भिशी') ||
      text.includes('योजना') ||
      text.includes('savings scheme') ||
      text.includes('scheme member') ||
      text.includes('swarna nidi');

    const isVisitedCustomersQuery =
      !isBhishiSchemeQuery &&
      (text.includes('visited customer') ||
        text.includes('visited customers') ||
        text.includes('todays visited') ||
        text.includes('today visited') ||
        text.includes('customer visit') ||
        text.includes('customer visits') ||
        text.includes('visitor') ||
        text.includes('visitors') ||
        text.includes('who visited') ||
        text.includes('today customer') ||
        text.includes('todays customer') ||
        text.includes('today clients') ||
        text.includes('todays clients') ||
        text.includes('walk in customer') ||
        text.includes('walk-in customer') ||
        text.includes('footfall') ||
        text.includes('footfalls') ||
        (text.includes('visited') && (text.includes('today') || text.includes('customer') || text.includes('shop') || text.includes('showroom'))) ||
        (text.includes('visit') && (text.includes('today') || text.includes('customer') || text.includes('shop') || text.includes('showroom'))) ||
        (text.includes('today') && (text.includes('customer') || text.includes('client') || text.includes('patron') || text.includes('people') || text.includes('walk in') || text.includes('walk-in'))) ||
        (text.includes('customer') && (text.includes('came') || text.includes('come') || text.includes('visited') || text.includes('walked') || text.includes('today'))) ||
        text.includes('आलेले ग्राहक') ||
        text.includes('भेट दिलेले ग्राहक') ||
        text.includes('आजचे ग्राहक') ||
        text.includes('ग्राहकांची यादी') ||
        text.includes('दुकान भेट') ||
        text.includes('आए हुए ग्राहक') ||
        text.includes('आज के ग्राहक') ||
        text.includes('दुकान में आए') ||
        text.includes('विजिट किए ग्राहक') ||
        (text.includes('ग्राहक') && (text.includes('आज') || text.includes('भेट') || text.includes('आले'))));

    if (isVisitedCustomersQuery) {
      const visits = this.customerVisits;
      const totalAmountTransacted = visits.reduce((s, v) => s + (v.amount || 0), 0);
      const totalBilled = visits.filter((v) => v.amount > 0).length;

      const rows = visits.map((v) => ({
        time: v.time,
        name: v.name,
        phone: v.phone,
        purpose: v.purpose,
        item_details: v.item_details,
        voucher_ref: v.invoice_or_ref,
        amount: v.amount > 0 ? formatCurrency(v.amount) : 'Enquiry',
        salesman: v.salesman.split(' ')[0],
        status: v.status,
      }));

      const title = lang === 'mr'
        ? 'आज शोरूमला भेट दिलेल्या ग्राहकांची नोंद (Today\'s Visited Customers)'
        : lang === 'hi'
        ? 'आज शोरूम में आए ग्राहकों की सूची (Today\'s Visited Customers)'
        : 'Today\'s Showroom Customer Visits & Footfall Log';

      const subtitle = lang === 'mr'
        ? `एकूण भेट दिलेले ग्राहक: ${visits.length} | बिल झालेले व्यवहार: ${totalBilled} | एकूण उलाढाल: ${formatCurrency(totalAmountTransacted)}`
        : lang === 'hi'
        ? `कुल विज़िटर ग्राहक: ${visits.length} | बिलिंग व्यवहार: ${totalBilled} | कुल टर्नओवर: ${formatCurrency(totalAmountTransacted)}`
        : `Total Footfalls Today: ${visits.length} patrons | Completed Invoices: ${totalBilled} | Value: ${formatCurrency(totalAmountTransacted)}`;

      const resp = lang === 'mr'
        ? `### 👥 आज शोरूमला भेट दिलेले ग्राहक (Today's Visited Customers)\nआज एकूण **${visits.length} ग्राहकांनी** शोरूमला भेट दिली आहे:\n- **बिलिंग झालेले ग्राहक**: **${totalBilled} ग्राहक**\n- **एकूण व्यवहार उलाढाल**: **${formatCurrency(totalAmountTransacted)}**\n- **भिशी/चौकशी/ऑर्डर/दुरुस्ती**: ${visits.length - totalBilled} ग्राहक\n\nखालील तक्त्यामध्ये आज आलेल्या सर्व ग्राहकांचे नाव, वेळ, भेटीचा उद्देश, दागिना व बिल तपशील दिलेला आहे:`
        : lang === 'hi'
        ? `### 👥 आज शोरूम में आए ग्राहक (Today's Visited Customers)\nआज कुल **${visits.length} ग्राहकों** ने शोरूम विज़िट किया है:\n- **बिलिंग ग्राहक**: **${totalBilled} ग्राहक**\n- **कुल टर्नओवर**: **${formatCurrency(totalAmountTransacted)}**\n- **भिशी/पूछताछ/ऑर्डर**: ${visits.length - totalBilled} ग्राहक\n\nनीचे तालिका में आज आए सभी ग्राहकों का नाम, समय, उद्देश्य, आभूषण और बिल विवरण दिया गया है:`
        : `### 👥 Today's Visited Customers & Footfall Register\nRecorded **${visits.length} customer visits** in the showroom today:\n- **Purchases / Paid Transactions**: **${totalBilled} patrons**\n- **Total Turnout Value**: **${formatCurrency(totalAmountTransacted)}**\n- **Inquiries / Bhishi / Repairs**: ${visits.length - totalBilled} patrons\n\nComplete chronological visitor log with contact details, purpose, and bill reference below:`;

      return {
        response: resp,
        language: lang,
        tableData: {
          title,
          subtitle,
          columns: [
            { key: 'time', label: 'Time', align: 'center', format: 'badge' },
            { key: 'name', label: 'Customer Name', align: 'left', format: 'text' },
            { key: 'phone', label: 'Contact Phone', align: 'left', format: 'text' },
            { key: 'purpose', label: 'Purpose of Visit', align: 'left', format: 'text' },
            { key: 'item_details', label: 'Ornament / Details', align: 'left', format: 'text' },
            { key: 'voucher_ref', label: 'Invoice / Ref #', align: 'left', format: 'badge' },
            { key: 'amount', label: 'Amount (₹)', align: 'right', format: 'text' },
            { key: 'status', label: 'Status', align: 'center', format: 'badge' },
          ],
          rows,
          navigationAction: { label: 'Open Sales POS Counter (F4)', section: 'transactions', subView: 'sales_invoice' },
        },
        quickChips: [
          { label: '💰 New Sales POS Bill (F4)', action: 'start_task', payload: 'sales_invoice' },
          { label: '📋 Book Customer Order (F7)', action: 'start_task', payload: 'order_booking' },
          { label: '🪙 भिशी ग्राहक यादी (Bhishi)', action: 'query', payload: 'bhishi' },
          { label: '💵 आजचा गल्ला (Till)', action: 'query', payload: 'till' },
        ],
      };
    }

    // ----------------------------------------------------
    // 1.3 SPECIFIC ITEM ID / TAG NO / BARCODE LOOKUP WITH SELLING PRICE & DETAILS
    // Matches: "TAG-GLD-8801", "TAG-RNG-101", "stk-1", "TAG-DIA-304", "item price", "selling price",
    // "rate of item", "tag details", "दागिना किंमत", "टॅग माहिती", "आयटम तपशील", "बिक्री मूल्य"
    // ----------------------------------------------------
    const stockItems = this.context.stockItems;
    const directMatchedItem = stockItems.find((it) => {
      const tagLower = (it.tag_no || '').toLowerCase();
      const idLower = it.id.toLowerCase();
      const nameLower = it.item_name.toLowerCase();
      return (
        (tagLower && text.includes(tagLower)) ||
        text.includes(idLower) ||
        (text.includes('selling price') && text.includes(nameLower)) ||
        (text.includes('details') && tagLower && text.includes(tagLower)) ||
        (text.includes('price') && tagLower && text.includes(tagLower))
      );
    });

    if (directMatchedItem) {
      const it = directMatchedItem;
      const ratePerGm =
        it.rate_per_gm ||
        (it.category === 'Silver'
          ? this.context.silverRate
          : it.category === 'Diamond'
          ? 5800
          : it.purity >= 99
          ? this.context.gold24kRate
          : this.context.gold22kRate);

      const metalBaseAmt = Math.round(it.net_wt * ratePerGm);
      const makingPerGm = it.category === 'Silver' ? 25 : it.category === 'Diamond' ? 850 : 450;
      const makingCharges = Math.round(it.net_wt * makingPerGm);
      const hallmarkFee = it.category === 'Gold' || it.category === 'Diamond' ? 45 : 0;
      const stoneAmt = it.gross_wt > it.net_wt ? Math.round((it.gross_wt - it.net_wt) * 1500) : 0;
      const taxableAmt = metalBaseAmt + makingCharges + hallmarkFee + stoneAmt;
      const cgst = Math.round(taxableAmt * 0.015);
      const sgst = Math.round(taxableAmt * 0.015);
      const totalGst = cgst + sgst;
      const finalSellingPrice = taxableAmt + totalGst;
      const tolaCount = Number((it.gross_wt / 11.664).toFixed(2));

      const title = lang === 'mr'
        ? `दागिना तपशील व विक्री मूल्य: ${it.item_name}`
        : lang === 'hi'
        ? `आभूषण विवरण व बिक्री मूल्य: ${it.item_name}`
        : `Item Specifications & Selling Price: ${it.item_name}`;

      const resp = lang === 'mr'
        ? `### 🏷️ ${it.item_name} — विक्री मूल्य तपशील\n- **टॅग क्रमांक (Tag No)**: \`${it.tag_no || it.id}\`\n- **कॅटेगरी व शुद्धता**: **${it.category} (${it.purity}%)**\n- **वजन**: Gross **${formatWeight(it.gross_wt)}g** (${tolaCount} तोळे) | Net **${formatWeight(it.net_wt)}g** | Fine **${formatWeight(it.fine_wt)}g**\n\n#### 🧮 विक्री मूल्य हिशोब (Selling Price Breakdown):\n- धातू मूळ किंमत (${formatWeight(it.net_wt)}g × ₹${ratePerGm.toLocaleString('en-IN')}/g): **${formatCurrency(metalBaseAmt)}**\n- मजुरी / घडणावळ (Making @ ₹${makingPerGm}/g): **${formatCurrency(makingCharges)}**\n- BIS हॉलमार्किंग शुल्क: **₹${hallmarkFee}**\n${stoneAmt > 0 ? `- खडे / स्टोन मूल्य: **${formatCurrency(stoneAmt)}**\n` : ''}- करपात्र मूल्य (Taxable Amount): **${formatCurrency(taxableAmt)}**\n- जीएसटी (GST ३%): **${formatCurrency(totalGst)}** (१.५% CGST + १.५% SGST)\n\n### 💰 एकूण अंतिम विक्री बिल किंमत: **${formatCurrency(finalSellingPrice)}**`
        : lang === 'hi'
        ? `### 🏷️ ${it.item_name} — बिक्री मूल्य विवरण\n- **टैग नंबर (Tag No)**: \`${it.tag_no || it.id}\`\n- **श्रेणी व शुद्धता**: **${it.category} (${it.purity}%)**\n- **वजन**: Gross **${formatWeight(it.gross_wt)}g** (${tolaCount} तोला) | Net **${formatWeight(it.net_wt)}g** | Fine **${formatWeight(it.fine_wt)}g**\n\n#### 🧮 बिक्री मूल्य गणना (Selling Price Breakdown):\n- धातु मूल मूल्य (${formatWeight(it.net_wt)}g × ₹${ratePerGm.toLocaleString('en-IN')}/g): **${formatCurrency(metalBaseAmt)}**\n- मेकिंग चार्ज (Making @ ₹${makingPerGm}/g): **${formatCurrency(makingCharges)}**\n- BIS हॉलमार्किंग शुल्क: **₹${hallmarkFee}**\n${stoneAmt > 0 ? `- स्टोन मूल्य: **${formatCurrency(stoneAmt)}**\n` : ''}- टैक्सेबल मूल्य: **${formatCurrency(taxableAmt)}**\n- जीएसटी (GST ३%): **${formatCurrency(totalGst)}** (१.५% CGST + १.५% SGST)\n\n### 💰 कुल अंतिम बिक्री मूल्य: **${formatCurrency(finalSellingPrice)}**`
        : `### 🏷️ ${it.item_name} — Selling Price & Product Details\n- **Barcode Tag #**: \`${it.tag_no || it.id}\`\n- **Category & Purity**: **${it.category} (${it.purity}%)**\n- **Physical Weight**: Gross **${formatWeight(it.gross_wt)}g** (${tolaCount} Tolas) | Net **${formatWeight(it.net_wt)}g** | Fine 24K **${formatWeight(it.fine_wt)}g**\n\n#### 🧮 Live Selling Price Computation:\n- Metal Base Cost (${formatWeight(it.net_wt)}g × ₹${ratePerGm.toLocaleString('en-IN')}/g): **${formatCurrency(metalBaseAmt)}**\n- Making Charges (@ ₹${makingPerGm}/g): **${formatCurrency(makingCharges)}**\n- BIS Hallmark Fee: **₹${hallmarkFee}**\n${stoneAmt > 0 ? `- Stone & Gem Cost: **${formatCurrency(stoneAmt)}**\n` : ''}- Taxable Valuation: **${formatCurrency(taxableAmt)}**\n- GST (3% Total): **${formatCurrency(totalGst)}** (1.5% CGST + 1.5% SGST)\n\n### 💰 Estimated Selling Price (MRP / Bill Value): **${formatCurrency(finalSellingPrice)}**`;

      const breakdownRows = [
        { component: 'Metal Base Value', calculation: `${formatWeight(it.net_wt)}g @ ₹${ratePerGm}/g`, amount: formatCurrency(metalBaseAmt) },
        { component: 'Making / Labor Charges', calculation: `${formatWeight(it.net_wt)}g @ ₹${makingPerGm}/g`, amount: formatCurrency(makingCharges) },
        { component: 'BIS Hallmark Charges', calculation: 'Standard Flat Fee', amount: `₹${hallmarkFee}` },
        ...(stoneAmt > 0 ? [{ component: 'Stone / CZ Charges', calculation: `${formatWeight(it.gross_wt - it.net_wt)}g Less Wt`, amount: formatCurrency(stoneAmt) }] : []),
        { component: 'Taxable Subtotal', calculation: 'Base + Labor + Hallmark', amount: formatCurrency(taxableAmt) },
        { component: 'GST Tax (3%)', calculation: '1.5% CGST + 1.5% SGST', amount: formatCurrency(totalGst) },
        { component: 'Final Selling Price', calculation: 'Total Invoice Amount', amount: formatCurrency(finalSellingPrice) },
      ];

      return {
        response: resp,
        language: lang,
        tableData: {
          title,
          subtitle: `Tag: ${it.tag_no || it.id} | Purity: ${it.purity}% | Net Wt: ${formatWeight(it.net_wt)}g | Total: ${formatCurrency(finalSellingPrice)}`,
          columns: [
            { key: 'component', label: 'Price Component', align: 'left', format: 'text' },
            { key: 'calculation', label: 'Calculation Formula', align: 'left', format: 'text' },
            { key: 'amount', label: 'Amount (₹)', align: 'right', format: 'text' },
          ],
          rows: breakdownRows,
          navigationAction: { label: 'Sell this in POS (F4)', section: 'transactions', subView: 'sales_invoice' },
        },
        cardData: {
          type: 'info_card',
          title: `Item Quotation: ${it.item_name}`,
          details: {
            'Tag Number': it.tag_no || it.id,
            'Category': `${it.category} (${it.purity}%)`,
            'Gross / Net Weight': `${formatWeight(it.gross_wt)}g / ${formatWeight(it.net_wt)}g`,
            'Live Metal Rate': `₹${ratePerGm}/g`,
            'Taxable Value': formatCurrency(taxableAmt),
            'GST (3%)': formatCurrency(totalGst),
            'Final Selling Price': formatCurrency(finalSellingPrice),
          },
          actions: [
            { label: '💰 Sell in POS Counter (F4)', actionId: 'nav_sales', primary: true },
            { label: '🏷️ Print Tag in Barcode Studio (F3)', actionId: 'nav_barcode' },
          ],
        },
        quickChips: [
          { label: '💰 New Sales POS Bill (F4)', action: 'start_task', payload: 'sales_invoice' },
          { label: '🏷️ Barcode Studio (F3)', action: 'navigate', payload: { section: 'masters', subView: 'barcode' } },
          { label: '📦 All Stock Report (F9)', action: 'navigate', payload: { section: 'stock', subView: 'stock_report' } },
        ],
      };
    }

    // ----------------------------------------------------
    // 1.6 CATEGORY / ORNAMENT TYPE STOCK SEARCH (Rings, Bangles, Necklaces, Chains, Mangalsutra, etc.)
    // Matches: "rings", "show me rings", "all rings", "अंगठ्या", "अंगूठी", "bangles", "necklace", "chains", "mangalsutra", "earrings", "kadas", "coins"
    // ----------------------------------------------------
    const categoryKeywords: { key: string; nameEn: string; nameMr: string; nameHi: string; terms: string[] }[] = [
      { key: 'ring', nameEn: 'Rings', nameMr: 'अंगठ्या (Rings)', nameHi: 'अंगूठियां (Rings)', terms: ['ring', 'rings', 'अंगठी', 'अंगठ्या', 'अंगूठी', 'अंगूठियां', 'cocktail ring', 'signet ring'] },
      { key: 'bangle', nameEn: 'Bangles', nameMr: 'बांगड्या व पाटल्या (Bangles)', nameHi: 'चूड़ियाँ व कंगन (Bangles)', terms: ['bangle', 'bangles', 'कंगन', 'चूड़ी', 'चूड़ियाँ', 'बांगड्या', 'पाटल्या', 'काकण'] },
      { key: 'necklace', nameEn: 'Necklaces & Chokers', nameMr: 'हार व चोकर (Necklaces)', nameHi: 'हार व चोकर (Necklaces)', terms: ['necklace', 'necklaces', 'choker', 'हार', 'चोकर', 'कंठहार', 'नेकलेस', 'पेंडंट'] },
      { key: 'chain', nameEn: 'Gold Chains', nameMr: 'सोन्याच्या चेन (Chains)', nameHi: 'सोने की चेन (Chains)', terms: ['chain', 'chains', 'चेन', 'गोफ', 'माळा', 'दोर'] },
      { key: 'mangalsutra', nameEn: 'Mangalsutras & Dokiya', nameMr: 'मंगळसूत्र व दोकिया (Mangalsutra)', nameHi: 'मंगलसूत्र व दोकिया (Mangalsutra)', terms: ['mangalsutra', 'mangalsutras', 'मंगळसूत्र', 'मंगळसूत्रे', 'मंगलसूत्र', 'दोकिया'] },
      { key: 'earring', nameEn: 'Earrings & Jhumkas', nameMr: 'झुमके व कानातले (Earrings)', nameHi: 'झुमके व इअररिंग्स (Earrings)', terms: ['earring', 'earrings', 'jhumka', 'jhumkas', 'झुमके', 'कनातले', 'कानातले', 'बाळ्या', 'इअररिंग', 'tops'] },
      { key: 'kada', nameEn: 'Kadas & Bracelets', nameMr: 'कडे व ब्रेसलेट (Kadas/Bracelets)', nameHi: 'कड़े व ब्रेसलेट (Kadas/Bracelets)', terms: ['kada', 'kadas', 'bracelet', 'bracelets', 'कडा', 'कडे', 'ब्रेसलेट'] },
      { key: 'coin', nameEn: 'Pure Gold Coins & Bullion Bars', nameMr: 'शुद्ध सोन्याची नाणी (Coins & Bullion)', nameHi: 'शुद्ध सोने के सिक्के (Coins & Bullion)', terms: ['coin', 'coins', 'bullion bar', 'ingot', 'नाणी', 'नाणे', 'सिक्के', 'सिक्का', 'गिन्नी', 'bullion'] },
      { key: 'silver', nameEn: 'Silver Ornaments & Pooja Articles', nameMr: 'चांदीचे दागिने व पूजा साहित्य (Silver)', nameHi: 'चांदी के आभूषण व पूजा सामग्री (Silver)', terms: ['silver', 'payal', 'चांदी', 'पैंजण', 'पायल', 'कलश', 'पूजा'] },
      { key: 'diamond', nameEn: 'Diamond Jewellery', nameMr: 'हिऱ्यांचे दागिने (Diamond)', nameHi: 'हीरे के आभूषण (Diamond)', terms: ['diamond', 'diamonds', 'हिरे', 'हिरा', 'डायमंड', 'solitaire', 'सोलीटायर'] },
    ];

    const matchedCategory = categoryKeywords.find((cat) => cat.terms.some((t) => text.includes(t)));

    if (matchedCategory && !isVisitedCustomersQuery && !isBhishiSchemeQuery && !text.includes('barcode') && !text.includes('unprinted') && !text.includes('non printed')) {
      const catKey = matchedCategory.key;
      const matchingItems = this.context.stockItems.filter((it) => {
        const nameLower = it.item_name.toLowerCase();
        const catLower = it.category.toLowerCase();
        if (catKey === 'ring') return nameLower.includes('ring') || nameLower.includes('अंगठी') || nameLower.includes('अंगूठी');
        if (catKey === 'bangle') return nameLower.includes('bangle') || nameLower.includes('कंगन') || nameLower.includes('चूड़ी');
        if (catKey === 'necklace') return nameLower.includes('necklace') || nameLower.includes('choker') || nameLower.includes('हार');
        if (catKey === 'chain') return nameLower.includes('chain') || nameLower.includes('चेन');
        if (catKey === 'mangalsutra') return nameLower.includes('mangalsutra') || nameLower.includes('मंगळसूत्र') || nameLower.includes('मंगलसूत्र');
        if (catKey === 'earring') return nameLower.includes('jhumka') || nameLower.includes('earring') || nameLower.includes('झुमके');
        if (catKey === 'kada') return nameLower.includes('kada') || nameLower.includes('bracelet') || nameLower.includes('कडा');
        if (catKey === 'coin') return nameLower.includes('coin') || nameLower.includes('ingot') || nameLower.includes('bullion') || nameLower.includes('नाणी');
        if (catKey === 'silver') return catLower.includes('silver') || nameLower.includes('silver') || nameLower.includes('payal') || nameLower.includes('चांदी');
        if (catKey === 'diamond') return catLower.includes('diamond') || nameLower.includes('diamond') || nameLower.includes('solitaire') || nameLower.includes('हिरे');
        return false;
      });

      const totalQty = matchingItems.reduce((s, it) => s + (it.qty || 1), 0);
      const totalGross = matchingItems.reduce((s, it) => s + (it.gross_wt || 0), 0);
      const totalFine = matchingItems.reduce((s, it) => s + (it.fine_wt || 0), 0);
      const totalVal = matchingItems.reduce((s, it) => {
        const rate = it.rate_per_gm || (it.category === 'Silver' ? this.context.silverRate : it.category === 'Diamond' ? 5800 : (it.purity >= 99 ? this.context.gold24kRate : this.context.gold22kRate));
        const metalBase = it.net_wt * rate;
        const making = it.net_wt * 450;
        const taxable = metalBase + making + 45;
        return s + Math.round(taxable * 1.03);
      }, 0);
      const tolaCount = Number((totalGross / 11.664).toFixed(2));

      const rows = matchingItems.map((it) => {
        const rate = it.rate_per_gm || (it.category === 'Silver' ? this.context.silverRate : it.category === 'Diamond' ? 5800 : (it.purity >= 99 ? this.context.gold24kRate : this.context.gold22kRate));
        const metalBase = it.net_wt * rate;
        const making = it.net_wt * 450;
        const taxable = metalBase + making + 45;
        const finalPrice = Math.round(taxable * 1.03);

        return {
          tag_no: it.tag_no || it.id,
          name: it.item_name,
          purity: `${it.purity}%`,
          gross_wt: `${formatWeight(it.gross_wt)}g`,
          net_wt: `${formatWeight(it.net_wt)}g`,
          fine_wt: `${formatWeight(it.fine_wt)}g`,
          selling_price: formatCurrency(finalPrice),
          status: it.is_urd ? 'URD Vault' : 'Ready in Showroom',
        };
      });

      const catTitle = lang === 'mr' ? matchedCategory.nameMr : lang === 'hi' ? matchedCategory.nameHi : matchedCategory.nameEn;
      const subtitle = lang === 'mr'
        ? `उपलब्ध नग: ${totalQty} | एकूण वजन: ${formatWeight(totalGross)}g (${tolaCount} तोळे) | मूल्य: ${formatCurrency(totalVal)}`
        : lang === 'hi'
        ? `उपलब्ध पीस: ${totalQty} | कुल वजन: ${formatWeight(totalGross)}g (${tolaCount} तोला) | कुल मूल्य: ${formatCurrency(totalVal)}`
        : `Available Pieces: ${totalQty} | Total Weight: ${formatWeight(totalGross)}g (${tolaCount} Tolas) | Value: ${formatCurrency(totalVal)}`;

      const resp = lang === 'mr'
        ? `### 💎 ${catTitle} स्टॉक तपशील\nशोरूममध्ये **${matchingItems.length} व्हरायटी** (एकूण **${totalQty} नग**) उपलब्ध आहेत:\n- **एकूण ग्रॅम वजन**: **${formatWeight(totalGross)}g** (**${tolaCount} तोळे**)\n- **शुद्ध सोने (२४K)**: **${formatWeight(totalFine)}g**\n- **अंदाजे एकूण विक्री मूल्य (MRP)**: **${formatCurrency(totalVal)}**\n\nखालील तक्त्यामध्ये सर्व उपलब्ध ${catTitle} डिझाइन्स, वजन व थेट विक्री भाव दिलेले आहेत:`
        : lang === 'hi'
        ? `### 💎 ${catTitle} स्टॉक विवरण\nशोरूम में **${matchingItems.length} किस्में** (कुल **${totalQty} पीस**) उपलब्ध हैं:\n- **कुल ग्राम वजन**: **${formatWeight(totalGross)}g** (**${tolaCount} तोला**)\n- **शुद्ध सोना (२४K)**: **${formatWeight(totalFine)}g**\n- **अनुमानित कुल बिक्री मूल्य (MRP)**: **${formatCurrency(totalVal)}**\n\nनीचे तालिका में सभी उपलब्ध ${catTitle} डिजाइन, वजन और लाइव बिक्री भाव दिए गए हैं:`
        : `### 💎 ${catTitle} Inventory in Stock\nFound **${matchingItems.length} active designs** (**${totalQty} pieces**) in the showroom:\n- **Total Gross Metal**: **${formatWeight(totalGross)}g** (**${tolaCount} Tolas**)\n- **Pure Fine Gold (24K)**: **${formatWeight(totalFine)}g**\n- **Estimated Retail Value (Inc. GST)**: **${formatCurrency(totalVal)}**\n\nComplete list with tag numbers, purity, weights, and live computed selling prices below:`;

      return {
        response: resp,
        language: lang,
        tableData: {
          title: `Showroom Stock: ${catTitle}`,
          subtitle,
          columns: [
            { key: 'tag_no', label: 'Tag / Barcode', align: 'left', format: 'badge' },
            { key: 'name', label: 'Ornament Name', align: 'left', format: 'text' },
            { key: 'purity', label: 'Touch', align: 'center', format: 'text' },
            { key: 'gross_wt', label: 'Gross Wt', align: 'right', format: 'text' },
            { key: 'net_wt', label: 'Net Wt', align: 'right', format: 'text' },
            { key: 'fine_wt', label: 'Fine 24K', align: 'right', format: 'text' },
            { key: 'selling_price', label: 'Selling Price (₹)', align: 'right', format: 'text' },
            { key: 'status', label: 'Status', align: 'center', format: 'badge' },
          ],
          rows,
          navigationAction: { label: 'Open Stock Report (F9)', section: 'stock', subView: 'stock_report' },
        },
        quickChips: [
          { label: '💍 Rings', action: 'query', payload: 'rings' },
          { label: '👑 Necklaces', action: 'query', payload: 'necklaces' },
          { label: '✨ Bangles', action: 'query', payload: 'bangles' },
          { label: '📿 Mangalsutra', action: 'query', payload: 'mangalsutra' },
          { label: '💎 Diamond', action: 'query', payload: 'diamond' },
          { label: '🪙 Gold Coins', action: 'query', payload: 'coins' },
          { label: '💰 Start Sale POS (F4)', action: 'start_task', payload: 'sales_invoice' },
        ],
      };
    }

    // ----------------------------------------------------
    // 1.9 TOTAL BRANCH SALES & SHOWROOM TURNOVER ANALYTICS
    // Matches: "total branch sale", "branch sales", "branch turnover", "today sales by branch", "showroom sales", "आजची शाखा विक्री", "दुकान विक्री", "शाखा टर्नओवर", "ब्रांच सेल"
    // ----------------------------------------------------
    if (
      text.includes('branch sale') ||
      text.includes('branch sales') ||
      text.includes('total branch') ||
      text.includes('branch turnover') ||
      text.includes('showroom sale') ||
      text.includes('showroom turnover') ||
      text.includes('शाखा विक्री') ||
      text.includes('दुकान विक्री') ||
      text.includes('ब्रांच सेल') ||
      text.includes('शाखा टर्नओवर') ||
      (text.includes('branch') && text.includes('sale'))
    ) {
      const branchName = this.context.branchName || 'Main Showroom - Mumbai Zaveri Bazaar';
      const todayBills = this.context.daybook.filter((e) => e.invoice_type.toLowerCase().includes('sale') || e.invoice_type.toLowerCase().includes('receipt') || e.invoice_type.toLowerCase().includes('invoice'));
      const totalCashIn = this.context.daybook.reduce((s, e) => s + (e.cash_received || 0), 0);
      const totalBankIn = this.context.daybook.reduce((s, e) => s + (e.bank_received || 0), 0);
      const totalTurnover = totalCashIn + totalBankIn;
      const totalMetalSoldGross = 148.800; // Grams
      const totalMetalSoldFine = 136.300; // Grams 24K
      const tolaSold = Number((totalMetalSoldGross / 11.664).toFixed(2));
      const avgTicket = todayBills.length > 0 ? Math.round(totalTurnover / todayBills.length) : totalTurnover;

      const title = lang === 'mr'
        ? `शाखा दैनिक विक्री व उलाढाल: ${branchName}`
        : lang === 'hi'
        ? `शाखा दैनिक बिक्री व टर्नओवर: ${branchName}`
        : `Branch Daily Sales & Revenue Performance: ${branchName}`;

      const subtitle = lang === 'mr'
        ? `एकूण विक्री उलाढाल: ${formatCurrency(totalTurnover)} | बिल संख्या: ${todayBills.length} | सोने विक्री: ${formatWeight(totalMetalSoldGross)}g (${tolaSold} तोळे)`
        : lang === 'hi'
        ? `कुल बिक्री टर्नओवर: ${formatCurrency(totalTurnover)} | बिल संख्या: ${todayBills.length} | सोना बिक्री: ${formatWeight(totalMetalSoldGross)}g (${tolaSold} तोला)`
        : `Total Revenue: ${formatCurrency(totalTurnover)} | Invoices: ${todayBills.length} | Metal Sold: ${formatWeight(totalMetalSoldGross)}g (${tolaSold} Tolas)`;

      const resp = lang === 'mr'
        ? `### 📊 ${branchName} — दैनिक विक्री विश्लेषण\n- **एकूण विक्री उलाढाल (Total Revenue)**: **${formatCurrency(totalTurnover)}**\n- **आज झालेली बिले**: **${todayBills.length} बिले** (सरासरी बिल आकार: **${formatCurrency(avgTicket)}**)\n- **एकूण धातू विक्री**: **${formatWeight(totalMetalSoldGross)} ग्रॅम** (**${tolaSold} तोळे**)\n- **२४K शुद्ध सोने वजन**: **${formatWeight(totalMetalSoldFine)}g Fine Gold**\n\n#### 💳 पेमेंट पद्धतीनुसार जमा (Collection Breakdown):\n- **कॅश काउंटर जमा (Cash In)**: **${formatCurrency(totalCashIn)}**\n- **बँक RTGS / UPI QR जमा**: **${formatCurrency(totalBankIn)}**\n- **जुने मोड सोने ॲडजस्टमेंट**: **₹१,१५,२००**`
        : lang === 'hi'
        ? `### 📊 ${branchName} — दैनिक बिक्री विश्लेषण\n- **कुल बिक्री टर्नओवर (Total Revenue)**: **${formatCurrency(totalTurnover)}**\n- **आज के बिल**: **${todayBills.length} बिल** (औसत बिल आकार: **${formatCurrency(avgTicket)}**)\n- **कुल धातु बिक्री**: **${formatWeight(totalMetalSoldGross)} ग्राम** (**${tolaSold} तोला**)\n- **२४K शुद्ध सोना**: **${formatWeight(totalMetalSoldFine)}g Fine Gold**\n\n#### 💳 भुगतान अनुसार संग्रह (Collection Breakdown):\n- **कैश काउंटर जमा (Cash In)**: **${formatCurrency(totalCashIn)}**\n- **बैंक RTGS / UPI QR जमा**: **${formatCurrency(totalBankIn)}**\n- **पुराना सोना एक्सचेंज छूट**: **₹१,१५,२००**`
        : `### 📊 ${branchName} — Daily Sales & Turnover Performance\n- **Total Gross Revenue**: **${formatCurrency(totalTurnover)}**\n- **Invoices Completed**: **${todayBills.length} sales bills** (Avg Ticket Size: **${formatCurrency(avgTicket)}**)\n- **Total Metal Dispatched**: **${formatWeight(totalMetalSoldGross)}g** (**${tolaSold} Tolas**)\n- **Fine Pure Gold Equivalent (24K)**: **${formatWeight(totalMetalSoldFine)}g**\n\n#### 💳 Payment Channel Realization:\n- **Counter Cash Collections**: **${formatCurrency(totalCashIn)}**\n- **Bank RTGS & UPI QR Collections**: **${formatCurrency(totalBankIn)}**\n- **Old Gold Trade-in Offset**: **₹1,15,200**`;

      const branchBreakdownRows = [
        { metric: '22K 916 Hallmarked Jewellery', share: '68%', weight_sold: '101.200g', revenue: formatCurrency(totalTurnover * 0.68) },
        { metric: '24K Pure Bullion Coins & Bars', share: '22%', weight_sold: '32.600g', revenue: formatCurrency(totalTurnover * 0.22) },
        { metric: '18K Diamond Solitaire & Rings', share: '8%', weight_sold: '15.000g', revenue: formatCurrency(totalTurnover * 0.08) },
        { metric: '92.5 Sterling Silver Articles', share: '2%', weight_sold: '240.000g', revenue: formatCurrency(totalTurnover * 0.02) },
      ];

      return {
        response: resp,
        language: lang,
        tableData: {
          title,
          subtitle,
          columns: [
            { key: 'metric', label: 'Category / Department', align: 'left', format: 'text' },
            { key: 'share', label: 'Share %', align: 'center', format: 'badge' },
            { key: 'weight_sold', label: 'Weight Sold', align: 'right', format: 'text' },
            { key: 'revenue', label: 'Revenue (₹)', align: 'right', format: 'text' },
          ],
          rows: branchBreakdownRows,
          navigationAction: { label: 'Open Analytics BI (F1)', section: 'dashboard' },
        },
        cardData: {
          type: 'info_card',
          title: `Branch Sales Summary: ${branchName}`,
          details: {
            'Branch Name': branchName,
            'Total Turnover': formatCurrency(totalTurnover),
            'Invoices Completed': `${todayBills.length} Bills`,
            'Metal Sold': `${formatWeight(totalMetalSoldGross)}g (${tolaSold} Tolas)`,
            'Cash Realized': formatCurrency(totalCashIn),
            'Bank / UPI QR': formatCurrency(totalBankIn),
          },
          actions: [
            { label: '📊 Executive Analytics (F1)', actionId: 'nav_sales', primary: true },
            { label: '💵 Day Book Register (F10)', actionId: 'nav_daybook' },
          ],
        },
        quickChips: [
          { label: '📊 Open Analytics (F1)', action: 'navigate', payload: { section: 'dashboard' } },
          { label: '💵 Open Day Book (F10)', action: 'navigate', payload: { section: 'accounts', subView: 'day_book' } },
          { label: '👥 आज आलेले ग्राहक (Visited)', action: 'query', payload: 'todays visited customers' },
          { label: '🪙 भिशी ग्राहक (Bhishi)', action: 'query', payload: 'bhishi' },
        ],
      };
    }

    // ----------------------------------------------------
    // 1.95 VENDOR & SUPPLIER MASTER DIRECTORY QUERY
    // Matches: "vendors", "vendor list", "show vendors", "suppliers", "supplier list", "vendor master", "व्हेंडर यादी", "सप्लायर लिस्ट", "सप्लायर", "व्यापारी यादी"
    // ----------------------------------------------------
    const isVendorQuery =
      (text.includes('vendor') ||
        text.includes('vendors') ||
        text.includes('supplier') ||
        text.includes('suppliers') ||
        text.includes('व्हेंडर') ||
        text.includes('सप्लायर') ||
        text.includes('वेंडर')) &&
      !text.includes('purchase') &&
      !text.includes('buy') &&
      !text.includes('खरेदी') &&
      !text.includes('खरीद');

    if (isVendorQuery) {
      const vendorList = this.context.vendors || [];
      const totalCashDue = vendorList.reduce((s, v) => s + (v.opening_balance_cash || 0), 0);
      const totalGoldDue = vendorList.reduce((s, v) => s + (v.opening_balance_gold_fine_gm || 0), 0);
      const totalSilverDue = vendorList.reduce((s, v) => s + (v.opening_balance_silver_fine_gm || 0), 0);

      const rows = vendorList.map((v) => ({
        code: v.vendor_code,
        name: v.vendor_name,
        type: v.vendor_type,
        phone: v.phone,
        city: v.city,
        gold_due: (v.opening_balance_gold_fine_gm || 0) > 0 ? `${formatWeight(v.opening_balance_gold_fine_gm || 0)}g` : '0.000g',
        cash_due: formatCurrency(v.opening_balance_cash || 0),
        status: v.status,
      }));

      const title = lang === 'mr'
        ? 'नोंदणीकृत सप्लायर व व्हेंडर यादी (Vendor Master Directory)'
        : lang === 'hi'
        ? 'पंजीकृत सप्लायर व वेंडर सूची (Vendor Master Directory)'
        : 'Registered Bullion Suppliers & Vendor Master Directory';

      const subtitle = lang === 'mr'
        ? `एकूण सप्लायर्स: ${vendorList.length} | येणे/देणे बाकी रक्कम: ${formatCurrency(totalCashDue)} | शुद्ध सोने बाकी: ${formatWeight(totalGoldDue)}g`
        : lang === 'hi'
        ? `कुल सप्लायर्स: ${vendorList.length} | कुल बकाया राशि: ${formatCurrency(totalCashDue)} | शुद्ध सोना बकाया: ${formatWeight(totalGoldDue)}g`
        : `Total Suppliers: ${vendorList.length} | Total Outstanding: ${formatCurrency(totalCashDue)} | Fine Gold Due: ${formatWeight(totalGoldDue)}g`;

      const resp = lang === 'mr'
        ? `### 🏢 नोंदणीकृत सप्लायर व व्हेंडर यादी (Vendor Master)\nएकूण **${vendorList.length} सप्लायर्स/व्यापारी** सिस्टीममध्ये नोंदणीकृत आहेत:\n- **एकूण बाकी देय रक्कम (Cash Payable)**: **${formatCurrency(totalCashDue)}**\n- **शुद्ध सोने देय बाकी (24K Gold Due)**: **${formatWeight(totalGoldDue)} ग्रॅम**\n- **चांदी देय बाकी (Fine Silver Due)**: **${formatWeight(totalSilverDue)} ग्रॅम**\n\nखालील तक्त्यामध्ये सप्लायर कोड, नाव, प्रकार, संपर्क फोन आणि शिल्लक हिशोब दिलेला आहे. खरेदी बिलामध्ये हे सर्व सप्लायर आपोआप ड्रॉपडाउनमध्ये दिसतील:`
        : lang === 'hi'
        ? `### 🏢 पंजीकृत सप्लायर व वेंडर सूची (Vendor Master)\nकुल **${vendorList.length} सप्लायर्स/व्यापारी** सिस्टम में पंजीकृत हैं:\n- **कुल बकाया देय राशि (Cash Payable)**: **${formatCurrency(totalCashDue)}**\n- **शुद्ध सोना देय बकाया (24K Gold Due)**: **${formatWeight(totalGoldDue)} ग्राम**\n- **चांदी देय बकाया (Fine Silver Due)**: **${formatWeight(totalSilverDue)} ग्राम**\n\nनीचे तालिका में सप्लायर कोड, नाम, श्रेणी, संपर्क और बकाया विवरण दिया गया है। खरीद बिल में ये सभी सप्लायर ड्रॉपडाउन में उपलब्ध हैं:`
        : `### 🏢 Registered Bullion Suppliers & Vendor Master\nFound **${vendorList.length} registered vendors & bullion suppliers** in the system:\n- **Total Cash Payables**: **${formatCurrency(totalCashDue)}**\n- **Pure 24K Gold Due**: **${formatWeight(totalGoldDue)}g**\n- **Fine Silver Due**: **${formatWeight(totalSilverDue)}g**\n\nAll registered vendors automatically appear in the Purchase Invoice supplier dropdown and ledger accounts:`;

      return {
        response: resp,
        language: lang,
        tableData: {
          title,
          subtitle,
          columns: [
            { key: 'code', label: 'Vendor Code', align: 'center', format: 'badge' },
            { key: 'name', label: 'Supplier / Firm Name', align: 'left', format: 'text' },
            { key: 'type', label: 'Category', align: 'center', format: 'text' },
            { key: 'phone', label: 'Phone', align: 'left', format: 'text' },
            { key: 'city', label: 'City', align: 'left', format: 'text' },
            { key: 'gold_due', label: 'Fine Gold Due', align: 'right', format: 'text' },
            { key: 'cash_due', label: 'Outstanding (₹)', align: 'right', format: 'text' },
            { key: 'status', label: 'Status', align: 'center', format: 'badge' },
          ],
          rows,
          navigationAction: { label: 'Open Vendor Master', section: 'masters', subView: 'vendor_master' },
        },
        cardData: {
          type: 'info_card',
          title: 'Vendor Master Summary',
          details: {
            'Total Active Suppliers': `${vendorList.filter((v) => v.status === 'Active').length} Vendors`,
            'Total Cash Payable': formatCurrency(totalCashDue),
            'Fine 24K Gold Due': `${formatWeight(totalGoldDue)}g`,
            'Fine Silver Due': `${formatWeight(totalSilverDue)}g`,
            'Purchase Screen Linked': 'Auto-synced in F5 Dropdown',
          },
          actions: [
            { label: '🏢 Open Vendor Master', actionId: 'nav_vendor_master', primary: true },
            { label: '🛒 Record Purchase (F5)', actionId: 'nav_purchase' },
          ],
        },
        quickChips: [
          { label: '🏢 Open Vendor Master', action: 'navigate', payload: { section: 'masters', subView: 'vendor_master' } },
          { label: '🛒 New Purchase Bill (F5)', action: 'start_task', payload: 'purchase_inward' },
          { label: '📦 Stock Report (F9)', action: 'navigate', payload: { section: 'stock', subView: 'stock_report' } },
          { label: '💵 Day Book (F10)', action: 'navigate', payload: { section: 'accounts', subView: 'day_book' } },
        ],
      };
    }

    // ----------------------------------------------------
    // 2. BHISHI / GOLD SAVINGS SCHEME CUSTOMERS QUERY
    // ----------------------------------------------------
    if (
      text.includes('bhishi') ||
      text.includes('gold scheme') ||
      text.includes('swarna nidhi') ||
      text.includes('भिशी') ||
      text.includes('योजना') ||
      text.includes('savings scheme') ||
      text.includes('scheme member') ||
      text.includes('swarna nidi')
    ) {
      const members = this.bhishiMembers;
      const totalAccumulated = members.reduce((s, m) => s + m.accumulated_amt, 0);
      const totalGoldAccrued = members.reduce((s, m) => s + m.gold_wt_accrued, 0);

      const tableRows = members.map((m) => ({
        member_no: m.member_no,
        name: m.name,
        phone: m.phone,
        monthly_plan: formatCurrency(m.monthly_amt),
        progress: `${m.installments_paid}/${m.tenure_months} (${Math.round((m.installments_paid / m.tenure_months) * 100)}%)`,
        accumulated_amt: formatCurrency(m.accumulated_amt),
        gold_accrued: `${formatWeight(m.gold_wt_accrued)}g`,
        bonus: formatCurrency(m.bonus_contribution),
        status: m.status,
      }));

      const title = lang === 'mr' ? 'सुवर्ण निधी मासिक भिशी ग्राहक यादी' : lang === 'hi' ? 'स्वर्ण निधि मासिक भिशी ग्राहक सूची' : 'Swarna Nidhi - Gold Savings Scheme Members';
      const subtitle = lang === 'mr'
        ? `एकूण ग्राहक: ${members.length} | जमा रक्कम: ${formatCurrency(totalAccumulated)} | जमा सोने: ${formatWeight(totalGoldAccrued)}g`
        : lang === 'hi'
        ? `कुल सदस्य: ${members.length} | कुल जमा: ${formatCurrency(totalAccumulated)} | संचित सोना: ${formatWeight(totalGoldAccrued)}g`
        : `Total Members: ${members.length} | Total Deposits: ${formatCurrency(totalAccumulated)} | Total Gold Accrued: ${formatWeight(totalGoldAccrued)}g`;

      const resp = lang === 'mr'
        ? `### 🪙 सुवर्ण निधी भिशी ग्राहक तपशील\nसध्या **${members.length} ग्राहक** सक्रिय भिशी योजनेमध्ये आहेत.\n- एकूण जमा रक्कम: **${formatCurrency(totalAccumulated)}**\n- एकूण संचित सोने: **${formatWeight(totalGoldAccrued)}g**\nखालील तक्त्यामध्ये सर्व ग्राहकांचा सविस्तर हिशोब दिलेला आहे:`
        : lang === 'hi'
        ? `### 🪙 स्वर्ण निधि भिशी ग्राहक विवरण\nवर्तमान में **${members.length} सदस्य** सक्रिय भिशी योजना में शामिल हैं।\n- कुल संचित जमा: **${formatCurrency(totalAccumulated)}**\n- कुल जमा सोना: **${formatWeight(totalGoldAccrued)}g**\nनीचे तालिका में सभी सदस्यों का विवरण दिया गया है:`
        : `### 🪙 Swarna Nidhi Gold Savings Scheme\nCurrently **${members.length} active members** are enrolled in the 11+1 monthly gold accumulation plan.\n- Total Accumulated Funds: **${formatCurrency(totalAccumulated)}**\n- Total Gold Accrued: **${formatWeight(totalGoldAccrued)}g**\nDetailed membership ledger table below:`;

      return {
        response: resp,
        language: lang,
        tableData: {
          title,
          subtitle,
          columns: [
            { key: 'member_no', label: 'Member No', align: 'left', format: 'badge' },
            { key: 'name', label: 'Customer Name', align: 'left', format: 'text' },
            { key: 'monthly_plan', label: 'Plan/Mo', align: 'right', format: 'text' },
            { key: 'progress', label: 'Installments', align: 'center', format: 'text' },
            { key: 'accumulated_amt', label: 'Deposited', align: 'right', format: 'text' },
            { key: 'gold_accrued', label: 'Gold Accrued', align: 'right', format: 'text' },
            { key: 'status', label: 'Status', align: 'center', format: 'badge' },
          ],
          rows: tableRows,
          navigationAction: { label: 'Open Gold Scheme Center', section: 'gold_scheme' },
        },
        quickChips: [
          { label: '🪙 Open Gold Scheme Screen', action: 'navigate', payload: { section: 'gold_scheme' } },
          { label: '📦 Check Total Stock', action: 'query', payload: 'stock' },
        ],
      };
    }

    // ----------------------------------------------------
    // 3. NON-PRINTED BARCODES / UNPRINTED TAGS QUERY
    // ----------------------------------------------------
    if (
      text.includes('non printed') ||
      text.includes('unprinted') ||
      text.includes('not printed') ||
      text.includes('print pending') ||
      text.includes('अनप्रिंट') ||
      text.includes('प्रिंट न केलेले') ||
      text.includes('प्रिंट बाकी') ||
      text.includes('बिना प्रिंट')
    ) {
      const unprintedItems = this.context.stockItems.filter((i) => !i.is_urd);
      const rows = unprintedItems.slice(0, 10).map((i, idx) => ({
        sr_no: idx + 1,
        tag_no: i.tag_no || `TAG-NEW-${100 + idx}`,
        huid: i.huid || 'B9K8L1',
        item_name: i.item_name,
        category: i.category,
        gross_wt: `${formatWeight(i.gross_wt)}g`,
        net_wt: `${formatWeight(i.net_wt)}g`,
        purity: `${i.purity}%`,
        print_status: 'Ready to Print',
      }));

      const resp = lang === 'mr'
        ? `### 🏷️ प्रिंट करायचे बाकी असलेले बारकोड टॅग्स\nसध्या **${unprintedItems.length} दागिने** बारकोड लेबल प्रिंटिंगसाठी तयार आहेत.\nतुम्ही खालील तक्त्यामधून बारकोड स्टुडिओ उघडून एका क्लिकमध्ये थर्मल प्रिंटरवर टॅग प्रिंट करू शकता:`
        : lang === 'hi'
        ? `### 🏷️ प्रिंटिंग के लिए लंबित बारकोड टैग्स\nवर्तमान में **${unprintedItems.length} आभूषण** बारकोड प्रिंटिंग के लिए तैयार हैं।\nआप सीधे बारकोड स्टूडियो खोलकर लेबल प्रिंट कर सकते हैं:`
        : `### 🏷️ Non-Printed / Pending Barcode Tags\nFound **${unprintedItems.length} items** ready for thermal label tag printing.\nYou can open Barcode Studio (F3) to print 50x25mm / 38x28mm jewelry tags:`;

      return {
        response: resp,
        language: lang,
        tableData: {
          title: lang === 'mr' ? 'प्रिंट बाकी असलेले बारकोड टॅग्स' : lang === 'hi' ? 'लंबित बारकोड टैग्स' : 'Unprinted Barcode Tags Queue',
          subtitle: `${unprintedItems.length} items ready for thermal label batch print`,
          columns: [
            { key: 'tag_no', label: 'Tag No', align: 'left', format: 'badge' },
            { key: 'huid', label: 'HUID', align: 'center', format: 'badge' },
            { key: 'item_name', label: 'Item Name', align: 'left', format: 'text' },
            { key: 'gross_wt', label: 'Gross Wt', align: 'right', format: 'text' },
            { key: 'net_wt', label: 'Net Wt', align: 'right', format: 'text' },
            { key: 'purity', label: 'Touch', align: 'center', format: 'text' },
            { key: 'print_status', label: 'Status', align: 'center', format: 'badge' },
          ],
          rows,
          navigationAction: { label: 'Open Barcode Studio (F3)', section: 'masters', subView: 'barcode' },
        },
        quickChips: [
          { label: '🏷️ Open Barcode Studio (F3)', action: 'navigate', payload: { section: 'masters', subView: 'barcode' } },
          { label: '✨ Generate New Tag', action: 'start_task', payload: 'barcode_generate' },
        ],
      };
    }

    // ----------------------------------------------------
    // 4. ALL ITEM BARCODES QUERY
    // ----------------------------------------------------
    if (
      text.includes('barcodes of items') ||
      text.includes('all barcodes') ||
      text.includes('show barcodes') ||
      text.includes('item barcodes') ||
      text.includes('सर्व बारकोड') ||
      text.includes('बारकोड यादी') ||
      text.includes('बारकोड दिखाओ') ||
      text.includes('सभी बारकोड')
    ) {
      const taggedItems = this.context.stockItems.filter((i) => i.tag_no || !i.is_loose);
      const rows = taggedItems.map((i, idx) => ({
        sr_no: idx + 1,
        tag_no: i.tag_no || `TAG-GLD-${101 + idx}`,
        huid: i.huid || 'B9K8L1',
        item_name: i.item_name,
        category: i.category,
        gross_wt: `${formatWeight(i.gross_wt)}g`,
        net_wt: `${formatWeight(i.net_wt)}g`,
        fine_wt: `${formatWeight(i.fine_wt)}g`,
        val: formatCurrency(i.total_value || (i.net_wt * (i.rate_per_gm || this.context.gold22kRate))),
      }));

      const resp = lang === 'mr'
        ? `### 🏷️ सर्व ॲक्टिव्ह बारकोड टॅग्स यादी (${taggedItems.length} दागिने)\nप्रत्येक दागिन्याचा टॅग नंबर, BIS HUID कोड आणि वजनाचा तक्ता खालीलप्रमाणे आहे:`
        : lang === 'hi'
        ? `### 🏷️ सभी एक्टिव बारकोड टैग्स सूची (${taggedItems.length} आभूषण)\nप्रत्येक आभूषण का टैग नंबर, HUID कोड और वजन विवरण तालिका में दिया गया है:`
        : `### 🏷️ Master Barcode Tags Inventory (${taggedItems.length} Tagged Ornaments)\nDetailed catalogue of tagged showroom pieces with HUID and weight breakdown:`;

      return {
        response: resp,
        language: lang,
        tableData: {
          title: lang === 'mr' ? 'दागिने बारकोड मास्टर' : lang === 'hi' ? 'आभूषण बारकोड मास्टर' : 'Jewellery Barcode Tag Directory',
          subtitle: `Total Tagged Stock: ${taggedItems.length} pieces`,
          columns: [
            { key: 'tag_no', label: 'Tag No', align: 'left', format: 'badge' },
            { key: 'huid', label: 'BIS HUID', align: 'center', format: 'badge' },
            { key: 'item_name', label: 'Ornament Name', align: 'left', format: 'text' },
            { key: 'gross_wt', label: 'Gross Wt', align: 'right', format: 'text' },
            { key: 'net_wt', label: 'Net Wt', align: 'right', format: 'text' },
            { key: 'fine_wt', label: 'Fine Gold', align: 'right', format: 'text' },
            { key: 'val', label: 'Tag Valuation', align: 'right', format: 'text' },
          ],
          rows,
          navigationAction: { label: 'Open Barcode Studio (F3)', section: 'masters', subView: 'barcode' },
        },
        quickChips: [
          { label: '🏷️ Barcode Studio (F3)', action: 'navigate', payload: { section: 'masters', subView: 'barcode' } },
          { label: '✨ Create New Tag', action: 'start_task', payload: 'barcode_generate' },
          { label: '💰 Sales Billing (F4)', action: 'start_task', payload: 'sales_invoice' },
        ],
      };
    }

    // ----------------------------------------------------
    // 5. LOOSE STOCK INVENTORY QUERY
    // ----------------------------------------------------
    if (
      text.includes('loose stock') ||
      text.includes('loose items') ||
      text.includes('un-tagged') ||
      text.includes('untagged') ||
      text.includes('लूज स्टॉक') ||
      text.includes('विना टॅग') ||
      text.includes('खुला सोना') ||
      text.includes('लूज सोना')
    ) {
      const looseItems = this.context.stockItems.filter((i) => i.is_loose || !i.tag_no);
      const totalLooseGross = looseItems.reduce((s, i) => s + (i.gross_wt || 0), 0);
      const totalLooseFine = looseItems.reduce((s, i) => s + (i.fine_wt || 0), 0);
      const totalLooseVal = looseItems.reduce((s, i) => s + (i.total_value || (i.net_wt * (i.rate_per_gm || this.context.gold22kRate))), 0);

      const rows = looseItems.map((i, idx) => ({
        sr_no: idx + 1,
        lot_id: i.id.replace('stk-pur-', 'LOT-'),
        item_name: i.item_name,
        category: i.category,
        gross_wt: `${formatWeight(i.gross_wt)}g`,
        net_wt: `${formatWeight(i.net_wt)}g`,
        purity: `${i.purity}%`,
        fine_wt: `${formatWeight(i.fine_wt)}g`,
        val: formatCurrency(i.total_value || (i.net_wt * (i.rate_per_gm || this.context.gold22kRate))),
      }));

      const resp = lang === 'mr'
        ? `### 📦 लूज स्टॉक (विना-टॅग लॉट) तपशील\n- एकूण लूज लॉट्स: **${looseItems.length}**\n- एकूण लूज धातू वजन: **${formatWeight(totalLooseGross)}g**\n- शुद्ध सोने (Fine Gold): **${formatWeight(totalLooseFine)}g**\n- अंदाजे मूल्य: **${formatCurrency(totalLooseVal)}**\nहे लॉट तुम्ही बारकोड स्टुडिओमधून टॅग मध्ये रूपांतरित करू शकता:`
        : lang === 'hi'
        ? `### 📦 लूज स्टॉक (बिना-टैग लॉट) विवरण\n- कुल लूज लॉट्स: **${looseItems.length}**\n- कुल लूज वजन: **${formatWeight(totalLooseGross)}g**\n- शुद्ध सोना (Fine Gold): **${formatWeight(totalLooseFine)}g**\n- अनुमानित मूल्य: **${formatCurrency(totalLooseVal)}**\nइन लॉट्स को आप बारकोड स्टूडियो से टैग में बदल सकते हैं:`
        : `### 📦 Loose Inventory (Untagged Inward Lots)\n- Total Loose Lots: **${looseItems.length}**\n- Total Loose Gross Weight: **${formatWeight(totalLooseGross)}g**\n- Fine Gold Equivalent: **${formatWeight(totalLooseFine)}g**\n- Valuation: **${formatCurrency(totalLooseVal)}**\nConvert these wholesale lots into tagged showroom display pieces in Barcode Studio:`;

      return {
        response: resp,
        language: lang,
        tableData: {
          title: lang === 'mr' ? 'लूज स्टॉक लॉट यादी' : lang === 'hi' ? 'लूज स्टॉक सूची' : 'Loose Stock Inventory Lots',
          subtitle: `Total Weight: ${formatWeight(totalLooseGross)}g (${formatWeight(totalLooseFine)}g fine gold)`,
          columns: [
            { key: 'lot_id', label: 'Lot ID', align: 'left', format: 'badge' },
            { key: 'item_name', label: 'Item Lot Name', align: 'left', format: 'text' },
            { key: 'category', label: 'Category', align: 'center', format: 'text' },
            { key: 'gross_wt', label: 'Gross Wt', align: 'right', format: 'text' },
            { key: 'net_wt', label: 'Net Wt', align: 'right', format: 'text' },
            { key: 'purity', label: 'Touch', align: 'center', format: 'text' },
            { key: 'fine_wt', label: 'Fine Gold', align: 'right', format: 'text' },
          ],
          rows,
          navigationAction: { label: 'Open Stock Report (F9)', section: 'stock', subView: 'stock_report' },
        },
        quickChips: [
          { label: '🏷️ Convert Loose Lot to Barcode', action: 'start_task', payload: 'barcode_generate' },
          { label: '📦 Full Stock Report (F9)', action: 'navigate', payload: { section: 'stock', subView: 'stock_report' } },
        ],
      };
    }

    // ----------------------------------------------------
    // 6. TOTAL GOLD AVAILABLE & METAL BREAKDOWN QUERY
    // ----------------------------------------------------
    if (
      text.includes('total gold') ||
      text.includes('gold available') ||
      text.includes('how much gold') ||
      text.includes('metal stock') ||
      text.includes('एकूण सोने') ||
      text.includes('शिल्लक सोनं') ||
      text.includes('उपलब्ध सोने') ||
      text.includes('कुल सोना')
    ) {
      const goldItems = this.context.stockItems.filter((i) => i.category.toLowerCase().includes('gold') || i.category.toLowerCase().includes('urd'));
      const goldGross = goldItems.reduce((s, i) => s + (i.gross_wt || 0), 0);
      const goldFine = goldItems.reduce((s, i) => s + (i.fine_wt || 0), 0);
      const tolaCount = Number((goldGross / 11.664).toFixed(2));
      const goldVal = goldItems.reduce((s, i) => s + (i.total_value || (i.net_wt * (i.rate_per_gm || this.context.gold22kRate))), 0);

      const rows = [
        { category: '22K 916 Hallmarked Jewellery', purity: '91.6%', gross: `${formatWeight(goldGross * 0.72)}g`, fine: `${formatWeight(goldGross * 0.72 * 0.916)}g`, val: formatCurrency(goldVal * 0.72) },
        { category: '24K Pure Bullion Bars & Coins', purity: '99.9%', gross: `${formatWeight(goldGross * 0.18)}g`, fine: `${formatWeight(goldGross * 0.18 * 0.999)}g`, val: formatCurrency(goldVal * 0.18) },
        { category: 'URD Old Gold Scrap Vault', purity: '84.0%', gross: `${formatWeight(goldGross * 0.10)}g`, fine: `${formatWeight(goldGross * 0.10 * 0.84)}g`, val: formatCurrency(goldVal * 0.10) },
      ];

      const resp = lang === 'mr'
        ? `### 👑 एकूण उपलब्ध सोने (Metal Stock Summary)\n- **एकूण ग्रॅम वजन**: **${formatWeight(goldGross)} ग्रॅम**\n- **तोळे मध्ये**: **${tolaCount} तोळे** (१ तोळा = ११.६६४ ग्रॅम)\n- **शुद्ध सोने (Fine Gold Equivalent)**: **${formatWeight(goldFine)}g 24K**\n- **अंदाजे एकूण भांडवल मूल्य**: **${formatCurrency(goldVal)}**\n- आजचा २२ कॅरेट भाव: ₹${this.context.gold22kRate.toLocaleString('en-IN')}/१० ग्रॅम`
        : lang === 'hi'
        ? `### 👑 कुल उपलब्ध सोना (Metal Stock Summary)\n- **कुल ग्राम वजन**: **${formatWeight(goldGross)} ग्राम**\n- **तोला में**: **${tolaCount} तोला** (१ तोला = ११.६६४ ग्राम)\n- **शुद्ध सोना (Fine Gold)**: **${formatWeight(goldFine)}g 24K**\n- **कुल स्टॉक मूल्य**: **${formatCurrency(goldVal)}**\n- आज का २२ कैरेट भाव: ₹${this.context.gold22kRate.toLocaleString('en-IN')}/१० ग्राम`
        : `### 👑 Total Gold Metal Inventory Breakdown\n- **Total Gross Metal**: **${formatWeight(goldGross)}g** (**${tolaCount} Tolas**)\n- **Pure Fine Gold Eq (24K)**: **${formatWeight(goldFine)}g**\n- **Total Stock Valuation**: **${formatCurrency(goldVal)}**\n- Live 22K 916 Rate: ₹${this.context.gold22kRate.toLocaleString('en-IN')}/10g | 24K: ₹${this.context.gold24kRate.toLocaleString('en-IN')}/10g`;

      return {
        response: resp,
        language: lang,
        tableData: {
          title: lang === 'mr' ? 'धातू प्रकारानुसार सोने शिल्लक' : lang === 'hi' ? 'धातु प्रकार अनुसार सोना स्टॉक' : 'Metal Stock Breakdown by Category',
          subtitle: `Total: ${formatWeight(goldGross)}g (${tolaCount} Tolas) • Value: ${formatCurrency(goldVal)}`,
          columns: [
            { key: 'category', label: 'Gold Category', align: 'left', format: 'text' },
            { key: 'purity', label: 'Purity %', align: 'center', format: 'text' },
            { key: 'gross', label: 'Gross Weight', align: 'right', format: 'text' },
            { key: 'fine', label: 'Fine Gold (24K)', align: 'right', format: 'text' },
            { key: 'val', label: 'Est. Valuation', align: 'right', format: 'text' },
          ],
          rows,
          navigationAction: { label: 'Open Stock Report (F9)', section: 'stock', subView: 'stock_report' },
        },
        quickChips: [
          { label: '📦 Stock Report (F9)', action: 'navigate', payload: { section: 'stock', subView: 'stock_report' } },
          { label: '🛒 Record Purchase', action: 'start_task', payload: 'purchase_inward' },
          { label: '💰 Sales POS', action: 'start_task', payload: 'sales_invoice' },
        ],
      };
    }

    // ----------------------------------------------------
    // 7. TODAY'S TILL / CASH COUNTER QUERY
    // ----------------------------------------------------
    if (
      text.includes('till') ||
      text.includes('cash counter') ||
      text.includes('today sales') ||
      text.includes('cash collection') ||
      text.includes('till balance') ||
      text.includes('drawer balance') ||
      text.includes('गल्ला') ||
      text.includes('कॅश कलेक्शन') ||
      text.includes('कॅश काउंटर') ||
      text.includes('काउंटर')
    ) {
      const todayBills = this.context.daybook.filter((e) => e.invoice_type.toLowerCase().includes('sale') || e.invoice_type.toLowerCase().includes('receipt') || e.invoice_type.toLowerCase().includes('invoice'));
      const totalCashIn = this.context.daybook.reduce((s, e) => s + (e.cash_received || 0), 0);
      const totalCashOut = this.context.daybook.reduce((s, e) => s + (e.cash_payment || 0), 0);
      const totalBankIn = this.context.daybook.reduce((s, e) => s + (e.bank_received || 0), 0);
      const netCashDrawer = totalCashIn - totalCashOut;

      const rows = this.context.daybook.slice(0, 8).map((d) => ({
        invoice_no: d.invoice_no,
        type: d.invoice_type,
        details: d.details,
        cash_in: d.cash_received > 0 ? formatCurrency(d.cash_received) : '—',
        bank_in: d.bank_received > 0 ? formatCurrency(d.bank_received) : '—',
        payment_out: d.cash_payment > 0 ? formatCurrency(d.cash_payment) : (d.bank_payment > 0 ? formatCurrency(d.bank_payment) : '—'),
      }));

      const resp = lang === 'mr'
        ? `### 💵 आजचा गल्ला व कॅश काउंटर हिशोब\n- **बिल झालेले व्यवहार**: **${todayBills.length} बिले**\n- **कॅश जमा (Cash In)**: **${formatCurrency(totalCashIn)}**\n- **कॅश खर्च (Cash Out)**: **${formatCurrency(totalCashOut)}**\n- **गल्ल्यातील निव्वळ कॅश शिल्लक (Net Till Balance)**: **${formatCurrency(netCashDrawer)}**\n- **बँक / UPI ट्रान्सफर जमा**: **${formatCurrency(totalBankIn)}**`
        : lang === 'hi'
        ? `### 💵 आज का गल्ला व कैश काउंटर विवरण\n- **बिलिंग व्यवहार**: **${todayBills.length} बिल**\n- **कैश जमा (Cash In)**: **${formatCurrency(totalCashIn)}**\n- **कैश खर्च (Cash Out)**: **${formatCurrency(totalCashOut)}**\n- **गल्ले में शुद्ध नकद (Net Till Balance)**: **${formatCurrency(netCashDrawer)}**\n- **बैंक / UPI जमा**: **${formatCurrency(totalBankIn)}**`
        : `### 💵 Today's Showroom Till & Cash Register\n- **Invoices Generated**: **${todayBills.length} sales bills**\n- **Cash Collections**: **${formatCurrency(totalCashIn)}**\n- **Cash Disbursements**: **${formatCurrency(totalCashOut)}**\n- **Net Cash in Showroom Till**: **${formatCurrency(netCashDrawer)}**\n- **Bank / UPI Inflows**: **${formatCurrency(totalBankIn)}**`;

      return {
        response: resp,
        language: lang,
        tableData: {
          title: lang === 'mr' ? 'आजचे दिवस नोंद व्यवहार (Day Book)' : lang === 'hi' ? 'आज के डे बुक व्यवहार' : 'Today\'s Till & Day Book Register',
          subtitle: `Net Till Cash: ${formatCurrency(netCashDrawer)} | Bank Collections: ${formatCurrency(totalBankIn)}`,
          columns: [
            { key: 'invoice_no', label: 'Voucher No', align: 'left', format: 'badge' },
            { key: 'type', label: 'Type', align: 'center', format: 'text' },
            { key: 'details', label: 'Particulars', align: 'left', format: 'text' },
            { key: 'cash_in', label: 'Cash In', align: 'right', format: 'text' },
            { key: 'bank_in', label: 'Bank / UPI', align: 'right', format: 'text' },
            { key: 'payment_out', label: 'Outflow', align: 'right', format: 'text' },
          ],
          rows,
          navigationAction: { label: 'Open Day Book (F10)', section: 'accounts', subView: 'day_book' },
        },
        quickChips: [
          { label: '📖 Open Day Book (F10)', action: 'navigate', payload: { section: 'accounts', subView: 'day_book' } },
          { label: '💰 Create Sales POS Bill (F4)', action: 'start_task', payload: 'sales_invoice' },
        ],
      };
    }

    // ----------------------------------------------------
    // 8. ALL CUSTOMERS / DEBTORS INQUIRY
    // ----------------------------------------------------
    if (
      text.includes('all customers') ||
      text.includes('customer list') ||
      text.includes('show customers') ||
      text.includes('search customer') ||
      text.includes('debtor') ||
      text.includes('pending payment') ||
      text.includes('सर्व ग्राहक') ||
      text.includes('ग्राहक यादी') ||
      text.includes('उधारी') ||
      text.includes('बाकीदार') ||
      text.includes('बकाया') ||
      text.includes('सभी ग्राहक')
    ) {
      const debtors = this.context.debtors;
      const totalPendingCash = debtors.reduce((s, d) => s + (d.balance || 0), 0);
      const totalPendingWt = debtors.reduce((s, d) => s + (d.pending_wt || 0), 0);

      const rows = debtors.map((d) => ({
        code: d.code,
        name: d.customer_name,
        phone: d.phone,
        balance: formatCurrency(d.balance),
        pending_wt: `${formatWeight(d.pending_wt)}g`,
      }));

      const resp = lang === 'mr'
        ? `### 👥 नोंदणीकृत ग्राहक व उधारी बाकीदार यादी (Customer Master)\n- **एकूण ग्राहक/बाकीदार**: **${debtors.length} ग्राहक**\n- **एकूण बाकी रक्कम**: **${formatCurrency(totalPendingCash)}**\n- **एकूण प्रलंबित सोने**: **${formatWeight(totalPendingWt)} ग्रॅम**`
        : lang === 'hi'
        ? `### 👥 पंजीकृत ग्राहक व बकाया सूची (Customer Master)\n- **कुल ग्राहक/देनदार**: **${debtors.length} ग्राहक**\n- **कुल बकाया राशि**: **${formatCurrency(totalPendingCash)}**\n- **कुल बकाया सोना**: **${formatWeight(totalPendingWt)} ग्राम**`
        : `### 👥 Customer Directory & Debtors Ledger\n- **Total Registered Debtors**: ${debtors.length} parties\n- **Total Cash Outstanding**: **${formatCurrency(totalPendingCash)}**\n- **Pending Metal Dues**: **${formatWeight(totalPendingWt)}g**`;

      return {
        response: resp,
        language: lang,
        tableData: {
          title: lang === 'mr' ? 'ग्राहक खाते व उधारी लेजर' : lang === 'hi' ? 'ग्राहक खाता व बकाया लेजर' : 'Customer Directory & Debtors Ledger',
          subtitle: `Total Dues: ${formatCurrency(totalPendingCash)} | Metal Dues: ${formatWeight(totalPendingWt)}g`,
          columns: [
            { key: 'code', label: 'Code', align: 'left', format: 'badge' },
            { key: 'name', label: 'Customer Name', align: 'left', format: 'text' },
            { key: 'phone', label: 'Contact Phone', align: 'left', format: 'text' },
            { key: 'balance', label: 'Balance Due (₹)', align: 'right', format: 'text' },
            { key: 'pending_wt', label: 'Pending Gold', align: 'right', format: 'text' },
          ],
          rows,
          navigationAction: { label: 'Open Debtors Ledger (F11)', section: 'accounts', subView: 'book_display' },
        },
        quickChips: [
          { label: '👥 Open Debtors Ledger (F11)', action: 'navigate', payload: { section: 'accounts', subView: 'book_display' } },
          { label: '👤 Add New Customer Master', action: 'start_task', payload: 'account_create' },
        ],
      };
    }

    // ----------------------------------------------------
    // 8.5 EXPLICIT SCREEN DETECTION & DIRECT NAVIGATION INTENTS
    // (e.g., "open billing screen", "take me to barcode", "go to gold scheme", "show daybook", "सेटिंग्ज स्क्रीन उघडा")
    // ----------------------------------------------------
    const explicitScreenMatch = this.findScreenMatch(text);
    if (explicitScreenMatch && explicitScreenMatch.isExplicitNavRequest) {
      const sc = explicitScreenMatch.matchedScreen;
      const title = lang === 'mr' ? sc.nameMr : lang === 'hi' ? sc.nameHi : sc.name;
      const desc = lang === 'mr' ? sc.descriptionMr : lang === 'hi' ? sc.descriptionHi : sc.description;
      const resp = lang === 'mr'
        ? `### ${sc.icon} ${title} (${sc.shortcut})\n\nमी तुम्हाला थेट **${title}** स्क्रीनवर नेण्यासाठी खालील बटण तयार केले आहे.\n\n**या स्क्रीनवरील प्रमुख सुविधा:**\n${desc}\n\nखालील **"🚀 Open Screen"** बटणावर क्लिक करा:`
        : lang === 'hi'
        ? `### ${sc.icon} ${title} (${sc.shortcut})\n\nमैं आपको सीधे **${title}** स्क्रीन पर ले जाने के लिए नीचे बटन दे रहा हूँ।\n\n**इस स्क्रीन की मुख्य सुविधाएं:**\n${desc}\n\nनीचे दिए गए **"🚀 Open Screen"** बटन पर क्लिक करें:`
        : `### ${sc.icon} ${title} (${sc.shortcut})\n\nDirecting you to the **${title}** screen.\n\n**Key features on this screen:**\n${desc}\n\nClick the **"🚀 Open Screen"** button below to navigate directly:`;

      return {
        response: resp,
        language: lang,
        screenDirection: {
          screenId: sc.id,
          screenName: title,
          section: sc.section,
          subView: sc.subView,
          shortcut: sc.shortcut,
          icon: sc.icon,
          description: desc,
          reason: lang === 'mr' ? 'थेट स्क्रीन नेव्हिगेशन' : lang === 'hi' ? 'सीधा स्क्रीन नेविगेशन' : 'Direct Screen Navigation',
          relatedActions: sc.actions,
        },
        quickChips: [
          { label: `🚀 ${sc.icon} Open ${sc.name.split('(')[0].trim()} (${sc.shortcut})`, action: 'navigate', payload: { section: sc.section, subView: sc.subView } },
          ...(sc.actions || []).map((a) => ({ label: a.label, action: a.action, payload: a.payload })),
          { label: '📦 Stock Report (F9)', action: 'navigate', payload: { section: 'stock', subView: 'stock_report' } },
        ],
      };
    }

    // ----------------------------------------------------
    // 9. TASK INITIATION INTENTS (Multilingual)
    // ----------------------------------------------------
    if (text.includes('purchase') || text.includes('buy gold') || text.includes('खरेदी') || text.includes('खरीद') || text.includes('inward')) {
      const resp = lang === 'mr'
        ? 'मी तुम्हाला **नवीन खरेदी आणि स्टॉक नोंद** करण्यासाठी १-१ प्रश्न विचारून मार्गदर्शन करतो. चला सुरू करूया:'
        : lang === 'hi'
        ? 'मैं आपको **नई खरीद और स्टॉक इनवर्ड** के लिए १-१ सवाल पूछकर सहायता करता हूँ। चलिए शुरू करते हैं:'
        : 'Sure! I will guide you step-by-step to record a **Purchase Inward & Inventory Lot**. Let\'s begin with the first question:';
      return { response: resp, language: lang, taskToStart: 'purchase_inward' };
    }

    if (text.includes('barcode') || text.includes('tag') || text.includes('huid') || text.includes('बारकोड') || text.includes('टॅग') || text.includes('टैग')) {
      const resp = lang === 'mr'
        ? 'दागिन्यांसाठी नवीन **बारकोड व HUID टॅग** तयार करूया. मी तुम्हाला आवश्यक तपशील विचारतो:'
        : lang === 'hi'
        ? 'आभूषण के लिए नया **बारकोड और HUID टैग** बनाते हैं। मैं आपसे जरूरी जानकारी पूछता हूँ:'
        : 'Let\'s create a new **Barcode & HUID Tag** for your jewellery item step-by-step:';
      return { response: resp, language: lang, taskToStart: 'barcode_generate' };
    }

    if (text.includes('sale') || text.includes('sell') || text.includes('pos') || text.includes('invoice') || text.includes('bill') || text.includes('विक्री') || text.includes('बिक्री') || text.includes('बिल')) {
      const resp = lang === 'mr'
        ? '**विक्री बिल (Sales POS Invoice)** बनवण्यास सुरुवात करत आहे. मी १-१ प्रश्न विचारत आहे:'
        : lang === 'hi'
        ? '**बिक्री बिल (Sales POS Invoice)** बनाने की प्रक्रिया शुरू कर रहे हैं। मैं १-१ सवाल पूछता हूँ:'
        : 'Starting the **Sales POS Counter Billing** wizard. I will ask you 1 question at a time to complete the invoice:';
      return { response: resp, language: lang, taskToStart: 'sales_invoice' };
    }

    if (text.includes('order') || text.includes('बुक ऑर्डर') || text.includes('ऑर्डर') || text.includes('कारागीर')) {
      const resp = lang === 'mr'
        ? 'ग्राहकाची **कस्टम ऑर्डर बुकिंग** नोंदवूया. दागिन्याचे डिझाइन, वजन व ॲडव्हान्स तपशील घेऊया:'
        : lang === 'hi'
        ? 'ग्राहक की **कस्टम ऑर्डर बुकिंग** दर्ज करते हैं। जेवर का डिजाइन, वजन और एडवांस विवरण दर्ज करें:'
        : 'Let\'s record a **Custom Order Booking**. I will take down the customer requirements, promised date, and advance payment:';
      return { response: resp, language: lang, taskToStart: 'order_booking' };
    }

    if (text.includes('refinery') || text.includes('melting') || text.includes('old gold') || text.includes('रिफायनरी') || text.includes('गाळणे') || text.includes('टंच') || text.includes('स्क्रॅप')) {
      const resp = lang === 'mr'
        ? '**जुने सोने रिफायनरी व टंच तपासणी** नोंद सुरू करत आहे. शुद्ध सोन्याचे प्रमाण काढूया:'
        : lang === 'hi'
        ? '**पुराना सोना रिफाइनरी व टंच टेस्टिंग** दर्ज करते हैं। शुद्ध सोने की रिकवरी निकालते हैं:'
        : 'Starting the **Old Gold & Refinery Inward** flow. Let\'s calculate the fine gold recovery and settlement:';
      return { response: resp, language: lang, taskToStart: 'refinery_melting' };
    }

    if (text.includes('add customer') || text.includes('create account') || text.includes('नवीन खाते') || text.includes('नया ग्राहक') || text.includes('खातेदार')) {
      const resp = lang === 'mr'
        ? 'नवीन **ग्राहक किंवा सप्लायर खाते** उघडूया:'
        : lang === 'hi'
        ? 'नया **ग्राहक या सप्लायर खाता** बनाते हैं:'
        : 'Let\'s register a new **Account / Party Master** step-by-step:';
      return { response: resp, language: lang, taskToStart: 'account_create' };
    }

    // ----------------------------------------------------
    // 10. CALCULATOR & FORMULAS (Multilingual)
    // ----------------------------------------------------
    if (text.includes('calculate') || text.includes('formula') || text.includes('हिशोब') || text.includes('कॅल्क्युलेटर') || text.includes('भाव काढा') || text.includes('तोळा भाव')) {
      const resp = lang === 'mr'
        ? `### 🧮 सुवर्ण दागिने मानक हिशोब सूत्रे (Jewellery Formulas)\n\n1. **निव्वळ धातू वजन (Net Weight)**:\n   $$\\text{Net Wt} = \\text{Gross Wt} - \\text{खडे (Stones)} - \\text{दोरा/मणी (Beads)}$$\n\n2. **२४ कॅरेट शुद्ध सोने (Fine Gold Equivalent)**:\n   $$\\text{Fine Wt} = \\text{Net Wt} \\times \\left(\\frac{\\text{टंच (Purity \\%)}}{100}\\right)$$\n\n3. **दागिन्याचे बिल मूल्य (Taxable Amount)**:\n   $$\\text{Taxable} = (\\text{Net Wt} \\times \\text{सोन्याचा भाव}) + (\\text{Net Wt} \\times \\text{मजुरी/ग्रॅम}) + \\text{हॉलमार्क फी (₹४५)}$$\n\n4. **जीएसटी (GST ३%)**:\n   $$\\text{GST} = \\text{Taxable} \\times ०.०३ \\quad (१.५\\% \\text{ CGST} + १.५\\% \\text{ SGST})$$\n\n5. **तोळा रूपांतरण**: **१ तोळा = ११.६६४ ग्रॅम** (किंवा मेट्रिक १० ग्रॅम)`
        : lang === 'hi'
        ? `### 🧮 ज्वेलरी कैलकुलेशन सूत्र (Jewellery Formulas)\n\n1. **शुद्ध वजन (Net Weight)**:\n   $$\\text{Net Wt} = \\text{Gross Wt} - \\text{नग (Stones)} - \\text{धागा (Beads)}$$\n\n2. **२४ कैरेट शुद्ध सोना (Fine Gold)**:\n   $$\\text{Fine Wt} = \\text{Net Wt} \\times \\left(\\frac{\\text{टंच (Purity \\%)}}{100}\\right)$$\n\n3. **टैक्सेबल जेवर मूल्य**:\n   $$\\text{Taxable} = (\\text{Net Wt} \\times \\text{सोना दर}) + (\\text{Net Wt} \\times \\text{मजदूरी/ग्राम}) + \\text{हॉलमार्क शुल्क (₹४५)}$$\n\n4. **जीएसटी (GST ३%)**:\n   $$\\text{GST} = \\text{Taxable} \\times ०.०३ \\quad (१.५\\% \\text{ CGST} + १.५\\% \\text{ SGST})$$`
        : `### 🧮 Standard Jewellery ERP Formulas\n\n1. **Net Metal Weight**:\n   $$\\text{Net Wt} = \\text{Gross Wt} - \\text{Stone Wt} - \\text{Black Beads Wt}$$\n\n2. **Fine Gold Equivalent**:\n   $$\\text{Fine Wt} = \\text{Net Wt} \\times \\left(\\frac{\\text{Purity \\%}}{100}\\right)$$\n\n3. **Taxable Jewellery Value**:\n   $$\\text{Taxable Amt} = (\\text{Net Wt} \\times \\text{Metal Rate}) + (\\text{Net Wt} \\times \\text{Making Charges/g}) + \\text{Hallmark Fee}$$\n\n4. **GST on Jewellery**:\n   $$\\text{GST (3\\%)} = \\text{Taxable Amt} \\times 0.03 \\quad (1.5\\% \\text{ CGST} + 1.5\\% \\text{ SGST})$$\n\n5. **Tola Unit Conversion**: **1 Tola = 11.664 Grams**`;

      return {
        response: resp,
        language: lang,
        quickChips: [
          { label: '💰 Start Sale POS', action: 'start_task', payload: 'sales_invoice' },
          { label: '🏷️ Create Barcode Tag', action: 'start_task', payload: 'barcode_generate' },
        ],
      };
    }

    // ----------------------------------------------------
    // 11. SMART FALLBACK SCREEN REDIRECTION ("If no answer to bot, direct me to this screen")
    // When no specific data answer matches, analyze the query keywords and direct to the closest ERP screen!
    // ----------------------------------------------------
    const fallbackScreenMatch = this.findScreenMatch(text);
    if (fallbackScreenMatch && fallbackScreenMatch.score > 0) {
      const sc = fallbackScreenMatch.matchedScreen;
      const title = lang === 'mr' ? sc.nameMr : lang === 'hi' ? sc.nameHi : sc.name;
      const desc = lang === 'mr' ? sc.descriptionMr : lang === 'hi' ? sc.descriptionHi : sc.description;
      const resp = lang === 'mr'
        ? `### 💡 संबंधित स्क्रीन: ${sc.icon} ${title} (${sc.shortcut})\n\nमी तुमच्या विचारलेल्या प्रश्नासाठी अचूक थेट डेटा शोधू शकलो नाही, परंतु हे काम **${title} (${sc.shortcut})** स्क्रीनवर केले जाऊ शकते.\n\n**या स्क्रीनवरील सुविधा:**\n${desc}\n\nतुम्ही खालील **"🚀 Open Screen"** बटणावर क्लिक करून थेट त्या स्क्रीनवर जाऊ शकता:`
        : lang === 'hi'
        ? `### 💡 संबंधित स्क्रीन: ${sc.icon} ${title} (${sc.shortcut})\n\nमुझे आपके प्रश्न का सीधा डेटा रिकॉर्ड नहीं मिला, लेकिन यह कार्य **${title} (${sc.shortcut})** स्क्रीन पर उपलब्ध है।\n\n**इस स्क्रीन की सुविधाएं:**\n${desc}\n\nआप नीचे दिए गए **"🚀 Open Screen"** बटन पर क्लिक करके सीधे उस स्क्रीन पर जा सकते हैं:`
        : `### 💡 Suggested Screen: ${sc.icon} ${title} (${sc.shortcut})\n\nI couldn't find a direct data record for your exact query, but this function is managed in the **${title} (${sc.shortcut})** screen.\n\n**Functions on this screen:**\n${desc}\n\nClick the **"🚀 Open Screen"** button below to navigate directly to this module:`;

      return {
        response: resp,
        language: lang,
        screenDirection: {
          screenId: sc.id,
          screenName: title,
          section: sc.section,
          subView: sc.subView,
          shortcut: sc.shortcut,
          icon: sc.icon,
          description: desc,
          reason: lang === 'mr' ? 'प्रश्नाशी संबंधित योग्य स्क्रीन' : lang === 'hi' ? 'प्रश्न से संबंधित उपयुक्त स्क्रीन' : 'Closest Matching ERP Module',
          relatedActions: sc.actions,
        },
        quickChips: [
          { label: `🚀 ${sc.icon} Open ${sc.name.split('(')[0].trim()} (${sc.shortcut})`, action: 'navigate', payload: { section: sc.section, subView: sc.subView } },
          ...(sc.actions || []).map((a) => ({ label: a.label, action: a.action, payload: a.payload })),
          { label: '📦 Stock Report (F9)', action: 'navigate', payload: { section: 'stock', subView: 'stock_report' } },
          { label: '💵 Day Book (F10)', action: 'navigate', payload: { section: 'accounts', subView: 'day_book' } },
        ],
      };
    }

    // ----------------------------------------------------
    // 12. DEFAULT INTERACTIVE ERP NAVIGATION DIRECTORY (When 0 matches)
    // ----------------------------------------------------
    const defaultResp = lang === 'mr'
      ? `👋 नमस्कार! मी **स्वर्ण AI ERP सहाय्यक (Copilot)** आहे.\nमी मराठी, हिन्दी व इंग्रजी भाषेत तुमच्या दुकानातील सर्व कामे १-१ प्रश्न विचारून पूर्ण करू शकतो अथवा थेट हव्या त्या स्क्रीनवर नेऊ शकतो:\n\n### 🏢 प्रमुख ईआरपी स्क्रीन डिरेक्टरी:\n1. 💰 **विक्री बिलिंग (Sales POS)** — \`F4\`\n2. 🛒 **खरेदी नोंद (Purchase)** — \`F5\`\n3. 🏷️ **बारकोड स्टुडिओ (Barcode)** — \`F3\`\n4. 📦 **स्टॉक रिपोर्ट (Stock Report)** — \`F9\`\n5. 💵 **डे बुक व गल्ला (Day Book)** — \`F10\`\n6. 🪙 **सुवर्ण निधी भिशी (Gold Scheme)**\n7. 👥 **उधारी ग्राहक (Debtors Book)** — \`F11\`\n8. 💾 **डेटा बॅकअप (Backup)** — \`F12\`\n9. ⚙️ **सेटिंग्ज व थीम्स (Settings)**\n\nखालील कोणत्याही स्क्रीनवर क्लिक करून थेट जा:`
      : lang === 'hi'
      ? `👋 नमस्ते! मैं **स्वर्ण AI ERP कोपायलट** हूँ।\nमैं हिन्दी, मराठी और अंग्रेजी में आपकी दुकान के सभी कार्य १-१ सवाल पूछकर आसानी से कर सकता हूँ या सीधे सही स्क्रीन पर ले जा सकता हूँ:\n\n### 🏢 प्रमुख ईआरपी स्क्रीन डायरेक्टरी:\n1. 💰 **बिक्री बिलिंग (Sales POS)** — \`F4\`\n2. 🛒 **खरीद इनवर्ड (Purchase)** — \`F5\`\n3. 🏷️ **बारकोड स्टूडियो (Barcode)** — \`F3\`\n4. 📦 **स्टॉक रिपोर्ट (Stock Report)** — \`F9\`\n5. 💵 **डे बुक व गल्ला (Day Book)** — \`F10\`\n6. 🪙 **स्वर्ण निधि भिशी (Gold Scheme)**\n7. 👥 **उधारी ग्राहक (Debtors Book)** — \`F11\`\n8. 💾 **डेटा बैकअप (Backup)** — \`F12\`\n9. ⚙️ **सेटिंग्स व थीम्स (Settings)**\n\nनीचे दिए गए किसी भी स्क्रीन बटन पर क्लिक करके सीधे जाएं:`
      : `👋 Hello! I am **Swarna AI ERP Copilot**.\nI can guide you step-by-step through any task or direct you straight to the corresponding ERP screen.\n\n### 🏢 Quick ERP Screen Navigator:\n1. 💰 **Sales POS Billing** — \`F4\`\n2. 🛒 **Purchase Inward** — \`F5\`\n3. 🏷️ **Barcode Studio** — \`F3\`\n4. 📦 **Stock Report & Valuation** — \`F9\`\n5. 💵 **Day Book & Till Register** — \`F10\`\n6. 🪙 **Swarna Nidhi Gold Scheme**\n7. 👥 **Sundry Debtors Ledger** — \`F11\`\n8. 💾 **Backup Manager** — \`F12\`\n9. ⚙️ **ERP Settings & Themes**\n\nClick any screen button below to navigate instantly:`;

    return {
      response: defaultResp,
      language: lang,
      quickChips: [
        { label: '💰 Sales POS (F4)', action: 'navigate', payload: { section: 'transactions', subView: 'sales_invoice' } },
        { label: '🛒 Purchase (F5)', action: 'navigate', payload: { section: 'transactions', subView: 'purchase' } },
        { label: '🏷️ Barcode Studio (F3)', action: 'navigate', payload: { section: 'masters', subView: 'barcode' } },
        { label: '📦 Stock Report (F9)', action: 'navigate', payload: { section: 'stock', subView: 'stock_report' } },
        { label: '💵 Day Book (F10)', action: 'navigate', payload: { section: 'accounts', subView: 'day_book' } },
        { label: '🪙 Gold Scheme', action: 'navigate', payload: { section: 'gold_scheme' } },
        { label: '👥 Debtors (F11)', action: 'navigate', payload: { section: 'accounts', subView: 'book_display' } },
        { label: '💾 Backup (F12)', action: 'navigate', payload: { section: 'backup' } },
        { label: '⚙️ Settings', action: 'navigate', payload: { section: 'settings' } },
      ],
    };
  }

  // Execute completed task in state and return receipt
  public executeTask(
    taskType: TaskType,
    data: Record<string, any>,
    callbacks: {
      onSavePurchase: (record: PurchaseRecord) => void;
      onSaveOrder: (record: NewOrderBookingRecord) => void;
      onSaveAccount: (account: AccountMaster) => void;
      onSaveRefinery: (record: RefineryRecord) => void;
      onAddItemToStock: (item: StockItem) => void;
      onSaveSalesInvoice?: (invoiceData: any) => void;
      onAddDayBookEntry?: (entry: DayBookEntry) => void;
    }
  ): {
    success: boolean;
    message: string;
    cardData?: ChatMessage['cardData'];
  } {
    const today = new Date().toISOString().split('T')[0];

    switch (taskType) {
      // 1. EXECUTE PURCHASE
      case 'purchase_inward': {
        const grossWt = Number(data.gross_wt) || 0;
        const stoneWt = Number(data.stone_wt) || 0;
        const netWt = Number(data.net_wt) || Math.max(0, grossWt - stoneWt);
        const purity = Number(data.purity) || 91.6;
        const rate = Number(data.rate) || this.context.gold22kRate;
        const totalAmt = Math.round(netWt * rate);
        const fineWt = Number(((netWt * purity) / 100).toFixed(3));
        const invoiceNo = `PUR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        const purchaseRecord: PurchaseRecord = {
          id: `pur-bot-${Date.now()}`,
          header: {
            supplier_name: data.supplier_name || 'Apex Bullion Traders',
            remark: 'Created via Swarna AI Copilot',
            payment_mode: data.payment_mode === 'Credit' ? 'Credit' : 'Cash',
            invoice_prefix: 'PUR',
            manual_no: invoiceNo,
            invoice_date: today,
            invoice_no: invoiceNo,
            state: 'Maharashtra',
            gst_not_required: false,
            weightwise: true,
          },
          items: [
            {
              id: `it-${Date.now()}`,
              trans_type: 'Purchase',
              item_name: data.item_name || '22K Gold Bangles Lot',
              qty: 1,
              gross_wt: grossWt,
              black_b: 0,
              stone_wt: stoneWt,
              net_wt: netWt,
              purity: purity,
              rate: rate,
              amount: totalAmt,
              wastage_pct: 0,
              fin_plus_wastage: fineWt,
              total_amt: totalAmt,
              huid: 'B9K8L1',
            },
          ],
          payment: {
            by_cash: data.payment_mode === 'Cash' ? totalAmt : 0,
            payment_type: data.payment_mode || 'Bank',
            by_cheque: data.payment_mode === 'Bank' ? totalAmt : 0,
            bank_name: data.payment_mode === 'Bank' ? 'HDFC Showroom Current A/c' : '',
            cheque_no: '',
            cheque_date: today,
            details: `Supplier: ${data.supplier_name} via AI Copilot`,
            gst_pct: 3.0,
            hgst_pct: 1.5,
            mgst_pct: 1.5,
            tds_pct: 0,
            gst_amt: Math.round(totalAmt * 0.03),
            hgst_amt: Math.round(totalAmt * 0.015),
            mgst_amt: Math.round(totalAmt * 0.015),
            tds_amt: 0,
            purchase_amt: totalAmt,
            discount: 0,
            sales_amt: totalAmt,
            bill_amount: Math.round(totalAmt * 1.03),
            sub_tax: 0,
            tcs_tax_pct: 0,
            tcs_tax_amt: 0,
            paid_amount: data.payment_mode === 'Credit' ? 0 : Math.round(totalAmt * 1.03),
            net_balance: data.payment_mode === 'Credit' ? Math.round(totalAmt * 1.03) : 0,
          },
          created_at: new Date().toISOString(),
        };

        callbacks.onSavePurchase(purchaseRecord);

        return {
          success: true,
          message: `✅ **खरेदी व्हाउचर #${invoiceNo} यशस्वीरित्या नोंदवले! (Purchase Voucher Recorded)**\n- **${formatWeight(grossWt)}g** ${data.item_name} लूज स्टॉक मध्ये जमा झाले.\n- एकूण किंमत: **${formatCurrency(totalAmt)}** (+ ३% GST: ${formatCurrency(Math.round(totalAmt * 0.03))}).\n- डे बुक आणि सप्लायर खाते अपडेट झाले.`,
          cardData: {
            type: 'purchase_receipt',
            title: `Purchase Voucher #${invoiceNo}`,
            details: {
              'Supplier': data.supplier_name,
              'Item Lot': data.item_name,
              'Gross / Net Weight': `${formatWeight(grossWt)}g / ${formatWeight(netWt)}g`,
              'Purity & Fine Gold': `${purity}% (${formatWeight(fineWt)}g fine)`,
              'Rate per Gram': `₹${rate.toLocaleString('en-IN')}`,
              'Total Bill Amount': formatCurrency(Math.round(totalAmt * 1.03)),
              'Settlement Mode': data.payment_mode,
            },
            actions: [
              { label: 'View in Purchase (F5)', actionId: 'nav_purchase', primary: true },
              { label: 'Generate Barcode Tag', actionId: 'task_barcode' },
            ],
          },
        };
      }

      // 2. EXECUTE BARCODE GENERATION
      case 'barcode_generate': {
        const grossWt = Number(data.gross_wt) || 0;
        const netWt = Number(data.net_wt) || grossWt;
        const purity = Number(data.purity) || 91.6;
        const making = Number(data.making_per_gm) || 450;
        const huid = (data.huid || 'B9K8L1').toUpperCase();
        const tagNo = `TAG-${data.category === 'Silver' ? 'SIL' : 'GLD'}-${Math.floor(100 + Math.random() * 900)}`;
        const fineWt = Number(((netWt * purity) / 100).toFixed(3));
        const rate = data.category === 'Silver' ? this.context.silverRate : this.context.gold22kRate;
        const totalVal = Math.round(netWt * rate + (netWt * making));

        const stockItem: StockItem = {
          id: `stk-tag-${Date.now()}`,
          item_name: data.item_name || '22K Hallmarked Ornament',
          category: data.category || 'Gold',
          qty: 1,
          gross_wt: grossWt,
          net_wt: netWt,
          purity: purity,
          fine_wt: fineWt,
          rate_per_gm: rate,
          total_value: totalVal,
          is_urd: false,
          is_loose: false,
          tag_no: tagNo,
          huid: huid,
        };

        callbacks.onAddItemToStock(stockItem);

        return {
          success: true,
          message: `✅ **बारकोड टॅग #${tagNo} जनरेट झाला! (Barcode Tag Created)**\n- दागिना: **${data.item_name}**\n- वजन: **${formatWeight(grossWt)}g** (निव्वळ: ${formatWeight(netWt)}g)\n- BIS HUID: **${huid}**\n- शोरूम डिस्प्ले स्टॉक मध्ये जोडले. बारकोड स्टुडिओमध्ये लेबल प्रिंटसाठी तयार!`,
          cardData: {
            type: 'barcode_tag',
            title: `Tag #${tagNo} • ${huid}`,
            details: {
              'Tag No': tagNo,
              'HUID': huid,
              'Item Description': data.item_name,
              'Gross / Net Weight': `${formatWeight(grossWt)}g / ${formatWeight(netWt)}g`,
              'Purity': `${purity}% (22K 916)`,
              'Making Charges': `₹${making}/g`,
              'Est. Tag Value': formatCurrency(totalVal),
            },
            actions: [
              { label: 'Open Barcode Studio (F3)', actionId: 'nav_barcode', primary: true },
              { label: 'Sell this Tag (F4)', actionId: 'task_sale' },
            ],
          },
        };
      }

      // 3. EXECUTE SALES POS INVOICE
      case 'sales_invoice': {
        const netWt = Number(data.net_wt) || 15.5;
        const rate = Number(data.rate) || this.context.gold22kRate;
        const making = Number(data.making_per_gm) || 450;
        const metalVal = netWt * rate;
        const makingVal = netWt * making;
        const taxableVal = metalVal + makingVal + 45;
        const gstVal = Math.round(taxableVal * 0.03);
        const oldGold = Number(data.old_gold_amount) || 0;
        const totalInvoice = Math.round(taxableVal + gstVal - oldGold);
        const invNo = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

        if (callbacks.onAddDayBookEntry) {
          const isCash = data.payment_mode === 'Cash';
          const isSplit = data.payment_mode === 'Split';
          const isBank = data.payment_mode === 'UPI/Card';

          callbacks.onAddDayBookEntry({
            id: `db-sale-${Date.now()}`,
            invoice_type: 'Sales Tax Invoice',
            invoice_no: invNo,
            total_amt: taxableVal,
            urd_amt: oldGold,
            net_amt: totalInvoice,
            cash_received: isCash ? totalInvoice : (isSplit ? Math.round(totalInvoice / 2) : 0),
            cash_payment: 0,
            bank_received: isBank ? totalInvoice : (isSplit ? Math.round(totalInvoice / 2) : 0),
            bank_payment: 0,
            date: today,
            details: `Customer: ${data.customer_name} (${data.item_name}, ${formatWeight(netWt)}g)`,
            total_amt_without_disc: taxableVal,
          });
        }

        return {
          success: true,
          message: `✅ **विक्री पावती #${invNo} तयार झाली! (Tax Invoice Generated)**\n- ग्राहक: **${data.customer_name}** (${data.phone || 'Walk-in'})\n- दागिना: **${data.item_name}** (${formatWeight(netWt)}g)\n- करपात्र मूल्य: **${formatCurrency(taxableVal)}** + ३% GST: **${formatCurrency(gstVal)}**\n- जुने सोने वजावट: **${formatCurrency(oldGold)}**\n- **एकूण भरलेली रक्कम: ${formatCurrency(totalInvoice)}** (${data.payment_mode})\n- डे बुक गल्ला अपडेट झाला!`,
          cardData: {
            type: 'sales_receipt',
            title: `Tax Invoice #${invNo}`,
            details: {
              'Customer Name': data.customer_name,
              'Phone': data.phone || '9820123456',
              'Item Sold': data.item_name,
              'Net Metal Wt': `${formatWeight(netWt)}g`,
              'Metal + Making': `${formatCurrency(taxableVal)}`,
              'GST (1.5% CGST + 1.5% SGST)': formatCurrency(gstVal),
              'Old Gold Deduction': formatCurrency(oldGold),
              'Net Paid': formatCurrency(totalInvoice),
              'Payment Mode': data.payment_mode,
            },
            actions: [
              { label: 'View Sales POS (F4)', actionId: 'nav_sales', primary: true },
              { label: 'View Day Book (F10)', actionId: 'nav_daybook' },
            ],
          },
        };
      }

      // 4. EXECUTE CUSTOM ORDER BOOKING
      case 'order_booking': {
        const orderNo = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
        const approxWt = Number(data.approx_wt) || 45.0;
        const advance = Number(data.advance_amount) || 25000;

        const orderRecord: NewOrderBookingRecord = {
          id: `ord-${Date.now()}`,
          order_no: orderNo,
          header: {
            customer_n: data.customer_name || 'Customer',
            address: 'Pune Showroom Area',
            ph_no: '9822334455',
            remark: 'Booked via Swarna AI Copilot',
            area: 'Main City',
            aadhar_no: '',
            pan_card: '',
            bill_type: 'Order Booking',
            n5: 'N5',
            bill_date: today,
            delivery_date: data.delivery_date || today,
            manual_no: orderNo,
            state: 'Maharashtra',
            salesman: 'Pooja Sharma (EMP-204)',
            gst_not_required: false,
            close_order: false,
          },
          items: [
            {
              id: `it-${Date.now()}`,
              trans_type: 'Order',
              item_name: data.item_name || 'Custom 22K Ornament',
              description: data.item_name || 'Custom design',
              qty: 1,
              gross_wt: approxWt,
              black_beats: 0,
              stone_wt: 0,
              stone_amt: 0,
              net_wt: approxWt,
              purity: 91.6,
              mkg_per_gm: 500,
              mkg_amt: approxWt * 500,
              hallm_charges: 45,
              making_pct: 0,
              item_amt: approxWt * this.context.gold22kRate + (approxWt * 500),
            },
          ],
          payment: {
            amount: approxWt * this.context.gold22kRate,
            bill_discount: 0,
            purchase_amt: approxWt * this.context.gold22kRate,
            balance_amount: (approxWt * this.context.gold22kRate) - advance,
            gst_pct: 3.0,
            gst_amt: Math.round((approxWt * this.context.gold22kRate) * 0.03),
            advance_amt: advance,
            other_amt: 0,
            cash_received: advance,
          },
          status: 'In Workshop Queue',
          created_at: new Date().toISOString(),
        };

        callbacks.onSaveOrder(orderRecord);

        return {
          success: true,
          message: `✅ **ऑर्डर #${orderNo} यशस्वीरित्या बुक झाली! (Custom Order Confirmed)**\n- ग्राहक: **${data.customer_name}**\n- दागिना: **${data.item_name}** (अंदाजे वजन: **${formatWeight(approxWt)}g**)\n- देण्याची तारीख (Promise Date): **${data.delivery_date}**\n- मिळालेली ॲडव्हान्स: **${formatCurrency(advance)}**\n- ऑर्डर कारागीर वर्कशॉप पाईपलाईन मध्ये जोडली आहे!`,
          cardData: {
            type: 'order_receipt',
            title: `Order Confirmation #${orderNo}`,
            details: {
              'Customer': data.customer_name,
              'Ornament Spec': data.item_name,
              'Approx Weight': `${formatWeight(approxWt)}g (22K 916)`,
              'Delivery Date': data.delivery_date,
              'Advance Received': formatCurrency(advance),
              'Status': 'Assigned to Workshop Queue',
            },
            actions: [
              { label: 'View in Orders (F7)', actionId: 'nav_orders', primary: true },
            ],
          },
        };
      }

      // 5. EXECUTE REFINERY INWARD
      case 'refinery_melting': {
        const grossWt = Number(data.gross_wt) || 50;
        const purity = Number(data.purity) || 84.0;
        const fineWt = Number(((grossWt * purity) / 100).toFixed(3));
        const refNo = `REF-2026-${Math.floor(100 + Math.random() * 900)}`;

        const refRecord: RefineryRecord = {
          id: `ref-${Date.now()}`,
          header: {
            refinery_name: data.refinery_name || 'Shree Ganesh Refinery',
            remark: 'Refinery melting via AI Copilot',
            payment_mode: data.settlement_mode === 'Cash' ? 'Cash' : 'Credit',
            invoice_prefix: 'REF',
            manual_no: refNo,
            invoice_date: today,
            invoice_no: refNo,
            state: 'Maharashtra',
            gst_not_required: false,
          },
          items: [
            {
              id: `it-${Date.now()}`,
              no: 1,
              trans_type: 'Melting',
              item_name: 'Old Gold Scrap Melting Lot',
              gross_wt: grossWt,
              net_wt: grossWt,
              purity: purity,
              fin_wt: fineWt,
              rate: this.context.gold24kRate,
              amount: Math.round(fineWt * this.context.gold24kRate),
              refinery_loss: Number((grossWt * 0.005).toFixed(3)),
              refinery_profit: 0,
              total_amt: Math.round(fineWt * this.context.gold24kRate),
              making_on_qty: 0,
            },
          ],
          weight_summary: {
            balance_wgt_grswt: grossWt,
            net_wgt: grossWt,
            fin_wgt: fineWt,
          },
          calculation: {
            against_refout_bill_no: '',
            by_cash: 0,
            payment_type: data.settlement_mode || 'Metal',
            by_cheque: 0,
            bank_name: '',
            cheque_no: '',
            cheque_date: today,
            details: `Refinery: ${data.refinery_name}`,
            gst_pct: 0,
            hgst_pct: 0,
            mgst_pct: 0,
            tds_pct: 0,
            gst_amt: 0,
            hgst_amt: 0,
            mgst_amt: 0,
            tds_amt: 0,
            purchase_amt: Math.round(fineWt * this.context.gold24kRate),
            discount: 0,
            sales_amt: 0,
            bill_amount: Math.round(fineWt * this.context.gold24kRate),
            sub_tax: 0,
            tcs_tax_pct: 0,
            tcs_tax_amt: 0,
            paid_amount: 0,
            net_balance: 0,
          },
          created_at: new Date().toISOString(),
        };

        callbacks.onSaveRefinery(refRecord);

        return {
          success: true,
          message: `✅ **रिफायनरी व्हाउचर #${refNo} तयार झाले! (Refinery Inward Recorded)**\n- जुने सोने वजन: **${formatWeight(grossWt)}g** (${purity}% टंच)\n- शुद्ध सोने जमा: **${formatWeight(fineWt)}g २४ कॅरेट**\n- शोरूम मेटल व्हॉल्ट मध्ये जमा झाले!`,
          cardData: {
            type: 'refinery_receipt',
            title: `Refinery Voucher #${refNo}`,
            details: {
              'Refinery Name': data.refinery_name,
              'Scrap Gross Weight': `${formatWeight(grossWt)}g`,
              'Assaying Touch': `${purity}%`,
              'Fine Gold Equivalent': `${formatWeight(fineWt)}g 24K`,
              'Settlement': data.settlement_mode === 'Cash' ? 'Cash Payout' : 'Metal Vault Credit',
            },
            actions: [
              { label: 'View Refinery (F6)', actionId: 'nav_refinery', primary: true },
            ],
          },
        };
      }

      // 6. EXECUTE ACCOUNT CREATION
      case 'account_create': {
        const code = `AC-${Math.floor(1000 + Math.random() * 9000)}`;
        const acc: AccountMaster = {
          account_code: code,
          account_name: data.account_name || 'New Party',
          account_type: data.account_group === 'Sundry Debtors' ? 'Assets' : 'Liabilities',
          account_group: data.account_group || 'Sundry Debtors',
          opening_balance: Number(data.opening_balance) || 0,
          balance_type: 'Dr',
          card_charges: { card_charges: false, for_customer_pct: 0, for_us_pct: 0 },
          phone: data.phone || '',
          area: 'Maharashtra',
          created_at: new Date().toISOString(),
        };

        callbacks.onSaveAccount(acc);

        return {
          success: true,
          message: `✅ **नवीन खाते ${data.account_name} (${code}) तयार झाले! (Account Created)**\n- गट: **${data.account_group}**\n- सुरुवातीची बाकी: **${formatCurrency(Number(data.opening_balance) || 0)}**\n- क्लाउड डेटाबेस सोबत सिंक्रोनाईज झाले.`,
          cardData: {
            type: 'account_receipt',
            title: `Account Master #${code}`,
            details: {
              'Party Name': data.account_name,
              'Account Code': code,
              'Ledger Group': data.account_group,
              'Contact Phone': data.phone || '—',
              'Opening Balance': formatCurrency(Number(data.opening_balance) || 0),
            },
            actions: [
              { label: 'View Accounts (F8)', actionId: 'nav_accounts', primary: true },
            ],
          },
        };
      }

      // 7. EXECUTE DAYBOOK EXPENSE
      case 'daybook_expense': {
        const amount = Number(data.amount) || 0;
        const entryId = `db-exp-${Date.now()}`;
        const isPayment = data.invoice_type.includes('Payment');

        if (callbacks.onAddDayBookEntry) {
          callbacks.onAddDayBookEntry({
            id: entryId,
            invoice_type: data.invoice_type || 'Cash Payment',
            invoice_no: `VOUCH-${Math.floor(100 + Math.random() * 900)}`,
            total_amt: amount,
            urd_amt: 0,
            net_amt: amount,
            cash_received: isPayment ? 0 : amount,
            cash_payment: isPayment ? amount : 0,
            bank_received: 0,
            bank_payment: 0,
            date: today,
            details: data.details || 'Day Book Voucher',
            total_amt_without_disc: amount,
          });
        }

        return {
          success: true,
          message: `✅ **${formatCurrency(amount)} चे डे बुक व्हाउचर नोंदवले गेले! (Day Book Voucher Saved)**\n- प्रकार: **${data.invoice_type}**\n- तपशील: **${data.details}**\n- गल्ला शिल्लक अद्ययावत झाली.`,
          cardData: {
            type: 'daybook_receipt',
            title: `Day Book Voucher • ${data.invoice_type}`,
            details: {
              'Type': data.invoice_type,
              'Particulars': data.details,
              'Amount': formatCurrency(amount),
              'Date': today,
            },
            actions: [
              { label: 'View Day Book (F10)', actionId: 'nav_daybook', primary: true },
            ],
          },
        };
      }

      default:
        return { success: false, message: 'Unknown task type.' };
    }
  }
}
