-- Migration: Configure Row-Level Security (RLS) for Catalog
-- Epic: 1 - Fundação do Catálogo e Autenticação Simplificada
-- Story: 1.2 - Configurar Row-Level Security (RLS) para Catálogo
-- Author: James (Dev Agent)
-- Date: 2025-11-09

BEGIN;

-- =====================================================================
-- STEP 1: Enable RLS on all catalog tables
-- =====================================================================

ALTER TABLE catalog_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_product_views ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- STEP 2: Create policies for catalog_users
-- =====================================================================

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON catalog_users FOR SELECT
  USING (whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');

-- Public can insert new users (signup)
CREATE POLICY "Public can insert new users"
  ON catalog_users FOR INSERT
  WITH CHECK (true);

-- Admins can read all catalog users
CREATE POLICY "Admins can read all catalog users"
  ON catalog_users FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- =====================================================================
-- STEP 3: Create policies for catalog_items
-- =====================================================================

-- Public can read visible catalog items
CREATE POLICY "Public can read visible catalog items"
  ON catalog_items FOR SELECT
  USING (visible = true);

-- Admins can manage all catalog items
CREATE POLICY "Admins can manage all catalog items"
  ON catalog_items FOR ALL
  USING (auth.uid() IS NOT NULL);

-- =====================================================================
-- STEP 4: Create policies for catalog_favorites
-- =====================================================================

-- Users can manage their own favorites
CREATE POLICY "Users can manage own favorites"
  ON catalog_favorites FOR ALL
  USING (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');

-- =====================================================================
-- STEP 5: Create policies for catalog_cart
-- =====================================================================

-- Users can manage their own cart
CREATE POLICY "Users can manage own cart"
  ON catalog_cart FOR ALL
  USING (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');

-- =====================================================================
-- STEP 6: Create policies for catalog_requests
-- =====================================================================

-- Users can read their own requests
CREATE POLICY "Users can read own requests"
  ON catalog_requests FOR SELECT
  USING (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');

-- Users can create requests
CREATE POLICY "Users can create requests"
  ON catalog_requests FOR INSERT
  WITH CHECK (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');

-- Admins can manage all requests
CREATE POLICY "Admins can manage all requests"
  ON catalog_requests FOR ALL
  USING (auth.uid() IS NOT NULL);

-- =====================================================================
-- STEP 7: Create policies for catalog_orders
-- =====================================================================

-- Admins can read all orders
CREATE POLICY "Admins can read all orders"
  ON catalog_orders FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Users can create orders
CREATE POLICY "Users can create orders"
  ON catalog_orders FOR INSERT
  WITH CHECK (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');

-- Admins can update order status
CREATE POLICY "Admins can update orders"
  ON catalog_orders FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- =====================================================================
-- STEP 8: Create policies for catalog_product_views (Analytics)
-- =====================================================================

-- Admins can read product views
CREATE POLICY "Admins can read product views"
  ON catalog_product_views FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Public can insert product views (anonymous tracking)
CREATE POLICY "Public can insert product views"
  ON catalog_product_views FOR INSERT
  WITH CHECK (true);

-- =====================================================================
-- COMMIT TRANSACTION
-- =====================================================================

COMMIT;
