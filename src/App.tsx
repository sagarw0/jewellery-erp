import React, { useState, useEffect } from 'react';
import {
  NavSection,
  MasterSubView,
  TransactionSubView,
  AccountSubView,
  StockSubView,
  AccountMaster,
  Vendor,
  Karagir,
  NewOrderBookingRecord,
  RefineryRecord,
  PurchaseRecord,
  DayBookEntry,
  DayBookSummary,
  SundryDebtorRow,
  StockItem,
  StockRefillItem,
  DebitLedgerEntry,
  CreditLedgerEntry,
  BackupStatusInfo,
  BackupMediaOption,
  UserRole,
  BranchId,
  AuthUser,
} from './types/erp';
import {
  INITIAL_ACCOUNTS,
  INITIAL_VENDORS,
  INITIAL_KARAGIRS,
  INITIAL_ORDERS,
  INITIAL_REFINERY,
  INITIAL_PURCHASES,
  INITIAL_DAYBOOK,
  INITIAL_DAYBOOK_SUMMARY,
  INITIAL_DEBTORS,
  INITIAL_STOCK,
  INITIAL_STOCK_REFILL_ITEMS,
  INITIAL_LEDGER_DEBIT,
  INITIAL_LEDGER_CREDIT,
  INITIAL_BACKUP_STATUS,
} from './utils/mockData';
import { cloudService } from './lib/supabase';

import { LoginView } from './components/auth/LoginView';
import { Navbar, ROLE_NAV_PERMISSIONS } from './components/layout/Navbar';
import { SubNavbar } from './components/layout/SubNavbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { AccountMasterView } from './components/masters/AccountMasterView';
import { VendorMasterView } from './components/masters/VendorMasterView';
import { KaragirMasterView } from './components/masters/KaragirMasterView';
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
import { StockRefillAlertModal } from './components/stock/StockRefillAlertModal';
import { StockRefillManagerView } from './components/stock/StockRefillManagerView';
import { BackupManagerView } from './components/backup/BackupManagerView';
import { FieldDictionaryView } from './components/dictionary/FieldDictionaryView';
import { GoldSchemeView } from './components/common/GoldSchemeView';
import { MessengerView } from './components/common/MessengerView';
import { SettingsView } from './components/common/SettingsView';
import { AnalyticsModal } from './components/dashboard/AnalyticsModal';
import { BullionRateModal } from './components/common/BullionRateModal';
import { AiAssistantModal } from './components/common/AiAssistantModal';
import { bullionRatesService } from './services/bullionRatesService';
import { ThemeCustomizerModal } from './components/common/ThemeCustomizerModal';
import { useTheme } from './context/ThemeContext';
import { Sparkles } from 'lucide-react';

