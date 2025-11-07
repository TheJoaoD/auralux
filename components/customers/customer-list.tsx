"use client"

import { ChevronRight, AlertCircle } from "lucide-react"

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  totalPurchases: number
  totalDue: number
  createdAt: string
}

interface CustomerListProps {
  customers: Customer[]
  onSelectCustomer: (customer: Customer) => void
}

export function CustomerList({ customers, onSelectCustomer }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
          <AlertCircle size={32} className="text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No customers found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {customers.map((customer) => (
        <button
          key={customer.id}
          onClick={() => onSelectCustomer(customer)}
          className="w-full p-4 rounded-lg bg-card border border-border hover:border-accent transition-colors text-left"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-medium text-card-foreground">{customer.name}</h3>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{customer.totalPurchases} purchases</span>
            {customer.totalDue > 0 && (
              <span className="text-destructive font-medium">₦{customer.totalDue.toLocaleString()}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
