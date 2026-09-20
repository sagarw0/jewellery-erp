import React, { useState } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Lock,
  Unlock,
  Check,
  X,
  Search,
  Building2,
  Phone,
  Mail,
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { UserRole, BranchId, AuthUser } from '../../types/erp';
import { ROLE_NAV_PERMISSIONS, BRANCHES_CONFIG } from '../layout/Navbar';

export interface ManagedUser extends AuthUser {
  email?: string;
  phone?: string;
  status: 'Active' | 'Suspended';
  lastActive?: string;
  isOwner?: boolean;
}

export const INITIAL_STAFF_USERS: ManagedUser[] = [
  {
    code: 'OWNER-01',
    name: 'Sagar Wadkar',
    role: 'Owner',
    branch: 'Mumbai Flagship Showroom (HM-916-MH-4421)',
    branchId: 'all',
    email: 'sagar@ogaworld.in',
    phone: '+91 98200 11223',
    status: 'Active',
    lastActive: 'Active Now',
    isOwner: true,
  },
  {
    code: 'MGR-201',
    name: 'Pravin Shah',
    role: 'Manager',
    branch: 'Mumbai Flagship Showroom (HM-916-MH-4421)',
    branchId: 'mumbai',
    email: 'pravin.shah@ogaworld.in',
    phone: '+91 98190 22334',
    status: 'Active',
    lastActive: '10 mins ago',
    isOwner: false,
  },
  {
    code: 'CASH-101',
    name: 'Ramesh Kulkarni',
    role: 'Cashier',
    branch: 'Mumbai Flagship Showroom (HM-916-MH-4421)',
    branchId: 'mumbai',
    email: 'ramesh.cash@ogaworld.in',
    phone: '+91 98201 33445',
    status: 'Active',
    lastActive: '5 mins ago',
    isOwner: false,
  },
  {
    code: 'ACCT-301',
    name: 'Sunil Agrawal',
    role: 'Accountant',
    branch: 'Mumbai Flagship Showroom (HM-916-MH-4421)',
    branchId: 'mumbai',
    email: 'sunil.acct@ogaworld.in',
    phone: '+91 98212 44556',
    status: 'Active',
    lastActive: '1 hour ago',
    isOwner: false,
  },
  {
    code: 'KARA-401',
    name: 'Govind Soni',
    role: 'Karagir',
    branch: 'Central Workshop Unit (HM-916-WS-01)',
    branchId: 'mumbai',
    email: 'govind.karagir@ogaworld.in',
    phone: '+91 98330 55667',
    status: 'Active',
    lastActive: '30 mins ago',
    isOwner: false,
  },
  {
    code: 'CASH-102',
    name: 'Priya Deshmukh',
    role: 'Cashier',
    branch: 'Pune Camp Showroom (HM-916-PN-1102)',
    branchId: 'pune',
    email: 'priya.pune@ogaworld.in',
    phone: '+91 98450 66778',
    status: 'Active',
    lastActive: '2 hours ago',
    isOwner: false,
  },
  {
    code: 'MGR-202',
    name: 'Amit Patil',
    role: 'Manager',
    branch: 'Thane West Luxury Boutique (HM-916-TH-8833)',
    branchId: 'thane',
    email: 'amit.thane@ogaworld.in',
    phone: '+91 98670 77889',
    status: 'Active',
    lastActive: 'Yesterday',
    isOwner: false,
  },
];

interface UserRoleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  usersList: ManagedUser[];
  onUpdateUserRole: (userCode: string, newRole: UserRole) => void;
  onAddNewUser?: (user: ManagedUser) => void;
  onSwitchUser?: (user: ManagedUser) => void;
}

const ROLE_DEFINITIONS: Record<
  UserRole,
  {
    badgeClass: string;
    description: string;
    allowedModules: string;
    level: string;
  }
