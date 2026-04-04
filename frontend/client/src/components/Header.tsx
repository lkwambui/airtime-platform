import Badge from "./ui/Badge";

export default function Header() {
  return (
    <header className="space-y-3 text-center">
      <div className="mb-2 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-soft">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </div>
      </div>
      <h1 className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
        Kredo ChapChap
      </h1>
      <div className="flex justify-center">
        <Badge variant="brand">FAST • SECURE • INSTANT</Badge>
      </div>
    </header>
  );
}
