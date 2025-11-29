/**
 * Product Page Client Components Wrapper
 * Re-exports client components for use in server pages
 */

'use client'

import { ProductActions } from './ProductActions'
import { RelatedProducts } from './RelatedProducts'
import type { CatalogProduct } from '@/lib/services/catalog'

// Export client-side components
interface ProductActionsClientProps {
  product: CatalogProduct
}

export function ProductActionsClient({ product }: ProductActionsClientProps) {
  return <ProductActions product={product} />
}

interface RelatedProductsClientProps {
  categoryId: string
  currentProductId: string
}

export function RelatedProductsClient({ categoryId, currentProductId }: RelatedProductsClientProps) {
  return <RelatedProducts categoryId={categoryId} currentProductId={currentProductId} />
}
