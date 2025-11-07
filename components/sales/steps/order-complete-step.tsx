"use client"

import { CheckCircle, Receipt, Download } from "lucide-react"
import type { SaleCart } from "../sales-page"

interface OrderCompleteStepProps {
  cart: SaleCart
  onNewSale: () => void
}

export function OrderCompleteStep({ cart, onNewSale }: OrderCompleteStepProps) {
  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Success Message */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-400/20 flex items-center justify-center">
            <CheckCircle size={48} className="text-green-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground">Sale Completed!</h2>
        <p className="text-muted-foreground">Your order has been processed successfully</p>
      </div>

      {/* Order Receipt */}
      <div className="p-6 rounded-lg bg-card border border-border space-y-4">
        <div className="text-center border-b border-border pb-3">
          <p className="text-sm text-muted-foreground">Order Number</p>
          <p className="text-2xl font-bold text-accent font-mono">{orderNumber}</p>
        </div>

        {/* Customer */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Customer</p>
          <p className="text-lg font-semibold text-foreground">{cart.customer?.name}</p>
        </div>

        {/* Items */}
        <div className="space-y-2 border-t border-b border-border py-3">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-sm">
              <div>
                <p className="text-card-foreground">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} × ₦{item.price}
                </p>
              </div>
              <p className="font-semibold text-accent">₦{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">₦{total.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold text-accent">₦{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-2 rounded bg-background border border-border text-sm">
          <p className="text-muted-foreground">Payment Method</p>
          <p className="font-semibold text-foreground capitalize">
            {cart.paymentMethod === "installment"
              ? `Installment (${cart.installmentMonths} months)`
              : cart.paymentMethod === "card"
                ? "Card Payment"
                : "Cash"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 py-2.5 px-4 rounded-lg border border-border text-foreground hover:bg-background transition-colors flex items-center justify-center gap-2">
          <Download size={18} />
          Receipt
        </button>
        <button
          onClick={onNewSale}
          className="flex-1 py-2.5 px-4 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Receipt size={18} />
          New Sale
        </button>
      </div>
    </div>
  )
}
