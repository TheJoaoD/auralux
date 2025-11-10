# Authentication Architecture

## Custom JWT Authentication (WhatsApp-based)

**Why Custom Auth vs Supabase Auth?**

| Aspect | Supabase Auth | Custom JWT | Decision |
|--------|---------------|------------|----------|
| Complexity | Email/password required | WhatsApp only | **Custom** - Simpler UX |
| User Table | auth.users (separate) | catalog_users | **Custom** - Single source |
| Session Management | Built-in | Cookie + JWT | **Custom** - Full control |
| Cost | Free tier limit | Zero cost | **Custom** - Scalable |
| Isolation | Hard to separate from admin | Easy to isolate | **Custom** - Security |

## Authentication Flow

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

## Server Action (Authentication Endpoint)

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

## Middleware (Protected Routes)

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
