const fs = require('fs');
const path = require('path');

const mdPath = path.resolve(__dirname, '../docs/SWARNA_JEWELLERY_ERP_FUNCTIONAL_BLUEPRINT.md');
let content = fs.readFileSync(mdPath, 'utf8');

// Replace all LaTeX formulas with crystal-clear, plain English working calculations

// Section 2.1
content = content.replace(
  /\$\$\\text\{Net Weight\} = \\max\\Big\(0, \\text\{Gross Weight\} - \\text\{Black Beads Weight\} - \\text\{Stone Weight\} - \\text\{Bag Weight\}\\Big\)\$\$/g,
  `> **WORKING ENGLISH FORMULA:**  
> **Net Weight (g) = Maximum of [ 0, Gross Weight − Black Beads Weight − Stone Weight − Bag Weight ]**`
);

content = content.replace(/\$\\le \\text\{gross\\_wt\}\$/g, 'less than or equal to Gross Weight');

// Section 2.2
content = content.replace(
  /\$\$\\text\{Fine Weight\} = \\frac\{\\text\{Net Weight\} \\times \\text\{Purity\}\}\{100\}\$\$/g,
  `> **WORKING ENGLISH FORMULA:**  
> **Fine Bullion Weight (g) = (Net Weight × Purity Percentage) ÷ 100**`
);

// Section 2.3
content = content.replace(
  /\$\$\\text\{Wastage Allowance \(g\)\} = \\frac\{\\text\{Net Weight\} \\times \\text\{Wastage\}\\\%\}\{100\}\$\$\s*\$\$\\text\{Fine \+ Wastage \(g\)\} = \\text\{Fine Weight\} \+ \\text\{Wastage Allowance \(g\)\}\$\$/g,
  `> **WORKING ENGLISH FORMULAS:**  
> **1. Wastage Allowance (g) = (Net Weight × Wastage Percentage) ÷ 100**  
> **2. Fine + Wastage Metal Total (g) = Fine Bullion Weight + Wastage Allowance**`
);

// Section 2.4
content = content.replace(
  /\$\$\\text\{Making Amount\} = \\text\{Net Weight\} \\times \\text\{Making Rate per Gram\}\$\$/g,
  `> **Per-Gram Making Charge = Net Weight × Making Rate per Gram**`
);
content = content.replace(
  /\$\$\\text\{Metal Value\} = \\text\{Net Weight\} \\times \\text\{Gold Rate per Gram\}\$\$\s*\$\$\\text\{Making Amount\} = \\frac\{\\text\{Metal Value\} \\times \\text\{Making\}\\\%\}\{100\}\$\$/g,
  `> **Percentage Making Charge:**  
> • Metal Value = Net Weight × Gold Rate per Gram  
> • Making Amount = (Metal Value × Making Percentage) ÷ 100`
);
content = content.replace(
  /\$\$\\text\{Making Amount\} = \(\\text\{Net Weight\} \\times \\text\{Making Rate per Gram\}\) \+ \\left\(\\frac\{\\text\{Metal Value\} \\times \\text\{Making\}\\\%\}\{100\}\\right\)\$\$/g,
  `> **Hybrid Making Charge = (Net Weight × Making Rate per Gram) + ((Metal Value × Making Percentage) ÷ 100)**`
);

// Section 2.5
content = content.replace(
  /\$\$\\text\{Line Item Amount\} = \(\\text\{Net Weight\} \\times \\text\{Rate\}\) \+ \\text\{Stone Amount\} \+ \\text\{Making Amount\} \+ \\text\{Hallmark Charges\}\$\$/g,
  `> **WORKING ENGLISH FORMULA:**  
> **Line Item Total Amount = (Net Weight × Gold Rate) + Stone Amount + Making Amount + Hallmark (HUID) Fee**`
);

