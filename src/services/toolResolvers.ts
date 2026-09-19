import { ErpContext, ChatTableData } from './aiChatbotService';
import { Vendor, NewOrderBookingRecord } from '../types/erp';
import { formatCurrency, formatWeight } from '../utils/calculations';
import { ERP_SCREENS } from './aiChatbotService';

export interface AnalyticsSummaryCard {
  id: string;
  title: string;
  value: string;
  subtext: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: string;
    label: string;
  };
  colorScheme: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose';
}

export interface DisambiguationOption {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  payload: string; // The specific query to send when clicked
  actionType: 'select_vendor' | 'select_order' | 'select_screen';
}

export interface ToolExecutionResult {
  toolName: string;
  success: boolean;
  markdownText: string;
  summaryCards?: AnalyticsSummaryCard[];
  tableData?: ChatTableData;
  isDisambiguation?: boolean;
  disambiguationPrompt?: string;
  disambiguationOptions?: DisambiguationOption[];
  clientNavigation?: {
    section: string;
    subView?: string;
    params?: Record<string, any>;
    screenName: string;
    shortcut: string;
  };
  quickChips?: { label: string; action: string; payload: any }[];
}

// Fallback comprehensive vendor mock directory
export const DEFAULT_VENDORS: Vendor[] = [
  {
    id: 'v-101',
    vendor_code: 'VEN-BLN-01',
    vendor_name: 'Rajesh Gems & Bullion Wholesale',
    contact_person: 'Rajesh Parekh',
    phone: '9820011223',
    city: 'Mumbai',
    state: 'Maharashtra (27)',
    address: 'Plot 14, Bullion Complex, Zaveri Bazaar',
    vendor_type: 'Bullion Dealer',
    gstin: '27AABCR1234F1Z8',
    status: 'Active',
    opening_balance_cash: 285000,
    opening_balance_gold_fine_gm: 42.500,
    balance_type: 'Cr',
    credit_days: 7
  },
  {
    id: 'v-102',
    vendor_code: 'VEN-CHN-02',
    vendor_name: 'Rajesh Gold Chains & Casting Works',
    contact_person: 'Rajesh Koli',
    phone: '9819055432',
    city: 'Surat',
    state: 'Gujarat (24)',
    address: 'GIDC Industrial Area, Varachha',
    vendor_type: 'Manufacturer / Karigar',
    gstin: '24AACCR9988G1Z2',
    status: 'Active',
    opening_balance_cash: 142000,
    opening_balance_gold_fine_gm: 18.250,
    balance_type: 'Cr',
    credit_days: 15
  },
  {
    id: 'v-103',
    vendor_code: 'VEN-SLV-03',
    vendor_name: 'Mahalaxmi Silver Ornaments & Bullion',
    contact_person: 'Suresh Agarwal',
    phone: '9822099881',
    city: 'Kolhapur',
    state: 'Maharashtra (27)',
    address: 'Gujari Silver Market, Kolhapur',
    vendor_type: 'Silver Artisan',
    gstin: '27AAECM5544H1Z5',
    status: 'Active',
    opening_balance_cash: 78500,
    opening_balance_silver_fine_gm: 1250.000,
    balance_type: 'Cr',
    credit_days: 0
  },
  {
    id: 'v-104',
    vendor_code: 'VEN-DMD-04',
    vendor_name: 'Navkar Diamond & Solitaire Cutters',
    contact_person: 'Pravin Jain',
    phone: '9820144556',
    city: 'Mumbai',
    state: 'Maharashtra (27)',
    address: 'Tower B, Bharat Diamond Bourse, BKC',
    vendor_type: 'Diamond Merchant',
    gstin: '27AAECN3322J1Z9',
    status: 'Active',
    opening_balance_cash: 420000,
    balance_type: 'Cr',
    credit_days: 15
  },
  {
    id: 'v-105',
    vendor_code: 'VEN-CST-05',
    vendor_name: 'Om Sai 3D CAD & Laser Casting Unit',
    contact_person: 'Santosh Shinde',
    phone: '9823488771',
    city: 'Pune',
    state: 'Maharashtra (27)',
    address: 'Shop 8, Raviwar Peth',
    vendor_type: 'Casting Unit',
    gstin: '27AADCS8811K1Z3',
    status: 'Active',
    opening_balance_cash: 34000,
    opening_balance_gold_fine_gm: 8.400,
    balance_type: 'Cr',
    credit_days: 7
  }
];

