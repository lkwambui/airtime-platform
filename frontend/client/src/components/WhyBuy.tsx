import { useTheme } from "../context/ThemeContext";

function WhyBuy() {
  const { theme } = useTheme();
  
  return (
    <div className={`${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-700/50' 
        : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200'
    } backdrop-blur-xl border rounded-3xl shadow-2xl p-8 space-y-5 hover:shadow-2xl transition-shadow duration-300`}>
      <h2 className={`text-2xl font-bold text-center ${
        theme === 'dark' ? 'text-cyan-100' : 'text-cyan-900'
      }`}>
        Why Buy With Us?
      </h2>

      <ul className={`space-y-4 text-sm ${
        theme === 'dark' ? 'text-cyan-50' : 'text-cyan-950'
      }`}>
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
