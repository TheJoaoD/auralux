-- Migration: Add public read policies for catalog functionality
-- The catalog uses JOINs to products and categories tables
-- These need to be publicly readable for the public catalog to work

-- Add public SELECT policy for products (for catalog display)
CREATE POLICY "Public can read products for catalog"
  ON products FOR SELECT
  USING (true);

-- Add public SELECT policy for categories (for catalog display)
CREATE POLICY "Public can read categories for catalog"
  ON categories FOR SELECT
  USING (true);
