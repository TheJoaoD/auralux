'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getCashFlowMetrics, getCashFlowGrouped } from '@/lib/services/cashFlowService'
import { getPendingInstallments, type Installment } from '@/lib/services/installmentService'
import { CashFlowMetricsCards } from '@/components/financeiro/CashFlowMetricsCards'
import { CashFlowChart } from '@/components/financeiro/CashFlowChart'
import { UpcomingInstallments } from '@/components/financeiro/UpcomingInstallments'
import { PayInstallmentDialog } from '@/components/financeiro/PayInstallmentDialog'
import { toast } from 'sonner'
import { Wallet, ArrowLeft, CreditCard, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function FinanceiroPage() {
  const queryClient = useQueryClient()
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Cash flow metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['cash-flow-metrics'],
    queryFn: getCashFlowMetrics,
  })

  // Chart data (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['cash-flow-chart'],
    queryFn: () => getCashFlowGrouped(thirtyDaysAgo, new Date(), 'day'),
  })

  // Upcoming installments (next 7 days)
  const today = new Date()
  const weekFromNow = new Date()
  weekFromNow.setDate(weekFromNow.getDate() + 7)

  const { data: upcomingInstallments, isLoading: upcomingLoading } = useQuery({
    queryKey: ['upcoming-installments'],
    queryFn: () =>
      getPendingInstallments({
        status: ['pending', 'partial'],
        dueDateStart: today,
        dueDateEnd: weekFromNow,
      }),
  })

  const handlePayClick = (installment: Installment) => {
    setSelectedInstallment(installment)
    setDialogOpen(true)
  }

  const handlePaySuccess = () => {
    toast.success('Pagamento registrado com sucesso!')
    queryClient.invalidateQueries({ queryKey: ['cash-flow-metrics'] })
    queryClient.invalidateQueries({ queryKey: ['cash-flow-chart'] })
    queryClient.invalidateQueries({ queryKey: ['upcoming-installments'] })
    queryClient.invalidateQueries({ queryKey: ['installments'] })
    queryClient.invalidateQueries({ queryKey: ['installments-summary'] })
  }

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
                  <Wallet className="h-6 w-6 text-[#C49A9A]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#202020]">Dashboard Financeiro</h1>
                  <p className="text-sm text-[#A1887F]">Visão geral do fluxo de caixa</p>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="flex items-center gap-2">
              <Link href="/financeiro/parcelas">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#A1887F] text-[#A1887F] hover:bg-[#A1887F]/10"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Parcelas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Metrics Cards */}
        <CashFlowMetricsCards metrics={metrics} isLoading={metricsLoading} />

        {/* Chart and Upcoming Installments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CashFlowChart data={chartData} isLoading={chartLoading} />
          </div>

          <div>
            <UpcomingInstallments
              installments={upcomingInstallments}
              onPayClick={handlePayClick}
              isLoading={upcomingLoading}
            />
          </div>
        </div>
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
