"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomerMessage {
  id: string
  ticketNumber: string
  customerName: string
  counter?: string
  status: "waiting" | "sent"
  priority: boolean
}

const mockCustomers: CustomerMessage[] = [
  {
    id: "1",
    ticketNumber: "T0002",
    customerName: "Arif Brata",
    counter: "Counter 2",
    status: "waiting",
    priority: true,
  },
  {
    id: "2",
    ticketNumber: "T0004",
    customerName: "John Smith",
    counter: "Counter 1",
    status: "waiting",
    priority: true,
  },
  {
    id: "3",
    ticketNumber: "T0005",
    customerName: "Sarah Johnson",
    counter: "Counter 3",
    status: "waiting",
    priority: false,
  },
]


export default function NotificationsPanel() {
  const [customers, setCustomers] = useState<CustomerMessage[]>(mockCustomers)

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
    <Card className="rounded-2xl shadow-sm h-[500px] flex flex-col">
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
        <Button variant="link" className="w-full mt-4 p-0 h-auto text-[#6C5CE7] hover:text-[#5B4CD6] text-xs font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          View all →
        </Button>
      </CardContent>
    </Card>
  )
}
