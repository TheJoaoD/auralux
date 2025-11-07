"use client"

import { useState, useEffect } from "react"
import { Search, Plus, X, ChevronUp, ChevronDown, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { SaleItem } from "../sales-page"

interface Product {
  id: string
  name: string
  price: number
  quantity: number
}

interface ProductSelectionStepProps {
  items: SaleItem[]
  onItemsChange: (items: SaleItem[]) => void
  onNext: () => void
  onBack: () => void
}

export function ProductSelectionStep({ items, onItemsChange, onNext, onBack }: ProductSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, sale_price, quantity')
          .gt('quantity', 0) // Only show products in stock
          .order('name')

        if (error) throw error

        const formattedProducts = (data || []).map(p => ({
          id: p.id,
          name: p.name,
          price: Number(p.sale_price),
          quantity: p.quantity
        }))

        setProducts(formattedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Erro ao carregar produtos')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddProduct = (product: Product) => {
    const existingItem = items.find((i) => i.productId === product.id)

    if (existingItem) {
      onItemsChange(items.map((i) => (i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)))
    } else {
      onItemsChange([
        ...items,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
        },
      ])
    }
  }

  const handleRemoveItem = (productId: string) => {
    onItemsChange(items.filter((i) => i.productId !== productId))
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId)
    } else {
      onItemsChange(items.map((i) => (i.productId === productId ? { ...i, quantity } : i)))
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Add Products</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Add Products</h2>
        <p className="text-muted-foreground">Select items for this sale</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            <p>Nenhum produto disponível</p>
            <p className="text-sm mt-2">Cadastre produtos no inventário primeiro</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleAddProduct(product)}
              className="p-3 rounded-lg bg-card border border-border hover:border-accent transition-colors text-left space-y-2"
            >
              <p className="text-sm font-medium text-card-foreground line-clamp-2">{product.name}</p>
              <div className="flex items-center justify-between">
                <p className="text-accent font-semibold">R$ {product.price.toFixed(2)}</p>
                <Plus size={16} className="text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">{product.quantity} em estoque</p>
            </button>
          ))
        )}
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Cart</h3>
        {items.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground bg-card rounded-lg border border-border">
            No items added yet
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="p-3 rounded-lg bg-card border border-border space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-card-foreground text-sm">{item.productName}</p>
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">₦{item.price}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className="p-1 hover:bg-background rounded"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <span className="font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className="p-1 hover:bg-background rounded"
                    >
                      <ChevronUp size={16} />
                    </button>
                  </div>
                </div>

                <div className="text-right text-sm font-semibold text-accent">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total & Actions */}
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center justify-between text-lg">
          <span className="font-semibold text-foreground">Total:</span>
          <span className="text-2xl font-bold text-accent">₦{total.toLocaleString()}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-2.5 px-4 rounded-lg border border-border text-foreground hover:bg-background transition-colors"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={items.length === 0}
            className="flex-1 py-2.5 px-4 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  )
}
