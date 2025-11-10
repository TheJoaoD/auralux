# Appendix: Folder Structure

```
app/
├── catalogo/                          # Public catalog routes
│   ├── layout.tsx                     # Catalog-specific layout (no admin sidebar)
│   ├── page.tsx                       # Home (ISR)
│   ├── produtos/
│   │   └── page.tsx                   # Product listing (SSR)
│   ├── produto/
│   │   └── [id]/
│   │       └── page.tsx               # Product details (ISR)
│   ├── favoritos/
│   │   └── page.tsx                   # Favorites (SSR, protected)
│   ├── carrinho/
│   │   └── page.tsx                   # Cart (SSR, protected)
│   ├── solicitar-produto/
│   │   └── page.tsx                   # Request form (SSR, protected)
│   ├── solicitacoes/
│   │   └── page.tsx                   # User requests history (SSR, protected)
│   ├── actions/
│   │   ├── auth.ts                    # Authentication Server Actions
│   │   ├── cart.ts                    # Cart Server Actions
│   │   └── favorites.ts               # Favorites Server Actions
│   └── sitemap.xml/
│       └── route.ts                   # Dynamic sitemap
│
├── (authenticated)/catalogo-admin/    # Admin catalog management
│   ├── page.tsx                       # Dashboard with metrics
│   ├── produtos/
│   │   ├── page.tsx                   # Product list with visibility toggles
│   │   └── [id]/
│   │       └── editar/
│   │           └── page.tsx           # Edit catalog details
│   ├── destaques/
│   │   └── page.tsx                   # Manage featured products (drag-drop)
│   ├── solicitacoes/
│   │   └── page.tsx                   # Manage customer requests
│   ├── pedidos/
│   │   └── page.tsx                   # Manage orders
│   ├── analytics/
│   │   └── page.tsx                   # Analytics dashboard
│   └── notificacoes/
│       └── page.tsx                   # Notifications history
│
components/
├── catalog/                           # Catalog-specific components
│   ├── AuthModal.tsx                  # WhatsApp authentication modal
│   ├── CatalogHeader.tsx              # Public header (search, cart icon)
│   ├── CatalogFooter.tsx              # Public footer
│   ├── ProductCard.tsx                # Product card component
│   ├── ProductImage.tsx               # Optimized image component
│   ├── CategoryNav.tsx                # Category navigation
│   ├── ProductStructuredData.tsx      # Schema.org structured data
│   └── CartFAB.tsx                    # Floating action button for cart
│
lib/
├── services/
│   ├── catalog.ts                     # Product queries
│   ├── catalog-auth.ts                # Authentication logic
│   ├── catalog-favorites.ts           # Favorites management
│   ├── catalog-cart.ts                # Cart management
│   ├── catalog-requests.ts            # Product requests
│   ├── catalog-orders.ts              # Order creation
│   ├── catalog-analytics.ts           # Analytics & view tracking
│   └── catalog-realtime.ts            # Realtime subscriptions
│
├── hooks/
│   ├── use-catalog.ts                 # React Query hooks for catalog
│   ├── use-catalog-auth.ts            # Auth state hook
│   └── use-catalog-cart.ts            # Cart state hook (Zustand)
│
├── stores/
│   └── catalog-store.ts               # Zustand store (cart, favorites state)
│
├── utils/
│   └── rate-limit.ts                  # Rate limiting utility
│
types/
└── catalog.ts                         # TypeScript types for catalog

supabase/
└── migrations/
    └── YYYYMMDDHHMMSS_create_catalog_schema.sql  # Catalog schema migration
```

---

**End of Architecture Document**

**Next Steps:**
1. Review and approve architecture
2. Create database migration file
3. Implement Epic 1 (Foundation & Authentication)
4. Progressive implementation following PRD epics

**Document Status:** ✅ Complete - Ready for Implementation
**Estimated Implementation Time:** 4-6 weeks (1 full-time developer)

