type Props = {
  rate: number;
  inStock: boolean;
};

export default function RateDisplay({ rate, inStock }: Props) {
  return (
    <div className="bg-gradient-to-r from-gray-100 to-white border border-gray-400 rounded-2xl p-6 backdrop-blur-sm hover:border-gray-500 transition-all duration-300">
      {inStock ? (
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-gray-800 uppercase tracking-wider">Today&apos;s Rate</p>
          <div className="text-5xl font-bold text-gray-900">
            {rate}%
          </div>
          <p className="text-xs font-semibold text-gray-700">● In Stock</p>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-gray-800 uppercase tracking-wider">Status</p>
          <p className="text-2xl font-bold text-gray-700">Out of Stock</p>
          <p className="text-xs font-semibold text-gray-700">● Unavailable</p>
        </div>
      )}
    </div>
  );
}
