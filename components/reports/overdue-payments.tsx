"use client"

import { AlertTriangle, Phone, Mail, Calendar } from "lucide-react"

interface OverduePayment {
  id: string
  customerName: string
  phone: string
  dueAmount: number
  daysOverdue: number
  dueDate: string
}

const mockOverduePayments: OverduePayment[] = [
  {
    id: "1",
    customerName: "Chisom Nwosu",
    phone: "08112233445",
    dueAmount: 15000,
    daysOverdue: 18,
    dueDate: "2025-01-20",
  },
  {
    id: "2",
    customerName: "Tunde Okafor",
    phone: "09087654321",
    dueAmount: 8500,
    daysOverdue: 7,
    dueDate: "2025-01-30",
  },
  {
    id: "3",
    customerName: "Grace Ekpo",
    phone: "08145678901",
    dueAmount: 12300,
    daysOverdue: 25,
    dueDate: "2025-01-12",
  },
]

export function OverduePayments() {
  const totalOverdue = mockOverduePayments.reduce((sum, p) => sum + p.dueAmount, 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-card border border-border space-y-1">
          <p className="text-sm text-muted-foreground">Overdue Payments</p>
          <p className="text-2xl font-bold text-destructive">{mockOverduePayments.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border space-y-1">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-2xl font-bold text-accent">₦{totalOverdue.toLocaleString()}</p>
        </div>
      </div>

      {/* Overdue List */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-card-foreground">Overdue Accounts</h3>

        <div className="space-y-3">
          {mockOverduePayments.map((payment) => (
            <div key={payment.id} className="p-4 rounded-lg bg-background border border-border space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={20} className="text-destructive" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{payment.customerName}</p>
                    <p className="text-sm text-muted-foreground">{payment.daysOverdue} days overdue</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-destructive">₦{payment.dueAmount}</span>
              </div>

              {/* Contact & Action */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    <Phone size={14} />
                    Call
                  </button>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    <Mail size={14} />
                    SMS
                  </button>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar size={14} />
                  Due: {payment.dueDate}
                </div>
              </div>

              {/* Mark as Paid */}
              <button className="w-full py-2 px-3 rounded-lg border border-green-400/50 text-green-400 hover:bg-green-400/10 transition-colors text-sm font-medium">
                Mark as Paid
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
