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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          certificate_level: Database["public"]["Enums"]["certificate_level"]
          certificate_number: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          certificate_level: Database["public"]["Enums"]["certificate_level"]
          certificate_number: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          certificate_level?: Database["public"]["Enums"]["certificate_level"]
          certificate_number?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      mock_stocks: {
        Row: {
          current_price: number
          day_high: number | null
          day_low: number | null
          id: string
          name: string
          previous_close: number | null
          sector: string | null
          symbol: string
          updated_at: string
        }
        Insert: {
          current_price: number
          day_high?: number | null
          day_low?: number | null
          id?: string
          name: string
          previous_close?: number | null
          sector?: string | null
          symbol: string
          updated_at?: string
        }
        Update: {
          current_price?: number
          day_high?: number | null
          day_low?: number | null
          id?: string
          name?: string
          previous_close?: number | null
          sector?: string | null
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      module_content: {
        Row: {
          content: string | null
          content_type: string
          created_at: string
          id: string
          image_url: string | null
          module_id: string
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          content_type: string
          created_at?: string
          id?: string
          image_url?: string | null
          module_id: string
          order_index?: number
          title: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          content_type?: string
          created_at?: string
          id?: string
          image_url?: string | null
          module_id?: string
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_content_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          certificate_level: Database["public"]["Enums"]["certificate_level"]
          created_at: string
          description: string | null
          duration_minutes: number | null
          has_simulation: boolean | null
          id: string
          is_active: boolean | null
          module_number: number
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          certificate_level: Database["public"]["Enums"]["certificate_level"]
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          has_simulation?: boolean | null
          id?: string
          is_active?: boolean | null
          module_number: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          certificate_level?: Database["public"]["Enums"]["certificate_level"]
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          has_simulation?: boolean | null
          id?: string
          is_active?: boolean | null
          module_number?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          cash_balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cash_balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cash_balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string
          id: string
          mothers_first_name: string | null
          phone: string | null
          subscription_expires_at: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name: string
          id?: string
          mothers_first_name?: string | null
          phone?: string | null
          subscription_expires_at?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string
          id?: string
          mothers_first_name?: string | null
          phone?: string | null
          subscription_expires_at?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          correct_answer: number
          created_at: string
          explanation: string | null
          id: string
          module_id: string
          options: Json
          order_index: number
          question: string
        }
        Insert: {
          correct_answer: number
          created_at?: string
          explanation?: string | null
          id?: string
          module_id: string
          options: Json
          order_index?: number
          question: string
        }
        Update: {
          correct_answer?: number
          created_at?: string
          explanation?: string | null
          id?: string
          module_id?: string
          options?: Json
          order_index?: number
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_holdings: {
        Row: {
          average_cost: number
          created_at: string
          id: string
          portfolio_id: string
          quantity: number
          stock_id: string
          updated_at: string
        }
        Insert: {
          average_cost: number
          created_at?: string
          id?: string
          portfolio_id: string
          quantity: number
          stock_id: string
          updated_at?: string
        }
        Update: {
          average_cost?: number
          created_at?: string
          id?: string
          portfolio_id?: string
          quantity?: number
          stock_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_holdings_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_holdings_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "mock_stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string
          id: string
          portfolio_id: string
          price_per_share: number
          quantity: number
          stock_id: string
          total_amount: number
          transaction_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          portfolio_id: string
          price_per_share: number
          quantity: number
          stock_id: string
          total_amount: number
          transaction_type: string
        }
        Update: {
          created_at?: string
          id?: string
          portfolio_id?: string
          price_per_share?: number
          quantity?: number
          stock_id?: string
          total_amount?: number
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "mock_stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          module_id: string
          quiz_passed: boolean | null
          quiz_score: number | null
          simulation_completed: boolean | null
          updated_at: string
          user_id: string
          video_completed: boolean | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id: string
          quiz_passed?: boolean | null
          quiz_score?: number | null
          simulation_completed?: boolean | null
          updated_at?: string
          user_id: string
          video_completed?: boolean | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id?: string
          quiz_passed?: boolean | null
          quiz_score?: number | null
          simulation_completed?: boolean | null
          updated_at?: string
          user_id?: string
          video_completed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"] | null
          avatar_url: string | null
          cash_balance: number | null
          full_name: string | null
          holdings_value: number | null
          total_value: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      owns_portfolio: { Args: { _portfolio_id: string }; Returns: boolean }
    }
    Enums: {
      account_type: "kid" | "high_schooler" | "adult"
      certificate_level: "green" | "white" | "gold" | "blue"
      subscription_status: "active" | "cancelled" | "expired" | "pending"
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
      account_type: ["kid", "high_schooler", "adult"],
      certificate_level: ["green", "white", "gold", "blue"],
      subscription_status: ["active", "cancelled", "expired", "pending"],
    },
  },
} as const
