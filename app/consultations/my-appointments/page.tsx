"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar, Clock, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/AuthContext"
import { getAppointments } from "./client"  // Use the dedicated client

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchAppointments() {
      if (!user || !user.id) {
        // Handle case where user is not logged in
        setError("You must be logged in to view your appointments")
        setLoading(false)
        return
      }

      try {
        // Use the dedicated client function
        const { appointments, error } = await getAppointments(user.id)
        
        if (error) {
          setError(error)
          toast({
            variant: "destructive",
            title: "Error loading appointments",
            description: error
          })
        } else {
          setAppointments(appointments)
        }
      } catch (err) {
        console.error("Error fetching appointments:", err)
        setError("Failed to load appointments. Please try again later.")
        toast({
          variant: "destructive",
          title: "Error loading appointments",
          description: "An unexpected error occurred while loading your appointments."
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [user, toast])

  // Format date for display
  const formatAppointmentDate = (date: string) => {
    try {
      return format(new Date(date), "PPP")
    } catch (e) {
      return date
    }
  }

  if (!user) {
    return (
      <div className="container max-w-4xl py-6">
        <Card>
          <CardHeader>
            <CardTitle>My Appointments</CardTitle>
            <CardDescription>Please login to view your appointments</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/login")}>Login</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6">
      <h1 className="mb-6 text-3xl font-bold">My Appointments</h1>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-6">
            <div className="text-center text-destructive">{error}</div>
          </CardContent>
        </Card>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="mb-4">You don&apos;t have any appointments scheduled.</p>
            <Button onClick={() => router.push("/consultations")}>Book an Appointment</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle>{appointment.specialist_name}</CardTitle>
                <CardDescription>{appointment.specialist_type.replace(/-/g, " ")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatAppointmentDate(appointment.appointment_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.appointment_time}</span>
                  </div>
                  <div>
                    <p className="font-medium">Reason</p>
                    <p className="text-muted-foreground">{appointment.reason}</p>
                  </div>
                  {appointment.notes && (
                    <div>
                      <p className="font-medium">Notes</p>
                      <p className="text-muted-foreground">{appointment.notes}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        appointment.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : appointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {appointment.status === "scheduled" && (
                  <>
                    <Button variant="destructive" size="sm">
                      Cancel
                    </Button>
                    <Button variant="default" size="sm" className="gap-2">
                      <Video className="h-4 w-4" />
                      Join Call
                    </Button>
                  </>
                )}
                {appointment.status === "completed" && <Button variant="outline">View Summary</Button>}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 