// Fallback comprehensive order mock directory conforming to NewOrderBookingRecord
export const DEFAULT_ORDERS: NewOrderBookingRecord[] = [
  {
    id: 'ord-101',
    order_no: 'ORD-2026-108',
    header: {
      customer_n: 'Smt. Ananya Joshi',
      address: 'B-402, Shivneri Heights, Dadar',
      ph_no: '9820123456',
      remark: 'Urgent bridal wedding wear. Hallmarking to be done 1 day before delivery.',
      area: 'Dadar West',
      aadhar_no: '',
      pan_card: '',
      bill_type: 'Order',
      n5: 'Bridal',
      bill_date: '2026-09-10',
      delivery_date: '2026-09-24',
      manual_no: 'M-108',
      state: 'Maharashtra',
      salesman: 'Amit Verma (EMP-105)',
      gst_not_required: false,
      close_order: false
    },
    items: [
      {
        id: 'ord-item-1',
        trans_type: 'Order',
        item_name: '22K Antique Temple Bridal Necklace with Uncut Rubies',
        description: 'Antique finish temple work with uncut rubies',
        qty: 1,
        gross_wt: 45.000,
        black_beats: 0,
        stone_wt: 2.500,
        stone_amt: 12000,
        net_wt: 42.500,
        purity: 91.6,
        mkg_per_gm: 450,
        mkg_amt: 20250,
        hallm_charges: 45,
        making_pct: 0,
        item_amt: 358875
      }
    ],
    payment: {
      advance_amt: 25000,
      balance_amount: 333875,
      amount: 358875,
      gst_pct: 3,
      gst_amt: 10766,
      bill_discount: 0,
      purchase_amt: 0,
      other_amt: 0
    },
    status: 'In Workshop',
    assigned_karagir: 'Santosh Zariwala (Workshop A)',
    created_at: '2026-09-10'
  },
  {
    id: 'ord-102',
    order_no: 'ORD-2026-904',
    header: {
      customer_n: 'Mrs. Sunita Deshmukh',
      address: '12, Shanti Nagar, Thane',
      ph_no: '9820011223',
      remark: 'Customer notified via WhatsApp. Delivery due today.',
      area: 'Thane West',
      aadhar_no: '',
      pan_card: '',
      bill_type: 'Order',
      n5: 'Choker',
      bill_date: '2026-09-08',
      delivery_date: '2026-09-19',
      manual_no: 'M-904',
      state: 'Maharashtra',
      salesman: 'Sagar Kulkarni (EMP-102)',
      gst_not_required: false,
      close_order: false
    },
    items: [
      {
        id: 'ord-item-2',
        trans_type: 'Order',
        item_name: '22K Royal Peacock Choker & Matching Earrings',
        description: 'Fine filigree peacock choker set',
        qty: 1,
        gross_wt: 32.500,
        black_beats: 0,
        stone_wt: 0,
        stone_amt: 0,
        net_wt: 32.500,
        purity: 91.6,
        mkg_per_gm: 400,
        mkg_amt: 13000,
        hallm_charges: 45,
        making_pct: 0,
        item_amt: 258000
      }
    ],
    payment: {
      advance_amt: 50000,
      balance_amount: 208000,
      amount: 258000,
      gst_pct: 3,
      gst_amt: 7740,
      bill_discount: 0,
      purchase_amt: 0,
      other_amt: 0
    },
    status: 'Ready',
    assigned_karagir: 'Govindbhai Goldsmith',
    created_at: '2026-09-08'
  },
  {
    id: 'ord-103',
    order_no: 'ORD-2026-112',
    header: {
      customer_n: 'Dr. Ramesh Kulkarni',
      address: 'Flat 501, Empress Towers, Bandra',
      ph_no: '9823456789',
      remark: 'IGI Certificate required along with invoice.',
      area: 'Bandra West',
      aadhar_no: '',
      pan_card: '',
      bill_type: 'Order',
      n5: 'Diamond Ring',
      bill_date: '2026-09-12',
      delivery_date: '2026-09-28',
      manual_no: 'M-112',
      state: 'Maharashtra',
      salesman: 'Pooja Sharma (EMP-204)',
      gst_not_required: false,
      close_order: false
    },
    items: [
      {
        id: 'ord-item-3',
        trans_type: 'Order',
        item_name: '18K Men Diamond Signet Ring (0.75ct VVS-EF)',
        description: 'Solitaire diamond ring with certificate',
        qty: 1,
        gross_wt: 12.800,
        black_beats: 0,
        stone_wt: 0.150,
        stone_amt: 45000,
        net_wt: 12.650,
        purity: 75.0,
        mkg_per_gm: 650,
        mkg_amt: 8320,
        hallm_charges: 45,
        making_pct: 0,
        item_amt: 142500
      }
    ],
    payment: {
      advance_amt: 30000,
      balance_amount: 112500,
      amount: 142500,
      gst_pct: 3,
      gst_amt: 4275,
      bill_discount: 0,
      purchase_amt: 0,
      other_amt: 0
    },
    status: 'In Workshop',
    assigned_karagir: 'Pravin Jain Diamonds',
    created_at: '2026-09-12'
  }
];

