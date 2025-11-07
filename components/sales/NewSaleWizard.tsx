'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useSaleWizardStore } from '@/lib/stores/saleWizardStore'
import { CustomerSelectionStep } from './CustomerSelectionStep'
import { ProductSelectionStep } from './ProductSelectionStep'
import { PaymentMethodStep } from './PaymentMethodStep'
import { createSale } from '@/lib/services/salesService'
import { X, Check } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

interface NewSaleWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewSaleWizard({ open, onOpenChange }: NewSaleWizardProps) {
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const {
    currentStep,
    selectedCustomer,
    cartItems,
    paymentMethod,
    installmentCount,
    actualAmountReceived,
    resetWizard,
  } = useSaleWizardStore()

  // Reset wizard when closed
  useEffect(() => {
    if (!open) {
      resetWizard()
    }
  }, [open, resetWizard])

  const handleClose = () => {
    // If cart has items, show confirmation
    if (cartItems.length > 0) {
      setShowCloseConfirm(true)
    } else {
      onOpenChange(false)
    }
  }

  const handleConfirmClose = () => {
    setShowCloseConfirm(false)
    onOpenChange(false)
  }

  const handleSubmitSale = async () => {
    if (!selectedCustomer || !paymentMethod) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setIsSubmitting(true)

    try {
      await createSale({
        customer_id: selectedCustomer.id,
        cartItems,
        payment_method: paymentMethod,
        installment_count: installmentCount || undefined,
        actual_amount_received: actualAmountReceived || undefined,
      })

      // Invalidate all affected queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['sales-metrics'] }),
        queryClient.invalidateQueries({ queryKey: ['recent-sales'] }),
        queryClient.invalidateQueries({ queryKey: ['payment-breakdown'] }),
        queryClient.invalidateQueries({ queryKey: ['sales-chart'] }),
        queryClient.invalidateQueries({ queryKey: ['products'] }), // Stock updated
        queryClient.invalidateQueries({ queryKey: ['all-products'] }), // All products list
        queryClient.invalidateQueries({ queryKey: ['customers'] }), // Purchase count updated
        queryClient.invalidateQueries({ queryKey: ['all-customers'] }), // All customers list
      ])

      toast.success('Venda registrada com sucesso!')
      onOpenChange(false)

      // Force refetch after a small delay to ensure data is updated
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['recent-sales'] })
        queryClient.refetchQueries({ queryKey: ['sales-metrics'] })
      }, 100)
      // Reset is handled by useEffect when modal closes
    } catch (error) {
      console.error('Error creating sale:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao registrar venda')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, label: 'Cliente' },
    { number: 2, label: 'Produtos' },
    { number: 3, label: 'Pagamento' },
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="sm:max-w-[900px] max-h-[95vh] overflow-hidden bg-[#F7F5F2] border-[#A1887F]/20 p-0"
          showCloseButton={false}
        >
          {/* Hidden title for accessibility */}
          <DialogTitle className="sr-only">Nova Venda</DialogTitle>

          {/* Header with Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-[#A1887F]/20">
            <h2 className="text-2xl font-bold text-[#202020]">Nova Venda</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-[#A1887F]/20 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Fechar"
            >
              <X className="h-6 w-6 text-[#A1887F]" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 py-4 bg-white border-b border-[#A1887F]/10">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all
                        ${
                          currentStep > step.number
                            ? 'bg-[#C49A9A] text-white'
                            : currentStep === step.number
                            ? 'bg-[#C49A9A] text-white'
                            : 'bg-[#A1887F]/30 text-[#A1887F]'
                        }
                      `}
                    >
                      {currentStep > step.number ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <span>{step.number}</span>
                      )}
                    </div>
                    <span
                      className={`
                        mt-2 text-sm font-medium
                        ${
                          currentStep === step.number
                            ? 'text-[#C49A9A]'
                            : 'text-[#A1887F]'
                        }
                      `}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        flex-1 h-1 mx-4 rounded-full transition-all
                        ${
                          currentStep > step.number
                            ? 'bg-[#C49A9A]'
                            : 'bg-[#A1887F]/30'
                        }
                      `}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(95vh - 200px)' }}>
            {currentStep === 1 && <CustomerSelectionStep />}
            {currentStep === 2 && <ProductSelectionStep />}
            {currentStep === 3 && (
              <PaymentMethodStep onSubmit={handleSubmitSale} isSubmitting={isSubmitting} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Confirmation Dialog */}
      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent className="bg-[#F7F5F2] border-[#A1887F]/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#202020]">
              Descartar venda?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#A1887F]">
              Você possui {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} no carrinho.
              Ao fechar, todos os itens serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-2 border-[#A1887F] text-[#A1887F] hover:bg-[#A1887F]/10">
              Continuar Editando
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClose}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Sim, Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
