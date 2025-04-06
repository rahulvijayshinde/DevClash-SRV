"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { CustomUser, getLocalUser } from '@/lib/supabase'

type AuthContextType = {
  user: CustomUser | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

// Default user for when no user is logged in
const DEFAULT_USER: CustomUser = {
  id: 'default-user',
  email: 'guest@example.com',
  full_name: 'Guest User'
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const loadInitialUser = () => {
      try {
        const localUser = getLocalUser();
        // Set to null when logged out instead of using DEFAULT_USER
        setUser(localUser);
        console.log("Initial auth state:", localUser ? "Logged in" : "Not logged in");
      } catch (error) {
        console.error('Error getting user from localStorage:', error);
        // On error, keep user as null
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialUser();

    // Listen for localStorage changes (for multi-tab support)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'custom_user') {
        if (!event.newValue) {
          // User logged out - set to null
          setUser(null);
        } else {
          // User logged in or updated
          try {
            const updatedUser = JSON.parse(event.newValue);
            setUser(updatedUser);
          } catch (e) {
            console.error('Error parsing user from storage event:', e);
            setUser(null);
          }
        }
      }
    };

    // Add listener for storage events
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 