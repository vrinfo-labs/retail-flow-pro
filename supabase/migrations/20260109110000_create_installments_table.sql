-- Tabela para armazenar as parcelas de um pedido
CREATE TABLE public.installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE NOT NULL,
  installment_number INT NOT NULL,
  due_date DATE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status public.payment_status NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pedido_id, installment_number)
);

-- Adiciona um campo para observações no crediário
ALTER TABLE public.pedidos ADD COLUMN installment_details TEXT;

-- Cria uma função para gerar as parcelas
CREATE OR REPLACE FUNCTION generate_installments(
  p_pedido_id UUID,
  p_total_amount NUMERIC,
  p_installments_count INT,
  p_start_date DATE
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_installment_amount NUMERIC;
  v_due_date DATE;
BEGIN
  IF p_installments_count <= 0 THEN
    RETURN;
  END IF;

  v_installment_amount := p_total_amount / p_installments_count;
  v_due_date := p_start_date;

  FOR i IN 1..p_installments_count LOOP
    v_due_date := p_start_date + (INTERVAL '1 month' * (i - 1));
    INSERT INTO public.installments (pedido_id, installment_number, due_date, amount)
    VALUES (p_pedido_id, i, v_due_date, v_installment_amount);
  END LOOP;
END;
$$;
