
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bell } from 'lucide-react';

// Mock data for customers with pending payments
const customersToCollect = [
  {
    id: 'CUST-001',
    name: 'João da Silva',
    lastPaymentDate: '2024-06-15',
    dueAmount: 350.00,
    installments: '3/6',
    phone: '5511987654321' // Exemplo de número de telefone
  },
  {
    id: 'CUST-002',
    name: 'Maria Oliveira',
    lastPaymentDate: '2024-07-01',
    dueAmount: 150.75,
    installments: '1/2',
    phone: '5521912345678'
  },
  {
    id: 'CUST-003',
    name: 'Carlos Pereira',
    lastPaymentDate: '2024-05-30',
    dueAmount: 800.00,
    installments: '5/12',
    phone: '5531998765432'
  },
];

export const CustomerCollectionMockup = () => {

  const handleRemind = (customer) => {
    const message = `Olá, ${customer.name}. Gostaríamos de lembrar sobre o seu pagamento pendente no valor de R$ ${customer.dueAmount.toFixed(2)}. Por favor, entre em contato para mais detalhes.`;
    const whatsappUrl = `https://wa.me/${customer.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-card">
      <h3 className="text-lg font-semibold mb-4">Cobrança de Clientes</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Último Pagamento</TableHead>
            <TableHead>Parcelas Pendentes</TableHead>
            <TableHead className="text-right">Valor Devido</TableHead>
            <TableHead className="text-center">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customersToCollect.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.lastPaymentDate}</TableCell>
              <TableCell>{customer.installments}</TableCell>
              <TableCell className="text-right">R$ {customer.dueAmount.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <Button variant="outline" size="sm" onClick={() => handleRemind(customer)}>
                  <Bell className="mr-2 h-4 w-4" />
                  Lembrar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
