"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircle2, UserCheck, UserX } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { visitorDb, staffDb, ticketLifecycleDb } from "@/lib/db/receptionist"
import { Staff } from "@/lib/types/receptionist"

interface CreateTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTicketCreated?: () => void
}

export default function CreateTicketDialog({ open, onOpenChange, onTicketCreated }: CreateTicketDialogProps) {
  const [visitType, setVisitType] = useState<"walk-in" | "virtual">("walk-in")
  const [date, setDate] = useState<Date>()
  const [ticketCreated, setTicketCreated] = useState(false)
  const [ticketNumber, setTicketNumber] = useState("")
  const [staff, setStaff] = useState<Staff[]>([])
  const [selectedStaffId, setSelectedStaffId] = useState<string>("")
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    idNumber: "",
    service: "",
    priority: "normal" as "low" | "normal" | "high" | "urgent",
    time: "09:00",
    notes: "",
  })

  // Load staff on component mount
  useEffect(() => {
    if (open) {
      const allStaff = staffDb.getAll()
      setStaff(allStaff)
    }
  }, [open])

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Get selected staff info if assigned
      const selectedStaff = selectedStaffId ? staff.find(s => s.id === selectedStaffId) : undefined
      
      // STEP 1: Submit and Record Ticket
      const newTicket = ticketLifecycleDb.submitTicket({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        company: formData.idNumber || undefined, // Using company field for ID number
        purposeOfVisit: formData.service,
        priority: formData.priority,
        hostStaffId: selectedStaffId || undefined,
        hostStaffName: selectedStaff?.name,
        checkInTime: new Date().toISOString(),
        status: "waiting" as const,
        notes: formData.notes || undefined,
      })
      
      // STEP 2: Categorize and Route Ticket (auto-route if no staff assigned)
      const routingResult = ticketLifecycleDb.categorizeAndRoute(
        newTicket.id,
        !selectedStaffId // Auto-route only if no manual assignment
      )
      
      setTicketNumber(newTicket.ticketNumber)
      setTicketCreated(true)
      
      // Log routing information
      console.log("✅ Ticket created and routed:", {
        ticketNumber: newTicket.ticketNumber,
        category: routingResult.category,
        assignedTo: routingResult.assignedStaff?.name || selectedStaff?.name || "Unassigned",
      })
      
      // Callback to refresh parent component
      if (onTicketCreated) {
        onTicketCreated()
      }
      
      // Reset after 3 seconds
      setTimeout(() => {
        setTicketCreated(false)
        onOpenChange(false)
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          idNumber: "",
          service: "",
          priority: "normal",
          time: "09:00",
          notes: "",
        })
        setSelectedStaffId("")
      }, 3000)
    } catch (error) {
      console.error("Error creating ticket:", error)
      alert("Failed to create ticket. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {!ticketCreated ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New Ticket</DialogTitle>
              <DialogDescription>
                Register a walk-in or virtual customer and generate a queue ticket
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateTicket}>
              <div className="space-y-6 py-4">
                {/* Visit Type Selection */}
                <div className="space-y-2">
                  <Label>Visit Type</Label>
                  <RadioGroup
                    value={visitType}
                    onValueChange={(value) => setVisitType(value as "walk-in" | "virtual")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="walk-in" id="walk-in" />
                      <Label htmlFor="walk-in" className="cursor-pointer font-normal">
                        Walk-in Customer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="virtual" id="virtual" />
                      <Label htmlFor="virtual" className="cursor-pointer font-normal">
                        Virtual Customer
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Customer Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter customer name" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="customer@example.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id-number">ID Number</Label>
                    <Input 
                      id="id-number" 
                      placeholder="Optional" 
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-2">
                  <Label htmlFor="service">Service Required *</Label>
                  <Select 
                    required 
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                  >
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                      <SelectItem value="Account Services">Account Services</SelectItem>
                      <SelectItem value="Billing Support">Billing Support</SelectItem>
                      <SelectItem value="Technical Support">Technical Support</SelectItem>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Staff Assignment */}
                <div className="space-y-2">
                  <Label htmlFor="staff">Assign to Staff (Optional)</Label>
                  <Select 
                    value={selectedStaffId}
                    onValueChange={setSelectedStaffId}
                  >
                    <SelectTrigger id="staff">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2 w-full">
                            <span className="flex-1">{member.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {member.department}
                            </span>
                            {member.isAvailable ? (
                              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                                <UserX className="h-3 w-3 mr-1" />
                                Busy
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Available staff members are ready to assist immediately
                  </p>
                </div>

                {/* Priority Level */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select 
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-gray-100">Low</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="normal">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-100">Normal</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-orange-100">High</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-red-100">Urgent</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Virtual Customer - Date Selection */}
                {visitType === "virtual" && (
                  <div className="space-y-2">
                    <Label>Preferred Date & Time</Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "flex-1 justify-start text-left font-normal",
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
                      <Select 
                        value={formData.time}
                        onValueChange={(value) => setFormData({ ...formData, time: value })}
                      >
                        <SelectTrigger className="w-[120px]">
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
                  </div>
                )}

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements or notes..."
                    className="min-h-[80px]"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: "#022B3A" }}>
                  Generate Ticket
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>Ticket Created Successfully!</h3>
            <p className="text-muted-foreground mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>Ticket Number:</p>
            <div className="text-4xl font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              {ticketNumber}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Customer will be notified via SMS/Email
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