> = {
  Owner: {
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    description: 'Full Unrestricted Access across all 11 ERP modules & all showroom branches',
    allowedModules: 'All 11 Modules (Masters, Transactions, Accounts, Stock, Schemes, Backup, Settings, etc.)',
    level: 'Root Administrator (Protected)',
  },
  Manager: {
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    description: 'Showroom branch management, stock audits, price approvals, and sales operations',
    allowedModules: 'Dashboard, Masters, Transactions, Accounts, Stock, Reports, Schemes, Messenger',
    level: 'Executive Staff',
  },
  Cashier: {
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    description: 'Front-desk POS billing counter, customer receipts, and daily cash drawer reconciliation',
    allowedModules: 'Dashboard, Sales POS Invoicing (F4), Day Book, Gold Scheme, Messenger',
    level: 'Point of Sale Staff',
  },
  Accountant: {
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    description: 'Financial accounting, voucher entries, GST tax audits, and supplier ledger reconciliation',
    allowedModules: 'Dashboard, Transactions, Accounts Ledger (F8/F10), Day Book, Reports, Messenger',
    level: 'Finance Staff',
  },
  Karagir: {
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
    description: 'Workshop job cards, fine metal weight issue/receipt, melting recovery, and refinery',
    allowedModules: 'Workshop Orders (F5), Karagir Receive, Refinery In, Stock Vault, Messenger',
    level: 'Goldsmith / Artisan Staff',
  },
};

