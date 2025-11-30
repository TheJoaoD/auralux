/**
 * Bottom Navigation Component
 * Premium mobile-first navigation bar - Vitrine pública
 */

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Search, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  icon: typeof Home
  label: string
  href: string
}

const navItems: NavItem[] = [
  { id: 'home', icon: Home, label: 'Home', href: '/catalogo' },
  { id: 'products', icon: Grid3X3, label: 'Produtos', href: '/catalogo/produtos' },
]

interface BottomNavigationProps {
  onSearchClick?: () => void
}

export function BottomNavigation({ onSearchClick }: BottomNavigationProps) {
  const pathname = usePathname()

  // Hide on product detail pages (they have their own action buttons)
  const isProductPage = pathname.startsWith('/catalogo/produto/')

  const isActive = (href: string) => {
    if (href === '/catalogo') {
      return pathname === '/catalogo'
    }
    return pathname.startsWith(href)
  }

  // Don't render on product detail pages
  if (isProductPage) {
    return null
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border/50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.id}
              href={item.href}
              className="outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
            >
              <div className="flex flex-col items-center justify-center touch-target relative">
                <Icon
                  className={cn(
                    'h-6 w-6 transition-colors duration-150',
                    active ? 'text-primary' : 'text-muted-foreground'
                  )}
                  fill={active && item.id === 'home' ? 'currentColor' : 'none'}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className={cn(
                    'text-[10px] mt-1 font-medium transition-colors duration-150',
                    active ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          )
        })}

        {/* Search button - opens modal, not a link */}
        <button
          onClick={onSearchClick}
          className="outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
        >
          <div className="flex flex-col items-center justify-center touch-target relative">
            <Search
              className="h-6 w-6 transition-colors duration-150 text-muted-foreground"
              strokeWidth={2}
            />
            <span className="text-[10px] mt-1 font-medium transition-colors duration-150 text-muted-foreground">
              Buscar
            </span>
          </div>
        </button>
      </div>
    </nav>
  )
}
