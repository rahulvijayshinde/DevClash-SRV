import type { Metadata } from "next"
import Link from "next/link"
import SignupForm from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
}

export default function SignupPage() {
  return (
    <div className="grid h-screen place-items-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create a new account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}

