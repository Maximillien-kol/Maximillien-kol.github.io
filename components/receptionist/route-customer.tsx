"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Visitor, Staff } from "@/lib/types/receptionist"
import { visitorDb, staffDb, initializeSampleData } from "@/lib/db/receptionist"

interface RoutingSuggestion {
  visitor: Visitor
  staff: Staff
  matchScore: number
  reason: string
}

export default function RouteCustomer() {
  const [waitingVisitors, setWaitingVisitors] = useState<Visitor[]>([])
  const [availableStaff, setAvailableStaff] = useState<Staff[]>([])
  const [allStaff, setAllStaff] = useState<Staff[]>([])
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [routedSuccess, setRoutedSuccess] = useState(false)
  const [suggestions, setSuggestions] = useState<RoutingSuggestion[]>([])

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

  useEffect(() => {
    initializeSampleData()
    loadData()
  }, [])

  useEffect(() => {
    if (waitingVisitors.length > 0 && availableStaff.length > 0) {
      generateSmartSuggestions()
    }
  }, [waitingVisitors, availableStaff])

  const loadData = () => {
    const waiting = visitorDb.getByStatus("waiting")
    const staff = staffDb.getAll()
    const available = staff.filter((s) => s.isAvailable)
    
    setWaitingVisitors(waiting)
    setAllStaff(staff)
    setAvailableStaff(available)
  }

  const calculateMatchScore = (visitor: Visitor, staff: Staff): number => {
    let score = 50 // Base score
    
    // Priority matching
    if (visitor.priority === "urgent") score += 30
    if (visitor.priority === "high") score += 20
    
    // Check if staff can handle the service (using department as proxy for specialization)
    if (visitor.purposeOfVisit.toLowerCase().includes(staff.department.toLowerCase())) {
      score += 40
    }
    
    // Availability bonus
    if (staff.isAvailable) score += 20
    
    return Math.min(score, 100)
  }

  const generateSmartSuggestions = () => {
    const newSuggestions: RoutingSuggestion[] = []
    
    waitingVisitors.forEach((visitor) => {
      type BestMatch = { staff: Staff; score: number; reason: string }
      let bestMatch: BestMatch | null = null
      
      availableStaff.forEach((staff) => {
        const score = calculateMatchScore(visitor, staff)
        
        if (!bestMatch || score > bestMatch.score) {
          let reason = ""
          
          if (visitor.purposeOfVisit.toLowerCase().includes(staff.department.toLowerCase())) {
            reason = `${staff.department} specialist available`
          } else if (visitor.priority === "urgent" || visitor.priority === "high") {
            reason = `Available for ${visitor.priority} priority`
          } else {
            reason = "Available and ready to serve"
          }
          
          bestMatch = { staff, score, reason }
        }
      })
      
      if (bestMatch !== null) {
        const { staff: matchedStaff, score: matchScore, reason: matchReason } = bestMatch
        if (matchScore >= 60) {
          newSuggestions.push({
            visitor,
            staff: matchedStaff,
            matchScore,
            reason: matchReason,
          })
        }
      }
    })
    
    // Sort by match score and priority
    newSuggestions.sort((a, b) => {
      const priorityWeight = { urgent: 4, high: 3, normal: 2, low: 1 }
      const aPriority = priorityWeight[a.visitor.priority] || 1
      const bPriority = priorityWeight[b.visitor.priority] || 1
      
      if (aPriority !== bPriority) return bPriority - aPriority
      return b.matchScore - a.matchScore
    })
    
    setSuggestions(newSuggestions.slice(0, 5))
  }

  const handleRoute = (visitor?: Visitor, staff?: Staff) => {
    const visitorToRoute = visitor || selectedVisitor
    const staffToRoute = staff || selectedStaff
    
    if (visitorToRoute && staffToRoute) {
      visitorDb.update(visitorToRoute.id, {
        status: "in-progress",
        hostStaffId: staffToRoute.id,
        hostStaffName: staffToRoute.name,
      })
      
      setRoutedSuccess(true)
      setTimeout(() => {
        setRoutedSuccess(false)
        setSelectedVisitor(null)
        setSelectedStaff(null)
        loadData()
      }, 2000)
    }
  }

  return (
    <div className="space-y-4">
      {/* Instructions Banner */}
      <Card className="rounded-2xl shadow-sm bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-extrabold mb-2" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                How Smart Routing Works
              </h3>
              <div className="space-y-1 text-xs text-gray-700" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                <p><strong>Step 1:</strong> Select a waiting customer from the left panel</p>
                <p><strong>Step 2:</strong> Choose an available staff member from the right panel</p>
                <p><strong>Step 3:</strong> Click "Route Customer" or use AI suggestions for best matches</p>
                <p className="text-blue-700 mt-2"><strong>💡 Tip:</strong> AI suggests matches based on department specialization, priority level, and staff availability</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {routedSuccess && (
        <Card className="rounded-2xl shadow-sm border-green-500 bg-green-50">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="font-medium text-green-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Visitor successfully routed! Staff member has been notified.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Smart Routing Suggestions */}
      {suggestions.length > 0 && (
        <Card className="rounded-2xl shadow-sm border-2 border-[#022B3A]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#022B3A]" />
              <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                Smart Routing Suggestions
              </CardTitle>
            </div>
            <CardDescription className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              AI-powered recommendations based on specialization, priority, and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.visitor.id}-${suggestion.staff.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#022B3A] text-white text-xs font-extrabold" style={{ fontFamily: "var(--font-poppins)" }}>
                      #{index + 1}
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium" style={{ fontFamily: "var(--font-poppins)" }}>
                          {suggestion.visitor.name}
                        </p>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          {suggestion.visitor.ticketNumber} • {suggestion.visitor.purposeOfVisit}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium" style={{ fontFamily: "var(--font-poppins)" }}>
                          {suggestion.staff.name}
                        </p>
                        <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          {suggestion.staff.department} • {suggestion.staff.position}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        <TrendingUp className="h-3 w-3" />
                        {suggestion.matchScore}% match
                      </Badge>
                      <Badge className={cn("text-xs", getPriorityColor(suggestion.visitor.priority))} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {suggestion.visitor.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      {suggestion.reason}
                    </span>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleRoute(suggestion.visitor, suggestion.staff)}
                      style={{ backgroundColor: "#022B3A", fontFamily: "var(--font-space-grotesk)" }}
                    >
                      Auto-Route
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Waiting customers */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              Waiting Customers
            </CardTitle>
            <CardDescription className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {waitingVisitors.length} Customers{waitingVisitors.length !== 1 ? "s" : ""} waiting to be served
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {waitingVisitors.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900" style={{ fontFamily: "var(--font-poppins)" }}>
                        No customers waiting
                      </p>
                      <p className="text-xs text-muted-foreground max-w-xs" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        All customers have been assigned to staff or there are no pending tickets. Create a new ticket to get started.
                      </p>
                    </div>
                  </div>
                ) : (
                  waitingVisitors.map((visitor) => (
                    <div
                      key={visitor.id}
                      className={cn(
                        "flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50 cursor-pointer",
                        selectedVisitor?.id === visitor.id && "bg-blue-50 border-[#022B3A]"
                      )}
                      onClick={() => setSelectedVisitor(visitor)}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#022B3A] text-white font-extrabold text-sm" style={{ fontFamily: "var(--font-poppins)" }}>
                        {visitor.ticketNumber.replace(/\D/g, "").slice(-4)}
                      </div>
                      <div className="flex-1">
                        <p className="font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{visitor.name}</p>
                        <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>{visitor.purposeOfVisit}</p>
                      </div>
                      <Badge className={cn("text-xs", getPriorityColor(visitor.priority))} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        {visitor.priority}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Available Staff */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              Staff Members
            </CardTitle>
            <CardDescription className="text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {availableStaff.length} staff member{availableStaff.length !== 1 ? "s" : ""} available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {allStaff.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900" style={{ fontFamily: "var(--font-poppins)" }}>
                        No staff members
                      </p>
                      <p className="text-xs text-muted-foreground max-w-xs" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        Please contact your administrator to add staff members to the system.
                      </p>
                    </div>
                  </div>
                ) : (
                  allStaff.map((staff) => (
                    <div
                      key={staff.id}
                      className={cn(
                        "rounded-lg border p-4 transition-colors",
                        staff.isAvailable && "hover:bg-gray-50 cursor-pointer",
                        !staff.isAvailable && "opacity-60 cursor-not-allowed",
                        selectedStaff?.id === staff.id && "bg-blue-50 border-[#022B3A]"
                      )}
                      onClick={() => staff.isAvailable && setSelectedStaff(staff)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-[#022B3A] text-white" style={{ fontFamily: "var(--font-poppins)" }}>
                              {staff.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{staff.name}</p>
                            <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                              {staff.position}
                            </p>
                          </div>
                        </div>
                        <Badge className={cn("text-xs", staff.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          {staff.isAvailable ? "available" : "busy"}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Department:
                          </span>
                          <span className="font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            {staff.department}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Contact:
                          </span>
                          <span className="font-medium text-xs" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            {staff.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Manual Route Action */}
      {selectedVisitor && selectedStaff && (
        <Card className="rounded-2xl shadow-sm border-2 border-dashed border-[#022B3A]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#022B3A] text-white font-extrabold" style={{ fontFamily: "var(--font-poppins)" }}>
                    {selectedVisitor.ticketNumber.replace(/\D/g, "").slice(-4)}
                  </div>
                  <div>
                    <p className="font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{selectedVisitor.name}</p>
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>{selectedVisitor.purposeOfVisit}</p>
                  </div>
                </div>

                <ArrowRight className="h-8 w-8 text-muted-foreground" />

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-[#022B3A] text-white" style={{ fontFamily: "var(--font-poppins)" }}>
                      {selectedStaff.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>{selectedStaff.name}</p>
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      {selectedStaff.department} • {selectedStaff.position}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                style={{ backgroundColor: "#022B3A", fontFamily: "var(--font-space-grotesk)" }}
                onClick={() => handleRoute()}
                disabled={!selectedVisitor || !selectedStaff || !selectedStaff.isAvailable}
              >
                Route Visitor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
