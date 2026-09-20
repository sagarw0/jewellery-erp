import React, { useState } from 'react';
import { Settings, Save, Building, Scale, Percent, Users, ShieldCheck } from 'lucide-react';
import { bullionRatesService } from '../../services/bullionRatesService';
import { useTheme } from '../../context/ThemeContext';

interface SettingsViewProps {
  gold24kRate: number;
  gold22kRate: number;
  silverRate: number;
  onUpdateRates: (g24: number, g22: number, sil: number) => void;
  onOpenUserRoleManagement?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  gold24kRate,
  gold22kRate,
  silverRate,
  onUpdateRates,
  onOpenUserRoleManagement,
}) => {
  const { isDark } = useTheme();
  const [showroomName, setShowroomName] = useState('SWARNA JEWELLERS & BULLION');
  const [gstin, setGstin] = useState('27AAACS1234F1Z8');
  const [bisLicense, setBisLicense] = useState('HM-916-MH-4421');
  const [address, setAddress] = useState('Shop 14-18, Zaveri Bazaar Bullion Tower, Kalbadevi, Mumbai - 400002');
  const [phone, setPhone] = useState('022-23456789 / 9820011223');

  const [rate24k, setRate24k] = useState(gold24kRate);
  const [rate22k, setRate22k] = useState(gold22kRate);
  const [rateSil, setRateSil] = useState(silverRate);

  const [gstPct, setGstPct] = useState(3.0);
  const [tdsPct, setTdsPct] = useState(0.1);
  const [tcsPct, setTcsPct] = useState(1.0);

  const handleSave = () => {
    bullionRatesService.setCustomRates(rate24k, rateSil);
    onUpdateRates(rate24k, rate22k, rateSil);
    alert('System settings, tax configuration, and bullion rates saved successfully!');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className={`border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm transition-all ${
        isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/80 text-slate-800'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg border ${
            isDark ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' : 'bg-blue-50 text-blue-600 border-blue-200'
          }`}>
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span>ERP System & Financial Settings</span>
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Configure showroom profile, statutory BIS Hallmark license, GST tax heads, and staff access roles.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenUserRoleManagement && (
            <button
              onClick={onOpenUserRoleManagement}
              className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                isDark
                  ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border-amber-400/30'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
              }`}
            >
              <Users className="w-4 h-4 text-amber-500" />
              <span>Employee Roles (RBAC)</span>
            </button>
          )}

          <button
            onClick={handleSave}
            className={`flex items-center space-x-1.5 px-4 py-2 font-bold text-xs rounded-lg shadow transition-all cursor-pointer ${
              isDark
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-bold'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Showroom Profile */}
        <div className={`border rounded-xl p-5 shadow-sm space-y-3 text-xs transition-all ${
          isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/80 text-slate-800'
        }`}>
          <div className={`flex items-center space-x-2 border-b pb-2 ${
            isDark ? 'text-amber-300 border-white/10' : 'text-blue-700 border-slate-100'
          }`}>
            <Building className="w-4 h-4" />
            <h3 className="font-bold uppercase tracking-wider">Company & Showroom Profile</h3>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Showroom Name</label>
              <input
                type="text"
                value={showroomName}
                onChange={(e) => setShowroomName(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg font-semibold border outline-hidden ${
                  isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>GSTIN No</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-lg font-mono font-bold border outline-hidden ${
                    isDark ? 'bg-white/5 border-white/15 text-amber-300' : 'bg-slate-50 border-slate-300 text-blue-800'
                  }`}
                />
              </div>
              <div>
                <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>BIS Hallmark License</label>
                <input
                  type="text"
                  value={bisLicense}
                  onChange={(e) => setBisLicense(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-lg font-mono font-bold border outline-hidden ${
                    isDark ? 'bg-white/5 border-white/15 text-amber-300' : 'bg-slate-50 border-slate-300 text-amber-800'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Showroom Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg border outline-hidden ${
                  isDark ? 'bg-white/5 border-white/15 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              />
            </div>

            <div>
              <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Phone Numbers</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg border outline-hidden ${
                  isDark ? 'bg-white/5 border-white/15 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Rates & Taxes */}
        <div className="space-y-4">
          <div className={`border rounded-xl p-5 shadow-sm space-y-3 text-xs transition-all ${
            isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/80 text-slate-800'
          }`}>
            <div className={`flex items-center space-x-2 border-b pb-2 ${
              isDark ? 'text-amber-300 border-white/10' : 'text-amber-700 border-slate-100'
            }`}>
              <Scale className="w-4 h-4" />
              <h3 className="font-bold uppercase tracking-wider">Bullion Rates (₹ / Gram)</h3>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Gold 24K Pure</label>
                <input
                  type="number"
                  value={rate24k}
                  onChange={(e) => setRate24k(parseFloat(e.target.value) || 0)}
                  className={`w-full px-2.5 py-1.5 rounded-lg font-mono text-center font-semibold border outline-hidden ${
                    isDark ? 'bg-white/5 border-white/15 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                />
              </div>
              <div>
                <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Gold 22K 916</label>
                <input
                  type="number"
                  value={rate22k}
                  onChange={(e) => setRate22k(parseFloat(e.target.value) || 0)}
                  className={`w-full px-2.5 py-1.5 rounded-lg font-mono text-center font-semibold border outline-hidden ${
                    isDark ? 'bg-white/5 border-white/15 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                />
              </div>
              <div>
                <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Silver 92.5</label>
                <input
                  type="number"
                  value={rateSil}
                  onChange={(e) => setRateSil(parseFloat(e.target.value) || 0)}
                  className={`w-full px-2.5 py-1.5 rounded-lg font-mono text-center font-bold border outline-hidden ${
                    isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className={`border rounded-xl p-5 shadow-sm space-y-3 text-xs transition-all ${
            isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/80 text-slate-800'
          }`}>
            <div className={`flex items-center space-x-2 border-b pb-2 ${
              isDark ? 'text-amber-300 border-white/10' : 'text-blue-700 border-slate-100'
            }`}>
              <Percent className="w-4 h-4" />
              <h3 className="font-bold uppercase tracking-wider">Statutory Tax Defaults</h3>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>GST (Jewellery %)</label>
                <input
                  type="number"
                  step={0.5}
                  value={gstPct}
                  onChange={(e) => setGstPct(parseFloat(e.target.value) || 3.0)}
                  className={`w-full px-2.5 py-1.5 rounded-lg font-mono text-center font-bold border outline-hidden ${
                    isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <span className={`text-[10px] block text-center mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  1.5% CGST + 1.5% SGST
                </span>
              </div>
              <div>
                <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>TDS %</label>
                <input
                  type="number"
                  step={0.1}
                  value={tdsPct}
                  onChange={(e) => setTdsPct(parseFloat(e.target.value) || 0.1)}
                  className={`w-full px-2.5 py-1.5 rounded-lg font-mono text-center font-bold border outline-hidden ${
                    isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <span className={`text-[10px] block text-center mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Section 194Q
                </span>
              </div>
              <div>
                <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>TCS %</label>
                <input
                  type="number"
                  step={0.1}
                  value={tcsPct}
                  onChange={(e) => setTcsPct(parseFloat(e.target.value) || 1.0)}
                  className={`w-full px-2.5 py-1.5 rounded-lg font-mono text-center font-bold border outline-hidden ${
                    isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <span className={`text-[10px] block text-center mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Cash above ₹2L
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
