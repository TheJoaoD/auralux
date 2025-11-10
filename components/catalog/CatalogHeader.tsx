/**
 * Catalog Header Component
 * Epic 1 - Story 1.4: Estrutura de Rotas e Layout
 * Epic 3 - Story 3.1: Favorites counter badge
 * Epic 3 - Story 3.2: Cart counter badge
 */

'use client'

import Link from 'next/link'
import { Search, ShoppingCart, Heart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFavoritesCount } from '@/lib/hooks/use-favorites'
import { useCartCount } from '@/lib/hooks/use-cart'
import { useCatalogAuth } from '@/lib/providers/catalog-auth-provider'

export function CatalogHeader() {
  const { isAuthenticated } = useCatalogAuth()
  const { data: favoritesCount = 0 } = useFavoritesCount()
  const { data: cartCount = 0 } = useCartCount()
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/catalogo" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Auralux
            </span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar perfumes..."
                className="pl-10 bg-muted/50 border-border focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Favorites (desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex relative text-muted-foreground hover:text-primary"
              asChild
            >
              <Link href="/catalogo/favoritos">
                <Heart className="h-5 w-5" />
                {isAuthenticated && favoritesCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {favoritesCount > 9 ? '9+' : favoritesCount}
                  </span>
                )}
                <span className="sr-only">Favoritos</span>
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-primary"
              asChild
            >
              <Link href="/catalogo/carrinho">
                <ShoppingCart className="h-5 w-5" />
                {isAuthenticated && cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
                <span className="sr-only">Carrinho</span>
              </Link>
            </Button>

            {/* User menu */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Minha conta</span>
            </Button>
          </div>
        </div>

        {/* Search bar (mobile) */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar perfumes..."
              className="pl-10 bg-muted/50 border-border focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
