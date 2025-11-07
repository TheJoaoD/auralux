"use client"

interface TopHeaderProps {
  currentPage: string
}

export function TopHeader({ currentPage }: TopHeaderProps) {
  const titleMap: Record<string, string> = {
    dashboard: "Dashboard",
    customers: "Customers",
    inventory: "Inventory",
    sales: "Sales",
    reports: "Reports",
  }

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-4">
      <div className="flex items-center justify-between max-w-full">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Auralux</h1>
          <p className="text-sm text-muted-foreground">{titleMap[currentPage] || "Welcome"}</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
          A
        </button>
      </div>
    </header>
  )
}
