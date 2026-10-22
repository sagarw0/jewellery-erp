# SWARNA JEWELLERY ERP — COMPLETE FUNCTIONAL & ARCHITECTURAL BLUEPRINT
**Document Version:** 2.0.0  
**Classification:** Enterprise Engineering Specification (UI-Agnostic)  
**Scope:** Complete functional workflows, state models, business calculations, data dictionaries, validation rules, relational schemas, and screen-by-screen operations. Zero details omitted.

---

## TABLE OF CONTENTS
1. [EXECUTIVE DOMAIN ARCHITECTURE](#1-executive-domain-architecture)
   - 1.1 Multi-Branch & Multi-Tenant Model
   - 1.2 Role-Based Access Control (RBAC) Matrix
   - 1.3 Jewellery Domain Units & Precision Standards
   - 1.4 Dual-Ledger Principle (Financial Currency + Pure Metal Fine Weight)
2. [MATHEMATICAL & BUSINESS CALCULATION ENGINES](#2-mathematical--business-calculation-engines)
   - 2.1 Net Weight Engine
   - 2.2 Fine Bullion Weight Engine
   - 2.3 Wastage & Fine+Wastage Allowance
   - 2.4 Making Charges Engine (Per Gram vs Percentage of Value)
   - 2.5 Line Item Total & Hallmarking (HUID) Fees
   - 2.6 Indian GST & Statutory Tax Split (CGST/SGST/TDS/TCS)
   - 2.7 Old Gold (URD) Valuation, Touch Deduction & Exchange Netting
   - 2.8 Refinery Inward Yield, Melting Loss/Profit & Assayed vs Recovered Fine
   - 2.9 Multi-Karat Real-Time Bullion Pricing Engine
   - 2.10 Inventory Valuation Engine (Market Spot, Acquisition Cost, WAC)
3. [EXHAUSTIVE SCREEN-BY-SCREEN FUNCTIONAL SPECIFICATIONS](#3-exhaustive-screen-by-screen-functional-specifications)
   - 3.1 Authentication & Staff Session Management
   - 3.2 Executive Dashboard & Bullion Analytics Hub
   - 3.3 Account Master (Chart of Accounts & POS Surcharges)
   - 3.4 Vendor / Supplier Master Management
   - 3.5 Karagir / Artisan Master Management
   - 3.6 Item Creation Master & Batch-to-Piece Division
   - 3.7 Barcode Tagging Studio & Thermal Print Spooler
   - 3.8 New Order Booking (7 Sub-Modules)
     - 3.8.1 Order Booking & Advance Ledger
     - 3.8.2 Submit Order to Karagir
     - 3.8.3 Issue Raw Material to Karagir
     - 3.8.4 Receive Order & Metal Return from Karagir
     - 3.8.5 Convert Order to Final Sales Invoice
     - 3.8.6 Order Status Register & Delivery Tracking
     - 3.8.7 Customer Advance Management
   - 3.9 Counter POS & Sales Invoicing
   - 3.10 Purchase Invoicing & Inward Consignments (7 Sub-Modules)
     - 3.10.1 Supplier Profile Verification
     - 3.10.2 Purchase Bill Entry
     - 3.10.3 Payment & Tax Settlement
     - 3.10.4 Supplier Ledger Statement
     - 3.10.5 Account-Cum-Stock Dual Statement
     - 3.10.6 Purchase Approval Consignment
     - 3.10.7 Stock-Cash (Vadhgat) Metal Debt Settlement
   - 3.11 Refinery Inward & Scrap Processing (5 Sub-Modules)
     - 3.11.1 Refinery Record Setup
     - 3.11.2 Material Inward Lines & Assay Yield
     - 3.11.3 Refinery Outward Tracking
     - 3.11.4 Account-Cum-Stock Refinery Reconciliation
     - 3.11.5 Weight Reconciliation Summary
   - 3.12 Day Book & 12-Column EOD Audit Register
   - 3.13 Book Display (9 Financial & Debtor Registers)
   - 3.14 Account Display (Double-Entry Statement)
   - 3.15 Stock Inventory Report & Valuation Register
   - 3.16 Stock Refill & Automated Replenishment Manager
   - 3.17 Swarna Nidhi (Monthly Gold Savings / Bhishi Scheme)
   - 3.18 Showroom Messenger & WhatsApp Notification Engine
   - 3.19 Backup & Disaster Recovery Manager
   - 3.20 Field Dictionary & Data Mapping
   - 3.21 System Settings & Showroom Profile
   - 3.22 AI Copilot & Semantic Tool Calling Engine
4. [COMPLETE RELATIONAL DATABASE SCHEMA (POSTGRESQL / SUPABASE DDL)](#4-complete-relational-database-schema)
5. [INTEGRATION, HARDWARE & API SPECIFICATIONS](#5-integration-hardware--api-specifications)
   - 5.1 Weighing Scale RS232/USB Serial Protocol
   - 5.2 Barcode/RFID Scanner Emulation
   - 5.3 Thermal Label Printer Protocols (TSPL / ZPL / ESC-POS)
   - 5.4 WhatsApp Business Cloud API & Web Dispatch
   - 5.5 Bullion Spot Rate Poller & IBJA/MCX Integration

---

## 1. EXECUTIVE DOMAIN ARCHITECTURE

### 1.1 Multi-Branch & Multi-Tenant Model
The application operates in a hierarchical multi-branch environment:
- **Consolidated Node (`all`)**: Executive consolidated view that aggregates stock, financials, receivables, and transactions across all branches without cross-polluting physical inventory.
- **Branch Nodes (`mumbai`, `pune`, `thane`, `workshop_unit`)**:
  - Each branch maintains an independent physical stock vault, daily cash drawers, bank account allocations, and staff shifts.
  - Every transaction (Sale, Purchase, Order, Voucher) carries an immutable `branch_id`.
  - Stock transfers between branches require an Outward Challan at the originating branch and an Inward Verification Challan at the receiving branch.

### 1.2 Role-Based Access Control (RBAC) Matrix
Permissions determine access to API endpoints, database operations, and system views:

| Module / View | Owner | Manager | Cashier | Accountant | Karagir |
|---|:---:|:---:|:---:|:---:|:---:|
| **Executive Dashboard & Valuation Simulator** | Full | Full | Read-Only | Read-Only | Denied |
| **Account Master** | Full | Full | Denied | Full | Denied |
| **Vendor / Supplier Master** | Full | Full | Denied | Read-Only | Denied |
| **Karagir / Artisan Master** | Full | Full | Denied | Read-Only | Read-Only (Self) |
| **Item Creation & Master Stock** | Full | Full | Denied | Denied | Denied |
| **Barcode Studio & Label Spooler** | Full | Full | Read/Print | Denied | Read/Print |
| **New Order Booking** | Full | Full | Create/View | Create/View | Read (Assigned) |
| **Sales Invoicing & POS Billing** | Full | Full | Full | Full | Denied |
| **Purchase Invoicing** | Full | Full | Denied | Create/View | Denied |
| **Refinery Inward / Outward** | Full | Full | Denied | Create/View | Denied |
| **Day Book & Cashflow** | Full | Full | View Counter | Full | Denied |
| **Book Display (9 Registers & Debtors)**| Full | Full | Denied | Full | Denied |
| **Stock Inventory Report** | Full | Full | View Tags | Full | Denied |
| **Stock Refill Hub** | Full | Full | Denied | Denied | Read (Orders) |
| **Gold Scheme (Swarna Nidhi)** | Full | Full | Payments | Full | Denied |
| **Showroom Messenger (WhatsApp)** | Full | Full | Customer Only | Denied | Denied |
| **Backup & Cloud Sync** | Full | Denied | Denied | Denied | Denied |
| **Staff & User Role Management** | Full | Denied | Denied | Denied | Denied |
| **Field Dictionary & System Config** | Full | Denied | Denied | Denied | Denied |

### 1.3 Jewellery Domain Units & Precision Standards
- **Weights**:
  - Gold, Silver, Platinum, Raw Metals: Stored in **Grams (`g`)** with **3 decimal places** of precision (milligram accuracy, e.g., `12.345 g`).
  - Diamonds & Precious Gems: Stored in **Carats (`cts`)** with **2 decimal places** (`1 ct = 0.200 g`).
  - Pearls / Beads: Stored in **Carats** or **Grams**.
- **Financial Currencies**:
  - Stored in **INR (₹)** with **2 decimal places** (`0.01` paisa resolution).
  - All intermediary multipliers maintain IEEE 754 double precision and are explicitly rounded to 2 decimal places using Banker's Rounding or standard arithmetic rounding with epsilon protection: `Math.round((val + Number.EPSILON) * 100) / 100`.
- **Purity / Fineness**:
  - Expressed as percentage (`%`) to **2 decimal places** (e.g., `91.60%` for 22K, `75.00%` for 18K, `99.90%` for 24K, `92.50%` for Sterling Silver).
  - Or Karat format: `24K`, `22K`, `18K`, `14K`, `9K`.
- **Hallmark Identifiers**:
  - BIS HUID: Exactly **6-character alphanumeric string** (e.g., `AB1234`), validated against regex `^[A-Z0-9]{6}$`.

### 1.4 Dual-Ledger Principle (Financial Currency + Pure Metal Fine Weight)
In the bullion and jewellery industry, accounts with suppliers, refineries, and artisans are maintained across **two concurrent ledgers**:
1. **Cash / Financial Ledger**: Monetary credits and debits (`₹ Dr` / `₹ Cr`).
2. **Metal Ledger**: Pure bullion weight (`Fine Grams Dr` / `Fine Grams Cr`).
   - A supplier can be owed `₹1,50,000` in labor/making charges AND `150.250 g` of 24K pure gold.
   - Payments can be settled either by currency wire (RTGS/NEFT/Cash) or by physical bullion bar delivery (Vadhgat settlement).

---

## 2. MATHEMATICAL & BUSINESS CALCULATION ENGINES

### 2.1 Net Weight Engine
The net weight represents the chargeable precious metal content after subtracting non-metallic additions:
> **WORKING ENGLISH FORMULA:**  
> **Net Weight (g) = Maximum of [ 0, Gross Weight − Black Beads Weight − Stone Weight − Bag Weight ]**
- **Inputs**:
  - `gross_wt` (Decimal, 3 decimals, mandatory)
  - `black_beats` (Decimal, 3 decimals, optional, default 0) — used specifically for Mangalsutras
  - `stone_wt` (Decimal, 3 decimals, optional, default 0) — cz, semi-precious, synthetic stones
  - `bag_wt` (Decimal, 3 decimals, optional, default 0) — packaging or tag wire deduction
- **Output**: `net_wt` (Decimal, 3 decimals)
- **Constraint**: Must be less than or equal to Gross Weight. If negative, triggers validation error: `ERR_INVALID_NET_WEIGHT`.

### 2.2 Fine Bullion Weight Engine
The pure 24K equivalent weight contained within an alloyed piece:
> **WORKING ENGLISH FORMULA:**  
> **Fine Bullion Weight (g) = (Net Weight × Purity Percentage) ÷ 100**
- **Inputs**:
  - `net_wt` (Decimal, 3 decimals)
  - `purity` (Decimal, 2 decimals, e.g. 91.60)
- **Output**: `fine_wt` (Decimal, 3 decimals)

### 2.3 Wastage & Fine+Wastage Allowance
Artisans and manufacturers incur metal loss during casting, filing, soldering, and polishing. In wholesale purchasing, wastage is credited to the supplier:
> **WORKING ENGLISH FORMULAS:**  
> **1. Wastage Allowance (g) = (Net Weight × Wastage Percentage) ÷ 100**  
> **2. Fine + Wastage Metal Total (g) = Fine Bullion Weight + Wastage Allowance**
- **Inputs**:
  - `net_wt`, `purity`, `wastage_pct`
- **Output**: `fin_plus_wastage` (Decimal, 3 decimals)
- **Usage**: Used to debit the showroom's metal ledger when purchasing from manufacturers.

### 2.4 Making Charges Engine (Per Gram vs Percentage of Value)
Making charges represent the fabrication fee. The system supports three computational modes:
1. **Per Gram Basis**:
   > **Per-Gram Making Charge = Net Weight × Making Rate per Gram**
2. **Percentage of Metal Value**:
   > **Percentage Making Charge:**  
> • Metal Value = Net Weight × Gold Rate per Gram  
> • Making Amount = (Metal Value × Making Percentage) ÷ 100
3. **Hybrid Mode**:
   > **Hybrid Making Charge = (Net Weight × Making Rate per Gram) + ((Metal Value × Making Percentage) ÷ 100)**
- **Output**: `mkg_amt` (Decimal, 2 decimals)

### 2.5 Line Item Total & Hallmarking (HUID) Fees
> **WORKING ENGLISH FORMULA:**  
> **Line Item Total Amount = (Net Weight × Gold Rate) + Stone Amount + Making Amount + Hallmark (HUID) Fee**
- **Inputs**:
  - `net_wt` (Decimal, 3 decimals)
  - `rate` (Decimal, 2 decimals)
  - `stone_amt` (Decimal, 2 decimals)
  - `mkg_amt` (Decimal, 2 decimals)
  - `hallmark_charges` (Decimal, 2 decimals, standard ₹45 per BIS HUID article)
- **Output**: `item_amt` / `total_amt` (Decimal, 2 decimals)

### 2.6 Indian GST & Statutory Tax Split (CGST/SGST/TDS/TCS)
- **Standard Jewellery GST Rate**: 3.00%
  - **Intra-State Transaction** (Showroom State = Customer/Vendor State):
    - **CGST (Central GST / MGST)** = 1.50%
    - **SGST (State GST / HGST)** = 1.50%
  - **Inter-State Transaction** (Showroom State ≠ Customer/Vendor State):
    - **IGST (Integrated GST)** = 3.00%
- **Income Tax TDS (Section 194Q)**: 0.10% on purchases exceeding ₹50 Lakhs.
- **Income Tax TCS (Section 206C(1H))**: 0.10% (or 0.075%) on sales receipts exceeding ₹50 Lakhs in a financial year.
- **Formulas**:
  > **WORKING ENGLISH FORMULAS (STATUTORY TAX SPLIT):**  
> • **CGST (1.5%)** = (Taxable Subtotal × 1.5) ÷ 100  
> • **SGST (1.5%)** = (Taxable Subtotal × 1.5) ÷ 100  
> • **Total GST (3.0%)** = CGST Amount + SGST Amount  
> • **TDS (0.1% under Section 194Q)** = (Taxable Subtotal × TDS %) ÷ 100  
> • **TCS (0.1% under Section 206C)** = ((Taxable Subtotal + Total GST) × TCS %) ÷ 100  
> • **Final Bill Grand Total** = Taxable Subtotal + Total GST + TCS Amount − Discount

### 2.7 Old Gold (URD) Valuation, Touch Deduction & Exchange Netting
When a customer trades in old jewellery (Unregistered Dealer / URD purchase):
> **WORKING ENGLISH FORMULAS (OLD GOLD URD EXCHANGE):**  
> • **Old Gold Net Weight** = Gross Weight − Dust / Stone / Enamel Loss  
> • **Assayed Fine Pure Weight** = (Old Gold Net Weight × Tested Touch Purity %) ÷ 100  
> • **Old Gold Valuation Credit** = Assayed Fine Pure Weight × Current 24K Bullion Buyback Rate  
> • **Net Balance Payable by Customer** = New Jewellery Invoice Total − Old Gold Valuation Credit − Advance Payments

### 2.8 Refinery Inward Yield, Melting Loss/Profit & Assayed vs Recovered Fine
When scrap lots are sent to a refinery:
> **WORKING ENGLISH FORMULAS (REFINERY YIELD):**  
> • **Theoretical Fine Gold** = (Inward Net Weight × Assayed Touch Purity %) ÷ 100  
> • **Variance** = Actual Pure 24K Bar Recovered from Refiner − Theoretical Fine Gold
- If Variance is negative (less than 0):
  > • **Refinery Melting Loss** = Absolute Value of Variance (Refinery Profit = 0)
- If Variance is positive (greater than 0):
  > • **Refinery Yield Profit** = Variance (Refinery Melting Loss = 0)
> • **Refining Melting Fee (₹)** = Gross Weight Melted × Refiner Fee per Gram

### 2.9 Multi-Karat Real-Time Bullion Pricing Engine
From the baseline 24K Gold Spot Rate and Silver 999 Rate:
- **Gold 24K (999.0)**: Base 24K Spot Rate + Showroom Markup
- **Gold 22K (916.0)**: Gold 24K Rate × 0.916
- **Gold 18K (750.0)**: Gold 24K Rate × 0.750
- **Gold 14K (585.0)**: Gold 24K Rate × 0.585
- **Gold 24K Tola (10g)**: Gold 24K Rate × 10
- **Gold 22K Tola (10g)**: Gold 22K Rate × 10
- **Silver 999 (Pure)**: Base Silver Spot Rate + Showroom Markup
- **Silver 925 (Sterling)**: Silver 999 Rate × 0.925
- **Silver Bar (1 Kg)**: Silver 999 Rate × 1,000

### 2.10 Inventory Valuation Engine
The system supports three dynamic inventory valuation models for the stock vault:
1. **Market Spot Valuation**:
   > **Market Spot Valuation = Sum of all (Item Fine Weight × Live 24K Spot Rate)**
2. **Acquisition Cost Valuation**:
   > **Acquisition Cost Valuation = Sum of all (Item Inward Purchase Cost)**
3. **Weighted Average Cost (WAC)**:
   > **Weighted Average Cost (WAC) Rate = (Total Value of Current Stock + Inward Lot Value) ÷ Total Fine Weight in Vault**

---

## 3. EXHAUSTIVE SCREEN-BY-SCREEN FUNCTIONAL SPECIFICATIONS

### 3.1 Authentication & Staff Session Management
- **Screen ID**: `AUTH_LOGIN`
- **Purpose**: Authenticates staff members, enforces branch context, loads user roles, and grants access tokens.
- **Inputs**:
  - `employee_code` (String, e.g. `OWNER-01`, `CASH-101`, mandatory)
  - `password` (String, masked, mandatory)
  - `branch_selection` (Dropdown: `All Branches`, `Mumbai`, `Pune`, `Thane`)
- **Validations**:
  - Employee code must exist and status must be `Active`.
  - Non-owner roles cannot select `All Branches` (locked to their assigned showroom).
- **Outputs & Side Effects**:
  - Emits `AuthUser` object (`code`, `name`, `role`, `branchId`, `token`).
  - Stores authenticated session in secure local storage / session cookie.
  - Triggers the **Stock Refill Daily Alert Modal** if the user is an Owner or Manager logging in for the first time that calendar day.

---

### 3.2 Executive Dashboard & Bullion Analytics Hub
- **Screen ID**: `VIEW_DASHBOARD`
- **Purpose**: Unified command center providing executive visibility over real-time finances, bullion vault valuation, sales velocity, branch comparison, and active notices.
- **Components & Calculations**:
  1. **Top Header & Live Ticker**:
     - Displays live rates for 24K, 22K 916, 18K, Silver 999, Silver 925, and daily % delta.
     - Controls for Branch Filter (`all`, `mumbai`, `pune`, `thane`).
     - Action buttons: Quick Sales Invoice, New Order Booking, New Purchase Inward, Stock Refill Hub, Bullion Rates Center, AI Copilot, Full Analytics.
  2. **Top 7 KPI Metric Cards**:
     - `Cash in Hand`: Current physical counter cash = Opening Cash + Cash Received − Cash Paid.
     - `Bank Balances`: Sum of all active bank account ledger balances minus OD/CC credit line drawdowns.
     - `Gross Sales Today`: Total invoice value generated on current date + total gold grams sold.
     - `Gross Purchases Today`: Inward metal value + purchase grams.
     - `Active In-flight Orders`: Total pending customer custom orders in workshop pipeline.
     - `Walk-in Clients & Footfall`: Showroom visitor counter and counter conversion rate ((Invoices Generated ÷ Total Visitors) × 100).
     - `Total Vault Stock Valuation`: Current monetary value of inventory at live spot rate.
  3. **Bullion Valuation Simulator**:
     - Inputs: User adjusts a dynamic slider or input box for `Simulated 24K Rate`.
     - Derives `Simulated 22K Rate` = Simulated 24K Rate × 0.916.
     - Computes:
       > **BULLION SIMULATOR FORMULAS:**  
> • **Projected Vault Value** = Total Vault Pure Gold (Grams) × Simulated 24K Rate  
> • **Simulated Valuation Delta** = Projected Vault Value − Base Valuation at Acquisition
  4. **Multi-Branch Velocity Comparison**:
     - Renders comparative performance metrics across Mumbai Flagship, Pune Camp, and Thane West branches:
       - Revenue (₹)
       - Metal Sold (Grams)
       - Customer Footfall
       - Cash vs Digital Tender Ratio
  5. **Current Stock Vault Breakdown**:
     - 5 Category Cards:
       1. Pure Gold (999.0)
       2. Pure Silver (999.0)
       3. 916 Hallmarked Jewellery
       4. URD / Old Scrap Gold
       5. 1gm Imitation & Silver Articles
     - For each category: Displays Gross Weight, Net Weight, Fine Metal Weight, and Live Value.
  6. **Sales & Invoicing Command Center / Tender Mix**:
     - Real-time aggregation of counter payment channels:
       - UPI (PhonePe, GPay, Paytm)
       - Card (Debit / Credit)
       - Cash
       - Bank Wire (NEFT / RTGS / IMPS)
     - Displays amount and percentage contribution of each tender mode.
  7. **Showroom Alerts & Notice Feed**:
     - `Order Delivery Due Today`: Lists orders where `delivery_date = CurrentDate` with customer name, phone, balance due, and "View Job Card" action.
     - `Debtor Balance Due`: Alerts on customers exceeding credit days or credit limit, with pending monetary amount and pending pure gold grams.
     - `Customer Birthday & Anniversary Today`: Automated trigger with "Send WhatsApp Greeting" button.
     - `Swarna Nidhi Scheme Maturity`: Alerts for members who completed 11 installments and are eligible for redemption.

---

### 3.3 Account Master (Chart of Accounts & POS Surcharges)
- **Screen ID**: `MASTER_ACCOUNTS`
- **Purpose**: Maintains the chart of accounts for double-entry bookkeeping, customers, suppliers, banks, tax heads, and expense categories.
- **Fields**:
  - `account_code` (String, unique primary key, e.g. `CUST-101`, `BANK-01`)
  - `account_name` (String, legal/trade name, mandatory)
  - `account_type` (Enum: `Assets`, `Liabilities`, `Income`, `Expense`)
  - `account_group` (Enum: `Cash Account`, `Bank Accounts`, `Sundry Debtors`, `Sundry Creditors`, `CGST`, `SGST`, `IGST`, `Sales Account`, `Purchase Account`, `Making Charges Income`, `Refinery Expense`, `General Expense`)
  - `opening_balance` (Decimal, 2 decimals)
  - `balance_type` (Enum: `Dr` [Receivable / Asset / Expense], `Cr` [Payable / Liability / Income])
  - `card_charges` (Object):
    - `enabled` (Boolean)
    - `for_customer_pct` (Decimal, surcharge passed to customer, e.g. 1.5%)
    - `for_us_pct` (Decimal, merchant discount rate absorbed by showroom, e.g. 1.2%)
  - `phone` (String, 10-digit mobile)
  - `area` (String, locality/city)
- **Operations**: Create Account, Edit Account, Search & Filter by Group, Delete Account (prevented if ledger entries exist).

---

### 3.4 Vendor / Supplier Master Management
- **Screen ID**: `MASTER_VENDORS`
- **Purpose**: Comprehensive vendor registry for bullion dealers, casting units, manufacturers, diamond merchants, and hallmarking centers.
- **Fields**:
  - `vendor_code` (String, unique, e.g. `SUP-101`)
  - `vendor_name` (String, company name, mandatory)
  - `contact_person` (String)
  - `phone`, `email` (Strings)
  - `gstin` (String, 15-character Indian GST identification number, format: `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`)
  - `pan_no` (String, 10-character PAN, format: `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`)
  - `city`, `state`, `address`, `pincode` (Strings)
  - `vendor_type` (Enum: `Bullion Dealer`, `Manufacturer / Karigar`, `Casting Unit`, `Diamond Merchant`, `Silver Artisan`, `Wholesaler`, `Packaging & Others`)
  - `bank_name`, `bank_account_no`, `ifsc_code`, `branch_name` (Strings)
  - `credit_limit` (Decimal, ₹ max allowable debt)
  - `credit_days` (Integer, credit payment terms)
  - **Dual Opening Balances**:
    - `opening_balance_cash` (Decimal, ₹)
    - `balance_type` (`Cr` [We owe vendor], `Dr` [Vendor owes us / advance])
    - `opening_balance_gold_fine_gm` (Decimal, 3 decimals, pure 24K gold balance)
    - `opening_balance_silver_fine_gm` (Decimal, 3 decimals, pure silver balance)
  - `status` (`Active` / `Inactive`)
- **Operations**:
  - Add / Update Vendor Profile.
  - View Live Vendor Ledger (Financial ₹ and Fine Metal Grams).
  - Quick WhatsApp Contact link.

---

### 3.5 Karagir / Artisan Master Management
- **Screen ID**: `MASTER_KARAGIRS`
- **Purpose**: Manages goldsmiths, job-workers, setters, and workshops executing custom manufacture and repairs.
- **Fields**:
  - `karagir_code` (String, unique, e.g. `KARA-101`)
  - `karagir_name` (String, mandatory)
  - `specialty` (Enum: `Mangalsutra & Antique Filigree`, `Bangles, Kada & CNC Machine`, `Nakas, Temple Jewellery & Choker`, `Casting Rings, Solitaires & Studs`, `Micro-Prong Setting & Rhodium`, `Plain Gold Chains & Kolhapuri Saaj`, `Silver Articles & Utensils`, `Diamond Setting Specialist`, `General Goldsmith`)
  - `workshop_name`, `address`, `city`, `state`, `pincode` (Strings)
  - `phone`, `pan_no`, `gstin` (Strings)
  - `default_making_rate_per_gm` (Decimal, standard making fee charged by this artisan)
  - `default_wastage_pct` (Decimal, agreed melting/working wastage % allowance)
  - **Running Metal Balance**:
    - `opening_balance_gold_fine_gm` (Decimal, pure gold weight currently in artisan's possession)
    - `opening_balance_silver_fine_gm` (Decimal)
    - `opening_balance_cash` (Decimal, ₹ advance or unpaid labor dues)
    - `balance_type` (`Cr` / `Dr`)
  - `bank_name`, `account_no`, `ifsc`, `branch` (Strings)
  - `active_jobs_count` (Integer, computed live from open orders assigned)
- **Operations**:
  - Create / Edit Karagir.
  - Issue Metal Voucher.
  - View Karagir Job History & Loss Ratio Performance.

---

### 3.6 Item Creation Master & Batch-to-Piece Division
- **Screen ID**: `MASTER_ITEM_CREATION`
- **Purpose**: Defines master jewellery design catalogs and performs the critical **Batch-to-Piece Stock Division** (breaking down a bulk lot into individual tagged pieces).
- **Sub-Tabs**:
  1. **Create Item Definition**:
     - `item_name` (String, e.g. `22K 916 Casted Royal Floral Ring`)
     - `item_type` (Enum: `Ring`, `Chain`, `Bangle`, `Necklace`, `Mangalsutra`, `Earring`, `Coin`, `Payal`, `Kada`, `Pendant`, `Bracelet`)
     - `item_group` (Enum: `Gold`, `Silver`, `1gm Imitation`, `URD Gold`, `URD Silver`, `Diamond`, `Platinum`)
     - `design` (Enum: `Casted`, `Handmade`, `Laser Cut`, `Filigree`, `Antique`, `Plain`, `Studded`)
     - `weight_or_qty` (`Weight` [Precious metals] / `QTY` [Imitation / Articles])
     - `total_stock_weight` (Decimal, 3 decimals, bulk lot weight received from mint/artisan)
     - `remaining_weight` (Decimal, 3 decimals, remaining bulk weight available to be converted into tagged pieces)
     - `image_url` (Sample ornament design image)
  2. **Opening Stock / Batch Division Engine**:
     - Select master item from catalog.
     - Adds individual piece rows:
       - `qty` (Integer, default 1)
       - `gross_wt` (Decimal, 3 decimals)
       - `black_beats`, `stone_wt`, `bag_wt` (Decimals, 3 decimals)
       - `diamond_cts` (Decimal, 2 decimals)
       - `purity` (Decimal, e.g. 91.6)
       - `size` (String, e.g. `14`, `2-4`, `18 inches`)
       - `tag_no` (Auto-generated unique serial, e.g. `OPN-88201`)
     - **Calculations & Validations**:
       - Automatically calculates Net Weight and Fine Weight.
       - Enforces **Conservation of Mass**:
         > **Mass Conservation Rule: Sum of all Individual Piece Gross Weights ≤ Master Item Total Stock Weight**
       - Decrements `remaining_weight` of master item in real time:
         > **Remaining Stock Weight = Master Item Total Stock Weight − Sum of Piece Gross Weights**
       - Upon clicking "Save & Convert to Barcode Tags", generated items are automatically committed to the inventory store and forwarded to the Barcode Tagging Studio.

---

### 3.7 Barcode Tagging Studio & Thermal Print Spooler
- **Screen ID**: `MASTER_BARCODE_STUDIO`
- **Purpose**: End-to-end barcode and RFID generation, tag design customization, thermal printing spooling, loose-to-tagged conversion, and split-piece draft management.
- **Supported Tag Geometries**:
  - Butterfly Jewellery Tag (Dual wing with center adhesive-free loop)
  - Dumbbell Tag (Standard optical barcode label)
  - Rat-tail / String Tag
  - Cable Tie Tag
- **Barcode & QR Rendering**:
  - Generates SVG Code 128 / Code 39 bar patterns and 2D QR codes containing JSON payload:
    `{"tag": "TAG-88201", "net": 12.350, "pur": 91.6, "huid": "AB1234"}`
- **Fields on Printed Tag**:
  - Showroom Trade Name (`SWARNA`)
  - Tag Number / Barcode (`TAG-88201`)
  - Item Description (`22K Ring Floral`)
  - Purity Mark (`916 / 22K`)
  - Gross Weight (`GW: 14.250g`)
  - Net Weight (`NW: 13.800g`)
  - Stone Weight / Beads (`ST: 0.450g`)
  - BIS HUID (`HUID: AB1234`)
  - Encoded Making Charge Code or Rate per Gram
  - Ornament Size (`Sz: 14`)
- **Core Operations**:
  1. **Batch Tag Print Spooler**: Multi-select tags, preview printable thermal sheet, spool to connected thermal printer (TSC, Zebra, Citizen) via raw ESC/POS, TSPL, or browser print.
  2. **Tag Loose Stock**: Convert loose raw purchases or un-tagged stock into individual barcoded items with serial tracking.
  3. **Split Piece Draft Engine**: Divide a multi-quantity or multi-part jewellery set into separate barcodes while ensuring:
     > **Mass Conservation Rule: Sum of all Split Pieces Net Weight = Original Set Net Weight**
  4. **Tag Re-Printing & History**: Track how many times a tag was printed to prevent counterfeit tag duplication.

---

### 3.8 New Order Booking (7 Sub-Modules)
- **Screen ID**: `TRANS_NEW_ORDER`
- **Purpose**: Handles customer bespoke jewellery orders, artisan job-work delegation, material issue/receive ledgers, and invoice conversion.

#### 3.8.1 Order Booking & Advance Ledger (Sub-Tab 1)
- **Header Fields**:
  - `customer_name` (String, mandatory)
  - `phone` (String, mandatory)
  - `address`, `area`, `state` (Strings)
  - `aadhar_no`, `pan_card` (Strings, required if order value > ₹2 Lakhs under Indian PMLA guidelines)
  - `bill_type` (Enum: `Order`, `Estimate`, `Tax Invoice`)
  - `bill_date` (Date, default CurrentDate)
  - `delivery_date` (Date, promised delivery, mandatory)
  - `manual_no` (String, physical order book receipt number)
  - `salesman` (Dropdown of active sales staff)
  - `gst_not_required` (Boolean flag)
  - `close_order` (Boolean flag)
  - `design_photo` (Customer design sample image upload/camera capture)
- **Ornament Line Items**:
  - `trans_type` (Enum: `Order`, `Repair`, `Jobwork`)
  - `item_name` (String)
  - `description` (Detailed styling notes, e.g. "Matte finish with rhodium highlight")
  - `qty`, `gross_wt`, `black_beats`, `stone_wt`, `stone_amt`
  - `purity` (Dropdown: 91.6, 75.0, 99.5, 92.5)
  - `mkg_per_gm`, `making_pct`, `hallm_charges` (₹45)
  - Computed line item values: `net_wt`, `mkg_amt`, `item_amt`.
- **Payment & Advance Settlement**:
  - **Cash / Bank Advance**:
    - `cash_received`, `bank_amt`, `bank_name`, `voucher_no`, `cheque_date`
  - **Rate Cut Gold Booking (Gold Rate Locking)**:
    - Customer pays advance to lock gold rate on booking day:
      - `rate_cut_gold_wt` (Grams booked)
      - `rate_cut_gold_rate` (₹/g locked)
      - `rate_cut_gold_amount` = Rate Cut Gold Weight × Rate Cut Gold Rate
  - **Old Gold / Scrap Metal Advance**:
    - Customer deposits old gold toward order:
      - `old_gold_gross_wt`, `old_gold_dust`, `old_gold_net_wt`, `old_gold_purity`, `old_gold_fin_wt`, `old_gold_rate`, `old_gold_amt`.
  - **Financial Summary Calculations**:
    > **ORDER FINANCIAL SUMMARY FORMULAS:**  
> • **Total Order Value** = Sum of all Line Item Amounts  
> • **Taxes** = CalculateTaxes(Total Order Value, GST Exemption Flag)  
> • **Gross Order Total** = Total Order Value + GST Amount − Discount  
> • **Total Advance Credited** = Cash Advance + Bank Advance + Rate Cut Gold Amount + Old Gold Credit  
> • **Balance Due at Delivery** = Gross Order Total − Total Advance Credited

#### 3.8.2 Submit Order to Karagir (Sub-Tab 2)
- Assigns order to a specialist artisan (`karagir_id`).
- Specifies:
  - `issued_metal_type` (e.g. `24K Gold Bar`, `916 Grain`, `999 Fine Silver`)
  - `issued_gross_wt`, `issued_purity`, `issued_fine_wt`
  - `alloy_added_wt` (Copper/silver alloy mixed for 22K karatage)
  - `karagir_rate_per_gm` (Agreed labor rate)
  - `wastage_pct` (Agreed melting loss allowance)
  - `promised_date` (Artisan delivery deadline)
  - `special_instructions` (Carving, setting, sizing notes)
- Generates **Karagir Job Card** with printable challan containing design photo and metal accountability slip.

#### 3.8.3 Issue Raw Material to Karagir (Sub-Tab 3)
- Ledger interface debiting pure metal fine weight to the Karagir's account:
  > **New Karagir Metal Balance = Current Karagir Metal Balance + Issued Fine Gold Weight**
- Deducts raw bullion bars/granules from the showroom vault.

#### 3.8.4 Receive Order & Metal Return from Karagir (Sub-Tab 4)
- When artisan delivers finished piece:
  - `received_gross_wt`
  - `received_net_wt`
  - `return_scrap_wt` (Unused scrap, filings, bench sweepings returned)
  - `received_date`
- **Reconciliation Formulas**:
  > **ARTISAN METAL RECONCILIATION FORMULAS:**  
> • **Total Metal Accounted** = Received Gross Weight + Return Scrap Weight  
> • **Actual Working Loss** = Issued Gross Weight − Total Metal Accounted  
> • **Allowed Wastage Allowance** = (Received Net Weight × Agreed Wastage %) ÷ 100  
> • **Net Variance** = Actual Working Loss − Allowed Wastage Allowance  
> *(If Net Variance > 0, the artisan exceeded allowed wastage; excess metal loss is penalized and debited to artisan's cash ledger)*
  - If Net Variance > 0: Artisan exceeded wastage limit; excess loss is debited to artisan's cash ledger.
  - If Quality Check passes, item status moves to `Ready for Delivery`.

#### 3.8.5 Convert Order to Final Sales Invoice (Sub-Tab 5)
- Automatically transfers order header, items, and deducted advances into the Sales Invoice engine.
- Re-calculates final metal value based on rate-cut locked grams vs market rate on delivery day.
- Collects remaining `balance_due` via cash, card, or UPI.

#### 3.8.6 Order Status Register & Delivery Tracking (Sub-Tab 6)
- Filterable register of all booked orders by status (`Booked`, `Assigned`, `In Progress`, `Received`, `Ready`, `Delivered`, `Cancelled`).
- Color-coded delivery alerts for orders due within 24–48 hours.

#### 3.8.7 Customer Advance Management (Sub-Tab 7)
- Dedicated ledger tracking customer advances, rate cut adjustments, and advance refund vouchers in case of cancellation.

---

### 3.9 Counter POS & Sales Invoicing
- **Screen ID**: `TRANS_SALES_INVOICE`
- **Purpose**: Fast-paced counter billing terminal supporting barcode scanning, salesman attribution, old gold exchange deduction, multi-tender split, and instant tax invoice generation.
- **Invoice Modes**:
  - `Tax Invoice`: Full GST compliance (3% GST split into 1.5% CGST + 1.5% SGST), mandatory for official sales.
  - `Estimate / Quotation`: Pro-forma quotation without tax application (`gst_pct = 0`).
- **Header Fields**:
  - `invoice_no` (Auto-sequenced, e.g. `INV-2026-891`)
  - `invoice_date` (Date)
  - `salesman_name` (Staff dropdown, tracks employee sales commissions)
  - `customer_name`, `phone`
- **Barcode Quick Scan Bar**:
  - Input field listening for barcode scanner input (13-character or alphanumeric tag).
  - Pressing `Enter` automatically looks up the tag in `stock_items`:
    - Retrieves `item_name`, `gross_wt`, `black_beats`, `stone_wt`, `net_wt`, `purity`, `huid`.
    - Automatically fetches current gold rate corresponding to item purity (e.g. 22K 916 rate).
    - Populates making charges from item definition.
    - Appends item to invoice items table.
- **Invoice Item Table**:
  - Columns: `#`, `Item Description`, `Gross Wt`, `Net Wt`, `Purity`, `Rate/Gm`, `Making Charges`, `Hallmark (HUID)`, `Total Amount`, `Action`.
- **Financial Settlement Calculations**:
  > **SALES INVOICE SETTLEMENT FORMULAS:**  
> • **Subtotal** = Sum of all Item Total Amounts  
> • **GST (3%)** = Round(Subtotal × 0.03, 2)  [If Tax Invoice Mode]  
> • **Total Invoice Bill** = Subtotal + GST Amount − Discount  
> • **Net Balance Due** = Total Invoice Bill − Old Gold (URD) Credit − Cash Tendered − Bank/UPI/Card Tendered
- **Actions**:
  - **Save & Settle**: Deducts items from inventory vault, creates Day Book entries, updates customer ledger.
  - **Print Bill**: Triggers 3-inch thermal POS slip or full A4/A5 GST Tax Invoice format.
  - **WhatsApp Dispatch**: Formats invoice summary and opens direct WhatsApp web chat with customer.

---

### 3.10 Purchase Invoicing & Inward Consignments (7 Sub-Modules)
- **Screen ID**: `TRANS_PURCHASE_INVOICE`
- **Purpose**: Manages wholesale inventory procurement from bullion dealers, manufacturers, and casting units.

#### 3.10.1 Supplier Profile Verification (Sub-Tab 1)
- Selects supplier and verifies GSTIN, address, credit limit, and current dual balance (Cash ₹ + Fine Gold grams).

#### 3.10.2 Purchase Bill Entry (Sub-Tab 2)
- **Header**: `supplier_name`, `invoice_prefix`, `invoice_no`, `manual_no`, `invoice_date`, `payment_mode` (`Cash` / `Credit`), `gst_not_required`, `weightwise` (toggle between weight-based billing vs piece-based).
- **Items**:
  - `trans_type` (Enum: `Gold Ornaments`, `Bullion 24K Bar`, `Silver 999`, `Raw Castings`)
  - `item_name`, `qty`, `gross_wt`, `black_b`, `stone_wt`, `net_wt`, `purity`, `rate`, `amount`
  - `wastage_pct`
  - `fin_plus_wastage` = CalculateFinePlusWastage(Net Weight, Purity, Wastage %)
  - `total_amt`
  - `huid` (6-digit hallmarking ID received from supplier)

#### 3.10.3 Payment & Tax Settlement (Sub-Tab 3)
- Handles statutory tax deductions:
  - CGST 1.5% + SGST 1.5% (or IGST 3%)
  - TDS (Section 194Q): 0.1% on purchase value
  - TCS (Section 206C): 0.1%
- Payment breakup: `by_cash`, `by_cheque`, `bank_name`, `cheque_no`, `cheque_date`.
- Calculates `net_balance` credited to supplier's ledger.

#### 3.10.4 Supplier Ledger Statement (Sub-Tab 4)
- Standard financial statement showing invoice credits and payment debits.

#### 3.10.5 Account-Cum-Stock Dual Statement (Sub-Tab 5)
- Simultaneous display of:
  - Financial Ledger (`₹ Balance`)
  - Bullion Metal Ledger (`Fine Gold Grams Balance`)

#### 3.10.6 Purchase Approval Consignment (Sub-Tab 6)
- Manages memo/approval stock brought by travelling salesmen/wholesalers:
  - Goods are held in "Consignment Vault" without affecting showroom balance sheet.
  - Showroom can accept specific pieces (converting them into purchase bills) and reject the rest.

#### 3.10.7 Stock-Cash (Vadhgat) Metal Debt Settlement (Sub-Tab 7)
- Protocol for settling metal debt owed to bullion suppliers:
  - Option A: Return physical 24K pure bullion bar.
  - Option B: Cash settlement (converting pure metal grams into ₹ at today's bullion market rate).

---

### 3.11 Refinery Inward & Scrap Processing (5 Sub-Modules)
- **Screen ID**: `TRANS_REFINERY_IN`
- **Purpose**: Controls the outward dispatch of scrap jewellery (customer exchange, workshop bench dust) and the inward receipt of refined 999.9 pure gold bars.

#### 3.11.1 Refinery Record Setup (Sub-Tab 1)
- Header: `refinery_name`, `invoice_no`, `invoice_date`, `against_refout_bill_no` (links inward batch to outward scrap challan).

#### 3.11.2 Material Inward Lines & Assay Yield (Sub-Tab 2)
- Line items:
  - `trans_type` (e.g. `Old Gold Scrap 22K`, `Melting Bits 18K`, `Bench Filings`)
  - `gross_wt`, `net_wt`, `purity` (Assayed touch)
  - `fin_wt` = (Net Weight × Purity) ÷ 100
  - `rate`, `amount`
  - `actual_fine_recovered` (Pure metal bar received from refiner)
  - Computes `refinery_loss` and `refinery_profit`.
  - `making_on_qty` (Refining / melting labor charges).

#### 3.11.3 Refinery Outward Tracking (Sub-Tab 3)
- Register of unrefined scrap lots currently lying at third-party refineries awaiting assay.

#### 3.11.4 Account-Cum-Stock Refinery Reconciliation (Sub-Tab 4)
- Reconciles metal grams sent vs pure bars received.

#### 3.11.5 Weight Reconciliation Summary (Sub-Tab 5)
- Summary: `balance_wgt_grswt`, `net_wgt`, `fin_wgt`.

---

### 3.12 Day Book & 12-Column EOD Audit Register
- **Screen ID**: `ACCOUNTS_DAY_BOOK`
- **Purpose**: Standard Indian Jewellery 12-column End-of-Day cashflow, sales, and scrap audit register.
- **Sub-Tabs**:
  1. `Cash Book`: Physical counter cash received and paid.
  2. `Stock Book`: Grams of gold/silver received and issued during the day.
  3. `Sales Book`: All retail and wholesale sales invoices.
  4. `Summary`: Daily cash and bank opening vs closing reconciliation.
- **The 12 Audit Columns**:
  1. `InvoiceType` (Sale, Purchase, Order Advance, Receipt, Payment)
  2. `Invoice.No`
  3. `Total.Amt` (Gross invoice value)
  4. `URD.Amt` (Old gold scrap trade-in credit deducted)
  5. `Net.Amt` (Net payable amount)
  6. `Cash.Received`
  7. `Cash.Payment`
  8. `Bank.Received`
  9. `Bank.Payment`
  10. `Date`
  11. `Details` (Narration, customer/supplier name)
  12. `Total Amt without Disc` (Pre-discount subtotal)
- **Reconciliation Engine**:
  > **DAILY EOD RECONCILIATION FORMULAS:**  
> • **Cash Closing Balance** = Cash Opening + Sum of Cash Received − Sum of Cash Payments  
> • **Bank Closing Balance** = Bank Opening + Sum of Bank Received − Sum of Bank Payments
- **Export**: Full CSV export of daily audit data.

---

### 3.13 Book Display (9 Financial & Debtor Registers)
- **Screen ID**: `ACCOUNTS_BOOK_DISPLAY`
- **Purpose**: Comprehensive financial register providing access to 9 distinct statutory books:
  1. `Sales Book`
  2. `Cash Book`
  3. `Sales Return Book`
  4. `Sundry Debtor Book`
  5. `Purchase Book`
  6. `Sundry Creditor Book`
  7. `Purchase Return Book`
  8. `Credit Limit Locking Register`
  9. `Journal`
- **Sundry Debtor Specific Engine**:
  - Displays customer ledger balances with the unique jewellery domain metric: **`Pending WT` (in Grams)**.
  - When customers purchase jewellery on credit, showroom can record debt in monetary terms (₹) OR fix the debt as pure gold weight (protecting the showroom against gold price inflation).
  - Includes an automated **WhatsApp Statement Reminder** button that compiles outstanding cash and fine gold dues into a formatted reminder message.

---

### 3.14 Account Display (Double-Entry Statement)
- **Screen ID**: `ACCOUNTS_ACCOUNT_DISPLAY`
- **Purpose**: Individual ledger card viewer displaying standard double-entry Debit (`Dr`) and Credit (`Cr`) entries with running balance for any selected account.

---

### 3.15 Stock Inventory Report & Valuation Register
- **Screen ID**: `STOCK_REPORT`
- **Purpose**: Vault inventory audit register with dynamic categorization, filtering, and valuation modes.
- **Filter Parameters**:
  - `select_type`: `All`, `Gold`, `Silver`, `Platinum`, `Diamond`, `Imitation`, `URD Gold`, `URD Silver`.
  - `select_details`: `All Items`, `Only Tagged Items`, `Only Loose Stock`.
  - `dont_show_urd_item`: Boolean toggle hiding scrap inventory from retail audit.
  - `stock_value_mode`:
    - `Market`: Evaluated at live 24K spot rate.
    - `Cost`: Evaluated at original purchase cost.
    - `WAC`: Weighted Average Cost.
- **Metrics Calculated**:
  - Total Pieces (`Qty`)
  - Total Gross Weight (`g`)
  - Total Net Weight (`g`)
  - Total Pure Fine Bullion Weight (`g`)
  - Total Stock Valuation (₹)
- **Export**: Full CSV and print-ready inventory ledger.

---

### 3.16 Stock Refill & Automated Replenishment Manager
- **Screen ID**: `STOCK_REFILL_MANAGER`
- **Purpose**: Predictive inventory replenishment hub preventing showroom stockouts in fast-moving jewellery SKUs.
- **Core Formula**:
  > **Deficit Pieces = Maximum of [ 0, Desired Min Stock − Current Available Stock ]**
- **Urgency Classification**:
  - `CRITICAL` (Red): Current stock ≤ 20% of Desired Stock.
  - `LOW` (Amber): Current stock ≤ 50% of Desired Stock.
  - `ADEQUATE` (Green): Current stock ≥ Desired Stock.
- **Replenishment Calculation**:
  > **ESTIMATED REPLENISHMENT REQUIREMENT:**  
> • **Estimated Refill Metal Weight (g)** = Deficit Pieces × Average Gross Weight per Piece  
> • **Estimated Procurement Value (₹)** = Estimated Refill Metal Weight × Current Gold Rate
- **Automated Workflow**:
  - System automatically maps each SKU to its preferred Vendor or Karagir.
  - **1st Login Daily Popup**: Triggers on first manager login, listing all critical deficits.
  - **1-Click WhatsApp Purchase Order**: Generates a pre-formatted purchase order to the artisan specifying required pieces, purity, target weight, and delivery timeline.

---

### 3.17 Swarna Nidhi (Monthly Gold Savings / Bhishi Scheme)
- **Screen ID**: `SCHEME_GOLD_SAVINGS`
- **Purpose**: Manages customer monthly deposit schemes (commonly structured as 11+1 Bonus Plan in India).
- **Rules & Logic**:
  - Customer commits to fixed monthly installment (e.g. ₹5,000 / month) for 11 months.
  - Each monthly installment is converted into pure gold grams based on the spot rate on deposit date:
    > **Accrued Pure Gold (g) = Monthly Installment Amount (₹) ÷ Spot 22K Gold Rate on Deposit Day (₹/g)**
  - **Showroom Bonus Contribution**: Upon completing 11 installments, the showroom contributes the 12th installment free as a loyalty bonus.
  - **Redemption**: Upon maturity, customer redeems total accumulated gold weight towards jewellery purchase with making charge discounts.

---

### 3.18 Showroom Messenger & WhatsApp Notification Engine
- **Screen ID**: `COMMON_MESSENGER`
- **Purpose**: Central communications dispatcher for customer relationship management, order status alerts, and daily bullion broadcasts.
- **Templates**:
  1. `Order Ready for Delivery`: Informs customer that custom ornament is ready for trial and collection.
  2. `Gold Scheme Due Reminder`: Notifies Swarna Nidhi members to deposit monthly installment.
  3. `Daily Bullion Rate Broadcast`: Morning broadcast of showroom board rates (24K, 22K, Silver).
  4. `Debtor Balance Statement`: Outstanding ledger balance and fine gold weight reminder.
  5. `Birthday / Anniversary Greeting`: Automated customer relationship greetings with discount voucher.

---

### 3.19 Backup & Disaster Recovery Manager
- **Screen ID**: `SYSTEM_BACKUP`
- **Purpose**: Safeguards business data across multiple media destinations:
  - Local HDD
  - Removable USB Drive
  - Google Drive Cloud Storage
  - Live Supabase PostgreSQL Database Sync
- **Features**:
  - Encrypted backup dump generation.
  - Verification checksum verification.
  - Auto-cloud sync heartbeat monitoring.

---

### 3.20 Field Dictionary & Data Mapping
- **Screen ID**: `SYSTEM_FIELD_DICTIONARY`
- **Purpose**: Searchable system dictionary documenting all 788+ database fields, data types, business meanings, validation constraints, and calculation dependencies across the ERP.

---

### 3.21 System Settings & Showroom Profile
- **Screen ID**: `SYSTEM_SETTINGS`
- **Purpose**: Maintains legal and operational showroom configuration:
  - Showroom Legal Entity Name, Trade Name, Tagline.
  - Head Office & Branch Addresses.
  - GSTIN, State Code (e.g. 27 for Maharashtra), PAN, TAN.
  - BIS Hallmarking License Certification Number.
  - Default Tax Rates (GST 3%, TDS 0.1%, TCS 0.1%).
  - Default Making Rates & Wastage Percentages.
  - Hardware printer configurations (Thermal label dimensions: width, height, margins in mm).

---

### 3.22 AI Copilot & Semantic Tool Calling Engine
- **Screen ID**: `SYSTEM_AI_ASSISTANT`
- **Purpose**: Conversational AI assistant integrated via Google Gemini API Function Calling.
- **Registered Tools**:
  1. `query_sales_data`: Aggregates revenue, order counts, gross margins, and tax totals across date windows.
  2. `search_vendor`: Queries supplier database by name, phone, GSTIN, or metal balance.
  3. `calculate_quotation`: Generates complete price estimation for custom jewellery specifications.
  4. `stock_refill_alert`: Evaluates inventory deficits and generates replenishment orders.
  5. `gold_rate_history`: Analyzes bullion price trends and computes price moving averages.

---

## 4. COMPLETE RELATIONAL DATABASE SCHEMA

The following PostgreSQL DDL schema defines the complete database architecture for the application:

```sql
-- ============================================================================
-- SWARNA JEWELLERY ERP - ENTERPRISE RELATIONAL SCHEMA
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Branches & Showrooms
CREATE TABLE branches (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    license_no VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Staff Users & RBAC
CREATE TABLE staff_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL 
        CHECK (role IN ('Owner', 'Manager', 'Cashier', 'Accountant', 'Karagir')),
    branch_id VARCHAR(50) REFERENCES branches(id),
    email VARCHAR(150),
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Account Master & Chart of Accounts
CREATE TABLE erp_accounts (
    account_code VARCHAR(50) PRIMARY KEY,
    account_name VARCHAR(200) NOT NULL,
    account_type VARCHAR(50) NOT NULL 
        CHECK (account_type IN ('Assets', 'Liabilities', 'Income', 'Expense')),
    account_group VARCHAR(100) NOT NULL,
    opening_balance DECIMAL(15,2) DEFAULT 0.00,
    balance_type VARCHAR(2) NOT NULL CHECK (balance_type IN ('Dr', 'Cr')),
    card_charges_enabled BOOLEAN DEFAULT FALSE,
    card_charges_customer_pct DECIMAL(5,2) DEFAULT 0.00,
    card_charges_us_pct DECIMAL(5,2) DEFAULT 0.00,
    phone VARCHAR(20),
    area VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Vendor / Supplier Master
CREATE TABLE erp_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_code VARCHAR(50) UNIQUE NOT NULL,
    vendor_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    gstin VARCHAR(15),
    pan_no VARCHAR(10),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    address TEXT,
    pincode VARCHAR(10),
    vendor_type VARCHAR(100) NOT NULL,
    bank_name VARCHAR(150),
    bank_account_no VARCHAR(50),
    ifsc_code VARCHAR(20),
    branch_name VARCHAR(100),
    credit_limit DECIMAL(15,2) DEFAULT 0.00,
    credit_days INTEGER DEFAULT 0,
    opening_balance_cash DECIMAL(15,2) DEFAULT 0.00,
    balance_type VARCHAR(2) DEFAULT 'Cr' CHECK (balance_type IN ('Cr', 'Dr')),
    opening_balance_gold_fine_gm DECIMAL(12,3) DEFAULT 0.000,
    opening_balance_silver_fine_gm DECIMAL(12,3) DEFAULT 0.000,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Karagir / Artisan Master
CREATE TABLE erp_karagirs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    karagir_code VARCHAR(50) UNIQUE NOT NULL,
    karagir_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    specialty VARCHAR(150) NOT NULL,
    workshop_name VARCHAR(200),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    pan_no VARCHAR(10),
    gstin VARCHAR(15),
    default_making_rate_per_gm DECIMAL(10,2) DEFAULT 0.00,
    default_wastage_pct DECIMAL(5,2) DEFAULT 0.00,
    opening_balance_cash DECIMAL(15,2) DEFAULT 0.00,
    balance_type VARCHAR(2) DEFAULT 'Cr' CHECK (balance_type IN ('Cr', 'Dr')),
    opening_balance_gold_fine_gm DECIMAL(12,3) DEFAULT 0.000,
    opening_balance_silver_fine_gm DECIMAL(12,3) DEFAULT 0.000,
    bank_name VARCHAR(150),
    bank_account_no VARCHAR(50),
    ifsc_code VARCHAR(20),
    branch_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Master Item Definitions (Batch Catalog)
CREATE TABLE master_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(200) NOT NULL,
    item_type VARCHAR(100) NOT NULL,
    item_group VARCHAR(100) NOT NULL,
    design VARCHAR(100) NOT NULL,
    weight_or_qty VARCHAR(10) NOT NULL CHECK (weight_or_qty IN ('Weight', 'QTY')),
    total_stock_weight DECIMAL(12,3) DEFAULT 0.000,
    remaining_weight DECIMAL(12,3) DEFAULT 0.000,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Inventory Items (Barcoded Pieces)
CREATE TABLE stock_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id VARCHAR(50) REFERENCES branches(id),
    tag_no VARCHAR(100) UNIQUE NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    item_type VARCHAR(100),
    qty INTEGER DEFAULT 1,
    gross_wt DECIMAL(12,3) NOT NULL,
    black_beats DECIMAL(12,3) DEFAULT 0.000,
    stone_wt DECIMAL(12,3) DEFAULT 0.000,
    bag_wt DECIMAL(12,3) DEFAULT 0.000,
    net_wt DECIMAL(12,3) NOT NULL,
    purity DECIMAL(5,2) NOT NULL,
    fine_wt DECIMAL(12,3) NOT NULL,
    size VARCHAR(50),
    huid VARCHAR(6),
    making_per_gm DECIMAL(10,2) DEFAULT 0.00,
    making_pct DECIMAL(5,2) DEFAULT 0.00,
    hallmark_charges DECIMAL(10,2) DEFAULT 45.00,
    rate_per_gm DECIMAL(12,2) DEFAULT 0.00,
    total_value DECIMAL(15,2) DEFAULT 0.00,
    is_urd BOOLEAN DEFAULT FALSE,
    is_loose BOOLEAN DEFAULT FALSE,
    is_printed BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'In Stock' 
        CHECK (status IN ('In Stock', 'Sold', 'In Workshop', 'Refining', 'Consignment')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Customer Order Bookings
CREATE TABLE orders_header (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_no VARCHAR(50) UNIQUE NOT NULL,
    branch_id VARCHAR(50) REFERENCES branches(id),
    customer_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    area VARCHAR(100),
    state VARCHAR(100),
    aadhar_no VARCHAR(20),
    pan_card VARCHAR(15),
    bill_type VARCHAR(50) DEFAULT 'Order',
    bill_date DATE NOT NULL,
    delivery_date DATE NOT NULL,
    manual_no VARCHAR(50),
    salesman VARCHAR(150),
    gst_not_required BOOLEAN DEFAULT FALSE,
    close_order BOOLEAN DEFAULT FALSE,
    design_photo TEXT,
    remark TEXT,
    status VARCHAR(50) DEFAULT 'Booked' 
        CHECK (status IN ('Booked', 'Assigned', 'In Progress', 'Received', 'Ready', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders_header(id) ON DELETE CASCADE,
    trans_type VARCHAR(50) NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    description TEXT,
    qty INTEGER DEFAULT 1,
    gross_wt DECIMAL(12,3) NOT NULL,
    black_beats DECIMAL(12,3) DEFAULT 0.000,
    stone_wt DECIMAL(12,3) DEFAULT 0.000,
    stone_amt DECIMAL(12,2) DEFAULT 0.00,
    net_wt DECIMAL(12,3) NOT NULL,
    purity DECIMAL(5,2) NOT NULL,
    mkg_per_gm DECIMAL(10,2) DEFAULT 0.00,
    mkg_amt DECIMAL(12,2) DEFAULT 0.00,
    hallm_charges DECIMAL(10,2) DEFAULT 45.00,
    making_pct DECIMAL(5,2) DEFAULT 0.00,
    item_amt DECIMAL(15,2) NOT NULL,
    image_url TEXT
);

CREATE TABLE order_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE REFERENCES orders_header(id) ON DELETE CASCADE,
    cash_received DECIMAL(15,2) DEFAULT 0.00,
    bank_amt DECIMAL(15,2) DEFAULT 0.00,
    bank_name VARCHAR(150),
    voucher_no VARCHAR(50),
    cheque_date DATE,
    rate_cut_gold_wt DECIMAL(12,3) DEFAULT 0.000,
    rate_cut_gold_rate DECIMAL(12,2) DEFAULT 0.00,
    rate_cut_gold_amount DECIMAL(15,2) DEFAULT 0.00,
    old_gold_gross_wt DECIMAL(12,3) DEFAULT 0.000,
    old_gold_dust DECIMAL(12,3) DEFAULT 0.000,
    old_gold_net_wt DECIMAL(12,3) DEFAULT 0.000,
    old_gold_purity DECIMAL(5,2) DEFAULT 0.00,
    old_gold_fin_wt DECIMAL(12,3) DEFAULT 0.000,
    old_gold_rate DECIMAL(12,2) DEFAULT 0.00,
    old_gold_amt DECIMAL(15,2) DEFAULT 0.00,
    total_amount DECIMAL(15,2) NOT NULL,
    discount DECIMAL(15,2) DEFAULT 0.00,
    gst_pct DECIMAL(5,2) DEFAULT 3.00,
    gst_amt DECIMAL(15,2) DEFAULT 0.00,
    advance_amt DECIMAL(15,2) NOT NULL,
    balance_amount DECIMAL(15,2) NOT NULL
);

-- 9. Karagir Workshop Assignments & Metal Ledger
CREATE TABLE karagir_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders_header(id),
    karagir_id UUID REFERENCES erp_karagirs(id),
    voucher_no VARCHAR(50) UNIQUE NOT NULL,
    assigned_date DATE NOT NULL,
    promised_date DATE NOT NULL,
    issued_metal_type VARCHAR(100) NOT NULL,
    issued_gross_wt DECIMAL(12,3) NOT NULL,
    issued_purity DECIMAL(5,2) NOT NULL,
    issued_fine_wt DECIMAL(12,3) NOT NULL,
    alloy_added_wt DECIMAL(12,3) DEFAULT 0.000,
    karagir_rate_per_gm DECIMAL(10,2) NOT NULL,
    agreed_making_charges DECIMAL(12,2) NOT NULL,
    wastage_pct DECIMAL(5,2) NOT NULL,
    special_instructions TEXT,
    status VARCHAR(50) DEFAULT 'Assigned' 
        CHECK (status IN ('Assigned', 'In Progress', 'Received', 'Cancelled')),
    received_gross_wt DECIMAL(12,3),
    received_net_wt DECIMAL(12,3),
    received_date DATE,
    return_scrap_wt DECIMAL(12,3) DEFAULT 0.000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Sales Invoices
CREATE TABLE sales_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    branch_id VARCHAR(50) REFERENCES branches(id),
    bill_mode VARCHAR(20) NOT NULL 
        CHECK (bill_mode IN ('Tax Invoice', 'Estimate')),
    salesman_name VARCHAR(150) NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    invoice_date DATE NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    gst_pct DECIMAL(5,2) DEFAULT 3.00,
    gst_amt DECIMAL(15,2) DEFAULT 0.00,
    discount DECIMAL(15,2) DEFAULT 0.00,
    total_bill DECIMAL(15,2) NOT NULL,
    urd_amount DECIMAL(15,2) DEFAULT 0.00,
    cash_tendered DECIMAL(15,2) DEFAULT 0.00,
    bank_tendered DECIMAL(15,2) DEFAULT 0.00,
    net_due DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales_invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES sales_invoices(id) ON DELETE CASCADE,
    stock_item_id UUID REFERENCES stock_items(id),
    item_name VARCHAR(200) NOT NULL,
    gross_wt DECIMAL(12,3) NOT NULL,
    net_wt DECIMAL(12,3) NOT NULL,
    purity DECIMAL(5,2) NOT NULL,
    rate DECIMAL(12,2) NOT NULL,
    making_amt DECIMAL(12,2) DEFAULT 0.00,
    hallmark_charges DECIMAL(10,2) DEFAULT 0.00,
    total_amt DECIMAL(15,2) NOT NULL
);

-- 11. Day Book (12-Column Accounting Journal)
CREATE TABLE daybook_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id VARCHAR(50) REFERENCES branches(id),
    entry_date DATE NOT NULL,
    invoice_type VARCHAR(50) NOT NULL,
    invoice_no VARCHAR(50) NOT NULL,
    total_amt DECIMAL(15,2) NOT NULL,
    urd_amt DECIMAL(15,2) DEFAULT 0.00,
    net_amt DECIMAL(15,2) NOT NULL,
    cash_received DECIMAL(15,2) DEFAULT 0.00,
    cash_payment DECIMAL(15,2) DEFAULT 0.00,
    bank_received DECIMAL(15,2) DEFAULT 0.00,
    bank_payment DECIMAL(15,2) DEFAULT 0.00,
    details TEXT NOT NULL,
    total_amt_without_disc DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Stock Refill Replenishment Targets
CREATE TABLE stock_refill_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    purity DECIMAL(5,2) NOT NULL,
    desired_stock INTEGER NOT NULL,
    sold_stock INTEGER DEFAULT 0,
    current_stock INTEGER NOT NULL,
    gross_wt_per_unit DECIMAL(12,3) NOT NULL,
    vendor_id UUID REFERENCES erp_vendors(id),
    vendor_name VARCHAR(200) NOT NULL,
    vendor_phone VARCHAR(20) NOT NULL,
    last_refill_date DATE,
    status VARCHAR(20) DEFAULT 'adequate' 
        CHECK (status IN ('critical', 'low', 'adequate', 'surplus')),
    urgency VARCHAR(20) DEFAULT 'NORMAL' 
        CHECK (urgency IN ('HIGH', 'MEDIUM', 'NORMAL')),
    is_ordered BOOLEAN DEFAULT FALSE,
    last_order_timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Swarna Nidhi (Gold Savings Scheme)
CREATE TABLE gold_scheme_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_no VARCHAR(50) UNIQUE NOT NULL,
    branch_id VARCHAR(50) REFERENCES branches(id),
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    monthly_amt DECIMAL(15,2) NOT NULL,
    tenure_months INTEGER DEFAULT 11,
    installments_paid INTEGER DEFAULT 0,
    accumulated_amt DECIMAL(15,2) DEFAULT 0.00,
    gold_wt_accrued DECIMAL(12,3) DEFAULT 0.000,
    bonus_contribution DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Active' 
        CHECK (status IN ('Active', 'Matured - Ready for Jewellery Redemption', 'Redeemed', 'Defaulted')),
    enrollment_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. INTEGRATION, HARDWARE & API SPECIFICATIONS

### 5.1 Weighing Scale RS232/USB Serial Protocol
- Precision balance integration (e.g. Mettler Toledo, Sartorius, Essae, Citizen):
- **Baud Rate**: `9600 bps`, Data Bits: `8`, Stop Bits: `1`, Parity: `None`.
- **Data String Format**: `ST,GS,+00012.345,g\r\n`
- The system continuously reads serial COM ports via the Web Serial API (`navigator.serial`) or WebSocket local bridge agent, parses numeric grams, and auto-populates the `gross_wt` field in active forms upon stability trigger `ST`.

### 5.2 Barcode/RFID Scanner Emulation
- Supports both **HID Keyboard Wedge** mode and **Virtual COM Port (CDC)**.
- Scanners are programmed to send suffix `[ENTER]` (`0x0D`), which triggers the `handleScanBarcode` event listener on POS and stock audit screens.

### 5.3 Thermal Label Printer Protocols (TSPL / ZPL / ESC-POS)
- Formats tag print jobs in native printer command language for direct thermal transfer onto polyester jewellery labels:
```ts
// Sample TSPL Protocol string for 2-inch Butterfly Jewellery Tag
const tsplCommand = `
SIZE 50 mm, 20 mm
GAP 2 mm, 0 mm
DIRECTION 1
CLS
TEXT 20, 10, "3", 0, 1, 1, "SWARNA JEWELLERS"
BARCODE 20, 35, "128", 30, 0, 0, 2, 4, "${tagNo}"
TEXT 20, 70, "2", 0, 1, 1, "${itemShortName} - 916"
TEXT 20, 90, "2", 0, 1, 1, "GW:${grossWt}g NW:${netWt}g"
TEXT 20, 110, "2", 0, 1, 1, "HUID:${huid}  SZ:${size}"
PRINT 1, 1
`;
```

### 5.4 WhatsApp Business Cloud API & Web Dispatch
- Dispatches transactional notifications through two configurable modes:
  1. **Direct Web Launch (Zero API Cost)**:
     `https://wa.me/{91+phone}?text={URLEncodedTemplate}`
  2. **WhatsApp Business Cloud API (Meta Graph API)**:
     - Endpoint: `POST https://graph.facebook.com/v20.0/{phone_number_id}/messages`
     - Template: Pre-approved HSM templates for `order_delivery_reminder`, `scheme_payment_receipt`, and `daily_gold_rates`.

### 5.5 Bullion Spot Rate Poller & IBJA/MCX Integration
- **Polling Frequency**: Every 60 seconds during market hours (09:00 AM to 11:30 PM IST).
- **Fallback**: Local storage cache retention (`swarna_bullion_rates_v2`) guarantees that in offline scenarios or API downtime, showroom POS terminals continue operating on the morning's locked board rate.

---

## 6. END OF BLUEPRINT
*This document contains the complete functional logic, mathematical formulations, database schemas, validation rules, and integration protocols required to build or replicate the entire Swarna Jewellery ERP application.*
