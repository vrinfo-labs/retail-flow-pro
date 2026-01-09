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
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  sales_today: number;
  sales_yesterday: number;
  orders_today: number;
  products_in_stock: number;
  low_stock_products: number;
  active_customers: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      if (error) {
        console.error("Error fetching dashboard stats:", error);
      } else if (data && data.length > 0) {
        setStats(data[0]);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const salesChange = stats ? ((stats.sales_today - stats.sales_yesterday) / (stats.sales_yesterday || 1)) * 100 : 0;
  const salesChangeType = salesChange >= 0 ? "positive" : "negative";

  return (
    <MainLayout
      title="Dashboard"
      subtitle="Visão geral do seu negócio"
    >
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Vendas Hoje"
          value={loading ? "-" : `R$ ${stats?.sales_today.toFixed(2)}`}
          change={loading ? "-" : `${salesChange.toFixed(1)}% vs ontem`}
          changeType={salesChangeType}
          icon={DollarSign}
          iconColor="accent"
        />
        <StatCard
          title="Pedidos Hoje"
          value={loading ? "-" : stats?.orders_today.toString()}
          change={loading ? "-" : "..."} // Placeholder for more detailed change
          changeType="positive"
          icon={ShoppingCart}
          iconColor="primary"
        />
        <StatCard
          title="Produtos em Estoque"
          value={loading ? "-" : stats?.products_in_stock.toString()}
          change={loading ? "-" : `${stats?.low_stock_products} com estoque baixo`}
          changeType={stats && stats.low_stock_products > 0 ? "negative" : "positive"}
          icon={Package}
          iconColor="warning"
        />
        <StatCard
          title="Clientes Ativos"
          value={loading ? "-" : stats?.active_customers.toString()}
          change={loading ? "-" : "este mês"} 
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
