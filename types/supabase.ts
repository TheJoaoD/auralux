export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agendamento_demandas: {
        Row: {
          categoria: string | null
          data_atualizacao: string | null
          data_criacao: string | null
          data_hora_agendada: string
          descricao: string | null
          id: number
          notificacoes_enviadas: Json | null
          padrao_recorrencia: string | null
          prioridade: string
          recorrente: boolean | null
          responsavel: string | null
          status: string
          tags: string[] | null
          tempo_antecipacao_aviso: number
          titulo_demanda: string
          usuario_contato: string
          usuario_nome: string
        }
        Insert: {
          categoria?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_hora_agendada: string
          descricao?: string | null
          id?: number
          notificacoes_enviadas?: Json | null
          padrao_recorrencia?: string | null
          prioridade?: string
          recorrente?: boolean | null
          responsavel?: string | null
          status?: string
          tags?: string[] | null
          tempo_antecipacao_aviso?: number
          titulo_demanda: string
          usuario_contato: string
          usuario_nome: string
        }
        Update: {
          categoria?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_hora_agendada?: string
          descricao?: string | null
          id?: number
          notificacoes_enviadas?: Json | null
          padrao_recorrencia?: string | null
          prioridade?: string
          recorrente?: boolean | null
          responsavel?: string | null
          status?: string
          tags?: string[] | null
          tempo_antecipacao_aviso?: number
          titulo_demanda?: string
          usuario_contato?: string
          usuario_nome?: string
        }
        Relationships: []
      }
      cash_flow: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          transaction_date: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_date: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_date?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_flow_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_flow_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_cart: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          updated_at: string | null
          user_whatsapp: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string | null
          user_whatsapp: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string | null
          user_whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_top_selling_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "catalog_cart_user_whatsapp_fkey"
            columns: ["user_whatsapp"]
            isOneToOne: false
            referencedRelation: "catalog_users"
            referencedColumns: ["whatsapp"]
          },
        ]
      }
      catalog_favorites: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_whatsapp: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_whatsapp: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_top_selling_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "catalog_favorites_user_whatsapp_fkey"
            columns: ["user_whatsapp"]
            isOneToOne: false
            referencedRelation: "catalog_users"
            referencedColumns: ["whatsapp"]
          },
        ]
      }
      catalog_items: {
        Row: {
          created_at: string | null
          featured: boolean | null
          featured_order: number | null
          fragrance_notes_base: string | null
          fragrance_notes_heart: string | null
          fragrance_notes_top: string | null
          id: string
          intensity: string | null
          longevity: string | null
          occasion: string[] | null
          product_id: string
          stock_return_date: string | null
          updated_at: string | null
          visible: boolean | null
        }
        Insert: {
          created_at?: string | null
          featured?: boolean | null
          featured_order?: number | null
          fragrance_notes_base?: string | null
          fragrance_notes_heart?: string | null
          fragrance_notes_top?: string | null
          id?: string
          intensity?: string | null
          longevity?: string | null
          occasion?: string[] | null
          product_id: string
          stock_return_date?: string | null
          updated_at?: string | null
          visible?: boolean | null
        }
        Update: {
          created_at?: string | null
          featured?: boolean | null
          featured_order?: number | null
          fragrance_notes_base?: string | null
          fragrance_notes_heart?: string | null
          fragrance_notes_top?: string | null
          id?: string
          intensity?: string | null
          longevity?: string | null
          occasion?: string[] | null
          product_id?: string
          stock_return_date?: string | null
          updated_at?: string | null
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "v_low_stock_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "v_top_selling_products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      catalog_orders: {
        Row: {
          created_at: string | null
          id: string
          items: Json
          status: Database["public"]["Enums"]["catalog_order_status"] | null
          total: number
          user_whatsapp: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          items: Json
          status?: Database["public"]["Enums"]["catalog_order_status"] | null
          total: number
          user_whatsapp: string
        }
        Update: {
          created_at?: string | null
          id?: string
          items?: Json
          status?: Database["public"]["Enums"]["catalog_order_status"] | null
          total?: number
          user_whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_orders_user_whatsapp_fkey"
            columns: ["user_whatsapp"]
            isOneToOne: false
            referencedRelation: "catalog_users"
            referencedColumns: ["whatsapp"]
          },
        ]
      }
      catalog_product_views: {
        Row: {
          id: string
          product_id: string
          session_id: string
          user_whatsapp: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          session_id: string
          user_whatsapp?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          session_id?: string
          user_whatsapp?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_product_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_product_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_product_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_top_selling_products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      catalog_requests: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          id: string
          observations: string | null
          product_name: string
          status: Database["public"]["Enums"]["catalog_request_status"] | null
          updated_at: string | null
          user_whatsapp: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          observations?: string | null
          product_name: string
          status?: Database["public"]["Enums"]["catalog_request_status"] | null
          updated_at?: string | null
          user_whatsapp: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          observations?: string | null
          product_name?: string
          status?: Database["public"]["Enums"]["catalog_request_status"] | null
          updated_at?: string | null
          user_whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalog_requests_user_whatsapp_fkey"
            columns: ["user_whatsapp"]
            isOneToOne: false
            referencedRelation: "catalog_users"
            referencedColumns: ["whatsapp"]
          },
        ]
      }
      catalog_users: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          whatsapp: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          whatsapp: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
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
      discounts: {
        Row: {
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          minimum_purchase: number | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          minimum_purchase?: number | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          minimum_purchase?: number | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      google_validation: {
        Row: {
          contato: string | null
          created_at: string
          id: number
          valido: boolean | null
        }
        Insert: {
          contato?: string | null
          created_at?: string
          id?: number
          valido?: boolean | null
        }
        Update: {
          contato?: string | null
          created_at?: string
          id?: number
          valido?: boolean | null
        }
        Relationships: []
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
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_top_selling_products"
            referencedColumns: ["product_id"]
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
      memory: {
        Row: {
          embedding_vector: string | null
          id: number
          is_active: boolean | null
          message: Json
          metadata: Json | null
          session_id: string
          similarity_score: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          embedding_vector?: string | null
          id?: number
          is_active?: boolean | null
          message: Json
          metadata?: Json | null
          session_id: string
          similarity_score?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          embedding_vector?: string | null
          id?: number
          is_active?: boolean | null
          message?: Json
          metadata?: Json | null
          session_id?: string
          similarity_score?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
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
      registro_contas: {
        Row: {
          ano_referencia: number | null
          categoria: string
          comprovante_url: string | null
          data_atualizacao: string | null
          data_criacao: string | null
          data_pagamento: string | null
          data_vencimento: string | null
          descricao: string
          id: number
          mes_referencia: number | null
          metodo_pagamento: string | null
          observacoes: string | null
          periodicidade: string | null
          recorrente: boolean | null
          status: string
          tipo: string
          usuario_contato: string
          usuario_nome: string
          valor: number
        }
        Insert: {
          ano_referencia?: number | null
          categoria: string
          comprovante_url?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao: string
          id?: number
          mes_referencia?: number | null
          metodo_pagamento?: string | null
          observacoes?: string | null
          periodicidade?: string | null
          recorrente?: boolean | null
          status?: string
          tipo: string
          usuario_contato: string
          usuario_nome: string
          valor: number
        }
        Update: {
          ano_referencia?: number | null
          categoria?: string
          comprovante_url?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string
          id?: number
          mes_referencia?: number | null
          metodo_pagamento?: string | null
          observacoes?: string | null
          periodicidade?: string | null
          recorrente?: boolean | null
          status?: string
          tipo?: string
          usuario_contato?: string
          usuario_nome?: string
          valor?: number
        }
        Relationships: []
      }
      sale_installments: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string
          id: string
          installment_number: number
          notes: string | null
          paid_amount: number | null
          paid_at: string | null
          payment_method: string | null
          sale_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date: string
          id?: string
          installment_number: number
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_method?: string | null
          sale_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string
          id?: string
          installment_number?: number
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_method?: string | null
          sale_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_installments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_installments_user_id_fkey"
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
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_low_stock_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_top_selling_products"
            referencedColumns: ["product_id"]
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
          down_payment: number | null
          id: string
          installment_count: number | null
          notes: string | null
          payment_method: string
          payment_status: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_amount_received?: number | null
          created_at?: string
          customer_id?: string | null
          down_payment?: number | null
          id?: string
          installment_count?: number | null
          notes?: string | null
          payment_method: string
          payment_status?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_amount_received?: number | null
          created_at?: string
          customer_id?: string | null
          down_payment?: number | null
          id?: string
          installment_count?: number | null
          notes?: string | null
          payment_method?: string
          payment_status?: string | null
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
        Relationships: [
          {
            foreignKeyName: "sales_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_payment_method_breakdown: {
        Row: {
          avg_transaction_amount: number | null
          payment_method: string | null
          total_amount: number | null
          transaction_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      buscar_agendamentos: {
        Args: {
          p_data_fim?: string
          p_data_inicio?: string
          p_status?: string
          p_titulo_demanda?: string
          p_usuario_nome?: string
        }
        Returns: {
          categoria: string | null
          data_atualizacao: string | null
          data_criacao: string | null
          data_hora_agendada: string
          descricao: string | null
          id: number
          notificacoes_enviadas: Json | null
          padrao_recorrencia: string | null
          prioridade: string
          recorrente: boolean | null
          responsavel: string | null
          status: string
          tags: string[] | null
          tempo_antecipacao_aviso: number
          titulo_demanda: string
          usuario_contato: string
          usuario_nome: string
        }[]
        SetofOptions: {
          from: "*"
          to: "agendamento_demandas"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      catalog_order_status: "sent" | "contacted" | "converted" | "cancelled"
      catalog_request_status:
        | "pending"
        | "analyzing"
        | "fulfilled"
        | "unavailable"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      catalog_order_status: ["sent", "contacted", "converted", "cancelled"],
      catalog_request_status: [
        "pending",
        "analyzing",
        "fulfilled",
        "unavailable",
      ],
    },
  },
} as const
