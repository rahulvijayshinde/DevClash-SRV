"use client"

import { useState, useEffect } from "react"
import { Activity, Heart, Plus, Thermometer, Weight, Droplet, Moon, Dumbbell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Chart,
  ChartContainer,
  ChartTooltipContent,
  ChartTooltipItem,
  ChartTooltipSeries,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  Area,
} from "recharts"

// Sample data
const bloodPressureData = [
  { date: "Jan", systolic: 120, diastolic: 80 },
  { date: "Feb", systolic: 125, diastolic: 82 },
  { date: "Mar", systolic: 123, diastolic: 81 },
  { date: "Apr", systolic: 118, diastolic: 79 },
  { date: "May", systolic: 122, diastolic: 80 },
  { date: "Jun", systolic: 120, diastolic: 78 },
  { date: "Jul", systolic: 119, diastolic: 77 },
]

const bloodSugarData = [
  { date: "Jan", fasting: 95, postMeal: 140 },
  { date: "Feb", fasting: 98, postMeal: 145 },
  { date: "Mar", fasting: 92, postMeal: 138 },
  { date: "Apr", fasting: 90, postMeal: 135 },
  { date: "May", fasting: 94, postMeal: 142 },
  { date: "Jun", fasting: 91, postMeal: 137 },
  { date: "Jul", fasting: 93, postMeal: 139 },
]

const weightData = [
  { date: "Jan", weight: 165 },
  { date: "Feb", weight: 163 },
  { date: "Mar", weight: 162 },
  { date: "Apr", weight: 160 },
  { date: "May", weight: 159 },
  { date: "Jun", weight: 158 },
  { date: "Jul", weight: 157 },
]

const heartRateData = [
  { date: "Jan", resting: 68, active: 120 },
  { date: "Feb", resting: 70, active: 125 },
  { date: "Mar", resting: 67, active: 122 },
  { date: "Apr", resting: 65, active: 118 },
  { date: "May", resting: 66, active: 120 },
  { date: "Jun", resting: 64, active: 115 },
  { date: "Jul", resting: 65, active: 118 },
]

// New cholesterol data
const cholesterolData = [
  { date: "Jan", total: 190, hdl: 55, ldl: 110, triglycerides: 125, ratio: 3.5 },
  { date: "Feb", total: 185, hdl: 58, ldl: 105, triglycerides: 120, ratio: 3.2 },
  { date: "Mar", total: 195, hdl: 56, ldl: 115, triglycerides: 130, ratio: 3.5 },
  { date: "Apr", total: 180, hdl: 60, ldl: 100, triglycerides: 115, ratio: 3.0 },
  { date: "May", total: 175, hdl: 62, ldl: 95, triglycerides: 110, ratio: 2.8 },
  { date: "Jun", total: 172, hdl: 65, ldl: 90, triglycerides: 105, ratio: 2.6 },
  { date: "Jul", total: 170, hdl: 68, ldl: 85, triglycerides: 100, ratio: 2.5 },
]

// New sample data for sleep patterns
const sleepData = [
  { date: "Jan", hours: 7.2, quality: 85, deep: 1.8, light: 3.9, rem: 1.5 },
  { date: "Feb", hours: 6.8, quality: 75, deep: 1.5, light: 3.8, rem: 1.5 },
  { date: "Mar", hours: 7.5, quality: 88, deep: 2.0, light: 4.0, rem: 1.5 },
  { date: "Apr", hours: 7.0, quality: 82, deep: 1.7, light: 3.8, rem: 1.5 },
  { date: "May", hours: 7.8, quality: 90, deep: 2.2, light: 4.0, rem: 1.6 },
  { date: "Jun", hours: 8.0, quality: 92, deep: 2.3, light: 4.1, rem: 1.6 },
  { date: "Jul", hours: 7.7, quality: 89, deep: 2.1, light: 4.0, rem: 1.6 },
]

