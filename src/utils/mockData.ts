import {
  AccountMaster,
  NewOrderBookingRecord,
  RefineryRecord,
  PurchaseRecord,
  DayBookEntry,
  DayBookSummary,
  SundryDebtorRow,
  StockItem,
  DebitLedgerEntry,
  CreditLedgerEntry,
  BackupStatusInfo
} from '../types/erp';

export const INITIAL_ACCOUNTS: AccountMaster[] = [
  {
    account_code: 'AC-CASH-01',
    account_name: 'Cash Account (Main Drawer)',
    account_type: 'Assets',
    account_group: 'Cash Account',
    opening_balance: 145000,
    balance_type: 'Dr',
    card_charges: { card_charges: false, for_customer_pct: 0, for_us_pct: 0 },
    area: 'Showroom Counter',
    phone: '9820011223'
  },
  {
    account_code: 'AC-BANK-01',
    account_name: 'HDFC Current Account (A/c 502000123456)',
    account_type: 'Assets',
    account_group: 'Bank Account',
    opening_balance: 850000,
    balance_type: 'Dr',
    card_charges: { card_charges: true, for_customer_pct: 1.5, for_us_pct: 0.5 },
    area: 'Zaveri Bazaar',
    phone: '022-23456789'
  },
  {
    account_code: 'AC-BANK-02',
    account_name: 'State Bank of India (A/c 30981234567)',
    account_type: 'Assets',
    account_group: 'Bank Account',
    opening_balance: 420000,
    balance_type: 'Dr',
    card_charges: { card_charges: true, for_customer_pct: 1.2, for_us_pct: 0.8 },
    area: 'Bullion Branch',
    phone: '022-22446688'
  },
  {
    account_code: 'AC-TAX-CGST',
    account_name: 'CGST 1.5% Output Liability',
    account_type: 'Liabilities',
    account_group: 'CGST1P5',
    opening_balance: 48500,
    balance_type: 'Cr',
    card_charges: { card_charges: false, for_customer_pct: 0, for_us_pct: 0 }
  },
  {
    account_code: 'AC-TAX-SGST',
    account_name: 'SGST 1.5% Output Liability',
    account_type: 'Liabilities',
    account_group: 'Expense Account',
    opening_balance: 48500,
    balance_type: 'Cr',
    card_charges: { card_charges: false, for_customer_pct: 0, for_us_pct: 0 }
  },
  {
    account_code: 'AC-DEBT-01',
    account_name: 'Rajesh Sharma (VIP Patron)',
    account_type: 'Assets',
    account_group: 'Assets Account',
    opening_balance: 185000,
    balance_type: 'Dr',
    card_charges: { card_charges: false, for_customer_pct: 0, for_us_pct: 0 },
    area: 'Bandra West',
    phone: '9820199887'
  },
  {
    account_code: 'AC-DEBT-02',
    account_name: 'Pooja Mehta',
    account_type: 'Assets',
    account_group: 'Assets Account',
    opening_balance: 62000,
    balance_type: 'Dr',
    card_charges: { card_charges: false, for_customer_pct: 0, for_us_pct: 0 },
    area: 'Vile Parle East',
    phone: '9819033445'
  },
  {
    account_code: 'AC-SUPP-01',
    account_name: 'MMTC-PAMP India Bullion Ltd',
    account_type: 'Liabilities',
    account_group: 'Capital Account',
    opening_balance: 1250000,
    balance_type: 'Cr',
    card_charges: { card_charges: false, for_customer_pct: 0, for_us_pct: 0 },
    area: 'BKC Complex',
    phone: '022-67890123'
  },
  {
    account_code: 'AC-KARA-01',
    account_name: 'Soni Govindbhai & Sons (Karagir)',
    account_type: 'Liabilities',
    account_group: 'Expense Account',
    opening_balance: 35000,
    balance_type: 'Cr',
    card_charges: { card_charges: false, for_customer_pct: 0, for_us_pct: 0 },
    area: 'Dadar Jewellery Workshop',
    phone: '9892044556'
  }
];

