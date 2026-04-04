import { useEffect, useState } from "react";
import api from "../services/api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";

export default function Settings() {
  const [rate, setRate] = useState(0);
  const [inStock, setInStock] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/settings").then((res: any) => {
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
    <div className="app-section">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Control airtime conversion rate and customer stock visibility."
      />

      <div className="app-grid lg:grid-cols-2">
        <Card>
          <Input
            type="number"
            label="Airtime Rate"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            hint="Update the rate used for airtime conversions."
          />
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">KES</p>
        </Card>

        <Card title="Airtime Stock" description="Toggle availability for customers.">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {inStock ? "In Stock" : "Out of Stock"}
              </p>
              <p className="text-xs text-slate-500">Availability shown on client purchase flow.</p>
            </div>
            <button
              onClick={() => setInStock((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                inStock ? "bg-brand-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  inStock ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
