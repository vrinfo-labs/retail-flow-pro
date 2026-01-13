-- Renomeia a tabela 'sales' para 'pedidos'
ALTER TABLE public.sales RENAME TO pedidos;

-- Renomeia a tabela 'sale_items' para 'pedido_items'
ALTER TABLE public.sale_items RENAME TO pedido_items;

-- Atualiza a sequência para o novo nome da tabela
ALTER SEQUENCE sales_numero_seq RENAME TO pedidos_numero_seq;

-- Renomeia o índice e a constraint da chave primária de 'pedidos'
ALTER INDEX sales_pkey RENAME TO pedidos_pkey;

-- Renomeia o índice e a constraint da chave primária de 'pedido_items'
ALTER INDEX sale_items_pkey RENAME TO pedido_items_pkey;

-- Renomeia as chaves estrangeiras
ALTER TABLE public.pedido_items RENAME CONSTRAINT sale_items_sale_id_fkey TO pedido_items_pedido_id_fkey;

-- Renomeia a coluna 'sale_id' para 'pedido_id' na tabela 'pedido_items'
ALTER TABLE public.pedido_items RENAME COLUMN sale_id TO pedido_id;

-- Renomeia a coluna 'sale_id' em 'accounts_receivable'
ALTER TABLE public.accounts_receivable RENAME COLUMN sale_id TO pedido_id;
ALTER TABLE public.accounts_receivable RENAME CONSTRAINT accounts_receivable_sale_id_fkey TO accounts_receivable_pedido_id_fkey;


-- Recria as funções que dependiam dos nomes antigos

-- Função para obter estatísticas do dashboard
DROP FUNCTION IF EXISTS public.get_dashboard_stats();
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE(
  sales_today numeric,
  sales_yesterday numeric,
  orders_today bigint,
  products_in_stock bigint,
  low_stock_products bigint,
  active_customers bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COALESCE(SUM(total), 0) FROM public.pedidos WHERE created_at >= CURRENT_DATE) AS sales_today,
    (SELECT COALESCE(SUM(total), 0) FROM public.pedidos WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' AND created_at < CURRENT_DATE) AS sales_yesterday,
    (SELECT COUNT(*) FROM public.pedidos WHERE created_at >= CURRENT_DATE) AS orders_today,
    (SELECT SUM(estoque) FROM public.products) AS products_in_stock,
    (SELECT COUNT(*) FROM public.products WHERE estoque < estoque_minimo) AS low_stock_products,
    (SELECT COUNT(DISTINCT customer_id) FROM public.pedidos WHERE created_at >= DATE_TRUNC('month', NOW())) AS active_customers;
END;
$$;

-- Função para cancelar um pedido
DROP FUNCTION IF EXISTS public.cancel_sale(uuid);
CREATE OR REPLACE FUNCTION public.cancel_pedido(p_pedido_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  item RECORD;
BEGIN
  FOR item IN
    SELECT product_id, quantidade FROM public.pedido_items WHERE pedido_id = p_pedido_id
  LOOP
    UPDATE public.products
    SET estoque = estoque + item.quantidade
    WHERE id = item.product_id;
  END LOOP;

  UPDATE public.pedidos
  SET status = 'cancelado'::public.payment_status, canceled_at = NOW()
  WHERE id = p_pedido_id;
END;
$$;
