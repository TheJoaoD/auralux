/**
 * Catalog Auth Modal
 * Epic 1 - Story 1.5: Modal de Autenticação WhatsApp
 *
 * Bottom sheet modal for WhatsApp authentication
 */

'use client'

import { useState, useEffect } from 'react'
import { X, Phone, User, Loader2, Check, AlertCircle } from 'lucide-react'
import { authenticateWithWhatsApp, completeRegistration } from '@/app/catalogo/actions/auth'
import { useCatalogAuth } from '@/lib/providers/catalog-auth-provider'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type Step = 'phone' | 'name'

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [step, setStep] = useState<Step>('phone')
  const [whatsapp, setWhatsapp] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep('phone')
      setWhatsapp('')
      setName('')
      setError(null)
      setIsLoading(false)
    }
  }, [isOpen])

  // Validate WhatsApp format
  useEffect(() => {
    const cleaned = whatsapp.replace(/\D/g, '')
    setIsValid(cleaned.length >= 11 && cleaned.length <= 15)
  }, [whatsapp])

  // Format WhatsApp for display
  const formatWhatsApp = (value: string) => {
    const cleaned = value.replace(/\D/g, '')

    if (cleaned.length <= 2) return `+${cleaned}`
    if (cleaned.length <= 4) return `+${cleaned.slice(0, 2)} ${cleaned.slice(2)}`
    if (cleaned.length <= 9) return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9, 13)}`
  }

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 15) {
      setWhatsapp(formatWhatsApp(cleaned))
      setError(null)
    }
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const cleanedPhone = '+' + whatsapp.replace(/\D/g, '')
      const result = await authenticateWithWhatsApp(cleanedPhone)

      if (!result.success) {
        setError(result.error || 'Erro ao autenticar')
        return
      }

      if (result.requiresName) {
        setStep('name')
      } else {
        onSuccess()
        onClose()
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const cleanedPhone = '+' + whatsapp.replace(/\D/g, '')
      const result = await completeRegistration(cleanedPhone, name)

      if (!result.success) {
        setError(result.error || 'Erro ao cadastrar')
        return
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal - Bottom Sheet on mobile */}
      <div className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50">
        <div className="bg-white rounded-t-3xl md:rounded-2xl w-full md:w-[400px] max-h-[80vh] overflow-hidden shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {step === 'phone' ? 'Entre com seu WhatsApp' : 'Complete seu cadastro'}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-50 rounded-full transition-colors opacity-40 hover:opacity-70"
              aria-label="Fechar"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <p className="text-sm text-gray-600">
                  Informe seu WhatsApp para acessar favoritos e receber ofertas exclusivas.
                </p>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={handleWhatsAppChange}
                    placeholder="+55 11 99999-9999"
                    className={`w-full pl-10 pr-10 py-3 border rounded-xl text-lg font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      error
                        ? 'border-red-300 focus:ring-red-200 bg-red-50'
                        : isValid
                        ? 'border-green-400 focus:ring-green-200 bg-green-50'
                        : 'border-gray-300 focus:ring-primary/20 focus:border-primary bg-gray-50'
                    }`}
                    autoFocus
                  />
                  {isValid && !error && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    'Continuar'
                  )}
                </button>

                <p className="text-xs text-center text-gray-500">
                  Ao continuar, você aceita receber mensagens sobre seus pedidos e ofertas.
                </p>
              </form>
            ) : (
              <form onSubmit={handleNameSubmit} className="space-y-4">
                <p className="text-sm text-gray-600">
                  Parece que você é novo por aqui! Como podemos te chamar?
                </p>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setError(null)
                    }}
                    placeholder="Seu nome"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-lg font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      error
                        ? 'border-red-300 focus:ring-red-200 bg-red-50'
                        : 'border-gray-300 focus:ring-primary/20 focus:border-primary bg-gray-50'
                    }`}
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={name.trim().length < 2 || isLoading}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    'Finalizar cadastro'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Voltar
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
