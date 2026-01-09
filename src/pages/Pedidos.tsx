import { MainLayout } from "@/components/layout/MainLayout";
import { PedidoForm } from "@/components/pedidos/PedidoForm";

export default function Pedidos() {
  return (
    <MainLayout
      title="Pedidos de Venda"
      subtitle="Crie e gerencie seus pedidos de venda"
    >
      <PedidoForm />
    </MainLayout>
  );
}
