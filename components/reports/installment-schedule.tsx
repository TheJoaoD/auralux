"use client"

import { Calendar, User, DollarSign } from "lucide-react"

interface Installment {
  id: string
  customerName: string
  dueDate: string
  amount: number
  status: "paid" | "pending" | "overdue"
}

const mockInstallments: Installment[] = [
  {
    id: "1",
    customerName: "John Okonkwo",
    dueDate: "2025-02-05",
    amount: 2500,
    status: "pending",
  },
  {
    id: "2",
    customerName: "Amara Adeyemi",
    dueDate: "2025-02-10",
    amount: 4200,
    status: "pending",
  },
  {
    id: "3",
    customerName: "Chisom Nwosu",
    dueDate: "2025-01-20",
    amount: 5000,
    status: "overdue",
  },
  {
    id: "4",
    customerName: "Adeniyi Patel",
    dueDate: "2025-02-15",
    amount: 3800,
    status: "pending",
  },
  {
    id: "5",
    customerName: "Zainab Hassan",
    dueDate: "2025-02-01",
    amount: 4100,
    status: "paid",
  },
]

export function InstallmentSchedule() {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-400/10 text-green-400 border-green-400/30"
      case "pending":
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/30"
      case "overdue":
        return "bg-destructive/10 text-destructive border-destructive/30"
      default:
        return ""
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground">Upcoming Payments</h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {mockInstallments.map((installment) => (
          <div
            key={installment.id}
            className="p-4 rounded-lg bg-background border border-border hover:border-accent transition-colors space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={16} className="text-muted-foreground" />
                <p className="font-medium text-card-foreground">{installment.customerName}</p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusStyles(installment.status)}`}
              >
                {installment.status.charAt(0).toUpperCase() + installment.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={14} />
                {installment.dueDate}
              </div>
              <div className="flex items-center gap-2 text-accent font-semibold">
                <DollarSign size={14} />₦{installment.amount.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
