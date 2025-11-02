"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Calendar as CalendarIcon, X, Edit, CheckCircle2, Clock, Activity, User } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { visitorDb, ticketLifecycleDb } from "@/lib/db/receptionist"
import { Visitor } from "@/lib/types/receptionist"
import TicketLifecycleTracker from "./ticket-lifecycle-tracker"

export default function CustomerStatus() {
  const [customers, setCustomers] = useState<Visitor[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Visitor | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLifecycleDialogOpen, setIsLifecycleDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"reschedule" | "cancel" | "update" | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<Date>()
  const [actionSuccess, setActionSuccess] = useState(false)

  // Load customers on mount
  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = () => {
    const allVisitors = visitorDb.getAll()
    setCustomers(allVisitors)
  }

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAction = (customer: Visitor, type: "reschedule" | "cancel" | "update") => {
    setSelectedCustomer(customer)
    setActionType(type)
    setIsDialogOpen(true)
  }

  const handleViewLifecycle = (customer: Visitor) => {
    setSelectedCustomer(customer)
    setIsLifecycleDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedCustomer && actionType) {
      if (actionType === "cancel") {
        visitorDb.update(selectedCustomer.id, { status: "cancelled" })
      } else if (actionType === "reschedule") {
        visitorDb.update(selectedCustomer.id, { status: "waiting" })
      } else if (actionType === "update") {
        visitorDb.update(selectedCustomer.id, { notes: selectedCustomer.notes })
      }
      
      setActionSuccess(true)
      loadCustomers() // Refresh the list
      
      setTimeout(() => {
        setActionSuccess(false)
        setIsDialogOpen(false)
        setSelectedCustomer(null)
        setActionType(null)
      }, 2000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "rescheduled":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>Customer Status Management</CardTitle>
          <CardDescription className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>Reschedule, cancel, or update customer tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or ticket number..."
                className="pl-10"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  {/* Ticket & Avatar */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#022B3A] text-white font-extrabold text-sm">
                      {customer.ticketNumber.replace("T", "")}
                    </div>
                    <Avatar>
                      <AvatarFallback>
                        {customer.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Customer Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{customer.name}</p>
                      <Badge className={cn("text-xs", getStatusColor(customer.status))} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {customer.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>{customer.purposeOfVisit}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Check-in: {new Date(customer.checkInTime).toLocaleTimeString()}
                      </span>
                      <span>{customer.phone}</span>
                      {customer.email && <span>{customer.email}</span>}
                    </div>
                    {customer.hostStaffName && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          <User className="mr-1 h-3 w-3" />
                          Assigned to: {customer.hostStaffName}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Priority */}
                  <Badge className={cn("text-xs", getPriorityColor(customer.priority))} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    {customer.priority}
                  </Badge>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewLifecycle(customer)}
                      style={{ fontFamily: "var(--font-space-grotesk)", backgroundColor: "#022B3A", color: "white" }}
                    >
                      <Activity className="mr-2 h-3 w-3" />
                      Track
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(customer, "update")}
                      disabled={customer.status === "completed" || customer.status === "cancelled"}
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Update
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleAction(customer, "cancel")}
                      disabled={customer.status === "completed" || customer.status === "cancelled"}
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      <X className="mr-2 h-3 w-3" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {!actionSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                  {actionType === "reschedule" && "Reschedule Appointment"}
                  {actionType === "cancel" && "Cancel Ticket"}
                  {actionType === "update" && "Update Ticket"}
                </DialogTitle>
                <DialogDescription style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {selectedCustomer?.ticketNumber} - {selectedCustomer?.name}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  {actionType === "reschedule" && (
                    <>
                      <div className="space-y-2">
                        <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>New Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>New Time</Label>
                        <Select defaultValue="09:00">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 9 }, (_, i) => i + 9).map((hour) => (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {actionType === "cancel" && (
                    <div className="space-y-2">
                      <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Cancellation Reason</Label>
                      <Textarea placeholder="Optional: Provide a reason for cancellation..." style={{ fontFamily: "var(--font-space-grotesk)" }} />
                    </div>
                  )}

                  {actionType === "update" && (
                    <>
                      <div className="space-y-2">
                        <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Service Type</Label>
                        <Select defaultValue={selectedCustomer?.purposeOfVisit}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                            <SelectItem value="Account Services">Account Services</SelectItem>
                            <SelectItem value="Billing Support">Billing Support</SelectItem>
                            <SelectItem value="Technical Support">Technical Support</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Priority</Label>
                        <Select defaultValue={selectedCustomer?.priority}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Notes</Label>
                        <Textarea placeholder="Add any additional notes..." style={{ fontFamily: "var(--font-space-grotesk)" }} />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    Cancel
                  </Button>
                  <Button type="submit" style={{ backgroundColor: "#022B3A", fontFamily: "var(--font-space-grotesk)" }}>
                    Confirm {actionType}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>Success!</h3>
              <p className="text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {actionType === "cancel" && "Ticket has been cancelled"}
                {actionType === "reschedule" && "Appointment has been rescheduled"}
                {actionType === "update" && "Ticket has been updated"}
              </p>
              <p className="text-sm text-muted-foreground mt-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Customer will be notified via SMS/Email
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ticket Lifecycle Tracker Dialog */}
      <Dialog open={isLifecycleDialogOpen} onOpenChange={setIsLifecycleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-2xl" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              Ticket Lifecycle Tracker
            </DialogTitle>
            <DialogDescription style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Complete flow from submission to resolution
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <TicketLifecycleTracker 
              ticketId={selectedCustomer.id}
              onUpdate={() => {
                loadCustomers()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
