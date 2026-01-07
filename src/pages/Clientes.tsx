import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Phone, Mail, MapPin, User } from "lucide-react";

const clientes = [
  {
    id: 1,
    name: "Maria Silva",
    cpf: "123.456.789-00",
    phone: "(11) 99999-1234",
    email: "maria@email.com",
    city: "São Paulo, SP",
    totalCompras: 4523.5,
    ultimaCompra: "05/01/2026",
  },
  {
    id: 2,
    name: "João Santos",
    cpf: "987.654.321-00",
    phone: "(11) 98888-5678",
    email: "joao@email.com",
    city: "São Paulo, SP",
    totalCompras: 2890.0,
    ultimaCompra: "03/01/2026",
  },
  {
    id: 3,
    name: "Ana Costa",
    cpf: "456.789.123-00",
    phone: "(11) 97777-9012",
    email: "ana@email.com",
    city: "Campinas, SP",
    totalCompras: 8750.25,
    ultimaCompra: "07/01/2026",
  },
  {
    id: 4,
    name: "Carlos Oliveira",
    cpf: "321.654.987-00",
    phone: "(11) 96666-3456",
    email: "carlos@email.com",
    city: "São Paulo, SP",
    totalCompras: 1250.0,
    ultimaCompra: "01/01/2026",
  },
  {
    id: 5,
    name: "Fernanda Lima",
    cpf: "654.987.321-00",
    phone: "(11) 95555-7890",
    email: "fernanda@email.com",
    city: "Santos, SP",
    totalCompras: 5680.75,
    ultimaCompra: "06/01/2026",
  },
  {
    id: 6,
    name: "Roberto Almeida",
    cpf: "789.123.456-00",
    phone: "(11) 94444-1234",
    email: "roberto@email.com",
    city: "São Paulo, SP",
    totalCompras: 3420.0,
    ultimaCompra: "04/01/2026",
  },
];

export default function Clientes() {
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
          />
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Total de Clientes</p>
          <p className="text-2xl font-bold text-foreground">856</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Novos este Mês</p>
          <p className="text-2xl font-bold text-accent">23</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Com Crediário</p>
          <p className="text-2xl font-bold text-foreground">145</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Aniversariantes Hoje</p>
          <p className="text-2xl font-bold text-info">3</p>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientes.map((cliente, index) => (
          <div
            key={cliente.id}
            className="bg-card rounded-xl p-5 border border-border/50 shadow-card hover:shadow-md transition-all animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {cliente.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {cliente.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{cliente.cpf}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {cliente.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {cliente.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {cliente.city}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total em compras</p>
                <p className="font-semibold text-accent">
                  R$ {cliente.totalCompras.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Última compra</p>
                <p className="text-sm font-medium">{cliente.ultimaCompra}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
