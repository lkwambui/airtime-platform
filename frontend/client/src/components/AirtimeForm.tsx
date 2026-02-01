import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export type BuyMode = "SELF" | "OTHER";

type Props = {
  mode: BuyMode;
  loading: boolean;
  onSubmit: (data: {
    payerPhone: string;
    receiverPhone: string;
    amount: number;
  }) => void;
};

export default function AirtimeForm({ mode, loading, onSubmit }: Props) {
  const { theme } = useTheme();
  const [payerPhone, setPayerPhone] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [amount, setAmount] = useState<number>(0);

  const isFormValid = payerPhone && amount > 0 && (mode === "SELF" || receiverPhone);

  const handleSubmit = () => {
    onSubmit({
      payerPhone,
      receiverPhone: mode === "OTHER" ? receiverPhone : payerPhone,
      amount,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="relative group">
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={payerPhone}
            onChange={(e) => setPayerPhone(e.target.value)}
            disabled={loading}
            className={`w-full ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-500' : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-400'} border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        </div>

        {mode === "OTHER" && (
          <div className="relative group">
            <input
              type="tel"
              placeholder="Recipient Phone Number"
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              disabled={loading}
              className={`w-full ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-500' : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-400'} border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </div>
        )}

        <div className="relative group">
          <input
            type="number"
            placeholder="Amount (KES)"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={loading}
            className={`w-full ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-500' : 'bg-gray-100/50 border-gray-200/50 text-gray-900 placeholder-gray-400'} border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isFormValid || loading}
        className="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <span>💳</span> Buy Airtime
          </>
        )}
      </button>
    </div>
  );
}
