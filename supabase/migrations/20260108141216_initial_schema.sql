-- Enum para níveis de acesso
CREATE TYPE public.app_role AS ENUM (''admin'', ''gerente'', ''operador'');

-- Enum para status de pagamento
CREATE TYPE public.payment_status AS ENUM (''pendente'', ''parcial'', ''quitado'', ''atrasado'');

-- Enum para formas de pagamento
CREATE TYPE public.payment_method AS ENUM (''dinheiro'', ''cartao_credito'', ''cartao_debito'', ''pix'', ''crediario'');

-- Enum para status do caixa
CREATE TYPE public.cash_register_status AS ENUM (''aberto'', ''fechado'');

-- Enum para status de pedido
CREATE TYPE public.order_status AS ENUM (''Pendente'', ''Em separação'', ''Enviado'', ''Entregue'', ''Cancelado'');


-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  telefone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de roles de usuários (separada por segurança)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT ''operador'',
  UNIQUE (user_id, role)
);

-- Função para verificar role do usuário
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Tabela de categorias de produtos
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de fornecedores
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  cnpj TEXT UNIQUE,
  contato TEXT,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de produtos
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE,
  codigo_barras TEXT UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  supplier_id UUID REFERENCES public.suppliers(id) NOT NULL,
  categoria_id UUID REFERENCES public.categories(id),
  preco_custo DECIMAL(10,2) NOT NULL DEFAULT 0,
  preco_venda DECIMAL(10,2) NOT NULL,
  estoque INTEGER NOT NULL DEFAULT 0,
  estoque_minimo INTEGER NOT NULL DEFAULT 10,
  unidade TEXT DEFAULT ''un'',
  ativo BOOLEAN DEFAULT true,
  imagem_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de clientes
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cpf_cnpj TEXT UNIQUE,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  data_nascimento DATE,
  limite_credito DECIMAL(10,2) DEFAULT 0,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Pedidos
CREATE TABLE public.pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id),
    total DECIMAL(10, 2) NOT NULL,
    status order_status NOT NULL DEFAULT ''Pendente'',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Itens de Pedido
CREATE TABLE public.pedido_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) NOT NULL,
    supplier_id UUID REFERENCES public.suppliers(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    reference TEXT
);


-- Tabela de caixas (terminais)
CREATE TABLE public.cash_registers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  impressora TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de operadores de caixa
CREATE TABLE public.operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  turno TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de sessões de caixa (abertura/fechamento)
CREATE TABLE public.cash_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cash_register_id UUID REFERENCES public.cash_registers(id) NOT NULL,
  operator_id UUID REFERENCES public.operators(id) NOT NULL,
  status cash_register_status NOT NULL DEFAULT ''aberto'',
  valor_abertura DECIMAL(10,2) NOT NULL DEFAULT 0,
  valor_fechamento DECIMAL(10,2),
  data_abertura TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_fechamento TIMESTAMPTZ,
  observacoes TEXT
);

-- Tabela de vendas
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero SERIAL,
  cash_session_id UUID REFERENCES public.cash_sessions(id),
  customer_id UUID REFERENCES public.customers(id),
  operator_id UUID REFERENCES public.operators(id) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  desconto DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  forma_pagamento payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT ''quitado'',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de itens de venda
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantidade INTEGER NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  desconto DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Tabela de movimentações de estoque
CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) NOT NULL,
  tipo TEXT NOT NULL, -- ''entrada'', ''saida'', ''ajuste''
  quantidade INTEGER NOT NULL,
  motivo TEXT,
  usuario_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de contas a pagar
CREATE TABLE public.accounts_payable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES public.suppliers(id),
  descricao TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status payment_status NOT NULL DEFAULT ''pendente'',
  categoria TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de contas a receber
CREATE TABLE public.accounts_receivable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id),
  sale_id UUID REFERENCES public.sales(id),
  descricao TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status payment_status NOT NULL DEFAULT ''pendente'',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de movimentações de caixa (sangrias/suprimentos)
CREATE TABLE public.cash_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cash_session_id UUID REFERENCES public.cash_sessions(id) NOT NULL,
  tipo TEXT NOT NULL, -- ''sangria'', ''suprimento''
  valor DECIMAL(10,2) NOT NULL,
  motivo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger para criar perfil ao cadastrar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> ''nome'', new.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, ''operador'');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON public.pedidos 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- Trigger para atualizar estoque após venda
CREATE OR REPLACE FUNCTION public.update_stock_on_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.products
  SET estoque = estoque - NEW.quantidade
  WHERE id = NEW.product_id;
  
  INSERT INTO public.stock_movements (product_id, tipo, quantidade, motivo)
  VALUES (NEW.product_id, ''saida'', NEW.quantidade, ''Venda #'' || NEW.sale_id);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_sale_item_created
  AFTER INSERT ON public.sale_items
  FOR EACH ROW EXECUTE FUNCTION public.update_stock_on_sale();

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_registers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts_payable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts_receivable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Categories - authenticated users can read, admins/gerentes can write
CREATE POLICY "Authenticated users can view categories" ON public.categories
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can insert categories" ON public.categories
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), ''admin'') OR public.has_role(auth.uid(), ''gerente'')
  );
