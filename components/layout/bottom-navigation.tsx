"use client"

import { BarChart3, Users, Package, ShoppingCart } from "lucide-react"

interface BottomNavigationProps {
  currentPage: string
  onNavigate: (page: "dashboard" | "customers" | "inventory" | "sales") => void
}

export function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "customers", label: "Customers", icon: Users },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "sales", label: "Sales", icon: ShoppingCart },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border z-40">
      <div className="flex justify-around">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id as any)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors active:bg-background/50 ${
              currentPage === id ? "text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
