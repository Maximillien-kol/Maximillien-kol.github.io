// Core data types for Receptionist Dashboard

export type Priority = "low" | "normal" | "high" | "urgent"
export type VisitorStatus = "waiting" | "in-progress" | "completed" | "cancelled"
export type AppointmentStatus = "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "rescheduled"
export type InquiryType = "call" | "email" | "chat" | "walk-in"
export type InquiryStatus = "new" | "assigned" | "in-progress" | "resolved" | "closed"
export type PackageStatus = "received" | "assigned" | "pending-pickup" | "delivered" | "collected"

// Visitor Management
export interface Visitor {
  id: string
  ticketNumber: string
  name: string
  phone: string
  email?: string
  company?: string
  purposeOfVisit: string
  hostStaffId?: string
  hostStaffName?: string
  checkInTime: string
  checkOutTime?: string
  status: VisitorStatus
  priority: Priority
  badge?: string
  photo?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Appointment Management
export interface Appointment {
  id: string
  appointmentNumber: string
  visitorName: string
  visitorPhone: string
  visitorEmail?: string
  visitorCompany?: string
  staffId: string
  staffName: string
  staffEmail?: string
  appointmentDate: Date
  appointmentTime: string
  duration: number // in minutes
  purpose: string
  location?: string
  meetingRoom?: string
  status: AppointmentStatus
  priority: Priority
  notes?: string
  reminderSent: boolean
  confirmationSent: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}

// Inquiry/Communication Tracking
export interface Inquiry {
  id: string
  inquiryNumber: string
  type: InquiryType
  subject: string
  description: string
  fromName: string
  fromPhone?: string
  fromEmail?: string
  assignedTo?: string
  assignedToName?: string
  status: InquiryStatus
  priority: Priority
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  responseTime?: number // in minutes
  notes?: string
  attachments?: string[]
}

// Package Management
export interface Package {
  id: string
  trackingNumber: string
  packageType: "document" | "parcel" | "mail" | "other"
  sender: string
  senderContact?: string
  recipientName: string
  recipientStaffId?: string
  recipientDepartment?: string
  recipientPhone?: string
  recipientEmail?: string
  receivedDate: string
  receivedTime: string
  status: PackageStatus
  priority: Priority
  deliveredDate?: string
  deliveredTime?: string
  deliveredBy?: string
  signature?: string
  location?: string
  notes?: string
  photo?: string
  createdAt: string
  updatedAt: string
}

// Staff Management
export interface Staff {
  id: string
  name: string
  email: string
  phone?: string
  department: string
  position: string
  avatar?: string
  isAvailable: boolean
  notificationPreferences: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

// Notification System
export interface Notification {
  id: string
  type: "visitor" | "appointment" | "inquiry" | "package" | "system"
  title: string
  message: string
  recipientId: string
  recipientName: string
  relatedEntityId: string
  relatedEntityType: "visitor" | "appointment" | "inquiry" | "package"
  isRead: boolean
  priority: Priority
  createdAt: string
  expiresAt?: string
}

// Activity Log
export interface ActivityLog {
  id: string
  type: "visitor" | "appointment" | "inquiry" | "package" | "system"
  action: string
  description: string
  entityId: string
  entityType: string
  performedBy: string
  performedByName: string
  timestamp: string
  metadata?: Record<string, any>
}

// Dashboard Statistics
export interface DashboardStats {
  today: {
    visitors: {
      total: number
      waiting: number
      inProgress: number
      completed: number
      cancelled: number
    }
    appointments: {
      total: number
      scheduled: number
      completed: number
      cancelled: number
      rescheduled: number
    }
    inquiries: {
      total: number
      new: number
      assigned: number
      resolved: number
    }
    packages: {
      total: number
      received: number
      delivered: number
      pending: number
    }
  }
  avgWaitTime: number // in minutes
  avgServiceTime: number // in minutes
  peakHour: string
  customerSatisfaction: number
}

// Report Data
export interface ReportData {
  dateRange: {
    start: string
    end: string
  }
  summary: DashboardStats
  hourlyDistribution: Array<{
    hour: string
    visitors: number
    appointments: number
  }>
  serviceBreakdown: Array<{
    service: string
    count: number
    percentage: number
  }>
  staffPerformance: Array<{
    staffId: string
    staffName: string
    visitorsServed: number
    appointmentsHandled: number
    avgServiceTime: number
    satisfaction: number
  }>
  trends: {
    visitorsTrend: number // percentage change
    appointmentsTrend: number
    satisfactionTrend: number
  }
}
