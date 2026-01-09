-- Add deleted_at column to suppliers table
ALTER TABLE public.suppliers
ADD COLUMN deleted_at TIMESTAMPTZ;

-- Remove the \'ativo\' column as it is replaced by \'deleted_at\'
ALTER TABLE public.suppliers
DROP COLUMN ativo;

-- Update RLS policies for suppliers
DROP POLICY "Authenticated users can view suppliers" ON public.suppliers;

DROP POLICY "Admins and managers can insert suppliers" ON public.suppliers;

DROP POLICY "Admins and managers can update suppliers" ON public.suppliers;

CREATE POLICY "Authenticated users can view active suppliers" ON public.suppliers
  FOR SELECT TO authenticated USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can insert suppliers" ON public.suppliers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update suppliers" ON public.suppliers
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can soft-delete suppliers" ON public.suppliers
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);