// Section 2.6
content = content.replace(
  /\$\$\\text\{CGST Amount\} = \\frac\{\\text\{Taxable Subtotal\} \\times 1\.5\}\{100\}\$\$\s*\$\$\\text\{SGST Amount\} = \\frac\{\\text\{Taxable Subtotal\} \\times 1\.5\}\{100\}\$\$\s*\$\$\\text\{GST Total\} = \\text\{CGST Amount\} \+ \\text\{SGST Amount\}\$\$\s*\$\$\\text\{TDS Amount\} = \\frac\{\\text\{Taxable Subtotal\} \\times \\text\{TDS\}\\\%\}\{100\}\$\$\s*\$\$\\text\{TCS Amount\} = \\frac\{\(\\text\{Taxable Subtotal\} \+ \\text\{GST Total\}\) \\times \\text\{TCS\}\\\%\}\{100\}\$\$\s*\$\$\\text\{Final Invoice Bill Amount\} = \\text\{Taxable Subtotal\} \+ \\text\{GST Total\} \+ \\text\{TCS Amount\} - \\text\{Discount\}\$\$/g,
  `> **WORKING ENGLISH FORMULAS (STATUTORY TAX SPLIT):**  
> • **CGST (1.5%)** = (Taxable Subtotal × 1.5) ÷ 100  
> • **SGST (1.5%)** = (Taxable Subtotal × 1.5) ÷ 100  
> • **Total GST (3.0%)** = CGST Amount + SGST Amount  
> • **TDS (0.1% under Section 194Q)** = (Taxable Subtotal × TDS %) ÷ 100  
> • **TCS (0.1% under Section 206C)** = ((Taxable Subtotal + Total GST) × TCS %) ÷ 100  
> • **Final Bill Grand Total** = Taxable Subtotal + Total GST + TCS Amount − Discount`
);

content = content.replace(/\$\\ne\$/g, '≠');

// Section 2.7
content = content.replace(
  /\$\$\\text\{Old Gold Net Wt\} = \\text\{Gross Wt\} - \\text\{Dust\/Enamel\/Stone Loss\}\$\$\s*\$\$\\text\{Assayed Fine Wt\} = \\frac\{\\text\{Old Gold Net Wt\} \\times \\text\{Tested Touch\/Purity\}\}\{100\}\$\$\s*\$\$\\text\{Old Gold Valuation Amount\} = \\text\{Assayed Fine Wt\} \\times \\text\{Current 24K Bullion Buyback Rate\}\$\$\s*\$\$\\text\{Net Payable by Customer\} = \\text\{New Jewellery Invoice Total\} - \\text\{Old Gold Valuation Amount\} - \\text\{Advance Payments\}\$\$/g,
  `> **WORKING ENGLISH FORMULAS (OLD GOLD URD EXCHANGE):**  
> • **Old Gold Net Weight** = Gross Weight − Dust / Stone / Enamel Loss  
> • **Assayed Fine Pure Weight** = (Old Gold Net Weight × Tested Touch Purity %) ÷ 100  
> • **Old Gold Valuation Credit** = Assayed Fine Pure Weight × Current 24K Bullion Buyback Rate  
> • **Net Balance Payable by Customer** = New Jewellery Invoice Total − Old Gold Valuation Credit − Advance Payments`
);

// Section 2.8
content = content.replace(
  /\$\$\\text\{Theoretical Fine Weight\} = \\frac\{\\text\{Inward Net Weight\} \\times \\text\{Assayed Touch\}\}\{100\}\$\$\s*\$\$\\text\{Variance\} = \\text\{Actual Pure 24K Bar Recovered\} - \\text\{Theoretical Fine Weight\}\$\$/g,
  `> **WORKING ENGLISH FORMULAS (REFINERY YIELD):**  
> • **Theoretical Fine Gold** = (Inward Net Weight × Assayed Touch Purity %) ÷ 100  
> • **Variance** = Actual Pure 24K Bar Recovered from Refiner − Theoretical Fine Gold`
);

content = content.replace(/\$\\text\{Variance\} < 0\$/g, 'Variance is negative (less than 0)');
content = content.replace(/\$\\text\{Variance\} > 0\$/g, 'Variance is positive (greater than 0)');

content = content.replace(
  /\$\$\\text\{Refinery Melting Loss\} = \|\\text\{Variance\}\|\$\$\s*\$\$\\text\{Refinery Profit\} = 0\$\$/g,
  `> • **Refinery Melting Loss** = Absolute Value of Variance (Refinery Profit = 0)`
);

content = content.replace(
  /\$\$\\text\{Refinery Profit\} = \\text\{Variance\}\$\$\s*\$\$\\text\{Refinery Melting Loss\} = 0\$\$/g,
  `> • **Refinery Yield Profit** = Variance (Refinery Melting Loss = 0)`
);

content = content.replace(
  /\$\$\\text\{Refining Charges\} = \\text\{Gross Weight Melted\} \\times \\text\{Refinery Melting Fee per Gram\}\$\$/g,
  `> • **Refining Melting Fee (₹)** = Gross Weight Melted × Refiner Fee per Gram`
);

