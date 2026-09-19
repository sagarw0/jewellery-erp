import React, { useState, useMemo } from 'react';
import { Vendor, VendorType } from '../../types/erp';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Scale,
  Coins,
  CheckCircle2,
  X,
  Save,
  Download,
  Printer,
  ShoppingBag,
  ExternalLink,
  HelpCircle,
  FileText,
  BadgePercent,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { useTheme } from '../../context/ThemeContext';

interface VendorMasterViewProps {
  vendors: Vendor[];
  onSaveVendor: (vendor: Vendor) => void;
  onDeleteVendor: (id: string) => void;
  onClose: () => void;
  onNavigateToPurchase?: (vendor: Vendor) => void;
}

const VENDOR_TYPES: VendorType[] = [
  'Bullion Dealer',
  'Manufacturer / Karigar',
  'Casting Unit',
  'Diamond Merchant',
  'Silver Artisan',
  'Wholesaler',
  'Packaging & Others',
];

const GST_STATE_CODES: Record<string, string> = {
  '27': 'Maharashtra (27)',
  '24': 'Gujarat (24)',
  '07': 'Delhi (07)',
  '33': 'Tamil Nadu (33)',
  '29': 'Karnataka (29)',
  '09': 'Uttar Pradesh (09)',
  '19': 'West Bengal (19)',
  '08': 'Rajasthan (08)',
  '23': 'Madhya Pradesh (23)',
  '36': 'Telangana (36)',
  '37': 'Andhra Pradesh (37)',
  '32': 'Kerala (32)',
  '06': 'Haryana (06)',
  '03': 'Punjab (03)',
  '21': 'Odisha (21)',
  '10': 'Bihar (10)',
};

