"use client"

import { useState } from "react"
import { CreditCard, Banknote, Clock } from "lucide-react"
import type { SaleCart } from "../sales-page"

interface PaymentStepProps {
  cart: SaleCart
  onPaymentMethodChange: (method: "cash" | "card" | "installment", months?: number) => void
  onComplete: () => void
  onBack: () => void
}

export function PaymentStep({ cart, onPaymentMethodChange, onComplete, onBack }: PaymentStepProps) {
  const [installmentMonths, setInstallmentMonths] = useState(3)

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const installmentAmount = (total / installmentMonths).toFixed(0)

  const handlePaymentMethod = (method: "cash" | "card" | "installment") => {
    if (method === "installment") {
      onPaymentMethodChange("installment", installmentMonths)
    } else {
      onPaymentMethodChange(method)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Payment Method</h2>
        <p className="text-muted-foreground">How would the customer like to pay?</p>
      </div>

      {/* Order Summary */}
      <div className="p-4 rounded-lg bg-card border border-border space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{cart.items.length} items</span>
          <span className="text-foreground">₦{total.toLocaleString()}</span>
        </div>
        <div className="border-t border-border pt-2 flex items-center justify-between">
          <span className="font-semibold text-foreground">Total Amount</span>
          <span className="text-2xl font-bold text-accent">₦{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Select Payment Method</h3>

        {/* Cash */}
        <button
          onClick={() => {
            handlePaymentMethod("cash")
            onComplete()
          }}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            cart.paymentMethod === "cash" ? "border-accent bg-accent/10" : "border-border hover:border-accent"
          }`}
        >
          <div className="flex items-center gap-3">
            <Banknote size={24} className="text-accent" />
            <div className="text-left">
              <p className="font-semibold text-card-foreground">Cash</p>
              <p className="text-sm text-muted-foreground">Pay now with cash</p>
            </div>
          </div>
        </button>

        {/* Card */}
        <button
          onClick={() => {
            handlePaymentMethod("card")
            onComplete()
          }}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            cart.paymentMethod === "card" ? "border-accent bg-accent/10" : "border-border hover:border-accent"
          }`}
        >
          <div className="flex items-center gap-3">
            <CreditCard size={24} className="text-accent" />
            <div className="text-left">
              <p className="font-semibold text-card-foreground">Card Payment</p>
              <p className="text-sm text-muted-foreground">Debit or credit card</p>
            </div>
          </div>
        </button>

        {/* Installment */}
        <div className="space-y-2">
          <button
            onClick={() => handlePaymentMethod("installment")}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              cart.paymentMethod === "installment" ? "border-accent bg-accent/10" : "border-border hover:border-accent"
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-accent" />
              <div className="text-left">
                <p className="font-semibold text-card-foreground">Installment Plan</p>
                <p className="text-sm text-muted-foreground">
                  {installmentMonths} months × ₦{installmentAmount}
                </p>
              </div>
            </div>
          </button>

          {cart.paymentMethod === "installment" && (
            <div className="p-4 rounded-lg bg-background border border-border space-y-3">
              <label className="block text-sm font-medium text-foreground">Number of Months</label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 6, 9, 12].map((months) => (
                  <button
                    key={months}
                    onClick={() => setInstallmentMonths(months)}
                    className={`py-2 rounded-lg font-medium transition-colors ${
                      installmentMonths === months
                        ? "bg-accent text-accent-foreground"
                        : "bg-card border border-border text-foreground hover:border-accent"
                    }`}
                  >
                    {months}M
                  </button>
                ))}
              </div>
              <div className="p-3 rounded-lg bg-card border border-border text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Installment Amount</span>
                  <span className="font-semibold text-accent">₦{installmentAmount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-semibold text-foreground">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 border-t border-border pt-6">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 px-4 rounded-lg border border-border text-foreground hover:bg-background transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => {
            if (!cart.paymentMethod) {
              alert("Please select a payment method")
              return
            }
            onComplete()
          }}
          className="flex-1 py-2.5 px-4 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Complete Sale
        </button>
      </div>
    </div>
  )
}
