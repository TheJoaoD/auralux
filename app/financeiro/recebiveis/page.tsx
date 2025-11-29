'use client'

import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getReceivablesForecast, getCashFlowMetrics } from '@/lib/services/cashFlowService'
import { getPendingInstallments, getInstallmentsSummary, type Installment } from '@/lib/services/installmentService'
import { PayInstallmentDialog } from '@/components/financeiro/PayInstallmentDialog'
import { toast } from 'sonner'
import {
  Wallet,
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  Clock,
  Users,
  Calendar,
  ChevronRight,
  DollarSign,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils/formatters'

// Meses em português
const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  const monthIndex = parseInt(month) - 1
  return `${MONTH_NAMES[monthIndex]} ${year}`
}

export default function RecebiveisPage() {
  const queryClient = useQueryClient()
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'forecast' | 'debtors' | 'overdue'>('forecast')

  // Métricas de cash flow
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['cash-flow-metrics'],
    queryFn: getCashFlowMetrics,
  })

  // Summary de parcelas
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['installments-summary'],
    queryFn: getInstallmentsSummary,
  })

  // Projeção de recebíveis (próximos 6 meses)
  const { data: forecast, isLoading: forecastLoading } = useQuery({
    queryKey: ['receivables-forecast'],
    queryFn: () => getReceivablesForecast(6),
  })

  // Todas parcelas pendentes/vencidas
  const { data: allInstallments, isLoading: installmentsLoading } = useQuery({
    queryKey: ['all-pending-installments'],
    queryFn: () => getPendingInstallments({ status: ['pending', 'partial', 'overdue'] }),
  })

  // Agrupar por cliente (devedores)
  const debtorsList = useMemo(() => {
    if (!allInstallments) return []

    const debtorsMap = new Map<string, {
      customerId: string
      customerName: string
      totalDue: number
      overdueAmount: number
      installmentsCount: number
      installments: Installment[]
    }>()

    const today = new Date().toISOString().split('T')[0]

    allInstallments.forEach(installment => {
      const customerId = installment.sale?.customer_id || 'unknown'
      const customerName = installment.customer?.full_name || 'Cliente não identificado'
      const remaining = installment.amount - (installment.paid_amount || 0)
      const isOverdue = installment.due_date < today || installment.status === 'overdue'

      if (!debtorsMap.has(customerId)) {
        debtorsMap.set(customerId, {
          customerId,
          customerName,
          totalDue: 0,
          overdueAmount: 0,
          installmentsCount: 0,
          installments: []
        })
      }

      const debtor = debtorsMap.get(customerId)!
      debtor.totalDue += remaining
      debtor.installmentsCount++
      debtor.installments.push(installment)
      if (isOverdue) {
        debtor.overdueAmount += remaining
      }
    })

    return Array.from(debtorsMap.values())
      .filter(d => d.totalDue > 0)
      .sort((a, b) => b.totalDue - a.totalDue)
  }, [allInstallments])

  // Parcelas vencidas
  const overdueInstallments = useMemo(() => {
    if (!allInstallments) return []
    const today = new Date().toISOString().split('T')[0]
    return allInstallments
      .filter(i => i.due_date < today || i.status === 'overdue')
      .sort((a, b) => a.due_date.localeCompare(b.due_date))
  }, [allInstallments])

  const handlePayClick = (installment: Installment) => {
    setSelectedInstallment(installment)
    setDialogOpen(true)
  }

  const handlePaySuccess = () => {
    toast.success('Pagamento registrado com sucesso!')
    queryClient.invalidateQueries({ queryKey: ['cash-flow-metrics'] })
    queryClient.invalidateQueries({ queryKey: ['installments-summary'] })
    queryClient.invalidateQueries({ queryKey: ['receivables-forecast'] })
    queryClient.invalidateQueries({ queryKey: ['all-pending-installments'] })
  }

  const isLoading = metricsLoading || summaryLoading

  // Calcular total de receita prevista
  const totalForecast = forecast?.reduce((sum, f) => sum + f.expected, 0) || 0

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      {/* Header */}
      <div className="bg-white border-b border-[#A1887F]/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="text-[#A1887F] hover:text-[#C49A9A]">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C49A9A]/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-[#C49A9A]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#202020]">Recebíveis</h1>
                  <p className="text-sm text-[#A1887F]">Previsibilidade de receita</p>
                </div>
              </div>
            </div>

            {/* Link para financeiro */}
            <Link href="/financeiro">
              <Button
                variant="outline"
                size="sm"
                className="border-[#A1887F] text-[#A1887F] hover:bg-[#A1887F]/10"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total a Receber */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#A1887F]/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm text-[#A1887F]">Total a Receber</span>
            </div>
            <p className="text-2xl font-bold text-[#202020]">
              {isLoading ? '...' : formatCurrency(summary?.totalPending || 0)}
            </p>
            <p className="text-xs text-[#A1887F] mt-1">
              {summary?.pendingCount || 0} parcelas
            </p>
          </div>

          {/* Vencidas */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <span className="text-sm text-[#A1887F]">Vencidas</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {isLoading ? '...' : formatCurrency(summary?.totalOverdue || 0)}
            </p>
            <p className="text-xs text-red-500 mt-1">
              {summary?.overdueCount || 0} parcelas em atraso
            </p>
          </div>

          {/* Vencendo Esta Semana */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-orange-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-sm text-[#A1887F]">Esta Semana</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {isLoading ? '...' : formatCurrency(summary?.totalDueThisWeek || 0)}
            </p>
            <p className="text-xs text-orange-500 mt-1">
              {summary?.dueThisWeekCount || 0} parcelas
            </p>
          </div>

          {/* Previsão 6 Meses */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm text-[#A1887F]">Próx. 6 Meses</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {forecastLoading ? '...' : formatCurrency(totalForecast)}
            </p>
            <p className="text-xs text-green-500 mt-1">
              Previsão de receita
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm border border-[#A1887F]/10 w-fit">
          <button
            onClick={() => setViewMode('forecast')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'forecast'
                ? 'bg-[#C49A9A] text-white'
                : 'text-[#A1887F] hover:bg-[#A1887F]/10'
            }`}
          >
            <Calendar className="h-4 w-4 inline-block mr-2" />
            Projeção Mensal
          </button>
          <button
            onClick={() => setViewMode('debtors')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'debtors'
                ? 'bg-[#C49A9A] text-white'
                : 'text-[#A1887F] hover:bg-[#A1887F]/10'
            }`}
          >
            <Users className="h-4 w-4 inline-block mr-2" />
            Devedores ({debtorsList.length})
          </button>
          <button
            onClick={() => setViewMode('overdue')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'overdue'
                ? 'bg-red-500 text-white'
                : 'text-[#A1887F] hover:bg-[#A1887F]/10'
            }`}
          >
            <AlertTriangle className="h-4 w-4 inline-block mr-2" />
            Vencidas ({overdueInstallments.length})
          </button>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'forecast' && (
          <div className="bg-white rounded-xl shadow-sm border border-[#A1887F]/10 overflow-hidden">
            <div className="p-5 border-b border-[#A1887F]/10">
              <h2 className="text-lg font-semibold text-[#202020]">
                Projeção de Receita por Mês
              </h2>
              <p className="text-sm text-[#A1887F]">
                Valores a receber nos próximos meses
              </p>
            </div>

            {forecastLoading ? (
              <div className="p-8 text-center text-[#A1887F]">Carregando...</div>
            ) : forecast && forecast.length > 0 ? (
              <div className="divide-y divide-[#A1887F]/10">
                {forecast.map((item, index) => {
                  // Calcular porcentagem para a barra
                  const maxExpected = Math.max(...forecast.map(f => f.expected))
                  const percentage = maxExpected > 0 ? (item.expected / maxExpected) * 100 : 0

                  return (
                    <div key={item.month} className="p-4 hover:bg-[#F7F5F2] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            index === 0 ? 'bg-[#C49A9A] text-white' : 'bg-[#A1887F]/20 text-[#A1887F]'
                          }`}>
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-[#202020]">
                              {formatMonth(item.month)}
                            </p>
                            <p className="text-sm text-[#A1887F]">
                              {item.count} parcelas previstas
                            </p>
                          </div>
                        </div>
                        <p className="text-xl font-bold text-[#202020]">
                          {formatCurrency(item.expected)}
                        </p>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2 bg-[#A1887F]/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C49A9A] rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-[#A1887F]">
                Nenhum recebível previsto nos próximos 6 meses
              </div>
            )}
          </div>
        )}

        {viewMode === 'debtors' && (
          <div className="bg-white rounded-xl shadow-sm border border-[#A1887F]/10 overflow-hidden">
            <div className="p-5 border-b border-[#A1887F]/10">
              <h2 className="text-lg font-semibold text-[#202020]">
                Clientes Devedores
              </h2>
              <p className="text-sm text-[#A1887F]">
                Clientes com parcelas pendentes ou vencidas
              </p>
            </div>

            {installmentsLoading ? (
              <div className="p-8 text-center text-[#A1887F]">Carregando...</div>
            ) : debtorsList.length > 0 ? (
              <div className="divide-y divide-[#A1887F]/10">
                {debtorsList.map((debtor) => (
                  <div key={debtor.customerId} className="p-4 hover:bg-[#F7F5F2] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          debtor.overdueAmount > 0 ? 'bg-red-100 text-red-600' : 'bg-[#A1887F]/20 text-[#A1887F]'
                        }`}>
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-[#202020]">
                            {debtor.customerName}
                          </p>
                          <p className="text-sm text-[#A1887F]">
                            {debtor.installmentsCount} parcelas pendentes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#202020]">
                          {formatCurrency(debtor.totalDue)}
                        </p>
                        {debtor.overdueAmount > 0 && (
                          <p className="text-sm text-red-600">
                            {formatCurrency(debtor.overdueAmount)} vencido
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Parcelas do cliente */}
                    <div className="mt-3 pl-13 space-y-2">
                      {debtor.installments.slice(0, 3).map((inst) => {
                        const remaining = inst.amount - (inst.paid_amount || 0)
                        const today = new Date().toISOString().split('T')[0]
                        const isOverdue = inst.due_date < today || inst.status === 'overdue'

                        return (
                          <div
                            key={inst.id}
                            className="flex items-center justify-between p-2 bg-[#F7F5F2] rounded-lg text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                isOverdue
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {inst.installment_number}ª parcela
                              </span>
                              <span className="text-[#A1887F]">
                                Venc: {new Date(inst.due_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{formatCurrency(remaining)}</span>
                              <button
                                onClick={() => handlePayClick(inst)}
                                className="px-2 py-1 bg-[#C49A9A] text-white text-xs rounded hover:bg-[#B38989] transition-colors"
                              >
                                Baixar
                              </button>
                            </div>
                          </div>
                        )
                      })}
                      {debtor.installments.length > 3 && (
                        <p className="text-sm text-[#A1887F] text-center">
                          + {debtor.installments.length - 3} parcelas
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[#A1887F]">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum cliente devedor no momento</p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'overdue' && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
            <div className="p-5 border-b border-red-200 bg-red-50">
              <h2 className="text-lg font-semibold text-red-700">
                Parcelas Vencidas
              </h2>
              <p className="text-sm text-red-600">
                Parcelas que já passaram da data de vencimento
              </p>
            </div>

            {installmentsLoading ? (
              <div className="p-8 text-center text-[#A1887F]">Carregando...</div>
            ) : overdueInstallments.length > 0 ? (
              <div className="divide-y divide-red-100">
                {overdueInstallments.map((inst) => {
                  const remaining = inst.amount - (inst.paid_amount || 0)
                  const daysOverdue = Math.floor(
                    (new Date().getTime() - new Date(inst.due_date + 'T12:00:00').getTime()) / (1000 * 60 * 60 * 24)
                  )

                  return (
                    <div key={inst.id} className="p-4 hover:bg-red-50/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-[#202020]">
                              {inst.customer?.full_name || 'Cliente não identificado'}
                            </p>
                            <p className="text-sm text-red-600">
                              {inst.installment_number}ª parcela - Venceu há {daysOverdue} dias
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xl font-bold text-red-600">
                              {formatCurrency(remaining)}
                            </p>
                            <p className="text-xs text-[#A1887F]">
                              Vencimento: {new Date(inst.due_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <button
                            onClick={() => handlePayClick(inst)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                          >
                            <DollarSign className="h-4 w-4" />
                            Dar Baixa
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-green-600">
                <CheckCircle className="h-12 w-12 mx-auto mb-3" />
                <p className="font-medium">Nenhuma parcela vencida!</p>
                <p className="text-sm text-[#A1887F]">Todas as parcelas estão em dia</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pay Dialog */}
      <PayInstallmentDialog
        installment={selectedInstallment}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handlePaySuccess}
      />
    </div>
  )
}

// Para evitar erro de SSR
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
