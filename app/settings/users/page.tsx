'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { getUsers, deleteUser } from '@/lib/services/userService'
import { AddUserModal } from '@/components/users/AddUserModal'
import { UserPlus, Trash2, Mail, Calendar, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
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

interface User {
  id: string
  email: string
  created_at: string
}

export default function UsersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 30000,
  })

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      await deleteUser(userToDelete.id)
      toast.success('Usuário excluído com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setUserToDelete(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir usuário')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 pt-4 pb-4">
          <button
            onClick={() => router.push('/settings')}
            className="p-2 hover:bg-[#A1887F]/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-[#E0DCD1]" />
          </button>
          <h1 className="text-2xl font-bold text-[#E0DCD1]">Gerenciar Usuários</h1>
        </div>

        {/* Add User Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 min-h-[44px]"
          >
            <UserPlus className="h-5 w-5" />
            Novo Usuário
          </button>
        </div>

        {/* Users List */}
        <div className="bg-[#A1887F] rounded-xl p-6 mb-6">
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#F7F5F2] rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-[#A1887F]/20 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-[#A1887F]/20 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && (!users || users.length === 0) && (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-[#E0DCD1]/50 mx-auto mb-4" />
              <p className="text-[#E0DCD1] font-medium mb-2">Nenhum usuário cadastrado</p>
              <p className="text-[#E0DCD1]/70 text-sm">
                Clique em "Novo Usuário" para adicionar
              </p>
            </div>
          )}

          {users && users.length > 0 && (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-[#F7F5F2] rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4 text-[#A1887F]" />
                      <h3 className="text-base font-medium text-[#202020]">{user.email}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#A1887F]/70">
                      <Calendar className="h-3 w-3" />
                      Criado em {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <button
                    onClick={() => setUserToDelete(user)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    aria-label="Excluir usuário"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-[#A1887F]/50 rounded-xl p-4 border-2 border-[#A1887F]">
          <p className="text-sm text-[#E0DCD1]">
            💡 <strong>Dica:</strong> Os usuários cadastrados poderão fazer login no sistema com o email e senha fornecidos.
          </p>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent className="bg-[#F7F5F2] border-[#A1887F]/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#202020]">
              Excluir usuário?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#A1887F]">
              Tem certeza que deseja excluir o usuário <strong>{userToDelete?.email}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-transparent border-2 border-[#A1887F] text-[#A1887F] hover:bg-[#A1887F]/10"
              disabled={isDeleting}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  )
}
