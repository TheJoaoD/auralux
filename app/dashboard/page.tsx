'use client'

import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { MetricsCards } from '@/components/dashboard/MetricsCards'
import { SalesChart } from '@/components/dashboard/SalesChart'
import { RecentSalesList } from '@/components/dashboard/RecentSalesList'
import { PaymentBreakdown } from '@/components/dashboard/PaymentBreakdown'
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter'
import { NewSaleWizard } from '@/components/sales/NewSaleWizard'
import {
  getSalesMetrics,
  getRecentSales,
  getPaymentMethodBreakdown,
  getSalesChartData,
} from '@/lib/services/salesService'
import { getDateRange } from '@/lib/utils/formatters'
import { Plus, RefreshCw, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | '30days' | 'month'>('30days')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false)
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const dateRange = getDateRange(selectedPeriod)

  // Fetch metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['sales-metrics', selectedPeriod],
    queryFn: () => getSalesMetrics(dateRange),
    refetchInterval: 60000, // Refresh every 60 seconds
    staleTime: 30000,
  })

  // Fetch recent sales
  const { data: recentSales, isLoading: salesLoading } = useQuery({
    queryKey: ['recent-sales'],
    queryFn: () => getRecentSales(10),
    refetchInterval: 60000,
    staleTime: 30000,
  })

  // Fetch payment breakdown
  const { data: paymentBreakdown, isLoading: breakdownLoading } = useQuery({
    queryKey: ['payment-breakdown', selectedPeriod],
    queryFn: () => getPaymentMethodBreakdown(dateRange),
    staleTime: 30000,
  })

  // Fetch chart data
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['sales-chart', selectedPeriod],
    queryFn: () => getSalesChartData(dateRange),
    staleTime: 30000,
  })

  // Real-time subscription
  useEffect(() => {
    if (!user) return

    const supabase = createClient()

    const channel = supabase
      .channel('sales-dashboard-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events
          schema: 'public',
          table: 'sales',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Sale change received:', payload)
          // Invalidate all dashboard queries
          queryClient.invalidateQueries({ queryKey: ['sales-metrics'] })
          queryClient.invalidateQueries({ queryKey: ['recent-sales'] })
          queryClient.invalidateQueries({ queryKey: ['payment-breakdown'] })
          queryClient.invalidateQueries({ queryKey: ['sales-chart'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, queryClient])

  // Refresh all data
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['sales-metrics'] }),
      queryClient.invalidateQueries({ queryKey: ['recent-sales'] }),
      queryClient.invalidateQueries({ queryKey: ['payment-breakdown'] }),
      queryClient.invalidateQueries({ queryKey: ['sales-chart'] }),
    ])
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const handleAddSale = () => {
    setIsNewSaleOpen(true)
  }

  const isLoading = metricsLoading && !metrics

  // Empty state when no sales at all
  if (!isLoading && metrics && metrics.totalSales === 0) {
    return (
      <MainLayout>
        <div className="container max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-[#E0DCD1]">Dashboard de Vendas</h1>
            <button
              onClick={handleAddSale}
              className="bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Plus className="h-5 w-5" />
              Nova Venda
            </button>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="bg-[#A1887F] rounded-2xl p-12 max-w-md w-full text-center">
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-[#E0DCD1]/10 rounded-full">
                  <TrendingUp className="h-20 w-20 text-[#E0DCD1]/50" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#E0DCD1] mb-3">
                Nenhuma venda registrada ainda
              </h2>

              <p className="text-[#E0DCD1]/70 mb-8">
                Comece a registrar vendas para ver seu dashboard com métricas e gráficos
              </p>

              <button
                onClick={handleAddSale}
                className="w-full bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Criar Primeira Venda
              </button>
            </div>
          </div>
        </div>

        {/* Floating Action Button (Mobile Only) */}
        <button
          onClick={handleAddSale}
          className="fixed bottom-6 right-6 sm:hidden bg-[#C49A9A] hover:bg-[#B38989] text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 z-50"
          aria-label="Nova Venda"
        >
          <Plus className="h-6 w-6" />
        </button>

        {/* New Sale Wizard */}
        <NewSaleWizard open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen} />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 pb-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 pb-6">
          <h1 className="text-2xl font-bold text-[#E0DCD1]">Dashboard de Vendas</h1>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-3 bg-[#A1887F] hover:bg-[#8D7A6F] text-[#E0DCD1] rounded-lg transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Atualizar dados"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Add Sale Button */}
            <button
              onClick={handleAddSale}
              className="bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 min-h-[44px]"
            >
              <Plus className="h-5 w-5" />
              Nova Venda
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <DateRangeFilter selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

        {/* Metrics Cards */}
        <MetricsCards metrics={metrics} isLoading={metricsLoading} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart (2/3 width on desktop) */}
          <div className="lg:col-span-2">
            <SalesChart data={chartData} isLoading={chartLoading} />
          </div>

          {/* Payment Breakdown (1/3 width on desktop) */}
          <div className="lg:col-span-1">
            <PaymentBreakdown breakdown={paymentBreakdown} isLoading={breakdownLoading} />
          </div>
        </div>

        {/* Recent Sales List */}
        <RecentSalesList sales={recentSales} isLoading={salesLoading} onAddSale={handleAddSale} />
      </div>

      {/* Floating Action Button (Mobile Only) - Above BottomNav */}
      <button
        onClick={handleAddSale}
        className="fixed bottom-20 right-6 sm:hidden bg-[#C49A9A] hover:bg-[#B38989] text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 z-[60]"
        aria-label="Nova Venda"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* New Sale Wizard */}
      <NewSaleWizard open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen} />
    </MainLayout>
  )
}
