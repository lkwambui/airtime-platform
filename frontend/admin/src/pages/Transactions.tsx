import { useEffect, useState } from "react";
import api from "../services/api";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import PinModal from "../components/PinModal";

type Transaction = {
  id: number;
  receiver_phone: string;
  amount_paid: number;
  airtime_value: number;
  status: string;
  created_at: string;
  assigned_device?: string;
};

type PendingAction =
  | { type: "retry"; transactionId: number }
  | { type: "force"; transactionId: number }
  | null;

const statusFilters = ["ALL", "SUCCESS", "WAITING_ETOPUP", "FAILED"];

function getStatusBadgeVariant(status: string): "success" | "danger" | "warning" {
  if (status === "SUCCESS") return "success";
  if (status === "FAILED") return "danger";
  return "warning";
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const fetchTransactions = async () => {
    const res = await api.get("/admin/transactions");
    setTransactions(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let data = transactions;

    if (status !== "ALL") {
      data = data.filter((t) => t.status === status);
    }

    if (search) {
      data = data.filter((t) => t.receiver_phone.includes(search));
    }

    setFiltered(data);
  }, [status, search, transactions]);

  const confirmAction = async (pin: string) => {
    if (!pendingAction) return;

    const endpoint =
      pendingAction.type === "retry"
        ? `/admin/retry/${pendingAction.transactionId}`
        : `/admin/force-success/${pendingAction.transactionId}`;

    await api.post(endpoint, { pin, admin: "admin" });
    await fetchTransactions();
    setPendingAction(null);
  };

  return (
    <div className="app-section">
      <PageHeader
        eyebrow="Activity"
        title="Transactions"
        description="Monitor all payment attempts and trigger administrative recovery actions."
      />

      <Card className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Input
            containerClassName="w-full md:max-w-xs"
          placeholder="Search phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <Button
                key={filter}
                variant={status === filter ? "primary" : "secondary"}
                size="sm"
                onClick={() => setStatus(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">No transactions found.</p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Phone</th>
                  <th className="pb-3 pr-4">Paid</th>
                  <th className="pb-3 pr-4">Airtime</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Device</th>
                  <th className="pb-3 pr-4">Time</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 text-slate-700 transition hover:bg-slate-50/80">
                    <td className="py-3 pr-4 font-medium text-slate-900">{t.id}</td>
                    <td className="py-3 pr-4">{t.receiver_phone}</td>
                    <td className="py-3 pr-4">{t.amount_paid}</td>
                    <td className="py-3 pr-4">{t.airtime_value}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={getStatusBadgeVariant(t.status)}>{t.status}</Badge>
                    </td>
                    <td className="py-3 pr-4">{t.assigned_device || "-"}</td>
                    <td className="py-3 pr-4">{new Date(t.created_at).toLocaleTimeString()}</td>
                    <td className="py-3">
                      {t.status !== "SUCCESS" ? (
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              setPendingAction({ type: "retry", transactionId: t.id })
                            }
                          >
                            Retry
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setPendingAction({ type: "force", transactionId: t.id })
                            }
                          >
                            Force
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <PinModal
        open={pendingAction !== null}
        title="Authorize Action"
        description="Enter your admin PIN to continue."
        confirmLabel={pendingAction?.type === "retry" ? "Retry Transaction" : "Force Success"}
        onClose={() => setPendingAction(null)}
        onConfirm={confirmAction}
      />
    </div>
  );
}