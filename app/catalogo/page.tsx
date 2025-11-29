/**
 * Catalog Home Page
 * Premium mobile-first design
 * Based on front-end-spec-catalogo.md
 */

import { HeroSection } from '@/components/catalog/HeroSection'
import { FeaturedProductsSection } from '@/components/catalog/FeaturedProductsSection'
import { NewProductsSection } from '@/components/catalog/NewProductsSection'
import { CategoriesSection } from '@/components/catalog/CategoriesSection'

// ISR configuration - revalidate every 60 seconds
export const revalidate = 60

export default function CatalogHomePage() {
  return (
    <div>
      {/* Hero Section - Premium full-screen impact */}
      <HeroSection
        variant="standard"
        title="Descubra sua Fragrância Perfeita"
        subtitle="Perfumes de luxo cuidadosamente selecionados para você"
        ctaText="Explorar"
        ctaHref="/catalogo/produtos"
      />

      {/* Featured Products - Carousel */}
      <FeaturedProductsSection />

      {/* Categories - Visual cards */}
      <CategoriesSection />

      {/* New Products - Grid */}
      <NewProductsSection />
    </div>
  )
}
