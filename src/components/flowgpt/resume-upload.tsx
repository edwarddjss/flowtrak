'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Upload, Linkedin, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileDropzone } from '@/components/ui/file-dropzone'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { DragEvent } from 'react'

interface ResumeUploadProps {
  onUploadAction: (file: File) => Promise<{ success: boolean } | void>
  onLinkedInAction: (url: string) => Promise<{ success: boolean } | void>
  loading?: boolean
}

export function ResumeUpload({ onUploadAction, onLinkedInAction, loading }: ResumeUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [linkedInUrl, setLinkedInUrl] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
      setUploadError('Please upload a PDF or DOCX file')
      return
    }

    setUploadError('')
    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      await onUploadAction(file)
      setUploadProgress(100)
      setTimeout(() => {
        setUploadProgress(0)
        setSelectedFile(null)
      }, 1000)
    } catch (error) {
      setUploadError('Failed to upload file. Please try again.')
      setUploadProgress(0)
      setSelectedFile(null)
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    if (loading) return
    event.preventDefault()
    event.stopPropagation()
    
    const file = event.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      handleFileUpload(file)
    }
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    handleFileUpload(file)
  }

  const handleLinkedInImport = async () => {
    if (!linkedInUrl) {
      setUploadError('Please enter your LinkedIn profile URL')
      return
    }

    setUploadError('')
    try {
      await onLinkedInAction(linkedInUrl)
      setLinkedInUrl('')
    } catch (error) {
      setUploadError('Failed to import LinkedIn profile. Please try again.')
    }
  }

  return (
    <div className="space-y-8">
      {/* File Upload Section */}
      <div className={cn(
        "relative overflow-hidden rounded-lg border border-dashed",
        "transition-colors",
        loading 
          ? "border-muted-foreground/10 cursor-not-allowed" 
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      )}>
        <FileDropzone
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
          value={selectedFile}
          accept=".pdf,.docx"
          maxSize={5 * 1024 * 1024}
          className={cn(
            "bg-muted/5 backdrop-blur-sm",
            loading && "pointer-events-none opacity-50"
          )}
        >
          <div className="flex flex-col items-center justify-center space-y-4 p-8">
            <div className="rounded-full bg-primary/10 p-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-semibold">
                {loading ? 'Uploading...' : 'Drop your resume here'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Supports PDF and DOCX files up to 5MB
              </p>
            </div>
            {uploadError && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {uploadError}
              </div>
            )}
            {uploadProgress > 0 && (
              <motion.div
                className="h-1 w-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.2 }}
              />
            )}
          </div>
        </FileDropzone>
      </div>

      {/* LinkedIn Import Section */}
      <div>
        <Separator className="my-8" />
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold">Or import from LinkedIn</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="Paste your LinkedIn profile URL"
                value={linkedInUrl}
                onChange={e => setLinkedInUrl(e.target.value)}
                className="bg-muted/5"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleLinkedInImport}
              disabled={!linkedInUrl || loading}
              className="gap-2"
            >
              <Linkedin className="h-4 w-4" />
              Import
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
