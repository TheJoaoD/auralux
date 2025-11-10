/**
 * Catalog Product Requests Service
 * Epic 3 - Story 3.4: Product Request System
 *
 * Manages product requests from catalog users
 */

import { createClient } from '@/lib/supabase/server'

export type CatalogRequestStatus = 'pending' | 'analyzing' | 'fulfilled' | 'unavailable'

export interface CatalogRequest {
  id: string
  user_whatsapp: string
  product_name: string
  observations: string | null
  status: CatalogRequestStatus
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface CreateRequestData {
  product_name: string
  observations?: string
}

/**
 * Create a new product request
 */
export async function createProductRequest(
  data: CreateRequestData
): Promise<string> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const userWhatsapp = user.phone || user.email || ''

  const { data: request, error } = await supabase
    .from('catalog_requests')
    .insert({
      user_whatsapp: userWhatsapp,
      product_name: data.product_name.trim(),
      observations: data.observations?.trim() || null,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to create request: ${error.message}`)
  }

  return request.id
}

/**
 * Get user's product requests
 */
export async function getUserRequests(): Promise<CatalogRequest[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('catalog_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch requests: ${error.message}`)
  }

  return data || []
}

/**
 * Get request status badge color
 */
export function getRequestStatusColor(status: CatalogRequestStatus): string {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    analyzing: 'bg-blue-100 text-blue-800 border-blue-200',
    fulfilled: 'bg-green-100 text-green-800 border-green-200',
    unavailable: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  return colors[status] || colors.pending
}

/**
 * Get request status label
 */
export function getRequestStatusLabel(status: CatalogRequestStatus): string {
  const labels = {
    pending: 'Pendente',
    analyzing: 'Em Análise',
    fulfilled: 'Atendido',
    unavailable: 'Indisponível',
  }

  return labels[status] || 'Pendente'
}
