'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { APP_MAIN_LOGO_URL } from '@/lib/constants/branding'

export function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#A1887F] border-b border-[#E0DCD1]/20 safe-area-inset-top">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src={APP_MAIN_LOGO_URL}
            alt="Auralux"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>

        {/* Settings Icon */}
        <Link
          href="/settings"
          className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full text-[#E0DCD1] hover:text-[#C49A9A] hover:bg-[#E0DCD1]/10 transition-colors"
          aria-label="Configurações"
        >
          <Settings className="h-6 w-6" />
        </Link>
      </div>
    </header>
  )
}
