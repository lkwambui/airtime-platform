import { useNavigate } from "react-router-dom";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

function LogoMark() {
  return (
    <span
      className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-brand-600 shadow-soft"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 4v16" strokeLinecap="round" />
        <path d="M18 4l-8 8 8 8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Topbar() {
  const navigate = useNavigate();
  const nairobiTime = new Date().toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Nairobi",
  });

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-screen flex items-center justify-between py-3.5">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em]">
              <span className="text-amber-500">Kredo</span>{" "}
              <span className="text-brand-700">ChapChap</span>
            </p>
            <Badge variant="brand">Admin</Badge>
          </div>
          <h1 className="mt-0.5 text-lg font-semibold text-slate-900">Operations Console</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-full bg-gradient-to-r from-brand-700 to-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-soft md:inline-flex">
            <ClockIcon />
            Nairobi {nairobiTime}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
