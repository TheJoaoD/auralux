/**
 * Catalog Authentication Service
 * Epic 1 - Story 1.3: Sistema de Autenticação WhatsApp
 *
 * Custom JWT authentication for catalog users via WhatsApp
 */

import { SignJWT, jwtVerify } from 'jose'
import { createClient } from '@/lib/supabase/server'

// Types
export interface CatalogUser {
  id: string
  whatsapp: string
  name: string
  created_at: string
  updated_at: string
}

export interface CatalogJWTPayload {
  whatsapp: string
  name: string
  exp?: number
}

// Constants
const WHATSAPP_REGEX = /^\+\d{1,3}\d{10,14}$/

/**
 * Validates WhatsApp number format (international)
 * Example: +5511999999999
 */
export function validateWhatsApp(whatsapp: string): boolean {
  if (!whatsapp || typeof whatsapp !== 'string') {
    return false
  }

  return WHATSAPP_REGEX.test(whatsapp.trim())
}

/**
 * Checks if catalog user exists by WhatsApp
 * Returns user data if exists, null otherwise
 */
export async function checkUserExists(
  whatsapp: string
): Promise<CatalogUser | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('catalog_users')
    .select('*')
    .eq('whatsapp', whatsapp)
    .single()

  if (error || !data) {
    return null
  }

  return data as CatalogUser
}

/**
 * Creates a new catalog user
 */
export async function createCatalogUser(
  whatsapp: string,
  name: string
): Promise<CatalogUser> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('catalog_users')
    .insert({
      whatsapp,
      name,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create catalog user: ${error.message}`)
  }

  return data as CatalogUser
}

/**
 * Generates JWT token for catalog user
 * TTL: 30 days
 */
export async function generateCatalogToken(
  whatsapp: string,
  name: string
): Promise<string> {
  const jwtSecret = process.env.SUPABASE_JWT_SECRET

  if (!jwtSecret) {
    throw new Error('SUPABASE_JWT_SECRET is not configured')
  }

  const secret = new TextEncoder().encode(jwtSecret)

  const token = await new SignJWT({ whatsapp, name })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d') // 30 days
    .sign(secret)

  return token
}

/**
 * Verifies and decodes catalog JWT token
 */
export async function verifyCatalogToken(
  token: string
): Promise<CatalogJWTPayload | null> {
  try {
    const jwtSecret = process.env.SUPABASE_JWT_SECRET

    if (!jwtSecret) {
      throw new Error('SUPABASE_JWT_SECRET is not configured')
    }

    const secret = new TextEncoder().encode(jwtSecret)
    const { payload } = await jwtVerify(token, secret)

    return payload as CatalogJWTPayload
  } catch (error) {
    console.error('Failed to verify catalog token:', error)
    return null
  }
}
