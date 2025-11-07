"use client"

import { AlertCircle, TrendingDown } from "lucide-react"

const lowStockItems = [
  { id: 1, name: "Premium Phone Case", current: 5, reorder: 20 },
  { id: 2, name: "Screen Protector Pack", current: 8, reorder: 50 },
  { id: 3, name: "Charging Cable (USB-C)", current: 3, reorder: 100 },
]

export function InventoryAlert() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle size={20} className="text-destructive" />
        <h3 className="text-lg font-semibold text-card-foreground">Low Stock Alert</h3>
      </div>

      <div className="space-y-3">
        {lowStockItems.map((item) => (
          <div key={item.id} className="p-3 rounded-lg bg-background border border-border/50">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium text-card-foreground">{item.name}</p>
              <TrendingDown size={16} className="text-destructive" />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Stock: {item.current} units</span>
              <span>Reorder: {item.reorder}</span>
            </div>
            <div className="w-full bg-background rounded-full h-2 mt-2">
              <div
                className="bg-accent h-2 rounded-full"
                style={{ width: `${(item.current / item.reorder) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
