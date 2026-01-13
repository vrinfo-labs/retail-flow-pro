
import React from 'react';
import { Supplier, CustomerOrder } from '@/data/mockDropshippingData';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { ShoppingCart } from 'lucide-react';

interface SupplierGoalCardProps {
  supplier: Supplier;
  orders: CustomerOrder[];
}

export const SupplierGoalCard = ({ supplier, orders }: SupplierGoalCardProps) => {
  const safeOrders = Array.isArray(orders) ? orders : [];

  const relevantOrders = safeOrders.flatMap(order => {
    // Garante que o pedido e o cliente existam antes de processar
    if (!order || !order.customer) return []; 

    return order.items
      .filter(item => item.supplierId === supplier.id)
      .map(item => ({ 
        ...item, 
        customerName: order.customer.name || 'Cliente não informado', // Fallback
        orderId: order.id 
      }));
  });

  const currentAmount = relevantOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const progressPercentage = (currentAmount / supplier.minimumOrderValue) * 100;
  const goalReached = currentAmount >= supplier.minimumOrderValue;

  const handleCreatePurchaseOrder = () => {
    alert(`(Mockup) Pedido de compra para o ${supplier.name} criado com os seguintes itens:\n\n${relevantOrders.map(item => `- ${item.quantity}x ${item.productName}`).join('\n')}`);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{supplier.name}</span>
          <ShoppingCart className="text-muted-foreground" />
        </CardTitle>
        <CardDescription>
          Meta de Pedido Mínimo: R$ {supplier.minimumOrderValue.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-end mb-1">
            <span className="font-bold text-lg text-primary">R$ {currentAmount.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <h4 className="font-semibold mb-2 mt-6">Itens de Clientes Pendentes:</h4>
        <div className="max-h-48 overflow-y-auto border rounded-md">
          <Table>
             <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relevantOrders.map((item, index) => (
                <TableRow key={`${item.orderId}-${index}`}>
                  <TableCell className="font-medium">{item.quantity}x {item.productName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.customerName}</TableCell>
                  <TableCell className="text-right">R$ {(item.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
               {relevantOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Nenhum item pendente para este fornecedor.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!goalReached}
          onClick={handleCreatePurchaseOrder}
        >
          Criar Pedido de Compra
        </Button>
      </CardFooter>
    </Card>
  );
};
