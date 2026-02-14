import { NavLink } from "react-router-dom";


const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
    isActive
      ? "bg-cyan-100 text-cyan-700 shadow"
      : "text-slate-700 hover:bg-slate-100"
  }`;

export default function Sidebar() {
  return (
    <aside className="rounded-2xl bg-white/80 border border-slate-100 p-4 shadow-md min-w-[180px]">
      <div className="px-2 py-2 mb-2">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Menu</p>
      </div>
      <nav className="flex flex-col gap-1">
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
