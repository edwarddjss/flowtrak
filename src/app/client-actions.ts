'use server'

import { auth } from "@/auth"
import { createClient } from "@supabase/supabase-js"
import { Application, FormValues } from '@/types'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function refreshApplicationsAction() {
  const session = await auth()
  if (!session?.user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', session.user.id)
    .order('applied_date', { ascending: false })

  if (error) throw error
  return data as Application[]
}

export async function deleteApplicationAction(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id)

  if (error) throw error
  revalidatePath('/dashboard')
}

export async function createOrUpdateApplicationAction(values: any) {
  const session = await auth()
  if (!session?.user) throw new Error('Not authenticated')

  // Clean and format the data
  const formattedData = {
    company: values.company,
    position: values.position,
    location: values.location,  
    status: values.status,
    applied_date: values.applied_date instanceof Date ? values.applied_date.toISOString() : values.applied_date,
    interview_date: values.interview_date instanceof Date ? values.interview_date.toISOString() : values.interview_date,
    salary: values.salary ? Number(values.salary) : null,
    link: values.link || null,
    notes: values.notes || null,
    previous_status: values.previous_status || null,
    user_id: session.user.id
  }

  if (values.id) {
    // Update existing application
    const { error } = await supabase
      .from('applications')
      .update(formattedData)
      .eq('id', values.id)
      .eq('user_id', session.user.id)

    if (error) throw error
  } else {
    // Create new application
    const { error } = await supabase
      .from('applications')
      .insert([formattedData])

    if (error) throw error
  }

  revalidatePath('/dashboard')
}

export async function getApplications() {
  const session = await auth()
  if (!session?.user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateUserProfileAction(values: { 
  username: string;
  avatar_id?: string;
}) {
  const session = await auth()
  if (!session?.user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('profiles')
    .update({
      username: values.username,
      avatar_id: values.avatar_id,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.user.id)

  if (error) throw error
  revalidatePath('/dashboard')
}

export async function getUserProfileAction() {
  const session = await auth()
  if (!session?.user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error) throw error
  return data
}
