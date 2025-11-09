'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { DiscountsList } from '@/components/discounts/DiscountsList'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function DiscountsPage() {
  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto px-4 pb-8">
        {/* Header */}
        <div className="pt-4 pb-6">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 text-[#E0DCD1]/70 hover:text-[#E0DCD1] transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Configurações
          </Link>
          <h1 className="text-2xl font-bold text-[#E0DCD1]">
            Gerenciar Descontos
          </h1>
          <p className="text-[#E0DCD1]/70 mt-2">
            Crie e gerencie descontos percentuais ou com valor fixo para suas
            vendas
          </p>
        </div>

        {/* Discounts List */}
        <div className="bg-[#A1887F] rounded-2xl p-6">
          <DiscountsList />
        </div>
      </div>
    </MainLayout>
  )
}
