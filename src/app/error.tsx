'use client'

import { Button } from "../components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] space-y-4">
      <Alert variant="destructive" className="max-w-lg">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription>
          {error.message || "An unexpected error occurred"}
          {error.digest && (
            <div className="mt-2 text-xs opacity-60">
              Error ID: {error.digest}
            </div>
          )}
        </AlertDescription>
      </Alert>
      <div className="space-x-4">
        <Button
          variant="default"
          onClick={() => reset()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
        >
          Go to homepage
        </Button>
      </div>
    </div>
  )
}
