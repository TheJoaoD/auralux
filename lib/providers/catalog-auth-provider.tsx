/**
 * Catalog Auth Provider
 * Epic 1 - Story 1.5: Modal de Autenticação WhatsApp
 */

'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { CatalogUser } from '@/types/catalog'
import { getCurrentCatalogUser } from '@/app/catalogo/actions/auth'

interface CatalogAuthContextType {
  user: CatalogUser | null
  isAuthenticated: boolean
  isLoading: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  refreshUser: () => Promise<void>
}

const CatalogAuthContext = createContext<CatalogAuthContextType | null>(null)

export function CatalogAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<CatalogUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentCatalogUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <CatalogAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        openAuthModal: () => setIsModalOpen(true),
        closeAuthModal: () => setIsModalOpen(false),
        refreshUser,
      }}
    >
      {children}
      {/* AuthModal will be rendered here in full implementation */}
    </CatalogAuthContext.Provider>
  )
}

export function useCatalogAuth() {
  const context = useContext(CatalogAuthContext)
  if (!context) {
    throw new Error('useCatalogAuth must be used within CatalogAuthProvider')
  }
  return context
}
