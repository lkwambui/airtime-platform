import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-brand-50/20">
      <Topbar />
      <div className="container-screen py-5 md:py-7">
        <div className="flex gap-5 lg:gap-6">
          {/* Sidebar — self-sizing; transitions handle collapse animation */}
          <div className="hidden shrink-0 lg:block">
            <Sidebar />
          </div>

          {/* Main content */}
          <main className="min-h-[72vh] flex-1 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 md:p-7">
            <Outlet />
          </main>
        </div>

        <footer className="mt-5 rounded-2xl border border-slate-200/60 bg-slate-900 px-5 py-4 text-white shadow-xl">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-bold tracking-tight">
              <span className="text-amber-400">Kredo</span>{" "}
              <span className="text-brand-300">ChapChap</span>
            </p>
            <p className="text-xs text-white/50">
              © {year} Airtime Admin Console • All systems operational
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
