create or replace function get_monthly_sales()
returns table (
  name text,
  vendas numeric
)
language plpgsql
as $$
begin
  return query
  with months as (
    select date_trunc('month', generate_series(now() - interval '6 months', now(), '1 month')) as month
  )
  select
    to_char(m.month, 'TMMon') as name,
    coalesce(sum(o.total_amount), 0) as vendas
  from months m
  left join public.orders o on date_trunc('month', o.created_at) = m.month
  group by m.month
  order by m.month;
end;$$;
