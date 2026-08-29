import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export const MessengerView: React.FC = () => {
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
      <div className="bg-white border border-sky-200/80 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <span>Showroom Messenger & WhatsApp Hub</span>
            </h1>
            <p className="text-xs text-slate-500">
              Automated customer messaging for order readiness, Karagir job challans, and daily gold rates.
            </p>
          </div>
        </div>

        <button
          onClick={handleSend}
          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Launch WhatsApp Message</span>
        </button>
      </div>

      <div className="bg-white border border-sky-200/80 rounded-xl p-5 shadow-sm space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Message Template</label>
            <select
              value={template}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
            >
              <option value="order_update">Order Ready for Delivery</option>
              <option value="scheme_due">Gold Scheme Monthly Due Reminder</option>
              <option value="daily_rate">Daily Bullion Rate Broadcast</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Customer / Party Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Mobile No.</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-blue-800 font-mono font-bold text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Message Body</label>
          <textarea
            rows={5}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs font-sans focus:border-blue-500 focus:bg-white focus:outline-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
