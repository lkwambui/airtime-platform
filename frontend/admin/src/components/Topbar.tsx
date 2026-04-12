import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import Badge from "./ui/Badge";

function LogoMark() {
  return (
    <span
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-brand-600 shadow-soft"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      >
        <path
          d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function Topbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const nairobiTime = new Date().toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Nairobi",
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/90">
      <div className="container-screen flex items-center gap-4 py-3">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <LogoMark />
          <div className="hidden items-center gap-2 sm:flex">
            <p className="text-xs font-bold uppercase tracking-[0.16em]">
              <span className="text-amber-500">Kredo</span>{" "}
              <span className="text-brand-700">ChapChap</span>
            </p>
            <Badge variant="brand">Admin</Badge>
          </div>
        </div>

        {/* Search bar */}
        <div
          className={`relative hidden flex-1 md:flex items-center transition-all duration-300 ${
            searchFocused ? "max-w-lg" : "max-w-xs"
          }`}
        >
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions, devices…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all duration-200 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-2">
          {/* Live clock */}
          <div className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-700 to-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm lg:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/80" />
            Nairobi {nairobiTime}
          </div>

          {/* Notification bell */}
          <button
            aria-label="Notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* User avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-2 pr-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-brand-200 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 text-xs font-bold text-white">
                A
              </span>
              <span className="hidden sm:block">Admin</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="dropdown-enter absolute right-0 top-full mt-2 w-52 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-slate-900/5">
                <div className="border-b border-slate-100 px-4 py-2.5">
                  <p className="text-xs font-semibold text-slate-900">
                    Signed in as
                  </p>
                  <p className="text-xs text-slate-500">admin@kredo.co.ke</p>
                </div>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Settings
                </button>

                <button
                  onClick={() => {
                    navigate("/change-password");
                    setDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Change Password
                </button>

                <div className="mx-3 my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    localStorage.removeItem("adminToken");
                    navigate("/login");
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
