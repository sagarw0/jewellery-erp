import React, { useState } from 'react';
import {
  DebitLedgerEntry,
  CreditLedgerEntry,
  AccountMaster
} from '../../types/erp';
import {
  Users,
  Printer,
  XCircle,
  HelpCircle,
  MessageCircle,
  Columns3
} from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';
import { WhatsAppShareModal } from '../common/WhatsAppShareModal';
import { FieldHelpModal } from '../common/FieldHelpModal';

interface AccountDisplayViewProps {
  accounts: AccountMaster[];
  debitEntries: DebitLedgerEntry[];
  creditEntries: CreditLedgerEntry[];
  onClose: () => void;
}

export const AccountDisplayView: React.FC<AccountDisplayViewProps> = ({
  accounts,
  debitEntries,
  creditEntries,
  onClose,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.account_name || 'Shri Ganesh Jewellers Wholesale');
  const [oneColumnDisplay, setOneColumnDisplay] = useState(false);
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-27');

  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const totalDebit = debitEntries.reduce((s, e) => s + (e.rs || 0), 0);
  const totalCredit = creditEntries.reduce((s, e) => s + (e.rs || 0), 0);
  const netClosingBalance = totalDebit - totalCredit;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Toolbar */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Account Display (T-Ledger)</h1>
            <p className="text-xs text-slate-500">
              Debit / Credit T-account display with One Column Display mode toggle.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          {/* One Column Display Toggle (Spec #18) */}
          <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-xs font-semibold cursor-pointer text-blue-900">
            <input
              type="checkbox"
              checked={oneColumnDisplay}
              onChange={(e) => setOneColumnDisplay(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 w-4 h-4"
            />
            <Columns3 className="w-3.5 h-3.5 text-blue-600" />
            <span>One Column Display</span>
          </label>

          <button
            onClick={() => setShowWhatsApp(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Ledger</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 hover:bg-slate-200"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Ledger</span>
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

      {/* Account Selector & Date Range Strip */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Ledger Account</label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold"
          >
            {accounts.map((a) => (
              <option key={a.account_code} value={a.account_name}>
                {a.account_name} ({a.account_code}) - {a.account_type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
          />
        </div>
      </div>

      {/* Ledger Grid */}
      {!oneColumnDisplay ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* DEBIT SIDE (Left) */}
          <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-bold text-blue-900 text-xs uppercase tracking-wider">
                DEBIT (Receivable / Dr)
              </span>
              <span className="font-mono text-xs font-semibold text-blue-800">
                Total: {formatCurrency(totalDebit)}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2 border-r border-slate-200 w-20">Date.</th>
                    <th className="p-2 border-r border-slate-200 min-w-[140px]">Particulars</th>
                    <th className="p-2 border-r border-slate-200 w-16">R.No</th>
                    <th className="p-2 text-right w-24">Rs.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {debitEntries.map((e, idx) => (
                    <tr key={`deb-${idx}`} className="hover:bg-sky-50/30">
                      <td className="p-2 border-r border-slate-200 text-slate-600">{e.date}</td>
                      <td className="p-2 border-r border-slate-200 font-sans text-slate-900">{e.particulars}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-500">{e.r_no}</td>
                      <td className="p-2 text-right font-bold text-blue-800">{formatCurrency(e.rs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CREDIT SIDE (Right) */}
          <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="font-bold text-emerald-900 text-xs uppercase tracking-wider">
                CREDIT (Payable / Cr)
              </span>
              <span className="font-mono text-xs font-semibold text-emerald-800">
                Total: {formatCurrency(totalCredit)}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2 border-r border-slate-200 w-20">Date</th>
                    <th className="p-2 border-r border-slate-200 min-w-[140px]">Particulars.</th>
                    <th className="p-2 border-r border-slate-200 w-16">V.No</th>
                    <th className="p-2 text-right w-24">Rs..</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {creditEntries.map((e, idx) => (
                    <tr key={`cred-${idx}`} className="hover:bg-emerald-50/20">
                      <td className="p-2 border-r border-slate-200 text-slate-600">{e.date}</td>
                      <td className="p-2 border-r border-slate-200 font-sans text-slate-900">{e.particulars}</td>
                      <td className="p-2 border-r border-slate-200 text-slate-500">{e.v_no}</td>
                      <td className="p-2 text-right font-bold text-emerald-800">{formatCurrency(e.rs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* One Column Display */
        <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
          <span className="font-bold text-blue-900 text-xs uppercase tracking-wider block">
            Chronological Statement Mode
          </span>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse font-mono text-[11px]">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2 border-r border-slate-200">Date</th>
                  <th className="p-2 border-r border-slate-200 min-w-[200px]">Particulars</th>
                  <th className="p-2 border-r border-slate-200">Ref No</th>
                  <th className="p-2 border-r border-slate-200 text-right">Debit (Dr)</th>
                  <th className="p-2 text-right">Credit (Cr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {debitEntries.map((e, idx) => (
                  <tr key={`deb-col-${idx}`}>
                    <td className="p-2 border-r border-slate-200">{e.date}</td>
                    <td className="p-2 border-r border-slate-200 font-sans">{e.particulars}</td>
                    <td className="p-2 border-r border-slate-200">{e.r_no}</td>
                    <td className="p-2 border-r border-slate-200 text-right font-bold text-blue-800">{formatCurrency(e.rs)}</td>
                    <td className="p-2 text-right text-slate-400">-</td>
                  </tr>
                ))}
                {creditEntries.map((e, idx) => (
                  <tr key={`cred-col-${idx}`}>
                    <td className="p-2 border-r border-slate-200">{e.date}</td>
                    <td className="p-2 border-r border-slate-200 font-sans">{e.particulars}</td>
                    <td className="p-2 border-r border-slate-200">{e.v_no}</td>
                    <td className="p-2 border-r border-slate-200 text-right text-slate-400">-</td>
                    <td className="p-2 text-right font-bold text-emerald-800">{formatCurrency(e.rs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Net Closing Balance Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-sky-200 rounded-xl p-4 shadow-sm flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Net Ledger Position</span>
          <span className="text-xs text-slate-500">{selectedAccount}</span>
        </div>
        <div className="text-xl font-mono font-semibold text-blue-900">
          {formatCurrency(netClosingBalance)} {netClosingBalance >= 0 ? 'Dr (Receivable)' : 'Cr (Payable)'}
        </div>
      </div>

      <WhatsAppShareModal
        isOpen={showWhatsApp}
        onClose={() => setShowWhatsApp(false)}
        recipientName={selectedAccount}
        phone="9820123456"
        defaultMessage={`Namaste, Statement of Account for ${selectedAccount}: Total Debit: ${formatCurrency(totalDebit)}, Total Credit: ${formatCurrency(totalCredit)}. Net Closing: ${formatCurrency(netClosingBalance)}.`}
      />

      <FieldHelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        screenName="Account Display"
      />
    </div>
  );
};
