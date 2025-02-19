import { Database } from './supabase'

export type Application = Database['public']['Tables']['applications']['Row']

export type ApplicationInput = Omit<Application, 'id' | 'created_at' | 'updated_at' | 'user_id'>

export interface FormValues {
  id?: string
  company: string
  position: string
  location: string
  status: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'accepted'
  applied_date: Date
  interview_date?: Date | null
  salary?: string
  notes?: string
  link?: string
}