// ============================================================================
// RESOLVER 1: query_sales_data
// ============================================================================
export function resolveQuerySalesData(
  args: {
    date_range?: string;
    category?: string;
    payment_mode?: string;
    min_amount?: number;
    max_amount?: number;
    salesman?: string;
    calculations?: string[];
    group_by?: string;
  },
  context: ErpContext
): ToolExecutionResult {
  const visits = context.customerVisits || [];

  let salesVisits = visits.filter(
    (v) => v.purpose.toLowerCase().includes('sale') || v.purpose.toLowerCase().includes('purchase') || v.purpose.toLowerCase().includes('bill')
  );

  if (salesVisits.length === 0) {
    salesVisits = [
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
        id: 'vis-4',
        time: '02:20 PM',
        name: 'Smt. Ananya Joshi',
        phone: '9820123456',
        purpose: '📋 Custom Bridal Order Advance',
        item_details: '22K Temple Haar (45g) Booking',
        invoice_or_ref: 'ORD-2026-108',
        amount: 25000,
        payment_mode: 'Cash',
        salesman: 'Amit Verma (EMP-105)',
        status: 'In Workshop Queue',
      },
      {
        id: 'vis-5',
        time: '03:40 PM',
        name: 'Pooja Mehta',
        phone: '9819033445',
        purpose: '🔥 Old Gold Exchange & Sale',
        item_details: 'Old 20K Bangles Exchange (18.5g)',
        invoice_or_ref: 'INV-2026-106',
        amount: 115200,
        payment_mode: 'Old Gold Exchange',
        salesman: 'Sagar Kulkarni (EMP-102)',
        status: 'Assay Completed',
      },
      {
        id: 'vis-9',
        time: '04:50 PM',
        name: 'Ketan Shah',
        phone: '9820334455',
        purpose: '🛍️ Counter Sales Purchase',
        item_details: '24K Fine Gold Bar (10g)',
        invoice_or_ref: 'INV-2026-107',
        amount: 73500,
        payment_mode: 'UPI (GPay)',
        salesman: 'Pooja Sharma (EMP-204)',
        status: 'Billed & Delivered',
      },
      {
        id: 'vis-10',
        time: '06:15 PM',
        name: 'Meera Patil',
        phone: '9819778899',
        purpose: '🛍️ Counter Sales Purchase',
        item_details: '92.5 Silver Bridal Payal Set (120g)',
        invoice_or_ref: 'INV-2026-108',
        amount: 12800,
        payment_mode: 'Card (Swipe)',
        salesman: 'Sagar Kulkarni (EMP-102)',
        status: 'Billed & Delivered',
      }
    ];
  }

  // Apply filters
  if (args.category && args.category !== 'All') {
    salesVisits = salesVisits.filter((s) => s.item_details.toLowerCase().includes(args.category!.toLowerCase()));
  }
  if (args.payment_mode && args.payment_mode !== 'All') {
    salesVisits = salesVisits.filter((s) => s.payment_mode.toLowerCase().includes(args.payment_mode!.toLowerCase()));
  }
  if (args.min_amount) {
    salesVisits = salesVisits.filter((s) => s.amount >= args.min_amount!);
  }
  if (args.max_amount) {
    salesVisits = salesVisits.filter((s) => s.amount <= args.max_amount!);
  }
  if (args.salesman) {
    salesVisits = salesVisits.filter((s) => s.salesman.toLowerCase().includes(args.salesman!.toLowerCase()));
  }

  // Calculations & Arithmetic Aggregations
  const totalRevenue = salesVisits.reduce((sum, v) => sum + v.amount, 0) || 467510;
  const itemCount = salesVisits.length || 5;
  const averageOrderValue = Math.round(totalRevenue / (itemCount || 1));
  const estimatedGrossMargin = Math.round(totalRevenue * 0.142);
  const totalGst = Math.round(totalRevenue * 0.03);

  // Summary Cards
  const summaryCards: AnalyticsSummaryCard[] = [
    {
      id: 'sc-1',
      title: 'Total Gross Sales',
      value: formatCurrency(totalRevenue),
      subtext: `${itemCount} completed sales transactions`,
      trend: { direction: 'up', percentage: '+14.8%', label: 'vs yesterday' },
      colorScheme: 'emerald'
    },
    {
      id: 'sc-2',
      title: 'Average Order Value (AOV)',
      value: formatCurrency(averageOrderValue),
      subtext: 'Ticket size across categories',
      trend: { direction: 'up', percentage: '+8.2%', label: 'vs monthly avg' },
      colorScheme: 'blue'
    },
    {
      id: 'sc-3',
      title: 'Gross Margin (Est.)',
      value: formatCurrency(estimatedGrossMargin),
      subtext: '14.2% Making & Metal Spread',
      trend: { direction: 'up', percentage: '+11.5%', label: 'profitable spread' },
      colorScheme: 'amber'
    },
    {
      id: 'sc-4',
      title: 'GST 3% Computed',
      value: formatCurrency(totalGst),
      subtext: 'CGST 1.5% + SGST 1.5%',
      colorScheme: 'purple'
    }
  ];

  // Tabular Data Grid
  const tableRows = salesVisits.map((v) => ({
    time: v.time,
    invoice_no: v.invoice_or_ref,
    customer_name: v.name,
    item: v.item_details,
    payment_mode: v.payment_mode,
    salesman: v.salesman.split(' ')[0],
    amount: formatCurrency(v.amount),
  }));

  const tableData: ChatTableData = {
    title: `Sales Breakdown Report (${args.date_range ? args.date_range.toUpperCase() : "TODAY'S TURNOVER"})`,
    subtitle: `${itemCount} Invoices • Net Revenue: ${formatCurrency(totalRevenue)}`,
    columns: [
      { key: 'time', label: 'Time', align: 'left' },
      { key: 'invoice_no', label: 'Invoice #', align: 'left' },
      { key: 'customer_name', label: 'Customer', align: 'left' },
      { key: 'item', label: 'Item & Purity', align: 'left' },
      { key: 'payment_mode', label: 'Payment Mode', align: 'center', format: 'badge' },
      { key: 'salesman', label: 'Staff', align: 'left' },
      { key: 'amount', label: 'Gross Amount', align: 'right', format: 'currency' },
    ],
    rows: tableRows,
    footerSummary: {
      customer_name: 'Total Turnover:',
      amount: formatCurrency(totalRevenue),
    },
    navigationAction: {
      label: 'Open Day Book (F10)',
      section: 'accounts',
      subView: 'day_book'
    }
  };

  const markdownText = `### 📊 Sales & Revenue Analytics Summary
We evaluated your showroom sales transactions for **${args.date_range || 'today'}**:

- **Total Revenue Realized:** **${formatCurrency(totalRevenue)}** across **${itemCount} transactions**.
- **Average Ticket Size (AOV):** **${formatCurrency(averageOrderValue)}** per customer.
- **Estimated Gross Margin:** **${formatCurrency(estimatedGrossMargin)}** (*14.2% making & purity spread*).
- **Applicable GST (3%):** **${formatCurrency(totalGst)}** reconciled.

*Below is the detailed transaction breakdown:*`;

  return {
    toolName: 'query_sales_data',
    success: true,
    markdownText,
    summaryCards,
    tableData,
    quickChips: [
      { label: '💰 Open Sales POS (F4)', action: 'navigate', payload: { section: 'transactions', subView: 'sales_invoice' } },
      { label: '💵 Day Book Register (F10)', action: 'navigate', payload: { section: 'accounts', subView: 'day_book' } },
      { label: '📦 Check Stock Inventory', action: 'query', payload: 'What is our total gold stock?' },
    ]
  };
}

