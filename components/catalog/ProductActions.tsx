/**
 * Product Actions Component
 * Sticky bottom bar with WhatsApp contact button
 */

'use client'

import { MessageCircle, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CatalogProduct } from '@/lib/services/catalog'

interface ProductActionsProps {
  product: CatalogProduct
}

// WhatsApp do gestor (configurável via env ou settings)
const STORE_WHATSAPP = process.env.NEXT_PUBLIC_STORE_WHATSAPP || '+5563992933735'

export function ProductActions({ product }: ProductActionsProps) {
  const isOutOfStock = product.quantity === 0

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Olá! Tenho interesse no produto:\n\n` +
      `*${product.name}*\n` +
      `Preço: R$ ${product.sale_price.toFixed(2)}\n` +
      (product.sku ? `Ref: ${product.sku}\n` : '') +
      `\nPoderia me dar mais informações?`
    )

    const whatsappUrl = `https://wa.me/${STORE_WHATSAPP.replace(/\D/g, '')}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Confira: ${product.name} - R$ ${product.sale_price.toFixed(2)}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-3">
          {/* Share Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleShare}
            className="h-14 px-6 rounded-xl border-2 hover:border-primary/50"
          >
            <Share2 className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:ml-2">
              Compartilhar
            </span>
          </Button>

          {/* WhatsApp Button */}
          <Button
            size="lg"
            onClick={handleWhatsAppClick}
            disabled={isOutOfStock}
            className={cn(
              'flex-1 h-14 text-base font-semibold rounded-xl transition-all duration-200',
              'bg-green-600 hover:bg-green-700 text-white'
            )}
          >
            {isOutOfStock ? (
              <span>Indisponível</span>
            ) : (
              <span className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Falar no WhatsApp
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
