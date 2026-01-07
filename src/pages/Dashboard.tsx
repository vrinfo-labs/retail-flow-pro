import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { UpcomingBills } from "@/components/dashboard/UpcomingBills";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function Dashboard() {
  return (
    <MainLayout
      title="Dashboard"
      subtitle="Visão geral do seu negócio"
    >
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Vendas Hoje"
          value="R$ 4.523,00"
          change="+12.5% vs ontem"
          changeType="positive"
          icon={DollarSign}
          iconColor="accent"
        />
        <StatCard
          title="Pedidos Hoje"
          value="28"
          change="+8 pedidos"
          changeType="positive"
          icon={ShoppingCart}
          iconColor="primary"
        />
        <StatCard
          title="Produtos em Estoque"
          value="1.234"
          change="4 com estoque baixo"
          changeType="negative"
          icon={Package}
          iconColor="warning"
        />
        <StatCard
          title="Clientes Ativos"
          value="856"
          change="+23 este mês"
          changeType="positive"
          icon={Users}
          iconColor="info"
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        {/* Low Stock Alert */}
        <div>
          <LowStockAlert />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <RecentSales />
        <UpcomingBills />
      </div>
    </MainLayout>
  );
}
