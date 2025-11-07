'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils/formatters'
import { DollarSign, AlertCircle } from 'lucide-react'

interface ActualAmountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  saleTotal: number
  installmentCount: number
  onConfirm: (actualAmount: number) => void
}

export function ActualAmountModal({
  open,
  onOpenChange,
  saleTotal,
  installmentCount,
  onConfirm,
}: ActualAmountModalProps) {
  const [actualAmount, setActualAmount] = useState('')
  const [error, setError] = useState('')

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setActualAmount('')
      setError('')
    }
  }, [open])

  const actualAmountNum = parseFloat(actualAmount) || 0
  const discount = saleTotal - actualAmountNum
  const discountPercentage = saleTotal > 0 ? (discount / saleTotal) * 100 : 0

  const handleAmountChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.')
    setActualAmount(cleaned)

    const num = parseFloat(cleaned)
    if (num > saleTotal) {
      setError('Valor recebido não pode ser maior que o total')
    } else {
      setError('')
    }
  }

  const handleConfirm = () => {
    if (!actualAmount || actualAmountNum <= 0) {
      setError('Informe o valor recebido')
      return
    }

    if (actualAmountNum > saleTotal) {
      setError('Valor recebido não pode ser maior que o total')
      return
    }

    onConfirm(actualAmountNum)
    onOpenChange(false)
  }

  const handleClose = () => {
    setActualAmount('')
    setError('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] bg-[#F7F5F2] border-[#A1887F]/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#202020]">
            Valor Recebido Após Taxas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sale Total */}
          <div className="bg-[#A1887F] rounded-lg p-4">
            <p className="text-sm text-[#E0DCD1]/70 mb-1">Total da Venda</p>
            <p className="text-3xl font-bold text-[#E0DCD1]">{formatCurrency(saleTotal)}</p>
            <p className="text-sm text-[#E0DCD1]/70 mt-2">
              Parcelado em <span className="font-semibold">{installmentCount}x</span>
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-[#A1887F]/20" />

          {/* Actual Amount Input */}
          <div>
            <label
              htmlFor="actual-amount"
              className="block text-sm font-medium text-[#A1887F] mb-2"
            >
              Valor Efetivamente Recebido <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A1887F]" />
              <input
                id="actual-amount"
                type="text"
                inputMode="decimal"
                value={actualAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0,00"
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#A1887F]/30 rounded-lg text-[#202020] text-lg placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          {/* Discount Display */}
          {actualAmountNum > 0 && actualAmountNum <= saleTotal && (
            <div className="bg-[#FEF3C7] border border-[#F59E0B]/20 rounded-lg p-4">
              <p className="text-sm text-[#92400E] mb-2">Desconto (taxas do cartão)</p>
              <div className="flex items-baseline gap-3">
                <p className="text-2xl font-bold text-[#C76A6A]">
                  {formatCurrency(discount)}
                </p>
                <p className="text-lg font-semibold text-[#C76A6A]">
                  ({discountPercentage.toFixed(1)}%)
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-transparent border-2 border-[#A1887F] text-[#A1887F] font-semibold rounded-lg hover:bg-[#A1887F]/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!actualAmount || actualAmountNum <= 0 || actualAmountNum > saleTotal}
              className="flex-1 px-4 py-3 bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
