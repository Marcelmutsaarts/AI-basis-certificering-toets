/**
 * Handgeschreven Database type voor de AVD Toets-app.
 * Format compatibel met `supabase gen types typescript --project-id ...`
 * zodat we later kunnen overstappen zonder breaking change.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          role: Database['public']['Enums']['user_role'];
          school: string;
          niveau: Database['public']['Enums']['onderwijsniveau'];
          vakgebied: string | null;
          created_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          role?: Database['public']['Enums']['user_role'];
          school: string;
          niveau: Database['public']['Enums']['onderwijsniveau'];
          vakgebied?: string | null;
          created_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          role?: Database['public']['Enums']['user_role'];
          school?: string;
          niveau?: Database['public']['Enums']['onderwijsniveau'];
          vakgebied?: string | null;
          created_at?: string;
          last_login_at?: string | null;
        };
        Relationships: [];
      };
      exam_sessions: {
        Row: {
          id: string;
          user_id: string;
          started_at: string;
          ended_at: string | null;
          status: Database['public']['Enums']['exam_status'];
          live_session_id: string | null;
          casus_ids: string[] | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          started_at?: string;
          ended_at?: string | null;
          status?: Database['public']['Enums']['exam_status'];
          live_session_id?: string | null;
          casus_ids?: string[] | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          started_at?: string;
          ended_at?: string | null;
          status?: Database['public']['Enums']['exam_status'];
          live_session_id?: string | null;
          casus_ids?: string[] | null;
        };
        Relationships: [];
      };
      transcripts: {
        Row: {
          id: string;
          exam_session_id: string;
          speaker: Database['public']['Enums']['speaker_type'];
          text: string;
          started_at: string;
          ended_at: string | null;
          sequence: number;
        };
        Insert: {
          id?: string;
          exam_session_id: string;
          speaker: Database['public']['Enums']['speaker_type'];
          text: string;
          started_at: string;
          ended_at?: string | null;
          sequence: number;
        };
        Update: {
          id?: string;
          exam_session_id?: string;
          speaker?: Database['public']['Enums']['speaker_type'];
          text?: string;
          started_at?: string;
          ended_at?: string | null;
          sequence?: number;
        };
        Relationships: [];
      };
      evaluations: {
        Row: {
          id: string;
          exam_session_id: string;
          model_used: string;
          raw_output: Json;
          mindset_score: Database['public']['Enums']['score_type'];
          ethiek_score: Database['public']['Enums']['score_type'];
          kennis_score: Database['public']['Enums']['score_type'];
          pedagogiek_score: Database['public']['Enums']['score_type'];
          agency_score: Database['public']['Enums']['score_type'];
          passed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          exam_session_id: string;
          model_used: string;
          raw_output: Json;
          mindset_score: Database['public']['Enums']['score_type'];
          ethiek_score: Database['public']['Enums']['score_type'];
          kennis_score: Database['public']['Enums']['score_type'];
          pedagogiek_score: Database['public']['Enums']['score_type'];
          agency_score: Database['public']['Enums']['score_type'];
          passed: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          exam_session_id?: string;
          model_used?: string;
          raw_output?: Json;
          mindset_score?: Database['public']['Enums']['score_type'];
          ethiek_score?: Database['public']['Enums']['score_type'];
          kennis_score?: Database['public']['Enums']['score_type'];
          pedagogiek_score?: Database['public']['Enums']['score_type'];
          agency_score?: Database['public']['Enums']['score_type'];
          passed?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      casuses: {
        Row: {
          id: string;
          webinar: number;
          code: string;
          prompt: string;
          domains: string[];
          bloom_category: string;
          active: boolean;
        };
        Insert: {
          id?: string;
          webinar: number;
          code: string;
          prompt: string;
          domains: string[];
          bloom_category: string;
          active?: boolean;
        };
        Update: {
          id?: string;
          webinar?: number;
          code?: string;
          prompt?: string;
          domains?: string[];
          bloom_category?: string;
          active?: boolean;
        };
        Relationships: [];
      };
      webhook_deliveries: {
        Row: {
          id: string;
          exam_session_id: string;
          status: Database['public']['Enums']['delivery_status'];
          attempts: number;
          last_error: string | null;
          skipped_reason: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          exam_session_id: string;
          status?: Database['public']['Enums']['delivery_status'];
          attempts?: number;
          last_error?: string | null;
          skipped_reason?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          exam_session_id?: string;
          status?: Database['public']['Enums']['delivery_status'];
          attempts?: number;
          last_error?: string | null;
          skipped_reason?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: 'docent' | 'admin' | 'tester';
      onderwijsniveau: 'PO' | 'VO' | 'MBO' | 'HBO' | 'WO';
      exam_status: 'in_progress' | 'completed' | 'abandoned' | 'evaluated';
      speaker_type: 'bot' | 'docent';
      score_type: 'GROEN' | 'ORANJE' | 'ROOD';
      delivery_status: 'pending' | 'sent' | 'failed' | 'skipped';
    };
    CompositeTypes: Record<string, never>;
  };
};
