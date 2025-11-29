import { create } from 'zustand'
import type { Product } from '@/types'
import type { Customer } from '@/lib/services/customerService'

/**
 * Cart Item interface
 */
export interface CartItem {
  product: Product
  quantity: number
  subtotal: number
}

/**
 * Payment Method type
 * - pix: PIX transfer
 * - cash: Cash payment
 * - card: Credit/Debit card
 * - installment: Installment sale (internal flag, not a real payment method)
 */
export type PaymentMethod = 'pix' | 'cash' | 'card' | 'installment'

/**
 * Down Payment Method type (how the down payment is received)
 */
export type DownPaymentMethod = 'pix' | 'cash' | 'card'

/**
 * Helper function to calculate cart total
 */
const calculateCartTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((sum, item) => sum + item.subtotal, 0)
}

/**
 * Helper function to calculate cart item count
 */
const calculateCartItemCount = (cartItems: CartItem[]): number => {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0)
}

/**
 * Sale Wizard Store interface
 */
interface SaleWizardStore {
  // State
  currentStep: 1 | 2 | 3
  selectedCustomer: Customer | null
  cartItems: CartItem[]
  paymentMethod: PaymentMethod | null
  installmentCount: number | null
  actualAmountReceived: number | null
  downPayment: number | null
  downPaymentMethod: DownPaymentMethod | null
  cartTotal: number
  cartItemCount: number

  // Actions
  setCustomer: (customer: Customer) => void
  addToCart: (product: Product, quantity: number) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  setPaymentMethod: (method: PaymentMethod | null) => void
  setInstallmentCount: (count: number | null) => void
  setActualAmountReceived: (amount: number | null) => void
  setDownPayment: (amount: number | null) => void
  setDownPaymentMethod: (method: DownPaymentMethod | null) => void
  setInstallmentDetails: (count: number, actualAmount: number) => void
  goToStep: (step: 1 | 2 | 3) => void
  resetWizard: () => void
  canGoToStep: (step: 1 | 2 | 3) => boolean
}

/**
 * Sale Wizard Zustand Store
 * Manages state for the multi-step sale creation wizard
 */
export const useSaleWizardStore = create<SaleWizardStore>((set, get) => ({
  // Initial State
  currentStep: 1,
  selectedCustomer: null,
  cartItems: [],
  paymentMethod: null,
  installmentCount: null,
  actualAmountReceived: null,
  downPayment: null,
  downPaymentMethod: null,
  cartTotal: 0,
  cartItemCount: 0,

  // Set Customer
  setCustomer: (customer: Customer) => {
    set({
      selectedCustomer: customer,
    })
  },

  // Add Product to Cart
  addToCart: (product: Product, quantity: number) => {
    const state = get()

    // Check if product already in cart
    const existingItemIndex = state.cartItems.findIndex(
      (item) => item.product.id === product.id
    )

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      const updatedItems = [...state.cartItems]
      const existingItem = updatedItems[existingItemIndex]
      const newQuantity = existingItem.quantity + quantity

      // Validate stock
      if (newQuantity > product.quantity) {
        throw new Error(`Apenas ${product.quantity} unidades disponíveis`)
      }

      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
        subtotal: product.sale_price * newQuantity,
      }

      set({
        cartItems: updatedItems,
        cartTotal: calculateCartTotal(updatedItems),
        cartItemCount: calculateCartItemCount(updatedItems),
      })
    } else {
      // Add new item
      if (quantity > product.quantity) {
        throw new Error(`Apenas ${product.quantity} unidades disponíveis`)
      }

      const updatedItems = [
        ...state.cartItems,
        {
          product,
          quantity,
          subtotal: product.sale_price * quantity,
        },
      ]

      set({
        cartItems: updatedItems,
        cartTotal: calculateCartTotal(updatedItems),
        cartItemCount: calculateCartItemCount(updatedItems),
      })
    }
  },

  // Update Cart Item Quantity
  updateCartQuantity: (productId: string, quantity: number) => {
    const state = get()
    const itemIndex = state.cartItems.findIndex((item) => item.product.id === productId)

    if (itemIndex === -1) return

    const item = state.cartItems[itemIndex]

    // Validate quantity
    if (quantity < 1) {
      throw new Error('Quantidade mínima: 1')
    }

    if (quantity > item.product.quantity) {
      throw new Error(`Apenas ${item.product.quantity} unidades disponíveis`)
    }

    const updatedItems = [...state.cartItems]
    updatedItems[itemIndex] = {
      ...item,
      quantity,
      subtotal: item.product.sale_price * quantity,
    }

    set({
      cartItems: updatedItems,
      cartTotal: calculateCartTotal(updatedItems),
      cartItemCount: calculateCartItemCount(updatedItems),
    })
  },

  // Remove from Cart
  removeFromCart: (productId: string) => {
    set((state) => {
      const updatedItems = state.cartItems.filter((item) => item.product.id !== productId)
      return {
        cartItems: updatedItems,
        cartTotal: calculateCartTotal(updatedItems),
        cartItemCount: calculateCartItemCount(updatedItems),
      }
    })
  },

  // Set Payment Method
  setPaymentMethod: (method: PaymentMethod | null) => {
    set({ paymentMethod: method })
  },

  // Set Installment Count
  setInstallmentCount: (count: number | null) => {
    set({ installmentCount: count })
  },

  // Set Actual Amount Received
  setActualAmountReceived: (amount: number | null) => {
    set({ actualAmountReceived: amount })
  },

  // Set Down Payment (Entrada/Sinal)
  setDownPayment: (amount: number | null) => {
    set({ downPayment: amount })
  },

  // Set Down Payment Method (forma de pagamento da entrada)
  setDownPaymentMethod: (method: DownPaymentMethod | null) => {
    set({ downPaymentMethod: method })
  },

  // Set Installment Details
  setInstallmentDetails: (count: number, actualAmount: number) => {
    set({
      installmentCount: count,
      actualAmountReceived: actualAmount,
    })
  },

  // Go to Step
  goToStep: (step: 1 | 2 | 3) => {
    const state = get()

    // Validate step transition
    if (!state.canGoToStep(step)) {
      return
    }

    set({ currentStep: step })
  },

  // Check if can navigate to step
  canGoToStep: (step: 1 | 2 | 3): boolean => {
    const state = get()

    switch (step) {
      case 1:
        return true // Can always go back to customer selection
      case 2:
        return state.selectedCustomer !== null
      case 3:
        return state.selectedCustomer !== null && state.cartItems.length > 0
      default:
        return false
    }
  },

  // Reset Wizard
  resetWizard: () => {
    set({
      currentStep: 1,
      selectedCustomer: null,
      cartItems: [],
      paymentMethod: null,
      installmentCount: null,
      actualAmountReceived: null,
      downPayment: null,
      downPaymentMethod: null,
      cartTotal: 0,
      cartItemCount: 0,
    })
  },
}))