CREATE POLICY "Admins and managers can update categories" ON public.categories
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), ''admin'') OR public.has_role(auth.uid(), ''gerente'')
  );

-- Products - authenticated users can read, admins/gerentes can write
CREATE POLICY "Authenticated users can view products" ON public.products
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), ''admin'') OR public.has_role(auth.uid(), ''gerente'')
  );
CREATE POLICY "Admins and managers can update products" ON public.products
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), ''admin'') OR public.has_role(auth.uid(), ''gerente'')
  );

-- Customers - all authenticated can CRUD
CREATE POLICY "Authenticated users can view customers" ON public.customers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert customers" ON public.customers
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update customers" ON public.customers
  FOR UPDATE TO authenticated USING (true);

-- Suppliers - authenticated can read, admins/gerentes can write
CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can insert suppliers" ON public.suppliers
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), ''admin'') OR public.has_role(auth.uid(), ''gerente'')
  );
CREATE POLICY "Admins and managers can update suppliers" ON public.suppliers
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), ''admin'') OR public.has_role(auth.uid(), ''gerente'')
  );

-- Pedidos - authenticated users can create and view all
CREATE POLICY "Authenticated users can view pedidos" ON public.pedidos
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert pedidos" ON public.pedidos
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update pedidos" ON public.pedidos
    FOR UPDATE TO authenticated USING (true);

-- Pedido Items - authenticated users can create and view all
CREATE POLICY "Authenticated users can view pedido items" ON public.pedido_items
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert pedido items" ON public.pedido_items
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update pedido items" ON public.pedido_items
    FOR UPDATE TO authenticated USING (true);

-- Cash registers - authenticated can read, admins can write
CREATE POLICY "Authenticated users can view cash registers" ON public.cash_registers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert cash registers" ON public.cash_registers
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''admin''));
CREATE POLICY "Admins can update cash registers" ON public.cash_registers
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin''));

-- Operators - authenticated can read, admins can write
CREATE POLICY "Authenticated users can view operators" ON public.operators
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert operators" ON public.operators
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''admin''));
CREATE POLICY "Admins can update operators" ON public.operators
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin''));

-- Cash sessions - authenticated can CRUD
CREATE POLICY "Authenticated users can view cash sessions" ON public.cash_sessions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert cash sessions" ON public.cash_sessions
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update cash sessions" ON public.cash_sessions
  FOR UPDATE TO authenticated USING (true);

-- Sales - authenticated can CRUD
CREATE POLICY "Authenticated users can view sales" ON public.sales
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert sales" ON public.sales
  FOR INSERT TO authenticated WITH CHECK (true);

-- Sale items - authenticated can CRUD
CREATE POLICY "Authenticated users can view sale items" ON public.sale_items
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert sale items" ON public.sale_items
  FOR INSERT TO authenticated WITH CHECK (true);

-- Stock movements - authenticated can read, admins/gerentes can write
CREATE POLICY "Authenticated users can view stock movements" ON public.stock_movements
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can insert stock movements" ON public.stock_movements
  FOR INSERT TO authenticated WITH CHECK (true);

-- Accounts payable - authenticated can read, admins/gerentes can write
CREATE POLICY "Authenticated users can view accounts payable" ON public.accounts_payable
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage accounts payable" ON public.accounts_payable
  FOR ALL TO authenticated USING (
    public.has_role(auth.uid(), ''admin'') OR public.has_role(auth.uid(), ''gerente'')
  );

-- Accounts receivable - authenticated can read, admins/gerentes can write
CREATE POLICY "Authenticated users can view accounts receivable" ON public.accounts_receivable
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and managers can manage accounts receivable" ON public.accounts_receivable
  FOR ALL TO authenticated USING (
    public.has_role(auth.uid(), ''admin'') OR public.has_role(auth.uid(), ''gerente'')
  );

-- Cash movements - authenticated can CRUD
CREATE POLICY "Authenticated users can view cash movements" ON public.cash_movements
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert cash movements" ON public.cash_movements
  FOR INSERT TO authenticated WITH CHECK (true);

-- Inserir dados iniciais
INSERT INTO public.categories (nome, descricao) VALUES
  (''Alimentos'', ''Produtos alimentícios em geral''),
  (''Bebidas'', ''Bebidas em geral''),
  (''Laticínios'', ''Leite e derivados''),
  (''Limpeza'', ''Produtos de limpeza''),
  (''Higiene'', ''Produtos de higiene pessoal'');

INSERT INTO public.cash_registers (nome, impressora) VALUES
  (''Caixa 01'', ''Térmica 01''),
  (''Caixa 02'', ''Térmica 02''),
  (''Caixa 03'', ''Térmica 03''),
  (''Caixa Rápido'', ''Térmica 04'');
