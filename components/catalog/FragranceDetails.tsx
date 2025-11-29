/**
 * Fragrance Details Component
 * Premium display of fragrance notes with visual meters
 * Based on front-end-spec-catalogo.md
 */

'use client'

import { useState } from 'react'
import { Music, Sparkles, Clock, Droplet, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CatalogProduct } from '@/lib/services/catalog'

interface FragranceDetailsProps {
  product: CatalogProduct
}

// Map text intensity/longevity to percentage
const intensityMap: Record<string, number> = {
  'Leve': 25,
  'Suave': 35,
  'Moderada': 50,
  'Moderado': 50,
  'Forte': 75,
  'Intensa': 85,
  'Intenso': 85,
  'Muito Forte': 95,
}

const longevityMap: Record<string, number> = {
  'Curta': 20,
  '2-4 horas': 25,
  '4-6 horas': 40,
  'Moderada': 50,
  '6-8 horas': 60,
  'Longa': 75,
  '8-12 horas': 80,
  'Muito Longa': 90,
  '+12 horas': 95,
}

function IntensityMeter({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <span className="flex items-center gap-2 font-medium">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="p-4 pt-0 border-t border-border">{children}</div>
      </div>
    </div>
  )
}

export function FragranceDetails({ product }: FragranceDetailsProps) {
  const hasNotes =
    product.fragrance_notes_top ||
    product.fragrance_notes_heart ||
    product.fragrance_notes_base

  const hasMetrics = product.intensity || product.longevity
  const hasOccasion = product.occasion && product.occasion.length > 0

  if (!hasNotes && !hasMetrics && !hasOccasion) {
    return null
  }

  const intensityPercent = product.intensity
    ? intensityMap[product.intensity] || 50
    : 0
  const longevityPercent = product.longevity
    ? longevityMap[product.longevity] || 50
    : 0

  return (
    <div className="space-y-4">
      {/* Fragrance Notes Card */}
      {hasNotes && (
        <div className="bg-muted/30 rounded-2xl p-5 space-y-4">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Music className="h-5 w-5 text-primary" />
            Notas da Fragrância
          </h3>

          <div className="space-y-3">
            {product.fragrance_notes_top && (
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-20 text-xs font-medium uppercase tracking-wider text-muted-foreground pt-0.5">
                  Topo
                </span>
                <p className="text-sm text-foreground">
                  {product.fragrance_notes_top}
                </p>
              </div>
            )}

            {product.fragrance_notes_heart && (
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-20 text-xs font-medium uppercase tracking-wider text-muted-foreground pt-0.5">
                  Coração
                </span>
                <p className="text-sm text-foreground">
                  {product.fragrance_notes_heart}
                </p>
              </div>
            )}

            {product.fragrance_notes_base && (
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-20 text-xs font-medium uppercase tracking-wider text-muted-foreground pt-0.5">
                  Base
                </span>
                <p className="text-sm text-foreground">
                  {product.fragrance_notes_base}
                </p>
              </div>
            )}
          </div>

          {/* Visual Meters */}
          {hasMetrics && (
            <div className="pt-4 border-t border-border/50 space-y-4">
              {product.intensity && (
                <IntensityMeter
                  value={intensityPercent}
                  label={`Intensidade: ${product.intensity}`}
                />
              )}
              {product.longevity && (
                <IntensityMeter
                  value={longevityPercent}
                  label={`Longevidade: ${product.longevity}`}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Occasion Section */}
      {hasOccasion && (
        <CollapsibleSection title="Ocasiões" icon={Sparkles}>
          <div className="flex flex-wrap gap-2 pt-2">
            {product.occasion?.map((occasion, index) => (
              <span
                key={index}
                className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-full"
              >
                {occasion}
              </span>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Metrics without notes - show standalone */}
      {!hasNotes && hasMetrics && (
        <div className="bg-muted/30 rounded-2xl p-5 space-y-4">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Droplet className="h-5 w-5 text-primary" />
            Características
          </h3>
          <div className="space-y-4">
            {product.intensity && (
              <IntensityMeter
                value={intensityPercent}
                label={`Intensidade: ${product.intensity}`}
              />
            )}
            {product.longevity && (
              <IntensityMeter
                value={longevityPercent}
                label={`Longevidade: ${product.longevity}`}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
