import React, { useState } from 'react';
import {
  Barcode,
  Printer,
  XCircle,
  Plus,
  Trash2,
  Sliders,
  QrCode,
  Tag,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Filter,
  Search,
  RotateCcw,
  CheckSquare,
  Square
} from 'lucide-react';
import { StockItem, BarcodeTagItem, ColumnSetting, ItemMasterDefinition } from '../../types/erp';
import { formatWeight, formatCurrency } from '../../utils/calculations';
import { ColumnSettingsModal } from '../common/ColumnSettingsModal';
import { useTheme } from '../../context/ThemeContext';

interface BarcodeViewProps {
  stockItems: StockItem[];
  onClose: () => void;
}

const DEFAULT_BARCODE_COLUMNS: ColumnSetting[] = [
  { id: 'sr_no', label: 'Sr No', visible: true, width: 60, order: 0 },
  { id: 'tag_no', label: 'Tag No', visible: true, width: 110, order: 1 },
  { id: 'item_name', label: 'Item Name', visible: true, width: 180, order: 2 },
  { id: 'qty', label: 'Qty', visible: true, width: 60, order: 3 },
  { id: 'gross_wt', label: 'Gross Wt', visible: true, width: 90, order: 4 },
  { id: 'net_wt', label: 'Net Wt', visible: true, width: 90, order: 5 },
  { id: 'purity', label: 'Purity', visible: true, width: 70, order: 6 },
  { id: 'mkg_gm', label: 'Mkg/Gm', visible: true, width: 80, order: 7 },
  { id: 'huid', label: 'HUID', visible: true, width: 90, order: 8 },
  { id: 'size', label: 'Size', visible: true, width: 70, order: 9 },
];

