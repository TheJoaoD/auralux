'use client'

import { TrendingUp, Calendar, BarChart, DollarSign, Receipt, Percent } from 'lucide-react'
import { MetricCard } from './MetricCard'
import { formatCurrency } from '@/lib/utils/formatters'
import type { SalesMetrics } from '@/lib/services/salesService'

interface MetricsCardsProps {
  metrics: SalesMetrics | undefined
  isLoading: boolean
}

export function MetricsCards({ metrics, isLoading }: MetricsCardsProps) {
  // Loading state
  if (isLoading) {
    return (
      <>
        {/* Primary Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#A1887F]/50 rounded-xl p-5 animate-pulse"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E0DCD1]/20" />
                <div className="space-y-2 w-full">
                  <div className="h-8 bg-[#E0DCD1]/20 rounded w-2/3 mx-auto" />
                  <div className="h-4 bg-[#E0DCD1]/20 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-[#A1887F]/50 rounded-xl p-5 animate-pulse"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E0DCD1]/20" />
                <div className="space-y-2 w-full">
                  <div className="h-8 bg-[#E0DCD1]/20 rounded w-2/3 mx-auto" />
                  <div className="h-4 bg-[#E0DCD1]/20 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  if (!metrics) return null

  const discountPercentage =
    metrics.totalRevenue > 0 ? (metrics.totalDiscount / metrics.totalRevenue) * 100 : 0

  return (
    <>
      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Sales */}
        <MetricCard
          icon={TrendingUp}
          value={metrics.dailySales}
          subtitle="vendas realizadas hoje"
        />

        {/* Weekly Sales */}
        <MetricCard
          icon={Calendar}
          value={metrics.weeklySales}
          subtitle="vendas nos últimos 7 dias"
        />

        {/* Monthly Sales */}
        <MetricCard
          icon={BarChart}
          value={metrics.monthlySales}
          subtitle="vendas este mês"
        />

        {/* Total Revenue */}
        <div className="bg-[#A1887F] rounded-xl p-5 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#C49A9A' }}
            >
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#E0DCD1]">
                {formatCurrency(metrics.totalRevenue)}
              </p>
              <p className="text-xs text-[#E0DCD1]/60 mt-1">
                Recebido: {formatCurrency(metrics.actualRevenue)}
              </p>
              <p className="text-sm text-[#E0DCD1]/70 mt-1">Receita Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Average Sale Value */}
        <MetricCard
          icon={Receipt}
          value={formatCurrency(metrics.avgSaleValue)}
          subtitle="valor médio por venda"
        />

        {/* Total Discount */}
        <div className="bg-[#A1887F] rounded-xl p-5 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                metrics.totalDiscount > 0 ? 'bg-amber-500' : 'bg-[#C49A9A]'
              }`}
            >
              <Percent className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#E0DCD1]">
                {formatCurrency(metrics.totalDiscount)}
              </p>
              <p className="text-xs text-[#E0DCD1]/60 mt-1">
                {discountPercentage.toFixed(1)}% do total
              </p>
              <p className="text-sm text-[#E0DCD1]/70 mt-1">
                Desconto em Parcelamentos
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
