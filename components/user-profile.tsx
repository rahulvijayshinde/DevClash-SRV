"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Edit, Eye, Loader2, Save, User } from "lucide-react"
import { supabase, getLocalUser, updateUserProfile, updateUserPassword } from "@/lib/supabase"
import { createHash } from "crypto"

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
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
  });
  
  const medicalForm = useForm<z.infer<typeof medicalFormSchema>>({
    resolver: zodResolver(medicalFormSchema),
    defaultValues: {
      allergies: "",
      medications: "",
      conditions: "",
      surgeries: "",
      familyHistory: "",
      bloodType: "",
      height: "",
      weight: "",
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
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get the current user from localStorage or use a default
        const currentUser = getLocalUser();
        
        if (currentUser) {
          console.log('User found:', currentUser.id);
          
          // Map the user data to form field names
          const formData = {
            firstName: currentUser.full_name ? currentUser.full_name.split(' ')[0] : '',
            lastName: currentUser.full_name ? currentUser.full_name.split(' ').slice(1).join(' ') : '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
            dateOfBirth: currentUser.date_of_birth || '',
            address: currentUser.address || '',
            city: currentUser.city || '',
            state: currentUser.state || '',
            zipCode: currentUser.zip_code || '',
            emergencyContactName: currentUser.emergency_contact_name || '',
            emergencyContactPhone: currentUser.emergency_contact_phone || '',
          };
          
          profileForm.reset(formData);
          
          // Load medical data directly from the user record
          medicalForm.reset({
            allergies: currentUser.allergies || '',
            medications: currentUser.medications || '',
            conditions: currentUser.conditions || '',
            surgeries: currentUser.surgeries || '',
            familyHistory: currentUser.family_history || '',
            bloodType: currentUser.blood_type || '',
            height: currentUser.height || '',
            weight: currentUser.weight || '',
          });
        } else {
          // Just initialize with empty form
          profileForm.reset({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            emergencyContactName: "",
            emergencyContactPhone: "",
          });
          
          medicalForm.reset({
            allergies: "",
            medications: "",
            conditions: "",
            surgeries: "",
            familyHistory: "",
            bloodType: "",
            height: "",
            weight: "",
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Just silently fail - no need to show error
      }
    };

    fetchUserProfile();
  }, [profileForm, medicalForm]);

  const loadProfileByEmail = async (email: string) => {
    try {
      if (!email) {
        toast({
          title: "Email Required",
          description: "Please enter an email address to load a profile",
          variant: "destructive",
        });
        return;
      }
      
      // Find user by email in our custom users table
      const { data, error } = await supabase
        .from('custom_users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) {
        console.error('Error finding user:', error);
        toast({
          title: "User Not Found",
          description: "No user with that email address was found",
          variant: "destructive",
        });
        return;
      }
      
      if (data) {
        // Map the user data to form field names
        const formData = {
          firstName: data.full_name ? data.full_name.split(' ')[0] : '',
          lastName: data.full_name ? data.full_name.split(' ').slice(1).join(' ') : '',
          email: data.email || '',
          phone: data.phone || '',
          dateOfBirth: data.date_of_birth || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zip_code || '',
          emergencyContactName: data.emergency_contact_name || '',
          emergencyContactPhone: data.emergency_contact_phone || '',
        };
        
        profileForm.reset(formData);
        toast({
          title: "Profile Loaded",
          description: "User profile has been loaded successfully",
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };
  
  async function onSubmitProfile(values: z.infer<typeof profileFormSchema>) {
    setIsSubmittingProfile(true);
    
    try {
      console.log('Submitting profile data:', values);
      
      // Get current user from localStorage or use a fallback
      const currentUser = getLocalUser() || { id: 'default-user', email: values.email };
      console.log('Current user:', currentUser);
      
      // Update the user profile
      const { user, error } = await updateUserProfile(currentUser.id, {
        email: values.email,
        full_name: values.firstName + ' ' + values.lastName,
        phone: values.phone,
        date_of_birth: values.dateOfBirth,
        address: values.address,
        city: values.city,
        state: values.state,
        zip_code: values.zipCode,
        emergency_contact_name: values.emergencyContactName,
        emergency_contact_phone: values.emergencyContactPhone
      });

      if (error) {
        console.error('Error from updateUserProfile:', error);
        throw new Error(error);
      }

      console.log('Profile updated successfully:', user);
      setIsSubmittingProfile(false);
      setIsEditingProfile(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsSubmittingProfile(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  }
  
  async function onSubmitMedical(values: z.infer<typeof medicalFormSchema>) {
    setIsSubmittingMedical(true);
    
    try {
      console.log('Submitting medical data:', values);
      
      // Get current user from localStorage or use a fallback
      const currentUser = getLocalUser() || { id: 'default-user', email: profileForm.getValues('email') };
      console.log('Current user for medical update:', currentUser);
      
      // Update the medical information using the same updateUserProfile function
      const { user, error } = await updateUserProfile(currentUser.id, {
        allergies: values.allergies || null,
        medications: values.medications || null,
        conditions: values.conditions || null,
        surgeries: values.surgeries || null,
        family_history: values.familyHistory || null,
        blood_type: values.bloodType || null,
        height: values.height || null,
        weight: values.weight || null
      });

      if (error) {
        console.error('Error from updateUserProfile for medical info:', error);
        throw new Error(error);
      }

      console.log('Medical information updated successfully:', user);
      setIsSubmittingMedical(false);
      setIsEditingMedical(false);
      
      toast({
        title: "Medical Information Updated",
        description: "Your medical information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating medical information:', error);
      setIsSubmittingMedical(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update medical information",
        variant: "destructive",
      });
    }
  }
  
  async function onSubmitSecurity(values: z.infer<typeof securityFormSchema>) {
    setIsSubmittingSecurity(true);
    
    try {
      // Get current user from localStorage
      const currentUser = getLocalUser();
      
      if (!currentUser) {
        throw new Error('You must be logged in to change your password');
      }
      
      // Use the updateUserPassword function
      const { success, error } = await updateUserPassword(
        currentUser.id,
        values.currentPassword,
        values.newPassword
      );
      
      if (error) {
        throw new Error(error);
      }
      
      if (!success) {
        throw new Error('Failed to update password');
      }
      
      setIsSubmittingSecurity(false);
      securityForm.reset();
      
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setIsSubmittingSecurity(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      });
    }
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
                <User className="h-10 w-10 text-gray-500" />
                <div>
                  <CardTitle>{profileForm.getValues("firstName")} {profileForm.getValues("lastName")}</CardTitle>
                  <CardDescription>Personal Information</CardDescription>
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
                            <div className="flex items-center gap-2">
                              <FormControl className="flex-1">
                                <Input 
                                  type="email" 
                                  {...field} 
                                  onChange={(e) => {
                                    field.onChange(e);
                                    localStorage.setItem('userEmail', e.target.value);
                                  }}
                                />
                              </FormControl>
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => loadProfileByEmail(field.value)}
                              >
                                Load Profile
                              </Button>
                            </div>
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
                            <dd className="text-sm font-medium">
                              {profileForm.getValues("dateOfBirth") ? 
                                new Date(profileForm.getValues("dateOfBirth")).toLocaleDateString() : 
                                "Not specified"}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h3 className="mb-2 text-sm font-medium">Address</h3>
                        <dl className="grid gap-2">
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Street:</dt>
                            <dd className="text-sm font-medium">{profileForm.getValues("address") || "Not specified"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">City:</dt>
                            <dd className="text-sm font-medium">{profileForm.getValues("city") || "Not specified"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">State:</dt>
                            <dd className="text-sm font-medium">{profileForm.getValues("state") || "Not specified"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">ZIP Code:</dt>
                            <dd className="text-sm font-medium">{profileForm.getValues("zipCode") || "Not specified"}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Emergency Contact</h3>
                      <dl className="grid gap-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Name:</dt>
                          <dd className="text-sm font-medium">{profileForm.getValues("emergencyContactName") || "Not specified"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Phone:</dt>
                          <dd className="text-sm font-medium">{profileForm.getValues("emergencyContactPhone") || "Not specified"}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="medical">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>Manage your medical details</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingMedical(!isEditingMedical)}
                disabled={isSubmittingMedical}
              >
                {isEditingMedical ? (
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
            <Form {...medicalForm}>
              <form onSubmit={medicalForm.handleSubmit(onSubmitMedical)} className="space-y-6">
                {isEditingMedical ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={medicalForm.control}
                        name="allergies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allergies</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicalForm.control}
                        name="medications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Medications</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicalForm.control}
                        name="conditions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medical Conditions</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicalForm.control}
                        name="surgeries"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Past Surgeries</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicalForm.control}
                        name="familyHistory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Family Medical History</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicalForm.control}
                        name="bloodType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Type</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicalForm.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={medicalForm.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingMedical(false)}
                        disabled={isSubmittingMedical}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmittingMedical}>
                        {isSubmittingMedical ? (
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
                        <h3 className="mb-2 text-sm font-medium">Health Information</h3>
                        <dl className="grid gap-2">
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Blood Type:</dt>
                            <dd className="text-sm font-medium">{medicalForm.getValues("bloodType") || "Not specified"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Height:</dt>
                            <dd className="text-sm font-medium">{medicalForm.getValues("height") || "Not specified"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Weight:</dt>
                            <dd className="text-sm font-medium">{medicalForm.getValues("weight") || "Not specified"}</dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h3 className="mb-2 text-sm font-medium">Medical History</h3>
                        <dl className="grid gap-2">
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Conditions:</dt>
                            <dd className="text-sm font-medium">{medicalForm.getValues("conditions") || "None"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Past Surgeries:</dt>
                            <dd className="text-sm font-medium">{medicalForm.getValues("surgeries") || "None"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Family History:</dt>
                            <dd className="text-sm font-medium">{medicalForm.getValues("familyHistory") || "None"}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Current Information</h3>
                      <dl className="grid gap-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Allergies:</dt>
                          <dd className="text-sm font-medium">{medicalForm.getValues("allergies") || "None"}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-muted-foreground">Medications:</dt>
                          <dd className="text-sm font-medium">{medicalForm.getValues("medications") || "None"}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security & Privacy</CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(onSubmitSecurity)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={securityForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showPassword"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    <label htmlFor="showPassword" className="text-sm">Show password</label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmittingSecurity}>
                    {isSubmittingSecurity ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}