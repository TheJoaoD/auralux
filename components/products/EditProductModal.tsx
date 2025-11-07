'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { productSchema, type ProductFormData } from '@/lib/validations/productSchemas'
import { updateProduct, calculateProfitMargin } from '@/lib/services/productService'
import { getCategories } from '@/lib/services/categoryService'
import { ImageUpload } from './ImageUpload'
import { toast } from 'sonner'
import { Loader2, TrendingUp } from 'lucide-react'
import type { Product } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface EditProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

export function EditProductModal({
  open,
  onOpenChange,
  product,
}: EditProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      category_id: product.category_id || '',
      sku: product.sku || '',
      sale_price: product.sale_price,
      cost_price: product.cost_price,
      quantity: product.quantity,
      low_stock_threshold: product.low_stock_threshold,
      supplier: product.supplier || '',
    },
  })

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const updateProductMutation = useMutation({
    mutationFn: (data: Partial<ProductFormData> & { currentImageUrl?: string }) =>
      updateProduct(product.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produto atualizado com sucesso!')
      onOpenChange(false)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      await updateProductMutation.mutateAsync({
        name: data.name,
        category_id: data.category_id || undefined,
        sku: data.sku || undefined,
        image: data.image,
        sale_price: data.sale_price,
        cost_price: data.cost_price,
        quantity: data.quantity,
        low_stock_threshold: data.low_stock_threshold,
        supplier: data.supplier || undefined,
        currentImageUrl: product.image_url || undefined,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  // Watch prices for profit margin calculation
  const salePrice = watch('sale_price')
  const costPrice = watch('cost_price')

  const profitMargin =
    salePrice && costPrice ? calculateProfitMargin(salePrice, costPrice) : 0

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-[#F7F5F2] border-[#A1887F]/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#202020]">
            Editar Produto
          </DialogTitle>
          <DialogDescription className="text-[#A1887F]">
            Atualize as informações do produto
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#A1887F] mb-2">
              Imagem do Produto
            </label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  value={field.value || product.image_url}
                  onChange={field.onChange}
                  error={errors.image?.message}
                />
              )}
            />
          </div>

          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#A1887F] mb-2"
            >
              Nome do Produto <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Category and SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-[#A1887F] mb-2"
              >
                Categoria <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category_id')}
                id="category_id"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Selecione uma categoria</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1.5 text-sm text-red-600">{errors.category_id.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="sku"
                className="block text-sm font-medium text-[#A1887F] mb-2"
              >
                SKU
              </label>
              <input
                {...register('sku')}
                type="text"
                id="sku"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sale_price"
                className="block text-sm font-medium text-[#A1887F] mb-2"
              >
                Preço de Venda <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E0DCD1]">
                  R$
                </span>
                <input
                  {...register('sale_price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  id="sale_price"
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {errors.sale_price && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.sale_price.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cost_price"
                className="block text-sm font-medium text-[#A1887F] mb-2"
              >
                Preço de Custo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E0DCD1]">
                  R$
                </span>
                <input
                  {...register('cost_price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  id="cost_price"
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {errors.cost_price && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.cost_price.message}
                </p>
              )}
            </div>
          </div>

          {/* Profit Margin Display */}
          {salePrice > 0 && costPrice >= 0 && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-[#A1887F]/20">
              <TrendingUp
                className={`h-5 w-5 ${
                  profitMargin > 30 ? 'text-[#C49A9A]' : 'text-[#A1887F]'
                }`}
              />
              <span className="text-sm font-medium text-[#A1887F]">
                Margem de Lucro:
              </span>
              <span
                className={`text-lg font-bold ${
                  profitMargin > 30 ? 'text-[#C49A9A]' : 'text-[#A1887F]'
                }`}
              >
                {profitMargin.toFixed(1)}%
              </span>
            </div>
          )}

          {/* Quantity and Threshold */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-[#A1887F] mb-2"
              >
                Quantidade <span className="text-red-500">*</span>
              </label>
              <input
                {...register('quantity', { valueAsNumber: true })}
                type="number"
                id="quantity"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.quantity && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="low_stock_threshold"
                className="block text-sm font-medium text-[#A1887F] mb-2"
              >
                Alerta Estoque Baixo
              </label>
              <input
                {...register('low_stock_threshold', { valueAsNumber: true })}
                type="number"
                id="low_stock_threshold"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Supplier */}
          <div>
            <label
              htmlFor="supplier"
              className="block text-sm font-medium text-[#A1887F] mb-2"
            >
              Fornecedor
            </label>
            <input
              {...register('supplier')}
              type="text"
              id="supplier"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white border border-[#A1887F]/30 rounded-lg text-[#202020] placeholder-[#A1887F]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
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
                'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
