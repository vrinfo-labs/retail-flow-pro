
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function LowStockAlert() {
  // In a real app, you would fetch this data from your API
  const lowStockItems = [
    { name: "Produto A", stock: 5 },
    { name: "Produto B", stock: 2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <span>Alerta de Estoque Baixo</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lowStockItems.length > 0 ? (
          <ul className="space-y-2">
            {lowStockItems.map((item) => (
              <li key={item.name} className="text-sm">
                <span className="font-medium">{item.name}</span> - {item.stock} unidades restantes
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum item com estoque baixo.</p>
        )}
      </CardContent>
    </Card>
  );
}
