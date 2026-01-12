import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Sale, useSales } from "@/hooks/useSales";
import { SaleTable } from "@/components/sales/SaleTable";
import { SaleFormDialog } from "@/components/sales/SaleFormDialog";
import { StatCard } from "@/components/shared/StatCard";
import { Search, Plus, ListOrdered, PackageCheck, PackageX } from "lucide-react";

export default function Vendas() {
  const [filters, setFilters] = useState<any>({ page: 1, perPage: 10, searchTerm: "", status: "all", dateRange: null });
  const { data: salesData, isLoading } = useSales(filters);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })); // Reset page on filter change
  };

  const handleEdit = (sale: Sale | null) => {
    setEditingSale(sale);
    setIsFormOpen(true);
  }

  const sales = salesData?.data || [];
  const totalSales = salesData?.count || 0;

  const completedSales = sales.filter(s => s.status === 'quitado').length;
  const canceledSales = sales.filter(s => s.canceled_at !== null).length;

  return (
    <MainLayout title="Vendas" subtitle="Central de gerenciamento de vendas">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Vendas Totais" value={totalSales} icon={ListOrdered} />
        <StatCard title="Vendas Concluídas" value={completedSales} icon={PackageCheck} color="bg-green-500" />
        <StatCard title="Vendas Canceladas" value={canceledSales} icon={PackageX} color="bg-red-500" />
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
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="parcial">Parcial</SelectItem>
            <SelectItem value="quitado">Quitado</SelectItem>
            <SelectItem value="atrasado">Atrasado</SelectItem>
          </SelectContent>
        </Select>
        <DateRangePicker onUpdate={({ range }) => handleFilterChange('dateRange', range)} />
        <Button onClick={() => handleEdit(null)} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nova Venda
        </Button>
      </div>

      <SaleTable 
        sales={sales} 
        isLoading={isLoading} 
        onEdit={handleEdit} 
        page={filters.page}
        perPage={filters.perPage}
        count={totalSales}
        onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
      />

      {isFormOpen && (
        <SaleFormDialog 
          sale={editingSale} 
          open={isFormOpen} 
          onOpenChange={setIsFormOpen} 
        />
      )}
    </MainLayout>
  );
}
