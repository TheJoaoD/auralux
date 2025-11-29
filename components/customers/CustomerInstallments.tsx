'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils/formatters'
import {
  getInstallmentsByCustomer,
  type Installment
} from '@/lib/services/installmentService'
import { PayInstallmentDialog } from '@/components/financeiro/PayInstallmentDialog'
import { toast } from 'sonner'
import { CreditCard, Loader2, Calendar } from 'lucide-react'

interface CustomerInstallmentsProps {
  customerId: string
}

export function CustomerInstallments({ customerId }: CustomerInstallmentsProps) {
  const queryClient = useQueryClient()
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: installments, isLoading } = useQuery({
    queryKey: ['customer-installments', customerId],
    queryFn: () => getInstallmentsByCustomer(customerId)
  })

  const pendingInstallments = installments?.filter(
    i => ['pending', 'partial', 'overdue'].includes(i.status)
  ) || []

  const paidInstallments = installments?.filter(
    i => i.status === 'paid'
  ) || []

  const getStatusBadge = (installment: Installment) => {
    const dueDate = new Date(installment.due_date)

    if (installment.status === 'paid') {
      return <Badge className="bg-green-100 text-green-800">Paga</Badge>
    }
    if (installment.status === 'overdue' || isPast(dueDate)) {
      return <Badge className="bg-red-100 text-red-800">Vencida</Badge>
    }
    if (installment.status === 'partial') {
      return <Badge className="bg-amber-100 text-amber-800">Parcial</Badge>
    }
    return <Badge className="bg-blue-100 text-blue-800">Pendente</Badge>
  }

  const handlePayClick = (installment: Installment) => {
    setSelectedInstallment(installment)
    setDialogOpen(true)
  }

  const handlePaySuccess = () => {
    toast.success('Parcela paga com sucesso!')
    queryClient.invalidateQueries({ queryKey: ['customer-installments', customerId] })
    queryClient.invalidateQueries({ queryKey: ['customer', customerId] })
    queryClient.invalidateQueries({ queryKey: ['customers'] })
    queryClient.invalidateQueries({ queryKey: ['cash-flow-metrics'] })
    queryClient.invalidateQueries({ queryKey: ['installments'] })
  }

  if (isLoading) {
    return (
      <Card className="bg-white border-[#A1887F]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#202020]">
            <CreditCard className="h-5 w-5 text-[#C49A9A]" />
            Parcelas do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#A1887F]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderInstallmentList = (list: Installment[], showPayButton: boolean) => (
    <div className="space-y-2">
      {list.length === 0 ? (
        <div className="py-6 text-center text-[#A1887F]">
          <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p className="font-medium">Nenhuma parcela encontrada</p>
        </div>
      ) : (
        list.map(installment => {
          const remaining = installment.amount - (installment.paid_amount || 0)
          return (
            <div
              key={installment.id}
              className="flex items-center justify-between p-3 border border-[#A1887F]/20 rounded-lg hover:bg-[#F7F5F2]/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#202020]">
                  Parcela {installment.installment_number}
                </p>
                <p className="text-sm text-[#A1887F]">
                  <span className="font-semibold text-[#202020]">{formatCurrency(remaining)}</span>
                  {' '}&bull;{' '}
                  Vence: {format(new Date(installment.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>

              <div className="flex items-center gap-2 ml-2">
                {getStatusBadge(installment)}
                {showPayButton && installment.status !== 'paid' && (
                  <Button
                    size="sm"
                    onClick={() => handlePayClick(installment)}
                    className="bg-[#C49A9A] hover:bg-[#B38989] text-[#202020]"
                  >
                    Baixa
                  </Button>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )

  return (
    <>
      <Card className="bg-white border-[#A1887F]/20">
        <CardHeader className="border-b border-[#A1887F]/10">
          <CardTitle className="flex items-center gap-2 text-[#202020]">
            <CreditCard className="h-5 w-5 text-[#C49A9A]" />
            Parcelas do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-2 bg-[#F7F5F2]">
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-[#C49A9A] data-[state=active]:text-[#202020]"
              >
                Pendentes ({pendingInstallments.length})
              </TabsTrigger>
              <TabsTrigger
                value="paid"
                className="data-[state=active]:bg-[#C49A9A] data-[state=active]:text-[#202020]"
              >
                Pagas ({paidInstallments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              {renderInstallmentList(pendingInstallments, true)}
            </TabsContent>

            <TabsContent value="paid" className="mt-4">
              {renderInstallmentList(paidInstallments, false)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <PayInstallmentDialog
        installment={selectedInstallment}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handlePaySuccess}
      />
    </>
  )
}
