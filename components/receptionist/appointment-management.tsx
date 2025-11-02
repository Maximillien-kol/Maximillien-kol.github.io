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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, CheckCircle2, Clock, MapPin, User } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Appointment, Staff } from "@/lib/types/receptionist"
import { appointmentDb, staffDb, initializeSampleData } from "@/lib/db/receptionist"

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [actionSuccess, setActionSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    visitorName: "",
    visitorPhone: "",
    visitorEmail: "",
    visitorCompany: "",
    staffId: "",
    staffName: "",
    staffEmail: "",
    appointmentDate: new Date(),
    appointmentTime: "09:00",
    duration: 30,
    purpose: "",
    location: "",
    meetingRoom: "",
    priority: "normal" as const,
    notes: "",
  })

  useEffect(() => {
    initializeSampleData()
    loadData()
  }, [selectedDate])

  const loadData = () => {
    const dayAppointments = appointmentDb.getByDate(selectedDate)
    setAppointments(dayAppointments)
    setStaff(staffDb.getAll())
  }

  const handleSchedule = () => {
    if (!formData.visitorName || !formData.visitorPhone || !formData.staffId || !formData.purpose) {
      alert("Please fill in all required fields")
      return
    }

    const newAppointment = appointmentDb.create({
      visitorName: formData.visitorName,
      visitorPhone: formData.visitorPhone,
      visitorEmail: formData.visitorEmail || undefined,
      visitorCompany: formData.visitorCompany || undefined,
      staffId: formData.staffId,
      staffName: formData.staffName,
      staffEmail: formData.staffEmail || undefined,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      duration: formData.duration,
      purpose: formData.purpose,
      location: formData.location || undefined,
      meetingRoom: formData.meetingRoom || undefined,
      status: "scheduled",
      priority: formData.priority,
      notes: formData.notes || undefined,
      reminderSent: false,
      confirmationSent: false,
      createdBy: "receptionist-1",
    })

    setActionSuccess(true)
    setTimeout(() => {
      setActionSuccess(false)
      setIsDialogOpen(false)
      resetForm()
      loadData()
    }, 2000)
  }

  const handleStatusUpdate = (appointment: Appointment, newStatus: Appointment["status"]) => {
    appointmentDb.update(appointment.id, { status: newStatus })
    loadData()
  }

  const handleConfirm = (appointment: Appointment) => {
    appointmentDb.update(appointment.id, {
      status: "confirmed",
      confirmationSent: true,
    })
    loadData()
  }

  const resetForm = () => {
    setFormData({
      visitorName: "",
      visitorPhone: "",
      visitorEmail: "",
      visitorCompany: "",
      staffId: "",
      staffName: "",
      staffEmail: "",
      appointmentDate: new Date(),
      appointmentTime: "09:00",
      duration: 30,
      purpose: "",
      location: "",
      meetingRoom: "",
      priority: "normal",
      notes: "",
    })
  }

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
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

  const getPriorityColor = (priority: Appointment["priority"]) => {
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
    scheduled: appointments.filter((a) => a.status === "scheduled" || a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  }

  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9
    return `${hour.toString().padStart(2, "0")}:00`
  })

  return (
    <div className="space-y-4">
      {/* Calendar and Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl shadow-sm md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                  Appointment Calendar
                </CardTitle>
                <CardDescription className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </CardDescription>
              </div>
              <Button onClick={() => setIsDialogOpen(true)} style={{ backgroundColor: "#022B3A", fontFamily: "var(--font-space-grotesk)" }}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Scheduled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600" style={{ fontFamily: "var(--font-poppins)" }}>
                {stats.scheduled}
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
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Cancelled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600" style={{ fontFamily: "var(--font-poppins)" }}>
                {stats.cancelled}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Appointments List */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
            Appointments for {format(selectedDate, "MMM d, yyyy")}
          </CardTitle>
          <CardDescription className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {appointments.length} appointment{appointments.length !== 1 ? "s" : ""} scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {appointments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  No appointments scheduled for this date
                </div>
              ) : (
                appointments
                  .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime))
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
                    >
                      {/* Time */}
                      <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-[#022B3A] text-white">
                        <span className="text-lg font-bold" style={{ fontFamily: "var(--font-poppins)" }}>
                          {appointment.appointmentTime.split(":")[0]}
                        </span>
                        <span className="text-xs" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          {parseInt(appointment.appointmentTime.split(":")[0]) >= 12 ? "PM" : "AM"}
                        </span>
                      </div>

                      {/* Appointment Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold" style={{ fontFamily: "var(--font-poppins)" }}>
                            {appointment.visitorName}
                          </p>
                          <Badge className={cn("text-xs", getStatusColor(appointment.status))} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            {appointment.status}
                          </Badge>
                          <Badge className={cn("text-xs", getPriorityColor(appointment.priority))} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            {appointment.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          {appointment.purpose}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            With: {appointment.staffName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {appointment.duration} min
                          </span>
                          {appointment.meetingRoom && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {appointment.meetingRoom}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {appointment.status === "scheduled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirm(appointment)}
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                          >
                            <CheckCircle2 className="mr-2 h-3 w-3" />
                            Confirm
                          </Button>
                        )}
                        {appointment.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(appointment, "in-progress")}
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                          >
                            Start
                          </Button>
                        )}
                        {appointment.status === "in-progress" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(appointment, "completed")}
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                          >
                            Complete
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

      {/* Schedule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {!actionSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                  Schedule New Appointment
                </DialogTitle>
                <DialogDescription style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  Book an appointment and notify the staff member
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[500px]">
                <div className="grid gap-4 py-4 pr-4">
                  {/* Visitor Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        Visitor Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.visitorName}
                        onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                        placeholder="John Doe"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        Phone <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.visitorPhone}
                        onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
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
                        value={formData.visitorEmail}
                        onChange={(e) => setFormData({ ...formData, visitorEmail: e.target.value })}
                        placeholder="john@example.com"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Company</Label>
                      <Input
                        value={formData.visitorCompany}
                        onChange={(e) => setFormData({ ...formData, visitorCompany: e.target.value })}
                        placeholder="ABC Corporation"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      />
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      Staff Member <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.staffId}
                      onValueChange={(value) => {
                        const selectedStaff = staff.find((s) => s.id === value)
                        setFormData({
                          ...formData,
                          staffId: value,
                          staffName: selectedStaff?.name || "",
                          staffEmail: selectedStaff?.email || "",
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

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(formData.appointmentDate, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={formData.appointmentDate}
                            onSelect={(date) => date && setFormData({ ...formData, appointmentDate: date })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Time</Label>
                      <Select
                        value={formData.appointmentTime}
                        onValueChange={(value) => setFormData({ ...formData, appointmentTime: value })}
                      >
                        <SelectTrigger style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Duration (min)</Label>
                      <Select
                        value={formData.duration.toString()}
                        onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}
                      >
                        <SelectTrigger style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          <SelectItem value="15">15 min</SelectItem>
                          <SelectItem value="30">30 min</SelectItem>
                          <SelectItem value="45">45 min</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      Purpose <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      placeholder="Meeting, Interview, Consultation, etc."
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Location</Label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Building/Floor"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label style={{ fontFamily: "var(--font-space-grotesk)" }}>Meeting Room</Label>
                      <Input
                        value={formData.meetingRoom}
                        onChange={(e) => setFormData({ ...formData, meetingRoom: e.target.value })}
                        placeholder="Conference Room A"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      />
                    </div>
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
              </ScrollArea>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  Cancel
                </Button>
                <Button onClick={handleSchedule} style={{ backgroundColor: "#022B3A", fontFamily: "var(--font-space-grotesk)" }}>
                  Schedule Appointment
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
                Appointment has been scheduled successfully
              </p>
              <p className="text-sm text-muted-foreground mt-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {formData.staffName} will be notified
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
