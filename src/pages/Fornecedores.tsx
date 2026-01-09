import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSuppliers, useDeleteSupplier, Supplier } from "@/hooks/useSuppliers";
import { SupplierFormDialog } from "@/components/fornecedores/SupplierFormDialog";
import { SupplierRow } from "@/components/fornecedores/SupplierRow";
import { StatCard } from "@/components/shared/StatCard";
import { Search, Building, Loader2, Plus } from "lucide-react";

export default function Fornecedores() {
  const [filters, setFilters] = useState({ searchTerm: "" });
  const { data: suppliers, isLoading } = useSuppliers(filters);
  const deleteSupplier = useDeleteSupplier();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const handleFilterChange = (value: string) => {
    setFilters({ searchTerm: value });
  };

  const handleEdit = (supplier: Supplier | null) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditingSupplier(null);
    }
    setIsFormOpen(isOpen);
  }

  return (
    <MainLayout title="Fornecedores" subtitle="Gestão de fornecedores de produtos">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou CNPJ..." className="pl-9" value={filters.searchTerm} onChange={(e) => handleFilterChange(e.target.value)} />
        </div>
        <Button onClick={() => handleEdit(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      <SupplierFormDialog supplier={editingSupplier} open={isFormOpen} onOpenChange={handleOpenChange} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total de Fornecedores" value={suppliers?.length || 0} icon={Building} />
        {/* Add more relevant stats here in the future */}
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : suppliers?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Nenhum fornecedor encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-4 text-left font-medium text-muted-foreground">Nome</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Telefone</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Email</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">CNPJ</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {suppliers?.map((supplier, index) => <SupplierRow key={supplier.id} supplier={supplier} onEdit={handleEdit} onDelete={deleteSupplier.mutate} index={index} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
