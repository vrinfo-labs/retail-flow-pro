-- Enum for purchase order status
CREATE TYPE public.purchase_order_status AS ENUM (''pending'', ''partially_received'', ''received'', ''canceled'');

-- Purchase orders table
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id) NOT NULL,
  status public.purchase_order_status NOT NULL DEFAULT ''pending'',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Purchase order items table
CREATE TABLE public.purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id), -- Supplier per item
  reference TEXT, -- Free text reference
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

-- RLS Policies for purchase orders
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage purchase orders" ON public.purchase_orders
  FOR ALL TO authenticated USING (true);

-- RLS Policies for purchase order items
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage purchase order items" ON public.purchase_order_items
  FOR ALL TO authenticated USING (true);
