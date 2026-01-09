import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useProducts, useCategories, useDeleteProduct, StockStatus, Product } from "@/hooks/useProducts";
import { ProductFormDialog } from "@/components/estoque/ProductFormDialog";
import { Search, Package, AlertTriangle, Loader2, MoreVertical, FileText, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Estoque() {
  const [filters, setFilters] = useState({ searchTerm: "", category: "", stockStatus: 'all' as StockStatus });
  const { data: products, isLoading } = useProducts(filters);
  const { data: categories } = useCategories();
  const deleteProduct = useDeleteProduct();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const totalValue = products?.reduce((sum, p) => sum + p.preco_custo * p.estoque, 0) || 0;
  const lowStockCount = products?.filter((p) => p.estoque <= p.estoque_minimo).length || 0;
  const criticalStockCount = products?.filter((p) => p.estoque <= p.estoque_minimo * 0.5).length || 0;

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditingProduct(null);
    }
    setIsFormOpen(isOpen)
  }

  return (
    <MainLayout title="Estoque" subtitle="Gestão de produtos e inventário">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou código..." className="pl-9" value={filters.searchTerm} onChange={(e) => handleFilterChange('searchTerm', e.target.value)} />
        </div>
        <Select onValueChange={(value) => handleFilterChange('category', value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select onValueChange={(value: StockStatus) => handleFilterChange('stockStatus', value)} defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status do Estoque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="low">Baixo</SelectItem>
            <SelectItem value="critical">Crítico</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setIsFormOpen(true)}>Novo Produto</Button>
      </div>

      <ProductFormDialog product={editingProduct} open={isFormOpen} onOpenChange={handleOpenChange} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total de Produtos" value={products?.length || 0} />
        <StatCard title="Valor em Estoque" value={`R$ ${totalValue.toFixed(2)}`} />
        <StatCard title="Estoque Baixo" value={lowStockCount} className="text-warning" />
        <StatCard title="Estoque Crítico" value={criticalStockCount} className="text-destructive" />
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-4 text-left font-medium text-muted-foreground">Produto</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Código</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Categoria</th>
                  <th className="p-4 text-center font-medium text-muted-foreground">Estoque</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">Custo</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">Venda</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">Margem</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product, index) => <ProductRow key={product.id} product={product} onEdit={handleEdit} onDelete={deleteProduct.mutate} index={index} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

const StatCard = ({ title, value, className }: { title: string, value: string | number, className?: string }) => (
  <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className={cn("text-2xl font-bold text-foreground", className)}>{value}</p>
  </div>
);

const ProductRow = ({ product, onEdit, onDelete, index }: { product: Product, onEdit: (p: Product) => void, onDelete: (id: string) => void, index: number }) => {
  const getStockStatus = (stock: number, minStock: number) => {
    const ratio = stock / minStock;
    if (ratio <= 0.5) return "critical";
    if (ratio <= 1) return "low";
    return "normal";
  };

  const status = getStockStatus(product.estoque, product.estoque_minimo);
  const margin = product.preco_custo > 0 ? ((product.preco_venda - product.preco_custo) / product.preco_custo) * 100 : 0;

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
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          {status !== 'normal' && <AlertTriangle className={cn("h-4 w-4", status === 'critical' ? "text-destructive" : "text-warning")} />}
          <span className={cn("font-semibold", status === 'critical' && "text-destructive", status === 'low' && "text-warning")}>{product.estoque}</span>
          <span className="text-muted-foreground text-sm">/ {product.estoque_minimo}</span>
        </div>
      </td>
      <td className="p-4 text-right text-muted-foreground">R$ {product.preco_custo.toFixed(2)}</td>
      <td className="p-4 text-right font-semibold text-foreground">R$ {product.preco_venda.toFixed(2)}</td>
      <td className="p-4 text-right"><span className="text-accent font-semibold">{margin.toFixed(1)}%</span></td>
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
              <AlertDialogDescription>Esta ação não pode ser desfeita. O produto será permanentemente removido.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(product.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  )
}
