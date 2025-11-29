/**
 * New Products Section
 * Premium grid with better spacing
 * Based on front-end-spec-catalogo.md
 */

'use client'

import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { useNewProducts } from '@/lib/hooks/use-catalog'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'

export function NewProductsSection() {
  const { data: products, isLoading, error } = useNewProducts(8)

  if (error) {
    return null // Fail silently
  }

  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-accent mb-1">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Novidades
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Recém Chegados
            </h2>
          </div>
          <Link
            href="/catalogo/produtos"
            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  )
}
