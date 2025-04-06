"use client"

import React, { CSSProperties } from "react"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/AuthContext"
import { usePathname } from "next/navigation"

export function SidebarFloatingTrigger() {
  const { state, toggleSidebar, isMobile, openMobile, setOpenMobile } = useSidebar()
  const { user } = useAuth()
  const pathname = usePathname()
  
  // Hide trigger on home page for non-authenticated users
  // Also hide on login and signup pages
  if ((pathname === "/" && !user) || 
      pathname === "/login" || 
      pathname === "/signup" ||
      pathname === "/reset-password") {
    return null;
  }
  
  // For mobile devices, we need a trigger to open the sidebar sheet
  if (isMobile) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full bg-background shadow-lg border hover:bg-accent"
          onClick={() => setOpenMobile(true)}
        >
          <PanelLeft className="h-6 w-6" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      </div>
    )
  }
  
  // For desktop, position fixed to the viewport
  return (
    <div className="fixed top-4 z-50 transition-all duration-300 ease-in-out" 
      style={{
        left: state === "expanded" ? 'calc(var(--sidebar-width) + 0.5rem)' : '1rem'
      }}>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full bg-background shadow-lg border hover:bg-accent"
        onClick={toggleSidebar}
      >
        <PanelLeft className={`h-5 w-5 transition-transform ${
          state === "expanded" ? "rotate-180" : ""
        }`} />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
    </div>
  )
} 