export function App() {
  const { currentTheme, isCustomizerOpen, setIsCustomizerOpen, isDark } = useTheme();
  // Authentication State (Starts with Login Page)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Multi-Branch State ('all' = Consolidated View across all branches)
  const [selectedBranch, setSelectedBranch] = useState<BranchId>('all');

  // Executive Analytics Modal State
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Bullion Rates Center Modal State
  const [showBullionRates, setShowBullionRates] = useState(false);

  // Swarna AI ERP Copilot Modal State
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  // Navigation State
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [masterSubView, setMasterSubView] = useState<MasterSubView>('account_master');
  const [transSubView, setTransSubView] = useState<TransactionSubView>('new_order');
  const [accSubView, setAccSubView] = useState<AccountSubView>('day_book');
  const [stockSubView, setStockSubView] = useState<StockSubView>('stock_report');

  // Bullion Rates State (Synced with live bullion service)
  const initialRates = bullionRatesService.getRates();
  const [gold24kRate, setGold24kRate] = useState(initialRates.gold24k);
  const [gold22kRate, setGold22kRate] = useState(initialRates.gold22k);
  const [silverRate, setSilverRate] = useState(initialRates.silver999);

  // Subscribe to real-time bullion rate updates & initiate background auto-polling
  useEffect(() => {
    bullionRatesService.startPolling(60);
    const unsubscribe = bullionRatesService.subscribe((r) => {
      setGold24kRate(r.gold24k);
      setGold22kRate(r.gold22k);
      setSilverRate(r.silver999);
    });
    return () => {
      bullionRatesService.stopPolling();
      unsubscribe();
    };
  }, []);

  // Core Data Stores (Synced with Supabase Cloud DB)
  const [accounts, setAccounts] = useState<AccountMaster[]>(INITIAL_ACCOUNTS);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [karagirs, setKaragirs] = useState<Karagir[]>(INITIAL_KARAGIRS);
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

  // Stock Refill Target Store & Daily 1st-Login Popup Alert State
  const [refillItems, setRefillItems] = useState<StockRefillItem[]>(() => {
    try {
      const saved = localStorage.getItem('swarna_stock_refill_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_STOCK_REFILL_ITEMS;
  });
  const [isStockRefillAlertOpen, setIsStockRefillAlertOpen] = useState(false);

  const handleUpdateRefillItem = (updated: StockRefillItem) => {
    setRefillItems((prev) => {
      const idx = prev.findIndex((i) => i.id === updated.id);
      let next: StockRefillItem[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = updated;
      } else {
        next = [updated, ...prev];
      }
      try {
        localStorage.setItem('swarna_stock_refill_items', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleAddRefillItem = (newItem: StockRefillItem) => {
    setRefillItems((prev) => {
      const next = [newItem, ...prev];
      try {
        localStorage.setItem('swarna_stock_refill_items', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Load cloud data from Supabase on startup
  useEffect(() => {
    async function loadCloudData() {
      try {
        const [cAccounts, cVendors, cKaragirs, cOrders, cPurchases, cStock, cDaybook] = await Promise.all([
          cloudService.getAccounts(),
          cloudService.getVendors(),
          cloudService.getKaragirs(),
          cloudService.getOrders(),
          cloudService.getPurchases(),
          cloudService.getStock(),
          cloudService.getDayBook(),
        ]);
        if (cAccounts && cAccounts.length > 0) setAccounts(cAccounts);
        if (cVendors && cVendors.length > 0) setVendors(cVendors);
        if (cKaragirs && cKaragirs.length > 0) setKaragirs(cKaragirs);
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
      if (e.key === 'Escape') {
        setShowAiAssistant(false);
        setShowAnalytics(false);
        return;
      }
      if ((e.ctrlKey && e.code === 'Space') || (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setShowAiAssistant((prev) => !prev);
      } else if (e.key === 'F1') {
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
      case 'stock_refill':
        setCurrentSection('stock');
        setStockSubView('stock_refill');
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

  const handleSaveVendor = (vendor: Vendor) => {
    setVendors((prev) => {
      const idx = prev.findIndex((v) => v.id === vendor.id || v.vendor_code === vendor.vendor_code);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = vendor;
        return next;
      }
      return [vendor, ...prev];
    });
    // Async push to Supabase
    cloudService.saveVendor(vendor);
  };

  const handleDeleteVendor = (id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    cloudService.deleteVendor(id);
  };

  const handleSaveKaragir = (karagir: Karagir) => {
    setKaragirs((prev) => {
      const idx = prev.findIndex((k) => k.id === karagir.id || k.karagir_code === karagir.karagir_code);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = karagir;
        return next;
      }
      return [karagir, ...prev];
    });
    // Async push to Supabase
    cloudService.saveKaragir(karagir);
  };

  const handleDeleteKaragir = (id: string) => {
    setKaragirs((prev) => prev.filter((k) => k.id !== id));
    cloudService.deleteKaragir(id);
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

  const handleAddDayBookEntry = (entry: DayBookEntry) => {
    setDaybook((prev) => [entry, ...prev]);
    cloudService.saveDayBookEntry(entry);
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

  const handleChangeUserRole = (newRole: UserRole) => {
    if (!currentUser) return;
    const updated: AuthUser = {
      ...currentUser,
      role: newRole,
    };
    setCurrentUser(updated);

    const allowed = ROLE_NAV_PERMISSIONS[newRole];
    if (allowed && !allowed.includes(currentSection)) {
      const fallbackSection = allowed[0] || 'dashboard';
      setCurrentSection(fallbackSection);
      if (fallbackSection === 'transactions') {
        setTransSubView(newRole === 'Karagir' ? 'new_order' : 'sales_invoice');
      } else if (fallbackSection === 'accounts') {
        setAccSubView('day_book');
      } else if (fallbackSection === 'stock') {
        setStockSubView('stock_report');
      }
    }
  };

  // If not logged in, show clean Login Screen
  if (!currentUser) {
    return (
      <LoginView
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.branchId) setSelectedBranch(user.branchId);

          // Check if 1st login of the day for stock refill alert popup
          const todayStr = new Date().toISOString().slice(0, 10);
          const lastAlertKey = `swarna_last_login_stock_alert_date_${user.code}`;
          const lastAlertDate = localStorage.getItem(lastAlertKey);

          // If 1st login of the day, trigger the popup alert
          if (lastAlertDate !== todayStr) {
            setIsStockRefillAlertOpen(true);
            localStorage.setItem(lastAlertKey, todayStr);
          }
        }}
      />
    );
  }

  const stockDeficitCount = refillItems.filter((i) => i.current_stock < i.desired_stock).length;

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
        selectedBranch={selectedBranch}
        onSelectBranch={(b) => setSelectedBranch(b)}
        onChangeUserRole={handleChangeUserRole}
        onLogout={() => setCurrentUser(null)}
        onOpenAnalytics={() => setShowAnalytics(true)}
        onOpenBullionRates={() => setShowBullionRates(true)}
        onOpenAiAssistant={() => setShowAiAssistant(true)}
        onOpenStockRefill={() => setIsStockRefillAlertOpen(true)}
        stockDeficitCount={stockDeficitCount}
      />

      {/* Sub-Header Navigation Tabs for Multi-view Sections */}
      <SubNavbar
        currentSection={currentSection}
        masterSubView={masterSubView}
        setMasterSubView={setMasterSubView}
        transSubView={transSubView}
        setTransSubView={setTransSubView}
        accSubView={accSubView}
        setAccSubView={setAccSubView}
        stockSubView={stockSubView}
        setStockSubView={setStockSubView}
        currentUser={currentUser}
      />

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
            refillItems={refillItems}
            onOpenStockRefill={() => setIsStockRefillAlertOpen(true)}
            currentUser={currentUser}
            selectedBranch={selectedBranch}
            onSelectBranch={(b) => setSelectedBranch(b)}
            onOpenBullionRates={() => setShowBullionRates(true)}
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
            {masterSubView === 'vendor_master' && (
              <VendorMasterView
                vendors={vendors}
                onSaveVendor={handleSaveVendor}
                onDeleteVendor={handleDeleteVendor}
                onClose={() => setCurrentSection('dashboard')}
                onNavigateToPurchase={(vendor) => {
                  setCurrentSection('transactions');
                  setTransSubView('purchase');
                }}
              />
            )}
            {masterSubView === 'karagir_master' && (
              <KaragirMasterView
                karagirs={karagirs}
                onSaveKaragir={handleSaveKaragir}
                onDeleteKaragir={handleDeleteKaragir}
                onClose={() => setCurrentSection('dashboard')}
                onNavigateToOrderBooking={(karagir: Karagir) => {
                  setCurrentSection('transactions');
                  setTransSubView('new_order');
                }}
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
                karagirs={karagirs}
                onSaveKaragir={handleSaveKaragir}
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
                vendors={vendors}
                onSaveVendor={handleSaveVendor}
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
          <>
            {stockSubView === 'stock_report' && (
              <StockReportView
                stockItems={stockItems}
                onClose={() => setCurrentSection('dashboard')}
              />
            )}
            {stockSubView === 'stock_refill' && (
              <StockRefillManagerView
                refillItems={refillItems}
                onUpdateRefillItem={handleUpdateRefillItem}
                onAddRefillItem={handleAddRefillItem}
                onOpenAlertModal={() => setIsStockRefillAlertOpen(true)}
                currentUser={currentUser}
                vendors={vendors}
                karagirs={karagirs}
                gold24kRate={gold24kRate}
                gold22kRate={gold22kRate}
              />
            )}
            {stockSubView === 'audit' && (
              <StockReportView
                stockItems={stockItems}
                onClose={() => setCurrentSection('dashboard')}
              />
            )}
          </>
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
      <footer
        className={`px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 no-print border-t ${
          isDark
            ? 'bg-[#070b14]/95 border-white/10 text-slate-400'
            : 'bg-white border-sky-200 text-slate-500'
        }`}
      >
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 text-emerald-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>Cloud Database: Connected (fbmbvnvnfypkkrpslnag.supabase.co)</span>
          </span>
          <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</span>
          <span className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Branch: {currentUser.branch}
          </span>
          <span className={`${isDark ? 'text-slate-700' : 'text-slate-300'} hidden sm:inline`}>|</span>
          <span className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'} hidden sm:inline`}>
            HM-916-MH-4421
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <button
            onClick={() => setCurrentSection('field_dictionary')}
            className={`${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-blue-700 hover:text-blue-900'} underline`}
          >
            Field Preservation Audit (Spec #40-41)
          </button>
          <span>•</span>
          <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>Domain: ogaworld.in</span>
        </div>
      </footer>

      {/* Global Executive Analytics Modal */}
      <AnalyticsModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} />

      {/* Floating AI Copilot Trigger Button (Bottom-Right) */}
      {!showAiAssistant && (
        <button
          onClick={() => setShowAiAssistant(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center space-x-2.5 border-2 border-amber-300 group no-print"
          title="Swarna AI ERP Copilot (Ctrl+Space)"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <Sparkles className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold tracking-wider block leading-tight">AI Copilot</span>
            <span className="text-[9px] font-mono text-slate-900/80 font-normal leading-tight">Ctrl+Space</span>
          </div>
        </button>
      )}

      {/* Global Swarna AI ERP Copilot Modal / Drawer */}
      <AiAssistantModal
        isOpen={showAiAssistant}
        onClose={() => setShowAiAssistant(false)}
        context={{
          accounts,
          orders,
          purchases,
          stockItems,
          daybook,
          daybookSummary,
          debtors,
          refineries,
          gold24kRate,
          gold22kRate,
          silverRate,
          branchName: currentUser.branch,
          vendors,
          karagirs,
        }}
        onSavePurchase={handleSavePurchase}
        onSaveOrder={handleSaveOrder}
        onSaveAccount={handleSaveAccount}
        onSaveRefinery={handleSaveRefinery}
        onAddItemToStock={handleAddItemToStock}
        onAddDayBookEntry={handleAddDayBookEntry}
        onNavigate={(section, subView) => {
          setCurrentSection(section as NavSection);
          if (subView) {
            if (section === 'masters') setMasterSubView(subView as MasterSubView);
            else if (section === 'transactions') setTransSubView(subView as TransactionSubView);
            else if (section === 'accounts') setAccSubView(subView as AccountSubView);
            else if (section === 'stock') setStockSubView(subView as StockSubView);
          }
        }}
      />

      {/* Global Theme & UI Customizer Modal */}
      <ThemeCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />

      {/* Daily 1st-Login Stock Refill Alert Modal */}
      <StockRefillAlertModal
        isOpen={isStockRefillAlertOpen}
        onClose={() => setIsStockRefillAlertOpen(false)}
        refillItems={refillItems}
        onUpdateRefillItem={handleUpdateRefillItem}
        onOpenDetailedManager={() => {
          setCurrentSection('stock');
          setStockSubView('stock_refill');
        }}
        currentUser={currentUser}
        gold24kRate={gold24kRate}
        gold22kRate={gold22kRate}
      />
    </div>
  );
}
export default App;
