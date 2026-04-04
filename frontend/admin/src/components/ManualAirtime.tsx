import { useState } from "react";
import api from "../services/api";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";

export default function ManualAirtime() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    const pin = prompt("Enter admin PIN");
    if (!pin) return;

    if (!phone.trim() || !Number(amount)) {
      setError("Enter a valid phone number and amount.");
      return;
    }

    setError("");
    setSending(true);

    try {
      await api.post("/admin/manual-airtime", {
        phone,
        amount: Number(amount),
        pin,
      });

      alert("Airtime queued");
      setPhone("");
      setAmount("");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card
      title="Manual Airtime"
      description="Queue a manual airtime request for a specific phone number."
      className="space-y-4"
    >
      <Input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

      <Button onClick={() => void send()} disabled={sending} fullWidth>
        {sending ? "Sending..." : "Send Airtime"}
      </Button>
    </Card>
  );
}
