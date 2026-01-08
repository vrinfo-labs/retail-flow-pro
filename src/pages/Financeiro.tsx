import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  FileText,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

const financialData = {
  summary: {
    revenue: 45231.89,
    expenses: 28450.6,
    profit: 16781.29,
    lastMonthRevenue: 42120.5,
    lastMonthExpenses: 27540.3,
  },
  chartData: [
    { month: "Jan", revenue: 4000, expenses: 2400 },
    { month: "Feb", revenue: 3000, expenses: 1398 },
    { month: "Mar", revenue: 5000, expenses: 9800 },
    { month: "Apr", revenue: 4780, expenses: 3908 },
    { month: "May", revenue: 5890, expenses: 4800 },
    { month: "Jun", revenue: 4390, expenses: 3800 },
  ],
  recentTransactions: [
    {
      id: "txn_1",
      date: "2024-06-23",
      description: "Venda de Produto A",
      amount: 150.0,
      type: "revenue",
    },
    {
      id: "txn_2",
      date: "2024-06-23",
      description: "Pagamento Fornecedor X",
      amount: -500.0,
      type: "expense",
    },
    {
      id: "txn_3",
      date: "2024-06-22",
      description: "Venda de Serviço B",
      amount: 300.0,
      type: "revenue",
    },
    {
      id: "txn_4",
      date: "2024-06-21",
      description: "Salário Funcionário Y",
      amount: -2500.0,
      type: "expense",
    },
    {
      id: "txn_5",
      date: "2024-06-20",
      description: "Venda de Produto C",
      amount: 75.5,
      type: "revenue",
    },
  ],
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

export default function Financeiro() {
  const { summary, chartData, recentTransactions } = financialData;
  const profitPercentage = (
    ((summary.revenue - summary.expenses) / summary.revenue) *
    100
  ).toFixed(2);
  const revenueGrowth = (
    ((summary.revenue - summary.lastMonthRevenue) / summary.lastMonthRevenue) *
    100
  ).toFixed(2);
  const expensesGrowth = (
    ((summary.expenses - summary.lastMonthExpenses) /
      summary.lastMonthExpenses) *
    100
  ).toFixed(2);

  return (
    <MainLayout title="Financeiro" subtitle="Gestão financeira e acompanhamento">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Visão Geral Financeira</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.revenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    parseFloat(revenueGrowth) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {parseFloat(revenueGrowth) >= 0 ? "▲" : "▼"} {revenueGrowth}%
                </span>{" "}
                em relação ao mês passado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Despesas Totais
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.expenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    parseFloat(expensesGrowth) >= 0
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  {parseFloat(expensesGrowth) >= 0 ? "▲" : "▼"} {expensesGrowth}
                  %
                </span>{" "}
                em relação ao mês passado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.profit)}
              </div>
              <p className="text-xs text-muted-foreground">
                Margem de {profitPercentage}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Receitas vs. Despesas</CardTitle>
            <CardDescription>
              Análise dos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Receita",
                  color: "hsl(var(--chart-1))",
                },
                expenses: {
                  label: "Despesa",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="min-h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value as number)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={4}
                  />
                  <Bar
                    dataKey="expenses"
                    fill="var(--color-expenses)"
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>
              Últimas 5 transações financeiras registradas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-center">Tipo</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${
                        transaction.type === "revenue"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          transaction.type === "revenue"
                            ? "default"
                            : "destructive"
                        }
                        className="flex items-center justify-center gap-1"
                      >
                        {transaction.type === "revenue" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4" />
                        )}
                        {transaction.type === "revenue"
                          ? "Receita"
                          : "Despesa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}