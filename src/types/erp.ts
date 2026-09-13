// TypeScript Definitions for Modernized Field-Preserved Jewellery ERP

export type NavSection =
  | 'dashboard'
  | 'masters'
  | 'transactions'
  | 'accounts'
  | 'stock'
  | 'reports'
  | 'gold_scheme'
  | 'messenger'
  | 'backup'
  | 'settings'
  | 'field_dictionary';

export type MasterSubView = 'account_master' | 'item_creation' | 'barcode';
export type TransactionSubView = 'new_order' | 'purchase' | 'refinery_in' | 'sales_invoice';
export type AccountSubView = 'day_book' | 'book_display' | 'account_display';
export type StockSubView = 'stock_report' | 'audit';

// ----------------------------------------------------
// Theme Types & Customization
// ----------------------------------------------------
export type ThemeId =
  | 'light-blue'
  | 'royal-gold'
  | 'emerald-luxury'
  | 'rose-gold'
  | 'velvet-purple'
  | 'platinum-ice'
  | 'ruby-regal'
  | 'obsidian-velvet';

export type UiDensity = 'compact' | 'comfortable';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  swatchPrimary: string;
  swatchSecondary: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  cardHover: string;
  primaryBtn: string;
  secondaryBtn: string;
  accentText: string;
  badgeBg: string;
  headerBg: string;
  appBg: string;
  textPrimary: string;
  subnavBg: string;
  activePill: string;
  inputBorder: string;
}

// ----------------------------------------------------
// 1. Account Master & Groups (Spec #3, #4)
// ----------------------------------------------------
export interface CardCharges {
  card_charges: boolean;        // "Card Charges"
  for_customer_pct: number;     // "For Customer in %"
  for_us_pct: number;           // "For Us in %"
}

export interface AccountMaster {
  account_code: string;         // "Account Code"
  account_name: string;         // "Account Name"
  account_type: string;         // "Account Type" (e.g. Assets, Liabilities, Expense, Income)
  account_group: string;        // "Account Group" (Bank Charges, Cash Account, CGST1P5, etc.)
  opening_balance: number;      // "Opening Balance"
  balance_type: 'Dr' | 'Cr';
  card_charges: CardCharges;
  phone?: string;
  area?: string;
  created_at?: string;
}

// ----------------------------------------------------
// 2. New Order Booking (Spec #20, #21, #22, #23, #24)
// ----------------------------------------------------
export type NewOrderTab =
  | 'new_order_booking'
  | 'submit_order_to_karagir'
  | 'issue_material_to_karagir'
  | 'receive_order_from_karagir'
  | 'new_order_sales_invoice'
  | 'new_order_report'
  | 'advance';

export interface NewOrderItem {
  id: string;
  trans_type: string;           // "TransType" (e.g. Order, Repair, Jobwork)
  item_name: string;            // "Item Name"
  description: string;          // "Description"
  qty: number;                  // "QTY"
  gross_wt: number;             // "GrossWt"
  black_beats: number;          // "Black.Beats" (black beads in mangalsutra)
  stone_wt: number;             // "StoneWt"
  stone_amt: number;            // "StoneAmt"
  net_wt: number;               // "NetWt" = GrossWt - Black.Beats - StoneWt
  purity: number;               // "Purity" (e.g. 91.6, 75.0, 99.5)
  mkg_per_gm: number;           // "Mkg/Gm"
  mkg_amt: number;              // "MkgAmt"
  hallm_charges: number;        // "HallM.Charges"
  making_pct: number;           // "Making%"
  item_amt: number;             // Calculated total for line
}

export interface NewOrderHeader {
  customer_n: string;           // "Customer N" (Customer Name)
  address: string;              // "Address"
  ph_no: string;                // "Ph.No"
  remark: string;               // "Remark"
  area: string;                 // "Area"
  aadhar_no: string;            // "Aadhar No"
  pan_card: string;             // "Pan Card"
  bill_type: string;            // "Bill Type" (Estimate, Tax Invoice, Order)
  n5: string;                   // "N5" (Legacy Special Code/Category)
  bill_date: string;            // "Bill Date"
  delivery_date: string;        // "Delivery Date"
  manual_no: string;            // "Manual No"
  state: string;                // "State"
  salesman: string;             // "Salesman"
  gst_not_required: boolean;    // "GST Not Required"
  close_order: boolean;         // "Close Order"
}

