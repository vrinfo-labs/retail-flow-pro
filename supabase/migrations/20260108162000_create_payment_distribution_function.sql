create or replace function get_payment_method_distribution()
returns table (
  name text,
  value numeric,
  color text
)
language plpgsql
as $$
begin
  return query
  select
    pm.name as name,
    count(o.id)::numeric as value,
    case 
      when pm.name = 'Cartão' then 'hsl(222 47% 20%)'
      when pm.name = 'Dinheiro' then 'hsl(160 84% 39%)'
      when pm.name = 'PIX' then 'hsl(199 89% 48%)'
      else 'hsl(38 92% 50%)'
    end as color
  from public.payment_methods pm
  join public.orders o on pm.id = o.payment_method_id
  group by pm.name
  order by value desc;
end;$$;
