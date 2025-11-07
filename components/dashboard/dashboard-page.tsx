"use client"

import { Users, Package, ShoppingCart, TrendingUp } from "lucide-react"
import { KPICard } from "./kpi-card"
import { SalesChart } from "./sales-chart"
import { InventoryAlert } from "./inventory-alert"
import { QuickActions } from "./quick-actions"
import { RecentSales } from "./recent-sales"
import { DashboardSalesReport } from "./dashboard-sales-report"

export function DashboardPage() {
  // Mock data - replace with real data from backend
  const kpis = [
    {
      title: "Today's Sales",
      value: "$4,250",
      change: "+12%",
      icon: ShoppingCart,
      trend: "up",
    },
    {
      title: "Total Customers",
      value: "1,248",
      change: "+8%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Inventory Items",
      value: "3,542",
      change: "-2%",
      icon: Package,
      trend: "down",
    },
    {
      title: "Week's Revenue",
      value: "$24,890",
      change: "+15%",
      icon: TrendingUp,
      trend: "up",
    },
  ]

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <InventoryAlert />
      </div>

      {/* Quick Actions & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions />
        <RecentSales />
      </div>

      <DashboardSalesReport />
    </div>
  )
}
