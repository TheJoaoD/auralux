'use client'

import { useQuery } from '@tanstack/react-query'
import { Phone, Mail, ShoppingBag, User, MapPin, Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatCurrency } from '@/lib/utils/formatters'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CustomerDebtSummary } from './CustomerDebtSummary'
import { CustomerInstallments } from './CustomerInstallments'
import { getInstallmentsByCustomer } from '@/lib/services/installmentService'
import type { Customer } from '@/types'

interface CustomerDetailModalProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerDetailModal({ customer, open, onOpenChange }: CustomerDetailModalProps) {
  // Fetch installments to check for overdue
  const { data: installments } = useQuery({
    queryKey: ['customer-installments', customer?.id],
    queryFn: () => customer ? getInstallmentsByCustomer(customer.id) : Promise.resolve([]),
    enabled: !!customer && open
  })

  const hasOverdue = installments?.some(
    i => i.status === 'overdue' ||
      (['pending', 'partial'].includes(i.status) && new Date(i.due_date) < new Date())
  ) || false

  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 bg-[#F7F5F2]">
        <DialogHeader className="px-6 pt-6 pb-4 bg-[#A1887F]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#C49A9A] flex items-center justify-center">
              <User className="h-7 w-7 text-[#202020]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-[#E0DCD1]">
                {customer.full_name}
              </DialogTitle>
              <p className="text-sm text-[#E0DCD1]/70">
                Cliente desde {format(new Date(customer.created_at), "MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Debt Summary */}
            <CustomerDebtSummary
              totalDue={customer.total_due || 0}
              hasOverdue={hasOverdue}
            />

            {/* Contact Info */}
            <div className="bg-white rounded-lg border border-[#A1887F]/20 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-[#A1887F] uppercase tracking-wider">
                Informacoes de Contato
              </h3>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#C49A9A]/10 rounded-lg">
                  <Phone className="h-4 w-4 text-[#C49A9A]" />
                </div>
                <div>
                  <p className="text-xs text-[#A1887F]">WhatsApp</p>
                  <p className="font-medium text-[#202020]">{customer.whatsapp}</p>
                </div>
              </div>

              {customer.email && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#C49A9A]/10 rounded-lg">
                    <Mail className="h-4 w-4 text-[#C49A9A]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#A1887F]">E-mail</p>
                    <p className="font-medium text-[#202020]">{customer.email}</p>
                  </div>
                </div>
              )}

              {customer.address && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#C49A9A]/10 rounded-lg">
                    <MapPin className="h-4 w-4 text-[#C49A9A]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#A1887F]">Endereco</p>
                    <p className="font-medium text-[#202020]">{customer.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg border border-[#A1887F]/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag className="h-4 w-4 text-[#C49A9A]" />
                  <p className="text-xs text-[#A1887F]">Total de Compras</p>
                </div>
                <p className="text-2xl font-bold text-[#202020]">
                  {customer.purchase_count}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-[#A1887F]/20 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-[#C49A9A]" />
                  <p className="text-xs text-[#A1887F]">Valor Total</p>
                </div>
                <p className="text-2xl font-bold text-[#C49A9A]">
                  {formatCurrency(customer.total_purchases)}
                </p>
              </div>
            </div>

            {/* Installments Section */}
            <CustomerInstallments customerId={customer.id} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
