interface StockStatusProps {
  inStock: boolean;
  children: React.ReactNode;
}

function StockStatus({ inStock, children }: StockStatusProps) {
  if (!inStock) {
    return (
      <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 p-4 rounded mt-4 text-center">
        <p className="text-lg font-semibold text-red-700">
          🚫 Airtime Currently Out of Stock
        </p>
        <p className="text-sm mt-1 text-red-600">Please check back later.</p>
      </div>
    );
  }

  return <>{children}</>;
}

export default StockStatus;
