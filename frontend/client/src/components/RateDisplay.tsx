import Badge from "./ui/Badge";
import Card from "./ui/Card";

type Props = {
  rate: number;
  inStock: boolean;
};

export default function RateDisplay({ rate, inStock }: Props) {
  return (
    <Card className="bg-gradient-to-r from-slate-50 to-white">
      {inStock ? (
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">Today&apos;s Rate</p>
          <div className="text-4xl font-bold text-slate-900 md:text-5xl">{rate}%</div>
          <Badge variant="success">In Stock</Badge>
        </div>
      ) : (
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">Status</p>
          <p className="text-2xl font-bold text-slate-700">Out of Stock</p>
          <Badge variant="danger">Unavailable</Badge>
        </div>
      )}
    </Card>
  );
}
