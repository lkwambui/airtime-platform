import { useEffect, useState } from "react";
import api from "../services/api";

export default function Settings() {
  const [rate, setRate] = useState(0);
  const [inStock, setInStock] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/settings").then((res) => {
      setRate(res.data.rate);
      setInStock(res.data.inStock);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await api.post("/settings", { rate, inStock });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-700">Configuration</p>
        <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <label className="text-sm font-medium text-slate-800">Airtime Rate</label>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            <span className="text-sm text-slate-800">KES</span>
          </div>
          <p className="mt-2 text-xs text-slate-700">
            Update the rate used for airtime conversions.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <label className="text-sm font-medium text-slate-800">Airtime Stock</label>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-700">
                {inStock ? "In Stock" : "Out of Stock"}
              </p>
              <p className="text-xs text-slate-700">
                Toggle availability for customers.
              </p>
            </div>
            <button
              onClick={() => setInStock((prev) => !prev)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                inStock ? "bg-brand-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                  inStock ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
