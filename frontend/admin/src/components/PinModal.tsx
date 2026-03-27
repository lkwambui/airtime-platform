import { useState } from "react";

export default function PinModal({ onConfirm, onClose }: any) {
  const [pin, setPin] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl space-y-4">
        <h3>Enter Admin PIN</h3>

        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="border px-3 py-2"
        />

        <div className="flex gap-2">
          <button onClick={() => onConfirm(pin)}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}