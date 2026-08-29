import React, { useState } from 'react';
import { PackagePlus, Save, XCircle, HelpCircle, Layers, Check } from 'lucide-react';
import { StockItem } from '../../types/erp';
import { FieldHelpModal } from '../common/FieldHelpModal';

interface ItemCreationViewProps {
  onAddItem: (item: StockItem) => void;
  onClose: () => void;
  goldRate: number;
}

export const ItemCreationView: React.FC<ItemCreationViewProps> = ({ onAddItem, onClose, goldRate }) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Gold');
  const [purity, setPurity] = useState(91.6);
  const [qty, setQty] = useState(1);
  const [grossWt, setGrossWt] = useState(10.0);
  const [stoneWt, setStoneWt] = useState(0);
  const [ratePerGm, setRatePerGm] = useState(goldRate);
  const [tagNo, setTagNo] = useState(`TAG-${Date.now().toString().slice(-6)}`);
  const [isUrd, setIsUrd] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const netWt = Math.max(0, grossWt - stoneWt);
  const fineWt = (netWt * purity) / 100;
  const totalValue = netWt * ratePerGm;

  const handleSave = () => {
    if (!itemName.trim()) {
      alert('Please enter Item Name');
      return;
    }
    const item: StockItem = {
      id: `stk-${Date.now()}`,
      item_name: itemName,
      qty,
      gross_wt: grossWt,
      net_wt: netWt,
      fine_wt: fineWt,
      purity,
      category,
      tag_no: tagNo,
      is_urd: isUrd,
      rate_per_gm: ratePerGm,
      total_value: totalValue,
    };
    onAddItem(item);
    alert(`Item ${itemName} (${tagNo}) created and added to stock ledger!`);
    onClose();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <PackagePlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span>Item Creation Master</span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-100 text-blue-800 font-mono font-bold border border-sky-200">
                Quick Action (F2)
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Define tagged items, loose bullion bars, purity categories, and default making rates.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Item (Alt+S)</span>
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 text-xs font-bold"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-sky-200/80 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 22K 916 Casted Floral Ring"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Tag / Barcode No</label>
            <input
              type="text"
              value={tagNo}
              onChange={(e) => setTagNo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-blue-800 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
            >
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Diamond">Diamond</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Purity (%)</label>
            <input
              type="number"
              step={0.1}
              value={purity}
              onChange={(e) => setPurity(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-right"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Quantity</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-center font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Gross Weight (g)</label>
            <input
              type="number"
              step={0.001}
              value={grossWt}
              onChange={(e) => setGrossWt(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-right font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Stone Weight (g)</label>
            <input
              type="number"
              step={0.001}
              value={stoneWt}
              onChange={(e) => setStoneWt(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-mono text-right"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Valuation Rate/Gm (₹)</label>
            <input
              type="number"
              value={ratePerGm}
              onChange={(e) => setRatePerGm(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-right font-bold"
            />
          </div>
        </div>

        <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-lg flex flex-wrap justify-between items-center text-xs font-mono">
          <div>Net Weight: <strong className="text-blue-800">{netWt.toFixed(3)} g</strong></div>
          <div>Fine Pure Bullion: <strong className="text-amber-800">{fineWt.toFixed(3)} g</strong></div>
          <div>Total Stock Valuation: <strong className="text-emerald-700">₹{Math.round(totalValue).toLocaleString('en-IN')}</strong></div>
          <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 font-sans text-xs">
            <input
              type="checkbox"
              checked={isUrd}
              onChange={(e) => setIsUrd(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 w-3.5 h-3.5"
            />
            <span>Mark as URD Scrap Item</span>
          </label>
        </div>
      </div>

      <FieldHelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        screenName="Stock Report"
      />
    </div>
  );
};
