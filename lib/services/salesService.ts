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
  installment: { count: number; percentage: number; total: number }
}

export interface DateRange {
  startDate: Date
  endDate: Date
}

export interface SalesFilters {
  dateRange?: DateRange
  paymentMethod?: 'pix' | 'cash' | 'installment'
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
      .eq('user_id', user.id)
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
      .eq('user_id', user.id)
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
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', dateRange.startDate.toISOString())
      .lte('created_at', dateRange.endDate.toISOString())

    if (error) throw error

    const totalCount = sales?.length || 0

    // Group by payment method
    const pixSales = sales?.filter((s) => s.payment_method === 'pix') || []
    const cashSales = sales?.filter((s) => s.payment_method === 'cash') || []
    const installmentSales = sales?.filter((s) => s.payment_method === 'installment') || []

    const pixTotal = pixSales.reduce((sum, s) => sum + s.total_amount, 0)
    const cashTotal = cashSales.reduce((sum, s) => sum + s.total_amount, 0)
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
      .eq('user_id', user.id)
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
      .eq('user_id', user.id)
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
  payment_method: 'pix' | 'cash' | 'installment'
  installment_count?: number
  actual_amount_received?: number
  notes?: string
}

/**
 * Creates a new sale with items
 * Includes transaction-like behavior with manual rollback
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

    // Create sale record
    const saleData: Database['public']['Tables']['sales']['Insert'] = {
      user_id: user.id,
      customer_id: input.customer_id,
      total_amount,
      payment_method: input.payment_method,
      installment_count: input.installment_count || null,
      actual_amount_received:
        input.payment_method === 'installment'
          ? input.actual_amount_received || null
          : total_amount,
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

    // Database triggers will automatically:
    // - Update inventory quantities (update_inventory_on_sale)
    // - Update customer purchase metrics (update_customer_on_sale)
    // - Create inventory movements (create_inventory_movement_on_sale)

    return sale
  } catch (error) {
    console.error('Error in createSale:', error)

    if (error instanceof Error) {
      throw error
    }

    throw new Error('Erro ao criar venda. Tente novamente')
  }
}
