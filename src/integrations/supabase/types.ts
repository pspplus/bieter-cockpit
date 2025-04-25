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
      dtad_records: {
        Row: {
          angebotsfrist: string | null
          auftraggeber: string | null
          auftraggeber_kontakt_und_anschrift: string | null
          ausfuehrungsfrist_ende: string | null
          ausfuehrungsfrist_start: string | null
          beschreibung: string | null
          bindefrist: string | null
          cpv_codes: string | null
          created_at: string
          dokumententyp: string | null
          entfernung_zu_80637: number | null
          eu_ted_nr: string | null
          id: number
          kategorie: string | null
          kurzbeschreibung: string | null
          link_dokumentendownload: string | null
          lose: string | null
          nuts_code: string | null
          org_dok_nr: string | null
          plz: number | null
          region: string | null
          sprache: string | null
          verfahrensart: string | null
          vergabenummer: string | null
          zuschlagskriterien: string | null
        }
        Insert: {
          angebotsfrist?: string | null
          auftraggeber?: string | null
          auftraggeber_kontakt_und_anschrift?: string | null
          ausfuehrungsfrist_ende?: string | null
          ausfuehrungsfrist_start?: string | null
          beschreibung?: string | null
          bindefrist?: string | null
          cpv_codes?: string | null
          created_at?: string
          dokumententyp?: string | null
          entfernung_zu_80637?: number | null
          eu_ted_nr?: string | null
          id?: number
          kategorie?: string | null
          kurzbeschreibung?: string | null
          link_dokumentendownload?: string | null
          lose?: string | null
          nuts_code?: string | null
          org_dok_nr?: string | null
          plz?: number | null
          region?: string | null
          sprache?: string | null
          verfahrensart?: string | null
          vergabenummer?: string | null
          zuschlagskriterien?: string | null
        }
        Update: {
          angebotsfrist?: string | null
          auftraggeber?: string | null
          auftraggeber_kontakt_und_anschrift?: string | null
          ausfuehrungsfrist_ende?: string | null
          ausfuehrungsfrist_start?: string | null
          beschreibung?: string | null
          bindefrist?: string | null
          cpv_codes?: string | null
          created_at?: string
          dokumententyp?: string | null
          entfernung_zu_80637?: number | null
          eu_ted_nr?: string | null
          id?: number
          kategorie?: string | null
          kurzbeschreibung?: string | null
          link_dokumentendownload?: string | null
          lose?: string | null
          nuts_code?: string | null
          org_dok_nr?: string | null
          plz?: number | null
          region?: string | null
          sprache?: string | null
          verfahrensart?: string | null
          vergabenummer?: string | null
          zuschlagskriterien?: string | null
        }
        Relationships: []
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
          assignees: string[] | null
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
          assignees?: string[] | null
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
          assignees?: string[] | null
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
      objektart_enum:
        | "Grundschule"
        | "Kindergarten"
        | "Buero"
        | "Berufsschule"
        | "Feuerwache"
        | "Sportplatz"
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
      approval_status: ["pending", "approved", "rejected"],
      objektart_enum: [
        "Grundschule",
        "Kindergarten",
        "Buero",
        "Berufsschule",
        "Feuerwache",
        "Sportplatz",
      ],
      vertragsart_enum: [
        "werkvertrag",
        "dienstleistungsvertrag",
        "mischvertrag",
      ],
      zertifikat_enum: ["din_iso_9001", "din_iso_14001", "din_iso_45001"],
    },
  },
} as const
