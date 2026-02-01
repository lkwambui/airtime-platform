function WhyBuy() {
  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
        Why Buy With Us?
      </h2>

      <ul className="space-y-3 text-sm text-gray-800 dark:text-slate-200">
        <li className="flex items-start gap-3">
          <span className="text-lg">✅</span>
          <span>Best discounted airtime rates updated daily</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-lg">⚡</span>
          <span>Instant airtime delivery in under 1 minute</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-lg">📱</span>
          <span>Buy for yourself or any Safaricom number</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-lg">🔐</span>
          <span>Secure payments via official M-PESA STK Push</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-lg">👁️</span>
          <span>Transparent pricing — see what you receive before paying</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-lg">📦</span>
          <span>Real-time stock availability</span>
        </li>
      </ul>
    </div>
  );
}

export default WhyBuy;
