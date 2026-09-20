import React, { useState } from 'react';
import {
  Boxes,
  SlidersHorizontal,
  Send,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Check,
  X,
  Building2,
  Phone,
  Calculator,
  Download,
  Printer,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  ArrowUpDown,
  Copy,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { StockRefillItem, AuthUser, Vendor, Karagir } from '../../types/erp';
import { formatCurrency, formatWeight } from '../../utils/calculations';

interface StockRefillManagerViewProps {
  refillItems: StockRefillItem[];
  onUpdateRefillItem: (item: StockRefillItem) => void;
  onAddRefillItem?: (item: StockRefillItem) => void;
  onOpenAlertModal?: () => void;
  currentUser?: AuthUser | null;
  vendors?: Vendor[];
  karagirs?: Karagir[];
  gold24kRate?: number;
  gold22kRate?: number;
}

export const StockRefillManagerView: React.FC<StockRefillManagerViewProps> = ({
  refillItems,
  onUpdateRefillItem,
  onAddRefillItem,
  onOpenAlertModal,
  currentUser,
  vendors = [],
  karagirs = [],
  gold24kRate = 7650,
  gold22kRate = 7250,
}) => {
  const { isDark, computedTokens } = useTheme();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'deficit_only' | 'critical' | 'adequate'>('all');

  // Inline editing state for Desired Stock target
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesiredQty, setEditDesiredQty] = useState<number>(0);
  const [editVendorName, setEditVendorName] = useState<string>('');
  const [editVendorPhone, setEditVendorPhone] = useState<string>('');

  // Add Item Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Gold');
  const [newItemPurity, setNewItemPurity] = useState(91.6);
  const [newItemDesired, setNewItemDesired] = useState(10);
  const [newItemCurrent, setNewItemCurrent] = useState(5);
  const [newItemSold, setNewItemSold] = useState(5);
  const [newItemUnitWt, setNewItemUnitWt] = useState(15.0);
  const [newItemVendor, setNewItemVendor] = useState('Shree Ganesh Karagir Works');
  const [newItemPhone, setNewItemPhone] = useState('9820123456');

  // WhatsApp Single Item preview modal
  const [previewItem, setPreviewItem] = useState<StockRefillItem | null>(null);
  const [customOrderQty, setCustomOrderQty] = useState<number>(0);
  const [customNotes, setCustomNotes] = useState<string>('Urgent delivery required.');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter items
  const filteredItems = refillItems.filter((item) => {
    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = item.item_name.toLowerCase().includes(q);
      const matchVendor = item.vendor_name.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      if (!matchName && !matchVendor && !matchCategory) return false;
    }

    // Category
    if (categoryFilter !== 'all' && item.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }

    // Status
    if (statusFilter === 'deficit_only' && item.current_stock >= item.desired_stock) {
      return false;
    }
    if (statusFilter === 'critical' && item.status !== 'critical') {
      return false;
    }
    if (statusFilter === 'adequate' && item.current_stock < item.desired_stock) {
      return false;
    }

    return true;
  });

  // KPI Calculations
  const totalSKUs = refillItems.length;
  const deficitItemsList = refillItems.filter((i) => i.current_stock < i.desired_stock);
  const totalDeficitCount = deficitItemsList.length;
  const totalDeficitPcs = deficitItemsList.reduce(
    (acc, it) => acc + (it.desired_stock - it.current_stock),
    0
  );
  const totalDeficitEstWt = deficitItemsList.reduce(
    (acc, it) => acc + (it.desired_stock - it.current_stock) * (it.gross_wt_per_unit || 15),
    0
  );

  const handleStartEdit = (item: StockRefillItem) => {
    setEditingId(item.id);
    setEditDesiredQty(item.desired_stock);
    setEditVendorName(item.vendor_name);
    setEditVendorPhone(item.vendor_phone);
  };

  const handleSaveEdit = (item: StockRefillItem) => {
    const desired = Math.max(0, Number(editDesiredQty) || 0);
    const deficit = desired - item.current_stock;
    const newStatus =
      deficit <= 0
        ? 'adequate'
        : item.current_stock <= Math.ceil(desired * 0.25)
        ? 'critical'
        : 'low';

    const updated: StockRefillItem = {
      ...item,
      desired_stock: desired,
      vendor_name: editVendorName.trim() || item.vendor_name,
      vendor_phone: editVendorPhone.trim() || item.vendor_phone,
      status: newStatus,
    };

    onUpdateRefillItem(updated);
    setEditingId(null);
  };

  const handleQuickAdjustDesired = (item: StockRefillItem, delta: number) => {
    const newDesired = Math.max(0, item.desired_stock + delta);
    const deficit = newDesired - item.current_stock;
    const newStatus =
      deficit <= 0
        ? 'adequate'
        : item.current_stock <= Math.ceil(newDesired * 0.25)
        ? 'critical'
        : 'low';

    onUpdateRefillItem({
      ...item,
      desired_stock: newDesired,
      status: newStatus,
    });
  };

  const getCleanPhone = (phoneStr: string) => {
    const cleaned = phoneStr.replace(/\D/g, '');
    if (cleaned.length === 10) return `91${cleaned}`;
    return cleaned;
  };

  const generateWhatsAppMessage = (
    item: StockRefillItem,
    orderQty: number,
    notes?: string
  ) => {
    const estTotalWt = (orderQty * (item.gross_wt_per_unit || 15)).toFixed(3);
    const today = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const branchName = currentUser?.branch || 'Mumbai Flagship Showroom';

    return `*SWARNA JEWELLERY ERP - STOCK REFILL PURCHASE ORDER* 🏆
------------------------------------------
📅 *Date:* ${today} | *PO Ref:* PO-REFILL-${item.id.toUpperCase()}-${Date.now().toString().slice(-4)}
🏬 *Showroom:* ${branchName}

Dear *${item.vendor_name}*,

Please accept the following jewellery inventory refill order:

📦 *Item:* ${item.item_name}
💎 *Purity / Group:* ${item.category} (${item.purity}% BIS Hallmarked)
🎯 *Desired Min Level:* ${item.desired_stock} pcs
📉 *Sold in Current Period:* ${item.sold_stock} pcs
📦 *Current Floor Balance:* ${item.current_stock} pcs
------------------------------------------
⚡ *QUANTITY TO REFILL / CAST: ${orderQty} pcs* (~${estTotalWt} gm)
------------------------------------------
📝 *Remarks / Notes:* ${notes || 'Standard hallmark specifications. Fast-track delivery requested.'}

Please acknowledge receipt and share job completion delivery timeline.

_Authorized by: ${currentUser?.name || 'Inventory Manager'} (Swarna ERP Enterprise)_`;
  };

  const handleOpenWhatsAppPreview = (item: StockRefillItem) => {
    const def = Math.max(1, item.desired_stock - item.current_stock);
    setPreviewItem(item);
    setCustomOrderQty(def);
    setCustomNotes('Urgent hallmark casting order. Required within 48 hours.');
  };

  const handleSendCustomWhatsApp = () => {
    if (!previewItem) return;
    const msg = generateWhatsAppMessage(previewItem, customOrderQty, customNotes);
    const cleanPhone = getCleanPhone(previewItem.vendor_phone);
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

    onUpdateRefillItem({
      ...previewItem,
      is_ordered: true,
      last_order_timestamp: new Date().toISOString(),
    });

    setPreviewItem(null);
    window.open(url, '_blank');
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const desired = Number(newItemDesired) || 10;
    const current = Number(newItemCurrent) || 0;
    const sold = Number(newItemSold) || 0;
    const deficit = desired - current;

    const newItem: StockRefillItem = {
      id: `stk-${Date.now()}`,
      item_name: newItemName.trim(),
      category: newItemCategory,
      purity: Number(newItemPurity) || 91.6,
      desired_stock: desired,
      sold_stock: sold,
      current_stock: current,
      gross_wt_per_unit: Number(newItemUnitWt) || 15.0,
      vendor_name: newItemVendor.trim() || 'Central Karagir Unit',
      vendor_phone: newItemPhone.trim() || '9820123456',
      status: deficit <= 0 ? 'adequate' : current <= Math.ceil(desired * 0.25) ? 'critical' : 'low',
      urgency: deficit > 5 ? 'HIGH' : 'MEDIUM',
      is_ordered: false,
    };

    if (onAddRefillItem) {
      onAddRefillItem(newItem);
    } else {
      onUpdateRefillItem(newItem);
    }

    setShowAddModal(false);
    setNewItemName('');
  };

  const handleExportCSV = () => {
    const headers = [
      'Item Name',
      'Category',
      'Purity (%)',
      'Desired Stock (Pcs)',
      'Sold Stock (Pcs)',
      'Current Stock (Pcs)',
      'Deficit to Refill (Pcs)',
      'Unit Wt (g)',
      'Total Refill Wt (g)',
      'Status',
      'Vendor Name',
      'Vendor Phone',
    ];
    const rows = filteredItems.map((i) => {
      const def = Math.max(0, i.desired_stock - i.current_stock);
      const wt = (def * (i.gross_wt_per_unit || 15)).toFixed(2);
      return [
        `"${i.item_name}"`,
        i.category,
        i.purity,
        i.desired_stock,
        i.sold_stock,
        i.current_stock,
        def,
        i.gross_wt_per_unit || 15,
        wt,
        i.status.toUpperCase(),
        `"${i.vendor_name}"`,
        `"${i.vendor_phone}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Stock_Refill_Targets_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & Action Toolbar */}
      <div
        className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 shadow-xs ${
          isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shadow-xs">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                Stock Refill & Desired Targets Management Hub
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/30">
                Formula Enabled
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure target minimum stock levels for every SKU, calculate sold vs available floor deficit, and dispatch WhatsApp purchase orders to makers.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          {onOpenAlertModal && (
            <button
              onClick={onOpenAlertModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 text-xs font-bold transition-all cursor-pointer"
              title="Preview the Morning First-Login Popup Alert"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Show 1st-Login Alert ({totalDeficitCount})</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-black shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Target SKU</span>
          </button>

          <button
            onClick={handleExportCSV}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDark
                ? 'bg-white/5 text-slate-200 hover:bg-white/10 border-white/10'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300 shadow-2xs'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDark
                ? 'bg-white/5 text-slate-200 hover:bg-white/10 border-white/10'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-300 shadow-2xs'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Mathematical Rule Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
          isDark
            ? 'bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-indigo-500/10 border-amber-400/20'
            : 'bg-white border-amber-300 shadow-2xs'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
              Core Inventory Math:
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Floor balance is dynamically updated as sales invoices are billed.
            </span>
          </div>
        </div>

        {/* Formula Representation */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono font-black justify-center">
          <div className="px-3 py-1.5 rounded-xl border bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-400/30">
            Desired Stock (Target)
          </div>
          <span className="text-base font-black opacity-60">−</span>
          <div className="px-3 py-1.5 rounded-xl border bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-400/30">
            Sold Stock
          </div>
          <span className="text-base font-black opacity-60">=</span>
          <div className="px-3 py-1.5 rounded-xl border bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-400/30">
            Current Stock (Available)
          </div>
          <span className="text-base font-black opacity-60">➔</span>
          <div className="px-3 py-1.5 rounded-xl border bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-400/50">
            Shortfall to Refill
          </div>
        </div>
      </div>

      {/* 4 Summary KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Monitored Inventory SKUs
            </span>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black mt-1 text-slate-900 dark:text-white">
            {totalSKUs} <span className="text-xs font-normal text-slate-500">Items</span>
          </div>
          <span className="text-[10.5px] text-slate-400 block mt-0.5">
            Active showroom target lines
          </span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Items in Deficit
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-black mt-1 text-rose-600 dark:text-rose-400">
            {totalDeficitCount}{' '}
            <span className="text-xs font-normal text-rose-500">
              ({Math.round((totalDeficitCount / (totalSKUs || 1)) * 100)}%)
            </span>
          </div>
          <span className="text-[10.5px] text-slate-400 block mt-0.5">
            Require maker PO dispatch
          </span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Total Deficit Quantity
            </span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black mt-1 text-amber-600 dark:text-amber-400">
            +{totalDeficitPcs} <span className="text-xs font-normal text-slate-500">Pcs</span>
          </div>
          <span className="text-[10.5px] text-slate-400 block mt-0.5">
            Shortfall across all categories
          </span>
        </div>

        <div
          className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Estimated Refill Weight
            </span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black mt-1 text-emerald-600 dark:text-emerald-400">
            ~{totalDeficitEstWt.toFixed(2)}{' '}
            <span className="text-xs font-normal text-slate-500">gm</span>
          </div>
          <span className="text-[10.5px] text-slate-400 block mt-0.5">
            Approx. bullion casting weight
          </span>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div
        className={`p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ornament name, supplier or category..."
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/15 text-white placeholder-slate-500 focus:border-amber-400'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
              }`}
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isDark
                ? 'bg-white/5 border-white/15 text-white'
                : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <option value="all">All Categories</option>
            <option value="Gold">Gold (22K / 18K / 24K)</option>
            <option value="Silver">Silver (92.5%)</option>
            <option value="Diamond">Diamond Ornaments</option>
            <option value="Platinum">Platinum (950)</option>
          </select>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 p-0.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-amber-500 text-slate-900 dark:text-slate-950 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              All ({totalSKUs})
            </button>
            <button
              onClick={() => setStatusFilter('deficit_only')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'deficit_only'
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-rose-600 dark:text-slate-400'
              }`}
            >
              Deficit Only ({totalDeficitCount})
            </button>
            <button
              onClick={() => setStatusFilter('adequate')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'adequate'
                  ? 'bg-emerald-500 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-emerald-600 dark:text-slate-400'
              }`}
            >
              Healthy ({totalSKUs - totalDeficitCount})
            </button>
          </div>
        </div>
      </div>

      {/* Main Stock Refill Management Table */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-xs ${
          isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white border-slate-200'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr
                className={`border-b font-mono font-bold uppercase tracking-wider text-[10.5px] ${
                  isDark
                    ? 'bg-[#070b14]/90 text-slate-300 border-white/10'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <th className="p-3.5 pl-4">Item & Specification</th>
                <th className="p-3.5 text-center">Category / Purity</th>
                <th className="p-3.5 text-center">Desired Stock (Min Target)</th>
                <th className="p-3.5 text-center">Sold Stock</th>
                <th className="p-3.5 text-center">Current Stock</th>
                <th className="p-3.5 text-center">Shortfall Deficit</th>
                <th className="p-3.5">Assigned Maker / Vendor</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right pr-4">WhatsApp PO Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-slate-500">
                    No matching stock items found for current filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isEditing = editingId === item.id;
                  const deficit = item.desired_stock - item.current_stock;
                  const hasDeficit = deficit > 0;
                  const isCritical = item.status === 'critical';

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        hasDeficit
                          ? isCritical
                            ? 'bg-rose-500/5 hover:bg-rose-500/10'
                            : 'bg-amber-500/5 hover:bg-amber-500/10'
                          : isDark
                          ? 'hover:bg-white/5'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Item Name */}
                      <td className="p-3.5 pl-4 font-black text-slate-950 dark:text-white">
                        <div className="flex items-center space-x-2">
                          <div>
                            <span className="block text-xs font-black text-slate-950 dark:text-white">{item.item_name}</span>
                            <span className="text-[10.5px] text-slate-600 dark:text-slate-300 font-semibold">
                              Unit Wt: ~{item.gross_wt_per_unit || 15}g
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Purity */}
                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[10.5px] font-black bg-slate-200 dark:bg-white/15 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20">
                          {item.category} • {item.purity}%
                        </span>
                      </td>

                      {/* Desired Stock Target (INLINE EDITABLE) */}
                      <td className="p-3.5 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center space-x-1">
                            <input
                              type="number"
                              min="0"
                              value={editDesiredQty}
                              onChange={(e) => setEditDesiredQty(Number(e.target.value))}
                              className="w-16 px-2 py-1 text-center font-bold text-xs rounded border border-amber-500 bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200"
                            />
                            <button
                              onClick={() => handleSaveEdit(item)}
                              className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                              title="Save Target"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 rounded bg-slate-400 text-white hover:bg-slate-500 cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-1.5 group">
                            <button
                              onClick={() => handleQuickAdjustDesired(item, -1)}
                              className="w-5 h-5 rounded flex items-center justify-center bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Decrease desired target by 1"
                            >
                              -
                            </button>
                            <span className="font-mono font-black text-xs text-blue-700 dark:text-blue-300 min-w-[32px] text-center">
                              {item.desired_stock} pcs
                            </span>
                            <button
                              onClick={() => handleQuickAdjustDesired(item, +1)}
                              className="w-5 h-5 rounded flex items-center justify-center bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-amber-500 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Increase desired target by 1"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1 text-slate-500 hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                              title="Edit Desired Target & Vendor"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Sold Stock */}
                      <td className="p-3.5 text-center font-mono font-black text-rose-700 dark:text-rose-300">
                        {item.sold_stock} pcs
                      </td>

                      {/* Current Stock */}
                      <td className="p-3.5 text-center font-mono font-black text-emerald-700 dark:text-emerald-300">
                        {item.current_stock} pcs
                      </td>

                      {/* Shortfall Deficit */}
                      <td className="p-3.5 text-center">
                        {hasDeficit ? (
                          <span className="px-2.5 py-1 rounded-xl font-mono font-black text-xs bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-400/40">
                            +{deficit} pcs (~{(deficit * (item.gross_wt_per_unit || 15)).toFixed(1)}g)
                          </span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 font-black text-xs">
                            ✓ Adequate (0)
                          </span>
                        )}
                      </td>

                      {/* Assigned Vendor */}
                      <td className="p-3.5">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded-lg bg-amber-500 text-slate-950 shrink-0">
                            <Building2 className="w-3 h-3" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-black text-slate-950 dark:text-white block truncate max-w-[170px] text-xs">
                              {item.vendor_name}
                            </span>
                            <span className="text-[10.5px] text-slate-700 dark:text-slate-300 font-mono font-bold block">
                              {item.vendor_phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            item.status === 'critical'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-400/30'
                              : item.status === 'low'
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/30'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-400/30'
                          }`}
                        >
                          {item.status === 'critical'
                            ? '🔴 Critical'
                            : item.status === 'low'
                            ? '🟡 Low'
                            : '🟢 Healthy'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-3.5 text-right pr-4">
                        {hasDeficit ? (
                          <button
                            onClick={() => handleOpenWhatsAppPreview(item)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs shadow-xs inline-flex items-center space-x-1.5 transition-all cursor-pointer"
                            title="Generate and dispatch WhatsApp PO"
                          >
                            <Send className="w-3 h-3" />
                            <span>Refill WhatsApp (+{deficit})</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Target Met
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Message Preview & Dispatch Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 space-y-4 ${
              isDark ? 'bg-[#0f172a] border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-500 text-white">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black">Dispatch WhatsApp Refill Order</h3>
                  <p className="text-xs text-slate-400">
                    Vendor: {previewItem.vendor_name} ({previewItem.vendor_phone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Editable Order Parameters */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Refill Quantity (Pcs)
                </label>
                <input
                  type="number"
                  min="1"
                  value={customOrderQty}
                  onChange={(e) => setCustomOrderQty(Number(e.target.value))}
                  className={`w-full px-3 py-1.5 rounded-xl border font-bold ${
                    isDark ? 'bg-white/5 border-white/15' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Est. Casting Weight (gm)
                </label>
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 font-mono font-bold">
                  ~{(customOrderQty * (previewItem.gross_wt_per_unit || 15)).toFixed(2)} gm
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Custom Remarks / Delivery Instructions
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs ${
                  isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300'
                }`}
                placeholder="Add special instructions or delivery deadlines..."
              />
            </div>

            {/* WhatsApp Message Preview Box */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Live WhatsApp Message Preview
              </label>
              <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] font-mono whitespace-pre-line text-emerald-300 max-h-44 overflow-y-auto">
                {generateWhatsAppMessage(previewItem, customOrderQty, customNotes)}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    generateWhatsAppMessage(previewItem, customOrderQty, customNotes)
                  );
                  setCopiedId(previewItem.id);
                  setTimeout(() => setCopiedId(null), 2000);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isDark ? 'border-white/15 hover:bg-white/10' : 'border-slate-300 hover:bg-slate-100'
                }`}
              >
                {copiedId === previewItem.id ? '✓ Copied' : 'Copy Text'}
              </button>

              <button
                onClick={handleSendCustomWhatsApp}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open in WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New SKU Target Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 space-y-4 ${
              isDark ? 'bg-[#0f172a] border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black">Add New Stock Refill Target SKU</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Item Description / Name *
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. 22K 916 Royal Peacock Kada Pair"
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/15' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      isDark ? 'bg-white/5 border-white/15' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Purity (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newItemPurity}
                    onChange={(e) => setNewItemPurity(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl border font-mono ${
                      isDark ? 'bg-white/5 border-white/15' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-blue-400 mb-1">
                    Desired Target (Pcs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newItemDesired}
                    onChange={(e) => setNewItemDesired(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl border font-bold ${
                      isDark ? 'bg-white/5 border-white/15' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-rose-400 mb-1">
                    Sold (Pcs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newItemSold}
                    onChange={(e) => setNewItemSold(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl border font-bold ${
                      isDark ? 'bg-white/5 border-white/15' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-400 mb-1">
                    Current Floor (Pcs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newItemCurrent}
                    onChange={(e) => setNewItemCurrent(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl border font-bold ${
                      isDark ? 'bg-white/5 border-white/15' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Assigned Maker / Supplier
                  </label>
                  <input
                    type="text"
                    value={newItemVendor}
                    onChange={(e) => setNewItemVendor(e.target.value)}
                    placeholder="Supplier name"
                    className={`w-full px-3 py-2 rounded-xl border ${
                      isDark ? 'bg-white/5 border-white/15' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="text"
                    value={newItemPhone}
                    onChange={(e) => setNewItemPhone(e.target.value)}
                    placeholder="9820123456"
                    className={`w-full px-3 py-2 rounded-xl border font-mono ${
                      isDark ? 'bg-white/5 border-white/15' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-xl font-bold ${
                    isDark ? 'border border-white/15' : 'border border-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black"
                >
                  Save Target SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
