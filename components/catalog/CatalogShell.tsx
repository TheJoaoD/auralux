/**
 * Catalog Shell Component
 * Wraps the entire catalog with navigation components
 * Based on front-end-spec-catalogo.md
 */

'use client'

import { useState } from 'react'
import { CatalogHeader } from './CatalogHeader'
import { CatalogFooter } from './CatalogFooter'
import { BottomNavigation } from './BottomNavigation'
import { SearchOverlay } from './SearchOverlay'

interface CatalogShellProps {
  children: React.ReactNode
}

export function CatalogShell({ children }: CatalogShellProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CatalogHeader onSearchClick={() => setIsSearchOpen(true)} />

      <main className="flex-1 pb-safe md:pb-0">
        {children}
      </main>

      {/* Footer - hidden on mobile, visible on desktop */}
      <div className="hidden md:block">
        <CatalogFooter />
      </div>

      {/* Bottom Navigation - mobile only */}
      <BottomNavigation
        onSearchClick={() => setIsSearchOpen(true)}
      />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  )
}
