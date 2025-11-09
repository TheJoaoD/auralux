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
import { Plus, RefreshCw, TrendingUp, ShoppingBag, Eye, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | '30days' | 'month'>('30days')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false)
  const [isFabOpen, setIsFabOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
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
    queryFn: () => getRecentSales(5),
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#E0DCD1]">Dashboard de Vendas</h1>
            {/* Add Sale Button (Desktop Only) */}
            <button
              onClick={handleAddSale}
              className="hidden sm:flex bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-3 px-6 rounded-lg transition-colors items-center justify-center gap-2 min-h-[44px]"
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

        {/* Floating Action Button with Menu (Mobile Only) */}
        {!isNewSaleOpen && (
          <>
            {/* Backdrop */}
            {isFabOpen && (
              <div
                className="fixed inset-0 bg-black/20 sm:hidden z-[59]"
                onClick={() => setIsFabOpen(false)}
              />
            )}

            <div className="fixed bottom-20 sm:hidden z-[60]" style={{ left: '95%', transform: 'translateX(-100%)' }}>
              {/* Action Buttons */}
              <div className="flex flex-col items-end gap-3 mb-3">
              {/* View Sales Button */}
              <a
                href="/sales"
                className={`flex items-center gap-3 bg-[#A1887F] text-[#E0DCD1] px-4 py-3 rounded-full shadow-lg transition-all ${
                  isFabOpen
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-20 pointer-events-none'
                }`}
                style={{
                  transitionDuration: '300ms',
                  transitionDelay: isFabOpen ? '100ms' : '0ms',
                }}
              >
                <span className="font-medium whitespace-nowrap">Ver Vendas</span>
                <div className="bg-[#C49A9A] p-2 rounded-full">
                  <Eye className="h-5 w-5 text-[#202020]" />
                </div>
              </a>

              {/* New Sale Button */}
              <button
                onClick={() => {
                  setIsFabOpen(false)
                  handleAddSale()
                }}
                className={`flex items-center gap-3 bg-[#A1887F] text-[#E0DCD1] px-4 py-3 rounded-full shadow-lg transition-all ${
                  isFabOpen
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-20 pointer-events-none'
                }`}
                style={{
                  transitionDuration: '300ms',
                  transitionDelay: isFabOpen ? '50ms' : '0ms',
                }}
              >
                <span className="font-medium whitespace-nowrap">Nova Venda</span>
                <div className="bg-[#C49A9A] p-2 rounded-full">
                  <ShoppingBag className="h-5 w-5 text-[#202020]" />
                </div>
              </button>
            </div>

            {/* Main FAB Button */}
            <button
              onClick={() => setIsFabOpen(!isFabOpen)}
              className={`bg-[#C49A9A] hover:bg-[#B38989] text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 ${
                isFabOpen ? 'rotate-45' : 'rotate-0'
              }`}
              aria-label="Menu de ações"
            >
              <Plus className="h-6 w-6" />
            </button>
            </div>
          </>
        )}

        {/* New Sale Wizard */}
        <NewSaleWizard open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen} />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 pb-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 pt-4 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#E0DCD1]">Dashboard de Vendas</h1>

            <div className="flex items-center gap-3">
              {/* Filter Toggle Button (Mobile Only) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden p-3 bg-[#A1887F] hover:bg-[#8D7A6F] text-[#E0DCD1] rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Filtros"
              >
                <Filter className="h-5 w-5" />
              </button>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-3 bg-[#A1887F] hover:bg-[#8D7A6F] text-[#E0DCD1] rounded-lg transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Atualizar dados"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Add Sale Button (Desktop Only) */}
              <button
                onClick={handleAddSale}
                className="hidden sm:flex bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-3 px-6 rounded-lg transition-colors items-center gap-2 min-h-[44px]"
              >
                <Plus className="h-5 w-5" />
                Nova Venda
              </button>
            </div>
          </div>

          {/* Date Range Filter - Hidden on mobile unless showFilters is true */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
            <DateRangeFilter selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="mb-6">
          <MetricsCards metrics={metrics} isLoading={metricsLoading} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
        <div className="mb-6">
          <RecentSalesList sales={recentSales} isLoading={salesLoading} onAddSale={handleAddSale} />
        </div>
      </div>

      {/* Floating Action Button with Menu (Mobile Only) - Above BottomNav */}
      {!isNewSaleOpen && (
        <>
          {/* Backdrop */}
          {isFabOpen && (
            <div
              className="fixed inset-0 bg-black/20 sm:hidden z-[59]"
              onClick={() => setIsFabOpen(false)}
            />
          )}

          <div className="fixed bottom-20 sm:hidden z-[60]" style={{ left: '95%', transform: 'translateX(-100%)' }}>
            {/* Action Buttons */}
            <div className="flex flex-col items-end gap-3 mb-3">
            {/* View Sales Button */}
            <a
              href="/sales"
              className={`flex items-center gap-3 bg-[#A1887F] text-[#E0DCD1] px-4 py-3 rounded-full shadow-lg transition-all ${
                isFabOpen
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-20 pointer-events-none'
              }`}
              style={{
                transitionDuration: '300ms',
                transitionDelay: isFabOpen ? '100ms' : '0ms',
              }}
            >
              <span className="font-medium whitespace-nowrap">Ver Vendas</span>
              <div className="bg-[#C49A9A] p-2 rounded-full">
                <Eye className="h-5 w-5 text-[#202020]" />
              </div>
            </a>

            {/* New Sale Button */}
            <button
              onClick={() => {
                setIsFabOpen(false)
                handleAddSale()
              }}
              className={`flex items-center gap-3 bg-[#A1887F] text-[#E0DCD1] px-4 py-3 rounded-full shadow-lg transition-all ${
                isFabOpen
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-20 pointer-events-none'
              }`}
              style={{
                transitionDuration: '300ms',
                transitionDelay: isFabOpen ? '50ms' : '0ms',
              }}
            >
              <span className="font-medium whitespace-nowrap">Nova Venda</span>
              <div className="bg-[#C49A9A] p-2 rounded-full">
                <ShoppingBag className="h-5 w-5 text-[#202020]" />
              </div>
            </button>
          </div>

          {/* Main FAB Button */}
          <button
            onClick={() => setIsFabOpen(!isFabOpen)}
            className={`bg-[#C49A9A] hover:bg-[#B38989] text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 ${
              isFabOpen ? 'rotate-45' : 'rotate-0'
            }`}
            aria-label="Menu de ações"
          >
            <Plus className="h-6 w-6" />
          </button>
          </div>
        </>
      )}

      {/* New Sale Wizard */}
      <NewSaleWizard open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen} />
    </MainLayout>
  )
}
