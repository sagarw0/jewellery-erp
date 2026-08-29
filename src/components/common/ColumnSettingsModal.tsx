import React, { useState } from 'react';
import { ColumnSetting } from '../../types/erp';
import { Sliders, Eye, EyeOff, Check, X, RotateCcw } from 'lucide-react';

interface ColumnSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnSetting[];
  onSave: (columns: ColumnSetting[]) => void;
}

export const ColumnSettingsModal: React.FC<ColumnSettingsModalProps> = ({
  isOpen,
  onClose,
  columns,
  onSave,
}) => {
  if (!isOpen) return null;

  const [cols, setCols] = useState<ColumnSetting[]>([...columns]);

  const toggleVisibility = (id: string) => {
    setCols(cols.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));
  };

  const handleWidthChange = (id: string, width: number) => {
    setCols(cols.map((c) => (c.id === id ? { ...c, width: Math.max(40, width) } : c)));
  };

  const handleSave = () => {
    onSave(cols);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-sky-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800">
        <div className="px-5 py-3.5 bg-gradient-to-r from-blue-600 to-sky-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-300" />
            <h3 className="text-sm font-bold tracking-wide">
              Column Settings (Gridsetting / GS)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-2 text-xs">
          <p className="text-slate-500 text-[11px] mb-3">
            Customize table columns, toggle visibility, and adjust column widths in pixels.
          </p>

          <div className="space-y-1.5">
            {cols.map((col) => (
              <div
                key={col.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200"
              >
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => toggleVisibility(col.id)}
                    className={`p-1 rounded ${
                      col.visible ? 'text-blue-600 bg-sky-100' : 'text-slate-400 bg-slate-200'
                    }`}
                  >
                    {col.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <span className={`font-semibold ${col.visible ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                    {col.label}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-slate-400">Width:</span>
                  <input
                    type="number"
                    value={col.width}
                    onChange={(e) => handleWidthChange(col.id, parseInt(e.target.value) || 60)}
                    className="w-16 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-center text-xs"
                  />
                  <span className="text-[10px] text-slate-400">px</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Layout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
