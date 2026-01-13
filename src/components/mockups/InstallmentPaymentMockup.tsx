
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, MessageCircle } from 'lucide-react';

// Mock data for the order total
const ORDER_TOTAL = 1200.00;

export const InstallmentPaymentMockup = () => {
  const [numberOfInstallments, setNumberOfInstallments] = useState(1);

  const installments = useMemo(() => {
    if (numberOfInstallments <= 0) return [];

    const installmentAmount = ORDER_TOTAL / numberOfInstallments;
    const today = new Date();

    return Array.from({ length: numberOfInstallments }, (_, i) => {
      const dueDate = new Date(today);
      dueDate.setMonth(today.getMonth() + i);
      return {
        number: i + 1,
        amount: installmentAmount.toFixed(2),
        dueDate: dueDate.toLocaleDateString('pt-BR'),
        status: 'pendente'
      };
    });
  }, [numberOfInstallments]);

  const handlePrint = () => {
    alert('Função "Imprimir Carnê" chamada. (Mockup)');
  };

  const handleSendWhatsApp = () => {
    alert('Função "Enviar por WhatsApp" chamada. (Mockup)');
  };


  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-4">
      <h3 className="text-lg font-semibold mb-4">Pagamento via Crediário</h3>
      <div className="flex items-center gap-4 mb-6">
        <label htmlFor="installments-select" className="font-medium">Número de Parcelas:</label>
        <Select
          value={String(numberOfInstallments)}
          onValueChange={(value) => setNumberOfInstallments(Number(value))}
        >
          <SelectTrigger id="installments-select" className="w-[180px]">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(12).keys()].map(i => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {i + 1}x de R$ {(ORDER_TOTAL / (i + 1)).toFixed(2)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {installments.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Parcelas Geradas:</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {installments.map((inst) => (
                <TableRow key={inst.number}>
                  <TableCell>{inst.number}</TableCell>
                  <TableCell>{inst.dueDate}</TableCell>
                  <TableCell className="text-right">R$ {inst.amount}</TableCell>
                  <TableCell>{inst.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir Carnê
            </Button>
            <Button onClick={handleSendWhatsApp}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Enviar por WhatsApp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
