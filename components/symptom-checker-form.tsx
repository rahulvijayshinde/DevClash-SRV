"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LoaderCircle, AlertTriangle, Download } from 'lucide-react'
import { sendMessageToGemini } from '@/lib/gemini'
import ReactMarkdown from 'react-markdown'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { getUserAppointments } from "@/lib/supabase"
import { useAuth } from "@/lib/AuthContext"

// Define a more flexible type for jsPDF to prevent TypeScript errors
type FlexibleJsPDF = {
  text: (text: string, x: number, y: number) => FlexibleJsPDF;
  setFontSize: (size: number) => FlexibleJsPDF;
  addPage: () => FlexibleJsPDF;
  splitTextToSize: (text: string, maxWidth: number) => string[];
  save: (filename: string) => FlexibleJsPDF;
  output: (type: string, options?: any) => any;
  [key: string]: any; // Allow any other property or method
};

// Simplified list of common symptoms
const COMMON_SYMPTOMS = {
  general: [
    { id: 'fever', label: 'Fever' },
    { id: 'fatigue', label: 'Fatigue or weakness' },
    { id: 'chills', label: 'Chills' },
  ],
  head: [
    { id: 'headache', label: 'Headache' },
    { id: 'dizziness', label: 'Dizziness' },
  ],
  respiratory: [
    { id: 'cough', label: 'Cough' },
    { id: 'shortness', label: 'Shortness of breath' },
    { id: 'sorethroat', label: 'Sore throat' },
  ],
  digestive: [
    { id: 'nausea', label: 'Nausea' },
    { id: 'vomiting', label: 'Vomiting' },
    { id: 'diarrhea', label: 'Diarrhea' },
    { id: 'abdominalpain', label: 'Abdominal pain' },
  ],
  pain: [
    { id: 'musclepain', label: 'Muscle pain' },
    { id: 'jointpain', label: 'Joint pain' },
    { id: 'chestpain', label: 'Chest pain' },
    { id: 'backpain', label: 'Back pain' },
  ],
  skin: [
    { id: 'rash', label: 'Rash' },
    { id: 'itching', label: 'Itching' },
  ],
  other: [
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'depression', label: 'Depression' },
    { id: 'sleep', label: 'Sleep problems' },
    { id: 'appetite', label: 'Loss of appetite' },
  ],
};

// Create a validation schema using zod
const formSchema = z.object({
  age: z.string()
    .refine(value => value.trim() !== '', { message: "Age is required" })
    .refine(value => {
      const age = parseInt(value);
      return !isNaN(age) && age > 0 && age <= 100;
    }, { message: "Age must be between 1 and 100" }),
  gender: z.string().optional(),
  painLevel: z.number().min(0).max(10),
  durationValue: z.number().min(1, { message: "Duration must be at least 1" }),
  duration: z.string(),
  additionalInfo: z.string().optional(),
  // We'll validate symptoms selection separately since it's not a direct form field
});

// Define the appointment type
type Appointment = {
  id: string;
  specialist_type: string;
  specialist_name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  notes?: string;
  status: string;
  created_at: string;
};

