
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for purchase orders grouped by supplier
const purchaseOrdersBySupplier = {
  'Fornecedor A': [
    { id: 'PO-001', date: '2024-07-28', total: 1500.50, status: 'Recebido' },
    { id: 'PO-003', date: '2024-07-29', total: 800.00, status: 'Pendente' },
  ],
  'Fornecedor B': [
    { id: 'PO-002', date: '2024-07-28', total: 2300.00, status: 'Recebido' },
  ],
  'Fornecedor C': [
    { id: 'PO-004', date: '2024-07-30', total: 550.75, status: 'Enviado' },
  ],
};

const statusVariant = {
  Pendente: 'default',
  Enviado: 'secondary',
  Recebido: 'success',
  Cancelado: 'destructive',
};

export const PurchaseOrdersBySupplierMockup = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4">Pedidos por Fornecedor</h3>
      <div className="space-y-6">
        {Object.entries(purchaseOrdersBySupplier).map(([supplierName, orders]) => (
          <div key={supplierName}>
            <h4 className="font-semibold mb-2 text-md">{supplierName}</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido ID</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">R$ {order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[order.status] || 'default'}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
};
