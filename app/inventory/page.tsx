'use client'

import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProductGallery } from '@/components/products/ProductGallery'
import { InventoryMetrics } from '@/components/products/InventoryMetrics'
import { AddProductModal } from '@/components/products/AddProductModal'
import { EditProductModal } from '@/components/products/EditProductModal'
import { SimplePagination } from '@/components/ui/simple-pagination'
import { getProducts } from '@/lib/services/productService'
import { PackagePlus } from 'lucide-react'
import type { Product } from '@/types'

export default function InventoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Fetch paginated products
  const { data: paginatedProducts, isLoading, error } = useQuery({
    queryKey: ['products', currentPage, pageSize],
    queryFn: () => getProducts({ page: currentPage, pageSize }),
    staleTime: 60000,
  })

  const products = paginatedProducts?.data || []

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }, [])

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 pb-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 pb-6">
          <h1 className="text-2xl font-bold text-[#E0DCD1]">Estoque</h1>

          {/* Add Product Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px]"
          >
            <PackagePlus className="h-5 w-5" />
            Novo Produto
          </button>
        </div>

        {/* Metrics Cards */}
        {products && products.length > 0 && (
          <div className="mb-6">
            <InventoryMetrics products={products} />
          </div>
        )}

        {/* Product Gallery */}
        <div className="mb-6">
          <ProductGallery
            products={products}
            isLoading={isLoading}
            error={error as Error | null}
            onProductClick={handleProductClick}
            onAddProduct={() => setIsAddModalOpen(true)}
          />
        </div>

        {/* Pagination */}
        {paginatedProducts && paginatedProducts.totalPages > 1 && (
          <div className="mb-6">
            <SimplePagination
              currentPage={paginatedProducts.page}
              totalPages={paginatedProducts.totalPages}
              onPageChange={setCurrentPage}
              hasNextPage={paginatedProducts.hasNextPage}
              hasPreviousPage={paginatedProducts.hasPreviousPage}
              totalItems={paginatedProducts.total}
            />
          </div>
        )}

        {/* Add Product Modal */}
        <AddProductModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
        />

        {/* Edit Product Modal */}
        {selectedProduct && (
          <EditProductModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            product={selectedProduct}
          />
        )}
      </div>
    </MainLayout>
  )
}
