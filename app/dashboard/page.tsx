"use client"

import { LineChart } from "lucide-react"
import { HealthDashboard } from "@/components/health-dashboard"
import { useEffect, useState } from "react"
import { DebugCharts } from "./debug-charts"

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // This ensures the component only renders on the client side
  // which helps with Recharts that requires browser APIs
  useEffect(() => {
    setIsMounted(true);
    
    // Check URL parameters for debug mode
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('debug') === 'true') {
      setShowDebug(true);
    }
    
    // Add console message to help debug
    console.log("Dashboard page mounted, charts should render now");
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Health Dashboard</h1>
        <p className="text-muted-foreground">Monitor your health metrics and trends over time</p>
        
        {isMounted && (
          <button 
            onClick={() => setShowDebug(prev => !prev)}
            className="mt-2 text-xs text-blue-600 hover:underline"
          >
            {showDebug ? "Hide Debug Charts" : "Show Debug Charts"}
          </button>
        )}
      </div>

      {showDebug && <DebugCharts />}

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          {isMounted ? (
            <HealthDashboard />
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-lg border bg-card p-6 shadow-sm">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          )}
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <LineChart className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Understanding Your Health Data</h2>
            <p className="mb-4 text-muted-foreground">
              Tracking your health metrics over time can help you and your healthcare provider make informed decisions
              about your care.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs">
                  1
                </span>
                <span>Regularly update your health metrics</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs">
                  2
                </span>
                <span>Monitor trends and patterns over time</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs">
                  3
                </span>
                <span>Share your data with your healthcare provider</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs">
                  4
                </span>
                <span>Set goals and track your progress</span>
              </li>
            </ul>

            <div className="mt-6 rounded-md bg-blue-50 p-4 text-blue-800">
              <p className="text-sm font-medium">Health Metrics Privacy</p>
              <p className="text-xs">
                Your health data is private and secure. Only you and the healthcare providers you authorize can access
                your information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

