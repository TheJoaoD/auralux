/**
 * Product Details Page
 * Epic 2 - Story 2.4: Página de Detalhes do Produto
 *
 * Displays full product information with fragrance details, actions, and related products
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getProductDetails } from '@/lib/services/catalog'
import { ProductActions } from '@/components/catalog/ProductActions'
import { FragranceDetails } from '@/components/catalog/FragranceDetails'
import { RelatedProducts } from '@/components/catalog/RelatedProducts'
import { createBuildClient } from '@/lib/supabase/server'

// ISR configuration
export const revalidate = 60

// Generate static params for featured products (SSG)
// Uses build-time safe client (no cookies)
export async function generateStaticParams() {
  try {
    const supabase = createBuildClient()

    const { data } = await supabase
      .from('catalog_items')
      .select('product_id')
      .eq('visible', true)
      .eq('featured', true)
      .order('featured_order', { ascending: true })
      .limit(6)

    return data?.map((item) => ({ id: item.product_id })) || []
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await getProductDetails(id)

    if (!product) {
      return {
        title: 'Produto não encontrado',
      }
    }

    return {
      title: `${product.name} | Auralux Catálogo`,
      description: `${product.name} - R$ ${product.sale_price.toFixed(2)}. ${product.category?.name || ''}`,
      openGraph: {
        title: product.name,
        description: `R$ ${product.sale_price.toFixed(2)}`,
        images: [{ url: product.image_url || '' }],
      },
    }
  } catch (error) {
    console.error('Error in generateMetadata:', error)
    return {
      title: 'Produto não encontrado',
    }
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductDetails(id)

  if (!product) {
    notFound()
  }

  // Stock badge logic
  const stockBadge = getStockBadge(product.quantity, product.stock_return_date)

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/catalogo/produtos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Grid - 2 columns desktop */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left: Image */}
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
            <Image
              src={product.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <Link
                href={`/catalogo/produtos?categoria=${product.category.id}`}
                className="text-sm text-primary hover:text-primary/90 font-medium"
              >
                {product.category.name}
              </Link>
            )}

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-primary">
                {formatPrice(product.sale_price)}
              </p>
              {stockBadge && (
                <Badge variant={stockBadge.variant}>{stockBadge.label}</Badge>
              )}
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            )}

            {/* Fragrance Details */}
            {hasFragranceDetails(product) && (
              <FragranceDetails product={product} />
            )}
          </div>
        </div>

        {/* Related Products */}
        {product.category_id && (
          <RelatedProducts
            categoryId={product.category_id}
            currentProductId={product.product_id}
          />
        )}
      </div>

      {/* Sticky Action Buttons */}
      <ProductActions product={product} />
    </div>
  )
}

// Helper: Stock badge
function getStockBadge(
  quantity: number,
  stockReturnDate: string | null
): { label: string; variant: 'default' | 'secondary' | 'destructive' } | null {
  if (quantity > 0) {
    return { label: 'Disponível', variant: 'default' }
  }

  if (stockReturnDate) {
    const date = new Date(stockReturnDate).toLocaleDateString('pt-BR')
    return { label: `Em breve (${date})`, variant: 'secondary' }
  }

  return { label: 'Indisponível', variant: 'destructive' }
}

// Helper: Check fragrance details
function hasFragranceDetails(product: any): boolean {
  return !!(
    product.fragrance_notes_top ||
    product.fragrance_notes_heart ||
    product.fragrance_notes_base ||
    product.occasion?.length ||
    product.intensity ||
    product.longevity
  )
}

// Helper: Format price
function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}
