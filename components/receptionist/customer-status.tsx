"use client"

import { useState } from "react"
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
import { Search, Calendar as CalendarIcon, X, Edit, CheckCircle2, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Customer {
  id: string
  ticketNumber: string
  name: string
  phone: string
  email?: string
  service: string
  priority: "low" | "normal" | "high" | "urgent"
  status: "waiting" | "in-progress" | "completed" | "cancelled" | "rescheduled"
  checkInTime: string
  appointmentDate?: Date
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    ticketNumber: "T0001",
    name: "Adit Irwan",
    phone: "+1 (555) 123-4567",
    email: "adit@example.com",
    service: "Account Services",
    priority: "urgent",
    status: "in-progress",
    checkInTime: "09:15 AM",
  },
  {
    id: "2",
    ticketNumber: "T0002",
    name: "Arif Brata",
    phone: "+1 (555) 234-5678",
    service: "General Inquiry",
    priority: "normal",
    status: "waiting",
    checkInTime: "09:22 AM",
  },
  {
    id: "3",
    ticketNumber: "T0003",
    name: "Ardhi Irwandi",
    phone: "+1 (555) 345-6789",
    email: "ardhi@example.com",
    service: "Billing Support",
    priority: "high",
    status: "completed",
    checkInTime: "08:30 AM",
  },
]

export default function CustomerStatus() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"reschedule" | "cancel" | "update" | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<Date>()
  const [actionSuccess, setActionSuccess] = useState(false)

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAction = (customer: Customer, type: "reschedule" | "cancel" | "update") => {
    setSelectedCustomer(customer)
    setActionType(type)
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedCustomer && actionType) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === selectedCustomer.id) {
            if (actionType === "cancel") {
              return { ...c, status: "cancelled" as const }
            } else if (actionType === "reschedule") {
              return { ...c, status: "rescheduled" as const, appointmentDate: date }
            }
          }
          return c
        })
      )
      
      setActionSuccess(true)
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
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Status Management</CardTitle>
          <CardDescription>Reschedule, cancel, or update customer tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or ticket number..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
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
      <Card>
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#022B3A] text-white font-bold text-sm">
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
                      <p className="font-semibold">{customer.name}</p>
                      <Badge className={cn("text-xs", getStatusColor(customer.status))}>
                        {customer.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{customer.service}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Check-in: {customer.checkInTime}
                      </span>
                      <span>{customer.phone}</span>
                      {customer.email && <span>{customer.email}</span>}
                    </div>
                    {customer.appointmentDate && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          Rescheduled to: {format(customer.appointmentDate, "PPP p")}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Priority */}
                  <Badge className={cn("text-xs", getPriorityColor(customer.priority))}>
                    {customer.priority}
                  </Badge>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(customer, "reschedule")}
                      disabled={customer.status === "completed" || customer.status === "cancelled"}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      Reschedule
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(customer, "update")}
                      disabled={customer.status === "completed" || customer.status === "cancelled"}
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
                <DialogTitle>
                  {actionType === "reschedule" && "Reschedule Appointment"}
                  {actionType === "cancel" && "Cancel Ticket"}
                  {actionType === "update" && "Update Ticket"}
                </DialogTitle>
                <DialogDescription>
                  {selectedCustomer?.ticketNumber} - {selectedCustomer?.name}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  {actionType === "reschedule" && (
                    <>
                      <div className="space-y-2">
                        <Label>New Date</Label>
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
                        <Label>New Time</Label>
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
                      <Label>Cancellation Reason</Label>
                      <Textarea placeholder="Optional: Provide a reason for cancellation..." />
                    </div>
                  )}

                  {actionType === "update" && (
                    <>
                      <div className="space-y-2">
                        <Label>Service Type</Label>
                        <Select defaultValue={selectedCustomer?.service}>
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
                        <Label>Priority</Label>
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
                        <Label>Notes</Label>
                        <Textarea placeholder="Add any additional notes..." />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" style={{ backgroundColor: "#022B3A" }}>
                    Confirm {actionType}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Success!</h3>
              <p className="text-muted-foreground">
                {actionType === "cancel" && "Ticket has been cancelled"}
                {actionType === "reschedule" && "Appointment has been rescheduled"}
                {actionType === "update" && "Ticket has been updated"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Customer will be notified via SMS/Email
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
