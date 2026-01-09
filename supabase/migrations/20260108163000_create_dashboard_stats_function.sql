create or replace function get_dashboard_stats()
returns table (
  sales_today numeric,
  sales_yesterday numeric,
  orders_today bigint,
  products_in_stock bigint,
  low_stock_products bigint,
  active_customers bigint
)
language plpgsql
as $$
begin
  return query
  select
    (select coalesce(sum(total_amount), 0) from public.orders where created_at >= current_date) as sales_today,
    (select coalesce(sum(total_amount), 0) from public.orders where created_at >= current_date - interval '1 day' and created_at < current_date) as sales_yesterday,
    (select count(*) from public.orders where created_at >= current_date) as orders_today,
    (select sum(stock) from public.products) as products_in_stock,
    (select count(*) from public.products where stock < 5) as low_stock_products,
    (select count(distinct customer_id) from public.orders where created_at >= date_trunc('month', now())) as active_customers;
end;$$;
