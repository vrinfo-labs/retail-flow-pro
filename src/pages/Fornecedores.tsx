import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Phone, Mail, Building, Package } from "lucide-react";

const fornecedores = [
  {
    id: 1,
    razaoSocial: "Distribuidora ABC Ltda",
    cnpj: "12.345.678/0001-90",
    contato: "Carlos Silva",
    phone: "(11) 3333-1234",
    email: "contato@abc.com.br",
    produtos: 45,
    ultimaCompra: "02/01/2026",
    totalCompras: 45680.0,
  },
  {
    id: 2,
    razaoSocial: "Atacadão XYZ S/A",
    cnpj: "98.765.432/0001-10",
    contato: "Maria Santos",
    phone: "(11) 4444-5678",
    email: "vendas@xyz.com.br",
    produtos: 120,
    ultimaCompra: "05/01/2026",
    totalCompras: 89500.0,
  },
  {
    id: 3,
    razaoSocial: "Indústria Alimentos BR",
    cnpj: "45.678.901/0001-23",
    contato: "João Oliveira",
    phone: "(11) 5555-9012",
    email: "comercial@alimentosbr.com.br",
    produtos: 32,
    ultimaCompra: "28/12/2025",
    totalCompras: 23450.0,
  },
  {
    id: 4,
    razaoSocial: "Produtos de Limpeza Clean",
    cnpj: "78.901.234/0001-56",
    contato: "Ana Costa",
    phone: "(11) 6666-3456",
    email: "vendas@clean.com.br",
    produtos: 28,
    ultimaCompra: "30/12/2025",
    totalCompras: 12890.0,
  },
];

export default function Fornecedores() {
  return (
    <MainLayout
      title="Fornecedores"
      subtitle="Gestão de fornecedores e compras"
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar fornecedor por nome ou CNPJ..."
            className="pl-9"
          />
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Total de Fornecedores</p>
          <p className="text-2xl font-bold text-foreground">48</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Compras este Mês</p>
          <p className="text-2xl font-bold text-destructive">R$ 23.450</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Pedidos Pendentes</p>
          <p className="text-2xl font-bold text-warning">5</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Produtos Vinculados</p>
          <p className="text-2xl font-bold text-foreground">225</p>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Fornecedor
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Contato
                </th>
                <th className="text-center p-4 font-medium text-muted-foreground">
                  Produtos
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Última Compra
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Total em Compras
                </th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.map((fornecedor, index) => (
                <tr
                  key={fornecedor.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {fornecedor.razaoSocial}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {fornecedor.cnpj}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {fornecedor.contato}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {fornecedor.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {fornecedor.produtos}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {fornecedor.ultimaCompra}
                  </td>
                  <td className="p-4 text-right font-semibold text-foreground">
                    R$ {fornecedor.totalCompras.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
