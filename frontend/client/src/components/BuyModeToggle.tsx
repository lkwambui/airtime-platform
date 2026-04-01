export type BuyMode = "SELF" | "OTHER";

type Props = {
  mode: BuyMode;
  onChange: (mode: BuyMode) => void;
};

export default function BuyModeToggle({ mode, onChange }: Props) {
  return (
    <div className="bg-gray-100/50 border border-gray-200/50 rounded-xl p-1 flex gap-1 backdrop-blur-sm">
      <button
        onClick={() => onChange("SELF")}
        className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 ${
          mode === "SELF"
            ? "bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
            : "text-gray-800 hover:text-gray-900"
        }`}
        aria-pressed={mode === "SELF"}
        aria-label="Switch to My Number"
      >
        <span className="text-lg mr-2">👤</span> My Number
      </button>

      <button
        onClick={() => onChange("OTHER")}
        className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 ${
          mode === "OTHER"
            ? "bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
            : "text-gray-800 hover:text-gray-900"
        }`}
        aria-pressed={mode === "OTHER"}
        aria-label="Switch to Other Number"
      >
        <span className="text-lg mr-2">🎁</span> Other Number
      </button>
    </div>
  );
}
