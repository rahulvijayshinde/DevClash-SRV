"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signInWithEmail } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  // Use useEffect for redirect instead of during render
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  // If user is logged in, don't render the form
  if (user) {
    return null
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!email || !password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    const { user, error } = await signInWithEmail(email, password)

    if (error) {
      setError(error)
      setLoading(false)
      return
    }

    if (user) {
      console.log("Login successful, redirecting...")
      router.refresh() // Force refresh the router
      router.push("/")
    } else {
      setError("Login failed. Please check your credentials and try again.")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-md mx-auto">
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" className="p-0 h-auto text-sm" onClick={() => router.push("/forgot-password")}>
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/signup")}>
              Sign up
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


