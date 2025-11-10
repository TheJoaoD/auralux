/**
 * WhatsApp Utilities
 * Epic 3 - Story 3.3: WhatsApp Checkout
 *
 * Generates WhatsApp deep links for order checkout
 */

import type { CartItem } from '@/lib/services/catalog-cart'

export interface WhatsAppMessageData {
  userName: string
  userWhatsapp: string
  items: CartItem[]
  total: number
}

/**
 * Generate formatted WhatsApp message for order
 */
export function generateWhatsAppMessage(data: WhatsAppMessageData): string {
  const { userName, userWhatsapp, items, total } = data

  // Format items list
  const itemsList = items
    .map((item, index) => {
      const product = item.product
      if (!product) return ''

      const itemTotal = product.sale_price * item.quantity
      return `${index + 1}. ${product.name} (${item.quantity}x) - R$ ${itemTotal.toFixed(2)}`
    })
    .filter(Boolean)
    .join('\n')

  // Build complete message
  const message = `🛍️ *Novo Pedido - Auralux*

📋 *Itens:*
${itemsList}

💰 *Total: R$ ${total.toFixed(2)}*

👤 *Cliente:*
Nome: ${userName}
WhatsApp: ${userWhatsapp}

_Pedido enviado via Catálogo Auralux_`

  return message
}

/**
 * Generate WhatsApp deep link URL
 */
export function generateWhatsAppLink(message: string, phoneNumber?: string): string {
  const businessPhone = phoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS || ''

  // Remove all non-numeric characters from phone
  const cleanPhone = businessPhone.replace(/\D/g, '')

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message)

  // Generate wa.me link
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
}

/**
 * Open WhatsApp with pre-filled message
 */
export function openWhatsApp(message: string, phoneNumber?: string): void {
  const url = generateWhatsAppLink(message, phoneNumber)
  window.open(url, '_blank')
}
