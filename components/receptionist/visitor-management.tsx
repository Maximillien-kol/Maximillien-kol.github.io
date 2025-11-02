"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, UserPlus, Clock, CheckCircle2, X, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Visitor, Staff } from "@/lib/types/receptionist"
import { visitorDb, staffDb, initializeSampleData } from "@/lib/db/receptionist"

export default function VisitorManagement() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [actionSuccess, setActionSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    purposeOfVisit: "",
    hostStaffId: "",
    hostStaffName: "",
    priority: "normal" as const,
    notes: "",
  })

  useEffect(() => {
    initializeSampleData()
    loadData()
  }, [])

  const loadData = () => {
    setVisitors(visitorDb.getToday())
    setStaff(staffDb.getAll())
  }

  const filteredVisitors = visitors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone.includes(searchQuery)
  )

  const handleCheckIn = () => {
    if (!formData.name || !formData.phone || !formData.purposeOfVisit) {
      alert("Please fill in all required fields")
      return
    }

    const newVisitor = visitorDb.create({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      company: formData.company,
      purposeOfVisit: formData.purposeOfVisit,
      hostStaffId: formData.hostStaffId || undefined,
      hostStaffName: formData.hostStaffName || undefined,
      checkInTime: new Date().toISOString(),
      status: "waiting",
      priority: formData.priority,
      notes: formData.notes || undefined,
    })

    setActionSuccess(true)
    setTimeout(() => {
      setActionSuccess(false)
      setIsDialogOpen(false)
      resetForm()
      loadData()
    }, 2000)
  }

  const handleStatusUpdate = (visitor: Visitor, newStatus: Visitor["status"]) => {
    const updates: Partial<Visitor> = { status: newStatus }
    if (newStatus === "completed") {
      updates.checkOutTime = new Date().toISOString()
    }
    visitorDb.update(visitor.id, updates)
    loadData()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      company: "",
      purposeOfVisit: "",
      hostStaffId: "",
      hostStaffName: "",
      priority: "normal",
      notes: "",
    })
  }

  const getStatusColor = (status: Visitor["status"]) => {
    switch (status) {
      case "waiting":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: Visitor["priority"]) => {
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

  const stats = {
    waiting: visitors.filter((v) => v.status === "waiting").length,
    inProgress: visitors.filter((v) => v.status === "in-progress").length,
    completed: visitors.filter((v) => v.status === "completed").length,
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Total Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-poppins)" }}>
              {visitors.length}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Waiting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600" style={{ fontFamily: "var(--font-poppins)" }}>
              {stats.waiting}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" style={{ fontFamily: "var(--font-poppins)" }}>
              {stats.inProgress}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-poppins)" }}>
              {stats.completed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Check-in */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                Visitor Management
              </CardTitle>
              <CardDescription className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Check-in visitors and track their status
              </CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)} style={{ backgroundColor: "#022B3A", fontFamily: "var(--font-space-grotesk)" }}>
              <UserPlus className="mr-2 h-4 w-4" />
              Check In Visitor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, ticket number, or phone..."
              className="pl-10"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {filteredVisitors.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  No visitors found. Check in a new visitor to get started.
                </div>
              ) : (
                filteredVisitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  >
                    {/* Ticket & Avatar */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#022B3A] text-white font-bold text-sm" style={{ fontFamily: "var(--font-poppins)" }}>
                        {visitor.ticketNumber.replace(/\D/g, "").slice(-4)}
                      </div>
                      <Avatar>
                        <AvatarFallback>
                          {visitor.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Visitor Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold" style={{ fontFamily: "var(--font-poppins)" }}>
                          {visitor.name}
                        </p>
                        <Badge className={cn("text-xs", getStatusColor(visitor.status))} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          {visitor.status.replace("-", " ")}
                        </Badge>
                        <Badge className={cn("text-xs", getPriorityColor(visitor.priority))} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          {visitor.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {visitor.purposeOfVisit}
                        {visitor.company && ` • ${visitor.company}`}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Check-in: {new Date(visitor.checkInTime).toLocaleTimeString()}
                        </span>
                        {visitor.hostStaffName && (
                          <span className="flex items-center gap-1">
                            <Bell className="h-3 w-3" />
                            Host: {visitor.hostStaffName}
                          </span>
                        )}
                        <span>{visitor.phone}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {visitor.status === "waiting" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(visitor, "in-progress")}
                          style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                          Start Service
                        </Button>
                      )}
                      {visitor.status === "in-progress" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(visitor, "completed")}
                          style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                          <CheckCircle2 className="mr-2 h-3 w-3" />
                          Complete
                        </Button>
                      )}
                      {(visitor.status === "waiting" || visitor.status === "in-progress") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleStatusUpdate(visitor, "cancelled")}
                          style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                          <X className="mr-2 h-3 w-3" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Check-in Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {!actionSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                  Check In New Visitor
                </DialogTitle>
                <DialogDescription style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  Enter visitor details to generate a ticket and notify the host
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Company</Label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="ABC Corporation"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    Purpose of Visit <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.purposeOfVisit}
                    onChange={(e) => setFormData({ ...formData, purposeOfVisit: e.target.value })}
                    placeholder="Meeting, Interview, Delivery, etc."
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Host Staff Member</Label>
                    <Select
                      value={formData.hostStaffId}
                      onValueChange={(value) => {
                        const selectedStaff = staff.find((s) => s.id === value)
                        setFormData({
                          ...formData,
                          hostStaffId: value,
                          hostStaffName: selectedStaff?.name || "",
                        })
                      }}
                    >
                      <SelectTrigger style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {staff.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} - {s.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  Cancel
                </Button>
                <Button onClick={handleCheckIn} style={{ backgroundColor: "#022B3A", fontFamily: "var(--font-space-grotesk)" }}>
                  Check In Visitor
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                Success!
              </h3>
              <p className="text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Visitor has been checked in successfully
              </p>
              {formData.hostStaffName && (
                <p className="text-sm text-muted-foreground mt-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {formData.hostStaffName} has been notified
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
