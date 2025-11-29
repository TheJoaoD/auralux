import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'

/**
 * Sales Service
 * Handles all sales-related database operations and analytics
 */

export type Sale = Database['public']['Tables']['sales']['Row'] & {
  customer?: {
    id: string
    full_name: string
    email?: string | null
  } | null
  sale_items?: {
    id: string
    product_name: string
    quantity: number
    unit_price: number
  }[]
  discount_amount?: number
}

export interface SalesMetrics {
  totalSales: number
  totalRevenue: number
  actualRevenue: number
  totalDiscount: number
  avgSaleValue: number
  dailySales: number
  weeklySales: number
  monthlySales: number
}

export interface PaymentBreakdown {
  pix: { count: number; percentage: number; total: number }
  cash: { count: number; percentage: number; total: number }
  card: { count: number; percentage: number; total: number }
  installment: { count: number; percentage: number; total: number }
}

export interface DateRange {
  startDate: Date
  endDate: Date
}

export interface SalesFilters {
  dateRange?: DateRange
  paymentMethod?: 'pix' | 'cash' | 'card' | 'installment'
  customerId?: string
  status?: 'completed' | 'pending' | 'cancelled'
}

export interface ChartDataPoint {
  date: string
  sales: number
  revenue: number
}

/**
 * Gets all sales with optional filters
 */
