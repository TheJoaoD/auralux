'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { formatCurrency } from '@/lib/utils/formatters'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { payInstallment, type Installment } from '@/lib/services/installmentService'
import { Loader2, DollarSign, Smartphone, Banknote, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface PayInstallmentDialogProps {
  installment: Installment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PayInstallmentDialog({
  installment,
  open,
  onOpenChange,
  onSuccess,
}: PayInstallmentDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cash'>('pix')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const remaining = installment
    ? installment.amount - (installment.paid_amount || 0)
    : 0

  // Reset form when dialog opens
  useEffect(() => {
    if (open && installment) {
      setAmount(remaining.toFixed(2))
      setPaymentMethod('pix')
      setNotes('')
      setError('')
    }
  }, [open, installment, remaining])

  const handleAmountChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.')
    setAmount(cleaned)

    const num = parseFloat(cleaned)
    if (num > remaining) {
      setError(`Valor máximo: ${formatCurrency(remaining)}`)
    } else if (num <= 0 || isNaN(num)) {
      setError('Valor deve ser maior que zero')
    } else {
      setError('')
    }
  }

  const handleSubmit = async () => {
    if (!installment) return

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Informe um valor válido')
      return
    }

    if (amountNum > remaining) {
      setError(`Valor máximo: ${formatCurrency(remaining)}`)
      return
    }

    setIsLoading(true)
    try {
      await payInstallment({
        installmentId: installment.id,
        amount: amountNum,
        paymentMethod,
        notes: notes || undefined,
      })

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error('Erro ao dar baixa:', err)
      toast.error(err instanceof Error ? err.message : 'Erro ao processar pagamento')
    } finally {
      setIsLoading(false)
    }
  }

  const isFullPayment = parseFloat(amount) >= remaining

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#F7F5F2] border-[#A1887F]/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#202020]">
            Dar Baixa na Parcela
          </DialogTitle>
        </DialogHeader>

        {installment && (
          <div className="space-y-6 py-4">
            {/* Installment Info */}
            <div className="bg-[#A1887F] rounded-lg p-4 text-[#E0DCD1]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-70">
                  {installment.customer?.full_name || 'Cliente'}
                </span>
                <span className="text-sm opacity-70">
                  {installment.installment_number}ª parcela
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-sm opacity-70">Valor total</p>
                  <p className="text-xl font-bold">{formatCurrency(installment.amount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-70">Restante</p>
                  <p className="text-xl font-bold text-[#C49A9A]">{formatCurrency(remaining)}</p>
                </div>
              </div>
              <p className="text-xs mt-2 opacity-70">
                Vencimento: {format(new Date(installment.due_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>

            {/* Payment Form */}
            <div className="space-y-4">
              {/* Amount */}
              <div>
                <Label htmlFor="pay-amount" className="text-[#A1887F] text-sm font-medium">
                  Valor a Pagar
                </Label>
                <div className="relative mt-1.5">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A1887F]" />
                  <Input
                    id="pay-amount"
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={e => handleAmountChange(e.target.value)}
                    className="pl-10 border-[#A1887F]/30 focus:ring-[#C49A9A] text-lg"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                {isFullPayment && !error && (
                  <p className="text-sm text-green-600 mt-1.5">
                    Pagamento integral - parcela será marcada como paga
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <Label className="text-[#A1887F] text-sm font-medium mb-1.5 block">
                  Método de Pagamento
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`
                      p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all
                      ${paymentMethod === 'pix'
                        ? 'border-[#C49A9A] bg-[#C49A9A]/10'
                        : 'border-[#A1887F]/30 hover:border-[#A1887F]/50'
                      }
                    `}
                  >
                    <Smartphone className={`h-6 w-6 ${paymentMethod === 'pix' ? 'text-[#C49A9A]' : 'text-[#A1887F]'}`} />
                    <span className={`text-sm font-medium ${paymentMethod === 'pix' ? 'text-[#C49A9A]' : 'text-[#A1887F]'}`}>
                      PIX
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`
                      p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all
                      ${paymentMethod === 'cash'
                        ? 'border-[#C49A9A] bg-[#C49A9A]/10'
                        : 'border-[#A1887F]/30 hover:border-[#A1887F]/50'
                      }
                    `}
                  >
                    <Banknote className={`h-6 w-6 ${paymentMethod === 'cash' ? 'text-[#C49A9A]' : 'text-[#A1887F]'}`} />
                    <span className={`text-sm font-medium ${paymentMethod === 'cash' ? 'text-[#C49A9A]' : 'text-[#A1887F]'}`}>
                      Dinheiro
                    </span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="pay-notes" className="text-[#A1887F] text-sm font-medium">
                  Observações (opcional)
                </Label>
                <Input
                  id="pay-notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ex: Pagamento via PIX do banco X"
                  className="mt-1.5 border-[#A1887F]/30 focus:ring-[#C49A9A]"
                />
              </div>
            </div>

            {/* Payment History */}
            {(installment.paid_amount || 0) > 0 && (
              <div className="pt-4 border-t border-[#A1887F]/20">
                <p className="text-sm font-medium text-[#A1887F] mb-2">Pagamentos anteriores</p>
                <div className="bg-[#F7F5F2] border border-[#A1887F]/20 rounded p-3">
                  <p className="text-sm text-[#202020]">
                    Total pago: <span className="font-semibold">{formatCurrency(installment.paid_amount || 0)}</span>
                  </p>
                  {installment.payment_method && (
                    <p className="text-xs text-[#A1887F] mt-1">
                      Último pagamento: {installment.payment_method.toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-[#A1887F] text-[#A1887F] hover:bg-[#A1887F]/10"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !!error || !amount}
            className="bg-[#C49A9A] hover:bg-[#B38989] text-[#202020]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              'Confirmar Pagamento'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
