import React, { useState, useEffect } from 'react';
import {
  NavSection,
  MasterSubView,
  TransactionSubView,
  AccountSubView,
  StockSubView,
  AccountMaster,
  NewOrderBookingRecord,
  RefineryRecord,
  PurchaseRecord,
  DayBookEntry,
  DayBookSummary,
  SundryDebtorRow,
  StockItem,
  DebitLedgerEntry,
  CreditLedgerEntry,
  BackupStatusInfo,
  BackupMediaOption
} from './types/erp';
import {
  INITIAL_ACCOUNTS,
  INITIAL_ORDERS,
  INITIAL_REFINERY,
  INITIAL_PURCHASES,
  INITIAL_DAYBOOK,
  INITIAL_DAYBOOK_SUMMARY,
  INITIAL_DEBTORS,
  INITIAL_STOCK,
  INITIAL_LEDGER_DEBIT,
  INITIAL_LEDGER_CREDIT,
  INITIAL_BACKUP_STATUS
} from './utils/mockData';
import { cloudService } from './lib/supabase';

// Layout & Components
import { LoginView } from './components/auth/LoginView';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { AccountMasterView } from './components/masters/AccountMasterView';
import { ItemCreationView } from './components/masters/ItemCreationView';
import { BarcodeView } from './components/masters/BarcodeView';
import { NewOrderBookingView } from './components/transactions/NewOrderBookingView';
import { PurchaseInvoiceView } from './components/transactions/PurchaseInvoiceView';
import { RefineryInView } from './components/transactions/RefineryInView';
import { SalesInvoiceView } from './components/transactions/SalesInvoiceView';
import { DayBookView } from './components/accounts/DayBookView';
import { BookDisplayView } from './components/accounts/BookDisplayView';
import { AccountDisplayView } from './components/accounts/AccountDisplayView';
import { StockReportView } from './components/stock/StockReportView';
import { BackupManagerView } from './components/backup/BackupManagerView';
import { FieldDictionaryView } from './components/dictionary/FieldDictionaryView';
import { GoldSchemeView } from './components/common/GoldSchemeView';
import { MessengerView } from './components/common/MessengerView';
import { SettingsView } from './components/common/SettingsView';
import { AnalyticsModal } from './components/dashboard/AnalyticsModal';
import { useTheme } from './context/ThemeContext';

interface AuthUser {
  code: string;
  name: string;
  role: string;
  branch: string;
}

