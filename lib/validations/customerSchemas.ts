import { z } from 'zod'

export const customerSchema = z.object({
  full_name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo')
    .trim(),
  whatsapp: z
    .string()
    .min(1, 'WhatsApp é obrigatório')
    .regex(
      /^(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/,
      'WhatsApp inválido. Use formato: (XX) XXXXX-XXXX'
    ),
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, 'Endereço muito longo')
    .optional()
    .or(z.literal('')),
})

export type CustomerFormData = z.infer<typeof customerSchema>