export interface NewOrderPayment {
  left_payment_type?: string;    // "Payment Type"
  left_amount?: number;          // "Amount"
  left_bank_name?: string;       // "Bank Name"
  left_voucher_no?: string;      // "Voucher No"
  left_cheque_date?: string;     // "Cheque Date"

  rate_cut_gold_wt?: number;     // "Rate Cut Gold Wt"
  rate_cut_gold_rate?: number;   // "Rate Cut Gold Rate"
  rate_cut_gold_amount?: number; // "Rate Cut Gold Amount"
  rate_cut_silver_wt?: number;   // "Rate Cut Silver Wt"
  rate_cut_silver_rate?: number; // "Rate Cut Silver Rate"
  rate_cut_silver_amount?: number; // "Rate Cut Silver Amount"

  gold_adv_wt?: number;          // "Gold Adv Wt"
  gold_adv_purity?: number;      // "Purity"
  gold_adv_fin_wt?: number;      // "Fin Wt"
  silver_adv_wt?: number;        // "Silver Adv Wt"
  silver_adv_purity?: number;    // "Purity"
  silver_adv_fin_wt?: number;    // "Fin Wt"

  old_gold_gross_wt?: number;    // "Old Gold - GrossWt"
  old_gold_dust?: number;        // "Dust"
  old_gold_net_wt?: number;      // "NetWt"
  old_gold_purity?: number;      // "Purity"
  old_gold_fin_wt?: number;      // "FinWt"
  old_gold_rate?: number;        // "Rate"
  old_gold_amt?: number;         // "Amount"

  old_silver_gross_wt?: number;  // "Old Silver - GrossWt"
  old_silver_dust?: number;      // "Dust"
  old_silver_net_wt?: number;    // "NetWt"
  old_silver_purity?: number;    // "Purity"
  old_silver_fin_wt?: number;    // "FinWt"
  old_silver_rate?: number;      // "Rate"
  old_silver_amt?: number;       // "Amount"

  total_amount?: number;         // "Total Amount"
  discount?: number;             // "Discount"
  balance_due?: number;          // "Balance Due"

  cash_received?: number;
  cash_payment_type?: string;
  cash_amount?: number;
  cash_bank_name?: string;
  cash_cheque_no?: string;
  cash_cheque_date?: string;

  gst_pct: number;
  hgst_pct?: number;
  mgst_pct?: number;
  gst_amt: number;
  hgst_amt?: number;
  mgst_amt?: number;

  advance_amt: number;
  other_amt: number;
  urd_bill_no?: string;
  bank_amt?: number;

  amount: number;
  bill_discount: number;
  total_discount?: number;
  purchase_amt: number;
  cash_final_amount?: number;
  balance_amount: number;
  manual_urd_amt?: number;
}

export interface KaragirAssignment {
  karagir_id: string;
  karagir_name: string;
  karagir_phone?: string;
  assigned_date: string;
  promised_date: string;
  issued_metal_type: string; // e.g. '24K Gold Bar', '916 Wire', '999 Fine Silver'
  issued_gross_wt: number;
  issued_purity: number;
  issued_fine_wt: number;
  alloy_added_wt?: number;
  karagir_rate_per_gm: number;
  agreed_making_charges: number;
  wastage_pct: number;
  special_instructions?: string;
  voucher_no: string;
  status: 'Assigned' | 'In Progress' | 'Received' | 'Polished' | 'Cancelled';
  received_gross_wt?: number;
  received_net_wt?: number;
  received_date?: string;
  return_scrap_wt?: number;
}

export interface NewOrderBookingRecord {
  id: string;
  order_no: string;
  header: NewOrderHeader;
  items: NewOrderItem[];
  payment: NewOrderPayment;
  status: string;
  assigned_karagir?: string;
  karagir_issue_date?: string;
  karagir_delivery_date?: string;
  karagir_assignment?: KaragirAssignment;
  created_at: string;
}

// ----------------------------------------------------
// 3. Refinery In (Spec #25 to #32)
// ----------------------------------------------------
export type RefineryTab =
  | 'new_refinery'
  | 'refinery_in'
  | 'refinery_out'
  | 'account_cum_stock_display'
  | 'purchase_consignment';

