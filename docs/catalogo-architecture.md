# Auralux Catálogo Público - Architecture Document

**Version:** 1.0
**Date:** 2025-11-09
**Status:** Design Phase
**Author:** Winston (The Architect)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview (C4 Model)](#architecture-overview-c4-model)
3. [Database Schema & Migrations](#database-schema--migrations)
4. [Authentication Architecture](#authentication-architecture)
5. [Service Layer & API Contracts](#service-layer--api-contracts)
6. [Real-time Architecture](#real-time-architecture)
7. [Sequence Diagrams](#sequence-diagrams)
8. [Performance Strategy](#performance-strategy)
9. [Security Architecture](#security-architecture)
10. [SEO & Meta Tags Strategy](#seo--meta-tags-strategy)
11. [Technical Debt & Trade-offs](#technical-debt--trade-offs)

---

## Executive Summary

This document defines the technical architecture for the **Auralux Catálogo Público**, a public-facing product catalog that extends the existing Auralux luxury perfume store management system.

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Architecture Pattern** | Monolith Extension | Leverage existing Next.js infrastructure, shared database, reduced deployment complexity |
| **Authentication** | Custom JWT (WhatsApp-based) | No password friction, separate from admin auth, 30-day sessions |
| **Database Strategy** | Shared PostgreSQL + RLS Isolation | Reuse existing products, strict RLS policies prevent data leakage |
| **Real-time** | Supabase Realtime (WebSocket) | Already configured, triggers + broadcasts for notifications |
| **State Management** | Zustand (cart/favorites) + React Query (server state) | Persistent client state, aggressive server caching |
| **Rendering Strategy** | ISR (Incremental Static Regeneration) | Static speed + dynamic data, 60s revalidation |
| **WhatsApp Integration** | Deep Links (no API) | Zero cost, native UX, pre-formatted messages |

### Architecture Constraints

1. **No Breaking Changes to Existing System** - Catalog must coexist without affecting admin functionality
2. **Shared Database with RLS Isolation** - `catalog_users` cannot access admin tables
3. **Mobile-First Performance** - LCP < 2.5s on 3G connections
4. **Zero External Costs** - No paid APIs (WhatsApp Business, SMS verification, etc.)
5. **Supabase Limits** - Stay within free tier initially (500 concurrent connections)

---

## Architecture Overview (C4 Model)

### Level 1: System Context Diagram

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

### Level 2: Container Diagram (Catalog Focus)

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

### Level 3: Component Diagram (Key Flows)

#### Authentication Flow
```
Client Request → AuthModal → Server Action (authenticateWithWhatsApp)
→ catalog-auth.ts (validateWhatsApp → checkUserExists → generateToken)
→ Set HTTP-only cookie → Return user data
```

#### Product Browsing Flow
```
/catalogo/page.tsx (ISR cached) → useFeaturedProducts() hook
→ catalog.ts service → Supabase (RLS: visible=true only)
→ React Query cache (staleTime: 60s) → UI render
```

#### Cart Checkout Flow
```
Finalizar Pedido → generateWhatsAppMessage() → createOrder()
→ Insert catalog_orders (triggers after_catalog_order_insert)
→ Supabase Realtime broadcast → Admin receives notification
→ Open WhatsApp deep link → clearCart()
```

---

## Database Schema & Migrations

### New Tables Schema

#### 1. catalog_users

**Purpose:** Store catalog public users (WhatsApp-based authentication)

```sql
CREATE TABLE catalog_users (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  whatsapp VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_catalog_users_whatsapp ON catalog_users(whatsapp);
CREATE INDEX idx_catalog_users_created_at ON catalog_users(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_catalog_users_updated_at
  BEFORE UPDATE ON catalog_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**RLS Policies:**
```sql
ALTER TABLE catalog_users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can read own data"
  ON catalog_users FOR SELECT
  USING (whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');

-- Allow public insert (signup)
CREATE POLICY "Public can insert new users"
  ON catalog_users FOR INSERT
  WITH CHECK (true);
```

#### 2. catalog_items

**Purpose:** Extended product metadata for catalog (visibility, featured status, fragrance notes)

```sql
CREATE TABLE catalog_items (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  visible BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  featured_order INTEGER,

  -- Extended metadata
  fragrance_notes_top TEXT,
  fragrance_notes_heart TEXT,
  fragrance_notes_base TEXT,
  occasion TEXT[], -- ['day', 'night', 'casual', 'formal']
  intensity VARCHAR(50), -- 'suave', 'moderada', 'forte'
  longevity VARCHAR(50), -- 'curta', 'media', 'longa', 'muito_longa'
  stock_return_date DATE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_product_catalog UNIQUE(product_id)
);

-- Indexes
CREATE INDEX idx_catalog_items_visible ON catalog_items(visible) WHERE visible = true;
CREATE INDEX idx_catalog_items_featured ON catalog_items(featured, featured_order) WHERE featured = true;
CREATE INDEX idx_catalog_items_product_id ON catalog_items(product_id);

-- Trigger
CREATE TRIGGER update_catalog_items_updated_at
  BEFORE UPDATE ON catalog_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**RLS Policies:**
```sql
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;

-- Public can only see visible items
CREATE POLICY "Public can read visible catalog items"
  ON catalog_items FOR SELECT
  USING (visible = true);

-- Admin full access
CREATE POLICY "Admins can manage all catalog items"
  ON catalog_items FOR ALL
  USING (auth.uid() IS NOT NULL);
```

#### 3. catalog_favorites

**Purpose:** User favorite products

```sql
CREATE TABLE catalog_favorites (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_whatsapp VARCHAR(20) NOT NULL REFERENCES catalog_users(whatsapp) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_user_favorite UNIQUE(user_whatsapp, product_id)
);

-- Indexes
CREATE INDEX idx_catalog_favorites_user ON catalog_favorites(user_whatsapp);
CREATE INDEX idx_catalog_favorites_product ON catalog_favorites(product_id);
CREATE INDEX idx_catalog_favorites_created ON catalog_favorites(created_at DESC);
```

**RLS Policies:**
```sql
ALTER TABLE catalog_favorites ENABLE ROW LEVEL SECURITY;

-- Users manage their own favorites
CREATE POLICY "Users can manage own favorites"
  ON catalog_favorites FOR ALL
  USING (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');
```

#### 4. catalog_cart

**Purpose:** Shopping cart items

```sql
CREATE TABLE catalog_cart (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_whatsapp VARCHAR(20) NOT NULL REFERENCES catalog_users(whatsapp) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_user_cart_item UNIQUE(user_whatsapp, product_id)
);

-- Indexes
CREATE INDEX idx_catalog_cart_user ON catalog_cart(user_whatsapp);
CREATE INDEX idx_catalog_cart_product ON catalog_cart(product_id);

-- Trigger
CREATE TRIGGER update_catalog_cart_updated_at
  BEFORE UPDATE ON catalog_cart
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**RLS Policies:**
```sql
ALTER TABLE catalog_cart ENABLE ROW LEVEL SECURITY;

-- Users manage their own cart
CREATE POLICY "Users can manage own cart"
  ON catalog_cart FOR ALL
  USING (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');
```

#### 5. catalog_requests

**Purpose:** Product requests from customers

```sql
CREATE TYPE catalog_request_status AS ENUM ('pending', 'analyzing', 'fulfilled', 'unavailable');

CREATE TABLE catalog_requests (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_whatsapp VARCHAR(20) NOT NULL REFERENCES catalog_users(whatsapp) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  observations TEXT,
  status catalog_request_status DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_catalog_requests_user ON catalog_requests(user_whatsapp);
CREATE INDEX idx_catalog_requests_status ON catalog_requests(status);
CREATE INDEX idx_catalog_requests_created ON catalog_requests(created_at DESC);

-- Trigger
CREATE TRIGGER update_catalog_requests_updated_at
  BEFORE UPDATE ON catalog_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**RLS Policies:**
```sql
ALTER TABLE catalog_requests ENABLE ROW LEVEL SECURITY;

-- Users can read their own requests and create new ones
CREATE POLICY "Users can read own requests"
  ON catalog_requests FOR SELECT
  USING (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');

CREATE POLICY "Users can create requests"
  ON catalog_requests FOR INSERT
  WITH CHECK (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');

-- Admins can manage all requests
CREATE POLICY "Admins can manage all requests"
  ON catalog_requests FOR ALL
  USING (auth.uid() IS NOT NULL);
```

#### 6. catalog_orders

**Purpose:** Finalized orders sent via WhatsApp

```sql
CREATE TYPE catalog_order_status AS ENUM ('sent', 'contacted', 'converted', 'cancelled');

CREATE TABLE catalog_orders (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_whatsapp VARCHAR(20) NOT NULL REFERENCES catalog_users(whatsapp) ON DELETE CASCADE,
  items JSONB NOT NULL, -- Array of {product_id, name, price, quantity}
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status catalog_order_status DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_catalog_orders_user ON catalog_orders(user_whatsapp);
CREATE INDEX idx_catalog_orders_status ON catalog_orders(status);
CREATE INDEX idx_catalog_orders_created ON catalog_orders(created_at DESC);
CREATE INDEX idx_catalog_orders_items_gin ON catalog_orders USING GIN(items); -- For JSONB queries
```

**RLS Policies:**
```sql
ALTER TABLE catalog_orders ENABLE ROW LEVEL SECURITY;

-- Only admins can read orders
CREATE POLICY "Admins can read all orders"
  ON catalog_orders FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Users can create orders (insert only)
CREATE POLICY "Users can create orders"
  ON catalog_orders FOR INSERT
  WITH CHECK (user_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp');
```

#### 7. catalog_product_views

**Purpose:** Analytics - track product views

```sql
CREATE TABLE catalog_product_views (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_whatsapp VARCHAR(20), -- Nullable for anonymous views
  session_id UUID NOT NULL, -- Client-generated session ID
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_catalog_views_product ON catalog_product_views(product_id, viewed_at DESC);
CREATE INDEX idx_catalog_views_session ON catalog_product_views(session_id, product_id);
```

**RLS Policies:**
```sql
ALTER TABLE catalog_product_views ENABLE ROW LEVEL SECURITY;

-- Only admins can read views
CREATE POLICY "Admins can read product views"
  ON catalog_product_views FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Public can insert views
CREATE POLICY "Public can insert product views"
  ON catalog_product_views FOR INSERT
  WITH CHECK (true);
```

### Migration Strategy

**Migration File:** `supabase/migrations/YYYYMMDDHHMMSS_create_catalog_schema.sql`

```sql
-- ============================================================================
-- Migration: Create Catalog Public Schema
-- Description: Add tables for public catalog functionality
-- Date: 2025-11-09
-- ============================================================================

BEGIN;

-- Create ENUMs first
CREATE TYPE catalog_request_status AS ENUM ('pending', 'analyzing', 'fulfilled', 'unavailable');
CREATE TYPE catalog_order_status AS ENUM ('sent', 'contacted', 'converted', 'cancelled');

-- Create tables (in dependency order)
-- 1. catalog_users (no dependencies)
-- 2. catalog_items (depends on products)
-- 3. catalog_favorites (depends on catalog_users, products)
-- 4. catalog_cart (depends on catalog_users, products)
-- 5. catalog_requests (depends on catalog_users)
-- 6. catalog_orders (depends on catalog_users)
-- 7. catalog_product_views (depends on products)

-- [Insert full CREATE TABLE statements from above]

-- Create RLS policies
-- [Insert all RLS policies from above]

-- Create utility function for updated_at if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMIT;
```

---

## Authentication Architecture

### Custom JWT Authentication (WhatsApp-based)

**Why Custom Auth vs Supabase Auth?**

| Aspect | Supabase Auth | Custom JWT | Decision |
|--------|---------------|------------|----------|
| Complexity | Email/password required | WhatsApp only | **Custom** - Simpler UX |
| User Table | auth.users (separate) | catalog_users | **Custom** - Single source |
| Session Management | Built-in | Cookie + JWT | **Custom** - Full control |
| Cost | Free tier limit | Zero cost | **Custom** - Scalable |
| Isolation | Hard to separate from admin | Easy to isolate | **Custom** - Security |

### Authentication Flow

```typescript
// lib/services/catalog-auth.ts

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(process.env.CATALOG_JWT_SECRET!)
const JWT_TTL = 30 * 24 * 60 * 60 // 30 days in seconds

export interface CatalogUser {
  whatsapp: string
  name: string
}

export async function validateWhatsApp(whatsapp: string): Promise<boolean> {
  // Validate international format: +5511999999999
  const regex = /^\+\d{2}\d{2}\d{8,9}$/
  return regex.test(whatsapp)
}

export async function checkUserExists(whatsapp: string): Promise<CatalogUser | null> {
  const { data, error } = await supabase
    .from('catalog_users')
    .select('whatsapp, name')
    .eq('whatsapp', whatsapp)
    .single()

  return error ? null : data
}

export async function createCatalogUser(whatsapp: string, name: string): Promise<CatalogUser> {
  const { data, error } = await supabase
    .from('catalog_users')
    .insert({ whatsapp, name })
    .select('whatsapp, name')
    .single()

  if (error) throw new Error('Failed to create user')
  return data
}

export async function generateCatalogToken(user: CatalogUser): Promise<string> {
  const token = await new SignJWT({ whatsapp: user.whatsapp, name: user.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${JWT_TTL}s`)
    .sign(JWT_SECRET)

  return token
}

export async function verifyCatalogToken(token: string): Promise<CatalogUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return { whatsapp: payload.whatsapp as string, name: payload.name as string }
  } catch {
    return null
  }
}

export async function setCatalogCookie(token: string) {
  cookies().set('catalog_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: JWT_TTL,
    path: '/catalogo'
  })
}

export async function getCatalogUser(): Promise<CatalogUser | null> {
  const token = cookies().get('catalog_token')?.value
  if (!token) return null
  return verifyCatalogToken(token)
}
```

### Server Action (Authentication Endpoint)

```typescript
// app/catalogo/actions/auth.ts
'use server'

import {
  validateWhatsApp,
  checkUserExists,
  createCatalogUser,
  generateCatalogToken,
  setCatalogCookie,
  type CatalogUser
} from '@/lib/services/catalog-auth'

export interface AuthResponse {
  success: boolean
  user?: CatalogUser
  requiresName?: boolean
  error?: string
}

export async function authenticateWithWhatsApp(
  whatsapp: string,
  name?: string
): Promise<AuthResponse> {
  // Validate format
  if (!await validateWhatsApp(whatsapp)) {
    return { success: false, error: 'WhatsApp inválido. Use formato: +5511999999999' }
  }

  // Check if user exists
  const existingUser = await checkUserExists(whatsapp)

  if (existingUser) {
    // User exists - authenticate
    const token = await generateCatalogToken(existingUser)
    await setCatalogCookie(token)
    return { success: true, user: existingUser }
  }

  // User doesn't exist
  if (!name) {
    // Request name
    return { success: false, requiresName: true }
  }

  // Create new user
  try {
    const newUser = await createCatalogUser(whatsapp, name)
    const token = await generateCatalogToken(newUser)
    await setCatalogCookie(token)
    return { success: true, user: newUser }
  } catch (error) {
    return { success: false, error: 'Erro ao criar usuário. Tente novamente.' }
  }
}
```

### Middleware (Protected Routes)

```typescript
// middleware.ts (extend existing)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyCatalogToken } from '@/lib/services/catalog-auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Catalog protected routes
  if (pathname.startsWith('/catalogo/favoritos') || pathname.startsWith('/catalogo/carrinho')) {
    const token = request.cookies.get('catalog_token')?.value

    if (!token) {
      // Redirect to catalog home with auth modal trigger
      return NextResponse.redirect(new URL('/catalogo?auth=required', request.url))
    }

    const user = await verifyCatalogToken(token)
    if (!user) {
      // Invalid token - clear cookie and redirect
      const response = NextResponse.redirect(new URL('/catalogo?auth=required', request.url))
      response.cookies.delete('catalog_token')
      return response
    }

    // Set user data in request headers for Server Components
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-catalog-user', JSON.stringify(user))

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // ... existing middleware logic for admin routes ...
}

export const config = {
  matcher: [
    '/catalogo/favoritos/:path*',
    '/catalogo/carrinho/:path*',
    '/(authenticated)/:path*'
  ]
}
```

---

## Service Layer & API Contracts

### Service Architecture

```
lib/services/
├── catalog.ts              # Product queries
├── catalog-auth.ts         # Authentication (covered above)
├── catalog-favorites.ts    # Favorites management
├── catalog-cart.ts         # Cart management
├── catalog-requests.ts     # Product requests
├── catalog-orders.ts       # Order creation
├── catalog-analytics.ts    # View tracking & analytics
└── catalog-realtime.ts     # Realtime subscriptions
```

### catalog.ts (Product Service)

```typescript
// lib/services/catalog.ts
import { createClient } from '@/lib/supabase/client'

export interface CatalogProduct {
  id: string
  name: string
  sku: string | null
  image_url: string | null
  sale_price: number
  quantity: number
  category_id: string | null
  category?: {
    id: string
    name: string
    color: string | null
  }
  catalog_details?: {
    fragrance_notes_top: string | null
    fragrance_notes_heart: string | null
    fragrance_notes_base: string | null
    occasion: string[] | null
    intensity: string | null
    longevity: string | null
    stock_return_date: string | null
  }
}

export async function getFeaturedProducts(): Promise<CatalogProduct[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('catalog_items')
    .select(`
      product_id,
      fragrance_notes_top,
      fragrance_notes_heart,
      fragrance_notes_base,
      occasion,
      intensity,
      longevity,
      stock_return_date,
      products:product_id (
        id,
        name,
        sku,
        image_url,
        sale_price,
        quantity,
        category_id,
        categories:category_id (id, name, color)
      )
    `)
    .eq('visible', true)
    .eq('featured', true)
    .order('featured_order', { ascending: true })
    .limit(6)

  if (error) throw error

  return data.map(item => ({
    ...item.products,
    catalog_details: {
      fragrance_notes_top: item.fragrance_notes_top,
      fragrance_notes_heart: item.fragrance_notes_heart,
      fragrance_notes_base: item.fragrance_notes_base,
      occasion: item.occasion,
      intensity: item.intensity,
      longevity: item.longevity,
      stock_return_date: item.stock_return_date
    }
  }))
}

export async function getNewProducts(limit = 10): Promise<CatalogProduct[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('catalog_items')
    .select(`
      created_at,
      products:product_id (
        id, name, sku, image_url, sale_price, quantity, category_id,
        categories:category_id (id, name, color)
      )
    `)
    .eq('visible', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data.map(item => item.products)
}

export async function getProductsByCategory(
  categoryId: string,
  page = 1,
  perPage = 20
): Promise<{ products: CatalogProduct[], total: number }> {
  const supabase = createClient()
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, error, count } = await supabase
    .from('catalog_items')
    .select(`
      products:product_id (
        id, name, sku, image_url, sale_price, quantity, category_id,
        categories:category_id (id, name, color)
      )
    `, { count: 'exact' })
    .eq('visible', true)
    .eq('products.category_id', categoryId)
    .range(from, to)

  if (error) throw error
  return { products: data.map(item => item.products), total: count || 0 }
}

export async function searchProducts(query: string): Promise<CatalogProduct[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('catalog_items')
    .select(`
      products:product_id (
        id, name, sku, image_url, sale_price, quantity, category_id,
        categories:category_id (id, name, color)
      )
    `)
    .eq('visible', true)
    .ilike('products.name', `%${query}%`)
    .limit(50)

  if (error) throw error
  return data.map(item => item.products)
}

export async function getProductDetails(productId: string): Promise<CatalogProduct | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('catalog_items')
    .select(`
      fragrance_notes_top,
      fragrance_notes_heart,
      fragrance_notes_base,
      occasion,
      intensity,
      longevity,
      stock_return_date,
      products:product_id (
        id, name, sku, image_url, sale_price, quantity, category_id,
        categories:category_id (id, name, color)
      )
    `)
    .eq('visible', true)
    .eq('product_id', productId)
    .single()

  if (error) return null

  return {
    ...data.products,
    catalog_details: {
      fragrance_notes_top: data.fragrance_notes_top,
      fragrance_notes_heart: data.fragrance_notes_heart,
      fragrance_notes_base: data.fragrance_notes_base,
      occasion: data.occasion,
      intensity: data.intensity,
      longevity: data.longevity,
      stock_return_date: data.stock_return_date
    }
  }
}
```

### React Query Hooks

```typescript
// lib/hooks/use-catalog.ts
import { useQuery } from '@tanstack/react-query'
import * as catalogService from '@/lib/services/catalog'

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['catalog', 'featured'],
    queryFn: catalogService.getFeaturedProducts,
    staleTime: 60 * 1000, // 1 minute
  })
}

export function useNewProducts(limit = 10) {
  return useQuery({
    queryKey: ['catalog', 'new', limit],
    queryFn: () => catalogService.getNewProducts(limit),
    staleTime: 60 * 1000,
  })
}

export function useProductsByCategory(categoryId: string, page = 1) {
  return useQuery({
    queryKey: ['catalog', 'category', categoryId, page],
    queryFn: () => catalogService.getProductsByCategory(categoryId, page),
    staleTime: 60 * 1000,
    enabled: !!categoryId,
  })
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['catalog', 'search', query],
    queryFn: () => catalogService.searchProducts(query),
    staleTime: 60 * 1000,
    enabled: query.length >= 2,
  })
}

export function useProductDetails(productId: string) {
  return useQuery({
    queryKey: ['catalog', 'product', productId],
    queryFn: () => catalogService.getProductDetails(productId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!productId,
  })
}
```

---

## Real-time Architecture

### Supabase Realtime Setup

#### Database Triggers for Broadcasts

```sql
-- Function to broadcast new catalog request
CREATE OR REPLACE FUNCTION notify_catalog_request()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Get user name
  SELECT name INTO user_name
  FROM catalog_users
  WHERE whatsapp = NEW.user_whatsapp;

  -- Broadcast to 'catalog_requests' channel
  PERFORM pg_notify(
    'catalog_requests',
    json_build_object(
      'id', NEW.id,
      'user_whatsapp', NEW.user_whatsapp,
      'user_name', user_name,
      'product_name', NEW.product_name,
      'observations', NEW.observations,
      'created_at', NEW.created_at
    )::text
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_catalog_request_insert
  AFTER INSERT ON catalog_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_catalog_request();

-- Function to broadcast new order
CREATE OR REPLACE FUNCTION notify_catalog_order()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  items_count INTEGER;
BEGIN
  -- Get user name
  SELECT name INTO user_name
  FROM catalog_users
  WHERE whatsapp = NEW.user_whatsapp;

  -- Count items
  SELECT jsonb_array_length(NEW.items) INTO items_count;

  -- Broadcast to 'catalog_orders' channel
  PERFORM pg_notify(
    'catalog_orders',
    json_build_object(
      'id', NEW.id,
      'user_whatsapp', NEW.user_whatsapp,
      'user_name', user_name,
      'total', NEW.total,
      'items_count', items_count,
      'created_at', NEW.created_at
    )::text
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_catalog_order_insert
  AFTER INSERT ON catalog_orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_catalog_order();
```

#### Client-side Realtime Subscriptions

```typescript
// lib/services/catalog-realtime.ts
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export interface CatalogRequestNotification {
  id: string
  user_whatsapp: string
  user_name: string
  product_name: string
  observations: string | null
  created_at: string
}

export interface CatalogOrderNotification {
  id: string
  user_whatsapp: string
  user_name: string
  total: number
  items_count: number
  created_at: string
}

export function useCatalogRequestsSubscription() {
  const [notifications, setNotifications] = useState<CatalogRequestNotification[]>([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('catalog_requests')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'catalog_requests'
      }, (payload) => {
        const notification = payload.new as CatalogRequestNotification
        setNotifications(prev => [notification, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return notifications
}

export function useCatalogOrdersSubscription() {
  const [notifications, setNotifications] = useState<CatalogOrderNotification[]>([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('catalog_orders')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'catalog_orders'
      }, (payload) => {
        const notification = payload.new as CatalogOrderNotification
        setNotifications(prev => [notification, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return notifications
}
```

---

## Sequence Diagrams

### 1. Authentication Flow

```
┌────────┐         ┌──────────┐         ┌─────────────┐         ┌──────────┐
│ Client │         │AuthModal │         │Server Action│         │ Database │
└───┬────┘         └────┬─────┘         └──────┬──────┘         └────┬─────┘
    │                   │                       │                     │
    │ Click "Favoritar" │                       │                     │
    ├──────────────────►│                       │                     │
    │                   │                       │                     │
    │         Show modal with WhatsApp input    │                     │
    │◄──────────────────┤                       │                     │
    │                   │                       │                     │
    │ Enter WhatsApp    │                       │                     │
    ├──────────────────►│                       │                     │
    │                   │                       │                     │
    │                   │ authenticateWithWhatsApp(whatsapp)          │
    │                   ├──────────────────────►│                     │
    │                   │                       │                     │
    │                   │                       │ SELECT from         │
    │                   │                       │ catalog_users       │
    │                   │                       ├────────────────────►│
    │                   │                       │                     │
    │                   │                       │ User not found      │
    │                   │                       │◄────────────────────┤
    │                   │                       │                     │
    │                   │ {requiresName: true}  │                     │
    │                   │◄──────────────────────┤                     │
    │                   │                       │                     │
    │       Show name input field               │                     │
    │◄──────────────────┤                       │                     │
    │                   │                       │                     │
    │ Enter name        │                       │                     │
    ├──────────────────►│                       │                     │
    │                   │                       │                     │
    │                   │ authenticateWithWhatsApp(whatsapp, name)    │
    │                   ├──────────────────────►│                     │
    │                   │                       │                     │
    │                   │                       │ INSERT into         │
    │                   │                       │ catalog_users       │
    │                   │                       ├────────────────────►│
    │                   │                       │                     │
    │                   │                       │ User created        │
    │                   │                       │◄────────────────────┤
    │                   │                       │                     │
    │                   │                       │ Generate JWT        │
    │                   │                       │ Set cookie          │
    │                   │                       │                     │
    │                   │ {success: true, user} │                     │
    │                   │◄──────────────────────┤                     │
    │                   │                       │                     │
    │       Close modal, update auth state      │                     │
    │◄──────────────────┤                       │                     │
    │                   │                       │                     │
```

### 2. Cart Checkout Flow

```
┌────────┐    ┌─────────┐    ┌──────────────┐    ┌──────────┐    ┌─────────┐
│ Client │    │Cart Page│    │ Server Action│    │ Database │    │WhatsApp │
└───┬────┘    └────┬────┘    └──────┬───────┘    └────┬─────┘    └────┬────┘
    │              │                 │                 │               │
    │ Click        │                 │                 │               │
    │ "Finalizar"  │                 │                 │               │
    ├─────────────►│                 │                 │               │
    │              │                 │                 │               │
    │              │ generateWhatsAppMessage(cart)     │               │
    │              ├────────────────►│                 │               │
    │              │                 │                 │               │
    │              │                 │ Format message  │               │
    │              │                 │ with products   │               │
    │              │                 │                 │               │
    │              │ message string  │                 │               │
    │              │◄────────────────┤                 │               │
    │              │                 │                 │               │
    │    Show confirmation modal     │                 │               │
    │    with preview                │                 │               │
    │◄─────────────┤                 │                 │               │
    │              │                 │                 │               │
    │ Confirm      │                 │                 │               │
    ├─────────────►│                 │                 │               │
    │              │                 │                 │               │
    │              │ createOrder(cart, user)           │               │
    │              ├────────────────►│                 │               │
    │              │                 │                 │               │
    │              │                 │ INSERT into     │               │
    │              │                 │ catalog_orders  │               │
    │              │                 ├────────────────►│               │
    │              │                 │                 │               │
    │              │                 │ ⚡ TRIGGER      │               │
    │              │                 │ after_insert    │               │
    │              │                 │ fires           │               │
    │              │                 │                 │               │
    │              │                 │ 📡 Realtime     │               │
    │              │                 │ broadcast       │               │
    │              │                 │ (to admin)      │               │
    │              │                 │                 │               │
    │              │ {success, orderId}                │               │
    │              │◄────────────────┤                 │               │
    │              │                 │                 │               │
    │              │ clearCart(user) │                 ��               │
    │              ├────────────────►│                 │               │
    │              │                 │                 │               │
    │              │                 │ DELETE from     │               │
    │              │                 │ catalog_cart    │               │
    │              │                 ├────────────────►│               │
    │              │                 │                 │               │
    │              │ Open WhatsApp   │                 │               │
    │              │ deep link       │                 │               │
    ├─────────────────────────────────────────────────────────────────►│
    │              │                 │                 │               │
    │              │                 │                 │  Message      │
    │              │                 │                 │  pre-filled   │
    │              │                 │                 │               │
```

### 3. Real-time Notification Flow (Admin)

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌────────────┐
│ Client  │    │ Database │    │  Trigger │    │Admin Panel │
│(Catalog)│    │          │    │          │    │(Subscribed)│
└────┬────┘    └────┬─────┘    └────┬─────┘    └─────┬──────┘
     │              │               │                 │
     │ Create       │               │                 │
     │ Request      │               │                 │
     ├─────────────►│               │                 │
     │              │               │                 │
     │              │ INSERT into   │                 │
     │              │ catalog_      │                 │
     │              │ requests      │                 │
     │              │               │                 │
     │              │ ⚡ AFTER      │                 │
     │              │ INSERT        │                 │
     │              ├──────────────►│                 │
     │              │               │                 │
     │              │               │ Execute         │
     │              │               │ notify_catalog_ │
     │              │               │ request()       │
     │              │               │                 │
     │              │               │ pg_notify()     │
     │              │               │ 'catalog_       │
     │              │               │ requests'       │
     │              │               │                 │
     │              │               │ 📡 WebSocket    │
     │              │               │ Broadcast       │
     │              │               ├────────────────►│
     │              │               │                 │
     │              │               │          🔔 Notification
     │              │               │          appears
     │              │               │          Badge +1
     │              │               │          Toast shown
     │              │               │                 │
```

---

## Performance Strategy

### Rendering Strategy

| Page | Strategy | Revalidation | Rationale |
|------|----------|--------------|-----------|
| `/catalogo` (home) | ISR | 60s | Static speed + fresh data, low churn |
| `/catalogo/produtos` | SSR | N/A | Dynamic filters/search, user-specific |
| `/catalogo/produto/[id]` | ISR | 60s | Static per-product, SEO benefit |
| `/catalogo/favoritos` | SSR | N/A | User-specific, requires auth |
| `/catalogo/carrinho` | SSR | N/A | User-specific, real-time updates |

### Caching Strategy

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

### Image Optimization

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

### Prefetching Strategy

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

### Performance Budget

| Metric | Target | Rationale |
|--------|--------|-----------|
| **LCP** | < 2.5s | Core Web Vital - largest contentful paint |
| **FID** | < 100ms | Core Web Vital - first input delay |
| **CLS** | < 0.1 | Core Web Vital - cumulative layout shift |
| **TTI** | < 3.5s | Time to interactive on 3G |
| **Bundle Size** | < 200KB | Initial JS bundle (gzipped) |
| **Image Size** | < 100KB | Product images (WebP, optimized) |

---

## Security Architecture

### Row-Level Security (RLS) Matrix

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

### Security Checklist

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

### Rate Limiting Implementation

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

## SEO & Meta Tags Strategy

### Dynamic Meta Tags (Product Pages)

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

### Structured Data (Schema.org)

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

### Dynamic Sitemap

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

## Technical Debt & Trade-offs

### Accepted Trade-offs

| Decision | Trade-off | Mitigation Plan |
|----------|-----------|-----------------|
| **Shared Database** | Potential performance impact on admin queries | Monitor slow queries, add indexes, consider read replica at 10k+ users |
| **Custom Auth** | No built-in password reset, 2FA | Document manual recovery process, add 2FA in v2 if needed |
| **WhatsApp Deep Links** | No delivery confirmation | Track `catalog_orders` status manually, add webhook integration later |
| **No SMS Verification** | Potential fake signups | Rate limiting + manual admin review for first orders |
| **Monolith Architecture** | Harder to scale independently | Monitor traffic, plan microservice extraction if catalog grows 10x |
| **ISR 60s revalidation** | Stale data for up to 1 minute | Acceptable for product catalog, use on-demand revalidation for critical updates |

### Future Optimization Opportunities

1. **Edge Caching for Static Assets** (Vercel Edge Network)
2. **Database Read Replicas** (if catalog traffic >> admin traffic)
3. **WhatsApp Business API Integration** (for order confirmations)
4. **Full-text Search with PostgreSQL pg_trgm** (better than ILIKE)
5. **Image CDN with automatic transformations** (Cloudinary/ImageKit)
6. **Service Worker for offline catalog browsing**
7. **A/B testing framework for conversion optimization**

---

## Appendix: Folder Structure

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

