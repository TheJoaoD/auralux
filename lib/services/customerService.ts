import { createClient } from '@/lib/supabase/client'
import type { Customer, CustomerInput } from '@/types'
import { formatWhatsApp } from '@/lib/utils/formatters'
import type { PaginatedResult, PaginationParams } from './productService'

/**
 * Customer Service
 * Handles all customer-related database operations
 */

/**
 * Creates a new customer
 * @param input - Customer input data
 * @returns Created customer object
 * @throws Error if WhatsApp already exists or other database error
 */
export async function createCustomer(input: CustomerInput): Promise<Customer> {
  const supabase = createClient()

  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Format WhatsApp before saving
    const formattedWhatsApp = formatWhatsApp(input.whatsapp)

    // Insert customer
    const { data, error } = await supabase
      .from('customers')
      .insert({
        user_id: user.id,
        full_name: input.full_name,
        whatsapp: formattedWhatsApp,
        email: input.email || null,
        address: input.address || null,
      })
      .select()
      .single()

    if (error) {
      // Handle unique constraint violation (duplicate WhatsApp)
      if (error.code === '23505') {
        throw new Error('Cliente com este WhatsApp já existe')
      }
      throw error
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao criar cliente. Tente novamente')
  }
}

/**
 * Gets all customers for the current user (no pagination)
 * Use this for dropdowns/selectors where you need the full list
 * @returns Array of all customers
 */
export async function getAllCustomers(): Promise<Customer[]> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('full_name', { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching all customers:', error)
    throw new Error('Erro ao carregar clientes. Tente novamente')
  }
}

/**
 * Gets paginated customers for the current user
 * @param params - Pagination parameters (page, pageSize)
 * @returns Paginated customers ordered by creation date (newest first)
 */
export async function getCustomers(
  params: PaginationParams = {}
): Promise<PaginatedResult<Customer>> {
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
      .from('customers')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError

    const total = count || 0
    const totalPages = Math.ceil(total / pageSize)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Get paginated data
    const { data, error } = await supabase
      .from('customers')
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
    console.error('Error fetching customers:', error)
    throw new Error('Erro ao carregar clientes. Tente novamente')
  }
}

/**
 * Searches customers by name or WhatsApp with pagination
 * @param query - Search query string
 * @param params - Pagination parameters
 * @returns Paginated search results
 */
export async function searchCustomers(
  query: string,
  params: PaginationParams = {}
): Promise<PaginatedResult<Customer>> {
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

    const searchQuery = `%${query}%`

    // Get total count
    const { count, error: countError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .or(`full_name.ilike.${searchQuery},whatsapp.ilike.${searchQuery}`)

    if (countError) throw countError

    const total = count || 0
    const totalPages = Math.ceil(total / pageSize)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Get paginated data
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`full_name.ilike.${searchQuery},whatsapp.ilike.${searchQuery}`)
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
    console.error('Error searching customers:', error)
    throw new Error('Erro ao buscar clientes. Tente novamente')
  }
}

/**
 * Gets a single customer by ID
 * @param id - Customer UUID
 * @returns Customer object
 */
export async function getCustomerById(id: string): Promise<Customer> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Cliente não encontrado')
      }
      throw error
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao carregar cliente. Tente novamente')
  }
}

/**
 * Updates a customer
 * @param id - Customer UUID
 * @param input - Customer update data
 * @returns Updated customer object
 */
export async function updateCustomer(
  id: string,
  input: Partial<CustomerInput>
): Promise<Customer> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const updateData: Record<string, unknown> = {}

    if (input.full_name) updateData.full_name = input.full_name
    if (input.whatsapp) updateData.whatsapp = formatWhatsApp(input.whatsapp)
    if (input.email !== undefined) updateData.email = input.email || null
    if (input.address !== undefined) updateData.address = input.address || null

    const { data, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        throw new Error('Cliente com este WhatsApp já existe')
      }
      throw error
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao atualizar cliente. Tente novamente')
  }
}

/**
 * Deletes a customer
 * @param id - Customer UUID
 */
export async function deleteCustomer(id: string): Promise<void> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting customer:', error)
    throw new Error('Erro ao deletar cliente. Tente novamente')
  }
}
