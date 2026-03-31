
import { useState } from "react";
// ...existing code...

export type BuyMode = "SELF" | "OTHER";

type Props = {
  mode: BuyMode;
  loading: boolean;

  // 🔥 ADD THIS
  onAmountChange: (amount: number) => void;

  onSubmit: (data: {
    payerPhone: string;
    receiverPhone: string;
    amount: number;
  }) => void;
};

export default function AirtimeForm({
  mode,
  loading,
  onSubmit,
  onAmountChange, // 🔥 RECEIVE
}: Props) {
  // ...existing code...


  const [tab, setTab] = useState<BuyMode>(mode);
  const [payerPhone, setPayerPhone] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [amount, setAmount] = useState<number>(0);

  const isFormValid =
    payerPhone && amount > 0 && (tab === "SELF" || receiverPhone);

  const handleSubmit = () => {
    onSubmit({
      payerPhone,
      receiverPhone: tab === "OTHER" ? receiverPhone : payerPhone,
      amount,
    });
  };

  return (
    <form
      className="w-full flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* Tabs */}
      <div className="flex mb-2 bg-gray-100 rounded-xl overflow-hidden">
        <button
          type="button"
          className={`flex-1 py-2 text-sm font-semibold transition-all ${tab === "SELF" ? "bg-white shadow text-blue-700" : "text-gray-500 hover:text-blue-700"}`}
          onClick={() => setTab("SELF")}
          disabled={loading}
        >
          <span className="inline-flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>My Number</span>
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-sm font-semibold transition-all ${tab === "OTHER" ? "bg-white shadow text-purple-700" : "text-gray-500 hover:text-purple-700"}`}
          onClick={() => setTab("OTHER")}
          disabled={loading}
        >
          <span className="inline-flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" /></svg>Gift</span>
        </button>
      </div>

      {/* Phone Number */}
      <div className="relative mb-2">
        <input
          type="tel"
          placeholder="07XX XXX XXX"
          value={payerPhone}
          onChange={(e) => setPayerPhone(e.target.value)}
          disabled={loading}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pl-10 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        </span>
      </div>

      {/* Recipient Number */}
      {tab === "OTHER" && (
        <div className="relative mb-2">
          <input
            type="tel"
            placeholder="Recipient Phone Number"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
            disabled={loading}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pl-10 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" /></svg>
          </span>
        </div>
      )}

      {/* Amount */}
      <div className="mb-2">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount || ""}
          onChange={(e) => {
            const value = Math.max(0, Math.floor(Number(e.target.value)));
            setAmount(value);
            onAmountChange(value);
          }}
          disabled={loading}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Quick-select amounts */}
      <div className="flex gap-2 mb-2">
        {[100, 200, 500, 1000].map((amt) => (
          <button
            key={amt}
            type="button"
            className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${amount === amt ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50"}`}
            onClick={() => {
              setAmount(amt);
              onAmountChange(amt);
            }}
            disabled={loading}
          >
            {amt}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid || loading}
        className="w-full py-3 rounded-lg font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 disabled:bg-gray-300 disabled:text-gray-400 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        aria-busy={loading}
        aria-label="Continue to Payment"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Processing...
          </>
        ) : (
          <>
            Continue to Payment <span className="ml-1"><svg className="w-5 h-5 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span>
          </>
        )}
      </button>
    </form>
  );
}