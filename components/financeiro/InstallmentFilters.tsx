'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import type { InstallmentFilters as IFilters, InstallmentStatus } from '@/lib/services/installmentService'

interface InstallmentFiltersProps {
  filters: IFilters
  onFiltersChange: (filters: IFilters) => void
}

export function InstallmentFilters({ filters, onFiltersChange }: InstallmentFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localCustomerSearch, setLocalCustomerSearch] = useState('')

  // Debounce customer search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localCustomerSearch !== (filters.customerId || '')) {
        // Note: This would require backend search by name, for now just track locally
        // In production, you'd pass this to a search endpoint
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [localCustomerSearch, filters.customerId])

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, status: undefined })
    } else if (value === 'pending_all') {
      onFiltersChange({ ...filters, status: ['pending', 'partial', 'overdue'] })
    } else {
      onFiltersChange({ ...filters, status: value as InstallmentStatus })
    }
  }

  const handleDateStartChange = (value: string) => {
    onFiltersChange({
      ...filters,
      dueDateStart: value ? new Date(value) : undefined,
    })
  }

  const handleDateEndChange = (value: string) => {
    onFiltersChange({
      ...filters,
      dueDateEnd: value ? new Date(value) : undefined,
    })
  }

  const handleClearFilters = () => {
    onFiltersChange({})
    setLocalCustomerSearch('')
  }

  const hasActiveFilters =
    filters.status !== undefined ||
    filters.dueDateStart !== undefined ||
    filters.dueDateEnd !== undefined ||
    filters.customerId !== undefined

  const getStatusValue = () => {
    if (!filters.status) return 'pending_all'
    if (Array.isArray(filters.status)) return 'pending_all'
    return filters.status
  }

  return (
    <div className="bg-white border border-[#A1887F]/20 rounded-lg p-4 space-y-4">
      {/* Mobile Toggle */}
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between border-[#A1887F]/30 text-[#A1887F]"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <span className="bg-[#C49A9A] text-white text-xs px-2 py-0.5 rounded-full">
                Ativos
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Filters Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <Label htmlFor="status" className="text-[#A1887F] text-sm font-medium mb-1.5 block">
              Status
            </Label>
            <Select value={getStatusValue()} onValueChange={handleStatusChange}>
              <SelectTrigger className="border-[#A1887F]/30 focus:ring-[#C49A9A]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending_all">Pendentes (Todas)</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="partial">Parcialmente Pagas</SelectItem>
                <SelectItem value="overdue">Vencidas</SelectItem>
                <SelectItem value="paid">Pagas</SelectItem>
                <SelectItem value="all">Todas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Start */}
          <div>
            <Label htmlFor="date-start" className="text-[#A1887F] text-sm font-medium mb-1.5 block">
              Vencimento De
            </Label>
            <Input
              id="date-start"
              type="date"
              value={filters.dueDateStart?.toISOString().split('T')[0] || ''}
              onChange={e => handleDateStartChange(e.target.value)}
              className="border-[#A1887F]/30 focus:ring-[#C49A9A]"
            />
          </div>

          {/* Date End */}
          <div>
            <Label htmlFor="date-end" className="text-[#A1887F] text-sm font-medium mb-1.5 block">
              Vencimento Até
            </Label>
            <Input
              id="date-end"
              type="date"
              value={filters.dueDateEnd?.toISOString().split('T')[0] || ''}
              onChange={e => handleDateEndChange(e.target.value)}
              className="border-[#A1887F]/30 focus:ring-[#C49A9A]"
            />
          </div>

          {/* Customer Search */}
          <div>
            <Label htmlFor="customer" className="text-[#A1887F] text-sm font-medium mb-1.5 block">
              Cliente
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1887F]" />
              <Input
                id="customer"
                type="text"
                placeholder="Buscar cliente..."
                value={localCustomerSearch}
                onChange={e => setLocalCustomerSearch(e.target.value)}
                className="pl-9 border-[#A1887F]/30 focus:ring-[#C49A9A]"
              />
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-[#A1887F]/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-[#A1887F] hover:text-[#C49A9A] hover:bg-[#C49A9A]/10"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
