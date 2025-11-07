import { z } from 'zod'

export const productSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(100, 'Nome muito longo')
      .trim(),
    category_id: z.string().uuid({message: 'Selecione uma categoria'}),
    sku: z.string().max(50).optional().or(z.literal('')),
    sale_price: z
      .number({ invalid_type_error: 'Preço de venda é obrigatório' })
      .positive('Preço de venda deve ser positivo')
      .multipleOf(0.01, 'Máximo 2 casas decimais'),
    cost_price: z
      .number({ invalid_type_error: 'Preço de custo é obrigatório' })
      .nonnegative('Preço de custo deve ser >= 0')
      .multipleOf(0.01, 'Máximo 2 casas decimais'),
    quantity: z
      .number({ invalid_type_error: 'Quantidade é obrigatória' })
      .int('Quantidade deve ser inteiro')
      .nonnegative('Quantidade deve ser >= 0'),
    low_stock_threshold: z
      .number()
      .int()
      .positive()
      .optional()
      .default(5),
    supplier: z.string().max(100).optional().or(z.literal('')),
    image: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        'Imagem deve ter no máximo 5MB'
      )
      .refine(
        (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        'Formato inválido. Use JPG, PNG ou WEBP'
      )
      .optional(),
  })
  .refine((data) => data.sale_price >= data.cost_price, {
    message: 'Preço de venda deve ser maior ou igual ao preço de custo',
    path: ['sale_price'],
  })

export type ProductFormData = z.infer<typeof productSchema>
