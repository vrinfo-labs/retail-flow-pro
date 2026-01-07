import { ReceiptData } from "@/services/thermalPrinter";
import { X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReceiptPreviewProps {
  data: ReceiptData;
  onClose: () => void;
  onPrint: () => void;
  isPrinting: boolean;
  isConnected: boolean;
}

export function ReceiptPreview({
  data,
  onClose,
  onPrint,
  isPrinting,
  isConnected,
}: ReceiptPreviewProps) {
  const formatCurrency = (value: number) =>
    `R$ ${value.toFixed(2).replace(".", ",")}`;

  const formatDate = (date: Date) =>
    date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-card rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">
            Pré-visualização do Cupom
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Receipt */}
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white text-black font-mono text-xs p-4 rounded-lg shadow-inner min-h-[400px]">
            {/* Company Header */}
            <div className="text-center mb-2">
              <p className="text-lg font-bold">{data.company.name}</p>
              <p>CNPJ: {data.company.cnpj}</p>
              <p>{data.company.address}</p>
              <p>Tel: {data.company.phone}</p>
            </div>

            <div className="border-t border-dashed border-gray-400 my-2" />

            {/* Sale Info */}
            <p className="font-bold">CUPOM NAO FISCAL</p>
            <p>Venda #{data.saleNumber.toString().padStart(6, "0")}</p>
            <p>Data: {formatDate(data.date)}</p>
            <p>Caixa: {data.cashier}</p>
            <p>Operador: {data.operator}</p>
            {data.customer && <p>Cliente: {data.customer}</p>}

            <div className="border-t border-dashed border-gray-400 my-2" />

            {/* Items Header */}
            <div className="flex justify-between font-bold">
              <span>ITEM</span>
              <span>QTD</span>
              <span>VALOR</span>
            </div>

            <div className="border-t border-dashed border-gray-400 my-1" />

            {/* Items */}
            {data.items.map((item, index) => (
              <div key={index} className="mb-1">
                <div className="flex justify-between">
                  <span className="flex-1 truncate">{item.name}</span>
                  <span className="w-10 text-center">{item.quantity}</span>
                  <span className="w-20 text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
                {item.quantity > 1 && (
                  <p className="text-gray-500 pl-2">
                    {item.quantity}x {formatCurrency(item.price)}
                  </p>
                )}
              </div>
            ))}

            <div className="border-t border-dashed border-gray-400 my-2" />

            {/* Totals */}
            <div className="text-right space-y-1">
              <p>Subtotal: {formatCurrency(data.subtotal)}</p>
              {data.discount > 0 && (
                <p>Desconto: -{formatCurrency(data.discount)}</p>
              )}
              <p className="text-lg font-bold">
                TOTAL: {formatCurrency(data.total)}
              </p>
            </div>

            <div className="border-t border-dashed border-gray-400 my-2" />

            {/* Payment */}
            <p>Forma de Pagamento: {data.paymentMethod}</p>
            <p>Valor Pago: {formatCurrency(data.amountPaid)}</p>
            {data.change > 0 && <p>Troco: {formatCurrency(data.change)}</p>}

            <div className="border-t border-dashed border-gray-400 my-2" />

            {/* Footer */}
            <div className="text-center">
              <p>Obrigado pela preferencia!</p>
              <p>Volte sempre!</p>
              <p className="mt-2">VarejoERP - Sistema de Gestao</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={onPrint}
            disabled={!isConnected || isPrinting}
          >
            <Printer className="h-4 w-4 mr-2" />
            {isPrinting ? "Imprimindo..." : "Imprimir"}
          </Button>
        </div>
      </div>
    </div>
  );
}
