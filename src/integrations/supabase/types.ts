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
      analytics_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          properties: Json | null
          session_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          properties?: Json | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          properties?: Json | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          resource_id: string
          resource_type: string
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id: string
          resource_type: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string
          resource_type?: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      data_retention_policies: {
        Row: {
          created_at: string | null
          data_type: string
          id: string
          retention_period: unknown
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_type: string
          id?: string
          retention_period: unknown
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_type?: string
          id?: string
          retention_period?: unknown
          updated_at?: string | null
        }
        Relationships: []
      }
      location_history: {
        Row: {
          context_tags: string[] | null
          created_at: string | null
          id: string
          in_safe_location: boolean | null
          latitude: number
          longitude: number
          stress_level: number | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          context_tags?: string[] | null
          created_at?: string | null
          id?: string
          in_safe_location?: boolean | null
          latitude: number
          longitude: number
          stress_level?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          context_tags?: string[] | null
          created_at?: string | null
          id?: string
          in_safe_location?: boolean | null
          latitude?: number
          longitude?: number
          stress_level?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ml_features: {
        Row: {
          actual_stress_level: number | null
          confidence: number | null
          created_at: string | null
          feature_vector: Json
          id: string
          predicted_stress_level: number | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          actual_stress_level?: number | null
          confidence?: number | null
          created_at?: string | null
          feature_vector: Json
          id?: string
          predicted_stress_level?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          actual_stress_level?: number | null
          confidence?: number | null
          created_at?: string | null
          feature_vector?: Json
          id?: string
          predicted_stress_level?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      privacy_settings: {
        Row: {
          created_at: string | null
          data_collection: Json
          data_sharing: Json
          id: string
          retention_period: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data_collection?: Json
          data_sharing?: Json
          id?: string
          retention_period?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data_collection?: Json
          data_sharing?: Json
          id?: string
          retention_period?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      safe_locations: {
        Row: {
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          notes: string | null
          radius: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          notes?: string | null
          radius: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          notes?: string | null
          radius?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_incidents: {
        Row: {
          affected_users: string[] | null
          description: string
          id: string
          incident_type: string
          reported_at: string | null
          resolution_notes: string | null
          resolution_status: string
          resolved_at: string | null
          severity: string
        }
        Insert: {
          affected_users?: string[] | null
          description: string
          id?: string
          incident_type: string
          reported_at?: string | null
          resolution_notes?: string | null
          resolution_status?: string
          resolved_at?: string | null
          severity: string
        }
        Update: {
          affected_users?: string[] | null
          description?: string
          id?: string
          incident_type?: string
          reported_at?: string | null
          resolution_notes?: string | null
          resolution_status?: string
          resolved_at?: string | null
          severity?: string
        }
        Relationships: []
      }
      stress_scores: {
        Row: {
          confidence: number | null
          created_at: string | null
          factors: Json | null
          id: string
          score: number
          timestamp: string
          user_id: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          factors?: Json | null
          id?: string
          score: number
          timestamp: string
          user_id?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          factors?: Json | null
          id?: string
          score?: number
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      stress_thresholds: {
        Row: {
          baseline_stress_score: number | null
          created_at: string | null
          eda_threshold: number | null
          heart_rate_threshold: number | null
          hrv_threshold: number | null
          id: string
          movement_threshold: number | null
          respiratory_threshold: number | null
          sensitivity_factor: number | null
          temperature_threshold: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          baseline_stress_score?: number | null
          created_at?: string | null
          eda_threshold?: number | null
          heart_rate_threshold?: number | null
          hrv_threshold?: number | null
          id?: string
          movement_threshold?: number | null
          respiratory_threshold?: number | null
          sensitivity_factor?: number | null
          temperature_threshold?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          baseline_stress_score?: number | null
          created_at?: string | null
          eda_threshold?: number | null
          heart_rate_threshold?: number | null
          hrv_threshold?: number | null
          id?: string
          movement_threshold?: number | null
          respiratory_threshold?: number | null
          sensitivity_factor?: number | null
          temperature_threshold?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"]
          spiciness: number | null
          status: Database["public"]["Enums"]["task_status"]
          subtasks: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          spiciness?: number | null
          status?: Database["public"]["Enums"]["task_status"]
          subtasks?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          spiciness?: number | null
          status?: Database["public"]["Enums"]["task_status"]
          subtasks?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_insights: {
        Row: {
          action_taken: boolean | null
          actionable: boolean | null
          confidence: number
          created_at: string | null
          description: string
          expires_at: string | null
          id: string
          insight_type: string
          title: string
          user_id: string | null
        }
        Insert: {
          action_taken?: boolean | null
          actionable?: boolean | null
          confidence: number
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          insight_type: string
          title: string
          user_id?: string | null
        }
        Update: {
          action_taken?: boolean | null
          actionable?: boolean | null
          confidence?: number
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          insight_type?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      wearable_devices: {
        Row: {
          battery_level: number | null
          created_at: string | null
          device_id: string
          device_name: string | null
          device_type: string
          id: string
          last_sync: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          battery_level?: number | null
          created_at?: string | null
          device_id: string
          device_name?: string | null
          device_type: string
          id?: string
          last_sync?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          battery_level?: number | null
          created_at?: string | null
          device_id?: string
          device_name?: string | null
          device_type?: string
          id?: string
          last_sync?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      wearable_readings: {
        Row: {
          context_tags: string[] | null
          created_at: string | null
          device_id: string | null
          eda: number | null
          heart_rate: number | null
          hrv: number | null
          id: string
          location: unknown | null
          movement: number | null
          temperature: number | null
          timestamp: string
        }
        Insert: {
          context_tags?: string[] | null
          created_at?: string | null
          device_id?: string | null
          eda?: number | null
          heart_rate?: number | null
          hrv?: number | null
          id?: string
          location?: unknown | null
          movement?: number | null
          temperature?: number | null
          timestamp: string
        }
        Update: {
          context_tags?: string[] | null
          created_at?: string | null
          device_id?: string | null
          eda?: number | null
          heart_rate?: number | null
          hrv?: number | null
          id?: string
          location?: unknown | null
          movement?: number | null
          temperature?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "wearable_readings_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "wearable_devices"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_stress_score: {
        Args: {
          p_heart_rate: number
          p_hrv: number
          p_eda: number
          p_temperature: number
          p_movement: number
          p_respiratory_rate: number
          p_user_id: string
        }
        Returns: number
      }
      cleanup_expired_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_location_history: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      predict_stress_level: {
        Args: {
          feature_vector: Json
        }
        Returns: number
      }
    }
    Enums: {
      app_role: "autistic" | "caregiver" | "clinician"
      task_priority: "low" | "medium" | "high"
      task_status: "pending" | "in-progress" | "done"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
