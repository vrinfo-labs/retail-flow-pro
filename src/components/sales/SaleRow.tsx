import { Sale, useCancelSale, useNotifyClient } from "@/hooks/useSales";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FileText, XCircle, Send, FileBarChart2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SaleRowProps {
  sale: Sale;
  onEdit: (sale: Sale) => void;
}

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  pendente: "secondary",
  parcial: "default",
  quitado: "outline", 
  atrasado: "destructive",
};

export function SaleRow({ sale, onEdit }: SaleRowProps) {
  const cancelSale = useCancelSale();
  const notify = useNotifyClient();

  const isCanceled = sale.canceled_at !== null;

  const handleNotify = () => {
    const phone = sale.customers?.telefone;
    if (!phone) { 
      alert("Cliente não possui telefone cadastrado.");
      return; 
    }
    const message = `Olá ${sale.customer_name}, o status da sua venda #${sale.id.substring(0, 5)} foi atualizado para: ${sale.status}.`;
    notify.mutate({ phone, message });
  };

  const handleBilling = () => {
    const phone = sale.customers?.telefone;
    if (!phone) { 
      alert("Cliente não possui telefone cadastrado.");
      return; 
    }
    const message = `Olá ${sale.customer_name}, a cobrança para a sua venda #${sale.id.substring(0, 5)} no valor de R$${sale.total.toFixed(2)} está disponível.`;
    notify.mutate({ phone, message });
  };

  return (
    <tr className={`hover:bg-muted/50 transition-colors ${isCanceled ? 'opacity-50' : ''}`}>
      <td className="p-3 font-medium">{sale.customer_name}</td>
      <td className="p-3 text-muted-foreground">{format(parseISO(sale.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</td>
      <td className="p-3 text-center">
        {isCanceled ? (
            <Badge variant="destructive" className="capitalize">Cancelada</Badge>
        ) : (
            <Badge variant={statusVariant[sale.status]} className="capitalize">
            {sale.status}
            </Badge>
        )}
      </td>
      <td className="p-3 text-right font-semibold">R$ {sale.total.toFixed(2)}</td>
      <td className="p-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(sale)}>
              <FileText className="h-4 w-4 mr-2" /> Ver Detalhes
            </DropdownMenuItem>
            {!isCanceled && (
              <>
                <DropdownMenuItem onClick={handleNotify}>
                  <Send className="h-4 w-4 mr-2" /> Notificar Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBilling}>
                  <FileBarChart2 className="h-4 w-4 mr-2" /> Gerar Cobrança
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => cancelSale.mutate(sale.id)} className="text-red-500 focus:text-red-600">
                  <XCircle className="h-4 w-4 mr-2" /> Cancelar Venda
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
