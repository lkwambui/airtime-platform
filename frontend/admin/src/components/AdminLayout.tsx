import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30">
      <Topbar />
      <div className="container-screen py-5 md:py-8">
        <div className="grid gap-5 lg:grid-cols-[240px_1fr] lg:gap-6">
          <Sidebar />
          <main className="min-h-[68vh] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
            <Outlet />
          </main>
        </div>

        <footer className="mt-6 rounded-2xl bg-[#01263d] px-5 py-4 text-white shadow-soft">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-lg font-semibold tracking-tight">
              <span className="text-amber-400">Kredo</span>{" "}
              <span className="text-brand-200">ChapChap</span>
            </p>
            <p className="text-xs text-white/80">
              © {year} Airtime Admin Console • Secure operational management
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
