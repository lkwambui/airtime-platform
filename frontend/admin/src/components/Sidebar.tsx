import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Smartphone,
  Settings,
  KeyRound,
  ChevronLeft,
} from "lucide-react";
import { cn } from "../utils/cn";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/devices", label: "Devices", icon: Smartphone },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/change-password", label: "Change Password", icon: KeyRound },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col rounded-2xl bg-slate-900 shadow-xl transition-all duration-300 ease-in-out lg:sticky lg:top-24 lg:h-fit",
        collapsed ? "lg:w-[68px]" : "lg:w-full",
      )}
    >
      {/* Collapse toggle — desktop only */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-5 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400 shadow-md transition-all duration-200 hover:border-slate-500 hover:text-white lg:flex"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300",
            collapsed && "rotate-180",
          )}
        />
      </button>

      {/* Section label */}
      <div
        className={cn(
          "overflow-hidden border-b border-slate-700/60 transition-all duration-300",
          collapsed ? "px-3 py-4" : "px-4 py-4",
        )}
      >
        {collapsed ? (
          <div className="mx-auto h-0.5 w-5 rounded-full bg-slate-700" />
        ) : (
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Navigation
          </p>
        )}
      </div>

      {/* Nav links */}
      <nav
        className="flex flex-col gap-0.5 p-2 pt-2.5"
        aria-label="Admin primary navigation"
      >
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
                collapsed ? "justify-center px-0 py-3" : "gap-3",
                isActive
                  ? "bg-brand-600/15 text-brand-400 before:absolute before:left-0 before:top-2 before:h-[calc(100%-16px)] before:w-[3px] before:rounded-r-full before:bg-brand-500"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100",
              )
            }
          >
            <Icon
              className={cn(
                "h-[18px] w-[18px] shrink-0 transition-all duration-200 group-hover:scale-110",
                collapsed ? "mx-auto" : "",
              )}
            />
            {!collapsed && (
              <span className="truncate transition-opacity duration-200">
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="mt-3 border-t border-slate-700/60 px-4 py-3">
          <p className="text-[10px] text-slate-600">v1.0 • Admin Console</p>
        </div>
      )}
    </aside>
  );
}
