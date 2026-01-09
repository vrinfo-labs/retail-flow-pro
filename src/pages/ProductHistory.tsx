import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useProduct, useProductHistory } from "@/hooks/useProducts";
import { Loader2, Package, ArrowUp, ArrowDown, ChevronsLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const movementTypes = {
  venda: { icon: ArrowDown, label: 'Venda', color: 'bg-red-500' },
  compra: { icon: ArrowUp, label: 'Compra', color: 'bg-green-500' },
  ajuste_entrada: { icon: ArrowUp, label: 'Ajuste de Entrada', color: 'bg-blue-500' },
  ajuste_saida: { icon: ArrowDown, label: 'Ajuste de Saída', color: 'bg-yellow-500' },
  devolucao: { icon: ChevronsLeftRight, label: 'Devolução', color: 'bg-purple-500' },
};

export default function ProductHistory() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading: isLoadingProduct } = useProduct(id || "");
  const { data: history, isLoading: isLoadingHistory } = useProductHistory(id || "");

  const isLoading = isLoadingProduct || isLoadingHistory;

  return (
    <MainLayout title="Histórico do Produto" subtitle={`#${product?.codigo_barras || '-'}`}>
      {isLoading ? (
        <div className="flex justify-center mt-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : !product ? (
        <div className="text-center mt-8">Produto não encontrado.</div>
      ) : (
        <div className="space-y-8">
          <div className="bg-card rounded-xl p-6 border border-border/50 shadow-card">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{product.nome}</h2>
                <p className="text-muted-foreground">Estoque atual: <span className="font-bold text-primary">{product.estoque}</span></p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium">Movimentações</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-4 text-left font-medium text-muted-foreground">Data</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Tipo</th>
                    <th className="p-4 text-center font-medium text-muted-foreground">Quantidade</th>
                    <th className="p-4 text-center font-medium text-muted-foreground">Saldo Anterior</th>
                    <th className="p-4 text-center font-medium text-muted-foreground">Saldo Novo</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Usuário</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {history?.map(item => {
                    const movement = movementTypes[item.tipo];
                    const Icon = movement.icon;
                    return (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4 text-sm text-muted-foreground">{format(new Date(item.created_at), 'dd/MM/yyyy HH:mm')}</td>
                        <td className="p-4"><Badge className={`${movement.color} text-white`}><Icon className="w-3 h-3 mr-1.5" />{movement.label}</Badge></td>
                        <td className="p-4 text-center font-bold text-lg">{item.quantidade}</td>
                        <td className="p-4 text-center text-muted-foreground">{item.saldo_anterior}</td>
                        <td className="p-4 text-center font-semibold">{item.saldo_novo}</td>
                        <td className="p-4 text-muted-foreground">{item.users?.nome || '-'}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.observacao || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {history?.length === 0 && <p className="text-center p-8 text-muted-foreground">Nenhuma movimentação encontrada.</p>}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