export const INITIAL_ORDERS: NewOrderBookingRecord[] = [
  {
    id: 'ord-101',
    order_no: 'ORD-2026-084',
    header: {
      customer_n: 'Pooja Mehta',
      address: 'B-402, Lotus Grandeur, Subhash Road, Vile Parle East, Mumbai',
      ph_no: '9819033445',
      remark: 'Bridal Traditional Mangalsutra with Floral pendant and black bead chain',
      area: 'Vile Parle',
      aadhar_no: '5489-3210-9981',
      pan_card: 'ABCPM8941K',
      bill_type: 'Order',
      n5: 'N5-SPL',
      bill_date: '2026-08-20',
      delivery_date: '2026-09-05',
      manual_no: 'BK-4/108',
      state: 'Maharashtra (27)',
      salesman: 'Sanjay Verma',
      gst_not_required: false,
      close_order: false,
      design_photo: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80'
    },
    items: [
      {
        id: 'item-1',
        trans_type: 'Order',
        item_name: '22K Gold Traditional Mangalsutra',
        description: 'Floral Vati design with 2-line black beads and CZ accents',
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
        image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80'
      }
    ],
    payment: {
      left_payment_type: 'UPI Transfer',
      left_amount: 30000,
      left_bank_name: 'HDFC Current Account',
      left_voucher_no: 'UPI-9821033',
      left_cheque_date: '2026-08-20',

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
      other_amt: 500,
      urd_bill_no: 'URD-2026-012',
      bank_amt: 30000,

      amount: 184545,
      bill_discount: 1045,
      total_discount: 1045,
      purchase_amt: 25000,
      cash_final_amount: 20000,
      balance_amount: 114000,
      manual_urd_amt: 25000
    },
    status: 'In Workshop',
    assigned_karagir: 'Soni Govindbhai & Sons',
    karagir_issue_date: '2026-08-22',
    karagir_delivery_date: '2026-09-02',
    design_photo: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    karagir_assignment: {
      karagir_id: 'KARA-01',
      karagir_name: 'Soni Govindbhai & Sons',
      karagir_phone: '9892044556',
      assigned_date: '2026-08-22',
      promised_date: '2026-09-02',
      issued_metal_type: '24K Pure Gold Granules (999)',
      issued_gross_wt: 25.700,
      issued_purity: 99.9,
      issued_fine_wt: 25.674,
      karagir_rate_per_gm: 380,
      agreed_making_charges: 9310,
      wastage_pct: 1.5,
      special_instructions: 'Strict 916 BIS Hallmark stamping. Handcrafted traditional filigree finish. Clean joint soldering.',
      voucher_no: 'ISS-KARA-2026-084',
      status: 'Assigned',
      design_photo: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80'
    },
    created_at: '2026-08-20T11:30:00Z'
  },
  {
    id: 'ord-102',
    order_no: 'ORD-2026-085',
    header: {
      customer_n: 'Rajesh Sharma',
      address: 'Flat 12A, Sea View Apartments, Bandra West, Mumbai',
      ph_no: '9820199887',
      remark: 'Mens Solid 22K Kada with Lion face design',
      area: 'Bandra',
      aadhar_no: '3819-0021-4782',
      pan_card: 'AAAPS4719P',
      bill_type: 'Order',
      n5: 'N5-STD',
      bill_date: '2026-08-25',
      delivery_date: '2026-09-10',
      manual_no: 'BK-4/109',
      state: 'Maharashtra (27)',
      salesman: 'Ramesh Kulkarni',
      gst_not_required: false,
      close_order: false,
      design_photo: 'https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?w=600&auto=format&fit=crop&q=80'
    },
    items: [
      {
        id: 'item-2',
        trans_type: 'Order',
        item_name: '22K Mens Lion Kada',
        description: 'Antique finish solid carved gold kada',
        qty: 1,
        gross_wt: 45.200,
        black_beats: 0,
        stone_wt: 0,
        stone_amt: 0,
        net_wt: 45.200,
        purity: 91.6,
        mkg_per_gm: 380,
        mkg_amt: 17176,
        hallm_charges: 45,
        making_pct: 0,
        item_amt: 333576,
        image_url: 'https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?w=600&auto=format&fit=crop&q=80'
      }
    ],
    payment: {
      left_payment_type: 'Bank Transfer',
      left_amount: 100000,
      left_bank_name: 'HDFC Current Account',
      left_voucher_no: 'NEFT-889921',
      left_cheque_date: '2026-08-25',

      cash_received: 50000,
      cash_payment_type: 'Cash Deposit',
      cash_amount: 50000,
      cash_bank_name: 'Cash Drawer',
      cash_cheque_no: '',
      cash_cheque_date: '',

      gst_pct: 3.0,
      hgst_pct: 1.5,
      mgst_pct: 1.5,
      gst_amt: 10007.28,
      hgst_amt: 5003.64,
      mgst_amt: 5003.64,

      advance_amt: 150000,
      other_amt: 0,
      urd_bill_no: '',
      bank_amt: 100000,

      amount: 333576,
      bill_discount: 1576,
      total_discount: 1576,
      purchase_amt: 0,
      cash_final_amount: 50000,
      balance_amount: 192000,
      manual_urd_amt: 0
    },
    status: 'Booked',
    design_photo: 'https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-08-25T14:45:00Z'
  }
];

