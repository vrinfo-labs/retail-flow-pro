import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Shield, ShieldCheck, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUsers, User } from "@/hooks/useUsers";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const roleLabels = {
  admin: { label: "Administrador", color: "bg-primary text-primary-foreground" },
  gerente: { label: "Gerente", color: "bg-info text-info-foreground" },
  operador: { label: "Operador", color: "bg-secondary text-secondary-foreground" },
};

const permissoes = [
  { modulo: "Dashboard", admin: true, gerente: true, operador: true },
  { modulo: "PDV", admin: true, gerente: true, operador: true },
  { modulo: "Caixas", admin: true, gerente: true, operador: false },
  { modulo: "Estoque", admin: true, gerente: true, operador: false },
  { modulo: "Financeiro", admin: true, gerente: true, operador: false },
  { modulo: "Clientes", admin: true, gerente: true, operador: true },
  { modulo: "Fornecedores", admin: true, gerente: true, operador: false },
  { modulo: "Relatórios", admin: true, gerente: true, operador: false },
  { modulo: "Usuários", admin: true, gerente: false, operador: false },
  { modulo: "Configurações", admin: true, gerente: false, operador: false },
];

function UserSkeleton() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );
}

export default function Usuarios() {
  const { users, loading, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <MainLayout title="Usuários" subtitle="Gestão de usuários e permissões">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Usuários do Sistema</h3>
            </div>
            <div className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <UserSkeleton key={i} />)
              ) : error ? (
                <div className="p-4">
                    <Alert variant="destructive">
                        <AlertTitle>Erro ao Carregar Usuários</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
              ) : (
                filteredUsers.map((usuario, index) => {
                  const role = roleLabels[usuario.role as keyof typeof roleLabels];
                  return (
                    <div
                      key={usuario.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {usuario.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {usuario.full_name}
                            </p>
                            {role && (
                                <span
                                    className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    role.color
                                    )}
                                >
                                    {role.label}
                                </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {usuario.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={cn(
                            "text-xs font-medium",
                            usuario.status === "active"
                              ? "text-accent"
                              : "text-muted-foreground"
                          )}
                        >
                          {usuario.status === "active" ? "Ativo" : "Inativo"}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Último acesso: {formatDate(usuario.last_sign_in_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Matriz de Permissões</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">
                    Módulo
                  </th>
                  <th className="text-center p-3 text-xs font-medium text-muted-foreground">
                    Admin
                  </th>
                  <th className="text-center p-3 text-xs font-medium text-muted-foreground">
                    Gerente
                  </th>
                  <th className="text-center p-3 text-xs font-medium text-muted-foreground">
                    Operador
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissoes.map((perm) => (
                  <tr
                    key={perm.modulo}
                    className="border-b border-border hover:bg-muted/30"
                  >
                    <td className="p-3 text-sm text-foreground">{perm.modulo}</td>
                    <td className="p-3 text-center">
                      {perm.admin ? (
                        <ShieldCheck className="h-4 w-4 text-accent mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {perm.gerente ? (
                        <ShieldCheck className="h-4 w-4 text-accent mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {perm.operador ? (
                        <ShieldCheck className="h-4 w-4 text-accent mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
