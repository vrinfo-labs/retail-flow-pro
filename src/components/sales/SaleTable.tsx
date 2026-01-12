import { Sale } from "@/hooks/useSales";
import { SaleRow } from "./SaleRow";
import { Loader2, Package } from "lucide-react";
import { Pagination } from "@/components/shared/Pagination";

interface SaleTableProps {
  sales: Sale[];
  isLoading: boolean;
  onEdit: (sale: Sale) => void;
  page: number;
  perPage: number;
  count: number;
  onPageChange: (page: number) => void;
}

export function SaleTable({ sales, isLoading, onEdit, page, perPage, count, onPageChange }: SaleTableProps) {
  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!sales || sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-xl border border-border/50 shadow-card">
        <Package className="h-12 w-12 text-muted-foreground/30 mb-3" />
        <p className="text-muted-foreground">Nenhuma venda encontrada</p>
        <p className="text-sm text-muted-foreground/80 mt-1">Tente ajustar os filtros ou crie uma nova venda.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-3 text-left font-medium text-muted-foreground">Cliente</th>
                <th className="p-3 text-left font-medium text-muted-foreground">Data</th>
                <th className="p-3 text-center font-medium text-muted-foreground">Status</th>
                <th className="p-3 text-right font-medium text-muted-foreground">Total</th>
                <th className="p-3 text-right font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sales.map(sale => (
                <SaleRow key={sale.id} sale={sale} onEdit={onEdit} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination 
        currentPage={page}
        perPage={perPage}
        totalCount={count}
        onPageChange={onPageChange}
      />
    </div>
  );
}
