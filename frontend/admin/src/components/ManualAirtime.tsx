import { useState } from "react";
import api from "../services/api";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";
import PinModal from "./PinModal";

type Transaction = {
  id: number;
  payer_phone: string | null;
  receiver_phone: string;
  amount_paid: number | null;
  airtime_value: number;
  status: string;
  assigned_device: string | null;
  created_at: string;
};

type Props = {
  onQueued?: () => void;
  transactions?: Transaction[];
};

function getStatusBadgeVariant(status: string): "success" | "danger" | "warning" {
  if (status === "SUCCESS") return "success";
  if (status === "FAILED" || status === "FAILED_WAITING_ETOPUP") return "danger";
  return "warning";
}

export default function ManualAirtime({ onQueued, transactions = [] }: Props) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [pinOpen, setPinOpen] = useState(false);

  const handleSend = () => {
    if (!phone.trim() || !Number(amount)) {
      setError("Enter a valid phone number and amount.");
      return;
    }
    setError("");
    setPinOpen(true);
  };

  const confirmSend = async (pin: string) => {
    setSending(true);
    setPinOpen(false);
    try {
      await api.post("/admin/manual-airtime", {
        phone,
        amount: Number(amount),
        pin,
      });
      setPhone("");
      setAmount("");
      onQueued?.();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to queue airtime.");
    } finally {
      setSending(false);
    }
  };

  // Manual transactions = no payer_phone (admin-initiated)
  const manualHistory = transactions.filter((t) => t.payer_phone == null);

  return (
    <div className="space-y-6">
      {/* Manual Purchase Form */}
      <Card
        title="Manual Purchase"
        description="Send airtime directly to a customer. This immediately enters the Waiting ETopUp queue."
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            placeholder="Customer Number (e.g. 0712345678)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Amount (KES)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

        <Button onClick={handleSend} disabled={sending}>
          {sending ? "Sending..." : "Send Airtime"}
        </Button>
      </Card>

      {/* Manual Purchase History */}
      <Card
        title="Manual Purchase History"
        description="All manually queued airtime requests."
        className="space-y-4"
      >
        {manualHistory.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No manual purchases yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Number</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Device</th>
                  <th className="pb-3 pr-4">Time</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {manualHistory.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-slate-100 text-slate-700 transition hover:bg-slate-50/80"
                  >
                    <td className="py-3 pr-4 font-medium text-slate-900">{t.id}</td>
                    <td className="py-3 pr-4">{t.receiver_phone}</td>
                    <td className="py-3 pr-4">KES {t.airtime_value.toLocaleString()}</td>
                    <td className="py-3 pr-4">{t.assigned_device ?? "—"}</td>
                    <td className="py-3 pr-4 text-xs text-slate-500">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <Badge variant={getStatusBadgeVariant(t.status)}>{t.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <PinModal
        open={pinOpen}
        title="Confirm Manual Airtime"
        description="Enter your admin PIN to queue this airtime request."
        confirmLabel="Send Airtime"
        onClose={() => setPinOpen(false)}
        onConfirm={confirmSend}
      />
    </div>
  );
}
