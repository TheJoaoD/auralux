"use client"

import { ChevronRight, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"

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
  createdAt: string
}

interface InventoryListProps {
  products: Product[]
  onSelectProduct: (product: Product) => void
}

export function InventoryList({ products, onSelectProduct }: InventoryListProps) {
  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity === 0) return "out-of-stock"
    if (quantity <= reorderLevel) return "low-stock"
    return "in-stock"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-stock":
        return <CheckCircle size={20} className="text-green-400" />
      case "low-stock":
        return <AlertTriangle size={20} className="text-yellow-400" />
      case "out-of-stock":
        return <AlertCircle size={20} className="text-destructive" />
    }
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle size={40} className="text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No products found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {products.map((product) => {
        const status = getStockStatus(product.quantity, product.reorderLevel)
        return (
          <button
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="w-full p-4 rounded-lg bg-card border border-border hover:border-accent transition-colors text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-card-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.sku}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status)}
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">{product.category}</span>
              <span className="text-accent font-semibold">₦{product.price.toLocaleString()}</span>
            </div>

            {/* Stock Bar */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span
                className={`font-medium ${
                  status === "in-stock"
                    ? "text-green-400"
                    : status === "low-stock"
                      ? "text-yellow-400"
                      : "text-destructive"
                }`}
              >
                {product.quantity} units
              </span>
              <span className="text-muted-foreground">Reorder: {product.reorderLevel}</span>
            </div>

            <div className="w-full bg-background rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-colors ${
                  status === "in-stock" ? "bg-green-400" : status === "low-stock" ? "bg-yellow-400" : "bg-destructive"
                }`}
                style={{ width: `${Math.min((product.quantity / product.reorderLevel) * 100, 100)}%` }}
              />
            </div>
          </button>
        )
      })}
    </div>
  )
}
