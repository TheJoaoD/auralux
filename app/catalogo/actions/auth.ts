/**
 * Catalog Authentication Server Actions
 * Epic 1 - Story 1.3: Sistema de Autenticação WhatsApp
 */

'use server'

import { cookies } from 'next/headers'
import {
  validateWhatsApp,
  checkUserExists,
  createCatalogUser,
  generateCatalogToken,
  type CatalogUser,
} from '@/lib/services/catalog-auth'

export interface AuthResponse {
  success: boolean
  user?: CatalogUser
  requiresName?: boolean
  error?: string
}

/**
 * Authenticate user with WhatsApp (and optionally name for new users)
 *
 * Flow:
 * 1. Validate WhatsApp format
 * 2. Check if user exists
 * 3. If exists: authenticate and return user
 * 4. If not exists and no name: return requiresName = true
 * 5. If not exists and has name: create user, authenticate
 */
export async function authenticateWithWhatsApp(
  whatsapp: string,
  name?: string
): Promise<AuthResponse> {
  try {
    // Step 1: Validate WhatsApp format
    if (!validateWhatsApp(whatsapp)) {
      return {
        success: false,
        error: 'Formato de WhatsApp inválido. Use o formato internacional (ex: +5511999999999)',
      }
    }

    // Step 2: Check if user exists
    const existingUser = await checkUserExists(whatsapp)

    if (existingUser) {
      // User exists - generate token and authenticate
      const token = await generateCatalogToken(
        existingUser.whatsapp,
        existingUser.name
      )

      // Set HTTP-only cookie
      const cookieStore = await cookies()
      cookieStore.set('catalog_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })

      return {
        success: true,
        user: existingUser,
      }
    }

    // User doesn't exist
    if (!name || name.trim() === '') {
      // Need name to create new user
      return {
        success: false,
        requiresName: true,
      }
    }

    // Step 3: Create new user
    const newUser = await createCatalogUser(whatsapp, name.trim())

    // Step 4: Generate token and authenticate
    const token = await generateCatalogToken(newUser.whatsapp, newUser.name)

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('catalog_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return {
      success: true,
      user: newUser,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      error: 'Erro ao autenticar. Por favor, tente novamente.',
    }
  }
}

/**
 * Logout user by clearing catalog_token cookie
 */
export async function logoutCatalogUser(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('catalog_token')
}

/**
 * Get current catalog user from cookie
 */
export async function getCurrentCatalogUser(): Promise<CatalogUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('catalog_token')?.value

    if (!token) {
      return null
    }

    const { verifyCatalogToken } = await import('@/lib/services/catalog-auth')
    const payload = await verifyCatalogToken(token)

    if (!payload) {
      return null
    }

    // Get full user data from database
    const { checkUserExists } = await import('@/lib/services/catalog-auth')
    const user = await checkUserExists(payload.whatsapp)

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}
