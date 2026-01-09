import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Product } from "@/hooks/useProducts";
import { Package, AlertTriangle, MoreVertical, FileText, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  index: number;
}

export function ProductRow({ product, onEdit, onDelete, index }: ProductRowProps) {
  const getStockStatus = (stock: number, minStock: number) => {
    if (minStock <= 0) return "normal"; // Avoid division by zero
    const ratio = stock / minStock;
    if (ratio <= 0.5) return "critical";
    if (ratio <= 1) return "low";
    return "normal";
  };

  const status = getStockStatus(product.estoque, product.estoque_minimo);
  const margin = product.preco_custo > 0 ? ((product.preco_venda - product.preco_custo) / product.preco_custo) * 100 : Infinity;

  return (
    <tr className="border-b border-border hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="font-medium text-foreground">{product.nome}</span>
        </div>
      </td>
      <td className="p-4 text-muted-foreground font-mono text-sm">{product.codigo_barras || "-"}</td>
      <td className="p-4"><span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">{product.categories?.nome || "-"}</span></td>
      <td className="p-4 text-muted-foreground text-sm">{product.suppliers?.nome || "-"}</td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          {status !== 'normal' && <AlertTriangle className={cn("h-4 w-4", status === 'critical' ? "text-destructive" : "text-warning")} />}
          <span className={cn("font-semibold", status === 'critical' && "text-destructive", status === 'low' && "text-warning")}>{product.estoque}</span>
          <span className="text-muted-foreground text-sm">/ {product.estoque_minimo}</span>
        </div>
      </td>
      <td className="p-4 text-right text-muted-foreground">R$ {product.preco_custo.toFixed(2)}</td>
      <td className="p-4 text-right font-semibold text-foreground">R$ {product.preco_venda.toFixed(2)}</td>
      <td className="p-4 text-right"><span className={cn("font-semibold", margin < 30 ? "text-warning" : "text-accent")}>{isFinite(margin) ? `${margin.toFixed(1)}%` : "N/A"}</span></td>
      <td className="p-4 text-right">
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(product)}><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
              <Link to={`/estoque/${product.id}/historico`}>
                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" />Ver Histórico</DropdownMenuItem>
              </Link>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle>
              <AlertDialogDescription>Esta ação moverá o produto para a lixeira. Ele poderá ser recuperado se necessário.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(product.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
}
