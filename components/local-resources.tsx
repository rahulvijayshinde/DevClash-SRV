"use client"

import { useState } from "react"
import { Building2, Clock, ExternalLink, Loader2, MapPin, Phone, Search, Stethoscope } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data
const resourcesData = [
  {
    id: "res1",
    name: "Vedant healthcare Center",
    type: "clinic",
    address: "GWXC+9HP, Prasad Nagar, Wadgaon Sheri, Pune, Maharashtra 411014",
    phone: "+91  123456789",
    hours: "Mon-Fri: 8am-5pm, Sat: 9am-1pm",
    distance: 19.2,
    services: ["Primary Care", "Pediatrics", "Women's Health", "Mental Health"],
    acceptingNew: true,
  },
  {
    id: "res2",
    name: "New Thergaon Hospital",
    type: "hospital",
    address: "Jagtap Nagar, Nakhate Nagar, Thergaon, Pune, Pimpri-Chinchwad, Maharashtra 411033",
    phone: "02068337373",
    hours: "24/7",
    distance: 3.5,
    services: ["Emergency Care", "Surgery", "Radiology", "Laboratory"],
    acceptingNew: true,
  },
  {
    id: "res3",
    name: "Main Street Pharmacy",
    type: "pharmacy",
    address: "789 Main St, Anytown, USA",
    phone: "(555) 456-7890",
    hours: "Mon-Fri: 9am-9pm, Sat-Sun: 10am-6pm",
    distance: 1.3,
    services: ["Prescription Filling", "Vaccinations", "Health Consultations"],
    acceptingNew: true,
  },
  {
    id: "res4",
    name: "Wellness Medical Group",
    type: "clinic",
    address: "321 Oak St, Anytown, USA",
    phone: "(555) 789-0123",
    hours: "Mon-Fri: 9am-6pm",
    distance: 2.8,
    services: ["Family Medicine", "Chronic Disease Management", "Preventive Care"],
    acceptingNew: false,
  },
  {
    id: "res5",
    name: "Children's Health Clinic",
    type: "clinic",
    address: "555 Pine St, Anytown, USA",
    phone: "(555) 234-5678",
    hours: "Mon-Fri: 8am-7pm, Sat: 9am-3pm",
    distance: 4.1,
    services: ["Pediatrics", "Immunizations", "Well-Child Visits", "Developmental Assessments"],
    acceptingNew: true,
  },
  {
    id: "res6",
    name: "24-Hour Pharmacy",
    type: "pharmacy",
    address: "888 Market St, Anytown, USA",
    phone: "(555) 345-6789",
    hours: "24/7",
    distance: 3.9,
    services: ["Prescription Filling", "Over-the-Counter Medications", "Health Supplies"],
    acceptingNew: true,
  },
]

export function LocalResources() {
  const [searchQuery, setSearchQuery] = useState("")
  const [resourceType, setResourceType] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [location, setLocation] = useState("Anytown, USA")

  // Filter resources based on search query and resource type
  const filteredResources = resourcesData.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.services.some((service) => service.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = resourceType === "all" || resource.type === resourceType

    return matchesSearch && matchesType
  })

  // Sort resources by distance
  const sortedResources = [...filteredResources].sort((a, b) => a.distance - b.distance)

  const handleSearch = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleUseCurrentLocation = () => {
    setIsLoadingLocation(true)

    // Simulate geolocation API call
    setTimeout(() => {
      setLocation("Current Location")
      setIsLoadingLocation(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Your Location:</span>
              <span className="text-sm">{location}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-8 text-xs"
                onClick={handleUseCurrentLocation}
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Locating...
                  </>
                ) : (
                  "Use Current Location"
                )}
              </Button>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, address, or service"
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select defaultValue={resourceType} onValueChange={setResourceType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Resource Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Resources</SelectItem>
                  <SelectItem value="clinic">Clinics</SelectItem>
                  <SelectItem value="hospital">Hospitals</SelectItem>
                  <SelectItem value="pharmacy">Pharmacies</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {sortedResources.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-lg font-medium">No Resources Found</h3>
                <p className="text-center text-sm text-muted-foreground">
                  No healthcare resources match your search criteria. Try adjusting your filters or search query.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedResources.map((resource) => (
                <Card key={resource.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{resource.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {resource.address}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          resource.type === "hospital"
                            ? "destructive"
                            : resource.type === "clinic"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {resource.type === "hospital" ? "Hospital" : resource.type === "clinic" ? "Clinic" : "Pharmacy"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-2 text-sm md:grid-cols-2">
                      <div className="flex items-start gap-2">
                        <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <span>{resource.phone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <span>{resource.hours}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <span>{resource.distance} miles away</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Stethoscope className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <span>{resource.acceptingNew ? "Accepting new patients" : "Not accepting new patients"}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="mb-1 text-sm font-medium">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {resource.services.map((service) => (
                          <Badge key={service} variant="outline" className="font-normal">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t px-6 py-4">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                    <a href="https://www.google.com/maps/dir//GWXC%2B9HP+Vedant+healthcare+Center,+Prasad+Nagar,+Wadgaon+Sheri,+Pune,+Maharashtra+411014/@18.548468,73.9165728,17z/data=!4m17!1m7!3m6!1s0x3bc2c111b9c5e05d:0x71bb93047eaa31cf!2sVedant+healthcare+Center!8m2!3d18.548463!4d73.9214437!16s%2Fg%2F11shxwqwps!4m8!1m0!1m5!1m1!1s0x3bc2c111b9c5e05d:0x71bb93047eaa31cf!2m2!1d73.9214473!2d18.5484059!3e9?entry=ttu&g_ep=EgoyMDI1MDQwMi4xIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1">
                      <MapPin className="h-4 w-4" />
                      Directions
                    </Button>
                  </a>
                    <Button size="sm" className="gap-1">
                      <ExternalLink className="h-4 w-4" />
                      Visit Website
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardContent className="p-0">
              <div className="relative h-[500px] w-full bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Map view is not available in this demo</p>
                    <Button className="mt-4" size="sm">
                      Enable Location Access
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

