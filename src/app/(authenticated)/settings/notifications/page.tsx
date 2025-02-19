'use client'

import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications.
        </p>
      </div>
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose what updates you want to receive via email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="application-updates" className="flex flex-col space-y-1">
              <span>Application Updates</span>
              <span className="text-sm font-normal text-muted-foreground">
                Receive updates about your job applications.
              </span>
            </Label>
            <Switch id="application-updates" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="interview-reminders" className="flex flex-col space-y-1">
              <span>Interview Reminders</span>
              <span className="text-sm font-normal text-muted-foreground">
                Get notified about upcoming interviews.
              </span>
            </Label>
            <Switch id="interview-reminders" defaultChecked />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
              <span>Marketing Emails</span>
              <span className="text-sm font-normal text-muted-foreground">
                Receive emails about new features and improvements.
              </span>
            </Label>
            <Switch id="marketing-emails" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Configure push notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="browser-notifications" className="flex flex-col space-y-1">
              <span>Browser Notifications</span>
              <span className="text-sm font-normal text-muted-foreground">
                Receive notifications in your browser.
              </span>
            </Label>
            <Switch id="browser-notifications" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
