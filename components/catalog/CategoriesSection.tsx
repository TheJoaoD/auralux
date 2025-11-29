/**
 * Categories Section
 * Premium visual category cards
 * Based on front-end-spec-catalogo.md
 */

'use client'

import Link from 'next/link'
import { Layers } from 'lucide-react'
import { useCategories } from '@/lib/hooks/use-catalog'
import { cn } from '@/lib/utils'

// Category visual configurations
const categoryConfig: Record<string, { emoji: string; gradient: string }> = {
  masculino: { emoji: '👨', gradient: 'from-blue-600/80 to-slate-900/80' },
  feminino: { emoji: '👩', gradient: 'from-pink-500/80 to-purple-900/80' },
  unissex: { emoji: '✨', gradient: 'from-amber-500/80 to-orange-900/80' },
  arabe: { emoji: '🕌', gradient: 'from-emerald-600/80 to-teal-900/80' },
  nicho: { emoji: '💎', gradient: 'from-violet-600/80 to-indigo-900/80' },
}

export function CategoriesSection() {
  const { data: categories, isLoading, error } = useCategories()

  if (error) {
    return null
  }

  const featuredCategories = categories?.slice(0, 4) || []

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Layers className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Categorias
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Explore por Estilo
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-2xl skeleton-shimmer"
                />
              ))
            : featuredCategories.map((category) => {
                const config = categoryConfig[category.name.toLowerCase()] || {
                  emoji: '🌟',
                  gradient: 'from-primary/80 to-accent/80',
                }

                return (
                  <Link
                    key={category.id}
                    href={`/catalogo/categoria/${category.id}`}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden catalog-card"
                  >
                    {/* Background gradient */}
                    <div
                      className={cn(
                        'absolute inset-0 bg-gradient-to-br transition-all duration-300',
                        config.gradient,
                        'group-hover:scale-105'
                      )}
                    />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                      <span className="text-5xl md:text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {config.emoji}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-center">
                        {category.name}
                      </h3>
                      <p className="text-xs text-white/70 mt-1">
                        {category.product_count || 0} produtos
                      </p>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                )
              })}
        </div>
      </div>
    </section>
  )
}