export async function getSales(filters?: SalesFilters): Promise<Sale[]> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    let query = supabase
      .from('sales')
      .select(`
        *,
        customer:customers!sales_customer_id_fkey (
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters?.dateRange) {
      query = query
        .gte('created_at', filters.dateRange.startDate.toISOString())
        .lte('created_at', filters.dateRange.endDate.toISOString())
    }

    if (filters?.paymentMethod) {
      query = query.eq('payment_method', filters.paymentMethod)
    }

    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) throw error

    // Add computed discount_amount field
    const salesWithDiscount = (data || []).map((sale) => ({
      ...sale,
      discount_amount:
        sale.payment_method === 'installment'
          ? sale.total_amount - (sale.actual_amount_received || 0)
          : 0,
    }))

    return salesWithDiscount
  } catch (error) {
    console.error('Error fetching sales:', error)
    throw new Error('Erro ao carregar vendas. Tente novamente')
  }
}

/**
 * Gets sales metrics for a date range
 */
export async function getSalesMetrics(dateRange: DateRange): Promise<SalesMetrics> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Get all completed sales in date range
    const { data: sales, error } = await supabase
      .from('sales')
      .select('*')
      .eq('status', 'completed')
      .gte('created_at', dateRange.startDate.toISOString())
      .lte('created_at', dateRange.endDate.toISOString())

    if (error) throw error

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Calculate metrics
    const totalSales = sales?.length || 0
    const totalRevenue = sales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0
    const actualRevenue =
      sales?.reduce((sum, sale) => sum + (sale.actual_amount_received || sale.total_amount), 0) || 0
    const totalDiscount = totalRevenue - actualRevenue
    const avgSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0

    // Period-specific counts
    const dailySales =
      sales?.filter((sale) => new Date(sale.created_at) >= today).length || 0
    const weeklySales =
      sales?.filter((sale) => new Date(sale.created_at) >= weekAgo).length || 0
    const monthlySales =
      sales?.filter((sale) => new Date(sale.created_at) >= monthStart).length || 0

    return {
      totalSales,
      totalRevenue,
      actualRevenue,
      totalDiscount,
      avgSaleValue,
      dailySales,
      weeklySales,
      monthlySales,
    }
  } catch (error) {
    console.error('Error fetching sales metrics:', error)
    throw new Error('Erro ao carregar métricas. Tente novamente')
  }
}

/**
 * Gets payment method breakdown
 */
export async function getPaymentMethodBreakdown(
  dateRange: DateRange
): Promise<PaymentBreakdown> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data: sales, error } = await supabase
      .from('sales')
      .select('payment_method, total_amount')
      .eq('status', 'completed')
      .gte('created_at', dateRange.startDate.toISOString())
      .lte('created_at', dateRange.endDate.toISOString())

    if (error) throw error

    const totalCount = sales?.length || 0

    // Group by payment method
    const pixSales = sales?.filter((s) => s.payment_method === 'pix') || []
    const cashSales = sales?.filter((s) => s.payment_method === 'cash') || []
    const cardSales = sales?.filter((s) => s.payment_method === 'card') || []
    const installmentSales = sales?.filter((s) => s.payment_method === 'installment') || []

    const pixTotal = pixSales.reduce((sum, s) => sum + s.total_amount, 0)
    const cashTotal = cashSales.reduce((sum, s) => sum + s.total_amount, 0)
    const cardTotal = cardSales.reduce((sum, s) => sum + s.total_amount, 0)
    const installmentTotal = installmentSales.reduce((sum, s) => sum + s.total_amount, 0)

    return {
      pix: {
        count: pixSales.length,
        percentage: totalCount > 0 ? (pixSales.length / totalCount) * 100 : 0,
        total: pixTotal,
      },
      cash: {
        count: cashSales.length,
        percentage: totalCount > 0 ? (cashSales.length / totalCount) * 100 : 0,
        total: cashTotal,
      },
      card: {
        count: cardSales.length,
        percentage: totalCount > 0 ? (cardSales.length / totalCount) * 100 : 0,
        total: cardTotal,
      },
      installment: {
        count: installmentSales.length,
        percentage: totalCount > 0 ? (installmentSales.length / totalCount) * 100 : 0,
        total: installmentTotal,
      },
    }
  } catch (error) {
    console.error('Error fetching payment breakdown:', error)
    throw new Error('Erro ao carregar breakdown de pagamentos. Tente novamente')
  }
}

/**
 * Gets recent sales (last N sales)
 */
export async function getRecentSales(limit: number = 10): Promise<Sale[]> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        customer:customers!sales_customer_id_fkey (
          id,
          full_name,
          email
        ),
        sale_items (
          id,
          product_name,
          quantity,
          unit_price
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Add computed discount_amount field
    const salesWithDiscount = (data || []).map((sale) => ({
      ...sale,
      discount_amount:
        sale.payment_method === 'installment'
          ? sale.total_amount - (sale.actual_amount_received || 0)
          : 0,
    }))

    return salesWithDiscount
  } catch (error) {
    console.error('Error fetching recent sales:', error)
    throw new Error('Erro ao carregar vendas recentes. Tente novamente')
  }
}

/**
 * Gets chart data for sales over time
 */
export async function getSalesChartData(dateRange: DateRange): Promise<ChartDataPoint[]> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data: sales, error } = await supabase
      .from('sales')
      .select('created_at, total_amount')
      .eq('status', 'completed')
      .gte('created_at', dateRange.startDate.toISOString())
      .lte('created_at', dateRange.endDate.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    // Group sales by date
    const salesByDate = new Map<string, { sales: number; revenue: number }>()

    sales?.forEach((sale) => {
      const date = new Date(sale.created_at).toLocaleDateString('pt-BR')
      const existing = salesByDate.get(date) || { sales: 0, revenue: 0 }
      salesByDate.set(date, {
        sales: existing.sales + 1,
        revenue: existing.revenue + sale.total_amount,
      })
    })

    // Convert to array format for chart
    const chartData: ChartDataPoint[] = Array.from(salesByDate.entries()).map(
      ([date, data]) => ({
        date,
        sales: data.sales,
        revenue: data.revenue,
      })
    )

    return chartData
  } catch (error) {
    console.error('Error fetching sales chart data:', error)
    throw new Error('Erro ao carregar dados do gráfico. Tente novamente')
  }
}

/**
 * Create Sale Input interface
 */
export interface CreateSaleInput {
  customer_id: string
  cartItems: Array<{
    product: {
      id: string
      name: string
      sale_price: number
      cost_price: number
    }
    quantity: number
  }>
  payment_method: 'pix' | 'cash' | 'card' | 'installment'
  installment_count?: number
  actual_amount_received?: number
  down_payment?: number
  down_payment_method?: 'pix' | 'cash' | 'card'
  notes?: string
}

/**
 * Creates a new sale with items
 * Includes transaction-like behavior with manual rollback
 * Automatically creates installments for installment sales
 * Automatically creates cash flow entries
 */
export async function createSale(input: CreateSaleInput): Promise<Sale> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Validate stock before creating sale
    const { validateStock } = await import('./inventoryService')
    const stockValidation = await validateStock(input.cartItems)

    if (!stockValidation.isValid) {
      throw new Error(`Estoque insuficiente: ${stockValidation.errors.join(', ')}`)
    }

    // Calculate total amount
    const total_amount = input.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.sale_price,
      0
    )

    // Determine payment status based on payment method and down payment
    const isInstallment = input.payment_method === 'installment'
    const downPayment = input.down_payment || 0
    const paymentStatus = isInstallment
      ? (downPayment > 0 ? 'partial' : 'pending')
      : 'paid'

    // Create sale record
    const saleData: Database['public']['Tables']['sales']['Insert'] = {
      user_id: user.id,
      customer_id: input.customer_id,
      total_amount,
      payment_method: input.payment_method,
      installment_count: input.installment_count || null,
      actual_amount_received:
        isInstallment
          ? input.actual_amount_received || null
          : total_amount,
      payment_status: paymentStatus,
      down_payment: isInstallment ? downPayment : 0,
      status: 'completed',
      notes: input.notes || null,
    }

    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert(saleData)
      .select()
      .single()

    if (saleError) {
      console.error('Error creating sale:', saleError)
      console.error('Sale data:', saleData)
      throw new Error(`Erro ao criar venda: ${saleError.message || JSON.stringify(saleError)}`)
    }

    // Create sale_items records
    const saleItems = input.cartItems.map((item) => ({
      sale_id: sale.id,
      product_id: item.product.id,
      product_name: item.product.name, // Snapshot
      quantity: item.quantity,
      unit_price: item.product.sale_price, // Snapshot
      unit_cost: item.product.cost_price, // Snapshot
    }))

    const { error: itemsError } = await supabase.from('sale_items').insert(saleItems)

    if (itemsError) {
      console.error('Error creating sale items:', itemsError)

      // Rollback: Delete sale
      await supabase.from('sales').delete().eq('id', sale.id)

      throw new Error('Erro ao registrar itens da venda')
    }

    // Import services for installment and cash flow handling
    const { createInstallmentsForSale } = await import('./installmentService')
    const { createCashFlowEntry } = await import('./cashFlowService')

    try {
      // Handle installment sales
      if (isInstallment && input.installment_count && input.installment_count > 0) {
        // Create installments
        await createInstallmentsForSale(
          sale.id,
          total_amount,
          downPayment,
          input.installment_count,
          new Date()
        )

        // If there's a down payment, create cash flow entry for it
        if (downPayment > 0) {
          const downPaymentMethodLabel = input.down_payment_method
            ? input.down_payment_method.toUpperCase()
            : 'N/A'
          await createCashFlowEntry({
            type: 'income',
            category: 'sale_down_payment',
            amount: downPayment,
            description: `Entrada da venda parcelada via ${downPaymentMethodLabel}`,
            referenceType: 'sale',
            referenceId: sale.id
          })
        }
      } else {
        // Cash/PIX/Card sale - register total in cash flow
        await createCashFlowEntry({
          type: 'income',
          category: 'sale_cash',
          amount: total_amount,
          description: `Venda à vista - ${input.payment_method.toUpperCase()}`,
          referenceType: 'sale',
          referenceId: sale.id
        })
      }
    } catch (financialError) {
      console.error('Error creating financial records:', financialError)

      // Rollback: Delete sale items and sale
      await supabase.from('sale_items').delete().eq('sale_id', sale.id)
      await supabase.from('sales').delete().eq('id', sale.id)

      throw new Error('Erro ao registrar dados financeiros da venda')
    }

    // Database triggers will automatically:
    // - Update inventory quantities (update_inventory_on_sale)
    // - Update customer purchase metrics (update_customer_on_sale)
    // - Create inventory movements (create_inventory_movement_on_sale)
    // - Update customer total_due (trigger_customer_due_on_installment_change)

    return sale
  } catch (error) {
    console.error('Error in createSale:', error)

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Erro ao criar venda. Tente novamente')
  }
}

/**
 * Gets paginated sales with total count
 */
export async function getPaginatedSales(params: {
  page: number
  pageSize: number
}): Promise<{
  sales: Sale[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { page, pageSize } = params
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Get total count
    const { count, error: countError } = await supabase
      .from('sales')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError

    const total = count || 0
    const totalPages = Math.ceil(total / pageSize)

    // Get paginated data
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        customer:customers!sales_customer_id_fkey (
          id,
          full_name,
          email
        ),
        sale_items (
          id,
          product_name,
          quantity,
          unit_price
        )
      `)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    // Add computed discount_amount field
    const salesWithDiscount = (data || []).map((sale) => ({
      ...sale,
      discount_amount:
        sale.payment_method === 'installment'
          ? sale.total_amount - (sale.actual_amount_received || 0)
          : 0,
    }))

    return {
      sales: salesWithDiscount,
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    }
  } catch (error) {
    console.error('Error fetching paginated sales:', error)
    throw new Error('Erro ao carregar vendas. Tente novamente')
  }
}

