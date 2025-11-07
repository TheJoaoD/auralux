'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categorySchema, type CategoryFormData } from '@/lib/validations/categorySchemas'
import { createCategory } from '@/lib/services/categoryService'
import { toast } from 'sonner'
import { Loader2, Tag, Palette } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface AddCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Predefined color palette (Auralux theme + common colors)
const COLOR_PALETTE = [
  '#C49A9A', // Rosa Queimado
  '#A1887F', // Taupe
  '#E0DCD1', // Areia
  '#202020', // Carvão
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#84CC16', // Lime
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#6B7280', // Gray
]

export function AddCategoryModal({ open, onOpenChange }: AddCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string | null>(COLOR_PALETTE[0])
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      color: COLOR_PALETTE[0],
    },
  })

  const createCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormData) =>
      createCategory(
        data.name,
        data.color || undefined,
        data.description || undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories-with-count'] })
      toast.success('Categoria criada com sucesso!')
      handleClose()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)
    try {
      await createCategoryMutation.mutateAsync(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    setSelectedColor(COLOR_PALETTE[0])
    onOpenChange(false)
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    setValue('color', color, { shouldValidate: true })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#F7F5F2] border-[#A1887F]/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#202020] flex items-center gap-2">
            <Tag className="h-6 w-6 text-[#C49A9A]" />
            Nova Categoria
          </DialogTitle>
          <DialogDescription className="text-[#A1887F]">
            Crie uma categoria para organizar seus produtos
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Category Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#A1887F] mb-2"
            >
              Nome da Categoria <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              disabled={isSubmitting}
              placeholder="Ex: Eletrônicos, Roupas, Alimentos..."
              className="w-full px-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[#A1887F] mb-2"
            >
              Descrição (opcional)
            </label>
            <textarea
              {...register('description')}
              id="description"
              disabled={isSubmitting}
              rows={3}
              placeholder="Descreva para que serve esta categoria..."
              className="w-full px-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-[#A1887F] mb-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Cor da Categoria (opcional)
              </div>
            </label>

            <div className="grid grid-cols-7 gap-2">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  disabled={isSubmitting}
                  className={`
                    w-10 h-10 rounded-lg transition-all
                    ${selectedColor === color ? 'ring-2 ring-[#C49A9A] ring-offset-2 scale-110' : 'hover:scale-105'}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  style={{ backgroundColor: color }}
                  title={color}
                  aria-label={`Selecionar cor ${color}`}
                />
              ))}
            </div>

            {selectedColor && (
              <div className="mt-3 flex items-center gap-2 text-sm text-[#A1887F]">
                <div
                  className="w-4 h-4 rounded border border-[#A1887F]/20"
                  style={{ backgroundColor: selectedColor }}
                />
                <span>Cor selecionada: {selectedColor}</span>
              </div>
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
                  Criando...
                </>
              ) : (
                'Criar Categoria'
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
