export default function Header() {
  return (
    <header className="text-center space-y-3">
      <div className="flex justify-center mb-2">
        <div className="w-12 h-12 bg-linear-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
        Kredo ChapChap
      </h1>
      <p className="text-sm text-slate-600 tracking-wide font-semibold">FAST • SECURE • INSTANT</p>
    </header>
  );
}