// Section 2.9
content = content.replace(
  /- \*\*Gold 24K \(999\.0\)\*\*: \$\\text\{Base 24K\} \+ \\text\{Showroom Markup\}\$/g,
  '- **Gold 24K (999.0)**: Base 24K Spot Rate + Showroom Markup'
);
content = content.replace(
  /- \*\*Gold 22K \(916\.0\)\*\*: \$\\text\{Gold 24K\} \\times 0\.916\$/g,
  '- **Gold 22K (916.0)**: Gold 24K Rate × 0.916'
);
content = content.replace(
  /- \*\*Gold 18K \(750\.0\)\*\*: \$\\text\{Gold 24K\} \\times 0\.750\$/g,
  '- **Gold 18K (750.0)**: Gold 24K Rate × 0.750'
);
content = content.replace(
  /- \*\*Gold 14K \(585\.0\)\*\*: \$\\text\{Gold 24K\} \\times 0\.585\$/g,
  '- **Gold 14K (585.0)**: Gold 24K Rate × 0.585'
);
content = content.replace(
  /- \*\*Gold 24K Tola \(10g\)\*\*: \$\\text\{Gold 24K\} \\times 10\$/g,
  '- **Gold 24K Tola (10g)**: Gold 24K Rate × 10'
);
content = content.replace(
  /- \*\*Gold 22K Tola \(10g\)\*\*: \$\\text\{Gold 22K\} \\times 10\$/g,
  '- **Gold 22K Tola (10g)**: Gold 22K Rate × 10'
);
content = content.replace(
  /- \*\*Silver 999 \(Pure\)\*\*: \$\\text\{Base Silver\} \+ \\text\{Showroom Markup\}\$/g,
  '- **Silver 999 (Pure)**: Base Silver Spot Rate + Showroom Markup'
);
content = content.replace(
  /- \*\*Silver 925 \(Sterling\)\*\*: \$\\text\{Silver 999\} \\times 0\.925\$/g,
  '- **Silver 925 (Sterling)**: Silver 999 Rate × 0.925'
);
content = content.replace(
  /- \*\*Silver Bar \(1 Kg\)\*\*: \$\\text\{Silver 999\} \\times 1000\$/g,
  '- **Silver Bar (1 Kg)**: Silver 999 Rate × 1,000'
);

// Section 2.10
content = content.replace(
  /\$\$\\text\{Vault Valuation\} = \\sum \(\\text\{Item Fine Weight\} \\times \\text\{Live 24K Spot Rate\}\)\$\$/g,
  `> **Market Spot Valuation = Sum of all (Item Fine Weight × Live 24K Spot Rate)**`
);
content = content.replace(
  /\$\$\\text\{Vault Valuation\} = \\sum \(\\text\{Item Inward Purchase Cost\}\)\$\$/g,
  `> **Acquisition Cost Valuation = Sum of all (Item Inward Purchase Cost)**`
);
content = content.replace(
  /\$\$\\text\{WAC Rate\} = \\frac\{\\text\{Total Valuation of Current Stock\} \+ \\text\{Valuation of New Inward Lot\}\}\{\\text\{Total Fine Weight in Vault\}\}\$\$/g,
  `> **Weighted Average Cost (WAC) Rate = (Total Value of Current Stock + Inward Lot Value) ÷ Total Fine Weight in Vault**`
);

// Section 3.2 Dashboard
content = content.replace(
  /\$\\text\{Opening Cash\} \+ \\text\{Cash Received\} - \\text\{Cash Paid\}\$/g,
  'Opening Cash + Cash Received − Cash Paid'
);
content = content.replace(
  /\(\\frac\{\\text\{Invoices Generated\}\}\{\\text\{Total Visitors\}\} \\times 100\)/g,
  '((Invoices Generated ÷ Total Visitors) × 100)'
);
content = content.replace(
  /\$= \\text\{Simulated 24K Rate\} \\times 0\.916\$/g,
  '= Simulated 24K Rate × 0.916'
);
content = content.replace(
  /\$\$\\text\{Projected Vault Value\} = \\text\{Total Vault Pure Gold \(g\)\} \\times \\text\{Simulated 24K Rate\}\$\$\s*\$\$\\text\{Simulated Valuation Delta\} = \\text\{Projected Vault Value\} - \\text\{Base Valuation at Acquisition\}\$\$/g,
  `> **BULLION SIMULATOR FORMULAS:**  
> • **Projected Vault Value** = Total Vault Pure Gold (Grams) × Simulated 24K Rate  
> • **Simulated Valuation Delta** = Projected Vault Value − Base Valuation at Acquisition`
);

