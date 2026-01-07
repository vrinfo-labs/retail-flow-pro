import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Package,
  Filter,
  Download,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const products = [
  {
    id: 1,
    name: "Arroz Integral 5kg",
    code: "7891234567890",
    category: "Alimentos",
    stock: 45,
    minStock: 10,
    costPrice: 18.5,
    salePrice: 24.9,
  },
  {
    id: 2,
    name: "Feijão Carioca 1kg",
    code: "7891234567891",
    category: "Alimentos",
    stock: 120,
    minStock: 30,
    costPrice: 6.0,
    salePrice: 8.5,
  },
  {
    id: 3,
    name: "Óleo de Soja 900ml",
    code: "7891234567892",
    category: "Alimentos",
    stock: 5,
    minStock: 15,
    costPrice: 5.5,
    salePrice: 7.9,
  },
  {
    id: 4,
    name: "Açúcar Refinado 1kg",
    code: "7891234567893",
    category: "Alimentos",
    stock: 8,
    minStock: 20,
    costPrice: 3.2,
    salePrice: 4.5,
  },
  {
    id: 5,
    name: "Café Torrado 500g",
    code: "7891234567894",
    category: "Bebidas",
    stock: 2,
    minStock: 12,
    costPrice: 11.0,
    salePrice: 15.9,
  },
  {
    id: 6,
    name: "Leite Integral 1L",
    code: "7891234567895",
    category: "Laticínios",
    stock: 200,
    minStock: 50,
    costPrice: 4.2,
    salePrice: 5.9,
  },
  {
    id: 7,
    name: "Sabão em Pó 1kg",
    code: "7891234567896",
    category: "Limpeza",
    stock: 35,
    minStock: 15,
    costPrice: 8.0,
    salePrice: 12.9,
  },
  {
    id: 8,
    name: "Detergente 500ml",
    code: "7891234567897",
    category: "Limpeza",
    stock: 80,
    minStock: 25,
    costPrice: 1.5,
    salePrice: 2.9,
  },
];

export default function Estoque() {
  const getStockStatus = (stock: number, minStock: number) => {
    const ratio = stock / minStock;
    if (ratio <= 0.5) return "critical";
    if (ratio <= 1) return "low";
    return "normal";
  };

  return (
    <MainLayout title="Estoque" subtitle="Gestão de produtos e inventário">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produto por nome ou código..."
            className="pl-9"
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
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Total de Produtos</p>
          <p className="text-2xl font-bold text-foreground">
            {products.length}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Valor em Estoque</p>
          <p className="text-2xl font-bold text-foreground">
            R${" "}
            {products
              .reduce((sum, p) => sum + p.costPrice * p.stock, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Estoque Baixo</p>
          <p className="text-2xl font-bold text-warning">
            {products.filter((p) => p.stock <= p.minStock).length}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50 shadow-card">
          <p className="text-sm text-muted-foreground">Estoque Crítico</p>
          <p className="text-2xl font-bold text-destructive">
            {products.filter((p) => p.stock <= p.minStock * 0.5).length}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
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
              {products.map((product, index) => {
                const status = getStockStatus(product.stock, product.minStock);
                const margin =
                  ((product.salePrice - product.costPrice) /
                    product.costPrice) *
                  100;

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
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-mono text-sm">
                      {product.code}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                        {product.category}
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
                          {product.stock}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          / {product.minStock}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right text-muted-foreground">
                      R$ {product.costPrice.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-semibold text-foreground">
                      R$ {product.salePrice.toFixed(2)}
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
      </div>
    </MainLayout>
  );
}