export interface RefineryHeader {
  refinery_name: string;        // "Refinery Name"
  remark: string;               // "Remark"
  payment_mode: 'Cash' | 'Credit'; // "Cash" / "Credit"
  invoice_prefix: string;       // "Invoice Prefix"
  manual_no: string;            // "Manual No"
  invoice_date: string;         // "Invoice Date"
  invoice_no: string;           // "Invoice No"
  state: string;                // "State"
  gst_not_required: boolean;    // "GST Not Required"
}

export interface RefineryMaterialInItem {
  id: string;
  no: number;                   // "No"
  trans_type: string;           // "TransType"
  item_name: string;            // "Itemname"
  gross_wt: number;             // "GrossWt"
  net_wt: number;               // "NetWt"
  purity: number;               // "Purity"
  fin_wt: number;               // "FinWt" = NetWt * Purity / 100
  rate: number;                 // "Rate"
  amount: number;               // "Amount"
  refinery_loss: number;        // "RefineryLoss"
  refinery_profit: number;      // "RefineryProfit"
  total_amt: number;            // "Total.Amt"
  making_on_qty: number;        // "Making On Qty"
}

export interface RefineryWeightSummary {
  balance_wgt_grswt: number;    // "Balance Wgt - GrsWt -"
  net_wgt: number;              // "NetWgt -"
  fin_wgt: number;              // "FinWgt -"
}

export interface RefineryCalculation {
  against_refout_bill_no: string; // "Against Refout Bill No"
  by_cash: number;              // "By Cash"
  payment_type: string;         // "Payment Type"
  by_cheque: number;            // "By Cheque"
  bank_name: string;            // "Bank Name"
  cheque_no: string;            // "Cheque No"
  cheque_date: string;          // "Cheque Date"
  details: string;              // "Details"

  // Tax
  gst_pct: number;              // "GST"
  hgst_pct: number;             // "HGST"
  mgst_pct: number;             // "MGST"
  tds_pct: number;              // "TDS"
  gst_amt: number;
  hgst_amt: number;
  mgst_amt: number;
  tds_amt: number;

  // Amounts
  purchase_amt: number;         // "Purchase Amt."
  discount: number;             // "Discount"
  sales_amt: number;            // "Sales Amt."
  bill_amount: number;          // "Bill Amount"
  sub_tax: number;              // "Sub Tax"
  tcs_tax_pct: number;          // "TCS Tax %"
  tcs_tax_amt: number;          // "TCS Tax Amt"
  paid_amount: number;          // "Paid Amount"
  net_balance: number;          // "Net Balance"
}

export interface RefineryRecord {
  id: string;
  header: RefineryHeader;
  items: RefineryMaterialInItem[];
  weight_summary: RefineryWeightSummary;
  calculation: RefineryCalculation;
  created_at: string;
}

// ----------------------------------------------------
// 4. Purchase Invoice (Spec #33, #34, #35, #36, #37)
// ----------------------------------------------------
export type PurchaseTab =
  | 'supplier'
  | 'purchase_bill'
  | 'payment'
  | 'account_display'
  | 'account_cum_stock_display'
  | 'purchase_consignment'
  | 'stock_cash_settlement';

export interface PurchaseHeader {
  supplier_name: string;        // "Supplier Name"
  remark: string;               // "Remark"
  payment_mode: 'Cash' | 'Credit'; // "Cash" / "Credit"
  invoice_prefix: string;       // "Invoice Prefix"
  manual_no: string;            // "Manual No"
  invoice_date: string;         // "Invoice Date"
  invoice_no: string;           // "Invoice No"
  state: string;                // "State"
  gst_not_required: boolean;    // "GST Not Required"
  weightwise: boolean;          // "Weightwise"
}

export interface PurchaseItem {
  id: string;
  trans_type: string;           // "TransType"
  item_name: string;            // "Itemname"
  qty: number;                  // "QTY"
  gross_wt: number;             // "GrossWt"
  black_b: number;              // "Black.B"
  stone_wt: number;             // "StoneWt"
  net_wt: number;               // "NetWt"
  purity: number;               // "Purity"
  rate: number;                 // "Rate"
  amount: number;               // "Amount"
  wastage_pct: number;          // "Wastage%"
  fin_plus_wastage: number;     // "Fin+Wastage"
  total_amt: number;            // "Total.Amt"
  huid: string;                 // "HUID" (6-character unique identifier)
}

