/**
 * Category Redirect Page
 * Epic 2 - Story 2.5: Sistema de Categorias
 *
 * Redirects to products page with category filter
 */

import { redirect } from 'next/navigation'

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/catalogo/produtos?categoria=${id}`)
}
