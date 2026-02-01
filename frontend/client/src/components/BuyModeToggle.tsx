import { useTheme } from "../context/ThemeContext";

export type BuyMode = "SELF" | "OTHER";

type Props = {
  mode: BuyMode;
  onChange: (mode: BuyMode) => void;
};

export default function BuyModeToggle({ mode, onChange }: Props) {
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-700/30 border-slate-600/30' : 'bg-gray-100/50 border-gray-200/50'} border rounded-xl p-1 flex gap-1 backdrop-blur-sm`}>
      <button
        onClick={() => onChange("SELF")}
        className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
          mode === "SELF"
            ? "bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
            : `${theme === 'dark' ? 'text-slate-200 hover:text-slate-100' : 'text-gray-800 hover:text-gray-900'}`
        }`}
      >
        <span className="text-lg mr-2">👤</span> My Number
      </button>

      <button
        onClick={() => onChange("OTHER")}
        className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
          mode === "OTHER"
            ? "bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
            : `${theme === 'dark' ? 'text-slate-200 hover:text-slate-100' : 'text-gray-800 hover:text-gray-900'}`
        }`}
      >
        <span className="text-lg mr-2">🎁</span> Other Number
      </button>
    </div>
  );
}
