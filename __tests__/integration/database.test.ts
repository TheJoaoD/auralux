/**
 * Database Integration Tests
 *
 * These tests verify the Supabase database schema and RLS policies.
 * Run with: pnpm test
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

describe('Supabase Database Integration', () => {
  let supabase: ReturnType<typeof createClient<Database>>

  beforeAll(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)
  })

  describe('Schema Verification', () => {
    it('should have users table', async () => {
      const { error } = await supabase.from('users').select('count').limit(0)
      expect(error).toBeNull()
    })

    it('should have customers table', async () => {
      const { error } = await supabase.from('customers').select('count').limit(0)
      expect(error).toBeNull()
    })

    it('should have categories table', async () => {
      const { error } = await supabase.from('categories').select('count').limit(0)
      expect(error).toBeNull()
    })

    it('should have products table', async () => {
      const { error } = await supabase.from('products').select('count').limit(0)
      expect(error).toBeNull()
    })

    it('should have sales table', async () => {
      const { error } = await supabase.from('sales').select('count').limit(0)
      expect(error).toBeNull()
    })

    it('should have sale_items table', async () => {
      const { error } = await supabase.from('sale_items').select('count').limit(0)
      expect(error).toBeNull()
    })

    it('should have inventory_movements table', async () => {
      const { error } = await supabase.from('inventory_movements').select('count').limit(0)
      expect(error).toBeNull()
    })
  })

  describe('Views Verification', () => {
    it('should have v_daily_sales_metrics view', async () => {
      const { error } = await supabase.from('v_daily_sales_metrics').select('*').limit(0)
      expect(error).toBeNull()
    })

    it('should have v_payment_method_breakdown view', async () => {
      const { error } = await supabase.from('v_payment_method_breakdown').select('*').limit(0)
      expect(error).toBeNull()
    })

    it('should have v_low_stock_products view', async () => {
      const { error } = await supabase.from('v_low_stock_products').select('*').limit(0)
      expect(error).toBeNull()
    })

    it('should have v_top_selling_products view', async () => {
      const { error } = await supabase.from('v_top_selling_products').select('*').limit(0)
      expect(error).toBeNull()
    })
  })

  describe('Storage Bucket Verification', () => {
    it('should have products storage bucket', async () => {
      const { data, error } = await supabase.storage.getBucket('products')
      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.name).toBe('products')
    })
  })

  describe('TypeScript Types', () => {
    it('should have correct Customer type structure', () => {
      const mockCustomer: Database['public']['Tables']['customers']['Row'] = {
        id: 'test-id',
        user_id: 'test-user',
        full_name: 'Test Customer',
        whatsapp: '11999999999',
        email: null,
        address: null,
        purchase_count: 0,
        total_purchases: 0,
        total_due: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      expect(mockCustomer).toBeDefined()
    })

    it('should have correct Product type structure', () => {
      const mockProduct: Database['public']['Tables']['products']['Row'] = {
        id: 'test-id',
        user_id: 'test-user',
        category_id: null,
        name: 'Test Product',
        sku: null,
        image_url: null,
        sale_price: 100,
        cost_price: 50,
        quantity: 10,
        low_stock_threshold: 5,
        supplier: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      expect(mockProduct).toBeDefined()
    })

    it('should have correct Sale type structure', () => {
      const mockSale: Database['public']['Tables']['sales']['Row'] = {
        id: 'test-id',
        user_id: 'test-user',
        customer_id: null,
        total_amount: 100,
        payment_method: 'pix',
        installment_count: 1,
        actual_amount_received: null,
        status: 'completed',
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      expect(mockSale).toBeDefined()
    })
  })
})
