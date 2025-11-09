import { createClient } from '@/lib/supabase/client'
import type { Discount, DiscountInput } from '@/types'
import type { PaginatedResult, PaginationParams } from './productService'

/**
 * Discount Service
 * Handles all discount-related database operations
 */

/**
 * Gets all discounts for the current user
 * @returns Array of discounts ordered by name
 */
export async function getDiscounts(): Promise<Discount[]> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching discounts:', error)
    throw new Error('Erro ao carregar descontos. Tente novamente')
  }
}

/**
 * Gets all active discounts
 * @returns Array of active discounts ordered by name
 */
export async function getActiveDiscounts(): Promise<Discount[]> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching active discounts:', error)
    throw new Error('Erro ao carregar descontos ativos. Tente novamente')
  }
}

/**
 * Gets paginated discounts
 * @param params - Pagination parameters
 * @returns Paginated discounts
 */
export async function getDiscountsWithPagination(
  params: PaginationParams = {}
): Promise<PaginatedResult<Discount>> {
  const supabase = createClient()
  const page = params.page || 1
  const pageSize = params.pageSize || 5

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from('discounts')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError

    const total = count || 0
    const totalPages = Math.ceil(total / pageSize)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Get paginated data
    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return {
      data: data || [],
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    }
  } catch (error) {
    console.error('Error fetching discounts with pagination:', error)
    throw new Error('Erro ao carregar descontos. Tente novamente')
  }
}

/**
 * Gets a single discount by ID
 * @param id - Discount UUID
 * @returns Discount object
 */
export async function getDiscountById(id: string): Promise<Discount> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Desconto não encontrado')
      }
      throw error
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao carregar desconto. Tente novamente')
  }
}

/**
 * Creates a new discount
 * @param input - Discount input data
 * @returns Created discount object
 */
export async function createDiscount(input: DiscountInput): Promise<Discount> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Validate discount value based on type
    if (input.discount_type === 'percentage' && input.discount_value > 100) {
      throw new Error('Desconto percentual não pode ser maior que 100%')
    }

    if (input.discount_value < 0) {
      throw new Error('Valor do desconto não pode ser negativo')
    }

    const { data, error } = await supabase
      .from('discounts')
      .insert({
        user_id: user.id,
        name: input.name,
        description: input.description || null,
        discount_type: input.discount_type,
        discount_value: input.discount_value,
        minimum_purchase: input.minimum_purchase || 0,
        is_active: input.is_active !== undefined ? input.is_active : true,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating discount:', error)

      // Handle specific error codes
      if (error.code === '23505') {
        throw new Error('Já existe um desconto com este nome')
      }

      throw error
    }

    return data
  } catch (error) {
    console.error('Error in createDiscount:', error)

    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao criar desconto. Tente novamente')
  }
}

/**
 * Updates a discount
 * @param id - Discount UUID
 * @param input - Discount update data
 * @returns Updated discount object
 */
export async function updateDiscount(
  id: string,
  input: Partial<DiscountInput>
): Promise<Discount> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Validate discount value if provided
    if (input.discount_value !== undefined) {
      if (input.discount_type === 'percentage' && input.discount_value > 100) {
        throw new Error('Desconto percentual não pode ser maior que 100%')
      }

      if (input.discount_value < 0) {
        throw new Error('Valor do desconto não pode ser negativo')
      }
    }

    const updateData: Record<string, unknown> = {}

    if (input.name !== undefined) updateData.name = input.name
    if (input.description !== undefined)
      updateData.description = input.description || null
    if (input.discount_type !== undefined)
      updateData.discount_type = input.discount_type
    if (input.discount_value !== undefined)
      updateData.discount_value = input.discount_value
    if (input.minimum_purchase !== undefined)
      updateData.minimum_purchase = input.minimum_purchase
    if (input.is_active !== undefined) updateData.is_active = input.is_active

    const { data, error } = await supabase
      .from('discounts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao atualizar desconto. Tente novamente')
  }
}

/**
 * Toggles discount active status
 * @param id - Discount UUID
 * @returns Updated discount object
 */
export async function toggleDiscountStatus(id: string): Promise<Discount> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Get current status
    const discount = await getDiscountById(id)

    // Toggle status
    const { data, error } = await supabase
      .from('discounts')
      .update({ is_active: !discount.is_active })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error toggling discount status:', error)
    throw new Error('Erro ao alterar status do desconto. Tente novamente')
  }
}

/**
 * Deletes a discount
 * @param id - Discount UUID
 */
export async function deleteDiscount(id: string): Promise<void> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { error } = await supabase.from('discounts').delete().eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting discount:', error)
    throw new Error('Erro ao deletar desconto. Tente novamente')
  }
}

/**
 * Calculates the discount amount for a given total
 * @param discount - Discount object
 * @param totalAmount - Total purchase amount
 * @returns Discount amount
 */
export function calculateDiscountAmount(
  discount: Discount,
  totalAmount: number
): number {
  // Check minimum purchase requirement
  if (
    discount.minimum_purchase &&
    totalAmount < discount.minimum_purchase
  ) {
    return 0
  }

  if (discount.discount_type === 'percentage') {
    return (totalAmount * discount.discount_value) / 100
  } else {
    // Fixed discount
    return Math.min(discount.discount_value, totalAmount)
  }
}

/**
 * Gets applicable discounts for a given total amount
 * @param totalAmount - Total purchase amount
 * @returns Array of applicable discounts
 */
export async function getApplicableDiscounts(
  totalAmount: number
): Promise<Discount[]> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('discounts')
      .select('*')
      .eq('is_active', true)
      .lte('minimum_purchase', totalAmount)
      .order('discount_value', { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching applicable discounts:', error)
    throw new Error('Erro ao carregar descontos aplicáveis. Tente novamente')
  }
}
