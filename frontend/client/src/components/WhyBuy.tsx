import { useTheme } from "../context/ThemeContext";

function WhyBuy() {
  const { theme } = useTheme();
  
  return (
    <div className={`${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-gray-200/50'} backdrop-blur-xl border rounded-3xl shadow-2xl p-8 space-y-5 hover:shadow-2xl transition-shadow duration-300`}>
      <h2 className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Why Buy With Us?
      </h2>

      <ul className={`space-y-4 text-sm ${theme === 'dark' ? 'text-slate-200' : 'text-gray-800'}`}>
        <li className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">✅</span>
          <span className="leading-relaxed">Best discounted airtime rates updated daily</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚡</span>
          <span className="leading-relaxed">Instant airtime delivery in under 1 minute</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">📱</span>
          <span className="leading-relaxed">Buy for yourself or any Safaricom number</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">🔐</span>
          <span className="leading-relaxed">Secure payments via official M-PESA STK Push</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">👁️</span>
          <span className="leading-relaxed">Transparent pricing — see what you receive before paying</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">📦</span>
          <span className="leading-relaxed">Real-time stock availability</span>
        </li>
      </ul>
    </div>
  );
}

export default WhyBuy;
