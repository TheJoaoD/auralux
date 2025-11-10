/**
 * Request Product Form Component
 * Epic 3 - Story 3.4: Product Request System
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createRequest } from '@/app/catalogo/actions/requests'
import { toast } from 'sonner'

export function RequestProductForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    product_name: '',
    observations: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.product_name.trim()) {
      toast.error('Digite o nome do produto')
      return
    }

    try {
      setIsSubmitting(true)

      await createRequest({
        product_name: formData.product_name,
        observations: formData.observations || undefined,
      })

      toast.success('Solicitação enviada! O gestor entrará em contato.')

      // Redirect to requests history
      router.push('/catalogo/solicitacoes')
    } catch (error) {
      console.error('Request error:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar solicitação')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <Label htmlFor="product_name" className="text-base font-semibold">
            Nome do Produto *
          </Label>
          <p className="text-sm text-muted-foreground mt-1 mb-2">
            Descreva o produto que você está procurando
          </p>
          <Input
            id="product_name"
            type="text"
            placeholder="Ex: Perfume Importado XYZ, Essência de Lavanda..."
            value={formData.product_name}
            onChange={(e) =>
              setFormData({ ...formData, product_name: e.target.value })
            }
            required
            maxLength={200}
            disabled={isSubmitting}
          />
        </div>

        {/* Observations */}
        <div>
          <Label htmlFor="observations" className="text-base font-semibold">
            Observações
          </Label>
          <p className="text-sm text-muted-foreground mt-1 mb-2">
            Detalhes adicionais que podem ajudar (marca, tipo, características...)
          </p>
          <Textarea
            id="observations"
            placeholder="Ex: Gostaria de um perfume amadeirado, de preferência da marca X..."
            value={formData.observations}
            onChange={(e) =>
              setFormData({ ...formData, observations: e.target.value })
            }
            rows={4}
            maxLength={500}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.observations.length}/500 caracteres
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting || !formData.product_name.trim()}
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
          </Button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            💡 <strong>Dica:</strong> Quanto mais detalhes você fornecer, mais fácil
            será para nossa equipe encontrar o produto ideal para você!
          </p>
        </div>
      </form>
    </Card>
  )
}
