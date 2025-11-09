'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getDiscountsWithPagination,
  deleteDiscount,
  toggleDiscountStatus,
} from '@/lib/services/discountService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DiscountForm } from './DiscountForm'
import {
  Loader2,
  MoreVertical,
  Pencil,
  Power,
  PowerOff,
  Trash2,
  Percent,
  DollarSign,
  ShoppingCart,
} from 'lucide-react'
import type { Discount, DiscountInput } from '@/types'
import { createDiscount, updateDiscount } from '@/lib/services/discountService'

export function DiscountsList() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  )
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Fetch discounts
  const { data, isLoading } = useQuery({
    queryKey: ['discounts', page],
    queryFn: () => getDiscountsWithPagination({ page, pageSize: 10 }),
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] })
      toast.success('Desconto criado com sucesso!')
      setIsAddDialogOpen(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar desconto')
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<DiscountInput> }) =>
      updateDiscount(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] })
      toast.success('Desconto atualizado com sucesso!')
      setIsEditDialogOpen(false)
      setSelectedDiscount(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar desconto')
    },
  })

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: toggleDiscountStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] })
      toast.success('Status alterado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao alterar status')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] })
      toast.success('Desconto deletado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao deletar desconto')
    },
  })

  const handleCreate = async (input: DiscountInput) => {
    await createMutation.mutateAsync(input)
  }

  const handleUpdate = async (input: DiscountInput) => {
    if (!selectedDiscount) return
    await updateMutation.mutateAsync({ id: selectedDiscount.id, input })
  }

  const handleToggleStatus = async (discount: Discount) => {
    await toggleMutation.mutateAsync(discount.id)
  }

  const handleDelete = async (discount: Discount) => {
    if (
      confirm(
        `Tem certeza que deseja deletar o desconto "${discount.name}"?`
      )
    ) {
      await deleteMutation.mutateAsync(discount.id)
    }
  }

  const formatDiscountValue = (discount: Discount): string => {
    if (discount.discount_type === 'percentage') {
      return `${discount.discount_value}%`
    } else {
      return `R$ ${discount.discount_value.toFixed(2)}`
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Descontos</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Adicionar Desconto
        </Button>
      </div>

      {/* Discounts List */}
      {data && data.data.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.data.map((discount) => (
            <Card key={discount.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{discount.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedDiscount(discount)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(discount)}
                      >
                        {discount.is_active ? (
                          <>
                            <PowerOff className="mr-2 h-4 w-4" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <Power className="mr-2 h-4 w-4" />
                            Ativar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(discount)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Description */}
                {discount.description && (
                  <p className="text-sm text-muted-foreground">
                    {discount.description}
                  </p>
                )}

                {/* Discount Value */}
                <div className="flex items-center gap-2">
                  {discount.discount_type === 'percentage' ? (
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-2xl font-bold text-[#C49A9A]">
                    {formatDiscountValue(discount)}
                  </span>
                </div>

                {/* Minimum Purchase */}
                {discount.minimum_purchase && discount.minimum_purchase > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      Compra mínima: R${' '}
                      {discount.minimum_purchase.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Status Badge */}
                <Badge
                  variant={discount.is_active ? 'default' : 'secondary'}
                  className="mt-2"
                >
                  {discount.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Percent className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">
              Nenhum desconto cadastrado
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Crie seu primeiro desconto para começar
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-4"
            >
              Adicionar Desconto
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {data.page} de {data.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!data.hasPreviousPage}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!data.hasNextPage}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Desconto</DialogTitle>
            <DialogDescription>
              Crie um novo desconto percentual ou fixo
            </DialogDescription>
          </DialogHeader>
          <DiscountForm
            onSubmit={handleCreate}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Desconto</DialogTitle>
            <DialogDescription>
              Atualize as informações do desconto
            </DialogDescription>
          </DialogHeader>
          {selectedDiscount && (
            <DiscountForm
              discount={selectedDiscount}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedDiscount(null)
              }}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
