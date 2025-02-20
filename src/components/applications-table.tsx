'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Application } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { EditApplicationDialog } from './edit-application-dialog'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'
import { Badge } from './ui/badge'
import { Skeleton } from './ui/skeleton'

interface ApplicationsTableProps {
  applications: Application[];
  refreshAction: () => Promise<Application[]>;
  deleteAction: (id: string) => Promise<Application[]>;
  isLoading?: boolean;
}

export function ApplicationsTable({ 
  applications, 
  refreshAction, 
  deleteAction, 
  isLoading 
}: ApplicationsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    const colors = {
      applied: 'bg-blue-500',
      interviewing: 'bg-yellow-500',
      offer: 'bg-green-500',
      rejected: 'bg-red-500',
      accepted: 'bg-purple-500'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (!applications?.length) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No applications found. Add your first application to get started.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>
                <span className="font-medium">{application.company}</span>
              </TableCell>
              <TableCell>{application.position}</TableCell>
              <TableCell>{application.location}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(application.status)}>
                  {application.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(application.applied_date)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setEditingId(application.id)}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteAction(application.id)}
                      className="cursor-pointer text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditApplicationDialog
        application={applications.find(app => app.id === editingId)!}
        open={!!editingId}
        onOpenChange={(open) => !open && setEditingId(null)}
        onSuccess={() => {
          setEditingId(null)
          refreshAction()
        }}
      />
    </>
  )
}