/**
 * Gets a single sale by ID with all details
 */
export async function getSaleById(id: string): Promise<Sale> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        customer:customers!sales_customer_id_fkey (
          id,
          full_name,
          email
        ),
        sale_items (
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          unit_cost
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Venda não encontrada')
      }
      throw error
    }

    return {
      ...data,
      discount_amount:
        data.payment_method === 'installment'
          ? data.total_amount - (data.actual_amount_received || 0)
          : 0,
    }
  } catch (error) {
    console.error('Error fetching sale:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao carregar venda. Tente novamente')
  }
}

/**
 * Deletes a sale and returns stock to inventory
 */
export async function deleteSale(id: string): Promise<void> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Get sale with items before deleting
    const sale = await getSaleById(id)

    if (!sale.sale_items || sale.sale_items.length === 0) {
      throw new Error('Venda sem itens não pode ser deletada')
    }

    // Return products to stock
    for (const item of sale.sale_items) {
      if (item.product_id) {
        // Get current product stock
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('quantity')
          .eq('id', item.product_id)
          .single()

        if (productError) {
          console.error('Error fetching product:', productError)
          continue
        }

        // Update product quantity
        const { error: updateError } = await supabase
          .from('products')
          .update({ quantity: product.quantity + item.quantity })
          .eq('id', item.product_id)

        if (updateError) {
          console.error('Error updating product quantity:', updateError)
        }

        // Create inventory movement for stock return
        await supabase.from('inventory_movements').insert({
          user_id: user.id,
          product_id: item.product_id,
          movement_type: 'sale_return',
          quantity_change: item.quantity,
          quantity_before: product.quantity,
          quantity_after: product.quantity + item.quantity,
          reference_id: sale.id,
          notes: `Devolução de estoque - venda ${sale.id} deletada`,
        })
      }
    }

    // Update customer metrics
    if (sale.customer_id) {
      const { data: customer } = await supabase
        .from('customers')
        .select('purchase_count, total_purchases')
        .eq('id', sale.customer_id)
        .single()

      if (customer) {
        await supabase
          .from('customers')
          .update({
            purchase_count: Math.max(0, customer.purchase_count - 1),
            total_purchases: Math.max(0, customer.total_purchases - sale.total_amount),
          })
          .eq('id', sale.customer_id)
      }
    }

    // Delete sale (will cascade to sale_items)
    const { error: deleteError } = await supabase
      .from('sales')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError
  } catch (error) {
    console.error('Error deleting sale:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao deletar venda. Tente novamente')
  }
}
