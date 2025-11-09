'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { Discount, DiscountInput } from '@/types'
import { Loader2 } from 'lucide-react'

interface DiscountFormProps {
  discount?: Discount
  onSubmit: (data: DiscountInput) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function DiscountForm({
  discount,
  onSubmit,
  onCancel,
  isLoading = false,
}: DiscountFormProps) {
  const [name, setName] = useState(discount?.name || '')
  const [description, setDescription] = useState(discount?.description || '')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(
    (discount?.discount_type as 'percentage' | 'fixed') || 'percentage'
  )
  const [discountValue, setDiscountValue] = useState(
    discount?.discount_value?.toString() || ''
  )
  const [minimumPurchase, setMinimumPurchase] = useState(
    discount?.minimum_purchase?.toString() || '0'
  )
  const [isActive, setIsActive] = useState(discount?.is_active ?? true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!discountValue || parseFloat(discountValue) <= 0) {
      newErrors.discountValue = 'Valor do desconto deve ser maior que zero'
    }

    if (
      discountType === 'percentage' &&
      parseFloat(discountValue) > 100
    ) {
      newErrors.discountValue =
        'Desconto percentual não pode ser maior que 100%'
    }

    if (minimumPurchase && parseFloat(minimumPurchase) < 0) {
      newErrors.minimumPurchase = 'Compra mínima não pode ser negativa'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const data: DiscountInput = {
      name: name.trim(),
      description: description.trim() || undefined,
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      minimum_purchase: minimumPurchase
        ? parseFloat(minimumPurchase)
        : undefined,
      is_active: isActive,
    }

    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Nome do Desconto <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Desconto Cliente VIP"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição opcional do desconto"
          rows={3}
          disabled={isLoading}
        />
      </div>

      {/* Discount Type */}
      <div className="space-y-2">
        <Label htmlFor="discount_type">
          Tipo de Desconto <span className="text-red-500">*</span>
        </Label>
        <Select
          value={discountType}
          onValueChange={(value) =>
            setDiscountType(value as 'percentage' | 'fixed')
          }
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentual (%)</SelectItem>
            <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Discount Value */}
      <div className="space-y-2">
        <Label htmlFor="discount_value">
          Valor do Desconto <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="discount_value"
            type="number"
            step="0.01"
            min="0"
            max={discountType === 'percentage' ? '100' : undefined}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder={
              discountType === 'percentage' ? 'Ex: 10' : 'Ex: 50.00'
            }
            disabled={isLoading}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {discountType === 'percentage' ? '%' : 'R$'}
          </span>
        </div>
        {errors.discountValue && (
          <p className="text-sm text-red-500">{errors.discountValue}</p>
        )}
      </div>

      {/* Minimum Purchase */}
      <div className="space-y-2">
        <Label htmlFor="minimum_purchase">Compra Mínima (R$)</Label>
        <Input
          id="minimum_purchase"
          type="number"
          step="0.01"
          min="0"
          value={minimumPurchase}
          onChange={(e) => setMinimumPurchase(e.target.value)}
          placeholder="Ex: 100.00"
          disabled={isLoading}
        />
        {errors.minimumPurchase && (
          <p className="text-sm text-red-500">{errors.minimumPurchase}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Valor mínimo de compra para aplicar o desconto (opcional)
        </p>
      </div>

      {/* Active Status */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="is_active">Desconto Ativo</Label>
          <p className="text-sm text-muted-foreground">
            Descontos inativos não aparecem na lista de vendas
          </p>
        </div>
        <Switch
          id="is_active"
          checked={isActive}
          onCheckedChange={setIsActive}
          disabled={isLoading}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : discount ? (
            'Atualizar'
          ) : (
            'Criar Desconto'
          )}
        </Button>
      </div>
    </form>
  )
}
