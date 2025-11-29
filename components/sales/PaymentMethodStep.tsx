'use client'

import { useState } from 'react'
import { useSaleWizardStore, type DownPaymentMethod } from '@/lib/stores/saleWizardStore'
import { InstallmentSelector } from './InstallmentSelector'
import { SaleSummary } from './SaleSummary'
import {
  Smartphone,
  Banknote,
  CreditCard,
  CheckCircle,
  Loader2,
  DollarSign,
  AlertCircle,
  Calendar,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils/formatters'

// Condição de pagamento (à vista ou parcelado/crediário)
type PaymentCondition = 'cash' | 'installment'

// Forma de pagamento (como o dinheiro é recebido)
type PaymentMethodType = 'pix' | 'cash' | 'card'

interface ConditionCard {
  id: PaymentCondition
  icon: React.ElementType
  label: string
  description: string
}

interface PaymentCard {
  id: PaymentMethodType
  icon: React.ElementType
  label: string
  description: string
}

const PAYMENT_CONDITIONS: ConditionCard[] = [
  {
    id: 'cash',
    icon: Zap,
    label: 'À Vista',
    description: 'Pagamento integral (PIX, Dinheiro ou Cartão)',
  },
  {
    id: 'installment',
    icon: Calendar,
    label: 'Crediário',
    description: 'Cliente parcela direto com você',
  },
]

const PAYMENT_METHODS: PaymentCard[] = [
  {
    id: 'pix',
    icon: Smartphone,
    label: 'PIX',
    description: 'Transferência instantânea',
  },
  {
    id: 'cash',
    icon: Banknote,
    label: 'Dinheiro',
    description: 'Pagamento em espécie',
  },
  {
    id: 'card',
    icon: CreditCard,
    label: 'Cartão',
    description: 'Débito ou Crédito (valor entra integral)',
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
    downPayment,
    downPaymentMethod,
    setPaymentMethod,
    setInstallmentCount,
    setActualAmountReceived,
    setDownPayment,
    setDownPaymentMethod,
    goToStep,
  } = useSaleWizardStore()

  // Estado local para condição de pagamento
  const [paymentCondition, setPaymentCondition] = useState<PaymentCondition | null>(null)
  const [downPaymentInput, setDownPaymentInput] = useState('')
  const [downPaymentError, setDownPaymentError] = useState('')

  const handleConditionSelect = (condition: PaymentCondition) => {
    setPaymentCondition(condition)

    if (condition === 'cash') {
      // À vista: limpar dados de parcelamento
      setInstallmentCount(null)
      setDownPayment(null)
      setDownPaymentInput('')
      setDownPaymentError('')
      setDownPaymentMethod(null)
      // Manter o método de pagamento anterior ou resetar
      if (paymentMethod === 'installment') {
        setPaymentMethod(null)
      }
    } else {
      // Parcelado: resetar método de pagamento
      setPaymentMethod('installment') // Indicador interno que é parcelado
      setActualAmountReceived(null)
      setDownPaymentMethod(null)
    }
  }

  const handlePaymentMethodSelect = (method: PaymentMethodType) => {
    if (paymentCondition === 'cash') {
      // À vista: o método é a forma de pagamento da venda
      setPaymentMethod(method)
    }
    // Crediário: não usamos este seletor para o método principal
    // O método fica como 'installment' internamente
  }

  const handleDownPaymentMethodSelect = (method: DownPaymentMethod) => {
    setDownPaymentMethod(method)
  }

  const handleDownPaymentChange = (value: string) => {
    const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.')
    setDownPaymentInput(cleaned)

    const num = parseFloat(cleaned)
    if (isNaN(num) || cleaned === '') {
      setDownPayment(null)
      setDownPaymentError('')
    } else if (num >= cartTotal) {
      setDownPaymentError('Entrada deve ser menor que o total')
      setDownPayment(null)
    } else if (num < 0) {
      setDownPaymentError('Valor inválido')
      setDownPayment(null)
    } else {
      setDownPayment(num)
      setDownPaymentError('')
    }
  }

  // Calcular valor a parcelar
  const amountToFinance = cartTotal - (downPayment || 0)
  const installmentValue = installmentCount ? amountToFinance / installmentCount : 0

  const handleInstallmentSelect = (count: number) => {
    setInstallmentCount(count)
    // Para parcelamento, definimos o actual_amount_received como o total
    // (não há desconto de taxa na maquininha neste modelo)
    setActualAmountReceived(cartTotal)
  }

  const handleBack = () => {
    goToStep(2)
  }

  const handleConfirmSale = async () => {
    // Validações
    if (!paymentCondition) {
      toast.error('Selecione a condição de pagamento')
      return
    }

    if (paymentCondition === 'cash') {
      if (!paymentMethod || paymentMethod === 'installment') {
        toast.error('Selecione a forma de pagamento')
        return
      }
    } else {
      // Parcelado
      if (!installmentCount) {
        toast.error('Selecione o número de parcelas')
        return
      }
      // Se há entrada, deve ter método de pagamento da entrada
      if (downPayment && downPayment > 0 && !downPaymentMethod) {
        toast.error('Selecione a forma de pagamento da entrada')
        return
      }
    }

    await onSubmit()
  }

  // Verificar se pode submeter
  const canSubmit = (() => {
    if (!paymentCondition || isSubmitting) return false

    if (paymentCondition === 'cash') {
      return paymentMethod && paymentMethod !== 'installment'
    } else {
      // Parcelado
      if (!installmentCount) return false
      // Se há entrada, precisa do método
      if (downPayment && downPayment > 0 && !downPaymentMethod) return false
      return true
    }
  })()

  if (!selectedCustomer) {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      {/* Step 1: Condição de Pagamento */}
      <div>
        <h3 className="text-lg font-semibold text-[#202020] mb-4">
          1. Condição de Pagamento
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {PAYMENT_CONDITIONS.map((condition) => {
            const Icon = condition.icon
            const isSelected = paymentCondition === condition.id

            return (
              <button
                key={condition.id}
                type="button"
                onClick={() => handleConditionSelect(condition.id)}
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
                  className={`h-10 w-10 ${
                    isSelected ? 'text-[#C49A9A]' : 'text-[#E0DCD1]'
                  }`}
                />
                <div className="text-center">
                  <p
                    className={`text-lg font-semibold ${
                      isSelected ? 'text-[#C49A9A]' : 'text-[#E0DCD1]'
                    }`}
                  >
                    {condition.label}
                  </p>
                  <p
                    className={`text-sm ${
                      isSelected ? 'text-[#C49A9A]/70' : 'text-[#E0DCD1]/60'
                    }`}
                  >
                    {condition.description}
                  </p>
                </div>

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

      {/* Step 2: Forma de Pagamento (À Vista) */}
      {paymentCondition === 'cash' && (
        <div className="animate-in fade-in duration-300">
          <h3 className="text-lg font-semibold text-[#202020] mb-4">
            2. Forma de Pagamento
          </h3>
          <div className="grid grid-cols-3 gap-3">
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
                    relative p-4 rounded-xl transition-all
                    flex flex-col items-center justify-center gap-2
                    ${
                      isSelected
                        ? 'bg-[#C49A9A]/10 border-2 border-[#C49A9A]'
                        : 'bg-white border-2 border-[#A1887F]/20 hover:border-[#A1887F]/40'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <Icon
                    className={`h-8 w-8 ${
                      isSelected ? 'text-[#C49A9A]' : 'text-[#A1887F]'
                    }`}
                  />
                  <p
                    className={`text-sm font-medium ${
                      isSelected ? 'text-[#C49A9A]' : 'text-[#202020]'
                    }`}
                  >
                    {method.label}
                  </p>

                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-4 w-4 text-[#C49A9A]" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 2: Crediário (cliente parcela direto com você) */}
      {paymentCondition === 'installment' && (
        <div className="animate-in fade-in duration-300 space-y-4">
          <h3 className="text-lg font-semibold text-[#202020] mb-4">
            2. Condições do Crediário
          </h3>
          <InstallmentSelector
            selectedCount={installmentCount}
            onSelect={handleInstallmentSelect}
          />

          {/* Entrada/Sinal */}
          <div className="bg-white border border-[#A1887F]/20 rounded-lg p-4">
            <label
              htmlFor="down-payment"
              className="block text-sm font-medium text-[#A1887F] mb-2"
            >
              Entrada/Sinal (opcional)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A1887F]" />
              <input
                id="down-payment"
                type="text"
                inputMode="decimal"
                value={downPaymentInput}
                onChange={(e) => handleDownPaymentChange(e.target.value)}
                placeholder="0,00"
                disabled={isSubmitting}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#A1887F]/30 rounded-lg text-[#202020] text-lg placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent disabled:opacity-50"
              />
            </div>
            {downPaymentError && (
              <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {downPaymentError}
              </div>
            )}
            <p className="mt-2 text-xs text-[#A1887F]">
              Valor pago na hora da compra, descontado das parcelas
            </p>
          </div>

          {/* Forma de Pagamento da Entrada */}
          {downPayment && downPayment > 0 && (
            <div className="animate-in fade-in duration-300">
              <h4 className="text-sm font-medium text-[#A1887F] mb-3">
                Forma de Pagamento da Entrada
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon
                  const isSelected = downPaymentMethod === method.id

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => handleDownPaymentMethodSelect(method.id)}
                      disabled={isSubmitting}
                      className={`
                        relative p-3 rounded-lg transition-all
                        flex flex-col items-center justify-center gap-1
                        ${
                          isSelected
                            ? 'bg-green-100 border-2 border-green-500'
                            : 'bg-white border-2 border-[#A1887F]/20 hover:border-[#A1887F]/40'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          isSelected ? 'text-green-600' : 'text-[#A1887F]'
                        }`}
                      />
                      <p
                        className={`text-xs font-medium ${
                          isSelected ? 'text-green-600' : 'text-[#202020]'
                        }`}
                      >
                        {method.label}
                      </p>

                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Resumo das Parcelas */}
          {installmentCount && (
            <div className="bg-[#C49A9A]/10 border border-[#C49A9A]/20 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#A1887F] mb-1">Entrada</p>
                  <p className="text-lg font-semibold text-[#202020]">
                    {downPayment ? formatCurrency(downPayment) : 'R$ 0,00'}
                  </p>
                  {downPayment && downPaymentMethod && (
                    <p className="text-xs text-green-600">
                      via {PAYMENT_METHODS.find(m => m.id === downPaymentMethod)?.label}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#A1887F] mb-1">A Parcelar</p>
                  <p className="text-lg font-semibold text-[#202020]">
                    {formatCurrency(amountToFinance)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-[#A1887F] mb-1">Valor das Parcelas</p>
                  <p className="text-xl font-bold text-[#C49A9A]">
                    {installmentCount}x de {formatCurrency(installmentValue)}
                  </p>
                </div>
              </div>

              {/* Informativo sobre crediário */}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700">
                  <strong>Crediário:</strong> O cliente parcela diretamente com você.
                  As parcelas ficam como recebíveis e você cobra mensalmente.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sale Summary */}
      {paymentCondition && (
        <div className="animate-in fade-in duration-300">
          <SaleSummary
            customer={selectedCustomer}
            cartItems={cartItems}
            paymentMethod={paymentCondition === 'cash' ? paymentMethod : 'installment'}
            installmentCount={paymentCondition === 'installment' ? installmentCount : null}
            actualAmountReceived={actualAmountReceived}
            downPayment={paymentCondition === 'installment' ? downPayment : null}
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
    </div>
  )
}
