# Security Architecture

## Row-Level Security (RLS) Matrix

| Table | Public Read | Public Write | Authenticated Admin | Catalog User |
|-------|-------------|--------------|---------------------|--------------|
| `catalog_users` | ❌ | ✅ INSERT only | ✅ Full | ✅ Own data |
| `catalog_items` | ✅ visible=true | ❌ | ✅ Full | ❌ |
| `catalog_favorites` | ❌ | ❌ | ✅ Full | ✅ Own data |
| `catalog_cart` | ❌ | ❌ | ✅ Full | ✅ Own data |
| `catalog_requests` | ❌ | ❌ | ✅ Full | ✅ Own data |
| `catalog_orders` | ❌ | ✅ INSERT only | ✅ Full | ❌ |
| `catalog_product_views` | ❌ | ✅ INSERT only | ✅ Read only | ❌ |
| `products` (shared) | ✅ via catalog_items | ❌ | ✅ Full | ❌ |
| `categories` (shared) | ✅ via products | ❌ | ✅ Full | ❌ |
| Admin tables | ❌ | ❌ | ✅ Full | ❌ |

## Security Checklist

- [x] **RLS enabled on all catalog tables**
- [x] **JWT validation in middleware for protected routes**
- [x] **HTTP-only cookies for session tokens**
- [x] **Input sanitization (WhatsApp format, names, text fields)**
- [x] **Rate limiting on authentication endpoint (5 attempts/min per IP)**
- [x] **CORS restricted to catalog domain**
- [x] **CSP headers to prevent XSS**
- [x] **SQL injection prevention via Supabase parameterized queries**
- [x] **No sensitive data in client-side state (only whatsapp + name)**
- [x] **Admin/catalog user isolation (separate auth systems)**

## Rate Limiting Implementation

```typescript
// lib/utils/rate-limit.ts

import { LRUCache } from 'lru-cache'

const rateLimitCache = new LRUCache<string, number>({
  max: 500,
  ttl: 60 * 1000, // 1 minute
})

export function checkRateLimit(identifier: string, maxAttempts = 5): boolean {
  const attempts = rateLimitCache.get(identifier) || 0

  if (attempts >= maxAttempts) {
    return false // Rate limit exceeded
  }

  rateLimitCache.set(identifier, attempts + 1)
  return true
}

// Usage in auth Server Action
export async function authenticateWithWhatsApp(whatsapp: string, name?: string) {
  const ip = headers().get('x-forwarded-for') || 'unknown'

  if (!checkRateLimit(`auth:${ip}`, 5)) {
    return { success: false, error: 'Muitas tentativas. Aguarde 1 minuto.' }
  }

  // ... rest of authentication logic
}
```

---
