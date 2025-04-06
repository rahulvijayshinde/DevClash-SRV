"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  MessageSquare,
  MoreHorizontal,
  Star,
  Video,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock data for doctors by category
const mockDoctors = {
  all: [
    {
      id: "doc1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.8,
      reviews: 124,
      experience: "12 years",
      availability: ["Mon", "Wed", "Fri"],
      availableSlots: 5,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    {
      id: "doc2",
      name: "Dr. Michael Chen",
      specialty: "Pediatrician",
      rating: 4.7,
      reviews: 98,
      experience: "8 years",
      availability: ["Tue", "Thu", "Sat"],
      availableSlots: 3,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    {
      id: "doc3",
      name: "Dr. James Wilson",
      specialty: "Surgeon",
      rating: 4.9,
      reviews: 156,
      experience: "15 years",
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      availableSlots: 7,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    {
      id: "doc4",
      name: "Dr. Emily Rodriguez",
      specialty: "Gynecologist",
      rating: 4.6,
      reviews: 87,
      experience: "10 years",
      availability: ["Mon", "Wed", "Fri"],
      availableSlots: 4,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    {
      id: "doc5",
      name: "Dr. Robert Smith",
      specialty: "Dentist",
      rating: 4.5,
      reviews: 76,
      experience: "7 years",
      availability: ["Tue", "Thu", "Sat"],
      availableSlots: 6,
      image: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    {
      id: "doc6",
      name: "Dr. Maria Garcia",
      specialty: "Dermatologist",
      rating: 4.8,
      reviews: 112,
      experience: "9 years",
      availability: ["Mon", "Wed", "Fri"],
      availableSlots: 2,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
  ],
  surgeon: [
    {
      id: "doc3",
      name: "Dr. James Wilson",
      specialty: "General Surgeon",
      rating: 4.9,
      reviews: 156,
      experience: "15 years",
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      availableSlots: 7,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    {
      id: "doc7",
      name: "Dr. Lisa Patel",
      specialty: "Neurosurgeon",
      rating: 4.9,
      reviews: 143,
      experience: "18 years",
      availability: ["Mon", "Wed", "Fri"],
      availableSlots: 3,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    {
      id: "doc8",
      name: "Dr. David Lee",
      specialty: "Orthopedic Surgeon",
      rating: 4.7,
      reviews: 92,
      experience: "11 years",
      availability: ["Tue", "Thu"],
      availableSlots: 4,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
  ],
  dentist: [
    {
      id: "doc5",
      name: "Dr. Robert Smith",
      specialty: "General Dentist",
      rating: 4.5,
      reviews: 76,
      experience: "7 years",
      availability: ["Tue", "Thu", "Sat"],
      availableSlots: 6,
      image: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    {
      id: "doc9",
      name: "Dr. Jennifer Wu",
      specialty: "Orthodontist",
      rating: 4.8,
      reviews: 104,
      experience: "9 years",
      availability: ["Mon", "Wed", "Fri"],
      availableSlots: 5,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
  ],
  gynecologist: [
    {
      id: "doc4",
      name: "Dr. Emily Rodriguez",
      specialty: "Gynecologist",
      rating: 4.6,
      reviews: 87,
      experience: "10 years",
      availability: ["Mon", "Wed", "Fri"],
      availableSlots: 4,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    {
      id: "doc10",
      name: "Dr. Jessica Brown",
      specialty: "Gynecologist",
      rating: 4.7,
      reviews: 95,
      experience: "12 years",
      availability: ["Tue", "Thu", "Sat"],
      availableSlots: 3,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
  ],
  cardiologist: [
    {
      id: "doc1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.8,
      reviews: 124,
      experience: "12 years",
      availability: ["Mon", "Wed", "Fri"],
      availableSlots: 5,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
  ],
  pediatrician: [
    {
      id: "doc2",
      name: "Dr. Michael Chen",
      specialty: "Pediatrician",
      rating: 4.7,
      reviews: 98,
      experience: "8 years",
      availability: ["Tue", "Thu", "Sat"],
      availableSlots: 3,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
  ],
  dermatologist: [
    {
      id: "doc6",
      name: "Dr. Maria Garcia",
      specialty: "Dermatologist",
      rating: 4.8,
      reviews: 112,
      experience: "9 years",
      availability: ["Mon", "Wed", "Fri"],
      availableSlots: 2,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
  ],
  psychiatrist: [
    {
      id: "doc11",
      name: "Dr. Thomas Miller",
      specialty: "Psychiatrist",
      rating: 4.6,
      reviews: 83,
      experience: "14 years",
      availability: ["Mon", "Wed", "Fri"],
      availableSlots: 4,
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
  ],
}

interface DoctorsListProps {
  categoryId: string
}

export default function DoctorsList({ categoryId }: DoctorsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [showDoctorDialog, setShowDoctorDialog] = useState(false)

  // Get doctors for the selected category
  const doctors = mockDoctors[categoryId as keyof typeof mockDoctors] || []

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {categoryId === "all" ? "All Doctors" : `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}s`} ({doctors.length})
        </h2>
        <div className="w-full max-w-xs">
          <Input
            placeholder="Search doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={doctor.image} alt={doctor.name} />
                    <AvatarFallback>
                      {doctor.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => {
                      setSelectedDoctor(doctor)
                      setShowDoctorDialog(true)
                    }}>
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Remove Doctor</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="mb-2 flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{doctor.rating}</span>
                <span className="text-xs text-muted-foreground">({doctor.reviews} reviews)</span>
                {doctor.verified && (
                  <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Experience:</span>
                  <p>{doctor.experience}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Available:</span>
                  <p>{doctor.availability.join(", ")}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
              <Button size="sm">
                <Video className="mr-2 h-4 w-4" />
                Connect
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No doctors found</p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Button>
          </div>
        </div>
      )}

      {/* Doctor Detail Dialog */}
      {selectedDoctor && (
        <Dialog open={showDoctorDialog} onOpenChange={setShowDoctorDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Doctor Profile</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedDoctor.name}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedDoctor.image} alt={selectedDoctor.name} />
                  <AvatarFallback>
                    {selectedDoctor.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedDoctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedDoctor.specialty}</p>
                  <div className="mt-1 flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm">{selectedDoctor.rating}</span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({selectedDoctor.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-md bg-muted p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Experience</Label>
                    <p className="text-sm font-medium">{selectedDoctor.experience}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Availability</Label>
                    <p className="text-sm font-medium">{selectedDoctor.availability.join(", ")}</p>
                  </div>
                  <div>
                    <Label className="text-xs">Available Slots</Label>
                    <p className="text-sm font-medium">{selectedDoctor.availableSlots} slots</p>
                  </div>
                  <div>
                    <Label className="text-xs">Verification</Label>
                    <p className="text-sm font-medium">
                      {selectedDoctor.verified ? "Verified" : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex sm:justify-between">
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button>
                <Video className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 