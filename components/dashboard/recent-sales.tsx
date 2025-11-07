"use client"

const recentSales = [
  { id: 1, customer: "John Okonkwo", amount: "₦8,450", time: "2 hours ago", status: "completed" },
  { id: 2, customer: "Amara Adeyemi", amount: "₦5,200", time: "5 hours ago", status: "completed" },
  { id: 3, customer: "Chisom Nwosu", amount: "₦12,300", time: "1 day ago", status: "pending" },
  { id: 4, customer: "Adeniyi Patel", amount: "₦3,900", time: "2 days ago", status: "completed" },
  { id: 5, customer: "Zainab Hassan", amount: "₦7,650", time: "3 days ago", status: "completed" },
]

export function RecentSales() {
  return (
    <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Sales</h3>
      <div className="space-y-2">
        {recentSales.map((sale) => (
          <div
            key={sale.id}
            className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50 hover:border-border transition-colors"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">{sale.customer}</p>
              <p className="text-xs text-muted-foreground">{sale.time}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-accent">{sale.amount}</span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  sale.status === "completed" ? "bg-green-400/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"
                }`}
              >
                {sale.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
