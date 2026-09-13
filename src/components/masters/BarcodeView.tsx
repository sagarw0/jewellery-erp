import React, { useState, useMemo } from 'react';
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
  Square,
  List,
  LayoutGrid,
  Eye,
  Copy,
  Sparkles,
  Download,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { StockItem, BarcodeTagItem, ColumnSetting, ItemMasterDefinition } from '../../types/erp';
import { formatWeight, formatCurrency } from '../../utils/calculations';
import { ColumnSettingsModal } from '../common/ColumnSettingsModal';
import { useTheme } from '../../context/ThemeContext';

interface BarcodeViewProps {
  stockItems: StockItem[];
  onClose: () => void;
}

// Crisp SVG Barcode Generator Component (Code 128 / Code 39 Style)
const BarcodeSvg: React.FC<{ value: string; width?: number; height?: number; showText?: boolean }> = ({
  value,
  width = 140,
  height = 36,
  showText = false
}) => {
  // Generate deterministic bar widths from characters in the tag value
  const bars = useMemo(() => {
    const chars = (value || 'TAG916').toUpperCase();
    const pattern: { x: number; w: number }[] = [];
    let currentX = 4;
    for (let i = 0; i < chars.length; i++) {
      const code = chars.charCodeAt(i) || 65;
      const w1 = (code % 3) + 1.2;
      const space1 = ((code * 2) % 3) + 1.2;
      const w2 = ((code * 3) % 2) + 1.4;
      const space2 = ((code * 4) % 2) + 1.2;
      
      pattern.push({ x: currentX, w: w1 });
      currentX += w1 + space1;
      pattern.push({ x: currentX, w: w2 });
      currentX += w2 + space2;
    }
    return { pattern, totalWidth: currentX + 6 };
  }, [value]);

  return (
    <div className="inline-flex flex-col items-center">
      <svg
        viewBox={`0 0 ${bars.totalWidth} ${height}`}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="overflow-visible"
      >
        {/* Guard bars start */}
        <rect x={1} y={0} width={2} height={height} fill="#0f172a" />
        <rect x={4} y={0} width={1.5} height={height} fill="#0f172a" />

        {/* Data bars */}
        {bars.pattern.map((bar, idx) => (
          <rect key={idx} x={bar.x} y={0} width={bar.w} height={height} fill="#0f172a" rx={0.2} />
        ))}

        {/* Guard bars end */}
        <rect x={bars.totalWidth - 5} y={0} width={1.5} height={height} fill="#0f172a" />
        <rect x={bars.totalWidth - 2} y={0} width={2} height={height} fill="#0f172a" />
      </svg>
      {showText && (
        <span className="font-mono text-[10px] tracking-widest text-slate-800 font-bold mt-0.5 select-all">
          {value}
        </span>
      )}
    </div>
  );
};

const DEFAULT_BARCODE_COLUMNS: ColumnSetting[] = [
  { id: 'select', label: 'Select', visible: true, width: 40, order: 0 },
  { id: 'sr_no', label: 'Sr No', visible: true, width: 50, order: 1 },
  { id: 'item_name', label: 'Item Name', visible: true, width: 220, order: 2 },
  { id: 'tag_no', label: 'Tag / Barcode No', visible: true, width: 120, order: 3 },
  { id: 'barcode_preview', label: 'Barcode Graphic', visible: true, width: 150, order: 4 },
  { id: 'category', label: 'Category', visible: true, width: 90, order: 5 },
  { id: 'item_type', label: 'Type', visible: true, width: 90, order: 6 },
  { id: 'qty', label: 'Qty', visible: true, width: 50, order: 7 },
  { id: 'gross_wt', label: 'Gross Wt', visible: true, width: 90, order: 8 },
  { id: 'net_wt', label: 'Net Wt', visible: true, width: 90, order: 9 },
  { id: 'purity', label: 'Purity', visible: true, width: 75, order: 10 },
  { id: 'fine_wt', label: 'Fine Bullion', visible: true, width: 95, order: 11 },
  { id: 'huid', label: 'HUID', visible: true, width: 85, order: 12 },
  { id: 'size', label: 'Size', visible: true, width: 70, order: 13 },
  { id: 'mkg_gm', label: 'Mkg/Gm', visible: true, width: 80, order: 14 },
  { id: 'status', label: 'Print Status', visible: true, width: 95, order: 15 },
  { id: 'action', label: 'Actions', visible: true, width: 100, order: 16 },
];

