/**
 * Filter Sheet Component
 * Bottom sheet with advanced filters for mobile
 * Based on front-end-spec-catalogo.md
 */

'use client'

import { useState, useEffect } from 'react'
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FilterSheetProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterValues) => void
  initialValues?: FilterValues
  totalResults?: number
}

export interface FilterValues {
  priceMin?: number
  priceMax?: number
  inStock?: boolean
  sortBy?: 'recent' | 'price_asc' | 'price_desc' | 'name'
}

const PRICE_MIN = 0
const PRICE_MAX = 2000

export function FilterSheet({
  isOpen,
  onClose,
  onApply,
  initialValues = {},
  totalResults,
}: FilterSheetProps) {
  const [filters, setFilters] = useState<FilterValues>(initialValues)
  const [priceRange, setPriceRange] = useState([
    initialValues.priceMin ?? PRICE_MIN,
    initialValues.priceMax ?? PRICE_MAX,
  ])

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setFilters(initialValues)
      setPriceRange([
        initialValues.priceMin ?? PRICE_MIN,
        initialValues.priceMax ?? PRICE_MAX,
      ])
    }
  }, [isOpen, initialValues])

  const handleReset = () => {
    setFilters({})
    setPriceRange([PRICE_MIN, PRICE_MAX])
  }

  const handleApply = () => {
    onApply({
      ...filters,
      priceMin: priceRange[0] > PRICE_MIN ? priceRange[0] : undefined,
      priceMax: priceRange[1] < PRICE_MAX ? priceRange[1] : undefined,
    })
    onClose()
  }

  const hasFilters =
    filters.inStock ||
    filters.sortBy ||
    priceRange[0] > PRICE_MIN ||
    priceRange[1] < PRICE_MAX

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 animate-[fade-in_200ms_ease-out]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-[70] bg-background rounded-t-3xl',
          'animate-[slide-up_250ms_ease-out]',
          'max-h-[85vh] overflow-hidden flex flex-col'
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Filtros</h2>
          </div>
          <div className="flex items-center gap-2">
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Faixa de Preço
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Mínimo
                  </label>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    min={PRICE_MIN}
                    max={priceRange[1]}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <span className="text-muted-foreground mt-5">—</span>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Máximo
                  </label>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    min={priceRange[0]}
                    max={PRICE_MAX}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                R$ {priceRange[0].toLocaleString('pt-BR')} - R${' '}
                {priceRange[1].toLocaleString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Stock Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Disponibilidade
            </h3>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={filters.inStock ?? false}
                onChange={(e) =>
                  setFilters({ ...filters, inStock: e.target.checked || undefined })
                }
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="flex-1">Apenas em estoque</span>
            </label>
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Ordenar por
            </h3>
            <div className="space-y-2">
              {[
                { value: 'recent', label: 'Mais recentes' },
                { value: 'price_asc', label: 'Menor preço' },
                { value: 'price_desc', label: 'Maior preço' },
                { value: 'name', label: 'Nome A-Z' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                    filters.sortBy === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  )}
                >
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        sortBy: e.target.value as FilterValues['sortBy'],
                      })
                    }
                    className="h-5 w-5 border-border text-primary focus:ring-primary"
                  />
                  <span className="flex-1">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-background">
          <Button onClick={handleApply} className="w-full h-12 text-base font-semibold">
            Aplicar Filtros
            {totalResults !== undefined && (
              <span className="ml-2 text-primary-foreground/80">
                ({totalResults} {totalResults === 1 ? 'item' : 'itens'})
              </span>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
