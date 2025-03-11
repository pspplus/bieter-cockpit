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
      clients: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard_settings: {
        Row: {
          created_at: string
          favorite_metrics: string[] | null
          id: string
          layout_config: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          favorite_metrics?: string[] | null
          id?: string
          layout_config?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          favorite_metrics?: string[] | null
          id?: string
          layout_config?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      document_approvals: {
        Row: {
          comment: string | null
          created_at: string
          document_id: string
          id: string
          status: Database["public"]["Enums"]["approval_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          document_id: string
          id?: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          document_id?: string
          id?: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_approvals_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_comments: {
        Row: {
          comment: string
          created_at: string
          document_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          document_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          document_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          changes_description: string | null
          document_id: string
          file_size: number | null
          file_type: string
          file_url: string | null
          id: string
          upload_date: string
          user_id: string
          version_number: number
        }
        Insert: {
          changes_description?: string | null
          document_id: string
          file_size?: number | null
          file_type: string
          file_url?: string | null
          id?: string
          upload_date?: string
          user_id: string
          version_number: number
        }
        Update: {
          changes_description?: string | null
          document_id?: string
          file_size?: number | null
          file_type?: string
          file_url?: string | null
          id?: string
          upload_date?: string
          user_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"] | null
          current_version: number | null
          description: string | null
          file_size: number | null
          file_type: string
          file_url: string | null
          folder_id: string | null
          folder_path: string | null
          id: string
          milestone_id: string | null
          name: string
          tender_id: string | null
          upload_date: string
          user_id: string
        }
        Insert: {
          approval_status?:
            | Database["public"]["Enums"]["approval_status"]
            | null
          current_version?: number | null
          description?: string | null
          file_size?: number | null
          file_type: string
          file_url?: string | null
          folder_id?: string | null
          folder_path?: string | null
          id?: string
          milestone_id?: string | null
          name: string
          tender_id?: string | null
          upload_date?: string
          user_id: string
        }
        Update: {
          approval_status?:
            | Database["public"]["Enums"]["approval_status"]
            | null
          current_version?: number | null
          description?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string | null
          folder_id?: string | null
          folder_path?: string | null
          id?: string
          milestone_id?: string | null
          name?: string
          tender_id?: string | null
          upload_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          created_at: string
          folder_order: number
          folder_path: string
          id: string
          is_default: boolean
          name: string
          parent_id: string | null
          tender_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          folder_order?: number
          folder_path: string
          id?: string
          is_default?: boolean
          name: string
          parent_id?: string | null
          tender_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          folder_order?: number
          folder_path?: string
          id?: string
          is_default?: boolean
          name?: string
          parent_id?: string | null
          tender_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          completion_date: string | null
          created_at: string
          description: string
          due_date: string | null
          id: string
          notes: string | null
          sequence_number: number
          status: string
          tender_id: string
          title: string
          updated_at: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          notes?: string | null
          sequence_number: number
          status: string
          tender_id: string
          title: string
          updated_at?: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          sequence_number?: number
          status?: string
          tender_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          berater_vergabestelle: string | null
          binding_period_date: string | null
          budget: number | null
          client: string | null
          concept_required: boolean | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          due_date: string
          erforderliche_zertifikate: string[] | null
          evaluation_scheme: string | null
          external_reference: string | null
          id: string
          internal_reference: string
          jahresreinigungsflaeche: number | null
          leistungswertvorgaben: boolean | null
          location: string | null
          mindestanforderungen: string | null
          notes: string | null
          objektart: string[] | null
          objektbesichtigung_erforderlich: boolean | null
          qualitaetskontrollen: boolean | null
          raumgruppentabelle: boolean | null
          status: string
          stundenvorgaben: string | null
          tariflohn: boolean | null
          title: string
          updated_at: string
          user_id: string
          vergabeplattform: string | null
          vertragsart: string | null
          waschmaschine: boolean | null
        }
        Insert: {
          berater_vergabestelle?: string | null
          binding_period_date?: string | null
          budget?: number | null
          client?: string | null
          concept_required?: boolean | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          erforderliche_zertifikate?: string[] | null
          evaluation_scheme?: string | null
          external_reference?: string | null
          id?: string
          internal_reference: string
          jahresreinigungsflaeche?: number | null
          leistungswertvorgaben?: boolean | null
          location?: string | null
          mindestanforderungen?: string | null
          notes?: string | null
          objektart?: string[] | null
          objektbesichtigung_erforderlich?: boolean | null
          qualitaetskontrollen?: boolean | null
          raumgruppentabelle?: boolean | null
          status: string
          stundenvorgaben?: string | null
          tariflohn?: boolean | null
          title: string
          updated_at?: string
          user_id: string
          vergabeplattform?: string | null
          vertragsart?: string | null
          waschmaschine?: boolean | null
        }
        Update: {
          berater_vergabestelle?: string | null
          binding_period_date?: string | null
          budget?: number | null
          client?: string | null
          concept_required?: boolean | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          erforderliche_zertifikate?: string[] | null
          evaluation_scheme?: string | null
          external_reference?: string | null
          id?: string
          internal_reference?: string
          jahresreinigungsflaeche?: number | null
          leistungswertvorgaben?: boolean | null
          location?: string | null
          mindestanforderungen?: string | null
          notes?: string | null
          objektart?: string[] | null
          objektbesichtigung_erforderlich?: boolean | null
          qualitaetskontrollen?: boolean | null
          raumgruppentabelle?: boolean | null
          status?: string
          stundenvorgaben?: string | null
          tariflohn?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
          vergabeplattform?: string | null
          vertragsart?: string | null
          waschmaschine?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_folders_for_existing_tenders: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected"
      objektart_enum: "grundschule" | "kindergarten" | "buero"
      vertragsart_enum:
        | "werkvertrag"
        | "dienstleistungsvertrag"
        | "mischvertrag"
      zertifikat_enum: "din_iso_9001" | "din_iso_14001" | "din_iso_45001"
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
