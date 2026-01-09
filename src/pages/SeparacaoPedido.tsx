import { MainLayout } from "@/components/layout/MainLayout";
import { SeparacaoPedidoView } from "@/components/pedidos/SeparacaoPedidoView";

export default function SeparacaoPedido() {
  return (
    <MainLayout
      title="Separação de Pedido"
      subtitle="Visualize os itens do pedido para separação"
    >
      <SeparacaoPedidoView />
    </MainLayout>
  );
}
