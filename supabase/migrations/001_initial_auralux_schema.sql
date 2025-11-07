-- ============================================================================
-- AURALUX PWA - INITIAL DATABASE SCHEMA
-- Version: 1.0
-- Created: 2025-11-07
-- Description: Complete database schema for Auralux Store Management System
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table (extends Supabase auth.users)
-- Stores store-specific metadata for authenticated users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.users IS 'Store metadata for authenticated users';
COMMENT ON COLUMN public.users.id IS 'Foreign key to auth.users';
COMMENT ON COLUMN public.users.store_name IS 'Name of the store';

-- Categories table
-- Organizes products into categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT unique_category_per_user UNIQUE (user_id, name)
);

COMMENT ON TABLE public.categories IS 'Product categories for inventory organization';
COMMENT ON COLUMN public.categories.user_id IS 'Store owner reference';

-- Customers table
-- Stores customer contact information and purchase metrics
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  address TEXT,
  purchase_count INTEGER DEFAULT 0 NOT NULL CHECK (purchase_count >= 0),
  total_purchases DECIMAL(10,2) DEFAULT 0.00 NOT NULL CHECK (total_purchases >= 0),
  total_due DECIMAL(10,2) DEFAULT 0.00 NOT NULL CHECK (total_due >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT unique_whatsapp_per_user UNIQUE (user_id, whatsapp)
);

COMMENT ON TABLE public.customers IS 'Customer contact information and purchase history metrics';
COMMENT ON COLUMN public.customers.purchase_count IS 'Total number of purchases (auto-updated by trigger)';
COMMENT ON COLUMN public.customers.total_purchases IS 'Total amount spent by customer (auto-updated by trigger)';
COMMENT ON COLUMN public.customers.total_due IS 'Outstanding balance owed by customer';

-- Products table
-- Manages inventory items with pricing and stock tracking
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  sku TEXT,
  image_url TEXT,
  sale_price DECIMAL(10,2) NOT NULL CHECK (sale_price >= 0),
  cost_price DECIMAL(10,2) NOT NULL CHECK (cost_price >= 0),
  quantity INTEGER DEFAULT 0 NOT NULL CHECK (quantity >= 0),
  low_stock_threshold INTEGER DEFAULT 5 NOT NULL CHECK (low_stock_threshold >= 0),
  supplier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT unique_sku_per_user UNIQUE (user_id, sku),
  CONSTRAINT sale_price_gte_cost_price CHECK (sale_price >= cost_price)
);

COMMENT ON TABLE public.products IS 'Product inventory with pricing and stock levels';
COMMENT ON COLUMN public.products.sku IS 'Stock Keeping Unit (optional unique identifier)';
COMMENT ON COLUMN public.products.quantity IS 'Current stock quantity (auto-updated by trigger)';
COMMENT ON COLUMN public.products.low_stock_threshold IS 'Alert threshold for low stock warnings';

