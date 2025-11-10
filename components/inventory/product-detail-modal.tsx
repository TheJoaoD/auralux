"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Package, DollarSign, TrendingDown, AlertTriangle, Upload, Eye, EyeOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  cost: number
  quantity: number
  reorderLevel: number
  supplier?: string
  image?: string
  createdAt: string
}

interface ProductDetailModalProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (product: Product) => void
}

export function ProductDetailModal({ product, open, onOpenChange, onUpdate }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(product.quantity)
  const [showStockAdjustment, setShowStockAdjustment] = useState(false)
  const [adjustmentValue, setAdjustmentValue] = useState("")
  const [adjustmentType, setAdjustmentType] = useState<"add" | "subtract">("add")
  const [imageUrl, setImageUrl] = useState(product.image || "")
  const [isInCatalog, setIsInCatalog] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [loadingCatalog, setLoadingCatalog] = useState(false)

  // Check if product is in catalog when modal opens
  useEffect(() => {
    if (open && product.id) {
      checkCatalogStatus()
    }
  }, [open, product.id])

  const checkCatalogStatus = async () => {
    try {
      const response = await fetch(`/api/catalog/check?productId=${product.id}`)
      const data = await response.json()
      setIsInCatalog(data.inCatalog)
      setIsFeatured(data.featured || false)
    } catch (error) {
      console.error('Error checking catalog status:', error)
    }
  }

  const handleToggleCatalog = async (enabled: boolean) => {
    setLoadingCatalog(true)
    try {
      const response = await fetch('/api/catalog/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          visible: enabled,
        }),
      })

      if (!response.ok) throw new Error('Failed to update catalog')

      setIsInCatalog(enabled)
      toast.success(enabled ? 'Produto adicionado ao catálogo' : 'Produto removido do catálogo')
    } catch (error) {
      console.error('Error toggling catalog:', error)
      toast.error('Erro ao atualizar catálogo')
    } finally {
      setLoadingCatalog(false)
    }
  }

  const handleToggleFeatured = async (featured: boolean) => {
    if (!isInCatalog) {
      toast.error('Produto precisa estar no catálogo primeiro')
      return
    }

    setLoadingCatalog(true)
    try {
      const response = await fetch('/api/catalog/featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          featured,
        }),
      })

      if (!response.ok) throw new Error('Failed to update featured')

      setIsFeatured(featured)
      toast.success(featured ? 'Produto marcado como destaque' : 'Produto removido dos destaques')
    } catch (error) {
      console.error('Error toggling featured:', error)
      toast.error('Erro ao atualizar destaque')
    } finally {
      setLoadingCatalog(false)
    }
  }

  const profit = product.price - product.cost
  const margin = ((profit / product.price) * 100).toFixed(1)
  const isLowStock = quantity <= product.reorderLevel

  const handleAdjustStock = () => {
    const value = Number.parseInt(adjustmentValue)
    if (!isNaN(value) && value > 0) {
      const newQuantity = adjustmentType === "add" ? quantity + value : Math.max(0, quantity - value)
      setQuantity(newQuantity)
      setShowStockAdjustment(false)
      setAdjustmentValue("")
    }
  }

  const handleSaveChanges = () => {
    onUpdate({
      ...product,
      quantity,
      image: imageUrl,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Product Details</DialogTitle>
        </DialogHeader>

        {isLowStock && (
          <div className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400 text-yellow-400 text-sm mb-4 flex items-center gap-2">
            <AlertTriangle size={16} />
            Low stock - Consider reordering
          </div>
        )}

        {/* Catalog Controls */}
        <div className="p-4 rounded-lg bg-background border border-border space-y-3">
          <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
            <Eye size={16} className="text-accent" />
            Controles do Catálogo
          </h3>

          {/* Toggle Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Visível no Catálogo</p>
              <p className="text-xs text-muted-foreground">Mostrar produto no catálogo público</p>
            </div>
            <Switch
              checked={isInCatalog}
              onCheckedChange={handleToggleCatalog}
              disabled={loadingCatalog}
            />
          </div>

          {/* Toggle Featured */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">Produto Destaque</p>
              <p className="text-xs text-muted-foreground">Exibir na home do catálogo</p>
            </div>
            <Switch
              checked={isFeatured}
              onCheckedChange={handleToggleFeatured}
              disabled={loadingCatalog || !isInCatalog}
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Product Image */}
          {imageUrl && (
            <div className="relative w-full h-40 rounded-lg bg-background border border-border overflow-hidden">
              <img src={imageUrl || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border text-foreground hover:bg-background transition-colors cursor-pointer">
              <Upload size={18} />
              <span className="text-sm font-medium">Upload Product Image</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Product Name & SKU */}
          <div>
            <p className="text-sm text-muted-foreground">Product</p>
            <p className="text-lg font-semibold text-card-foreground">{product.name}</p>
            <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
          </div>

          {/* Category & Supplier */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-background border border-border">
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="font-medium text-card-foreground mt-1">{product.category}</p>
            </div>
            {product.supplier && (
              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-xs text-muted-foreground">Supplier</p>
                <p className="font-medium text-card-foreground mt-1 truncate">{product.supplier}</p>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={16} className="text-accent" />
                <p className="text-xs text-muted-foreground">Selling Price</p>
              </div>
              <p className="text-xl font-bold text-card-foreground">₦{product.price.toLocaleString()}</p>
            </div>

            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown size={16} className="text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Cost</p>
              </div>
              <p className="text-xl font-bold text-card-foreground">₦{product.cost.toLocaleString()}</p>
            </div>
          </div>

          {/* Profit & Margin */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-green-400/10 border border-green-400">
              <p className="text-xs text-green-400">Profit per Unit</p>
              <p className="text-xl font-bold text-green-400 mt-1">₦{profit.toLocaleString()}</p>
            </div>

            <div className="p-3 rounded-lg bg-blue-400/10 border border-blue-400">
              <p className="text-xs text-blue-400">Margin</p>
              <p className="text-xl font-bold text-blue-400 mt-1">{margin}%</p>
            </div>
          </div>

          {/* Stock Levels */}
          <div className="p-3 rounded-lg bg-background border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Package size={16} className="text-accent" />
              <p className="text-sm font-medium text-card-foreground">Stock Levels</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current Stock</span>
              <span className="font-semibold text-card-foreground">{quantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reorder Level</span>
              <span className="font-semibold text-card-foreground">{product.reorderLevel}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full transition-colors ${
                  quantity > product.reorderLevel ? "bg-green-400" : "bg-yellow-400"
                }`}
                style={{ width: `${Math.min((quantity / product.reorderLevel) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Stock Adjustment */}
          {!showStockAdjustment ? (
            <button
              onClick={() => setShowStockAdjustment(true)}
              className="w-full py-2.5 px-4 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity text-sm font-medium"
            >
              Adjust Stock
            </button>
          ) : (
            <div className="space-y-3 p-4 rounded-lg bg-background border border-border">
              <div className="flex gap-2">
                <button
                  onClick={() => setAdjustmentType("add")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    adjustmentType === "add"
                      ? "bg-green-400/20 text-green-400 border border-green-400"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  Add
                </button>
                <button
                  onClick={() => setAdjustmentType("subtract")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    adjustmentType === "subtract"
                      ? "bg-red-400/20 text-red-400 border border-red-400"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  Remove
                </button>
              </div>
              <input
                type="number"
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(e.target.value)}
                placeholder="Enter quantity..."
                className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdjustStock}
                  className="flex-1 py-2.5 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowStockAdjustment(false)}
                  className="flex-1 py-2.5 rounded-lg border border-border text-foreground hover:bg-background transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Save Changes */}
          <button
            onClick={handleSaveChanges}
            className="w-full py-2.5 px-4 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity text-sm font-medium"
          >
            Save Changes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
