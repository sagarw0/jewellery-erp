import { createClient } from '@supabase/supabase-js';
import {
  AccountMaster,
  NewOrderBookingRecord,
  PurchaseRecord,
  RefineryRecord,
  DayBookEntry,
  StockItem
} from '../types/erp';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://fbmbvnvnfypkkrpslnag.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ciV3Ijfe0jlyaqZRZlRebQ_igT0K8EK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const checkSupabaseConnection = async (): Promise<{ connected: boolean; message: string }> => {
  try {
    const { data, error } = await supabase.from('erp_accounts').select('account_code').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "public.erp_accounts" does not exist')) {
        return {
          connected: true,
          message: 'Connected to Supabase! (Tables need to be created via SQL Editor)'
        };
      }
      return { connected: false, message: error.message };
    }
    return { connected: true, message: 'Connected to Live Cloud Database' };
  } catch (err: any) {
    return { connected: false, message: err?.message || 'Connection failed' };
  }
};

// ----------------------------------------------------
// Cloud Data Services
// ----------------------------------------------------

export const cloudService = {
  // Accounts
  async getAccounts(): Promise<AccountMaster[] | null> {
    try {
      const { data, error } = await supabase.from('erp_accounts').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((d: any) => ({
        account_code: d.account_code,
        account_name: d.account_name,
        account_type: d.account_type,
        account_group: d.account_group,
        opening_balance: Number(d.opening_balance),
        balance_type: d.balance_type || 'Dr',
        card_charges: d.card_charges || { card_charges: false, for_customer_pct: 0, for_us_pct: 0 },
        phone: d.phone,
        area: d.area,
      }));
    } catch {
      return null;
    }
  },

  async saveAccount(account: AccountMaster): Promise<boolean> {
    try {
      const { error } = await supabase.from('erp_accounts').upsert({
        account_code: account.account_code,
        account_name: account.account_name,
        account_type: account.account_type,
        account_group: account.account_group,
        opening_balance: account.opening_balance,
        balance_type: account.balance_type,
        card_charges: account.card_charges,
        phone: account.phone || '',
        area: account.area || '',
      }, { onConflict: 'account_code' });
      return !error;
    } catch {
      return false;
    }
  },

  // Orders
  async getOrders(): Promise<NewOrderBookingRecord[] | null> {
    try {
      const { data, error } = await supabase.from('erp_orders').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) return null;
      return data.map((d: any) => ({
        id: d.id,
        order_no: d.order_no,
        header: d.header,
        items: d.items,
        payment: d.payment,
        status: d.status,
        created_at: d.created_at,
      }));
    } catch {
      return null;
    }
  },

  async saveOrder(order: NewOrderBookingRecord): Promise<boolean> {
    try {
      const { error } = await supabase.from('erp_orders').upsert({
        id: order.id,
        order_no: order.order_no,
        header: order.header,
        items: order.items,
        payment: order.payment,
        status: order.status,
        created_at: order.created_at || new Date().toISOString(),
      }, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  // Purchases
  async getPurchases(): Promise<PurchaseRecord[] | null> {
    try {
      const { data, error } = await supabase.from('erp_purchases').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((d: any) => ({
        id: d.id,
        header: d.header,
        items: d.items,
        payment: d.payment,
        created_at: d.created_at,
      }));
    } catch {
      return null;
    }
  },

  async savePurchase(purchase: PurchaseRecord): Promise<boolean> {
    try {
      const { error } = await supabase.from('erp_purchases').upsert({
        id: purchase.id,
        header: purchase.header,
        items: purchase.items,
        payment: purchase.payment,
        created_at: purchase.created_at || new Date().toISOString(),
      }, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  // Stock
  async getStock(): Promise<StockItem[] | null> {
    try {
      const { data, error } = await supabase.from('erp_stock').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((d: any) => ({
        id: d.id,
        item_name: d.item_name,
        qty: Number(d.qty),
        gross_wt: Number(d.gross_wt),
        net_wt: Number(d.net_wt),
        fine_wt: Number(d.fine_wt),
        purity: Number(d.purity),
        category: d.category,
        tag_no: d.tag_no,
        is_urd: Boolean(d.is_urd),
        rate_per_gm: Number(d.rate_per_gm),
        total_value: Number(d.total_value),
      }));
    } catch {
      return null;
    }
  },

  async saveStockItem(item: StockItem): Promise<boolean> {
    try {
      const { error } = await supabase.from('erp_stock').upsert({
        id: item.id,
        item_name: item.item_name,
        qty: item.qty,
        gross_wt: item.gross_wt,
        net_wt: item.net_wt,
        fine_wt: item.fine_wt,
        purity: item.purity,
        category: item.category,
        tag_no: item.tag_no || '',
        is_urd: item.is_urd,
        rate_per_gm: item.rate_per_gm,
        total_value: item.total_value,
      }, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  // DayBook
  async getDayBook(): Promise<DayBookEntry[] | null> {
    try {
      const { data, error } = await supabase.from('erp_daybook').select('*').order('date', { ascending: false });
      if (error || !data || data.length === 0) return null;
      return data.map((d: any) => ({
        id: d.id,
        invoice_type: d.invoice_type,
        invoice_no: d.invoice_no,
        total_amt: Number(d.total_amt),
        urd_amt: Number(d.urd_amt),
        net_amt: Number(d.net_amt),
        cash_received: Number(d.cash_received),
        cash_payment: Number(d.cash_payment),
        bank_received: Number(d.bank_received),
        bank_payment: Number(d.bank_payment),
        date: d.date,
        details: d.details,
        total_amt_without_disc: Number(d.total_amt_without_disc),
      }));
    } catch {
      return null;
    }
  },

  async saveDayBookEntry(entry: DayBookEntry): Promise<boolean> {
    try {
      const { error } = await supabase.from('erp_daybook').upsert(entry, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },
};
