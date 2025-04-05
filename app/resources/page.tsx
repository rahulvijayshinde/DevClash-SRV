import { MapPin } from "lucide-react"
import { LocalResources } from "@/components/local-resources"

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Local Health Resources</h1>
        <p className="text-muted-foreground">Find healthcare facilities and resources near you</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <LocalResources />
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
              <MapPin className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Finding Resources</h2>
            <p className="mb-4 text-muted-foreground">
              Access to healthcare resources is essential, especially in underserved communities. Use this tool to find
              facilities near you.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs">
                  1
                </span>
                <span>Enter your location or allow location access</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs">
                  2
                </span>
                <span>Filter by the type of facility you need</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs">
                  3
                </span>
                <span>View details and contact information</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs">
                  4
                </span>
                <span>Get directions to the facility</span>
              </li>
            </ul>

            <div className="mt-6 rounded-md bg-blue-50 p-4 text-blue-800">
              <p className="text-sm font-medium">Emergency Services</p>
              <p className="text-xs">
                In case of a medical emergency, please call 911 immediately. This tool is not intended for emergency
                situations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

