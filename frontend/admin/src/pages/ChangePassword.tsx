export default function ChangePassword() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Security</p>
        <h2 className="text-2xl font-semibold text-slate-900">Change Password</h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-600">Current Password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">New Password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
        </div>
        <button className="mt-6 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700">
          Update Password
        </button>
      </div>
    </div>
  );
}
