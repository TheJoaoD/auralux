/**
 * Catalog Auth Provider
 * Epic 1 - Story 1.5: Modal de Autenticação WhatsApp
 */

'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { CatalogUser } from '@/types/catalog'
import { getCurrentCatalogUser } from '@/app/catalogo/actions/auth'
import { AuthModal } from '@/components/catalog/AuthModal'

const FIRST_VISIT_KEY = 'catalog_first_visit_shown'
const MODAL_DELAY_MS = 3000 // Show modal after 3 seconds on first visit

interface CatalogAuthContextType {
  user: CatalogUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isModalOpen: boolean
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
      return currentUser
    } catch (error) {
      console.error('Failed to refresh user:', error)
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Check for first visit and show modal
  useEffect(() => {
    const checkFirstVisit = async () => {
      const currentUser = await refreshUser()

      // If user is already authenticated, don't show modal
      if (currentUser) {
        return
      }

      // Check if we've already shown the modal on first visit
      const hasShownModal = localStorage.getItem(FIRST_VISIT_KEY)

      if (!hasShownModal) {
        // Show modal after delay
        const timer = setTimeout(() => {
          setIsModalOpen(true)
          localStorage.setItem(FIRST_VISIT_KEY, 'true')
        }, MODAL_DELAY_MS)

        return () => clearTimeout(timer)
      }
    }

    checkFirstVisit()
  }, [])

  const handleAuthSuccess = async () => {
    await refreshUser()
  }

  return (
    <CatalogAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isModalOpen,
        openAuthModal: () => setIsModalOpen(true),
        closeAuthModal: () => setIsModalOpen(false),
        refreshUser,
      }}
    >
      {children}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
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
