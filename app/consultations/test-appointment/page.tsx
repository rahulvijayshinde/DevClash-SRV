"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/AuthContext"
import { createAppointment, getUserAppointments } from "@/lib/supabase"

export default function TestAppointmentPage() {
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [appointments, setAppointments] = useState<any[]>([])

  const createTestAppointment = async () => {
    if (!user?.id) {
      setMessage("Please log in first")
      return
    }

    setIsCreating(true)
    setMessage("")

    try {
      // Generate dates for appointment next week
      const today = new Date()
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)
      
      const appointmentDate = nextWeek.toISOString().split('T')[0] // YYYY-MM-DD
      const appointmentTime = "14:00:00" // 2 PM
      
      const result = await createAppointment({
        user_id: user.id,
        specialist_type: "general-practitioner",
        specialist_name: "Dr. Test Doctor",
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason: "Test Appointment",
        notes: "This is a test appointment created via the test page"
      })

      if (result.success) {
        setMessage(`Appointment created successfully! ID: ${result.appointment_id}`)
      } else {
        setMessage(`Error creating appointment: ${result.error}`)
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsCreating(false)
    }
  }

  const loadAppointments = async () => {
    if (!user?.id) {
      setMessage("Please log in first")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const { appointments: data, error } = await getUserAppointments(user.id)
      
      if (error) {
        setMessage(`Error loading appointments: ${error}`)
        return
      }
      
      setAppointments(data || [])
      setMessage(`Loaded ${data?.length || 0} appointments`)
    } catch (error) {
      setMessage(`Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to use this test page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Appointment Test Page</h1>
      
      {message && (
        <Alert className="my-4">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Create Test Appointment */}
        <Card>
          <CardHeader>
            <CardTitle>Create Test Appointment</CardTitle>
            <CardDescription>
              Create a test appointment for debugging purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>User ID</Label>
                <Input value={user.id} disabled />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={createTestAppointment} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Test Appointment"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* View Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>View Appointments</CardTitle>
            <CardDescription>
              Load and view all appointments for this user
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                <p>Found {appointments.length} appointments:</p>
                <div className="rounded border p-4 max-h-60 overflow-auto">
                  <pre className="text-xs">
                    {JSON.stringify(appointments, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <p>No appointments loaded yet</p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={loadAppointments} disabled={isLoading}>
              {isLoading ? "Loading..." : "Load Appointments"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 