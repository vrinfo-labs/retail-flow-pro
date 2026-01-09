CREATE OR REPLACE FUNCTION cancel_order(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  item RECORD;
BEGIN
  -- Loop através dos itens do pedido para reverter o estoque
  FOR item IN 
    SELECT produto_id, quantidade FROM public.order_items WHERE order_id = p_order_id
  LOOP
    -- Aumentar o estoque do produto
    UPDATE public.products
    SET estoque = estoque + item.quantidade
    WHERE id = item.produto_id;
  END LOOP;

  -- Marcar o pedido como cancelado e inativo
  UPDATE public.orders
  SET status = 'cancelled', ativo = FALSE
  WHERE id = p_order_id;

END;
$$;
