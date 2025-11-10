/**
 * Filter Bar Component
 * Epic 2 - Story 2.3: Listagem de Produtos com Filtros
 *
 * Sticky filter bar with category dropdown and search input
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
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

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: categories } = useCategories()

  // Local state for immediate UI updates
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('categoria') || 'all'
  )

  // Debounced search value
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  // Update URL when debounced search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedSearch && debouncedSearch.trim().length >= 2) {
      params.set('q', debouncedSearch)
    } else {
      params.delete('q')
    }

    router.push(`/catalogo/produtos?${params.toString()}`)
  }, [debouncedSearch, router, searchParams])

  // Handle category change
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

  // Clear all filters
  const handleClearFilters = () => {
    setSearchInput('')
    setSelectedCategory('all')
    router.push('/catalogo/produtos')
  }

  // Check if any filters are active
  const hasActiveFilters =
    searchParams.get('q') || searchParams.get('categoria')

  return (
    <div className="sticky top-0 z-10 bg-white border-b shadow-sm py-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar produtos..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Dropdown */}
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-[250px]">
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

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