export const VendorMasterView: React.FC<VendorMasterViewProps> = ({
  vendors,
  onSaveVendor,
  onDeleteVendor,
  onClose,
  onNavigateToPurchase,
}) => {
  const { currentTheme, isDark } = useTheme();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'code' | 'balance'>('name');

  // Modal State for Add / Edit
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'gst' | 'bank' | 'balance'>('basic');

  // Form State
  const [formState, setFormState] = useState<Partial<Vendor>>({
    vendor_code: '',
    vendor_name: '',
    contact_person: '',
    phone: '',
    email: '',
    gstin: '',
    pan_no: '',
    city: '',
    state: 'Maharashtra (27)',
    address: '',
    pincode: '',
    vendor_type: 'Bullion Dealer',
    bank_name: '',
    bank_account_no: '',
    ifsc_code: '',
    branch_name: '',
    credit_limit: 10000000,
    credit_days: 15,
    opening_balance_gold_fine_gm: 0,
    opening_balance_silver_fine_gm: 0,
    opening_balance_cash: 0,
    balance_type: 'Cr',
    status: 'Active',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auto-generate next vendor code
  const nextVendorCode = useMemo(() => {
    const existingNumbers = vendors
      .map((v) => {
        const match = v.vendor_code.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 100;
    return `SUP-${maxNum + 1}`;
  }, [vendors]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingVendor(null);
    setFormState({
      id: `ven-${Date.now()}`,
      vendor_code: nextVendorCode,
      vendor_name: '',
      contact_person: '',
      phone: '',
      email: '',
      gstin: '',
      pan_no: '',
      city: '',
      state: 'Maharashtra (27)',
      address: '',
      pincode: '',
      vendor_type: 'Bullion Dealer',
      bank_name: '',
      bank_account_no: '',
      ifsc_code: '',
      branch_name: '',
      credit_limit: 10000000,
      credit_days: 15,
      opening_balance_gold_fine_gm: 0,
      opening_balance_silver_fine_gm: 0,
      opening_balance_cash: 0,
      balance_type: 'Cr',
      status: 'Active',
      notes: '',
    });
    setFormErrors({});
    setActiveFormTab('basic');
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setFormState({ ...v });
    setFormErrors({});
    setActiveFormTab('basic');
    setShowModal(true);
  };

  // Handle GSTIN change with state detection
  const handleGstinChange = (gstin: string) => {
    const cleanGstin = gstin.toUpperCase().trim();
    let pan = formState.pan_no || '';
    let state = formState.state || 'Maharashtra (27)';

    if (cleanGstin.length >= 2) {
      const stateCode = cleanGstin.substring(0, 2);
      if (GST_STATE_CODES[stateCode]) {
        state = GST_STATE_CODES[stateCode];
      }
    }
    if (cleanGstin.length >= 12) {
      pan = cleanGstin.substring(2, 12);
    }

    setFormState((prev) => ({
      ...prev,
      gstin: cleanGstin,
      pan_no: pan,
      state,
    }));
  };

  // Validate and Save
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formState.vendor_name?.trim()) {
      errors.vendor_name = 'Vendor / Supplier name is required.';
    }
    if (!formState.vendor_code?.trim()) {
      errors.vendor_code = 'Vendor code is required.';
    }
    if (!formState.phone?.trim()) {
      errors.phone = 'Mobile / Contact phone is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      if (errors.vendor_name || errors.vendor_code || errors.phone) {
        setActiveFormTab('basic');
      }
      return;
    }

    const vendorToSave: Vendor = {
      id: formState.id || `ven-${Date.now()}`,
      vendor_code: formState.vendor_code!.trim().toUpperCase(),
      vendor_name: formState.vendor_name!.trim(),
      contact_person: formState.contact_person?.trim() || '',
      phone: formState.phone!.trim(),
      email: formState.email?.trim() || '',
      gstin: formState.gstin?.trim().toUpperCase() || '',
      pan_no: formState.pan_no?.trim().toUpperCase() || '',
      city: formState.city?.trim() || '',
      state: formState.state || 'Maharashtra (27)',
      address: formState.address?.trim() || '',
      pincode: formState.pincode?.trim() || '',
      vendor_type: (formState.vendor_type as VendorType) || 'Bullion Dealer',
      bank_name: formState.bank_name?.trim() || '',
      bank_account_no: formState.bank_account_no?.trim() || '',
      ifsc_code: formState.ifsc_code?.trim().toUpperCase() || '',
      branch_name: formState.branch_name?.trim() || '',
      credit_limit: Number(formState.credit_limit) || 0,
      credit_days: Number(formState.credit_days) || 0,
      opening_balance_gold_fine_gm: Number(formState.opening_balance_gold_fine_gm) || 0,
      opening_balance_silver_fine_gm: Number(formState.opening_balance_silver_fine_gm) || 0,
      opening_balance_cash: Number(formState.opening_balance_cash) || 0,
      balance_type: formState.balance_type || 'Cr',
      status: formState.status || 'Active',
      notes: formState.notes?.trim() || '',
      created_at: formState.created_at || new Date().toISOString().split('T')[0],
    };

    onSaveVendor(vendorToSave);
    setShowModal(false);
  };

  // Filtered and Sorted Vendors
  const filteredVendors = useMemo(() => {
    return vendors
      .filter((v) => {
        const matchesSearch =
          v.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.vendor_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (v.contact_person && v.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (v.city && v.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
          v.phone.includes(searchTerm) ||
          (v.gstin && v.gstin.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = selectedType === 'all' || v.vendor_type === selectedType;
        const matchesStatus =
          selectedStatus === 'all'
            ? true
            : selectedStatus === 'active'
            ? v.status === 'Active'
            : selectedStatus === 'inactive'
            ? v.status === 'Inactive'
            : selectedStatus === 'balance'
            ? (v.opening_balance_cash > 0 || (v.opening_balance_gold_fine_gm || 0) > 0)
            : true;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.vendor_name.localeCompare(b.vendor_name);
        if (sortBy === 'code') return a.vendor_code.localeCompare(b.vendor_code);
        if (sortBy === 'balance') return (b.opening_balance_cash || 0) - (a.opening_balance_cash || 0);
        return 0;
      });
  }, [vendors, searchTerm, selectedType, selectedStatus, sortBy]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalActive = vendors.filter((v) => v.status === 'Active').length;
    const totalCashPayable = vendors
      .filter((v) => v.balance_type === 'Cr')
      .reduce((sum, v) => sum + (v.opening_balance_cash || 0), 0);
    const totalGoldGrams = vendors
      .filter((v) => v.balance_type === 'Cr')
      .reduce((sum, v) => sum + (v.opening_balance_gold_fine_gm || 0), 0);
    const totalSilverGrams = vendors
      .filter((v) => v.balance_type === 'Cr')
      .reduce((sum, v) => sum + (v.opening_balance_silver_fine_gm || 0), 0);

    return {
      totalActive,
      totalCashPayable,
      totalGoldGrams,
      totalSilverGrams,
    };
  }, [vendors]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Vendor Code',
      'Vendor Name',
      'Category',
      'Contact Person',
      'Phone',
      'Email',
      'GSTIN',
      'City',
      'State',
      'Bank Name',
      'A/c No',
      'IFSC',
      'Opening Cash (INR)',
      'Balance Type',
      'Fine Gold (g)',
      'Fine Silver (g)',
      'Credit Limit (INR)',
      'Credit Days',
      'Status'
    ];

    const rows = filteredVendors.map((v) => [
      `"${v.vendor_code}"`,
      `"${v.vendor_name}"`,
      `"${v.vendor_type}"`,
      `"${v.contact_person || ''}"`,
      `"${v.phone}"`,
      `"${v.email || ''}"`,
      `"${v.gstin || ''}"`,
      `"${v.city}"`,
      `"${v.state}"`,
      `"${v.bank_name || ''}"`,
      `"${v.bank_account_no || ''}"`,
      `"${v.ifsc_code || ''}"`,
      v.opening_balance_cash,
      v.balance_type,
      v.opening_balance_gold_fine_gm || 0,
      v.opening_balance_silver_fine_gm || 0,
      v.credit_limit || 0,
      v.credit_days || 0,
      v.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `swarna_vendor_master_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`p-4 md:p-6 space-y-6 max-w-7xl mx-auto ${currentTheme.textPrimary}`}>
      {/* Top Banner & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-slate-950 font-bold shadow-md">
              <Building2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  Vendor & Supplier Master
                </h1>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${
                  isDark ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' : 'bg-amber-100 text-amber-950 border-amber-400'
                }`}>
                  व्हेंडर व पुरवठादार व्यवस्थापन
                </span>
              </div>
              <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Manage Bullion Dealers, Karigars, Casting Units, Wholesalers & auto-populate Purchase Inwards
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-900'
            }`}
            title="Download CSV"
          >
            <Download className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-slate-700'}`} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md flex items-center space-x-2 transition-all cursor-pointer active:scale-95 ${
              isDark
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-extrabold'
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Vendor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-[#0f172a]/90 border-white/10 text-white shadow-xs' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between text-xs font-bold mb-1 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <span>Active Suppliers</span>
            <Building2 className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
          </div>
          <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {metrics.totalActive} <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>/ {vendors.length} Total</span>
          </div>
          <div className={`text-[11px] font-bold mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
            ✓ Ready for Purchase & Orders
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-[#0f172a]/90 border-white/10 text-white shadow-xs' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between text-xs font-bold mb-1 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <span>Outstanding Payable (₹)</span>
            <CreditCard className="w-4 h-4 text-amber-500" />
          </div>
          <div className={`text-xl font-black font-mono ${isDark ? 'text-amber-300' : 'text-amber-950'}`}>
            {formatCurrency(metrics.totalCashPayable)}
          </div>
          <div className={`text-[11px] font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Total ledger credit balance
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-[#0f172a]/90 border-white/10 text-white shadow-xs' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between text-xs font-bold mb-1 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <span>Fine Gold Due (g)</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className={`text-xl font-black font-mono ${isDark ? 'text-amber-300' : 'text-amber-950'}`}>
            {formatWeight(metrics.totalGoldGrams)}
          </div>
          <div className={`text-[11px] font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            ~{(metrics.totalGoldGrams / 11.664).toFixed(2)} tolas pure gold
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-[#0f172a]/90 border-white/10 text-white shadow-xs' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between text-xs font-bold mb-1 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <span>Fine Silver Due (g)</span>
            <Scale className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          </div>
          <div className={`text-xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-950'}`}>
            {formatWeight(metrics.totalSilverGrams)}
          </div>
          <div className={`text-[11px] font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            ~{(metrics.totalSilverGrams / 1000).toFixed(2)} kg 999 silver
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-3 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
        isDark ? 'bg-[#0f172a]/80 border-white/10' : 'bg-white border-slate-300 shadow-xs'
      }`}>
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by vendor name, code (SUP-101), mobile, GSTIN, city..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-hidden border transition-all font-medium ${
              isDark
                ? 'bg-white/5 border-white/15 text-white placeholder:text-slate-500 focus:border-amber-400'
                : 'bg-slate-50 border-slate-300 text-slate-950 placeholder:text-slate-500 focus:border-blue-600 focus:bg-white'
            }`}
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={`text-xs font-bold px-3 py-2 rounded-xl border outline-hidden cursor-pointer ${
              isDark ? 'bg-[#0f172a] text-white border-white/15' : 'bg-slate-50 text-slate-900 border-slate-300'
            }`}
          >
            <option value="all">All Vendor Categories</option>
            {VENDOR_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`text-xs font-bold px-3 py-2 rounded-xl border outline-hidden cursor-pointer ${
              isDark ? 'bg-[#0f172a] text-white border-white/15' : 'bg-slate-50 text-slate-900 border-slate-300'
            }`}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive</option>
            <option value="balance">Has Outstanding Balance</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`text-xs font-bold px-3 py-2 rounded-xl border outline-hidden cursor-pointer ${
              isDark ? 'bg-[#0f172a] text-white border-white/15' : 'bg-slate-50 text-slate-900 border-slate-300'
            }`}
          >
            <option value="name">Sort by Name</option>
            <option value="code">Sort by Code</option>
            <option value="balance">Sort by Balance Due</option>
          </select>
        </div>
      </div>

      {/* Vendors Interactive Data Table */}
      <div className={`rounded-2xl border overflow-hidden transition-all shadow-sm ${
        isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white border-slate-300'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-800 text-slate-100 font-bold uppercase tracking-wider text-[11px] border-b border-slate-700">
              <tr>
                <th className="p-3.5 whitespace-nowrap">Vendor Code</th>
                <th className="p-3.5 whitespace-nowrap">Company & Category</th>
                <th className="p-3.5 whitespace-nowrap">Contact & Location</th>
                <th className="p-3.5 whitespace-nowrap">GSTIN & PAN</th>
                <th className="p-3.5 whitespace-nowrap text-right">Ledger Balance (₹)</th>
                <th className="p-3.5 whitespace-nowrap text-right">Fine Metal Due</th>
                <th className="p-3.5 whitespace-nowrap text-center">Status</th>
                <th className="p-3.5 whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-600">
                    <Building2 className="w-10 h-10 mx-auto mb-2 opacity-50 text-slate-500" />
                    <p className="font-bold text-slate-800 text-sm">No vendors found matching your filter</p>
                    <button
                      onClick={handleOpenAdd}
                      className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs cursor-pointer shadow-sm hover:bg-blue-700"
                    >
                      + Create First Vendor
                    </button>
                  </td>
                </tr>
              ) : (
                filteredVendors.map((v) => (
                  <tr
                    key={v.id}
                    className="transition-colors hover:bg-amber-50/50 bg-white"
                  >
                    {/* Code */}
                    <td className="p-3.5 font-mono whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 font-black border border-amber-300 text-xs shadow-2xs">
                        {v.vendor_code}
                      </span>
                    </td>

                    {/* Name & Type */}
                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-950 text-xs">
                        {v.vendor_name}
                      </div>
                      <div className="flex items-center space-x-1.5 mt-1 flex-wrap gap-y-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-extrabold bg-indigo-100 text-indigo-950 border border-indigo-300">
                          {v.vendor_type}
                        </span>
                        {Boolean(v.credit_days && v.credit_days > 0) && (
                          <span className="text-[10px] text-slate-700 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                            {v.credit_days}d credit
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Contact & Location */}
                    <td className="p-3.5">
                      <div className="font-extrabold text-emerald-950 flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{v.phone}</span>
                      </div>
                      <div className="text-[11px] text-slate-700 font-semibold flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-600 shrink-0" />
                        <span>{v.city ? `${v.city}, ${v.state.split(' ')[0]}` : v.state}</span>
                      </div>
                    </td>

                    {/* GSTIN & PAN */}
                    <td className="p-3.5 font-mono text-[11px]">
                      {v.gstin ? (
                        <div className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 inline-block">
                          {v.gstin}
                        </div>
                      ) : (
                        <span className="text-slate-600 font-semibold italic">Unregistered (URD)</span>
                      )}
                      {v.pan_no && (
                        <div className="text-[11px] text-slate-700 font-bold mt-0.5">
                          PAN: {v.pan_no}
                        </div>
                      )}
                    </td>

                    {/* Ledger Cash Balance */}
                    <td className="p-3.5 text-right font-mono whitespace-nowrap">
                      <div className={`text-xs font-black ${v.balance_type === 'Cr' ? 'text-amber-950' : 'text-emerald-950'}`}>
                        {formatCurrency(v.opening_balance_cash)}
                      </div>
                      <span className="text-[10px] text-slate-700 font-bold font-sans">
                        {v.balance_type === 'Cr' ? '(Payable / Cr)' : '(Advance / Dr)'}
                      </span>
                    </td>

                    {/* Fine Metal Due */}
                    <td className="p-3.5 text-right font-mono whitespace-nowrap">
                      {(v.opening_balance_gold_fine_gm || 0) > 0 && (
                        <div className="text-amber-950 font-black text-xs">
                          Au: {formatWeight(v.opening_balance_gold_fine_gm!)}
                        </div>
                      )}
                      {(v.opening_balance_silver_fine_gm || 0) > 0 && (
                        <div className="text-slate-800 font-bold text-[11px]">
                          Ag: {formatWeight(v.opening_balance_silver_fine_gm!)}
                        </div>
                      )}
                      {!(v.opening_balance_gold_fine_gm || 0) && !(v.opening_balance_silver_fine_gm || 0) && (
                        <span className="text-slate-500 font-bold font-sans text-[11px]">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-2xs ${
                        v.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                          : 'bg-slate-200 text-slate-900 border border-slate-400'
                      }`}>
                        {v.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        {/* Create Purchase Bill Button */}
                        {onNavigateToPurchase && (
                          <button
                            onClick={() => onNavigateToPurchase(v)}
                            className="px-2 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[11px] shadow-sm flex items-center space-x-1 cursor-pointer"
                            title={`Create Purchase Bill for ${v.vendor_name} (F5)`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline text-[10px]">Buy</span>
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 transition-colors cursor-pointer"
                          title="Edit Vendor Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete vendor "${v.vendor_name}" (${v.vendor_code})?`)) {
                              onDeleteVendor(v.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 hover:text-rose-900 transition-colors cursor-pointer"
                          title="Delete Vendor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Vendor Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-3xl rounded-3xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden ${
            isDark ? 'bg-[#0f172a] border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Modal Header */}
            <div className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold">
                    {editingVendor ? `Edit Vendor: ${editingVendor.vendor_name}` : 'Add New Vendor / Supplier'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Enter supplier tax credentials, contact info, bank details & opening balances
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className={`flex border-b px-5 pt-2 space-x-4 text-xs font-bold overflow-x-auto shrink-0 ${
              isDark ? 'border-white/10 bg-[#0b1120]' : 'border-slate-200 bg-slate-100/60'
            }`}>
              <button
                type="button"
                onClick={() => setActiveFormTab('basic')}
                className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeFormTab === 'basic'
                    ? 'border-blue-600 text-blue-600 dark:text-amber-400 dark:border-amber-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>1. Basic Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('gst')}
                className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeFormTab === 'gst'
                    ? 'border-blue-600 text-blue-600 dark:text-amber-400 dark:border-amber-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>2. GST & Address</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('bank')}
                className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeFormTab === 'bank'
                    ? 'border-blue-600 text-blue-600 dark:text-amber-400 dark:border-amber-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>3. Banking Details</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab('balance')}
                className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeFormTab === 'balance'
                    ? 'border-blue-600 text-blue-600 dark:text-amber-400 dark:border-amber-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>4. Balances & Terms</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-sans">
              {/* Tab 1: Basic Profile */}
              {activeFormTab === 'basic' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block font-semibold mb-1">
                      Vendor Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formState.vendor_code || ''}
                      onChange={(e) => setFormState({ ...formState, vendor_code: e.target.value.toUpperCase() })}
                      placeholder="e.g. SUP-108"
                      className={`w-full px-3 py-2 rounded-xl border font-mono outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                      required
                    />
                    {formErrors.vendor_code && (
                      <p className="text-rose-500 text-[10px] mt-1">{formErrors.vendor_code}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Vendor / Company Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formState.vendor_name || ''}
                      onChange={(e) => setFormState({ ...formState, vendor_name: e.target.value })}
                      placeholder="e.g. Zaveri Bullion & Refinery"
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                      required
                    />
                    {formErrors.vendor_name && (
                      <p className="text-rose-500 text-[10px] mt-1">{formErrors.vendor_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Vendor Category / Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formState.vendor_type || 'Bullion Dealer'}
                      onChange={(e) => setFormState({ ...formState, vendor_type: e.target.value as VendorType })}
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden cursor-pointer ${
                        isDark ? 'bg-[#0f172a] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      {VENDOR_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Contact Person (Proprietor / Manager)
                    </label>
                    <input
                      type="text"
                      value={formState.contact_person || ''}
                      onChange={(e) => setFormState({ ...formState, contact_person: e.target.value })}
                      placeholder="e.g. Hareshbhai Zaveri"
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Mobile / WhatsApp Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formState.phone || ''}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      placeholder="e.g. +91 98201 98201"
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                      required
                    />
                    {formErrors.phone && (
                      <p className="text-rose-500 text-[10px] mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formState.email || ''}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="e.g. accounts@zaveri.in"
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Status
                    </label>
                    <select
                      value={formState.status || 'Active'}
                      onChange={(e) => setFormState({ ...formState, status: e.target.value as 'Active' | 'Inactive' })}
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden cursor-pointer ${
                        isDark ? 'bg-[#0f172a] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="Active">Active (सक्रिय - खरेदीसाठी उपलब्ध)</option>
                      <option value="Inactive">Inactive (अक्रिय)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Tab 2: GST & Address */}
              {activeFormTab === 'gst' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block font-semibold mb-1">
                      GSTIN (15 Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      value={formState.gstin || ''}
                      onChange={(e) => handleGstinChange(e.target.value)}
                      placeholder="e.g. 27AAACZ1234F1Z5"
                      className={`w-full px-3 py-2 rounded-xl border font-mono uppercase outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      State code (first 2 digits) automatically selects State
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Income Tax PAN Number
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={formState.pan_no || ''}
                      onChange={(e) => setFormState({ ...formState, pan_no: e.target.value.toUpperCase() })}
                      placeholder="e.g. AAACZ1234F"
                      className={`w-full px-3 py-2 rounded-xl border font-mono uppercase outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      State (for CGST+SGST vs IGST calculation)
                    </label>
                    <select
                      value={formState.state || 'Maharashtra (27)'}
                      onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden cursor-pointer ${
                        isDark ? 'bg-[#0f172a] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      {Object.values(GST_STATE_CODES).map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      City / Town
                    </label>
                    <input
                      type="text"
                      value={formState.city || ''}
                      onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                      placeholder="e.g. Mumbai / Rajkot / Surat / Coimbatore"
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1">
                      Full Address & Landmark
                    </label>
                    <textarea
                      rows={2}
                      value={formState.address || ''}
                      onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                      placeholder="e.g. Shop 14, Bullion Complex, Shaikh Memon Street, Zaveri Bazaar"
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formState.pincode || ''}
                      onChange={(e) => setFormState({ ...formState, pincode: e.target.value })}
                      placeholder="e.g. 400002"
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Banking Details */}
              {activeFormTab === 'bank' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block font-semibold mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={formState.bank_name || ''}
                      onChange={(e) => setFormState({ ...formState, bank_name: e.target.value })}
                      placeholder="e.g. HDFC Bank Ltd / State Bank of India"
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Current / Cash Credit Account Number
                    </label>
                    <input
                      type="text"
                      value={formState.bank_account_no || ''}
                      onChange={(e) => setFormState({ ...formState, bank_account_no: e.target.value })}
                      placeholder="e.g. 50200089211244"
                      className={`w-full px-3 py-2 rounded-xl border font-mono outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      value={formState.ifsc_code || ''}
                      onChange={(e) => setFormState({ ...formState, ifsc_code: e.target.value.toUpperCase() })}
                      placeholder="e.g. HDFC0000145"
                      className={`w-full px-3 py-2 rounded-xl border font-mono uppercase outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Bank Branch
                    </label>
                    <input
                      type="text"
                      value={formState.branch_name || ''}
                      onChange={(e) => setFormState({ ...formState, branch_name: e.target.value })}
                      placeholder="e.g. Fort Mumbai / Connaught Place"
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Tab 4: Balances & Terms */}
              {activeFormTab === 'balance' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block font-semibold mb-1">
                      Opening Cash / Ledger Balance (₹)
                    </label>
                    <input
                      type="number"
                      value={formState.opening_balance_cash || 0}
                      onChange={(e) => setFormState({ ...formState, opening_balance_cash: parseFloat(e.target.value) || 0 })}
                      className={`w-full px-3 py-2 rounded-xl border font-mono outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Balance Type
                    </label>
                    <select
                      value={formState.balance_type || 'Cr'}
                      onChange={(e) => setFormState({ ...formState, balance_type: e.target.value as 'Cr' | 'Dr' })}
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden cursor-pointer ${
                        isDark ? 'bg-[#0f172a] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="Cr">Cr - Payable (आपण पुरवठादारास देणे / We owe)</option>
                      <option value="Dr">Dr - Receivable / Advance (आगाऊ रक्कम दिली / Advance)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Pure Gold Balance Due (Fine Grams)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={formState.opening_balance_gold_fine_gm || 0}
                      onChange={(e) => setFormState({ ...formState, opening_balance_gold_fine_gm: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g. 125.450"
                      className={`w-full px-3 py-2 rounded-xl border font-mono outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Fine 999 gold weight balance with this bullion dealer/karigar
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Pure Silver Balance Due (Fine Grams)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={formState.opening_balance_silver_fine_gm || 0}
                      onChange={(e) => setFormState({ ...formState, opening_balance_silver_fine_gm: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g. 2450.000"
                      className={`w-full px-3 py-2 rounded-xl border font-mono outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Credit Limit (₹)
                    </label>
                    <input
                      type="number"
                      value={formState.credit_limit || 0}
                      onChange={(e) => setFormState({ ...formState, credit_limit: parseFloat(e.target.value) || 0 })}
                      className={`w-full px-3 py-2 rounded-xl border font-mono outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Credit Period (Days)
                    </label>
                    <input
                      type="number"
                      value={formState.credit_days || 0}
                      onChange={(e) => setFormState({ ...formState, credit_days: parseInt(e.target.value, 10) || 0 })}
                      className={`w-full px-3 py-2 rounded-xl border font-mono outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1">
                      Internal Remarks & Trade Notes
                    </label>
                    <textarea
                      rows={2}
                      value={formState.notes || ''}
                      onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                      placeholder="e.g. Primary bullion dealer for 24K bars, delivers within 2 hours of booking"
                      className={`w-full px-3 py-2 rounded-xl border outline-hidden ${
                        isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Form Bottom Action Controls */}
              <div className={`pt-4 border-t flex items-center justify-between shrink-0 ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {activeFormTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeFormTab === 'balance') setActiveFormTab('bank');
                        else if (activeFormTab === 'bank') setActiveFormTab('gst');
                        else if (activeFormTab === 'gst') setActiveFormTab('basic');
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 font-medium cursor-pointer"
                    >
                      &larr; Previous Step
                    </button>
                  )}
                  {activeFormTab !== 'balance' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeFormTab === 'basic') setActiveFormTab('gst');
                        else if (activeFormTab === 'gst') setActiveFormTab('bank');
                        else if (activeFormTab === 'bank') setActiveFormTab('balance');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 font-bold cursor-pointer"
                    >
                      Next Step &rarr;
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold shadow-md flex items-center space-x-1.5 cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Vendor Master</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
