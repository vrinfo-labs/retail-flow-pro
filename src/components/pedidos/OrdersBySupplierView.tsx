
import React, { useMemo } from 'react';
import { CustomerOrder, Supplier } from '@/data/mockDropshippingData';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

interface OrdersBySupplierViewProps {
  orders: CustomerOrder[];
  suppliers: Supplier[];
}

interface AggregatedItem {
  productName: string;
  totalQuantity: number;
  fromOrders: string[];
}

export const OrdersBySupplierView = ({ orders, suppliers }: OrdersBySupplierViewProps) => {

  const aggregatedBySupplier = useMemo(() => {
    const safeOrders = Array.isArray(orders) ? orders : [];
    const itemsBySupplier = new Map<string, AggregatedItem[]>();

    // Inicializa o mapa com todos os fornecedores
    suppliers.forEach(supplier => {
      itemsBySupplier.set(supplier.id, []);
    });

    // Agrega os itens dos pedidos
    safeOrders.forEach(order => {
      order.items.forEach(item => {
        const supplierItems = itemsBySupplier.get(item.supplierId) || [];
        const existingItem = supplierItems.find(agg => agg.productName === item.productName);

        if (existingItem) {
          existingItem.totalQuantity += item.quantity;
          if (!existingItem.fromOrders.includes(order.id)) {
            existingItem.fromOrders.push(order.id);
          }
        } else {
          supplierItems.push({
            productName: item.productName,
            totalQuantity: item.quantity,
            fromOrders: [order.id],
          });
        }
        itemsBySupplier.set(item.supplierId, supplierItems);
      });
    });

    return Array.from(itemsBySupplier.entries())
      .map(([supplierId, items]) => ({
        supplier: suppliers.find(s => s.id === supplierId),
        items: items,
      }));

  }, [orders, suppliers]);

  return (
    <div className="space-y-4">
      {aggregatedBySupplier.map(({ supplier, items }) => {
        if (!supplier || items.length === 0) return null; // Não mostra fornecedores sem itens

        return (
          <Card key={supplier.id}>
            <CardHeader>
              <CardTitle className='text-lg'>{supplier.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto a Comprar</TableHead>
                    <TableHead className="text-center">Qtd. Total</TableHead>
                    <TableHead>Dos Pedidos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-center">{item.totalQuantity}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.fromOrders.join(', ')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
