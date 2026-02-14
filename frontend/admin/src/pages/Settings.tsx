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
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold text-cyan-700 tracking-widest uppercase">Configuration</p>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-white/90 p-6 shadow-sm">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Airtime Rate</label>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
            <span className="text-xs text-slate-500">KES</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Update the rate used for airtime conversions.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white/90 p-6 shadow-sm">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Airtime Stock</label>
          <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
            <div>
              <p className="text-xs font-semibold text-slate-700">
                {inStock ? "In Stock" : "Out of Stock"}
              </p>
              <p className="text-xs text-slate-500">
                Toggle availability for customers.
              </p>
            </div>
            <button
              onClick={() => setInStock((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                inStock ? "bg-cyan-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  inStock ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-cyan-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:bg-slate-400"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
