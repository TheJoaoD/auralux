/**
 * Product Details Edit Page
 * Epic 4 - Story 4.3: Product Details Form
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export default function EditProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [productId, setProductId] = useState('')
  const [formData, setFormData] = useState({
    fragrance_notes_top: '',
    fragrance_notes_heart: '',
    fragrance_notes_base: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  // Get productId from params
  useState(() => {
    params.then((p) => setProductId(p.id))
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // TODO: Implement save logic
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Detalhes salvos com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar detalhes')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 pt-4 pb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#E0DCD1]">
              Editar Detalhes do Produto
            </h1>
            <p className="text-[#E0DCD1]/70 text-sm mt-1">
              Adicione informações extras para o catálogo
            </p>
          </div>
          {productId && (
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={`/catalogo/produto/${productId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview
              </a>
            </Button>
          )}
        </div>

        {/* Form */}
        <Card className="p-6 bg-[#A1887F] border-[#E0DCD1]/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fragrance Notes Top */}
            <div>
              <Label htmlFor="top" className="text-[#E0DCD1]">
                Notas de Topo
              </Label>
              <p className="text-xs text-[#E0DCD1]/70 mb-2">
                Ex: Bergamota, Limão Siciliano, Cardamomo
              </p>
              <Textarea
                id="top"
                value={formData.fragrance_notes_top}
                onChange={(e) =>
                  setFormData({ ...formData, fragrance_notes_top: e.target.value })
                }
                placeholder="Descreva as notas de topo..."
                maxLength={500}
                rows={3}
                className="bg-[#E0DCD1]/10 border-[#E0DCD1]/20 text-[#E0DCD1]"
              />
              <p className="text-xs text-[#E0DCD1]/50 mt-1">
                {formData.fragrance_notes_top.length}/500
              </p>
            </div>

            {/* Fragrance Notes Heart */}
            <div>
              <Label htmlFor="heart" className="text-[#E0DCD1]">
                Notas de Coração
              </Label>
              <p className="text-xs text-[#E0DCD1]/70 mb-2">
                Ex: Jasmim, Rosa, Gerânio
              </p>
              <Textarea
                id="heart"
                value={formData.fragrance_notes_heart}
                onChange={(e) =>
                  setFormData({ ...formData, fragrance_notes_heart: e.target.value })
                }
                placeholder="Descreva as notas de coração..."
                maxLength={500}
                rows={3}
                className="bg-[#E0DCD1]/10 border-[#E0DCD1]/20 text-[#E0DCD1]"
              />
              <p className="text-xs text-[#E0DCD1]/50 mt-1">
                {formData.fragrance_notes_heart.length}/500
              </p>
            </div>

            {/* Fragrance Notes Base */}
            <div>
              <Label htmlFor="base" className="text-[#E0DCD1]">
                Notas de Fundo
              </Label>
              <p className="text-xs text-[#E0DCD1]/70 mb-2">
                Ex: Âmbar, Almíscar, Sândalo
              </p>
              <Textarea
                id="base"
                value={formData.fragrance_notes_base}
                onChange={(e) =>
                  setFormData({ ...formData, fragrance_notes_base: e.target.value })
                }
                placeholder="Descreva as notas de fundo..."
                maxLength={500}
                rows={3}
                className="bg-[#E0DCD1]/10 border-[#E0DCD1]/20 text-[#E0DCD1]"
              />
              <p className="text-xs text-[#E0DCD1]/50 mt-1">
                {formData.fragrance_notes_base.length}/500
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-[#C49A9A] hover:bg-[#B38989] text-[#202020]"
              >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
