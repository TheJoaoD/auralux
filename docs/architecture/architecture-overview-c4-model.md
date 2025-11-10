# Architecture Overview (C4 Model)

## Level 1: System Context Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Auralux Ecosystem                            │
│                                                                   │
│  ┌──────────────┐                           ┌─────────────────┐ │
│  │   Cliente    │────────────────────────────│  Gestor Admin   │ │
│  │  (Público)   │                           │  (Autenticado)  │ │
│  └──────┬───────┘                           └────────┬────────┘ │
│         │                                             │          │
│         │ WhatsApp only                               │ Email+Pwd│
│         │                                             │          │
│  ┌──────▼───────────────────────────────────────────▼────────┐ │
│  │          Auralux Next.js Application                      │ │
│  │                                                            │ │
│  │  ┌────────────────────┐    ┌────────────────────────┐    │ │
│  │  │  Catálogo Público  │    │   Admin App            │    │ │
│  │  │  /catalogo/*       │    │   /(authenticated)/*   │    │ │
│  │  └────────────────────┘    └────────────────────────┘    │ │
│  │                                                            │ │
│  └────────────────────────┬───────────────────────────────── │ │
│                           │                                    │
│                           │                                    │
│  ┌────────────────────────▼──────────────────────────────┐   │
│  │         Supabase (PostgreSQL + Realtime)              │   │
│  │                                                        │   │
│  │  ┌──────────────┐              ┌──────────────┐      │   │
│  │  │ Admin Tables │              │Catalog Tables│      │   │
│  │  │ (users,      │              │(catalog_*,   │      │   │
│  │  │  customers,  │◄────RLS─────►│ shared       │      │   │
│  │  │  sales, etc) │              │ products)    │      │   │
│  │  └──────────────┘              └──────────────┘      │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  External: WhatsApp (Deep Links Only)                   │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

## Level 2: Container Diagram (Catalog Focus)

```
┌──────────────────────────────────────────────────────────────────┐
│                    Auralux Catálogo Público                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Next.js Frontend (SSR/ISR)                     │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │ │
│  │  │ Public Routes│  │ Auth Modal   │  │ State Management│  │ │
│  │  │ /catalogo/*  │  │ (WhatsApp)   │  │ (Zustand/RQ)    │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘  │ │
│  └──────────────────────────┬─────────────────────────────────┘ │
│                             │                                    │
│                             │ Server Actions + RPC               │
│                             │                                    │
│  ┌──────────────────────────▼─────────────────────────────────┐ │
│  │              Service Layer (lib/services/)                  │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │ │
│  │  │catalog.ts    │  │catalog-auth  │  │catalog-favorites│  │ │
│  │  │(products)    │  │(JWT/cookie)  │  │catalog-cart     │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘  │ │
│  └──────────────────────────┬─────────────────────────────────┘ │
│                             │                                    │
│                             │ Supabase Client + RLS              │
│                             │                                    │
│  ┌──────────────────────────▼─────────────────────────────────┐ │
│  │              PostgreSQL Database (Supabase)                 │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │ │
│  │  │catalog_users │  │catalog_items │  │catalog_favorites│  │ │
│  │  │catalog_cart  │  │catalog_req's │  │catalog_orders   │  │ │
│  │  │products (⚠️) │  │categories(⚠️)│  │                 │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘  │ │
│  │  ⚠️ = Shared with admin (RLS protected)                    │ │
│  └──────────────────────────┬─────────────────────────────────┘ │
│                             │                                    │
│                             │ WebSocket (Realtime)               │
│                             │                                    │
│  ┌──────────────────────────▼─────────────────────────────────┐ │
│  │         Supabase Realtime (Triggers + Broadcasts)           │ │
│  │  Channel: catalog_requests → Admin notifications            │ │
│  │  Channel: catalog_orders   → Admin notifications            │ │
│  └─────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

## Level 3: Component Diagram (Key Flows)

### Authentication Flow
```
Client Request → AuthModal → Server Action (authenticateWithWhatsApp)
→ catalog-auth.ts (validateWhatsApp → checkUserExists → generateToken)
→ Set HTTP-only cookie → Return user data
```

### Product Browsing Flow
```
/catalogo/page.tsx (ISR cached) → useFeaturedProducts() hook
→ catalog.ts service → Supabase (RLS: visible=true only)
→ React Query cache (staleTime: 60s) → UI render
```

### Cart Checkout Flow
```
Finalizar Pedido → generateWhatsAppMessage() → createOrder()
→ Insert catalog_orders (triggers after_catalog_order_insert)
→ Supabase Realtime broadcast → Admin receives notification
→ Open WhatsApp deep link → clearCart()
```

---
