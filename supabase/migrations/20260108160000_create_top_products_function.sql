
create or replace function get_top_selling_products(
  start_date timestamptz,
  end_date timestamptz
)
returns table (
  name text,
  quantidade bigint,
  valor numeric
)
language plpgsql
as $$
begin
  return query
  select
    p.nome as name,
    sum(oi.quantity) as quantidade,
    sum(oi.quantity * oi.price) as valor
  from public.order_items oi
  join public.products p on oi.product_id = p.id
  join public.orders o on oi.order_id = o.id
  where o.created_at >= start_date and o.created_at <= end_date
  group by p.nome
  order by valor desc
  limit 10;
end;$$;
