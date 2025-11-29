/**
 * Catalog Authentication Actions
 * Epic 1 - Story 1.5: Modal de Autenticação WhatsApp
 */

'use server'

import { cookies } from 'next/headers'
import {
  validateWhatsApp,
  checkUserExists,
  createCatalogUser,
  generateCatalogToken,
  verifyCatalogToken,
} from '@/lib/services/catalog-auth'
import type { CatalogUser } from '@/types/catalog'

const CATALOG_TOKEN_COOKIE = 'catalog_token'

/**
 * Authenticate user with WhatsApp
 * Returns { requiresName: true } if new user needs to provide name
 * Returns { user, token } if authentication successful
 */
export async function authenticateWithWhatsApp(whatsapp: string): Promise<{
  success: boolean
  requiresName?: boolean
  user?: CatalogUser
  error?: string
}> {
  // Validate WhatsApp format
  if (!validateWhatsApp(whatsapp)) {
    return {
      success: false,
      error: 'Formato de WhatsApp inválido. Use o formato internacional: +5511999999999',
    }
  }

  // Check if user exists
  const existingUser = await checkUserExists(whatsapp)

  if (existingUser) {
    // User exists - generate token and authenticate
    const token = await generateCatalogToken(existingUser.whatsapp, existingUser.name)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(CATALOG_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/catalogo',
    })

    return {
      success: true,
      user: existingUser,
    }
  }

  // New user - requires name
  return {
    success: true,
    requiresName: true,
  }
}

/**
 * Complete registration for new user
 */
export async function completeRegistration(
  whatsapp: string,
  name: string
): Promise<{
  success: boolean
  user?: CatalogUser
  error?: string
}> {
  // Validate inputs
  if (!validateWhatsApp(whatsapp)) {
    return {
      success: false,
      error: 'Formato de WhatsApp inválido',
    }
  }

  if (!name || name.trim().length < 2) {
    return {
      success: false,
      error: 'Nome deve ter pelo menos 2 caracteres',
    }
  }

  try {
    // Create user
    const user = await createCatalogUser(whatsapp, name.trim())

    // Generate token
    const token = await generateCatalogToken(user.whatsapp, user.name)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(CATALOG_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/catalogo',
    })

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error('Failed to complete registration:', error)
    return {
      success: false,
      error: 'Erro ao criar conta. Tente novamente.',
    }
  }
}

/**
 * Get current authenticated catalog user
 */
export async function getCurrentCatalogUser(): Promise<CatalogUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(CATALOG_TOKEN_COOKIE)?.value

  if (!token) {
    return null
  }

  const payload = await verifyCatalogToken(token)

  if (!payload) {
    return null
  }

  // Fetch user from database to get fresh data
  const user = await checkUserExists(payload.whatsapp)
  return user
}

/**
 * Logout catalog user
 */
export async function logoutCatalogUser(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CATALOG_TOKEN_COOKIE)
}
