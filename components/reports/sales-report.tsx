"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const salesData = [
  { date: "Jan 1", cash: 15000, card: 8000, installment: 5000 },
  { date: "Jan 8", cash: 18000, card: 12000, installment: 7000 },
  { date: "Jan 15", cash: 21000, card: 15000, installment: 9000 },
  { date: "Jan 22", cash: 19000, card: 13000, installment: 8000 },
  { date: "Jan 29", cash: 24000, card: 18000, installment: 11000 },
]

export function SalesReport() {
  const totalSales = salesData.reduce((sum, day) => sum + day.cash + day.card + day.installment, 0)
  const avgDaily = totalSales / salesData.length

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-card border border-border space-y-1">
          <p className="text-sm text-muted-foreground">Total Sales</p>
          <p className="text-2xl font-bold text-accent">₦{totalSales.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border space-y-1">
          <p className="text-sm text-muted-foreground">Average Daily</p>
          <p className="text-2xl font-bold text-card-foreground">₦{Math.round(avgDaily).toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border space-y-1">
          <p className="text-sm text-muted-foreground">Cash Sales</p>
          <p className="text-2xl font-bold text-green-400">
            ₦{salesData.reduce((sum, d) => sum + d.cash, 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border space-y-1">
          <p className="text-sm text-muted-foreground">Installments</p>
          <p className="text-2xl font-bold text-purple-400">
            ₦{salesData.reduce((sum, d) => sum + d.installment, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Weekly Sales Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              formatter={(value: number) => `₦${value.toLocaleString()}`}
            />
            <Legend />
            <Bar dataKey="cash" fill="#4ade80" radius={[8, 8, 0, 0]} />
            <Bar dataKey="card" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="installment" fill="#a855f7" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
