/**
 * Product Requests History Page
 * Epic 3 - Story 3.4: Product Request System
 */

import { Suspense } from 'react'
import { RequestsHistory } from '@/components/catalog/RequestsHistory'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Minhas Solicitações | Auralux Catálogo',
  description: 'Acompanhe suas solicitações de produtos',
}

export default function RequestsHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Minhas Solicitações</h1>
        <p className="mt-2 text-muted-foreground">
          Acompanhe o status das suas solicitações de produtos
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-24 bg-gray-200 rounded" />
              </Card>
            ))}
          </div>
        }
      >
        <RequestsHistory />
      </Suspense>
    </div>
  )
}
