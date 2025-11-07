import { z } from 'zod'

/**
 * Category Form Validation Schema
 * Validates category creation and editing forms
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .trim(),
  description: z
    .string()
    .max(200, 'Descrição deve ter no máximo 200 caracteres')
    .optional()
    .nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal (#RRGGBB)')
    .optional()
    .nullable(),
})

/**
 * TypeScript type inferred from schema
 */
export type CategoryFormData = z.infer<typeof categorySchema>
