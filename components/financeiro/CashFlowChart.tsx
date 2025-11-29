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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GroupedCashFlow } from '@/lib/services/cashFlowService'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TrendingUp, Loader2 } from 'lucide-react'

interface CashFlowChartProps {
  data?: GroupedCashFlow[]
  isLoading?: boolean
}

export function CashFlowChart({ data, isLoading }: CashFlowChartProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value)

  if (isLoading) {
    return (
      <Card className="bg-white border-[#A1887F]/20">
        <CardHeader className="flex flex-row items-center gap-2 border-b border-[#A1887F]/10">
          <TrendingUp className="h-5 w-5 text-[#C49A9A]" />
          <CardTitle className="text-lg font-semibold text-[#202020]">
            Evolução do Caixa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center text-[#A1887F]">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Carregando gráfico...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData =
    data?.map(item => ({
      ...item,
      date: format(new Date(item.period), 'dd/MM', { locale: ptBR }),
      fullDate: format(new Date(item.period), "dd 'de' MMMM", { locale: ptBR }),
    })) || []

  if (chartData.length === 0) {
    return (
      <Card className="bg-white border-[#A1887F]/20">
        <CardHeader className="flex flex-row items-center gap-2 border-b border-[#A1887F]/10">
          <TrendingUp className="h-5 w-5 text-[#C49A9A]" />
          <CardTitle className="text-lg font-semibold text-[#202020]">
            Evolução do Caixa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-[#A1887F]">Nenhum dado disponível para o período</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-[#A1887F]/20">
      <CardHeader className="flex flex-row items-center gap-2 border-b border-[#A1887F]/10">
        <TrendingUp className="h-5 w-5 text-[#C49A9A]" />
        <CardTitle className="text-lg font-semibold text-[#202020]">
          Evolução do Caixa (Últimos 30 dias)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#A1887F30" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#A1887F' }}
              tickLine={{ stroke: '#A1887F' }}
              axisLine={{ stroke: '#A1887F30' }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: '#A1887F' }}
              tickLine={{ stroke: '#A1887F' }}
              axisLine={{ stroke: '#A1887F30' }}
              width={80}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === 'income' ? 'Entradas' : 'Saídas',
              ]}
              labelFormatter={(_, payload) => {
                if (payload && payload[0]) {
                  return `Data: ${payload[0].payload.fullDate}`
                }
                return ''
              }}
              contentStyle={{
                backgroundColor: '#F7F5F2',
                border: '1px solid #A1887F40',
                borderRadius: '8px',
              }}
            />
            <Legend
              formatter={(value: string) => (value === 'income' ? 'Entradas' : 'Saídas')}
            />
            <Line
              type="monotone"
              dataKey="income"
              name="income"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 3, fill: '#22c55e' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="expense"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 3, fill: '#ef4444' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
