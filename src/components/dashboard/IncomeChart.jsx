import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "../../utils/format";

export function IncomeChart({ payments = [] }) {
  const data = useMemo(() => {
    const list = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const monthKey = `${y}-${m}`;

      const monthName = d.toLocaleString("uz-UZ", { month: "short" });
      const total = payments
        .filter((p) => p.month === monthKey)
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      list.push({
        month: `${monthName} ${y}`,
        tushum: total,
      });
    }
    return list;
  }, [payments]);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Oxirgi 6 oylik tushum statistikasi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(val) => [formatMoney(val), "Tushum"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="tushum" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default IncomeChart;
