"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Send, Bell, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { visitorDb } from "@/lib/db/receptionist"

interface CustomerMessage {
  id: string
  ticketNumber: string
  customerName: string
  counter?: string
  status: "waiting" | "sent"
  priority: boolean
}

export default function NotificationsPanel() {
  const [customers, setCustomers] = useState<CustomerMessage[]>([])
  const [isViewAllOpen, setIsViewAllOpen] = useState(false)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = () => {
    const visitors = visitorDb.getAll()
    const waitingVisitors = visitors.filter(v => v.status === "waiting")
    
    const customerMessages: CustomerMessage[] = waitingVisitors.map(v => ({
      id: v.id,
      ticketNumber: v.ticketNumber,
      customerName: v.name,
      counter: undefined,
      status: "waiting" as const,
      priority: v.priority === "urgent" || v.priority === "high",
    }))
    
    setCustomers(customerMessages)
  }

  const handleSendMessage = (id: string) => {
    setCustomers((prev) =>
      prev.map((customer) => 
        customer.id === id ? { ...customer, status: "sent" as const } : customer
      )
    )
  }

  // Show only first 2 customers
  const displayCustomers = customers.slice(0, 2)

  return (
    <Card className="rounded-2xl shadow-sm h-[300px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#022B3A]" />
            <CardTitle className="text-sm font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              Notify Customers
            </CardTitle>
          </div>
          <Badge variant="secondary" className="bg-[#BFDBF7] text-[#022B3A] border-0 text-xs" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {customers.filter(c => c.status === "waiting").length} Waiting
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <div className="space-y-2 flex-1 overflow-y-auto">
          {displayCustomers.map((customer) => (
              <div
                key={customer.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-all",
                  customer.status === "sent" 
                    ? "bg-gray-50 border-gray-200" 
                    : "bg-white border-gray-200 hover:border-[#6C5CE7]/50"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={cn(
                      "text-xs font-medium",
                      customer.status === "sent" ? "text-gray-400" : "text-gray-900"
                    )} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      {customer.customerName}
                    </p>
                    {customer.priority && customer.status === "waiting" && (
                      <span className="text-base"></span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs font-normal border-gray-300 text-gray-600"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {customer.ticketNumber}
                    </Badge>
                    {customer.counter && (
                      <span className="text-xs text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        → {customer.counter}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handleSendMessage(customer.id)}
                  disabled={customer.status === "sent"}
                  size="sm"
                  className={cn(
                    "ml-3 text-xs",
                    customer.status === "sent"
                      ? "bg-green-500 hover:bg-green-500"
                      : "bg-[#022B3A] hover:bg-[#011A24]"
                  )}
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {customer.status === "sent" ? (
                    <>
                      <span className="text-xs">Sent</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3 mr-1" />
                      <span className="text-xs">Send</span>
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        <Button 
          variant="link" 
          className="w-full mt-4 p-0 h-auto text-[#6C5CE7] hover:text-[#5B4CD6] hover:underline text-xs font-medium" 
          style={{ fontFamily: "var(--font-space-grotesk)" }}
          onClick={() => setIsViewAllOpen(true)}
        >
          View all →
        </Button>
      </CardContent>

      {/* View All Dialog */}
      <Dialog open={isViewAllOpen} onOpenChange={setIsViewAllOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              <Bell className="h-5 w-5" />
              All Customer Notifications
            </DialogTitle>
            <DialogDescription style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Manage all customer notifications and send messages
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between py-2">
            <Badge variant="secondary" className="bg-[#BFDBF7] text-[#022B3A] border-0 text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {customers.filter(c => c.status === "waiting").length} Waiting
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-0 text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {customers.filter(c => c.status === "sent").length} Sent
            </Badge>
          </div>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {customers.length === 0 ? (
                <div className="text-center py-8 text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  No customers to notify
                </div>
              ) : (
                customers.map((customer) => (
                  <div
                    key={customer.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border transition-all",
                      customer.status === "sent" 
                        ? "bg-gray-50 border-gray-200" 
                        : "bg-white border-gray-200 hover:border-[#6C5CE7]/50 hover:shadow-sm"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className={cn(
                          "text-sm font-extrabold",
                          customer.status === "sent" ? "text-gray-400" : ""
                        )} style={{ fontFamily: "var(--font-poppins)", color: customer.status === "sent" ? undefined : "#022B3A" }}>
                          {customer.customerName}
                        </p>
                        {customer.priority && customer.status === "waiting" && (
                          <Badge variant="destructive" className="text-xs">
                            Priority
                          </Badge>
                        )}
                        {customer.status === "sent" && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Notified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className="text-xs font-normal border-gray-300 text-gray-600"
                          style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                          Ticket: {customer.ticketNumber}
                        </Badge>
                        {customer.counter && (
                          <span className="text-xs text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            → {customer.counter}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSendMessage(customer.id)}
                      disabled={customer.status === "sent"}
                      size="sm"
                      className={cn(
                        "ml-4",
                        customer.status === "sent"
                          ? "bg-green-500 hover:bg-green-500 cursor-not-allowed"
                          : "bg-[#022B3A] hover:bg-[#011A24]"
                      )}
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {customer.status === "sent" ? (
                        <>
                          <span className="text-sm">Sent</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          <span className="text-sm">Send Notification</span>
                        </>
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsViewAllOpen(false)}
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
