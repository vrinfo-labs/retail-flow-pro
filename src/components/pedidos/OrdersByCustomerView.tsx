
import React from 'react';
import { CustomerOrder } from '@/data/mockDropshippingData';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Badge } from '@/components/ui/badge';

interface OrdersByCustomerViewProps {
  orders: CustomerOrder[];
}

export const OrdersByCustomerView = ({ orders }: OrdersByCustomerViewProps) => {
  const safeOrders = Array.isArray(orders) ? orders : [];
  return (
    <div className="space-y-4">
      {safeOrders.map(order => (
        <Card key={order.id}>
          <CardHeader className='pb-2'>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className='text-lg'>{order.id} - {order.customer ? order.customer.name : 'Cliente não informado'}</CardTitle>
                    <CardDescription>Data: {order.date}</CardDescription>
                </div>
                <Badge variant={order.status === 'Pendente' ? 'default' : 'secondary'}>{order.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center">Qtd.</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">R$ {item.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableCell colSpan={2} className="font-bold">Total do Pedido</TableCell>
                    <TableCell className="text-right font-bold">R$ {order.total.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
