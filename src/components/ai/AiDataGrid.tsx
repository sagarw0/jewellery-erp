import React, { useState } from 'react';
import { Copy, Check, ArrowUpDown, ExternalLink, Search } from 'lucide-react';
import { ChatTableData } from '../../services/aiChatbotService';

interface AiDataGridProps {
  tableData: ChatTableData;
  onNavigate?: (section: string, subView?: string) => void;
}

export const AiDataGrid: React.FC<AiDataGridProps> = ({ tableData, onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  if (!tableData || !tableData.rows || tableData.rows.length === 0) return null;

  // Filter rows based on quick search inside grid
  let filteredRows = tableData.rows;
  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    filteredRows = filteredRows.filter((r) =>
      Object.values(r).some((val) => String(val).toLowerCase().includes(q))
    );
  }

  // Sort rows if column selected
  if (sortCol) {
    filteredRows = [...filteredRows].sort((a, b) => {
      const valA = a[sortCol] ?? '';
      const valB = b[sortCol] ?? '';
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }

  const handleCopyMarkdown = () => {
    // Generate Markdown table string
    const headers = tableData.columns.map((c) => c.label).join(' | ');
    const divider = tableData.columns.map(() => '---').join(' | ');
    const rowsText = tableData.rows
      .map((r) => tableData.columns.map((c) => r[c.key] ?? '').join(' | '))
      .join('\n');

    const mdString = `${headers}\n${divider}\n${rowsText}`;
    navigator.clipboard.writeText(mdString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSort = (key: string) => {
    if (sortCol === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="my-3 rounded-2xl border border-slate-200/90 bg-white/95 overflow-hidden shadow-xs">
      {/* Table Header Controls */}
      <div className="p-3 bg-slate-50/90 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold text-slate-900 tracking-normal">
            {tableData.title}
          </h4>
          {tableData.subtitle && (
            <p className="text-[10.5px] font-medium text-slate-500">
              {tableData.subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* In-table search input */}
          {tableData.rows.length > 3 && (
            <div className="relative">
              <input
                type="text"
                placeholder="Filter table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-[11px] pl-6 pr-2 py-1 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-400 w-28 sm:w-36 font-sans"
              />
              <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
            </div>
          )}

          {/* Copy Table Button */}
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[10.5px] font-bold shadow-2xs transition-all cursor-pointer"
            title="Copy as Markdown table"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Deep Navigation Action */}
          {tableData.navigationAction && onNavigate && (
            <button
              onClick={() => onNavigate(tableData.navigationAction!.section, tableData.navigationAction!.subView)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[10.5px] font-bold shadow-2xs transition-all cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{tableData.navigationAction.label}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Data Grid */}
      <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200/80 sticky top-0 z-10 select-none">
            <tr>
              {tableData.columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`p-2.5 text-[11px] font-bold cursor-pointer hover:bg-slate-200/70 transition-colors ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  <div className={`inline-flex items-center space-x-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                    <span>{col.label}</span>
                    <ArrowUpDown className="w-2.5 h-2.5 opacity-50" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-xs">
            {filteredRows.map((row, rIdx) => (
              <tr key={rIdx} className="transition-colors hover:bg-sky-50/50">
                {tableData.columns.map((col) => {
                  const val = row[col.key];
                  const isBadge = col.format === 'badge';

                  return (
                    <td
                      key={col.key}
                      className={`p-2.5 text-[11.5px] ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left font-sans'
                      }`}
                    >
                      {isBadge ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200/80 inline-block font-sans">
                          {val}
                        </span>
                      ) : (
                        <span className={col.format === 'currency' ? 'font-bold text-slate-900' : ''}>
                          {val}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {/* Footer summary row */}
          {tableData.footerSummary && (
            <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold text-xs">
              <tr>
                {tableData.columns.map((col, cIdx) => (
                  <td
                    key={col.key}
                    className={`p-2.5 text-[11.5px] ${
                      col.align === 'right' ? 'text-right font-bold text-slate-950 font-mono' : 'text-left font-bold text-slate-800'
                    }`}
                  >
                    {tableData.footerSummary![col.key] || (cIdx === 0 ? 'Summary Total:' : '')}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
