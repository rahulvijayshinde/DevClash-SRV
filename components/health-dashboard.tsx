"use client"

import { useState } from "react"
import { Activity, Heart, Plus, Thermometer, Weight } from "lucide-react"

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

export function HealthDashboard() {
  const [timeRange, setTimeRange] = useState("6m")

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

      <Tabs defaultValue="blood-pressure">
        <TabsList className="mb-4">
          <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
          <TabsTrigger value="blood-sugar">Blood Sugar</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
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
      </Tabs>
    </div>
  )
}

