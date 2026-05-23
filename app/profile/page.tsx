import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Mail, Shield, Calendar, Building } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ProfilePage() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-start gap-3">
            <SidebarTrigger className="mt-0.5 h-10 w-10 shrink-0 rounded-lg border md:hidden" />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">Profile</h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-auto">
          <div className="container mx-auto max-w-4xl space-y-6 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-6">
            {/* Profile Header */}
            <Card className="rounded-2xl border border-border">
              <CardHeader className="px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 sm:h-20 sm:w-20">
                      <span className="text-2xl font-bold text-primary sm:text-3xl">A</span>
                    </div>
                    <div className="min-w-0 space-y-2">
                      <CardTitle className="text-xl sm:text-2xl">Admin</CardTitle>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="rounded-lg">System Administrator</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Manage your inventory dashboard and account
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Account Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Account Information</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="rounded-2xl border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      admin@alloreserve.local
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Role
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      System Administrator
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Account Created
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      January 1, 2024
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Organization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      AlloReserve Inventory System
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Dashboard Statistics */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Quick Stats</h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="rounded-2xl border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across all warehouses
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Reservations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pending or confirmed
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Stock Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4,582</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Units in inventory
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Preferences</h2>

              <Card className="rounded-2xl border border-border">
                <CardHeader>
                  <CardTitle className="text-base">System Preferences</CardTitle>
                  <CardDescription>
                    Configure your dashboard experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-4 sm:px-6">
                  <div className="flex min-h-12 flex-col gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Dark Mode</p>
                      <p className="text-xs text-muted-foreground">
                        Automatically enabled for your system
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-lg">
                      Active
                    </Badge>
                  </div>

                  <div className="flex min-h-12 flex-col gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Stay updated on inventory changes
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-lg">
                      Enabled
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
