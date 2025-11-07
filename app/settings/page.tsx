'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRealtimeCategories } from '@/lib/hooks/useRealtimeCategories'
import { CategoryList } from '@/components/categories/CategoryList'
import { AddCategoryModal } from '@/components/categories/AddCategoryModal'
import { EditCategoryModal } from '@/components/categories/EditCategoryModal'
import { DeleteCategoryDialog } from '@/components/categories/DeleteCategoryDialog'
import { SimplePagination } from '@/components/ui/simple-pagination'
import { getCategoriesWithCount, type CategoryWithCount } from '@/lib/services/categoryService'
import { LogOut, Loader2, User, Tag, Plus, Users, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SettingsPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithCount | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5
  const { user, signOut } = useAuth()
  const router = useRouter()

  // Fetch paginated categories
  const { data: paginatedCategories } = useQuery({
    queryKey: ['categories-with-count', currentPage, pageSize],
    queryFn: () => getCategoriesWithCount({ page: currentPage, pageSize }),
    staleTime: 60000,
  })

  // Enable real-time updates for categories
  useRealtimeCategories()

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await signOut()
      toast.success('Logout realizado com sucesso!')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Erro ao fazer logout. Tente novamente')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleEditCategory = (category: CategoryWithCount) => {
    setSelectedCategory(category)
    setIsEditModalOpen(true)
  }

  const handleDeleteCategory = (category: CategoryWithCount) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto px-4 pb-8">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-[#E0DCD1] pt-4 pb-6">
          Configurações
        </h1>

        {/* User Information Card */}
        <div className="bg-[#A1887F] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#C49A9A]">
              <User className="h-8 w-8 text-[#202020]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#E0DCD1]">
                Conta
              </h2>
              <p className="text-sm text-[#E0DCD1]/70">
                {user?.email || 'Carregando...'}
              </p>
            </div>
          </div>
        </div>

        {/* User Management Link */}
        <Link href="/settings/users">
          <div className="bg-[#A1887F] rounded-2xl p-6 hover:bg-[#8D7A6F] transition-colors cursor-pointer mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#C49A9A]">
                  <Users className="h-6 w-6 text-[#202020]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#E0DCD1]">
                    Gerenciar Usuários
                  </h3>
                  <p className="text-sm text-[#E0DCD1]/70">
                    Adicionar ou remover usuários do sistema
                  </p>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-[#E0DCD1]" />
            </div>
          </div>
        </Link>

        {/* Categories Management Section */}
        <div className="bg-[#A1887F] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Tag className="h-6 w-6 text-[#C49A9A]" />
              <h3 className="text-lg font-semibold text-[#E0DCD1]">
                Categorias de Produtos
              </h3>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 min-h-[44px]"
            >
              <Plus className="h-5 w-5" />
              Nova Categoria
            </button>
          </div>

          <p className="text-sm text-[#E0DCD1]/70 mb-4">
            Organize seus produtos em categorias personalizadas
          </p>

          <CategoryList
            currentPage={currentPage}
            pageSize={pageSize}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />

          {/* Pagination */}
          {paginatedCategories && paginatedCategories.totalPages > 1 && (
            <div className="mt-4">
              <SimplePagination
                currentPage={paginatedCategories.page}
                totalPages={paginatedCategories.totalPages}
                onPageChange={setCurrentPage}
                hasNextPage={paginatedCategories.hasNextPage}
                hasPreviousPage={paginatedCategories.hasPreviousPage}
                totalItems={paginatedCategories.total}
              />
            </div>
          )}
        </div>

        {/* System Information */}
        <div className="bg-[#A1887F] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#E0DCD1] mb-3">
            Sobre o Sistema
          </h3>
          <div className="space-y-2 text-sm text-[#E0DCD1]/70">
            <p>Auralux - Sistema de Gestão</p>
            <p>Versão 1.0.0</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saindo...
            </>
          ) : (
            <>
              <LogOut className="h-5 w-5" />
              Sair da Conta
            </>
          )}
        </button>
      </div>

      {/* Modals */}
      <AddCategoryModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      <EditCategoryModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        category={selectedCategory}
      />

      <DeleteCategoryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        category={selectedCategory}
      />
    </MainLayout>
  )
}
