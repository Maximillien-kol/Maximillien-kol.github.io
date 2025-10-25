"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, User, Phone, Mail, ChevronRight, AlertCircle, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface QueueOverviewProps {
  preview?: boolean
}

interface Customer {
  id: string
  ticketNumber: string
  name: string
  phone: string
  email?: string
  service: string
  priority: "low" | "normal" | "high" | "urgent"
  status: "waiting" | "in-progress" | "called"
  estimatedWaitTime: number
  checkInTime: string
  type: "walk-in" | "virtual"
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    ticketNumber: "T0001",
    name: "Adit Irwan",
    phone: "+1 (555) 123-4567",
    email: "adit@example.com",
    service: "Account Services",
    priority: "urgent",
    status: "in-progress",
    estimatedWaitTime: 2,
    checkInTime: "09:15 AM",
    type: "walk-in",
  },
  {
    id: "2",
    ticketNumber: "T0002",
    name: "Arif Brata",
    phone: "+1 (555) 234-5678",
    service: "General Inquiry",
    priority: "normal",
    status: "waiting",
    estimatedWaitTime: 8,
    checkInTime: "09:22 AM",
    type: "walk-in",
  },
  {
    id: "3",
    ticketNumber: "T0003",
    name: "Ardhi Irwandi",
    phone: "+1 (555) 345-6789",
    email: "ardhi@example.com",
    service: "Billing Support",
    priority: "high",
    status: "waiting",
    estimatedWaitTime: 12,
    checkInTime: "09:30 AM",
    type: "virtual",
  },
  {
    id: "4",
    ticketNumber: "T0004",
    name: "Friza Dipa",
    phone: "+1 (555) 456-7890",
    service: "Technical Support",
    priority: "normal",
    status: "waiting",
    estimatedWaitTime: 18,
    checkInTime: "09:35 AM",
    type: "walk-in",
  },
  {
    id: "5",
    ticketNumber: "T0005",
    name: "Sarah Johnson",
    phone: "+1 (555) 567-8901",
    email: "sarah@example.com",
    service: "Consultation",
    priority: "low",
    status: "waiting",
    estimatedWaitTime: 25,
    checkInTime: "09:42 AM",
    type: "virtual",
  },
]

