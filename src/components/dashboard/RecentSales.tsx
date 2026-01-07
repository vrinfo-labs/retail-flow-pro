import { Clock } from "lucide-react";

const recentSales = [
  {
    id: 1,
    customer: "Maria Silva",
    amount: "R$ 234,50",
    items: 5,
    time: "há 5 min",
    paymentMethod: "Cartão",
  },
  {
    id: 2,
    customer: "João Santos",
    amount: "R$ 89,90",
    items: 2,
    time: "há 12 min",
    paymentMethod: "PIX",
  },
  {
    id: 3,
    customer: "Ana Costa",
    amount: "R$ 456,00",
    items: 8,
    time: "há 25 min",
    paymentMethod: "Dinheiro",
  },
  {
    id: 4,
    customer: "Carlos Oliveira",
    amount: "R$ 78,50",
    items: 3,
    time: "há 32 min",
    paymentMethod: "Cartão",
  },
  {
    id: 5,
    customer: "Fernanda Lima",
    amount: "R$ 189,00",
    items: 4,
    time: "há 45 min",
    paymentMethod: "PIX",
  },
];

export function RecentSales() {
  return (
    <div className="rounded-xl bg-card border border-border/50 shadow-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-semibold text-foreground">Vendas Recentes</h3>
        <button className="text-sm font-medium text-primary hover:underline">
          Ver todas
        </button>
      </div>
      <div className="divide-y divide-border">
        {recentSales.map((sale, index) => (
          <div
            key={sale.id}
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {sale.customer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-medium text-foreground">{sale.customer}</p>
                <p className="text-sm text-muted-foreground">
                  {sale.items} itens • {sale.paymentMethod}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{sale.amount}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {sale.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
