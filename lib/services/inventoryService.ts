import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'
import type { CartItem } from '@/lib/stores/saleWizardStore'
import type { DateRange } from './salesService'

/**
 * Inventory Service
 * Handles stock validation, movement tracking, and inventory queries
 */

export type InventoryMovement = Database['public']['Tables']['inventory_movements']['Row'] & {
  product?: {
    id: string
    name: string
  } | null
}

export interface StockValidationResult {
  isValid: boolean
  errors: string[]
  insufficientProducts: Array<{
    productId: string
    productName: string
    requested: number
    available: number
  }>
}

/**
 * Validates stock availability for cart items
 */
export async function validateStock(
  cartItems: CartItem[]
): Promise<StockValidationResult> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const insufficientProducts: StockValidationResult['insufficientProducts'] = []
    const errors: string[] = []

    // Check each product's availability
    for (const item of cartItems) {
      const { data: product, error } = await supabase
        .from('products')
        .select('id, name, quantity')
        .eq('id', item.product.id)
        .eq('user_id', user.id)
        .single()

      if (error || !product) {
        errors.push(`Produto ${item.product.name} não encontrado`)
        continue
      }

      // Check if requested quantity exceeds available
      if (item.quantity > product.quantity) {
        insufficientProducts.push({
          productId: product.id,
          productName: product.name,
          requested: item.quantity,
          available: product.quantity,
        })
        errors.push(
          `${product.name}: solicitado ${item.quantity}, disponível ${product.quantity}`
        )
      }
    }

    return {
      isValid: insufficientProducts.length === 0 && errors.length === 0,
      errors,
      insufficientProducts,
    }
  } catch (error) {
    console.error('Error validating stock:', error)
    throw new Error('Erro ao validar estoque')
  }
}

/**
 * Checks if a product has low stock
 */
export async function checkLowStock(productId: string): Promise<boolean> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('quantity, low_stock_threshold')
      .eq('id', productId)
      .eq('user_id', user.id)
      .single()

    if (error || !product) {
      return false
    }

    const threshold = product.low_stock_threshold || 5
    return product.quantity <= threshold
  } catch (error) {
    console.error('Error checking low stock:', error)
    return false
  }
}

/**
 * Gets inventory movements with optional filters
 */
export async function getMovements(
  productId?: string,
  dateRange?: DateRange
): Promise<InventoryMovement[]> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    let query = supabase
      .from('inventory_movements')
      .select(
        `
        *,
        product:products!inventory_movements_product_id_fkey (
          id,
          name
        )
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Filter by product
    if (productId) {
      query = query.eq('product_id', productId)
    }

    // Filter by date range
    if (dateRange) {
      query = query
        .gte('created_at', dateRange.startDate.toISOString())
        .lte('created_at', dateRange.endDate.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching movements:', error)
      throw new Error('Erro ao carregar movimentações')
    }

    return data || []
  } catch (error) {
    console.error('Error in getMovements:', error)
    throw new Error('Erro ao carregar movimentações de estoque')
  }
}

/**
 * Gets inventory movements by reference (e.g., sale_id)
 */
export async function getMovementsByReference(
  referenceId: string
): Promise<InventoryMovement[]> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('inventory_movements')
      .select(
        `
        *,
        product:products!inventory_movements_product_id_fkey (
          id,
          name
        )
      `
      )
      .eq('user_id', user.id)
      .eq('reference_id', referenceId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching movements by reference:', error)
      throw new Error('Erro ao carregar movimentações')
    }

    return data || []
  } catch (error) {
    console.error('Error in getMovementsByReference:', error)
    throw new Error('Erro ao carregar movimentações de estoque')
  }
}

/**
 * Gets products with low stock
 */
export async function getLowStockProducts() {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .or('quantity.lte.low_stock_threshold,low_stock_threshold.is.null')
      .order('quantity', { ascending: true })

    if (error) {
      console.error('Error fetching low stock products:', error)
      throw new Error('Erro ao carregar produtos com estoque baixo')
    }

    // Filter manually for products where quantity <= threshold (default 5)
    return (
      products?.filter((p) => p.quantity <= (p.low_stock_threshold || 5)) || []
    )
  } catch (error) {
    console.error('Error in getLowStockProducts:', error)
    throw new Error('Erro ao carregar produtos com estoque baixo')
  }
}
