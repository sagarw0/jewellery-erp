// Master Field Dictionary & Database Mapping
// Mandated by Specification Sections 40, 41, 48, 49
import { FieldDictionaryEntry } from '../types/erp';

export const MASTER_FIELD_DICTIONARY: FieldDictionaryEntry[] = [
  // -------------------------------------------------------------------------
  // ACCOUNT MASTER
  // -------------------------------------------------------------------------
  {
    screen: 'Account Master',
    ui_label: 'Account Code',
    database_field: 'account_code',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Unique primary ledger identifier (e.g. AC001, CUST102).'
  },
  {
    screen: 'Account Master',
    ui_label: 'Account Name',
    database_field: 'account_name',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Legal or trade name of customer, supplier, bank, or expense ledger.'
  },
  {
    screen: 'Account Master',
    ui_label: 'Account Type',
    database_field: 'account_type',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'High-level financial classification: Assets, Liabilities, Income, Expense.'
  },
  {
    screen: 'Account Master',
    ui_label: 'Account Group',
    database_field: 'account_group',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Specific accounting head (e.g., Bank Charges, Cash Account, CGST1P5, Given Loan).'
  },
  {
    screen: 'Account Master',
    ui_label: 'Opening Balance',
    database_field: 'opening_balance',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Initial ledger balance at the beginning of the financial year (Dr/Cr).'
  },
  {
    screen: 'Account Master',
    ui_label: 'Card Charges',
    database_field: 'card_charges',
    type: 'Boolean',
    mandatory: false,
    calculation: false,
    business_meaning: 'Toggles whether POS card swipe surcharges apply to this account.'
  },
  {
    screen: 'Account Master',
    ui_label: 'For Customer in %',
    database_field: 'for_customer_pct',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Credit/Debit card transaction surcharge borne by the customer (e.g. 1.5%).'
  },
  {
    screen: 'Account Master',
    ui_label: 'For Us in %',
    database_field: 'for_us_pct',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Merchant discount rate (MDR) absorbed by the jewellery showroom.'
  },

  // -------------------------------------------------------------------------
  // NEW ORDER BOOKING - HEADER
  // -------------------------------------------------------------------------
  {
    screen: 'New Order Booking',
    ui_label: 'Customer N',
    database_field: 'customer_name',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Name of the ordering customer or business client.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Address',
    database_field: 'address',
    type: 'String',
    mandatory: false,
    calculation: false,
    business_meaning: 'Street address for billing, dispatch, and KYC compliance.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Ph.No',
    database_field: 'phone_no',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Primary contact phone / mobile number for SMS and WhatsApp messaging.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Remark',
    database_field: 'remark',
    type: 'String',
    mandatory: false,
    calculation: false,
    business_meaning: 'Customer instructions, design references, or special engraving notes.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Area',
    database_field: 'area',
    type: 'String',
    mandatory: false,
    calculation: false,
    business_meaning: 'Geographic locality or zone used for regional sales analysis.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Aadhar No',
    database_field: 'aadhar_no',
    type: 'String',
    mandatory: false,
    calculation: false,
    business_meaning: '12-digit Indian national identity for statutory bullion KYC compliance.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Pan Card',
    database_field: 'pan_card',
    type: 'String',
    mandatory: false,
    calculation: false,
    business_meaning: 'Permanent Account Number, mandatory under IT Act for cash transactions above ₹2,00,000.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Bill Type',
    database_field: 'bill_type',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Voucher series: Tax Invoice, Estimate Slip, Karagir Job Order.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'N5',
    database_field: 'n5_code',
    type: 'String',
    mandatory: false,
    calculation: false,
    business_meaning: 'Legacy custom order classification / department tracking flag.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Bill Date',
    database_field: 'bill_date',
    type: 'Date',
    mandatory: true,
    calculation: false,
    business_meaning: 'Booking creation date.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Delivery Date',
    database_field: 'delivery_date',
    type: 'Date',
    mandatory: true,
    calculation: false,
    business_meaning: 'Committed delivery date promised to customer.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Manual No',
    database_field: 'manual_no',
    type: 'String',
    mandatory: false,
    calculation: false,
    business_meaning: 'Paper order pad reference number for physical record auditing.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'State',
    database_field: 'state',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Place of supply state determining CGST+SGST vs IGST taxation.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Salesman',
    database_field: 'salesman',
    type: 'String',
    mandatory: false,
    calculation: false,
    business_meaning: 'Showroom staff / sales executive credited with the booking.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'GST Not Required',
    database_field: 'gst_not_required',
    type: 'Boolean',
    mandatory: false,
    calculation: false,
    business_meaning: 'Exempts the order from standard GST calculation (e.g. non-taxable estimate).'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Close Order',
    database_field: 'close_order',
    type: 'Boolean',
    mandatory: false,
    calculation: false,
    business_meaning: 'Flags the order as fulfilled or settled.'
  },

  // -------------------------------------------------------------------------
  // NEW ORDER BOOKING - ITEM GRID
  // -------------------------------------------------------------------------
  {
    screen: 'New Order Booking',
    ui_label: 'TransType',
    database_field: 'trans_type',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Line transaction type: Fresh Order, Repair, Modification, Jobwork.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Item Name',
    database_field: 'item_name',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Ornament description (e.g. Gold Necklace, Mangalsutra, Solitaire Ring).'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Description',
    database_field: 'description',
    type: 'String',
    mandatory: false,
    calculation: false,
    business_meaning: 'Specific design motifs, lock type, size, length, or finish details.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'QTY',
    database_field: 'qty',
    type: 'Integer',
    mandatory: true,
    calculation: false,
    business_meaning: 'Number of units / pairs.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'GrossWt',
    database_field: 'gross_weight',
    type: 'Decimal',
    mandatory: true,
    calculation: false,
    business_meaning: 'Total physical weight in grams as weighed on certified digital balance.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Black.Beats',
    database_field: 'black_beads_weight',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Weight of black beads (motis) in Mangalsutra deducted from Gross Weight.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'StoneWt',
    database_field: 'stone_weight',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Total weight of studded cubic zirconia, rubies, pearls, or gems.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'StoneAmt',
    database_field: 'stone_amount',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Monetary cost of all studded gemstones.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'NetWt',
    database_field: 'net_weight',
    type: 'Decimal',
    mandatory: true,
    calculation: true,
    formula_or_rule: 'GrossWt - Black.Beats - StoneWt',
    business_meaning: 'Net precious metal weight after deducting beads and stones.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Purity',
    database_field: 'purity',
    type: 'Decimal',
    mandatory: true,
    calculation: false,
    business_meaning: 'Gold touch / purity percentage (e.g. 91.6 for 22K, 75.0 for 18K).'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Mkg/Gm',
    database_field: 'making_per_gram',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Labour charges per gram of Net Weight.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'MkgAmt',
    database_field: 'making_amount',
    type: 'Decimal',
    mandatory: false,
    calculation: true,
    formula_or_rule: '(Mkg/Gm * NetWt) + (MetalAmt * Making% / 100)',
    business_meaning: 'Total making labour charges.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'HallM.Charges',
    database_field: 'hallmark_charges',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Statutory BIS Hallmarking inspection fee per piece (e.g. ₹45).'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Making%',
    database_field: 'making_pct',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Making charges expressed as a percentage of bullion metal value.'
  },

  // -------------------------------------------------------------------------
  // NEW ORDER BOOKING - PAYMENT & AMOUNTS
  // -------------------------------------------------------------------------
  {
    screen: 'New Order Booking',
    ui_label: 'Advance Amt',
    database_field: 'advance_amount',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Initial token deposit paid by customer at booking.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Other Amt',
    database_field: 'other_amount',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Incidental charges (box, certification, insurance, courier).'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'URD BillNo',
    database_field: 'urd_bill_no',
    type: 'String',
    mandatory: false,
    calculation: false,
    business_meaning: 'Voucher number of Unregistered Dealer / Old Gold exchange trade-in.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Bank Amt',
    database_field: 'bank_amount',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Amount received via NEFT / RTGS / UPI / Card swipe.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Bill Discount',
    database_field: 'bill_discount',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Showroom promotional concession or roundoff discount.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Total Discount',
    database_field: 'total_discount',
    type: 'Decimal',
    mandatory: false,
    calculation: true,
    formula_or_rule: 'Item discounts + Bill Discount',
    business_meaning: 'Aggregate price reduction given to the buyer.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Purchase Amt.',
    database_field: 'purchase_amt',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Credit value assigned to customer old gold traded in for this order.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Cash Amount',
    database_field: 'cash_amount',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Physical cash currency paid at counter.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Balance Amount',
    database_field: 'balance_amount',
    type: 'Decimal',
    mandatory: true,
    calculation: true,
    formula_or_rule: 'Total Amount + GST - Discount - Advance - OldGold - Cash - Bank',
    business_meaning: 'Unpaid remaining balance owed by customer upon delivery.'
  },
  {
    screen: 'New Order Booking',
    ui_label: 'Manual URD Amt',
    database_field: 'manual_urd_amt',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Manually overridden valuation for old gold exchange.'
  },

  // -------------------------------------------------------------------------
  // REFINERY IN
  // -------------------------------------------------------------------------
  {
    screen: 'Refinery In',
    ui_label: 'Refinery Name',
    database_field: 'refinery_name',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Name of the refining firm or assayer (e.g. Shirpur Gold Refinery).'
  },
  {
    screen: 'Refinery In',
    ui_label: 'FinWt',
    database_field: 'fine_weight',
    type: 'Decimal',
    mandatory: true,
    calculation: true,
    formula_or_rule: '(NetWt * Purity) / 100',
    business_meaning: 'Theoretical pure 999.9 gold contained in the scrap batch.'
  },
  {
    screen: 'Refinery In',
    ui_label: 'RefineryLoss',
    database_field: 'refinery_loss',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Melting and chemical assay loss grams deducted by refinery.'
  },
  {
    screen: 'Refinery In',
    ui_label: 'RefineryProfit',
    database_field: 'refinery_profit',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Fine weight recovery surplus exceeding estimated touch.'
  },
  {
    screen: 'Refinery In',
    ui_label: 'Making On Qty',
    database_field: 'making_on_qty',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Refiner ingot minting / conversion charges per piece or bar.'
  },
  {
    screen: 'Refinery In',
    ui_label: 'Balance Wgt - GrsWt -',
    database_field: 'balance_wgt_grswt',
    type: 'Decimal',
    mandatory: false,
    calculation: true,
    business_meaning: 'Running gross scrap balance remaining with assayer.'
  },
  {
    screen: 'Refinery In',
    ui_label: 'NetWgt -',
    database_field: 'net_wgt_summary',
    type: 'Decimal',
    mandatory: false,
    calculation: true,
    business_meaning: 'Running net scrap balance remaining with assayer.'
  },
  {
    screen: 'Refinery In',
    ui_label: 'FinWgt -',
    database_field: 'fin_wgt_summary',
    type: 'Decimal',
    mandatory: false,
    calculation: true,
    business_meaning: 'Running fine pure bullion balance held at refinery.'
  },

  // -------------------------------------------------------------------------
  // PURCHASE INVOICE
  // -------------------------------------------------------------------------
  {
    screen: 'Purchase Invoice',
    ui_label: 'Supplier Name',
    database_field: 'supplier_name',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Bullion dealer, wholesaler, or manufacturer.'
  },
  {
    screen: 'Purchase Invoice',
    ui_label: 'Black.B',
    database_field: 'black_beads_weight',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Black beads weight deducted from wholesale lot.'
  },
  {
    screen: 'Purchase Invoice',
    ui_label: 'Wastage%',
    database_field: 'wastage_pct',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Manufacturer manufacturing loss percentage added to pure metal cost.'
  },
  {
    screen: 'Purchase Invoice',
    ui_label: 'Fin+Wastage',
    database_field: 'fine_plus_wastage',
    type: 'Decimal',
    mandatory: true,
    calculation: true,
    formula_or_rule: 'FinWt + (NetWt * Wastage% / 100)',
    business_meaning: 'Total fine gold payable to manufacturer including wastage allowance.'
  },
  {
    screen: 'Purchase Invoice',
    ui_label: 'HUID',
    database_field: 'huid',
    type: 'String',
    mandatory: false,
    calculation: false,
    business_meaning: 'Government BIS 6-digit alphanumeric Hallmark Unique ID laser-engraved on item.'
  },
  {
    screen: 'Purchase Invoice',
    ui_label: 'Weightwise',
    database_field: 'weightwise_billing',
    type: 'Boolean',
    mandatory: false,
    calculation: false,
    business_meaning: 'Toggles billing based on fine weight metal ledger rather than currency.'
  },

  // -------------------------------------------------------------------------
  // DAY BOOK
  // -------------------------------------------------------------------------
  {
    screen: 'Day Book',
    ui_label: 'InvoiceType',
    database_field: 'invoice_type',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Transaction category: Retail Sale, Wholesale Purchase, URD, Journal, Receipt.'
  },
  {
    screen: 'Day Book',
    ui_label: 'Invoice.No',
    database_field: 'invoice_no',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Serial voucher identifier.'
  },
  {
    screen: 'Day Book',
    ui_label: 'Total.Amt',
    database_field: 'total_amt',
    type: 'Decimal',
    mandatory: true,
    calculation: false,
    business_meaning: 'Gross transaction value before discounts.'
  },
  {
    screen: 'Day Book',
    ui_label: 'URD.Amt',
    database_field: 'urd_amt',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Old gold purchase / exchange trade value credited in bill.'
  },
  {
    screen: 'Day Book',
    ui_label: 'Net.Amt',
    database_field: 'net_amt',
    type: 'Decimal',
    mandatory: true,
    calculation: true,
    business_meaning: 'Net payable/receivable after trade-in and discounts.'
  },
  {
    screen: 'Day Book',
    ui_label: 'Cash.Received',
    database_field: 'cash_received',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Physical cash received into cash drawer.'
  },
  {
    screen: 'Day Book',
    ui_label: 'Cash.Payment',
    database_field: 'cash_payment',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Cash disbursed from cash drawer.'
  },
  {
    screen: 'Day Book',
    ui_label: 'Bank.Received',
    database_field: 'bank_received',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Bank transfers / UPI / POS card inflow.'
  },
  {
    screen: 'Day Book',
    ui_label: 'Bank.Payment',
    database_field: 'bank_payment',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'RTGS / Cheque outflow from bank accounts.'
  },
  {
    screen: 'Day Book',
    ui_label: 'Total Amt without Disc',
    database_field: 'total_amt_without_disc',
    type: 'Decimal',
    mandatory: true,
    calculation: true,
    business_meaning: 'Gross total prior to subtracting customer discounts.'
  },
  {
    screen: 'Day Book',
    ui_label: 'Total Cash Opening',
    database_field: 'total_cash_opening',
    type: 'Decimal',
    mandatory: true,
    calculation: false,
    business_meaning: 'Physical cash balance in showroom vault at start of trading day.'
  },
  {
    screen: 'Day Book',
    ui_label: 'Total Cash Closing',
    database_field: 'total_cash_closing',
    type: 'Decimal',
    mandatory: true,
    calculation: true,
    formula_or_rule: 'Cash Opening + Cash Received - Cash Payment',
    business_meaning: 'Physical cash balance in showroom vault at close of trading day.'
  },

  // -------------------------------------------------------------------------
  // BOOK DISPLAY (SUNDRY DEBTORS)
  // -------------------------------------------------------------------------
  {
    screen: 'Book Display',
    ui_label: 'Opening Bal.',
    database_field: 'opening_balance',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Debtor ledger balance carried forward from previous period.'
  },
  {
    screen: 'Book Display',
    ui_label: 'Tot. Amt. Inc. Opening',
    database_field: 'tot_amt_inc_opening',
    type: 'Decimal',
    mandatory: true,
    calculation: true,
    formula_or_rule: 'Opening Bal + Current Period Sales',
    business_meaning: 'Total cumulative debt accrued including opening balance.'
  },
  {
    screen: 'Book Display',
    ui_label: 'Received Amt.',
    database_field: 'received_amt',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Total payments cleared by customer during period.'
  },
  {
    screen: 'Book Display',
    ui_label: 'Pending WT',
    database_field: 'pending_weight',
    type: 'Decimal',
    mandatory: false,
    calculation: false,
    business_meaning: 'Bullion gold/silver weight owed in kind by debtor instead of currency.'
  },

  // -------------------------------------------------------------------------
  // STOCK REPORT
  // -------------------------------------------------------------------------
  {
    screen: 'Stock Report',
    ui_label: 'Select Type',
    database_field: 'metal_type_filter',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Commodity filter: Gold, Silver, Platinum, Diamond.'
  },
  {
    screen: 'Stock Report',
    ui_label: 'Don\'t Show URD Item',
    database_field: 'dont_show_urd_item',
    type: 'Boolean',
    mandatory: false,
    calculation: false,
    business_meaning: 'Filters out un-melted scrap customer exchange stock from showroom inventory.'
  },
  {
    screen: 'Stock Report',
    ui_label: 'Per',
    database_field: 'valuation_unit',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Unit of quantity: Gram, Carat, Piece.'
  },
  {
    screen: 'Stock Report',
    ui_label: 'Value',
    database_field: 'valuation_rate_type',
    type: 'String',
    mandatory: true,
    calculation: false,
    business_meaning: 'Valuation method: Cost Rate, Tag Rate, Live Market Bullion Rate.'
  }
];
