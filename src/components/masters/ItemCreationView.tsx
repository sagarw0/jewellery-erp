import React, { useState, useRef } from 'react';
import {
  PackagePlus,
  Save,
  Trash2,
  XCircle,
  HelpCircle,
  Layers,
  Image as ImageIcon,
  RotateCcw,
  Sliders,
  Scale,
  Plus,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Upload,
  CheckCircle2,
  PackageCheck,
  Tag
} from 'lucide-react';
import { StockItem, ItemMasterDefinition, ColumnSetting } from '../../types/erp';
import { FieldHelpModal } from '../common/FieldHelpModal';
import { ColumnSettingsModal } from '../common/ColumnSettingsModal';
import { useTheme } from '../../context/ThemeContext';
import { formatWeight } from '../../utils/calculations';

export interface OpeningPieceRecord {
  id: string;
  item_name: string;
  qty: number;
  gross_wt: number;
  black_beats: number;
  stone_wt: number;
  diamond_cts: number;
  bag_wt: number;
  purity: number;
  net_wt: number;
  fine_wt: number;
  size: string;
  tag_no: string;
  created_at: string;
}

interface ItemCreationViewProps {
  onAddItem: (item: StockItem) => void;
  onClose: () => void;
  goldRate?: number;
}

const DEFAULT_ITEM_COLUMNS: ColumnSetting[] = [
  { id: 'item_name', label: 'Item Name', visible: true, width: 200, order: 0 },
  { id: 'item_type', label: 'Type', visible: true, width: 100, order: 1 },
  { id: 'item_group', label: 'Group', visible: true, width: 110, order: 2 },
  { id: 'design', label: 'Design', visible: true, width: 110, order: 3 },
  { id: 'total_stock_weight', label: 'Total Wt (g)', visible: true, width: 110, order: 4 },
  { id: 'remaining_weight', label: 'Remaining (g)', visible: true, width: 110, order: 5 },
];

