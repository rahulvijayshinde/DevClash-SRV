import { User } from "lucide-react"
import { UserProfile } from "@/components/user-profile"

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Patient Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and health records</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <UserProfile />
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <User className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Profile Security</h2>
            <p className="mb-4 text-muted-foreground">
              Your health information is private and secure. We use industry-standard encryption to protect your data.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">
                  1
                </span>
                <span>Keep your login credentials secure</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">
                  2
                </span>
                <span>Enable two-factor authentication for added security</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">
                  3
                </span>
                <span>Regularly review your account activity</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">
                  4
                </span>
                <span>Log out when using shared devices</span>
              </li>
            </ul>

            <div className="mt-6 rounded-md bg-blue-50 p-4 text-blue-800">
              <p className="text-sm font-medium">Data Privacy</p>
              <p className="text-xs">
                Your health data is only shared with healthcare providers you authorize. You can revoke access at any
                time from your privacy settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

