import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'

/**
 * Installment Service
 * Handles all installment-related database operations
 */

export type Installment = Database['public']['Tables']['sale_installments']['Row'] & {
  customer?: {
    id: string
    full_name: string
  } | null
  sale?: {
    id: string
    total_amount: number
    customer_id: string | null
  } | null
}

export type InstallmentStatus = 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled'

export interface InstallmentFilters {
  status?: InstallmentStatus | InstallmentStatus[]
  customerId?: string
  saleId?: string
  dueDateStart?: Date
  dueDateEnd?: Date
}

export interface InstallmentSummary {
  totalPending: number
  totalOverdue: number
  totalDueThisWeek: number
  pendingCount: number
  overdueCount: number
  dueThisWeekCount: number
}

/**
 * Creates installments for a sale
 */
export async function createInstallmentsForSale(
  saleId: string,
  totalAmount: number,
  downPayment: number,
  installmentCount: number,
  startDate: Date
): Promise<Installment[]> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const parcelableAmount = totalAmount - downPayment
  const installmentAmount = Number((parcelableAmount / installmentCount).toFixed(2))

  // Adjust last installment for rounding difference
  const installments: Database['public']['Tables']['sale_installments']['Insert'][] = []
  let remainingAmount = parcelableAmount

  for (let i = 1; i <= installmentCount; i++) {
    const isLast = i === installmentCount
    const amount = isLast ? Number(remainingAmount.toFixed(2)) : installmentAmount
    remainingAmount -= amount

    const dueDate = new Date(startDate)
    dueDate.setMonth(dueDate.getMonth() + (i - 1))

    installments.push({
      sale_id: saleId,
      user_id: user.id,
      installment_number: i,
      amount: amount,
      due_date: dueDate.toISOString().split('T')[0],
      status: 'pending',
      paid_amount: 0
    })
  }

  const { data, error } = await supabase
    .from('sale_installments')
    .insert(installments)
    .select()

  if (error) throw error
  return data || []
}

/**
 * Gets pending installments with optional filters
 */
export async function getPendingInstallments(filters?: InstallmentFilters): Promise<Installment[]> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  let query = supabase
    .from('sale_installments')
    .select(`
      *,
      sale:sales!sale_installments_sale_id_fkey (
        id,
        total_amount,
        customer_id,
        customer:customers!sales_customer_id_fkey (
          id,
          full_name
        )
      )
    `)
    .order('due_date', { ascending: true })

  // Apply status filter
  if (filters?.status) {
    if (Array.isArray(filters.status)) {
      query = query.in('status', filters.status)
    } else {
      query = query.eq('status', filters.status)
    }
  } else {
    // Default to pending statuses
    query = query.in('status', ['pending', 'partial', 'overdue'])
  }

  // Apply date range filters
  if (filters?.dueDateStart) {
    query = query.gte('due_date', filters.dueDateStart.toISOString().split('T')[0])
  }

  if (filters?.dueDateEnd) {
    query = query.lte('due_date', filters.dueDateEnd.toISOString().split('T')[0])
  }

  // Apply sale filter
  if (filters?.saleId) {
    query = query.eq('sale_id', filters.saleId)
  }

  const { data, error } = await query

  if (error) throw error

  // Transform data to include customer at top level
  const installments = (data || []).map(item => {
    const sale = item.sale as {
      id: string
      total_amount: number
      customer_id: string | null
      customer: { id: string; full_name: string } | null
    } | null

    return {
      ...item,
      customer: sale?.customer || null,
      sale: sale ? {
        id: sale.id,
        total_amount: sale.total_amount,
        customer_id: sale.customer_id
      } : null
    }
  })

  // Filter by customer if specified
  if (filters?.customerId) {
    return installments.filter(i => i.sale?.customer_id === filters.customerId)
  }

  return installments
}

/**
 * Gets installments by customer ID
 */
export async function getInstallmentsByCustomer(customerId: string): Promise<Installment[]> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  // First get all sales for this customer
  const { data: sales, error: salesError } = await supabase
    .from('sales')
    .select('id')
    .eq('customer_id', customerId)

  if (salesError) throw salesError

  if (!sales || sales.length === 0) {
    return []
  }

  const saleIds = sales.map(s => s.id)

  // Then get all installments for these sales
  const { data, error } = await supabase
    .from('sale_installments')
    .select(`
      *,
      sale:sales!sale_installments_sale_id_fkey (
        id,
        total_amount,
        customer_id,
        customer:customers!sales_customer_id_fkey (
          id,
          full_name
        )
      )
    `)
    .in('sale_id', saleIds)
    .order('due_date', { ascending: true })

  if (error) throw error

  // Transform data
  return (data || []).map(item => {
    const sale = item.sale as {
      id: string
      total_amount: number
      customer_id: string | null
      customer: { id: string; full_name: string } | null
    } | null

    return {
      ...item,
      customer: sale?.customer || null,
      sale: sale ? {
        id: sale.id,
        total_amount: sale.total_amount,
        customer_id: sale.customer_id
      } : null
    }
  })
}

