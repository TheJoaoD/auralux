-- Migration: Add discounts table for managing discount rules
-- Supports both percentage and fixed value discounts

CREATE TABLE IF NOT EXISTS public.discounts (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Discount details
  name TEXT NOT NULL,
  description TEXT,

  -- Discount type and value
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value >= 0),

  -- Optional: minimum purchase requirement
  minimum_purchase NUMERIC DEFAULT 0 CHECK (minimum_purchase >= 0),

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies for discounts
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all discounts" ON public.discounts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert discounts" ON public.discounts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update discounts" ON public.discounts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete discounts" ON public.discounts
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX idx_discounts_user_id ON public.discounts(user_id);
CREATE INDEX idx_discounts_is_active ON public.discounts(is_active);
CREATE INDEX idx_discounts_discount_type ON public.discounts(discount_type);

-- Add comments
COMMENT ON TABLE public.discounts IS 'Discount rules that can be applied to sales';
COMMENT ON COLUMN public.discounts.discount_type IS 'Type of discount: percentage (%) or fixed (value)';
COMMENT ON COLUMN public.discounts.discount_value IS 'Discount amount: percentage (0-100) or fixed value';
COMMENT ON COLUMN public.discounts.minimum_purchase IS 'Minimum purchase value required to apply discount';
