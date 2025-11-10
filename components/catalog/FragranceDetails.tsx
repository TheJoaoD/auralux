/**
 * Fragrance Details Component
 * Epic 2 - Story 2.4: Detalhes do Produto
 *
 * Displays fragrance notes and metadata (occasion, intensity, longevity)
 */

import { Sparkles, Clock, Droplet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { CatalogProduct } from '@/lib/services/catalog'

interface FragranceDetailsProps {
  product: CatalogProduct
}

export function FragranceDetails({ product }: FragranceDetailsProps) {
  return (
    <div className="space-y-6 border-t pt-6">
      <h2 className="text-xl font-semibold text-foreground">
        Detalhes de Fragrância
      </h2>

      {/* Fragrance Notes */}
      {(product.fragrance_notes_top ||
        product.fragrance_notes_heart ||
        product.fragrance_notes_base) && (
        <div className="space-y-4">
          {product.fragrance_notes_top && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">
                Notas de Topo
              </h3>
              <p className="text-muted-foreground">{product.fragrance_notes_top}</p>
            </div>
          )}

          {product.fragrance_notes_heart && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">
                Notas de Coração
              </h3>
              <p className="text-muted-foreground">{product.fragrance_notes_heart}</p>
            </div>
          )}

          {product.fragrance_notes_base && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">
                Notas de Fundo
              </h3>
              <p className="text-muted-foreground">{product.fragrance_notes_base}</p>
            </div>
          )}
        </div>
      )}

      {/* Metadata Chips */}
      <div className="flex flex-wrap gap-2">
        {product.occasion && product.occasion.length > 0 && (
          <Badge variant="outline" className="gap-1.5">
            <Sparkles className="h-3 w-3" />
            Ocasião: {product.occasion.join(', ')}
          </Badge>
        )}

        {product.intensity && (
          <Badge variant="outline" className="gap-1.5">
            <Droplet className="h-3 w-3" />
            Intensidade: {product.intensity}
          </Badge>
        )}

        {product.longevity && (
          <Badge variant="outline" className="gap-1.5">
            <Clock className="h-3 w-3" />
            Durabilidade: {product.longevity}
          </Badge>
        )}
      </div>
    </div>
  )
}
