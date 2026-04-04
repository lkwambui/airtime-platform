import { useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { cn } from "../utils/cn";

export type BuyMode = "SELF" | "OTHER";

type Props = {
  mode: BuyMode;
  loading: boolean;
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
  onAmountChange,
}: Props) {
  const [tab, setTab] = useState<BuyMode>(mode);
  const [payerPhone, setPayerPhone] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [amount, setAmount] = useState<number>(0);

  const isFormValid =
    payerPhone && amount > 0 && (tab === "SELF" || receiverPhone);

  const sanitizePhone = (value: string) => value.replace(/\D/g, "").slice(0, 10);

  const handleSubmit = () => {
    onSubmit({
      payerPhone,
      receiverPhone: tab === "OTHER" ? receiverPhone : payerPhone,
      amount,
    });
  };

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-1">
        <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
            className={cn(
              "rounded-lg px-3 py-2.5 text-sm font-semibold transition-all",
              tab === "SELF"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900",
            )}
          onClick={() => setTab("SELF")}
          disabled={loading}
        >
            My Number
        </button>
        <button
          type="button"
            className={cn(
              "rounded-lg px-3 py-2.5 text-sm font-semibold transition-all",
              tab === "OTHER"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900",
            )}
          onClick={() => setTab("OTHER")}
          disabled={loading}
        >
            Gift
        </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="payerPhone"
          type="tel"
          label="M-PESA Number"
          placeholder="07XXXXXXXX"
          value={payerPhone}
          onChange={(e) => setPayerPhone(sanitizePhone(e.target.value))}
          disabled={loading}
          className="rounded-none border-0 border-b border-slate-300 bg-transparent px-1 focus:border-brand-500 focus:ring-0"
          hint="Use your Safaricom number in format 07XXXXXXXX."
        />

        {tab === "OTHER" ? (
          <Input
            id="receiverPhone"
            type="tel"
            label="Recipient Number"
            placeholder="07XXXXXXXX"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(sanitizePhone(e.target.value))}
            disabled={loading}
            className="rounded-none border-0 border-b border-slate-300 bg-transparent px-1 focus:border-brand-500 focus:ring-0"
          />
        ) : (
          <Input
            id="amount"
            type="number"
            label="Amount (KES)"
            placeholder="Enter amount"
            min={1}
            value={amount || ""}
            onChange={(e) => {
              const value = Math.max(0, Math.floor(Number(e.target.value)));
              setAmount(value);
              onAmountChange(value);
            }}
            disabled={loading}
            className="rounded-none border-0 border-b border-slate-300 bg-transparent px-1 focus:border-brand-500 focus:ring-0"
            hint="Only whole numbers are accepted."
          />
        )}
      </div>

      {tab === "OTHER" && (
        <Input
          id="amount"
          type="number"
          label="Amount (KES)"
          placeholder="Enter amount"
          min={1}
          value={amount || ""}
          onChange={(e) => {
            const value = Math.max(0, Math.floor(Number(e.target.value)));
            setAmount(value);
            onAmountChange(value);
          }}
          disabled={loading}
          className="rounded-none border-0 border-b border-slate-300 bg-transparent px-1 focus:border-brand-500 focus:ring-0"
          hint="Only whole numbers are accepted."
        />
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[100, 200, 500, 1000].map((amt) => (
          <Button
            key={amt}
            type="button"
            variant={amount === amt ? "primary" : "secondary"}
            size="sm"
            onClick={() => {
              setAmount(amt);
              onAmountChange(amt);
            }}
            disabled={loading}
          >
            {amt}
          </Button>
        ))}
      </div>

      <Button
        type="submit"
        disabled={!isFormValid || loading}
        fullWidth
        size="lg"
        className="mt-1"
        aria-busy={loading}
        aria-label="Continue to Payment"
      >
        {loading ? "Processing..." : "Continue to Payment"}
      </Button>

      {!isFormValid && !loading && (
        <p className="text-center text-xs text-slate-500">Enter valid phone and amount to continue.</p>
      )}
    </form>
  );
}