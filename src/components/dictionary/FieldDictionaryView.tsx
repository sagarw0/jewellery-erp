import React, { useState } from 'react';
import { MASTER_FIELD_DICTIONARY } from '../../utils/fieldDictionary';
import { FieldDictionaryEntry } from '../../types/erp';
import { BookMarked, Search, Filter, Database, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const FieldDictionaryView: React.FC = () => {
  const { isDark } = useTheme();
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
      <div className={`border rounded-xl p-4 flex items-center justify-between shadow-sm transition-all ${
        isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/80 text-slate-800'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg border ${
            isDark ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' : 'bg-blue-50 text-blue-600 border-blue-200'
          }`}>
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span>Master Business Field Dictionary</span>
              <span className={`text-xs px-2 py-0.5 rounded font-bold border ${
                isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}>
                100% Spec #40-41 Preserved
              </span>
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Preserved mapping between legacy ERP screen labels, database column names, data types, and business rules.
            </p>
          </div>
        </div>

        <div className={`text-right text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Total Mapped Fields: <strong className={isDark ? 'text-amber-300' : 'text-blue-700'}>{MASTER_FIELD_DICTIONARY.length}</strong>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className={`border rounded-xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs transition-all ${
        isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/80 text-slate-800'
      }`}>
        <div className="flex items-center space-x-2">
          <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>Filter by Screen:</span>
          <select
            value={selectedScreen}
            onChange={(e) => setSelectedScreen(e.target.value)}
            className={`px-2.5 py-1 rounded-lg font-medium text-xs border outline-hidden ${
              isDark ? 'bg-[#0f172a] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            {screens.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-72">
          <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search field label, db column, or rule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border outline-hidden ${
              isDark
                ? 'bg-white/5 border-white/15 text-white placeholder-slate-500 focus:border-amber-400'
                : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none'
            }`}
          />
        </div>
      </div>

      {/* Dictionary Table */}
      <div className={`border rounded-xl p-4 shadow-sm space-y-3 transition-all ${
        isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/80 text-slate-800'
      }`}>
        <div className={`overflow-x-auto border rounded-lg ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <table className="w-full text-left text-xs border-collapse">
            <thead className={`font-bold border-b ${
              isDark ? 'bg-white/10 text-slate-200 border-white/10' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}>
              <tr>
                <th className={`p-2.5 border-r w-12 text-center ${isDark ? 'border-white/10' : 'border-slate-200'}`}>#</th>
                <th className={`p-2.5 border-r min-w-[150px] ${isDark ? 'border-white/10' : 'border-slate-200'}`}>Screen / Form</th>
                <th className={`p-2.5 border-r min-w-[140px] font-bold ${isDark ? 'border-white/10 text-amber-300' : 'border-slate-200 text-blue-900'}`}>Field Label</th>
                <th className={`p-2.5 border-r min-w-[160px] font-mono ${isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-sky-800'}`}>DB Column Name</th>
                <th className={`p-2.5 border-r w-24 ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600'}`}>Data Type</th>
                <th className={`p-2.5 border-r w-20 text-center ${isDark ? 'border-white/10' : 'border-slate-200'}`}>Mandatory</th>
                <th className="p-2.5 min-w-[280px]">Business Meaning & Formula</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-mono text-[11px] ${
              isDark ? 'divide-white/10 bg-transparent text-slate-200' : 'divide-slate-200 bg-white'
            }`}>
              {filteredFields.map((f: FieldDictionaryEntry, idx: number) => (
                <tr key={`${f.screen}-${f.database_field}-${idx}`} className={isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-sky-50/30'}>
                  <td className={`p-2.5 border-r text-center ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}>{idx + 1}</td>
                  <td className={`p-2.5 border-r font-sans font-semibold ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-800'}`}>{f.screen}</td>
                  <td className={`p-2.5 border-r font-sans font-bold ${isDark ? 'border-white/10 text-amber-300' : 'border-slate-200 text-blue-900'}`}>{f.ui_label}</td>
                  <td className={`p-2.5 border-r ${isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-sky-800'}`}>{f.database_field}</td>
                  <td className={`p-2.5 border-r ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600'}`}>{f.type}</td>
                  <td className={`p-2.5 border-r text-center ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    {f.mandatory ? (
                      <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                        isDark ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-rose-100 text-rose-700'
                      }`}>
                        YES
                      </span>
                    ) : (
                      <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>NO</span>
                    )}
                  </td>
                  <td className={`p-2.5 font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{f.business_meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
