"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, Calendar, Clock, User, Activity, Eye } from "lucide-react"
import { visitorDb } from "@/lib/db/receptionist"
import { Visitor, VisitorStatus } from "@/lib/types/receptionist"
import TicketLifecycleTracker from "./ticket-lifecycle-tracker"

export default function AllTicketsView() {
  const [tickets, setTickets] = useState<Visitor[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Visitor[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedTicket, setSelectedTicket] = useState<Visitor | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  useEffect(() => {
    loadTickets()
  }, [])

  useEffect(() => {
    filterTickets()
  }, [tickets, searchQuery, statusFilter, priorityFilter])

  const loadTickets = () => {
    const allTickets = visitorDb.getAll()
    // Sort by most recent first
    const sorted = allTickets.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    setTickets(sorted)
  }

  const filterTickets = () => {
    let filtered = [...tickets]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(ticket => 
        ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.phone.includes(searchQuery) ||
        ticket.purposeOfVisit.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter)
    }

    setFilteredTickets(filtered)
  }

  const handleViewDetails = (ticket: Visitor) => {
    setSelectedTicket(ticket)
    setIsDetailDialogOpen(true)
  }

  const getStatusColor = (status: VisitorStatus) => {
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

  const getStatusStats = () => {
    return {
      total: tickets.length,
      waiting: tickets.filter(t => t.status === "waiting").length,
      inProgress: tickets.filter(t => t.status === "in-progress").length,
      completed: tickets.filter(t => t.status === "completed").length,
      cancelled: tickets.filter(t => t.status === "cancelled").length,
    }
  }

  const stats = getStatusStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
          All Tickets
        </h2>
        <p className="text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Complete list of all tickets created in the system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-extrabold mb-1" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              {stats.total}
            </div>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Total Tickets
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-extrabold mb-1 text-blue-600" style={{ fontFamily: "var(--font-poppins)" }}>
              {stats.waiting}
            </div>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Waiting
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-extrabold mb-1 text-orange-600" style={{ fontFamily: "var(--font-poppins)" }}>
              {stats.inProgress}
            </div>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              In Progress
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-extrabold mb-1 text-green-600" style={{ fontFamily: "var(--font-poppins)" }}>
              {stats.completed}
            </div>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Completed
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="text-2xl font-extrabold mb-1 text-red-600" style={{ fontFamily: "var(--font-poppins)" }}>
              {stats.cancelled}
            </div>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Cancelled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ticket number, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="font-extrabold text-xl" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
            Tickets ({filteredTickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    No tickets found matching your filters
                  </p>
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  >
                    {/* Ticket Number */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#022B3A] text-white font-extrabold text-sm flex-shrink-0">
                      {ticket.ticketNumber.replace("V", "")}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {ticket.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Ticket Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-extrabold truncate" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                          {ticket.name}
                        </p>
                        <Badge variant="outline" className={getStatusColor(ticket.status)}>
                          {ticket.status.replace("-", " ").toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {ticket.purposeOfVisit}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(ticket.checkInTime).toLocaleTimeString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {ticket.hostStaffName || "Unassigned"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(ticket)}
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View Details
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-extrabold text-2xl" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              Ticket Details
            </DialogTitle>
            <DialogDescription style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Complete information and lifecycle tracking
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <TicketLifecycleTracker 
              ticketId={selectedTicket.id}
              onUpdate={() => {
                loadTickets()
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
