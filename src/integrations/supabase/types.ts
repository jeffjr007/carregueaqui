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
      charging_history: {
        Row: {
          cost: number
          created_at: string
          date: string
          duration: string
          energy: number
          id: string
          station_id: string
          user_id: string
        }
        Insert: {
          cost: number
          created_at?: string
          date?: string
          duration: string
          energy: number
          id?: string
          station_id: string
          user_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          date?: string
          duration?: string
          energy?: number
          id?: string
          station_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "charging_history_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "charging_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      charging_sessions: {
        Row: {
          cost_per_kwh: number
          created_at: string
          end_time: string | null
          energy_consumed: number | null
          id: string
          start_time: string
          station_id: string
          status: Database["public"]["Enums"]["charging_status"]
          total_cost: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cost_per_kwh?: number
          created_at?: string
          end_time?: string | null
          energy_consumed?: number | null
          id?: string
          start_time?: string
          station_id: string
          status?: Database["public"]["Enums"]["charging_status"]
          total_cost?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cost_per_kwh?: number
          created_at?: string
          end_time?: string | null
          energy_consumed?: number | null
          id?: string
          start_time?: string
          station_id?: string
          status?: Database["public"]["Enums"]["charging_status"]
          total_cost?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "charging_sessions_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "charging_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      charging_stations: {
        Row: {
          address: string
          amenities: Json
          brand: string
          connector_types: string[]
          connectors: number
          created_at: string
          hours: string
          id: string
          lat: number
          lng: number
          name: string
          power: string
          rating: number | null
          reviews: number | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          address: string
          amenities?: Json
          brand: string
          connector_types: string[]
          connectors: number
          created_at?: string
          hours: string
          id?: string
          lat: number
          lng: number
          name: string
          power: string
          rating?: number | null
          reviews?: number | null
          status: string
          type: string
          updated_at?: string
        }
        Update: {
          address?: string
          amenities?: Json
          brand?: string
          connector_types?: string[]
          connectors?: number
          created_at?: string
          hours?: string
          id?: string
          lat?: number
          lng?: number
          name?: string
          power?: string
          rating?: number | null
          reviews?: number | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorite_stations: {
        Row: {
          created_at: string
          id: string
          station_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          station_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          station_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_stations_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "charging_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      station_ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          station_id: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          station_id: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          station_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "station_ratings_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "charging_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { user_id: string; role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      charging_status: "in_progress" | "completed" | "cancelled" | "error"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      charging_status: ["in_progress", "completed", "cancelled", "error"],
    },
  },
} as const
