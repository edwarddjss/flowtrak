'use client'

import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminUsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container py-10">
      <DataTable columns={columns} data={users || []} />
    </div>
  )
}
