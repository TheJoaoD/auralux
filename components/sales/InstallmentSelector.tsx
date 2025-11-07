'use client'

interface InstallmentSelectorProps {
  selectedCount: number | null
  onSelect: (count: number) => void
}

const INSTALLMENT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export function InstallmentSelector({ selectedCount, onSelect }: InstallmentSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[#A1887F]">
        Número de Parcelas
      </label>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {INSTALLMENT_OPTIONS.map((count) => {
          const isSelected = selectedCount === count

          return (
            <button
              key={count}
              type="button"
              onClick={() => onSelect(count)}
              className={`
                h-10 rounded-lg font-semibold text-sm transition-all
                ${
                  isSelected
                    ? 'bg-[#C49A9A] text-white border-2 border-[#C49A9A]'
                    : 'bg-transparent border-2 border-[#A1887F]/30 text-[#A1887F] hover:bg-[#A1887F]/10'
                }
              `}
            >
              {count}x
            </button>
          )
        })}
      </div>
    </div>
  )
}
