"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, AlertCircle } from "lucide-react"
import { InstallmentOverview } from "./installment-overview"
import { InstallmentSchedule } from "./installment-schedule"
import { OverduePayments } from "./overdue-payments"
import { SalesReport } from "./sales-report"

type ReportTab = "installments" | "sales" | "overdue"

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("installments")

  const tabs = [
    { id: "installments", label: "Installments", icon: TrendingUp },
    { id: "sales", label: "Sales", icon: BarChart3 },
    { id: "overdue", label: "Overdue", icon: AlertCircle },
  ] as const

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Reports</h1>
        <p className="text-muted-foreground">Track sales, installments, and payments</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto pb-4">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === id
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "installments" && (
          <div className="space-y-6">
            <InstallmentOverview />
            <InstallmentSchedule />
          </div>
        )}

        {activeTab === "sales" && <SalesReport />}

        {activeTab === "overdue" && <OverduePayments />}
      </div>
    </div>
  )
}
