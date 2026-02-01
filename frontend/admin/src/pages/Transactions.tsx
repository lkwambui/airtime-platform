export default function Transactions() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Payments</p>
        <h2 className="text-2xl font-semibold text-slate-900">Transactions</h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-700">Recent activity</p>
            <p className="text-xs text-slate-500">
              Connect this view to your transactions API.
            </p>
          </div>
          <button className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            Export
          </button>
        </div>
        <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
          No transactions loaded yet.
        </div>
      </div>
    </div>
  );
}