export function SymptomCheckerForm() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generatingPdf, setGeneratingPdf] = useState<boolean>(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const { user } = useAuth()

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: '',
      gender: '',
      painLevel: 0,
      durationValue: 1,
      duration: 'days',
      additionalInfo: '',
    },
  });

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms(prev => [...prev, symptomId])
    } else {
      setSelectedSymptoms(prev => prev.filter(id => id !== symptomId))
    }
  }

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // First validate symptom selection
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Get the full text labels of the selected symptoms
    const symptomLabels = selectedSymptoms.map(id => {
      for (const category in COMMON_SYMPTOMS) {
        const symptom = COMMON_SYMPTOMS[category as keyof typeof COMMON_SYMPTOMS].find(s => s.id === id)
        if (symptom) return symptom.label
      }
      return id // Fallback to ID if label not found
    })

    // Format the query for Gemini with the new requested format
    const query = `
      I need a preliminary analysis of the following symptoms:
      
      Symptoms: ${symptomLabels.join(', ')}
      Pain Level (1-10): ${values.painLevel}
      Duration: ${values.durationValue} ${values.duration}
      Age: ${values.age}
      Gender: ${values.gender || 'Not specified'}
      Additional Information: ${values.additionalInfo || 'None provided'}
      
      Please provide your response in the following format:
      
      1. First, provide a concise overview (approximately 60 words) of what these symptoms might indicate.
      
      2. Then, list 3-5 clear bullet points of recommended steps the person should take to address these symptoms.
      
      3. Finally, clearly state one of the following:
         * "URGENT: Seek immediate medical attention" - if these symptoms indicate a potential emergency
         * "CONSULT: See a healthcare provider soon" - if medical consultation is advised but not urgent
         * "SELF-CARE: Can be managed at home" - if the symptoms can likely be addressed with self-care
      
      Format as markdown with clear sections. Be direct and practical in your recommendations.
      
      Important: State clearly that this is only a preliminary assessment and not a medical diagnosis.
    `;

    try {
      const geminiResponse = await sendMessageToGemini(query, []);
      setResult(geminiResponse);
    } catch (err) {
      console.error('Error getting analysis:', err);
      setError('Failed to analyze symptoms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSymptoms([]);
    form.reset();
    setResult(null);
    setError(null);
  }

  // The downloadReport function uses the form values
  const downloadReport = async () => {
    setGeneratingPdf(true);
    try {
      // Import jsPDF
      const { default: jsPDF } = await import('jspdf');
      
      // Create PDF instance with type assertion to avoid TypeScript errors
      const doc = new jsPDF() as any;
      
      // Get current form values
      const values = form.getValues();
      
      // Set initial positions
      let y = 20;
      const margin = 20;
      
      // Add title
      doc.setFontSize(16);
      doc.text("SYMPTOM CHECKER REPORT", margin, y);
      y += 10;
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, y);
      y += 15;
      
      // Add patient information
      doc.setFontSize(12);
      doc.text("PATIENT INFORMATION", margin, y);
      y += 7;
      doc.setFontSize(10);
      doc.text(`Age: ${values.age || 'Not specified'}`, margin, y);
      y += 7;
      doc.text(`Gender: ${values.gender || 'Not specified'}`, margin, y);
      y += 7;
      doc.text(`Pain Level: ${values.painLevel}/10`, margin, y);
      y += 7;
      doc.text(`Duration: ${values.durationValue} ${values.duration}`, margin, y);
      y += 15;
      
      // Add symptoms
      doc.setFontSize(12);
      doc.text("REPORTED SYMPTOMS", margin, y);
      y += 7;
      doc.setFontSize(10);
      
      if (selectedSymptoms && selectedSymptoms.length > 0) {
        selectedSymptoms.forEach(symptomId => {
          for (const category in COMMON_SYMPTOMS) {
            const categorySymptoms = COMMON_SYMPTOMS[category as keyof typeof COMMON_SYMPTOMS];
            const symptom = categorySymptoms.find(s => s.id === symptomId);
            if (symptom) {
              if (y > 270) {
                doc.addPage();
                y = 20;
              }
              doc.text(`• ${symptom.label}`, margin, y);
              y += 7;
              break;
            }
          }
        });
      } else {
        doc.text("No symptoms selected", margin, y);
        y += 7;
      }
      y += 10;
      
      // Add additional notes
      if (values.additionalInfo && values.additionalInfo.trim() !== '') {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFontSize(12);
        doc.text("ADDITIONAL NOTES", margin, y);
        y += 7;
        doc.setFontSize(10);
        
        try {
          const infoLines = doc.splitTextToSize(values.additionalInfo, 170);
          doc.text(infoLines, margin, y);
          y += (infoLines.length * 7) + 10;
        } catch (textError) {
          console.error('Error adding additional notes:', textError);
          doc.text("Additional notes available in the app", margin, y);
          y += 7;
        }
      }
      
      // Add AI analysis
      if (result) {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFontSize(12);
        doc.text("ANALYSIS", margin, y);
        y += 7;
        doc.setFontSize(10);
        
        try {
          // Clean the result text (remove markdown)
          const cleanResult = result.replace(/#+\s/g, '').replace(/\*\*/g, '').replace(/`/g, '');
          const resultLines = doc.splitTextToSize(cleanResult, 170);
          doc.text(resultLines, margin, y);
        } catch (textError) {
          console.error('Error adding analysis to PDF:', textError);
          doc.text("Analysis available in the app", margin, y);
        }
      }
      
      // Add disclaimer on the last page
      doc.setFontSize(8);
      doc.text("DISCLAIMER: This is a preliminary assessment only and not a medical diagnosis.", margin, 280);
      doc.text("Please consult with a healthcare professional for proper diagnosis and treatment.", margin, 285);
      
      // Save the PDF
      try {
        doc.save("symptom-checker-report.pdf");
      } catch (err) {
        console.error("Error saving PDF:", err);
        
        // Create a download link as fallback
        try {
          // Get base64 encoded PDF
          const pdfData = doc.output('datauristring');
          
          // Create a link to download it
          const link = document.createElement('a');
          link.href = pdfData;
          link.download = "symptom-checker-report.pdf";
          link.click();
        } catch (fallbackErr) {
          console.error("Fallback download failed:", fallbackErr);
          throw new Error("Could not generate PDF download");
        }
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const requestVideoCall = () => {
    // Generate a random meet ID
    const meetId = Math.random().toString(36).substring(2, 12);
    
    // Open the Google Meet link directly
    window.open(`https://meet.google.com/${meetId}`, '_blank');
  };

  useEffect(() => {
    async function fetchAppointments() {
      if (!user || !user.id) {
        setError("You must be logged in to view appointments");
        setLoading(false);
        return;
      }

      try {
        const { appointments: data, error } = await getUserAppointments(user.id);
        
        if (error) {
          throw new Error(error);
        }

        setAppointments(data || []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err instanceof Error ? err.message : "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [user]);

  // If we have results, show them instead of the form
  if (result) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Symptom Analysis Results</CardTitle>
          <CardDescription>
            This is a preliminary assessment based on the symptoms you provided.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-amber-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Disclaimer</AlertTitle>
            <AlertDescription>
              This is not a medical diagnosis. Always consult with a healthcare professional.
            </AlertDescription>
          </Alert>
          <ScrollArea className="h-[50vh] rounded-md border p-4">
            <div className="prose max-w-none dark:prose-invert">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button onClick={resetForm} className="flex-1">
            Check Different Symptoms
          </Button>
          <Button 
            onClick={downloadReport} 
            variant="outline" 
            className="flex-1 gap-2"
            disabled={generatingPdf}
          >
            {generatingPdf ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF Report
              </>
            )}
          </Button>
        </CardFooter>
        
        {/* Video Call Button Section */}
        <div className="px-6 pb-6">
          <Separator className="my-4" />
          <div className="flex flex-col items-center space-y-3">
            <h3 className="text-lg font-medium">Need to speak with a doctor?</h3>
            <p className="text-sm text-muted-foreground text-center">
              Start a video consultation to discuss your symptoms with a healthcare professional.
            </p>
            <Button 
              onClick={requestVideoCall} 
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z" />
                <path d="m15 8-5 3 5 3V8Z" />
              </svg>
              Request Video Call
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              A new Google Meet link will open in a new tab.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Symptom Checker</CardTitle>
        <CardDescription>
          Select the symptoms you're experiencing for a preliminary assessment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          placeholder="Your age (required)"
                          {...field}
                        />
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
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex gap-4 pt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="painLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pain Level (0-10)</FormLabel>
                    <FormControl>
                      <div className="pt-4">
                        <Slider
                          value={[field.value]}
                          min={0}
                          max={10}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>No Pain (0)</span>
                          <span>Moderate (5)</span>
                          <span>Severe (10)</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="durationValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Unit</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label className="mb-2 block">Symptoms (select at least one)</Label>
                {selectedSymptoms.length === 0 && (
                  <p className="text-sm text-red-500 mb-2">Please select at least one symptom</p>
                )}
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-6">
                    {Object.entries(COMMON_SYMPTOMS).map(([category, symptoms]) => (
                      <div key={category} className="space-y-2">
                        <h3 className="font-medium capitalize">{category}</h3>
                        <div className="grid gap-2 md:grid-cols-2">
                          {symptoms.map((symptom) => (
                            <div key={symptom.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={symptom.id}
                                checked={selectedSymptoms.includes(symptom.id)}
                                onCheckedChange={(checked) => 
                                  handleSymptomChange(symptom.id, checked === true)
                                }
                              />
                              <Label htmlFor={symptom.id} className="text-sm">
                                {symptom.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe any other symptoms or relevant health information..."
                        className="mt-1"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || selectedSymptoms.length === 0}>
              {loading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Symptoms...
                </>
              ) : (
                'Analyze Symptoms'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col space-y-2">
        <div className="text-xs text-muted-foreground">
          <strong>Disclaimer:</strong> This tool provides a preliminary assessment only and is not a replacement for professional medical advice, diagnosis, or treatment.
        </div>
      </CardFooter>
    </Card>
  )
}

