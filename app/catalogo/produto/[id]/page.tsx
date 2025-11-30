/**
 * Product Details Page
 * Premium mobile-first design
 * Based on front-end-spec-catalogo.md
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Share2, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getProductDetails } from '@/lib/services/catalog'
import { FragranceDetails } from '@/components/catalog/FragranceDetails'
import { ProductActionsClient, RelatedProductsClient } from '@/components/catalog/ProductPageClient'
import { createBuildClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

// ISR configuration
export const revalidate = 60

// Generate static params for featured products (SSG)
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
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild className="h-10 w-10 -ml-2">
            <Link href="/catalogo/produtos">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>

          <h1 className="text-sm font-medium truncate max-w-[200px] opacity-0 transition-opacity">
            {product.name}
          </h1>

          <Button variant="ghost" size="icon" className="h-10 w-10 -mr-2">
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Compartilhar</span>
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-square bg-muted/30">
        <Image
          src={product.image_url || '/placeholder-product.jpg'}
          alt={product.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Stock Badge Overlay */}
        {stockBadge && stockBadge.variant === 'destructive' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="destructive" className="text-base px-4 py-2">
              {stockBadge.label}
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Category */}
        {product.category && (
          <Link
            href={`/catalogo/produtos?categoria=${product.category.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <Package className="h-4 w-4" />
            {product.category.name}
          </Link>
        )}

        {/* Name */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          {product.name}
        </h1>

        {/* Price Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-primary">
              {formatPrice(product.sale_price)}
            </p>
            {stockBadge && stockBadge.variant !== 'destructive' && (
              <Badge
                variant={stockBadge.variant}
                className={cn(
                  stockBadge.variant === 'default' && 'bg-green-100 text-green-700 border-green-200'
                )}
              >
                {stockBadge.label}
              </Badge>
            )}
          </div>

          {/* Payment Methods */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="bg-muted px-2 py-1 rounded">💳 Cartão</span>
            <span className="bg-muted px-2 py-1 rounded">📱 PIX</span>
            <span className="bg-muted px-2 py-1 rounded">💵 Dinheiro</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Parcelamos no cartão (taxas da maquininha)
          </p>
        </div>

        {/* SKU */}
        {product.sku && (
          <p className="text-xs text-muted-foreground">
            Ref: {product.sku}
          </p>
        )}

        {/* Fragrance Details */}
        <FragranceDetails product={product} />

        {/* Related Products */}
        {product.category_id && (
          <RelatedProductsClient
            categoryId={product.category_id}
            currentProductId={product.product_id}
          />
        )}
      </div>

      {/* Sticky Action Buttons */}
      <ProductActionsClient product={product} />
    </div>
  )
}

// Helper: Stock badge
function getStockBadge(
  quantity: number,
  stockReturnDate: string | null
): { label: string; variant: 'default' | 'secondary' | 'destructive' } | null {
  if (quantity > 0) {
    return { label: 'Em estoque', variant: 'default' }
  }

  if (stockReturnDate) {
    const date = new Date(stockReturnDate).toLocaleDateString('pt-BR')
    return { label: `Volta em ${date}`, variant: 'secondary' }
  }

  return { label: 'Indisponível', variant: 'destructive' }
}

// Helper: Format price
function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}
