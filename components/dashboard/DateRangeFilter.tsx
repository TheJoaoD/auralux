'use client'

interface DateRangeFilterProps {
  selectedPeriod: 'today' | 'week' | '30days' | 'month'
  onPeriodChange: (period: 'today' | 'week' | '30days' | 'month') => void
}

export function DateRangeFilter({ selectedPeriod, onPeriodChange }: DateRangeFilterProps) {
  const periods = [
    { value: 'today' as const, label: 'Hoje' },
    { value: 'week' as const, label: 'Últimos 7 Dias' },
    { value: '30days' as const, label: 'Últimos 30 Dias' },
    { value: 'month' as const, label: 'Este Mês' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onPeriodChange(period.value)}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm transition-all min-h-[44px]
            ${
              selectedPeriod === period.value
                ? 'bg-[#C49A9A] text-[#202020] shadow-md'
                : 'bg-transparent border-2 border-[#A1887F] text-[#E0DCD1] hover:bg-[#A1887F]/20'
            }
          `}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}
