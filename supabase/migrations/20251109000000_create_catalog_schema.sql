-- Migration: Create Catalog Schema for Public Catalog
-- Epic: 1 - Fundação do Catálogo e Autenticação Simplificada
-- Story: 1.1 - Criar Schema de Banco de Dados do Catálogo
-- Author: James (Dev Agent)
-- Date: 2025-11-09

BEGIN;

-- =====================================================================
-- STEP 1: Create ENUMs
-- =====================================================================

-- ENUM for catalog request status
CREATE TYPE catalog_request_status AS ENUM (
  'pending',
  'analyzing',
  'fulfilled',
  'unavailable'
);

-- ENUM for catalog order status
CREATE TYPE catalog_order_status AS ENUM (
  'sent',
  'contacted',
  'converted',
  'cancelled'
);

-- =====================================================================
-- STEP 2: Create update_updated_at_column function (if not exists)
-- =====================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- STEP 3: Create catalog_users table (no dependencies)
-- =====================================================================

CREATE TABLE catalog_users (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  whatsapp VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for catalog_users
CREATE UNIQUE INDEX idx_catalog_users_whatsapp ON catalog_users(whatsapp);
CREATE INDEX idx_catalog_users_created_at ON catalog_users(created_at DESC);

-- Trigger for catalog_users updated_at
CREATE TRIGGER update_catalog_users_updated_at
  BEFORE UPDATE ON catalog_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- STEP 4: Create catalog_items table (extends products)
-- =====================================================================

CREATE TABLE catalog_items (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  visible BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  featured_order INTEGER,

  -- Fragrance details
  fragrance_notes_top TEXT,
  fragrance_notes_heart TEXT,
  fragrance_notes_base TEXT,
  occasion TEXT[],
  intensity VARCHAR(50),
  longevity VARCHAR(50),
  stock_return_date DATE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_product_catalog UNIQUE(product_id)
);

-- Indexes for catalog_items
CREATE INDEX idx_catalog_items_visible ON catalog_items(visible) WHERE visible = true;
CREATE INDEX idx_catalog_items_featured ON catalog_items(featured, featured_order) WHERE featured = true;
CREATE INDEX idx_catalog_items_product_id ON catalog_items(product_id);

-- Trigger for catalog_items updated_at
CREATE TRIGGER update_catalog_items_updated_at
  BEFORE UPDATE ON catalog_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- STEP 5: Create catalog_favorites table
-- =====================================================================

CREATE TABLE catalog_favorites (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_whatsapp VARCHAR(20) NOT NULL REFERENCES catalog_users(whatsapp) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_user_favorite UNIQUE(user_whatsapp, product_id)
);

-- Indexes for catalog_favorites
CREATE INDEX idx_catalog_favorites_user ON catalog_favorites(user_whatsapp);
CREATE INDEX idx_catalog_favorites_product ON catalog_favorites(product_id);
CREATE INDEX idx_catalog_favorites_created ON catalog_favorites(created_at DESC);

-- =====================================================================
-- STEP 6: Create catalog_cart table
-- =====================================================================

CREATE TABLE catalog_cart (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_whatsapp VARCHAR(20) NOT NULL REFERENCES catalog_users(whatsapp) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_user_cart_item UNIQUE(user_whatsapp, product_id)
);

-- Indexes for catalog_cart
CREATE INDEX idx_catalog_cart_user ON catalog_cart(user_whatsapp);
CREATE INDEX idx_catalog_cart_product ON catalog_cart(product_id);

-- Trigger for catalog_cart updated_at
CREATE TRIGGER update_catalog_cart_updated_at
  BEFORE UPDATE ON catalog_cart
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- STEP 7: Create catalog_requests table
-- =====================================================================

CREATE TABLE catalog_requests (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_whatsapp VARCHAR(20) NOT NULL REFERENCES catalog_users(whatsapp) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  observations TEXT,
  status catalog_request_status DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for catalog_requests
CREATE INDEX idx_catalog_requests_user ON catalog_requests(user_whatsapp);
CREATE INDEX idx_catalog_requests_status ON catalog_requests(status);
CREATE INDEX idx_catalog_requests_created ON catalog_requests(created_at DESC);

-- Trigger for catalog_requests updated_at
CREATE TRIGGER update_catalog_requests_updated_at
  BEFORE UPDATE ON catalog_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- STEP 8: Create catalog_orders table
-- =====================================================================

CREATE TABLE catalog_orders (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_whatsapp VARCHAR(20) NOT NULL REFERENCES catalog_users(whatsapp) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status catalog_order_status DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for catalog_orders
CREATE INDEX idx_catalog_orders_user ON catalog_orders(user_whatsapp);
CREATE INDEX idx_catalog_orders_status ON catalog_orders(status);
CREATE INDEX idx_catalog_orders_created ON catalog_orders(created_at DESC);
CREATE INDEX idx_catalog_orders_items_gin ON catalog_orders USING GIN(items);

-- =====================================================================
-- STEP 9: Create catalog_product_views table (Analytics)
-- =====================================================================

CREATE TABLE catalog_product_views (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_whatsapp VARCHAR(20),
  session_id UUID NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for catalog_product_views
CREATE INDEX idx_catalog_views_product ON catalog_product_views(product_id, viewed_at DESC);
CREATE INDEX idx_catalog_views_session ON catalog_product_views(session_id, product_id);

-- =====================================================================
-- COMMIT TRANSACTION
-- =====================================================================

COMMIT;
