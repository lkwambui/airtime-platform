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
    <section className="bg-gradient-to-br from-gray-100 via-gray-200 to-white backdrop-blur-xl border border-gray-400 rounded-3xl shadow-xl p-6 md:p-8 transition-all duration-300">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-700">
          Why Choose Kredo ChapChap
        </p>
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900">
          Better rates, faster airtime, zero guesswork.
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:gap-4">
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            className="bg-white border border-gray-300 rounded-2xl p-4 md:p-5 flex items-start gap-3 md:gap-4"
          >
            <span className="bg-gray-200 w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-base md:text-lg shrink-0">
              {benefit.icon}
            </span>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-900 md:text-base">
                {benefit.title}
              </h3>
              <p className="text-xs leading-relaxed text-gray-700 md:text-sm">
                {benefit.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl px-4 py-3 text-sm font-medium text-center bg-gray-100 text-gray-800 border border-gray-400">
        Trusted checkout with M-PESA • Transparent totals before payment
      </div>
    </section>
  );
}

export default WhyBuy;
