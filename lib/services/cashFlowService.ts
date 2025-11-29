import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'

/**
 * Cash Flow Service
 * Handles all cash flow related database operations
 */

export type CashFlowEntry = Database['public']['Tables']['cash_flow']['Row']

export type CashFlowType = 'income' | 'expense'

export type CashFlowCategory =
  | 'sale_cash'
  | 'sale_down_payment'
  | 'installment_payment'
  | 'refund'
  | 'adjustment'
  | 'other'

export interface CashFlowSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  period: {
    start: string
    end: string
  }
}

export interface CashFlowMetrics {
  today: number
  thisWeek: number
  thisMonth: number
  pendingReceivables: number
  overdueReceivables: number
}

export interface ReceivablesForecast {
  month: string
  expected: number
  count: number
}

export interface CashFlowFilters {
  startDate?: Date
  endDate?: Date
  type?: CashFlowType
  category?: CashFlowCategory
}

export interface GroupedCashFlow {
  period: string
  income: number
  expense: number
  balance: number
  count: number
}

/**
 * Creates a cash flow entry
 */
export async function createCashFlowEntry(input: {
  type: CashFlowType
  category: CashFlowCategory
  amount: number
  description?: string
  referenceType?: string
  referenceId?: string
  transactionDate?: Date
}): Promise<CashFlowEntry> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('cash_flow')
    .insert({
      user_id: user.id,
      type: input.type,
      category: input.category,
      amount: input.amount,
      description: input.description || null,
      reference_type: input.referenceType || null,
      reference_id: input.referenceId || null,
      transaction_date: (input.transactionDate || new Date()).toISOString().split('T')[0],
      created_by: user.id
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Gets cash flow entries for a period
 */
export async function getCashFlowByPeriod(
  startDate: Date,
  endDate: Date,
  filters?: { category?: CashFlowCategory; type?: CashFlowType }
): Promise<CashFlowEntry[]> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  let query = supabase
    .from('cash_flow')
    .select('*')
    .gte('transaction_date', startDate.toISOString().split('T')[0])
    .lte('transaction_date', endDate.toISOString().split('T')[0])

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.type) {
    query = query.eq('type', filters.type)
  }

  query = query.order('transaction_date', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  return data || []
}

/**
 * Gets cash flow summary for a period
 */
export async function getCashFlowSummary(
  startDate: Date,
  endDate: Date
): Promise<CashFlowSummary> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('cash_flow')
    .select('type, amount')
    .gte('transaction_date', startDate.toISOString().split('T')[0])
    .lte('transaction_date', endDate.toISOString().split('T')[0])

  if (error) throw error

  let totalIncome = 0
  let totalExpense = 0

  data?.forEach(entry => {
    if (entry.type === 'income') {
      totalIncome += entry.amount
    } else {
      totalExpense += entry.amount
    }
  })

  return {
    totalIncome: Number(totalIncome.toFixed(2)),
    totalExpense: Number(totalExpense.toFixed(2)),
    balance: Number((totalIncome - totalExpense).toFixed(2)),
    period: {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    }
  }
}

/**
 * Gets daily cash flow entries
 */
