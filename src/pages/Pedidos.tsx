import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Order, useOrders } from "@/hooks/useOrders";
import { OrderTable } from "@/components/pedidos/OrderTable";
import { OrderFormDialog } from "@/components/pedidos/OrderFormDialog";
import { StatCard } from "@/components/shared/StatCard";
import { Search, Plus, ListOrdered, PackageCheck, PackageX } from "lucide-react";

export default function Pedidos() {
  const [filters, setFilters] = useState<any>({ searchTerm: "", status: "all", dateRange: null });
  const { data: orders, isLoading } = useOrders(filters);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleEdit = (order: Order | null) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  }

  return (
    <MainLayout title="Pedidos de Venda" subtitle="Central de gerenciamento de pedidos">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Pedidos Totais" value={orders?.length || 0} icon={ListOrdered} />
        <StatCard title="Pedidos Concluídos" value={orders?.filter(o => o.status === 'completed').length || 0} icon={PackageCheck} color="bg-green-500" />
        <StatCard title="Pedidos Cancelados" value={orders?.filter(o => o.status === 'cancelled').length || 0} icon={PackageX} color="bg-red-500" />
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por cliente..." className="pl-9" value={filters.searchTerm} onChange={(e) => handleFilterChange('searchTerm', e.target.value)} />
        </div>
        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="processing">Processando</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        <DateRangePicker onUpdate={({ range }) => handleFilterChange('dateRange', range)} />
        <Button onClick={() => handleEdit(null)} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      <OrderTable orders={orders} isLoading={isLoading} onEdit={handleEdit} />

      {isFormOpen && (
        <OrderFormDialog 
          order={editingOrder} 
          open={isFormOpen} 
          onOpenChange={setIsFormOpen} 
        />
      )}
    </MainLayout>
  );
}
