CREATE TYPE order_item_insert AS (produto_id UUID, quantidade INT, preco_unitario NUMERIC);

CREATE OR REPLACE FUNCTION create_order_with_items(
  order_data JSONB,
  order_items order_item_insert[]
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  new_order_id UUID;
  item order_item_insert;
  product_stock INT;
BEGIN
  -- Inserir o pedido na tabela 'orders'
  INSERT INTO public.orders (cliente_id, status, total, ativo)
  VALUES (
    (order_data->>'cliente_id')::UUID,
    (order_data->>'status')::order_status, -- Garante que o tipo do status seja o correto
    (order_data->>'total')::NUMERIC,
    TRUE
  )
  RETURNING id INTO new_order_id;

  -- Loop através dos itens do pedido para inseri-los e atualizar o estoque
  FOREACH item IN ARRAY order_items
  LOOP
    -- Verificar se há estoque suficiente
    SELECT estoque INTO product_stock FROM public.products WHERE id = item.produto_id;
    IF product_stock < item.quantidade THEN
      RAISE EXCEPTION 'Estoque insuficiente para o produto ID: %', item.produto_id;
    END IF;

    -- Inserir o item do pedido
    INSERT INTO public.order_items (order_id, produto_id, quantidade, preco_unitario)
    VALUES (new_order_id, item.produto_id, item.quantidade, item.preco_unitario);

    -- Atualizar o estoque do produto
    UPDATE public.products
    SET estoque = estoque - item.quantidade
    WHERE id = item.produto_id;
  END LOOP;

  -- Retornar o pedido criado
  RETURN jsonb_build_object('id', new_order_id);
END;
$$;
