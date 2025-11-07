'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { customerSchema, type CustomerFormData } from '@/lib/validations/customerSchemas'
import { createCustomer } from '@/lib/services/customerService'
import { formatWhatsApp } from '@/lib/utils/formatters'
import { toast } from 'sonner'
import { Loader2, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface AddCustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCustomerCreated?: (customer: any) => void
}

export function AddCustomerModal({ open, onOpenChange, onCustomerCreated }: AddCustomerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  })

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: (newCustomer) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Cliente cadastrado com sucesso!')
      reset()
      onOpenChange(false)
      // Call callback if provided (for inline creation in wizard)
      if (onCustomerCreated) {
        onCustomerCreated(newCustomer)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true)
    try {
      await createCustomerMutation.mutateAsync({
        full_name: data.full_name,
        whatsapp: data.whatsapp,
        email: data.email || undefined,
        address: data.address || undefined,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  // Auto-format WhatsApp on change
  const whatsappValue = watch('whatsapp')
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value)
    setValue('whatsapp', formatted)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#F7F5F2] border-[#A1887F]/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#202020]">
            Novo Cliente
          </DialogTitle>
          <DialogDescription className="text-[#A1887F]">
            Cadastre um novo cliente no sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-[#A1887F] mb-2"
            >
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              {...register('full_name')}
              type="text"
              id="full_name"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ex: Maria Silva"
            />
            {errors.full_name && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label
              htmlFor="whatsapp"
              className="block text-sm font-medium text-[#A1887F] mb-2"
            >
              WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              {...register('whatsapp')}
              onChange={handleWhatsAppChange}
              type="tel"
              id="whatsapp"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="(11) 98765-4321"
            />
            {errors.whatsapp && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.whatsapp.message}
              </p>
            )}
          </div>

          {/* Email (Optional) */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#A1887F] mb-2"
            >
              Email <span className="text-[#A1887F]/50 text-xs">(opcional)</span>
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="maria@email.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Address (Optional) */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-[#A1887F] mb-2"
            >
              Endereço <span className="text-[#A1887F]/50 text-xs">(opcional)</span>
            </label>
            <textarea
              {...register('address')}
              id="address"
              disabled={isSubmitting}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              placeholder="Rua, número, bairro, cidade"
            />
            {errors.address && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-transparent border-2 border-[#A1887F] text-[#A1887F] font-semibold rounded-lg hover:bg-[#A1887F]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Cliente'
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
