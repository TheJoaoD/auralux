'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatters'
import type { ChartDataPoint } from '@/lib/services/salesService'

interface SalesChartProps {
  data: ChartDataPoint[] | undefined
  isLoading: boolean
}

export function SalesChart({ data, isLoading }: SalesChartProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#A1887F] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#E0DCD1] mb-4">
          Vendas nos Últimos 30 Dias
        </h3>
        <div className="w-full h-[300px] md:h-[400px] bg-[#E0DCD1]/10 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#E0DCD1]/20 rounded-full mx-auto mb-3" />
            <div className="h-4 bg-[#E0DCD1]/20 rounded w-32 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#A1887F] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#E0DCD1] mb-4">
          Vendas nos Últimos 30 Dias
        </h3>
        <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-[#E0DCD1]/10 rounded-full">
                <Package className="h-12 w-12 text-[#E0DCD1]/50" />
              </div>
            </div>
            <p className="text-[#E0DCD1] font-medium">Nenhuma venda registrada ainda</p>
            <p className="text-[#E0DCD1]/60 text-sm mt-2">
              Os dados aparecerão aqui quando você realizar vendas
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#F7F5F2] border border-[#A1887F]/20 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-[#202020] mb-2">
            {payload[0].payload.date}
          </p>
          <p className="text-sm text-[#C49A9A]">
            Vendas: <span className="font-semibold">{payload[0].value}</span>
          </p>
          <p className="text-sm text-[#A1887F]">
            Receita: <span className="font-semibold">{formatCurrency(payload[1].value)}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-[#A1887F] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-[#E0DCD1] mb-4">
        Vendas nos Últimos 30 Dias
      </h3>
      <ResponsiveContainer width="100%" height={300} className="md:h-[400px]">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0DCD1" opacity={0.1} />
          <XAxis
            dataKey="date"
            stroke="#E0DCD1"
            tick={{ fill: '#E0DCD1', fontSize: 12 }}
            tickLine={{ stroke: '#E0DCD1' }}
          />
          <YAxis
            yAxisId="left"
            stroke="#C49A9A"
            tick={{ fill: '#E0DCD1', fontSize: 12 }}
            tickLine={{ stroke: '#C49A9A' }}
            label={{
              value: 'Vendas',
              angle: -90,
              position: 'insideLeft',
              fill: '#E0DCD1',
              fontSize: 12,
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#A1887F"
            tick={{ fill: '#E0DCD1', fontSize: 12 }}
            tickLine={{ stroke: '#A1887F' }}
            tickFormatter={(value) => `R$ ${value}`}
            label={{
              value: 'Receita',
              angle: 90,
              position: 'insideRight',
              fill: '#E0DCD1',
              fontSize: 12,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
            formatter={(value) => (
              <span className="text-[#E0DCD1] text-sm">{value}</span>
            )}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="sales"
            stroke="#C49A9A"
            strokeWidth={2}
            dot={{ fill: '#C49A9A', r: 4 }}
            activeDot={{ r: 6 }}
            name="Vendas"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#E0DCD1"
            strokeWidth={2}
            dot={{ fill: '#E0DCD1', r: 4 }}
            activeDot={{ r: 6 }}
            name="Receita (R$)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
