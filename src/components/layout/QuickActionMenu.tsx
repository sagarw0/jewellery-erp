import React from 'react';
import {
  PackagePlus,
  Barcode,
  ReceiptText,
  ShoppingBag,
  Flame,
  FilePlus2,
  Users,
  Boxes,
  CalendarCheck,
  CreditCard,
  Usb,
  FolderLock
} from 'lucide-react';

interface QuickActionMenuProps {
  onAction: (actionId: string) => void;
}

export const QuickActionMenu: React.FC<QuickActionMenuProps> = ({ onAction }) => {
  const actions = [
    { id: 'item_creation', label: 'Item Creation', hotkey: 'F2', icon: PackagePlus, color: 'text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100/60' },
    { id: 'barcode', label: 'Barcode', hotkey: 'F3', icon: Barcode, color: 'text-sky-600 bg-sky-50 border-sky-200 hover:border-sky-400 hover:bg-sky-100/60' },
    { id: 'sales_invoice', label: 'Sales Invoice', hotkey: 'F4', icon: ReceiptText, color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/60' },
    { id: 'purchase', label: 'Purchase', hotkey: 'F5', icon: ShoppingBag, color: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100/60' },
    { id: 'refinery_in', label: 'Refinery In', hotkey: 'F6', icon: Flame, color: 'text-orange-600 bg-orange-50 border-orange-200 hover:border-orange-400 hover:bg-orange-100/60' },
    { id: 'new_order', label: 'New Order', hotkey: 'F7', icon: FilePlus2, color: 'text-amber-700 bg-amber-50 border-amber-300 hover:border-amber-500 hover:bg-amber-100/80 shadow-xs' },
    { id: 'account_display', label: 'Account', hotkey: 'F8', icon: Users, color: 'text-cyan-600 bg-cyan-50 border-cyan-200 hover:border-cyan-400 hover:bg-cyan-100/60' },
    { id: 'stock_report', label: 'Stock Report', hotkey: 'F9', icon: Boxes, color: 'text-yellow-700 bg-yellow-50 border-yellow-200 hover:border-yellow-400 hover:bg-yellow-100/60' },
    { id: 'day_book', label: 'Day Book', hotkey: 'F10', icon: CalendarCheck, color: 'text-blue-700 bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100/60' },
    { id: 'debtors', label: 'Debtors', hotkey: 'F11', icon: CreditCard, color: 'text-rose-600 bg-rose-50 border-rose-200 hover:border-rose-400 hover:bg-rose-100/60' },
    { id: 'usb_backup', label: 'USB Backup', hotkey: 'F12', icon: Usb, color: 'text-teal-600 bg-teal-50 border-teal-200 hover:border-teal-400 hover:bg-teal-100/60' },
    { id: 'ac_master', label: 'A/C Master', hotkey: 'Shift+A', icon: FolderLock, color: 'text-violet-600 bg-violet-50 border-violet-200 hover:border-violet-400 hover:bg-violet-100/60' },
  ];

  return (
    <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Quick Action Launchpad (Spec #2)
        </h2>
        <span className="text-[11px] text-slate-400">Click card or press keyboard hotkey</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onAction(act.id)}
              className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center transition-all duration-150 group cursor-pointer ${act.color}`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shadow-2xs">
                  {act.hotkey}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800 transition-colors">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
