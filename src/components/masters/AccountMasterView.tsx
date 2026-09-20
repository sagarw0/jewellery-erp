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
import { useTheme } from '../../context/ThemeContext';

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
  const { currentTheme, isDark } = useTheme();
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
      <div className={`border rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm transition-all ${
        isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/80 text-slate-800'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg border ${
            isDark ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' : 'bg-blue-50 text-blue-600 border-blue-200'
          }`}>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Account Master</h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Account Code, Group classification, Opening balances, and Card Charge surcharges (% Customer, % For Us).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 flex-wrap">
          <button
            onClick={handleNew}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              isDark
                ? 'bg-white/10 text-white border-white/15 hover:bg-white/20'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Plus className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
            <span>New (Alt+N)</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center space-x-1 px-4 py-1.5 rounded-lg text-xs font-bold shadow transition-all cursor-pointer ${
              isDark
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-bold'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <span>Save (Alt+S)</span>
          </button>

          <button
            onClick={handleDelete}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              isDark
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className={`p-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              isDark
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
            title="Field Help"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-200 cursor-pointer">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Form & Account Directory */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Searchable Directory */}
        <div className={`md:col-span-4 border rounded-xl p-4 shadow-sm space-y-3 transition-all ${
          isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/80 text-slate-800'
        }`}>
          <div className="relative">
            <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search account code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs outline-hidden border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/15 text-white placeholder-slate-500 focus:border-amber-400 focus:bg-white/10'
                  : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500'
              }`}
            />
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredAccounts.map((acc) => (
              <div
                key={acc.account_code}
                onClick={() => handleSelectAccount(acc)}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all text-xs ${
                  selectedCode === acc.account_code
                    ? isDark
                      ? 'bg-amber-400/20 border-amber-400/50 text-white shadow-2xs'
                      : 'bg-blue-50/80 border-blue-400 text-blue-900 shadow-2xs'
                    : isDark
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                    : 'bg-slate-50/50 border-slate-200/70 hover:bg-sky-50/40 text-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{acc.account_name}</span>
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                    isDark
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                      : 'bg-sky-100 text-blue-700 border-sky-200'
                  }`}>
                    {acc.account_code}
                  </span>
                </div>
                <div className={`flex justify-between items-center text-[10px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>{acc.account_group}</span>
                  <span className={`font-mono font-semibold ${isDark ? 'text-amber-300' : 'text-slate-700'}`}>
                    {formatCurrency(acc.opening_balance)} {acc.balance_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Master Fields Form */}
        <div className={`md:col-span-8 border rounded-xl p-5 shadow-sm space-y-4 transition-all ${
          isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/80 text-slate-800'
        }`}>
          <div className={`border-b pb-2 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
            <span className={`font-bold text-xs uppercase tracking-wider ${
              isDark ? 'text-amber-300' : 'text-blue-900'
            }`}>
              Account Master Details
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Account Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.account_code}
                onChange={(e) => setFormData({ ...formData, account_code: e.target.value })}
                className={`w-full px-3 py-1.5 rounded-lg font-mono font-bold border outline-hidden ${
                  isDark
                    ? 'bg-white/5 border-white/15 text-amber-300 focus:border-amber-400'
                    : 'bg-slate-50 border-slate-300 text-blue-800 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Account Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.account_name}
                onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                className={`w-full px-3 py-1.5 rounded-lg font-semibold border outline-hidden ${
                  isDark
                    ? 'bg-white/5 border-white/15 text-white focus:border-amber-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Account Type
              </label>
              <select
                value={formData.account_type}
                onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                className={`w-full px-3 py-1.5 rounded-lg border outline-hidden ${
                  isDark
                    ? 'bg-[#0f172a] border-white/15 text-white focus:border-amber-400'
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-blue-500'
                }`}
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
              <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Account Group
              </label>
              <select
                value={formData.account_group}
                onChange={(e) => setFormData({ ...formData, account_group: e.target.value })}
                className={`w-full px-3 py-1.5 rounded-lg border outline-hidden ${
                  isDark
                    ? 'bg-[#0f172a] border-white/15 text-white focus:border-amber-400'
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-blue-500'
                }`}
              >
                {ACCOUNT_GROUPS.map((grp) => (
                  <option key={grp} value={grp}>
                    {grp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Opening Balance (₹)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.opening_balance}
                  onChange={(e) => setFormData({ ...formData, opening_balance: parseFloat(e.target.value) || 0 })}
                  className={`w-2/3 px-3 py-1.5 rounded-lg font-mono text-right border outline-hidden ${
                    isDark
                      ? 'bg-white/5 border-white/15 text-white focus:border-amber-400'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500'
                  }`}
                />
                <select
                  value={formData.balance_type}
                  onChange={(e) => setFormData({ ...formData, balance_type: e.target.value as 'Dr' | 'Cr' })}
                  className={`w-1/3 px-2 py-1.5 rounded-lg font-bold border outline-hidden ${
                    isDark
                      ? 'bg-[#0f172a] border-white/15 text-amber-300 focus:border-amber-400'
                      : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-blue-500'
                  }`}
                >
                  <option value="Dr">Dr</option>
                  <option value="Cr">Cr</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card Charges Box (Spec #4) */}
          <div className={`p-4 rounded-xl space-y-3 text-xs border transition-all ${
            isDark
              ? 'bg-white/5 border-white/10 text-white'
              : 'bg-sky-50/60 border-sky-200 text-slate-900'
          }`}>
            <span className={`font-bold uppercase tracking-wider block flex items-center space-x-1.5 ${
              isDark ? 'text-amber-300' : 'text-blue-900'
            }`}>
              <Percent className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-blue-600'}`} />
              <span>Card Charges Configuration (Spec #4)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-[11px] mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  For Customer in %
                </label>
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
                  className={`w-full px-3 py-1.5 rounded-lg font-mono text-right border outline-hidden ${
                    isDark
                      ? 'bg-white/5 border-white/15 text-white focus:border-amber-400'
                      : 'bg-white border-slate-300 text-slate-800 focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  For Us in %
                </label>
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
                  className={`w-full px-3 py-1.5 rounded-lg font-mono text-right border outline-hidden ${
                    isDark
                      ? 'bg-white/5 border-white/15 text-white focus:border-amber-400'
                      : 'bg-white border-slate-300 text-slate-800 focus:border-blue-500'
                  }`}
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
