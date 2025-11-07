"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Plus, User, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Customer {
  id: string
  name: string
}

const ITEMS_PER_PAGE = 5

interface CustomerSelectionStepProps {
  onSelectCustomer: (customer: { id: string; name: string }) => void
  onBack: () => void
}

export function CustomerSelectionStep({ onSelectCustomer, onBack }: CustomerSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isQuickSale, setIsQuickSale] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  // Fetch customers from Supabase
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('id, name')
          .order('name')

        if (error) throw error
        setCustomers(data || [])
      } catch (error) {
        console.error('Error fetching customers:', error)
        toast.error('Erro ao carregar clientes')
        setCustomers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = useMemo(
    () => customers.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm, customers],
  )

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE)
  const paginatedCustomers = useMemo(
    () => filteredCustomers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredCustomers, currentPage],
  )

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Select Customer</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    )
  }

  if (isQuickSale) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Quick Sale (Walk-in)</h2>
        <div className="p-6 rounded-lg bg-card border border-border space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <User size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Proceeding as</p>
              <p className="text-lg font-semibold text-foreground">Walk-in Customer</p>
            </div>
          </div>
          <div className="border-t border-border pt-4 space-y-2">
            <button
              onClick={() => onSelectCustomer({ id: "walkin", name: "Walk-in Customer" })}
              className="w-full py-3 px-4 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
            <button
              onClick={() => setIsQuickSale(false)}
              className="w-full py-3 px-4 rounded-lg border border-border text-foreground hover:bg-background transition-colors"
            >
              Back to Customers
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Select Customer</h2>
        <p className="text-muted-foreground">Choose a customer for this sale</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Customer List - Paginated */}
      <div className="space-y-2">
        {paginatedCustomers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum cliente encontrado</p>
            <p className="text-sm mt-2">Use "Walk-in Customer" para venda rápida</p>
          </div>
        ) : (
          paginatedCustomers.map((customer) => (
            <button
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
              className="w-full p-4 rounded-lg bg-card border border-border hover:border-accent transition-colors text-left"
            >
              <p className="font-medium text-card-foreground">{customer.name}</p>
            </button>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </button>
          <span className="text-sm font-medium text-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} className="text-foreground" />
          </button>
        </div>
      )}

      {/* Quick Sale Button */}
      <button
        onClick={() => setIsQuickSale(true)}
        className="w-full py-2.5 px-4 rounded-lg border border-dashed border-border text-foreground hover:border-accent transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Walk-in Customer (Quick Sale)
      </button>
    </div>
  )
}
