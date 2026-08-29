// Standalone Verification Suite for Jewellery ERP Calculations
// Mandated by Section 46 of Field-Preserved Modernization Specification

import {
  calculateNetWeight,
  calculateFineWeight,
  calculateFinePlusWastage,
  calculateMakingAmount,
  calculateOrderItemTotal,
  calculateTaxes,
  calculateRefineryYield,
  formatCurrency,
  formatWeight
} from './calculations.js';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

console.log('--- RUNNING JEWELLERY ERP CALCULATION CERTIFICATION ---');

// 1. Net Weight Test (GrossWt - Black.Beats - StoneWt)
// Spec: GrossWt 28.5g, Black.Beats 3.2g, StoneWt 0.8g => NetWt 24.5g
const netWt = calculateNetWeight(28.500, 3.200, 0.800);
assert(netWt === 24.500, `Net Weight Calculation: Expected 24.500g, got ${netWt}g`);

// 2. Fine Weight Test ((NetWt * Purity) / 100)
// NetWt 24.5g, Purity 91.6% (22K) => 22.442g pure gold
const finWt = calculateFineWeight(24.500, 91.6);
assert(finWt === 22.442, `Fine Weight Calculation: Expected 22.442g, got ${finWt}g`);

// 3. Wastage & Fin+Wastage Test (FinWt + (NetWt * Wastage% / 100))
// NetWt 148.8g, Purity 91.6%, Wastage 1.5% => Fin+Wastage 138.532g
const finPlusWastage = calculateFinePlusWastage(148.800, 91.6, 1.5);
assert(finPlusWastage === 138.533 || Math.abs(finPlusWastage - 138.533) <= 0.002, `Fin+Wastage: Expected ~138.533g, got ${finPlusWastage}g`);

// 4. Making Amount Test (Mkg/Gm * NetWt)
// NetWt 24.5g, Mkg/Gm ₹450 => ₹11,025
const mkgAmt = calculateMakingAmount(24.500, 450, 7250, 0);
assert(mkgAmt === 11025.00, `Making Amount: Expected ₹11,025, got ₹${mkgAmt}`);

// 5. Line Item Total Amount (NetWt * Rate + StoneAmt + MkgAmt + HallmarkCharges)
// NetWt 24.5g * ₹7,070/g + Stone ₹2,500 + Making ₹11,025 + Hallmark ₹45
const lineTotal = calculateOrderItemTotal(24.500, 7070, 2500, 11025, 45);
const expectedTotal = 24.500 * 7070 + 2500 + 11025 + 45; // 173215 + 2500 + 11025 + 45 = 186785
assert(lineTotal === 186785.00, `Line Total Amount: Expected ₹186,785, got ₹${lineTotal}`);

// 6. Tax Breakdown (GST 3% = 1.5% HGST (SGST) + 1.5% MGST (CGST))
const taxes = calculateTaxes(100000, false, 3.0, 0.1, 1.0);
assert(taxes.gstAmt === 3000.00, `GST 3%: Expected ₹3,000, got ₹${taxes.gstAmt}`);
assert(taxes.hgstAmt === 1500.00, `HGST 1.5%: Expected ₹1,500, got ₹${taxes.hgstAmt}`);
assert(taxes.mgstAmt === 1500.00, `MGST 1.5%: Expected ₹1,500, got ₹${taxes.mgstAmt}`);
assert(taxes.tdsAmt === 100.00, `TDS 0.1%: Expected ₹100, got ₹${taxes.tdsAmt}`);

// 7. Refinery Yield & Variance
// Inward 138.2g Net scrap at 88.5% touch => Theoretical Pure: 122.307g. Actual recovered 121.857g => Loss 0.450g
const refineryYield = calculateRefineryYield(142.500, 138.200, 88.5, 121.857);
assert(refineryYield.loss === 0.450, `Refinery Loss: Expected 0.450g, got ${refineryYield.loss}g`);

console.log('--- ALL CALCULATION COMPATIBILITY CHECKS PASSED ---');
