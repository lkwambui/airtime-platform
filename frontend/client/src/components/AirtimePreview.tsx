import Card from "./ui/Card";

type Props = {
  amount: number;
  rate: number;
};

export default function AirtimePreview({ amount, rate }: Props) {
  const airtime = amount > 0 ? Math.round(amount * rate) : 0;

  return (
    <Card className="border-brand-100 bg-gradient-to-br from-brand-50/70 to-white text-center">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
          You will receive
        </p>

        <div className="bg-gradient-to-r from-emerald-500 via-brand-500 to-brand-700 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          KES {airtime}
        </div>

        <p className="text-xs font-semibold text-slate-700">in airtime credit</p>
      </div>
    </Card>
  );
}