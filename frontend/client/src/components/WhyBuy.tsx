import { useTheme } from "../context/ThemeContext";

function WhyBuy() {
  const { theme } = useTheme();
  const benefits = [
    {
      icon: "💸",
      title: "Better Value",
      description: "Discounted airtime rates updated regularly so your money goes further.",
    },
    {
      icon: "⚡",
      title: "Fast Delivery",
      description: "Airtime is delivered almost instantly after successful payment.",
    },
    {
      icon: "📱",
      title: "Flexible Purchase",
      description: "Buy for yourself or send airtime to any Safaricom number.",
    },
    {
      icon: "🔐",
      title: "Secure Checkout",
      description: "Official M-PESA STK Push flow for safe and trusted transactions.",
    },
    {
      icon: "👁️",
      title: "Clear Pricing",
      description: "Preview exactly what you will receive before you confirm payment.",
    },
    {
      icon: "📦",
      title: "Live Availability",
      description: "Real-time stock status to avoid failed purchase attempts.",
    },
  ];
  
  return (
    <section
      className={`${
        theme === "dark"
          ? "bg-linear-to-br from-cyan-900/30 via-blue-900/20 to-slate-900/40 border-cyan-800/50"
          : "bg-linear-to-br from-cyan-50 via-blue-50 to-white border-cyan-200"
      } backdrop-blur-xl border rounded-3xl shadow-xl p-6 md:p-8 transition-all duration-300`}
    >
      <div className="space-y-2 text-center">
        <p
          className={`text-xs font-semibold uppercase tracking-[0.18em] ${
            theme === "dark" ? "text-cyan-300" : "text-cyan-700"
          }`}
        >
          Why Choose Okoa ChapChap
        </p>
        <h2
          className={`text-2xl md:text-3xl font-bold leading-tight ${
            theme === "dark" ? "text-slate-100" : "text-slate-900"
          }`}
        >
          Better rates, faster airtime, zero guesswork.
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:gap-4">
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            className={`${
              theme === "dark"
                ? "bg-slate-900/50 border-slate-700/60"
                : "bg-white/90 border-slate-200"
            } border rounded-2xl p-4 md:p-5 flex items-start gap-3 md:gap-4`}
          >
            <span
              className={`${
                theme === "dark" ? "bg-cyan-500/20" : "bg-cyan-100"
              } w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-base md:text-lg shrink-0`}
            >
              {benefit.icon}
            </span>
            <div className="space-y-1">
              <h3
                className={`text-sm font-semibold ${
                  theme === "dark" ? "text-slate-100" : "text-slate-900"
                } md:text-base`}
              >
                {benefit.title}
              </h3>
              <p
                className={`text-xs leading-relaxed ${
                  theme === "dark" ? "text-slate-300" : "text-slate-600"
                } md:text-sm`}
              >
                {benefit.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div
        className={`mt-5 rounded-2xl px-4 py-3 text-sm font-medium text-center ${
          theme === "dark"
            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
        }`}
      >
        Trusted checkout with M-PESA • Transparent totals before payment
      </div>
    </section>
  );
}

export default WhyBuy;