export const BarcodeView: React.FC<BarcodeViewProps> = ({ stockItems, onClose }) => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'multiple_opening' | 'loose_to_barcode' | 'print_studio'>('print_studio');

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
      is_printed: true,
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
  const [allBarcodeInventory, setAllBarcodeInventory] = useState<BarcodeTagItem[]>(() => {
    // Collect stock items with tag_no
    const stockTags: BarcodeTagItem[] = stockItems
      .filter((s) => s.tag_no && s.tag_no.trim() !== '')
      .map((s, idx) => ({
        id: `stk-tag-${s.id}`,
        sr_no: idx + 5,
        tag_no: s.tag_no!,
        item_name: s.item_name,
        item_type: 'Ornament',
        category: s.category || 'Gold',
        qty: s.qty || 1,
        gross_wt: s.gross_wt,
        net_wt: s.net_wt,
        purity: s.purity,
        black_b: 0,
        stone_wt: 0,
        making_per_gm: 400,
        making_pct: 0,
        size: 'Standard',
        hallmark_charges: 45,
        huid: 'B7K9X2',
        manual_tag: `M-${s.tag_no}`,
        is_printed: false,
        is_loose: false,
      }));

    return [
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
      {
        id: 'tag-203',
        sr_no: 5,
        tag_no: 'TAG-99103',
        item_name: 'Silver Traditional Payal / Anklet 92.5',
        item_type: 'Payal',
        category: 'Silver',
        tray: 'Tray-S2',
        section: 'Silver Counter',
        attachment: 'Bells',
        qty: 1,
        gross_wt: 65.200,
        net_wt: 64.500,
        purity: 92.5,
        black_b: 0,
        stone_wt: 0.700,
        making_per_gm: 18,
        making_pct: 0,
        size: '10.5 inch',
        hallmark_charges: 25,
        huid: 'SL89K1',
        manual_tag: 'M-SL-03',
        is_printed: false,
        is_loose: false,
      },
      ...stockTags,
    ];
  });

  // View Mode: 'list' (Table) vs 'grid' (Label Cards)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Search & Filters for Barcode Studio
  const [searchTerm, setSearchTerm] = useState('');
  const [printFilterStatus, setPrintFilterStatus] = useState<'all' | 'printed' | 'not_printed'>('all');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [printFormat, setPrintFormat] = useState<'dumbbell' | 'two_up' | 'qr_label' | 'sheet'>('dumbbell');
  const [printCopies, setPrintCopies] = useState(1);

  // Print Preview Modal State
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [singlePrintTag, setSinglePrintTag] = useState<BarcodeTagItem | null>(null);

  // Grid Settings Modal
  const [columns, setColumns] = useState<ColumnSetting[]>(DEFAULT_BARCODE_COLUMNS);
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  // Filtered list of barcode tags in studio
  const filteredPrintTags = useMemo(() => {
    return allBarcodeInventory.filter((t) => {
      if (printFilterStatus === 'printed' && !t.is_printed) return false;
      if (printFilterStatus === 'not_printed' && t.is_printed) return false;
      if (filterCategory !== 'All' && t.category !== filterCategory) return false;
      if (filterType !== 'All' && t.item_type !== filterType) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = (t.item_name || '').toLowerCase().includes(term);
        const matchesTag = (t.tag_no || '').toLowerCase().includes(term);
        const matchesHuid = (t.huid || '').toLowerCase().includes(term);
        const matchesCat = (t.category || '').toLowerCase().includes(term);
        const matchesType = (t.item_type || '').toLowerCase().includes(term);
        if (!matchesName && !matchesTag && !matchesHuid && !matchesCat && !matchesType) {
          return false;
        }
      }
      return true;
    });
  }, [allBarcodeInventory, printFilterStatus, filterCategory, filterType, searchTerm]);

  // Aggregate stats for filtered list
  const stats = useMemo(() => {
    const totalTags = filteredPrintTags.length;
    const totalGross = filteredPrintTags.reduce((s, t) => s + (t.gross_wt || 0), 0);
    const totalNet = filteredPrintTags.reduce((s, t) => s + (t.net_wt || 0), 0);
    const totalFine = filteredPrintTags.reduce((s, t) => s + ((t.net_wt * (t.purity || 0)) / 100), 0);
    const printedCount = filteredPrintTags.filter((t) => t.is_printed).length;
    const unprintedCount = totalTags - printedCount;
    return { totalTags, totalGross, totalNet, totalFine, printedCount, unprintedCount };
  }, [filteredPrintTags]);

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
    if (confirm(`Untag barcode ${tag.tag_no} for "${tag.item_name}" and return ${tag.gross_wt}g to Loose Stock?`)) {
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
      alert(`Tag ${tag.tag_no} (${tag.item_name}) untagged and moved to loose inventory!`);
    }
  };

  // Toggle single tag printed status
  const togglePrintStatus = (id: string) => {
    setAllBarcodeInventory((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_printed: !t.is_printed } : t))
    );
  };

  // Mark all selected as printed
  const handleMarkSelectedPrinted = () => {
    if (selectedTagIds.length === 0) return;
    setAllBarcodeInventory((prev) =>
      prev.map((t) => (selectedTagIds.includes(t.id) ? { ...t, is_printed: true } : t))
    );
    alert(`Marked ${selectedTagIds.length} tags as Printed!`);
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

  // Quick single print handler
  const handlePrintSingle = (tag: BarcodeTagItem) => {
    setSinglePrintTag(tag);
    setShowPrintModal(true);
  };

  // Bulk print handler
  const handlePrintSelected = () => {
    setSinglePrintTag(null);
    setShowPrintModal(true);
  };

  // Tags to render inside Print Modal / print output
  const tagsToPrint = useMemo(() => {
    if (singlePrintTag) return [singlePrintTag];
    if (selectedTagIds.length > 0) {
      return allBarcodeInventory.filter((t) => selectedTagIds.includes(t.id));
    }
    return filteredPrintTags;
  }, [singlePrintTag, selectedTagIds, allBarcodeInventory, filteredPrintTags]);

  // Export Barcode List as CSV
  const handleExportCSV = () => {
    const headers = [
      'Sr No',
      'Tag No',
      'Item Name',
      'Category',
      'Item Type',
      'Qty',
      'Gross Wt',
      'Net Wt',
      'Purity',
      'Fine Bullion',
      'HUID',
      'Size',
      'Making Per Gm',
      'Printed Status'
    ];
    const rows = filteredPrintTags.map((t, idx) => [
      idx + 1,
      `"${t.tag_no}"`,
      `"${t.item_name}"`,
      `"${t.category}"`,
      `"${t.item_type}"`,
      t.qty,
      t.gross_wt,
      t.net_wt,
      t.purity,
      ((t.net_wt * t.purity) / 100).toFixed(3),
      `"${t.huid}"`,
      `"${t.size}"`,
      t.making_per_gm,
      t.is_printed ? 'Printed' : 'Not Printed'
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Jewellery_Barcode_List_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Studio Toolbar */}
      <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm no-print`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs">
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
              List format barcode manager showing item names, live stock allocation, batch division, and 1D/2D thermal printing.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 hover:bg-slate-200 cursor-pointer"
            title="Export Barcode List to CSV"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowColumnSettings(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200 hover:bg-slate-200 cursor-pointer"
            title="Grid Column Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>GS</span>
          </button>

          <button
            onClick={handlePrintSelected}
            className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-bold shadow cursor-pointer transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>
              {selectedTagIds.length > 0 ? `Print Selected (${selectedTagIds.length})` : 'Print Barcode Tags'}
            </span>
          </button>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-sky-200 bg-white rounded-t-xl px-2 pt-2 space-x-2 shadow-2xs no-print">
        <button
          onClick={() => setActiveTab('print_studio')}
          className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'print_studio'
              ? 'bg-blue-50/90 text-blue-700 border-b-2 border-blue-600 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>1. Barcode List & Print Studio ({allBarcodeInventory.length} Tags)</span>
        </button>
        <button
          onClick={() => setActiveTab('multiple_opening')}
          className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'multiple_opening'
              ? 'bg-blue-50/90 text-blue-700 border-b-2 border-blue-600 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. Multiple Opening Stock Barcode (Weight Division)</span>
        </button>
        <button
          onClick={() => setActiveTab('loose_to_barcode')}
          className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'loose_to_barcode'
              ? 'bg-blue-50/90 text-blue-700 border-b-2 border-blue-600 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>3. Stock Transfer Loose to Barcode</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BARCODE LIST & PRINT STUDIO (PRIMARY LIST FORMAT AS REQUESTED)     */}
      {/* ========================================================================= */}
      {activeTab === 'print_studio' && (
        <div className="space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs no-print">
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs font-mono">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Tags in List</span>
              <strong className="text-base text-slate-900 font-extrabold">{stats.totalTags}</strong>
              <span className="text-[10px] text-slate-400 block font-sans">Barcodes Registered</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs font-mono">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Gross Wt</span>
              <strong className="text-base text-blue-900 font-extrabold">{formatWeight(stats.totalGross)}</strong>
              <span className="text-[10px] text-slate-400 block font-sans">Across All Tags</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs font-mono">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Net Wt</span>
              <strong className="text-base text-sky-800 font-extrabold">{formatWeight(stats.totalNet)}</strong>
              <span className="text-[10px] text-slate-400 block font-sans">Pure Metal Net</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs font-mono">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Fine Bullion Wt</span>
              <strong className="text-base text-amber-700 font-extrabold">{formatWeight(stats.totalFine)}</strong>
              <span className="text-[10px] text-slate-400 block font-sans">24K / 99.9% Equivalent</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 shadow-2xs font-mono">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Printed Tags</span>
              <strong className="text-base text-emerald-900 font-extrabold">{stats.printedCount}</strong>
              <span className="text-[10px] text-emerald-700 block font-sans">Labels Generated</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 shadow-2xs font-mono">
              <span className="text-[10px] text-amber-800 font-bold uppercase block">Not Printed Yet</span>
              <strong className="text-base text-amber-900 font-extrabold">{stats.unprintedCount}</strong>
              <span className="text-[10px] text-amber-700 block font-sans">Ready to Print</span>
            </div>
          </div>

          {/* Search, Filter & View Controls */}
          <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm space-y-3 text-xs no-print`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 items-end">
              {/* Search Bar */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <Search className="w-3.5 h-3.5 text-blue-600" />
                  <span>Search by Item Name, Tag No, or HUID</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="e.g. Royal Floral Ring, om ring, TAG-88201, B8K2M1..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs font-semibold focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Print Status */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Print Status</label>
                <select
                  value={printFilterStatus}
                  onChange={(e) => setPrintFilterStatus(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs font-medium"
                >
                  <option value="all">All Statuses ({allBarcodeInventory.length})</option>
                  <option value="not_printed">Not Printed Only ({stats.unprintedCount})</option>
                  <option value="printed">Printed Only ({stats.printedCount})</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Category / Group</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs font-medium"
                >
                  <option value="All">All Categories</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="1gm Imitation">1gm Imitation</option>
                  <option value="Diamond">Diamond</option>
                  <option value="URD Gold">URD Gold</option>
                  <option value="URD Silver">URD Silver</option>
                </select>
              </div>

              {/* Item Type */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Item Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs font-medium"
                >
                  <option value="All">All Types</option>
                  <option value="Ring">Ring</option>
                  <option value="Bangle">Bangle</option>
                  <option value="Necklace">Necklace</option>
                  <option value="Mangalsutra">Mangalsutra</option>
                  <option value="Chain">Chain</option>
                  <option value="Payal">Payal / Anklet</option>
                  <option value="Ornament">General Ornament</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">View Format</label>
                <div className="flex rounded-lg border border-slate-300 p-0.5 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`flex-1 py-1 px-2 rounded-md font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>List</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 py-1 px-2 rounded-md font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Cards</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Selection & Batch Action Ribbon */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold rounded-lg text-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  {selectedTagIds.length === filteredPrintTags.length && filteredPrintTags.length > 0 ? (
                    <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>
                    {selectedTagIds.length === filteredPrintTags.length && filteredPrintTags.length > 0
                      ? 'Deselect All'
                      : `Select All (${filteredPrintTags.length})`}
                  </span>
                </button>

                {selectedTagIds.length > 0 && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold border border-blue-200 font-mono">
                    ✓ {selectedTagIds.length} item(s) selected
                  </span>
                )}
              </div>

              {selectedTagIds.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleMarkSelectedPrinted}
                    className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold rounded-lg text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark as Printed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTagIds([])}
                    className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Clear Selection
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ================================================================= */}
          {/* BARCODE IN LIST / TABULAR FORMAT (SHOWS ITEM NAME PROMINENTLY)    */}
          {/* ================================================================= */}
          {viewMode === 'list' && (
            <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm space-y-3`}>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <List className="w-4 h-4 text-blue-600" />
                  <span>Jewellery Barcode Inventory List ({filteredPrintTags.length} Records)</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Showing {filteredPrintTags.length} of {allBarcodeInventory.length} total barcodes
                </span>
              </div>

              {filteredPrintTags.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs space-y-2">
                  <Barcode className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>No barcode records match the active search or filters.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setPrintFilterStatus('all');
                      setFilterCategory('All');
                      setFilterType('All');
                    }}
                    className="text-blue-600 underline font-bold cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="p-2.5 border-r border-slate-200 text-center w-10">
                          <input
                            type="checkbox"
                            checked={selectedTagIds.length === filteredPrintTags.length && filteredPrintTags.length > 0}
                            onChange={toggleSelectAll}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th className="p-2.5 border-r border-slate-200 text-center w-12">#</th>
                        <th className="p-2.5 border-r border-slate-200 min-w-[220px]">
                          Item Name & Specifications
                        </th>
                        <th className="p-2.5 border-r border-slate-200 font-mono w-28">Tag No</th>
                        <th className="p-2.5 border-r border-slate-200 text-center min-w-[130px]">
                          Barcode Graphic
                        </th>
                        <th className="p-2.5 border-r border-slate-200 text-center w-24">Group / Type</th>
                        <th className="p-2.5 border-r border-slate-200 text-center w-12">Qty</th>
                        <th className="p-2.5 border-r border-slate-200 text-right w-20">Gross Wt</th>
                        <th className="p-2.5 border-r border-slate-200 text-right w-20 font-bold text-blue-900">
                          Net Wt
                        </th>
                        <th className="p-2.5 border-r border-slate-200 text-center w-18">Purity</th>
                        <th className="p-2.5 border-r border-slate-200 text-right w-24 font-bold text-amber-800">
                          Fine Bullion
                        </th>
                        <th className="p-2.5 border-r border-slate-200 text-center font-mono w-20">HUID</th>
                        <th className="p-2.5 border-r border-slate-200 text-center w-16">Size</th>
                        <th className="p-2.5 border-r border-slate-200 text-right w-20">Mkg/Gm</th>
                        <th className="p-2.5 border-r border-slate-200 text-center w-24">Print Status</th>
                        <th className="p-2.5 text-center min-w-[110px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
                      {filteredPrintTags.map((tag, idx) => {
                        const isSelected = selectedTagIds.includes(tag.id);
                        const fineWeight = Number(((tag.net_wt * (tag.purity || 0)) / 100).toFixed(3));

                        return (
                          <tr
                            key={tag.id}
                            className={`transition-colors ${
                              isSelected
                                ? 'bg-blue-50/70 hover:bg-blue-50'
                                : idx % 2 === 0
                                ? 'bg-white hover:bg-sky-50/30'
                                : 'bg-slate-50/40 hover:bg-sky-50/30'
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="p-2.5 border-r border-slate-200 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectTag(tag.id)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>

                            {/* Sr No */}
                            <td className="p-2.5 border-r border-slate-200 text-center text-slate-400 font-sans">
                              {idx + 1}
                            </td>

                            {/* Item Name (Prominently Rendered) */}
                            <td className="p-2.5 border-r border-slate-200 font-sans">
                              <div className="flex items-start space-x-2">
                                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 shrink-0 mt-0.5">
                                  <Tag className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 text-xs block leading-snug">
                                    {tag.item_name}
                                  </span>
                                  <div className="flex items-center space-x-1.5 mt-0.5 text-[10px] text-slate-500">
                                    <span className="px-1.5 py-0.2 rounded bg-slate-100 font-medium text-slate-700">
                                      {tag.category}
                                    </span>
                                    <span>•</span>
                                    <span>{tag.item_type || 'Ornament'}</span>
                                    {tag.manual_tag && (
                                      <>
                                        <span>•</span>
                                        <span className="text-blue-700 font-mono">{tag.manual_tag}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Tag / Barcode No */}
                            <td className="p-2.5 border-r border-slate-200 font-bold text-blue-900 font-mono">
                              <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900 inline-block">
                                {tag.tag_no}
                              </span>
                            </td>

                            {/* Barcode Graphic Preview */}
                            <td className="p-2.5 border-r border-slate-200 text-center">
                              <div className="flex flex-col items-center justify-center p-1 bg-white rounded border border-slate-200 shadow-2xs">
                                <BarcodeSvg value={tag.tag_no} width={100} height={20} />
                                <span className="text-[9px] text-slate-500 font-mono tracking-tight mt-0.5">
                                  {tag.tag_no}
                                </span>
                              </div>
                            </td>

                            {/* Category & Type */}
                            <td className="p-2.5 border-r border-slate-200 text-center font-sans text-slate-700">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                                {tag.item_type || tag.category}
                              </span>
                            </td>

                            {/* Qty */}
                            <td className="p-2.5 border-r border-slate-200 text-center font-bold text-slate-800">
                              {tag.qty}
                            </td>

                            {/* Gross Wt */}
                            <td className="p-2.5 border-r border-slate-200 text-right font-bold text-slate-900">
                              {formatWeight(tag.gross_wt)}
                            </td>

                            {/* Net Wt */}
                            <td className="p-2.5 border-r border-slate-200 text-right font-bold text-blue-800">
                              {formatWeight(tag.net_wt)}
                            </td>

                            {/* Purity */}
                            <td className="p-2.5 border-r border-slate-200 text-center font-semibold text-slate-700">
                              {tag.purity}%
                            </td>

                            {/* Fine Bullion Wt */}
                            <td className="p-2.5 border-r border-slate-200 text-right font-bold text-amber-800">
                              {formatWeight(fineWeight)}
                            </td>

                            {/* HUID */}
                            <td className="p-2.5 border-r border-slate-200 text-center font-bold text-blue-950 font-mono">
                              {tag.huid || '—'}
                            </td>

                            {/* Size */}
                            <td className="p-2.5 border-r border-slate-200 text-center text-slate-700">
                              {tag.size || '—'}
                            </td>

                            {/* Mkg/Gm */}
                            <td className="p-2.5 border-r border-slate-200 text-right text-slate-800">
                              ₹{tag.making_per_gm}
                            </td>

                            {/* Print Status */}
                            <td className="p-2.5 border-r border-slate-200 text-center font-sans">
                              <button
                                type="button"
                                onClick={() => togglePrintStatus(tag.id)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all border ${
                                  tag.is_printed
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                                }`}
                                title="Click to toggle printed status"
                              >
                                {tag.is_printed ? '✓ Printed' : '● Not Printed'}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="p-2.5 text-center font-sans">
                              <div className="flex items-center justify-center space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => handlePrintSingle(tag)}
                                  className="p-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                                  title="Print this single barcode tag"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleBarcodeToLoose(tag)}
                                  className="p-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 cursor-pointer"
                                  title="Untag barcode to loose stock"
                                >
                                  <ArrowRightLeft className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-100 font-bold font-mono border-t-2 border-slate-300 text-xs">
                      <tr>
                        <td colSpan={3} className="p-2.5 font-sans uppercase text-right">
                          List Totals ({filteredPrintTags.length} Tags):
                        </td>
                        <td className="p-2.5"></td>
                        <td className="p-2.5"></td>
                        <td className="p-2.5"></td>
                        <td className="p-2.5 text-center text-slate-900 font-extrabold">
                          {filteredPrintTags.reduce((s, t) => s + (t.qty || 1), 0)}
                        </td>
                        <td className="p-2.5 text-right text-slate-900 font-extrabold">
                          {formatWeight(stats.totalGross)}
                        </td>
                        <td className="p-2.5 text-right text-blue-900 font-extrabold">
                          {formatWeight(stats.totalNet)}
                        </td>
                        <td className="p-2.5"></td>
                        <td className="p-2.5 text-right text-amber-900 font-extrabold">
                          {formatWeight(stats.totalFine)}
                        </td>
                        <td colSpan={5} className="p-2.5"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* BARCODE IN CARD GRID VIEW (SHOWS ITEM NAME AT TOP OF EVERY TAG)   */}
          {/* ================================================================= */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrintTags.map((tag) => (
                <div
                  key={tag.id}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedTagIds.includes(tag.id)
                      ? 'bg-blue-50/70 border-blue-400 shadow-md ring-1 ring-blue-300'
                      : 'bg-white border-slate-200 hover:border-blue-300 shadow-2xs'
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
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">{tag.tag_no}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{tag.category} • {tag.item_type}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                      tag.is_printed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {tag.is_printed ? 'Printed' : 'Not Printed'}
                    </span>
                  </div>

                  {/* Physical Tag Label Preview with ITEM NAME PROMINENTLY DISPLAYED */}
                  <div className="my-3 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                    {/* Item Name prominently at the top */}
                    <div className="text-center pb-1.5 border-b border-slate-200">
                      <span className="text-xs font-black uppercase text-slate-900 tracking-wide block">
                        {tag.item_name}
                      </span>
                    </div>

                    {printFormat === 'qr_label' ? (
                      <div className="flex items-center justify-center space-x-3 py-1">
                        <QrCode className="w-12 h-12 text-slate-900 shrink-0" />
                        <div className="text-left text-[11px] leading-tight space-y-0.5 font-mono">
                          <div className="font-bold text-slate-900">{tag.tag_no}</div>
                          <div className="text-slate-700">Gr: {tag.gross_wt}g | Nt: {tag.net_wt}g</div>
                          <div className="text-amber-800 font-bold">Purity: {tag.purity}% | Sz: {tag.size}</div>
                          <div className="text-blue-800 font-bold">HUID: {tag.huid}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-1">
                        <div className="flex justify-center py-1">
                          <BarcodeSvg value={tag.tag_no} width={160} height={28} />
                        </div>
                        <div className="text-[11px] font-mono text-slate-800 flex justify-between px-1">
                          <span><strong>{tag.tag_no}</strong></span>
                          <span>HUID: <strong className="text-blue-900">{tag.huid}</strong></span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-600 bg-white p-1 rounded border border-slate-200 flex justify-between">
                          <span>Gr: <strong>{tag.gross_wt}g</strong></span>
                          <span>Nt: <strong>{tag.net_wt}g</strong></span>
                          <span>Pur: <strong>{tag.purity}%</strong></span>
                          <span>Sz: <strong>{tag.size}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handlePrintSingle(tag)}
                      className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Label</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBarcodeToLoose(tag)}
                      className="text-[11px] text-rose-700 hover:text-rose-900 font-semibold underline cursor-pointer"
                    >
                      Barcode to Loose
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MULTIPLE OPENING STOCK BARCODE (WEIGHT RECONCILIATION & DIVISION) */}
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

          {/* Tags Table with all Mandated Fields showing Item Name */}
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
                    <th className="p-2 border-r border-slate-200">Item Name</th>
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
                      <td className="p-2 border-r border-slate-200 font-sans font-bold text-slate-900">{t.item_name}</td>
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
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
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
      {/* TAB 3: STOCK TRANSFER LOOSE TO BARCODE                                   */}
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
                <div key={ls.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 text-xs">{ls.item_name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                      {ls.purity}%
                    </span>
                  </div>
                  <div className="text-sm font-mono font-extrabold text-blue-900">
                    Gross Weight: {formatWeight(ls.gross_wt)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">Source: {ls.source}</div>
                  <button
                    type="button"
                    onClick={() => {
                      const newTagNo = `TAG-${Math.floor(10000 + Math.random() * 90000)}`;
                      const newTag: BarcodeTagItem = {
                        id: `tag-${Date.now()}`,
                        sr_no: allBarcodeInventory.length + 1,
                        tag_no: newTagNo,
                        item_name: ls.item_name,
                        item_type: 'Ornament',
                        category: 'Gold',
                        qty: 1,
                        gross_wt: ls.gross_wt,
                        net_wt: ls.gross_wt,
                        purity: ls.purity,
                        black_b: 0,
                        stone_wt: 0,
                        making_per_gm: 450,
                        making_pct: 0,
                        size: 'Standard',
                        hallmark_charges: 45,
                        huid: 'B9K8L1',
                        manual_tag: `M-${newTagNo}`,
                        is_printed: false,
                        is_loose: false,
                      };
                      setAllBarcodeInventory([newTag, ...allBarcodeInventory]);
                      setLooseInventory(looseInventory.filter((x) => x.id !== ls.id));
                      setActiveTab('print_studio');
                      alert(`✓ Successfully assigned Tag ${newTagNo} to "${ls.item_name}"! Switched to Barcode List.`);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-lg text-xs font-bold shadow flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Assign Barcode & Move to List</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINT PREVIEW MODAL (RENDERED WITH ITEM NAME ON EVERY PRINTABLE TAG)       */}
      {/* ========================================================================= */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center no-print">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">
                    Jewellery Barcode Tag Print Preview ({tagsToPrint.length} Tags)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Format: {printFormat.toUpperCase()} • All tags display complete Item Name & metal purity
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Print Format Selector inside Modal */}
                <select
                  value={printFormat}
                  onChange={(e) => setPrintFormat(e.target.value as any)}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs font-bold"
                >
                  <option value="dumbbell">Dumbbell Butterfly Tag (50x12mm)</option>
                  <option value="two_up">2-Up Barcode Label (A4 Sheet)</option>
                  <option value="qr_label">2D QR Code + Tag</option>
                  <option value="sheet">Tabular Barcode Stock Sheet</option>
                </select>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Send to Printer</span>
                </button>

                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Printable Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] bg-slate-100/60 print:p-0 print:bg-white">
              {/* Dumbbell Tag Format */}
              {printFormat === 'dumbbell' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tagsToPrint.map((tag) => (
                    <div
                      key={tag.id}
                      className="p-3 bg-white border-2 border-slate-900 rounded-lg shadow-sm flex items-center justify-between font-mono text-slate-900"
                      style={{ minHeight: '80px' }}
                    >
                      {/* Left Flap: Item Name & Barcode */}
                      <div className="w-[45%] text-left space-y-0.5">
                        <div className="font-black text-[11px] leading-tight text-slate-950 uppercase line-clamp-1">
                          {tag.item_name}
                        </div>
                        <div className="py-0.5">
                          <BarcodeSvg value={tag.tag_no} width={110} height={20} />
                        </div>
                        <div className="text-[10px] font-bold text-slate-900 tracking-wider">
                          {tag.tag_no}
                        </div>
                      </div>

                      {/* Center String Bridge */}
                      <div className="w-[8%] border-t-2 border-dashed border-slate-400 flex items-center justify-center">
                        <span className="text-[8px] text-slate-400 font-sans">•••</span>
                      </div>

                      {/* Right Flap: Gross Wt, Net Wt, Purity, HUID, Size */}
                      <div className="w-[45%] text-right text-[10px] leading-tight space-y-0.5">
                        <div className="font-bold text-slate-900">
                          Gr: <strong>{tag.gross_wt}g</strong> | Nt: <strong>{tag.net_wt}g</strong>
                        </div>
                        <div className="font-semibold text-slate-800">
                          Pur: <strong>{tag.purity}%</strong> • Sz: <strong>{tag.size}</strong>
                        </div>
                        <div className="font-black text-blue-900 text-[11px]">
                          HUID: {tag.huid}
                        </div>
                        <div className="text-[9px] text-slate-600">
                          Mkg: ₹{tag.making_per_gm}/g
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2-Up Barcode Label Format */}
              {printFormat === 'two_up' && (
                <div className="grid grid-cols-2 gap-3">
                  {tagsToPrint.map((tag) => (
                    <div
                      key={tag.id}
                      className="p-3 bg-white border-2 border-slate-800 rounded-lg text-center space-y-1 font-mono text-slate-900"
                    >
                      {/* Item Name Prominently at Top */}
                      <div className="font-black text-xs uppercase tracking-wide border-b border-slate-200 pb-1">
                        {tag.item_name}
                      </div>
                      <div className="flex justify-center py-1">
                        <BarcodeSvg value={tag.tag_no} width={150} height={26} />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold px-1">
                        <span>{tag.tag_no}</span>
                        <span>HUID: {tag.huid}</span>
                      </div>
                      <div className="flex justify-between text-[9px] bg-slate-50 p-1 rounded border border-slate-200">
                        <span>Gr: {tag.gross_wt}g</span>
                        <span>Nt: {tag.net_wt}g</span>
                        <span>{tag.purity}%</span>
                        <span>Sz: {tag.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* QR Label Format */}
              {printFormat === 'qr_label' && (
                <div className="grid grid-cols-2 gap-3">
                  {tagsToPrint.map((tag) => (
                    <div
                      key={tag.id}
                      className="p-3 bg-white border-2 border-slate-800 rounded-lg flex items-center space-x-3 font-mono text-slate-900"
                    >
                      <QrCode className="w-14 h-14 text-slate-950 shrink-0" />
                      <div className="text-left text-[10px] leading-tight space-y-0.5">
                        <div className="font-black text-[11px] uppercase text-slate-950 line-clamp-1">
                          {tag.item_name}
                        </div>
                        <div className="font-bold text-blue-900">{tag.tag_no}</div>
                        <div>Gr: {tag.gross_wt}g | Nt: {tag.net_wt}g</div>
                        <div>Purity: {tag.purity}% | Size: {tag.size}</div>
                        <div className="font-black text-blue-900">HUID: {tag.huid}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tabular Stock Sheet Format */}
              {printFormat === 'sheet' && (
                <div className="bg-white p-4 border border-slate-300 rounded-xl">
                  <div className="text-center pb-3 border-b-2 border-slate-800 mb-3">
                    <h3 className="text-sm font-black uppercase text-slate-900">
                      Jewellery Barcode Inventory Sheet
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Generated: {new Date().toLocaleDateString()} • {tagsToPrint.length} Items Listed
                    </p>
                  </div>
                  <table className="w-full text-left text-[10px] border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-slate-300 bg-slate-50 text-slate-700 font-bold">
                        <th className="p-1.5">#</th>
                        <th className="p-1.5">Item Name</th>
                        <th className="p-1.5">Tag No</th>
                        <th className="p-1.5 text-right">Gross Wt</th>
                        <th className="p-1.5 text-right">Net Wt</th>
                        <th className="p-1.5 text-center">Purity</th>
                        <th className="p-1.5 text-center">HUID</th>
                        <th className="p-1.5 text-center">Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {tagsToPrint.map((t, idx) => (
                        <tr key={t.id}>
                          <td className="p-1.5 text-slate-400">{idx + 1}</td>
                          <td className="p-1.5 font-bold font-sans text-slate-900">{t.item_name}</td>
                          <td className="p-1.5 font-bold text-blue-900">{t.tag_no}</td>
                          <td className="p-1.5 text-right">{t.gross_wt}g</td>
                          <td className="p-1.5 text-right font-bold">{t.net_wt}g</td>
                          <td className="p-1.5 text-center">{t.purity}%</td>
                          <td className="p-1.5 text-center font-bold">{t.huid}</td>
                          <td className="p-1.5 text-center">{t.size}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs font-sans no-print">
              <span className="text-slate-500">
                Ready to print {tagsToPrint.length} tag labels with thermal barcodes and item names.
              </span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow flex items-center space-x-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Now</span>
                </button>
              </div>
            </div>
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