// Section 3.6 Batch to piece
content = content.replace(
  /\$\$\\sum \(\\text\{Individual Piece Gross Weights\}\) \\le \\text\{Master Item Total Stock Weight\}\$\$/g,
  `> **Mass Conservation Rule: Sum of all Individual Piece Gross Weights ≤ Master Item Total Stock Weight**`
);
content = content.replace(
  /\$\$\\text\{Remaining Weight\} = \\text\{Total Stock Weight\} - \\sum \(\\text\{Piece Gross Weights\}\)\$\$/g,
  `> **Remaining Stock Weight = Master Item Total Stock Weight − Sum of Piece Gross Weights**`
);

// Section 3.7 Split piece
content = content.replace(
  /\$\$\\sum \(\\text\{Split Pieces Net Wt\}\) = \\text\{Original Set Net Wt\}\$\$/g,
  `> **Mass Conservation Rule: Sum of all Split Pieces Net Weight = Original Set Net Weight**`
);

// Section 3.8.1 Order booking
content = content.replace(
  /\$= \\text\{rate\\_cut\\_gold\\_wt\} \\times \\text\{rate\\_cut\\_gold\\_rate\}\$/g,
  '= Rate Cut Gold Weight × Rate Cut Gold Rate'
);
content = content.replace(
  /\$\$\\text\{Total Order Value\} = \\sum \(\\text\{Line Item Amounts\}\)\$\$\s*\$\$\\text\{Taxes\} = \\text\{CalculateTaxes\}\(\\text\{Total Order Value\}, \\text\{gst\\_not\\_required\}\)\$\$\s*\$\$\\text\{Gross Order Total\} = \\text\{Total Order Value\} \+ \\text\{GST Amount\} - \\text\{Discount\}\$\$\s*\$\$\\text\{Total Advance Credited\} = \\text\{Cash Advance\} \+ \\text\{Bank Advance\} \+ \\text\{Rate Cut Amount\} \+ \\text\{Old Gold Amount\}\$\$\s*\$\$\\text\{Balance Due at Delivery\} = \\text\{Gross Order Total\} - \\text\{Total Advance Credited\}\$\$/g,
  `> **ORDER FINANCIAL SUMMARY FORMULAS:**  
> • **Total Order Value** = Sum of all Line Item Amounts  
> • **Taxes** = CalculateTaxes(Total Order Value, GST Exemption Flag)  
> • **Gross Order Total** = Total Order Value + GST Amount − Discount  
> • **Total Advance Credited** = Cash Advance + Bank Advance + Rate Cut Gold Amount + Old Gold Credit  
> • **Balance Due at Delivery** = Gross Order Total − Total Advance Credited`
);

// Section 3.8.3 Issue material
content = content.replace(
  /\$\$\\text\{Karagir Metal Balance\} \\leftarrow \\text\{Karagir Metal Balance\} \+ \\text\{Issued Fine Weight\}\$\$/g,
  `> **New Karagir Metal Balance = Current Karagir Metal Balance + Issued Fine Gold Weight**`
);

// Section 3.8.4 Receive order
content = content.replace(
  /\$\$\\text\{Total Metal Accounted\} = \\text\{Received Gross Wt\} \+ \\text\{Return Scrap Wt\}\$\$\s*\$\$\\text\{Actual Working Loss\} = \\text\{Issued Gross Wt\} - \\text\{Total Metal Accounted\}\$\$\s*\$\$\\text\{Allowed Wastage\} = \\frac\{\\text\{Received Net Wt\} \\times \\text\{Agreed Wastage\}\\\%\}\{100\}\$\$\s*\$\$\\text\{Net Variance\} = \\text\{Actual Working Loss\} - \\text\{Allowed Wastage\}\$\$/g,
  `> **ARTISAN METAL RECONCILIATION FORMULAS:**  
> • **Total Metal Accounted** = Received Gross Weight + Return Scrap Weight  
> • **Actual Working Loss** = Issued Gross Weight − Total Metal Accounted  
> • **Allowed Wastage Allowance** = (Received Net Weight × Agreed Wastage %) ÷ 100  
> • **Net Variance** = Actual Working Loss − Allowed Wastage Allowance  
> *(If Net Variance > 0, the artisan exceeded allowed wastage; excess metal loss is penalized and debited to artisan's cash ledger)*`
);

content = content.replace(/\$\\text\{Net Variance\} > 0\$/g, 'Net Variance > 0');

