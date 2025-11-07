import { ReactNode } from 'react'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { OnlineStatus } from '@/components/ui/OnlineStatus'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#202020] flex flex-col">
      {/* Top Bar - Fixed */}
      <TopBar />

      {/* Main Content Area - Scrollable with padding for fixed elements */}
      <main className="flex-1 pt-16 pb-16 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation - Fixed */}
      <BottomNav />

      {/* Online/Offline Indicator */}
      <OnlineStatus />
    </div>
  )
}
