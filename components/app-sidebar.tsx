'use client'

import {
  Package,
  LayoutDashboard,
  ClipboardList,
  Warehouse,
  Settings,
  HelpCircle,
  ChevronDown,
} from 'lucide-react'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const mainNavItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },

  {
    title: 'Inventory',
    icon: Package,
    href: '/inventory',
  },

  {
    title: 'Reservations',
    icon: ClipboardList,
    href: '/reservations',
  },

  {
    title: 'Warehouses',
    icon: Warehouse,
    href: '/warehouses',
  },
]

const secondaryNavItems = [
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },

  {
    title: 'Help & Support',
    icon: HelpCircle,
    href: '/help',
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar
      collapsible="icon"
      className="border-sidebar-border"
    >
      <SidebarHeader className="px-4 py-4 sm:py-5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary md:h-8 md:w-8">
            <Package className="h-4 w-4 text-primary-foreground" />
          </div>

          <span className="truncate text-lg font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            AlloReserve
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Main
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                >
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === item.href
                    }
                    tooltip={item.title}
                    className="h-11 rounded-xl md:h-10"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />

                      <span className="font-medium">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Support
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map(
                (item) => (
                  <SidebarMenuItem
                    key={item.title}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === item.href
                      }
                      tooltip={item.title}
                      className="h-11 rounded-xl md:h-10"
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />

                        <span className="font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarSeparator className="mb-3" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex min-h-12 w-full min-w-0 cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-sidebar-accent">
              <Avatar className="h-9 w-9 shrink-0 border">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  A
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col items-start text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">
                  Admin
                </span>

                <span className="truncate text-xs text-muted-foreground">
                  System Administrator
                </span>
              </div>

              <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56"
          >
            <DropdownMenuItem asChild>
              <Link href="/profile">
                Profile
              </Link>
            </DropdownMenuItem>

            

            <DropdownMenuItem
              onClick={() => {
                localStorage.clear()
                window.location.href = '/'
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
