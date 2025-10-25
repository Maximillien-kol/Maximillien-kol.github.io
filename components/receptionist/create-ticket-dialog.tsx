"use client"

import { useState } from "react"
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
import { CalendarIcon, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CreateTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateTicketDialog({ open, onOpenChange }: CreateTicketDialogProps) {
  const [visitType, setVisitType] = useState<"walk-in" | "virtual">("walk-in")
  const [date, setDate] = useState<Date>()
  const [ticketCreated, setTicketCreated] = useState(false)
  const [ticketNumber, setTicketNumber] = useState("")

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate ticket number
    const newTicketNumber = `T${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    setTicketNumber(newTicketNumber)
    setTicketCreated(true)
    
    // Reset after 3 seconds
    setTimeout(() => {
      setTicketCreated(false)
      onOpenChange(false)
    }, 3000)
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
                    <Input id="name" placeholder="Enter customer name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" required />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="customer@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id-number">ID Number</Label>
                    <Input id="id-number" placeholder="Optional" />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-2">
                  <Label htmlFor="service">Service Required *</Label>
                  <Select required>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="account">Account Services</SelectItem>
                      <SelectItem value="billing">Billing Support</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Level */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select defaultValue="normal">
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
                      <Select defaultValue="09:00">
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
            <h3 className="text-2xl font-bold mb-2">Ticket Created Successfully!</h3>
            <p className="text-muted-foreground mb-4">Ticket Number:</p>
            <div className="text-4xl font-bold" style={{ color: "#022B3A" }}>
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
