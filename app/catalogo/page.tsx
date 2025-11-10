/**
 * Catalog Home Page
 * Epic 2 - Story 2.2: Home do Catálogo com Produtos em Destaque
 *
 * Sections:
 * - Hero Banner with CTA
 * - Featured Products (carousel, up to 6)
 * - New Products (grid, 10 items)
 * - Featured Categories (grid, 4 items)
 */

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductCardSkeleton } from '@/components/catalog/ProductCardSkeleton'
import { CategoryCard, CategoryCardSkeleton } from '@/components/catalog/CategoryCard'
import { FeaturedProductsSection } from '@/components/catalog/FeaturedProductsSection'
import { NewProductsSection } from '@/components/catalog/NewProductsSection'
import { CategoriesSection } from '@/components/catalog/CategoriesSection'

// ISR configuration - revalidate every 60 seconds
export const revalidate = 60

export default function CatalogHomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br from-primary/30 via-black/60 to-black/40">
        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="max-w-2xl text-white space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Descubra Fragrâncias Exclusivas
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Perfumes de luxo cuidadosamente selecionados para você expressar
              sua elegância e sofisticação.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
            >
              <Link href="/catalogo/produtos">
                Explorar Catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProductsSection />

      {/* New Products Section */}
      <NewProductsSection />

      {/* Featured Categories Section */}
      <CategoriesSection />
    </div>
  )
}
