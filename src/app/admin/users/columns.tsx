'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export type Profile = {
  id: string
  email: string
  is_verified: boolean
  is_admin: boolean
  created_at: string
}

export const columns: ColumnDef<Profile>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "is_verified",
    header: "Status",
    cell: ({ row }) => {
      const isVerified = row.getValue("is_verified") as boolean
      return (
        <Badge variant={isVerified ? "success" : "secondary"}>
          {isVerified ? "Verified" : "Pending"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "is_admin",
    header: "Role",
    cell: ({ row }) => {
      const isAdmin = row.getValue("is_admin") as boolean
      return (
        <Badge variant={isAdmin ? "destructive" : "default"}>
          {isAdmin ? "Admin" : "User"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string)
      return format(date, "MMM d, yyyy")
    },
  },
]
