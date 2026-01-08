import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Search, Phone, Mail, MapPin, User, Loader2 } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomerFormDialog } from "@/components/clientes/CustomerFormDialog";

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: customers, isLoading } = useCustomers();

  const filteredCustomers = customers?.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpf_cnpj?.includes(searchTerm) ||
      c.telefone?.includes(searchTerm)
  );

  return (
    <MainLayout
      title="Clientes"
      subtitle="Gestão de clientes e histórico de compras"
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente por nome, CPF ou telefone..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CustomerFormDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Total de Clientes</p>
          <p className="text-2xl font-bold text-foreground">
            {customers?.length || 0}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Novos este Mês</p>
          <p className="text-2xl font-bold text-accent">
            {customers?.filter((c) => {
              const created = new Date(c.created_at);
              const now = new Date();
              return (
                created.getMonth() === now.getMonth() &&
                created.getFullYear() === now.getFullYear()
              );
            }).length || 0}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Com Crediário</p>
          <p className="text-2xl font-bold text-foreground">
            {customers?.filter((c) => (c.limite_credito || 0) > 0).length || 0}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Aniversariantes Hoje</p>
          <p className="text-2xl font-bold text-info">
            {customers?.filter((c) => {
              if (!c.data_nascimento) return false;
              const birth = new Date(c.data_nascimento);
              const today = new Date();
              return (
                birth.getDate() === today.getDate() &&
                birth.getMonth() === today.getMonth()
              );
            }).length || 0}
          </p>
        </div>
      </div>

      {/* Clients Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCustomers?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-xl border border-border/50">
          <User className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          <p className="text-sm text-muted-foreground/70">
            Cadastre clientes usando o botão acima
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers?.map((cliente, index) => (
            <div
              key={cliente.id}
              className="bg-card rounded-xl p-5 border border-border/50 shadow-card hover:shadow-md transition-all animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {cliente.nome
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {cliente.nome}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cliente.cpf_cnpj || "Sem CPF/CNPJ"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {cliente.telefone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {cliente.telefone}
                  </div>
                )}
                {cliente.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {cliente.email}
                  </div>
                )}
                {(cliente.cidade || cliente.estado) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {[cliente.cidade, cliente.estado].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Limite crédito</p>
                  <p className="font-semibold text-accent">
                    R$ {(cliente.limite_credito || 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Cadastro</p>
                  <p className="text-sm font-medium">
                    {new Date(cliente.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