-- Sales table
-- Records sales transactions with payment details
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'cash', 'installment')),
  installment_count INTEGER DEFAULT 1 NOT NULL,
  actual_amount_received DECIMAL(10,2),
  status TEXT DEFAULT 'completed' NOT NULL CHECK (status IN ('completed', 'pending', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT valid_installment_count CHECK (
    (payment_method = 'installment' AND installment_count BETWEEN 1 AND 12) OR
    (payment_method != 'installment' AND installment_count = 1)
  )
);

COMMENT ON TABLE public.sales IS 'Sales transactions with payment information';
COMMENT ON COLUMN public.sales.installment_count IS 'Number of installments (1-12, only for installment payment method)';
COMMENT ON COLUMN public.sales.actual_amount_received IS 'Actual amount received (may differ from total_amount)';

-- Sale items table
-- Line items for each sale with product snapshot pricing
CREATE TABLE IF NOT EXISTS public.sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  unit_cost DECIMAL(10,2) NOT NULL CHECK (unit_cost >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.sale_items IS 'Individual line items for sales transactions';
COMMENT ON COLUMN public.sale_items.product_name IS 'Product name snapshot at time of sale';
COMMENT ON COLUMN public.sale_items.unit_price IS 'Price snapshot at time of sale';
COMMENT ON COLUMN public.sale_items.unit_cost IS 'Cost snapshot at time of sale';

-- Inventory movements table
-- Audit trail for all inventory changes
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('addition', 'sale', 'adjustment')),
  quantity_change INTEGER NOT NULL,
  quantity_before INTEGER NOT NULL CHECK (quantity_before >= 0),
  quantity_after INTEGER NOT NULL CHECK (quantity_after >= 0),
  reference_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.inventory_movements IS 'Audit trail for inventory stock changes';
COMMENT ON COLUMN public.inventory_movements.reference_id IS 'Reference to related entity (sale_id, etc.)';

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_whatsapp ON public.customers(whatsapp);
CREATE INDEX IF NOT EXISTS idx_customers_full_name ON public.customers USING gin(to_tsvector('portuguese', full_name));

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_quantity ON public.products(quantity);
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products USING gin(to_tsvector('portuguese', name));

-- Sales indexes
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON public.sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON public.sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON public.sales(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_payment_method ON public.sales(payment_method);
CREATE INDEX IF NOT EXISTS idx_sales_status ON public.sales(status);

-- Sale items indexes
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON public.sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON public.sale_items(product_id);

-- Inventory movements indexes
CREATE INDEX IF NOT EXISTS idx_inventory_movements_user_id ON public.inventory_movements(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_product_id ON public.inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created_at ON public.inventory_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_reference_id ON public.inventory_movements(reference_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_movement_type ON public.inventory_movements(movement_type);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_updated_at_column IS 'Auto-updates updated_at timestamp on row modification';

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Update customer metrics on sale creation/update
CREATE OR REPLACE FUNCTION public.update_customer_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.customer_id IS NOT NULL THEN
    UPDATE public.customers
    SET
      purchase_count = purchase_count + 1,
      total_purchases = total_purchases + NEW.total_amount
    WHERE id = NEW.customer_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.customer_id IS NOT NULL THEN
    -- Recalculate from all sales for accuracy
    UPDATE public.customers
    SET
      purchase_count = (
        SELECT COUNT(*) FROM public.sales
        WHERE customer_id = NEW.customer_id AND status = 'completed'
      ),
      total_purchases = (
        SELECT COALESCE(SUM(total_amount), 0) FROM public.sales
        WHERE customer_id = NEW.customer_id AND status = 'completed'
      )
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_on_sale
  AFTER INSERT OR UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.update_customer_on_sale();

COMMENT ON FUNCTION public.update_customer_on_sale IS 'Auto-updates customer purchase metrics when sales are created/modified';

-- Trigger: Update inventory on sale item creation
CREATE OR REPLACE FUNCTION public.update_inventory_on_sale()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_product_qty_before INTEGER;
  v_product_qty_after INTEGER;
BEGIN
  IF NEW.product_id IS NOT NULL THEN
    -- Get user_id and current quantity
    SELECT user_id, quantity INTO v_user_id, v_product_qty_before
    FROM public.products
    WHERE id = NEW.product_id;

    -- Update product quantity
    UPDATE public.products
    SET quantity = quantity - NEW.quantity
    WHERE id = NEW.product_id
    RETURNING quantity INTO v_product_qty_after;

    -- Create inventory movement record
    INSERT INTO public.inventory_movements (
      user_id,
      product_id,
      movement_type,
      quantity_change,
      quantity_before,
      quantity_after,
      reference_id,
      notes
    ) VALUES (
      v_user_id,
      NEW.product_id,
      'sale',
      -NEW.quantity,
      v_product_qty_before,
      v_product_qty_after,
      NEW.sale_id,
      'Automatic inventory reduction from sale #' || NEW.sale_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory_on_sale
  AFTER INSERT ON public.sale_items
  FOR EACH ROW EXECUTE FUNCTION public.update_inventory_on_sale();

COMMENT ON FUNCTION public.update_inventory_on_sale IS 'Auto-decrements product quantity and creates inventory movement when sale items are created';

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Daily sales metrics
CREATE OR REPLACE VIEW public.v_daily_sales_metrics AS
SELECT
  user_id,
  DATE(created_at) AS sale_date,
  COUNT(*) AS total_sales,
  SUM(total_amount) AS total_revenue,
  AVG(total_amount) AS avg_sale_amount,
  COUNT(DISTINCT customer_id) AS unique_customers
FROM public.sales
WHERE status = 'completed'
GROUP BY user_id, DATE(created_at)
ORDER BY sale_date DESC;

COMMENT ON VIEW public.v_daily_sales_metrics IS 'Daily sales aggregation with revenue and customer metrics';

-- View: Payment method breakdown
CREATE OR REPLACE VIEW public.v_payment_method_breakdown AS
SELECT
  user_id,
  payment_method,
  COUNT(*) AS transaction_count,
  SUM(total_amount) AS total_amount,
  ROUND(AVG(total_amount), 2) AS avg_transaction_amount
FROM public.sales
WHERE status = 'completed'
GROUP BY user_id, payment_method
ORDER BY user_id, transaction_count DESC;

COMMENT ON VIEW public.v_payment_method_breakdown IS 'Payment method distribution and statistics';

-- View: Low stock products
CREATE OR REPLACE VIEW public.v_low_stock_products AS
SELECT
  p.id,
  p.user_id,
  p.name,
  p.sku,
  p.quantity,
  p.low_stock_threshold,
  c.name AS category_name
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE p.quantity <= p.low_stock_threshold
ORDER BY p.quantity ASC, p.name ASC;

COMMENT ON VIEW public.v_low_stock_products IS 'Products at or below their low stock threshold';

-- View: Top selling products
CREATE OR REPLACE VIEW public.v_top_selling_products AS
SELECT
  p.user_id,
  p.id AS product_id,
  p.name AS product_name,
  p.sku,
  SUM(si.quantity) AS total_quantity_sold,
  COUNT(DISTINCT si.sale_id) AS number_of_sales,
  SUM(si.quantity * si.unit_price) AS total_revenue,
  SUM(si.quantity * (si.unit_price - si.unit_cost)) AS total_profit
FROM public.products p
INNER JOIN public.sale_items si ON p.id = si.product_id
INNER JOIN public.sales s ON si.sale_id = s.id
WHERE s.status = 'completed'
GROUP BY p.user_id, p.id, p.name, p.sku
ORDER BY total_quantity_sold DESC;

COMMENT ON VIEW public.v_top_selling_products IS 'Best-selling products by quantity with revenue and profit metrics';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- Users RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Categories RLS Policies
CREATE POLICY "Users can view own categories"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- Customers RLS Policies
CREATE POLICY "Users can view own customers"
  ON public.customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customers"
  ON public.customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers"
  ON public.customers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own customers"
  ON public.customers FOR DELETE
  USING (auth.uid() = user_id);

-- Products RLS Policies
CREATE POLICY "Users can view own products"
  ON public.products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON public.products FOR DELETE
  USING (auth.uid() = user_id);

-- Sales RLS Policies
CREATE POLICY "Users can view own sales"
  ON public.sales FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sales"
  ON public.sales FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sales"
  ON public.sales FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sales"
  ON public.sales FOR DELETE
  USING (auth.uid() = user_id);

-- Sale Items RLS Policies
CREATE POLICY "Users can view own sale items"
  ON public.sale_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.sales
    WHERE sales.id = sale_items.sale_id
    AND sales.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own sale items"
  ON public.sale_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.sales
    WHERE sales.id = sale_items.sale_id
    AND sales.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own sale items"
  ON public.sale_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.sales
    WHERE sales.id = sale_items.sale_id
    AND sales.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own sale items"
  ON public.sale_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.sales
    WHERE sales.id = sale_items.sale_id
    AND sales.user_id = auth.uid()
  ));

-- Inventory Movements RLS Policies
CREATE POLICY "Users can view own inventory movements"
  ON public.inventory_movements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory movements"
  ON public.inventory_movements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- STORAGE SETUP
-- Note: Storage buckets cannot be created via SQL migration
-- This must be done via Supabase MCP or Dashboard
-- ============================================================================

-- REQUIRED MANUAL STEP:
-- Create storage bucket 'products' with the following settings:
--   - Public: true (read-only)
--   - File size limit: 5MB
--   - Allowed MIME types: image/jpeg, image/png, image/webp
--   - RLS Policy: Authenticated users can upload to own folder (user_id in path)

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================