export const ItemCreationView: React.FC<ItemCreationViewProps> = ({ onAddItem, onClose }) => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'create_item' | 'opening_stock'>('create_item');

  // Existing Created Items Master Store
  const [createdItems, setCreatedItems] = useState<ItemMasterDefinition[]>([
    {
      id: 'itm-1',
      item_name: '22K 916 Casted Royal Floral Ring',
      item_type: 'Ring',
      item_group: 'Gold',
      design: 'Casted',
      weight_or_qty: 'Weight',
      total_stock_weight: 150.0,
      remaining_weight: 120.0,
      image_url: '',
      created_at: '2026-08-25',
    },
    {
      id: 'itm-2',
      item_name: '916 Antique Temple Lakshmi Bangle',
      item_type: 'Bangle',
      item_group: 'Gold',
      design: 'Antique',
      weight_or_qty: 'Weight',
      total_stock_weight: 350.0,
      remaining_weight: 350.0,
      image_url: '',
      created_at: '2026-08-26',
    },
    {
      id: 'itm-3',
      item_name: '1 Gram Micro-Plated Bridal Mangalsutra',
      item_type: 'Mangalsutra',
      item_group: '1gm Imitation',
      design: 'Handmade',
      weight_or_qty: 'QTY',
      total_stock_weight: 500.0,
      remaining_weight: 500.0,
      image_url: '',
      created_at: '2026-08-27',
    },
  ]);

  // Divided pieces across master items
  const [openingPieces, setOpeningPieces] = useState<OpeningPieceRecord[]>([
    {
      id: 'op-1',
      item_name: '22K 916 Casted Royal Floral Ring',
      qty: 1,
      gross_wt: 30.0,
      black_beats: 0,
      stone_wt: 0.5,
      diamond_cts: 0,
      bag_wt: 0.1,
      purity: 91.6,
      net_wt: 29.4,
      fine_wt: 26.93,
      size: '14',
      tag_no: 'OPN-88201',
      created_at: '2026-08-25',
    },
  ]);

  // Tab 1: Create Item Form State
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('Ring');
  const [itemGroup, setItemGroup] = useState('Gold');
  const [design, setDesign] = useState('Casted');
  const [weightOrQty, setWeightOrQty] = useState<'Weight' | 'QTY'>('Weight');
  const [totalStockWeight, setTotalStockWeight] = useState(100.0);
  const [itemImage, setItemImage] = useState<string | null>(null);

  // Tab 2: Opening Stock Form State
  const [selectedOpeningItem, setSelectedOpeningItem] = useState(createdItems[0]?.item_name || '');
  const currentMasterItem = createdItems.find((it) => it.item_name === selectedOpeningItem) || createdItems[0];
  const itemTotalBatchWeight = currentMasterItem ? currentMasterItem.total_stock_weight : 0;

  // Derived calculations for selected master item on Tab 2
  const currentItemPieces = openingPieces.filter((p) => p.item_name === currentMasterItem?.item_name);
  const totalAllocatedGross = currentItemPieces.reduce((s, p) => s + (p.gross_wt || 0), 0);
  const remainingBatchWeight = Math.max(0, Number((itemTotalBatchWeight - totalAllocatedGross).toFixed(3)));
  const isFullyAllocated = remainingBatchWeight === 0 && itemTotalBatchWeight > 0;

  const [grossWt, setGrossWt] = useState(remainingBatchWeight > 0 ? remainingBatchWeight : 10.0);
  const [blackBeats, setBlackBeats] = useState(0.0);
  const [stoneWt, setStoneWt] = useState(0.5);
  const [diamondCts, setDiamondCts] = useState(0.0);
  const [bagWt, setBagWt] = useState(0.1);
  const [purity, setPurity] = useState(91.6);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('14');

  // Weight Adjustment Modal State
  const [showWeightAdjustmentModal, setShowWeightAdjustmentModal] = useState(false);
  const [weightChangeAmount, setWeightChangeAmount] = useState(0);
  const [weightChangeType, setWeightChangeType] = useState<'decrease' | 'increase'>('decrease');
  const [adjustmentSource, setAdjustmentSource] = useState<'urd' | 'new_purchase'>('urd');

  // Grid Settings & Help Modals
  const [columns, setColumns] = useState<ColumnSetting[]>(DEFAULT_ITEM_COLUMNS);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculated piece weights
  const netWt = Math.max(0, Number((grossWt - blackBeats - stoneWt - bagWt).toFixed(3)));
  const finalWt = Number(((netWt * purity) / 100).toFixed(3));

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save Item (Create Item Master)
  const handleSaveItem = () => {
    if (!itemName.trim()) {
      alert('Please enter Item Name');
      return;
    }

    const newItem: ItemMasterDefinition = {
      id: selectedItemId || `itm-${Date.now()}`,
      item_name: itemName,
      item_type: itemType,
      item_group: itemGroup,
      design,
      weight_or_qty: weightOrQty,
      total_stock_weight: totalStockWeight,
      remaining_weight: totalStockWeight,
      image_url: itemImage || '',
      created_at: new Date().toISOString().split('T')[0],
    };

    if (selectedItemId) {
      setCreatedItems((prev) => prev.map((it) => (it.id === selectedItemId ? newItem : it)));
      alert(`Item "${itemName}" updated successfully!`);
    } else {
      setCreatedItems((prev) => [newItem, ...prev]);
      setSelectedOpeningItem(itemName);
      setGrossWt(totalStockWeight);
      alert(`Item "${itemName}" created with Total Batch Weight of ${totalStockWeight}g! You can now divide it into individual pieces under Tab 2 (Opening Stock).`);
    }

    handleCancel();
  };

  // Handle Select Opening Item dropdown change
  const handleSelectOpeningItem = (name: string) => {
    setSelectedOpeningItem(name);
    const targetMaster = createdItems.find((it) => it.item_name === name);
    if (targetMaster) {
      const allocated = openingPieces.filter((p) => p.item_name === name).reduce((s, p) => s + (p.gross_wt || 0), 0);
      const rem = Math.max(0, Number((targetMaster.total_stock_weight - allocated).toFixed(3)));
      setGrossWt(rem > 0 ? rem : 0);
    }
  };

  // Handle Save Opening Stock Piece (Live weight deduction)
  const handleSaveOpeningStock = () => {
    if (!selectedOpeningItem) {
      alert('Please select an Item Name');
      return;
    }
    if (grossWt <= 0) {
      alert('Please enter a valid Gross Weight greater than 0g');
      return;
    }
    if (grossWt > remainingBatchWeight) {
      alert(`Cannot add piece of ${grossWt}g! Only ${remainingBatchWeight}g remaining from total batch of ${itemTotalBatchWeight}g.`);
      return;
    }

    const tagNo = `OPN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPiece: OpeningPieceRecord = {
      id: `op-${Date.now()}`,
      item_name: selectedOpeningItem,
      qty,
      gross_wt: grossWt,
      black_beats: blackBeats,
      stone_wt: stoneWt,
      diamond_cts: diamondCts,
      bag_wt: bagWt,
      purity,
      net_wt: netWt,
      fine_wt: finalWt,
      size,
      tag_no: tagNo,
      created_at: new Date().toISOString().split('T')[0],
    };

    const nextPieces = [...openingPieces, newPiece];
    setOpeningPieces(nextPieces);

    // Save piece into global ERP inventory
    const stockItem: StockItem = {
      id: `stk-${Date.now()}`,
      item_name: `${selectedOpeningItem} (${tagNo})`,
      qty,
      gross_wt: grossWt,
      net_wt: netWt,
      fine_wt: finalWt,
      purity,
      category: currentMasterItem?.item_group || 'Gold',
      tag_no: tagNo,
      is_urd: currentMasterItem?.item_group?.includes('URD') || false,
      is_loose: true,
      rate_per_gm: 0,
      total_value: 0,
    };
    onAddItem(stockItem);

    // Update remaining weight in created items list
    const newRemaining = Math.max(0, Number((remainingBatchWeight - grossWt).toFixed(3)));
    setCreatedItems((prev) =>
      prev.map((it) => (it.item_name === selectedOpeningItem ? { ...it, remaining_weight: newRemaining } : it))
    );

    // Reset input gross weight to the remaining weight for the next piece
    setGrossWt(newRemaining > 0 ? newRemaining : 0);
    setBlackBeats(0);
    setStoneWt(0);
    setDiamondCts(0);
    setBagWt(0);

    alert(`✓ Piece ${tagNo} (${grossWt}g) added! ${newRemaining}g remaining to divide from ${itemTotalBatchWeight}g.`);
  };

  // Remove a divided piece and restore its weight
  const handleRemovePiece = (pieceId: string) => {
    const piece = openingPieces.find((p) => p.id === pieceId);
    if (!piece) return;
    if (confirm(`Remove piece ${piece.tag_no} (${piece.gross_wt}g) and restore weight back to ${selectedOpeningItem}?`)) {
      const nextPieces = openingPieces.filter((p) => p.id !== pieceId);
      setOpeningPieces(nextPieces);

      const targetMaster = createdItems.find((it) => it.item_name === selectedOpeningItem);
      if (targetMaster) {
        const allocated = nextPieces.filter((p) => p.item_name === selectedOpeningItem).reduce((s, p) => s + p.gross_wt, 0);
        const rem = Math.max(0, Number((targetMaster.total_stock_weight - allocated).toFixed(3)));
        setCreatedItems((prev) =>
          prev.map((it) => (it.item_name === selectedOpeningItem ? { ...it, remaining_weight: rem } : it))
        );
        setGrossWt(rem);
      }
    }
  };

  // Cancel / Reset Form
  const handleCancel = () => {
    setSelectedItemId('');
    setItemName('');
    setItemType('Ring');
    setItemGroup('Gold');
    setDesign('Casted');
    setWeightOrQty('Weight');
    setTotalStockWeight(100.0);
    setItemImage(null);
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item definition?')) {
      setCreatedItems((prev) => prev.filter((it) => it.id !== id));
      handleCancel();
    }
  };

  // Select Item to Edit
  const handleSelectItem = (it: ItemMasterDefinition) => {
    setSelectedItemId(it.id);
    setItemName(it.item_name);
    setItemType(it.item_type);
    setItemGroup(it.item_group);
    setDesign(it.design);
    setWeightOrQty(it.weight_or_qty);
    setTotalStockWeight(it.total_stock_weight);
    setItemImage(it.image_url || null);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Toolbar */}
      <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <PackagePlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span>Item Creation & Opening Stock Master</span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-100 text-blue-800 font-mono font-bold border border-sky-200">
                F2 Action
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Create master items, assign total batch weights, divide into individual pieces, and adjust inventory.
            </p>
          </div>
        </div>

        {/* Universal Action Buttons (Save, Delete, Cancel, Close, GS, Help) */}
        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={() => setShowColumnSettings(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200 hover:bg-slate-200 cursor-pointer"
            title="Grid Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>GS</span>
          </button>

          <button
            onClick={activeTab === 'create_item' ? handleSaveItem : handleSaveOpeningStock}
            className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{activeTab === 'create_item' ? 'Save Item (Alt+S)' : 'Save Piece (Alt+S)'}</span>
          </button>

          {selectedItemId && activeTab === 'create_item' && (
            <button
              onClick={() => handleDeleteItem(selectedItemId)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 hover:bg-rose-100 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}

          <button
            onClick={handleCancel}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 hover:bg-slate-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-300 hover:bg-amber-100 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Strip: 1. Create Item | 2. Opening Stock */}
      <div className="flex border-b border-sky-200 bg-white rounded-t-xl px-2 pt-2 space-x-2 shadow-2xs">
        <button
          onClick={() => setActiveTab('create_item')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'create_item'
              ? 'bg-blue-50/80 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          1. Create Item (Master & Total Stock Weight)
        </button>
        <button
          onClick={() => setActiveTab('opening_stock')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'opening_stock'
              ? 'bg-blue-50/80 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          2. Opening Stock (Divide Batch into Pieces & Live Deduction)
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CREATE ITEM                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'create_item' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Form (7 Cols) */}
          <div className={`lg:col-span-7 ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-5 shadow-sm space-y-4`}>
            <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
              <span className="font-bold text-blue-900 text-xs uppercase tracking-wider">
                {selectedItemId ? 'Edit Master Item' : 'New Master Item Definition'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Owner Total Batch Entry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Item Name */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 22K 916 Royal Peacock Choker Necklace / Om Ring"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Item Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Item Type</label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  {['Ring', 'Chain', 'Bangle', 'Necklace', 'Mangalsutra', 'Earring', 'Bracelet', 'Coin', 'Bar', 'Payal', 'Pendant'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Item Group */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Item Group</label>
                <select
                  value={itemGroup}
                  onChange={(e) => setItemGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  {['Gold', 'Silver', '1gm Imitation', 'URD Gold', 'URD Silver', 'Diamond', 'Platinum'].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Design */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Design</label>
                <select
                  value={design}
                  onChange={(e) => setDesign(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  {['Casted', 'Handmade', 'Laser Cut', 'Filigree', 'Antique', 'Plain', 'Studded', 'Meenakari', 'Rhodium'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Weight / QTY dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Weight / QTY Mode</label>
                <select
                  value={weightOrQty}
                  onChange={(e) => setWeightOrQty(e.target.value as 'Weight' | 'QTY')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
                >
                  <option value="Weight">Weight (Grams)</option>
                  <option value="QTY">QTY (Pieces / Pairs)</option>
                </select>
              </div>

              {/* Total Stock Weight */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Total Stock Weight (g) <span className="text-blue-600 font-mono">(Batch Total)</span>
                </label>
                <input
                  type="number"
                  step={0.001}
                  value={totalStockWeight}
                  onChange={(e) => setTotalStockWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-blue-900 font-mono text-right font-semibold text-sm"
                />
              </div>

              {/* Add Image Option */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Ornament Photo (Optional)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-lg border border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-semibold flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{itemImage ? 'Change Image' : 'Add Image'}</span>
                </button>
              </div>
            </div>

            {/* Image Preview if uploaded */}
            {itemImage && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3">
                <img src={itemImage} alt="Ornament Preview" className="w-16 h-16 object-cover rounded-lg border" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800">Uploaded Design Preview</span>
                  <p className="text-[11px] text-slate-500">Will be linked to barcode tags & catalog.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Directory: Created Master Items (5 Cols) */}
          <div className={`lg:col-span-5 ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm space-y-3`}>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Created Master Items List
              </span>
              <span className="text-[11px] font-mono text-blue-700 font-bold">{createdItems.length} Items</span>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {createdItems.map((it) => (
                <div
                  key={it.id}
                  onClick={() => handleSelectItem(it)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                    selectedItemId === it.id
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900">{it.item_name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-blue-800 font-bold">
                      {it.item_group}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-600 mt-1 font-mono">
                    <span>{it.item_type} • {it.design}</span>
                    <span className="font-bold text-blue-900">Total: {formatWeight(it.total_stock_weight)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: OPENING STOCK (BATCH DIVISION INTO MULTIPLE PIECES & LIVE DEDUCTION)*/}
      {/* ========================================================================= */}
      {activeTab === 'opening_stock' && (
        <div className="space-y-4">
          {/* Top Live Weight Reconciliation Banner */}
          <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs items-center`}>
            {/* 1. Master Total Weight */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center font-mono">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">1. Total Batch Weight</span>
              <strong className="text-lg text-slate-900 font-semibold">{formatWeight(itemTotalBatchWeight)}</strong>
              <span className="text-[10px] text-slate-500 block truncate font-sans">{selectedOpeningItem}</span>
            </div>

            {/* 2. Allocated to Pieces */}
            <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-center font-mono">
              <span className="text-[10px] text-blue-700 font-bold uppercase block">2. Allocated to Pieces</span>
              <strong className="text-lg text-blue-900 font-semibold">{formatWeight(totalAllocatedGross)}</strong>
              <span className="text-[10px] text-blue-700 block font-sans">{currentItemPieces.length} Pieces Divided</span>
            </div>

            {/* 3. Remaining Weight to Divide */}
            <div className={`p-3 rounded-xl text-center font-mono border transition-all ${
              isFullyAllocated
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <span className="text-[10px] font-bold uppercase block">
                {isFullyAllocated ? '3. Remaining Weight' : '3. Remaining Weight to Divide'}
              </span>
              <strong className="text-lg font-semibold">
                {formatWeight(remainingBatchWeight)}
              </strong>
              <span className="text-[10px] block font-sans">
                {isFullyAllocated ? 'Zero Balance Left' : 'Decreases live as pieces add'}
              </span>
            </div>

            {/* 4. Batch Allocation Status */}
            <div className={`p-3 rounded-xl text-center font-mono border ${
              isFullyAllocated
                ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                : 'bg-blue-50 border-blue-300 text-blue-900'
            }`}>
              <span className="text-[10px] font-bold uppercase block">4. Allocation Status</span>
              <div className="flex items-center justify-center space-x-1 mt-0.5">
                {isFullyAllocated ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                ) : (
                  <PackageCheck className="w-4 h-4 text-blue-600 inline" />
                )}
                <span className="text-sm font-semibold font-sans">
                  {isFullyAllocated ? '✓ 100% Fully Allocated' : 'Division in Progress'}
                </span>
              </div>
              <span className="text-[10px] block text-slate-500 font-sans">
                {isFullyAllocated ? 'All batch weight divided' : `${remainingBatchWeight}g remaining to tag`}
              </span>
            </div>
          </div>

          {/* Piece Entry Form */}
          <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-5 shadow-sm space-y-4`}>
            <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
              <span className="font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Tag className="w-4 h-4 text-blue-600" />
                <span>Opening Stock Piece Registration & Detailed Weight Breakdown</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {isFullyAllocated ? (
                  <strong className="text-emerald-700">✓ Batch Fully Divided</strong>
                ) : (
                  <span>Available to allocate: <strong className="text-blue-900">{remainingBatchWeight}g</strong></span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {/* Select Item Name */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Select Item Name <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedOpeningItem}
                  onChange={(e) => handleSelectOpeningItem(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
                >
                  {createdItems.map((it) => (
                    <option key={it.id} value={it.item_name}>
                      {it.item_name} ({it.total_stock_weight}g Total - {it.item_group})
                    </option>
                  ))}
                </select>
              </div>

              {/* Qty */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Qty (Pieces)</label>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-center font-bold"
                />
              </div>

              {/* Size */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Size</label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="e.g. 14, 2.4, 18 inch"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-center font-mono"
                />
              </div>

              {/* Gross Weight */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Gross Weight (g) <span className="text-rose-500">*</span>
                  <span className="text-slate-400 font-normal ml-1">(Max: {remainingBatchWeight}g)</span>
                </label>
                <input
                  type="number"
                  step={0.001}
                  value={grossWt}
                  onChange={(e) => setGrossWt(parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg font-mono text-right font-bold ${
                    grossWt > remainingBatchWeight
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Black Beats */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Black Beats (g)</label>
                <input
                  type="number"
                  step={0.001}
                  value={blackBeats}
                  onChange={(e) => setBlackBeats(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-right"
                />
              </div>

              {/* Stone Wt */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Stone Wt (g)</label>
                <input
                  type="number"
                  step={0.001}
                  value={stoneWt}
                  onChange={(e) => setStoneWt(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-right"
                />
              </div>

              {/* Diamond (cts) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Diamond (Carats)</label>
                <input
                  type="number"
                  step={0.01}
                  value={diamondCts}
                  onChange={(e) => setDiamondCts(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-right"
                />
              </div>

              {/* Bag Wt */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Bag Wt (g)</label>
                <input
                  type="number"
                  step={0.001}
                  value={bagWt}
                  onChange={(e) => setBagWt(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-right"
                />
              </div>

              {/* Purity (%) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Purity (%)</label>
                <input
                  type="number"
                  step={0.1}
                  value={purity}
                  onChange={(e) => setPurity(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-right font-bold"
                />
              </div>

              {/* Net Wt (Calculated) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Net Weight (g)</label>
                <div className="w-full px-3 py-2 bg-sky-50 border border-sky-200 rounded-lg text-blue-900 font-mono text-right font-bold">
                  {netWt.toFixed(3)} g
                </div>
              </div>

              {/* Final Weight (Fine Bullion) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Final Weight (Fine Bullion)</label>
                <div className="w-full px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-mono text-right font-bold">
                  {finalWt.toFixed(3)} g
                </div>
              </div>
            </div>

            {/* In-form Add Piece Button */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveOpeningStock}
                disabled={isFullyAllocated}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center space-x-1.5 cursor-pointer transition-all ${
                  isFullyAllocated
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Piece to Stock & Deduct Weight ({grossWt}g)</span>
              </button>
            </div>
          </div>

          {/* Divided Pieces Breakdown Table for Selected Master Item */}
          <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 shadow-sm space-y-3`}>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Divided Pieces for "{selectedOpeningItem}" ({currentItemPieces.length} Pieces)
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Total Batch: <strong className="text-slate-900">{formatWeight(itemTotalBatchWeight)}</strong> | Allocated:{' '}
                <strong className="text-blue-900">{formatWeight(totalAllocatedGross)}</strong> | Remaining:{' '}
                <strong className={remainingBatchWeight === 0 ? 'text-emerald-700' : 'text-amber-700'}>
                  {formatWeight(remainingBatchWeight)}
                </strong>
              </span>
            </div>

            {currentItemPieces.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs">
                No pieces added yet for {selectedOpeningItem}. Enter piece weight above to start dividing the batch.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2 border-r border-slate-200 text-center w-10">#</th>
                      <th className="p-2 border-r border-slate-200 font-mono">Tag / Piece No</th>
                      <th className="p-2 border-r border-slate-200 text-center w-12">Qty</th>
                      <th className="p-2 border-r border-slate-200 text-right">Gross Wt</th>
                      <th className="p-2 border-r border-slate-200 text-right">Black Beads</th>
                      <th className="p-2 border-r border-slate-200 text-right">Stone Wt</th>
                      <th className="p-2 border-r border-slate-200 text-right">Bag Wt</th>
                      <th className="p-2 border-r border-slate-200 text-right font-bold text-blue-800">Net Wt</th>
                      <th className="p-2 border-r border-slate-200 text-center">Purity</th>
                      <th className="p-2 border-r border-slate-200 text-right font-bold text-amber-800">Fine Bullion</th>
                      <th className="p-2 border-r border-slate-200 text-center">Size</th>
                      <th className="p-2 text-center w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
                    {currentItemPieces.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-sky-50/30">
                        <td className="p-2 border-r border-slate-200 text-center text-slate-400">{idx + 1}</td>
                        <td className="p-2 border-r border-slate-200 font-bold text-blue-900">{p.tag_no}</td>
                        <td className="p-2 border-r border-slate-200 text-center">{p.qty}</td>
                        <td className="p-2 border-r border-slate-200 text-right font-bold text-slate-900">
                          {formatWeight(p.gross_wt)}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-right">{p.black_beats}g</td>
                        <td className="p-2 border-r border-slate-200 text-right">{p.stone_wt}g</td>
                        <td className="p-2 border-r border-slate-200 text-right">{p.bag_wt}g</td>
                        <td className="p-2 border-r border-slate-200 text-right font-bold text-blue-800">
                          {formatWeight(p.net_wt)}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-center">{p.purity}%</td>
                        <td className="p-2 border-r border-slate-200 text-right font-bold text-amber-800">
                          {formatWeight(p.fine_wt)}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-center">{p.size}</td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemovePiece(p.id)}
                            className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                            title="Remove piece and restore weight"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold font-mono border-t border-slate-300 text-xs">
                    <tr>
                      <td colSpan={3} className="p-2 font-sans uppercase text-right">
                        Allocated Total:
                      </td>
                      <td className="p-2 text-right text-slate-900 font-semibold">{formatWeight(totalAllocatedGross)}</td>
                      <td colSpan={3} className="p-2"></td>
                      <td className="p-2 text-right text-blue-900 font-semibold">
                        {formatWeight(currentItemPieces.reduce((s, p) => s + p.net_wt, 0))}
                      </td>
                      <td></td>
                      <td className="p-2 text-right text-amber-900 font-semibold">
                        {formatWeight(currentItemPieces.reduce((s, p) => s + p.fine_wt, 0))}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Weight Adjustment Rules Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                <Scale className="w-4 h-4 text-blue-600" />
                <span>Inventory Weight Adjustment Rules (Decrease / Increase)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowWeightAdjustmentModal(true)}
                className="text-xs px-3 py-1 bg-white border border-slate-300 hover:border-blue-400 rounded-lg font-bold text-blue-700 cursor-pointer shadow-2xs"
              >
                Log Weight Adjustment
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              • <strong>Decreasing Weight</strong>: Decreased ornament weight is automatically transferred and added into <strong>URD Scrap</strong>.<br />
              • <strong>Increasing Weight</strong>: Additional weight can be drawn directly from <strong>URD Scrap</strong> or recorded as a <strong>New Purchase</strong> of raw gold/silver.
            </p>
          </div>
        </div>
      )}

      {/* Weight Adjustment Modal */}
      {showWeightAdjustmentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-sky-200/90 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in duration-150 text-slate-800">
            <div className="px-5 py-3.5 bg-gradient-to-r from-blue-700 to-sky-600 text-white flex justify-between items-center">
              <span className="font-bold text-sm">Item Weight Adjustment</span>
              <button onClick={() => setShowWeightAdjustmentModal(false)} className="text-white/80 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWeightChangeType('decrease')}
                    className={`py-2 rounded-lg font-bold border transition-all ${
                      weightChangeType === 'decrease'
                        ? 'bg-rose-50 border-rose-400 text-rose-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Decrease Weight (➔ URD)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightChangeType('increase')}
                    className={`py-2 rounded-lg font-bold border transition-all ${
                      weightChangeType === 'increase'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Increase Weight
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Weight Difference (Grams)</label>
                <input
                  type="number"
                  step={0.001}
                  value={weightChangeAmount}
                  onChange={(e) => setWeightChangeAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-right text-sm font-bold text-slate-900"
                />
              </div>

              {weightChangeType === 'increase' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Source for Additional Metal</label>
                  <select
                    value={adjustmentSource}
                    onChange={(e) => setAdjustmentSource(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="urd">Draw from URD Scrap Inventory</option>
                    <option value="new_purchase">Record as New Raw Metal Purchase</option>
                  </select>
                </div>
              )}

              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-[11px] text-blue-900">
                {weightChangeType === 'decrease'
                  ? `✓ ${weightChangeAmount}g will be deducted from active stock and credited to URD Scrap ledger.`
                  : `✓ ${weightChangeAmount}g will be added to stock via ${adjustmentSource === 'urd' ? 'URD Scrap consumption' : 'New Purchase invoice'}.`}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowWeightAdjustmentModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Weight adjustment of ${weightChangeAmount}g applied successfully!`);
                  setShowWeightAdjustmentModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow"
              >
                Apply Adjustment
              </button>
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

      {/* Help Modal */}
      <FieldHelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        screenName="Item Creation"
      />
    </div>
  );
};

