# Performance Strategy

## Rendering Strategy

| Page | Strategy | Revalidation | Rationale |
|------|----------|--------------|-----------|
| `/catalogo` (home) | ISR | 60s | Static speed + fresh data, low churn |
| `/catalogo/produtos` | SSR | N/A | Dynamic filters/search, user-specific |
| `/catalogo/produto/[id]` | ISR | 60s | Static per-product, SEO benefit |
| `/catalogo/favoritos` | SSR | N/A | User-specific, requires auth |
| `/catalogo/carrinho` | SSR | N/A | User-specific, real-time updates |

## Caching Strategy

```typescript
// React Query Global Config
// lib/providers/query-provider.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute for catalog data
      cacheTime: 5 * 60 * 1000, // 5 minutes in cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
```

## Image Optimization

```typescript
// components/catalog/ProductImage.tsx

import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'

export function getOptimizedImageUrl(url: string, width: number): string {
  if (!url) return '/placeholder-product.webp'

  // Supabase Storage transformation
  const publicUrl = supabase.storage.from('products').getPublicUrl(url).data.publicUrl
  return `${publicUrl}?width=${width}&quality=80&format=webp`
}

export function ProductImage({ src, alt }: { src: string, alt: string }) {
  return (
    <Image
      src={getOptimizedImageUrl(src, 600)}
      alt={alt}
      width={600}
      height={600}
      loading="lazy"
      placeholder="blur"
      blurDataURL="/blur-placeholder.jpg"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

## Prefetching Strategy

```typescript
// components/catalog/ProductCard.tsx

import { useQueryClient } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { getProductDetails } from '@/lib/services/catalog'

export function ProductCard({ product }: { product: CatalogProduct }) {
  const queryClient = useQueryClient()
  const { ref, inView } = useInView({ threshold: 0.5 })

  // Prefetch details when card enters viewport
  if (inView) {
    queryClient.prefetchQuery({
      queryKey: ['catalog', 'product', product.id],
      queryFn: () => getProductDetails(product.id),
    })
  }

  return (
    <div ref={ref}>
      {/* Card content */}
    </div>
  )
}
```

## Performance Budget

| Metric | Target | Rationale |
|--------|--------|-----------|
| **LCP** | < 2.5s | Core Web Vital - largest contentful paint |
| **FID** | < 100ms | Core Web Vital - first input delay |
| **CLS** | < 0.1 | Core Web Vital - cumulative layout shift |
| **TTI** | < 3.5s | Time to interactive on 3G |
| **Bundle Size** | < 200KB | Initial JS bundle (gzipped) |
| **Image Size** | < 100KB | Product images (WebP, optimized) |

---
