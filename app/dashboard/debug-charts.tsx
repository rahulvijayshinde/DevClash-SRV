"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 900 },
]

export function DebugCharts() {
  const [isMounted, setIsMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setIsMounted(true)
      console.log("Debug Charts component mounted")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error initializing charts")
      console.error("Error in DebugCharts:", err)
    }
  }, [])

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <h3 className="mb-2 font-semibold">Chart Error:</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (!isMounted) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-semibold">Debug Chart Test</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        If you can see this chart, Recharts is working properly.
      </p>
    </div>
  )
} 