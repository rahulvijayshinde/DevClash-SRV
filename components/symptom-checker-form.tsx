"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const formSchema = z.object({
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  symptoms: z.string().min(5, "Please describe your symptoms in more detail"),
  duration: z.string().min(1, "Duration is required"),
  severity: z.string().min(1, "Severity is required"),
  medicalHistory: z.string().optional(),
  medications: z.string().optional(),
})

export function SymptomCheckerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<null | {
    diagnosis: string
    riskLevel: "low" | "medium" | "high"
    recommendations: string[]
  }>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      gender: "",
      symptoms: "",
      duration: "",
      severity: "",
      medicalHistory: "",
      medications: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)

      // Mock result based on symptoms
      const symptomsLower = values.symptoms.toLowerCase()
      let riskLevel: "low" | "medium" | "high" = "low"
      let diagnosis = "Common cold or seasonal allergies"
      let recommendations = [
        "Rest and stay hydrated",
        "Over-the-counter medications may help relieve symptoms",
        "Monitor your symptoms for any changes",
      ]

      if (symptomsLower.includes("chest pain") || symptomsLower.includes("difficulty breathing")) {
        riskLevel = "high"
        diagnosis = "Possible respiratory condition or cardiac issue"
        recommendations = [
          "Seek immediate medical attention",
          "Schedule a teleconsultation as soon as possible",
          "Do not drive yourself to the hospital if experiencing severe chest pain",
        ]
      } else if (
        symptomsLower.includes("fever") ||
        symptomsLower.includes("headache") ||
        symptomsLower.includes("cough")
      ) {
        riskLevel = "medium"
        diagnosis = "Possible viral infection"
        recommendations = [
          "Rest and stay hydrated",
          "Schedule a teleconsultation within 24 hours",
          "Monitor your temperature and symptoms",
          "Take over-the-counter fever reducers as directed",
        ]
      }

      setResult({
        diagnosis,
        riskLevel,
        recommendations,
      })
    }, 2000)
  }

  return (
    <div>
      {!result ? (
        <Card>
          <CardHeader>
            <CardTitle>Symptom Assessment</CardTitle>
            <CardDescription>Please provide information about your symptoms and health history</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter your age" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptoms</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your symptoms in detail" className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormDescription>
                        Include when they started, any triggers, and how they affect you
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                            <SelectItem value="years">Years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Severity</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-1"
                          >
                            <FormItem className="flex items-center space-x-1 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="mild" />
                              </FormControl>
                              <FormLabel className="font-normal">Mild</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-1 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="moderate" />
                              </FormControl>
                              <FormLabel className="font-normal">Moderate</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-1 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="severe" />
                              </FormControl>
                              <FormLabel className="font-normal">Severe</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="medicalHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical History (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List any relevant medical conditions" {...field} />
                      </FormControl>
                      <FormDescription>Include chronic conditions, surgeries, or allergies</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Medications (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List any medications you are currently taking" {...field} />
                      </FormControl>
                      <FormDescription>Include dosage and frequency if known</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    "Submit Assessment"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Assessment Results</CardTitle>
            <CardDescription>
              Based on the information you provided, here is your preliminary assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-medium">Preliminary Diagnosis</h3>
              <p>{result.diagnosis}</p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium">Risk Level</h3>
              <div className="flex items-center gap-2">
                {result.riskLevel === "low" && (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-700">Low Risk</span>
                  </>
                )}
                {result.riskLevel === "medium" && (
                  <>
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span className="font-medium text-amber-700">Medium Risk</span>
                  </>
                )}
                {result.riskLevel === "high" && (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span className="font-medium text-red-700">High Risk</span>
                  </>
                )}
              </div>
              <div className="mt-2">
                <Progress
                  value={result.riskLevel === "low" ? 25 : result.riskLevel === "medium" ? 50 : 90}
                  className={`h-2 ${
                    result.riskLevel === "low"
                      ? "bg-green-100"
                      : result.riskLevel === "medium"
                        ? "bg-amber-100"
                        : "bg-red-100"
                  }`}
                  indicatorClassName={
                    result.riskLevel === "low"
                      ? "bg-green-500"
                      : result.riskLevel === "medium"
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }
                />
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-medium">Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs">
                      {index + 1}
                    </span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md bg-blue-50 p-4 text-blue-800">
              <p className="text-sm font-medium">Next Steps</p>
              <p className="text-xs">
                This is a preliminary assessment only. For a complete diagnosis and treatment plan, please book a
                teleconsultation with one of our healthcare providers.
              </p>
              <Button className="mt-2 h-8 bg-blue-600 text-xs hover:bg-blue-700">Book Teleconsultation</Button>
            </div>

            <Button variant="outline" onClick={() => setResult(null)} className="w-full">
              Start New Assessment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

