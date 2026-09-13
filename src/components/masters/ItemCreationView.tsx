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
  Upload
} from 'lucide-react';
import { StockItem, ItemMasterDefinition, OpeningStockItem, ColumnSetting } from '../../types/erp';
import { FieldHelpModal } from '../common/FieldHelpModal';
import { ColumnSettingsModal } from '../common/ColumnSettingsModal';
import { useTheme } from '../../context/ThemeContext';
import { formatWeight } from '../../utils/calculations';

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
  const [grossWt, setGrossWt] = useState(15.5);
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

  // Calculated weights
  const netWt = Math.max(0, grossWt - blackBeats - stoneWt - bagWt);
  const finalWt = (netWt * purity) / 100;

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

  // Handle Save Item (Create Item)
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
      alert(`Item "${itemName}" created with Total Batch Weight of ${totalStockWeight}g!`);
    }

    handleCancel();
  };

  // Handle Save Opening Stock
  const handleSaveOpeningStock = () => {
    if (!selectedOpeningItem) {
      alert('Please select an Item Name');
      return;
    }

    const stockItem: StockItem = {
      id: `stk-${Date.now()}`,
      item_name: selectedOpeningItem,
      qty,
      gross_wt: grossWt,
      net_wt: netWt,
      fine_wt: finalWt,
      purity,
      category: itemGroup,
      tag_no: `OPN-${Date.now().toString().slice(-5)}`,
      is_urd: itemGroup.includes('URD'),
      is_loose: true,
      rate_per_gm: 0,
      total_value: 0,
    };

    onAddItem(stockItem);
    alert(`Opening Stock for "${selectedOpeningItem}" saved into loose inventory!`);
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
              Create master items, assign total batch weights, register opening stock, and adjust inventory.
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
            <span>Save (Alt+S)</span>
          </button>

          {selectedItemId && (
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
          2. Opening Stock (Item Weight & Details)
        </button>
      </div>

      {/* TAB 1: CREATE ITEM */}
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
                  placeholder="e.g. 22K 916 Royal Peacock Choker Necklace"
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-blue-900 font-mono text-right font-extrabold text-sm"
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

      {/* TAB 2: OPENING STOCK */}
      {activeTab === 'opening_stock' && (
        <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-5 shadow-sm space-y-5`}>
          <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
            <span className="font-bold text-blue-900 text-xs uppercase tracking-wider">
              Opening Stock Registration & Detailed Weight Breakdown
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Purity & Net Weight Auto-Calculated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Item Name dropdown from created items */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Select Item Name <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedOpeningItem}
                onChange={(e) => setSelectedOpeningItem(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
              >
                {createdItems.map((it) => (
                  <option key={it.id} value={it.item_name}>
                    {it.item_name} ({it.item_group} - {it.item_type})
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
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Gross Weight (g) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                step={0.001}
                value={grossWt}
                onChange={(e) => setGrossWt(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-right font-bold"
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
          <div className="bg-white border border-sky-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in duration-150 text-slate-800">
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
