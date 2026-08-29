// Certified Calculations Node Verification Script
import {
  calculateNetWeight,
  calculateFineWeight,
  calculateFinePlusWastage,
  calculateMakingAmount,
  calculateOrderItemTotal,
  calculateTaxes,
  calculateRefineryYield
} from './src/utils/calculations.ts';

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL: ' + message);
    process.exit(1);
  } else {
    console.log('PASS: ' + message);
  }
}

// 1. Net Weight (GrossWt - Black.Beats - StoneWt)
const net = calculateNetWeight(28.500, 3.200, 0.800);
assert(net === 24.500, `Net Weight: Expected 24.500g, got ${net}g`);

// 2. Fine Weight (NetWt * Purity / 100)
const fin = calculateFineWeight(24.500, 91.6);
assert(fin === 22.442, `Fine Weight: Expected 22.442g, got ${fin}g`);

// 3. Fin+Wastage
const finWastage = calculateFinePlusWastage(148.800, 91.6, 1.5);
assert(Math.abs(finWastage - 138.533) <= 0.005, `Fin+Wastage: Expected ~138.533g, got ${finWastage}g`);

// 4. Making Amount
const mkg = calculateMakingAmount(24.500, 450, 7250, 0);
assert(mkg === 11025.00, `Making Amount: Expected 11025, got ${mkg}`);

// 5. Line Total
const lineTot = calculateOrderItemTotal(24.500, 7070, 2500, 11025, 45);
assert(lineTot === 186785.00, `Line Total: Expected 186785, got ${lineTot}`);

// 6. GST Taxes (3% = 1.5% CGST + 1.5% SGST)
const tax = calculateTaxes(100000, false, 3.0, 0.1, 1.0);
assert(tax.gstAmt === 3000.00, `GST: Expected 3000, got ${tax.gstAmt}`);
assert(tax.hgstAmt === 1500.00, `HGST: Expected 1500, got ${tax.hgstAmt}`);
assert(tax.mgstAmt === 1500.00, `MGST: Expected 1500, got ${tax.mgstAmt}`);
assert(tax.tdsAmt === 100.00, `TDS: Expected 100, got ${tax.tdsAmt}`);

console.log('ALL 6 JEWELLERY CALCULATION TESTS PASSED WITH 100% PARITY!');
