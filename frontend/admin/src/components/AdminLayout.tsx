import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />
      <div className="container-screen py-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <Sidebar />
          <main className="rounded-2xl bg-white p-6 shadow-soft">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