export interface PurchasePayment {
  by_cash: number;              // "By Cash"
  payment_type: string;         // "Payment Type"
  by_cheque: number;            // "By Cheque"
  bank_name: string;            // "Bank Name"
  cheque_no: string;            // "Cheque No"
  cheque_date: string;          // "Cheque Date"
  details: string;              // "Details"

  gst_pct: number;
  hgst_pct: number;
  mgst_pct: number;
  tds_pct: number;
  gst_amt: number;
  hgst_amt: number;
  mgst_amt: number;
  tds_amt: number;

  purchase_amt: number;         // "Purchase Amt."
  discount: number;             // "Discount"
  sales_amt: number;            // "Sales Amt."
  bill_amount: number;          // "Bill Amount"
  sub_tax: number;              // "Sub Tax"
  tcs_tax_pct: number;          // "TCS Tax %"
  tcs_tax_amt: number;          // "TCS Tax Amt"
  paid_amount: number;          // "Paid Amount"
  net_balance: number;          // "Net Balance"
}

export interface PurchaseRecord {
  id: string;
  header: PurchaseHeader;
  items: PurchaseItem[];
  payment: PurchasePayment;
  created_at: string;
}

// ----------------------------------------------------
// 5. Day Book (Spec #10, #11, #12, #13)
// ----------------------------------------------------
export type DayBookTab = 'cash_book' | 'stock_book' | 'sales_book' | 'summary';

export interface DayBookEntry {
  id: string;
  invoice_type: string;         // "InvoiceType"
  invoice_no: string;           // "Invoice.No"
  total_amt: number;            // "Total.Amt"
  urd_amt: number;              // "URD.Amt"
  net_amt: number;              // "Net.Amt"
  cash_received: number;        // "Cash.Received"
  cash_payment: number;         // "Cash.Payment"
  bank_received: number;        // "Bank.Received"
  bank_payment: number;         // "Bank.Payment"
  date: string;                 // "Date"
  details: string;              // "Details"
  total_amt_without_disc: number; // "Total Amt without Disc"
}

export interface DayBookSummary {
  total_cash_opening: number;   // "Total Cash Opening"
  total_cash_closing: number;   // "Total Cash Closing"
  bank_opening: number;         // "Bank Opening"
  bank_closing: number;         // "Bank Closing"
}

// ----------------------------------------------------
// 6. Book Display (Spec #6, #7, #8, #9)
// ----------------------------------------------------
export type BookType =
  | 'Sales Book'
  | 'Cash Book'
  | 'Sales Return Book'
  | 'Sundry Debtor'
  | 'Purchase'
  | 'Sundry Creditor'
  | 'Purchase Return Book'
  | 'Credit Limit Locking'
  | 'Journal';

export interface SundryDebtorRow {
  sr_no: number;                // "Sr No"
  code: string;                 // "Code"
  customer_name: string;        // "Customer Name"
  opening_bal: number;          // "Opening Bal."
  tot_amt_inc_opening: number;  // "Tot. Amt. Inc. Opening"
  received_amt: number;         // "Received Amt."
  balance: number;              // "Balance"
  pending_wt: number;           // "Pending WT" (in Grams)
  phone: string;                // "Phone"
}

export interface ColumnSetting {
  id: string;
  label: string;
  visible: boolean;
  width: number;
  order: number;
}

// ----------------------------------------------------
// 7. Stock Report & Inventory
// ----------------------------------------------------
export interface StockFilter {
  select_type: string;          // "Select Type" (Gold, Silver, Platinum, Diamond)
  select_details: string;       // "Select Details" (All, Tagged, Loose)
  format: string;               // "Format" (Summary, Itemwise, Categorywise)
  show_all_items: boolean;      // "Show All Items"
  per: string;                  // "Per" (Gram, Piece, Carat)
  value: string;                // "Value" (Tag Rate, Fine Rate, Market Rate)
  dont_show_urd_item: boolean;  // "Don't Show URD Item"
}

