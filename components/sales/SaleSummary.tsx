'use client'

import { formatCurrency } from '@/lib/utils/formatters'
import { User, Package, CreditCard, DollarSign } from 'lucide-react'
import type { Customer, CartItem } from '@/types'

interface SaleSummaryProps {
  customer: Customer
  cartItems: CartItem[]
  paymentMethod: 'pix' | 'cash' | 'installment' | null
  installmentCount: number | null
  actualAmountReceived: number | null
}

const PAYMENT_METHOD_LABELS = {
  pix: 'PIX',
  cash: 'Dinheiro',
  installment: 'Parcelado',
}

export function SaleSummary({
  customer,
  cartItems,
  paymentMethod,
  installmentCount,
  actualAmountReceived,
}: SaleSummaryProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
  const discount =
    paymentMethod === 'installment' && actualAmountReceived
      ? subtotal - actualAmountReceived
      : 0
  const discountPercentage = subtotal > 0 ? (discount / subtotal) * 100 : 0
  const finalTotal = paymentMethod === 'installment' && actualAmountReceived ? actualAmountReceived : subtotal

  return (
    <div className="bg-[#A1887F] rounded-xl p-6 space-y-5">
      {/* Customer Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-[#E0DCD1]/70" />
          <h3 className="text-sm font-medium text-[#E0DCD1]/70 uppercase tracking-wide">
            Cliente
          </h3>
        </div>
        <div className="pl-6">
          <p className="text-lg font-semibold text-[#E0DCD1]">{customer.full_name}</p>
          <p className="text-sm text-[#E0DCD1]/70">{customer.whatsapp}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E0DCD1]/20" />

      {/* Products Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-4 w-4 text-[#E0DCD1]/70" />
          <h3 className="text-sm font-medium text-[#E0DCD1]/70 uppercase tracking-wide">
            Produtos
          </h3>
        </div>
        <div className="pl-6 space-y-2">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-[#E0DCD1]">
                  {item.product.name}
                </p>
                <p className="text-xs text-[#E0DCD1]/60">
                  {item.quantity} × {formatCurrency(item.product.sale_price)}
                </p>
              </div>
              <p className="text-sm font-semibold text-[#E0DCD1]">
                {formatCurrency(item.subtotal)}
              </p>
            </div>
          ))}

          {/* Subtotal */}
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#E0DCD1]/10">
            <p className="text-sm font-medium text-[#E0DCD1]/70">Subtotal</p>
            <p className="text-base font-semibold text-[#E0DCD1]">
              {formatCurrency(subtotal)}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E0DCD1]/20" />

      {/* Payment Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="h-4 w-4 text-[#E0DCD1]/70" />
          <h3 className="text-sm font-medium text-[#E0DCD1]/70 uppercase tracking-wide">
            Pagamento
          </h3>
        </div>
        <div className="pl-6 space-y-2">
          {paymentMethod ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#E0DCD1]/70">Método</p>
                <p className="text-base font-semibold text-[#E0DCD1]">
                  {PAYMENT_METHOD_LABELS[paymentMethod]}
                </p>
              </div>

              {paymentMethod === 'installment' && installmentCount && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#E0DCD1]/70">Parcelas</p>
                  <p className="text-base font-semibold text-[#E0DCD1]">
                    {installmentCount}x
                  </p>
                </div>
              )}

              {paymentMethod === 'installment' && discount > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#E0DCD1]/70">Desconto (taxas)</p>
                  <div className="text-right">
                    <p className="text-base font-semibold text-[#C76A6A]">
                      {formatCurrency(discount)}
                    </p>
                    <p className="text-xs text-[#C76A6A]">
                      ({discountPercentage.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-[#E0DCD1]/50 italic">
              Selecione um método de pagamento
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-[#E0DCD1]/30" />

      {/* Total Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-[#C49A9A]" />
          <p className="text-lg font-semibold text-[#E0DCD1]">
            {paymentMethod === 'installment' && actualAmountReceived
              ? 'Valor Recebido'
              : 'Total'}
          </p>
        </div>
        <p className="text-3xl font-bold text-[#C49A9A]">
          {formatCurrency(finalTotal)}
        </p>
      </div>

      {paymentMethod === 'installment' && actualAmountReceived && (
        <p className="text-xs text-[#E0DCD1]/60 text-right -mt-2">
          Total original: {formatCurrency(subtotal)}
        </p>
      )}
    </div>
  )
}
