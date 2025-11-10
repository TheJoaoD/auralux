/**
 * Requests History Component
 * Epic 3 - Story 3.4: Product Request System
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PackageSearch, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { fetchUserRequests } from '@/app/catalogo/actions/requests'

type CatalogRequestStatus = 'pending' | 'analyzing' | 'fulfilled' | 'unavailable'

/**
 * Get request status badge color
 */
function getRequestStatusColor(status: CatalogRequestStatus): string {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    analyzing: 'bg-blue-100 text-blue-800 border-blue-200',
    fulfilled: 'bg-green-100 text-green-800 border-green-200',
    unavailable: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  return colors[status] || colors.pending
}

/**
 * Get request status label
 */
function getRequestStatusLabel(status: CatalogRequestStatus): string {
  const labels = {
    pending: 'Pendente',
    analyzing: 'Em Análise',
    fulfilled: 'Atendido',
    unavailable: 'Indisponível',
  }

  return labels[status] || 'Pendente'
}

function getStatusIcon(status: CatalogRequestStatus) {
  const icons = {
    pending: Clock,
    analyzing: AlertCircle,
    fulfilled: CheckCircle,
    unavailable: XCircle,
  }

  const Icon = icons[status] || Clock
  return <Icon className="h-4 w-4" />
}

export function RequestsHistory() {
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['catalog-requests'],
    queryFn: () => fetchUserRequests(),
    staleTime: 30000, // 30 seconds
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-24 bg-gray-200 rounded" />
          </Card>
        ))}
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <PackageSearch className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Nenhuma solicitação ainda
        </h2>
        <p className="text-gray-600 mb-6">
          Você ainda não solicitou nenhum produto
        </p>
        <Button asChild>
          <a href="/catalogo/solicitar-produto">Solicitar Produto</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="p-6">
          <div className="flex items-start justify-between gap-4">
            {/* Request Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {request.product_name}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRequestStatusColor(
                    request.status
                  )}`}
                >
                  {getStatusIcon(request.status)}
                  {getRequestStatusLabel(request.status)}
                </span>
              </div>

              {request.observations && (
                <p className="text-sm text-gray-600 mb-3">
                  {request.observations}
                </p>
              )}

              {request.admin_notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-xs font-semibold text-blue-900 mb-1">
                    Resposta do Gestor:
                  </p>
                  <p className="text-sm text-blue-800">{request.admin_notes}</p>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  Criado em{' '}
                  {format(new Date(request.created_at), "dd 'de' MMMM 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </span>
                {request.updated_at !== request.created_at && (
                  <span>
                    Atualizado em{' '}
                    {format(
                      new Date(request.updated_at),
                      "dd 'de' MMMM 'às' HH:mm",
                      {
                        locale: ptBR,
                      }
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* New Request Button */}
      <div className="flex justify-center pt-4">
        <Button asChild variant="outline">
          <a href="/catalogo/solicitar-produto">
            <PackageSearch className="mr-2 h-4 w-4" />
            Nova Solicitação
          </a>
        </Button>
      </div>
    </div>
  )
}
