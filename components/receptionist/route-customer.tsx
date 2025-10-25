"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight, CheckCircle2, User, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface Employee {
  id: string
  name: string
  counter: string
  status: "available" | "busy" | "break"
  currentCustomer?: string
  customersServed: number
  specialization: string[]
}

interface QueueCustomer {
  id: string
  ticketNumber: string
  name: string
  service: string
  priority: "low" | "normal" | "high" | "urgent"
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "John Smith",
    counter: "Counter 1",
    status: "busy",
    currentCustomer: "T0001",
    customersServed: 12,
    specialization: ["Account Services", "General Inquiry"],
  },
  {
    id: "2",
    name: "Sarah Wilson",
    counter: "Counter 2",
    status: "available",
    customersServed: 15,
    specialization: ["Billing Support", "Technical Support"],
  },
  {
    id: "3",
    name: "Mike Johnson",
    counter: "Counter 3",
    status: "busy",
    currentCustomer: "T0003",
    customersServed: 10,
    specialization: ["Consultation", "General Inquiry"],
  },
  {
    id: "4",
    name: "Emily Davis",
    counter: "Counter 4",
    status: "available",
    customersServed: 13,
    specialization: ["Account Services", "Billing Support"],
  },
  {
    id: "5",
    name: "David Brown",
    counter: "Counter 5",
    status: "break",
    customersServed: 8,
    specialization: ["Technical Support", "Consultation"],
  },
]

const mockQueueCustomers: QueueCustomer[] = [
  {
    id: "2",
    ticketNumber: "T0002",
    name: "Arif Brata",
    service: "General Inquiry",
    priority: "normal",
  },
  {
    id: "4",
    ticketNumber: "T0004",
    name: "Friza Dipa",
    service: "Technical Support",
    priority: "normal",
  },
  {
    id: "5",
    ticketNumber: "T0005",
    name: "Sarah Johnson",
    service: "Consultation",
    priority: "low",
  },
]

export default function RouteCustomer() {
  const [selectedCustomer, setSelectedCustomer] = useState<QueueCustomer | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [routedSuccess, setRoutedSuccess] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-red-100 text-red-800"
      case "break":
        return "bg-yellow-100 text-yellow-800"
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

  const handleRoute = () => {
    if (selectedCustomer && selectedEmployee) {
      setRoutedSuccess(true)
      setTimeout(() => {
        setRoutedSuccess(false)
        setSelectedCustomer(null)
        setSelectedEmployee(null)
      }, 2000)
    }
  }

  const canRoute = selectedCustomer && selectedEmployee && selectedEmployee.status === "available"

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {routedSuccess && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="font-medium text-green-900">
              Customer successfully routed! Notification sent.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Waiting Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Waiting Customers</CardTitle>
            <CardDescription>Select a customer to route to an available counter</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {mockQueueCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className={cn(
                      "flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50 cursor-pointer",
                      selectedCustomer?.id === customer.id && "bg-blue-50 border-[#022B3A]"
                    )}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#022B3A] text-white font-bold text-sm">
                      {customer.ticketNumber.replace("T", "")}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.service}</p>
                    </div>
                    <Badge className={cn("text-xs", getPriorityColor(customer.priority))}>
                      {customer.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Available Employees/Counters */}
        <Card>
          <CardHeader>
            <CardTitle>Employees & Counters</CardTitle>
            <CardDescription>
              {mockEmployees.filter((e) => e.status === "available").length} available counters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {mockEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className={cn(
                      "rounded-lg border p-4 transition-colors",
                      employee.status === "available" && "hover:bg-gray-50 cursor-pointer",
                      employee.status !== "available" && "opacity-60 cursor-not-allowed",
                      selectedEmployee?.id === employee.id && "bg-blue-50 border-[#022B3A]"
                    )}
                    onClick={() => employee.status === "available" && setSelectedEmployee(employee)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-[#022B3A] text-white">
                            {employee.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.counter}</p>
                        </div>
                      </div>
                      <Badge className={cn("text-xs", getStatusColor(employee.status))}>
                        {employee.status}
                      </Badge>
                    </div>

                    {employee.currentCustomer && (
                      <div className="mb-3 rounded bg-gray-100 p-2">
                        <p className="text-xs text-muted-foreground">Currently serving:</p>
                        <p className="text-sm font-medium">{employee.currentCustomer}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Served today: <span className="font-medium">{employee.customersServed}</span>
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {employee.specialization.map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Route Action */}
      {selectedCustomer && selectedEmployee && (
        <Card className="border-2 border-dashed border-[#022B3A]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#022B3A] text-white font-bold">
                    {selectedCustomer.ticketNumber.replace("T", "")}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedCustomer.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedCustomer.service}</p>
                  </div>
                </div>

                <ArrowRight className="h-8 w-8 text-muted-foreground" />

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-[#022B3A] text-white">
                      {selectedEmployee.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedEmployee.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedEmployee.counter}</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                style={{ backgroundColor: "#022B3A" }}
                onClick={handleRoute}
                disabled={!canRoute}
              >
                Route Customer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Route Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Routing Suggestions</CardTitle>
          <CardDescription>AI-powered recommendations based on specialization and workload</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Arif Brata (T0002) → Sarah Wilson (Counter 2)</p>
                  <p className="text-xs text-muted-foreground">Match: General Inquiry specialist</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Auto-Route</Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Friza Dipa (T0004) → Emily Davis (Counter 4)</p>
                  <p className="text-xs text-muted-foreground">Match: Lowest queue, Technical Support</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Auto-Route</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
