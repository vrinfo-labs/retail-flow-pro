import { AlertTriangle, Package } from "lucide-react";

const lowStockItems = [
  { id: 1, name: "Arroz Integral 5kg", stock: 3, minStock: 10 },
  { id: 2, name: "Óleo de Soja 900ml", stock: 5, minStock: 15 },
  { id: 3, name: "Açúcar Refinado 1kg", stock: 8, minStock: 20 },
  { id: 4, name: "Café Torrado 500g", stock: 2, minStock: 12 },
];

export function LowStockAlert() {
  return (
    <div className="rounded-xl bg-card border border-border/50 shadow-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h3 className="font-semibold text-foreground">Estoque Baixo</h3>
        </div>
        <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
          {lowStockItems.length} itens
        </span>
      </div>
      <div className="divide-y divide-border">
        {lowStockItems.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-medium text-foreground">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-destructive">
                {item.stock}
              </span>
              <span className="text-sm text-muted-foreground">
                / {item.minStock}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-4">
        <button className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Ver todos os produtos
        </button>
      </div>
    </div>
  );
}
