/**
 * Cart Client Component
 * Epic 3 - Story 3.2 & 3.3: Cart System + WhatsApp Checkout
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart, useUpdateCartQuantity, useRemoveFromCart, useClearCart } from '@/lib/hooks/use-cart'
import { useCatalogAuth } from '@/lib/providers/catalog-auth-provider'
import { createCatalogOrder } from '@/app/catalogo/actions/orders'
import { generateWhatsAppMessage, openWhatsApp } from '@/lib/utils/whatsapp'
import { toast } from 'sonner'
import type { CartItem } from '@/lib/services/catalog-cart'

/**
 * Convert cart items to order items format
 */
function cartToOrderItems(cart: CartItem[]) {
  return cart.map((item) => {
    const product = item.product
    if (!product) {
      throw new Error('Product data missing from cart item')
    }

    return {
      product_id: item.product_id,
      product_name: product.name,
      quantity: item.quantity,
      unit_price: product.sale_price,
      total_price: product.sale_price * item.quantity,
    }
  })
}

export function CartClient() {
  const { user } = useCatalogAuth()
  const { data: cart = [], isLoading } = useCart()
  const updateQuantity = useUpdateCartQuantity()
  const removeFromCart = useRemoveFromCart()
  const clearCart = useClearCart()

  const [checkoutData, setCheckoutData] = useState({
    name: user?.user_metadata?.name || '',
    whatsapp: user?.phone || '',
  })
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Calculate total
  const total = cart.reduce((sum, item) => {
    const product = item.product
    if (!product) return sum
    return sum + product.sale_price * item.quantity
  }, 0)

  // Handle quantity change
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    updateQuantity.mutate({
      productId,
      quantity: newQuantity,
    })
  }

  // Handle checkout
  const handleCheckout = async () => {
    if (!checkoutData.name.trim() || !checkoutData.whatsapp.trim()) {
      toast.error('Preencha seu nome e WhatsApp')
      return
    }

    if (cart.length === 0) {
      toast.error('Carrinho vazio')
      return
    }

    try {
      setIsCheckingOut(true)

      // Create order in database
      const orderItems = cartToOrderItems(cart)
      const orderId = await createCatalogOrder({
        items: orderItems,
        total_amount: total,
        user_whatsapp: checkoutData.whatsapp,
        user_name: checkoutData.name,
      })

      // Generate WhatsApp message
      const message = generateWhatsAppMessage({
        userName: checkoutData.name,
        userWhatsapp: checkoutData.whatsapp,
        items: cart,
        total,
      })

      // Open WhatsApp
      openWhatsApp(message)

      // Clear cart
      clearCart.mutate()

      toast.success('Pedido enviado! Você será redirecionado para o WhatsApp.')
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao finalizar pedido')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-24 bg-gray-200 rounded" />
          </Card>
        ))}
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Seu carrinho está vazio
        </h2>
        <p className="text-muted-foreground mb-6">
          Adicione produtos ao carrinho para finalizar seu pedido
        </p>
        <Button asChild>
          <a href="/catalogo">Explorar Produtos</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cart.map((item) => {
          const product = item.product
          if (!product) return null

          const itemTotal = product.sale_price * item.quantity

          return (
            <Card key={item.product_id} className="p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted/50">
                  {product.photo_url ? (
                    <Image
                      src={product.photo_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ShoppingCart className="h-8 w-8" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      R$ {product.sale_price.toFixed(2)} / unidade
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(item.product_id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1 || updateQuantity.isPending}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleQuantityChange(item.product_id, item.quantity + 1)
                        }
                        disabled={
                          item.quantity >= product.quantity || updateQuantity.isPending
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeFromCart.mutate(item.product_id)}
                      disabled={removeFromCart.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    R$ {itemTotal.toFixed(2)}
                  </p>
                  {item.quantity >= product.quantity && (
                    <p className="text-xs text-primary">Estoque máximo</p>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Checkout Summary */}
      <div className="lg:col-span-1">
        <Card className="p-6 sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

          {/* Customer Info */}
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={checkoutData.name}
                onChange={(e) =>
                  setCheckoutData({ ...checkoutData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="(00) 00000-0000"
                value={checkoutData.whatsapp}
                onChange={(e) =>
                  setCheckoutData({ ...checkoutData, whatsapp: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-2 mb-6 pb-6 border-b">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Itens</span>
              <span className="font-medium">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-semibold mb-6">
            <span>Total</span>
            <span className="text-primary">R$ {total.toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleCheckout}
            disabled={isCheckingOut || cart.length === 0}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            {isCheckingOut ? 'Finalizando...' : 'Finalizar via WhatsApp'}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Você será redirecionado para o WhatsApp para confirmar seu pedido com
            nosso time.
          </p>
        </Card>
      </div>
    </div>
  )
}
