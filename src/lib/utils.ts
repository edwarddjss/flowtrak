import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null) {
  if (!date) return '-'
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, 'MMM d, yyyy')
  } catch (error) {
    return '-'
  }
}

export function getOperatingSystem() {
  if (typeof window === 'undefined') return 'win32' // Default to Windows for SSR
  const platform = window.navigator.platform.toLowerCase()
  if (platform.includes('mac')) return 'darwin'
  if (platform.includes('win')) return 'win32'
  if (platform.includes('linux')) return 'linux'
  return 'win32' // Default to Windows
}
