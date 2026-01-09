import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SalesData {
    date: string;
    sales: number;
}

export function SalesChart() {
    const [data, setData] = useState<SalesData[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalSales, setTotalSales] = useState(0);

    useEffect(() => {
        const fetchSalesData = async () => {
            setLoading(true);
            const { data: salesData, error } = await supabase.rpc('get_daily_sales_for_chart');

            if (error) {
                console.error("Error fetching sales chart data:", error);
                setData([]);
            } else {
                setData(salesData || []);
                const total = (salesData || []).reduce((sum, item) => sum + item.sales, 0);
                setTotalSales(total);
            }
            setLoading(false);
        };

        fetchSalesData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00'); // Avoid timezone issues
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

  return (
    <div className="rounded-xl bg-card border border-border/50 shadow-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-foreground">Vendas (Últimos 30 Dias)</h3>
        {loading ? (
            <p className="text-sm text-muted-foreground">Calculando total...</p>
        ) : (
            <p className="text-sm text-muted-foreground">
              Total: {totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
        )}
      </div>
      <div className="h-[280px]">
        {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">Carregando gráfico...</div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160 84% 39%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(160 84% 39%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 88%)" vertical={false}/>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(215 16% 47%)", fontSize: 12 }}
                  tickFormatter={formatDate}
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
                  }}
                  labelFormatter={formatDate}
                  formatter={(value: number) => [value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), "Vendas"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(160 84% 39%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVendas)"
                />
              </AreaChart>
            </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
