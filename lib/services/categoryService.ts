import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/types'
import type { PaginatedResult, PaginationParams } from './productService'

/**
 * Category Service
 * Handles all category-related database operations
 */

export interface CategoryWithCount extends Category {
  product_count: number
}

/**
 * Gets all categories for the current user
 * @returns Array of categories ordered by name
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Erro ao carregar categorias. Tente novamente')
  }
}

/**
 * Gets a single category by ID
 * @param id - Category UUID
 * @returns Category object
 */
export async function getCategoryById(id: string): Promise<Category> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Categoria não encontrada')
      }
      throw error
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao carregar categoria. Tente novamente')
  }
}

/**
 * Creates a new category
 * @param name - Category name
 * @param color - Category color (hex)
 * @param description - Category description
 * @returns Created category object
 */
export async function createCategory(
  name: string,
  color?: string,
  description?: string
): Promise<Category> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name,
        color: color || null,
        description: description || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating category:', error)

      // Handle specific error codes
      if (error.code === '23505') {
        throw new Error('Já existe uma categoria com este nome')
      }

      throw error
    }

    return data
  } catch (error) {
    console.error('Error in createCategory:', error)

    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao criar categoria. Tente novamente')
  }
}

/**
 * Updates a category
 * @param id - Category UUID
 * @param name - Category name
 * @param color - Category color (hex)
 * @param description - Category description
 * @returns Updated category object
 */
export async function updateCategory(
  id: string,
  name: string,
  color?: string,
  description?: string
): Promise<Category> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('categories')
      .update({
        name,
        color: color || null,
        description: description || null,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao atualizar categoria. Tente novamente')
  }
}

/**
 * Gets product count for a specific category
 * @param categoryId - Category UUID
 * @returns Number of products in the category
 */
export async function getCategoryProductCount(categoryId: string): Promise<number> {
  const supabase = createClient()

  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId)

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error('Error getting category product count:', error)
    return 0
  }
}

/**
 * Gets all categories with product counts and pagination
 * @param params - Pagination parameters
 * @returns Paginated categories with product counts ordered by name
 */
export async function getCategoriesWithCount(
  params: PaginationParams = {}
): Promise<PaginatedResult<CategoryWithCount>> {
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
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) throw countError

    const total = count || 0
    const totalPages = Math.ceil(total / pageSize)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Get paginated categories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true })
      .range(from, to)

    if (error) throw error

    if (!categories) {
      return {
        data: [],
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: false,
        hasPreviousPage: false,
      }
    }

    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const product_count = await getCategoryProductCount(category.id)
        return {
          ...category,
          product_count,
        }
      })
    )

    return {
      data: categoriesWithCount,
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    }
  } catch (error) {
    console.error('Error fetching categories with count:', error)
    throw new Error('Erro ao carregar categorias. Tente novamente')
  }
}

/**
 * Deletes a category
 * @param id - Category UUID
 * @returns Number of products affected (that had their category_id set to null)
 */
export async function deleteCategory(id: string): Promise<{ affectedProducts: number }> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Get count of products that will be affected
    const affectedProducts = await getCategoryProductCount(id)

    // Delete the category (ON DELETE SET NULL will handle products)
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return { affectedProducts }
  } catch (error) {
    console.error('Error deleting category:', error)
    throw new Error('Erro ao deletar categoria. Tente novamente')
  }
}
