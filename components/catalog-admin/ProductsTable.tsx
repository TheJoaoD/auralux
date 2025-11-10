/**
 * Products Table Component
 * Epic 4 - Story 4.2: Product Visibility Management
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Package, AlertCircle } from 'lucide-react'
import type { AdminProduct } from '@/lib/services/catalog-admin'

interface ProductsTableProps {
  products: AdminProduct[]
  isLoading: boolean
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onToggleVisibility: (productId: string, visible: boolean) => void
  onToggleFeatured: (productId: string, featured: boolean) => void
}

export function ProductsTable({
  products,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onToggleVisibility,
  onToggleFeatured,
}: ProductsTableProps) {
  if (isLoading) {
    return (
      <Card className="p-6 bg-[#A1887F] border-[#E0DCD1]/20">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-[#E0DCD1]/10 rounded animate-pulse" />
          ))}
        </div>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card className="p-12 bg-[#A1887F] border-[#E0DCD1]/20 text-center">
        <Package className="h-12 w-12 text-[#E0DCD1]/50 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#E0DCD1] mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="text-[#E0DCD1]/70">
          Tente ajustar os filtros de busca
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card className="bg-[#A1887F] border-[#E0DCD1]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0DCD1]/20">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#E0DCD1]">
                    Produto
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#E0DCD1]">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-[#E0DCD1]">
                    Preço
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-[#E0DCD1]">
                    Estoque
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-[#E0DCD1]">
                    Visível
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-[#E0DCD1]">
                    Destaque
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-[#E0DCD1]">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#E0DCD1]/10 hover:bg-[#8D7A6F]/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded overflow-hidden bg-[#E0DCD1]/10 flex-shrink-0">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-[#E0DCD1]/50 absolute inset-0 m-auto" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-[#E0DCD1]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#E0DCD1]/70">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-[#E0DCD1]">
                        R$ {product.sale_price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            product.quantity === 0
                              ? 'text-red-500'
                              : 'text-[#E0DCD1]'
                          }`}
                        >
                          {product.quantity}
                        </span>
                        {product.quantity === 0 && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Switch
                          checked={product.catalog_visible}
                          onCheckedChange={(checked) => {
                            // Prevent double-firing by checking if state is different
                            if (checked !== product.catalog_visible) {
                              onToggleVisibility(product.id, checked)
                            }
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Switch
                          checked={product.catalog_featured}
                          onCheckedChange={(checked) => {
                            // Prevent double-firing by checking if state is different
                            if (checked !== product.catalog_featured) {
                              onToggleFeatured(product.id, checked)
                            }
                          }}
                          disabled={!product.catalog_visible}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/catalogo/produto/${product.id}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#E0DCD1] hover:text-[#C49A9A]"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/catalogo-admin/produtos/${product.id}/editar`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#E0DCD1] hover:text-[#C49A9A]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {products.map((product) => (
          <Card
            key={product.id}
            className="p-4 bg-[#A1887F] border-[#E0DCD1]/20"
          >
            <div className="flex gap-3">
              <div className="relative h-20 w-20 rounded overflow-hidden bg-[#E0DCD1]/10 flex-shrink-0">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Package className="h-8 w-8 text-[#E0DCD1]/50 absolute inset-0 m-auto" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#E0DCD1] truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-[#E0DCD1]/70">{product.category}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm font-medium text-[#E0DCD1]">
                    R$ {product.sale_price.toFixed(2)}
                  </span>
                  <span
                    className={`text-sm ${
                      product.quantity === 0 ? 'text-red-500 font-semibold' : 'text-[#E0DCD1]/70'
                    }`}
                  >
                    Estoque: {product.quantity}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <label className="flex items-center gap-2 text-sm text-[#E0DCD1]">
                    <Switch
                      checked={product.catalog_visible}
                      onCheckedChange={(checked) => {
                        if (checked !== product.catalog_visible) {
                          onToggleVisibility(product.id, checked)
                        }
                      }}
                    />
                    Visível
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#E0DCD1]">
                    <Switch
                      checked={product.catalog_featured}
                      onCheckedChange={(checked) => {
                        if (checked !== product.catalog_featured) {
                          onToggleFeatured(product.id, checked)
                        }
                      }}
                      disabled={!product.catalog_visible}
                    />
                    Destaque
                  </label>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Link href={`/catalogo/produto/${product.id}`} target="_blank">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                  </Link>
                  <Link href={`/catalogo-admin/produtos/${product.id}/editar`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-[#E0DCD1]">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  )
}
