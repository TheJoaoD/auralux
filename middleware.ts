import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { verifyCatalogToken } from '@/lib/services/catalog-auth'

// Protected catalog routes that require authentication
const PROTECTED_CATALOG_ROUTES = ['/catalogo/favoritos', '/catalogo/carrinho']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if accessing protected catalog route
  const isProtectedCatalogRoute = PROTECTED_CATALOG_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedCatalogRoute) {
    const catalogToken = request.cookies.get('catalog_token')?.value

    if (!catalogToken) {
      // Redirect to catalog home if not authenticated
      const redirectUrl = new URL('/catalogo', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Verify token
    const payload = await verifyCatalogToken(catalogToken)

    if (!payload) {
      // Invalid/expired token - redirect to catalog home
      const redirectUrl = new URL('/catalogo', request.url)
      const response = NextResponse.redirect(redirectUrl)
      // Clear invalid cookie
      response.cookies.delete('catalog_token')
      return response
    }

    // Token valid - attach user data to request headers for use in page components
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-catalog-user-whatsapp', payload.whatsapp)
    requestHeaders.set('x-catalog-user-name', payload.name)

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    return response
  }

  // For non-catalog routes, use default Supabase session handling
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
