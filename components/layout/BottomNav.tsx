'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Users, LayoutDashboard, Package } from 'lucide-react'

const navigation = [
  {
    name: 'Clientes',
    href: '/customers',
    icon: Users,
  },
  {
    name: 'Vendas',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Estoque',
    href: '/inventory',
    icon: Package,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#A1887F] border-t border-[#E0DCD1]/20" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex justify-around items-center h-16 px-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1
                min-w-[44px] min-h-[44px] flex-1 rounded-lg
                transition-colors duration-200
                ${
                  isActive
                    ? 'text-[#C49A9A]'
                    : 'text-[#E0DCD1]/70 hover:text-[#E0DCD1]'
                }
              `}
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
