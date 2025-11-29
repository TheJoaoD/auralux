/**
 * Filter Bar Component
 * Premium mobile-first filter bar
 * Based on front-end-spec-catalogo.md
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategories } from '@/lib/hooks/use-catalog'
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  totalProducts?: number
  onOpenFilters?: () => void
}

export function FilterBar({ totalProducts, onOpenFilters }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: categories } = useCategories()

  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('categoria') || 'all'
  )

  const debouncedSearch = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedSearch && debouncedSearch.trim().length >= 2) {
      params.set('q', debouncedSearch)
    } else {
      params.delete('q')
    }

    router.push(`/catalogo/produtos?${params.toString()}`)
  }, [debouncedSearch, router, searchParams])

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    const params = new URLSearchParams(searchParams.toString())

    if (value === 'all') {
      params.delete('categoria')
    } else {
      params.set('categoria', value)
    }

    router.push(`/catalogo/produtos?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setSearchInput('')
    setSelectedCategory('all')
    router.push('/catalogo/produtos')
  }

  const hasActiveFilters =
    searchParams.get('q') || searchParams.get('categoria')

  return (
    <div className="space-y-3">
      {/* Search and Filter Row */}
      <div className="flex gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar produtos..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Button - Mobile */}
        {onOpenFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenFilters}
            className="h-11 w-11 shrink-0 md:hidden rounded-xl border-0 bg-muted/50"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        )}

        {/* Category Dropdown - Desktop */}
        <div className="hidden md:block">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[200px] h-11 bg-muted/50 border-0 rounded-xl">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count and Clear */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalProducts !== undefined && (
            <>
              <span className="font-medium text-foreground">{totalProducts}</span>{' '}
              {totalProducts === 1 ? 'produto' : 'produtos'}
            </>
          )}
        </p>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  )
}
