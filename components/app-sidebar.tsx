"use client"

import {
  Home,
  Stethoscope,
  Calendar,
  PillIcon,
  LineChart,
  MapPin,
  MessageSquare,
  HelpCircle,
  LogOut,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Home",
      icon: Home,
      href: "/",
    },
    {
      title: "Symptom Checker",
      icon: Stethoscope,
      href: "/symptom-checker",
    },
    {
      title: "Consultations",
      icon: Calendar,
      href: "/consultations",
    },
    {
      title: "Medications",
      icon: PillIcon,
      href: "/medications",
    },
    {
      title: "Health Dashboard",
      icon: LineChart,
      href: "/dashboard",
    },
    {
      title: "Local Resources",
      icon: MapPin,
      href: "/resources",
    },
    {
      title: "Chat Assistant",
      icon: MessageSquare,
      href: "/chat",
    },
    {
      title: "Help Center",
      icon: HelpCircle,
      href: "/help",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-500 text-white">MC</div>
          <span className="text-lg font-semibold">MediConnect</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/profile">
                <Avatar className="h-5 w-5">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span>John Doe</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant="ghost" className="w-full justify-start">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

