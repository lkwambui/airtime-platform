import { useTheme } from "../context/ThemeContext";

type Props = {
  rate: number;
  inStock: boolean;
};

export default function RateDisplay({ rate, inStock }: Props) {
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700' : 'bg-gradient-to-r from-gray-100 to-white border-gray-400'} border rounded-2xl p-6 backdrop-blur-sm ${theme === 'dark' ? 'hover:border-gray-500' : 'hover:border-gray-500'} transition-all duration-300`}>
      {inStock ? (
        <div className="text-center space-y-2">
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} uppercase tracking-wider`}>Today's Rate</p>
          <div className="text-5xl font-bold text-gray-900 dark:text-gray-100">
            {rate}%
          </div>
          <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>● In Stock</p>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} uppercase tracking-wider`}>Status</p>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Out of Stock</p>
          <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-700'}`}>● Unavailable</p>
        </div>
      )}
    </div>
  );
}
