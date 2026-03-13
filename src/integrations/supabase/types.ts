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
      bands: {
        Row: {
          created_at: string | null
          id: number
          label: string
          module_end: number
          module_start: number
          name: string
          sort_order: number
          stage_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          label: string
          module_end: number
          module_start: number
          name: string
          sort_order: number
          stage_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          label?: string
          module_end?: number
          module_start?: number
          name?: string
          sort_order?: number
          stage_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bands_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
        ]
      }
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
      certification_requirements: {
        Row: {
          created_at: string | null
          id: number
          requirement_text: string
          requirement_type: string
          sort_order: number
          stage_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          requirement_text: string
          requirement_type: string
          sort_order: number
          stage_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          requirement_text?: string
          requirement_type?: string
          sort_order?: number
          stage_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "certification_requirements_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
        ]
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
          assessment_check: string | null
          band_id: number | null
          certificate_level: Database["public"]["Enums"]["certificate_level"]
          created_at: string
          description: string | null
          duration_minutes: number | null
          has_simulation: boolean | null
          id: string
          is_active: boolean | null
          is_compulsory: boolean | null
          key_ideas: string | null
          learning_objective: string | null
          module_number: number
          practical_activity: string | null
          progression_link: string | null
          sort_order: number | null
          stage_id: number | null
          teaching_guide: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assessment_check?: string | null
          band_id?: number | null
          certificate_level: Database["public"]["Enums"]["certificate_level"]
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          has_simulation?: boolean | null
          id?: string
          is_active?: boolean | null
          is_compulsory?: boolean | null
          key_ideas?: string | null
          learning_objective?: string | null
          module_number: number
          practical_activity?: string | null
          progression_link?: string | null
          sort_order?: number | null
          stage_id?: number | null
          teaching_guide?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assessment_check?: string | null
          band_id?: number | null
          certificate_level?: Database["public"]["Enums"]["certificate_level"]
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          has_simulation?: boolean | null
          id?: string
          is_active?: boolean | null
          is_compulsory?: boolean | null
          key_ideas?: string | null
          learning_objective?: string | null
          module_number?: number
          practical_activity?: string | null
          progression_link?: string | null
          sort_order?: number | null
          stage_id?: number | null
          teaching_guide?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modules_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_wallet: {
        Row: {
          cash_balance: number
          created_at: string
          id: string
          initial_balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cash_balance?: number
          created_at?: string
          id?: string
          initial_balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cash_balance?: number
          created_at?: string
          id?: string
          initial_balance?: number
          updated_at?: string
          user_id?: string
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
      positions: {
        Row: {
          asset_name: string
          asset_symbol: string
          category: string
          created_at: string
          entry_price: number
          id: string
          interest_rate: number | null
          is_matured: boolean | null
          maturity_date: string | null
          position_type: string
          quantity: number
          simulator_type: string
          term_days: number | null
          total_invested: number
          updated_at: string
          user_id: string
        }
        Insert: {
          asset_name: string
          asset_symbol: string
          category: string
          created_at?: string
          entry_price?: number
          id?: string
          interest_rate?: number | null
          is_matured?: boolean | null
          maturity_date?: string | null
          position_type: string
          quantity?: number
          simulator_type: string
          term_days?: number | null
          total_invested?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          asset_name?: string
          asset_symbol?: string
          category?: string
          created_at?: string
          entry_price?: number
          id?: string
          interest_rate?: number | null
          is_matured?: boolean | null
          maturity_date?: string | null
          position_type?: string
          quantity?: number
          simulator_type?: string
          term_days?: number | null
          total_invested?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          age: number | null
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string
          id: string
          mothers_first_name: string | null
          phone: string | null
          primary_stage_id: number | null
          subscription_expires_at: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name: string
          id?: string
          mothers_first_name?: string | null
          phone?: string | null
          primary_stage_id?: number | null
          subscription_expires_at?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string
          id?: string
          mothers_first_name?: string | null
          phone?: string | null
          primary_stage_id?: number | null
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
      stages: {
        Row: {
          age_range_max: number | null
          age_range_min: number | null
          audience_coverage: Json | null
          certificate_name: string
          color_primary: string | null
          color_secondary: string | null
          core_goals: Json | null
          created_at: string | null
          id: number
          learning_outcomes: Json | null
          pedagogical_principle: string | null
          stage_number: number
          target_group: string | null
          title: string
          total_modules: number
        }
        Insert: {
          age_range_max?: number | null
          age_range_min?: number | null
          audience_coverage?: Json | null
          certificate_name: string
          color_primary?: string | null
          color_secondary?: string | null
          core_goals?: Json | null
          created_at?: string | null
          id?: number
          learning_outcomes?: Json | null
          pedagogical_principle?: string | null
          stage_number: number
          target_group?: string | null
          title: string
          total_modules: number
        }
        Update: {
          age_range_max?: number | null
          age_range_min?: number | null
          audience_coverage?: Json | null
          certificate_name?: string
          color_primary?: string | null
          color_secondary?: string | null
          core_goals?: Json | null
          created_at?: string | null
          id?: number
          learning_outcomes?: Json | null
          pedagogical_principle?: string | null
          stage_number?: number
          target_group?: string | null
          title?: string
          total_modules?: number
        }
        Relationships: []
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
      trades: {
        Row: {
          asset_name: string
          asset_symbol: string
          category: string
          created_at: string
          id: string
          price_at_execution: number
          quantity: number
          simulator_type: string
          total_value: number
          trade_type: string
          user_id: string
        }
        Insert: {
          asset_name: string
          asset_symbol: string
          category: string
          created_at?: string
          id?: string
          price_at_execution?: number
          quantity?: number
          simulator_type: string
          total_value?: number
          trade_type: string
          user_id: string
        }
        Update: {
          asset_name?: string
          asset_symbol?: string
          category?: string
          created_at?: string
          id?: string
          price_at_execution?: number
          quantity?: number
          simulator_type?: string
          total_value?: number
          trade_type?: string
          user_id?: string
        }
        Relationships: []
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
      execute_simulator_trade: {
        Args: {
          p_asset_name: string
          p_asset_symbol: string
          p_category: string
          p_interest_rate?: number
          p_position_type: string
          p_price: number
          p_quantity: number
          p_simulator_type: string
          p_term_days?: number
          p_trade_type: string
        }
        Returns: Json
      }
      execute_trade: {
        Args: {
          p_quantity: number
          p_stock_id: string
          p_transaction_type: string
        }
        Returns: Json
      }
      get_leaderboard: {
        Args: { limit_count?: number }
        Returns: {
          account_type: Database["public"]["Enums"]["account_type"]
          avatar_url: string
          cash_balance: number
          full_name: string
          holdings_value: number
          total_value: number
          user_id: string
        }[]
      }
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
