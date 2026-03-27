import { useState } from "react";
import api from "../services/api";

export default function ManualAirtime() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const send = async () => {
    const pin = prompt("Enter admin PIN");
    if (!pin) return;

    await api.post("/admin/manual-airtime", {
      phone,
      amount: Number(amount),
      pin,
    });

    alert("Airtime queued");
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-2">
      <h3>Manual Airtime</h3>

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={send}>Send</button>
    </div>
  );
}