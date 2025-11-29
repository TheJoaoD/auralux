"use client"

import { Plus, Users, Package, CreditCard } from "lucide-react"
import Link from "next/link"

const actions = [
  { icon: Plus, label: "New Sale", color: "text-accent", href: null },
  { icon: Users, label: "Add Customer", color: "text-blue-400", href: null },
  { icon: Package, label: "Restock", color: "text-green-400", href: null },
  { icon: CreditCard, label: "Parcelas", color: "text-purple-400", href: "/financeiro/parcelas" },
]

export function QuickActions() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon

          const content = (
            <>
              <Icon size={24} className={`${action.color} group-hover:scale-110 transition-transform`} />
              <span className="text-xs font-medium text-muted-foreground text-center">{action.label}</span>
            </>
          )

          if (action.href) {
            return (
              <Link
                key={idx}
                href={action.href}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background border border-border hover:border-accent transition-colors group"
              >
                {content}
              </Link>
            )
          }

          return (
            <button
              key={idx}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background border border-border hover:border-accent transition-colors group"
            >
              {content}
            </button>
          )
        })}
      </div>
    </div>
  )
}
