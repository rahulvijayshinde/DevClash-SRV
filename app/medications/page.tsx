import { PillIcon } from "lucide-react"
import { MedicationManager } from "@/components/medication-manager"

export default function MedicationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Medication Management</h1>
        <p className="text-muted-foreground">Track and manage your medications with reminders</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <MedicationManager />
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700">
              <PillIcon className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Medication Adherence</h2>
            <p className="mb-4 text-muted-foreground">
              Taking your medications as prescribed is crucial for managing your health conditions effectively.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs">
                  1
                </span>
                <span>Add all your medications to the tracker</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs">
                  2
                </span>
                <span>Set up reminders for each medication</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs">
                  3
                </span>
                <span>Mark medications as taken when you take them</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs">
                  4
                </span>
                <span>Track your adherence over time</span>
              </li>
            </ul>

            <div className="mt-6 rounded-md bg-blue-50 p-4 text-blue-800">
              <p className="text-sm font-medium">Medication Safety</p>
              <p className="text-xs">
                Always follow your healthcare provider's instructions for taking medications. If you experience any side
                effects, contact your healthcare provider immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

