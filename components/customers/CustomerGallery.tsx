'use client'

import { useQuery } from '@tanstack/react-query'
import { getCustomers, searchCustomers } from '@/lib/services/customerService'
import { CustomerCard } from './CustomerCard'
import { Users, UserPlus, Loader2 } from 'lucide-react'
import type { Customer } from '@/types'

interface CustomerGalleryProps {
  searchQuery?: string
  currentPage: number
  pageSize: number
  onCustomerClick?: (customer: Customer) => void
  onAddCustomer?: () => void
}

export function CustomerGallery({
  searchQuery,
  currentPage,
  pageSize,
  onCustomerClick,
  onAddCustomer,
}: CustomerGalleryProps) {
  const { data: paginatedCustomers, isLoading, error } = useQuery({
    queryKey: ['customers', searchQuery, currentPage, pageSize],
    queryFn: () =>
      searchQuery
        ? searchCustomers(searchQuery, { page: currentPage, pageSize })
        : getCustomers({ page: currentPage, pageSize }),
    staleTime: 60000, // 1 minute
  })

  const customers = paginatedCustomers?.data || []

  // Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#A1887F]/50 rounded-xl p-5 h-[120px] animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#C49A9A]/30" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-[#E0DCD1]/20 rounded w-3/4" />
                <div className="h-4 bg-[#E0DCD1]/20 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-[#A1887F] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Users className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-[#E0DCD1] mb-2">
            Erro ao carregar clientes
          </h3>
          <p className="text-[#E0DCD1]/70 text-sm mb-4">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  // Empty State (no customers)
  if (!customers || customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-[#A1887F] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#C49A9A] rounded-full">
              <Users className="h-12 w-12 text-[#202020]" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#E0DCD1] mb-3">
            {searchQuery
              ? 'Nenhum cliente encontrado'
              : 'Nenhum cliente cadastrado'}
          </h2>

          <p className="text-[#E0DCD1]/70 mb-6">
            {searchQuery
              ? 'Tente buscar com outros termos ou limpe a busca'
              : 'Adicione seu primeiro cliente para começar'}
          </p>

          {!searchQuery && onAddCustomer && (
            <button
              onClick={onAddCustomer}
              className="w-full bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Cadastrar Primeiro Cliente
            </button>
          )}
        </div>
      </div>
    )
  }

  // Customer Gallery Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onClick={onCustomerClick}
        />
      ))}
    </div>
  )
}
