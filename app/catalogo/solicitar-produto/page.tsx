/**
 * Product Request Page
 * Epic 3 - Story 3.4: Product Request System
 */

import { Suspense } from 'react'
import { RequestProductForm } from '@/components/catalog/RequestProductForm'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Solicitar Produto | Auralux Catálogo',
  description: 'Solicite produtos que não estão disponíveis no catálogo',
}

export default function RequestProductPage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Solicitar Produto</h1>
          <p className="mt-2 text-muted-foreground">
            Não encontrou o que procura? Solicite um produto e nossa equipe entrará
            em contato.
          </p>
        </div>

        <Suspense
          fallback={
            <Card className="p-6 animate-pulse">
              <div className="h-32 bg-gray-200 rounded" />
            </Card>
          }
        >
          <RequestProductForm />
        </Suspense>
      </div>
    </div>
  )
}
