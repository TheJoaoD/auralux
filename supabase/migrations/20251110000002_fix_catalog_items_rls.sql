-- Fix catalog_items RLS policy to include WITH CHECK
-- This allows authenticated users to INSERT/UPDATE

-- Drop existing policy
DROP POLICY IF EXISTS "Admins can manage all catalog items" ON catalog_items;

-- Recreate with WITH CHECK clause
CREATE POLICY "Admins can manage all catalog items"
  ON catalog_items FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
