// Generated from the AkusoftV3 Supabase project (public schema).
// Regenerate with the Supabase MCP `generate_typescript_types` or
// `npx supabase gen types typescript` after schema changes.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          balance: number
          category: string
          code: string | null
          company_id: string
          created_at: string | null
          enabled: boolean | null
          id: string
          is_default: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          balance?: number
          category: string
          code?: string | null
          company_id: string
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          is_default?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          balance?: number
          category?: string
          code?: string | null
          company_id?: string
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          is_default?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          code: string | null
          company_id: string
          created_at: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          code?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          code?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          created_at: string | null
          currency: string | null
          email: string | null
          enabled: boolean | null
          id: string
          logo_path: string | null
          name: string
          phone: string | null
          retained_earnings: number | null
          setup_completed: boolean | null
          tax_number: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          enabled?: boolean | null
          id?: string
          logo_path?: string | null
          name: string
          phone?: string | null
          retained_earnings?: number | null
          setup_completed?: boolean | null
          tax_number?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          enabled?: boolean | null
          id?: string
          logo_path?: string | null
          name?: string
          phone?: string | null
          retained_earnings?: number | null
          setup_completed?: boolean | null
          tax_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      items: {
        Row: {
          category: string | null
          company_id: string
          created_at: string | null
          description: string | null
          enabled: boolean | null
          id: string
          image_path: string | null
          name: string
          purchase_price: number
          quantity: number
          sale_price: number
          sku: string | null
          taxable: boolean | null
        }
        Insert: {
          category?: string | null
          company_id: string
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          image_path?: string | null
          name: string
          purchase_price?: number
          quantity?: number
          sale_price?: number
          sku?: string | null
          taxable?: boolean | null
        }
        Update: {
          category?: string | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          image_path?: string | null
          name?: string
          purchase_price?: number
          quantity?: number
          sale_price?: number
          sku?: string | null
          taxable?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          company_id: string
          created_at: string | null
          details: string | null
          enabled: boolean | null
          id: string
          name: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          details?: string | null
          enabled?: boolean | null
          id?: string
          name: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          details?: string | null
          enabled?: boolean | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_items: {
        Row: {
          company_id: string
          id: string
          item_id: string | null
          name: string
          price: number
          quantity: number
          total: number
          transaction_id: string
        }
        Insert: {
          company_id: string
          id?: string
          item_id?: string | null
          name: string
          price?: number
          quantity?: number
          total?: number
          transaction_id: string
        }
        Update: {
          company_id?: string
          id?: string
          item_id?: string | null
          name?: string
          price?: number
          quantity?: number
          total?: number
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          basis: string | null
          category: string | null
          company_id: string
          created_at: string | null
          currency: string | null
          customer: string | null
          description: string | null
          expense_type: string | null
          id: string
          income_type: string | null
          paid_at: string
          payment_method: string | null
          type: string
        }
        Insert: {
          account_id?: string | null
          amount?: number
          basis?: string | null
          category?: string | null
          company_id: string
          created_at?: string | null
          currency?: string | null
          customer?: string | null
          description?: string | null
          expense_type?: string | null
          id?: string
          income_type?: string | null
          paid_at?: string
          payment_method?: string | null
          type: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          basis?: string | null
          category?: string | null
          company_id?: string
          created_at?: string | null
          currency?: string | null
          customer?: string | null
          description?: string | null
          expense_type?: string | null
          id?: string
          income_type?: string | null
          paid_at?: string
          payment_method?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_companies: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_company_with_defaults: {
        Args: { p_email?: string; p_name: string; p_tax_number?: string }
        Returns: string
      }
      is_member_of_company: { Args: { cid: string }; Returns: boolean }
      seed_company_defaults: {
        Args: { p_company_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]
