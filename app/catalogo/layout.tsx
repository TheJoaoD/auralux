/**
 * Catalog Layout
 * Premium mobile-first design - Vitrine pública
 */

import { CatalogShell } from '@/components/catalog/CatalogShell'
import { CatalogAuthProvider } from '@/lib/providers/catalog-auth-provider'

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CatalogAuthProvider>
      <CatalogShell>
        {children}
      </CatalogShell>
    </CatalogAuthProvider>
  )
}
