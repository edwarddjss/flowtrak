'use client'

import * as React from 'react'
import { useMemo } from "react"
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  MoreHorizontal,
  PencilIcon,
  Trash2Icon,
  ExternalLinkIcon,
} from 'lucide-react'
import type { Application } from '@/types'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Badge } from './ui/badge'
import { Skeleton } from './ui/skeleton'
import { ApplicationDialog } from './application-dialog'
import { toast } from './ui/use-toast'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table"

interface InternshipTableProps {
  applications: Application[]
  isLoading?: boolean
}

const statusColors = {
  applied: 'default',
  interviewing: 'secondary',
  offer: 'success',
  accepted: 'success',
  rejected: 'destructive',
} as const

export function InternshipTable({ applications, isLoading }: InternshipTableProps) {
  const queryClient = useQueryClient()

  const { mutate: deleteApplication } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/applications?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete application')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast({
        title: 'Application deleted successfully',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete application',
        variant: 'destructive',
      })
    },
  })

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: "company",
        header: "Company",
      },
      {
        accessorKey: "position",
        header: "Position",
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string
          return (
            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              status === "offer" || status === "accepted"
                ? "bg-green-900/50 text-green-300"
                : status === "interviewing"
                ? "bg-blue-900/50 text-blue-300"
                : status === "rejected"
                ? "bg-red-900/50 text-red-300"
                : "bg-gray-900/50 text-gray-300"
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          )
        },
      },
      {
        accessorKey: "applied_date",
        header: "Applied Date",
        cell: ({ row }) => {
          const applied_date = row.getValue("applied_date") as string
          return (
            <div className="text-gray-300">
              {format(new Date(applied_date), 'MMM d, yyyy')}
            </div>
          )
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const application = row.original
          return (
            <div className="text-gray-300">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <ApplicationDialog
                      trigger={
                        <button className="w-full flex items-center">
                          <PencilIcon className="mr-2 h-4 w-4" />
                          Edit
                        </button>
                      }
                      initialData={application}
                      mode="edit"
                    />
                  </DropdownMenuItem>
                  {application.link && (
                    <DropdownMenuItem asChild>
                      <a
                        href={application.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <ExternalLinkIcon className="mr-2 h-4 w-4" />
                        View Job
                      </a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this application?')) {
                        deleteApplication(application.id)
                      }
                    }}
                    className="text-red-600"
                  >
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No applications found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
