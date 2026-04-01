import { useEffect, useState } from "react";
import axios from "axios";
import AirtimeForm from "../components/AirtimeForm";
import { useToast } from "../components/ui/ToastProvider";
import api from "../services/api";

function getNairobiTime() {
  return new Date().toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Africa/Nairobi",
  });
}

export default function Home() {
  const { showToast } = useToast();
  const [nairobiTime, setNairobiTime] = useState(getNairobiTime());
  const [rate, setRate] = useState(0);
  const [inStock, setInStock] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNairobiTime(getNairobiTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (!mounted) return;
        setRate(res.data.rate ?? 0);
        setInStock(Boolean(res.data.inStock));
      } catch {
        if (!mounted) return;
        setError("Unable to load latest rate. Please refresh.");
      } finally {
        if (mounted) setSettingsLoading(false);
      }
    };

    fetchSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const submit = async (data: {
    payerPhone: string;
    receiverPhone: string;
    amount: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      await api.post("/payments/pay", data);
      showToast("STK Push sent successfully! Check your phone.", "success");
      setSelectedAmount(0);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string } | undefined)?.message ||
            err.message ||
            "Transaction failed";
        setError(message);
        showToast(message, "error");
      } else {
        const message = err instanceof Error ? err.message : "Transaction failed";
        setError(message);
        showToast(message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 md:py-14">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Nairobi time: <span className="font-semibold">{nairobiTime}</span>
          </div>
        </div>

        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
          <section className="rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-widest text-blue-700">WHY CHOOSE US</span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl">Better rates, faster airtime, zero guesswork.</h1>
            <p className="mt-3 max-w-xl text-base text-gray-600 md:text-lg">Experience a simpler airtime checkout with live stock, transparent totals, and instant M-PESA flow.</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs font-semibold text-emerald-700">TODAY&apos;S RATE</p>
                <p className="mt-1 text-lg font-bold text-emerald-700">{settingsLoading ? "..." : `${rate}%`}</p>
              </div>
              <div className={`rounded-xl border p-3 ${inStock ? "border-blue-200 bg-blue-50" : "border-red-200 bg-red-50"}`}>
                <p className="text-xs font-semibold text-gray-700">STATUS</p>
                <p className={`mt-1 text-lg font-bold ${inStock ? "text-blue-700" : "text-red-700"}`}>{inStock ? "In Stock" : "Out of Stock"}</p>
              </div>
            </div>

            <ul className="mt-6 space-y-4">
              <li className="text-sm text-gray-700">💸 Better value with regularly updated discounted rates.</li>
              <li className="text-sm text-gray-700">⚡ Near-instant airtime delivery after successful payment.</li>
              <li className="text-sm text-gray-700">🔐 Secure M-PESA STK Push checkout flow.</li>
            </ul>
          </section>

          <section className="w-full">
            <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-xl md:p-8">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Buy Airtime</h2>
                  <p className="text-sm text-gray-500">Fast, secure, and instant delivery</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {selectedAmount > 0 && (
                <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  You are about to pay <span className="font-semibold">KES {selectedAmount}</span>.
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>
              )}

              {inStock ? (
                <AirtimeForm
                  mode="SELF"
                  loading={loading || settingsLoading}
                  onAmountChange={setSelectedAmount}
                  onSubmit={submit}
                />
              ) : (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center font-semibold text-red-700">Airtime is currently out of stock. Please check again later.</div>
              )}

              <div className="mt-4 text-center text-xs font-medium text-gray-500">
                Secured by M-PESA • Transparent totals before payment
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}