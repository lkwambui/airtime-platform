import { useEffect, useState } from "react";
// Helper to get Nairobi time as a formatted string
function getNairobiTime() {
  return new Date().toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Africa/Nairobi",
  });
}
import axios from "axios";
import api from "../services/api";
// ...existing code...


import type { BuyMode } from "../components/BuyModeToggle";
import AirtimeForm from "../components/AirtimeForm";

export default function Home() {
    const [nairobiTime, setNairobiTime] = useState(getNairobiTime());

    // Update Nairobi time every second
    useEffect(() => {
      const interval = setInterval(() => {
        setNairobiTime(getNairobiTime());
      }, 1000);
      return () => clearInterval(interval);
    }, []);
  // ...existing code...

  const [rate, setRate] = useState(0);
  const [inStock, setInStock] = useState(true);
  const [mode] = useState<BuyMode>("SELF");

  // 🔥 THIS controls live preview
  // ...existing code...

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch rate + stock
  useEffect(() => {
    api.get("/settings").then((res) => {
      setRate(res.data.rate);
      setInStock(res.data.inStock);
    });
  }, []);

  // Submit payment
  const submit = async (data: {
    payerPhone: string;
    receiverPhone: string;
    amount: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      await api.post("/payments/pay", data);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          (err.response?.data as { message?: string } | undefined)?.message ||
            err.message ||
            "Transaction failed"
        );
      } else {
        setError(err instanceof Error ? err.message : "Transaction failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-2 py-8 md:py-16 bg-gradient-to-br from-[#e8f0ff] via-[#f6faff] to-[#e8f0ff]">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start">
        {/* LEFT: Features & Headline */}
        <section className="w-full md:w-1/2 flex flex-col justify-center items-start md:pr-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-100 text-xs font-semibold text-blue-700 tracking-widest">WHY CHOOSE US</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">Better rates, faster airtime, zero guesswork.</h1>
            <p className="text-gray-600 text-base md:text-lg mb-6 max-w-xl">Experience the easiest way to buy airtime with instant delivery and unbeatable value.</p>
            {/* Today's Rate */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-semibold text-gray-700 bg-green-100 px-2 py-1 rounded">TODAY'S RATE</span>
              <span className="text-lg font-bold text-green-700">{rate}%</span>
              <span className="text-xs text-gray-500">{inStock ? '• In Stock' : '• Out of Stock'}</span>
            </div>
          </div>
          <ul className="space-y-4 w-full">
            <li className="flex items-start gap-3"><span className="text-xl">💸</span><div><span className="font-semibold">Better Value</span><br /><span className="text-gray-600 text-sm">Discounted airtime rates updated regularly so your money goes further.</span></div></li>
            <li className="flex items-start gap-3"><span className="text-xl">⚡</span><div><span className="font-semibold">Fast Delivery</span><br /><span className="text-gray-600 text-sm">Airtime is delivered almost instantly after successful payment.</span></div></li>
            <li className="flex items-start gap-3"><span className="text-xl">📱</span><div><span className="font-semibold">Flexible Purchase</span><br /><span className="text-gray-600 text-sm">Buy for yourself or send airtime to any Safaricom number.</span></div></li>
            <li className="flex items-start gap-3"><span className="text-xl">🔐</span><div><span className="font-semibold">Secure Checkout</span><br /><span className="text-gray-600 text-sm">Official M-PESA STK Push flow for safe and trusted transactions.</span></div></li>
            <li className="flex items-start gap-3"><span className="text-xl">👁️</span><div><span className="font-semibold">Clear Pricing</span><br /><span className="text-gray-600 text-sm">Preview exactly what you will receive before you confirm payment.</span></div></li>
            <li className="flex items-start gap-3"><span className="text-xl">📦</span><div><span className="font-semibold">Live Availability</span><br /><span className="text-gray-600 text-sm">Real-time stock status to avoid failed purchase attempts.</span></div></li>
          </ul>
          <div className="mt-8 rounded-2xl px-4 py-3 text-sm font-medium text-center bg-white/80 border border-gray-200 shadow-sm text-gray-800 w-full max-w-md">Trusted checkout with M-PESA • Transparent totals before payment</div>
        </section>

        {/* RIGHT: Main Card */}
        <section className="w-full md:w-1/2 flex justify-center items-center">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6 border border-gray-200">
            <div className="flex flex-col items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-xs font-semibold text-green-700 mb-2">In Stock • Live Rates</span>
              {/* Today's Rate - Outstanding Style */}
              <span className="inline-flex items-center gap-2 mb-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg border-2 border-white text-white text-lg font-extrabold tracking-wide animate-pulse">
                <svg className="w-5 h-5 text-white opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                TODAY'S RATE: <span className="drop-shadow-lg text-2xl font-black">{rate}%</span>
              </span>
              {/* Nairobi Time - Outstanding Style */}
              <span className="inline-flex items-center gap-2 mb-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-400 shadow-lg border-2 border-white text-white text-lg font-extrabold tracking-wide animate-pulse">
                <svg className="w-5 h-5 text-white opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                NAIROBI TIME: <span className="drop-shadow-lg text-2xl font-black">{nairobiTime}</span>
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Buy Airtime</h2>
              <p className="text-gray-500 text-sm mb-2">Fast, secure, and instant delivery</p>
            </div>
            {/* SUCCESS */}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-3 text-sm font-medium">✓ STK Push sent successfully! Check your phone.</div>
            )}
            {/* ERROR */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm font-medium">✕ {error}</div>
            )}
            {/* FORM */}
            {inStock ? (
              <AirtimeForm
                mode={mode}
                loading={loading}
                onAmountChange={setAmount}
                onSubmit={submit}
              />
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-center font-semibold">Airtime is currently out of stock. Please check again later.</div>
            )}
            <div className="flex justify-center mt-4">
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>Secured by M-PESA</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}