export const INITIAL_REFINERY: RefineryRecord[] = [
  {
    id: 'ref-01',
    header: {
      refinery_name: 'Shirpur Gold Refinery & Assayers Ltd',
      remark: 'Monthly scrap melting lot from counter exchange and workshop filings',
      payment_mode: 'Credit',
      invoice_prefix: 'REF',
      manual_no: 'RF-2026-88',
      invoice_date: '2026-08-24',
      invoice_no: 'REF-8841',
      state: 'Maharashtra (27)',
      gst_not_required: false
    },
    items: [
      {
        id: 'ri-1',
        no: 1,
        trans_type: 'Old Gold Scrap',
        item_name: 'Customer Exchange Old 22K Scrap',
        gross_wt: 142.500,
        net_wt: 138.200,
        purity: 88.5,
        fin_wt: 122.307,
        rate: 7250,
        amount: 886725.75,
        refinery_loss: 0.450,
        refinery_profit: 0,
        total_amt: 886725.75,
        making_on_qty: 1500
      },
      {
        id: 'ri-2',
        no: 2,
        trans_type: 'Workshop Filings',
        item_name: 'Polishing Powder & Sweepings',
        gross_wt: 65.000,
        net_wt: 58.400,
        purity: 72.0,
        fin_wt: 42.048,
        rate: 7250,
        amount: 304848.00,
        refinery_loss: 0.620,
        refinery_profit: 0,
        total_amt: 304848.00,
        making_on_qty: 800
      }
    ],
    weight_summary: {
      balance_wgt_grswt: 207.500,
      net_wgt: 196.600,
      fin_wgt: 164.355
    },
    calculation: {
      against_refout_bill_no: 'REFOUT-2026-44',
      by_cash: 25000,
      payment_type: 'Refinery Settlement',
      by_cheque: 1000000,
      bank_name: 'HDFC Current Account',
      cheque_no: 'CHQ-445588',
      cheque_date: '2026-08-24',
      details: 'RTGS Advance against 999.9 Bullion Bar Receipt',
      gst_pct: 3.0,
      hgst_pct: 1.5,
      mgst_pct: 1.5,
      tds_pct: 0.1,
      gst_amt: 35747.21,
      hgst_amt: 17873.61,
      mgst_amt: 17873.61,
      tds_amt: 1191.57,
      purchase_amt: 1191573.75,
      discount: 1573.75,
      sales_amt: 0,
      bill_amount: 1227320.96,
      sub_tax: 35747.21,
      tcs_tax_pct: 0,
      tcs_tax_amt: 0,
      paid_amount: 1025000,
      net_balance: 202320.96
    },
    created_at: '2026-08-24T16:20:00Z'
  }
];

export const INITIAL_PURCHASES: PurchaseRecord[] = [
  {
    id: 'pur-01',
    header: {
      supplier_name: 'MMTC-PAMP India Bullion Ltd',
      remark: 'Stock replenishment for festival season - 22K 916 Casted Bangles',
      payment_mode: 'Credit',
      invoice_prefix: 'PUR',
      manual_no: 'CH-892',
      invoice_date: '2026-08-26',
      invoice_no: 'PUR-2026-104',
      state: 'Maharashtra (27)',
      gst_not_required: false,
      weightwise: true
    },
    items: [
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
        huid: 'B9K2M7'
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
        huid: 'H4L9P1'
      }
    ],
    payment: {
      by_cash: 50000,
      payment_type: 'Wholesale Payment',
      by_cheque: 1200000,
      bank_name: 'HDFC Current Account',
      cheque_no: 'NEFT-MMTC-771',
      cheque_date: '2026-08-26',
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
      net_balance: 372359.73
    },
    created_at: '2026-08-26T10:00:00Z'
  }
];

