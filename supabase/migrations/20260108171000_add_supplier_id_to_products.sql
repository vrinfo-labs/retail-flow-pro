-- Add supplier_id to products table
ALTER TABLE public.products
ADD COLUMN supplier_id UUID REFERENCES public.suppliers(id);

-- Optional: Add an index for faster lookups
CREATE INDEX IF NOT EXISTS products_supplier_id_idx ON public.products (supplier_id);
