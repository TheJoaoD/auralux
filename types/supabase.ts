export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          purchase_count: number
          total_due: number
          total_purchases: number
          updated_at: string
          user_id: string
          whatsapp: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          purchase_count?: number
          total_due?: number
          total_purchases?: number
          updated_at?: string
          user_id: string
          whatsapp: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          purchase_count?: number
          total_due?: number
          total_purchases?: number
          updated_at?: string
          user_id?: string
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string
          id: string
          movement_type: string
          notes: string | null
          product_id: string
          quantity_after: number
          quantity_before: number
          quantity_change: number
          reference_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          movement_type: string
          notes?: string | null
          product_id: string
          quantity_after: number
          quantity_before: number
          quantity_change: number
          reference_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          movement_type?: string
          notes?: string | null
          product_id?: string
          quantity_after?: number
          quantity_before?: number
          quantity_change?: number
          reference_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          cost_price: number
          created_at: string
          id: string
          image_url: string | null
          low_stock_threshold: number
          name: string
          quantity: number
          sale_price: number
          sku: string | null
          supplier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id?: string | null
          cost_price: number
          created_at?: string
          id?: string
          image_url?: string | null
          low_stock_threshold?: number
          name: string
          quantity?: number
          sale_price: number
          sku?: string | null
          supplier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string | null
          cost_price?: number
          created_at?: string
          id?: string
          image_url?: string | null
          low_stock_threshold?: number
          name?: string
          quantity?: number
          sale_price?: number
          sku?: string | null
          supplier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          product_name: string
          quantity: number
          sale_id: string
          unit_cost: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name: string
          quantity: number
          sale_id: string
          unit_cost: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          sale_id?: string
          unit_cost?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          actual_amount_received: number | null
          created_at: string
          customer_id: string | null
          id: string
          installment_count: number
          notes: string | null
          payment_method: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_amount_received?: number | null
          created_at?: string
          customer_id?: string | null
          id?: string
          installment_count?: number
          notes?: string | null
          payment_method: string
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_amount_received?: number | null
          created_at?: string
          customer_id?: string | null
          id?: string
          installment_count?: number
          notes?: string | null
          payment_method?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          store_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          store_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          store_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_daily_sales_metrics: {
        Row: {
          avg_sale_amount: number | null
          sale_date: string | null
          total_revenue: number | null
          total_sales: number | null
          unique_customers: number | null
          user_id: string | null
        }
      }
      v_low_stock_products: {
        Row: {
          category_name: string | null
          id: string | null
          low_stock_threshold: number | null
          name: string | null
          quantity: number | null
          sku: string | null
          user_id: string | null
        }
      }
      v_payment_method_breakdown: {
        Row: {
          avg_transaction_amount: number | null
          payment_method: string | null
          total_amount: number | null
          transaction_count: number | null
          user_id: string | null
        }
      }
      v_top_selling_products: {
        Row: {
          number_of_sales: number | null
          product_id: string | null
          product_name: string | null
          sku: string | null
          total_profit: number | null
          total_quantity_sold: number | null
          total_revenue: number | null
          user_id: string | null
        }
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
