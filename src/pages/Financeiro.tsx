import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const cashFlowData = [
  { name: "01/01", entradas: 4200, saidas: 2400 },
  { name: "02/01", entradas: 3800, saidas: 1398 },
  { name: "03/01", entradas: 5100, saidas: 2800 },
  { name: "04/01", entradas: 4800, saidas: 3908 },
  { name: "05/01", entradas: 5500, saidas: 2800 },
  { name: "06/01", entradas: 6200, saidas: 3200 },
  { name: "07/01", entradas: 4900, saidas: 2100 },
];

const contasReceber = [
  {
    id: 1,
    cliente: "Maria Silva",
    valor: 450.0,
    vencimento: "10/01/2026",
    status: "pending",
  },
  {
    id: 2,
    cliente: "João Santos",
    valor: 1200.0,
    vencimento: "15/01/2026",
    status: "pending",
  },
  {
    id: 3,
    cliente: "Ana Costa",
    valor: 89.9,
    vencimento: "05/01/2026",
    status: "overdue",
  },
  {
    id: 4,
    cliente: "Carlos Oliveira",
    valor: 560.0,
    vencimento: "20/01/2026",
    status: "pending",
  },
];

const contasPagar = [
  {
    id: 1,
    fornecedor: "Distribuidora ABC",
    valor: 2500.0,
    vencimento: "07/01/2026",
    status: "today",
  },
  {
    id: 2,
    fornecedor: "Aluguel",
    valor: 3200.0,
    vencimento: "10/01/2026",
    status: "pending",
  },
  {
    id: 3,
    fornecedor: "Energia Elétrica",
    valor: 890.0,
    vencimento: "15/01/2026",
    status: "pending",
  },
  {
    id: 4,
    fornecedor: "Fornecedor XYZ",
    valor: 1450.0,
    vencimento: "03/01/2026",
    status: "overdue",
  },
];

export default function Financeiro() {
  return (
    <MainLayout title="Financeiro" subtitle="Gestão de contas e fluxo de caixa">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl p-6 border border-border/50 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Saldo Atual</span>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">R$ 45.680,00</p>
          <p className="text-sm text-accent flex items-center gap-1 mt-1">
            <TrendingUp className="h-4 w-4" />
            +8.2% este mês
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border/50 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">A Receber</span>
            <ArrowDownRight className="h-5 w-5 text-accent" />
          </div>
          <p className="text-2xl font-bold text-accent">R$ 12.450,00</p>
          <p className="text-sm text-muted-foreground mt-1">
            15 parcelas pendentes
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border/50 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">A Pagar</span>
            <ArrowUpRight className="h-5 w-5 text-destructive" />
          </div>
          <p className="text-2xl font-bold text-destructive">R$ 8.040,00</p>
          <p className="text-sm text-muted-foreground mt-1">
            8 contas pendentes
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border/50 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Balanço</span>
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <p className="text-2xl font-bold text-foreground">R$ 4.410,00</p>
          <p className="text-sm text-muted-foreground mt-1">Positivo</p>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-card rounded-xl p-6 border border-border/50 shadow-card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">Fluxo de Caixa</h3>
            <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Período
          </Button>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashFlowData}>
              <defs>
                <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
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
                <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(0 84% 60%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(0 84% 60%)"
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
                formatter={(value: number) => `R$ ${value.toFixed(2)}`}
              />
              <Area
                type="monotone"
                dataKey="entradas"
                stroke="hsl(160 84% 39%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEntradas)"
                name="Entradas"
              />
              <Area
                type="monotone"
                dataKey="saidas"
                stroke="hsl(0 84% 60%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSaidas)"
                name="Saídas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accounts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contas a Receber */}
        <div className="bg-card rounded-xl border border-border/50 shadow-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ArrowDownRight className="h-5 w-5 text-accent" />
              <h3 className="font-semibold text-foreground">Contas a Receber</h3>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nova
            </Button>
          </div>
          <div className="divide-y divide-border">
            {contasReceber.map((conta) => (
              <div
                key={conta.id}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{conta.cliente}</p>
                  <p className="text-sm text-muted-foreground">
                    Vence: {conta.vencimento}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-accent">
                    R$ {conta.valor.toFixed(2)}
                  </p>
                  <span
                    className={`text-xs font-medium ${
                      conta.status === "overdue"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {conta.status === "overdue" ? "Atrasado" : "Pendente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contas a Pagar */}
        <div className="bg-card rounded-xl border border-border/50 shadow-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-foreground">Contas a Pagar</h3>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nova
            </Button>
          </div>
          <div className="divide-y divide-border">
            {contasPagar.map((conta) => (
              <div
                key={conta.id}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {conta.fornecedor}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vence: {conta.vencimento}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-destructive">
                    R$ {conta.valor.toFixed(2)}
                  </p>
                  <span
                    className={`text-xs font-medium ${
                      conta.status === "overdue"
                        ? "text-destructive"
                        : conta.status === "today"
                        ? "text-warning"
                        : "text-muted-foreground"
                    }`}
                  >
                    {conta.status === "overdue"
                      ? "Atrasado"
                      : conta.status === "today"
                      ? "Vence hoje"
                      : "Pendente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
