"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, ChevronRight, Clock, LayoutDashboard, LogOut, Plus, Settings, TicketIcon, Users, GitBranch, ClipboardCheck, FileBarChart, CircleDot } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import CreateTicketDialog from "@/components/receptionist/create-ticket-dialog"
import QueueOverview from "@/components/receptionist/queue-overview"
import RouteCustomer from "@/components/receptionist/route-customer"
import CustomerStatus from "@/components/receptionist/customer-status"
import ReportsView from "@/components/receptionist/reports-view"
import NotificationsPanel from "@/components/receptionist/notifications-panel"
import AllTicketsView from "@/components/receptionist/all-tickets-view"
import { initializeSampleData, visitorDb, staffDb } from "@/lib/db/receptionist"

export default function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [dashboardStats, setDashboardStats] = useState({
    waiting: 0,
    avgWait: "0m",
    served: 0,
    active: 0,
    totalStaff: 0,
    totalCustomers: 0,
  })

  useEffect(() => {
    // Initialize sample data on mount
    initializeSampleData()
    loadDashboardStats()
  }, [])

  useEffect(() => {
    // Refresh stats when refreshKey changes (after ticket creation)
    loadDashboardStats()
  }, [refreshKey])

  const loadDashboardStats = () => {
    const visitors = visitorDb.getAll()
    const staff = staffDb.getAll()
    const waiting = visitors.filter(v => v.status === "waiting")
    const inProgress = visitors.filter(v => v.status === "in-progress")
    const completed = visitors.filter(v => v.status === "completed")

    setDashboardStats({
      waiting: waiting.length,
      avgWait: "12m",
      served: completed.length,
      active: inProgress.length,
      totalStaff: staff.length,
      totalCustomers: visitors.length,
    })
  }

  const handleTicketCreated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-screen bg-[#F8F9FA]">
        {/* Sidebar */}
        <aside 
          className={`hidden border-r bg-white lg:flex lg:flex-col py-4 fixed top-0 left-0 h-screen overflow-hidden transition-all duration-300 ease-in-out z-50 ${
            sidebarExpanded ? 'w-64 pl-[10px]' : 'w-16 pl-0'
          }`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
            <div className="flex h-full flex-col gap-6 ${sidebarExpanded ? 'px-6' : 'items-center'}">
            {/* Logo */}
            <div className={`flex items-center gap-3 mb-4 ${sidebarExpanded ? '' : 'justify-center'}`}>
              <div className="flex h-10 w-10 items-center justify-center flex-shrink-0">
                <img src="/logo.svg" alt="PillarQ Logo" className="h-7 w-7" />
              </div>
              {sidebarExpanded && (
                <span className="text-xl font-extrabold whitespace-nowrap" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                  PillarQ
                </span>
              )}
            </div>            {/* Navigation Icons */}
            <nav className={`flex flex-col gap-2 ${sidebarExpanded ? '' : 'items-center'}`}>
              <Button
                variant="ghost"
                className={`${sidebarExpanded ? 'justify-start w-full' : ''} ${activeTab === "overview" ? "bg-gray-100" : ""} h-10`}
                onClick={() => setActiveTab("overview")}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <LayoutDashboard className={`h-5 w-5 ${sidebarExpanded ? 'mr-3' : ''}`} />
                {sidebarExpanded && <span className="text-sm">Dashboard</span>}
              </Button>
              
              <Button
                variant="ghost"
                className={`${sidebarExpanded ? 'justify-start w-full' : ''} ${activeTab === "tickets" ? "bg-gray-100" : ""} h-10`}
                onClick={() => setActiveTab("tickets")}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <TicketIcon className={`h-5 w-5 ${sidebarExpanded ? 'mr-3' : ''}`} />
                {sidebarExpanded && <span className="text-sm">All Tickets</span>}
              </Button>
              
              <Button
                variant="ghost"
                className={`${sidebarExpanded ? 'justify-start w-full' : ''} ${activeTab === "queue" ? "bg-gray-100" : ""} h-10`}
                onClick={() => setActiveTab("queue")}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <Users className={`h-5 w-5 ${sidebarExpanded ? 'mr-3' : ''}`} />
                {sidebarExpanded && <span className="text-sm">Queue Overview</span>}
              </Button>
              
              <Button
                variant="ghost"
                className={`${sidebarExpanded ? 'justify-start w-full' : ''} ${activeTab === "route" ? "bg-gray-100" : ""} h-10`}
                onClick={() => setActiveTab("route")}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <GitBranch className={`h-5 w-5 ${sidebarExpanded ? 'mr-3' : ''}`} />
                {sidebarExpanded && <span className="text-sm">Route Customer</span>}
              </Button>
              
              <Button
                variant="ghost"
                className={`${sidebarExpanded ? 'justify-start w-full' : ''} ${activeTab === "status" ? "bg-gray-100" : ""} h-10`}
                onClick={() => setActiveTab("status")}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <ClipboardCheck className={`h-5 w-5 ${sidebarExpanded ? 'mr-3' : ''}`} />
                {sidebarExpanded && <span className="text-sm">Customer Status</span>}
              </Button>
              
              <Button
                variant="ghost"
                className={`${sidebarExpanded ? 'justify-start w-full' : ''} ${activeTab === "reports" ? "bg-gray-100" : ""} h-10`}
                onClick={() => setActiveTab("reports")}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <FileBarChart className={`h-5 w-5 ${sidebarExpanded ? 'mr-3' : ''}`} />
                {sidebarExpanded && <span className="text-sm">Reports</span>}
              </Button>
            </nav>

            {/* User Profile at bottom */}
            <div className={`mt-auto ${sidebarExpanded ? '' : 'flex justify-center'}`}>
              {sidebarExpanded ? (
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-[#022B3A]">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-[#022B3A] text-white text-xs" style={{ fontFamily: "var(--font-space-grotesk)" }}>RF</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-xs">
                    <p className="font-medium" style={{ fontFamily: "var(--font-space-grotesk)", color: "#022B3A" }}>Ricky Fajrin</p>
                    <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>Receptionist</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-offset-2 ring-[#022B3A]">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-[#022B3A] text-white text-xs" style={{ fontFamily: "var(--font-space-grotesk)" }}>RF</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </aside>

      {/* Main Content */}
      <main className="flex-1 ml-16">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h1 className="text-xl font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                Good morning, Ricky Fajrin 👋
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="relative rounded-lg h-10 w-10">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#022B3A] text-[10px] font-extrabold text-white" style={{ fontFamily: "var(--font-poppins)" }}>
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Top Action Buttons */}
              <div className="flex gap-2 justify-between">
                <div className="flex gap-2">
                  <Button
                    className="gap-2 bg-white hover:bg-gray-50 text-[#022B3A] pl-2 pr-3 py-1.5 text-xs h-8 font-medium  transition-colors"
                    onClick={() => setActiveTab("tickets")}
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    <div className="h-6 w-6 rounded-md bg-[#0EA5E9] flex items-center justify-center flex-shrink-0">
                      <TicketIcon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span>Tickets</span>
                  </Button>
                <Button
                  className="gap-2 bg-white hover:bg-gray-50 text-[#022B3A] pl-2 pr-3 py-1.5 text-xs h-8 font-medium  transition-colors"
                  onClick={() => setActiveTab("queue")}
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  <div className="h-6 w-6 rounded-md bg-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                    <Users className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span>Queue</span>
                </Button>
                <Button
                  className="gap-2 bg-white hover:bg-gray-50 text-[#022B3A] pl-2 pr-3 py-1.5 text-xs h-8 font-medium  transition-colors"
                  onClick={() => setActiveTab("route")}
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  <div className="h-6 w-6 rounded-md bg-[#F97316] flex items-center justify-center flex-shrink-0">
                    <ChevronRight className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span>Route</span>
                </Button>
                <Button
                  className="gap-2 bg-white hover:bg-gray-50 text-[#022B3A] pl-2 pr-3 py-1.5 text-xs h-8 font-medium  transition-colors"
                  onClick={() => setActiveTab("status")}
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  <div className="h-6 w-6 rounded-md bg-[#06B6D4] flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span>Status</span>
                </Button>
              </div>
              <Button
                className="gap-2 bg-[#022B3A] hover:bg-[#033d52] text-white pl-3 pr-4 py-1.5 text-xs h-8 font-medium transition-colors"
                onClick={() => setIsCreateTicketOpen(true)}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <Plus className="h-4 w-4" />
                <span>Create Ticket</span>
              </Button>
            </div>

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Queue */}
                <div className="lg:col-span-2 space-y-6">
                  <QueueOverview preview={true} />
                </div>

                {/* Right Column - Notifications & Stats */}
                <div className="space-y-1">
                  <NotificationsPanel />
                  
                  {/* Stats Cards - 2x2 Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Card className="rounded-lg shadow-sm">
                      <CardContent className="p-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="h-5 w-5 rounded bg-[#BFDBF7] flex items-center justify-center">
                            <Users className="h-3 w-3 text-[#022B3A]" />
                          </div>
                          <div className="text-xs font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{dashboardStats.waiting}</div>
                        </div>
                        <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>Waiting</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="rounded-lg shadow-sm">
                      <CardContent className="p-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="h-5 w-5 rounded bg-[#BFDBF7] flex items-center justify-center">
                            <Clock className="h-3 w-3 text-[#022B3A]" />
                          </div>
                          <div className="text-xs font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{dashboardStats.avgWait}</div>
                        </div>
                        <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>Avg Wait</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="rounded-lg shadow-sm">
                      <CardContent className="p-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="h-5 w-5 rounded bg-[#BFDBF7] flex items-center justify-center">
                            <TicketIcon className="h-3 w-3 text-[#022B3A]" />
                          </div>
                          <div className="text-xs font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{dashboardStats.served}</div>
                        </div>
                        <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>Served</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="rounded-lg shadow-sm">
                      <CardContent className="p-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="h-5 w-5 rounded bg-[#BFDBF7] flex items-center justify-center">
                            <ChevronRight className="h-3 w-3 text-[#022B3A]" />
                          </div>
                          <div className="text-xs font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{dashboardStats.active}</div>
                        </div>
                        <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>Active</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* System Overview Card */}
                  <Card className="rounded-lg shadow-sm mt-2">
                    <CardContent className="p-3">
                      <h3 className="text-sm font-extrabold mb-2" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>System Overview</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>Total Staff Members</span>
                          <Badge variant="secondary" className="text-xs">{dashboardStats.totalStaff}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>Total Customers</span>
                          <Badge variant="secondary" className="text-xs">{dashboardStats.totalCustomers}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tickets" && <AllTicketsView key={refreshKey} />}
          {activeTab === "queue" && <QueueOverview preview={false} key={refreshKey} />}
          {activeTab === "route" && <RouteCustomer key={refreshKey} />}
          {activeTab === "status" && <CustomerStatus key={refreshKey} />}
          {activeTab === "reports" && <ReportsView />}
        </div>
      </main>

      {/* Create Ticket Dialog */}
      <CreateTicketDialog 
        open={isCreateTicketOpen} 
        onOpenChange={setIsCreateTicketOpen}
        onTicketCreated={handleTicketCreated}
      />
      </div>
    </TooltipProvider>
  )
}
