import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container-screen flex items-center justify-between py-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">Airtime Platform</p>
          <h1 className="text-xl font-semibold text-slate-900">Admin Dashboard</h1>
        </div>
        <button
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
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
