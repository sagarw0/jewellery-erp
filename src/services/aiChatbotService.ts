import {
  AccountMaster,
  NewOrderBookingRecord,
  RefineryRecord,
  PurchaseRecord,
  DayBookEntry,
  DayBookSummary,
  SundryDebtorRow,
  StockItem,
} from '../types/erp';
import { formatCurrency, formatWeight, calculateTaxes, roundTo } from '../utils/calculations';

// Step definition for guided interactive task flows
export interface WorkflowStep {
  id: string;
  field: string;
  question: string;
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
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  activeTask?: {
    taskType: TaskType;
    stepIndex: number;
    collectedData: Record<string, any>;
  };
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
  // WORKFLOW 1: PURCHASE INWARD
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

  // WORKFLOW 2: BARCODE TAG GENERATION
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
        subtext: 'Default craftsmanship charge applied during sales billing.',
        type: 'currency',
        placeholder: 'e.g., 450',
        defaultValue: 450,
        quickPresets: [250, 350, 450, 550, 750],
      },
    ],
  },

  // WORKFLOW 3: SALES POS INVOICE
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
        subtext: 'Enter the item name or scan a tagged barcode.',
        type: 'text',
        placeholder: 'e.g., 22K Royal Peacock Choker, TAG-GLD-102',
        defaultValue: '22K 916 Royal Peacock Choker Necklace',
      },
      {
        id: 'step_sale_net_wt',
        field: 'net_wt',
        question: 'Enter Net Metal Weight (Grams):',
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
        subtext: 'Live 22K 916 rate from bullion market.',
        type: 'currency',
        defaultValue: (data, ctx) => ctx.gold22kRate,
        validate: (val) => ({ valid: Number(val) > 0, error: 'Valid rate required.' }),
      },
      {
        id: 'step_sale_making',
        field: 'making_per_gm',
        question: 'Enter Making Charge (₹ per Gram):',
        type: 'currency',
        placeholder: 'e.g., 450',
        defaultValue: 450,
        quickPresets: [300, 450, 600, 850],
      },
      {
        id: 'step_sale_old_gold',
        field: 'old_gold_amount',
        question: 'Any Old Gold (URD Exchange) Deduction (₹)?',
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

  // WORKFLOW 4: ORDER BOOKING
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
        type: 'text',
        placeholder: 'e.g. Smt. Kavita Patil (9822334455)',
        defaultValue: 'Smt. Kavita Patil',
        validate: (val) => ({ valid: typeof val === 'string' && val.trim().length > 0, error: 'Customer name required.' }),
      },
      {
        id: 'step_ord_item',
        field: 'item_name',
        question: 'Describe the Custom Ornament to Craft:',
        subtext: 'Include details like karat, design pattern, stone type, or length.',
        type: 'text',
        placeholder: 'e.g. 22K Temple Design Bridal Haar with Ruby Stones (45g)',
        defaultValue: '22K Temple Design Bridal Haar with Ruby Stones',
      },
      {
        id: 'step_ord_approx_wt',
        field: 'approx_wt',
        question: 'Enter Approximate Target Weight (Grams):',
        type: 'weight',
        placeholder: '0.000',
        defaultValue: 45.000,
        quickPresets: [15.000, 25.000, 35.000, 45.000, 60.000],
      },
      {
        id: 'step_ord_date',
        field: 'delivery_date',
        question: 'Promise / Delivery Due Date:',
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
        subtext: 'Booking token advance received via Cash/UPI.',
        type: 'currency',
        placeholder: 'e.g., 25000',
        defaultValue: 25000,
        quickPresets: [5000, 15000, 25000, 50000, 100000],
      },
    ],
  },

  // WORKFLOW 5: REFINERY / OLD GOLD MELTING
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
        type: 'text',
        placeholder: 'e.g. Shree Ganesh Refinery & Assaying Centre',
        defaultValue: 'Shree Ganesh Refinery',
        validate: (val) => ({ valid: typeof val === 'string' && val.trim().length > 0, error: 'Refinery name required.' }),
      },
      {
        id: 'step_ref_gross',
        field: 'gross_wt',
        question: 'Enter Scrap Gross Weight (Grams):',
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
        type: 'select',
        options: [
          { label: 'Credit Fine Metal to Stock (Issue to Karagir)', value: 'Metal' },
          { label: 'Cash Settlement at Scrap Bullion Rate', value: 'Cash' },
        ],
        defaultValue: 'Metal',
      },
    ],
  },

  // WORKFLOW 6: CREATE ACCOUNT / PARTY
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
        type: 'text',
        placeholder: 'e.g. Ramesh Kulkarni, Shreeji Crafts Karagir',
        defaultValue: 'Ramesh Kulkarni',
        validate: (val) => ({ valid: typeof val === 'string' && val.trim().length > 0, error: 'Name is required.' }),
      },
      {
        id: 'step_acc_group',
        field: 'account_group',
        question: 'Select Account Ledger Group:',
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
        type: 'text',
        placeholder: 'e.g. 9823456789, Pune',
        defaultValue: '9823456789, Pune',
      },
      {
        id: 'step_acc_opening',
        field: 'opening_balance',
        question: 'Enter Opening Balance (₹):',
        subtext: 'Enter 0 if fresh account with zero balance.',
        type: 'currency',
        placeholder: '0',
        defaultValue: 0,
        quickPresets: [0, 5000, 15000, 50000],
      },
    ],
  },

  // WORKFLOW 7: DAY BOOK EXPENSE / RECEIPT
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
        type: 'text',
        placeholder: 'e.g. Showroom Electricity Bill, Tea & Refreshments, Staff Advance',
        defaultValue: 'Showroom Electricity Bill',
        validate: (val) => ({ valid: typeof val === 'string' && val.trim().length > 0, error: 'Particulars required.' }),
      },
      {
        id: 'step_db_amount',
        field: 'amount',
        question: 'Enter Transaction Amount (₹):',
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
// 2. KNOWLEDGE BASE & NLU QUERY ENGINE
// ----------------------------------------------------
export class AiChatbotEngine {
  private context: ErpContext;

  constructor(context: ErpContext) {
    this.context = context;
  }

  public updateContext(context: ErpContext) {
    this.context = context;
  }

  // Detect user intent: task workflow vs live query vs knowledge question
  public processUserInput(input: string): {
    response: string;
    taskToStart?: TaskType;
    cardData?: ChatMessage['cardData'];
    quickChips?: ChatMessage['quickChips'];
  } {
    const raw = input.trim();
    const text = raw.toLowerCase();

    // 1. Task Initiation Keywords
    if (text.includes('purchase') || text.includes('buy gold') || text.includes('inward') || text.includes('vendor bill') || text.includes('bullion purchase')) {
      return {
        response: 'Sure! I will guide you step-by-step to record a **Purchase Inward & Inventory Lot**. Let\'s begin with the first question:',
        taskToStart: 'purchase_inward',
      };
    }

    if (text.includes('barcode') || text.includes('tag') || text.includes('huid') || text.includes('generate tag') || text.includes('print tag')) {
      return {
        response: 'Let\'s create a new **Barcode & HUID Tag** for your jewellery item step-by-step:',
        taskToStart: 'barcode_generate',
      };
    }

    if (text.includes('sale') || text.includes('sell') || text.includes('pos') || text.includes('invoice') || text.includes('bill') || text.includes('counter sale')) {
      return {
        response: 'Starting the **Sales POS Counter Billing** wizard. I will ask you 1 question at a time to complete the invoice:',
        taskToStart: 'sales_invoice',
      };
    }

    if (text.includes('order') || text.includes('book order') || text.includes('custom order') || text.includes('karagir order')) {
      return {
        response: 'Let\'s record a **Custom Order Booking**. I will take down the customer requirements, promised date, and advance payment:',
        taskToStart: 'order_booking',
      };
    }

    if (text.includes('refinery') || text.includes('melting') || text.includes('old gold') || text.includes('scrap') || text.includes('urd')) {
      return {
        response: 'Starting the **Old Gold & Refinery Inward** flow. Let\'s calculate the fine gold recovery and settlement:',
        taskToStart: 'refinery_melting',
      };
    }

    if (text.includes('add customer') || text.includes('create account') || text.includes('new party') || text.includes('new supplier') || text.includes('add debtor')) {
      return {
        response: 'Let\'s register a new **Account / Party Master** step-by-step:',
        taskToStart: 'account_create',
      };
    }

    if (text.includes('expense') || text.includes('daybook entry') || text.includes('petty cash') || text.includes('voucher')) {
      return {
        response: 'Let\'s record a **Day Book Cash / Bank Voucher** entry:',
        taskToStart: 'daybook_expense',
      };
    }

    // 2. Real-time Live ERP Data Queries
    // Query A: Live Stock
    if (text.includes('stock') || text.includes('inventory') || text.includes('how much gold') || text.includes('stock value') || text.includes('gold balance')) {
      const totalItems = this.context.stockItems.length;
      const totalGrossWt = this.context.stockItems.reduce((s, i) => s + (i.gross_wt || 0), 0);
      const totalFineWt = this.context.stockItems.reduce((s, i) => s + (i.fine_wt || 0), 0);
      const totalVal = this.context.stockItems.reduce((s, i) => s + (i.total_value || (i.net_wt * (i.rate_per_gm || this.context.gold22kRate))), 0);
      const taggedCount = this.context.stockItems.filter((i) => !i.is_loose && i.tag_no).length;
      const looseCount = totalItems - taggedCount;

      return {
        response: `### 📦 Live Showroom Stock Valuation\nHere is your current real-time inventory breakdown:\n- **Total Stock Lots**: ${totalItems} items (${taggedCount} Tagged Barcodes, ${looseCount} Loose Inward Lots)\n- **Total Gross Metal**: **${formatWeight(totalGrossWt)}g**\n- **Fine Gold Equivalent**: **${formatWeight(totalFineWt)}g**\n- **Estimated Stock Value**: **${formatCurrency(totalVal)}**\n- **Live Bullion 22K**: ₹${this.context.gold22kRate.toLocaleString('en-IN')}/g | **24K**: ₹${this.context.gold24kRate.toLocaleString('en-IN')}/g`,
        cardData: {
          type: 'stock_summary',
          title: 'Real-Time Inventory Snapshot',
          details: {
            'Total Stock Items': totalItems,
            'Tagged Barcode Pieces': taggedCount,
            'Loose Lots': looseCount,
            'Total Gross Weight': `${formatWeight(totalGrossWt)}g`,
            'Total Fine Gold': `${formatWeight(totalFineWt)}g`,
            'Total Inventory Valuation': formatCurrency(totalVal),
          },
          actions: [
            { label: 'Open Stock Report (F9)', actionId: 'nav_stock', primary: true },
            { label: 'Generate Barcode Tag', actionId: 'task_barcode' },
          ],
        },
        quickChips: [
          { label: '🛒 Record New Purchase', action: 'start_task', payload: 'purchase_inward' },
          { label: '🏷️ Generate Barcode', action: 'start_task', payload: 'barcode_generate' },
          { label: '💰 Sales POS', action: 'start_task', payload: 'sales_invoice' },
        ],
      };
    }

    // Query B: Live Debtors / Pending Receivables
    if (text.includes('debtor') || text.includes('pending payment') || text.includes('who owes') || text.includes('receivable') || text.includes('pending wt')) {
      const totalDebtors = this.context.debtors.length;
      const totalPendingCash = this.context.debtors.reduce((s, d) => s + (d.balance || 0), 0);
      const totalPendingWt = this.context.debtors.reduce((s, d) => s + (d.pending_wt || 0), 0);
      const top3 = [...this.context.debtors].sort((a, b) => b.balance - a.balance).slice(0, 3);

      const topList = top3.map((d, idx) => `${idx + 1}. **${d.customer_name}**: ${formatCurrency(d.balance)} (${formatWeight(d.pending_wt)}g gold)`).join('\n');

      return {
        response: `### 👥 Sundry Debtors & Outstanding Balance\n- **Total Active Debtors**: ${totalDebtors} parties\n- **Total Cash Outstanding**: **${formatCurrency(totalPendingCash)}**\n- **Pending Metal Dues**: **${formatWeight(totalPendingWt)}g**\n\n**Top Outstanding Accounts:**\n${topList}`,
        cardData: {
          type: 'debtor_summary',
          title: 'Debtors Ledger Summary',
          details: {
            'Total Debtors': totalDebtors,
            'Total Outstanding Amount': formatCurrency(totalPendingCash),
            'Total Pending Metal': `${formatWeight(totalPendingWt)}g`,
            'Top Debtor': top3[0]?.customer_name || 'None',
          },
          actions: [
            { label: 'Open Debtors Ledger (F11)', actionId: 'nav_debtors', primary: true },
            { label: 'Add New Account', actionId: 'task_account' },
          ],
        },
        quickChips: [
          { label: '📖 Day Book Receipt', action: 'start_task', payload: 'daybook_expense' },
          { label: '💰 Sales POS Counter', action: 'start_task', payload: 'sales_invoice' },
        ],
      };
    }

    // Query C: Today's Day Book / Cash Collection
    if (text.includes('day book') || text.includes('today sales') || text.includes('cash collection') || text.includes('cash counter') || text.includes('cash balance')) {
      const totalEntries = this.context.daybook.length;
      const cashIn = this.context.daybook.reduce((s, e) => s + (e.cash_received || 0), 0);
      const cashOut = this.context.daybook.reduce((s, e) => s + (e.cash_payment || 0), 0);
      const bankIn = this.context.daybook.reduce((s, e) => s + (e.bank_received || 0), 0);
      const bankOut = this.context.daybook.reduce((s, e) => s + (e.bank_payment || 0), 0);
      const netCash = cashIn - cashOut;

      return {
        response: `### 📖 Day Book Cash & Bank Summary\n- **Total Vouchers Today**: ${totalEntries}\n- **Cash Received**: **${formatCurrency(cashIn)}**\n- **Cash Payments**: **${formatCurrency(cashOut)}**\n- **Net Cash Flow**: **${formatCurrency(netCash)}**\n- **Bank Inflow**: ${formatCurrency(bankIn)} | **Bank Outflow**: ${formatCurrency(bankOut)}`,
        quickChips: [
          { label: '📖 Open Day Book (F10)', action: 'navigate', payload: { section: 'accounts', subView: 'day_book' } },
          { label: '💵 Record Cash Voucher', action: 'start_task', payload: 'daybook_expense' },
        ],
      };
    }

    // Query D: Pending Orders
    if (text.includes('pending orders') || text.includes('delivery due') || text.includes('workshop status') || text.includes('orders due')) {
      const pendingOrders = this.context.orders.filter((o) => o.status !== 'Completed' && o.status !== 'Delivered');
      const orderList = pendingOrders.slice(0, 3).map((o, idx) => `${idx + 1}. **#${o.order_no}** (${o.header.customer_n}): ${o.items.map((i) => i.item_name).join(', ')} - Due: ${o.header.delivery_date}`).join('\n');

      return {
        response: `### 📋 Active Customer Orders (${pendingOrders.length} In Progress)\n${orderList || 'No pending orders currently.'}`,
        quickChips: [
          { label: '📋 Book New Order', action: 'start_task', payload: 'order_booking' },
          { label: 'View All Orders (F7)', action: 'navigate', payload: { section: 'transactions', subView: 'new_order' } },
        ],
      };
    }

    // Query E: Rates
    if (text.includes('gold rate') || text.includes('silver rate') || text.includes('rate today') || text.includes('bullion')) {
      return {
        response: `### 📈 Live Bullion Showroom Rates\n- **24K Pure Bullion (99.9%)**: **₹${this.context.gold24kRate.toLocaleString('en-IN')} / 10g** (₹${Math.round(this.context.gold24kRate / 10).toLocaleString('en-IN')}/g)\n- **22K 916 Hallmarked Gold**: **₹${this.context.gold22kRate.toLocaleString('en-IN')} / 10g** (₹${Math.round(this.context.gold22kRate / 10).toLocaleString('en-IN')}/g)\n- **Fine Silver 999**: **₹${this.context.silverRate.toLocaleString('en-IN')} / 1 kg** (₹${(this.context.silverRate / 1000).toFixed(2)}/g)\n\n*Rates auto-sync with live bullion feed. You can adjust custom showroom margins from the Bullion Center.*`,
        quickChips: [
          { label: '🛒 Start Purchase', action: 'start_task', payload: 'purchase_inward' },
          { label: '💰 Start Sale POS', action: 'start_task', payload: 'sales_invoice' },
        ],
      };
    }

    // 3. Knowledge Base Q&A
    if (text.includes('formula') || text.includes('fine gold') || text.includes('net weight') || text.includes('calculate gst') || text.includes('calculation')) {
      return {
        response: `### 🧮 Standard Jewellery ERP Formulas\nHere are the exact industry formulas used across this application:\n\n1. **Net Metal Weight**:\n   $$\\text{Net Wt} = \\text{Gross Wt} - \\text{Stone Wt} - \\text{Black Beads Wt}$$\n\n2. **Fine Gold Equivalent**:\n   $$\\text{Fine Wt} = \\text{Net Wt} \\times \\left(\\frac{\\text{Purity \\%}}{100}\\right)$$\n\n3. **Taxable Jewellery Value**:\n   $$\\text{Taxable Amt} = (\\text{Net Wt} \\times \\text{Metal Rate}) + (\\text{Net Wt} \\times \\text{Making Charges/g}) + \\text{Hallmark Fee}$$\n\n4. **GST on Jewellery**:\n   $$\\text{GST (3\\%)} = \\text{Taxable Amt} \\times 0.03 \\quad (1.5\\% \\text{ CGST} + 1.5\\% \\text{ SGST})$$\n\n5. **Net Payable Amount**:\n   $$\\text{Net Due} = (\\text{Taxable Amt} + \\text{GST}) - \\text{Old Gold Exchange (URD)} - \\text{Discount}$$`,
        quickChips: [
          { label: '💰 Try Sales POS', action: 'start_task', payload: 'sales_invoice' },
          { label: '🏷️ Try Barcode Tagging', action: 'start_task', payload: 'barcode_generate' },
        ],
      };
    }

    if (text.includes('huid') || text.includes('hallmark') || text.includes('bis')) {
      return {
        response: `### 🔍 BIS Hallmarking & 6-Digit HUID Standards\n- **What is HUID?**: Hallmarking Unique Identification (HUID) is a **6-digit alphanumeric code** (e.g., \`B9K8L1\`) laser-marked on every hallmarked gold ornament by BIS-certified Assaying & Hallmarking Centres (AHC).\n- **Mandatory Karats**: 14K (585), 18K (750), 20K (840), 22K (916), 23K (958), 24K (999).\n- **Swarna ERP Integration**: In Barcode Studio & Purchase Inward, the system automatically checks or generates verified 6-digit HUID tags and embeds them directly in printable thermal barcode labels and customer tax invoices.`,
        quickChips: [
          { label: '🏷️ Generate Barcode with HUID', action: 'start_task', payload: 'barcode_generate' },
        ],
      };
    }

    if (text.includes('hotkey') || text.includes('shortcut') || text.includes('keyboard') || text.includes('f1') || text.includes('f2')) {
      return {
        response: `### ⌨️ Swarna ERP Keyboard Hotkeys (F1–F12)\nUse these single-key shortcuts from anywhere in the app for instant navigation:\n- **F1**: Executive Analytics & Business Intelligence Modal\n- **F2**: Item Creation Master (Add batch stock)\n- **F3**: Barcode Studio & Thermal Tag Printing\n- **F4**: Sales POS Counter & GST Billing\n- **F5**: Purchase Inward & Supplier Invoicing\n- **F6**: Old Gold / Refinery Inward\n- **F7**: New Order Booking & Karagir Workshop\n- **F8**: Account Master & T-Ledger Display\n- **F9**: Stock Inventory Report & Valuation\n- **F10**: Day Book & Cash/Bank Register\n- **F11**: Debtors Ledger & Credit Tracking\n- **F12**: USB Cloud Backup Manager\n- **Ctrl + Space / Alt + A**: Toggle this AI Copilot Assistant`,
      };
    }

    if (text.includes('backup') || text.includes('usb') || text.includes('cloud') || text.includes('restore')) {
      return {
        response: `### 💾 Enterprise Cloud & USB Backup\n- **Automatic Cloud Sync**: Every transaction (purchase, sale, order, stock, day book) is synced in real time to the Supabase Cloud database.\n- **Offline USB Backup (F12)**: Go to **Backup Manager (F12)** to create encrypted offline backups to USB flash drives, local drives, or email copies.\n- **One-Click Restore**: Backup snapshots can be restored at any time to guarantee 100% zero data loss.`,
        quickChips: [
          { label: '💾 Open Backup Manager (F12)', action: 'navigate', payload: { section: 'backup' } },
        ],
      };
    }

    // Default Friendly Knowledge Help
    return {
      response: `👋 Hello! I am **Swarna AI ERP Copilot**. I can execute any jewellery showroom task step-by-step or answer any questions about the software.\n\n### What would you like to do?\n- **Step-by-Step Task Workflows**:\n  1. 🛒 **Purchase Inward & Stock Lots**\n  2. 🏷️ **Generate Barcode & HUID Tags**\n  3. 💰 **Sales POS & Counter Billing**\n  4. 📋 **Book Custom Customer Orders**\n  5. 🔥 **Old Gold & Refinery Melting**\n  6. 👤 **Create New Customer / Supplier Account**\n  7. 📖 **Record Day Book Cash Voucher**\n\n- **Instant Q&A & Inquiries**:\n  - *"What is my current gold stock?"*\n  - *"Show me top pending debtors"*\n  - *"What are today's live rates?"*\n  - *"What is the formula for Fine Gold?"*\n  - *"What are the keyboard shortcuts?"*`,
      quickChips: [
        { label: '🛒 New Purchase', action: 'start_task', payload: 'purchase_inward' },
        { label: '🏷️ Generate Barcode', action: 'start_task', payload: 'barcode_generate' },
        { label: '💰 Sales POS', action: 'start_task', payload: 'sales_invoice' },
        { label: '📋 Book Order', action: 'start_task', payload: 'order_booking' },
        { label: '📦 Stock Query', action: 'query', payload: 'stock' },
        { label: '👥 Debtors Query', action: 'query', payload: 'debtors' },
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
          message: `✅ **Purchase Voucher #${invoiceNo} Recorded Successfully!**\n- Added **${formatWeight(grossWt)}g** of ${data.item_name} to loose stock inventory.\n- Total Taxable Value: **${formatCurrency(totalAmt)}** (+ 3% GST: ${formatCurrency(Math.round(totalAmt * 0.03))}).\n- Day Book and Supplier Ledger updated.`,
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
          message: `✅ **Barcode Tag #${tagNo} Generated Successfully!**\n- Item: **${data.item_name}**\n- Weight: **${formatWeight(grossWt)}g** (Net: ${formatWeight(netWt)}g)\n- BIS HUID: **${huid}**\n- Added to active showroom display stock. Ready for thermal label printing!`,
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
        const taxableVal = metalVal + makingVal + 45; // 45 hallmark fee
        const gstVal = Math.round(taxableVal * 0.03);
        const oldGold = Number(data.old_gold_amount) || 0;
        const totalInvoice = Math.round(taxableVal + gstVal - oldGold);
        const invNo = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

        // Add DayBook entry for sales cash/bank collection
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
          message: `✅ **Tax Invoice #${invNo} Generated Successfully!**\n- Customer: **${data.customer_name}** (${data.phone || 'Walk-in'})\n- Ornament: **${data.item_name}** (${formatWeight(netWt)}g)\n- Taxable Amount: **${formatCurrency(taxableVal)}** + 3% GST: **${formatCurrency(gstVal)}**\n- Old Gold Exchanged: **${formatCurrency(oldGold)}**\n- **Net Amount Paid: ${formatCurrency(totalInvoice)}** (${data.payment_mode})\n- Day Book updated with incoming funds!`,
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
          message: `✅ **Custom Order #${orderNo} Booked Successfully!**\n- Customer: **${data.customer_name}**\n- Ornament: **${data.item_name}** (Target Wt: **${formatWeight(approxWt)}g**)\n- Promise Delivery Date: **${data.delivery_date}**\n- Advance Received: **${formatCurrency(advance)}**\n- Order is now queued in the Karagir workshop pipeline!`,
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
          message: `✅ **Refinery Voucher #${refNo} Created!**\n- Scrapped Metal: **${formatWeight(grossWt)}g** at **${purity}% Touch**\n- Pure Fine Gold Yield: **${formatWeight(fineWt)}g**\n- Credited to Showroom Pure Metal Vault!`,
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
          message: `✅ **Account ${data.account_name} (${code}) Registered!**\n- Group: **${data.account_group}**\n- Opening Balance: **${formatCurrency(Number(data.opening_balance) || 0)}**\n- Synced with accounts ledger and cloud database.`,
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
          message: `✅ **Day Book Voucher of ${formatCurrency(amount)} Recorded!**\n- Voucher: **${data.invoice_type}**\n- Particulars: **${data.details}**\n- Showroom cash drawer updated.`,
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
