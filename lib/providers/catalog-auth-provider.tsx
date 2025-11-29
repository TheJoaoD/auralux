/**
 * Catalog Auth Provider
 * Epic 1 - Story 1.5: Modal de Autenticação WhatsApp
 */

'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { CatalogUser } from '@/types/catalog'
import { getCurrentCatalogUser } from '@/app/catalogo/actions/auth'
import { AuthModal } from '@/components/catalog/AuthModal'

const SESSION_MODAL_KEY = 'catalog_modal_shown_session'

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
  const [hasTriggered, setHasTriggered] = useState(false)

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

  // Trigger modal on any user interaction
  const triggerModal = () => {
    if (hasTriggered || user) return

    // Check session storage (resets each browser session)
    const shownThisSession = sessionStorage.getItem(SESSION_MODAL_KEY)
    if (shownThisSession) return

    setHasTriggered(true)
    setIsModalOpen(true)
    sessionStorage.setItem(SESSION_MODAL_KEY, 'true')
  }

  // Initial load
  useEffect(() => {
    refreshUser()
  }, [])

  // Listen for any user interaction to show modal
  useEffect(() => {
    if (isLoading || user || hasTriggered) return

    const shownThisSession = sessionStorage.getItem(SESSION_MODAL_KEY)
    if (shownThisSession) return

    // Interaction events that trigger the modal
    const events = ['click', 'scroll', 'touchstart', 'mousemove']

    const handleInteraction = () => {
      triggerModal()
      // Remove all listeners after triggering
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction)
      })
    }

    // Add listeners
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true })
    })

    // Also trigger after 2 seconds if no interaction
    const timer = setTimeout(() => {
      triggerModal()
    }, 2000)

    return () => {
      clearTimeout(timer)
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction)
      })
    }
  }, [isLoading, user, hasTriggered])

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
