import { createClient } from '@/lib/supabase/client'

/**
 * User Service
 * Handles user management operations (not to be confused with auth)
 */

export interface CreateUserInput {
  email: string
  password: string
}

/**
 * Creates a new user in the system using Supabase Auth Admin API
 * @param input - User creation data (email and password)
 * @returns Created user data
 */
export async function createUser(input: CreateUserInput) {
  try {
    // Call server endpoint to create user with admin API (bypasses email confirmation)
    const response = await fetch('/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erro ao criar usuário')
    }

    const user = await response.json()
    return user
  } catch (error) {
    console.error('Error creating user:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao criar usuário. Tente novamente')
  }
}

/**
 * Gets all users from Supabase Auth
 * Note: This requires proper RLS policies or admin access
 * @returns Array of users
 */
export async function getUsers() {
  const supabase = createClient()

  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) {
      throw new Error('Usuário não autenticado')
    }

    // Since we can't list all auth users directly from the client,
    // we'll query the auth.users table metadata if available
    // For now, we'll return a basic list
    // In production, you'd want to create a server endpoint for this

    // Alternative: Use Supabase Admin API via a server route
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar usuários')
    }

    const users = await response.json()
    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    // Return empty array for now if endpoint doesn't exist
    return []
  }
}

/**
 * Deletes a user from the system
 * @param userId - User ID to delete
 */
export async function deleteUser(userId: string) {
  const supabase = createClient()

  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) {
      throw new Error('Usuário não autenticado')
    }

    // Prevent deleting own account
    if (userId === currentUser.id) {
      throw new Error('Você não pode excluir sua própria conta')
    }

    // Call server endpoint to delete user
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao excluir usuário')
    }

    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao excluir usuário. Tente novamente')
  }
}
