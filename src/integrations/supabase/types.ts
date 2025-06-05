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
      base_configs: {
        Row: {
          base_aerea: Database["public"]["Enums"]["base_aerea"]
          cep: string | null
          cidade: string | null
          comandante: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome_completo: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          base_aerea: Database["public"]["Enums"]["base_aerea"]
          cep?: string | null
          cidade?: string | null
          comandante?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome_completo: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          base_aerea?: Database["public"]["Enums"]["base_aerea"]
          cep?: string | null
          cidade?: string | null
          comandante?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome_completo?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      can_waitlist: {
        Row: {
          base_aerea: Database["public"]["Enums"]["base_aerea"]
          cpf: number | null
          created_at: string
          data_inscricao: string
          destino: string
          email: string | null
          id: string
          nome: string
          observacoes: string | null
          origem: string
          parentesco: string | null
          peso: number | null
          peso_bagagem: number | null
          peso_bagagem_mao: number | null
          posto: Database["public"]["Enums"]["posto_militar"]
          prioridade: Database["public"]["Enums"]["prioridade_can"]
          responsavel_inscricao: string | null
          telefone: string | null
        }
        Insert: {
          base_aerea: Database["public"]["Enums"]["base_aerea"]
          cpf?: number | null
          created_at?: string
          data_inscricao?: string
          destino: string
          email?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          origem: string
          parentesco?: string | null
          peso?: number | null
          peso_bagagem?: number | null
          peso_bagagem_mao?: number | null
          posto: Database["public"]["Enums"]["posto_militar"]
          prioridade?: Database["public"]["Enums"]["prioridade_can"]
          responsavel_inscricao?: string | null
          telefone?: string | null
        }
        Update: {
          base_aerea?: Database["public"]["Enums"]["base_aerea"]
          cpf?: number | null
          created_at?: string
          data_inscricao?: string
          destino?: string
          email?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          origem?: string
          parentesco?: string | null
          peso?: number | null
          peso_bagagem?: number | null
          peso_bagagem_mao?: number | null
          posto?: Database["public"]["Enums"]["posto_militar"]
          prioridade?: Database["public"]["Enums"]["prioridade_can"]
          responsavel_inscricao?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      missions: {
        Row: {
          aeronave: string
          base_aerea: Database["public"]["Enums"]["base_aerea"]
          comandante: string
          created_at: string
          created_by: string | null
          data_missao: string
          destino: string
          id: string
          observacoes: string | null
          ofrag: string
          origem: string
          status: Database["public"]["Enums"]["mission_status"]
          updated_at: string
        }
        Insert: {
          aeronave: string
          base_aerea: Database["public"]["Enums"]["base_aerea"]
          comandante: string
          created_at?: string
          created_by?: string | null
          data_missao: string
          destino: string
          id?: string
          observacoes?: string | null
          ofrag: string
          origem: string
          status?: Database["public"]["Enums"]["mission_status"]
          updated_at?: string
        }
        Update: {
          aeronave?: string
          base_aerea?: Database["public"]["Enums"]["base_aerea"]
          comandante?: string
          created_at?: string
          created_by?: string | null
          data_missao?: string
          destino?: string
          id?: string
          observacoes?: string | null
          ofrag?: string
          origem?: string
          status?: Database["public"]["Enums"]["mission_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "missions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      passenger_profiles: {
        Row: {
          cpf: number
          created_at: string
          email: string | null
          id: string
          nome: string
          parentesco: string | null
          peso: number | null
          peso_bagagem: number | null
          peso_bagagem_mao: number | null
          posto: Database["public"]["Enums"]["posto_militar"]
          responsavel_inscricao: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cpf: number
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          parentesco?: string | null
          peso?: number | null
          peso_bagagem?: number | null
          peso_bagagem_mao?: number | null
          posto: Database["public"]["Enums"]["posto_militar"]
          responsavel_inscricao?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cpf?: number
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          parentesco?: string | null
          peso?: number | null
          peso_bagagem?: number | null
          peso_bagagem_mao?: number | null
          posto?: Database["public"]["Enums"]["posto_militar"]
          responsavel_inscricao?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      passengers: {
        Row: {
          checked_in: boolean | null
          cpf: number | null
          created_at: string
          destino: string
          from_waitlist: boolean | null
          id: string
          mission_id: string | null
          nome: string
          observacoes: string | null
          parentesco: string | null
          peso: number | null
          peso_bagagem: number | null
          peso_bagagem_mao: number | null
          posto: Database["public"]["Enums"]["posto_militar"]
          prioridade: number | null
          responsavel_inscricao: string | null
          waitlist_id: string | null
        }
        Insert: {
          checked_in?: boolean | null
          cpf?: number | null
          created_at?: string
          destino: string
          from_waitlist?: boolean | null
          id?: string
          mission_id?: string | null
          nome: string
          observacoes?: string | null
          parentesco?: string | null
          peso?: number | null
          peso_bagagem?: number | null
          peso_bagagem_mao?: number | null
          posto: Database["public"]["Enums"]["posto_militar"]
          prioridade?: number | null
          responsavel_inscricao?: string | null
          waitlist_id?: string | null
        }
        Update: {
          checked_in?: boolean | null
          cpf?: number | null
          created_at?: string
          destino?: string
          from_waitlist?: boolean | null
          id?: string
          mission_id?: string | null
          nome?: string
          observacoes?: string | null
          parentesco?: string | null
          peso?: number | null
          peso_bagagem?: number | null
          peso_bagagem_mao?: number | null
          posto?: Database["public"]["Enums"]["posto_militar"]
          prioridade?: number | null
          responsavel_inscricao?: string | null
          waitlist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "passengers_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          base_aerea: Database["public"]["Enums"]["base_aerea"]
          created_at: string
          id: string
          nome_guerra: string
          perfil: Database["public"]["Enums"]["user_profile"]
          posto: Database["public"]["Enums"]["posto_militar"]
          senha: string
          updated_at: string
          username: string | null
        }
        Insert: {
          base_aerea: Database["public"]["Enums"]["base_aerea"]
          created_at?: string
          id?: string
          nome_guerra: string
          perfil: Database["public"]["Enums"]["user_profile"]
          posto: Database["public"]["Enums"]["posto_militar"]
          senha: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          base_aerea?: Database["public"]["Enums"]["base_aerea"]
          created_at?: string
          id?: string
          nome_guerra?: string
          perfil?: Database["public"]["Enums"]["user_profile"]
          posto?: Database["public"]["Enums"]["posto_militar"]
          senha?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_passenger_by_cpf: {
        Args: { cpf_input: number }
        Returns: {
          cpf: number
          posto: Database["public"]["Enums"]["posto_militar"]
          nome: string
          telefone: string
          email: string
          peso: number
          peso_bagagem: number
          peso_bagagem_mao: number
          responsavel_inscricao: string
          parentesco: string
        }[]
      }
      upsert_passenger_profile: {
        Args: {
          cpf_input: number
          posto_input: Database["public"]["Enums"]["posto_militar"]
          nome_input: string
          telefone_input?: string
          email_input?: string
          peso_input?: number
          peso_bagagem_input?: number
          peso_bagagem_mao_input?: number
          responsavel_input?: string
          parentesco_input?: string
        }
        Returns: string
      }
    }
    Enums: {
      base_aerea:
        | "BAAF"
        | "BAAN"
        | "BABE"
        | "BABR"
        | "BABV"
        | "BACG"
        | "BACO"
        | "BAFL"
        | "BAFZ"
        | "BAGL"
        | "BAMN"
        | "BANT"
        | "BAPV"
        | "BARF"
        | "BASC"
        | "BASM"
        | "BASP"
        | "BAST"
        | "BASV"
      mission_status: "Ativa" | "Concluida" | "Arquivada"
      posto_militar:
        | "CEL AV"
        | "TC AV"
        | "MAJ AV"
        | "CAP AV"
        | "TEN AV"
        | "ASP AV"
        | "SO AV"
        | "SGT AV"
        | "CB AV"
        | "SD AV"
      prioridade_can: "Alta" | "Normal" | "Baixa"
      user_profile: "Administrador" | "Operador" | "Secretario"
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
      base_aerea: [
        "BAAF",
        "BAAN",
        "BABE",
        "BABR",
        "BABV",
        "BACG",
        "BACO",
        "BAFL",
        "BAFZ",
        "BAGL",
        "BAMN",
        "BANT",
        "BAPV",
        "BARF",
        "BASC",
        "BASM",
        "BASP",
        "BAST",
        "BASV",
      ],
      mission_status: ["Ativa", "Concluida", "Arquivada"],
      posto_militar: [
        "CEL AV",
        "TC AV",
        "MAJ AV",
        "CAP AV",
        "TEN AV",
        "ASP AV",
        "SO AV",
        "SGT AV",
        "CB AV",
        "SD AV",
      ],
      prioridade_can: ["Alta", "Normal", "Baixa"],
      user_profile: ["Administrador", "Operador", "Secretario"],
    },
  },
} as const
