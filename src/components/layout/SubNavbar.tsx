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
  BarChart3,
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
}) => {
  const { currentTheme, computedTokens, isDark } = useTheme();

  // Define tab definitions per section
  let categoryTitle = '';
  let categoryIcon = Layers;
  let tabs: {
    id: string;
    label: string;
    hotkey: string;
    icon: React.FC<{ className?: string }>;
    isActive: boolean;
    onClick: () => void;
  }[] = [];

  if (currentSection === 'masters') {
    categoryTitle = 'Master Setup';
    categoryIcon = Layers;
    tabs = [
      {
        id: 'account_master',
        label: 'Account Master',
        hotkey: 'F8',
        icon: Users,
        isActive: masterSubView === 'account_master',
        onClick: () => setMasterSubView('account_master'),
      },
      {
        id: 'vendor_master',
        label: 'Vendor Master',
        hotkey: 'F1',
        icon: Building2,
        isActive: masterSubView === 'vendor_master',
        onClick: () => setMasterSubView('vendor_master'),
      },
      {
        id: 'karagir_master',
        label: 'Karagir Master',
        hotkey: 'F6',
        icon: Hammer,
        isActive: masterSubView === 'karagir_master',
        onClick: () => setMasterSubView('karagir_master'),
      },
      {
        id: 'item_creation',
        label: 'Item Creation Master',
        hotkey: 'F2',
        icon: Sparkles,
        isActive: masterSubView === 'item_creation',
        onClick: () => setMasterSubView('item_creation'),
      },
      {
        id: 'barcode',
        label: 'Barcode Studio',
        hotkey: 'F3',
        icon: Barcode,
        isActive: masterSubView === 'barcode',
        onClick: () => setMasterSubView('barcode'),
      },
    ];
  } else if (currentSection === 'transactions') {
    categoryTitle = 'Voucher Desk';
    categoryIcon = Receipt;
    tabs = [
      {
        id: 'new_order',
        label: 'New Order Booking',
        hotkey: 'F7',
        icon: ShoppingBag,
        isActive: transSubView === 'new_order',
        onClick: () => setTransSubView('new_order'),
      },
      {
        id: 'purchase',
        label: 'Purchase Invoice (Inward)',
        hotkey: 'F5',
        icon: Truck,
        isActive: transSubView === 'purchase',
        onClick: () => setTransSubView('purchase'),
      },
      {
        id: 'refinery_in',
        label: 'Refinery In & Melting',
        hotkey: 'F6',
        icon: Flame,
        isActive: transSubView === 'refinery_in',
        onClick: () => setTransSubView('refinery_in'),
      },
      {
        id: 'sales_invoice',
        label: 'Sales POS Counter',
        hotkey: 'F4',
        icon: Receipt,
        isActive: transSubView === 'sales_invoice',
        onClick: () => setTransSubView('sales_invoice'),
      },
    ];
  } else if (currentSection === 'accounts') {
    categoryTitle = 'Financial Ledgers';
    categoryIcon = BookOpen;
    tabs = [
      {
        id: 'day_book',
        label: 'Day Book & Register',
        hotkey: 'F10',
        icon: BookOpen,
        isActive: accSubView === 'day_book',
        onClick: () => setAccSubView('day_book'),
      },
      {
        id: 'book_display',
        label: 'Sundry Debtors Ledger',
        hotkey: 'F11',
        icon: UserCheck,
        isActive: accSubView === 'book_display',
        onClick: () => setAccSubView('book_display'),
      },
      {
        id: 'account_display',
        label: 'General Ledger View',
        hotkey: 'F12',
        icon: FileSpreadsheet,
        isActive: accSubView === 'account_display',
        onClick: () => setAccSubView('account_display'),
      },
    ];
  } else if (currentSection === 'stock') {
    categoryTitle = 'Bullion Vault';
    categoryIcon = Boxes;
    tabs = [
      {
        id: 'stock_report',
        label: 'Stock Report & Valuation',
        hotkey: 'F9',
        icon: Boxes,
        isActive: stockSubView === 'stock_report',
        onClick: () => setStockSubView && setStockSubView('stock_report'),
      },
      {
        id: 'audit',
        label: 'Showroom Stock Audit',
        hotkey: 'F8',
        icon: ClipboardCheck,
        isActive: stockSubView === 'audit',
        onClick: () => setStockSubView && setStockSubView('audit'),
      },
    ];
  } else {
    return null;
  }

  const CategoryIcon = categoryIcon;

  return (
    <div
      className="px-4 py-2.5 flex items-center justify-between text-xs overflow-x-auto scrollbar-none transition-all duration-300 border-b no-print"
      style={{
        backgroundColor: computedTokens.appHeaderBg,
        borderColor: computedTokens.appBorder,
      }}
    >
      <div className="flex items-center space-x-2.5 min-w-max">
        {/* Category Pill Tag */}
        <div
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border shadow-2xs shrink-0 backdrop-blur-md"
          style={{
            backgroundColor: computedTokens.appAccentBg,
            color: computedTokens.appAccent,
            borderColor: computedTokens.appBorder,
          }}
        >
          <CategoryIcon className="w-3.5 h-3.5" />
          <span>{categoryTitle}</span>
          <ChevronRight className="w-3 h-3 opacity-60" />
        </div>

        {/* Segmented iOS Frosted Glass Tabs Container */}
        <div
          className="flex items-center p-1 rounded-2xl border shadow-inner space-x-1 backdrop-blur-2xl transition-all"
          style={{
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.65)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.9)',
          }}
        >
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const active = tab.isActive;

            return (
              <button
                key={tab.id}
                onClick={tab.onClick}
                className={`relative flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer select-none group ${
                  active
                    ? 'shadow-md scale-[1.02]'
                    : 'hover:scale-[1.01] opacity-75 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: active ? computedTokens.appPrimary : 'transparent',
                  color: active ? computedTokens.appPrimaryText : computedTokens.appTextPrimary,
                  boxShadow: active ? `0 4px 14px ${computedTokens.appPrimaryGlow}` : 'none',
                }}
              >
                {/* Active Top Specular Reflection Glow */}
                {active && (
                  <div className="absolute top-0 left-2 right-2 h-[2px] bg-white/40 rounded-full blur-[0.5px]" />
                )}

                <TabIcon
                  className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                    active ? 'text-inherit' : 'opacity-70'
                  }`}
                />

                <span className="truncate">{tab.label}</span>

                {/* Hotkey Keycap Badge */}
                <span
                  className={`text-[9.5px] px-1.5 py-0.2 rounded-md font-mono font-bold tracking-tight shadow-2xs transition-all ${
                    active
                      ? 'bg-black/25 text-white border border-white/20'
                      : isDark
                      ? 'bg-white/10 text-slate-300 border border-white/10 group-hover:bg-white/20'
                      : 'bg-slate-200/90 text-slate-800 border border-slate-300 group-hover:bg-slate-300'
                  }`}
                >
                  {tab.hotkey}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Shortcut Hint */}
      <div className="hidden lg:flex items-center space-x-2 text-[10.5px] font-medium opacity-60 pr-2">
        <Command className="w-3 h-3" />
        <span>Use Function Keys to Switch Fast</span>
      </div>
    </div>
  );
};
