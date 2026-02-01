import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="text-center space-y-3">
      <div className="flex justify-between items-start">
        <div />
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-lg bg-slate-700/30 dark:bg-slate-700/30 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 5v1m0 13v1M5.22 5.22l.707.707m9.242 9.242l.707.707M5 12H4m16 0h-1m-.22-6.78l-.707.707m-9.242 9.242l-.707.707" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex justify-center mb-2">
        <div className="w-12 h-12 bg-linear-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
        Loveline Airtime
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 tracking-wide font-semibold">FAST • SECURE • INSTANT</p>
    </header>
  );
}
