import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts, useCategories, useDeleteProduct, StockStatus, Product } from "@/hooks/useProducts";
import { ProductFormDialog } from "@/components/estoque/ProductFormDialog";
import { ProductRow } from "@/components/estoque/ProductRow";
import { StatCard } from "@/components/shared/StatCard";
import { Search, Package, Loader2 } from "lucide-react";

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
      <div className="flex flex-wrap items-center gap-4 mb-6">
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
        <Button onClick={() => handleEdit(null)}>Novo Produto</Button>
      </div>

      <ProductFormDialog product={editingProduct} open={isFormOpen} onOpenChange={handleOpenChange} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total de Produtos" value={products?.length || 0} />
        <StatCard title="Valor em Estoque" value={totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
        <StatCard title="Estoque Baixo" value={lowStockCount} className="text-warning" />
        <StatCard title="Estoque Crítico" value={criticalStockCount} className="text-destructive" />
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Nenhum produto encontrado para os filtros selecionados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-4 text-left font-medium text-muted-foreground">Produto</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Código</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Categoria</th>
                  <th className="p-4 text-left font-medium text-muted-foreground">Fornecedor</th>
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