export const BarcodeView: React.FC<BarcodeViewProps> = ({ stockItems, onClose }) => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'multiple_opening' | 'loose_to_barcode' | 'print_studio'>('multiple_opening');

  // Master batch items available for breaking down into multiple barcodes
  const [masterItems] = useState<ItemMasterDefinition[]>([
    {
      id: 'itm-1',
      item_name: '22K 916 Casted Royal Floral Ring',
      item_type: 'Ring',
      item_group: 'Gold',
      design: 'Casted',
      weight_or_qty: 'Weight',
      total_stock_weight: 50.0,
      remaining_weight: 50.0,
      created_at: '2026-08-25',
    },
    {
      id: 'itm-2',
      item_name: '916 Antique Temple Lakshmi Bangle',
      item_type: 'Bangle',
      item_group: 'Gold',
      design: 'Antique',
      weight_or_qty: 'Weight',
      total_stock_weight: 120.0,
      remaining_weight: 120.0,
      created_at: '2026-08-26',
    },
    {
      id: 'itm-3',
      item_name: '1 Gram Micro-Plated Bridal Mangalsutra',
      item_type: 'Mangalsutra',
      item_group: '1gm Imitation',
      design: 'Handmade',
      weight_or_qty: 'QTY',
      total_stock_weight: 200.0,
      remaining_weight: 200.0,
      created_at: '2026-08-27',
    },
  ]);

  // Tab 1: Multiple Opening Stock Barcodes State
  const [selectedMasterItem, setSelectedMasterItem] = useState<string>(masterItems[0].item_name);
  const currentMaster = masterItems.find((m) => m.item_name === selectedMasterItem) || masterItems[0];
  const initialBatchWeight = currentMaster.total_stock_weight;

  const [openingTags, setOpeningTags] = useState<BarcodeTagItem[]>([
    {
      id: 'tag-101',
      sr_no: 1,
      tag_no: 'TAG-88201',
      item_name: masterItems[0].item_name,
      item_type: 'Ring',
      category: 'Gold',
      qty: 1,
      gross_wt: 12.500,
      net_wt: 12.000,
      purity: 91.6,
      black_b: 0,
      stone_wt: 0.500,
      making_per_gm: 450,
      making_pct: 0,
      size: '14',
      hallmark_charges: 45,
      huid: 'B8K2M1',
      manual_tag: 'M-101',
      is_printed: false,
      is_loose: false,
    },
    {
      id: 'tag-102',
      sr_no: 2,
      tag_no: 'TAG-88202',
      item_name: masterItems[0].item_name,
      item_type: 'Ring',
      category: 'Gold',
      qty: 1,
      gross_wt: 15.000,
      net_wt: 14.500,
      purity: 91.6,
      black_b: 0,
      stone_wt: 0.500,
      making_per_gm: 450,
      making_pct: 0,
      size: '16',
      hallmark_charges: 45,
      huid: 'B8K2M2',
      manual_tag: 'M-102',
      is_printed: false,
      is_loose: false,
    },
  ]);

  // Dynamic calculation for Tab 1 weight reconciliation
  const totalAllocatedGrossWt = openingTags.reduce((s, t) => s + (t.gross_wt || 0), 0);
  const remainingWeightToReconcile = Math.max(0, Number((initialBatchWeight - totalAllocatedGrossWt).toFixed(3)));
  const isWeightReconciled = remainingWeightToReconcile === 0;

  // New tag entry form inside Tab 1
  const [newGrossWt, setNewGrossWt] = useState(remainingWeightToReconcile > 0 ? remainingWeightToReconcile : 5.0);
  const [newStoneWt, setNewStoneWt] = useState(0.2);
  const [newPurity, setNewPurity] = useState(91.6);
  const [newMkgGm, setNewMkgGm] = useState(450);
  const [newMkgPct, setNewMkgPct] = useState(0);
  const [newSize, setNewSize] = useState('14');
  const [newHuid, setNewHuid] = useState('B9M4K1');
  const [newManualTag, setNewManualTag] = useState('');

  // Tab 2: Loose Stock Transfer to Barcode State
  const [looseInventory, setLooseInventory] = useState(() => [
    ...stockItems.filter(s => s.is_loose).map(s => ({
      id: s.id,
      item_name: s.item_name,
      gross_wt: s.gross_wt,
      purity: s.purity,
      source: s.is_urd ? 'URD Scrap' : 'Opening Stock / Inward'
    })),
    { id: 'ls-1', item_name: '24K Raw Bullion Inward Lot (Purchase #PUR-891)', gross_wt: 250.0, purity: 99.5, source: 'Purchase Inward' },
    { id: 'ls-2', item_name: 'Loose Casted Bangles Lot #442', gross_wt: 85.4, purity: 91.6, source: 'Opening Stock' },
    { id: 'ls-3', item_name: 'Loose Uncut Diamond Studded Tops', gross_wt: 32.0, purity: 75.0, source: 'Karagir Inward' },
  ]);

  // Tab 3: Print Barcode & QR Code Studio State
  const [allBarcodeInventory, setAllBarcodeInventory] = useState<BarcodeTagItem[]>([
    ...openingTags,
    {
      id: 'tag-201',
      sr_no: 3,
      tag_no: 'TAG-99101',
      item_name: '22K Antique Temple Lakshmi Bangle',
      item_type: 'Bangle',
      category: 'Gold',
      tray: 'Tray-A1',
      section: 'Showcase-1',
      attachment: 'Plain',
      qty: 1,
      gross_wt: 28.500,
      net_wt: 28.000,
      purity: 91.6,
      black_b: 0,
      stone_wt: 0.500,
      making_per_gm: 520,
      making_pct: 0,
      size: '2.4',
      hallmark_charges: 45,
      huid: 'B9K7M2',
      manual_tag: 'M-201',
      is_printed: true,
      is_loose: false,
    },
    {
      id: 'tag-202',
      sr_no: 4,
      tag_no: 'TAG-99102',
      item_name: '1 Gram Micro-Plated Bridal Mangalsutra',
      item_type: 'Mangalsutra',
      category: '1gm Imitation',
      tray: 'Tray-M1',
      section: 'Counter-2',
      attachment: 'Black Beads',
      qty: 1,
      gross_wt: 18.000,
      net_wt: 16.000,
      purity: 10.0,
      black_b: 2.0,
      stone_wt: 0,
      making_per_gm: 150,
      making_pct: 0,
      size: '24 inch',
      hallmark_charges: 0,
      huid: 'N/A',
      manual_tag: 'M-IM-01',
      is_printed: false,
      is_loose: false,
    },
  ]);

  // Filters for Print Studio
  const [printFilterStatus, setPrintFilterStatus] = useState<'all' | 'printed' | 'not_printed'>('all');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterTray, setFilterTray] = useState('All');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [printFormat, setPrintFormat] = useState<'dumbbell' | 'two_up' | 'qr_label'>('dumbbell');
  const [printCopies, setPrintCopies] = useState(1);

  // Grid Settings Modal
  const [columns, setColumns] = useState<ColumnSetting[]>(DEFAULT_BARCODE_COLUMNS);
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  // Add piece to Tab 1
  const handleAddOpeningTag = () => {
    if (newGrossWt <= 0) {
      alert('Please enter valid gross weight');
      return;
    }
    if (newGrossWt > remainingWeightToReconcile) {
      alert(`Cannot add ${newGrossWt}g! Only ${remainingWeightToReconcile}g remaining from total batch.`);
      return;
    }

    const calculatedNet = Math.max(0, newGrossWt - newStoneWt);
    const newTag: BarcodeTagItem = {
      id: `tag-${Date.now()}`,
      sr_no: openingTags.length + 1,
      tag_no: `TAG-${Math.floor(10000 + Math.random() * 90000)}`,
      item_name: currentMaster.item_name,
      item_type: currentMaster.item_type,
      category: currentMaster.item_group,
      qty: 1,
      gross_wt: newGrossWt,
      net_wt: calculatedNet,
      purity: newPurity,
      black_b: 0,
      stone_wt: newStoneWt,
      making_per_gm: newMkgGm,
      making_pct: newMkgPct,
      size: newSize,
      hallmark_charges: 45,
      huid: newHuid,
      manual_tag: newManualTag || `M-${openingTags.length + 1}`,
      is_printed: false,
      is_loose: false,
    };

    setOpeningTags([...openingTags, newTag]);
    setAllBarcodeInventory([...allBarcodeInventory, newTag]);
    setNewGrossWt(Math.max(0, Number((remainingWeightToReconcile - newGrossWt).toFixed(3))));
  };

  // Convert Barcode to Loose
  const handleBarcodeToLoose = (tag: BarcodeTagItem) => {
    if (confirm(`Untag barcode ${tag.tag_no} (${tag.item_name}) and return ${tag.gross_wt}g to Loose Stock?`)) {
      setAllBarcodeInventory(allBarcodeInventory.filter((t) => t.id !== tag.id));
      setLooseInventory([
        ...looseInventory,
        {
          id: `ls-${Date.now()}`,
          item_name: `${tag.item_name} (Untagged from ${tag.tag_no})`,
          gross_wt: tag.gross_wt,
          purity: tag.purity,
          source: 'Barcode to Loose Untagging',
        },
      ]);
      alert(`Tag ${tag.tag_no} untagged and moved to loose stock!`);
    }
  };

  // Toggle selection for bulk print
  const toggleSelectTag = (id: string) => {
    setSelectedTagIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedTagIds.length === filteredPrintTags.length) {
      setSelectedTagIds([]);
    } else {
      setSelectedTagIds(filteredPrintTags.map((t) => t.id));
    }
  };

  // Filtered list in Print Studio
  const filteredPrintTags = allBarcodeInventory.filter((t) => {
    if (printFilterStatus === 'printed' && !t.is_printed) return false;
    if (printFilterStatus === 'not_printed' && t.is_printed) return false;
    if (filterCategory !== 'All' && t.category !== filterCategory) return false;
    if (filterType !== 'All' && t.item_type !== filterType) return false;
    if (filterTray !== 'All' && t.tray !== filterTray) return false;
    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Toolbar */}
      <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm no-print`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <Barcode className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span>Jewellery Barcode & RFID Tag Studio</span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-100 text-blue-800 font-mono font-bold border border-sky-200">
                F3 Studio
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Multiple opening stock barcodes, loose-to-tag conversion, and 1D Barcode/2D QR code printing.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowColumnSettings(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200 hover:bg-slate-200 cursor-pointer"
            title="Grid Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>GS</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Tags</span>
          </button>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs (3 Dedicated Sections) */}
      <div className="flex border-b border-sky-200 bg-white rounded-t-xl px-2 pt-2 space-x-2 shadow-2xs no-print">
        <button
          onClick={() => setActiveTab('multiple_opening')}
          className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'multiple_opening'
              ? 'bg-blue-50/80 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          1. Multiple Opening Stock Barcode (Weight Reconciliation)
        </button>
        <button
          onClick={() => setActiveTab('loose_to_barcode')}
          className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'loose_to_barcode'
              ? 'bg-blue-50/80 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          2. Stock Transfer Loose to Barcode
        </button>
        <button
          onClick={() => setActiveTab('print_studio')}
          className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'print_studio'
              ? 'bg-blue-50/80 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          3. Print Barcode & QR Code Studio
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MULTIPLE OPENING STOCK BARCODE (LIVE WEIGHT DEDUCTION TO 0.000g)  */}
      {/* ========================================================================= */}
      {activeTab === 'multiple_opening' && (
        <div className="space-y-4">
          {/* Master Item Selector & Batch Weight Reconciliation Banner */}
          <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 text-xs items-center`}>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Master Created Item</label>
              <select
                value={selectedMasterItem}
                onChange={(e) => {
                  setSelectedMasterItem(e.target.value);
                  setOpeningTags([]);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
              >
                {masterItems.map((m) => (
                  <option key={m.id} value={m.item_name}>
                    {m.item_name} ({m.total_stock_weight}g Total)
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center font-mono">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Batch Weight</span>
              <strong className="text-base text-slate-900">{formatWeight(initialBatchWeight)}</strong>
            </div>

            <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-center font-mono">
              <span className="text-[10px] text-blue-700 font-bold uppercase block">Allocated to Tags</span>
              <strong className="text-base text-blue-900">{formatWeight(totalAllocatedGrossWt)}</strong>
            </div>

            <div className={`p-3 rounded-xl text-center font-mono border ${
              isWeightReconciled ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}>
              <span className="text-[10px] font-bold uppercase block">
                {isWeightReconciled ? '✓ Fully Reconciled' : 'Remaining to Tag'}
              </span>
              <strong className="text-base font-extrabold">{formatWeight(remainingWeightToReconcile)}</strong>
            </div>
          </div>

          {/* Add Multiple Pieces Entry Form */}
          {!isWeightReconciled && (
            <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm space-y-3`}>
              <span className="font-bold text-blue-900 text-xs uppercase tracking-wider block">
                Add Piece Entry (Auto Deducts from Total Weight)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Gross Wt (g) *</label>
                  <input
                    type="number"
                    step={0.001}
                    value={newGrossWt}
                    onChange={(e) => setNewGrossWt(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono text-right font-bold text-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Stone Wt (g)</label>
                  <input
                    type="number"
                    step={0.001}
                    value={newStoneWt}
                    onChange={(e) => setNewStoneWt(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono text-right text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Purity (%)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={newPurity}
                    onChange={(e) => setNewPurity(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono text-right text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Mkg/Gm (₹)</label>
                  <input
                    type="number"
                    value={newMkgGm}
                    onChange={(e) => setNewMkgGm(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono text-right text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Size</label>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-center text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">HUID (6-Char)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={newHuid}
                    onChange={(e) => setNewHuid(e.target.value.toUpperCase())}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono text-center font-bold text-blue-900 uppercase"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddOpeningTag}
                    className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Piece</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tags Table with all 14 Mandated Fields */}
          <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm space-y-3`}>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Generated Barcode Tags for {selectedMasterItem} ({openingTags.length} Pieces)
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {isWeightReconciled ? '✓ Total batch weight 100% matched' : `Remaining: ${remainingWeightToReconcile}g`}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2 border-r border-slate-200 text-center w-12">Sr No</th>
                    <th className="p-2 border-r border-slate-200 font-mono">Tag No</th>
                    <th className="p-2 border-r border-slate-200 text-center w-10">Qty</th>
                    <th className="p-2 border-r border-slate-200 text-right">Gross Wt</th>
                    <th className="p-2 border-r border-slate-200 text-right font-bold text-blue-800">Net Wt</th>
                    <th className="p-2 border-r border-slate-200 text-center">Purity</th>
                    <th className="p-2 border-r border-slate-200 text-right">Black B</th>
                    <th className="p-2 border-r border-slate-200 text-right">Stone Wt</th>
                    <th className="p-2 border-r border-slate-200 text-right">Mkg/Gm</th>
                    <th className="p-2 border-r border-slate-200 text-center">Size</th>
                    <th className="p-2 border-r border-slate-200 text-center">Hallmark</th>
                    <th className="p-2 border-r border-slate-200 text-center font-mono">HUID</th>
                    <th className="p-2 border-r border-slate-200">Manual Tag</th>
                    <th className="p-2 text-center w-12">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
                  {openingTags.map((t, idx) => (
                    <tr key={t.id} className="hover:bg-sky-50/30">
                      <td className="p-2 border-r border-slate-200 text-center text-slate-400">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-bold text-blue-900">{t.tag_no}</td>
                      <td className="p-2 border-r border-slate-200 text-center">{t.qty}</td>
                      <td className="p-2 border-r border-slate-200 text-right">{formatWeight(t.gross_wt)}</td>
                      <td className="p-2 border-r border-slate-200 text-right font-bold text-blue-800">{formatWeight(t.net_wt)}</td>
                      <td className="p-2 border-r border-slate-200 text-center">{t.purity}%</td>
                      <td className="p-2 border-r border-slate-200 text-right">{t.black_b}g</td>
                      <td className="p-2 border-r border-slate-200 text-right">{t.stone_wt}g</td>
                      <td className="p-2 border-r border-slate-200 text-right">₹{t.making_per_gm}</td>
                      <td className="p-2 border-r border-slate-200 text-center">{t.size}</td>
                      <td className="p-2 border-r border-slate-200 text-center">₹{t.hallmark_charges}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-bold text-blue-900">{t.huid}</td>
                      <td className="p-2 border-r border-slate-200">{t.manual_tag}</td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => setOpeningTags(openingTags.filter((x) => x.id !== t.id))}
                          className="text-rose-600 hover:text-rose-800 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STOCK TRANSFER LOOSE TO BARCODE                                   */}
      {/* ========================================================================= */}
      {activeTab === 'loose_to_barcode' && (
        <div className="space-y-4">
          <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm space-y-3`}>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                <span>Loose Inventory & Purchase Inwards (Ready for Tagging)</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">{looseInventory.length} Loose Lots Available</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {looseInventory.map((ls) => (
                <div key={ls.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 text-xs">{ls.item_name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                      {ls.purity}%
                    </span>
                  </div>
                  <div className="text-sm font-mono font-extrabold text-blue-900">
                    Gross Weight: {formatWeight(ls.gross_wt)}
                  </div>
                  <div className="text-[10px] text-slate-500">Source: {ls.source}</div>
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Initiating barcode tag breakdown for ${ls.item_name} (${ls.gross_wt}g)!`);
                      setActiveTab('multiple_opening');
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Convert to Barcode Tags</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PRINT BARCODE & QR CODE STUDIO                                    */}
      {/* ========================================================================= */}
      {activeTab === 'print_studio' && (
        <div className="space-y-4">
          {/* Filters Strip */}
          <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm space-y-3 text-xs no-print`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Print Status</label>
                <select
                  value={printFilterStatus}
                  onChange={(e) => setPrintFilterStatus(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs"
                >
                  <option value="all">All Tags</option>
                  <option value="not_printed">Not Printed Only</option>
                  <option value="printed">Printed Only</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs"
                >
                  <option value="All">All Categories</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="1gm Imitation">1gm Imitation</option>
                  <option value="Diamond">Diamond</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Item Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs"
                >
                  <option value="All">All Types</option>
                  <option value="Ring">Ring</option>
                  <option value="Bangle">Bangle</option>
                  <option value="Necklace">Necklace</option>
                  <option value="Mangalsutra">Mangalsutra</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Print Format</label>
                <select
                  value={printFormat}
                  onChange={(e) => setPrintFormat(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs font-bold"
                >
                  <option value="dumbbell">Dumbbell Butterfly Tag</option>
                  <option value="two_up">2-Up Barcode Label</option>
                  <option value="qr_label">2D QR Code + Tag</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Copies / Tag</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={printCopies}
                  onChange={(e) => setPrintCopies(parseInt(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono text-center text-xs text-slate-800"
                />
              </div>

              <div className="flex items-end space-x-2">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold rounded text-xs flex items-center justify-center space-x-1"
                >
                  <span>{selectedTagIds.length === filteredPrintTags.length ? 'Deselect All' : 'Select All'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Barcode / QR Code Tag Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrintTags.map((tag) => (
              <div
                key={tag.id}
                className={`p-4 rounded-xl border transition-all ${
                  selectedTagIds.includes(tag.id)
                    ? 'bg-blue-50/70 border-blue-400 shadow-sm'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => toggleSelectTag(tag.id)}
                      className="text-blue-600 cursor-pointer"
                    >
                      {selectedTagIds.includes(tag.id) ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <span className="font-bold text-slate-900 text-xs">{tag.tag_no}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    tag.is_printed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tag.is_printed ? 'Printed' : 'Not Printed'}
                  </span>
                </div>

                <div className="my-2.5 p-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center font-mono">
                  {printFormat === 'qr_label' ? (
                    <div className="flex items-center justify-center space-x-3 py-1">
                      <QrCode className="w-10 h-10 text-slate-900" />
                      <div className="text-left text-[10px] leading-tight">
                        <div className="font-bold">{tag.item_name}</div>
                        <div>Gr: {tag.gross_wt}g | Nt: {tag.net_wt}g</div>
                        <div className="text-blue-700 font-bold">HUID: {tag.huid}</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-lg font-extrabold tracking-widest text-slate-900 font-mono">
                        ||||| | |||| | |||||
                      </div>
                      <div className="text-[10px] text-slate-600 mt-0.5">
                        {tag.tag_no} • Gr: {tag.gross_wt}g • {tag.purity}% • HUID: {tag.huid}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-500 font-mono text-[11px]">Size: {tag.size}</span>
                  <button
                    type="button"
                    onClick={() => handleBarcodeToLoose(tag)}
                    className="text-[11px] text-rose-700 hover:text-rose-900 font-bold underline cursor-pointer"
                  >
                    Barcode to Loose
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Settings Modal */}
      <ColumnSettingsModal
        isOpen={showColumnSettings}
        onClose={() => setShowColumnSettings(false)}
        columns={columns}
        onSave={(c) => setColumns(c)}
      />
    </div>
  );
};
