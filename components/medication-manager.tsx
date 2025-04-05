"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { Bell, Check, Clock, Loader2, MoreHorizontal, PillIcon, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

const medicationFormSchema = z.object({
  name: z.string().min(2, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  time: z.string().min(1, "Time is required"),
  instructions: z.string().optional(),
  reminders: z.boolean().default(true),
})

type Medication = z.infer<typeof medicationFormSchema> & {
  id: string
  adherence: number
  history: {
    date: string
    taken: boolean
  }[]
}

// Sample data
const initialMedications: Medication[] = [
  {
    id: "med1",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "daily",
    time: "morning",
    instructions: "Take with food",
    reminders: true,
    adherence: 85,
    history: [
      { date: format(new Date(new Date().setDate(new Date().getDate() - 3)), "yyyy-MM-dd"), taken: true },
      { date: format(new Date(new Date().setDate(new Date().getDate() - 2)), "yyyy-MM-dd"), taken: true },
      { date: format(new Date(new Date().setDate(new Date().getDate() - 1)), "yyyy-MM-dd"), taken: false },
      { date: format(new Date(), "yyyy-MM-dd"), taken: true },
    ],
  },
  {
    id: "med2",
    name: "Metformin",
    dosage: "500mg",
    frequency: "twice-daily",
    time: "morning-evening",
    instructions: "Take with meals",
    reminders: true,
    adherence: 92,
    history: [
      { date: format(new Date(new Date().setDate(new Date().getDate() - 3)), "yyyy-MM-dd"), taken: true },
      { date: format(new Date(new Date().setDate(new Date().getDate() - 2)), "yyyy-MM-dd"), taken: true },
      { date: format(new Date(new Date().setDate(new Date().getDate() - 1)), "yyyy-MM-dd"), taken: true },
      { date: format(new Date(), "yyyy-MM-dd"), taken: true },
    ],
  },
  {
    id: "med3",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "daily",
    time: "evening",
    instructions: "Take at bedtime",
    reminders: true,
    adherence: 78,
    history: [
      { date: format(new Date(new Date().setDate(new Date().getDate() - 3)), "yyyy-MM-dd"), taken: true },
      { date: format(new Date(new Date().setDate(new Date().getDate() - 2)), "yyyy-MM-dd"), taken: false },
      { date: format(new Date(new Date().setDate(new Date().getDate() - 1)), "yyyy-MM-dd"), taken: true },
      { date: format(new Date(), "yyyy-MM-dd"), taken: false },
    ],
  },
]

export function MedicationManager() {
  const [medications, setMedications] = useState<Medication[]>(initialMedications)
  const [isAddingMedication, setIsAddingMedication] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof medicationFormSchema>>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "daily",
      time: "morning",
      instructions: "",
      reminders: true,
    },
  })

  function onSubmit(values: z.infer<typeof medicationFormSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newMedication: Medication = {
        id: `med${medications.length + 1}`,
        ...values,
        adherence: 100,
        history: [{ date: format(new Date(), "yyyy-MM-dd"), taken: false }],
      }

      setMedications([...medications, newMedication])
      setIsSubmitting(false)
      setIsAddingMedication(false)
      form.reset()

      toast({
        title: "Medication Added",
        description: `${values.name} has been added to your medication list.`,
      })
    }, 1000)
  }

  function markAsTaken(id: string, taken: boolean) {
    setMedications(
      medications.map((med) => {
        if (med.id === id) {
          const today = format(new Date(), "yyyy-MM-dd")
          const updatedHistory = [...med.history]
          const todayIndex = updatedHistory.findIndex((h) => h.date === today)

          if (todayIndex >= 0) {
            updatedHistory[todayIndex].taken = taken
          } else {
            updatedHistory.push({ date: today, taken })
          }

          // Recalculate adherence
          const takenCount = updatedHistory.filter((h) => h.taken).length
          const adherence = Math.round((takenCount / updatedHistory.length) * 100)

          return {
            ...med,
            history: updatedHistory,
            adherence,
          }
        }
        return med
      }),
    )

    toast({
      title: taken ? "Medication Taken" : "Medication Skipped",
      description: `Medication has been marked as ${taken ? "taken" : "skipped"}.`,
    })
  }

  function deleteMedication(id: string) {
    setMedications(medications.filter((med) => med.id !== id))

    toast({
      title: "Medication Deleted",
      description: "The medication has been removed from your list.",
    })
  }

  function toggleReminder(id: string) {
    setMedications(
      medications.map((med) => {
        if (med.id === id) {
          return {
            ...med,
            reminders: !med.reminders,
          }
        }
        return med
      }),
    )

    const medication = medications.find((med) => med.id === id)

    toast({
      title: medication?.reminders ? "Reminders Disabled" : "Reminders Enabled",
      description: `Reminders for ${medication?.name} have been ${medication?.reminders ? "disabled" : "enabled"}.`,
    })
  }

  return (
    <Tabs defaultValue="current">
      <TabsList className="mb-4">
        <TabsTrigger value="current">Current Medications</TabsTrigger>
        <TabsTrigger value="adherence">Adherence Tracker</TabsTrigger>
      </TabsList>

      <TabsContent value="current">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Medications</h2>
          <Dialog open={isAddingMedication} onOpenChange={setIsAddingMedication}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" /> Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>Enter the details of your medication to add it to your list.</DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter medication name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dosage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosage</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 10mg, 500mg, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Once Daily</SelectItem>
                              <SelectItem value="twice-daily">Twice Daily</SelectItem>
                              <SelectItem value="three-times-daily">Three Times Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="as-needed">As Needed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time of Day</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="morning">Morning</SelectItem>
                              <SelectItem value="afternoon">Afternoon</SelectItem>
                              <SelectItem value="evening">Evening</SelectItem>
                              <SelectItem value="bedtime">Bedtime</SelectItem>
                              <SelectItem value="morning-evening">Morning & Evening</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Take with food, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Enable Reminders</FormLabel>
                          <FormDescription>
                            Receive notifications when it's time to take this medication
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddingMedication(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Medication"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {medications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <PillIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-lg font-medium">No Medications</h3>
                <p className="mb-4 text-center text-sm text-muted-foreground">
                  You haven't added any medications yet. Click the button below to add your first medication.
                </p>
                <Button onClick={() => setIsAddingMedication(true)}>
                  <Plus className="mr-1 h-4 w-4" /> Add Medication
                </Button>
              </CardContent>
            </Card>
          ) : (
            medications.map((medication) => (
              <Card key={medication.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          medication.adherence >= 90
                            ? "bg-green-100 text-green-700"
                            : medication.adherence >= 70
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        <PillIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{medication.name}</CardTitle>
                        <CardDescription>{medication.dosage}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleReminder(medication.id)}>
                          {medication.reminders ? "Disable Reminders" : "Enable Reminders"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteMedication(medication.id)} className="text-red-600">
                          Delete Medication
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Frequency:</span>{" "}
                      <span className="font-medium">
                        {medication.frequency === "daily"
                          ? "Once Daily"
                          : medication.frequency === "twice-daily"
                            ? "Twice Daily"
                            : medication.frequency === "three-times-daily"
                              ? "Three Times Daily"
                              : medication.frequency === "weekly"
                                ? "Weekly"
                                : "As Needed"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>{" "}
                      <span className="font-medium">
                        {medication.time === "morning"
                          ? "Morning"
                          : medication.time === "afternoon"
                            ? "Afternoon"
                            : medication.time === "evening"
                              ? "Evening"
                              : medication.time === "bedtime"
                                ? "Bedtime"
                                : "Morning & Evening"}
                      </span>
                    </div>
                    {medication.instructions && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Instructions:</span>{" "}
                        <span className="font-medium">{medication.instructions}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Today's Status:</span>
                    </div>
                    <Badge
                      variant={
                        medication.history.find((h) => h.date === format(new Date(), "yyyy-MM-dd"))?.taken
                          ? "success"
                          : "outline"
                      }
                    >
                      {medication.history.find((h) => h.date === format(new Date(), "yyyy-MM-dd"))?.taken
                        ? "Taken"
                        : "Not Taken"}
                    </Badge>
                  </div>

                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Reminders:</span>
                    </div>
                    <Badge variant={medication.reminders ? "default" : "outline"}>
                      {medication.reminders ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsTaken(medication.id, false)}
                    disabled={
                      medication.history.find((h) => h.date === format(new Date(), "yyyy-MM-dd"))?.taken === false
                    }
                  >
                    <X className="mr-1 h-4 w-4" /> Skip
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => markAsTaken(medication.id, true)}
                    disabled={
                      medication.history.find((h) => h.date === format(new Date(), "yyyy-MM-dd"))?.taken === true
                    }
                  >
                    <Check className="mr-1 h-4 w-4" /> Mark as Taken
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="adherence">
        <Card>
          <CardHeader>
            <CardTitle>Medication Adherence Tracker</CardTitle>
            <CardDescription>Track how consistently you're taking your medications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {medications.map((medication) => (
                <div key={medication.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{medication.name}</div>
                    <div className="text-sm text-muted-foreground">{medication.adherence}% adherence</div>
                  </div>
                  <Progress
                    value={medication.adherence}
                    className="h-2"
                    indicatorClassName={
                      medication.adherence >= 90
                        ? "bg-green-500"
                        : medication.adherence >= 70
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>Last 7 days:</div>
                    <div className="flex gap-1">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const date = format(new Date(new Date().setDate(new Date().getDate() - (6 - i))), "yyyy-MM-dd")
                        const dayRecord = medication.history.find((h) => h.date === date)
                        return (
                          <div
                            key={i}
                            className={`h-4 w-4 rounded-sm ${
                              !dayRecord ? "bg-gray-100" : dayRecord.taken ? "bg-green-100" : "bg-red-100"
                            }`}
                            title={`${format(new Date(date), "MMM d")}: ${
                              !dayRecord ? "No record" : dayRecord.taken ? "Taken" : "Missed"
                            }`}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {medications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <PillIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-lg font-medium">No Medications</h3>
                  <p className="mb-4 text-center text-sm text-muted-foreground">
                    Add medications to track your adherence.
                  </p>
                  <Button onClick={() => setIsAddingMedication(true)}>
                    <Plus className="mr-1 h-4 w-4" /> Add Medication
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

