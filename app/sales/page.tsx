'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { getRecentSales, deleteSale } from '@/lib/services/salesService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Loader2,
  ShoppingBag,
  User,
  CreditCard,
  Calendar,
  Package,
  Trash2,
  DollarSign,
} from 'lucide-react'
import Link from 'next/link'
import type { Sale } from '@/lib/services/salesService'

export default function SalesPage() {
  const queryClient = useQueryClient()
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Fetch recent sales
  const { data: sales, isLoading } = useQuery({
    queryKey: ['recent-sales'],
    queryFn: () => getRecentSales(50),
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-sales'] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      toast.success('Venda deletada e estoque devolvido!')
      setIsDetailOpen(false)
      setSelectedSale(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao deletar venda')
    },
  })

  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale)
    setIsDetailOpen(true)
  }

  const handleDelete = async (sale: Sale) => {
    if (
      confirm(
        `Tem certeza que deseja deletar esta venda? O estoque será devolvido.`
      )
    ) {
      await deleteMutation.mutateAsync(sale.id)
    }
  }

  const formatPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
      pix: 'PIX',
      cash: 'Dinheiro',
      installment: 'Parcelado',
    }
    return methods[method] || method
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-[#C49A9A]" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 pb-8">
        {/* Header */}
        <div className="pt-4 pb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[#E0DCD1]/70 hover:text-[#E0DCD1] transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-[#E0DCD1]">Vendas Recentes</h1>
          <p className="text-[#E0DCD1]/70 mt-2">
            Visualize e gerencie as últimas vendas
          </p>
        </div>

        {/* Sales List */}
        {sales && sales.length > 0 ? (
          <div className="space-y-4">
            {sales.map((sale) => (
              <Card
                key={sale.id}
                className="bg-[#A1887F] border-none hover:bg-[#8D7A6F] transition-colors cursor-pointer"
                onClick={() => handleViewDetails(sale)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Customer */}
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#C49A9A]" />
                        <span className="font-semibold text-[#E0DCD1]">
                          {sale.customer?.full_name || 'Cliente não informado'}
                        </span>
                      </div>

                      {/* Total */}
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#C49A9A]" />
                        <span className="text-2xl font-bold text-[#E0DCD1]">
                          R$ {sale.total_amount.toFixed(2)}
                        </span>
                        {sale.discount_amount && sale.discount_amount > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            -{sale.discount_amount.toFixed(2)}
                          </Badge>
                        )}
                      </div>

                      {/* Payment & Date */}
                      <div className="flex items-center gap-4 text-sm text-[#E0DCD1]/70">
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          <span>{formatPaymentMethod(sale.payment_method)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(sale.created_at)}</span>
                        </div>
                      </div>

                      {/* Items Count */}
                      {sale.sale_items && (
                        <div className="flex items-center gap-1 text-sm text-[#E0DCD1]/70">
                          <Package className="h-3 w-3" />
                          <span>
                            {sale.sale_items.length}{' '}
                            {sale.sale_items.length === 1 ? 'item' : 'itens'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <Badge
                      variant={sale.status === 'completed' ? 'default' : 'secondary'}
                      className="ml-4"
                    >
                      {sale.status === 'completed' ? 'Concluída' : sale.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-[#A1887F] border-none">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-12 w-12 text-[#E0DCD1]/50" />
              <h3 className="mt-4 text-lg font-semibold text-[#E0DCD1]">
                Nenhuma venda encontrada
              </h3>
              <p className="mt-2 text-sm text-[#E0DCD1]/70">
                As vendas aparecerão aqui
              </p>
            </CardContent>
          </Card>
        )}

        {/* Sale Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#A1887F] text-[#E0DCD1]">
            <DialogHeader>
              <DialogTitle>Detalhes da Venda</DialogTitle>
              <DialogDescription className="text-[#E0DCD1]/70">
                Informações completas da venda
              </DialogDescription>
            </DialogHeader>

            {selectedSale && (
              <div className="space-y-6">
                {/* Customer */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Cliente
                  </h4>
                  <p className="text-[#E0DCD1]/90">
                    {selectedSale.customer?.full_name || 'Não informado'}
                  </p>
                  {selectedSale.customer?.email && (
                    <p className="text-sm text-[#E0DCD1]/70">
                      {selectedSale.customer.email}
                    </p>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Itens da Venda
                  </h4>
                  <div className="space-y-2">
                    {selectedSale.sale_items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-[#8D7A6F] p-3 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-[#E0DCD1]/70">
                            Qtd: {item.quantity} × R$ {item.unit_price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-semibold">
                          R$ {(item.quantity * item.unit_price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Pagamento
                  </h4>
                  <div className="space-y-1 text-[#E0DCD1]/90">
                    <p>Método: {formatPaymentMethod(selectedSale.payment_method)}</p>
                    {selectedSale.installment_count && (
                      <p>Parcelas: {selectedSale.installment_count}x</p>
                    )}
                    {selectedSale.actual_amount_received &&
                      selectedSale.actual_amount_received !== selectedSale.total_amount && (
                        <p>
                          Valor recebido: R${' '}
                          {selectedSale.actual_amount_received.toFixed(2)}
                        </p>
                      )}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-[#E0DCD1]/20 pt-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-[#C49A9A]">
                      R$ {selectedSale.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="text-sm text-[#E0DCD1]/70">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {formatDate(selectedSale.created_at)}
                </div>

                {/* Notes */}
                {selectedSale.notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Observações</h4>
                    <p className="text-[#E0DCD1]/90">{selectedSale.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailOpen(false)}
                    className="flex-1"
                  >
                    Fechar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedSale)}
                    disabled={deleteMutation.isPending}
                    className="flex-1"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deletando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar Venda
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
