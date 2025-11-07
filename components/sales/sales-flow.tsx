"use client"

import { CustomerSelectionStep } from "./steps/customer-selection-step"
import { ProductSelectionStep } from "./steps/product-selection-step"
import { PaymentStep } from "./steps/payment-step"
import { OrderCompleteStep } from "./steps/order-complete-step"
import { SalesProgressBar } from "./sales-progress-bar"
import type { SaleCart } from "./sales-page"

type SalesStep = "customer" | "products" | "payment" | "complete"

interface SalesFlowProps {
  step: SalesStep
  cart: SaleCart
  onStepChange: (step: SalesStep) => void
  onCartChange: (cart: SaleCart) => void
  onBack: () => void
  onReset: () => void
}

export function SalesFlow({ step, cart, onStepChange, onCartChange, onBack, onReset }: SalesFlowProps) {
  const steps: SalesStep[] = ["customer", "products", "payment", "complete"]
  const currentIndex = steps.indexOf(step)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <SalesProgressBar currentStep={currentIndex} totalSteps={steps.length} />

      {step === "customer" && (
        <CustomerSelectionStep
          onSelectCustomer={(customer) => {
            onCartChange({ ...cart, customer })
            onStepChange("products")
          }}
          onBack={onBack}
        />
      )}

      {step === "products" && (
        <ProductSelectionStep
          items={cart.items}
          onItemsChange={(items) => {
            onCartChange({ ...cart, items })
          }}
          onNext={() => onStepChange("payment")}
          onBack={onBack}
        />
      )}

      {step === "payment" && (
        <PaymentStep
          cart={cart}
          onPaymentMethodChange={(method, months?) => {
            onCartChange({
              ...cart,
              paymentMethod: method,
              installmentMonths: months,
            })
          }}
          onComplete={() => onStepChange("complete")}
          onBack={onBack}
        />
      )}

      {step === "complete" && <OrderCompleteStep cart={cart} onNewSale={onReset} />}
    </div>
  )
}