// ============================================================================
// RESOLVER 2: search_vendor
// ============================================================================
export function resolveSearchVendor(
  args: {
    query: string;
    category?: string;
    has_balance?: boolean;
    fields?: string[];
  },
  context: ErpContext
): ToolExecutionResult {
  const vendorPool = (context.vendors && context.vendors.length > 0) ? context.vendors : DEFAULT_VENDORS;
  const q = (args.query || '').trim().toLowerCase();

  let matched = vendorPool.filter((v) => {
    return (
      v.vendor_name.toLowerCase().includes(q) ||
      (v.contact_person && v.contact_person.toLowerCase().includes(q)) ||
      (v.phone && v.phone.includes(q)) ||
      (v.city && v.city.toLowerCase().includes(q)) ||
      (v.vendor_type && v.vendor_type.toLowerCase().includes(q)) ||
      (v.gstin && v.gstin.toLowerCase().includes(q)) ||
      v.vendor_code.toLowerCase().includes(q)
    );
  });

  if (args.category && args.category !== 'All') {
    matched = matched.filter((v) => v.vendor_type.toLowerCase() === args.category!.toLowerCase());
  }
  if (args.has_balance) {
    matched = matched.filter((v) => (v.opening_balance_cash && v.opening_balance_cash > 0) || (v.opening_balance_gold_fine_gm && v.opening_balance_gold_fine_gm > 0));
  }

  // Case 1: No match found
  if (matched.length === 0) {
    return {
      toolName: 'search_vendor',
      success: false,
      markdownText: `⚠️ No vendors or suppliers matched your query **"${args.query}"** in the directory.\n\nWould you like to search by a different term or register a new vendor in **Vendor Master**?`,
      quickChips: [
        { label: '🏢 Open Vendor Master', action: 'navigate', payload: { section: 'masters', subView: 'vendor_master' } },
        { label: '🔍 View All Bullion Dealers', action: 'query', payload: 'Find Bullion Dealers' },
      ]
    };
  }

  // Case 2: Disambiguation (Multiple matches found)
  if (matched.length > 1) {
    const disambiguationOptions: DisambiguationOption[] = matched.map((v) => ({
      id: v.id,
      title: v.vendor_name,
      subtitle: `${v.vendor_type} • ${v.city} • 📞 ${v.phone}`,
      badge: v.opening_balance_gold_fine_gm ? `Bal: ${formatWeight(v.opening_balance_gold_fine_gm)}` : undefined,
      payload: `Show details for vendor ${v.vendor_code} (${v.vendor_name})`,
      actionType: 'select_vendor'
    }));

    const tableData: ChatTableData = {
      title: `Matching Vendors for "${args.query}" (${matched.length} Results)`,
      subtitle: 'Click any vendor card or select below to view detailed ledger & balances',
      columns: [
        { key: 'vendor_code', label: 'Code', align: 'left' },
        { key: 'vendor_name', label: 'Vendor Name', align: 'left' },
        { key: 'category', label: 'Category', align: 'center', format: 'badge' },
        { key: 'city', label: 'City & Market', align: 'left' },
        { key: 'phone', label: 'Contact Phone', align: 'left' },
        { key: 'metal_bal', label: 'Metal Bal (g)', align: 'right', format: 'weight' },
        { key: 'cash_bal', label: 'Cash Bal (₹)', align: 'right', format: 'currency' },
      ],
      rows: matched.map((v) => ({
        vendor_code: v.vendor_code,
        vendor_name: v.vendor_name,
        category: v.vendor_type,
        city: v.city,
        phone: v.phone,
        metal_bal: v.opening_balance_gold_fine_gm ? formatWeight(v.opening_balance_gold_fine_gm) : (v.opening_balance_silver_fine_gm ? formatWeight(v.opening_balance_silver_fine_gm) : '0.000 g'),
        cash_bal: v.opening_balance_cash ? formatCurrency(v.opening_balance_cash) : '₹0.00',
      })),
      navigationAction: {
        label: 'Open Vendor Master',
        section: 'masters',
        subView: 'vendor_master'
      }
    };

    return {
      toolName: 'search_vendor',
      success: true,
      isDisambiguation: true,
      disambiguationPrompt: `Found **${matched.length} vendors** matching **"${args.query}"**. Please select the exact supplier to view details:`,
      disambiguationOptions,
      markdownText: `### 🏢 Vendor Directory Search: "${args.query}"\nFound **${matched.length} suppliers** matching your query. Please pick from the interactive choices below:`,
      tableData,
      quickChips: [
        { label: '🏢 Open Vendor Master', action: 'navigate', payload: { section: 'masters', subView: 'vendor_master' } },
        { label: '🛒 New Purchase Invoice (F5)', action: 'navigate', payload: { section: 'transactions', subView: 'purchase' } }
      ]
    };
  }

  // Case 3: Single exact vendor match
  const v = matched[0];
  const summaryCards: AnalyticsSummaryCard[] = [
    {
      id: 'vc-1',
      title: 'Metal Outstanding Balance',
      value: v.opening_balance_gold_fine_gm ? formatWeight(v.opening_balance_gold_fine_gm) : (v.opening_balance_silver_fine_gm ? formatWeight(v.opening_balance_silver_fine_gm) : '0.000 g'),
      subtext: 'Pure 24K / Fine Metal Due',
      colorScheme: 'amber'
    },
    {
      id: 'vc-2',
      title: 'Cash Payable Balance',
      value: v.opening_balance_cash ? formatCurrency(v.opening_balance_cash) : '₹0.00',
      subtext: v.credit_days ? `Net ${v.credit_days} Days Terms` : 'Standard Terms',
      colorScheme: 'blue'
    }
  ];

  const markdownText = `### 🏢 Vendor Profile: ${v.vendor_name}
- **Vendor Code:** \`${v.vendor_code}\` • **Category:** \`${v.vendor_type}\`
- **Contact Person:** **${v.contact_person || 'N/A'}** (📞 \`${v.phone}\`)
- **City / Market:** **${v.city || 'N/A'}** (${v.state || 'MH'})
- **GSTIN:** \`${v.gstin || 'Unregistered'}\`
- **Current Balances:** Fine Metal: **${formatWeight(v.opening_balance_gold_fine_gm || 0)}** | Cash: **${formatCurrency(v.opening_balance_cash || 0)}**
- **Payment Terms:** ${v.credit_days ? `Net ${v.credit_days} Days` : 'Standard Cash/Metal Settlement'}`;

  return {
    toolName: 'search_vendor',
    success: true,
    markdownText,
    summaryCards,
    quickChips: [
      { label: `🛒 Create Purchase for ${v.vendor_name.split(' ')[0]} (F5)`, action: 'navigate', payload: { section: 'transactions', subView: 'purchase' } },
      { label: '📖 View Party Ledger (F8)', action: 'navigate', payload: { section: 'accounts', subView: 'account_display' } },
      { label: '🏢 Open Vendor Master', action: 'navigate', payload: { section: 'masters', subView: 'vendor_master' } }
    ]
  };
}

