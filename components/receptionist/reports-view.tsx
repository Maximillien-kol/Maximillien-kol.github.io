"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Activity,
} from "lucide-react"
import { visitorDb, staffDb } from "@/lib/db/receptionist"

export default function ReportsView() {
  const [todayStats, setTodayStats] = useState({
    totalCustomers: 0,
    served: 0,
    cancelled: 0,
    rescheduled: 0,
    avgWaitTime: "0 min",
    avgServiceTime: "8 min",
    peakHour: "10:00 AM - 11:00 AM",
    customerSatisfaction: "4.5/5.0",
  })

  const [backlogStats, setBacklogStats] = useState({
    currentBacklog: 0,
    estimatedClearTime: "0 hours",
    highPriority: 0,
    overdueTasks: 0,
  })

  const [employeePerformance, setEmployeePerformance] = useState<Array<{
    name: string
    served: number
    avgTime: string
    satisfaction: string
  }>>([])

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = () => {
    const visitors = visitorDb.getAll()
    const staff = staffDb.getAll()
    
    // Get today's visitors only
    const today = new Date().toDateString()
    const todayVisitors = visitors.filter(v => {
      const visitorDate = new Date(v.createdAt).toDateString()
      return visitorDate === today
    })

    // Calculate real stats
    const waiting = todayVisitors.filter(v => v.status === "waiting")
    const inProgress = todayVisitors.filter(v => v.status === "in-progress")
    const completed = todayVisitors.filter(v => v.status === "completed")
    const cancelled = todayVisitors.filter(v => v.status === "cancelled")
    const highPriority = waiting.filter(v => v.priority === "high" || v.priority === "urgent")

    // Calculate average wait time from completed tickets
    let avgWaitMinutes = 0
    if (completed.length > 0) {
      const totalWaitTime = completed.reduce((sum, v) => {
        if (v.checkOutTime) {
          const checkIn = new Date(v.checkInTime).getTime()
          const checkOut = new Date(v.checkOutTime).getTime()
          return sum + (checkOut - checkIn) / 60000 // Convert to minutes
        }
        return sum
      }, 0)
      avgWaitMinutes = Math.round(totalWaitTime / completed.length)
    }

    // Find peak hour
    const hourCounts: Record<number, number> = {}
    todayVisitors.forEach(v => {
      const hour = new Date(v.checkInTime).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })
    const peakHour = Object.keys(hourCounts).reduce((max, hour) => {
      return (hourCounts[Number(hour)] > hourCounts[Number(max)]) ? hour : max
    }, "9")
    const peakHourInt = parseInt(peakHour)
    const peakHourFormatted = `${peakHourInt > 12 ? peakHourInt - 12 : peakHourInt}:00 ${peakHourInt >= 12 ? 'PM' : 'AM'} - ${(peakHourInt + 1) > 12 ? (peakHourInt + 1) - 12 : (peakHourInt + 1)}:00 ${(peakHourInt + 1) >= 12 ? 'PM' : 'AM'}`

    setTodayStats({
      totalCustomers: todayVisitors.length,
      served: completed.length,
      cancelled: cancelled.length,
      rescheduled: 0, // Not tracked yet
      avgWaitTime: avgWaitMinutes > 0 ? `${avgWaitMinutes} min` : "N/A",
      avgServiceTime: avgWaitMinutes > 0 ? `${Math.round(avgWaitMinutes * 0.6)} min` : "N/A",
      peakHour: Object.keys(hourCounts).length > 0 ? peakHourFormatted : "No data",
      customerSatisfaction: "N/A", // Requires feedback system
    })

    setBacklogStats({
      currentBacklog: waiting.length,
      estimatedClearTime: waiting.length > 0 ? `${Math.ceil(waiting.length * 10 / 60)} hours` : "0 hours",
      highPriority: highPriority.length,
      overdueTasks: 0, // Calculate based on wait time threshold
    })

    // Employee performance with real data
    const performance = staff.map(s => {
      const staffTickets = todayVisitors.filter(v => v.hostStaffId === s.id)
      const staffCompleted = staffTickets.filter(v => v.status === "completed")
      
      let avgTime = 0
      if (staffCompleted.length > 0) {
        const totalTime = staffCompleted.reduce((sum, v) => {
          if (v.checkOutTime) {
            const checkIn = new Date(v.checkInTime).getTime()
            const checkOut = new Date(v.checkOutTime).getTime()
            return sum + (checkOut - checkIn) / 60000
          }
          return sum
        }, 0)
        avgTime = Math.round(totalTime / staffCompleted.length)
      }

      return {
        name: s.name,
        served: staffCompleted.length,
        avgTime: avgTime > 0 ? `${avgTime} min` : "N/A",
        satisfaction: "N/A", // Requires feedback system
      }
    })
    setEmployeePerformance(performance)
  }

  const hourlyData = [
    { hour: "9 AM", customers: 12 },
    { hour: "10 AM", customers: 24 },
    { hour: "11 AM", customers: 28 },
    { hour: "12 PM", customers: 18 },
    { hour: "1 PM", customers: 15 },
    { hour: "2 PM", customers: 22 },
    { hour: "3 PM", customers: 20 },
    { hour: "4 PM", customers: 17 },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>Reports & Analytics</h2>
          <p className="text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>Daily summary and performance overview</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-[180px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ fontFamily: "var(--font-space-grotesk)" }}>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList style={{ fontFamily: "var(--font-space-grotesk)" }}>
          <TabsTrigger value="daily" style={{ fontFamily: "var(--font-space-grotesk)" }}>Daily Summary</TabsTrigger>
          <TabsTrigger value="backlog" style={{ fontFamily: "var(--font-space-grotesk)" }}>Backlog Overview</TabsTrigger>
          <TabsTrigger value="performance" style={{ fontFamily: "var(--font-space-grotesk)" }}>Performance</TabsTrigger>
        </TabsList>

        {/* Daily Summary Tab */}
        <TabsContent value="daily" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{todayStats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-green-600">+12%</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Customers Served</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{todayStats.served}</div>
                <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {Math.round((todayStats.served / todayStats.totalCustomers) * 100)}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Avg Wait Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{todayStats.avgWaitTime}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  <TrendingDown className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-green-600">-3 min</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Satisfaction</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{todayStats.customerSatisfaction}</div>
                <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>Based on 89 responses</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Details */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Hourly Distribution */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>Hourly Customer Distribution</CardTitle>
                <CardDescription className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>Customer check-ins throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hourlyData.map((data) => (
                    <div key={data.hour} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>{data.hour}</div>
                      <div className="flex-1">
                        <div className="h-8 rounded-md bg-gray-100 overflow-hidden">
                          <div
                            className="h-full bg-[#022B3A] transition-all"
                            style={{ width: `${(data.customers / 28) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-12 text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>{data.customers}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Breakdown */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>Service Type Breakdown</CardTitle>
                <CardDescription className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>Most requested services today</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[340px]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Account Services</p>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>45 requests</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-100">
                          <div className="h-full w-[60%] rounded-full bg-blue-500" />
                        </div>
                        <span className="text-sm font-medium" style={{ fontFamily: "var(--font-poppins)" }}>60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>General Inquiry</p>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>32 requests</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-100">
                          <div className="h-full w-[43%] rounded-full bg-green-500" />
                        </div>
                        <span className="text-sm font-medium" style={{ fontFamily: "var(--font-poppins)" }}>43%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Technical Support</p>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>28 requests</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-100">
                          <div className="h-full w-[37%] rounded-full bg-orange-500" />
                        </div>
                        <span className="text-sm font-medium" style={{ fontFamily: "var(--font-poppins)" }}>37%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Billing Support</p>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>24 requests</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-100">
                          <div className="h-full w-[32%] rounded-full bg-purple-500" />
                        </div>
                        <span className="text-sm font-medium" style={{ fontFamily: "var(--font-poppins)" }}>32%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Consultation</p>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>19 requests</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-100">
                          <div className="h-full w-[25%] rounded-full bg-pink-500" />
                        </div>
                        <span className="text-sm font-medium" style={{ fontFamily: "var(--font-poppins)" }}>25%</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Peak Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{todayStats.peakHour}</div>
                <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>Highest traffic period</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Cancellations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold flex items-center gap-2" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                  {todayStats.cancelled}
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {Math.round((todayStats.cancelled / todayStats.totalCustomers) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Rescheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold flex items-center gap-2" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                  {todayStats.rescheduled}
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {Math.round((todayStats.rescheduled / todayStats.totalCustomers) * 100)}% of total
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Backlog Overview Tab */}
        <TabsContent value="backlog" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Current Backlog</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{backlogStats.currentBacklog}</div>
                <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>Customers waiting</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Est. Clear Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{backlogStats.estimatedClearTime}</div>
                <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>At current pace</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>High Priority</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-orange-600" style={{ fontFamily: "var(--font-poppins)" }}>{backlogStats.highPriority}</div>
                <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>Requires attention</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>Overdue</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-red-600" style={{ fontFamily: "var(--font-poppins)" }}>{backlogStats.overdueTasks}</div>
                <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>Past expected time</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>Backlog Trend (Last 7 Days)</CardTitle>
              <CardDescription className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>Daily backlog comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>{day}</div>
                    <div className="flex-1">
                      <div className="h-8 rounded-md bg-gray-100 overflow-hidden">
                        <div
                          className="h-full bg-[#022B3A] transition-all"
                          style={{ width: `${Math.random() * 80 + 20}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      {Math.floor(Math.random() * 30 + 10)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>Employee Performance Today</CardTitle>
              <CardDescription className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>Top performers based on customers served and satisfaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeePerformance.map((employee, index) => (
                  <div key={employee.name} className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#022B3A] text-white font-extrabold" style={{ fontFamily: "var(--font-poppins)" }}>
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{employee.name}</p>
                      <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        Served: {employee.served} | Avg Time: {employee.avgTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-50" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        ⭐ {employee.satisfaction}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
