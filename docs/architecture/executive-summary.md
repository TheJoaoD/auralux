# Executive Summary

This document defines the technical architecture for the **Auralux Catálogo Público**, a public-facing product catalog that extends the existing Auralux luxury perfume store management system.

## Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Architecture Pattern** | Monolith Extension | Leverage existing Next.js infrastructure, shared database, reduced deployment complexity |
| **Authentication** | Custom JWT (WhatsApp-based) | No password friction, separate from admin auth, 30-day sessions |
| **Database Strategy** | Shared PostgreSQL + RLS Isolation | Reuse existing products, strict RLS policies prevent data leakage |
| **Real-time** | Supabase Realtime (WebSocket) | Already configured, triggers + broadcasts for notifications |
| **State Management** | Zustand (cart/favorites) + React Query (server state) | Persistent client state, aggressive server caching |
| **Rendering Strategy** | ISR (Incremental Static Regeneration) | Static speed + dynamic data, 60s revalidation |
| **WhatsApp Integration** | Deep Links (no API) | Zero cost, native UX, pre-formatted messages |

## Architecture Constraints

1. **No Breaking Changes to Existing System** - Catalog must coexist without affecting admin functionality
2. **Shared Database with RLS Isolation** - `catalog_users` cannot access admin tables
3. **Mobile-First Performance** - LCP < 2.5s on 3G connections
4. **Zero External Costs** - No paid APIs (WhatsApp Business, SMS verification, etc.)
5. **Supabase Limits** - Stay within free tier initially (500 concurrent connections)

---
