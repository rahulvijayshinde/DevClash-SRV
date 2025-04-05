import { Calendar } from "lucide-react"
import { ConsultationBooking } from "@/components/consultation-booking"

export default function ConsultationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Teleconsultation Booking</h1>
        <p className="text-muted-foreground">Schedule a virtual appointment with a healthcare provider</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ConsultationBooking />
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Calendar className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">How It Works</h2>
            <p className="mb-4 text-muted-foreground">
              Our teleconsultation service connects you with healthcare providers from the comfort of your home.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs">
                  1
                </span>
                <span>Select a healthcare provider and appointment time</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs">
                  2
                </span>
                <span>Receive a confirmation email with appointment details</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs">
                  3
                </span>
                <span>Join the video call at your scheduled time</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs">
                  4
                </span>
                <span>Receive a follow-up with your treatment plan</span>
              </li>
            </ul>

            <div className="mt-6 rounded-md bg-blue-50 p-4 text-blue-800">
              <p className="text-sm font-medium">Appointment Policy</p>
              <p className="text-xs">
                Please join the call 5 minutes before your scheduled time. If you need to reschedule, please do so at
                least 2 hours in advance. No-shows may be subject to a fee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

