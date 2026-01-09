import { Order } from "@/hooks/useOrders";
import { OrderRow } from "./OrderRow";
import { Loader2, Package } from "lucide-react";

interface OrderTableProps {
  orders: Order[] | undefined;
  isLoading: boolean;
  onEdit: (order: Order) => void;
}

export function OrderTable({ orders, isLoading, onEdit }: OrderTableProps) {
  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-xl border border-border/50 shadow-card">
        <Package className="h-12 w-12 text-muted-foreground/30 mb-3" />
        <p className="text-muted-foreground">Nenhum pedido encontrado</p>
        <p className="text-sm text-muted-foreground/80 mt-1">Tente ajustar os filtros ou crie um novo pedido.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-medium text-muted-foreground">Cliente</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Data</th>
              <th className="p-3 text-center font-medium text-muted-foreground">Status</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Total</th>
              <th className="p-3 text-right font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map(order => (
              <OrderRow key={order.id} order={order} onEdit={onEdit} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
