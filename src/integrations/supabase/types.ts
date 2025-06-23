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
      automation_settings: {
        Row: {
          config_data: Json
          created_at: string
          id: string
          is_active: boolean
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config_data?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config_data?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      delivery_models: {
        Row: {
          created_at: string | null
          exact_delivery_days: number
          id: string
          is_system_default: boolean | null
          name: string
          niveis_utilizados: string[]
          qtde_eventos: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          exact_delivery_days: number
          id?: string
          is_system_default?: boolean | null
          name: string
          niveis_utilizados: string[]
          qtde_eventos: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          exact_delivery_days?: number
          id?: string
          is_system_default?: boolean | null
          name?: string
          niveis_utilizados?: string[]
          qtde_eventos?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          config_data: Json
          created_at: string
          id: string
          is_active: boolean
          platform_name: string
          platform_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config_data?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          platform_name: string
          platform_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config_data?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          platform_name?: string
          platform_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mensagens_eventos: {
        Row: {
          codigo_evento: string | null
          etapa: string | null
          nivel_mensagem: string | null
          ponto_logistico_sugerido: string | null
          texto_evento: string | null
          tom: string | null
        }
        Insert: {
          codigo_evento?: string | null
          etapa?: string | null
          nivel_mensagem?: string | null
          ponto_logistico_sugerido?: string | null
          texto_evento?: string | null
          tom?: string | null
        }
        Update: {
          codigo_evento?: string | null
          etapa?: string | null
          nivel_mensagem?: string | null
          ponto_logistico_sugerido?: string | null
          texto_evento?: string | null
          tom?: string | null
        }
        Relationships: []
      }
      modelos_de_entrega: {
        Row: {
          num_eventos: number | null
          prazo_max_dias_uteis: number | null
          prazo_min_dias_uteis: number | null
        }
        Insert: {
          num_eventos?: number | null
          prazo_max_dias_uteis?: number | null
          prazo_min_dias_uteis?: number | null
        }
        Update: {
          num_eventos?: number | null
          prazo_max_dias_uteis?: number | null
          prazo_min_dias_uteis?: number | null
        }
        Relationships: []
      }
      order_bumps: {
        Row: {
          created_at: string | null
          id: string
          original_price_1: number | null
          original_price_2: number | null
          original_price_3: number | null
          product_image_url_1: string | null
          product_image_url_2: string | null
          product_image_url_3: string | null
          product_link_1: string | null
          product_link_2: string | null
          product_link_3: string | null
          product_name_1: string | null
          product_name_2: string | null
          product_name_3: string | null
          promotional_price_1: number | null
          promotional_price_2: number | null
          promotional_price_3: number | null
          section_subtitle: string | null
          section_title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          original_price_1?: number | null
          original_price_2?: number | null
          original_price_3?: number | null
          product_image_url_1?: string | null
          product_image_url_2?: string | null
          product_image_url_3?: string | null
          product_link_1?: string | null
          product_link_2?: string | null
          product_link_3?: string | null
          product_name_1?: string | null
          product_name_2?: string | null
          product_name_3?: string | null
          promotional_price_1?: number | null
          promotional_price_2?: number | null
          promotional_price_3?: number | null
          section_subtitle?: string | null
          section_title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          original_price_1?: number | null
          original_price_2?: number | null
          original_price_3?: number | null
          product_image_url_1?: string | null
          product_image_url_2?: string | null
          product_image_url_3?: string | null
          product_link_1?: string | null
          product_link_2?: string | null
          product_link_3?: string | null
          product_name_1?: string | null
          product_name_2?: string | null
          product_name_3?: string | null
          promotional_price_1?: number | null
          promotional_price_2?: number | null
          promotional_price_3?: number | null
          section_subtitle?: string | null
          section_title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_bumps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          can_customize_color: boolean | null
          can_customize_logo: boolean | null
          can_customize_tone: boolean | null
          can_edit_messages: boolean | null
          can_send_email_automation: boolean | null
          can_send_whatsapp_automation: boolean | null
          can_use_custom_domain: boolean | null
          can_use_order_bump: boolean | null
          can_use_subdomain: boolean | null
          created_at: string | null
          id: string
          monthly_price: number
          name: string
          tracking_limit: number | null
          updated_at: string | null
        }
        Insert: {
          can_customize_color?: boolean | null
          can_customize_logo?: boolean | null
          can_customize_tone?: boolean | null
          can_edit_messages?: boolean | null
          can_send_email_automation?: boolean | null
          can_send_whatsapp_automation?: boolean | null
          can_use_custom_domain?: boolean | null
          can_use_order_bump?: boolean | null
          can_use_subdomain?: boolean | null
          created_at?: string | null
          id?: string
          monthly_price: number
          name: string
          tracking_limit?: number | null
          updated_at?: string | null
        }
        Update: {
          can_customize_color?: boolean | null
          can_customize_logo?: boolean | null
          can_customize_tone?: boolean | null
          can_edit_messages?: boolean | null
          can_send_email_automation?: boolean | null
          can_send_whatsapp_automation?: boolean | null
          can_use_custom_domain?: boolean | null
          can_use_order_bump?: boolean | null
          can_use_subdomain?: boolean | null
          created_at?: string | null
          id?: string
          monthly_price?: number
          name?: string
          tracking_limit?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rotas_por_estado: {
        Row: {
          cidade: string | null
          estado: string | null
          ordem: number | null
          tipo_local: string | null
          uf_rota: string | null
        }
        Insert: {
          cidade?: string | null
          estado?: string | null
          ordem?: number | null
          tipo_local?: string | null
          uf_rota?: string | null
        }
        Update: {
          cidade?: string | null
          estado?: string | null
          ordem?: number | null
          tipo_local?: string | null
          uf_rota?: string | null
        }
        Relationships: []
      }
      tracking_events: {
        Row: {
          created_at: string | null
          event_level: number
          event_text: string
          id: string
          location: string
          order_in_timeline: number
          simulated_datetime: string
          tone_of_voice: string
          tracking_id: string
        }
        Insert: {
          created_at?: string | null
          event_level: number
          event_text: string
          id?: string
          location: string
          order_in_timeline: number
          simulated_datetime: string
          tone_of_voice: string
          tracking_id: string
        }
        Update: {
          created_at?: string | null
          event_level?: number
          event_text?: string
          id?: string
          location?: string
          order_in_timeline?: number
          simulated_datetime?: string
          tone_of_voice?: string
          tracking_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_tracking_id_fkey"
            columns: ["tracking_id"]
            isOneToOne: false
            referencedRelation: "trackings"
            referencedColumns: ["id"]
          },
        ]
      }
      trackings: {
        Row: {
          clicks: number | null
          created_at: string | null
          current_event_index: number | null
          current_status: string | null
          customer_name: string
          delivery_model_id: string
          destination_city: string
          destination_state: string
          id: string
          is_completed: boolean | null
          last_updated_at: string | null
          public_link: string | null
          total_events_generated: number | null
          tracking_code: string
          user_id: string
        }
        Insert: {
          clicks?: number | null
          created_at?: string | null
          current_event_index?: number | null
          current_status?: string | null
          customer_name: string
          delivery_model_id: string
          destination_city: string
          destination_state: string
          id?: string
          is_completed?: boolean | null
          last_updated_at?: string | null
          public_link?: string | null
          total_events_generated?: number | null
          tracking_code: string
          user_id: string
        }
        Update: {
          clicks?: number | null
          created_at?: string | null
          current_event_index?: number | null
          current_status?: string | null
          customer_name?: string
          delivery_model_id?: string
          destination_city?: string
          destination_state?: string
          id?: string
          is_completed?: boolean | null
          last_updated_at?: string | null
          public_link?: string | null
          total_events_generated?: number | null
          tracking_code?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trackings_delivery_model_id_fkey"
            columns: ["delivery_model_id"]
            isOneToOne: false
            referencedRelation: "delivery_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          current_plan_id: string | null
          custom_domain: string | null
          custom_highlight_color: string | null
          custom_logo_url: string | null
          custom_subdomain: string | null
          default_tone_of_voice: string | null
          domain_request_status: string | null
          email: string
          id: string
          referral_code: string | null
          referral_credits: number | null
          store_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_plan_id?: string | null
          custom_domain?: string | null
          custom_highlight_color?: string | null
          custom_logo_url?: string | null
          custom_subdomain?: string | null
          default_tone_of_voice?: string | null
          domain_request_status?: string | null
          email: string
          id: string
          referral_code?: string | null
          referral_credits?: number | null
          store_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_plan_id?: string | null
          custom_domain?: string | null
          custom_highlight_color?: string | null
          custom_logo_url?: string | null
          custom_subdomain?: string | null
          default_tone_of_voice?: string | null
          domain_request_status?: string | null
          email?: string
          id?: string
          referral_code?: string | null
          referral_credits?: number | null
          store_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_current_plan_id_fkey"
            columns: ["current_plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