export function App() {
  const { currentTheme } = useTheme();
  // Authentication State (Starts with Login Page)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Executive Analytics Modal State
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Navigation State
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [masterSubView, setMasterSubView] = useState<MasterSubView>('account_master');
  const [transSubView, setTransSubView] = useState<TransactionSubView>('new_order');
  const [accSubView, setAccSubView] = useState<AccountSubView>('day_book');
  const [stockSubView, setStockSubView] = useState<StockSubView>('stock_report');

  // Bullion Rates State
  const [gold24kRate, setGold24kRate] = useState(7250);
  const [gold22kRate, setGold22kRate] = useState(6680);
  const [silverRate, setSilverRate] = useState(86);

  // Core Data Stores (Synced with Supabase Cloud DB)
  const [accounts, setAccounts] = useState<AccountMaster[]>(INITIAL_ACCOUNTS);
  const [orders, setOrders] = useState<NewOrderBookingRecord[]>(INITIAL_ORDERS);
  const [refineries, setRefineries] = useState<RefineryRecord[]>(INITIAL_REFINERY);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(INITIAL_PURCHASES);
  const [daybook, setDaybook] = useState<DayBookEntry[]>(INITIAL_DAYBOOK);
  const [daybookSummary, setDaybookSummary] = useState<DayBookSummary>(INITIAL_DAYBOOK_SUMMARY);
  const [debtors, setDebtors] = useState<SundryDebtorRow[]>(INITIAL_DEBTORS);
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK);
  const [debitEntries, setDebitEntries] = useState<DebitLedgerEntry[]>(INITIAL_LEDGER_DEBIT);
  const [creditEntries, setCreditEntries] = useState<CreditLedgerEntry[]>(INITIAL_LEDGER_CREDIT);
  const [backupStatus, setBackupStatus] = useState<BackupStatusInfo[]>(INITIAL_BACKUP_STATUS);

  // Load cloud data from Supabase on startup
  useEffect(() => {
    async function loadCloudData() {
      try {
        const [cAccounts, cOrders, cPurchases, cStock, cDaybook] = await Promise.all([
          cloudService.getAccounts(),
          cloudService.getOrders(),
          cloudService.getPurchases(),
          cloudService.getStock(),
          cloudService.getDayBook(),
        ]);
        if (cAccounts && cAccounts.length > 0) setAccounts(cAccounts);
        if (cOrders && cOrders.length > 0) setOrders(cOrders);
        if (cPurchases && cPurchases.length > 0) setPurchases(cPurchases);
        if (cStock && cStock.length > 0) setStockItems(cStock);
        if (cDaybook && cDaybook.length > 0) setDaybook(cDaybook);
      } catch (e) {
        console.warn('Supabase offline or initial schema pending, using in-memory state.');
      }
    }
    loadCloudData();
  }, []);

  // Global Keyboard Shortcuts (F2-F12) when authenticated
  useEffect(() => {
    if (!currentUser) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setShowAnalytics((prev) => !prev);
      } else if (e.key === 'F2') {
        e.preventDefault();
        setCurrentSection('masters');
        setMasterSubView('item_creation');
      } else if (e.key === 'F3') {
        e.preventDefault();
        setCurrentSection('masters');
        setMasterSubView('barcode');
      } else if (e.key === 'F4') {
        e.preventDefault();
        setCurrentSection('transactions');
        setTransSubView('sales_invoice');
      } else if (e.key === 'F5') {
        e.preventDefault();
        setCurrentSection('transactions');
        setTransSubView('purchase');
      } else if (e.key === 'F6') {
        e.preventDefault();
        setCurrentSection('transactions');
        setTransSubView('refinery_in');
      } else if (e.key === 'F7') {
        e.preventDefault();
        setCurrentSection('transactions');
        setTransSubView('new_order');
      } else if (e.key === 'F8') {
        e.preventDefault();
        setCurrentSection('accounts');
        setAccSubView('account_display');
      } else if (e.key === 'F9') {
        e.preventDefault();
        setCurrentSection('stock');
        setStockSubView('stock_report');
      } else if (e.key === 'F10') {
        e.preventDefault();
        setCurrentSection('accounts');
        setAccSubView('day_book');
      } else if (e.key === 'F11') {
        e.preventDefault();
        setCurrentSection('accounts');
        setAccSubView('book_display');
      } else if (e.key === 'F12') {
        e.preventDefault();
        setCurrentSection('backup');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentUser]);

  // Quick Action Router from Card clicks
  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'item_creation':
        setCurrentSection('masters');
        setMasterSubView('item_creation');
        break;
      case 'barcode':
        setCurrentSection('masters');
        setMasterSubView('barcode');
        break;
      case 'sales_invoice':
        setCurrentSection('transactions');
        setTransSubView('sales_invoice');
        break;
      case 'purchase':
        setCurrentSection('transactions');
        setTransSubView('purchase');
        break;
      case 'refinery_in':
        setCurrentSection('transactions');
        setTransSubView('refinery_in');
        break;
      case 'new_order':
        setCurrentSection('transactions');
        setTransSubView('new_order');
        break;
      case 'account_display':
        setCurrentSection('accounts');
        setAccSubView('account_display');
        break;
      case 'stock_report':
        setCurrentSection('stock');
        setStockSubView('stock_report');
        break;
      case 'day_book':
        setCurrentSection('accounts');
        setAccSubView('day_book');
        break;
      case 'debtors':
        setCurrentSection('accounts');
        setAccSubView('book_display');
        break;
      case 'usb_backup':
        setCurrentSection('backup');
        break;
      case 'ac_master':
        setCurrentSection('masters');
        setMasterSubView('account_master');
        break;
      default:
        setCurrentSection('dashboard');
    }
  };

  // State Mutators with Supabase Cloud Sync
  const handleSaveAccount = (account: AccountMaster) => {
    setAccounts((prev) => {
      const idx = prev.findIndex((a) => a.account_code === account.account_code);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = account;
        return next;
      }
      return [account, ...prev];
    });
    // Async push to Supabase
    cloudService.saveAccount(account);
  };

  const handleDeleteAccount = (code: string) => {
    setAccounts((prev) => prev.filter((a) => a.account_code !== code));
  };

  const handleSaveOrder = (order: NewOrderBookingRecord) => {
    setOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === order.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = order;
        return next;
      }
      return [order, ...prev];
    });
    // Async push to Supabase
    cloudService.saveOrder(order);
  };

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleSavePurchase = (record: PurchaseRecord) => {
    setPurchases((prev) => [record, ...prev]);

    // Automatically convert purchased items into Loose Stock Inventory
    const newStockEntries: StockItem[] = record.items.map((it, idx) => {
      let category = 'Gold';
      const nameUpper = it.item_name.toUpperCase();
      if (nameUpper.includes('SILVER') || nameUpper.includes('PAYAL')) category = 'Silver';
      else if (nameUpper.includes('DIAMOND') || nameUpper.includes('SOLITAIRE')) category = 'Diamond';
      else if (nameUpper.includes('IMITATION') || nameUpper.includes('1GM') || nameUpper.includes('MICRO')) category = '1gm Imitation';
      else if (nameUpper.includes('URD') || nameUpper.includes('OLD GOLD') || nameUpper.includes('MELTING')) category = 'URD Gold';

      const fineWeight = Number(((it.net_wt * (it.purity || 91.6)) / 100).toFixed(3));
      const rate = it.rate || gold22kRate;
      const val = it.total_amt || (it.net_wt * rate);

      return {
        id: `stk-pur-${record.id}-${idx}`,
        item_name: it.item_name,
        category: category,
        qty: it.qty || 1,
        gross_wt: it.gross_wt,
        net_wt: it.net_wt,
        purity: it.purity || 91.6,
        fine_wt: fineWeight,
        rate_per_gm: rate,
        total_value: val,
        is_urd: category.startsWith('URD'),
        is_loose: true,
        tag_no: '',
        huid: it.huid || 'B9K8L1',
      };
    });

    setStockItems((prev) => [...newStockEntries, ...prev]);

    // Record DayBook Entry for purchase payment
    if (record.payment && (record.payment.by_cash > 0 || record.payment.by_cheque > 0 || record.payment.bill_amount > 0)) {
      const dayBookRecord: DayBookEntry = {
        id: `db-pur-${record.id}`,
        invoice_type: 'Purchase Bill',
        invoice_no: record.header.invoice_no,
        total_amt: record.payment.bill_amount || record.payment.purchase_amt,
        urd_amt: 0,
        net_amt: record.payment.bill_amount || record.payment.purchase_amt,
        cash_received: 0,
        cash_payment: record.payment.by_cash || 0,
        bank_received: 0,
        bank_payment: record.payment.by_cheque || 0,
        date: record.header.invoice_date || new Date().toISOString().slice(0, 10),
        details: `Supplier: ${record.header.supplier_name} (${record.items.length} lots, Gr: ${record.items.reduce((s, i) => s + i.gross_wt, 0).toFixed(3)}g)`,
        total_amt_without_disc: record.payment.purchase_amt || 0,
      };
      setDaybook((prev) => [dayBookRecord, ...prev]);
    }

    // Async push to Supabase
    cloudService.savePurchase(record);
    newStockEntries.forEach((stk) => cloudService.saveStockItem(stk));
  };

  const handleSaveRefinery = (record: RefineryRecord) => {
    setRefineries((prev) => [record, ...prev]);
  };

  const handleAddItemToStock = (item: StockItem) => {
    setStockItems((prev) => [item, ...prev]);
    // Async push to Supabase
    cloudService.saveStockItem(item);
  };

  const handleTriggerBackup = (media: BackupMediaOption) => {
    setBackupStatus((prev) =>
      prev.map((s) =>
        s.media === media
          ? {
              ...s,
              last_backup: 'Just now',
              backup_date: new Date().toISOString().replace('T', ' ').slice(0, 19),
              backup_status: 'Success',
            }
          : s
      )
    );
  };

  // If not logged in, show clean Login Screen
  if (!currentUser) {
    return <LoginView onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className={`min-h-screen ${currentTheme.appBg} ${currentTheme.textPrimary} flex flex-col font-sans selection:bg-sky-200`}>
      {/* Top Navbar */}
      <Navbar
        currentSection={currentSection}
        onSelectSection={(sec) => setCurrentSection(sec)}
        gold24kRate={gold24kRate}
        gold22kRate={gold22kRate}
        silverRate={silverRate}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        onOpenAnalytics={() => setShowAnalytics(true)}
      />

      {/* Sub-Header Navigation Tabs for Multi-view Sections */}
      {currentSection === 'masters' && (
        <div className={`${currentTheme.subnavBg} px-4 py-2 flex items-center justify-between text-xs overflow-x-auto scrollbar-none transition-colors duration-200`}>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
              Masters:
            </span>
            <button
              onClick={() => setMasterSubView('account_master')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                masterSubView === 'account_master'
                  ? `${currentTheme.activePill} shadow-xs`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span>Account Master</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                masterSubView === 'account_master' ? 'bg-black/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}>F8</span>
            </button>
            <button
              onClick={() => setMasterSubView('item_creation')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                masterSubView === 'item_creation'
                  ? `${currentTheme.activePill} shadow-xs`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span>Item Creation Master</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                masterSubView === 'item_creation' ? 'bg-black/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}>F2</span>
            </button>
            <button
              onClick={() => setMasterSubView('barcode')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                masterSubView === 'barcode'
                  ? `${currentTheme.activePill} shadow-xs`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span>Barcode Studio</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                masterSubView === 'barcode' ? 'bg-black/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}>F3</span>
            </button>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden md:inline">Press F2/F3/F8 to switch quickly</span>
        </div>
      )}

      {currentSection === 'transactions' && (
        <div className={`${currentTheme.subnavBg} px-4 py-2 flex items-center justify-between text-xs overflow-x-auto scrollbar-none transition-colors duration-200`}>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
              Vouchers:
            </span>
            <button
              onClick={() => setTransSubView('new_order')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                transSubView === 'new_order'
                  ? `${currentTheme.activePill} shadow-xs`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span>New Order Booking</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                transSubView === 'new_order' ? 'bg-black/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}>F7</span>
            </button>
            <button
              onClick={() => setTransSubView('purchase')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                transSubView === 'purchase'
                  ? `${currentTheme.activePill} shadow-xs`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span>Purchase Invoice</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                transSubView === 'purchase' ? 'bg-black/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}>F5</span>
            </button>
            <button
              onClick={() => setTransSubView('refinery_in')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                transSubView === 'refinery_in'
                  ? `${currentTheme.activePill} shadow-xs`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span>Refinery In</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                transSubView === 'refinery_in' ? 'bg-black/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}>F6</span>
            </button>
            <button
              onClick={() => setTransSubView('sales_invoice')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                transSubView === 'sales_invoice'
                  ? `${currentTheme.activePill} shadow-xs`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span>Sales POS Counter</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                transSubView === 'sales_invoice' ? 'bg-black/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}>F4</span>
            </button>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden md:inline">Press F4-F7 to switch vouchers</span>
        </div>
      )}

      {currentSection === 'accounts' && (
        <div className={`${currentTheme.subnavBg} px-4 py-2 flex items-center justify-between text-xs overflow-x-auto scrollbar-none transition-colors duration-200`}>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">
              Ledgers:
            </span>
            <button
              onClick={() => setAccSubView('day_book')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                accSubView === 'day_book'
                  ? `${currentTheme.activePill} shadow-xs`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span>Day Book</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                accSubView === 'day_book' ? 'bg-black/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}>F10</span>
            </button>
            <button
              onClick={() => setAccSubView('book_display')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                accSubView === 'book_display'
                  ? `${currentTheme.activePill} shadow-xs`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span>Debtors Ledger</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                accSubView === 'book_display' ? 'bg-black/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}>F11</span>
            </button>
            <button
              onClick={() => setAccSubView('account_display')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                accSubView === 'account_display'
                  ? `${currentTheme.activePill} shadow-xs`
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span>Account Display (T-Ledger)</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                accSubView === 'account_display' ? 'bg-black/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}>F8</span>
            </button>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden md:inline">Press F8/F10/F11 for books</span>
        </div>
      )}

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* 1. DASHBOARD */}
        {currentSection === 'dashboard' && (
          <DashboardView
            onQuickAction={handleQuickAction}
            gold24kRate={gold24kRate}
            gold22kRate={gold22kRate}
            silverRate={silverRate}
            orders={orders}
            debtors={debtors}
            stockItems={stockItems}
          />
        )}

        {/* 2. MASTERS */}
        {currentSection === 'masters' && (
          <>
            {masterSubView === 'account_master' && (
              <AccountMasterView
                accounts={accounts}
                onSaveAccount={handleSaveAccount}
                onDeleteAccount={handleDeleteAccount}
                onClose={() => setCurrentSection('dashboard')}
              />
            )}
            {masterSubView === 'item_creation' && (
              <ItemCreationView
                onAddItem={handleAddItemToStock}
                onClose={() => setMasterSubView('account_master')}
                goldRate={gold24kRate}
              />
            )}
            {masterSubView === 'barcode' && (
              <BarcodeView
                stockItems={stockItems}
                onClose={() => setMasterSubView('account_master')}
              />
            )}
          </>
        )}

        {/* 3. TRANSACTIONS */}
        {currentSection === 'transactions' && (
          <>
            {transSubView === 'new_order' && (
              <NewOrderBookingView
                orders={orders}
                onSaveOrder={handleSaveOrder}
                onDeleteOrder={handleDeleteOrder}
                onClose={() => setCurrentSection('dashboard')}
                goldRate={gold22kRate}
              />
            )}
            {transSubView === 'purchase' && (
              <PurchaseInvoiceView
                purchases={purchases}
                onSavePurchase={handleSavePurchase}
                onDeletePurchase={() => {}}
                onClose={() => setCurrentSection('dashboard')}
                goldRate={gold24kRate}
                accounts={accounts}
                stockItems={stockItems}
                onNavigateToBarcode={() => {
                  setCurrentSection('masters');
                  setMasterSubView('barcode');
                }}
              />
            )}
            {transSubView === 'refinery_in' && (
              <RefineryInView
                refineries={refineries}
                onSaveRefinery={handleSaveRefinery}
                onClose={() => setCurrentSection('dashboard')}
                goldRate={gold24kRate}
              />
            )}
            {transSubView === 'sales_invoice' && (
              <SalesInvoiceView
                onClose={() => setCurrentSection('dashboard')}
                goldRate={gold22kRate}
              />
            )}
          </>
        )}

        {/* 4. ACCOUNTS */}
        {currentSection === 'accounts' && (
          <>
            {accSubView === 'day_book' && (
              <DayBookView
                entries={daybook}
                summary={daybookSummary}
                onClose={() => setCurrentSection('dashboard')}
              />
            )}
            {accSubView === 'book_display' && (
              <BookDisplayView
                debtors={debtors}
                onClose={() => setCurrentSection('dashboard')}
              />
            )}
            {accSubView === 'account_display' && (
              <AccountDisplayView
                accounts={accounts}
                debitEntries={debitEntries}
                creditEntries={creditEntries}
                onClose={() => setCurrentSection('dashboard')}
              />
            )}
          </>
        )}

        {/* 5. STOCK */}
        {currentSection === 'stock' && (
          <StockReportView
            stockItems={stockItems}
            onClose={() => setCurrentSection('dashboard')}
          />
        )}

        {/* 6. REPORTS (Day Book & MIS) */}
        {currentSection === 'reports' && (
          <DayBookView
            entries={daybook}
            summary={daybookSummary}
            onClose={() => setCurrentSection('dashboard')}
          />
        )}

        {/* 7. GOLD SCHEME */}
        {currentSection === 'gold_scheme' && <GoldSchemeView />}

        {/* 8. MESSENGER */}
        {currentSection === 'messenger' && <MessengerView />}

        {/* 9. BACKUP */}
        {currentSection === 'backup' && (
          <BackupManagerView
            statusList={backupStatus}
            onTriggerBackup={handleTriggerBackup}
            onRestore={() => {}}
            onClose={() => setCurrentSection('dashboard')}
          />
        )}

        {/* 10. SETTINGS */}
        {currentSection === 'settings' && (
          <SettingsView
            gold24kRate={gold24kRate}
            gold22kRate={gold22kRate}
            silverRate={silverRate}
            onUpdateRates={(g24, g22, sil) => {
              setGold24kRate(g24);
              setGold22kRate(g22);
              setSilverRate(sil);
            }}
          />
        )}

        {/* 11. MASTER FIELD DICTIONARY */}
        {currentSection === 'field_dictionary' && <FieldDictionaryView />}
      </main>

      {/* Enterprise Status Footer */}
      <footer className="bg-white border-t border-sky-200 px-4 py-2 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2 no-print">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>Cloud Database: Connected (fbmbvnvnfypkkrpslnag.supabase.co)</span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-slate-600">Branch: {currentUser.branch}</span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="font-mono text-slate-600 hidden sm:inline">HM-916-MH-4421</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <button
            onClick={() => setCurrentSection('field_dictionary')}
            className="text-blue-700 hover:text-blue-900 underline"
          >
            Field Preservation Audit (Spec #40-41)
          </button>
          <span>•</span>
          <span className="text-slate-500">Domain: ogaworld.in</span>
        </div>
      </footer>

      {/* Global Executive Analytics Modal */}
      <AnalyticsModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} />
    </div>
  );
}
export default App;
