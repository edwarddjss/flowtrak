export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          user_id: string
          company: string
          position: string
          location: string
          status: 'applied' | 'interviewing' | 'offer' | 'accepted' | 'rejected'
          applied_date: string
          salary: number | null
          notes: string | null
          link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company: string
          position: string
          location: string
          status: 'applied' | 'interviewing' | 'offer' | 'accepted' | 'rejected'
          applied_date: string
          salary?: number | null
          notes?: string | null
          link?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company?: string
          position?: string
          location?: string
          status?: 'applied' | 'interviewing' | 'offer' | 'accepted' | 'rejected'
          applied_date?: string
          salary?: number | null
          notes?: string | null
          link?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
