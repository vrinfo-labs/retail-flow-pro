
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { OrdersByCustomerView } from "@/components/pedidos/OrdersByCustomerView";
import { OrdersBySupplierView } from "@/components/pedidos/OrdersBySupplierView";
import { PedidoForm } from "@/components/pedidos/PedidoForm"; // Importando o formulário
import { inMemoryData, suppliers } from "@/data/mockDropshippingData";
import { Users, Package, PlusCircle, ChevronLeft } from 'lucide-react';

type ViewMode = 'customer' | 'supplier';

const PedidosPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const [isCreating, setIsCreating] = useState(false); // Estado para controlar a visualização

  const headerActions = isCreating ? (
    <Button variant="outline" onClick={() => setIsCreating(false)}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      Voltar para Lista
    </Button>
  ) : (
    <Button onClick={() => setIsCreating(true)}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Novo Pedido
    </Button>
  );

  return (
    <MainLayout 
      title={isCreating ? "Novo Pedido" : "Pedidos"} 
      subtitle={isCreating ? "Preencha os detalhes para criar um novo pedido" : "Crie e gerencie os pedidos de seus clientes"}
      headerActions={headerActions}
    >
      {isCreating ? (
        <div className="container mx-auto py-8">
          <PedidoForm />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <ToggleGroup 
              type="single" 
              defaultValue="customer" 
              onValueChange={(value: ViewMode) => value && setViewMode(value)}
              className="bg-card p-1 rounded-lg border shadow-sm"
            >
              <ToggleGroupItem value="customer" aria-label="Ver por cliente">
                <Users className="h-4 w-4 mr-2" />
                Por Cliente
              </ToggleGroupItem>
              <ToggleGroupItem value="supplier" aria-label="Ver por fornecedor">
                <Package className="h-4 w-4 mr-2" />
                Por Fornecedor
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {viewMode === 'customer' ? (
            <OrdersByCustomerView orders={inMemoryData.orders} />
          ) : (
            <OrdersBySupplierView orders={inMemoryData.orders} suppliers={suppliers} />
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default PedidosPage;