/**
 * Gets installments summary (for dashboard cards)
 */
export async function getInstallmentsSummary(): Promise<InstallmentSummary> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  // Get date 7 days from now
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const nextWeekStr = nextWeek.toISOString().split('T')[0]

  // Get all pending installments
  const { data, error } = await supabase
    .from('sale_installments')
    .select('id, amount, paid_amount, due_date, status')
    .in('status', ['pending', 'partial', 'overdue'])

  if (error) throw error

  let totalPending = 0
  let totalOverdue = 0
  let totalDueThisWeek = 0
  let pendingCount = 0
  let overdueCount = 0
  let dueThisWeekCount = 0

  data?.forEach(installment => {
    const remaining = installment.amount - (installment.paid_amount || 0)
    const isOverdue = installment.due_date < todayStr || installment.status === 'overdue'
    const isDueThisWeek = installment.due_date >= todayStr && installment.due_date <= nextWeekStr

    totalPending += remaining
    pendingCount++

    if (isOverdue) {
      totalOverdue += remaining
      overdueCount++
    }

    if (isDueThisWeek && !isOverdue) {
      totalDueThisWeek += remaining
      dueThisWeekCount++
    }
  })

  return {
    totalPending: Number(totalPending.toFixed(2)),
    totalOverdue: Number(totalOverdue.toFixed(2)),
    totalDueThisWeek: Number(totalDueThisWeek.toFixed(2)),
    pendingCount,
    overdueCount,
    dueThisWeekCount
  }
}

/**
 * Gets a single installment by ID
 */
export async function getInstallmentById(id: string): Promise<Installment> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('sale_installments')
    .select(`
      *,
      sale:sales!sale_installments_sale_id_fkey (
        id,
        total_amount,
        customer_id,
        customer:customers!sales_customer_id_fkey (
          id,
          full_name
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Parcela não encontrada')
    }
    throw error
  }

  const sale = data.sale as {
    id: string
    total_amount: number
    customer_id: string | null
    customer: { id: string; full_name: string } | null
  } | null

  return {
    ...data,
    customer: sale?.customer || null,
    sale: sale ? {
      id: sale.id,
      total_amount: sale.total_amount,
      customer_id: sale.customer_id
    } : null
  }
}

/**
 * Pay an installment (full or partial)
 */
export async function payInstallment(input: {
  installmentId: string
  amount: number
  paymentMethod: 'pix' | 'cash'
  notes?: string
}): Promise<Installment> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  // Get current installment
  const installment = await getInstallmentById(input.installmentId)

  const remaining = installment.amount - (installment.paid_amount || 0)

  if (input.amount > remaining) {
    throw new Error(`Valor máximo permitido: R$ ${remaining.toFixed(2)}`)
  }

  const newPaidAmount = (installment.paid_amount || 0) + input.amount
  const isPaidInFull = newPaidAmount >= installment.amount

  // Update installment
  const { data, error } = await supabase
    .from('sale_installments')
    .update({
      paid_amount: newPaidAmount,
      status: isPaidInFull ? 'paid' : 'partial',
      paid_at: isPaidInFull ? new Date().toISOString() : null,
      payment_method: input.paymentMethod,
      notes: input.notes || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', input.installmentId)
    .select()
    .single()

  if (error) throw error

  // Create cash flow entry for the payment
  const { createCashFlowEntry } = await import('./cashFlowService')
  await createCashFlowEntry({
    type: 'income',
    category: 'installment_payment',
    amount: input.amount,
    description: `Pagamento parcela ${installment.installment_number} - ${input.paymentMethod.toUpperCase()}`,
    referenceType: 'installment',
    referenceId: input.installmentId
  })

  return data
}

/**
 * Update overdue installments status
 * Should be called periodically (e.g., daily cron job)
 */
export async function updateOverdueInstallments(): Promise<number> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('sale_installments')
    .update({
      status: 'overdue',
      updated_at: new Date().toISOString()
    })
    .in('status', ['pending', 'partial'])
    .lt('due_date', today)
    .select()

  if (error) throw error

  return data?.length || 0
}

/**
 * Cancel an installment
 */
export async function cancelInstallment(id: string, notes?: string): Promise<Installment> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('sale_installments')
    .update({
      status: 'cancelled',
      notes: notes || 'Parcela cancelada',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}
