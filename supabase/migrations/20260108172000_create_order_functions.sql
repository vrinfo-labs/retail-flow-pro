CREATE TYPE sale_item_insert AS (product_id UUID, quantidade INTEGER, preco_unitario NUMERIC, desconto NUMERIC, subtotal NUMERIC);

CREATE OR REPLACE FUNCTION create_sale_with_items(
  sale_data JSONB,
  sale_items sale_item_insert[]
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  new_sale_id UUID;
  item sale_item_insert;
BEGIN
  -- Inserir a venda na tabela 'sales'
  INSERT INTO public.sales (customer_id, operator_id, subtotal, desconto, total, forma_pagamento, status, observacoes)
  VALUES (
    (sale_data->>'customer_id')::UUID,
    (sale_data->>'operator_id')::UUID,
    (sale_data->>'subtotal')::NUMERIC,
    (sale_data->>'desconto')::NUMERIC,
    (sale_data->>'total')::NUMERIC,
    (sale_data->>'forma_pagamento')::payment_method,
    (sale_data->>'status')::payment_status,
    (sale_data->>'observacoes')::TEXT
  )
  RETURNING id INTO new_sale_id;

  -- Loop através dos itens da venda para inseri-los
  FOREACH item IN ARRAY sale_items
  LOOP
    INSERT INTO public.sale_items (sale_id, product_id, quantidade, preco_unitario, desconto, subtotal)
    VALUES (new_sale_id, item.product_id, item.quantidade, item.preco_unitario, item.desconto, item.subtotal);
  END LOOP;

  -- Retornar a venda criada
  RETURN jsonb_build_object('id', new_sale_id);
END;
$$;
