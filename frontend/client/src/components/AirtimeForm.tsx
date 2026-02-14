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
    <form className="w-full flex flex-col items-center gap-4" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
      <div className="w-full flex flex-col gap-2">
        <input
          type="tel"
          placeholder="Your Phone Number"
          value={payerPhone}
          onChange={(e) => setPayerPhone(e.target.value)}
          disabled={loading}
          className={`w-full ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        {mode === "OTHER" && (
          <input
            type="tel"
            placeholder="Recipient Phone Number"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
            disabled={loading}
            className={`w-full ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        )}
        <input
          type="number"
          placeholder="Amount (KES)"
          value={amount || ""}
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={loading}
          className={`w-full ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      </div>
      <button
        type="submit"
        disabled={!isFormValid || loading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-500 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center gap-2 text-base disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </form>
  );
}