export interface StockItem {
  id: string;
  item_name: string;            // "Item Name"
  qty: number;                  // "Qty"
  gross_wt: number;             // "Gross Wt."
  net_wt: number;               // "Net Wt."
  fine_wt: number;              // "Fine Wt."
  purity: number;
  category: string;             // Gold, Silver, Imitation, URD Gold, URD Silver, etc.
  tag_no?: string;
  is_urd: boolean;
  is_loose?: boolean;
  rate_per_gm: number;
  total_value: number;
}

// ----------------------------------------------------
// 8. Item Creation & Opening Stock Masters
// ----------------------------------------------------
export interface ItemMasterDefinition {
  id: string;
  item_name: string;
  item_type: string;            // Ring, Chain, Bangle, Necklace, Mangalsutra, Earring, Coin, etc.
  item_group: string;           // Gold, Silver, 1gm Imitation, URD Gold, URD Silver, Diamond, Platinum
  design: string;               // Casted, Handmade, Laser Cut, Filigree, Antique, Plain, Studded
  weight_or_qty: 'Weight' | 'QTY';
  total_stock_weight: number;   // Total batch weight added by owner
  remaining_weight: number;     // Remaining weight available to convert into tagged barcodes
  image_url?: string;
  created_at: string;
}

export interface OpeningStockItem {
  id: string;
  item_name: string;
  gross_wt: number;
  net_wt: number;
  black_beats: number;
  stone_wt: number;
  diamond_cts: number;
  bag_wt: number;
  purity: number;
  final_wt: number;
  qty: number;
  size?: string;
}

// ----------------------------------------------------
// 9. Barcode Studio & Tagging
// ----------------------------------------------------
export interface BarcodeTagItem {
  id: string;
  sr_no: number;
  tag_no: string;
  item_name: string;
  item_type: string;
  category: string;
  tray?: string;
  section?: string;
  attachment?: string;
  qty: number;
  gross_wt: number;
  net_wt: number;
  purity: number;
  black_b: number;
  stone_wt: number;
  making_per_gm: number;
  making_pct: number;
  size: string;
  hallmark_charges: number;
  huid: string;
  manual_tag: string;
  is_printed: boolean;
  is_loose: boolean;
  created_at?: string;
}

// ----------------------------------------------------
// 10. Dashboard & Analytics Modules
// ----------------------------------------------------
export interface DashboardNoticeItem {
  id: string;
  type: 'receivable' | 'birthday' | 'order_due' | 'anniversary' | 'bhishi' | 'debtor';
  title: string;
  subtitle: string;
  amount?: number;
  date?: string;
  tag?: string;
}

export interface BankBalanceItem {
  bank_name: string;
  account_no: string;
  balance: number;
  type: 'Current' | 'Savings' | 'OD / CC';
}

export interface AnalyticsData {
  top_suppliers: { name: string; total_orders: number; total_wt: number; rating: number }[];
  top_job_workers: { name: string; jobs_completed: number; loss_pct: number; on_time_pct: number }[];
  most_demanded: { item_name: string; category: string; inquiries: number; stock_status: string }[];
  total_sold: { period: string; gold_wt: number; silver_wt: number; amount: number }[];
  ornament_demand: { ornament: string; sold_qty: number; demand_score: number; growth: string }[];
}

// ----------------------------------------------------
// 11. Account Display
// ----------------------------------------------------
export interface DebitLedgerEntry {
  date: string;
  particulars: string;
  r_no: string;
  rs: number;
}

export interface CreditLedgerEntry {
  date: string;
  particulars: string;
  v_no: string;
  rs: number;
}

// ----------------------------------------------------
// 12. Backup Media
// ----------------------------------------------------
export type BackupMediaOption = 'Default Location' | 'USB Drive' | 'Google Drive' | 'HDD';

export interface BackupStatusInfo {
  media: BackupMediaOption;
  last_backup: string;
  backup_status: 'Success' | 'Failed' | 'In Progress' | 'Never Run';
  backup_size: string;
  backup_date: string;
  auto_cloud_sync: boolean;
}

// ----------------------------------------------------
// 13. Field Dictionary Entry
// ----------------------------------------------------
export interface FieldDictionaryEntry {
  screen: string;
  ui_label: string;
  database_field: string;
  type: 'Decimal' | 'String' | 'Date' | 'Boolean' | 'Integer';
  mandatory: boolean;
  calculation: boolean;
  formula_or_rule?: string;
  business_meaning: string;
}
