import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Plus,
  User,
  Clock,
  DollarSign,
  Power,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const caixas = [
  {
    id: 1,
    nome: "Caixa 01",
    status: "open",
    operador: "Maria Silva",
    abertura: "08:00",
    vendas: 2450.0,
    transacoes: 18,
    impressora: "Térmica 01",
  },
  {
    id: 2,
    nome: "Caixa 02",
    status: "open",
    operador: "João Santos",
    abertura: "09:30",
    vendas: 1890.5,
    transacoes: 12,
    impressora: "Térmica 02",
  },
  {
    id: 3,
    nome: "Caixa 03",
    status: "closed",
    operador: null,
    abertura: null,
    vendas: 0,
    transacoes: 0,
    impressora: "Térmica 03",
  },
  {
    id: 4,
    nome: "Caixa Rápido",
    status: "open",
    operador: "Ana Costa",
    abertura: "10:00",
    vendas: 560.0,
    transacoes: 8,
    impressora: "Térmica 04",
  },
];

const operadores = [
  { id: 1, nome: "Maria Silva", turno: "08:00 - 17:00", vendas: 45680.0 },
  { id: 2, nome: "João Santos", turno: "09:00 - 18:00", vendas: 38920.0 },
  { id: 3, nome: "Ana Costa", turno: "10:00 - 19:00", vendas: 42150.0 },
  { id: 4, nome: "Carlos Oliveira", turno: "14:00 - 22:00", vendas: 35800.0 },
];

export default function Caixas() {
  return (
    <MainLayout
      title="Caixas"
      subtitle="Gestão de caixas e operadores"
    >
      {/* Caixas Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Terminais de Caixa
          </h2>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Novo Caixa
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {caixas.map((caixa, index) => (
            <div
              key={caixa.id}
              className={cn(
                "bg-card rounded-xl p-5 border shadow-card animate-fade-in",
                caixa.status === "open"
                  ? "border-accent/50"
                  : "border-border/50"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      caixa.status === "open"
                        ? "bg-accent/10 text-accent"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {caixa.nome}
                    </h3>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        caixa.status === "open"
                          ? "bg-accent/10 text-accent"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {caixa.status === "open" ? "Aberto" : "Fechado"}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Power className="h-4 w-4" />
                </Button>
              </div>

              {caixa.status === "open" ? (
                <>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{caixa.operador}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Abertura: {caixa.abertura}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Printer className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {caixa.impressora}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Vendas</p>
                        <p className="font-bold text-accent">
                          R$ {caixa.vendas.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Transações
                        </p>
                        <p className="font-semibold">{caixa.transacoes}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Caixa não está em operação
                  </p>
                  <Button variant="outline" size="sm">
                    Abrir Caixa
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Operadores Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Operadores</h2>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Novo Operador
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Operador
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Turno
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Vendas (Mês)
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {operadores.map((operador, index) => (
                <tr
                  key={operador.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {operador.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="font-medium text-foreground">
                        {operador.nome}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{operador.turno}</td>
                  <td className="p-4 text-right font-semibold text-accent">
                    R$ {operador.vendas.toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
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