export const UserRoleManagementModal: React.FC<UserRoleManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  usersList,
  onUpdateUserRole,
  onAddNewUser,
  onSwitchUser,
}) => {
  const { isDark, computedTokens } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // New Employee Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Cashier');
  const [newBranchId, setNewBranchId] = useState<BranchId>('mumbai');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  if (!isOpen) return null;

  const isCurrentOwner = currentUser?.role === 'Owner' || currentUser?.code === 'OWNER-01';

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.phone && u.phone.includes(searchTerm));
    const matchesBranch = branchFilter === 'all' || u.branchId === branchFilter;
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesBranch && matchesRole;
  });

  const handleRoleSelect = (user: ManagedUser, selectedRole: UserRole) => {
    // PROTECTED OWNER CHECK
    if (user.isOwner || user.code === 'OWNER-01') {
      setFeedbackMsg('⚠️ Action Blocked: The Owner role is permanently protected and cannot be changed.');
      setTimeout(() => setFeedbackMsg(null), 3500);
      return;
    }

    onUpdateUserRole(user.code, selectedRole);
    setFeedbackMsg(`✓ Role updated: ${user.name} is now assigned as "${selectedRole}".`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;

    const selectedBranchObj = BRANCHES_CONFIG.find((b) => b.id === newBranchId);
    const newUser: ManagedUser = {
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      role: newRole,
      branch: selectedBranchObj?.label || 'Mumbai Flagship Showroom',
      branchId: newBranchId,
      phone: newPhone.trim(),
      email: newEmail.trim(),
      status: 'Active',
      lastActive: 'Just Created',
      isOwner: false,
    };

    if (onAddNewUser) onAddNewUser(newUser);
    setShowAddForm(false);
    setNewName('');
    setNewCode('');
    setNewPhone('');
    setNewEmail('');
    setFeedbackMsg(`✓ New employee ${newUser.name} (${newUser.role}) successfully created.`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-5xl rounded-3xl border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden ${
          isDark
            ? 'bg-[#0a0f1d]/95 border-white/15 text-white backdrop-blur-2xl'
            : 'bg-white/98 border-slate-200 text-slate-900 backdrop-blur-2xl'
        }`}
      >
        {/* Header Strip */}
        <div
          className={`p-5 sm:p-6 border-b flex items-start justify-between gap-4 ${
            isDark ? 'border-white/10 bg-[#0f172a]/70' : 'border-slate-200 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center space-x-3.5">
            <div
              className={`p-3 rounded-2xl border flex items-center justify-center shadow-xs ${
                isDark
                  ? 'bg-amber-400/15 border-amber-400/30 text-amber-300'
                  : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}
            >
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-lg font-black tracking-tight">
                  Employee Role & Access Management (RBAC)
                </h2>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    isDark
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                      : 'bg-amber-100 text-amber-950 border-amber-300'
                  }`}
                >
                  Owner Console
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                As Showroom Owner, review all employee accounts, assign granular role permissions, and test role perspectives.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isCurrentOwner && !showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Employee</span>
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div
            className={`px-5 py-2.5 border-b text-xs font-bold flex items-center justify-between animate-in fade-in duration-150 ${
              feedbackMsg.includes('Blocked')
                ? 'bg-rose-500/15 border-rose-400/30 text-rose-300'
                : 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300'
            }`}
          >
            <span>{feedbackMsg}</span>
            <button onClick={() => setFeedbackMsg(null)} className="text-xs opacity-60 hover:opacity-100">
              ✕
            </button>
          </div>
        )}

        {/* Owner Security Guarantee Notice */}
        <div
          className={`px-5 py-3 border-b flex items-center space-x-3 text-xs ${
            isDark ? 'bg-amber-400/5 border-white/10 text-amber-200' : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="leading-tight">
            <span className="font-extrabold">Owner Role Protection Active:</span> The showroom Owner role (
            <span className="font-mono font-bold">OWNER-01 / Sagar Wadkar</span>) is permanently locked and cannot be demoted or changed. All other staff roles can be modified below.
          </div>
        </div>

        {/* Add Employee Form Drawer (Collapsible) */}
        {showAddForm && (
          <form
            onSubmit={handleCreateUser}
            className={`p-4 border-b animate-in slide-in-from-top-2 duration-200 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100/80 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold flex items-center space-x-1.5 text-blue-500">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register New Showroom Employee</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs">
              <div>
                <label className="block text-[10.5px] font-bold opacity-75 mb-1">Employee Code *</label>
                <input
                  type="text"
                  placeholder="e.g. CASH-105"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  required
                  className={`w-full px-2.5 py-1.5 rounded-lg border font-mono font-bold text-xs ${
                    isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10.5px] font-bold opacity-75 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="Employee Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className={`w-full px-2.5 py-1.5 rounded-lg border font-semibold text-xs ${
                    isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold opacity-75 mb-1">Assigned Role *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className={`w-full px-2 py-1.5 rounded-lg border font-bold text-xs ${
                    isDark ? 'bg-slate-900 border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Cashier">Cashier</option>
                  <option value="Manager">Manager</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Karagir">Karagir</option>
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold opacity-75 mb-1">Branch *</label>
                <select
                  value={newBranchId}
                  onChange={(e) => setNewBranchId(e.target.value as BranchId)}
                  className={`w-full px-2 py-1.5 rounded-lg border font-semibold text-xs ${
                    isDark ? 'bg-slate-900 border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="mumbai">Mumbai Flagship</option>
                  <option value="pune">Pune Camp</option>
                  <option value="thane">Thane Boutique</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                >
                  Save Employee
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Filter & Search Bar */}
        <div
          className={`p-3.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50/50 border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2 flex-1 min-w-[220px]">
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border flex-1 ${
                isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 opacity-50" />
              <input
                type="text"
                placeholder="Search staff by name, code, phone, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-hidden w-full text-xs placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Branch Filter */}
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold ${
                isDark ? 'bg-slate-900 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="all">All Branches</option>
              <option value="mumbai">Mumbai</option>
              <option value="pune">Pune</option>
              <option value="thane">Thane</option>
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold ${
                isDark ? 'bg-slate-900 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="all">All Roles</option>
              <option value="Owner">Owner</option>
              <option value="Manager">Manager</option>
              <option value="Cashier">Cashier</option>
              <option value="Accountant">Accountant</option>
              <option value="Karagir">Karagir</option>
            </select>
          </div>
        </div>

        {/* Users List Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredUsers.map((user) => {
            const isUserOwner = user.isOwner || user.code === 'OWNER-01';
            const roleInfo = ROLE_DEFINITIONS[user.role] || ROLE_DEFINITIONS['Cashier'];
            const isSelf = currentUser?.code === user.code;

            return (
              <div
                key={user.code}
                className={`p-4 rounded-2xl border transition-all ${
                  isUserOwner
                    ? isDark
                      ? 'bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border-amber-500/30'
                      : 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : isDark
                    ? 'bg-white/[0.04] hover:bg-white/[0.06] border-white/10'
                    : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* User Profile Column */}
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border shadow-xs ${
                        isUserOwner
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 border-amber-300'
                          : user.role === 'Manager'
                          ? 'bg-blue-600 text-white border-blue-400'
                          : user.role === 'Cashier'
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : user.role === 'Accountant'
                          ? 'bg-purple-600 text-white border-purple-400'
                          : 'bg-orange-600 text-white border-orange-400'
                      }`}
                    >
                      {user.name.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h4 className="font-black text-sm">{user.name}</h4>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white/10 font-bold border border-white/15">
                          {user.code}
                        </span>
                        {isUserOwner && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center space-x-1 shadow-2xs">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Owner (Primary)</span>
                          </span>
                        )}
                        {isSelf && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                            You
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1 flex-wrap gap-y-1">
                        <span className="flex items-center space-x-1">
                          <Building2 className="w-3 h-3 opacity-70" />
                          <span className="truncate">{user.branch}</span>
                        </span>
                        {user.phone && (
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 opacity-70" />
                            <span>{user.phone}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Role Assignment Controls */}
                  <div className="flex items-center space-x-3 self-end md:self-center flex-wrap gap-2">
                    {/* Role Dropdown / Lock badge */}
                    <div className="text-right">
                      {isUserOwner ? (
                        <div
                          className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center space-x-1.5 cursor-not-allowed ${
                            isDark
                              ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                              : 'bg-amber-100 border-amber-300 text-amber-950'
                          }`}
                          title="The Owner role is permanently locked to prevent accidental lockouts."
                        >
                          <Lock className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
                          <span>Owner (Role Locked)</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Assign Role:</span>
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleSelect(user, e.target.value as UserRole)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold cursor-pointer transition-all ${
                              user.role === 'Manager'
                                ? isDark ? 'bg-blue-600/20 border-blue-400 text-blue-300' : 'bg-blue-100 border-blue-300 text-blue-950'
                                : user.role === 'Cashier'
                                ? isDark ? 'bg-emerald-600/20 border-emerald-400 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-950'
                                : user.role === 'Accountant'
                                ? isDark ? 'bg-purple-600/20 border-purple-400 text-purple-300' : 'bg-purple-100 border-purple-300 text-purple-950'
                                : isDark ? 'bg-orange-600/20 border-orange-400 text-orange-300' : 'bg-orange-100 border-orange-300 text-orange-950'
                            }`}
                          >
                            <option value="Cashier">Cashier (POS & Daybook)</option>
                            <option value="Manager">Manager (Masters & Stock)</option>
                            <option value="Accountant">Accountant (Ledger & Reports)</option>
                            <option value="Karagir">Karagir (Workshop Job Cards)</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Switch / Test Login Perspective Button (for Owner) */}
                    {onSwitchUser && !isSelf && (
                      <button
                        onClick={() => {
                          onSwitchUser(user);
                          onClose();
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                          isDark
                            ? 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/20'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                        title={`View ERP perspective as ${user.name} (${user.role})`}
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Test Role</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Permissions Breakdown Preview */}
                <div
                  className={`mt-3 pt-2.5 border-t text-[11px] flex items-center justify-between gap-2 flex-wrap ${
                    isDark ? 'border-white/10 text-slate-400' : 'border-slate-100 text-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold">Privileges:</span>
                    <span className="italic">{roleInfo.allowedModules}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono opacity-70">Last seen: {user.lastActive}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">No employees found matching filter</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className={`p-4 border-t flex items-center justify-between text-xs ${
            isDark ? 'bg-[#0f172a]/70 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="font-mono">Total Showroom Staff: {usersList.length} Active Accounts</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
