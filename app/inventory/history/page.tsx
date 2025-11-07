'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { getMovements } from '@/lib/services/inventoryService'
import { formatCurrency } from '@/lib/utils/formatters'
import { Package, TrendingUp, TrendingDown, Edit, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const MOVEMENT_TYPE_LABELS = {
  addition: 'Entrada',
  sale: 'Venda',
  adjustment: 'Ajuste',
}

const MOVEMENT_TYPE_ICONS = {
  addition: TrendingUp,
  sale: TrendingDown,
  adjustment: Edit,
}

export default function InventoryHistoryPage() {
  const { data: movements, isLoading } = useQuery({
    queryKey: ['inventory-movements'],
    queryFn: () => getMovements(),
    staleTime: 30000,
  })

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 pt-4 pb-6">
          <Link
            href="/inventory"
            className="p-2 hover:bg-[#A1887F]/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-[#A1887F]" />
          </Link>
          <h1 className="text-2xl font-bold text-[#E0DCD1]">
            Histórico de Movimentações
          </h1>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C49A9A]" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!movements || movements.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-6 bg-[#A1887F]/10 rounded-full mb-4">
              <Package className="h-16 w-16 text-[#A1887F]" />
            </div>
            <h3 className="text-lg font-semibold text-[#E0DCD1] mb-2">
              Nenhuma movimentação registrada
            </h3>
            <p className="text-sm text-[#A1887F] text-center">
              As movimentações de estoque aparecerão aqui
            </p>
          </div>
        )}

        {/* Movements Table */}
        {!isLoading && movements && movements.length > 0 && (
          <div className="bg-[#A1887F] rounded-xl overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#202020]/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#E0DCD1]">
                      Data
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#E0DCD1]">
                      Produto
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#E0DCD1]">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#E0DCD1]">
                      Alteração
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#E0DCD1]">
                      Antes
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#E0DCD1]">
                      Depois
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#E0DCD1]">
                      Referência
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DCD1]/10">
                  {movements.map((movement) => {
                    const Icon =
                      MOVEMENT_TYPE_ICONS[
                        movement.movement_type as keyof typeof MOVEMENT_TYPE_ICONS
                      ]
                    const isNegative = movement.quantity_change < 0

                    return (
                      <tr
                        key={movement.id}
                        className="hover:bg-[#202020]/10 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-[#E0DCD1]">
                          {new Date(movement.created_at).toLocaleDateString('pt-BR')}
                          <br />
                          <span className="text-xs text-[#E0DCD1]/60">
                            {new Date(movement.created_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-[#C49A9A]" />
                            <span className="text-sm font-medium text-[#E0DCD1]">
                              {movement.product?.name || 'Produto removido'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4 text-[#C49A9A]" />}
                            <span className="text-sm text-[#E0DCD1]">
                              {
                                MOVEMENT_TYPE_LABELS[
                                  movement.movement_type as keyof typeof MOVEMENT_TYPE_LABELS
                                ]
                              }
                            </span>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-4 text-right text-sm font-semibold ${
                            isNegative ? 'text-red-400' : 'text-green-400'
                          }`}
                        >
                          {isNegative ? '' : '+'}
                          {movement.quantity_change}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-[#E0DCD1]/70">
                          {movement.quantity_before}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-[#E0DCD1]">
                          {movement.quantity_after}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#E0DCD1]/60">
                          {movement.reference_id ? (
                            <span className="font-mono text-xs">
                              {movement.reference_id.substring(0, 8)}...
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[#E0DCD1]/10">
              {movements.map((movement) => {
                const Icon =
                  MOVEMENT_TYPE_ICONS[
                    movement.movement_type as keyof typeof MOVEMENT_TYPE_ICONS
                  ]
                const isNegative = movement.quantity_change < 0

                return (
                  <div key={movement.id} className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4 text-[#C49A9A]" />}
                        <span className="text-sm font-medium text-[#E0DCD1]">
                          {
                            MOVEMENT_TYPE_LABELS[
                              movement.movement_type as keyof typeof MOVEMENT_TYPE_LABELS
                            ]
                          }
                        </span>
                      </div>
                      <span className="text-xs text-[#E0DCD1]/60">
                        {new Date(movement.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    {/* Product */}
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#C49A9A]" />
                      <span className="text-sm text-[#E0DCD1]">
                        {movement.product?.name || 'Produto removido'}
                      </span>
                    </div>

                    {/* Quantities */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#E0DCD1]/70">
                        {movement.quantity_before} → {movement.quantity_after}
                      </span>
                      <span
                        className={`font-semibold ${
                          isNegative ? 'text-red-400' : 'text-green-400'
                        }`}
                      >
                        {isNegative ? '' : '+'}
                        {movement.quantity_change}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
