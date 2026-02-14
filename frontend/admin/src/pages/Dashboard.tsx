export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold text-cyan-700 tracking-widest uppercase">Overview</p>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Transactions", value: "—" },
          { label: "Revenue Today", value: "—" },
          { label: "Airtime In Stock", value: "—" },
          { label: "Pending Orders", value: "—" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-100 bg-white/90 p-5 flex flex-col items-center shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-100 bg-white/90 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
        <p className="mt-2 text-sm text-slate-600">
          Review transactions and update settings in the sidebar.
        </p>
      </div>
    </div>
  );
}
