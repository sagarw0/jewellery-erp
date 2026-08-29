import React, { useState } from 'react';
import { Barcode, Printer, XCircle } from 'lucide-react';
import { StockItem } from '../../types/erp';
import { formatWeight } from '../../utils/calculations';

interface BarcodeViewProps {
  stockItems: StockItem[];
  onClose: () => void;
}

export const BarcodeView: React.FC<BarcodeViewProps> = ({ stockItems, onClose }) => {
  const [selectedItem, setSelectedItem] = useState(stockItems[0]?.id || '');
  const [printCopies, setPrintCopies] = useState(4);
  const [huidCode, setHuidCode] = useState('B9K2M7');

  const item = stockItems.find((i) => i.id === selectedItem) || stockItems[0];

  const handlePrintTags = () => {
    window.print();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 flex items-center justify-between shadow-sm no-print">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
            <Barcode className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span>Jewellery Barcode & RFID Tag Studio</span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-100 text-blue-800 font-mono font-bold border border-sky-200">
                Quick Action (F3)
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Print BIS Hallmark compliant dumbbell butterfly tags with laser HUID, Gross Wt, and Net Wt.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrintTags}
            className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print {printCopies} Dumbbell Tags</span>
          </button>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs no-print">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Ornament / Item</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
          >
            {stockItems.map((stk) => (
              <option key={stk.id} value={stk.id}>
                {stk.item_name} ({stk.tag_no}) - {stk.gross_wt}g
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">BIS HUID (6-Char Code)</label>
          <input
            type="text"
            maxLength={6}
            value={huidCode}
            onChange={(e) => setHuidCode(e.target.value.toUpperCase())}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-blue-800 font-mono font-bold uppercase"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Label Copies</label>
          <input
            type="number"
            min={1}
            max={50}
            value={printCopies}
            onChange={(e) => setPrintCopies(parseInt(e.target.value) || 1)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
      </div>

      <div className="bg-white border border-sky-200/80 rounded-xl p-5 shadow-sm space-y-3">
        <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block no-print">
          Jewellery Dumbbell Tag Sheet Preview
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          {Array.from({ length: printCopies }).map((_, idx) => (
            <div
              key={idx}
              className="p-3 bg-white text-slate-900 rounded-lg border-2 border-dashed border-slate-300 shadow-xs flex flex-col justify-between text-[10px] space-y-1 font-mono"
            >
              <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                <span className="font-bold text-[11px] text-blue-950">SWARNA</span>
                <span className="text-amber-700 font-bold">{item.purity}% 916</span>
              </div>

              <div className="space-y-0.5 pt-0.5">
                <div className="text-[10px] font-sans font-bold text-slate-900 truncate">
                  {item.item_name}
                </div>
                <div className="flex justify-between">
                  <span>G.WT: {formatWeight(item.gross_wt)}</span>
                  <span className="font-bold text-blue-900">N.WT: {formatWeight(item.net_wt)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>TAG: {item.tag_no}</span>
                  <span className="font-bold text-amber-900">HUID: {huidCode}</span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-100 flex flex-col items-center">
                <div className="h-6 w-full flex items-center justify-center space-x-0.5">
                  {Array.from({ length: 32 }).map((_, bIdx) => (
                    <span
                      key={bIdx}
                      className={`h-full inline-block ${bIdx % 3 === 0 ? 'w-1 bg-black' : bIdx % 2 === 0 ? 'w-0.5 bg-black' : 'w-0.5 bg-transparent'}`}
                    ></span>
                  ))}
                </div>
                <span className="text-[8px] text-slate-400">{item.tag_no}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
