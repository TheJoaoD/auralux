"use client"

import { useState } from "react"
import { SalesFlow } from "./sales-flow"

type SalesStep = "customer" | "products" | "payment" | "complete"

export interface SaleItem {
  productId: string
  productName: string
  price: number
  quantity: number
}

export interface SaleCart {
  customer: { id: string; name: string } | null
  items: SaleItem[]
  paymentMethod: "cash" | "card" | "installment" | null
  installmentMonths?: number
}

export function SalesPage() {
  const [currentStep, setCurrentStep] = useState<SalesStep>("customer")
  const [cart, setCart] = useState<SaleCart>({
    customer: null,
    items: [],
    paymentMethod: null,
  })

  const handleBack = () => {
    if (currentStep === "customer") return

    const steps: SalesStep[] = ["customer", "products", "payment", "complete"]
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleReset = () => {
    setCurrentStep("customer")
    setCart({
      customer: null,
      items: [],
      paymentMethod: null,
    })
  }

  return (
    <div className="w-full px-4 py-6 min-h-screen">
      <SalesFlow
        step={currentStep}
        cart={cart}
        onStepChange={setCurrentStep}
        onCartChange={setCart}
        onBack={handleBack}
        onReset={handleReset}
      />
    </div>
  )
}
