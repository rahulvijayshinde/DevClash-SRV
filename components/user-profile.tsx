"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Edit, Eye, Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
})

const medicalFormSchema = z.object({
  allergies: z.string().optional(),
  medications: z.string().optional(),
  conditions: z.string().optional(),
  surgeries: z.string().optional(),
  familyHistory: z.string().optional(),
  bloodType: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
})

const securityFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function UserProfile() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingMedical, setIsSubmittingMedical] = useState(false);
  const [isSubmittingSecurity, setIsSubmittingSecurity] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      dateOfBirth: "1985-06-15",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      emergencyContactName: "Jane Doe",
      emergencyContactPhone: "(555) 987-6543",
    },
  });
  
  const medicalForm = useForm<z.infer<typeof medicalFormSchema>>({
    resolver: zodResolver(medicalFormSchema),
    defaultValues: {
      allergies: "Penicillin, Peanuts",
      medications: "Lisinopril 10mg daily, Metformin 500mg twice daily",
      conditions: "Type 2 Diabetes, Hypertension",
      surgeries: "Appendectomy (2010)",
      familyHistory: "Father: Heart disease, Mother: Diabetes",
      bloodType: "O+",
      height: "5'10\"",
      weight: "175 lbs",
    },
  });
  
  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  function onSubmitProfile(values: z.infer<typeof profileFormSchema>) {
    setIsSubmittingProfile(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingProfile(false);
      setIsEditingProfile(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  }
  
  function onSubmitMedical(values: z.infer<typeof medicalFormSchema>) {
    setIsSubmittingMedical(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingMedical(false);
      setIsEditingMedical(false);
      
      toast({
        title: "Medical Information Updated",
        description: "Your medical information has been updated successfully.",
      });
    }, 1000);
  }
  
  function onSubmitSecurity(values: z.infer<typeof securityFormSchema>) {
    setIsSubmittingSecurity(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingSecurity(false);
      securityForm.reset();
      
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      });
    }, 1000);
  }
  
  return (
    <Tabs defaultValue="profile">
      <TabsList className="mb-4">
        <TabsTrigger value="profile">Personal Information</TabsTrigger>
        <TabsTrigger value="medical">Medical Information</TabsTrigger>
        <TabsTrigger value="security">Security & Privacy</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your personal details</CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                disabled={isSubmittingProfile}
              >
                {isEditingProfile ? (
                  <>
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </>
                ) : (
                  <>
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                {isEditingProfile ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={profileForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Address</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={profileForm.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Emergency Contact</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={profileForm.control}
                          name="emergencyContactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="emergencyContactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingProfile(false)}
                        disabled={isSubmittingProfile}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmittingProfile}>
                        {isSubmittingProfile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="mb-2 text-sm font-medium">Personal Details</h3>
                        <dl className="grid gap-2">
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Name:</dt>
                            <dd className="text-sm font-medium">{profileForm.getValues("firstName")} {profileForm.getValues("lastName")}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Email:</dt>
                            <dd className="text-sm font-medium">{profileForm.getValues("email")}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Phone:</dt>
                            <dd className="text-sm font-medium">{profileForm.getValues("phone")}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Date of Birth:</dt>
                            <dd className="text-sm font-medium">{new Date(profileForm.getValues("dateOfBirth")).toLocaleDateString()}</dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h3 className="mb-2 text-sm font-medium">Address</h3>
                        <dl className="grid gap-2">
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Street:</dt>
                            <dd className="text-sm font-medium">{profileForm.getValues("address")}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">City:</dt>
                            <dd className="text-sm font-medium">{profileForm.getValues("city")}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">State:</dt>
                            <dd className="text-sm font-medium">{profileForm.getValues("state")}</dd>
                          </div>
                          <div className="flex justify-between">\

