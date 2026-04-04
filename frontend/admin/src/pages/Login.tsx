import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await api.post("/admin/login", { username, password });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/50 to-slate-100">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-8 md:px-6 lg:grid-cols-[1fr_460px]">
        <div className="hidden max-w-lg lg:block">
          <span className="inline-flex items-center rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700">
            Airtime Admin Console
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-slate-900">
            Manage airtime sales, settings, and transactions with confidence.
          </h1>
          <p className="mt-4 text-base text-slate-700">
            Secure access for administrators. Track performance, update rates, and
            review activity in real-time.
          </p>
        </div>

        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Welcome back</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Sign in to Admin
              </h2>
            </div>
            <Badge variant="brand">Secure</Badge>
          </div>

          <div className="mt-7 space-y-4">
            <Input
              label="Username"
              placeholder="admin"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {error}
              </div>
            )}
            <Button
              onClick={submit}
              disabled={loading}
              fullWidth
              size="lg"
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-700">
            Use your admin credentials to access the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
