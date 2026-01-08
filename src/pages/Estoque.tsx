import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Package,
  Filter,
  Download,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { ProductFormDialog } from "@/components/estoque/ProductFormDialog";

export default function Estoque() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: products, isLoading } = useProducts();

  const getStockStatus = (stock: number, minStock: number) => {
    const ratio = stock / minStock;
    if (ratio <= 0.5) return "critical";
    if (ratio <= 1) return "low";
    return "normal";
  };

  const filteredProducts = products?.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo_barras?.includes(searchTerm)
  );

  const totalValue =
    products?.reduce((sum, p) => sum + p.preco_custo * p.estoque, 0) || 0;
  const lowStockCount =
    products?.filter((p) => p.estoque <= p.estoque_minimo).length || 0;
  const criticalStockCount =
    products?.filter((p) => p.estoque <= p.estoque_minimo * 0.5).length || 0;

  return (
    <MainLayout title="Estoque" subtitle="Gestão de produtos e inventário">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto por nome ou código..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <ProductFormDialog />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Total de Produtos</p>
          <p className="text-2xl font-bold text-foreground">
            {products?.length || 0}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Valor em Estoque</p>
          <p className="text-2xl font-bold text-foreground">
            R$ {totalValue.toFixed(2)}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Estoque Baixo</p>
          <p className="text-2xl font-bold text-warning">{lowStockCount}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Estoque Crítico</p>
          <p className="text-2xl font-bold text-destructive">
            {criticalStockCount}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
            <p className="text-sm text-muted-foreground/70">
              Cadastre produtos usando o botão acima
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Produto
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Código
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Categoria
                  </th>
                  <th className="text-center p-4 font-medium text-muted-foreground">
                    Estoque
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    Custo
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    Venda
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    Margem
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product, index) => {
                  const status = getStockStatus(
                    product.estoque,
                    product.estoque_minimo
                  );
                  const margin =
                    product.preco_custo > 0
                      ? ((product.preco_venda - product.preco_custo) /
                          product.preco_custo) *
                        100
                      : 0;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-foreground">
                            {product.nome}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground font-mono text-sm">
                        {product.codigo_barras || "-"}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                          {product.categories?.nome || "Sem categoria"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {status !== "normal" && (
                            <AlertTriangle
                              className={cn(
                                "h-4 w-4",
                                status === "critical"
                                  ? "text-destructive"
                                  : "text-warning"
                              )}
                            />
                          )}
                          <span
                            className={cn(
                              "font-semibold",
                              status === "critical" && "text-destructive",
                              status === "low" && "text-warning",
                              status === "normal" && "text-foreground"
                            )}
                          >
                            {product.estoque}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            / {product.estoque_minimo}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-muted-foreground">
                        R$ {product.preco_custo.toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-semibold text-foreground">
                        R$ {product.preco_venda.toFixed(2)}
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-accent font-semibold">
                          {margin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
