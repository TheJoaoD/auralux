/**
 * Catalog Header Component
 * Premium mobile-first design - Vitrine pública
 */

'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CatalogHeaderProps {
  onSearchClick?: () => void
}

export function CatalogHeader({ onSearchClick }: CatalogHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/50">
      <div className="container mx-auto px-4">
        {/* Mobile Header - Clean and minimal */}
        <div className="flex md:hidden h-14 items-center justify-between">
          {/* Logo centered */}
          <Link href="/catalogo" className="absolute left-1/2 -translate-x-1/2">
            <span className="text-xl font-bold gradient-text">
              ✦ AURALUX ✦
            </span>
          </Link>

          {/* Search icon right */}
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary touch-target"
              onClick={onSearchClick}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          </div>
        </div>

        {/* Desktop Header - Full featured */}
        <div className="hidden md:flex h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/catalogo" className="flex items-center shrink-0">
            <span className="text-2xl font-bold gradient-text">
              ✦ AURALUX ✦
            </span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar perfumes..."
                className="pl-11 h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary rounded-full"
                onClick={onSearchClick}
                readOnly
              />
            </div>
          </div>

          {/* Spacer for balance */}
          <div className="w-24" />
        </div>
      </div>
    </header>
  )
}
