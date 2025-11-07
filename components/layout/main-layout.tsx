"use client"

import { type ReactNode, useState } from "react"
import { BottomNavigation } from "./bottom-navigation"
import { TopHeader } from "./top-header"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { CustomersPage } from "@/components/customers/customers-page"
import { InventoryPage } from "@/components/inventory/inventory-page"
import { SalesPage } from "@/components/sales/sales-page"

type Page = "dashboard" | "customers" | "inventory" | "sales"

interface MainLayoutProps {
  children?: ReactNode
  initialPage?: Page
}

export function MainLayout({ children, initialPage = "dashboard" }: MainLayoutProps) {
  const [currentPage, setCurrentPage] = useState<Page>(initialPage)

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "customers":
        return <CustomersPage />
      case "inventory":
        return <InventoryPage />
      case "sales":
        return <SalesPage />
      default:
        return children || <DashboardPage />
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden">
      {/* Header */}
      <TopHeader currentPage={currentPage} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{renderPage()}</main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  )
}
