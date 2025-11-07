"use client"

import { Phone, Mail, ShoppingCart, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  totalPurchases: number
  totalDue: number
  createdAt: string
}

interface CustomerDetailModalProps {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerDetailModal({ customer, open, onOpenChange }: CustomerDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Customer Details</DialogTitle>
        </DialogHeader>

        {/* Customer Info */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="text-lg font-semibold text-card-foreground">{customer.name}</p>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-card-foreground">{customer.phone}</p>
            </div>
          </div>

          {/* Email */}
          {customer.email && (
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-card-foreground">{customer.email}</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart size={16} className="text-accent" />
                <p className="text-xs text-muted-foreground">Total Purchases</p>
              </div>
              <p className="text-2xl font-bold text-card-foreground">{customer.totalPurchases}</p>
            </div>

            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={16} className={customer.totalDue > 0 ? "text-destructive" : "text-green-400"} />
                <p className="text-xs text-muted-foreground">Total Due</p>
              </div>
              <p className={`text-2xl font-bold ${customer.totalDue > 0 ? "text-destructive" : "text-green-400"}`}>
                ₦{customer.totalDue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-6">
            <button className="flex-1 py-2.5 px-4 rounded-lg border border-border text-foreground hover:bg-background transition-colors text-sm font-medium">
              View History
            </button>
            <button className="flex-1 py-2.5 px-4 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity text-sm font-medium">
              New Sale
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
