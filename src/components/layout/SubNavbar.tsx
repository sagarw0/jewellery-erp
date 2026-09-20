import React from 'react';
import {
  Users,
  Building2,
  Hammer,
  Sparkles,
  Barcode,
  ShoppingBag,
  Truck,
  Flame,
  Receipt,
  BookOpen,
  UserCheck,
  FileSpreadsheet,
  Boxes,
  ClipboardCheck,
  SlidersHorizontal,
  Layers,
  ChevronRight,
  Command,
} from 'lucide-react';
import {
  NavSection,
  MasterSubView,
  TransactionSubView,
  AccountSubView,
  StockSubView,
  AuthUser,
} from '../../types/erp';
import { useTheme } from '../../context/ThemeContext';

interface SubNavbarProps {
  currentSection: NavSection;
  masterSubView: MasterSubView;
  setMasterSubView: (view: MasterSubView) => void;
  transSubView: TransactionSubView;
  setTransSubView: (view: TransactionSubView) => void;
  accSubView: AccountSubView;
  setAccSubView: (view: AccountSubView) => void;
  stockSubView?: StockSubView;
  setStockSubView?: (view: StockSubView) => void;
  currentUser?: AuthUser | null;
}

export const SubNavbar: React.FC<SubNavbarProps> = ({
  currentSection,
  masterSubView,
  setMasterSubView,
  transSubView,
  setTransSubView,
  accSubView,
  setAccSubView,
  stockSubView = 'stock_report',
  setStockSubView,
  currentUser,
}) => {
  const { currentTheme, computedTokens, isDark } = useTheme();
  const role = currentUser?.role || 'Owner';

  // Define tab definitions per section
  let categoryTitle = '';
  let categoryIcon = Layers;
  let allTabs: {
    id: string;
    label: string;
    hotkey: string;
    icon: React.FC<{ className?: string }>;
    isActive: boolean;
    allowedRoles?: string[];
    onClick: () => void;
  }[] = [];

  if (currentSection === 'masters') {
    categoryTitle = 'Master Setup';
    categoryIcon = Layers;
    allTabs = [
      {
        id: 'account_master',
        label: 'Account Master',
        hotkey: 'F8',
        icon: Users,
        isActive: masterSubView === 'account_master',
        allowedRoles: ['Owner', 'Manager'],
        onClick: () => setMasterSubView('account_master'),
      },
      {
        id: 'vendor_master',
        label: 'Vendor Master',
        hotkey: 'F1',
        icon: Building2,
        isActive: masterSubView === 'vendor_master',
        allowedRoles: ['Owner', 'Manager'],
        onClick: () => setMasterSubView('vendor_master'),
      },
      {
        id: 'karagir_master',
        label: 'Karagir Master',
        hotkey: 'F6',
        icon: Hammer,
        isActive: masterSubView === 'karagir_master',
        allowedRoles: ['Owner', 'Manager'],
        onClick: () => setMasterSubView('karagir_master'),
      },
      {
        id: 'item_creation',
        label: 'Item Creation Master',
        hotkey: 'F2',
        icon: Sparkles,
        isActive: masterSubView === 'item_creation',
        allowedRoles: ['Owner', 'Manager'],
        onClick: () => setMasterSubView('item_creation'),
      },
      {
        id: 'barcode',
        label: 'Barcode Studio',
        hotkey: 'F3',
        icon: Barcode,
        isActive: masterSubView === 'barcode',
        allowedRoles: ['Owner', 'Manager'],
        onClick: () => setMasterSubView('barcode'),
      },
    ];
  } else if (currentSection === 'transactions') {
    categoryTitle = 'Voucher Desk';
    categoryIcon = Receipt;
    allTabs = [
      {
        id: 'sales_invoice',
        label: 'Sales POS Counter',
        hotkey: 'F4',
        icon: Receipt,
        isActive: transSubView === 'sales_invoice',
        allowedRoles: ['Owner', 'Manager', 'Cashier', 'Accountant'],
        onClick: () => setTransSubView('sales_invoice'),
      },
      {
        id: 'new_order',
        label: 'New Order Booking',
        hotkey: 'F7',
        icon: ShoppingBag,
        isActive: transSubView === 'new_order',
        allowedRoles: ['Owner', 'Manager', 'Karagir'],
        onClick: () => setTransSubView('new_order'),
      },
      {
        id: 'purchase',
        label: 'Purchase Invoice (Inward)',
        hotkey: 'F5',
        icon: Truck,
        isActive: transSubView === 'purchase',
        allowedRoles: ['Owner', 'Manager', 'Accountant'],
        onClick: () => setTransSubView('purchase'),
      },
      {
        id: 'refinery_in',
        label: 'Refinery In & Melting',
        hotkey: 'F6',
        icon: Flame,
        isActive: transSubView === 'refinery_in',
        allowedRoles: ['Owner', 'Manager', 'Karagir'],
        onClick: () => setTransSubView('refinery_in'),
      },
    ];
  } else if (currentSection === 'accounts') {
    categoryTitle = 'Financial Ledgers';
    categoryIcon = BookOpen;
    allTabs = [
      {
        id: 'day_book',
        label: 'Day Book & Register',
        hotkey: 'F10',
        icon: BookOpen,
        isActive: accSubView === 'day_book',
        allowedRoles: ['Owner', 'Manager', 'Cashier', 'Accountant'],
        onClick: () => setAccSubView('day_book'),
      },
      {
        id: 'book_display',
        label: 'Sundry Debtors Ledger',
        hotkey: 'F11',
        icon: UserCheck,
        isActive: accSubView === 'book_display',
        allowedRoles: ['Owner', 'Manager', 'Accountant'],
        onClick: () => setAccSubView('book_display'),
      },
      {
        id: 'account_display',
        label: 'General Ledger View',
        hotkey: 'F12',
        icon: FileSpreadsheet,
        isActive: accSubView === 'account_display',
        allowedRoles: ['Owner', 'Manager', 'Accountant'],
        onClick: () => setAccSubView('account_display'),
      },
    ];
  } else if (currentSection === 'stock') {
    categoryTitle = 'Bullion Vault';
    categoryIcon = Boxes;
    allTabs = [
      {
        id: 'stock_report',
        label: 'Stock Report & Valuation',
        hotkey: 'F9',
        icon: Boxes,
        isActive: stockSubView === 'stock_report',
        allowedRoles: ['Owner', 'Manager', 'Karagir'],
        onClick: () => setStockSubView && setStockSubView('stock_report'),
      },
      {
        id: 'stock_refill',
        label: 'Stock Refill & Targets',
        hotkey: 'Ctrl+R',
        icon: SlidersHorizontal,
        isActive: stockSubView === 'stock_refill',
        allowedRoles: ['Owner', 'Manager', 'Karagir'],
        onClick: () => setStockSubView && setStockSubView('stock_refill'),
      },
      {
        id: 'audit',
        label: 'Showroom Stock Audit',
        hotkey: 'F8',
        icon: ClipboardCheck,
        isActive: stockSubView === 'audit',
        allowedRoles: ['Owner', 'Manager'],
        onClick: () => setStockSubView && setStockSubView('audit'),
      },
    ];
  } else {
    return null;
  }

  // Filter tabs by role
  const tabs = allTabs.filter(
    (t) => !t.allowedRoles || t.allowedRoles.includes(role)
  );

  if (tabs.length === 0) return null;

  const CategoryIcon = categoryIcon;

  return (
    <div
      className="px-4 py-1.5 flex items-center justify-between text-xs overflow-x-auto scrollbar-none transition-all duration-200 border-b no-print backdrop-blur-md"
      style={{
        backgroundColor: isDark ? 'rgba(10, 15, 26, 0.95)' : 'rgba(255, 255, 255, 0.92)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
      }}
    >
      <div className="flex items-center space-x-2.5 min-w-max">
        {/* Crisp Submenu Label Indicator */}
        <div
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wide shrink-0 border shadow-2xs"
          style={{
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.08)',
            color: isDark ? '#ffffff' : '#0f172a',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.20)' : 'rgba(15, 23, 42, 0.15)',
          }}
        >
          <CategoryIcon className="w-3.5 h-3.5 opacity-90 text-amber-500" />
          <span className="font-bold">{categoryTitle}</span>
          <ChevronRight className="w-3 h-3 opacity-60" />
        </div>

        {/* Compact Segmented Submenu Strip (Crisp luxury, high visibility) */}
        <div
          className="flex items-center p-1 rounded-2xl border space-x-1 backdrop-blur-md shadow-2xs"
          style={{
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.50)' : 'rgba(241, 245, 249, 0.95)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.12)',
          }}
        >
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const active = tab.isActive;

            return (
              <button
                key={tab.id}
                onClick={tab.onClick}
                className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all duration-150 cursor-pointer select-none border ${
                  active
                    ? isDark
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-sm'
                      : 'bg-blue-600 text-white font-bold border-blue-700 shadow-sm'
                    : isDark
                    ? 'text-slate-200 hover:text-white hover:bg-white/15 border-transparent'
                    : 'text-slate-950 hover:text-blue-700 hover:bg-white hover:shadow-2xs border-transparent'
                }`}
              >
                <TabIcon
                  className={`w-3.5 h-3.5 ${
                    active ? 'text-inherit' : isDark ? 'text-slate-300' : 'text-slate-800'
                  }`}
                />

                <span className="truncate font-semibold">{tab.label}</span>

                {/* Refined Keycap */}
                <span
                  className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono font-semibold tracking-normal border ${
                    active
                      ? isDark
                        ? 'bg-black/25 text-slate-950 border-black/10'
                        : 'bg-white/25 text-white border-white/20'
                      : isDark
                      ? 'bg-white/15 text-slate-200 border-white/10'
                      : 'bg-slate-200/90 text-slate-900 border-slate-300'
                  }`}
                >
                  {tab.hotkey}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Function Key Hint */}
      <div className="hidden lg:flex items-center space-x-1.5 text-[10px] font-medium opacity-60 pr-2">
        <Command className="w-2.5 h-2.5" />
        <span>Submenu Function Keys</span>
      </div>
    </div>
  );
};

