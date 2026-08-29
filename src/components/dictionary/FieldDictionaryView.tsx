import React, { useState } from 'react';
import { MASTER_FIELD_DICTIONARY } from '../../utils/fieldDictionary';
import { FieldDictionaryEntry } from '../../types/erp';
import { BookMarked, Search, Filter, Database, CheckCircle2 } from 'lucide-react';

export const FieldDictionaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScreen, setSelectedScreen] = useState('All');

  const screens: string[] = ['All', ...Array.from(new Set(MASTER_FIELD_DICTIONARY.map((f: FieldDictionaryEntry) => f.screen)))];

  const filteredFields: FieldDictionaryEntry[] = MASTER_FIELD_DICTIONARY.filter((f: FieldDictionaryEntry) => {
    const matchesScreen = selectedScreen === 'All' || f.screen === selectedScreen;
    const matchesSearch =
      !searchTerm ||
      f.ui_label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.database_field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.business_meaning.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesScreen && matchesSearch;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span>Master Business Field Dictionary</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                100% Spec #40-41 Preserved
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Preserved mapping between legacy ERP screen labels, database column names, data types, and business rules.
            </p>
          </div>
        </div>

        <div className="text-right text-xs font-mono text-slate-500">
          Total Mapped Fields: <strong className="text-blue-700">{MASTER_FIELD_DICTIONARY.length}</strong>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-semibold">Filter by Screen:</span>
          <select
            value={selectedScreen}
            onChange={(e) => setSelectedScreen(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium text-xs"
          >
            {screens.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search field label, db column, or rule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Dictionary Table */}
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 shadow-sm space-y-3">
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5 border-r border-slate-200 w-12 text-center">#</th>
                <th className="p-2.5 border-r border-slate-200 min-w-[150px]">Screen / Form</th>
                <th className="p-2.5 border-r border-slate-200 min-w-[140px] text-blue-900 font-bold">Field Label</th>
                <th className="p-2.5 border-r border-slate-200 min-w-[160px] text-sky-800 font-mono">DB Column Name</th>
                <th className="p-2.5 border-r border-slate-200 w-24">Data Type</th>
                <th className="p-2.5 border-r border-slate-200 w-20 text-center">Mandatory</th>
                <th className="p-2.5 min-w-[280px]">Business Meaning & Formula</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
              {filteredFields.map((f: FieldDictionaryEntry, idx: number) => (
                <tr key={`${f.screen}-${f.database_field}-${idx}`} className="hover:bg-sky-50/30">
                  <td className="p-2.5 border-r border-slate-200 text-center text-slate-400">{idx + 1}</td>
                  <td className="p-2.5 border-r border-slate-200 font-sans font-semibold text-slate-800">{f.screen}</td>
                  <td className="p-2.5 border-r border-slate-200 font-sans font-bold text-blue-900 bg-blue-50/30">{f.ui_label}</td>
                  <td className="p-2.5 border-r border-slate-200 text-sky-800 font-semibold">{f.database_field}</td>
                  <td className="p-2.5 border-r border-slate-200 text-slate-600">{f.type}</td>
                  <td className="p-2.5 border-r border-slate-200 text-center">
                    {f.mandatory ? (
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">YES</span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">NO</span>
                    )}
                  </td>
                  <td className="p-2.5 font-sans text-slate-700 leading-relaxed">{f.business_meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
