import { useEffect, useState } from "react";
import api from "../services/api";

type Transaction = {
  id: number;
  receiver_phone: string;
  amount_paid: number;
  airtime_value: number;
  status: string;
  created_at: string;
  assigned_device?: string;
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    const res = await api.get("/transactions");
    setTransactions(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 5000); // 🔥 auto refresh
    return () => clearInterval(interval);
  }, []);

  // 🔍 Filter logic
  useEffect(() => {
    let data = transactions;

    if (status !== "ALL") {
      data = data.filter((t) => t.status === status);
    }

    if (search) {
      data = data.filter((t) =>
        t.receiver_phone.includes(search)
      );
    }

    setFiltered(data);
  }, [status, search, transactions]);

  // 🔁 Retry
  const retry = async (id: number) => {
    const pin = prompt("Enter admin PIN");
    if (!pin) return;

    await api.post('/admin/retry/${id}', {
      pin,
      admin: "admin",
    });

    fetchTransactions();
  };

  // ✅ Force success
  const forceSuccess = async (id: number) => {
    const pin = prompt("Enter admin PIN");
    if (!pin) return;

    await api.post('/admin/force-success/${id}', {
      pin,
      admin: "admin",
    });

    fetchTransactions();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-sm font-medium text-slate-700">Activity</p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Transactions
        </h2>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          placeholder="Search phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm"
        />

        {["ALL", "SUCCESS", "WAITING_ETOPUP", "FAILED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-1 rounded-lg text-xs ${
              status === s
                ? "bg-cyan-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400">
            No transactions found
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th>ID</th>
                <th>Phone</th>
                <th>Paid</th>
                <th>Airtime</th>
                <th>Status</th>
                <th>Device</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t">
                  <td>{t.id}</td>
                  <td>{t.receiver_phone}</td>
                  <td>{t.amount_paid}</td>
                  <td>{t.airtime_value}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        t.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : t.status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td>{t.assigned_device || "-"}</td>

                  <td>
                    {new Date(t.created_at).toLocaleTimeString()}
                  </td>

                  <td className="flex gap-2">
                    {t.status !== "SUCCESS" && (
                      <>
                        <button
                          onClick={() => retry(t.id)}
                          className="text-blue-600 text-xs"
                        >
                          Retry
                        </button>

                        <button
                          onClick={() => forceSuccess(t.id)}
                          className="text-green-600 text-xs"
                        >
                          Force
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}