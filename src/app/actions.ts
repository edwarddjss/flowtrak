'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { Application, FormValues } from '@/types'

interface CreateApplicationData {
  company: string
  position: string
  status: string
}

export async function createApplicationAction(data: CreateApplicationData) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('applications')
    .insert([
      {
        user_id: user.id,
        company: data.company,
        position: data.position,
        status: data.status,
        applied_date: new Date().toISOString(),
      }
    ])

  if (error) {
    console.error('Error creating application:', error)
    throw error
  }

  revalidatePath('/dashboard')
}

export async function createOrUpdateApplicationAction(values: FormValues) {
  const supabase = createServerComponentClient({ cookies })
  
  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const formattedData = {
    ...values,
    user_id: user.id, // Add user_id to the data
    applied_date: values.applied_date.toISOString(),
    interview_date: values.interview_date ? values.interview_date.toISOString() : null,
    salary: values.salary && values.salary.length > 0 ? Number(values.salary) : null,
    notes: values.notes && values.notes.length > 0 ? values.notes : null,
    link: values.link && values.link.length > 0 ? values.link : null,
  }

  if (values.id) {
    const { error } = await supabase
      .from('applications')
      .update(formattedData)
      .eq('id', values.id)
      .eq('user_id', user.id) // Ensure we're updating the user's own application

    if (error) throw error
  } else {
    const { error } = await supabase
      .from('applications')
      .insert(formattedData)

    if (error) throw error
  }

  revalidatePath('/dashboard')
}

export async function updateApplicationAction() {
  revalidatePath('/dashboard')
}

export async function deleteApplicationAction(id: string) {
  const supabase = createServerComponentClient({ cookies })
  
  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // Ensure we're deleting the user's own application

  if (error) throw error
  revalidatePath('/dashboard')
}

export interface Activity {
  id: string
  type: 'application' | 'status' | 'note'
  title: string
  timestamp: string
  application_id: string
}

export async function getRecentActivitiesAction(limit: number = 5): Promise<Activity[]> {
  const supabase = createServerComponentClient({ cookies })
  
  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get recent activities from applications table changes
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching activities:', error)
    throw error
  }

  // Transform applications into activities
  return data.map(app => ({
    id: app.id,
    type: app.previous_status ? 'status' : 'application',
    title: app.previous_status
      ? `Status changed to ${app.status} for ${app.company}`
      : `Applied to ${app.position} at ${app.company}`,
    timestamp: app.updated_at,
    application_id: app.id
  }))
}

export async function refreshApplicationsAction(): Promise<Application[]> {
  const supabase = createServerComponentClient({ cookies })
  
  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  console.log('Fetching applications for user:', user.id)
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('applied_date', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    throw error
  }
  console.log('Fetched applications:', data)
  return data
}
