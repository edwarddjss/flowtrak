'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Use the Database types from Supabase
export type { Application } from '@/types'

export async function refreshApplicationsAction() {
  const supabase = createClient()
  
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/auth/signin')
  }

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }

  return data || []
}

export async function deleteApplicationAction(id: string) {
  const supabase = createClient()
  
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/auth/signin')
  }

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting application:', error)
    throw new Error('Failed to delete application')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/applications')
  return { success: true }
}

export interface FormValues {
  id?: string
  company: string
  position: string
  location: string
  status: 'applied' | 'interviewing' | 'offer' | 'accepted' | 'rejected'
  applied_date: Date
  interview_date?: Date | null
  salary?: string
  notes?: string
  link?: string
  previous_status?: 'applied' | 'interviewing' | 'offer' | 'accepted' | 'rejected'
}

export async function createOrUpdateApplicationAction(values: FormValues) {
  const supabase = createClient()
  
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/auth/signin')
  }

  // Clean and format the data
  const formattedData = {
    company: values.company,
    position: values.position,
    location: values.location || '',
    status: values.status,
    applied_date: values.applied_date instanceof Date ? values.applied_date.toISOString() : values.applied_date,
    interview_date: values.interview_date instanceof Date ? values.interview_date.toISOString() : values.interview_date,
    salary: values.salary ? Number(values.salary) : null,
    link: values.link || null,
    notes: values.notes || null,
    previous_status: values.previous_status || null,
    user_id: user.id,
  }

  if (values.id) {
    // Update existing application
    const { error } = await supabase
      .from('applications')
      .update(formattedData)
      .eq('id', values.id)
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Error updating application:', error)
      throw new Error('Failed to update application')
    }
  } else {
    // Create new application
    const { error } = await supabase
      .from('applications')
      .insert([formattedData])
    
    if (error) {
      console.error('Error creating application:', error)
      throw new Error('Failed to create application')
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/applications')
  return { success: true }
}

export async function getApplications() {
  return await refreshApplicationsAction()
}
