import { createClient } from '@/lib/supabase/client'
import type { Product, ProductInput } from '@/types'

/**
 * Product Service
 * Handles all product-related database operations and image uploads
 */

/**
 * Pagination result interface
 */
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
}

/**
 * Uploads a product image to Supabase Storage
 * @param file - Image file to upload
 * @param productId - Product UUID for filename
 * @returns Public URL of uploaded image
 */
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Imagem deve ter no máximo 5MB')
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      throw new Error('Formato inválido. Use JPG, PNG ou WEBP')
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `${user.id}/${productId}_${Date.now()}.${ext}`

    // Upload to 'products' bucket
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('products').getPublicUrl(filename)

    return publicUrl
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao fazer upload da imagem')
  }
}

/**
 * Deletes a product image from Supabase Storage
 * @param imageUrl - Public URL of the image to delete
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  const supabase = createClient()

  try {
    // Extract filename from URL
    const urlParts = imageUrl.split('/')
    const filename = urlParts.slice(-2).join('/') // user_id/filename

    const { error } = await supabase.storage.from('products').remove([filename])

    if (error) throw error
  } catch (error) {
    console.error('Error deleting image:', error)
    // Don't throw - image deletion is not critical
  }
}

/**
 * Calculates profit margin percentage
 * @param salePrice - Sale price
 * @param costPrice - Cost price
 * @returns Profit margin as percentage
 */
export function calculateProfitMargin(
  salePrice: number,
  costPrice: number
): number {
  if (salePrice === 0) return 0
  return ((salePrice - costPrice) / salePrice) * 100
}

/**
 * Creates a new product
 * @param input - Product input data
 * @returns Created product object with computed fields
 */
export async function createProduct(input: ProductInput): Promise<Product> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Generate product ID for image upload
    const tempId = crypto.randomUUID()

    // Upload image if provided
    let imageUrl: string | undefined
    if (input.image) {
      imageUrl = await uploadProductImage(input.image, tempId)
    }

    // Insert product
    const { data, error } = await supabase
      .from('products')
      .insert({
        user_id: user.id,
        name: input.name,
        category_id: input.category_id || null,
        sku: input.sku || null,
        image_url: imageUrl || null,
        sale_price: input.sale_price,
        cost_price: input.cost_price,
        quantity: input.quantity,
        low_stock_threshold: input.low_stock_threshold || 5,
        supplier: input.supplier || null,
      })
      .select(
        `
        *,
        category:categories(id, name, description, color)
      `
      )
      .single()

    if (error) throw error

    // Add computed fields
    const product: Product = {
      ...data,
      profit_margin: calculateProfitMargin(data.sale_price, data.cost_price),
      profit_amount: data.sale_price - data.cost_price,
      is_low_stock: data.quantity <= data.low_stock_threshold,
    }

    return product
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao criar produto. Tente novamente')
  }
}

/**
 * Gets all products for the current user (no pagination)
 * Use this for dropdowns/selectors where you need the full list
 * @returns Array of all products with computed fields
 */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(id, name, description, color)
      `
      )
      .order('name', { ascending: true })

    if (error) throw error

    // Add computed fields to each product
    const products: Product[] = (data || []).map((product) => ({
      ...product,
      profit_margin: calculateProfitMargin(
        product.sale_price,
        product.cost_price
      ),
      profit_amount: product.sale_price - product.cost_price,
      is_low_stock: product.quantity <= product.low_stock_threshold,
    }))

    return products
  } catch (error) {
    console.error('Error fetching all products:', error)
    throw new Error('Erro ao carregar produtos. Tente novamente')
  }
}

/**
 * Gets paginated products for the current user
 * @param params - Pagination parameters (page, pageSize)
 * @returns Paginated products with computed fields
 */
export async function getProducts(
  params: PaginationParams = {}
): Promise<PaginatedResult<Product>> {
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
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError

    const total = count || 0
    const totalPages = Math.ceil(total / pageSize)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Get paginated data
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(id, name, description, color)
      `
      )
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    // Add computed fields to each product
    const products: Product[] = (data || []).map((product) => ({
      ...product,
      profit_margin: calculateProfitMargin(
        product.sale_price,
        product.cost_price
      ),
      profit_amount: product.sale_price - product.cost_price,
      is_low_stock: product.quantity <= product.low_stock_threshold,
    }))

    return {
      data: products,
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Erro ao carregar produtos. Tente novamente')
  }
}

/**
 * Gets a single product by ID
 * @param id - Product UUID
 * @returns Product object with computed fields
 */
export async function getProductById(id: string): Promise<Product> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        category:categories(id, name, description, color)
      `
      )
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Produto não encontrado')
      }
      throw error
    }

    const product: Product = {
      ...data,
      profit_margin: calculateProfitMargin(data.sale_price, data.cost_price),
      profit_amount: data.sale_price - data.cost_price,
      is_low_stock: data.quantity <= data.low_stock_threshold,
    }

    return product
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao carregar produto. Tente novamente')
  }
}

/**
 * Updates a product
 * @param id - Product UUID
 * @param input - Product update data
 * @returns Updated product object with computed fields
 */
export async function updateProduct(
  id: string,
  input: Partial<ProductInput> & { currentImageUrl?: string }
): Promise<Product> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Upload new image if provided
    let imageUrl: string | undefined | null = input.currentImageUrl
    if (input.image) {
      // Delete old image if exists
      if (input.currentImageUrl) {
        await deleteProductImage(input.currentImageUrl)
      }
      imageUrl = await uploadProductImage(input.image, id)
    }

    const updateData: Record<string, unknown> = {}

    if (input.name !== undefined) updateData.name = input.name
    if (input.category_id !== undefined)
      updateData.category_id = input.category_id || null
    if (input.sku !== undefined) updateData.sku = input.sku || null
    if (imageUrl !== undefined) updateData.image_url = imageUrl
    if (input.sale_price !== undefined) updateData.sale_price = input.sale_price
    if (input.cost_price !== undefined) updateData.cost_price = input.cost_price
    if (input.quantity !== undefined) updateData.quantity = input.quantity
    if (input.low_stock_threshold !== undefined)
      updateData.low_stock_threshold = input.low_stock_threshold
    if (input.supplier !== undefined)
      updateData.supplier = input.supplier || null

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        category:categories(id, name, description, color)
      `
      )
      .single()

    if (error) throw error

    const product: Product = {
      ...data,
      profit_margin: calculateProfitMargin(data.sale_price, data.cost_price),
      profit_amount: data.sale_price - data.cost_price,
      is_low_stock: data.quantity <= data.low_stock_threshold,
    }

    return product
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao atualizar produto. Tente novamente')
  }
}

/**
 * Deletes a product
 * @param id - Product UUID
 */
export async function deleteProduct(id: string): Promise<void> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Get product to delete image
    const product = await getProductById(id)
    if (product.image_url) {
      await deleteProductImage(product.image_url)
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting product:', error)
    throw new Error('Erro ao deletar produto. Tente novamente')
  }
}
