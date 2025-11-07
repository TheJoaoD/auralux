-- Migration: Altera RLS para permitir que todos os usuários autenticados vejam todos os dados
-- Converte de multi-tenant para single-tenant (dados compartilhados)
-- Ideal para equipe trabalhando na mesma loja

-- ============= CUSTOMERS =============
DROP POLICY IF EXISTS "Users can view own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can insert own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can delete own customers" ON public.customers;

CREATE POLICY "Authenticated users can view all customers" ON public.customers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert customers" ON public.customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update customers" ON public.customers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete customers" ON public.customers
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============= PRODUCTS =============
DROP POLICY IF EXISTS "Users can view own products" ON public.products;
DROP POLICY IF EXISTS "Users can insert own products" ON public.products;
DROP POLICY IF EXISTS "Users can update own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete own products" ON public.products;

CREATE POLICY "Authenticated users can view all products" ON public.products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============= CATEGORIES =============
DROP POLICY IF EXISTS "Users can view own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can insert own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete own categories" ON public.categories;

CREATE POLICY "Authenticated users can view all categories" ON public.categories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert categories" ON public.categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" ON public.categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories" ON public.categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============= SALES =============
DROP POLICY IF EXISTS "Users can view own sales" ON public.sales;
DROP POLICY IF EXISTS "Users can insert own sales" ON public.sales;
DROP POLICY IF EXISTS "Users can update own sales" ON public.sales;
DROP POLICY IF EXISTS "Users can delete own sales" ON public.sales;

CREATE POLICY "Authenticated users can view all sales" ON public.sales
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sales" ON public.sales
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sales" ON public.sales
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sales" ON public.sales
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============= SALE_ITEMS =============
DROP POLICY IF EXISTS "Users can view own sale items" ON public.sale_items;
DROP POLICY IF EXISTS "Users can insert own sale items" ON public.sale_items;
DROP POLICY IF EXISTS "Users can update own sale items" ON public.sale_items;
DROP POLICY IF EXISTS "Users can delete own sale items" ON public.sale_items;

CREATE POLICY "Authenticated users can view all sale items" ON public.sale_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sale items" ON public.sale_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sale items" ON public.sale_items
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sale items" ON public.sale_items
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============= INVENTORY_MOVEMENTS =============
DROP POLICY IF EXISTS "Users can view own inventory movements" ON public.inventory_movements;
DROP POLICY IF EXISTS "Users can insert own inventory movements" ON public.inventory_movements;

CREATE POLICY "Authenticated users can view all inventory movements" ON public.inventory_movements
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert inventory movements" ON public.inventory_movements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============= USERS =============
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Authenticated users can view all profiles" ON public.users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert profiles" ON public.users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update profiles" ON public.users
  FOR UPDATE USING (auth.role() = 'authenticated');
