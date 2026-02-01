import { useTheme } from "../context/ThemeContext";

type Props = {
  rate: number;
  inStock: boolean;
};

export default function RateDisplay({ rate, inStock }: Props) {
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'bg-linear-to-r from-slate-700/50 to-slate-600/50 border-slate-600/30' : 'bg-linear-to-r from-gray-100 to-gray-50 border-gray-200/50'} border rounded-2xl p-6 backdrop-blur-sm ${theme === 'dark' ? 'hover:border-slate-500/50' : 'hover:border-gray-300/50'} transition-all duration-300`}>
      {inStock ? (
        <div className="text-center space-y-2">
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-gray-800'} uppercase tracking-wider`}>Today's Rate</p>
          <div className="text-5xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {rate}%
          </div>
          <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>● In Stock</p>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-gray-800'} uppercase tracking-wider`}>Status</p>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Out of Stock</p>
          <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>● Unavailable</p>
        </div>
      )}
    </div>
  );
}
