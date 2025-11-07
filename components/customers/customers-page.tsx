"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { CustomerList } from "./customer-list"
import { AddCustomerModal } from "./add-customer-modal"
import { CustomerDetailModal } from "./customer-detail-modal"

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  totalPurchases: number
  totalDue: number
  createdAt: string
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Okonkwo",
    phone: "08012345678",
    email: "john@example.com",
    totalPurchases: 15,
    totalDue: 2500,
    createdAt: "2025-01-01",
  },
  {
    id: "2",
    name: "Amara Adeyemi",
    phone: "08087654321",
    email: "amara@example.com",
    totalPurchases: 8,
    totalDue: 0,
    createdAt: "2025-01-05",
  },
  {
    id: "3",
    name: "Chisom Nwosu",
    phone: "08112233445",
    email: "chisom@example.com",
    totalPurchases: 12,
    totalDue: 5400,
    createdAt: "2025-01-10",
  },
  { id: "4", name: "Adeniyi Patel", phone: "07066778899", totalPurchases: 5, totalDue: 1200, createdAt: "2025-01-15" },
  {
    id: "5",
    name: "Zainab Hassan",
    phone: "09011223344",
    email: "zainab@example.com",
    totalPurchases: 20,
    totalDue: 0,
    createdAt: "2025-01-20",
  },
]

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const filteredCustomers = customers.filter(
    (customer) => customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phone.includes(searchTerm),
  )

  const handleAddCustomer = (newCustomer: Omit<Customer, "id" | "createdAt" | "totalPurchases" | "totalDue">) => {
    const customer: Customer = {
      ...newCustomer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      totalPurchases: 0,
      totalDue: 0,
    }
    setCustomers([...customers, customer])
    setShowAddModal(false)
  }

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or phone..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Customer List */}
      <CustomerList customers={filteredCustomers} onSelectCustomer={setSelectedCustomer} />

      {/* Add Customer Modal */}
      {showAddModal && <AddCustomerModal onClose={() => setShowAddModal(false)} onAdd={handleAddCustomer} />}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
    </div>
  )
}
