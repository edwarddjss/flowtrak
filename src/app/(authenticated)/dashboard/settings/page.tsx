'use client'

import { ProfileSettings } from '@/components/flowgpt/profile-settings'

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground mt-2">
        Manage your account and preferences
      </p>
      <div className="mt-8">
        <ProfileSettings />
      </div>
    </div>
  )
}
