import React, { useState, useMemo } from 'react';
import { Karagir, KaragirSpecialty } from '../../types/erp';
import {
  Hammer,
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
  FileText,
  BadgePercent,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  Calendar,
  Eye
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { useTheme } from '../../context/ThemeContext';

interface KaragirMasterViewProps {
  karagirs: Karagir[];
  onSaveKaragir: (karagir: Karagir) => void;
  onDeleteKaragir: (id: string) => void;
  onClose: () => void;
  onNavigateToOrderBooking?: (karagir: Karagir) => void;
}

const KARAGIR_SPECIALTIES: KaragirSpecialty[] = [
  'Mangalsutra & Antique Filigree',
  'Bangles, Kada & CNC Machine',
  'Nakas, Temple Jewellery & Choker',
  'Casting Rings, Solitaires & Studs',
  'Micro-Prong Setting & Rhodium',
  'Plain Gold Chains & Kolhapuri Saaj',
  'Silver Articles & Utensils',
  'Diamond Setting Specialist',
  'General Goldsmith',
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
  '36': 'Telangana (36)',
  '23': 'Madhya Pradesh (23)',
  '32': 'Kerala (32)',
};

export const KaragirMasterView: React.FC<KaragirMasterViewProps> = ({
  karagirs,
  onSaveKaragir,
  onDeleteKaragir,
  onClose,
  onNavigateToOrderBooking,
}) => {
  const { currentTheme, isDark } = useTheme();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKaragir, setEditingKaragir] = useState<Karagir | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'workshop' | 'rates' | 'balance'>('profile');

  // Delete Confirmation Modal
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Karagir>>({
    karagir_code: '',
    karagir_name: '',
    contact_person: '',
    phone: '',
    email: '',
    specialty: 'Mangalsutra & Antique Filigree',
    workshop_name: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra (27)',
    pincode: '',
    pan_no: '',
    gstin: '',
    default_making_rate_per_gm: 350,
    default_wastage_pct: 1.2,
    opening_balance_gold_fine_gm: 0,
    opening_balance_silver_fine_gm: 0,
    opening_balance_cash: 0,
    balance_type: 'Cr',
    bank_name: '',
    bank_account_no: '',
    ifsc_code: '',
    branch_name: '',
    active_jobs_count: 0,
    status: 'Active',
    notes: '',
  });

  // Filtered Karagirs
  const filteredKaragirs = useMemo(() => {
    return karagirs.filter((k) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        k.karagir_name.toLowerCase().includes(q) ||
        k.karagir_code.toLowerCase().includes(q) ||
        (k.contact_person && k.contact_person.toLowerCase().includes(q)) ||
        (k.workshop_name && k.workshop_name.toLowerCase().includes(q)) ||
        k.phone.includes(q) ||
        k.city.toLowerCase().includes(q) ||
        k.specialty.toLowerCase().includes(q);

      const matchSpecialty = selectedSpecialty === 'All' || k.specialty === selectedSpecialty;
      const matchStatus = selectedStatus === 'All' || k.status === selectedStatus;

      return matchSearch && matchSpecialty && matchStatus;
    });
  }, [karagirs, searchQuery, selectedSpecialty, selectedStatus]);

  // Executive KPI Aggregations
  const kpis = useMemo(() => {
    const totalActive = karagirs.filter((k) => k.status === 'Active').length;
    const totalGoldDue = karagirs.reduce((sum, k) => sum + (k.opening_balance_gold_fine_gm || 0), 0);
    const totalSilverDue = karagirs.reduce((sum, k) => sum + (k.opening_balance_silver_fine_gm || 0), 0);
    const totalCashPayable = karagirs
      .filter((k) => k.balance_type === 'Cr')
      .reduce((sum, k) => sum + (k.opening_balance_cash || 0), 0);
    const totalCashAdvance = karagirs
      .filter((k) => k.balance_type === 'Dr')
      .reduce((sum, k) => sum + (k.opening_balance_cash || 0), 0);
    const totalActiveJobs = karagirs.reduce((sum, k) => sum + (k.active_jobs_count || 0), 0);

    return {
      totalActive,
      totalCount: karagirs.length,
      totalGoldDue,
      totalSilverDue,
      totalCashPayable,
      totalCashAdvance,
      netCashBalance: totalCashPayable - totalCashAdvance,
      totalActiveJobs,
    };
  }, [karagirs]);

  // Auto-generate Next Karagir Code
  const getNextKaragirCode = () => {
    const numbers = karagirs
      .map((k) => {
        const match = k.karagir_code.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 100;
    return `KARA-${maxNum + 1}`;
  };

  const handleOpenAddModal = () => {
    setEditingKaragir(null);
    setFormData({
      id: `kara-${Date.now()}`,
      karagir_code: getNextKaragirCode(),
      karagir_name: '',
      contact_person: '',
      phone: '+91 ',
      email: '',
      specialty: 'Mangalsutra & Antique Filigree',
      workshop_name: '',
      address: '',
      city: 'Mumbai',
      state: 'Maharashtra (27)',
      pincode: '',
      pan_no: '',
      gstin: '',
      default_making_rate_per_gm: 350,
      default_wastage_pct: 1.2,
      opening_balance_gold_fine_gm: 0,
      opening_balance_silver_fine_gm: 0,
      opening_balance_cash: 0,
      balance_type: 'Cr',
      bank_name: '',
      bank_account_no: '',
      ifsc_code: '',
      branch_name: '',
      active_jobs_count: 0,
      status: 'Active',
      notes: '',
      created_at: new Date().toISOString().slice(0, 10),
    });
    setActiveTab('profile');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (karagir: Karagir) => {
    setEditingKaragir(karagir);
    setFormData({ ...karagir });
    setActiveTab('profile');
    setIsModalOpen(true);
  };

  const handleGstinChange = (gstinVal: string) => {
    const upper = gstinVal.toUpperCase().trim();
    let stateVal = formData.state || 'Maharashtra (27)';

    if (upper.length >= 2) {
      const code = upper.slice(0, 2);
      if (GST_STATE_CODES[code]) {
        stateVal = GST_STATE_CODES[code];
      }
    }

    let panVal = formData.pan_no || '';
    if (upper.length >= 12) {
      panVal = upper.slice(2, 12);
    }

    setFormData((prev) => ({
      ...prev,
      gstin: upper,
      state: stateVal,
      pan_no: panVal,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.karagir_name?.trim()) {
      alert('Artisan / Karagir Name is required.');
      return;
    }
    if (!formData.phone?.trim()) {
      alert('Contact Phone number is required.');
      return;
    }

    const karagirToSave: Karagir = {
      id: formData.id || editingKaragir?.id || `kara-${Date.now()}`,
      karagir_code: formData.karagir_code || getNextKaragirCode(),
      karagir_name: formData.karagir_name.trim(),
      contact_person: formData.contact_person?.trim() || '',
      phone: formData.phone.trim(),
      email: formData.email?.trim() || '',
      specialty: formData.specialty || 'General Goldsmith',
      workshop_name: formData.workshop_name?.trim() || '',
      address: formData.address?.trim() || '',
      city: formData.city?.trim() || 'Mumbai',
      state: formData.state || 'Maharashtra (27)',
      pincode: formData.pincode?.trim() || '',
      pan_no: formData.pan_no?.toUpperCase().trim() || '',
      gstin: formData.gstin?.toUpperCase().trim() || '',
      default_making_rate_per_gm: Number(formData.default_making_rate_per_gm || 0),
      default_wastage_pct: Number(formData.default_wastage_pct || 0),
      opening_balance_gold_fine_gm: Number(formData.opening_balance_gold_fine_gm || 0),
      opening_balance_silver_fine_gm: Number(formData.opening_balance_silver_fine_gm || 0),
      opening_balance_cash: Number(formData.opening_balance_cash || 0),
      balance_type: formData.balance_type || 'Cr',
      bank_name: formData.bank_name?.trim() || '',
      bank_account_no: formData.bank_account_no?.trim() || '',
      ifsc_code: formData.ifsc_code?.toUpperCase().trim() || '',
      branch_name: formData.branch_name?.trim() || '',
      active_jobs_count: Number(formData.active_jobs_count || 0),
      status: formData.status || 'Active',
      notes: formData.notes?.trim() || '',
      created_at: formData.created_at || new Date().toISOString().slice(0, 10),
    };

    onSaveKaragir(karagirToSave);
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = [
      'Karagir Code',
      'Artisan Name',
      'Specialty',
      'Workshop Name',
      'Contact Person',
      'Phone',
      'Email',
      'City',
      'State',
      'GSTIN',
      'PAN',
      'Making Rate (₹/g)',
      'Wastage %',
      'Fine Gold Bal (g)',
      'Fine Silver Bal (g)',
      'Cash Balance (₹)',
      'Balance Type',
      'Active Jobs',
      'Status',
    ];

    const rows = filteredKaragirs.map((k) => [
      k.karagir_code,
      `"${k.karagir_name}"`,
      `"${k.specialty}"`,
      `"${k.workshop_name || ''}"`,
      `"${k.contact_person || ''}"`,
      k.phone,
      k.email || '',
      k.city,
      `"${k.state}"`,
      k.gstin || '',
      k.pan_no || '',
      k.default_making_rate_per_gm,
      k.default_wastage_pct,
      k.opening_balance_gold_fine_gm || 0,
      k.opening_balance_silver_fine_gm || 0,
      k.opening_balance_cash,
      k.balance_type,
      k.active_jobs_count || 0,
      k.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Karagir_Master_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className={`p-5 rounded-2xl ${currentTheme.cardBg} ${currentTheme.cardBorder} border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-bold shadow-md">
            <Hammer className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-slate-950 tracking-tight">
                Karagir & Artisan Master
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-400 shadow-2xs">
                कारागीर व कारागिरी व्यवस्थापन
              </span>
            </div>
            <p className="text-xs text-slate-700 font-semibold mt-0.5">
              Manage artisan profiles, craft specialties, labor making rates (₹/g), standard wastage %, and live fine gold metal accounts.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-900 hover:bg-slate-50 shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-700" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${currentTheme.primaryBtn} shadow-md hover:shadow-lg flex items-center space-x-1.5 transition-all cursor-pointer`}
          >
            <Plus className="w-4 h-4" />
            <span>+ New Karagir</span>
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Artisans */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-600 block uppercase tracking-wider">
              Active Karagirs
            </span>
            <div className="text-2xl font-black text-slate-950 mt-1">
              {kpis.totalActive}
              <span className="text-xs font-semibold text-slate-500 ml-1">/ {kpis.totalCount} total</span>
            </div>
            <span className="text-[11px] text-emerald-800 font-bold flex items-center space-x-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available for Job Work</span>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-100 text-blue-900 border border-blue-200">
            <Hammer className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Fine Gold in Job Work */}
        <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-900 block uppercase tracking-wider">
              Fine Gold in Workshop
            </span>
            <div className="text-2xl font-black text-amber-950 font-mono mt-1">
              {formatWeight(kpis.totalGoldDue)}g
            </div>
            <span className="text-[11px] text-amber-800 font-semibold">
              ≈ {(kpis.totalGoldDue / 11.664).toFixed(2)} tolas 24K metal
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-100 text-amber-950 border border-amber-300">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Labor / Making Dues */}
        <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              Labor / Making Dues
            </span>
            <div className="text-2xl font-black text-slate-950 font-mono mt-1">
              {formatCurrency(kpis.totalCashPayable)}
            </div>
            <span className="text-[11px] text-emerald-800 font-bold">
              Net Payable: {formatCurrency(kpis.netCashBalance)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-300">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Active Job Orders */}
        <div className="p-4 rounded-xl bg-white border border-indigo-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-900 block uppercase tracking-wider">
              In-Progress Job Cards
            </span>
            <div className="text-2xl font-black text-indigo-950 font-mono mt-1">
              {kpis.totalActiveJobs} Jobs
            </div>
            <span className="text-[11px] text-indigo-800 font-semibold">
              Active custom bridal orders
            </span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-100 text-indigo-950 border border-indigo-300">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] max-w-md relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Karagir name, code, workshop, specialty, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Specialty Filter */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-bold">
            <Filter className="w-3.5 h-3.5 text-slate-600" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="All">All Crafts / Specialties</option>
              {KARAGIR_SPECIALTIES.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Karagirs Directory Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white font-bold border-b border-slate-700 text-[11px] uppercase tracking-wider">
                <th className="p-3.5 whitespace-nowrap text-slate-200">Code</th>
                <th className="p-3.5 whitespace-nowrap text-slate-200">Artisan & Workshop</th>
                <th className="p-3.5 whitespace-nowrap text-slate-200">Specialty & Craft</th>
                <th className="p-3.5 whitespace-nowrap text-slate-200">Making Rate & Wastage</th>
                <th className="p-3.5 whitespace-nowrap text-slate-200">Contact & City</th>
                <th className="p-3.5 text-right whitespace-nowrap text-slate-200">Fine Gold Bal</th>
                <th className="p-3.5 text-right whitespace-nowrap text-slate-200">Labor Due (₹)</th>
                <th className="p-3.5 text-center whitespace-nowrap text-slate-200">Active Jobs</th>
                <th className="p-3.5 text-center whitespace-nowrap text-slate-200">Status</th>
                <th className="p-3.5 text-center whitespace-nowrap text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-sans">
              {filteredKaragirs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
                    <p className="font-bold text-slate-700">No Karagirs found matching your search.</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Try resetting filters or add a new Karagir.</p>
                  </td>
                </tr>
              ) : (
                filteredKaragirs.map((k) => (
                  <tr
                    key={k.id}
                    className="hover:bg-amber-50/50 transition-colors border-b border-slate-100"
                  >
                    {/* Karagir Code */}
                    <td className="p-3.5 font-mono font-bold whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 font-black border border-amber-300 font-mono text-xs shadow-2xs inline-block">
                        {k.karagir_code}
                      </span>
                    </td>

                    {/* Name & Workshop */}
                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-950 text-xs tracking-tight">
                        {k.karagir_name}
                      </div>
                      {k.workshop_name && (
                        <div className="text-[11px] text-slate-700 font-semibold mt-0.5">
                          {k.workshop_name}
                        </div>
                      )}
                      {k.contact_person && (
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                          Person: {k.contact_person}
                        </div>
                      )}
                    </td>

                    {/* Specialty */}
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-950 border border-indigo-300 shadow-2xs inline-block">
                        {k.specialty}
                      </span>
                    </td>

                    {/* Making Rate & Wastage */}
                    <td className="p-3.5 font-mono text-xs">
                      <div className="font-extrabold text-slate-950">
                        ₹{k.default_making_rate_per_gm}/g
                      </div>
                      <div className="text-[11px] font-bold text-rose-800 mt-0.5">
                        Loss: {k.default_wastage_pct}% wastage
                      </div>
                    </td>

                    {/* Contact & Location */}
                    <td className="p-3.5">
                      <div className="font-bold text-emerald-950 font-mono text-xs flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{k.phone}</span>
                      </div>
                      <div className="text-[11px] text-slate-700 font-semibold flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-600" />
                        <span>{k.city ? `${k.city}, ${k.state.split(' ')[0]}` : k.state}</span>
                      </div>
                    </td>

                    {/* Fine Gold Bal */}
                    <td className="p-3.5 text-right font-mono whitespace-nowrap">
                      {(k.opening_balance_gold_fine_gm || 0) > 0 ? (
                        <div className="text-amber-950 font-extrabold text-xs">
                          Au: {formatWeight(k.opening_balance_gold_fine_gm)}g (24K)
                        </div>
                      ) : (
                        <span className="text-slate-500 font-medium text-xs">0.000g</span>
                      )}
                      {(k.opening_balance_silver_fine_gm || 0) > 0 && (
                        <div className="text-slate-700 font-bold text-[11px] mt-0.5">
                          Ag: {formatWeight(k.opening_balance_silver_fine_gm)}g
                        </div>
                      )}
                    </td>

                    {/* Labor Ledger Balance */}
                    <td className="p-3.5 text-right font-mono whitespace-nowrap">
                      <div className="text-amber-950 font-extrabold text-xs">
                        {formatCurrency(k.opening_balance_cash)}
                      </div>
                      <div className="text-[10px] font-bold text-slate-700">
                        {k.balance_type === 'Cr' ? '(Payable / Cr)' : '(Advance / Dr)'}
                      </div>
                    </td>

                    {/* Active Jobs */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      {(k.active_jobs_count || 0) > 0 ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-950 border border-blue-300 shadow-2xs inline-block">
                          {k.active_jobs_count} in queue
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs font-semibold">0</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-2xs inline-block ${
                        k.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                          : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}>
                        {k.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        {/* 1-Click Order Assignment Button */}
                        {onNavigateToOrderBooking && (
                          <button
                            onClick={() => onNavigateToOrderBooking(k)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs flex items-center space-x-1 cursor-pointer transition-colors"
                            title={`Book Order & Assign to ${k.karagir_name} (F7)`}
                          >
                            <Hammer className="w-3.5 h-3.5 text-emerald-200" />
                            <span className="text-[11px]">Assign (F7)</span>
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEditModal(k)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer"
                          title="Edit Karagir Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-700" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTargetId(k.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-700 border border-rose-200 cursor-pointer"
                          title="Delete Karagir"
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

      {/* Add / Edit Karagir Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className={`max-w-3xl w-full rounded-2xl ${currentTheme.cardBg} ${currentTheme.cardBorder} border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
            {/* Modal Header */}
            <div className={`p-4 ${currentTheme.headerBg} border-b border-slate-200 dark:border-slate-700 flex items-center justify-between`}>
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
                  <Hammer className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingKaragir ? `Edit Karagir: ${editingKaragir.karagir_name}` : 'Register New Karagir / Maker'}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Artisan profile, specialty, default making rate per gram, wastage %, and running metal balance.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center space-x-1 px-4 pt-2 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold bg-slate-50 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                1. Basic Profile & Specialty
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('workshop')}
                className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'workshop'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                2. Workshop & Address
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rates')}
                className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'rates'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                3. Making Rates & Wastage %
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('balance')}
                className={`px-3 py-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'balance'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                4. Metal & Cash Balances
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* TAB 1: Profile */}
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Karagir Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.karagir_code}
                      onChange={(e) => setFormData({ ...formData, karagir_code: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Artisan / Karagir Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Soni Govindbhai & Sons"
                      value={formData.karagir_name}
                      onChange={(e) => setFormData({ ...formData, karagir_name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Craft Specialty <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                    >
                      {KARAGIR_SPECIALTIES.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Person / Lead Master
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Govindbhai Soni"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98920 44556"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="artisan@workshop.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    >
                      <option value="Active">Active (Accepting Job Cards)</option>
                      <option value="Inactive">Inactive (Paused)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* TAB 2: Workshop & Address */}
              {activeTab === 'workshop' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Workshop / Unit Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Dadar Jewellery Workshop Unit 4"
                      value={formData.workshop_name}
                      onChange={(e) => setFormData({ ...formData, workshop_name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Workshop Street Address
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Room / Gala no., Building, Street, Area..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      State
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    >
                      {Object.values(GST_STATE_CODES).map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      GSTIN (If Registered)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 27AAQPS1244D1Z2"
                      value={formData.gstin}
                      onChange={(e) => handleGstinChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AAQPS1244D"
                      value={formData.pan_no}
                      onChange={(e) => setFormData({ ...formData, pan_no: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white uppercase"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: Rates & Wastage */}
              {activeTab === 'rates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 md:col-span-2">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Standard Labor Charge Presets</span>
                    </span>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                      These values will auto-populate on custom customer order job cards when this Karagir is selected.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Default Making Rate (₹ per Gram)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400">₹</span>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={formData.default_making_rate_per_gm}
                        onChange={(e) => setFormData({ ...formData, default_making_rate_per_gm: Number(e.target.value) })}
                        className="w-full pl-7 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Standard Wastage Tolerance (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={formData.default_wastage_pct}
                        onChange={(e) => setFormData({ ...formData, default_wastage_pct: Number(e.target.value) })}
                        className="w-full pr-7 pl-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-slate-400">%</span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Special Workshop Instructions & Quality Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g., Antique gheru finish preferred, laser hallmark test mandatory, strict delivery deadlines..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: Balances & Banking */}
              {activeTab === 'balance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Opening Fine Gold Balance (Grams 24K)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        placeholder="0.000"
                        value={formData.opening_balance_gold_fine_gm}
                        onChange={(e) => setFormData({ ...formData, opening_balance_gold_fine_gm: Number(e.target.value) })}
                        className="w-full pr-7 pl-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-amber-600 dark:text-amber-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-slate-400">g</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Opening Fine Silver Balance (Grams 999)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        placeholder="0.000"
                        value={formData.opening_balance_silver_fine_gm}
                        onChange={(e) => setFormData({ ...formData, opening_balance_silver_fine_gm: Number(e.target.value) })}
                        className="w-full pr-7 pl-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-600 dark:text-slate-300"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-slate-400">g</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Opening Cash / Labor Ledger Balance (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400">₹</span>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={formData.opening_balance_cash}
                        onChange={(e) => setFormData({ ...formData, opening_balance_cash: Number(e.target.value) })}
                        className="w-full pl-7 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Balance Type
                    </label>
                    <select
                      value={formData.balance_type}
                      onChange={(e) => setFormData({ ...formData, balance_type: e.target.value as 'Cr' | 'Dr' })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white"
                    >
                      <option value="Cr">Cr - Payable (We owe making charges)</option>
                      <option value="Dr">Dr - Advance (Advance cash paid)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 border-t border-slate-200 dark:border-slate-700 pt-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      Bank Details for Direct RTGS/NEFT Payouts
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC Bank Ltd"
                      value={formData.bank_name}
                      onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 50100299881122"
                      value={formData.bank_account_no}
                      onChange={(e) => setFormData({ ...formData, bank_account_no: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC0000244"
                      value={formData.ifsc_code}
                      onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dadar West"
                      value={formData.branch_name}
                      onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {activeTab !== 'profile' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'workshop') setActiveTab('profile');
                        else if (activeTab === 'rates') setActiveTab('workshop');
                        else if (activeTab === 'balance') setActiveTab('rates');
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      ← Previous
                    </button>
                  )}
                  {activeTab !== 'balance' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'profile') setActiveTab('workshop');
                        else if (activeTab === 'workshop') setActiveTab('rates');
                        else if (activeTab === 'rates') setActiveTab('balance');
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-800 dark:text-amber-300 cursor-pointer"
                    >
                      Next →
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 rounded-xl text-xs font-bold ${currentTheme.primaryBtn} shadow-md flex items-center space-x-1.5 cursor-pointer`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingKaragir ? 'Update Karagir' : 'Save Karagir'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className={`max-w-md w-full p-5 rounded-2xl ${currentTheme.cardBg} ${currentTheme.cardBorder} border shadow-2xl space-y-4`}>
            <div className="flex items-center space-x-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Karagir Record?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to remove this Karagir? All metal balances and labor transaction histories linked to this artisan will be detached.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteKaragir(deleteTargetId);
                  setDeleteTargetId(null);
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default KaragirMasterView;
