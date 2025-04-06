import { SymptomCheckerForm } from "@/components/symptom-checker-form"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SymptomCheckerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">AI Symptom Checker</h1>
        <p className="text-muted-foreground">Check your symptoms and get a preliminary assessment</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <SymptomCheckerForm />
        </div>

        <div className="space-y-6">
          <Alert variant="destructive" className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800">Important Disclaimer</AlertTitle>
            <AlertDescription className="text-amber-700">
              This AI symptom checker provides a preliminary assessment only and is not a replacement for professional 
              medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for proper 
              evaluation.
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">How It Works</h2>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                  1
                </div>
                <p>Select your symptoms from the comprehensive list</p>
              </li>
              <li className="flex gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                  2
                </div>
                <p>Provide additional health information and symptom details</p>
              </li>
              <li className="flex gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                  3
                </div>
                <p>Our AI analyzes your symptoms using Google's Gemini AI model</p>
              </li>
              <li className="flex gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                  4
                </div>
                <p>Review your assessment including possible conditions and recommendations</p>
              </li>
              <li className="flex gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                  5
                </div>
                <p>For proper diagnosis, consult with a healthcare provider via our telemedicine platform</p>
              </li>
            </ol>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">What To Expect</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              The symptom checker provides:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Possible conditions based on your symptoms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Urgency level assessment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Brief explanation of each possible condition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Recommended next steps</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

