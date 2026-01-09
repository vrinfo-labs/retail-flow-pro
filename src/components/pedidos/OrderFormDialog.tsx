import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Order, OrderInsert, useCreateOrder, useUpdateOrder } from "@/hooks/useOrders";
import { useClients, Client } from "@/hooks/useClients";
import { useProducts, Product } from "@/hooks/useProducts";
import { PedidoForm } from "./PedidoForm";

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order | null;
}

export function OrderFormDialog({ open, onOpenChange, order }: OrderFormDialogProps) {
  const [clienteId, setClienteId] = useState("");
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState<any[]>([]);
  
  const { data: clients } = useClients();
  const createOrder = useCreateOrder();
  // const updateOrder = useUpdateOrder(); // Futura implementação

  useEffect(() => {
    if (order) {
      setClienteId(order.cliente_id);
      setStatus(order.status);
      // Carregar itens do pedido para edição
    } else {
      setClienteId("");
      setStatus("pending");
      setItems([]);
    }
  }, [order]);

  const handleSubmit = () => {
    const total = items.reduce((acc, item) => acc + (parseFloat(item.value) * parseInt(item.quantity)), 0);
    const orderData: OrderInsert = {
      cliente_id: clienteId,
      status: status as any,
      total,
      items: items.map(i => ({ 
        produto_id: i.product.id, 
        quantidade: parseInt(i.quantity), 
        preco_unitario: parseFloat(i.value) 
      })),
    };
    
    createOrder.mutate(orderData, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{order ? "Editar Pedido" : "Novo Pedido"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <Select value={clienteId} onValueChange={setClienteId}>
            <SelectTrigger><SelectValue placeholder="Selecione um Cliente" /></SelectTrigger>
            <SelectContent>
              {clients?.map(client => <SelectItem key={client.id} value={client.id}>{client.nome}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Status do Pedido" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="processing">Processando</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <PedidoForm items={items} setItems={setItems} />
        
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar Pedido</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
