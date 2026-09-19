import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const MessengerView: React.FC = () => {
  const { isDark } = useTheme();
  const [template, setTemplate] = useState('order_update');
  const [customerPhone, setCustomerPhone] = useState('9819033445');
  const [customerName, setCustomerName] = useState('Pooja Mehta');
  const [customText, setCustomText] = useState(
    'Namaste Pooja Mehta, Greetings from Swarna Jewellers! Your custom bridal Mangalsutra is now ready for inspection and final delivery. Showroom hours: 10:30 AM to 8:30 PM.'
  );

  const handleTemplateChange = (val: string) => {
    setTemplate(val);
    if (val === 'order_update') {
      setCustomText(`Namaste ${customerName}, Greetings from Swarna Jewellers! Your custom order ORD-2026-084 is ready for trial/delivery.`);
    } else if (val === 'scheme_due') {
      setCustomText(`Namaste ${customerName}, gentle reminder: Your Swarna Nidhi gold savings installment for this month is due. Secure today's gold rate!`);
    } else if (val === 'daily_rate') {
      setCustomText(`Good Morning! Today's Bullion Rate at Swarna Jewellers: 24K Gold ₹7,250/g, 22K 916 Hallmark ₹6,680/g, Silver ₹86/g.`);
    }
  };

  const handleSend = () => {
    let cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    const encoded = encodeURIComponent(customText);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className={`border rounded-xl p-4 flex items-center justify-between shadow-sm transition-all ${
        isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/80 text-slate-800'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg border ${
            isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
          }`}>
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-base font-bold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <span>Showroom Messenger & WhatsApp Hub</span>
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Automated customer messaging for order readiness, Karagir job challans, and daily gold rates.
            </p>
          </div>
        </div>

        <button
          onClick={handleSend}
          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Launch WhatsApp Message</span>
        </button>
      </div>

      <div className={`border rounded-xl p-5 shadow-sm space-y-4 text-xs transition-all ${
        isDark ? 'bg-[#0f172a]/90 border-white/10 text-white' : 'bg-white border-sky-200/80 text-slate-800'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Message Template
            </label>
            <select
              value={template}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-xs border outline-hidden ${
                isDark ? 'bg-[#0f172a] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="order_update">Order Ready for Delivery</option>
              <option value="scheme_due">Gold Scheme Monthly Due Reminder</option>
              <option value="daily_rate">Daily Bullion Rate Broadcast</option>
            </select>
          </div>

          <div>
            <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Customer / Party Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-xs border outline-hidden ${
                isDark ? 'bg-white/5 border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Mobile No.
            </label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg font-mono font-bold text-xs border outline-hidden ${
                isDark ? 'bg-white/5 border-white/15 text-amber-300' : 'bg-slate-50 border-slate-300 text-blue-800'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-[11px] font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Message Body
          </label>
          <textarea
            rows={5}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-lg text-xs font-sans border outline-hidden leading-relaxed ${
              isDark
                ? 'bg-white/5 border-white/15 text-white placeholder-slate-500 focus:border-amber-400'
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:bg-white'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
