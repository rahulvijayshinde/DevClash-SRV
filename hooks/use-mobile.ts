"use client"

import { useCallback, useEffect, useState } from "react"

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  const checkIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth < breakpoint)
  }, [breakpoint])

  useEffect(() => {
    // Set initial value
    checkIsMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile)

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [checkIsMobile])

  return isMobile
} 