'use client'

import { Application } from '@/app/client-actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { 
  Pencil, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  FileSpreadsheet, 
  Plus, 
  Search, 
  ArrowUpDown, 
  Filter,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react'
import { ApplicationDialog } from './application-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { formatDate } from '@/lib/utils'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { useState, useMemo } from 'react'
import { Skeleton } from './ui/skeleton'
import { deleteApplicationAction } from '@/app/client-actions'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from './ui/card'
import { motion } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from './ui/input'
import Link from 'next/link'

// Helper function to get badge variant based on status
function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'rejected':
      return 'destructive'
    case 'offer':
    case 'accepted':
      return 'success'
    case 'interviewing':
      return 'info'
    case 'applied':
      return 'secondary'
    default:
      return 'outline'
  }
}

type SortField = 'company' | 'position' | 'status' | 'applied_date' | 'updated_at'
type SortDirection = 'asc' | 'desc'

interface ApplicationsTableProps {
  applications: Application[];
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: () => Promise<void>;
  isLoading?: boolean;
  limitColumns?: boolean;
  showViewAll?: boolean;
}

export function ApplicationsTable({ 
  applications, 
  onDelete, 
  onUpdate, 
  isLoading,
  limitColumns = false,
  showViewAll = false
}: ApplicationsTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('updated_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleDelete = async (id: string) => {
    if (onDelete) {
      await onDelete(id)
      router.refresh()
    } else {
      await deleteApplicationAction(id)
      router.refresh()
    }
  }

  const handleUpdate = async () => {
    if (onUpdate) {
      await onUpdate()
      router.refresh()
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Apply search filter
      if (searchTerm && !`${app.company} ${app.position} ${app.location}`.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      
      // Apply status filter
      if (statusFilter && app.status !== statusFilter) {
        return false
      }
      
      return true
    })
  }, [applications, searchTerm, statusFilter])

  const sortedApplications = useMemo(() => {
    return [...filteredApplications].sort((a, b) => {
      let valA: any = a[sortField]
      let valB: any = b[sortField]
      
      // Convert dates to timestamps for comparison
      if (sortField === 'applied_date' || sortField === 'updated_at') {
        valA = new Date(valA).getTime()
        valB = new Date(valB).getTime()
      }
      
      // String comparison
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA)
      }
      
      // Number comparison
      return sortDirection === 'asc' 
        ? valA - valB 
        : valB - valA
    })
  }, [filteredApplications, sortField, sortDirection])

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedApplications.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedApplications, currentPage, itemsPerPage])

  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(sortedApplications.length / itemsPerPage)),
    [sortedApplications, itemsPerPage]
  )

  // Display loading state
  if (isLoading) {
    return (
      <>
        {/* Desktop view - visible on md and above */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                {!limitColumns && <TableHead>Last Updated</TableHead>}
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  {!limitColumns && <TableCell><Skeleton className="h-4 w-24" /></TableCell>}
                  <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Mobile view - visible on smaller than md */}
        <div className="md:hidden space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-24 mr-auto" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    )
  }

  // Display empty state
  if (sortedApplications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No applications found.</p>
      </div>
    )
  }

  // Display search and filters only if not in limited mode
  const searchAndFilters = !limitColumns && (
    <div className="mb-4 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search applications..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="sm:w-[150px] justify-start">
            <Filter className="mr-2 h-4 w-4" />
            {statusFilter || "All Statuses"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem onClick={() => setStatusFilter(null)}>
            All Statuses
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter('applied')}>
            Applied
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter('interviewing')}>
            Interviewing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter('offer')}>
            Offer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>
            Rejected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
  
  // Desktop view (md and above)
  const desktopView = (
    <div className="hidden md:block rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50">
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('company')}
            >
              <div className="flex items-center">
                Company
                {sortField === 'company' && (
                  <ArrowUpDown className={cn(
                    "ml-2 h-3 w-3",
                    sortDirection === 'desc' ? "transform rotate-180" : ""
                  )} />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('position')}
            >
              <div className="flex items-center">
                Position
                {sortField === 'position' && (
                  <ArrowUpDown className={cn(
                    "ml-2 h-3 w-3",
                    sortDirection === 'desc' ? "transform rotate-180" : ""
                  )} />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                Status
                {sortField === 'status' && (
                  <ArrowUpDown className={cn(
                    "ml-2 h-3 w-3",
                    sortDirection === 'desc' ? "transform rotate-180" : ""
                  )} />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('applied_date')}
            >
              <div className="flex items-center whitespace-nowrap">
                Applied Date
                {sortField === 'applied_date' && (
                  <ArrowUpDown className={cn(
                    "ml-2 h-3 w-3",
                    sortDirection === 'desc' ? "transform rotate-180" : ""
                  )} />
                )}
              </div>
            </TableHead>
            {!limitColumns && (
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('updated_at')}
              >
                <div className="flex items-center whitespace-nowrap">
                  Last Updated
                  {sortField === 'updated_at' && (
                    <ArrowUpDown className={cn(
                      "ml-2 h-3 w-3",
                      sortDirection === 'desc' ? "transform rotate-180" : ""
                    )} />
                  )}
                </div>
              </TableHead>
            )}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedApplications.map((application) => (
            <TableRow key={application.id} className="group">
              <TableCell className="font-medium">{application.company}</TableCell>
              <TableCell>{application.position}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(application.status)}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(application.applied_date)}
              </TableCell>
              {!limitColumns && (
                <TableCell className="whitespace-nowrap">
                  {formatDate(application.updated_at)}
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100">
                  <ApplicationDialog
                    mode="edit"
                    initialData={application}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Edit application"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                  />
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        aria-label="Delete application"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this application. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(application.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  // Mobile view for small screens
  const mobileView = (
    <div className="md:hidden space-y-4">
      {paginatedApplications.map((application) => (
        <Card key={application.id} className="overflow-hidden hover:shadow-md transition-all">
          <CardContent className="p-0">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{application.company}</h3>
                <Badge variant={getStatusBadgeVariant(application.status)}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center">
                <p className="text-sm text-muted-foreground mr-auto">
                  {application.position}
                  {application.location && ` · ${application.location}`}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Applied {formatDate(application.applied_date)}
                </p>
                <div className="flex gap-1">
                  <ApplicationDialog
                    mode="edit"
                    initialData={application}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this application. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(application.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Pagination controls
  const paginationControls = !limitColumns && (
    <div className="mt-4 flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
        {Math.min(currentPage * itemsPerPage, sortedApplications.length)} of{' '}
        {sortedApplications.length} applications
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const viewAllButton = showViewAll && (
    <div className="flex justify-center mt-4">
      <Link href="/dashboard/applications">
        <Button variant="outline" className="w-full md:w-auto">
          <ExternalLink className="mr-2 h-4 w-4" />
          View All Applications
        </Button>
      </Link>
    </div>
  )

  return (
    <div>
      {searchAndFilters}
      {desktopView}
      {mobileView}
      {paginationControls}
      {viewAllButton}
    </div>
  )
}
