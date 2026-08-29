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
  // Left Payment Section
  left_payment_type: string;    // "Payment Type"
  left_amount: number;          // "Amount"
  left_bank_name: string;       // "Bank Name"
  left_voucher_no: string;      // "Voucher No"
  left_cheque_date: string;     // "Cheque Date"

  // Cash Section
  cash_received: number;        // "Cash Received"
  cash_payment_type: string;    // "Payment Type"
  cash_amount: number;          // "Amount"
  cash_bank_name: string;       // "Bank Name"
  cash_cheque_no: string;       // "Cheque No"
  cash_cheque_date: string;     // "Cheque Date"

  // Tax Section
  gst_pct: number;              // "GST"
  hgst_pct: number;             // "HGST" (Half GST / SGST)
  mgst_pct: number;             // "MGST" (Half GST / CGST)
  gst_amt: number;              // GST-related amount fields
  hgst_amt: number;
  mgst_amt: number;

  // Other Amounts
  advance_amt: number;          // "Advance Amt"
  other_amt: number;            // "Other Amt"
  urd_bill_no: string;          // "URD BillNo"
  bank_amt: number;             // "Bank Amt"

  // Final Amount Section
  amount: number;               // "Amount"
  bill_discount: number;        // "Bill Discount"
  total_discount: number;       // "Total Discount"
  purchase_amt: number;         // "Purchase Amt." (Old gold exchange / URD)
  cash_final_amount: number;    // "Cash Amount"
  balance_amount: number;       // "Balance Amount"
  manual_urd_amt: number;       // "Manual URD Amt"
}

export interface NewOrderBookingRecord {
  id: string;
  order_no: string;
  header: NewOrderHeader;
  items: NewOrderItem[];
  payment: NewOrderPayment;
  status: 'Booked' | 'With Karagir' | 'Received' | 'Delivered' | 'Cancelled';
  assigned_karagir?: string;
  karagir_issue_date?: string;
  karagir_delivery_date?: string;
  created_at: string;
}

// ----------------------------------------------------
// 3. Refinery In (Spec #25, #26, #27, #28, #29, #30, #31, #32)
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

  // Tax
  gst_pct: number;
  hgst_pct: number;
  mgst_pct: number;
  tds_pct: number;
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
// 7. Stock Report (Spec #14, #15, #16)
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
  category: string;             // Gold, Silver, etc.
  tag_no?: string;
  is_urd: boolean;
  rate_per_gm: number;
  total_value: number;
}

// ----------------------------------------------------
// 8. Account Display (Spec #17, #18, #19)
// ----------------------------------------------------
export interface DebitLedgerEntry {
  date: string;                 // "Date."
  particulars: string;          // "Particulars"
  r_no: string;                 // "R.No" (Receipt No)
  rs: number;                   // "Rs."
}

export interface CreditLedgerEntry {
  date: string;                 // "Date"
  particulars: string;          // "Particulars."
  v_no: string;                 // "V.No" (Voucher No)
  rs: number;                   // "Rs.."
}

// ----------------------------------------------------
// 9. Backup Media (Spec #5)
// ----------------------------------------------------
export type BackupMediaOption = 'Default Location' | 'USB Drive' | 'Google Drive' | 'HDD';

export interface BackupStatusInfo {
  media: BackupMediaOption;
  last_backup: string;          // "Last Backup"
  backup_status: 'Success' | 'Failed' | 'In Progress' | 'Never Run'; // "Backup Status"
  backup_size: string;          // "Backup Size"
  backup_date: string;          // "Backup Date"
  auto_cloud_sync: boolean;
}

// ----------------------------------------------------
// 10. Field Dictionary Entry (Spec #40, #41)
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
