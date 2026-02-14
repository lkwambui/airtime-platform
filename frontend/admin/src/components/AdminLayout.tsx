import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
      <Topbar />
      <div className="container-screen py-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <Sidebar />
          <main className="rounded-2xl bg-white/90 border border-slate-100 p-6 md:p-8 shadow-xl min-h-[60vh]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
