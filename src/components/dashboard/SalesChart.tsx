import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Seg", vendas: 2400 },
  { name: "Ter", vendas: 1398 },
  { name: "Qua", vendas: 3800 },
  { name: "Qui", vendas: 3908 },
  { name: "Sex", vendas: 4800 },
  { name: "Sáb", vendas: 5200 },
  { name: "Dom", vendas: 2100 },
];

export function SalesChart() {
  return (
    <div className="rounded-xl bg-card border border-border/50 shadow-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-foreground">Vendas da Semana</h3>
        <p className="text-sm text-muted-foreground">
          Total: R$ 23.606,00
        </p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(160 84% 39%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(160 84% 39%)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(215 25% 88%)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 16% 47%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 16% 47%)", fontSize: 12 }}
              tickFormatter={(value) => `R$ ${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0 0% 100%)",
                border: "1px solid hsl(215 25% 88%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Vendas"]}
            />
            <Area
              type="monotone"
              dataKey="vendas"
              stroke="hsl(160 84% 39%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVendas)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
