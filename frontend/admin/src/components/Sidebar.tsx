import { NavLink } from "react-router-dom";
import { cn } from "../utils/cn";

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200",
    isActive
      ? "bg-brand-100 text-brand-700 shadow-sm"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
  );

export default function Sidebar() {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-24">
      <div className="mb-2 px-2 py-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Navigation</p>
      </div>
      <nav className="grid gap-1" aria-label="Admin primary navigation">
        <NavLink to="/dashboard" className={linkClasses}>
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className={linkClasses}>
          Transactions
        </NavLink>
        <NavLink to="/devices" className={linkClasses}>
          Devices
        </NavLink>
        <NavLink to="/settings" className={linkClasses}>
          Settings
        </NavLink>
        <NavLink to="/change-password" className={linkClasses}>
          Change Password
        </NavLink>
      </nav>
    </aside>
  );
}
