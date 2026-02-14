import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-100 bg-white/80 shadow-sm">
      <div className="container-screen flex items-center justify-between py-3">
        <div>
          <p className="text-xs font-semibold text-cyan-700 tracking-widest uppercase">Airtime Platform</p>
          <h1 className="text-lg font-bold text-slate-900">Admin Dashboard</h1>
        </div>
        <button
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
          onClick={() => {
            localStorage.removeItem("adminToken");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
