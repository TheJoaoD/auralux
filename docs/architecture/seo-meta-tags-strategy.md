# SEO & Meta Tags Strategy

## Dynamic Meta Tags (Product Pages)

```typescript
// app/catalogo/produto/[id]/page.tsx

import { Metadata } from 'next'
import { getProductDetails } from '@/lib/services/catalog'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProductDetails(params.id)

  if (!product) {
    return { title: 'Produto não encontrado' }
  }

  const title = `${product.name} - Auralux Perfumes`
  const description = `Compre ${product.name} por R$ ${product.sale_price.toFixed(2)}. ${product.catalog_details?.occasion?.join(', ') || 'Fragrância de luxo'}.`
  const imageUrl = product.image_url || '/og-default.jpg'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: 'product',
      url: `https://auralux.com.br/catalogo/produto/${product.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}
```

## Structured Data (Schema.org)

```typescript
// components/catalog/ProductStructuredData.tsx

export function ProductStructuredData({ product }: { product: CatalogProduct }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image_url,
    description: `Perfume ${product.name} disponível na Auralux`,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'Auralux',
    },
    offers: {
      '@type': 'Offer',
      url: `https://auralux.com.br/catalogo/produto/${product.id}`,
      priceCurrency: 'BRL',
      price: product.sale_price,
      availability: product.quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Auralux',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

## Dynamic Sitemap

```typescript
// app/catalogo/sitemap.xml/route.ts

import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()

  const { data: products } = await supabase
    .from('catalog_items')
    .select('product_id, products:product_id(id, updated_at)')
    .eq('visible', true)

  const baseUrl = 'https://auralux.com.br'

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}/catalogo</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${products?.map(item => `
        <url>
          <loc>${baseUrl}/catalogo/produto/${item.products.id}</loc>
          <lastmod>${item.products.updated_at}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>
  `

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
```

---
