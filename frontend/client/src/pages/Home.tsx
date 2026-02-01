import { useEffect, useState } from "react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

import Header from "../components/Header";
import RateDisplay from "../components/RateDisplay";
import BuyModeToggle from "../components/BuyModeToggle";
import type { BuyMode } from "../components/BuyModeToggle";
import AirtimeForm from "../components/AirtimeForm";
import AirtimePreview from "../components/AirtimePreview";

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
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-linear-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-linear-to-br from-gray-50 via-white to-gray-50'} flex justify-center items-center px-4 py-6 md:py-12`}>
      <div className={`w-full max-w-lg ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-xl rounded-3xl ${theme === 'dark' ? 'border border-slate-700/50' : 'border border-gray-200/50'} shadow-2xl p-8 space-y-6 hover:shadow-2xl transition-shadow duration-300`}>
        <Header />

        {success && (
          <div className={`${theme === 'dark' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'} border rounded-xl p-4 text-sm font-medium animate-fade-in`}>
            ✓ STK Push sent successfully! Check your phone.
          </div>
        )}

        {error && (
          <div className={`${theme === 'dark' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-red-50 border-red-200 text-red-700'} border rounded-xl p-4 text-sm font-medium`}>
            ✕ {error}
          </div>
        )}

        <RateDisplay rate={rate} inStock={inStock} />

        <BuyModeToggle mode={mode} onChange={setMode} />

        <AirtimePreview amount={amount} rate={rate} />

        <AirtimeForm
          mode={mode}
          onSubmit={(data) => {
            setAmount(data.amount);
            submit(data);
          }}
          loading={loading}
        />
      </div>
    </div>
  );
}
