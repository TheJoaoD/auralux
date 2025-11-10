/**
 * Catalog Admin Dashboard
 * Epic 4 - Story 4.1: Admin Catalog Route
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, Star, MessageSquare, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { fetchCatalogMetrics } from './actions'

export default function CatalogAdminPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['catalog-metrics'],
    queryFn: () => fetchCatalogMetrics(),
    staleTime: 30000,
  })

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 pb-8">
        {/* Header */}
        <div className="flex flex-col gap-4 pt-4 pb-6">
          <h1 className="text-2xl font-bold text-[#E0DCD1]">Gestão de Catálogo</h1>
          <p className="text-[#E0DCD1]/70">
            Gerencie produtos, solicitações e pedidos do catálogo público
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Products */}
          <Link href="/catalogo-admin?tab=produtos">
            <Card className="p-6 bg-[#A1887F] border-[#E0DCD1]/20 hover:bg-[#8D7A6F] transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#E0DCD1]/70 mb-1">
                    Produtos Visíveis
                  </p>
                  <p className="text-3xl font-bold text-[#E0DCD1]">
                    {isLoading ? '...' : metrics?.totalProducts || 0}
                  </p>
                </div>
                <div className="p-3 bg-[#C49A9A]/20 rounded-full">
                  <Package className="h-6 w-6 text-[#C49A9A]" />
                </div>
              </div>
            </Card>
          </Link>

          {/* Featured Products */}
          <Link href="/catalogo-admin?tab=produtos">
            <Card className="p-6 bg-[#A1887F] border-[#E0DCD1]/20 hover:bg-[#8D7A6F] transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#E0DCD1]/70 mb-1">
                    Em Destaque
                  </p>
                  <p className="text-3xl font-bold text-[#E0DCD1]">
                    {isLoading ? '...' : metrics?.featuredProducts || 0}
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-full">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </Card>
          </Link>

          {/* Pending Requests */}
          <Link href="/catalogo-admin?tab=solicitacoes">
            <Card className="p-6 bg-[#A1887F] border-[#E0DCD1]/20 hover:bg-[#8D7A6F] transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#E0DCD1]/70 mb-1">
                    Solicitações Pendentes
                  </p>
                  <p className="text-3xl font-bold text-[#E0DCD1]">
                    {isLoading ? '...' : metrics?.pendingRequests || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </Card>
          </Link>

          {/* Orders Today */}
          <Link href="/catalogo-admin?tab=pedidos">
            <Card className="p-6 bg-[#A1887F] border-[#E0DCD1]/20 hover:bg-[#8D7A6F] transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#E0DCD1]/70 mb-1">
                    Pedidos Hoje
                  </p>
                  <p className="text-3xl font-bold text-[#E0DCD1]">
                    {isLoading ? '...' : metrics?.ordersToday || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="produtos" className="w-full">
          <TabsList className="bg-[#A1887F] border-[#E0DCD1]/20 mb-6">
            <TabsTrigger value="produtos" className="data-[state=active]:bg-[#C49A9A]">
              Produtos
            </TabsTrigger>
            <TabsTrigger value="solicitacoes" className="data-[state=active]:bg-[#C49A9A]">
              Solicitações
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="data-[state=active]:bg-[#C49A9A]">
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#C49A9A]">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="produtos">
            <Card className="p-8 bg-[#A1887F] border-[#E0DCD1]/20 text-center">
              <Package className="h-12 w-12 text-[#E0DCD1]/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#E0DCD1] mb-2">
                Gerenciamento de Produtos
              </h3>
              <p className="text-[#E0DCD1]/70 mb-6">
                Visualize e gerencie produtos do catálogo
              </p>
              <Link
                href="/catalogo-admin/produtos"
                className="inline-block bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Ver Produtos
              </Link>
            </Card>
          </TabsContent>

          <TabsContent value="solicitacoes">
            <Card className="p-8 bg-[#A1887F] border-[#E0DCD1]/20 text-center">
              <MessageSquare className="h-12 w-12 text-[#E0DCD1]/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#E0DCD1] mb-2">
                Solicitações de Produtos
              </h3>
              <p className="text-[#E0DCD1]/70 mb-6">
                Gerencie solicitações dos clientes
              </p>
              <Link
                href="/catalogo-admin/solicitacoes"
                className="inline-block bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Ver Solicitações
              </Link>
            </Card>
          </TabsContent>

          <TabsContent value="pedidos">
            <Card className="p-8 bg-[#A1887F] border-[#E0DCD1]/20 text-center">
              <ShoppingCart className="h-12 w-12 text-[#E0DCD1]/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#E0DCD1] mb-2">
                Pedidos do Catálogo
              </h3>
              <p className="text-[#E0DCD1]/70 mb-6">
                Visualize pedidos enviados via WhatsApp
              </p>
              <Link
                href="/catalogo-admin/pedidos"
                className="inline-block bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Ver Pedidos
              </Link>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-8 bg-[#A1887F] border-[#E0DCD1]/20 text-center">
              <p className="text-[#E0DCD1]/70">Analytics em breve...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
