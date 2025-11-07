'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormData } from '@/lib/validations/authSchemas'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { APP_LOGIN_LOGO_URL } from '@/lib/constants/branding'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos')
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Confirme seu email antes de fazer login')
        } else {
          toast.error('Erro ao fazer login. Tente novamente')
        }
        return
      }

      // Success - redirect to dashboard
      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Erro de conexão. Tente novamente')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src={APP_LOGIN_LOGO_URL}
            alt="Auralux"
            width={240}
            height={80}
            className="h-20 w-auto"
            priority
          />
        </div>

        {/* Login Card */}
        <div className="bg-[#A1887F] rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <h1 className="text-2xl font-bold text-[#E0DCD1] mb-6 text-center">
            Bem-vindo ao Auralux
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#E0DCD1] mb-2"
              >
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-[#202020] border border-[#E0DCD1]/20 rounded-lg text-[#E0DCD1] placeholder-[#E0DCD1]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#E0DCD1] mb-2"
              >
                Senha
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-[#202020] border border-[#E0DCD1]/20 rounded-lg text-[#E0DCD1] placeholder-[#E0DCD1]/50 focus:outline-none focus:ring-2 focus:ring-[#C49A9A] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C49A9A] hover:bg-[#B38989] text-[#202020] font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[#E0DCD1]/60 text-sm mt-6">
          Sistema de Gestão Auralux
        </p>
      </div>
    </div>
  )
}
