'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { FormValues } from '@/types'

export async function createOrUpdateApplicationAction(values: FormValues) {
  const supabase = createServerComponentClient({ cookies })

  const formattedData = {
    ...values,
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

    if (error) throw error
  } else {
    const { error } = await supabase
      .from('applications')
      .insert(formattedData)

    if (error) throw error
  }

  revalidatePath('/dashboard')
}
