/**
 * Featured Products Section
 * Premium carousel with snap scroll
 * Based on front-end-spec-catalogo.md
 */

'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useFeaturedProducts } from '@/lib/hooks/use-catalog'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'

export function FeaturedProductsSection() {
  const { data: products, isLoading, error } = useFeaturedProducts()

  if (error) {
    return null // Fail silently, don't break the page
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="px-4 mb-6 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Em Destaque
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Seleção Especial
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

        {/* Horizontal Scrollable Carousel */}
        <div className="relative">
          <div className="flex gap-3 md:gap-4 overflow-x-auto snap-x-mandatory scrollbar-hide px-4 pb-4 -mx-4 md:mx-0">
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[160px] md:w-[200px] snap-center first:pl-0 last:pr-4"
                >
                  <ProductCardSkeleton variant="featured" />
                </div>
              ))
            ) : (
              // Actual Products
              products?.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 snap-center"
                >
                  <ProductCard
                    product={product}
                    variant="featured"
                    priority={index < 3}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