// New sample data for body composition
const bodyCompositionData = [
  { date: "Jan", bodyFat: 25, muscle: 35, water: 55, bone: 12 },
  { date: "Feb", bodyFat: 24, muscle: 35.5, water: 55.5, bone: 12 },
  { date: "Mar", bodyFat: 23.5, muscle: 36, water: 56, bone: 12 },
  { date: "Apr", bodyFat: 23, muscle: 36.5, water: 56.5, bone: 12 },
  { date: "May", bodyFat: 22, muscle: 37, water: 57, bone: 12 },
  { date: "Jun", bodyFat: 21, muscle: 38, water: 58, bone: 12 },
  { date: "Jul", bodyFat: 20, muscle: 39, water: 59, bone: 12 },
]

export function HealthDashboard() {
  const [timeRange, setTimeRange] = useState("6m")
  const [error, setError] = useState<string | null>(null)
  const [isChartMounted, setIsChartMounted] = useState(false)

  useEffect(() => {
    try {
      console.log("HealthDashboard component mounted")
      setIsChartMounted(true)
    } catch (err) {
      console.error("Error initializing HealthDashboard:", err)
      setError(err instanceof Error ? err.message : "Unknown error initializing charts")
    }
  }, [])

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <h3 className="mb-2 font-semibold">Error displaying health metrics:</h3>
        <p>{error}</p>
        <p className="mt-2 text-sm">
          Please try refreshing the page. If the problem persists, contact support.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Health Metrics</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" /> Add Data
          </Button>
        </div>
      </div>

      {!isChartMounted ? (
        <div className="flex h-[300px] items-center justify-center rounded-lg border bg-card p-6 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="blood-pressure">
          <TabsList className="mb-4">
            <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
            <TabsTrigger value="blood-sugar">Blood Sugar</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
            <TabsTrigger value="cholesterol">Cholesterol</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="body-composition">Body Composition</TabsTrigger>
          </TabsList>

          <TabsContent value="blood-pressure">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle>Blood Pressure</CardTitle>
                    <CardDescription>Systolic and diastolic measurements</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={bloodPressureData}
                          margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <ChartTooltipContent>
                                    <ChartTooltipSeries>
                                      {payload.map((entry) => (
                                        <ChartTooltipItem
                                          key={entry.dataKey}
                                          label={entry.dataKey === "systolic" ? "Systolic" : "Diastolic"}
                                          value={`${entry.value} mmHg`}
                                          color={entry.dataKey === "systolic" ? "#ef4444" : "#3b82f6"}
                                        />
                                      ))}
                                    </ChartTooltipSeries>
                                  </ChartTooltipContent>
                                )
                              }
                              return null
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="systolic"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      <ChartLegendItem name="Systolic" color="#ef4444" />
                      <ChartLegendItem name="Diastolic" color="#3b82f6" />
                    </ChartLegend>
                  </ChartContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Latest Reading</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className="text-2xl font-bold">
                          {bloodPressureData[bloodPressureData.length - 1].systolic}/
                          {bloodPressureData[bloodPressureData.length - 1].diastolic}
                        </div>
                        <div className="text-sm text-muted-foreground">mmHg</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Average</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className="text-2xl font-bold">
                          {Math.round(
                            bloodPressureData.reduce((acc, curr) => acc + curr.systolic, 0) / bloodPressureData.length,
                          )}
                          /
                          {Math.round(
                            bloodPressureData.reduce((acc, curr) => acc + curr.diastolic, 0) / bloodPressureData.length,
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">mmHg</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blood-sugar">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                    <Thermometer className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle>Blood Sugar</CardTitle>
                    <CardDescription>Fasting and post-meal glucose levels</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={bloodSugarData}
                          margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <ChartTooltipContent>
                                    <ChartTooltipSeries>
                                      {payload.map((entry) => (
                                        <ChartTooltipItem
                                          key={entry.dataKey}
                                          label={entry.dataKey === "fasting" ? "Fasting" : "Post-Meal"}
                                          value={`${entry.value} mg/dL`}
                                          color={entry.dataKey === "fasting" ? "#8b5cf6" : "#ec4899"}
                                        />
                                      ))}
                                    </ChartTooltipSeries>
                                  </ChartTooltipContent>
                                )
                              }
                              return null
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="fasting"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line type="monotone" dataKey="postMeal" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      <ChartLegendItem name="Fasting" color="#8b5cf6" />
                      <ChartLegendItem name="Post-Meal" color="#ec4899" />
                    </ChartLegend>
                  </ChartContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Latest Fasting</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className="text-2xl font-bold">{bloodSugarData[bloodSugarData.length - 1].fasting}</div>
                        <div className="text-sm text-muted-foreground">mg/dL</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Latest Post-Meal</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className="text-2xl font-bold">{bloodSugarData[bloodSugarData.length - 1].postMeal}</div>
                        <div className="text-sm text-muted-foreground">mg/dL</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weight">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <Weight className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle>Weight</CardTitle>
                    <CardDescription>Weight measurements over time</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={weightData}
                          margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={["dataMin - 5", "dataMax + 5"]} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <ChartTooltipContent>
                                    <ChartTooltipSeries>
                                      {payload.map((entry) => (
                                        <ChartTooltipItem
                                          key={entry.dataKey}
                                          label="Weight"
                                          value={`${entry.value} lbs`}
                                          color="#22c55e"
                                        />
                                      ))}
                                    </ChartTooltipSeries>
                                  </ChartTooltipContent>
                                )
                              }
                              return null
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      <ChartLegendItem name="Weight" color="#22c55e" />
                    </ChartLegend>
                  </ChartContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Current Weight</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className="text-2xl font-bold">{weightData[weightData.length - 1].weight}</div>
                        <div className="text-sm text-muted-foreground">lbs</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Change</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div
                          className={`text-2xl font-bold ${
                            weightData[0].weight - weightData[weightData.length - 1].weight > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {weightData[0].weight - weightData[weightData.length - 1].weight > 0 ? "+" : ""}
                          {weightData[0].weight - weightData[weightData.length - 1].weight}
                        </div>
                        <div className="text-sm text-muted-foreground">lbs</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heart-rate">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-700">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle>Heart Rate</CardTitle>
                    <CardDescription>Resting and active heart rate</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={heartRateData}
                          margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <ChartTooltipContent>
                                    <ChartTooltipSeries>
                                      {payload.map((entry) => (
                                        <ChartTooltipItem
                                          key={entry.dataKey}
                                          label={entry.dataKey === "resting" ? "Resting" : "Active"}
                                          value={`${entry.value} bpm`}
                                          color={entry.dataKey === "resting" ? "#ec4899" : "#f97316"}
                                        />
                                      ))}
                                    </ChartTooltipSeries>
                                  </ChartTooltipContent>
                                )
                              }
                              return null
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="resting"
                            stroke="#ec4899"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line type="monotone" dataKey="active" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      <ChartLegendItem name="Resting" color="#ec4899" />
                      <ChartLegendItem name="Active" color="#f97316" />
                    </ChartLegend>
                  </ChartContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Latest Resting</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className="text-2xl font-bold">{heartRateData[heartRateData.length - 1].resting}</div>
                        <div className="text-sm text-muted-foreground">bpm</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Latest Active</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className="text-2xl font-bold">{heartRateData[heartRateData.length - 1].active}</div>
                        <div className="text-sm text-muted-foreground">bpm</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cholesterol">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <Droplet className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle>Cholesterol</CardTitle>
                    <CardDescription>Lipid profile measurements</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Combined chart with lines and bars */}
                <div className="h-[350px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={cholesterolData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis 
                            yAxisId="left" 
                            domain={[0, 'dataMax + 30']}
                            label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }} 
                          />
                          <YAxis 
                            yAxisId="right" 
                            orientation="right" 
                            domain={[0, 5]}
                            label={{ value: 'Ratio', angle: 90, position: 'insideRight' }} 
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <ChartTooltipContent>
                                    <ChartTooltipSeries>
                                      {payload.map((entry: any) => {
                                        let label = String(entry.dataKey);
                                        let unit = "mg/dL";
                                        let color = "#0ea5e9";
                                        
                                        if (entry.dataKey === "hdl") {
                                          label = "HDL";
                                          color = "#10b981";
                                        } else if (entry.dataKey === "ldl") {
                                          label = "LDL";
                                          color = "#ef4444";
                                        } else if (entry.dataKey === "total") {
                                          label = "Total";
                                          color = "#6366f1";
                                        } else if (entry.dataKey === "triglycerides") {
                                          label = "Triglycerides";
                                          color = "#f59e0b";
                                        } else if (entry.dataKey === "ratio") {
                                          label = "Total/HDL Ratio";
                                          unit = "";
                                          color = "#8b5cf6";
                                        }
                                        
                                        const displayValue = unit !== "" 
                                          ? `${entry.value} ${unit}` 
                                          : entry.value;
                                        
                                        return (
                                          <ChartTooltipItem
                                            key={entry.dataKey}
                                            label={label}
                                            value={displayValue}
                                            color={color}
                                          />
                                        );
                                      })}
                                    </ChartTooltipSeries>
                                  </ChartTooltipContent>
                                )
                              }
                              return null
                            }}
                          />
                          <Bar yAxisId="left" dataKey="hdl" barSize={20} fill="#10b981" fillOpacity={0.8} name="HDL (Good)" />
                          <Bar yAxisId="left" dataKey="ldl" barSize={20} fill="#ef4444" fillOpacity={0.8} name="LDL (Bad)" />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="total"
                            stroke="#6366f1"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#6366f1", strokeWidth: 1 }}
                            activeDot={{ r: 6 }}
                            name="Total"
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="triglycerides"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#f59e0b", strokeWidth: 1 }}
                            name="Triglycerides"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="ratio"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 1 }}
                            name="Total/HDL Ratio"
                          />
                          <Legend verticalAlign="top" height={36} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      <ChartLegendItem name="HDL (Good)" color="#10b981" />
                      <ChartLegendItem name="LDL (Bad)" color="#ef4444" />
                      <ChartLegendItem name="Total" color="#6366f1" />
                      <ChartLegendItem name="Triglycerides" color="#f59e0b" />
                      <ChartLegendItem name="Total/HDL Ratio" color="#8b5cf6" />
                    </ChartLegend>
                  </ChartContainer>
                </div>

                {/* Summary cards */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Latest Total</div>
                      <div className={`text-2xl font-bold ${
                        cholesterolData[cholesterolData.length - 1].total < 200 
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        {cholesterolData[cholesterolData.length - 1].total}
                      </div>
                      <div className="text-sm text-muted-foreground">mg/dL</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {cholesterolData[cholesterolData.length - 1].total < 200 
                          ? "Optimal" 
                          : cholesterolData[cholesterolData.length - 1].total < 240 
                            ? "Borderline High" 
                            : "High"}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">HDL Level</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className={`text-2xl font-bold ${
                          cholesterolData[cholesterolData.length - 1].hdl > 60
                            ? "text-green-600"
                            : cholesterolData[cholesterolData.length - 1].hdl > 40
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}>
                          {cholesterolData[cholesterolData.length - 1].hdl}
                        </div>
                        <div className="text-sm text-muted-foreground">mg/dL</div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {cholesterolData[cholesterolData.length - 1].hdl > 60
                          ? "Optimal"
                          : cholesterolData[cholesterolData.length - 1].hdl > 40
                            ? "Good"
                            : "Low"}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">LDL Level</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className={`text-2xl font-bold ${
                          cholesterolData[cholesterolData.length - 1].ldl < 100
                            ? "text-green-600"
                            : cholesterolData[cholesterolData.length - 1].ldl < 130
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}>
                          {cholesterolData[cholesterolData.length - 1].ldl}
                        </div>
                        <div className="text-sm text-muted-foreground">mg/dL</div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {cholesterolData[cholesterolData.length - 1].ldl < 100
                          ? "Optimal"
                          : cholesterolData[cholesterolData.length - 1].ldl < 130
                            ? "Near Optimal"
                            : "High"}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sleep">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                    <Moon className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle>Sleep Patterns</CardTitle>
                    <CardDescription>Duration and quality of sleep</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={sleepData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis 
                            yAxisId="left" 
                            domain={[0, 10]}
                            label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} 
                          />
                          <YAxis 
                            yAxisId="right" 
                            orientation="right" 
                            domain={[0, 100]}
                            label={{ value: 'Quality %', angle: 90, position: 'insideRight' }} 
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <ChartTooltipContent>
                                    <ChartTooltipSeries>
                                      {payload.map((entry: any) => {
                                        let label = String(entry.dataKey);
                                        let unit = "";
                                        let color = "#4f46e5";
                                        
                                        if (entry.dataKey === "hours") {
                                          label = "Total Sleep";
                                          unit = "hours";
                                          color = "#4f46e5";
                                        } else if (entry.dataKey === "quality") {
                                          label = "Sleep Quality";
                                          unit = "%";
                                          color = "#8b5cf6";
                                        } else if (entry.dataKey === "deep") {
                                          label = "Deep Sleep";
                                          unit = "hours";
                                          color = "#1e40af";
                                        } else if (entry.dataKey === "light") {
                                          label = "Light Sleep";
                                          unit = "hours";
                                          color = "#60a5fa";
                                        } else if (entry.dataKey === "rem") {
                                          label = "REM Sleep";
                                          unit = "hours";
                                          color = "#a78bfa";
                                        }
                                        
                                        const displayValue = unit !== "" 
                                          ? `${entry.value} ${unit}` 
                                          : entry.value;
                                        
                                        return (
                                          <ChartTooltipItem
                                            key={entry.dataKey}
                                            label={label}
                                            value={displayValue}
                                            color={color}
                                          />
                                        );
                                      })}
                                    </ChartTooltipSeries>
                                  </ChartTooltipContent>
                                )
                              }
                              return null
                            }}
                          />
                          <Area 
                            yAxisId="left"
                            type="monotone"
                            dataKey="deep"
                            stackId="1"
                            stroke="#1e40af"
                            fill="#1e40af"
                            fillOpacity={0.6}
                            name="Deep Sleep"
                          />
                          <Area 
                            yAxisId="left"
                            type="monotone"
                            dataKey="light"
                            stackId="1"
                            stroke="#60a5fa"
                            fill="#60a5fa"
                            fillOpacity={0.6}
                            name="Light Sleep"
                          />
                          <Area 
                            yAxisId="left"
                            type="monotone"
                            dataKey="rem"
                            stackId="1"
                            stroke="#a78bfa"
                            fill="#a78bfa"
                            fillOpacity={0.6}
                            name="REM Sleep"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="quality"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Sleep Quality"
                          />
                          <Legend verticalAlign="top" height={36} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      <ChartLegendItem name="Deep Sleep" color="#1e40af" />
                      <ChartLegendItem name="Light Sleep" color="#60a5fa" />
                      <ChartLegendItem name="REM Sleep" color="#a78bfa" />
                      <ChartLegendItem name="Sleep Quality" color="#8b5cf6" />
                    </ChartLegend>
                  </ChartContainer>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Latest Sleep Duration</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className={`text-2xl font-bold ${
                          sleepData[sleepData.length - 1].hours >= 7 
                            ? "text-green-600" 
                            : sleepData[sleepData.length - 1].hours >= 6
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}>
                          {sleepData[sleepData.length - 1].hours}
                        </div>
                        <div className="text-sm text-muted-foreground">hours</div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {sleepData[sleepData.length - 1].hours >= 7 
                          ? "Optimal" 
                          : sleepData[sleepData.length - 1].hours >= 6
                            ? "Adequate" 
                            : "Insufficient"}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Deep Sleep</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className={`text-2xl font-bold ${
                          sleepData[sleepData.length - 1].deep >= 1.5
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}>
                          {sleepData[sleepData.length - 1].deep}
                        </div>
                        <div className="text-sm text-muted-foreground">hours</div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {Math.round((sleepData[sleepData.length - 1].deep / sleepData[sleepData.length - 1].hours) * 100)}% of total sleep
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Sleep Quality</div>
                      <div className={`text-2xl font-bold ${
                        sleepData[sleepData.length - 1].quality >= 85
                          ? "text-green-600"
                          : sleepData[sleepData.length - 1].quality >= 70
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}>
                        {sleepData[sleepData.length - 1].quality}%
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {sleepData[sleepData.length - 1].quality >= 85
                          ? "Excellent"
                          : sleepData[sleepData.length - 1].quality >= 70
                            ? "Good"
                            : "Poor"}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="body-composition">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <Dumbbell className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle>Body Composition</CardTitle>
                    <CardDescription>Body fat, muscle mass, and water percentage</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={bodyCompositionData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis 
                            domain={[0, 100]}
                            label={{ value: 'Percentage %', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <ChartTooltipContent>
                                    <ChartTooltipSeries>
                                      {payload.map((entry: any) => {
                                        let label = String(entry.dataKey);
                                        let color = "#d97706";
                                        
                                        if (entry.dataKey === "bodyFat") {
                                          label = "Body Fat";
                                          color = "#f59e0b";
                                        } else if (entry.dataKey === "muscle") {
                                          label = "Muscle Mass";
                                          color = "#0e7490";
                                        } else if (entry.dataKey === "water") {
                                          label = "Water";
                                          color = "#0ea5e9";
                                        } else if (entry.dataKey === "bone") {
                                          label = "Bone Mass";
                                          color = "#737373";
                                        }
                                        
                                        return (
                                          <ChartTooltipItem
                                            key={entry.dataKey}
                                            label={label}
                                            value={`${entry.value}%`}
                                            color={color}
                                          />
                                        );
                                      })}
                                    </ChartTooltipSeries>
                                  </ChartTooltipContent>
                                )
                              }
                              return null
                            }}
                          />
                          <Bar dataKey="bodyFat" name="Body Fat" fill="#f59e0b" opacity={0.8} />
                          <Bar dataKey="muscle" name="Muscle Mass" fill="#0e7490" opacity={0.8} />
                          <Bar dataKey="water" name="Water" fill="#0ea5e9" opacity={0.6} />
                          <Bar dataKey="bone" name="Bone Mass" fill="#737373" opacity={0.8} />
                          <Legend verticalAlign="top" height={36} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      <ChartLegendItem name="Body Fat" color="#f59e0b" />
                      <ChartLegendItem name="Muscle Mass" color="#0e7490" />
                      <ChartLegendItem name="Water" color="#0ea5e9" />
                      <ChartLegendItem name="Bone Mass" color="#737373" />
                    </ChartLegend>
                  </ChartContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Body Fat Percentage</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className={`text-2xl font-bold ${
                          bodyCompositionData[bodyCompositionData.length - 1].bodyFat <= 25 
                            ? "text-green-600" 
                            : bodyCompositionData[bodyCompositionData.length - 1].bodyFat <= 30
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}>
                          {bodyCompositionData[bodyCompositionData.length - 1].bodyFat}%
                        </div>
                        <div className="text-sm text-muted-foreground"></div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {bodyCompositionData[bodyCompositionData.length - 1].bodyFat <= 25 
                          ? "Healthy Range" 
                          : bodyCompositionData[bodyCompositionData.length - 1].bodyFat <= 30
                            ? "Moderate" 
                            : "High"}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-muted-foreground">Muscle Mass</div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className="text-2xl font-bold text-blue-600">
                          {bodyCompositionData[bodyCompositionData.length - 1].muscle}%
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Increased by {
                          (bodyCompositionData[bodyCompositionData.length - 1].muscle - 
                          bodyCompositionData[0].muscle).toFixed(1)
                        }% in {bodyCompositionData.length} months
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

