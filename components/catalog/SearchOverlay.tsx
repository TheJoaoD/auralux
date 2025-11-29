/**
 * Search Overlay Component
 * Full-screen immersive search experience
 * Based on front-end-spec-catalogo.md
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { fetchSearchProducts } from '@/app/catalogo/actions/catalog'
import type { CatalogProduct } from '@/types/catalog'
import Image from 'next/image'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const RECENT_SEARCHES_KEY = 'auralux_recent_searches'
const MAX_RECENT_SEARCHES = 5

const popularSearches = [
  'Sauvage',
  'Good Girl',
  '212 VIP',
  'One Million',
  'La Vie Est Belle',
]

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CatalogProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (stored) {
        setRecentSearches(JSON.parse(stored))
      }
    }
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const data = await fetchSearchProducts(query, 1, 5)
        setResults(data.products)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const saveRecentSearch = useCallback((term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, MAX_RECENT_SEARCHES)
    setRecentSearches(updated)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  }, [recentSearches])

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  }

  const handleSearch = (term: string) => {
    if (term.trim()) {
      saveRecentSearch(term.trim())
      router.push(`/catalogo/produtos?q=${encodeURIComponent(term.trim())}`)
      onClose()
    }
  }

  const handleProductClick = (product: CatalogProduct) => {
    saveRecentSearch(product.name)
    router.push(`/catalogo/produto/${product.id}`)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background animate-[fade-in_200ms_ease-out]">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Buscar perfumes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-12 w-12 shrink-0"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Fechar busca</span>
          </Button>
        </form>
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100vh-80px)] pb-safe">
        {query.trim() ? (
          // Search Results
          <div className="p-4">
            {isLoading ? (
              // Loading skeletons
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <div className="h-16 w-16 rounded-lg skeleton-shimmer" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded skeleton-shimmer" />
                      <div className="h-4 w-1/4 rounded skeleton-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              // Results list
              <div className="space-y-2">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Search className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-primary font-semibold">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(product.sale_price)}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </button>
                ))}

                {/* View all results */}
                <button
                  onClick={() => handleSearch(query)}
                  className="w-full p-4 text-center text-primary font-medium hover:bg-muted/50 rounded-lg transition-colors"
                >
                  Ver todos os resultados
                </button>
              </div>
            ) : (
              // No results
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhum resultado para "{query}"
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Tente outros termos ou explore as categorias
                </p>
              </div>
            )}
          </div>
        ) : (
          // Default state - recent searches and popular
          <div className="p-4 space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Buscas Recentes
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Limpar
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(term)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Popular Searches */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Populares Agora
              </h3>
              <div className="space-y-1">
                {popularSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(term)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Quick Categories */}
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Categorias
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { emoji: '👨', label: 'Masc', href: '/catalogo/produtos?categoria=masculino' },
                  { emoji: '👩', label: 'Fem', href: '/catalogo/produtos?categoria=feminino' },
                  { emoji: '✨', label: 'Unissex', href: '/catalogo/produtos?categoria=unissex' },
                  { emoji: '🕌', label: 'Árabe', href: '/catalogo/produtos?categoria=arabe' },
                ].map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => {
                      router.push(cat.href)
                      onClose()
                    }}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-2xl mb-1">{cat.emoji}</span>
                    <span className="text-xs font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
