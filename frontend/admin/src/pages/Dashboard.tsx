export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Overview</p>
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Transactions", value: "—" },
          { label: "Revenue Today", value: "—" },
          { label: "Airtime In Stock", value: "—" },
          { label: "Pending Orders", value: "—" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
        <p className="mt-2 text-sm text-slate-500">
          Review transactions and update settings in the sidebar.
        </p>
      </div>
    </div>
  );
}
