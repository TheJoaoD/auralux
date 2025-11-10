# Database Schema & Migrations

## New Tables Schema

### 1. catalog_users

**Purpose:** Store catalog public users (WhatsApp-based authentication)

```sql
CREATE TABLE catalog_users (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  whatsapp VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_catalog_users_whatsapp ON catalog_users(whatsapp);
CREATE INDEX idx_catalog_users_created_at ON catalog_users(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_catalog_users_updated_at
  BEFORE UPDATE ON catalog_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**RLS Policies:**
```sql
ALTER TABLE catalog_users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can read own data"
  ON catalog_users FOR SELECT
  USING (whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');

-- Allow public insert (signup)
CREATE POLICY "Public can insert new users"
  ON catalog_users FOR INSERT
  WITH CHECK (true);
```

### 2. catalog_items

**Purpose:** Extended product metadata for catalog (visibility, featured status, fragrance notes)

```sql
CREATE TABLE catalog_items (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  visible BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  featured_order INTEGER,

  -- Extended metadata
  fragrance_notes_top TEXT,
  fragrance_notes_heart TEXT,
  fragrance_notes_base TEXT,
  occasion TEXT[], -- ['day', 'night', 'casual', 'formal']
  intensity VARCHAR(50), -- 'suave', 'moderada', 'forte'
  longevity VARCHAR(50), -- 'curta', 'media', 'longa', 'muito_longa'
  stock_return_date DATE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_product_catalog UNIQUE(product_id)
);

-- Indexes
CREATE INDEX idx_catalog_items_visible ON catalog_items(visible) WHERE visible = true;
CREATE INDEX idx_catalog_items_featured ON catalog_items(featured, featured_order) WHERE featured = true;
CREATE INDEX idx_catalog_items_product_id ON catalog_items(product_id);

-- Trigger
CREATE TRIGGER update_catalog_items_updated_at
  BEFORE UPDATE ON catalog_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**RLS Policies:**
```sql
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;

-- Public can only see visible items
CREATE POLICY "Public can read visible catalog items"
  ON catalog_items FOR SELECT
  USING (visible = true);

-- Admin full access
CREATE POLICY "Admins can manage all catalog items"
  ON catalog_items FOR ALL
  USING (auth.uid() IS NOT NULL);
```

### 3. catalog_favorites

**Purpose:** User favorite products

```sql
CREATE TABLE catalog_favorites (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_whatsapp VARCHAR(20) NOT NULL REFERENCES catalog_users(whatsapp) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_user_favorite UNIQUE(user_whatsapp, product_id)
);

-- Indexes
CREATE INDEX idx_catalog_favorites_user ON catalog_favorites(user_whatsapp);
CREATE INDEX idx_catalog_favorites_product ON catalog_favorites(product_id);
CREATE INDEX idx_catalog_favorites_created ON catalog_favorites(created_at DESC);
```

**RLS Policies:**
```sql
ALTER TABLE catalog_favorites ENABLE ROW LEVEL SECURITY;

-- Users manage their own favorites
CREATE POLICY "Users can manage own favorites"
  ON catalog_favorites FOR ALL
  USING (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');
```

### 4. catalog_cart

**Purpose:** Shopping cart items

```sql
CREATE TABLE catalog_cart (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_whatsapp VARCHAR(20) NOT NULL REFERENCES catalog_users(whatsapp) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_user_cart_item UNIQUE(user_whatsapp, product_id)
);

-- Indexes
CREATE INDEX idx_catalog_cart_user ON catalog_cart(user_whatsapp);
CREATE INDEX idx_catalog_cart_product ON catalog_cart(product_id);

-- Trigger
CREATE TRIGGER update_catalog_cart_updated_at
  BEFORE UPDATE ON catalog_cart
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**RLS Policies:**
```sql
ALTER TABLE catalog_cart ENABLE ROW LEVEL SECURITY;

-- Users manage their own cart
CREATE POLICY "Users can manage own cart"
  ON catalog_cart FOR ALL
  USING (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');
```

### 5. catalog_requests

**Purpose:** Product requests from customers

```sql
CREATE TYPE catalog_request_status AS ENUM ('pending', 'analyzing', 'fulfilled', 'unavailable');

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

-- Indexes
CREATE INDEX idx_catalog_requests_user ON catalog_requests(user_whatsapp);
CREATE INDEX idx_catalog_requests_status ON catalog_requests(status);
CREATE INDEX idx_catalog_requests_created ON catalog_requests(created_at DESC);

-- Trigger
CREATE TRIGGER update_catalog_requests_updated_at
  BEFORE UPDATE ON catalog_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**RLS Policies:**
```sql
ALTER TABLE catalog_requests ENABLE ROW LEVEL SECURITY;

-- Users can read their own requests and create new ones
CREATE POLICY "Users can read own requests"
  ON catalog_requests FOR SELECT
  USING (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');

CREATE POLICY "Users can create requests"
  ON catalog_requests FOR INSERT
  WITH CHECK (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');

-- Admins can manage all requests
CREATE POLICY "Admins can manage all requests"
  ON catalog_requests FOR ALL
  USING (auth.uid() IS NOT NULL);
```

### 6. catalog_orders

**Purpose:** Finalized orders sent via WhatsApp

```sql
CREATE TYPE catalog_order_status AS ENUM ('sent', 'contacted', 'converted', 'cancelled');

CREATE TABLE catalog_orders (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_whatsapp VARCHAR(20) NOT NULL REFERENCES catalog_users(whatsapp) ON DELETE CASCADE,
  items JSONB NOT NULL, -- Array of {product_id, name, price, quantity}
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status catalog_order_status DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_catalog_orders_user ON catalog_orders(user_whatsapp);
CREATE INDEX idx_catalog_orders_status ON catalog_orders(status);
CREATE INDEX idx_catalog_orders_created ON catalog_orders(created_at DESC);
CREATE INDEX idx_catalog_orders_items_gin ON catalog_orders USING GIN(items); -- For JSONB queries
```

**RLS Policies:**
```sql
ALTER TABLE catalog_orders ENABLE ROW LEVEL SECURITY;

-- Only admins can read orders
CREATE POLICY "Admins can read all orders"
  ON catalog_orders FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Users can create orders (insert only)
CREATE POLICY "Users can create orders"
  ON catalog_orders FOR INSERT
  WITH CHECK (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');
```

### 7. catalog_product_views

**Purpose:** Analytics - track product views

```sql
CREATE TABLE catalog_product_views (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_whatsapp VARCHAR(20), -- Nullable for anonymous views
  session_id UUID NOT NULL, -- Client-generated session ID
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_catalog_views_product ON catalog_product_views(product_id, viewed_at DESC);
CREATE INDEX idx_catalog_views_session ON catalog_product_views(session_id, product_id);
```

**RLS Policies:**
```sql
ALTER TABLE catalog_product_views ENABLE ROW LEVEL SECURITY;

-- Only admins can read views
CREATE POLICY "Admins can read product views"
  ON catalog_product_views FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Public can insert views
CREATE POLICY "Public can insert product views"
  ON catalog_product_views FOR INSERT
  WITH CHECK (true);
```

## Migration Strategy

**Migration File:** `supabase/migrations/YYYYMMDDHHMMSS_create_catalog_schema.sql`

```sql
-- ============================================================================
-- Migration: Create Catalog Public Schema
-- Description: Add tables for public catalog functionality
-- Date: 2025-11-09
-- ============================================================================

BEGIN;

-- Create ENUMs first
CREATE TYPE catalog_request_status AS ENUM ('pending', 'analyzing', 'fulfilled', 'unavailable');
CREATE TYPE catalog_order_status AS ENUM ('sent', 'contacted', 'converted', 'cancelled');

-- Create tables (in dependency order)
-- 1. catalog_users (no dependencies)
-- 2. catalog_items (depends on products)
-- 3. catalog_favorites (depends on catalog_users, products)
-- 4. catalog_cart (depends on catalog_users, products)
-- 5. catalog_requests (depends on catalog_users)
-- 6. catalog_orders (depends on catalog_users)
-- 7. catalog_product_views (depends on products)

-- [Insert full CREATE TABLE statements from above]

-- Create RLS policies
-- [Insert all RLS policies from above]

-- Create utility function for updated_at if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMIT;
```

---
