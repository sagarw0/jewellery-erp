import React, { useState } from 'react';
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  X,
  ExternalLink,
  Phone,
  Copy,
  Check,
  Building2,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  TrendingDown,
  Calculator,
  SlidersHorizontal,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { StockRefillItem, AuthUser } from '../../types/erp';

interface StockRefillAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  refillItems: StockRefillItem[];
  onUpdateRefillItem?: (item: StockRefillItem) => void;
  onOpenDetailedManager?: () => void;
  currentUser?: AuthUser | null;
  gold24kRate?: number;
  gold22kRate?: number;
}

export const StockRefillAlertModal: React.FC<StockRefillAlertModalProps> = ({
  isOpen,
  onClose,
  refillItems,
  onUpdateRefillItem,
  onOpenDetailedManager,
  currentUser,
  gold24kRate = 7650,
  gold22kRate = 7250,
}) => {
  const { isDark, computedTokens } = useTheme();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [orderedMap, setOrderedMap] = useState<Record<string, boolean>>({});
  const [customQtyMap, setCustomQtyMap] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  // STRICT REQUIREMENT: Only display items where current_stock < desired_stock
  const deficitItems = refillItems.filter(
    (item) => item.current_stock < item.desired_stock
  );

  const totalDeficitPcs = deficitItems.reduce(
    (sum, it) => sum + (it.desired_stock - it.current_stock),
    0
  );

  const totalDeficitEstWt = deficitItems.reduce(
    (sum, it) =>
      sum + (it.desired_stock - it.current_stock) * (it.gross_wt_per_unit || 15),
    0
  );

  const getCleanPhone = (phoneStr: string) => {
    const cleaned = phoneStr.replace(/\D/g, '');
    if (cleaned.length === 10) return `91${cleaned}`;
    return cleaned;
  };

  const generateWhatsAppMessage = (item: StockRefillItem, customQty?: number) => {
    const deficitQty = customQty !== undefined ? customQty : (item.desired_stock - item.current_stock);
    const estTotalWt = (deficitQty * (item.gross_wt_per_unit || 15)).toFixed(3);
    const today = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const branchName = currentUser?.branch || 'Mumbai Flagship Showroom';

    return `*SWARNA JEWELLERY ERP - URGENT STOCK REFILL ORDER* 🏆
------------------------------------------
📅 *Date:* ${today} | *PO Ref:* REFILL-${item.id.toUpperCase()}-${Date.now().toString().slice(-4)}
🏬 *Showroom:* ${branchName}

Namaste *${item.vendor_name}*,

Please process the following urgent inventory refill order for our showroom:

📦 *Item:* ${item.item_name}
💎 *Category / Purity:* ${item.category} (${item.purity}% BIS Certified)
🎯 *Showroom Desired Min Stock:* ${item.desired_stock} pcs
📉 *Sold in Current Period:* ${item.sold_stock} pcs
📦 *Current Floor Stock:* ${item.current_stock} pcs
------------------------------------------
⚡ *URGENT REFILL REQUIRED: ${deficitQty} pcs* (~${estTotalWt} gm)
------------------------------------------
⏰ *Required Delivery:* Within 24-48 Business Hours

Please confirm receipt of this Job Order and provide estimated completion time.

_Authorized by: ${currentUser?.name || 'Inventory Manager'} (Swarna ERP v2.6)_`;
  };

  const handleSendWhatsApp = (item: StockRefillItem) => {
    const qty = customQtyMap[item.id] !== undefined ? customQtyMap[item.id] : (item.desired_stock - item.current_stock);
    const message = generateWhatsAppMessage(item, qty);
    const cleanPhone = getCleanPhone(item.vendor_phone);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // Mark as ordered
    setOrderedMap((prev) => ({ ...prev, [item.id]: true }));
    if (onUpdateRefillItem) {
      onUpdateRefillItem({
        ...item,
        is_ordered: true,
        last_order_timestamp: new Date().toISOString(),
      });
    }

    window.open(waUrl, '_blank');
  };

  const handleCopyMessage = (item: StockRefillItem) => {
    const qty = customQtyMap[item.id] !== undefined ? customQtyMap[item.id] : (item.desired_stock - item.current_stock);
    const message = generateWhatsAppMessage(item, qty);
    navigator.clipboard.writeText(message);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendAllBatchWhatsApp = () => {
    if (deficitItems.length === 0) return;
    const today = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const branchName = currentUser?.branch || 'Mumbai Flagship Showroom';

    let batchText = `*SWARNA JEWELLERY ERP - DAILY CONSOLIDATED REFILL MANIFEST* 🏆\n`;
    batchText += `📅 *Date:* ${today} | 🏬 *Showroom:* ${branchName}\n`;
    batchText += `⚡ *Total Low Items:* ${deficitItems.length} SKUs | *Total Pcs:* ${totalDeficitPcs} pcs (~${totalDeficitEstWt.toFixed(2)} gm)\n\n`;

    deficitItems.forEach((it, idx) => {
      const defQty = it.desired_stock - it.current_stock;
      const wt = (defQty * (it.gross_wt_per_unit || 15)).toFixed(2);
      batchText += `${idx + 1}. *${it.item_name}* (${it.category} ${it.purity}%)\n`;
      batchText += `   Desired: ${it.desired_stock} | Sold: ${it.sold_stock} | Current: ${it.current_stock}\n`;
      batchText += `   👉 *Refill: ${defQty} pcs (~${wt}g)* -> Vendor: ${it.vendor_name}\n\n`;
    });

    batchText += `_Please dispatch supplies at earliest. Sent via Swarna ERP Live Inventory._`;

    // Open first vendor or general dispatch
    const firstPhone = getCleanPhone(deficitItems[0]?.vendor_phone || '9820123456');
    const waUrl = `https://wa.me/${firstPhone}?text=${encodeURIComponent(batchText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-[#0b1324] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Top Header */}
        <div
          className={`px-6 py-4.5 border-b flex items-center justify-between gap-4 ${
            isDark
              ? 'bg-[#070b14]/90 border-white/10'
              : 'bg-gradient-to-r from-amber-500/10 via-amber-50/80 to-sky-50/80 border-amber-200/80'
          }`}
        >
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 shadow-md">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold tracking-normal">
                  Morning Stock Refill & Inventory Alert
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-400/30">
                  {deficitItems.length} Deficit SKUs
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/30 hidden sm:inline-block">
                  First Login Today
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {currentUser?.branch || 'Mumbai Flagship Showroom'} • Floor inventory dropped below target thresholds.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenDetailedManager && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDetailedManager();
                }}
                className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/10 text-white hover:bg-white/15 border-white/15'
                    : 'bg-white text-slate-800 hover:bg-slate-50 border-slate-300 shadow-2xs'
                }`}
                title="Open Detailed Target & Refill Management Hub"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                <span>Manage Targets</span>
              </button>
            )}

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isDark
                  ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
              title="Close and Dismiss Today's Alert"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formula Cards & Metrics Banner */}
        <div
          className={`p-4 sm:p-5 border-b ${
            isDark ? 'bg-[#0f172a]/70 border-white/10' : 'bg-slate-50/90 border-slate-200'
          }`}
        >
          {/* Visual Formula Card Highlight */}
          <div
            className={`p-3.5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs ${
              isDark
                ? 'bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-indigo-500/10 border-amber-400/20'
                : 'bg-white border-amber-300 shadow-xs'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-2xs">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                Live Inventory Rule:
              </span>
            </div>

            {/* Formula visual calculation pills */}
            <div className="flex items-center flex-wrap gap-2 text-xs font-mono font-bold justify-center">
              <div
                className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 font-semibold ${
                  isDark
                    ? 'bg-blue-500/25 text-blue-200 border-blue-400/50'
                    : 'bg-blue-100 text-blue-950 border-blue-400 shadow-2xs'
                }`}
              >
                <span>Desired Stock</span>
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">−</span>
              <div
                className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 font-semibold ${
                  isDark
                    ? 'bg-rose-500/25 text-rose-200 border-rose-400/50'
                    : 'bg-rose-100 text-rose-950 border-rose-400 shadow-2xs'
                }`}
              >
                <span>Sold Stock</span>
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">=</span>
              <div
                className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 font-semibold ${
                  isDark
                    ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50'
                    : 'bg-emerald-100 text-emerald-950 border-emerald-400 shadow-2xs'
                }`}
              >
                <span>Current Stock</span>
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">➔</span>
              <div
                className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 font-semibold ${
                  isDark
                    ? 'bg-amber-500/30 text-amber-200 border-amber-400/60'
                    : 'bg-amber-200 text-amber-950 border-amber-500 shadow-2xs'
                }`}
              >
                <span>Deficit Needed</span>
              </div>
            </div>

            {/* Quick summary numbers */}
            <div className="flex items-center space-x-3 text-xs font-sans">
              <div className="text-right">
                <span className="text-[11px] block text-slate-700 dark:text-slate-300 font-semibold">
                  Total Shortfall
                </span>
                <span className="font-bold text-sm text-rose-700 dark:text-rose-300 font-mono">
                  {totalDeficitPcs} Pcs (~{totalDeficitEstWt.toFixed(1)}g)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body - STRICTLY ONLY DEFICIT ITEMS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {deficitItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold">All Stock Levels are Healthy</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                All inventory items currently meet or exceed their desired stock levels. No vendor refills required this morning.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deficitItems.map((item) => {
                const deficitQty = item.desired_stock - item.current_stock;
                const stockHealthPct = Math.round((item.current_stock / item.desired_stock) * 100);
                const estWeight = (deficitQty * (item.gross_wt_per_unit || 15)).toFixed(2);
                const isOrdered = orderedMap[item.id] || item.is_ordered;
                const customQty = customQtyMap[item.id] !== undefined ? customQtyMap[item.id] : deficitQty;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between ${
                      isDark
                        ? 'bg-[#0f172a]/90 border-white/10 hover:border-amber-400/40 shadow-md'
                        : 'bg-white border-slate-200/90 hover:border-amber-300 shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Item Top Badge Row */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                              item.status === 'critical'
                                ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-400/50'
                                : 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-400/50'
                            }`}
                          >
                            {item.status === 'critical' ? '🔴 Critical Deficit' : '🟡 Low Stock'}
                          </span>
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-white/15 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20">
                            {item.category} • {item.purity}%
                          </span>
                        </div>

                        {isOrdered && (
                          <span className="flex items-center space-x-1 text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            <Check className="w-3.5 h-3.5" />
                            <span>Ordered</span>
                          </span>
                        )}
                      </div>

                      {/* Item Title - High Contrast & Clearly Visible */}
                      <h4 className="text-base font-bold text-slate-950 dark:text-white leading-snug mb-3 tracking-normal">
                        {item.item_name || 'Jewellery Stock Item'}
                      </h4>

                      {/* The Mathematical Cards Strip */}
                      <div className="grid grid-cols-4 gap-1.5 p-2.5 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center mb-3">
                        <div>
                          <span className="text-[10px] uppercase font-medium text-slate-700 dark:text-slate-300 block">
                            Desired
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">
                            {item.desired_stock} pcs
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-medium text-slate-700 dark:text-slate-300 block">
                            Sold
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-300">
                            {item.sold_stock} pcs
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-medium text-slate-700 dark:text-slate-300 block">
                            Current
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300">
                            {item.current_stock} pcs
                          </span>
                        </div>
                        <div className="bg-amber-500/20 dark:bg-amber-500/30 rounded-lg p-1 border border-amber-400/40">
                          <span className="text-[10px] uppercase font-bold text-amber-950 dark:text-amber-200 block">
                            Refill
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300">
                            +{deficitQty} pcs
                          </span>
                        </div>
                      </div>

                      {/* Stock Level Progress Bar */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          <span>Stock Availability</span>
                          <span className="font-bold">{stockHealthPct}% of Desired Level</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              stockHealthPct <= 25 ? 'bg-rose-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(8, stockHealthPct))}%` }}
                          />
                        </div>
                      </div>

                      {/* Assigned Vendor Information - High Contrast & Clearly Visible */}
                      <div className={`flex items-center justify-between p-2.5 rounded-xl border text-xs mb-3.5 ${
                        isDark ? 'bg-white/10 border-white/15' : 'bg-slate-100 border-slate-300/90'
                      }`}>
                        <div className="flex items-center space-x-2 min-w-0">
                          <div className="p-1 rounded-lg bg-amber-500 text-slate-950 shrink-0 shadow-2xs">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 block leading-tight uppercase tracking-wider">
                              Assigned Maker / Supplier:
                            </span>
                            <span className="font-bold text-slate-950 dark:text-white block text-xs truncate">
                              {item.vendor_name || 'Direct Artisan Workshop'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 shrink-0">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{item.vendor_phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Row: WhatsApp 1-Click Refill & Copy Button */}
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleCopyMessage(item)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1 transition-all cursor-pointer ${
                          copiedId === item.id
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : isDark
                            ? 'bg-white/5 text-slate-300 hover:bg-white/10 border-white/10'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                        title="Copy pre-formatted order message to clipboard"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy PO</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSendWhatsApp(item)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                        title="Open WhatsApp with pre-filled Jewellery Refill Order"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Refill via WhatsApp ({deficitQty} pcs)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div
          className={`p-4 sm:p-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDark ? 'bg-[#070b14]/90 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>
              Alert recorded for today • Next reminder tomorrow morning at 09:00 AM
            </span>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            {deficitItems.length > 0 && (
              <button
                onClick={handleSendAllBatchWhatsApp}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                title="Send full consolidated low stock list to Maker via WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch All Refills via WhatsApp ({totalDeficitPcs} pcs)</span>
              </button>
            )}

            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/10 hover:bg-white/15 text-white border-white/20'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-2xs'
              }`}
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
