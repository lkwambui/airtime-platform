import { useEffect, useState } from "react";
import axios from "axios";
import AirtimeForm from "../components/AirtimeForm";
import { useToast } from "../components/ui/ToastProvider";
import api from "../services/api";
import Badge from "../components/ui/Badge";

function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-brand-600 shadow-soft ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 4v16" strokeLinecap="round" />
        <path d="M18 4l-8 8 8 8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  );
}

function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.19 19a19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-2.92-8.63A2 2 0 0 1 4.27 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.36a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function BoltIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3 5 6v6c0 5 3.4 8 7 9 3.6-1 7-4 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
    <div className="min-h-screen w-full bg-slate-100 px-4 py-8 md:py-10">
      <div className="container-screen">
        <header className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <p className="text-2xl font-extrabold tracking-tight">
              <span className="text-amber-500">Kredo</span>{" "}
              <span className="text-brand-700">Chapchap</span>
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft ring-2 ring-white/70 md:px-5 md:py-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <ClockIcon />
            </span>
            <span className="leading-none">
              Nairobi Time <span className="ml-1 font-bold">{nairobiTime}</span>
            </span>
          </div>
        </header>

        <section className="mb-7 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-amber-500 md:text-5xl">Buy Airtime</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Fast, secure, and instant delivery</p>
          <div className="mt-4 flex justify-center">
            <Badge variant={inStock ? "success" : "danger"} className="px-5 py-2 text-sm shadow-soft">
              {inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/70 bg-white shadow-soft">
          <div className="grid lg:grid-cols-[360px_1fr]">
            <aside className="order-2 relative overflow-hidden bg-[#01263d] p-6 text-white md:p-8 lg:order-1">
              <h2 className="text-3xl font-bold leading-tight">Why Choose Us</h2>
              <p className="mt-2 text-sm text-slate-200">Reliable airtime checkout with better value.</p>

              <ul className="mt-8 space-y-4 text-sm text-slate-100">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                    <BoltIcon className="h-3.5 w-3.5" />
                  </span>
                  <span>Better value with regularly updated discounted rates.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                    <PhoneIcon className="h-3.5 w-3.5" />
                  </span>
                  <span>Near-instant airtime delivery after successful payment.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                    <ShieldIcon className="h-3.5 w-3.5" />
                  </span>
                  <span>Secure M-PESA STK Push checkout flow.</span>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-soft ring-1 ring-white/25"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                      <span className="text-base leading-none">%</span>
                    </span>
                    Today&apos;s rate: {settingsLoading ? "..." : `${rate}%`}
                  </button>
                </li>
              </ul>

              <div className="pointer-events-none absolute -bottom-12 -right-10 h-44 w-44 rounded-full bg-white/15" />
              <div className="pointer-events-none absolute bottom-8 right-16 h-28 w-28 rounded-full bg-white/10" />
            </aside>

            <div className="order-1 p-6 md:p-8 lg:order-2">
              {selectedAmount > 0 && (
                <div className="mb-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
                  You are about to pay <span className="font-semibold">KES {selectedAmount.toLocaleString()}</span>.
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
                  {error}
                </div>
              )}

              {inStock ? (
                <AirtimeForm
                  mode="SELF"
                  loading={loading || settingsLoading}
                  onAmountChange={setSelectedAmount}
                  onSubmit={submit}
                />
              ) : (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-center font-semibold text-rose-700">
                  Airtime is currently out of stock. Please check again later.
                </div>
              )}

              <div className="mt-5 text-center text-xs font-medium text-slate-500">
                Secured by M-PESA • Transparent totals before payment
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 rounded-2xl bg-[#01263d] px-5 py-8 text-white md:px-8">
          <div className="flex flex-col items-center justify-center gap-3 border-b border-white/20 pb-5 text-center">
            <LogoMark className="h-11 w-11" />
            <p className="text-4xl font-bold tracking-tight">
              <span className="text-amber-400">Kredo</span>{" "}
              <span className="text-brand-200">ChapChap</span>
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/90">Contact</h3>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              <p className="flex items-center gap-2 text-sm text-white/80"><PhoneIcon /> +254 700 000 000</p>
              <p className="flex items-center gap-2 text-sm text-white/80"><MailIcon /> info@codesolveafrica.co.ke</p>
              <p className="flex items-center gap-2 text-sm text-white/80"><LocationIcon /> Nairobi, Kenya</p>
            </div>
          </div>

          <div className="mt-6 border-t border-white/20 pt-4 text-center text-xs text-white/80">
            Made with love ❤️ by{" "}
            <a
              href="https://codesolveafrica.co.ke"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-amber-300 underline-offset-2 hover:underline"
            >
              codesolveafrica
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}