import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import { MASTER_FIELD_DICTIONARY } from '../../utils/fieldDictionary';
import { FieldDictionaryEntry } from '../../types/erp';

interface FieldHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenName: string;
}

export const FieldHelpModal: React.FC<FieldHelpModalProps> = ({
  isOpen,
  onClose,
  screenName,
}) => {
  if (!isOpen) return null;

  const relevantFields: FieldDictionaryEntry[] = MASTER_FIELD_DICTIONARY.filter(
    (f: FieldDictionaryEntry) => f.screen.toLowerCase().includes(screenName.toLowerCase()) || screenName === 'All'
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-sky-200/90 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800">
        <div className="px-5 py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <h3 className="text-sm font-bold tracking-wide">
              Field Dictionary & Business Rules ({screenName})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3 text-xs">
          <p className="text-slate-500 text-[11px]">
            Preserved definitions and database column mapping for this form per Spec #40-41.
          </p>

          <div className="space-y-2">
            {relevantFields.map((field: FieldDictionaryEntry, idx: number) => (
              <div
                key={`${field.screen}-${field.database_field}-${idx}`}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors space-y-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-xs">{field.ui_label}</span>
                  <span className="font-mono text-[10px] bg-sky-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                    {field.database_field}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {field.business_meaning}
                </p>
                <div className="flex items-center space-x-3 text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                  <span>Type: <strong className="text-slate-700">{field.type}</strong></span>
                  <span>•</span>
                  <span>Mandatory: <strong className={field.mandatory ? 'text-rose-600' : 'text-slate-600'}>{field.mandatory ? 'Yes' : 'No'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
