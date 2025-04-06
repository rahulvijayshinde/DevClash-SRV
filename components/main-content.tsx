"use client"

import { useAuth } from "@/lib/AuthContext"
import { useSidebar } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

interface MainContentProps {
  children: React.ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const { state } = useSidebar()
  
  // Check if we should hide the sidebar (home page when not logged in, or auth pages)
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/reset-password"
  const shouldHideSidebar = (pathname === "/" && !user) || isAuthPage
  
  // Determine if sidebar should be shown
  const showingSidebar = !shouldHideSidebar
  
  // Adjust content width based on whether sidebar is shown and its state
  const contentClasses = showingSidebar
    ? `flex-1 transition-all duration-300 ${state === "expanded" ? "md:ml-[var(--sidebar-width)]" : ""}`
    : "w-full"

  // For auth pages, add extra styling for centering content
  const authPageClasses = isAuthPage ? "flex items-center justify-center" : ""

  return (
    <main className={`min-h-screen overflow-y-auto px-4 py-6 ${contentClasses} ${authPageClasses}`}>
      {children}
    </main>
  )
} 