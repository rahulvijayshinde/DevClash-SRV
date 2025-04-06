"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { AlertCircle, CalendarIcon, CheckCircle2, Loader2, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/AuthContext"
import { bookAppointment } from "@/lib/supabase"

const formSchema = z.object({
  specialistType: z.string().min(1, "Specialist type is required"),
  specialist: z.string().min(1, "Specialist is required"),
  date: z.date({
    required_error: "Appointment date is required",
  }),
  time: z.string().min(1, "Appointment time is required"),
  reason: z.string().min(5, "Please provide a reason for your consultation"),
  notes: z.string().optional(),
})

const specialists = {
  "general-practitioner": [
    { id: "gp1", name: "Dr. Sarah Johnson", availability: ["09:00", "10:00", "14:00", "15:00"] },
    { id: "gp2", name: "Dr. Michael Chen", availability: ["11:00", "13:00", "16:00", "17:00"] },
  ],
  pediatrician: [
    { id: "ped1", name: "Dr. Emily Rodriguez", availability: ["09:30", "10:30", "14:30", "15:30"] },
    { id: "ped2", name: "Dr. James Wilson", availability: ["11:30", "13:30", "16:30", "17:30"] },
  ],
  cardiologist: [
    { id: "card1", name: "Dr. Robert Smith", availability: ["09:15", "10:15", "14:15", "15:15"] },
    { id: "card2", name: "Dr. Lisa Patel", availability: ["11:15", "13:15", "16:15", "17:15"] },
  ],
  dermatologist: [
    { id: "derm1", name: "Dr. David Lee", availability: ["09:45", "10:45", "14:45", "15:45"] },
    { id: "derm2", name: "Dr. Maria Garcia", availability: ["11:45", "13:45", "16:45", "17:45"] },
  ],
}

export function ConsultationBooking() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appointmentId, setAppointmentId] = useState<string | null>(null)
  const [selectedSpecialistType, setSelectedSpecialistType] = useState<string | null>(null)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const { user } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialistType: "",
      specialist: "",
      reason: "",
      notes: "",
    },
  })

  const watchSpecialistType = form.watch("specialistType")
  const watchSpecialist = form.watch("specialist")
  const watchDate = form.watch("date")

  // Update available specialists when specialist type changes
  if (watchSpecialistType !== selectedSpecialistType) {
    setSelectedSpecialistType(watchSpecialistType)
    form.setValue("specialist", "")
    setAvailableTimes([])
  }

  // Update available times when specialist or date changes
  if (watchSpecialist && watchDate) {
    const specialistData = specialists[watchSpecialistType as keyof typeof specialists]?.find(
      (s) => s.id === watchSpecialist,
    )

    if (specialistData && availableTimes.length === 0) {
      setAvailableTimes(specialistData.availability)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      // Find the specialist's name
      const specialistData = specialists[values.specialistType as keyof typeof specialists]?.find(
        (s) => s.id === values.specialist
      )

      // Make sure the user is logged in
      if (!user || !user.id) {
        setError("You must be logged in to book an appointment")
        setIsSubmitting(false)
        return
      }

      // Log user info to help with debugging
      console.log("Booking with user:", {
        id: user.id,
        email: user.email,
        idType: typeof user.id
      });

      // Prepare appointment data
      const appointmentData = {
        user_id: user.id,
        specialist_type: values.specialistType,
        specialist_id: values.specialist,
        specialist_name: specialistData?.name || "Unknown Doctor",
        appointment_date: values.date,
        appointment_time: values.time,
        reason: values.reason,
        notes: values.notes || "",
      }

      console.log("Submitting appointment with data:", JSON.stringify(appointmentData, null, 2));

      // Save to Supabase
      const { success, error, appointmentId: newAppointmentId } = await bookAppointment(appointmentData)

      if (!success) {
        // Show a more detailed error from the response if available
        let errorMessage = "Failed to book appointment";
        
        if (error) {
          errorMessage = error;
          
          // Provide more user-friendly error messages for specific cases
          if (error.includes("violates row-level security policy")) {
            errorMessage = "You don't have permission to book appointments. Please contact support.";
          } else if (error.includes("Invalid user ID format")) {
            errorMessage = "There's an issue with your user account. Please try logging out and back in.";
          }
        }
        
        console.error("Booking failed:", errorMessage);
        setError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      // Set the appointment ID for reference
      if (newAppointmentId) {
        setAppointmentId(newAppointmentId)
      }

      // Show success state
      setIsSubmitting(false)
      setSuccess(true)
    } catch (err) {
      console.error("Error booking appointment:", err)
      
      // More detailed error message
      const errorMessage = err instanceof Error 
        ? err.message 
        : "An unexpected error occurred while booking your appointment";
      
      setError(errorMessage)
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-semibold">Appointment Confirmed!</h2>
          <p className="mb-6 text-center text-muted-foreground">
            Your teleconsultation has been scheduled successfully. You will receive a confirmation email with the
            details.
          </p>

          <Card className="mb-6 w-full border-green-100 bg-green-50">
            <CardContent className="p-4">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Appointment ID:</span>
                  <span className="text-sm font-mono">{appointmentId || 'Generated'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Specialist:</span>
                  <span className="text-sm">
                    {
                      specialists[form.getValues("specialistType") as keyof typeof specialists]?.find(
                        (s) => s.id === form.getValues("specialist"),
                      )?.name
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Date:</span>
                  <span className="text-sm">{format(form.getValues("date"), "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Time:</span>
                  <span className="text-sm">{form.getValues("time")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Button className="flex-1" variant="outline">
              Add to Calendar
            </Button>
            <Button className="flex-1 gap-2">
              <Video className="h-4 w-4" />
              Request Video Call
            </Button>
          </div>

          <Button
            variant="link"
            className="mt-4"
            onClick={() => {
              setSuccess(false)
              setAppointmentId(null)
              form.reset()
              setAvailableTimes([])
            }}
          >
            Book Another Appointment
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Teleconsultation</CardTitle>
        <CardDescription>Schedule a virtual appointment with a healthcare provider</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!user && (
          <Alert className="mb-6" variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              You need to be logged in to book an appointment. Please log in to continue.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="specialistType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialist Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialist type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general-practitioner">General Practitioner</SelectItem>
                        <SelectItem value="pediatrician">Pediatrician</SelectItem>
                        <SelectItem value="cardiologist">Cardiologist</SelectItem>
                        <SelectItem value="dermatologist">Dermatologist</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Healthcare Provider</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!watchSpecialistType}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={watchSpecialistType ? "Select provider" : "Select type first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {watchSpecialistType &&
                          specialists[watchSpecialistType as keyof typeof specialists]?.map((specialist) => (
                            <SelectItem key={specialist.id} value={specialist.id}>
                              {specialist.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Appointment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                            date > new Date(new Date().setDate(new Date().getDate() + 30))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={availableTimes.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={availableTimes.length === 0 ? "Select date and provider first" : "Select time"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Consultation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe your symptoms or reason for the consultation"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information you'd like to share with the healthcare provider"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Include any relevant medical history or current medications</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting || !user}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking Appointment...
                </>
              ) : (
                "Book Appointment"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

