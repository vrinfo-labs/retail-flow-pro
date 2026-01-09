import { useParams } from 'react-router-dom';
import { usePedido } from '@/hooks/usePedidos';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PedidoItem {
  id: string;
  product: {
    nome: string;
    codigo_barras: string;
  };
  quantity: number;
  reference: string;
  supplier: {
    nome_fantasia: string;
  };
}

export function SeparacaoPedidoView() {
  const { id } = useParams<{ id: string }>();
  const { data: pedido, isLoading, error } = usePedido(id || '');

  const itemsBySupplier = pedido?.pedido_items.reduce((acc, item) => {
    const supplierName = item.supplier?.nome_fantasia || 'Fornecedor não informado';
    if (!acc[supplierName]) {
      acc[supplierName] = [];
    }
    acc[supplierName].push(item);
    return acc;
  }, {} as Record<string, PedidoItem[]>);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Ocorreu um erro ao buscar o pedido.</div>;

  return (
    <div className="space-y-4">
      {itemsBySupplier && Object.entries(itemsBySupplier).map(([supplierName, items]) => (
        <Card key={supplierName}>
          <CardHeader>
            <CardTitle>{supplierName}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Referência</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.product.nome}</div>
                      <div className="text-sm text-muted-foreground">{item.product.codigo_barras}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.reference}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
