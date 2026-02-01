import { useTheme } from "../context/ThemeContext";

type Props = {
  amount: number;
  rate: number;
};

export default function AirtimePreview({ amount, rate }: Props) {
  const { theme } = useTheme();
  const airtime = amount > 0 ? (amount * rate) / 100 : 0;

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
      <div className={`relative ${theme === 'dark' ? 'bg-linear-to-br from-slate-700 to-slate-800' : 'bg-linear-to-br from-gray-100 to-gray-50'} ${theme === 'dark' ? 'border-slate-600/50' : 'border-gray-200/50'} border rounded-2xl p-6 text-center space-y-2`}>
        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-gray-800'} uppercase tracking-wider`}>You will receive</p>
        <div className="text-4xl md:text-5xl font-bold bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
          KES {airtime.toFixed(2)}
        </div>
        <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-800'}`}>in airtime credit</p>
      </div>
    </div>
  );
}
