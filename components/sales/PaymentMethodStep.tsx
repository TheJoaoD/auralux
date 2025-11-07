'use client'

import { useState } from 'react'
import { useSaleWizardStore } from '@/lib/stores/saleWizardStore'
import { InstallmentSelector } from './InstallmentSelector'
import { ActualAmountModal } from './ActualAmountModal'
import { SaleSummary } from './SaleSummary'
import { Smartphone, Banknote, CreditCard, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type PaymentMethod = 'pix' | 'cash' | 'installment'

interface PaymentCard {
  id: PaymentMethod
  icon: React.ElementType
  label: string
  description: string
}

const PAYMENT_METHODS: PaymentCard[] = [
  {
    id: 'pix',
    icon: Smartphone,
    label: 'PIX',
    description: 'Pagamento instantâneo',
  },
  {
    id: 'cash',
    icon: Banknote,
    label: 'Dinheiro',
    description: 'Pagamento em espécie',
  },
  {
    id: 'installment',
    icon: CreditCard,
    label: 'Parcelado',
    description: 'Até 12x no cartão',
  },
]

interface PaymentMethodStepProps {
  onSubmit: () => Promise<void>
  isSubmitting: boolean
}

export function PaymentMethodStep({ onSubmit, isSubmitting }: PaymentMethodStepProps) {
  const {
    selectedCustomer,
    cartItems,
    cartTotal,
    paymentMethod,
    installmentCount,
    actualAmountReceived,
    setPaymentMethod,
    setInstallmentCount,
    setActualAmountReceived,
    goToStep,
  } = useSaleWizardStore()

  const [isActualAmountModalOpen, setIsActualAmountModalOpen] = useState(false)

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method)

    // Reset installment data if changing from installment
    if (method !== 'installment') {
      setInstallmentCount(null)
      setActualAmountReceived(null)
    }
  }

  const handleInstallmentSelect = (count: number) => {
    setInstallmentCount(count)
    // Open actual amount modal automatically
    setIsActualAmountModalOpen(true)
  }

  const handleActualAmountConfirm = (amount: number) => {
    setActualAmountReceived(amount)
    toast.success('Valor recebido registrado')
  }

  const handleBack = () => {
    goToStep(2)
  }

  const handleConfirmSale = async () => {
    // Validation
    if (!paymentMethod) {
      toast.error('Selecione um método de pagamento')
      return
    }

    if (paymentMethod === 'installment') {
      if (!installmentCount) {
        toast.error('Selecione o número de parcelas')
        return
      }
      if (!actualAmountReceived) {
        toast.error('Informe o valor efetivamente recebido')
        return
      }
    }

    await onSubmit()
  }

  const canSubmit =
    paymentMethod &&
    (paymentMethod !== 'installment' ||
      (installmentCount !== null && actualAmountReceived !== null)) &&
    !isSubmitting

  if (!selectedCustomer) {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      {/* Payment Method Cards */}
      <div>
        <h3 className="text-lg font-semibold text-[#202020] mb-4">
          Método de Pagamento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.icon
            const isSelected = paymentMethod === method.id

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => handlePaymentMethodSelect(method.id)}
                disabled={isSubmitting}
                className={`
                  relative p-6 rounded-xl transition-all min-h-[120px]
                  flex flex-col items-center justify-center gap-3
                  ${
                    isSelected
                      ? 'bg-[#C49A9A]/10 border-3 border-[#C49A9A] shadow-lg'
                      : 'bg-[#A1887F] border-2 border-[#A1887F]/30 hover:bg-[#A1887F]/80'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <Icon
                  className={`h-12 w-12 ${
                    isSelected ? 'text-[#C49A9A]' : 'text-[#E0DCD1]'
                  }`}
                />
                <div className="text-center">
                  <p
                    className={`text-lg font-semibold ${
                      isSelected ? 'text-[#C49A9A]' : 'text-[#E0DCD1]'
                    }`}
                  >
                    {method.label}
                  </p>
                  <p
                    className={`text-sm ${
                      isSelected ? 'text-[#C49A9A]/70' : 'text-[#E0DCD1]/60'
                    }`}
                  >
                    {method.description}
                  </p>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="h-6 w-6 text-[#C49A9A]" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Installment Selector */}
      {paymentMethod === 'installment' && (
        <div className="animate-in fade-in duration-300">
          <InstallmentSelector
            selectedCount={installmentCount}
            onSelect={handleInstallmentSelect}
          />

          {/* Actual Amount Display */}
          {installmentCount && actualAmountReceived && (
            <div className="mt-4 p-4 bg-[#FEF3C7] border border-[#F59E0B]/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#92400E] mb-1">Valor Recebido</p>
                  <p className="text-lg font-semibold text-[#202020]">
                    R$ {actualAmountReceived.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => setIsActualAmountModalOpen(true)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-[#92400E] bg-white border border-[#F59E0B]/20 rounded-lg hover:bg-[#FEF3C7] transition-colors disabled:opacity-50"
                >
                  Alterar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sale Summary */}
      {paymentMethod && (
        <div className="animate-in fade-in duration-300">
          <SaleSummary
            customer={selectedCustomer}
            cartItems={cartItems}
            paymentMethod={paymentMethod}
            installmentCount={installmentCount}
            actualAmountReceived={actualAmountReceived}
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleBack}
          disabled={isSubmitting}
          className="flex-1 px-6 py-4 bg-transparent border-2 border-[#A1887F] text-[#A1887F] font-semibold rounded-lg hover:bg-[#A1887F]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Voltar
        </button>
        <button
          onClick={handleConfirmSale}
          disabled={!canSubmit}
          className="flex-1 px-6 py-4 bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[56px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              Confirmar Venda
            </>
          )}
        </button>
      </div>

      {/* Actual Amount Modal */}
      <ActualAmountModal
        open={isActualAmountModalOpen}
        onOpenChange={setIsActualAmountModalOpen}
        saleTotal={cartTotal}
        installmentCount={installmentCount || 1}
        onConfirm={handleActualAmountConfirm}
      />
    </div>
  )
}
