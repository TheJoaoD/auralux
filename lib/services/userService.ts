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
  const supabase = createClient()

  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) {
      throw new Error('Usuário não autenticado')
    }

    // Create user using Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('Este email já está cadastrado')
      }
      throw error
    }

    if (!data.user) {
      throw new Error('Erro ao criar usuário')
    }

    return data.user
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
