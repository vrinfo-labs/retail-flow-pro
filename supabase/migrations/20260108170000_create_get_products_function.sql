CREATE OR REPLACE FUNCTION get_products(
  p_search_term TEXT,
  p_category_id TEXT,
  p_stock_status TEXT
)
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
  SELECT p.*
  FROM public.products p
  WHERE p.ativo = TRUE
    AND (p_search_term IS NULL OR p_search_term = '' OR p.nome ILIKE '%' || p_search_term || '%' OR p.codigo_barras ILIKE '%' || p_search_term || '%')
    AND (p_category_id IS NULL OR p_category_id = '' OR p.categoria_id = p_category_id::uuid)
    AND (
      p_stock_status IS NULL OR p_stock_status = 'all' OR
      (p_stock_status = 'normal' AND p.estoque > p.estoque_minimo) OR
      (p_stock_status = 'low' AND p.estoque <= p.estoque_minimo AND p.estoque > p.estoque_minimo * 0.5) OR
      (p_stock_status = 'critical' AND p.estoque <= p.estoque_minimo * 0.5)
    )
  ORDER BY p.nome;
END;
$$ LANGUAGE plpgsql;