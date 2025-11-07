"use client"

import type React from "react"

import { useState } from "react"
import { Lock, Mail } from "lucide-react"

interface LoginScreenProps {
  onSuccess: () => void
  onSignupClick?: () => void
  onForgotPasswordClick?: () => void
}

export function LoginScreen({ onSuccess, onSignupClick, onForgotPasswordClick }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (email && password) {
      onSuccess()
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-accent-foreground mb-4">
            <span className="text-2xl font-bold">A</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Auralux</h1>
          <p className="text-sm text-muted-foreground mt-1">Retail Management System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Links */}
        <div className="flex items-center justify-between text-sm">
          <button onClick={onSignupClick} className="text-accent hover:text-accent/90 transition-colors">
            Create Account
          </button>
          <button
            onClick={onForgotPasswordClick}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Demo Info */}
        <div className="p-3 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted-foreground text-center">Demo: Use any email & password</p>
        </div>
      </div>
    </div>
  )
}
