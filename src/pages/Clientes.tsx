import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomers, useDeleteCustomer, Customer } from "@/hooks/useCustomers";
import { CustomerFormDialog } from "@/components/clientes/CustomerFormDialog";
import { CustomerCard } from "@/components/clientes/CustomerCard";
import { StatCard } from "@/components/shared/StatCard";
import { Search, User, Users, Calendar, BadgePercent, Loader2, Plus } from "lucide-react";

export default function Clientes() {
  const [filters, setFilters] = useState({ searchTerm: "" });
  const { data: customers, isLoading } = useCustomers(filters);
  const deleteCustomer = useDeleteCustomer();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleFilterChange = (value: string) => {
    setFilters({ searchTerm: value });
  };

  const handleEdit = (customer: Customer | null) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditingCustomer(null);
    }
    setIsFormOpen(isOpen);
  };

  // Stats Calculation
  const newThisMonth = customers?.filter(c => {
    const created = new Date(c.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length || 0;

  const withCredit = customers?.filter(c => (c.limite_credito || 0) > 0).length || 0;
  
  const birthdaysToday = customers?.filter(c => {
    if (!c.data_nascimento) return false;
    const birth = new Date(c.data_nascimento);
    const today = new Date();
    return birth.getUTCDate() === today.getUTCDate() && birth.getUTCMonth() === today.getUTCMonth();
  }).length || 0;

  return (
    <MainLayout title="Clientes" subtitle="Gestão de clientes e histórico de compras">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome, CPF ou telefone..." className="pl-9" value={filters.searchTerm} onChange={(e) => handleFilterChange(e.target.value)} />
        </div>
        <Button onClick={() => handleEdit(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <CustomerFormDialog customer={editingCustomer} open={isFormOpen} onOpenChange={handleOpenChange} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total de Clientes" value={customers?.length || 0} icon={Users} />
        <StatCard title="Novos no Mês" value={newThisMonth} icon={Calendar} className="text-accent" />
        <StatCard title="Com Crediário" value={withCredit} icon={BadgePercent} />
        <StatCard title="Aniversários Hoje" value={birthdaysToday} icon={Calendar} className="text-info" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : customers?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-xl border border-border/50">
          <User className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          <p className="text-sm text-muted-foreground/70">Cadastre o primeiro cliente usando o botão acima</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers?.map((customer, index) => (
            <CustomerCard 
              key={customer.id} 
              customer={customer} 
              onEdit={handleEdit} 
              onDelete={deleteCustomer.mutate} 
              index={index} 
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
}
