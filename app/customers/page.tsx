'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { CustomerGallery } from '@/components/customers/CustomerGallery'
import { AddCustomerModal } from '@/components/customers/AddCustomerModal'
import { CustomerDetailModal } from '@/components/customers/customer-detail-modal'
import { SimplePagination } from '@/components/ui/simple-pagination'
import { getCustomers, searchCustomers } from '@/lib/services/customerService'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { Users, UserPlus, Search, X } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'
import type { Customer } from '@/types'

export default function CustomersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const supabase = createClient()

  // Reset page to 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchQuery])

  // Fetch paginated customers
  const { data: paginatedCustomers } = useQuery({
    queryKey: ['customers', debouncedSearchQuery, currentPage, pageSize],
    queryFn: () =>
      debouncedSearchQuery
        ? searchCustomers(debouncedSearchQuery, { page: currentPage, pageSize })
        : getCustomers({ page: currentPage, pageSize }),
    staleTime: 60000,
  })

  const totalCustomers = paginatedCustomers?.total || 0

  // Real-time updates with Supabase
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('customers-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'customers',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Customer change detected:', payload)
          // Invalidate and refetch customers query
          queryClient.invalidateQueries({ queryKey: ['customers'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase, queryClient])

  const handleCustomerClick = useCallback((customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailModalOpen(true)
  }, [])

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto px-4 pb-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 pb-6">
          <h1 className="text-2xl font-bold text-[#E0DCD1]">
            Clientes
          </h1>

          {/* Add Customer Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px]"
          >
            <UserPlus className="h-5 w-5" />
            Novo Cliente
          </button>
        </div>

        {/* Metrics Card */}
        {totalCustomers > 0 && (
          <div className="bg-[#A1887F] rounded-xl p-5 shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#C49A9A] flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-[#202020]" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#E0DCD1]">
                  {totalCustomers}
                </p>
                <p className="text-sm text-[#E0DCD1]/70">
                  {totalCustomers === 1 ? 'Cliente cadastrado' : 'Clientes cadastrados'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {totalCustomers > 0 && (
          <div className="relative mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A1887F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome ou WhatsApp..."
                className="w-full pl-12 pr-12 py-3 bg-[#F7F5F2] border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1887F] hover:text-[#C49A9A] transition-colors"
                  aria-label="Limpar busca"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Customer Gallery */}
        <div className="mb-6">
          <CustomerGallery
            searchQuery={debouncedSearchQuery}
            currentPage={currentPage}
            pageSize={pageSize}
            onCustomerClick={handleCustomerClick}
            onAddCustomer={() => setIsAddModalOpen(true)}
          />
        </div>

        {/* Pagination */}
        {paginatedCustomers && paginatedCustomers.totalPages > 1 && (
          <div className="mb-6">
            <SimplePagination
              currentPage={paginatedCustomers.page}
              totalPages={paginatedCustomers.totalPages}
              onPageChange={setCurrentPage}
              hasNextPage={paginatedCustomers.hasNextPage}
              hasPreviousPage={paginatedCustomers.hasPreviousPage}
              totalItems={paginatedCustomers.total}
            />
          </div>
        )}

        {/* Add Customer Modal */}
        <AddCustomerModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
        />

        {/* Customer Detail Modal */}
        <CustomerDetailModal
          customer={selectedCustomer}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        />
      </div>
    </MainLayout>
  )
}