export default function QueueOverview({ preview = false }: QueueOverviewProps) {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-green-100 text-green-800"
      case "called":
        return "bg-yellow-100 text-yellow-800"
      case "waiting":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const displayCustomers = preview ? customers.slice(0, 3) : customers

  const contentStats = [
    { label: "Passed", count: 86, color: "#6C5CE7", percentage: "86%" },
    { label: "Failed", count: 4, color: "#FFA500", percentage: "4%" },
    { label: "Overdue", count: 4, color: "#DC2626", percentage: "4%" },
    { label: "In Progress", count: 4, color: "#06B6D4", percentage: "4%" },
    { label: "Not Started", count: 4, color: "#E5E7EB", percentage: "4%" },
  ]

  const totalContents = contentStats.reduce((sum, stat) => sum + stat.count, 0)

  const topLearners = [
    { id: "1", name: "Arif Brata", role: "Jr UI/UX Designer", points: 100, avatar: "/placeholder-1.jpg" },
    { id: "2", name: "Ardhi Irwandi", role: "Sr UI/UX Designer", points: 80, avatar: "/placeholder-2.jpg" },
    { id: "3", name: "Friza Dipa", role: "Jr Animation", points: 100, avatar: "/placeholder-3.jpg" },
  ]

  const ungradedQuizzes = [
    { id: "1", title: "How to be great and good UI/UX designer", questions: 4, questionType: "open ended", learner: "Adit Irwan", learnerAvatar: "/placeholder-1.jpg", learnerInitials: "AI" },
    { id: "2", title: "Applications, tools, and plugins to make yo...", questions: 10, questionType: "open ended", learner: "Arif Brata", learnerAvatar: "/placeholder-2.jpg", learnerInitials: "AB" },
    { id: "3", title: "Great designer must know the best for clie...", questions: 3, questionType: "open ended", learner: "Ardhi Irwandi", learnerAvatar: "/placeholder-3.jpg", learnerInitials: "AI" },
  ]

  return (
    <div className="space-y-4">
      {/* Learning Content and Top Learner - Two Column Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Learning Content Card */}
        <Card className="rounded-2xl shadow-sm h-[500px] flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
                Learning Content
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-gray-600">
                By status
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-6">
              {/* Donut Chart */}
              <div className="relative flex items-center justify-center">
                <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
                  <circle
                    cx="70"
                    cy="70"
                    r="50"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="24"
                  />
                  {/* Passed - 86% */}
                  <circle
                    cx="70"
                    cy="70"
                    r="50"
                    fill="none"
                    stroke="#6C5CE7"
                    strokeWidth="24"
                    strokeDasharray={`${(86 / 100) * 314} 314`}
                    strokeDashoffset="0"
                  />
                  {/* Failed - 4% */}
                  <circle
                    cx="70"
                    cy="70"
                    r="50"
                    fill="none"
                    stroke="#FFA500"
                    strokeWidth="24"
                    strokeDasharray={`${(4 / 100) * 314} 314`}
                    strokeDashoffset={`-${(86 / 100) * 314}`}
                  />
                  {/* Overdue - 4% */}
                  <circle
                    cx="70"
                    cy="70"
                    r="50"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="24"
                    strokeDasharray={`${(4 / 100) * 314} 314`}
                    strokeDashoffset={`-${((86 + 4) / 100) * 314}`}
                  />
                  {/* In Progress - 4% */}
                  <circle
                    cx="70"
                    cy="70"
                    r="50"
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="24"
                    strokeDasharray={`${(4 / 100) * 314} 314`}
                    strokeDashoffset={`-${((86 + 4 + 4) / 100) * 314}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>Contents</span>
                  <span className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-poppins)" }}>{totalContents}</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-2">
                {contentStats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
                      <span className="text-xs text-gray-700" style={{ fontFamily: "var(--font-space-grotesk)" }}>{stat.label}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>{stat.percentage}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Learner Card */}
        <Card className="rounded-2xl shadow-sm h-[500px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
              Top Learner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLearners.map((learner, index) => (
                <div key={learner.id} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-900" style={{ fontFamily: "var(--font-poppins)" }}>#{index + 1}</span>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={learner.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 text-xs font-semibold">
                      {learner.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>{learner.name}</p>
                    <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-space-grotesk)" }}>{learner.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                      <span className="text-white text-xs">●</span>
                    </div>
                    <span className="text-xs font-medium text-gray-900" style={{ fontFamily: "var(--font-poppins)" }}>{learner.points}pts</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-[#6C5CE7] hover:text-[#5B4CD6] text-xs font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              View all →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Ungraded Quiz Section */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-extrabold" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
            Ungraded Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-12 text-xs font-medium text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}></TableHead>
                  <TableHead className="text-xs font-medium text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>Quiz title</TableHead>
                  <TableHead className="text-xs font-medium text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>Questions</TableHead>
                  <TableHead className="text-xs font-medium text-gray-600" style={{ fontFamily: "var(--font-space-grotesk)" }}>Learner</TableHead>
                  <TableHead className="w-32"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ungradedQuizzes.map((quiz, index) => (
                  <TableRow key={quiz.id} className="hover:bg-gray-50">
                    <TableCell className="text-sm font-medium text-gray-900" style={{ fontFamily: "var(--font-poppins)" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>{quiz.title}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                          <HelpCircle className="h-3 w-3 text-gray-600" />
                        </div>
                        <span className="text-sm text-gray-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                          {quiz.questions} {quiz.questionType}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={quiz.learnerAvatar} />
                          <AvatarFallback className="bg-[#06B6D4] text-white text-xs font-semibold">
                            {quiz.learnerInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-900" style={{ fontFamily: "var(--font-space-grotesk)" }}>{quiz.learner}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="rounded-lg text-xs font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        Grade Now
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button variant="link" className="w-full mt-4 text-[#6C5CE7] hover:text-[#5B4CD6] text-xs font-medium" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            View all →
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
