import React, { useState, useEffect } from 'react';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Lock,
  Unlock,
  Sliders,
  Share2,
  Check,
  Building,
  Sparkles,
  Info,
  X,
  Printer,
  Edit3,
  Flame,
  Scale
} from 'lucide-react';
import { BullionRateData, bullionRatesService, calculateAllKaratRates } from '../../services/bullionRatesService';
import { formatCurrency } from '../../utils/calculations';
import { useTheme } from '../../context/ThemeContext';
import { WhatsAppShareModal } from './WhatsAppShareModal';

interface BullionRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRates: (gold24k: number, gold22k: number, silver: number) => void;
}

export const BullionRateModal: React.FC<BullionRateModalProps> = ({
  isOpen,
  onClose,
  onApplyRates,
}) => {
  const { currentTheme, isDark } = useTheme();
  const [rates, setRates] = useState<BullionRateData>(bullionRatesService.getRates());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);

  // Editable fields for manual override
  const [manual24k, setManual24k] = useState(rates.gold24k);
  const [manualSilver, setManualSilver] = useState(rates.silver999);
  const [markupGold, setMarkupGold] = useState(rates.showroomMarkupGold || 0);
  const [markupSilver, setMarkupSilver] = useState(rates.showroomMarkupSilver || 0);
  const [applySuccess, setApplySuccess] = useState(false);

  // WhatsApp share modal state
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  // Subscribe to live rate updates
  useEffect(() => {
    const unsubscribe = bullionRatesService.subscribe((updated) => {
      setRates(updated);
      setManual24k(updated.gold24k);
      setManualSilver(updated.silver999);
      setMarkupGold(updated.showroomMarkupGold);
      setMarkupSilver(updated.showroomMarkupSilver);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await bullionRatesService.fetchLiveRates(true);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // Handle toggling rate lock
  const handleToggleLock = () => {
    bullionRatesService.toggleLock();
  };

  // Handle saving manual / markup adjustments
  const handleSaveAdjustments = () => {
    if (isManualEdit) {
      bullionRatesService.setCustomRates(manual24k, manualSilver, markupGold, markupSilver);
      setIsManualEdit(false);
    } else {
      bullionRatesService.setShowroomMarkup(markupGold, markupSilver);
    }
  };

  // Apply to all active system modules
  const handleApplyToERP = () => {
    onApplyRates(rates.gold24k, rates.gold22k, rates.silver999);
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      onClose();
    }, 1200);
  };

  // Compose WhatsApp Rate Card
  const todayDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const rateCardMessage = `✨ *SWARNA JEWELLERS & BULLION* ✨\n📅 *Daily Bullion Rate Card • ${todayDate}*\n━━━━━━━━━━━━━━━━━━━━\n🥇 *GOLD RATES:*\n• 24K Pure (999): ₹${rates.gold24k.toLocaleString('en-IN')}/gm (₹${rates.gold24kTola.toLocaleString('en-IN')}/10g)\n• 22K Hallmark (916): ₹${rates.gold22k.toLocaleString('en-IN')}/gm (₹${rates.gold22kTola.toLocaleString('en-IN')}/10g)\n• 18K Diamond (750): ₹${rates.gold18k.toLocaleString('en-IN')}/gm\n• 14K Studded (585): ₹${rates.gold14k.toLocaleString('en-IN')}/gm\n\n🥈 *SILVER RATES:*\n• Fine Silver (999): ₹${rates.silver999.toLocaleString('en-IN')}/gm (₹${rates.silverKg.toLocaleString('en-IN')}/Kg)\n• Sterling Silver (925): ₹${rates.silver925.toLocaleString('en-IN')}/gm\n━━━━━━━━━━━━━━━━━━━━\n📌 _Rates subject to market fluctuation. Hallmark 100% Guaranteed._\n📍 Shop 14-18, Zaveri Bazaar, Mumbai • 📞 022-23456789`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl rounded-3xl border shadow-lg overflow-hidden flex flex-col max-h-[92vh] transition-all ${
          isDark
            ? 'bg-[#0b1329]/95 backdrop-blur-2xl border-white/20 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${currentTheme.headerBg}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-600 text-slate-950 shadow-xs flex items-center justify-center">
              <Coins className="w-5 h-5 text-inherit" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-semibold tracking-tight font-sans">
                  Real-Time Bullion Rate Center
                </h2>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border flex items-center space-x-1.5 ${
                    rates.isLocked
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      rates.isLocked ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                  />
                  <span>{rates.isLocked ? 'Showroom Locked' : '● Live Feed Active'}</span>
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                Source: <span className="font-semibold">{rates.source}</span> • Last Synced: <span className="font-mono font-medium">{rates.lastUpdated}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Instant Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || rates.isLocked}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                rates.isLocked
                  ? 'opacity-40 cursor-not-allowed border-slate-500 text-slate-400'
                  : isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
              title="Fetch latest market rates"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>

            {/* Lock / Freeze Rate Button */}
            <button
              onClick={handleToggleLock}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                rates.isLocked
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                  : isDark
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
              title={rates.isLocked ? 'Rates are locked for today billing' : 'Lock rates to prevent intra-day changes'}
            >
              {rates.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{rates.isLocked ? 'Locked' : 'Lock Rate'}</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* 1. Six Metallic Rate Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Active Metal Rates & Pure Karat Conversions
              </h3>
              <div className="flex items-center space-x-2 text-[11px]">
                <span className={`flex items-center space-x-1 ${rates.gold24kChange >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}`}>
                  {rates.gold24kChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>Gold 24K: {rates.gold24kChange >= 0 ? '+' : ''}₹{rates.gold24kChange}/g ({rates.gold24kChangePct}%)</span>
                </span>
                <span className={isDark ? 'text-white/20' : 'text-slate-300'}>•</span>
                <span className={`flex items-center space-x-1 ${rates.silverChange >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}`}>
                  {rates.silverChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>Silver: {rates.silverChange >= 0 ? '+' : ''}₹{rates.silverChange}/g ({rates.silverChangePct}%)</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Card 1: 24K Pure Gold */}
              <div
                className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden shadow-xs ${
                  isDark
                    ? 'bg-[#131b2e] border-amber-500/40 text-white'
                    : 'bg-white border-amber-300 text-slate-950'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                      isDark ? 'bg-amber-500/20 text-amber-300 border-amber-400/50' : 'bg-amber-100 text-amber-950 border-amber-300'
                    }`}>
                      99.9% Fine
                    </span>
                    <h4 className="text-sm font-bold mt-1.5">Gold 24K (Pure)</h4>
                  </div>
                  <Coins className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                </div>

                <div className="my-2.5">
                  <div className={`text-2xl font-bold font-mono tracking-normal ${isDark ? 'text-amber-300' : 'text-amber-950'}`}>
                    ₹{rates.gold24k.toLocaleString('en-IN')}
                    <span className={`text-xs font-semibold ml-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>/ gram</span>
                  </div>
                  <div className={`text-xs font-mono font-medium mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    10g (Tola): <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>₹{rates.gold24kTola.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-medium ${isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-700'}`}>
                  <span>High: <b className={isDark ? 'text-white' : 'text-slate-950'}>₹{rates.gold24kHigh}</b></span>
                  <span>Low: <b className={isDark ? 'text-white' : 'text-slate-950'}>₹{rates.gold24kLow}</b></span>
                </div>
              </div>

              {/* Card 2: 22K Hallmark Gold (916) */}
              <div
                className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden shadow-xs ${
                  isDark
                    ? 'bg-[#131b2e] border-yellow-500/40 text-white'
                    : 'bg-white border-yellow-300 text-slate-950'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                      isDark ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50' : 'bg-yellow-100 text-yellow-950 border-yellow-300'
                    }`}>
                      91.6% Hallmark (BIS)
                    </span>
                    <h4 className="text-sm font-bold mt-1.5">Gold 22K (916)</h4>
                  </div>
                  <Sparkles className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                </div>

                <div className="my-2.5">
                  <div className={`text-2xl font-bold font-mono tracking-normal ${isDark ? 'text-yellow-300' : 'text-yellow-950'}`}>
                    ₹{rates.gold22k.toLocaleString('en-IN')}
                    <span className={`text-xs font-semibold ml-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>/ gram</span>
                  </div>
                  <div className={`text-xs font-mono font-medium mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    10g Bar: <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>₹{rates.gold22kTola.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-medium ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Standard Jewellery Rate</span>
                  <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>● Active POS Rate</span>
                </div>
              </div>

              {/* Card 3: 18K Diamond Jewellery Gold */}
              <div
                className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden shadow-xs ${
                  isDark
                    ? 'bg-[#131b2e] border-orange-500/40 text-white'
                    : 'bg-white border-orange-300 text-slate-950'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                      isDark ? 'bg-orange-500/20 text-orange-300 border-orange-400/50' : 'bg-orange-100 text-orange-950 border-orange-300'
                    }`}>
                      75.0% Fine (750)
                    </span>
                    <h4 className="text-sm font-bold mt-1.5">Gold 18K (Diamond)</h4>
                  </div>
                  <Flame className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                </div>

                <div className="my-2.5">
                  <div className={`text-2xl font-bold font-mono tracking-normal ${isDark ? 'text-orange-300' : 'text-orange-950'}`}>
                    ₹{rates.gold18k.toLocaleString('en-IN')}
                    <span className={`text-xs font-semibold ml-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>/ gram</span>
                  </div>
                  <div className={`text-xs font-mono font-medium mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    10g: <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>₹{(rates.gold18k * 10).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-medium ${isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-700'}`}>
                  <span>Rose / White Gold</span>
                  <span className={`font-semibold ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>Studded Ornaments</span>
                </div>
              </div>

              {/* Card 4: 14K Studded Gold */}
              <div
                className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden shadow-xs ${
                  isDark
                    ? 'bg-[#131b2e] border-rose-500/40 text-white'
                    : 'bg-white border-rose-300 text-slate-950'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                      isDark ? 'bg-rose-500/20 text-rose-300 border-rose-400/50' : 'bg-rose-100 text-rose-950 border-rose-300'
                    }`}>
                      58.5% Fine (585)
                    </span>
                    <h4 className="text-sm font-bold mt-1.5">Gold 14K (Fashion)</h4>
                  </div>
                  <Sparkles className={`w-5 h-5 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />
                </div>

                <div className="my-2.5">
                  <div className={`text-2xl font-bold font-mono tracking-normal ${isDark ? 'text-rose-300' : 'text-rose-950'}`}>
                    ₹{rates.gold14k.toLocaleString('en-IN')}
                    <span className={`text-xs font-semibold ml-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>/ gram</span>
                  </div>
                  <div className={`text-xs font-mono font-medium mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    10g: <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>₹{(rates.gold14k * 10).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-medium ${isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-700'}`}>
                  <span>Lightweight Dailywear</span>
                  <span className={`font-semibold ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>Modern Luxury</span>
                </div>
              </div>

              {/* Card 5: Fine Silver 999 */}
              <div
                className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden shadow-xs ${
                  isDark
                    ? 'bg-[#131b2e] border-slate-400/40 text-white'
                    : 'bg-white border-slate-300 text-slate-950'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                      isDark ? 'bg-slate-500/20 text-slate-200 border-slate-400/50' : 'bg-slate-200 text-slate-950 border-slate-300'
                    }`}>
                      99.9% Fine Pure
                    </span>
                    <h4 className="text-sm font-bold mt-1.5">Silver 999 (Pure)</h4>
                  </div>
                  <Scale className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                </div>

                <div className="my-2.5">
                  <div className={`text-2xl font-bold font-mono tracking-normal ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>
                    ₹{rates.silver999.toFixed(2)}
                    <span className={`text-xs font-semibold ml-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>/ gram</span>
                  </div>
                  <div className={`text-xs font-mono font-medium mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    1 Kg Bar: <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>₹{rates.silverKg.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-medium ${isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-700'}`}>
                  <span>High: <b className={isDark ? 'text-white' : 'text-slate-950'}>₹{rates.silverHigh}</b></span>
                  <span>Low: <b className={isDark ? 'text-white' : 'text-slate-950'}>₹{rates.silverLow}</b></span>
                </div>
              </div>

              {/* Card 6: Sterling Silver 925 */}
              <div
                className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden shadow-xs ${
                  isDark
                    ? 'bg-[#131b2e] border-zinc-400/40 text-white'
                    : 'bg-white border-zinc-300 text-slate-950'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                      isDark ? 'bg-zinc-500/20 text-zinc-200 border-zinc-400/50' : 'bg-zinc-200 text-zinc-950 border-zinc-300'
                    }`}>
                      92.5% Sterling
                    </span>
                    <h4 className="text-sm font-bold mt-1.5">Silver 925 (Chandi)</h4>
                  </div>
                  <Sparkles className={`w-5 h-5 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`} />
                </div>

                <div className="my-2.5">
                  <div className={`text-2xl font-bold font-mono tracking-normal ${isDark ? 'text-zinc-100' : 'text-slate-950'}`}>
                    ₹{rates.silver925.toFixed(2)}
                    <span className={`text-xs font-semibold ml-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>/ gram</span>
                  </div>
                  <div className={`text-xs font-mono font-medium mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    1 Kg: <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>₹{Math.round(rates.silver925 * 1000).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-medium ${isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-700'}`}>
                  <span>Jewellery & Utensils</span>
                  <span className={`font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Standard 925</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Showroom Markup / Premium & Custom Board Adjustments */}
          <div
            className={`p-4.5 rounded-2xl border ${
              isDark ? 'bg-white/[0.04] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-semibold uppercase tracking-wider">
                  Showroom Premium & Custom Board Overrides
                </h4>
              </div>
              <button
                onClick={() => setIsManualEdit(!isManualEdit)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isManualEdit
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : isDark
                    ? 'bg-white/10 text-slate-200 border-white/15 hover:bg-white/20'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isManualEdit ? 'Close Manual Edit' : 'Edit Base Rates'}</span>
              </button>
            </div>

            {isManualEdit ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold block mb-1">Manual 24K Gold Rate (₹/g)</label>
                  <input
                    type="number"
                    value={manual24k}
                    onChange={(e) => setManual24k(parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-1.5 rounded-xl border font-mono font-semibold text-center ${
                      isDark ? 'bg-white/10 border-white/20 text-amber-300' : 'bg-white border-slate-300 text-amber-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold block mb-1">Manual Silver 999 Rate (₹/g)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={manualSilver}
                    onChange={(e) => setManualSilver(parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-1.5 rounded-xl border font-mono font-semibold text-center ${
                      isDark ? 'bg-white/10 border-white/20 text-slate-200' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold block mb-1">Gold Premium (+₹/g)</label>
                  <input
                    type="number"
                    value={markupGold}
                    onChange={(e) => setMarkupGold(parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-1.5 rounded-xl border font-mono font-semibold text-center ${
                      isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSaveAdjustments}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    Save & Recalculate
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="text-[11px] font-semibold block mb-1 text-slate-400">
                    Showroom Gold Premium (+₹/g)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={markupGold}
                      onChange={(e) => setMarkupGold(parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-1.5 rounded-xl border font-mono font-semibold text-center ${
                        isDark ? 'bg-white/10 border-white/20 text-amber-300' : 'bg-white border-slate-300 text-amber-900'
                      }`}
                      placeholder="+₹0"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold block mb-1 text-slate-400">
                    Showroom Silver Premium (+₹/g)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step={0.1}
                      value={markupSilver}
                      onChange={(e) => setMarkupSilver(parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-1.5 rounded-xl border font-mono font-semibold text-center ${
                        isDark ? 'bg-white/10 border-white/20 text-slate-200' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                      placeholder="+₹0"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleSaveAdjustments}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Showroom Markup</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3 ${currentTheme.headerBg}`}>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowWhatsApp(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Daily Rate Card (WhatsApp)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl border font-semibold text-xs transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/10 hover:bg-white/15 border-white/20 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
            >
              Cancel
            </button>

            <button
              onClick={handleApplyToERP}
              className={`px-5 py-2 rounded-xl font-semibold text-xs shadow-xs transition-all cursor-pointer flex items-center space-x-2 ${
                applySuccess
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950'
              }`}
            >
              {applySuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Applied to All ERP Vouchers!</span>
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 text-slate-950" />
                  <span>Apply Rates to Sales, Purchases & POS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Rate Card Share Modal */}
      {showWhatsApp && (
        <WhatsAppShareModal
          isOpen={showWhatsApp}
          onClose={() => setShowWhatsApp(false)}
          recipientName="Customers / Staff Broadcast"
          phone="9820011223"
          defaultMessage={rateCardMessage}
        />
      )}
    </div>
  );
};
