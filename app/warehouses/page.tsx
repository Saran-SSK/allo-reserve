import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { WarehousesTable } from '@/components/warehouses-table'

export default function WarehousesPage() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-start gap-3">
            <SidebarTrigger className="mt-0.5 h-10 w-10 shrink-0 rounded-lg border md:hidden" />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">Warehouses</h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                View warehouse inventory distribution
              </p>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl space-y-6 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-6">
            <WarehousesTable />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
