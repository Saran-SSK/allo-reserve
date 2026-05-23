import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Mail,
  BookOpen,
  AlertCircle,
  Package,
  ClipboardList,
} from 'lucide-react'

export default function HelpPage() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-start gap-3">
            <SidebarTrigger className="mt-0.5 h-10 w-10 shrink-0 rounded-lg border md:hidden" />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">Help & Support</h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Find answers and get support for AlloReserve
              </p>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-auto">
          <div className="container mx-auto max-w-4xl space-y-6 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-6">
            {/* Contact Support */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Get in Touch</h2>

              <Card className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Support
                  </CardTitle>
                  <CardDescription>
                    Have a question or need assistance? Reach out to our support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      support@alloreserve.local
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Response Time</p>
                    <p className="text-sm text-muted-foreground">
                      Typically within 24 hours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>

              <div className="space-y-3">
                <Card className="rounded-2xl border border-border">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      How do I add a new product?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Click the &quot;Add Product&quot; button in the Inventory section. Fill in the
                      product name, select a warehouse, and specify the initial stock quantity.
                      The system will automatically create the product and inventory record.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      What is a reservation?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      A reservation temporarily allocates stock from inventory. Reservations
                      can be in three states: Pending (awaiting confirmation), Confirmed (stock
                      is deducted), or Released (stock returned). Reservations automatically
                      expire after 10 minutes if not confirmed.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Can I delete a product with active reservations?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      No. You cannot delete a product that has pending or confirmed
                      reservations. You must first release or confirm all active reservations.
                      Expired or released reservations can be deleted along with the product.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      How do I export inventory data?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Click the &quot;Export&quot; button in the Inventory section. This will download
                      a CSV file containing all products, warehouses, total stock, reserved
                      stock, and available stock information.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      How do I edit product information?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Click the &quot;Edit&quot; button on any inventory card. You can modify the product
                      name, warehouse location, and total stock quantity. Changes are saved
                      immediately to the database.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Dashboard Guide */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Dashboard Guide</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="rounded-2xl border border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Inventory Section</CardTitle>
                    <CardDescription>
                      Manage your products and stock
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>
                      View all products across warehouses
                    </p>
                    <p>
                      See total, reserved, and available stock
                    </p>
                    <p>
                      Create, edit, and delete products
                    </p>
                    <p>
                      Make reservations instantly
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Reservations Panel</CardTitle>
                    <CardDescription>
                      Manage active reservations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>
                      View all pending and confirmed reservations
                    </p>
                    <p>
                      See countdown timer until expiration
                    </p>
                    <p>
                      Confirm or release reservations
                    </p>
                    <p>
                      Automatic expiration handling
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Warehouses</CardTitle>
                    <CardDescription>
                      Manage warehouse locations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>
                      View all warehouse locations
                    </p>
                    <p>
                      See inventory per warehouse
                    </p>
                    <p>
                      Create new warehouse locations
                    </p>
                    <p>
                      Track warehouse utilization
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Settings</CardTitle>
                    <CardDescription>
                      Configure preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>
                      System preferences
                    </p>
                    <p>
                      Dark mode toggle
                    </p>
                    <p>
                      Notification settings
                    </p>
                    <p>
                      Account management
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Reservation Lifecycle */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Reservation Lifecycle</h2>

              <Card className="rounded-2xl border border-border">
                <CardHeader>
                  <CardTitle className="text-base">How Reservations Work</CardTitle>
                  <CardDescription>
                    Understanding the complete reservation process
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex min-w-0 gap-3">
                      <Badge className="mt-1 shrink-0 rounded-lg">1</Badge>
                      <div className="min-w-0">
                        <p className="font-medium">Create Reservation</p>
                        <p className="text-sm text-muted-foreground">
                          Click &quot;Reserve Stock&quot; to create a pending reservation. Stock is
                          allocated but not deducted yet.
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 gap-3">
                      <Badge className="mt-1 shrink-0 rounded-lg">2</Badge>
                      <div className="min-w-0">
                        <p className="font-medium">Confirm Reservation</p>
                        <p className="text-sm text-muted-foreground">
                          Click &quot;Confirm&quot; to finalize the reservation. Stock is now
                          permanently deducted from inventory.
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 gap-3">
                      <Badge className="mt-1 shrink-0 rounded-lg">3</Badge>
                      <div className="min-w-0">
                        <p className="font-medium">Release Reservation</p>
                        <p className="text-sm text-muted-foreground">
                          Click &quot;Release&quot; to cancel the reservation. If pending, stock is
                          returned. If confirmed, it remains deducted.
                        </p>
                      </div>
                    </div>

                    <div className="flex min-w-0 gap-3">
                      <Badge className="mt-1 shrink-0 rounded-lg">4</Badge>
                      <div className="min-w-0">
                        <p className="font-medium">Auto-Expiration</p>
                        <p className="text-sm text-muted-foreground">
                          Pending reservations automatically expire after 10 minutes and are
                          marked as expired.
                        </p>
                      </div>
                    </div>
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
