import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-between gap-12 px-6">
        <div className="hidden max-w-lg lg:block">
          <span className="inline-flex items-center rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700">
            Airtime Admin Console
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900">
            Manage airtime sales, settings, and transactions with confidence.
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Secure access for administrators. Track performance, update rates, and
            review activity in real-time.
          </p>
        </div>

        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Welcome back</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                Sign in to Admin
              </h2>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              Secure
            </span>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Username</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                placeholder="admin"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Password</label>
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {error}
              </div>
            )}
            <button
              onClick={submit}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Use your admin credentials to access the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
