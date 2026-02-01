import { NavLink } from "react-router-dom";

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-slate-800 hover:bg-slate-100"
  }`;

export default function Sidebar() {
  return (
    <aside className="rounded-2xl bg-white p-4 shadow-soft">
      <div className="px-4 py-3">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-700">
          Navigation
        </p>
      </div>
      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkClasses}>
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className={linkClasses}>
          Transactions
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
