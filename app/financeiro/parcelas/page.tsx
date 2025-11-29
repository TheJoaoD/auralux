'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getPendingInstallments,
  getInstallmentsSummary,
  type Installment,
  type InstallmentFilters as IFilters,
} from '@/lib/services/installmentService'
import {
  InstallmentTable,
  InstallmentFilters,
  InstallmentSummaryCards,
  PayInstallmentDialog,
} from '@/components/financeiro'
import { toast } from 'sonner'
import { CreditCard, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ParcelasPage() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<IFilters>({})
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    data: installments,
    isLoading: isLoadingInstallments,
    error: installmentsError,
  } = useQuery({
    queryKey: ['installments', filters],
    queryFn: () => getPendingInstallments(filters),
  })

  const {
    data: summary,
    isLoading: isLoadingSummary,
  } = useQuery({
    queryKey: ['installments-summary'],
    queryFn: getInstallmentsSummary,
  })

  const handlePayClick = (installment: Installment) => {
    setSelectedInstallment(installment)
    setDialogOpen(true)
  }

  const handlePaySuccess = () => {
    toast.success('Pagamento registrado com sucesso!')
    queryClient.invalidateQueries({ queryKey: ['installments'] })
    queryClient.invalidateQueries({ queryKey: ['installments-summary'] })
    queryClient.invalidateQueries({ queryKey: ['cash-flow'] })
  }

  if (installmentsError) {
    return (
      <div className="min-h-screen bg-[#F7F5F2] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">Erro ao carregar parcelas</p>
            <p className="text-sm text-red-500 mt-1">
              {installmentsError instanceof Error ? installmentsError.message : 'Tente novamente'}
            </p>
            <Button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['installments'] })}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white"
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      {/* Header */}
      <div className="bg-white border-b border-[#A1887F]/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="text-[#A1887F] hover:text-[#C49A9A]">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C49A9A]/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-[#C49A9A]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#202020]">Gestão de Parcelas</h1>
                  <p className="text-sm text-[#A1887F]">Controle de recebíveis parcelados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Summary Cards */}
        <InstallmentSummaryCards summary={summary} isLoading={isLoadingSummary} />

        {/* Filters */}
        <InstallmentFilters filters={filters} onFiltersChange={setFilters} />

        {/* Table */}
        <InstallmentTable
          installments={installments || []}
          onPayClick={handlePayClick}
          isLoading={isLoadingInstallments}
        />
      </div>

      {/* Pay Dialog */}
      <PayInstallmentDialog
        installment={selectedInstallment}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handlePaySuccess}
      />
    </div>
  )
}
