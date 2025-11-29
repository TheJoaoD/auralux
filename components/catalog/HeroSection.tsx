/**
 * Hero Section Component
 * Full-screen premium hero with parallax effect
 * Based on front-end-spec-catalogo.md
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  variant?: 'fullscreen' | 'standard' | 'compact'
  title?: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  backgroundImage?: string
}

export function HeroSection({
  variant = 'standard',
  title = 'Descubra sua Fragrância Perfeita',
  subtitle = 'Perfumes de luxo cuidadosamente selecionados para você',
  ctaText = 'Explorar',
  ctaHref = '/catalogo/produtos',
  backgroundImage,
}: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heightClass = {
    fullscreen: 'h-screen',
    standard: 'h-[70vh] min-h-[500px]',
    compact: 'h-[50vh] min-h-[400px]',
  }[variant]

  // Parallax effect - slower background movement
  const parallaxOffset = scrollY * 0.3

  return (
    <section className={cn('relative overflow-hidden', heightClass)}>
      {/* Background with gradient and parallax */}
      <div
        className="absolute inset-0 transition-transform duration-100"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/40 to-accent/30" />

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '1s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-white/10 blur-2xl animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '2s' }}
          />
        </div>

        {/* Optional background image */}
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <div
          className={cn(
            'max-w-2xl space-y-6 transition-all duration-700 transform',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-3 text-primary/80">
            <span className="h-px w-12 bg-current" />
            <span className="text-sm font-medium tracking-[0.3em] uppercase">Premium</span>
            <span className="h-px w-12 bg-current" />
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
            <span className="gradient-text">{title}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
            {subtitle}
          </p>

          {/* CTA Button */}
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
          >
            {ctaText}
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </Link>
        </div>

        {/* Scroll indicator */}
        {variant === 'fullscreen' && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs font-medium tracking-wider uppercase">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1">
              <div className="w-1.5 h-3 rounded-full bg-current animate-bounce" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
