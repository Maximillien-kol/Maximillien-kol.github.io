"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  ArrowRight,
  MessageSquare,
  Bell,
  Activity,
  CheckCheck,
  XCircle
} from "lucide-react"
import { ticketLifecycleDb } from "@/lib/db/receptionist"
import { Visitor, ActivityLog, Notification } from "@/lib/types/receptionist"

interface TicketLifecycleTrackerProps {
  ticketId: string
  onUpdate?: () => void
}

export default function TicketLifecycleTracker({ ticketId, onUpdate }: TicketLifecycleTrackerProps) {
  const [ticket, setTicket] = useState<Visitor | null>(null)
  const [currentStage, setCurrentStage] = useState<string>("")
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [nextActions, setNextActions] = useState<string[]>([])
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState("")

  useEffect(() => {
    loadTicketStatus()
  }, [ticketId])

  const loadTicketStatus = () => {
    try {
      const status = ticketLifecycleDb.getTicketStatus(ticketId)
      setTicket(status.ticket)
      setCurrentStage(status.currentStage)
      setActivities(status.activities)
      setNotifications(status.notifications)
      setNextActions(status.nextActions)
    } catch (error) {
      console.error("Error loading ticket status:", error)
    }
  }

  const handleStartProgress = () => {
    if (!ticket) return
    
    ticketLifecycleDb.handleTicket(ticketId, ticket.hostStaffId || "staff-1", {
      status: "in-progress",
      notes: "Staff member has started handling this ticket",
    })
    
    loadTicketStatus()
    if (onUpdate) onUpdate()
  }

  const handleResolveTicket = () => {
    if (!ticket || !resolutionNotes.trim()) return
    
    ticketLifecycleDb.resolveTicket(ticketId, ticket.hostStaffId || "staff-1", {
      notes: resolutionNotes,
      feedbackRequested: true,
    })
    
    setIsResolveDialogOpen(false)
    setResolutionNotes("")
    loadTicketStatus()
    if (onUpdate) onUpdate()
  }

  if (!ticket) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading ticket information...</p>
        </CardContent>
      </Card>
    )
  }

  const getStatusIcon = (status: Visitor["status"]) => {
    switch (status) {
      case "waiting":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "in-progress":
        return <Activity className="h-5 w-5 text-orange-500" />
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: Visitor["status"]) => {
    switch (status) {
      case "waiting":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "in-progress":
        return "bg-orange-100 text-orange-700 border-orange-300"
      case "completed":
        return "bg-green-100 text-green-700 border-green-300"
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700"
      case "high":
        return "bg-orange-100 text-orange-700"
      case "normal":
        return "bg-blue-100 text-blue-700"
      case "low":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="font-extrabold text-2xl" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                Ticket {ticket.ticketNumber}
              </CardTitle>
              <CardDescription className="text-base mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {ticket.name} • {ticket.phone}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                {ticket.priority.toUpperCase()}
              </Badge>
              <Badge variant="outline" className={getStatusColor(ticket.status)}>
                {getStatusIcon(ticket.status)}
                <span className="ml-1">{ticket.status.replace("-", " ").toUpperCase()}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Purpose</p>
              <p className="font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {ticket.purposeOfVisit}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assigned To</p>
              <p className="font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {ticket.hostStaffName || "Unassigned"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-in Time</p>
              <p className="font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {new Date(ticket.checkInTime).toLocaleTimeString()}
              </p>
            </div>
            {ticket.checkOutTime && (
              <div>
                <p className="text-sm text-muted-foreground">Check-out Time</p>
                <p className="font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {new Date(ticket.checkOutTime).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
          
          {ticket.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {ticket.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lifecycle Stage */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="font-extrabold text-xl" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
            Current Stage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <ArrowRight className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              {currentStage}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Next Actions */}
      {nextActions.length > 0 && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-extrabold text-xl" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              Next Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ticket.status === "waiting" && ticket.hostStaffId && (
              <Button 
                onClick={handleStartProgress} 
                className="w-full"
                style={{ backgroundColor: "#022B3A" }}
              >
                <User className="h-4 w-4 mr-2" />
                Start Handling Ticket
              </Button>
            )}
            
            {ticket.status === "in-progress" && (
              <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" style={{ backgroundColor: "#22C55E" }}>
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Resolve Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Resolve Ticket</DialogTitle>
                    <DialogDescription>
                      Add resolution notes and close this ticket
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="resolution">Resolution Notes *</Label>
                      <Textarea
                        id="resolution"
                        placeholder="Describe how the ticket was resolved..."
                        className="min-h-[100px]"
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleResolveTicket}
                      disabled={!resolutionNotes.trim()}
                      style={{ backgroundColor: "#022B3A" }}
                    >
                      Resolve & Notify Customer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <div className="space-y-2">
              {nextActions.map((action, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-3 w-3" />
                  <span style={{ fontFamily: "var(--font-space-grotesk)" }}>{action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="font-extrabold text-xl" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
            <Activity className="h-5 w-5 inline mr-2" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activities yet</p>
              ) : (
                activities.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                        {index < activities.length - 1 && (
                          <div className="w-px h-full bg-gray-200 flex-1 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                              {activity.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              by {activity.performedByName}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-extrabold text-xl" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              <Bell className="h-5 w-5 inline mr-2" />
              Related Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-blue-500 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      To: {notification.recipientName} • {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
