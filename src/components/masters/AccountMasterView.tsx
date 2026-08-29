import React, { useState } from 'react';
import { AccountMaster } from '../../types/erp';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  XCircle,
  HelpCircle,
  Search,
  Percent
} from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { FieldHelpModal } from '../common/FieldHelpModal';

interface AccountMasterViewProps {
  accounts: AccountMaster[];
  onSaveAccount: (account: AccountMaster) => void;
  onDeleteAccount: (accountCode: string) => void;
  onClose: () => void;
}

const ACCOUNT_GROUPS = [
  'SUNDRY DEBTORS',
  'SUNDRY CREDITORS',
  'BANK ACCOUNTS',
  'CASH-IN-HAND',
  'DUTIES & TAXES',
  'DIRECT EXPENSES',
  'INDIRECT EXPENSES',
  'DIRECT INCOMES',
  'INDIRECT INCOMES',
  'FIXED ASSETS',
  'CURRENT ASSETS',
  'CURRENT LIABILITIES',
  'CAPITAL ACCOUNT',
  'INVESTMENTS',
  'LOANS & ADVANCES',
  'MISC. EXPENSES',
];

export const AccountMasterView: React.FC<AccountMasterViewProps> = ({
  accounts,
  onSaveAccount,
  onDeleteAccount,
  onClose,
}) => {
  const [selectedCode, setSelectedCode] = useState<string>(accounts[0]?.account_code || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [formData, setFormData] = useState<AccountMaster>(
    accounts[0] || {
      account_code: 'AC-101',
      account_name: 'Shri Ganesh Jewellers Wholesale',
      account_type: 'Wholesale Buyer',
      account_group: 'SUNDRY DEBTORS',
      opening_balance: 145000,
      balance_type: 'Dr',
      card_charges: {
        card_charges: true,
        for_customer_pct: 1.5,
        for_us_pct: 0.8,
      },
    }
  );

  const handleSelectAccount = (acc: AccountMaster) => {
    setSelectedCode(acc.account_code);
    setFormData({ ...acc });
    setIsEditing(false);
  };

  const handleNew = () => {
    const newCode = `AC-${Math.floor(100 + Math.random() * 900)}`;
    setSelectedCode(newCode);
    setFormData({
      account_code: newCode,
      account_name: '',
      account_type: 'Retail Customer',
      account_group: 'SUNDRY DEBTORS',
      opening_balance: 0,
      balance_type: 'Dr',
      card_charges: {
        card_charges: false,
        for_customer_pct: 0,
        for_us_pct: 0,
      },
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.account_name.trim()) {
      alert('Please enter Account Name');
      return;
    }
    onSaveAccount(formData);
    setIsEditing(false);
    alert(`Account ${formData.account_name} (${formData.account_code}) saved successfully!`);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${formData.account_name}?`)) {
      onDeleteAccount(formData.account_code);
      if (accounts.length > 1) {
        handleSelectAccount(accounts[0]);
      }
    }
  };

  const filteredAccounts = accounts.filter(
    (a) =>
      a.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.account_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.account_group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Toolbar */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Account Master</h1>
            <p className="text-xs text-slate-500">
              Account Code, Group classification, Opening balances, and Card Charge surcharges (% Customer, % For Us).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 flex-wrap">
          <button
            onClick={handleNew}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 hover:bg-slate-200"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>New (Alt+N)</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow"
          >
            <span>Save (Alt+S)</span>
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 hover:bg-rose-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-300 hover:bg-amber-100"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Form & Account Directory */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Searchable Directory */}
        <div className="md:col-span-4 bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search account code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredAccounts.map((acc) => (
              <div
                key={acc.account_code}
                onClick={() => handleSelectAccount(acc)}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all text-xs ${
                  selectedCode === acc.account_code
                    ? 'bg-blue-50/80 border-blue-400 text-blue-900 shadow-2xs'
                    : 'bg-slate-50/50 border-slate-200/70 hover:bg-sky-50/40 text-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{acc.account_name}</span>
                  <span className="font-mono text-[10px] text-blue-700 bg-sky-100 px-1.5 py-0.5 rounded font-bold">
                    {acc.account_code}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                  <span>{acc.account_group}</span>
                  <span className="font-mono font-semibold text-slate-700">
                    {formatCurrency(acc.opening_balance)} {acc.balance_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Master Fields Form */}
        <div className="md:col-span-8 bg-white border border-sky-200/80 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="font-bold text-blue-900 text-xs uppercase tracking-wider">
              Account Master Details
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Account Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.account_code}
                onChange={(e) => setFormData({ ...formData, account_code: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-blue-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Account Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.account_name}
                onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Account Type</label>
              <select
                value={formData.account_type}
                onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="Retail Customer">Retail Customer</option>
                <option value="Wholesale Buyer">Wholesale Buyer</option>
                <option value="Bullion Dealer">Bullion Dealer</option>
                <option value="Karagir / Artisan">Karagir / Artisan</option>
                <option value="Assayer / Refinery">Assayer / Refinery</option>
                <option value="Bank">Bank</option>
                <option value="Expense Account">Expense Account</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Account Group</label>
              <select
                value={formData.account_group}
                onChange={(e) => setFormData({ ...formData, account_group: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                {ACCOUNT_GROUPS.map((grp) => (
                  <option key={grp} value={grp}>
                    {grp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Opening Balance (₹)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.opening_balance}
                  onChange={(e) => setFormData({ ...formData, opening_balance: parseFloat(e.target.value) || 0 })}
                  className="w-2/3 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-right text-slate-900"
                />
                <select
                  value={formData.balance_type}
                  onChange={(e) => setFormData({ ...formData, balance_type: e.target.value as 'Dr' | 'Cr' })}
                  className="w-1/3 px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-bold"
                >
                  <option value="Dr">Dr</option>
                  <option value="Cr">Cr</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card Charges Box (Spec #4) */}
          <div className="p-4 bg-sky-50/60 border border-sky-200 rounded-xl space-y-3 text-xs">
            <span className="font-bold text-blue-900 uppercase tracking-wider block flex items-center space-x-1.5">
              <Percent className="w-3.5 h-3.5 text-blue-600" />
              <span>Card Charges Configuration (Spec #4)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">For Customer in %</label>
                <input
                  type="number"
                  step={0.1}
                  value={formData.card_charges.for_customer_pct}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      card_charges: {
                        ...formData.card_charges,
                        for_customer_pct: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-right text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">For Us in %</label>
                <input
                  type="number"
                  step={0.1}
                  value={formData.card_charges.for_us_pct}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      card_charges: {
                        ...formData.card_charges,
                        for_us_pct: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-right text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FieldHelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        screenName="Account Master"
      />
    </div>
  );
};
