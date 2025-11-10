/**
 * Catalog Layout
 * Epic 1 - Story 1.4: Estrutura de Rotas e Layout
 * Epic 1 - Story 1.5: Auth Provider Integration
 */

import { CatalogHeader } from '@/components/catalog/CatalogHeader'
import { CatalogFooter } from '@/components/catalog/CatalogFooter'
import { CatalogAuthProvider } from '@/lib/providers/catalog-auth-provider'

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CatalogAuthProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <CatalogHeader />
        <main className="flex-1">{children}</main>
        <CatalogFooter />
      </div>
    </CatalogAuthProvider>
  )
}