export async function getDailyCashFlow(date: Date): Promise<CashFlowEntry[]> {
  const supabase = createClient()
  const dateStr = date.toISOString().split('T')[0]

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('cash_flow')
    .select('*')
    .eq('transaction_date', dateStr)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Gets receivables forecast for upcoming months
 */
export async function getReceivablesForecast(
  months: number = 3
): Promise<ReceivablesForecast[]> {
  const supabase = createClient()
  const today = new Date()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  // Calculate limit date
  const limitDate = new Date(today)
  limitDate.setMonth(limitDate.getMonth() + months)

  const { data, error } = await supabase
    .from('sale_installments')
    .select('amount, paid_amount, due_date')
    .in('status', ['pending', 'partial'])
    .gte('due_date', today.toISOString().split('T')[0])
    .lte('due_date', limitDate.toISOString().split('T')[0])

  if (error) throw error

  // Group by month
  const byMonth: Record<string, { expected: number; count: number }> = {}

  data?.forEach(item => {
    const month = item.due_date.substring(0, 7) // 'YYYY-MM'
    if (!byMonth[month]) {
      byMonth[month] = { expected: 0, count: 0 }
    }
    byMonth[month].expected += (item.amount - (item.paid_amount || 0))
    byMonth[month].count++
  })

  // Convert to sorted array
  return Object.entries(byMonth)
    .map(([month, data]) => ({
      month,
      expected: Number(data.expected.toFixed(2)),
      count: data.count
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

/**
 * Gets cash flow metrics for dashboard
 */
export async function getCashFlowMetrics(): Promise<CashFlowMetrics> {
  const supabase = createClient()
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  // First day of week (Sunday)
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())

  // First day of month
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  // Query cash_flow for metrics
  const { data: cashData, error: cashError } = await supabase
    .from('cash_flow')
    .select('amount, transaction_date')
    .eq('type', 'income')
    .gte('transaction_date', monthStart.toISOString().split('T')[0])

  if (cashError) throw cashError

  // Query installments for receivables
  const { data: installmentData, error: installmentError } = await supabase
    .from('sale_installments')
    .select('amount, paid_amount, status, due_date')
    .in('status', ['pending', 'partial', 'overdue'])

  if (installmentError) throw installmentError

  // Calculate cash metrics
  let todayTotal = 0
  let weekTotal = 0
  let monthTotal = 0

  const weekStartStr = weekStart.toISOString().split('T')[0]

  cashData?.forEach(item => {
    monthTotal += item.amount
    if (item.transaction_date >= weekStartStr) {
      weekTotal += item.amount
    }
    if (item.transaction_date === todayStr) {
      todayTotal += item.amount
    }
  })

  // Calculate receivables
  let pendingReceivables = 0
  let overdueReceivables = 0

  installmentData?.forEach(item => {
    const remaining = item.amount - (item.paid_amount || 0)
    if (item.due_date < todayStr || item.status === 'overdue') {
      overdueReceivables += remaining
    } else {
      pendingReceivables += remaining
    }
  })

  return {
    today: Number(todayTotal.toFixed(2)),
    thisWeek: Number(weekTotal.toFixed(2)),
    thisMonth: Number(monthTotal.toFixed(2)),
    pendingReceivables: Number(pendingReceivables.toFixed(2)),
    overdueReceivables: Number(overdueReceivables.toFixed(2))
  }
}

/**
 * Gets grouped cash flow data
 */
export async function getCashFlowGrouped(
  startDate: Date,
  endDate: Date,
  groupBy: 'day' | 'week' | 'month' = 'day'
): Promise<GroupedCashFlow[]> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('cash_flow')
    .select('type, amount, transaction_date')
    .gte('transaction_date', startDate.toISOString().split('T')[0])
    .lte('transaction_date', endDate.toISOString().split('T')[0])

  if (error) throw error

  // Group data
  const grouped: Record<string, GroupedCashFlow> = {}

  data?.forEach(item => {
    let period: string

    switch (groupBy) {
      case 'month':
        period = item.transaction_date.substring(0, 7) // 'YYYY-MM'
        break
      case 'week': {
        const date = new Date(item.transaction_date)
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        period = weekStart.toISOString().split('T')[0]
        break
      }
      default: // day
        period = item.transaction_date
    }

    if (!grouped[period]) {
      grouped[period] = {
        period,
        income: 0,
        expense: 0,
        balance: 0,
        count: 0
      }
    }

    if (item.type === 'income') {
      grouped[period].income += item.amount
    } else {
      grouped[period].expense += item.amount
    }
    grouped[period].count++
  })

  // Calculate balance and sort
  return Object.values(grouped)
    .map(g => ({
      ...g,
      income: Number(g.income.toFixed(2)),
      expense: Number(g.expense.toFixed(2)),
      balance: Number((g.income - g.expense).toFixed(2))
    }))
    .sort((a, b) => a.period.localeCompare(b.period))
}

/**
 * Gets a cash flow entry by ID
 */
export async function getCashFlowById(id: string): Promise<CashFlowEntry> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('cash_flow')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Registro não encontrado')
    }
    throw error
  }

  return data
}

/**
 * Deletes a cash flow entry
 */
export async function deleteCashFlowEntry(id: string): Promise<void> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { error } = await supabase
    .from('cash_flow')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Creates a refund entry in cash flow
 */
export async function createRefundEntry(input: {
  amount: number
  description: string
  referenceType?: string
  referenceId?: string
}): Promise<CashFlowEntry> {
  return createCashFlowEntry({
    type: 'expense',
    category: 'refund',
    amount: input.amount,
    description: input.description,
    referenceType: input.referenceType,
    referenceId: input.referenceId
  })
}

/**
 * Creates an adjustment entry in cash flow
 */
export async function createAdjustmentEntry(input: {
  type: CashFlowType
  amount: number
  description: string
}): Promise<CashFlowEntry> {
  return createCashFlowEntry({
    type: input.type,
    category: 'adjustment',
    amount: input.amount,
    description: input.description
  })
}
