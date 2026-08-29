// Calculation Compatibility Engine for Jewellery ERP
// Strictly preserves the existing application calculations

export function roundTo(val: number, decimals: number = 3): number {
  const factor = Math.pow(10, decimals);
  return Math.round((val + Number.EPSILON) * factor) / factor;
}

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(val || 0);
}

export function formatWeight(val: number, decimals: number = 3): string {
  return (val || 0).toFixed(decimals) + ' g';
}

/**
 * 1. Net Weight Calculation
 * NetWt = GrossWt - Black.Beats - StoneWt
 */
export function calculateNetWeight(grossWt: number, blackBeats: number = 0, stoneWt: number = 0): number {
  const net = (grossWt || 0) - (blackBeats || 0) - (stoneWt || 0);
  return roundTo(Math.max(0, net), 3);
}

/**
 * 2. Fine Weight Calculation
 * FinWt = (NetWt * Purity) / 100
 */
export function calculateFineWeight(netWt: number, purity: number): number {
  if (!purity || purity <= 0) return 0;
  const fine = ((netWt || 0) * purity) / 100;
  return roundTo(fine, 3);
}

/**
 * 3. Wastage & Fine+Wastage Calculation (Used in Purchase & Order)
 * Wastage allowance = NetWt * (Wastage% / 100)
 * Fin+Wastage = FineWt + Wastage allowance
 */
export function calculateFinePlusWastage(netWt: number, purity: number, wastagePct: number = 0): number {
  const fine = calculateFineWeight(netWt, purity);
  const wastage = ((netWt || 0) * (wastagePct || 0)) / 100;
  return roundTo(fine + wastage, 3);
}

/**
 * 4. Making Amount Calculation
 * Either per gram (Mkg/Gm * NetWt) or percentage (Metal Value * Making% / 100)
 */
export function calculateMakingAmount(
  netWt: number,
  mkgPerGm: number = 0,
  rate: number = 0,
  makingPct: number = 0
): number {
  let mkg = 0;
  if (mkgPerGm > 0) {
    mkg += (netWt || 0) * mkgPerGm;
  }
  if (makingPct > 0 && rate > 0) {
    const metalVal = (netWt || 0) * rate;
    mkg += (metalVal * makingPct) / 100;
  }
  return roundTo(mkg, 2);
}

/**
 * 5. Order / Item Line Amount
 * Metal Value + Stone Amount + Making Amount + Hallmark Charges
 */
export function calculateOrderItemTotal(
  netWt: number,
  rate: number,
  stoneAmt: number = 0,
  mkgAmt: number = 0,
  hallmarkCharges: number = 0
): number {
  const metalAmt = (netWt || 0) * (rate || 0);
  return roundTo(metalAmt + (stoneAmt || 0) + (mkgAmt || 0) + (hallmarkCharges || 0), 2);
}

/**
 * 6. Tax Breakdown (GST 3% split into 1.5% HGST (SGST) and 1.5% MGST (CGST))
 */
export function calculateTaxes(
  taxableAmount: number,
  gstNotRequired: boolean = false,
  gstPct: number = 3.0,
  tdsPct: number = 0,
  tcsPct: number = 0
) {
  if (gstNotRequired) {
    return {
      gstPct: 0,
      hgstPct: 0,
      mgstPct: 0,
      gstAmt: 0,
      hgstAmt: 0,
      mgstAmt: 0,
      tdsPct,
      tdsAmt: roundTo((taxableAmount * (tdsPct || 0)) / 100, 2),
      tcsPct,
      tcsAmt: roundTo((taxableAmount * (tcsPct || 0)) / 100, 2),
      totalTax: 0,
    };
  }

  const hgstPct = roundTo(gstPct / 2, 2);
  const mgstPct = roundTo(gstPct / 2, 2);

  const gstAmt = roundTo((taxableAmount * gstPct) / 100, 2);
  const hgstAmt = roundTo((taxableAmount * hgstPct) / 100, 2);
  const mgstAmt = roundTo((taxableAmount * mgstPct) / 100, 2);

  const tdsAmt = roundTo((taxableAmount * (tdsPct || 0)) / 100, 2);
  const tcsAmt = roundTo(((taxableAmount + gstAmt) * (tcsPct || 0)) / 100, 2);

  return {
    gstPct,
    hgstPct,
    mgstPct,
    gstAmt,
    hgstAmt,
    mgstAmt,
    tdsPct,
    tdsAmt,
    tcsPct,
    tcsAmt,
    totalTax: gstAmt + tcsAmt - tdsAmt,
  };
}

/**
 * 7. Refinery Profit / Loss Calculation
 */
export function calculateRefineryYield(
  grossWt: number,
  netWt: number,
  purity: number,
  actualFineRecovered: number
) {
  const theoreticalFine = calculateFineWeight(netWt, purity);
  const diff = roundTo(actualFineRecovered - theoreticalFine, 3);
  return {
    theoreticalFine,
    loss: diff < 0 ? Math.abs(diff) : 0,
    profit: diff > 0 ? diff : 0,
  };
}