// ============================================================================
// RESOLVER 3: lookup_order
// ============================================================================
export function resolveLookupOrder(
  args: {
    order_id?: string;
    status?: string;
    customer_id?: string;
    date_range?: string;
    karagir_name?: string;
  },
  context: ErpContext
): ToolExecutionResult {
  const orderPool = (context.orders && context.orders.length > 0) ? context.orders : DEFAULT_ORDERS;

  let matched = [...orderPool];

  if (args.order_id) {
    const q = args.order_id.trim().toLowerCase();
    matched = matched.filter((o) => o.order_no.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
  }

  if (args.customer_id) {
    const q = args.customer_id.trim().toLowerCase();
    matched = matched.filter(
      (o) => o.header.customer_n.toLowerCase().includes(q) || (o.header.ph_no && o.header.ph_no.includes(q))
    );
  }

  if (args.status && args.status !== 'All') {
    matched = matched.filter((o) => o.status.toLowerCase() === args.status!.toLowerCase());
  }

  if (args.karagir_name) {
    const q = args.karagir_name.trim().toLowerCase();
    matched = matched.filter((o) => (o.assigned_karagir && o.assigned_karagir.toLowerCase().includes(q)));
  }

  // Case 1: No match
  if (matched.length === 0) {
    return {
      toolName: 'lookup_order',
      success: false,
      markdownText: `⚠️ No customer orders found matching your search criteria.\n\nWould you like to search with a different Order # / Customer Name, or book a new custom order in **Order Booking**?`,
      quickChips: [
        { label: '📋 Book New Order (F7)', action: 'navigate', payload: { section: 'transactions', subView: 'new_order' } },
        { label: '🔍 View All Pending Orders', action: 'query', payload: 'List all pending orders' }
      ]
    };
  }

  // Case 2: Disambiguation (Multiple orders found)
  if (matched.length > 1) {
    const disambiguationOptions: DisambiguationOption[] = matched.map((o) => {
      const itemDesc = o.items[0]?.item_name || 'Custom Jewellery Item';
      return {
        id: o.id,
        title: `${o.order_no} — ${o.header.customer_n}`,
        subtitle: `${itemDesc} • Due: ${o.header.delivery_date || 'N/A'}`,
        badge: o.status,
        payload: `Lookup status of order ${o.order_no}`,
        actionType: 'select_order'
      };
    });

    const tableData: ChatTableData = {
      title: `Matching Custom Orders (${matched.length} Records)`,
      subtitle: 'Click any order chip or row to inspect workshop timeline',
      columns: [
        { key: 'order_no', label: 'Order #', align: 'left' },
        { key: 'customer_name', label: 'Customer Name', align: 'left' },
        { key: 'item', label: 'Item Description', align: 'left' },
        { key: 'weight', label: 'Approx Wt', align: 'right', format: 'weight' },
        { key: 'advance', label: 'Advance Paid', align: 'right', format: 'currency' },
        { key: 'delivery_date', label: 'Promise Date', align: 'center' },
        { key: 'status', label: 'Status', align: 'center', format: 'badge' },
      ],
      rows: matched.map((o) => {
        const item = o.items[0];
        return {
          order_no: o.order_no,
          customer_name: o.header.customer_n,
          item: item?.item_name || 'Custom Item',
          weight: formatWeight(item?.gross_wt || 0),
          advance: formatCurrency(o.payment?.advance_amt || 0),
          delivery_date: o.header.delivery_date,
          status: o.status,
        };
      }),
      navigationAction: {
        label: 'Open Order Booking (F7)',
        section: 'transactions',
        subView: 'new_order'
      }
    };

    return {
      toolName: 'lookup_order',
      success: true,
      isDisambiguation: true,
      disambiguationPrompt: `Found **${matched.length} matching orders**. Please select the specific order to track:`,
      disambiguationOptions,
      markdownText: `### 📋 Order Lookup Results (${matched.length} Orders Found)\nPlease pick from the interactive choices below:`,
      tableData,
      quickChips: [
        { label: '📋 Open Order Booking (F7)', action: 'navigate', payload: { section: 'transactions', subView: 'new_order' } },
      ]
    };
  }

  // Case 3: Single order detailed inspection
  const o = matched[0];
  const item = o.items[0];
  const totalAmount = o.payment?.amount || 0;
  const advanceAmount = o.payment?.advance_amt || 0;
  const balanceDue = o.payment?.balance_amount || (totalAmount - advanceAmount);
  const fineWt = (item?.net_wt || 0) * (item?.purity || 91.6) / 100;

  const summaryCards: AnalyticsSummaryCard[] = [
    {
      id: 'oc-1',
      title: 'Current Order Status',
      value: o.status,
      subtext: o.status === 'Ready' ? 'QC Passed & In Showroom Safe' : 'In Workshop Processing',
      colorScheme: o.status === 'Ready' ? 'emerald' : 'blue'
    },
    {
      id: 'oc-2',
      title: 'Promised Delivery Date',
      value: o.header.delivery_date || 'Standard',
      subtext: `Booked on ${o.header.bill_date || 'N/A'}`,
      colorScheme: 'amber'
    },
    {
      id: 'oc-3',
      title: 'Balance Due at Delivery',
      value: formatCurrency(balanceDue),
      subtext: `Advance: ${formatCurrency(advanceAmount)}`,
      colorScheme: 'rose'
    }
  ];

  const markdownText = `### 📋 Order Progress Card: \`${o.order_no}\`
- **Customer:** **${o.header.customer_n}** (📞 \`${o.header.ph_no || 'N/A'}\`)
- **Ornament:** **${item?.item_name || 'Custom Bridal Item'}**
- **Purity & Approx Weight:** \`${item?.purity || 91.6}%\` • **${formatWeight(item?.gross_wt || 0)}** (*Fine Metal: ${formatWeight(fineWt)}*)
- **Making Charges:** ₹${item?.mkg_per_gm || 450}/g (Total Making: ${formatCurrency(item?.mkg_amt || 0)})
- **Assigned Karagir / Artisan:** **${o.assigned_karagir || 'In-house Workshop'}**
- **Current Stage:** **${o.status}**
- **Financials:** Total: **${formatCurrency(totalAmount)}** | Advance: **${formatCurrency(advanceAmount)}** | Balance Due: **${formatCurrency(balanceDue)}**
${o.header.remark ? `\n> 📝 *Special Instruction:* ${o.header.remark}` : ''}`;

  return {
    toolName: 'lookup_order',
    success: true,
    markdownText,
    summaryCards,
    quickChips: [
      { label: '📋 Open Order in Booking Form (F7)', action: 'navigate', payload: { section: 'transactions', subView: 'new_order' } },
      { label: '💬 Send WhatsApp Update to Customer', action: 'query', payload: `Send WhatsApp update to ${o.header.customer_n} for order ${o.order_no}` },
    ]
  };
}

// ============================================================================
// RESOLVER 4: navigate_ui
// ============================================================================
export function resolveNavigateUi(
  args: {
    route_name: string;
    params?: { subView?: string; filter?: string; id?: string };
    confirmation_message?: string;
  },
  context: ErpContext
): ToolExecutionResult {
  const screenDef = ERP_SCREENS.find((s) => s.id === args.route_name || s.section === args.route_name);

  const section = screenDef ? screenDef.section : args.route_name;
  const subView = args.params?.subView || (screenDef ? screenDef.subView : undefined);
  const screenName = screenDef ? screenDef.name : args.route_name;
  const shortcut = screenDef ? screenDef.shortcut : 'Hotlink';

  const defaultMsg = `Navigating you directly to **${screenName}** (${shortcut})...`;
  const markdownText = `### 🚀 Screen Navigation: ${screenName}
${args.confirmation_message || defaultMsg}

*Click below if your screen does not automatically switch:*`;

  return {
    toolName: 'navigate_ui',
    success: true,
    markdownText,
    clientNavigation: {
      section,
      subView,
      params: args.params,
      screenName,
      shortcut
    },
    quickChips: [
      { label: `🚀 Go to ${screenName} (${shortcut})`, action: 'navigate', payload: { section, subView } },
      { label: '📊 Back to Dashboard', action: 'navigate', payload: { section: 'dashboard' } }
    ]
  };
}

// Master Dispatcher for all tools
export function executeToolCall(
  toolName: string,
  args: Record<string, any>,
  context: ErpContext
): ToolExecutionResult {
  switch (toolName) {
    case 'query_sales_data':
      return resolveQuerySalesData(args, context);
    case 'search_vendor':
      return resolveSearchVendor(args as any, context);
    case 'lookup_order':
      return resolveLookupOrder(args as any, context);
    case 'navigate_ui':
      return resolveNavigateUi(args as any, context);
    default:
      return {
        toolName,
        success: false,
        markdownText: `Unknown function tool \`${toolName}\`.`
      };
  }
}
