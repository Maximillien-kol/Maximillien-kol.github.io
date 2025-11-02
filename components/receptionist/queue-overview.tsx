"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, User, Phone, Mail, ChevronRight, AlertCircle, HelpCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { visitorDb, staffDb } from "@/lib/db/receptionist"

interface QueueOverviewProps {
  preview?: boolean
}

interface Customer {
  id: string
  ticketNumber: string
  name: string
  phone: string
  email?: string
  service: string
  priority: "low" | "normal" | "high" | "urgent"
  status: "waiting" | "in-progress" | "called"
  estimatedWaitTime: number
  checkInTime: string
  type: "walk-in" | "virtual"
}

export default function QueueOverview({ preview = false }: QueueOverviewProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [topStaff, setTopStaff] = useState<Array<{ id: string, name: string, role: string, points: number, avatar: string }>>([])
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [selectedStaffId, setSelectedStaffId] = useState<string>("")
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false)
  const [isQueueDialogOpen, setIsQueueDialogOpen] = useState(false)

  useEffect(() => {
    // Load real visitor data
    const visitors = visitorDb.getAll()
    const customerData: Customer[] = visitors.map(visitor => ({
      id: visitor.id,
      ticketNumber: visitor.ticketNumber,
      name: visitor.name,
      phone: visitor.phone,
      email: visitor.email,
      service: visitor.purposeOfVisit,
      priority: visitor.priority,
      status: visitor.status as "waiting" | "in-progress" | "called",
      estimatedWaitTime: Math.floor(Math.random() * 20) + 5,
      checkInTime: new Date(visitor.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: "walk-in" as const,
    }))
    setCustomers(customerData)

    // Load staff data
    const staff = staffDb.getAll()
    const staffData = staff.map(s => ({
      id: s.id,
      name: s.name,
      role: s.position,
      points: Math.floor(Math.random() * 50) + 50, // Random points for demo
      avatar: "/placeholder.jpg"
    }))
    setTopStaff(staffData)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-green-100 text-green-800"
      case "called":
        return "bg-yellow-100 text-yellow-800"
      case "waiting":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const displayCustomers = preview ? customers.slice(0, 3) : customers

  // Calculate stats from real customer data
  const waitingCount = customers.filter(c => c.status === "waiting").length
  const inProgressCount = customers.filter(c => c.status === "in-progress").length
  const completedCount = customers.filter(c => c.status === "called").length
  const totalCount = customers.length || 1 // Avoid division by zero

  const contentStats = [
    { label: "Completed", count: completedCount, color: "#6C5CE7", percentage: `${Math.round((completedCount / totalCount) * 100)}%` },
    { label: "In Progress", count: inProgressCount, color: "#06B6D4", percentage: `${Math.round((inProgressCount / totalCount) * 100)}%` },
    { label: "Waiting", count: waitingCount, color: "#FFA500", percentage: `${Math.round((waitingCount / totalCount) * 100)}%` },
  ]

  const totalContents = contentStats.reduce((sum, stat) => sum + stat.count, 0)

  // Convert customers to waiting tickets format
  const waitingTickets = customers
    .filter(c => c.status === "waiting")
    .map(c => {
      const initials = c.name.split(' ').map(n => n[0]).join('')
      return {
        id: c.id,
        ticketNumber: c.ticketNumber,
        customer: c.name,
        service: c.service,
        priority: c.priority,
        waitTime: c.estimatedWaitTime ? `${c.estimatedWaitTime} min` : "N/A",
        customerAvatar: "/placeholder.jpg",
        customerInitials: initials
      }
    })

  const handleAssignStaff = (ticketId: string) => {
    setSelectedTicket(ticketId)
    setSelectedStaffId("")
    setIsAssignDialogOpen(true)
  }

  const handleConfirmAssignment = () => {
    if (selectedTicket && selectedStaffId) {
      // Update visitor status to in-progress
      visitorDb.update(selectedTicket, { 
        status: "in-progress",
        notes: `Assigned to staff member ${selectedStaffId}`
      })
      
      // Reload data
      const visitors = visitorDb.getAll()
      const customerData: Customer[] = visitors.map(visitor => ({
        id: visitor.id,
        ticketNumber: visitor.ticketNumber,
        name: visitor.name,
        phone: visitor.phone,
        email: visitor.email,
        service: visitor.purposeOfVisit,
        priority: visitor.priority,
        status: visitor.status as "waiting" | "in-progress" | "called",
        estimatedWaitTime: Math.floor(Math.random() * 20) + 5,
        checkInTime: new Date(visitor.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: "walk-in" as const,
      }))
      setCustomers(customerData)
      
      // Close dialog
      setIsAssignDialogOpen(false)
      setSelectedTicket(null)
      setSelectedStaffId("")
    }
  }

  return (
    <div className="space-y-4">
      {/* Customer performance and Top staff - Two Column Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Customer performance Card */}
        <Card className="rounded-2xl shadow-sm h-[300px] flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                Customer performance
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-gray-600">
                By status
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-6">
              {/* Donut Chart */}
              <div className="relative flex items-center justify-center">
                <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="70"
                    cy="70"
                    r="50"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="24"
                  />
                  {/* Render each segment based on real data */}
                  {contentStats.map((stat, index) => {
                    const percentage = (stat.count / totalCount) * 100
                    const circumference = 314 // 2 * PI * radius (approximately)
                    const dashArray = `${(percentage / 100) * circumference} ${circumference}`
                    
                    // Calculate offset based on previous segments
                    let offset = 0
                    for (let i = 0; i < index; i++) {
                      const prevPercentage = (contentStats[i].count / totalCount) * 100
                      offset += (prevPercentage / 100) * circumference
                    }
                    
                    return (
                      <circle
                        key={stat.label}
                        cx="70"
                        cy="70"
                        r="50"
                        fill="none"
                        stroke={stat.color}
                        strokeWidth="24"
                        strokeDasharray={dashArray}
                        strokeDashoffset={-offset}
                      />
                    )
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>Customers</span>
                  <span className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{totalContents}</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-2">
                {contentStats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
                      <span className="text-xs text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>{stat.label}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>{stat.percentage}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top staff Card */}
        <Card className="rounded-2xl shadow-sm h-[300px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              Top staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topStaff.map((staff, index) => (
                <div key={staff.id} className="flex items-center gap-3">
                  <span className="text-xs font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>#{index + 1}</span>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={staff.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 text-xs font-extrabold">
                      {staff.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-xs font-medium" style={{ fontFamily: "var(--font-space-grotesk)", color: "#022B3A" }}>{staff.name}</p>
                    <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>{staff.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                      <span className="text-white text-xs">●</span>
                    </div>
                    <span className="text-xs font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{staff.points}pts</span>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="link" 
              className="w-full mt-4 text-[#6C5CE7] hover:text-[#5B4CD6] hover:underline text-xs font-medium" 
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              onClick={() => setIsStaffDialogOpen(true)}
            >
              View all →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Waiting Queue Section */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
            Waiting Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-12 text-xs font-medium text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>Ticket</TableHead>
                  <TableHead className="text-xs font-medium text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>Customer</TableHead>
                  <TableHead className="text-xs font-medium text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>Service</TableHead>
                  <TableHead className="text-xs font-medium text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>Priority</TableHead>
                  <TableHead className="text-xs font-medium text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>Wait Time</TableHead>
                  <TableHead className="w-32"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitingTickets.map((ticket, index) => (
                  <TableRow key={ticket.id} className="hover:bg-gray-50">
                    <TableCell className="text-sm font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                      #{ticket.ticketNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={ticket.customerAvatar} />
                          <AvatarFallback className="bg-[#06B6D4] text-white text-xs font-extrabold">
                            {ticket.customerInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)", color: "#022B3A" }}>{ticket.customer}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>{ticket.service}</p>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          ticket.priority === 'urgent' ? 'bg-red-100 text-red-700 border-red-300' :
                          ticket.priority === 'high' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                          'bg-blue-100 text-blue-700 border-blue-300'
                        }`}
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          {ticket.waitTime}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg text-xs font-medium" 
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                        onClick={() => handleAssignStaff(ticket.id)}
                      >
                        Assign Staff
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button 
            variant="link" 
            className="w-full mt-4 text-[#6C5CE7] hover:text-[#5B4CD6] hover:underline text-xs font-medium" 
            style={{ fontFamily: "var(--font-space-grotesk)" }}
            onClick={() => setIsQueueDialogOpen(true)}
          >
            View all →
          </Button>
        </CardContent>
      </Card>

      {/* Top Staff Dialog */}
      <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              <User className="h-5 w-5" />
              All Staff Members
            </DialogTitle>
            <DialogDescription style={{ fontFamily: "var(--font-space-grotesk)" }}>
              View performance and rankings of all staff members
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between py-2">
            <Badge variant="secondary" className="bg-[#BFDBF7] text-[#022B3A] border-0 text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {topStaff.length} Staff Members
            </Badge>
          </div>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {topStaff.length === 0 ? (
                <div className="text-center py-8 text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  No staff members found
                </div>
              ) : (
                topStaff.map((staff, index) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white hover:border-[#6C5CE7]/50 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#6C5CE7] text-white font-extrabold text-sm" style={{ fontFamily: "var(--font-poppins)" }}>
                        #{index + 1}
                      </div>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={staff.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 text-sm font-extrabold">
                          {staff.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                          {staff.name}
                        </p>
                        <p className="text-sm text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          {staff.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                        <span className="text-white text-xs">●</span>
                      </div>
                      <span className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                        {staff.points}
                      </span>
                      <span className="text-sm text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        pts
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsStaffDialogOpen(false)}
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Waiting Queue Dialog */}
      <Dialog open={isQueueDialogOpen} onOpenChange={setIsQueueDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              <Clock className="h-5 w-5" />
              All Waiting Tickets
            </DialogTitle>
            <DialogDescription style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Complete list of customers waiting in the queue
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 py-2">
            <Badge variant="secondary" className="bg-[#BFDBF7] text-[#022B3A] border-0 text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {waitingTickets.length} Waiting
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-0 text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {waitingTickets.filter(t => t.priority === 'urgent' || t.priority === 'high').length} High Priority
            </Badge>
          </div>
          <ScrollArea className="h-[450px]">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="w-12 text-xs font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>Ticket</TableHead>
                    <TableHead className="text-xs font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>Customer</TableHead>
                    <TableHead className="text-xs font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>Service</TableHead>
                    <TableHead className="text-xs font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>Priority</TableHead>
                    <TableHead className="text-xs font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>Wait Time</TableHead>
                    <TableHead className="w-32"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitingTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        No customers waiting in queue
                      </TableCell>
                    </TableRow>
                  ) : (
                    waitingTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="hover:bg-gray-50">
                        <TableCell className="text-sm font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                          #{ticket.ticketNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={ticket.customerAvatar} />
                              <AvatarFallback className="bg-[#06B6D4] text-white text-xs font-extrabold">
                                {ticket.customerInitials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)", color: "#022B3A" }}>{ticket.customer}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>{ticket.service}</p>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              ticket.priority === 'urgent' ? 'bg-red-100 text-red-700 border-red-300' :
                              ticket.priority === 'high' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                              'bg-blue-100 text-blue-700 border-blue-300'
                            }`}
                          >
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                              {ticket.waitTime}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg text-xs font-medium" 
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                            onClick={() => {
                              setIsQueueDialogOpen(false)
                              handleAssignStaff(ticket.id)
                            }}
                          >
                            Assign Staff
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsQueueDialogOpen(false)}
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Staff Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              Assign Staff Member
            </DialogTitle>
            <DialogDescription style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Select a staff member to assign to this customer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)", color: "#022B3A" }}>
                Select Staff Member
              </label>
              <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                <SelectTrigger className="w-full" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  <SelectValue placeholder="Choose a staff member" />
                </SelectTrigger>
                <SelectContent>
                  {topStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      <div className="flex items-center gap-2">
                        <span>{staff.name}</span>
                        <span className="text-xs text-gray-500">({staff.role})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsAssignDialogOpen(false)}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#022B3A] hover:bg-[#033d52]"
                onClick={handleConfirmAssignment}
                disabled={!selectedStaffId}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
