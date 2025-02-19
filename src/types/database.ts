import { Application, ApplicationStatus } from '.'

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: Application
        Insert: Omit<Application, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Application, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
