'use client'

import { Moon, Sun, Laptop, Bell, Lock, Eye } from 'lucide-react'
import { useTheme } from 'next-themes'

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import { AppSidebar } from '@/components/app-sidebar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
  const { setTheme, theme } = useTheme()

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-start gap-3">
            <SidebarTrigger className="mt-0.5 h-10 w-10 shrink-0 rounded-lg border md:hidden" />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">Settings</h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Manage your dashboard preferences
              </p>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-auto">
          <div className="container mx-auto max-w-3xl space-y-6 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-6">
            {/* Appearance Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Appearance</h2>

              <Card className="rounded-2xl border border-border">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-base">Theme</CardTitle>
                  <CardDescription>
                    Choose how the interface looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 px-4 sm:px-6">
                  <div 
                    className="flex min-h-12 items-center justify-between gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                    onClick={() => setTheme('dark')}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Moon className="h-4 w-4 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">Dark Mode</p>
                        <p className="text-xs text-muted-foreground">
                          Recommended for reduced eye strain
                        </p>
                      </div>
                    </div>
                    {theme === 'dark' && (
                      <Badge className="rounded-lg">Active</Badge>
                    )}
                  </div>

                  <div 
                    className="flex min-h-12 items-center justify-between gap-3 rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                    onClick={() => setTheme('light')}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Sun className="h-4 w-4 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">Light Mode</p>
                        <p className="text-xs text-muted-foreground">
                          Bright interface for daytime use
                        </p>
                      </div>
                    </div>
                    {theme === 'light' && (
                      <Badge className="rounded-lg">Active</Badge>
                    )}
                  </div>

                  <div 
                    className="flex min-h-12 items-center justify-between gap-3 rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                    onClick={() => setTheme('system')}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Laptop className="h-4 w-4 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">System Default</p>
                        <p className="text-xs text-muted-foreground">
                          Follow system preferences
                        </p>
                      </div>
                    </div>
                    {theme === 'system' && (
                      <Badge className="rounded-lg">Active</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Notifications</h2>

              <Card className="rounded-2xl border border-border">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Alert Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 px-4 sm:px-6">
                  <div className="flex min-h-12 flex-col gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Reservation Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Get notified when reservations expire
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-lg">
                      Enabled
                    </Badge>
                  </div>

                  <div className="flex min-h-12 flex-col gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Low Stock Alerts</p>
                      <p className="text-xs text-muted-foreground">
                        Alert when inventory falls below 10% capacity
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-lg">
                      Enabled
                    </Badge>
                  </div>

                  <div className="flex min-h-12 flex-col gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Error Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Critical system and operation errors
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-lg">
                      Enabled
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Privacy & Security</h2>

              <Card className="rounded-2xl border border-border">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage security options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 px-4 sm:px-6">
                  <div className="flex min-h-12 flex-col gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Session Timeout</p>
                      <p className="text-xs text-muted-foreground">
                        Automatically log out after 1 hour of inactivity
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-lg">
                      Active
                    </Badge>
                  </div>

                  <div className="flex min-h-12 flex-col gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Data Encryption</p>
                      <p className="text-xs text-muted-foreground">
                        All data encrypted in transit and at rest
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-lg">
                      Secure
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data & Privacy */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Data & Privacy</h2>

              <Card className="rounded-2xl border border-border">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Data Management
                  </CardTitle>
                  <CardDescription>
                    Control your data and privacy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 px-4 sm:px-6">
                  <div className="flex min-h-12 flex-col gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Analytics</p>
                      <p className="text-xs text-muted-foreground">
                        Help us improve by sharing usage data
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-lg">
                      Enabled
                    </Badge>
                  </div>

                  <div className="flex min-h-12 flex-col gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Data Retention</p>
                      <p className="text-xs text-muted-foreground">
                        Your data is retained for 12 months
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-lg">
                      12 months
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">System Information</h2>

              <Card className="rounded-2xl border border-border">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-base">Version & Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-4 text-sm sm:px-6">
                  <div className="flex min-h-12 flex-col gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-muted-foreground">AlloReserve Version</span>
                    <Badge variant="outline" className="rounded-lg">
                      1.0.0
                    </Badge>
                  </div>

                  <div className="flex min-h-12 flex-col gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-muted-foreground">Database Version</span>
                    <Badge variant="outline" className="rounded-lg">
                      PostgreSQL 15
                    </Badge>
                  </div>

                  <div className="flex min-h-12 flex-col gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-muted-foreground">Last Update</span>
                    <Badge variant="outline" className="rounded-lg">
                      May 23, 2026
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
