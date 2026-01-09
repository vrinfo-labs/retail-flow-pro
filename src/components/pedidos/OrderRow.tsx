import { Order, useCancelOrder, useNotifyClient } from "@/hooks/useOrders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FileText, XCircle, Send, FileBarChart2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrderRowProps {
  order: Order;
  onEdit: (order: Order) => void;
}

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  pending: "secondary",
  processing: "default",
  completed: "outline", 
  cancelled: "destructive",
};

export function OrderRow({ order, onEdit }: OrderRowProps) {
  const cancelOrder = useCancelOrder();
  const notify = useNotifyClient();

  const handleNotify = () => {
    // Acessar o telefone do cliente (necessário adicionar ao select do hook)
    const phone = "+5511999999999"; // Placeholder
    const message = `Olá ${order.clients.nome}, o status do seu pedido #${order.id.substring(0, 5)} foi atualizado para: ${order.status}.`;
    notify.mutate({ phone, message });
  };

  const handleBilling = () => {
    const phone = "+5511999999999"; // Placeholder
    const message = `Olá ${order.clients.nome}, a cobrança para o seu pedido #${order.id.substring(0, 5)} no valor de R$${order.total.toFixed(2)} está disponível.`;
    notify.mutate({ phone, message });
  };

  return (
    <tr className="hover:bg-muted/50 transition-colors">
      <td className="p-3 font-medium">{order.clients.nome}</td>
      <td className="p-3 text-muted-foreground">{format(parseISO(order.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</td>
      <td className="p-3 text-center">
        <Badge variant={statusVariant[order.status]} className="capitalize">
          {order.status}
        </Badge>
      </td>
      <td className="p-3 text-right font-semibold">R$ {order.total.toFixed(2)}</td>
      <td className="p-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(order)}>
              <FileText className="h-4 w-4 mr-2" /> Ver / Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleNotify}>
              <Send className="h-4 w-4 mr-2" /> Notificar Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBilling}>
              <FileBarChart2 className="h-4 w-4 mr-2" /> Gerar Cobrança
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => cancelOrder.mutate(order.id)} className="text-red-500 focus:text-red-600">
              <XCircle className="h-4 w-4 mr-2" /> Cancelar Pedido
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
