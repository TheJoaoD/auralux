import { z } from 'zod'

export const createSaleSchema = z
  .object({
    customer_id: z.string().uuid('Cliente inválido'),
    cartItems: z
      .array(
        z.object({
          product: z.object({
            id: z.string().uuid(),
            name: z.string(),
            sale_price: z.number().positive(),
            cost_price: z.number().nonnegative(),
          }),
          quantity: z.number().int().positive(),
        })
      )
      .min(1, 'Adicione pelo menos um produto'),
    payment_method: z.enum(['pix', 'cash', 'installment'], {
      required_error: 'Selecione um método de pagamento',
    }),
    installment_count: z.number().int().min(1).max(12).optional(),
    actual_amount_received: z.number().positive().optional(),
    down_payment: z.number().nonnegative().optional(),
    notes: z.string().max(500).optional(),
  })
  .refine(
    (data) => {
      if (data.payment_method === 'installment') {
        return data.installment_count !== undefined && data.installment_count > 0
      }
      return true
    },
    {
      message: 'Parcelamento requer número de parcelas',
      path: ['installment_count'],
    }
  )
  .refine(
    (data) => {
      if (data.payment_method === 'installment' && data.down_payment !== undefined) {
        const total = data.cartItems.reduce(
          (sum, item) => sum + item.quantity * item.product.sale_price,
          0
        )
        return data.down_payment < total
      }
      return true
    },
    {
      message: 'Entrada não pode ser igual ou maior que o total',
      path: ['down_payment'],
    }
  )
  .refine(
    (data) => {
      if (data.payment_method === 'installment' && data.actual_amount_received) {
        const total = data.cartItems.reduce(
          (sum, item) => sum + item.quantity * item.product.sale_price,
          0
        )
        return data.actual_amount_received <= total
      }
      return true
    },
    {
      message: 'Valor recebido não pode ser maior que o total',
      path: ['actual_amount_received'],
    }
  )

export type CreateSaleInput = z.infer<typeof createSaleSchema>
