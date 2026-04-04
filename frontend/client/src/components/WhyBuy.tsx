import Card from "./ui/Card";

function WhyBuy() {
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
    <Card className="bg-gradient-to-br from-slate-100 via-white to-brand-50/30">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          Why Choose Kredo ChapChap
        </p>
        <h2 className="text-2xl font-bold leading-tight text-slate-900 md:text-3xl">
          Better rates, faster airtime, zero guesswork.
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:gap-4">
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-soft md:gap-4 md:p-5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-base md:h-10 md:w-10 md:text-lg">
              {benefit.icon}
            </span>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900 md:text-base">
                {benefit.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 md:text-sm">
                {benefit.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700">
        Trusted checkout with M-PESA • Transparent totals before payment
      </div>
    </Card>
  );
}

export default WhyBuy;
