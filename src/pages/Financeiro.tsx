
import { MainLayout } from "@/components/layout/MainLayout";
import { SupplierGoalCard } from "@/components/financial/SupplierGoalCard";
import { CustomerCollectionMockup } from "@/components/mockups/CustomerCollectionMockup";
import { suppliers, inMemoryData } from "@/data/mockDropshippingData";

const FinanceiroPage = () => {
  return (
    <MainLayout title="Painel Financeiro" subtitle="Acompanhe as metas de compra e contas a receber.">
      <div className="space-y-8">
        
        {/* Seção de Metas de Fornecedores */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Metas de Pedido por Fornecedor</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map(supplier => (
              <SupplierGoalCard 
                key={supplier.id} 
                supplier={supplier} 
                orders={inMemoryData.orders} 
              />
            ))}
          </div>
        </div>

        {/* Seção de Contas a Receber */}
        <div>
           <h2 className="text-2xl font-bold tracking-tight mb-4">Contas a Receber</h2>
          <CustomerCollectionMockup />
        </div>

      </div>
    </MainLayout>
  );
};

export default FinanceiroPage;
