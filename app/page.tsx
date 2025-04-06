"use client"

import Link from "next/link"
import { Stethoscope, Calendar, PillIcon, LineChart, MapPin, MessageSquare, ArrowRight, LogIn, UserPlus, User } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Testimonials } from "@/components/testimonials"

// Add wave animation styles
const waveAnimation = `
  @keyframes wave {
    0% { transform: translateX(0) translateZ(0) scaleY(1); }
    50% { transform: translateX(-25%) translateZ(0) scaleY(1.2); }
    100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
  }
  
  @keyframes swell {
    0%, 100% { transform: translateY(-35px); }
    50% { transform: translateY(15px); }
  }
  
  .wave {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.3-200 0.7-250 49.3-394.5 49.3v31.8h800v-31.8z' fill='%23ffffff' fill-opacity='0.3'/%3E%3C/svg%3E");
    position: absolute;
    width: 200%;
    height: 130px;
    bottom: -5px;
    left: 0;
    transform-origin: center bottom;
    animation: wave 18s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite, swell 7s ease-in-out infinite;
  }
  
  .wave.wave2 {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.3-200 0.7-250 49.3-394.5 49.3v31.8h800v-31.8z' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E");
    height: 140px;
    animation: wave 15s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite reverse, swell 9s ease-in-out infinite;
  }
  
  .wave.wave3 {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.3-200 0.7-250 49.3-394.5 49.3v31.8h800v-31.8z' fill='%23ffffff' fill-opacity='0.2'/%3E%3C/svg%3E");
    height: 120px; 
    animation: wave 20s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite, swell 11s ease-in-out infinite;
  }
`;

export default function Home() {
  const { user, isLoading } = useAuth()
  
  useEffect(() => {
    console.log("Home page - Auth state:", { user, isLoading })
  }, [user, isLoading])

  const features = [
    {
      title: "AI Symptom Checker",
      description: "Get preliminary diagnosis based on your symptoms",
      icon: Stethoscope,
      href: "/symptom-checker",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Teleconsultations",
      description: "Book virtual appointments with healthcare providers",
      icon: Calendar,
      href: "/consultations",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Medication Management",
      description: "Track and manage your medications with reminders",
      icon: PillIcon,
      href: "/medications",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Health Dashboard",
      description: "Monitor your health metrics and trends over time",
      icon: LineChart,
      href: "/dashboard",
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Local Resources",
      description: "Find healthcare facilities and resources near you",
      icon: MapPin,
      href: "/resources",
      color: "bg-red-100 text-red-700",
    },
    {
      title: "AI Health Assistant",
      description: "Chat with our AI assistant for health information",
      icon: MessageSquare,
      href: "/chat",
      color: "bg-sky-100 text-sky-700",
    },
  ]

  return (
    <>
      <style jsx global>{waveAnimation}</style>
      <div className="container mx-auto px-4 py-8">
        {/* Debug info - Remove after fixing */}
        <div className="hidden">
          Auth Debug: {isLoading ? "Loading..." : user ? "Logged in" : "Not logged in"}
        </div>

        {/* Auth Buttons - Added to top right */}
        {!user && (
          <div className="flex justify-end gap-2 mb-4">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <Link href="/signup">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </Button>
          </div>
        )}
        
        {/* Profile Button - For authenticated users */}
        {user && (
          <div className="flex justify-end gap-2 mb-4">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/profile">
                <User className="h-4 w-4" />
                View Profile
              </Link>
            </Button>
          </div>
        )}

        {/* Hero Section with Wave Animation */}
        <section className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-16 text-white md:px-12">
          {/* Wave animations */}
          <div className="wave"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
          
          {/* Floating circles - keep them for extra visual interest */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10" />
          
          {/* Content */}
          <div className="relative z-10 max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">AI-Powered Telemedicine for Underserved Communities</h1>
            <p className="mb-8 text-lg text-white/90">
              Connecting patients in remote or underserved regions with healthcare providers using AI technology. Get
              quality healthcare from anywhere, anytime.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                <Link href="/symptom-checker">Check Symptoms</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                <Link href="/consultations">Book Consultation</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold">Features</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Comprehensive healthcare solutions designed for accessibility and ease of use
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="ghost" className="gap-1 p-0 hover:bg-transparent hover:underline">
                    <Link href={feature.href}>
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16 rounded-xl bg-slate-50 p-8 dark:bg-slate-900">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold">How It Works</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Simple steps to access quality healthcare from anywhere
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Check Your Symptoms</h3>
              <p className="text-muted-foreground">Use our AI-powered symptom checker to get a preliminary assessment</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Book a Consultation</h3>
              <p className="text-muted-foreground">Schedule a virtual appointment with a healthcare provider</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Receive Care</h3>
              <p className="text-muted-foreground">Get diagnosis, treatment plans, and prescriptions remotely</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* CTA Section */}
        <section className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 p-8 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mb-6 text-white/90">
              Join thousands of patients who have already benefited from our telemedicine platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                <Link href="/symptom-checker">Check Symptoms</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                <Link href="/consultations">Book Consultation</Link>
              </Button>
              {!user && (
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                  <Link href="/signup">Sign Up Now</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}