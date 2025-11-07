"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardSalesReport() {
  const weeklySalesData = [
    { day: "Mon", cash: 2400, card: 2210 },
    { day: "Tue", cash: 1398, card: 2210 },
    { day: "Wed", cash: 9800, card: 2290 },
    { day: "Thu", cash: 3908, card: 2000 },
    { day: "Fri", cash: 4800, card: 2181 },
    { day: "Sat", cash: 3800, card: 2500 },
    { day: "Sun", cash: 4300, card: 2100 },
  ]

  const paymentMethodData = [
    { name: "Cash", value: 65, color: "hsl(var(--chart-1))" },
    { name: "Card", value: 35, color: "hsl(var(--chart-2))" },
  ]

  const totalRevenue = weeklySalesData.reduce((sum, day) => sum + day.cash + day.card, 0)

  return (
    <div className="space-y-6">
      {/* Sales Report Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Sales Report</h2>
        <p className="text-muted-foreground">Weekly sales breakdown and payment methods</p>
      </div>

      {/* Weekly Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Sales Breakdown</CardTitle>
          <CardDescription>Sales by payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySalesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                />
                <Legend />
                <Bar dataKey="cash" fill="hsl(var(--chart-1))" name="Cash Sales" radius={[8, 8, 0, 0]} />
                <Bar dataKey="card" fill="hsl(var(--chart-2))" name="Card Sales" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Summary & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Total Weekly Revenue</CardTitle>
            <CardDescription>All sales combined</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-accent">₦{totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-2">Across all payment methods</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Sales distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {paymentMethodData.map((method, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }} />
                    <span>{method.name}</span>
                  </div>
                  <span className="font-semibold">{method.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
