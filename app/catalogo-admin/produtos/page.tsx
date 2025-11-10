/**
 * Admin Products List Page
 * Epic 4 - Story 4.2: Product Visibility Management
 */

'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProductsTable } from '@/components/catalog-admin/ProductsTable'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, RefreshCw } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/use-debounce'
import {
  fetchAdminProducts,
  fetchCategories,
  updateProductVisibility,
  updateProductFeatured,
} from '../actions'
import { toast } from 'sonner'

export default function CatalogProductsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  // Fetch products
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-products', page, debouncedSearch, category],
    queryFn: () =>
      fetchAdminProducts({
        page,
        search: debouncedSearch,
        category,
      }),
    staleTime: 30000,
  })

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => fetchCategories(),
    staleTime: 300000, // 5 minutes
  })

  // Toggle visibility mutation
  const visibilityMutation = useMutation({
    mutationFn: ({ productId, visible }: { productId: string; visible: boolean }) => {
      console.log('🔵 Mutation called:', { productId, visible })
      return updateProductVisibility(productId, visible)
    },
    onMutate: async ({ productId, visible }) => {
      console.log('🟡 onMutate:', { productId, visible })
      await queryClient.cancelQueries({ queryKey: ['admin-products'] })

      const previousData = queryClient.getQueryData(['admin-products', page, debouncedSearch, category])

      queryClient.setQueryData(['admin-products', page, debouncedSearch, category], (old: any) => {
        if (!old) return old
        return {
          ...old,
          products: old.products.map((p: any) =>
            p.id === productId ? { ...p, catalog_visible: visible } : p
          ),
        }
      })

      return { previousData }
    },
    onError: (error, _variables, context) => {
      console.log('🔴 onError:', error)
      queryClient.setQueryData(
        ['admin-products', page, debouncedSearch, category],
        context?.previousData
      )
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar visibilidade')
    },
    onSuccess: (_data, { visible }) => {
      console.log('🟢 onSuccess:', { visible })
      toast.success(visible ? 'Produto ativado no catálogo' : 'Produto desativado do catálogo')
      queryClient.invalidateQueries({ queryKey: ['catalog-metrics'] })
      // Don't invalidate admin-products to keep optimistic update
    },
  })

  // Toggle featured mutation
  const featuredMutation = useMutation({
    mutationFn: ({ productId, featured }: { productId: string; featured: boolean }) =>
      updateProductFeatured(productId, featured),
    onMutate: async ({ productId, featured }) => {
      await queryClient.cancelQueries({ queryKey: ['admin-products'] })

      const previousData = queryClient.getQueryData(['admin-products', page, debouncedSearch, category])

      queryClient.setQueryData(['admin-products', page, debouncedSearch, category], (old: any) => {
        if (!old) return old
        return {
          ...old,
          products: old.products.map((p: any) =>
            p.id === productId ? { ...p, catalog_featured: featured } : p
          ),
        }
      })

      return { previousData }
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(
        ['admin-products', page, debouncedSearch, category],
        context?.previousData
      )
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar destaque')
    },
    onSuccess: (_data, { featured }) => {
      toast.success(featured ? 'Produto adicionado aos destaques' : 'Produto removido dos destaques')
      queryClient.invalidateQueries({ queryKey: ['catalog-metrics'] })
      // Don't invalidate admin-products to keep optimistic update
    },
  })

  const handleRefresh = () => {
    refetch()
    toast.success('Lista atualizada')
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 pb-8">
        {/* Header */}
        <div className="flex flex-col gap-4 pt-4 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#E0DCD1]">
                Produtos do Catálogo
              </h1>
              <p className="text-[#E0DCD1]/70 text-sm mt-1">
                Gerencie a visibilidade dos produtos no catálogo público
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="icon"
              className="min-h-[44px] min-w-[44px]"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E0DCD1]/50" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-[#A1887F] border-[#E0DCD1]/20 text-[#E0DCD1] placeholder:text-[#E0DCD1]/50"
              />
            </div>
            <Select value={category || 'all'} onValueChange={(value) => setCategory(value === 'all' ? '' : value)}>
              <SelectTrigger className="w-full sm:w-48 bg-[#A1887F] border-[#E0DCD1]/20 text-[#E0DCD1]">
                <SelectValue placeholder="Todas categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <ProductsTable
          products={data?.products || []}
          isLoading={isLoading}
          page={page}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          onToggleVisibility={(productId, visible) =>
            visibilityMutation.mutate({ productId, visible })
          }
          onToggleFeatured={(productId, featured) =>
            featuredMutation.mutate({ productId, featured })
          }
        />
      </div>
    </MainLayout>
  )
}
