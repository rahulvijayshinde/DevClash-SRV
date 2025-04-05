import { Stethoscope } from "lucide-react"
import { SymptomCheckerForm } from "@/components/symptom-checker-form"

export default function SymptomCheckerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">AI Symptom Checker</h1>
        <p className="text-muted-foreground">Get a preliminary assessment of your symptoms using our AI-powered tool</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <SymptomCheckerForm />
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">How It Works</h2>
            <p className="mb-4 text-muted-foreground">
              Our AI symptom checker uses advanced algorithms to analyze your symptoms and provide a preliminary
              assessment.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">
                  1
                </span>
                <span>Enter your symptoms and health information</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">
                  2
                </span>
                <span>Our AI analyzes your input</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">
                  3
                </span>
                <span>Receive a preliminary assessment</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">
                  4
                </span>
                <span>Get recommendations for next steps</span>
              </li>
            </ul>

            <div className="mt-6 rounded-md bg-amber-50 p-4 text-amber-800">
              <p className="text-sm font-medium">Medical Disclaimer</p>
              <p className="text-xs">
                This tool provides a preliminary assessment only and is not a substitute for professional medical
                advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health
                provider with any questions you may have regarding a medical condition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

