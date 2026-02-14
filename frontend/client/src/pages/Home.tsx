import { useEffect, useState } from "react";
import axios from "axios";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

import Header from "../components/Header";
import RateDisplay from "../components/RateDisplay";
import BuyModeToggle from "../components/BuyModeToggle";
import type { BuyMode } from "../components/BuyModeToggle";
import AirtimeForm from "../components/AirtimeForm";
import AirtimePreview from "../components/AirtimePreview";
import WhyBuy from "../components/WhyBuy";

export default function Home() {
  const { theme } = useTheme();
  const [rate, setRate] = useState(0);
  const [inStock, setInStock] = useState(true);
  const [mode, setMode] = useState<BuyMode>("SELF");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get("/settings").then((res) => {
      setRate(res.data.rate);
      setInStock(res.data.inStock);
    });
  }, []);

  const submit = async (data: {
    payerPhone: string;
    receiverPhone: string;
    amount: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      setAmount(data.amount);
      await api.post("/payments/pay", data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          (err.response?.data as { message?: string } | undefined)?.message ||
            err.message ||
            "Transaction failed",
        );
      } else {
        setError(err instanceof Error ? err.message : "Transaction failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'} flex justify-center items-center px-2 py-6 md:py-12`}>
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Why Buy Section - Left Side on desktop, Below on mobile */}
        <div className="w-full md:w-1/2 md:sticky md:top-8 order-2 md:order-1">
          <WhyBuy />
        </div>

        {/* Main Form Section - Right Side on desktop, Above on mobile */}
        <div className={`w-full max-w-md mx-auto ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-white/90'} backdrop-blur-xl rounded-2xl ${theme === 'dark' ? 'border border-slate-800/60' : 'border border-gray-200/70'} shadow-xl p-6 md:p-8 space-y-6 order-1 md:order-2 transition-shadow duration-300`}>
          <Header />

          {success && (
            <div className={`${theme === 'dark' ? 'bg-emerald-600/20 border-emerald-600/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'} border rounded-lg p-3 text-sm font-medium animate-fade-in`}>
              ✓ STK Push sent successfully! Check your phone.
            </div>
          )}

          {error && (
            <div className={`${theme === 'dark' ? 'bg-red-600/20 border-red-600/40 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} border rounded-lg p-3 text-sm font-medium`}>
              ✕ {error}
            </div>
          )}

          <RateDisplay rate={rate} inStock={inStock} />

          <BuyModeToggle mode={mode} onChange={setMode} />

          <AirtimePreview amount={amount} rate={rate} />

          {inStock ? (
            <AirtimeForm
              mode={mode}
              onSubmit={(data) => {
                setAmount(data.amount);
                submit(data);
              }}
              loading={loading}
            />
          ) : (
            <div className={`${theme === 'dark' ? 'bg-red-600/20 border-red-600/40 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} border rounded-lg p-3 text-center font-semibold`}>
              Airtime is currently out of stock. Please check again later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
