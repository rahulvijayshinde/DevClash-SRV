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
  LogIn,
  UserPlus
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"
import { signOut } from "@/lib/supabase"

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
import { toast } from "@/components/ui/use-toast"

// Define a type for menu items
type MenuItem = {
  title: string;
  icon: React.ElementType;
  href: string;
};

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading } = useAuth()

  // Hide sidebar on home page for non-authenticated users
  // Also hide on login and signup pages
  if ((pathname === "/" && !user) || 
      pathname === "/login" || 
      pathname === "/signup" ||
      pathname === "/reset-password") {
    return null;
  }

  // Protected menu items - only shown to authenticated users
  const protectedMenuItems: MenuItem[] = [
   
  ]

  // Public menu items - shown to all users
  const publicMenuItems: MenuItem[] = [
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
      title: "Medications",
      icon: PillIcon,
      href: "/medications",
    },
    {
      title: "Consultations",
      icon: Calendar,
      href: "/consultations",
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

  // Just use all menu items regardless of auth status
  const menuItemsToDisplay = publicMenuItems;

  const handleSignOut = async () => {
    try {
      console.log("Sign out initiated");
      const { error } = await signOut()
      if (error) throw error
      
      console.log("Sign out successful - cleared user data");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      })
      
      // Force a full page navigation to login
      console.log("Redirecting to login page");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Extract initials from user's email
  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    return user.email.substring(0, 2).toUpperCase();
  }

  return (
    <Sidebar
      className="border-r"
      variant="sidebar"
      collapsible="offcanvas"
    >
      <SidebarHeader className="px-4 py-6">
        <Link href="/" className="flex flex-col items-center justify-center w-full py-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-sky-500 text-white font-bold text-xl mb-3">
            MC
          </div>
          <span className="text-xl font-bold">MediConnect</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {menuItemsToDisplay.map((item) => (
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
          {user ? (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/profile'} tooltip="My Profile">
                  <Link href="/profile">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src="" alt={user.email || "User"} />
                      <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{user.email}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/login">
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/signup">
                    <UserPlus className="h-5 w-5" />
                    <span>Sign Up</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

