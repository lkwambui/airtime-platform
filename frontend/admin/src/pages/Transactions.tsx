import { useEffect, useState } from "react";
import api from "../services/api";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import PinModal from "../components/PinModal";
import ManualAirtime from "../components/ManualAirtime";
import { cn } from "../utils/cn";

type Transaction = {
  id: number;
  payer_phone: string | null;
  receiver_phone: string;
  amount_paid: number | null;
  airtime_value: number;
  rate_used: number | null;
  status: string;
  mpesa_reference: string | null;
  checkout_request_id: string | null;
  assigned_device: string | null;
  balance_before: number | null;
  balance_after: number | null;
  retried_by: string | null;
  retried_at: string | null;
  created_at: string;
  updated_at: string | null;
};

type PendingAction =
  | { type: "retry"; transactionId: number }
  | { type: "force"; transactionId: number }
  | null;

type Tab = "mpesa" | "airtime" | "manual";

function getStatusBadgeVariant(status: string): "success" | "danger" | "warning" {
  if (status === "SUCCESS") return "success";
  if (status === "FAILED" || status === "FAILED_WAITING_ETOPUP") return "danger";
  return "warning";
}

function fmt(dt: string) {
  return new Date(dt).toLocaleString();
}

// ─── M-Pesa Tab ──────────────────────────────────────────────────────────────
function MpesaTab({
  transactions,
  search,
  setSearch,
}: {
  transactions: Transaction[];
  search: string;
  setSearch: (v: string) => void;
}) {
  const mpesa = transactions.filter((t) => t.payer_phone != null);
  const filtered = search
    ? mpesa.filter(
        (t) =>
          t.payer_phone?.includes(search) ||
          t.receiver_phone.includes(search) ||
          t.mpesa_reference?.includes(search) ||
          t.checkout_request_id?.includes(search),
      )
    : mpesa;

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Input
          containerClassName="w-full md:max-w-xs"
          placeholder="Search phone or ref..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">No M-Pesa transactions found.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-3 pr-4">M-Pesa Ref</th>
                <th className="pb-3 pr-4">Paid By</th>
                <th className="pb-3 pr-4">To Receive Airtime</th>
                <th className="pb-3 pr-4">Amount Paid</th>
                <th className="pb-3 pr-4">Time</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-slate-100 text-slate-700 transition hover:bg-slate-50/80"
                >
                  <td className="py-3 pr-4 font-mono text-xs text-slate-600">
                    {t.mpesa_reference || t.checkout_request_id || `#${t.id}`}
                  </td>
                  <td className="py-3 pr-4">{t.payer_phone ?? "—"}</td>
                  <td className="py-3 pr-4">{t.receiver_phone}</td>
                  <td className="py-3 pr-4">KES {t.amount_paid?.toLocaleString() ?? "—"}</td>
                  <td className="py-3 pr-4 text-xs text-slate-500">{fmt(t.created_at)}</td>
                  <td className="py-3">
                    <Badge variant={getStatusBadgeVariant(t.status)}>
                      {t.status === "SUCCESS" || t.status === "FAILED" ? t.status : "PENDING"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}

// ─── Airtime Tab ─────────────────────────────────────────────────────────────
function AirtimeTab({
  transactions,
  onRetry,
  onForce,
  search,
  setSearch,
}: {
  transactions: Transaction[];
  onRetry: (id: number) => void;
  onForce: (id: number) => void;
  search: string;
  setSearch: (v: string) => void;
}) {
  const waiting = transactions.filter(
    (t) => t.status === "WAITING_ETOPUP" || t.status === "WAITING_DEVICE",
  );

  const all = search
    ? transactions.filter((t) => t.receiver_phone.includes(search))
    : transactions;

  return (
    <div className="space-y-6">
      {/* Waiting queue */}
      <Card
        title="Waiting ETopUp"
        description="Transactions queued and waiting for airtime delivery."
        className="space-y-3"
      >
        {waiting.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No pending transactions — queue is clear.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4">Number to Receive</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Device</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {waiting.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-slate-100 text-slate-700 transition hover:bg-slate-50/80"
                  >
                    <td className="py-3 pr-4 font-medium text-slate-900">{t.receiver_phone}</td>
                    <td className="py-3 pr-4">KES {t.airtime_value.toLocaleString()}</td>
                    <td className="py-3 pr-4">{t.assigned_device ?? "—"}</td>
                    <td className="py-3">
                      <Badge variant="warning">{t.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Full airtime transactions */}
      <Card className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            containerClassName="w-full md:max-w-xs"
            placeholder="Search phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          {all.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">No airtime transactions found.</p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4">Amount Paid</th>
                  <th className="pb-3 pr-4">Airtime Sent</th>
                  <th className="pb-3 pr-4">Number Sent To</th>
                  <th className="pb-3 pr-4">Rate</th>
                  <th className="pb-3 pr-4">Device</th>
                  <th className="pb-3 pr-4">Time</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">APK Response</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {all.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-slate-100 text-slate-700 transition hover:bg-slate-50/80"
                  >
                    <td className="py-3 pr-4">
                      {t.amount_paid != null ? `KES ${t.amount_paid.toLocaleString()}` : "—"}
                    </td>
                    <td className="py-3 pr-4">KES {t.airtime_value.toLocaleString()}</td>
                    <td className="py-3 pr-4">{t.receiver_phone}</td>
                    <td className="py-3 pr-4">
                      {t.rate_used != null ? `${t.rate_used}%` : "—"}
                    </td>
                    <td className="py-3 pr-4">{t.assigned_device ?? "—"}</td>
                    <td className="py-3 pr-4 text-xs text-slate-500">{fmt(t.created_at)}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={getStatusBadgeVariant(t.status)}>{t.status}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-500">
                      {t.balance_before != null || t.balance_after != null ? (
                        <span>
                          {t.balance_before != null ? `${t.balance_before}` : "?"} →{" "}
                          {t.balance_after != null ? `${t.balance_after}` : "?"}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3">
                      {t.status !== "SUCCESS" ? (
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onRetry(t.id)}
                          >
                            Retry
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onForce(t.id)}
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
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tab, setTab] = useState<Tab>("mpesa");
  const [search, setSearch] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const fetchTransactions = async () => {
    const res = await api.get("/admin/transactions");
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  // Reset search on tab change
  const switchTab = (t: Tab) => {
    setTab(t);
    setSearch("");
  };

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

  const tabs: { key: Tab; label: string }[] = [
    { key: "mpesa", label: "M-Pesa" },
    { key: "airtime", label: "Airtime" },
    { key: "manual", label: "Manual" },
  ];

  return (
    <div className="app-section">
      <PageHeader
        eyebrow="Activity"
        title="Transactions"
        description="Monitor M-Pesa payments, airtime delivery, and manual requests."
      />

      {/* Tab switcher */}
      <div className="flex gap-2 border-b border-slate-200 pb-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => switchTab(t.key)}
            className={cn(
              "rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-colors",
              tab === t.key
                ? "border-b-2 border-brand-600 text-brand-700"
                : "text-slate-500 hover:text-slate-800",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "mpesa" && (
        <MpesaTab
          transactions={transactions}
          search={search}
          setSearch={setSearch}
        />
      )}

      {tab === "airtime" && (
        <AirtimeTab
          transactions={transactions}
          onRetry={(id) => setPendingAction({ type: "retry", transactionId: id })}
          onForce={(id) => setPendingAction({ type: "force", transactionId: id })}
          search={search}
          setSearch={setSearch}
        />
      )}

      {tab === "manual" && (
        <ManualAirtime onQueued={fetchTransactions} transactions={transactions} />
      )}

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