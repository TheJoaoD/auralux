'use client'

import { useQuery } from '@tanstack/react-query'
import { getCategoriesWithCount, type CategoryWithCount } from '@/lib/services/categoryService'
import { Tag, Package, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CategoryListProps {
  currentPage: number
  pageSize: number
  onEdit: (category: CategoryWithCount) => void
  onDelete: (category: CategoryWithCount) => void
}

export function CategoryList({ currentPage, pageSize, onEdit, onDelete }: CategoryListProps) {
  const { data: paginatedCategories, isLoading, error } = useQuery({
    queryKey: ['categories-with-count', currentPage, pageSize],
    queryFn: () => getCategoriesWithCount({ page: currentPage, pageSize }),
    staleTime: 60000,
  })

  const categories = paginatedCategories?.data || []

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#A1887F]/50 rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E0DCD1]/20 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#E0DCD1]/20 rounded w-1/3" />
                <div className="h-3 bg-[#E0DCD1]/20 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="bg-[#A1887F] rounded-lg p-6 text-center">
        <p className="text-[#E0DCD1] mb-4">
          {error instanceof Error ? error.message : 'Erro ao carregar categorias'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold rounded-lg transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  // Empty State
  if (!categories || categories.length === 0) {
    return (
      <div className="bg-[#A1887F] rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-[#C49A9A] rounded-full">
            <Tag className="h-8 w-8 text-[#202020]" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-[#E0DCD1] mb-2">
          Nenhuma categoria cadastrada
        </h3>
        <p className="text-[#E0DCD1]/70 text-sm">
          Adicione sua primeira categoria para organizar seus produtos
        </p>
      </div>
    )
  }

  // Category List
  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-[#A1887F] rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            {/* Category Icon with Color */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: category.color || '#C49A9A',
              }}
            >
              <Tag className="h-5 w-5 text-white" />
            </div>

            {/* Category Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[#E0DCD1] font-semibold text-base truncate">
                {category.name}
              </h4>
              {category.description && (
                <p className="text-[#E0DCD1]/70 text-sm truncate">
                  {category.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Package className="h-3.5 w-3.5 text-[#E0DCD1]/50" />
                <span className="text-xs text-[#E0DCD1]/70">
                  {category.product_count} {category.product_count === 1 ? 'produto' : 'produtos'}
                </span>
              </div>
            </div>

            {/* Color Badge */}
            {category.color && (
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border-2 border-[#E0DCD1]/20"
                  style={{ backgroundColor: category.color }}
                  title={category.color}
                />
              </div>
            )}

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 hover:bg-[#C49A9A]/20 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Ações da categoria"
                >
                  <MoreVertical className="h-5 w-5 text-[#E0DCD1]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#F7F5F2] border-[#A1887F]/20"
              >
                <DropdownMenuItem
                  onClick={() => onEdit(category)}
                  className="flex items-center gap-2 cursor-pointer focus:bg-[#C49A9A]/10"
                >
                  <Pencil className="h-4 w-4 text-[#C49A9A]" />
                  <span className="text-[#202020]">Editar</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(category)}
                  className="flex items-center gap-2 cursor-pointer focus:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">Excluir</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