export const INITIAL_DAYBOOK: DayBookEntry[] = [
  {
    id: 'db-1',
    invoice_type: 'Sales Invoice',
    invoice_no: 'INV-2026-441',
    total_amt: 142500,
    urd_amt: 24000,
    net_amt: 118500,
    cash_received: 35000,
    cash_payment: 0,
    bank_received: 83500,
    bank_payment: 0,
    date: '2026-08-27',
    details: '22K Gold Chain + Ring sale to Suresh Kadam (URD Ring exchange)',
    total_amt_without_disc: 143500
  },
  {
    id: 'db-2',
    invoice_type: 'New Order Advance',
    invoice_no: 'ORD-2026-084',
    total_amt: 50000,
    urd_amt: 25000,
    net_amt: 25000,
    cash_received: 20000,
    cash_payment: 0,
    bank_received: 30000,
    bank_payment: 0,
    date: '2026-08-27',
    details: 'Pooja Mehta Mangalsutra booking advance',
    total_amt_without_disc: 50000
  },
  {
    id: 'db-3',
    invoice_type: 'Purchase Payment',
    invoice_no: 'PUR-2026-104',
    total_amt: 50000,
    urd_amt: 0,
    net_amt: 50000,
    cash_received: 0,
    cash_payment: 50000,
    bank_received: 0,
    bank_payment: 1200000,
    date: '2026-08-27',
    details: 'MMTC-PAMP India wholesale lot payment (Cash + Bank RTGS)',
    total_amt_without_disc: 50000
  },
  {
    id: 'db-4',
    invoice_type: 'Karagir Labor Settlement',
    invoice_no: 'KARA-PAY-19',
    total_amt: 15400,
    urd_amt: 0,
    net_amt: 15400,
    cash_received: 0,
    cash_payment: 15400,
    bank_received: 0,
    bank_payment: 0,
    date: '2026-08-27',
    details: 'Making labor disbursed to Soni Govindbhai for setting jobwork',
    total_amt_without_disc: 15400
  }
];

export const INITIAL_DAYBOOK_SUMMARY: DayBookSummary = {
  total_cash_opening: 145000,
  total_cash_closing: 134600, // 145000 + 35000 + 20000 - 50000 - 15400
  bank_opening: 1270000,
  bank_closing: 183500       // 1270000 + 83500 + 30000 - 1200000
};

export const INITIAL_DEBTORS: SundryDebtorRow[] = [
  {
    sr_no: 1,
    code: 'CUST-001',
    customer_name: 'Rajesh Sharma',
    opening_bal: 185000,
    tot_amt_inc_opening: 518576,
    received_amt: 326576,
    balance: 192000,
    pending_wt: 26.500,
    phone: '9820199887'
  },
  {
    sr_no: 2,
    code: 'CUST-002',
    customer_name: 'Pooja Mehta',
    opening_bal: 62000,
    tot_amt_inc_opening: 246545,
    received_amt: 132545,
    balance: 114000,
    pending_wt: 15.700,
    phone: '9819033445'
  },
  {
    sr_no: 3,
    code: 'CUST-003',
    customer_name: 'Vikram Joshi (Jewellery Designer)',
    opening_bal: 95000,
    tot_amt_inc_opening: 185000,
    received_amt: 110000,
    balance: 75000,
    pending_wt: 10.350,
    phone: '9821455667'
  },
  {
    sr_no: 4,
    code: 'CUST-004',
    customer_name: 'Anita Deshmukh',
    opening_bal: 32000,
    tot_amt_inc_opening: 98000,
    received_amt: 55000,
    balance: 43000,
    pending_wt: 5.920,
    phone: '9890122334'
  }
];

