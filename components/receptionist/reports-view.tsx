"use client"

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

export default function ReportsView() {
  const todayStats = {
    totalCustomers: 156,
    served: 142,
    cancelled: 8,
    rescheduled: 6,
    avgWaitTime: "12 min",
    avgServiceTime: "8 min",
    peakHour: "10:00 AM - 11:00 AM",
    customerSatisfaction: "4.5/5.0",
  }

  const backlogStats = {
    currentBacklog: 24,
    estimatedClearTime: "2 hours",
    highPriority: 3,
    overdueTasks: 2,
  }

  const employeePerformance = [
    { name: "Sarah Wilson", served: 18, avgTime: "7 min", satisfaction: "4.8" },
    { name: "John Smith", served: 16, avgTime: "9 min", satisfaction: "4.6" },
    { name: "Emily Davis", served: 15, avgTime: "8 min", satisfaction: "4.7" },
    { name: "Mike Johnson", served: 14, avgTime: "10 min", satisfaction: "4.5" },
    { name: "David Brown", served: 12, avgTime: "8 min", satisfaction: "4.4" },
  ]

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">Daily summary and performance overview</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Summary</TabsTrigger>
          <TabsTrigger value="backlog">Backlog Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Daily Summary Tab */}
        <TabsContent value="daily" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-green-600">+12%</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers Served</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats.served}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((todayStats.served / todayStats.totalCustomers) * 100)}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats.avgWaitTime}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-green-600">-3 min</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats.customerSatisfaction}</div>
                <p className="text-xs text-muted-foreground mt-1">Based on 89 responses</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Details */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Hourly Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Hourly Customer Distribution</CardTitle>
                <CardDescription>Customer check-ins throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hourlyData.map((data) => (
                    <div key={data.hour} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium">{data.hour}</div>
                      <div className="flex-1">
                        <div className="h-8 rounded-md bg-gray-100 overflow-hidden">
                          <div
                            className="h-full bg-[#022B3A] transition-all"
                            style={{ width: `${(data.customers / 28) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-12 text-sm text-muted-foreground">{data.customers}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Service Type Breakdown</CardTitle>
                <CardDescription>Most requested services today</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[340px]">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Account Services</p>
                        <p className="text-xs text-muted-foreground">45 requests</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-100">
                          <div className="h-full w-[60%] rounded-full bg-blue-500" />
                        </div>
                        <span className="text-sm font-medium">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">General Inquiry</p>
                        <p className="text-xs text-muted-foreground">32 requests</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-100">
                          <div className="h-full w-[43%] rounded-full bg-green-500" />
                        </div>
                        <span className="text-sm font-medium">43%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Technical Support</p>
                        <p className="text-xs text-muted-foreground">28 requests</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-100">
                          <div className="h-full w-[37%] rounded-full bg-orange-500" />
                        </div>
                        <span className="text-sm font-medium">37%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Billing Support</p>
                        <p className="text-xs text-muted-foreground">24 requests</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-100">
                          <div className="h-full w-[32%] rounded-full bg-purple-500" />
                        </div>
                        <span className="text-sm font-medium">32%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Consultation</p>
                        <p className="text-xs text-muted-foreground">19 requests</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-100">
                          <div className="h-full w-[25%] rounded-full bg-pink-500" />
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayStats.peakHour}</div>
                <p className="text-xs text-muted-foreground mt-1">Highest traffic period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Cancellations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {todayStats.cancelled}
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((todayStats.cancelled / todayStats.totalCustomers) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Rescheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {todayStats.rescheduled}
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((todayStats.rescheduled / todayStats.totalCustomers) * 100)}% of total
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Backlog Overview Tab */}
        <TabsContent value="backlog" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Backlog</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{backlogStats.currentBacklog}</div>
                <p className="text-xs text-muted-foreground mt-1">Customers waiting</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Est. Clear Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{backlogStats.estimatedClearTime}</div>
                <p className="text-xs text-muted-foreground mt-1">At current pace</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{backlogStats.highPriority}</div>
                <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{backlogStats.overdueTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">Past expected time</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Backlog Trend (Last 7 Days)</CardTitle>
              <CardDescription>Daily backlog comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium">{day}</div>
                    <div className="flex-1">
                      <div className="h-8 rounded-md bg-gray-100 overflow-hidden">
                        <div
                          className="h-full bg-[#022B3A] transition-all"
                          style={{ width: `${Math.random() * 80 + 20}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-sm text-muted-foreground">
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
          <Card>
            <CardHeader>
              <CardTitle>Employee Performance Today</CardTitle>
              <CardDescription>Top performers based on customers served and satisfaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeePerformance.map((employee, index) => (
                  <div key={employee.name} className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#022B3A] text-white font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Served: {employee.served} | Avg Time: {employee.avgTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-50">
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
