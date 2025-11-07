"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { InventoryList } from "./inventory-list"
import { AddProductModal } from "./add-product-modal"
import { ProductDetailModal } from "./product-detail-modal"

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  cost: number
  quantity: number
  reorderLevel: number
  supplier?: string
  image?: string
  createdAt: string
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Phone Case",
    sku: "PC-001",
    category: "Accessories",
    price: 2500,
    cost: 1200,
    quantity: 15,
    reorderLevel: 20,
    supplier: "Tech Supplies Ltd",
    createdAt: "2025-01-01",
  },
  {
    id: "2",
    name: "Screen Protector Pack (5)",
    sku: "SP-002",
    category: "Accessories",
    price: 1500,
    cost: 600,
    quantity: 8,
    reorderLevel: 50,
    supplier: "Quality Glass Co",
    createdAt: "2025-01-05",
  },
  {
    id: "3",
    name: "Charging Cable (USB-C)",
    sku: "CC-003",
    category: "Cables",
    price: 800,
    cost: 300,
    quantity: 3,
    reorderLevel: 100,
    supplier: "Digital Hub",
    createdAt: "2025-01-10",
  },
  {
    id: "4",
    name: "Wireless Earbuds",
    sku: "WE-004",
    category: "Audio",
    price: 8900,
    cost: 4500,
    quantity: 42,
    reorderLevel: 15,
    supplier: "Audio Tech Inc",
    createdAt: "2025-01-15",
  },
  {
    id: "5",
    name: "Phone Stand (Adjustable)",
    sku: "PS-005",
    category: "Accessories",
    price: 1200,
    cost: 500,
    quantity: 67,
    reorderLevel: 30,
    supplier: "Tech Supplies Ltd",
    createdAt: "2025-01-20",
  },
]

type FilterType = "all" | "low-stock" | "in-stock" | "out-of-stock"

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [categories, setCategories] = useState<string[]>(["Accessories", "Cables", "Audio"])
  const [newCategory, setNewCategory] = useState("")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.sku.includes(searchTerm)

    if (!matchesSearch) return false

    switch (filter) {
      case "low-stock":
        return product.quantity <= product.reorderLevel
      case "in-stock":
        return product.quantity > product.reorderLevel && product.quantity > 0
      case "out-of-stock":
        return product.quantity === 0
      default:
        return true
    }
  })

  const handleAddProduct = (newProduct: Omit<Product, "id" | "createdAt">) => {
    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    }
    setProducts([...products, product])
    setShowAddModal(false)
  }

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    setSelectedProduct(null)
  }

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-4 py-2 rounded-lg bg-card border border-border text-foreground font-medium hover:bg-background transition-colors"
          >
            Categories
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or SKU..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(["all", "in-stock", "low-stock", "out-of-stock"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? "bg-accent text-accent-foreground"
                : "bg-card border border-border text-foreground hover:border-accent"
            }`}
          >
            {f === "all" ? "All" : f === "low-stock" ? "Low Stock" : f === "in-stock" ? "In Stock" : "Out of Stock"}
          </button>
        ))}
      </div>

      {/* Product List */}
      <InventoryList products={filteredProducts} onSelectProduct={setSelectedProduct} />

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} onAdd={handleAddProduct} categories={categories} />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={handleUpdateProduct}
        />
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50 md:items-center">
          <div className="w-full md:w-96 bg-card rounded-t-2xl md:rounded-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-card-foreground">Manage Categories</h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 hover:bg-background rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category..."
                  className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                  >
                    <span className="text-card-foreground">{cat}</span>
                    <button
                      onClick={() => setCategories(categories.filter((c) => c !== cat))}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