// Section 3.9 Counter POS
content = content.replace(
  /\$\$\\text\{Subtotal\} = \\sum \(\\text\{Item Total Amounts\}\)\$\$\s*\$\$\\text\{GST \(3\%\)\} = \\text\{Round\}\(\\text\{Subtotal\} \\times 0\.03, 2\) \\quad \\text\{\[If Tax Invoice\]\}\$\$\s*\$\$\\text\{Total Invoice Bill\} = \\text\{Subtotal\} \+ \\text\{GST\} - \\text\{Discount\}\$\$\s*\$\$\\text\{Net Due\} = \\text\{Total Invoice Bill\} - \\text\{Old Gold \(URD\) Credit\} - \\text\{Cash Tendered\} - \\text\{Bank\/UPI\/Card Tendered\}\$\$/g,
  `> **SALES INVOICE SETTLEMENT FORMULAS:**  
> • **Subtotal** = Sum of all Item Total Amounts  
> • **GST (3%)** = Round(Subtotal × 0.03, 2)  [If Tax Invoice Mode]  
> • **Total Invoice Bill** = Subtotal + GST Amount − Discount  
> • **Net Balance Due** = Total Invoice Bill − Old Gold (URD) Credit − Cash Tendered − Bank/UPI/Card Tendered`
);

// Section 3.10.2 Purchase
content = content.replace(
  /\$= \\text\{CalculateFinePlusWastage\}\(\\text\{net\\_wt\}, \\text\{purity\}, \\text\{wastage\\_pct\}\)\$/g,
  '= CalculateFinePlusWastage(Net Weight, Purity, Wastage %)'
);

// Section 3.11.2 Refinery
content = content.replace(
  /\$= \\text\{net\\_wt\} \\times \\frac\{\\text\{purity\}\}\{100\}\$/g,
  '= (Net Weight × Purity) ÷ 100'
);

// Section 3.12 Day book
content = content.replace(
  /\$\$\\text\{Cash Closing Balance\} = \\text\{Cash Opening\} \+ \\sum \(\\text\{Cash Received\}\) - \\sum \(\\text\{Cash Payment\}\)\$\$\s*\$\$\\text\{Bank Closing Balance\} = \\text\{Bank Opening\} \+ \\sum \(\\text\{Bank Received\}\) - \\sum \(\\text\{Bank Payment\}\)\$\$/g,
  `> **DAILY EOD RECONCILIATION FORMULAS:**  
> • **Cash Closing Balance** = Cash Opening + Sum of Cash Received − Sum of Cash Payments  
> • **Bank Closing Balance** = Bank Opening + Sum of Bank Received − Sum of Bank Payments`
);

// Section 3.16 Stock Refill
content = content.replace(
  /\$\$\\text\{Deficit Pieces\} = \\max\\Big\(0, \\text\{Desired Min Stock\} - \\text\{Current Stock\}\\Big\)\$\$/g,
  `> **Deficit Pieces = Maximum of [ 0, Desired Min Stock − Current Available Stock ]**`
);

content = content.replace(/\$\\le 20\\\%\$/g, '≤ 20%');
content = content.replace(/\$\\le 50\\\%\$/g, '≤ 50%');
content = content.replace(/\$\\ge\$/g, '≥');

content = content.replace(
  /\$\$\\text\{Estimated Refill Metal Weight \(g\)\} = \\text\{Deficit Pieces\} \\times \\text\{Average Gross Wt per Piece\}\$\$\s*\$\$\\text\{Estimated Procurement Value \(₹\)\} = \\text\{Estimated Refill Metal Weight\} \\times \\text\{Current Gold Rate\}\$\$/g,
  `> **ESTIMATED REPLENISHMENT REQUIREMENT:**  
> • **Estimated Refill Metal Weight (g)** = Deficit Pieces × Average Gross Weight per Piece  
> • **Estimated Procurement Value (₹)** = Estimated Refill Metal Weight × Current Gold Rate`
);

// Section 3.17 Gold Scheme
content = content.replace(
  /\$\$\\text\{Gold Accrued \(g\)\} = \\frac\{\\text\{Installment Amount\}\}\{\\text\{Spot 22K Rate on Deposit Day\}\}\$\$/g,
  `> **Accrued Pure Gold (g) = Monthly Installment Amount (₹) ÷ Spot 22K Gold Rate on Deposit Day (₹/g)**`
);

console.log('Writing updated plain English blueprint to:', mdPath);
fs.writeFileSync(mdPath, content, 'utf8');

// Copy to brain artifact path
const artifactMdPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\e778fe8e-15f3-46a3-9e8f-f17bebb032ae\\application_functional_blueprint.md';
fs.writeFileSync(artifactMdPath, content, 'utf8');
console.log('Updated artifact blueprint successfully.');
