'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCategory, type CategoryWithCount } from '@/lib/services/categoryService'
import { toast } from 'sonner'
import { Loader2, AlertTriangle, Package } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryWithCount | null
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
}: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories-with-count'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })

      if (result.affectedProducts > 0) {
        toast.success(
          `Categoria excluída! ${result.affectedProducts} ${
            result.affectedProducts === 1 ? 'produto foi atualizado' : 'produtos foram atualizados'
          }.`
        )
      } else {
        toast.success('Categoria excluída com sucesso!')
      }

      onOpenChange(false)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleDelete = async () => {
    if (!category) return

    setIsDeleting(true)
    try {
      await deleteCategoryMutation.mutateAsync(category.id)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!category) return null

  const hasProducts = category.product_count > 0

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px] bg-[#F7F5F2] border-[#A1887F]/20">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-[#202020]">
              Excluir Categoria?
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription asChild>
            <div className="text-[#A1887F] space-y-3">
              <p>
                Você está prestes a excluir a categoria{' '}
                <span className="font-semibold text-[#202020]">"{category.name}"</span>.
              </p>

              {hasProducts ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-semibold">
                    <Package className="h-4 w-4" />
                    <span>Atenção: Esta categoria possui produtos</span>
                  </div>
                  <p className="text-sm text-amber-700">
                    Esta categoria está sendo usada por{' '}
                    <span className="font-semibold">
                      {category.product_count} {category.product_count === 1 ? 'produto' : 'produtos'}
                    </span>
                    .
                  </p>
                  <p className="text-sm text-amber-700">
                    Ao excluir esta categoria, {category.product_count === 1 ? 'este produto' : 'estes produtos'}{' '}
                    {category.product_count === 1 ? 'ficará' : 'ficarão'} sem categoria (categoria será definida como "Nenhuma").
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    Esta categoria não está sendo usada por nenhum produto e pode ser excluída com segurança.
                  </p>
                </div>
              )}

              <p className="text-sm font-semibold text-red-600">
                Esta ação não pode ser desfeita.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel
            disabled={isDeleting}
            className="bg-transparent border-2 border-[#A1887F] text-[#A1887F] hover:bg-[#A1887F]/10 hover:text-[#A1887F]"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Excluindo...
              </>
            ) : (
              'Sim, Excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