export const INITIAL_STOCK: StockItem[] = [
  {
    id: 'stk-1',
    item_name: '22K 916 Casted Floral Bangle Pair',
    qty: 6,
    gross_wt: 74.400,
    net_wt: 74.400,
    fine_wt: 68.150,
    purity: 91.6,
    category: 'Gold',
    tag_no: 'TAG-GLD-8801',
    is_urd: false,
    rate_per_gm: 7250,
    total_value: 539400
  },
  {
    id: 'stk-2',
    item_name: '22K Royal Peacock Choker Necklace',
    qty: 2,
    gross_wt: 68.200,
    net_wt: 62.800,
    fine_wt: 57.525,
    purity: 91.6,
    category: 'Gold',
    tag_no: 'TAG-GLD-8802',
    is_urd: false,
    rate_per_gm: 7250,
    total_value: 455300
  },
  {
    id: 'stk-3',
    item_name: '24K Fine Pure Bullion Ingot (999.9)',
    qty: 5,
    gross_wt: 50.000,
    net_wt: 50.000,
    fine_wt: 50.000,
    purity: 99.99,
    category: 'Gold',
    tag_no: 'TAG-BAR-001',
    is_urd: false,
    rate_per_gm: 7650,
    total_value: 382500
  },
  {
    id: 'stk-4',
    item_name: '18K Diamond Solitaire Engagement Ring',
    qty: 4,
    gross_wt: 14.800,
    net_wt: 12.600,
    fine_wt: 9.450,
    purity: 75.0,
    category: 'Diamond',
    tag_no: 'TAG-DIA-304',
    is_urd: false,
    rate_per_gm: 5800,
    total_value: 198000
  },
  {
    id: 'stk-5',
    item_name: '92.5 Sterling Silver Antique Payal Pair',
    qty: 10,
    gross_wt: 240.000,
    net_wt: 236.000,
    fine_wt: 218.300,
    purity: 92.5,
    category: 'Silver',
    tag_no: 'TAG-SLV-501',
    is_urd: false,
    rate_per_gm: 86,
    total_value: 20296
  },
  {
    id: 'stk-6',
    item_name: 'Customer Old Gold Scrap Melt Bars (URD)',
    qty: 3,
    gross_wt: 88.500,
    net_wt: 86.200,
    fine_wt: 75.856,
    purity: 88.0,
    category: 'Gold',
    tag_no: 'URD-LOT-11',
    is_urd: true,
    rate_per_gm: 6900,
    total_value: 594780
  }
];

export const INITIAL_LEDGER_DEBIT: DebitLedgerEntry[] = [
  { date: '2026-08-01', particulars: 'Opening Balance b/f', r_no: 'OPN-01', rs: 185000 },
  { date: '2026-08-10', particulars: 'To Sales Tax Invoice (22K Gold Chain)', r_no: 'INV-398', rs: 148500 },
  { date: '2026-08-25', particulars: 'To New Order Booking (Mens Kada)', r_no: 'ORD-085', rs: 185076 }
];

export const INITIAL_LEDGER_CREDIT: CreditLedgerEntry[] = [
  { date: '2026-08-12', particulars: 'By Bank NEFT Received (HDFC)', v_no: 'REC-240', rs: 140000 },
  { date: '2026-08-25', particulars: 'By Order Advance Cash Token', v_no: 'REC-288', rs: 50000 },
  { date: '2026-08-25', particulars: 'By Order Advance Bank Transfer', v_no: 'REC-289', rs: 100000 },
  { date: '2026-08-25', particulars: 'By Showroom Special Discount', v_no: 'DSC-104', rs: 36576 },
  { date: '2026-08-27', particulars: 'Closing Debit Balance c/f', v_no: 'BAL-CF', rs: 192000 }
];

export const INITIAL_BACKUP_STATUS: BackupStatusInfo[] = [
  {
    media: 'Default Location',
    last_backup: 'Today, 05:30 PM',
    backup_status: 'Success',
    backup_size: '48.2 MB',
    backup_date: '2026-08-27 17:30:00',
    auto_cloud_sync: true
  },
  {
    media: 'USB Drive',
    last_backup: 'Yesterday, 08:45 PM',
    backup_status: 'Success',
    backup_size: '47.9 MB',
    backup_date: '2026-08-26 20:45:00',
    auto_cloud_sync: false
  },
  {
    media: 'Google Drive',
    last_backup: 'Today, 05:00 AM',
    backup_status: 'Success',
    backup_size: '48.1 MB',
    backup_date: '2026-08-27 05:00:00',
    auto_cloud_sync: true
  },
  {
    media: 'HDD',
    last_backup: '25-Aug-2026, 09:15 PM',
    backup_status: 'Success',
    backup_size: '47.5 MB',
    backup_date: '2026-08-25 21:15:00',
    auto_cloud_sync: false
  }
];
