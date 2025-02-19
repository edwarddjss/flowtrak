'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Application, FormValues } from '@/types'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function refreshApplicationsAction() {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('applied_date', { ascending: false })

  if (error) throw error
  return data as Application[]
}

export async function deleteApplicationAction(id: string) {
  const supabase = createServerComponentClient({ cookies })
  
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/dashboard')
}

export async function createOrUpdateApplicationAction(values: any) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

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
    user_id: user.id
  }

  try {
    let result;
    
    if (values.id) {
      // Update
      const { data, error } = await supabase
        .from('applications')
        .update(formattedData)
        .eq('id', values.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Create
      const { data, error } = await supabase
        .from('applications')
        .insert(formattedData)
        .select()
        .single()

      if (error) {
        console.error('Error creating application:', error)
        throw error
      }
      result = data
    }

    // Revalidate the page
    revalidatePath('/dashboard')
    return result
  } catch (error) {
    console.error('Error in createOrUpdateApplicationAction:', error)
    throw error
  }
}

export async function getApplications() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateUserProfileAction(values: { 
  username: string;
  avatar_id?: string;
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError) throw userError
  if (!user) throw new Error('No user found')

  // Update the user metadata
  const { data, error } = await supabase.auth.updateUser({
    data: {
      username: values.username,
      avatar_id: values.avatar_id,
      updated_at: new Date().toISOString()
    }
  })

  if (error) throw error

  // Force a refresh of the user session to get updated metadata
  await supabase.auth.refreshSession()
  
  return { success: true }
}

export async function getUserProfileAction() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) throw error
  if (!user) throw new Error('No user found')

  return {
    email: user.email,
    username: user.user_metadata?.username || '',
    avatar_id: user.user_metadata?.avatar_id,
    avatar_image: user.user_metadata?.avatar_image,
    avatar_color: user.user_metadata?.avatar_color
  }
}
