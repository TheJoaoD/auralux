import { Database } from './supabase'

// Customer types from database
export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export interface CustomerInput {
  full_name: string
  whatsapp: string
  email?: string
  address?: string
}

// Product types from database
export type Product = Database['public']['Tables']['products']['Row'] & {
  category?: Category | null
  profit_margin?: number
  profit_amount?: number
  is_low_stock?: boolean
}
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export interface ProductInput {
  name: string
  category_id?: string
  sku?: string
  image?: File
  sale_price: number
  cost_price: number
  quantity: number
  low_stock_threshold?: number
  supplier?: string
}

// Sale types from database
export type Sale = Database['public']['Tables']['sales']['Row']
export type SaleInsert = Database['public']['Tables']['sales']['Insert']
export type SaleUpdate = Database['public']['Tables']['sales']['Update']

// Sale Items types from database
export type SaleItem = Database['public']['Tables']['sale_items']['Row']
export type SaleItemInsert = Database['public']['Tables']['sale_items']['Insert']
export type SaleItemUpdate = Database['public']['Tables']['sale_items']['Update']

// Category types from database
export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

// User types from database
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

// Discount types from database
export type Discount = Database['public']['Tables']['discounts']['Row']
export type DiscountInsert = Database['public']['Tables']['discounts']['Insert']
export type DiscountUpdate = Database['public']['Tables']['discounts']['Update']

export interface DiscountInput {
  name: string
  description?: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  minimum_purchase?: number
  is_active?: boolean
}
