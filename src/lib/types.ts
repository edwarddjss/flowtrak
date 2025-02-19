export interface Application {
  id: string
  company: string
  position: string
  location?: string
  status: 'applied' | 'interviewing' | 'offer' | 'accepted' | 'rejected'
  applied_date: string
  interview_date?: string | null
  salary?: number | null
  link?: string | null
  notes?: string | null
  previous_status?: ('applied' | 'interviewing' | 'offer' | 'accepted' | 'rejected') | null
  user_id: string
  created_at: string
  updated_at: string
}
