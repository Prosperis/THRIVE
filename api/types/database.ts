// Define Json type for Supabase
type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string;
          company_name: string;
          position: string;
          status: Database['public']['Enums']['application_status'];
          target_date: string | null;
          applied_date: string | null;
          first_interview_date: string | null;
          offer_date: string | null;
          response_deadline: string | null;
          created_at: string;
          updated_at: string;
          location: string | null;
          work_type: Database['public']['Enums']['work_type'] | null;
          employment_type: Database['public']['Enums']['employment_type'] | null;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string | null;
          salary_period: Database['public']['Enums']['salary_period'] | null;
          job_url: string | null;
          job_description: string | null;
          notes: string | null;
          tags: string[] | null;
          priority: Database['public']['Enums']['priority'] | null;
          source: string | null;
          referral_name: string | null;
          sort_order: number | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          position: string;
          status: Database['public']['Enums']['application_status'];
          target_date?: string | null;
          applied_date?: string | null;
          first_interview_date?: string | null;
          offer_date?: string | null;
          response_deadline?: string | null;
          created_at?: string;
          updated_at?: string;
          location?: string | null;
          work_type?: Database['public']['Enums']['work_type'] | null;
          employment_type?: Database['public']['Enums']['employment_type'] | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string | null;
          salary_period?: Database['public']['Enums']['salary_period'] | null;
          job_url?: string | null;
          job_description?: string | null;
          notes?: string | null;
          tags?: string[] | null;
          priority?: Database['public']['Enums']['priority'] | null;
          source?: string | null;
          referral_name?: string | null;
          sort_order?: number | null;
          user_id: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          position?: string;
          status?: Database['public']['Enums']['application_status'];
          target_date?: string | null;
          applied_date?: string | null;
          first_interview_date?: string | null;
          offer_date?: string | null;
          response_deadline?: string | null;
          created_at?: string;
          updated_at?: string;
          location?: string | null;
          work_type?: Database['public']['Enums']['work_type'] | null;
          employment_type?: Database['public']['Enums']['employment_type'] | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string | null;
          salary_period?: Database['public']['Enums']['salary_period'] | null;
          job_url?: string | null;
          job_description?: string | null;
          notes?: string | null;
          tags?: string[] | null;
          priority?: Database['public']['Enums']['priority'] | null;
          source?: string | null;
          referral_name?: string | null;
          sort_order?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'applications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      interviews: {
        Row: {
          id: string;
          application_id: string;
          round: number;
          type: Database['public']['Enums']['interview_type'];
          status: Database['public']['Enums']['interview_status'];
          scheduled_at: string | null;
          duration: number | null;
          location: string | null;
          meeting_url: string | null;
          preparation_notes: string | null;
          questions_asked: string[] | null;
          questions_to_ask: string[] | null;
          feedback: string | null;
          follow_up_sent: boolean | null;
          follow_up_date: string | null;
          result: Database['public']['Enums']['interview_result'] | null;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          round: number;
          type: Database['public']['Enums']['interview_type'];
          status: Database['public']['Enums']['interview_status'];
          scheduled_at?: string | null;
          duration?: number | null;
          location?: string | null;
          meeting_url?: string | null;
          preparation_notes?: string | null;
          questions_asked?: string[] | null;
          questions_to_ask?: string[] | null;
          feedback?: string | null;
          follow_up_sent?: boolean | null;
          follow_up_date?: string | null;
          result?: Database['public']['Enums']['interview_result'] | null;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          round?: number;
          type?: Database['public']['Enums']['interview_type'];
          status?: Database['public']['Enums']['interview_status'];
          scheduled_at?: string | null;
          duration?: number | null;
          location?: string | null;
          meeting_url?: string | null;
          preparation_notes?: string | null;
          questions_asked?: string[] | null;
          questions_to_ask?: string[] | null;
          feedback?: string | null;
          follow_up_sent?: boolean | null;
          follow_up_date?: string | null;
          result?: Database['public']['Enums']['interview_result'] | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'interviews_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: false;
            referencedRelation: 'applications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'interviews_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      companies: {
        Row: {
          id: string;
          name: string;
          website: string | null;
          industry: string[] | null;
          size: string | null;
          location: string | null;
          founded: string | null;
          remote_policy: Database['public']['Enums']['remote_policy'] | null;
          description: string | null;
          culture: string | null;
          culture_notes: string | null;
          tech_stack: string[] | null;
          benefits: string[] | null;
          pros: string[] | null;
          cons: string[] | null;
          notes: string | null;
          employee_reviews: string | null;
          news_and_updates: string | null;
          competitor_comparison: string | null;
          company_links: Json | null;
          ratings: Json | null;
          ats_params: Json | null;
          interview_process: string | null;
          interview_difficulty: Database['public']['Enums']['difficulty'] | null;
          interview_experience: Database['public']['Enums']['experience'] | null;
          salary_range: Json | null;
          status: Database['public']['Enums']['company_status'] | null;
          priority: Database['public']['Enums']['priority'] | null;
          researched: boolean;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          website?: string | null;
          industry?: string[] | null;
          size?: string | null;
          location?: string | null;
          founded?: string | null;
          remote_policy?: Database['public']['Enums']['remote_policy'] | null;
          description?: string | null;
          culture?: string | null;
          culture_notes?: string | null;
          tech_stack?: string[] | null;
          benefits?: string[] | null;
          pros?: string[] | null;
          cons?: string[] | null;
          notes?: string | null;
          employee_reviews?: string | null;
          news_and_updates?: string | null;
          competitor_comparison?: string | null;
          company_links?: Json | null;
          ratings?: Json | null;
          ats_params?: Json | null;
          interview_process?: string | null;
          interview_difficulty?: Database['public']['Enums']['difficulty'] | null;
          interview_experience?: Database['public']['Enums']['experience'] | null;
          salary_range?: Json | null;
          status?: Database['public']['Enums']['company_status'] | null;
          priority?: Database['public']['Enums']['priority'] | null;
          researched?: boolean;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          website?: string | null;
          industry?: string[] | null;
          size?: string | null;
          location?: string | null;
          founded?: string | null;
          remote_policy?: Database['public']['Enums']['remote_policy'] | null;
          description?: string | null;
          culture?: string | null;
          culture_notes?: string | null;
          tech_stack?: string[] | null;
          benefits?: string[] | null;
          pros?: string[] | null;
          cons?: string[] | null;
          notes?: string | null;
          employee_reviews?: string | null;
          news_and_updates?: string | null;
          competitor_comparison?: string | null;
          company_links?: Json | null;
          ratings?: Json | null;
          ats_params?: Json | null;
          interview_process?: string | null;
          interview_difficulty?: Database['public']['Enums']['difficulty'] | null;
          interview_experience?: Database['public']['Enums']['experience'] | null;
          salary_range?: Json | null;
          status?: Database['public']['Enums']['company_status'] | null;
          priority?: Database['public']['Enums']['priority'] | null;
          researched?: boolean;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'companies_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          company_id: string | null;
          company_name: string | null;
          title: string | null;
          email: string | null;
          phone: string | null;
          linkedin: string | null;
          notes: string | null;
          relationship: Database['public']['Enums']['contact_relationship'] | null;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          company_id?: string | null;
          company_name?: string | null;
          title?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin?: string | null;
          notes?: string | null;
          relationship?: Database['public']['Enums']['contact_relationship'] | null;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          company_id?: string | null;
          company_name?: string | null;
          title?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin?: string | null;
          notes?: string | null;
          relationship?: Database['public']['Enums']['contact_relationship'] | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'contacts_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contacts_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      documents: {
        Row: {
          id: string;
          name: string;
          type: Database['public']['Enums']['document_type'];
          file_name: string | null;
          file_url: string | null;
          url: string | null;
          file_size: number | null;
          mime_type: string | null;
          content: string | null;
          version: number;
          version_name: string | null;
          base_document_id: string | null;
          application_id: string | null;
          used_in_application_ids: string[] | null;
          last_used_date: string | null;
          tags: string[] | null;
          notes: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: Database['public']['Enums']['document_type'];
          file_name?: string | null;
          file_url?: string | null;
          url?: string | null;
          file_size?: number | null;
          mime_type?: string | null;
          content?: string | null;
          version?: number;
          version_name?: string | null;
          base_document_id?: string | null;
          application_id?: string | null;
          used_in_application_ids?: string[] | null;
          last_used_date?: string | null;
          tags?: string[] | null;
          notes?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: Database['public']['Enums']['document_type'];
          file_name?: string | null;
          file_url?: string | null;
          url?: string | null;
          file_size?: number | null;
          mime_type?: string | null;
          content?: string | null;
          version?: number;
          version_name?: string | null;
          base_document_id?: string | null;
          application_id?: string | null;
          used_in_application_ids?: string[] | null;
          last_used_date?: string | null;
          tags?: string[] | null;
          notes?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'documents_application_id_fkey';
            columns: ['application_id'];
            isOneToOne: false;
            referencedRelation: 'applications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_base_document_id_fkey';
            columns: ['base_document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
          preferences: Json | null;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
          preferences?: Json | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
          preferences?: Json | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      application_status:
        | 'target'
        | 'hunting'
        | 'applied'
        | 'interviewing'
        | 'offer'
        | 'accepted'
        | 'rejected'
        | 'withdrawn';
      company_status:
        | 'target'
        | 'researching'
        | 'applied'
        | 'interviewing'
        | 'rejected'
        | 'not-interested';
      contact_relationship: 'recruiter' | 'hiring-manager' | 'employee' | 'referral' | 'other';
      difficulty: 'easy' | 'medium' | 'hard';
      document_type:
        | 'resume'
        | 'cv'
        | 'cover-letter'
        | 'portfolio'
        | 'transcript'
        | 'certification'
        | 'other';
      employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
      experience: 'positive' | 'neutral' | 'negative';
      interview_result: 'passed' | 'failed' | 'pending';
      interview_status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show';
      interview_type:
        | 'recruiter-screen'
        | 'phone-screen'
        | 'hiring-manager-chat'
        | 'video'
        | 'technical-assessment'
        | 'on-site'
        | 'technical-interview'
        | 'behavioral-interview'
        | 'leadership-interview'
        | 'panel'
        | 'final'
        | 'other';
      priority: 'low' | 'medium' | 'high';
      remote_policy: 'full-remote' | 'hybrid' | 'on-site' | 'flexible';
      salary_period: 'hourly' | 'annual';
      work_type: 'remote' | 'hybrid' | 'onsite';
    };
  };
}
