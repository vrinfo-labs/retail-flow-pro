import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Search, Phone, Building, Loader2 } from "lucide-react";
import { useSuppliers } from "@/hooks/useSuppliers";
import { SupplierFormDialog } from "@/components/fornecedores/SupplierFormDialog";

export default function Fornecedores() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: suppliers, isLoading } = useSuppliers();

  const filteredSuppliers = suppliers?.filter(
    (s) =>
      s.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cnpj?.includes(searchTerm)
  );

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <SupplierFormDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Total de Fornecedores</p>
          <p className="text-2xl font-bold text-foreground">
            {suppliers?.length || 0}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Novos este Mês</p>
          <p className="text-2xl font-bold text-accent">
            {suppliers?.filter((s) => {
              const created = new Date(s.created_at);
              const now = new Date();
              return (
                created.getMonth() === now.getMonth() &&
                created.getFullYear() === now.getFullYear()
              );
            }).length || 0}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Com CNPJ</p>
          <p className="text-2xl font-bold text-foreground">
            {suppliers?.filter((s) => s.cnpj).length || 0}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Com Contato</p>
          <p className="text-2xl font-bold text-foreground">
            {suppliers?.filter((s) => s.contato || s.telefone).length || 0}
          </p>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredSuppliers?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Nenhum fornecedor encontrado</p>
            <p className="text-sm text-muted-foreground/70">
              Cadastre fornecedores usando o botão acima
            </p>
          </div>
        ) : (
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
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Localização
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Cadastro
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers?.map((fornecedor, index) => (
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
                            {fornecedor.razao_social}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {fornecedor.cnpj || "Sem CNPJ"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {fornecedor.contato || "-"}
                        </p>
                        {fornecedor.telefone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {fornecedor.telefone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {[fornecedor.cidade, fornecedor.estado]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(fornecedor.created_at).toLocaleDateString(
                        "pt-BR"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
