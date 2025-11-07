-- ============================================================================
-- Migration: 002_add_category_color
-- Description: Adds optional hex color metadata to product categories
-- ============================================================================

-- Add color column to categories (nullable, validated when present)
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS color TEXT
CHECK (color IS NULL OR color ~ '^#[0-9A-Fa-f]{6}$');

COMMENT ON COLUMN public.categories.color IS 'Optional hex color used for UI labeling';
