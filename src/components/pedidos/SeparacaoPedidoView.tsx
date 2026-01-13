import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePedido } from '@/hooks/usePedidos';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Printer } from 'lucide-react';

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
  const [separatedItems, setSeparatedItems] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (itemId: string) => {
    setSeparatedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const itemsBySupplier = pedido?.pedido_items.reduce((acc, item) => {
    const supplierName = item.supplier?.nome_fantasia || 'Fornecedor não informado';
    if (!acc[supplierName]) {
      acc[supplierName] = [];
    }
    acc[supplierName].push(item);
    return acc;
  }, {} as Record<string, PedidoItem[]>);

  const getSeparatedCount = (items: PedidoItem[]) => {
    return items.filter(item => separatedItems[item.id]).length;
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Ocorreu um erro ao buscar o pedido.</div>;

  return (
    <div className="space-y-4">
      {itemsBySupplier && Object.entries(itemsBySupplier).map(([supplierName, items]) => {
        const separatedCount = getSeparatedCount(items);
        const allItemsSeparated = separatedCount === items.length;

        return (
          <Card key={supplierName}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{supplierName}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {separatedCount} de {items.length} itens separados
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Referência</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className={separatedItems[item.id] ? 'bg-green-100/50' : ''}>
                      <TableCell>
                        <Checkbox
                          checked={separatedItems[item.id] || false}
                          onCheckedChange={() => handleCheckboxChange(item.id)}
                        />
                      </TableCell>
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
        );
      })}
    </div>
  );
}
