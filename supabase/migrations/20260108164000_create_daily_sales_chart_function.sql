create or replace function get_daily_sales_for_chart()
returns table (date text, sales numeric)
language plpgsql
as $$
begin
  return query
  with all_days as (
    select generate_series(current_date - interval '29 days', current_date, '1 day')::date as day
  )
  select
    to_char(d.day, 'YYYY-MM-DD') as date,
    coalesce(sum(s.total), 0) as sales
  from all_days d
  left join public.sales s on s.created_at::date = d.day
  group by d.day
  order by d.day;
end;$$;
