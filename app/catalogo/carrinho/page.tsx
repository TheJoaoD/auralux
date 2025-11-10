/**
 * Shopping Cart Page
 * Epic 3 - Story 3.2 & 3.3: Cart System + WhatsApp Checkout
 */

import { Suspense } from 'react'
import { CartClient } from '@/components/catalog/CartClient'
import { ProductCardSkeleton } from '@/components/catalog/ProductCardSkeleton'

export const metadata = {
  title: 'Meu Carrinho | Auralux Catálogo',
  description: 'Finalize seu pedido via WhatsApp',
}

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Meu Carrinho</h1>
        <p className="mt-2 text-muted-foreground">
          Revise seus produtos e finalize o pedido
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <CartClient />
      </Suspense>
    </div>
  )
}
