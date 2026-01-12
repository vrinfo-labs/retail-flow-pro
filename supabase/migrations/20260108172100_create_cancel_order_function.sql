CREATE OR REPLACE FUNCTION cancel_sale(p_sale_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  item RECORD;
BEGIN
  -- Loop através dos itens da venda para reverter o estoque
  FOR item IN 
    SELECT product_id, quantidade FROM public.sale_items WHERE sale_id = p_sale_id
  LOOP
    -- Aumentar o estoque do produto
    UPDATE public.products
    SET estoque = estoque + item.quantidade
    WHERE id = item.product_id;
  END LOOP;

  -- Marcar a venda como cancelada
  UPDATE public.sales
  SET canceled_at = now()
  WHERE id = p_sale_id;

END;
$$;
