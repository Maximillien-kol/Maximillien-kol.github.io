"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Clock, FileText, GitBranch, MessageSquare, UserCheck } from "lucide-react"

export default function TicketFlowDiagram() {
  const flowSteps = [
    {
      number: 1,
      title: "User Submits Ticket",
      description: "Customer creates ticket via receptionist or self-service",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      number: 2,
      title: "System Records Ticket",
      description: "Ticket saved to database with unique ID",
      icon: Clock,
      color: "bg-purple-500",
    },
    {
      number: 3,
      title: "Categorize & Route",
      description: "AI categorizes and routes to appropriate staff",
      icon: GitBranch,
      color: "bg-orange-500",
    },
    {
      number: 4,
      title: "Staff Handles Ticket",
      description: "Assigned staff updates and processes ticket",
      icon: UserCheck,
      color: "bg-teal-500",
    },
    {
      number: 5,
      title: "Ticket Resolved",
      description: "Staff resolves and closes ticket",
      icon: CheckCircle2,
      color: "bg-green-500",
    },
    {
      number: 6,
      title: "User Notification",
      description: "Customer receives resolution and feedback request",
      icon: MessageSquare,
      color: "bg-indigo-500",
    },
  ]

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="font-extrabold text-2xl" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
          Ticket Lifecycle Flow
        </CardTitle>
        <CardDescription style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Complete automated workflow from submission to resolution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {flowSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.number}>
                <div className="flex items-start gap-4">
                  {/* Step Number & Icon */}
                  <div className="flex flex-col items-center">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${step.color} text-white shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {index < flowSteps.length - 1 && (
                      <div className="mt-2 mb-2">
                        <ArrowRight className="h-5 w-5 text-gray-400 rotate-90" />
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        Step {step.number}
                      </Badge>
                      <h3 className="font-extrabold text-lg" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                6
              </p>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Flow Steps
              </p>
            </div>
            <div>
              <p className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                100%
              </p>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Automated
              </p>
            </div>
            <div>
              <p className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                Real-time
              </p>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Notifications
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
