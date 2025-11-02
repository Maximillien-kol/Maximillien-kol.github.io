// Database utilities for Receptionist Dashboard
// This uses localStorage for demo purposes, but can be easily adapted to use a real API

import type {
  Visitor,
  Appointment,
  Inquiry,
  Package,
  Staff,
  Notification,
  ActivityLog,
  DashboardStats,
} from "@/lib/types/receptionist"

const STORAGE_KEYS = {
  VISITORS: "receptionist_visitors",
  APPOINTMENTS: "receptionist_appointments",
  INQUIRIES: "receptionist_inquiries",
  PACKAGES: "receptionist_packages",
  STAFF: "receptionist_staff",
  NOTIFICATIONS: "receptionist_notifications",
  ACTIVITY_LOG: "receptionist_activity_log",
  STATS: "receptionist_stats",
}

// Generic storage functions
function getFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function generateTicketNumber(prefix: string): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${prefix}${timestamp}${random}`
}

// Visitor Management
export const visitorDb = {
  getAll: (): Visitor[] => getFromStorage<Visitor>(STORAGE_KEYS.VISITORS),

  getById: (id: string): Visitor | undefined => {
    return visitorDb.getAll().find((v) => v.id === id)
  },

  create: (visitor: Omit<Visitor, "id" | "ticketNumber" | "createdAt" | "updatedAt">): Visitor => {
    const newVisitor: Visitor = {
      ...visitor,
      id: generateId(),
      ticketNumber: generateTicketNumber("V"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const visitors = visitorDb.getAll()
    visitors.push(newVisitor)
    saveToStorage(STORAGE_KEYS.VISITORS, visitors)
    
    // Log activity
    activityLogDb.create({
      type: "visitor",
      action: "created",
      description: `New visitor ${newVisitor.name} checked in`,
      entityId: newVisitor.id,
      entityType: "visitor",
      performedBy: "receptionist-1",
      performedByName: "Receptionist",
    })
    
    return newVisitor
  },

  update: (id: string, updates: Partial<Visitor>): Visitor | undefined => {
    const visitors = visitorDb.getAll()
    const index = visitors.findIndex((v) => v.id === id)
    if (index === -1) return undefined

    visitors[index] = {
      ...visitors[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    saveToStorage(STORAGE_KEYS.VISITORS, visitors)
    
    // Log activity
    activityLogDb.create({
      type: "visitor",
      action: "updated",
      description: `Visitor ${visitors[index].name} status updated to ${visitors[index].status}`,
      entityId: id,
      entityType: "visitor",
      performedBy: "receptionist-1",
      performedByName: "Receptionist",
    })
    
    return visitors[index]
  },

  delete: (id: string): boolean => {
    const visitors = visitorDb.getAll()
    const filtered = visitors.filter((v) => v.id !== id)
    if (filtered.length === visitors.length) return false
    saveToStorage(STORAGE_KEYS.VISITORS, filtered)
    return true
  },

  getByStatus: (status: Visitor["status"]): Visitor[] => {
    return visitorDb.getAll().filter((v) => v.status === status)
  },

  getToday: (): Visitor[] => {
    const today = new Date().toDateString()
    return visitorDb.getAll().filter((v) => {
      const visitDate = new Date(v.createdAt).toDateString()
      return visitDate === today
    })
  },
}

// Appointment Management
export const appointmentDb = {
  getAll: (): Appointment[] => getFromStorage<Appointment>(STORAGE_KEYS.APPOINTMENTS),

  getById: (id: string): Appointment | undefined => {
    return appointmentDb.getAll().find((a) => a.id === id)
  },

  create: (appointment: Omit<Appointment, "id" | "appointmentNumber" | "createdAt" | "updatedAt">): Appointment => {
    const newAppointment: Appointment = {
      ...appointment,
      id: generateId(),
      appointmentNumber: generateTicketNumber("APT"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const appointments = appointmentDb.getAll()
    appointments.push(newAppointment)
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments)
    
    // Create notification for staff
    notificationDb.create({
      type: "appointment",
      title: "New Appointment Scheduled",
      message: `Appointment with ${newAppointment.visitorName} on ${new Date(newAppointment.appointmentDate).toLocaleDateString()}`,
      recipientId: newAppointment.staffId,
      recipientName: newAppointment.staffName,
      relatedEntityId: newAppointment.id,
      relatedEntityType: "appointment",
      priority: newAppointment.priority,
    })
    
    // Log activity
    activityLogDb.create({
      type: "appointment",
      action: "created",
      description: `Appointment scheduled with ${newAppointment.visitorName}`,
      entityId: newAppointment.id,
      entityType: "appointment",
      performedBy: appointment.createdBy,
      performedByName: "Receptionist",
    })
    
    return newAppointment
  },

  update: (id: string, updates: Partial<Appointment>): Appointment | undefined => {
    const appointments = appointmentDb.getAll()
    const index = appointments.findIndex((a) => a.id === id)
    if (index === -1) return undefined

    appointments[index] = {
      ...appointments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments)
    
    // Log activity
    activityLogDb.create({
      type: "appointment",
      action: "updated",
      description: `Appointment with ${appointments[index].visitorName} updated`,
      entityId: id,
      entityType: "appointment",
      performedBy: "receptionist-1",
      performedByName: "Receptionist",
    })
    
    return appointments[index]
  },

  delete: (id: string): boolean => {
    const appointments = appointmentDb.getAll()
    const filtered = appointments.filter((a) => a.id !== id)
    if (filtered.length === appointments.length) return false
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, filtered)
    return true
  },

  getByStaff: (staffId: string): Appointment[] => {
    return appointmentDb.getAll().filter((a) => a.staffId === staffId)
  },

  getByDate: (date: Date): Appointment[] => {
    const targetDate = date.toDateString()
    return appointmentDb.getAll().filter((a) => {
      const appointmentDate = new Date(a.appointmentDate).toDateString()
      return appointmentDate === targetDate
    })
  },

  getToday: (): Appointment[] => {
    return appointmentDb.getByDate(new Date())
  },
}

// Inquiry Management
export const inquiryDb = {
  getAll: (): Inquiry[] => getFromStorage<Inquiry>(STORAGE_KEYS.INQUIRIES),

  getById: (id: string): Inquiry | undefined => {
    return inquiryDb.getAll().find((i) => i.id === id)
  },

  create: (inquiry: Omit<Inquiry, "id" | "inquiryNumber" | "createdAt" | "updatedAt">): Inquiry => {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: generateId(),
      inquiryNumber: generateTicketNumber("INQ"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const inquiries = inquiryDb.getAll()
    inquiries.push(newInquiry)
    saveToStorage(STORAGE_KEYS.INQUIRIES, inquiries)
    
    // Log activity
    activityLogDb.create({
      type: "inquiry",
      action: "created",
      description: `New ${newInquiry.type} inquiry from ${newInquiry.fromName}`,
      entityId: newInquiry.id,
      entityType: "inquiry",
      performedBy: "receptionist-1",
      performedByName: "Receptionist",
    })
    
    return newInquiry
  },

  update: (id: string, updates: Partial<Inquiry>): Inquiry | undefined => {
    const inquiries = inquiryDb.getAll()
    const index = inquiries.findIndex((i) => i.id === id)
    if (index === -1) return undefined

    inquiries[index] = {
      ...inquiries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    if (updates.status === "resolved" && !inquiries[index].resolvedAt) {
      inquiries[index].resolvedAt = new Date().toISOString()
      const createdTime = new Date(inquiries[index].createdAt).getTime()
      const resolvedTime = new Date().getTime()
      inquiries[index].responseTime = Math.floor((resolvedTime - createdTime) / 60000)
    }
    
    saveToStorage(STORAGE_KEYS.INQUIRIES, inquiries)
    
    // Notify assigned staff
    if (updates.assignedTo && updates.assignedToName) {
      notificationDb.create({
        type: "inquiry",
        title: "New Inquiry Assigned",
        message: `${inquiries[index].type} inquiry from ${inquiries[index].fromName}`,
        recipientId: updates.assignedTo,
        recipientName: updates.assignedToName,
        relatedEntityId: id,
        relatedEntityType: "inquiry",
        priority: inquiries[index].priority,
      })
    }
    
    return inquiries[index]
  },

  delete: (id: string): boolean => {
    const inquiries = inquiryDb.getAll()
    const filtered = inquiries.filter((i) => i.id !== id)
    if (filtered.length === inquiries.length) return false
    saveToStorage(STORAGE_KEYS.INQUIRIES, filtered)
    return true
  },

  getByStatus: (status: Inquiry["status"]): Inquiry[] => {
    return inquiryDb.getAll().filter((i) => i.status === status)
  },

  getToday: (): Inquiry[] => {
    const today = new Date().toDateString()
    return inquiryDb.getAll().filter((i) => {
      const inquiryDate = new Date(i.createdAt).toDateString()
      return inquiryDate === today
    })
  },
}

// Package Management
export const packageDb = {
  getAll: (): Package[] => getFromStorage<Package>(STORAGE_KEYS.PACKAGES),

  getById: (id: string): Package | undefined => {
    return packageDb.getAll().find((p) => p.id === id)
  },

  create: (pkg: Omit<Package, "id" | "trackingNumber" | "createdAt" | "updatedAt">): Package => {
    const newPackage: Package = {
      ...pkg,
      id: generateId(),
      trackingNumber: generateTicketNumber("PKG"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const packages = packageDb.getAll()
    packages.push(newPackage)
    saveToStorage(STORAGE_KEYS.PACKAGES, packages)
    
    // Notify recipient
    if (newPackage.recipientStaffId && newPackage.recipientName) {
      notificationDb.create({
        type: "package",
        title: "Package Received",
        message: `${newPackage.packageType} from ${newPackage.sender} is ready for pickup`,
        recipientId: newPackage.recipientStaffId,
        recipientName: newPackage.recipientName,
        relatedEntityId: newPackage.id,
        relatedEntityType: "package",
        priority: newPackage.priority,
      })
    }
    
    // Log activity
    activityLogDb.create({
      type: "package",
      action: "created",
      description: `Package received for ${newPackage.recipientName}`,
      entityId: newPackage.id,
      entityType: "package",
      performedBy: "receptionist-1",
      performedByName: "Receptionist",
    })
    
    return newPackage
  },

  update: (id: string, updates: Partial<Package>): Package | undefined => {
    const packages = packageDb.getAll()
    const index = packages.findIndex((p) => p.id === id)
    if (index === -1) return undefined

    packages[index] = {
      ...packages[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    saveToStorage(STORAGE_KEYS.PACKAGES, packages)
    
    // Log activity
    activityLogDb.create({
      type: "package",
      action: "updated",
      description: `Package for ${packages[index].recipientName} status: ${packages[index].status}`,
      entityId: id,
      entityType: "package",
      performedBy: "receptionist-1",
      performedByName: "Receptionist",
    })
    
    return packages[index]
  },

  delete: (id: string): boolean => {
    const packages = packageDb.getAll()
    const filtered = packages.filter((p) => p.id !== id)
    if (filtered.length === packages.length) return false
    saveToStorage(STORAGE_KEYS.PACKAGES, filtered)
    return true
  },

  getByStatus: (status: Package["status"]): Package[] => {
    return packageDb.getAll().filter((p) => p.status === status)
  },

  getToday: (): Package[] => {
    const today = new Date().toDateString()
    return packageDb.getAll().filter((p) => {
      const packageDate = new Date(p.createdAt).toDateString()
      return packageDate === today
    })
  },
}

// Staff Management
export const staffDb = {
  getAll: (): Staff[] => getFromStorage<Staff>(STORAGE_KEYS.STAFF),

  getById: (id: string): Staff | undefined => {
    return staffDb.getAll().find((s) => s.id === id)
  },

  getAvailable: (): Staff[] => {
    return staffDb.getAll().filter((s) => s.isAvailable)
  },
}

// Notification Management
export const notificationDb = {
  getAll: (): Notification[] => getFromStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS),

  getById: (id: string): Notification | undefined => {
    return notificationDb.getAll().find((n) => n.id === id)
  },

  create: (notification: Omit<Notification, "id" | "isRead" | "createdAt">): Notification => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      isRead: false,
      createdAt: new Date().toISOString(),
    }
    const notifications = notificationDb.getAll()
    notifications.push(newNotification)
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
    return newNotification
  },

  markAsRead: (id: string): Notification | undefined => {
    const notifications = notificationDb.getAll()
    const index = notifications.findIndex((n) => n.id === id)
    if (index === -1) return undefined

    notifications[index].isRead = true
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
    return notifications[index]
  },

  getUnread: (): Notification[] => {
    return notificationDb.getAll().filter((n) => !n.isRead)
  },

  getByRecipient: (recipientId: string): Notification[] => {
    return notificationDb.getAll().filter((n) => n.recipientId === recipientId)
  },

  getByEntity: (entityId: string, entityType: string): Notification[] => {
    return notificationDb.getAll().filter((n) => n.relatedEntityId === entityId && n.relatedEntityType === entityType)
  },
}

// Activity Log
export const activityLogDb = {
  getAll: (): ActivityLog[] => getFromStorage<ActivityLog>(STORAGE_KEYS.ACTIVITY_LOG),

  create: (log: Omit<ActivityLog, "id" | "timestamp">): ActivityLog => {
    const newLog: ActivityLog = {
      ...log,
      id: generateId(),
      timestamp: new Date().toISOString(),
    }
    const logs = activityLogDb.getAll()
    logs.push(newLog)
    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.shift()
    }
    saveToStorage(STORAGE_KEYS.ACTIVITY_LOG, logs)
    return newLog
  },

  getByType: (type: ActivityLog["type"]): ActivityLog[] => {
    return activityLogDb.getAll().filter((l) => l.type === type)
  },

  getByEntity: (entityId: string, entityType: string): ActivityLog[] => {
    return activityLogDb.getAll().filter((l) => l.entityId === entityId && l.entityType === entityType)
  },

  getToday: (): ActivityLog[] => {
    const today = new Date().toDateString()
    return activityLogDb.getAll().filter((l) => {
      const logDate = new Date(l.timestamp).toDateString()
      return logDate === today
    })
  },
}

// Dashboard Statistics
export const statsDb = {
  calculate: (): DashboardStats => {
    const todayVisitors = visitorDb.getToday()
    const todayAppointments = appointmentDb.getToday()
    const todayInquiries = inquiryDb.getToday()
    const todayPackages = packageDb.getToday()

    const stats: DashboardStats = {
      today: {
        visitors: {
          total: todayVisitors.length,
          waiting: todayVisitors.filter((v) => v.status === "waiting").length,
          inProgress: todayVisitors.filter((v) => v.status === "in-progress").length,
          completed: todayVisitors.filter((v) => v.status === "completed").length,
          cancelled: todayVisitors.filter((v) => v.status === "cancelled").length,
        },
        appointments: {
          total: todayAppointments.length,
          scheduled: todayAppointments.filter((a) => a.status === "scheduled" || a.status === "confirmed").length,
          completed: todayAppointments.filter((a) => a.status === "completed").length,
          cancelled: todayAppointments.filter((a) => a.status === "cancelled").length,
          rescheduled: todayAppointments.filter((a) => a.status === "rescheduled").length,
        },
        inquiries: {
          total: todayInquiries.length,
          new: todayInquiries.filter((i) => i.status === "new").length,
          assigned: todayInquiries.filter((i) => i.status === "assigned" || i.status === "in-progress").length,
          resolved: todayInquiries.filter((i) => i.status === "resolved" || i.status === "closed").length,
        },
        packages: {
          total: todayPackages.length,
          received: todayPackages.filter((p) => p.status === "received").length,
          delivered: todayPackages.filter((p) => p.status === "delivered" || p.status === "collected").length,
          pending: todayPackages.filter((p) => p.status === "pending-pickup" || p.status === "assigned").length,
        },
      },
      avgWaitTime: calculateAvgWaitTime(todayVisitors),
      avgServiceTime: calculateAvgServiceTime(todayVisitors),
      peakHour: calculatePeakHour(todayVisitors),
      customerSatisfaction: 4.5, // This would come from a satisfaction survey system
    }

    return stats
  },
}

function calculateAvgWaitTime(visitors: Visitor[]): number {
  const completedVisitors = visitors.filter((v) => v.status === "completed" && v.checkOutTime)
  if (completedVisitors.length === 0) return 0

  const totalWaitTime = completedVisitors.reduce((sum, v) => {
    const checkIn = new Date(v.checkInTime).getTime()
    const checkOut = new Date(v.checkOutTime!).getTime()
    return sum + (checkOut - checkIn)
  }, 0)

  return Math.floor(totalWaitTime / completedVisitors.length / 60000) // Convert to minutes
}

function calculateAvgServiceTime(visitors: Visitor[]): number {
  return Math.floor(calculateAvgWaitTime(visitors) * 0.6) // Approximate service time
}

function calculatePeakHour(visitors: Visitor[]): string {
  const hourCounts: Record<number, number> = {}

  visitors.forEach((v) => {
    const hour = new Date(v.checkInTime).getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })

  const peakHour = Object.entries(hourCounts).reduce(
    (max, [hour, count]) => (count > max.count ? { hour: parseInt(hour), count } : max),
    { hour: 9, count: 0 }
  )

  const startHour = peakHour.hour
  const endHour = (startHour + 1) % 24
  return `${formatHour(startHour)} - ${formatHour(endHour)}`
}

function formatHour(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM"
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:00 ${period}`
}

// ============================================================
// TICKET LIFECYCLE MANAGEMENT
// Complete flow: Submit → Record → Categorize → Route → Handle → Resolve → Notify
// ============================================================

export const ticketLifecycleDb = {
  /**
   * STEP 1: Submit and Record Ticket
   * Creates a new visitor ticket and records it in the database
   */
  submitTicket: (ticketData: Omit<Visitor, "id" | "ticketNumber" | "createdAt" | "updatedAt">) => {
    // Record ticket in database
    const newTicket = visitorDb.create(ticketData)
    
    // Create initial notification for receptionist
    notificationDb.create({
      type: "visitor",
      title: "New Ticket Submitted",
      message: `Ticket ${newTicket.ticketNumber} created for ${newTicket.name}`,
      recipientId: "receptionist-1",
      recipientName: "Receptionist",
      relatedEntityId: newTicket.id,
      relatedEntityType: "visitor",
      priority: newTicket.priority,
    })
    
    return newTicket
  },

  /**
   * STEP 2: Categorize and Route Ticket
   * Automatically categorizes ticket based on purpose and routes to appropriate staff
   */
  categorizeAndRoute: (ticketId: string, autoRoute: boolean = true) => {
    const ticket = visitorDb.getById(ticketId)
    if (!ticket) throw new Error("Ticket not found")

    // Categorize based on purpose
    const category = categorizeTicket(ticket.purposeOfVisit)
    
    // Find best matching staff if auto-routing is enabled
    let assignedStaff: Staff | undefined
    if (autoRoute && !ticket.hostStaffId) {
      assignedStaff = findBestStaffMatch(ticket, category)
      
      if (assignedStaff) {
        // Update ticket with assigned staff
        visitorDb.update(ticketId, {
          hostStaffId: assignedStaff.id,
          hostStaffName: assignedStaff.name,
        })
        
        // Notify assigned staff
        notificationDb.create({
          type: "visitor",
          title: "New Ticket Assigned",
          message: `You have been assigned ticket ${ticket.ticketNumber} for ${ticket.name}`,
          recipientId: assignedStaff.id,
          recipientName: assignedStaff.name,
          relatedEntityId: ticket.id,
          relatedEntityType: "visitor",
          priority: ticket.priority,
        })
        
        // Log routing activity
        activityLogDb.create({
          type: "visitor",
          action: "routed",
          description: `Ticket ${ticket.ticketNumber} auto-routed to ${assignedStaff.name} (${category})`,
          entityId: ticket.id,
          entityType: "visitor",
          performedBy: "system",
          performedByName: "Auto-Router",
        })
      }
    }
    
    return {
      ticket,
      category,
      assignedStaff,
    }
  },

  /**
   * STEP 3: Staff Handles and Updates Ticket
   * Staff member updates ticket status and adds notes during handling
   */
  handleTicket: (
    ticketId: string,
    staffId: string,
    updates: {
      status?: Visitor["status"]
      notes?: string
      resolution?: string
    }
  ) => {
    const ticket = visitorDb.getById(ticketId)
    if (!ticket) throw new Error("Ticket not found")

    // Update ticket status
    const updatedTicket = visitorDb.update(ticketId, {
      ...updates,
      status: updates.status || "in-progress",
    })
    
    if (!updatedTicket) throw new Error("Failed to update ticket")

    // Log handling activity
    const staff = staffDb.getById(staffId)
    activityLogDb.create({
      type: "visitor",
      action: "updated",
      description: `Ticket ${ticket.ticketNumber} updated by ${staff?.name || "staff"} - Status: ${updates.status || "in-progress"}`,
      entityId: ticket.id,
      entityType: "visitor",
      performedBy: staffId,
      performedByName: staff?.name || "Staff",
    })
    
    // Notify receptionist of progress
    if (updates.status === "in-progress") {
      notificationDb.create({
        type: "visitor",
        title: "Ticket In Progress",
        message: `${staff?.name || "Staff"} is now handling ticket ${ticket.ticketNumber}`,
        recipientId: "receptionist-1",
        recipientName: "Receptionist",
        relatedEntityId: ticket.id,
        relatedEntityType: "visitor",
        priority: ticket.priority,
      })
    }
    
    return updatedTicket
  },

  /**
   * STEP 4: Resolve and Close Ticket
   * Marks ticket as completed and triggers user notification
   */
  resolveTicket: (
    ticketId: string,
    staffId: string,
    resolution: {
      notes: string
      satisfactionRating?: number
      feedbackRequested?: boolean
    }
  ) => {
    const ticket = visitorDb.getById(ticketId)
    if (!ticket) throw new Error("Ticket not found")

    // Update ticket to completed status
    const updatedTicket = visitorDb.update(ticketId, {
      status: "completed",
      checkOutTime: new Date().toISOString(),
      notes: ticket.notes ? `${ticket.notes}\n\nResolution: ${resolution.notes}` : `Resolution: ${resolution.notes}`,
    })
    
    if (!updatedTicket) throw new Error("Failed to resolve ticket")

    // Log resolution activity
    const staff = staffDb.getById(staffId)
    activityLogDb.create({
      type: "visitor",
      action: "completed",
      description: `Ticket ${ticket.ticketNumber} resolved by ${staff?.name || "staff"}`,
      entityId: ticket.id,
      entityType: "visitor",
      performedBy: staffId,
      performedByName: staff?.name || "Staff",
    })
    
    // Notify user (customer)
    sendUserNotification(updatedTicket, resolution)
    
    // Notify receptionist
    notificationDb.create({
      type: "visitor",
      title: "Ticket Resolved",
      message: `Ticket ${ticket.ticketNumber} for ${ticket.name} has been resolved`,
      recipientId: "receptionist-1",
      recipientName: "Receptionist",
      relatedEntityId: ticket.id,
      relatedEntityType: "visitor",
      priority: "normal",
    })
    
    return {
      ticket: updatedTicket,
      notificationSent: true,
      feedbackRequested: resolution.feedbackRequested,
    }
  },

  /**
   * Get ticket lifecycle status
   * Returns current stage and next actions
   */
  getTicketStatus: (ticketId: string) => {
    const ticket = visitorDb.getById(ticketId)
    if (!ticket) throw new Error("Ticket not found")

    const activities = activityLogDb.getByEntity(ticketId, "visitor")
    const notifications = notificationDb.getByEntity(ticketId, "visitor")
    
    return {
      ticket,
      currentStage: getLifecycleStage(ticket),
      activities: activities.slice(-5), // Last 5 activities
      notifications: notifications.slice(-3), // Last 3 notifications
      nextActions: getNextActions(ticket),
    }
  },
}

// Helper functions for ticket lifecycle

function categorizeTicket(purpose: string): string {
  const purposeLower = purpose.toLowerCase()
  
  if (purposeLower.includes("technical") || purposeLower.includes("support") || purposeLower.includes("it")) {
    return "Technical Support"
  } else if (purposeLower.includes("billing") || purposeLower.includes("payment") || purposeLower.includes("invoice")) {
    return "Billing"
  } else if (purposeLower.includes("account") || purposeLower.includes("profile")) {
    return "Account Services"
  } else if (purposeLower.includes("sales") || purposeLower.includes("purchase") || purposeLower.includes("consultation")) {
    return "Sales"
  } else if (purposeLower.includes("general") || purposeLower.includes("inquiry")) {
    return "General Inquiry"
  }
  
  return "General"
}

function findBestStaffMatch(ticket: Visitor, category: string): Staff | undefined {
  const availableStaff = staffDb.getAvailable()
  
  if (availableStaff.length === 0) return undefined
  
  // Simple matching based on department and category
  let bestMatch = availableStaff.find(staff => {
    if (category.includes("Technical") || category.includes("IT")) {
      return staff.department.toLowerCase().includes("it") || 
             staff.department.toLowerCase().includes("technical")
    } else if (category.includes("Sales")) {
      return staff.department.toLowerCase().includes("sales")
    } else if (category.includes("Billing")) {
      return staff.department.toLowerCase().includes("billing") ||
             staff.department.toLowerCase().includes("finance")
    }
    return false
  })
  
  // If no specific match, return first available staff
  return bestMatch || availableStaff[0]
}

function getLifecycleStage(ticket: Visitor): string {
  switch (ticket.status) {
    case "waiting":
      return ticket.hostStaffId ? "Routed - Awaiting Staff" : "Submitted - Pending Routing"
    case "in-progress":
      return "Being Handled by Staff"
    case "completed":
      return "Resolved and Closed"
    case "cancelled":
      return "Cancelled"
    default:
      return "Unknown"
  }
}

function getNextActions(ticket: Visitor): string[] {
  const actions: string[] = []
  
  switch (ticket.status) {
    case "waiting":
      if (!ticket.hostStaffId) {
        actions.push("Assign to staff member")
        actions.push("Auto-route to available staff")
      } else {
        actions.push("Notify assigned staff")
        actions.push("Change assignment")
      }
      break
    case "in-progress":
      actions.push("Add progress notes")
      actions.push("Update status")
      actions.push("Resolve ticket")
      break
    case "completed":
      actions.push("Request feedback")
      actions.push("View resolution details")
      break
    case "cancelled":
      actions.push("View cancellation reason")
      break
  }
  
  return actions
}

function sendUserNotification(ticket: Visitor, resolution: { notes: string; feedbackRequested?: boolean }) {
  // In a real application, this would send SMS/Email to the customer
  console.log(`📧 Notification sent to ${ticket.name} (${ticket.phone})`)
  console.log(`   Ticket ${ticket.ticketNumber} has been resolved`)
  console.log(`   Resolution: ${resolution.notes}`)
  
  if (resolution.feedbackRequested) {
    console.log(`   Please share your feedback: [Feedback Link]`)
  }
  
  // Log the notification
  activityLogDb.create({
    type: "system",
    action: "notification_sent",
    description: `Resolution notification sent to ${ticket.name}`,
    entityId: ticket.id,
    entityType: "visitor",
    performedBy: "system",
    performedByName: "Notification Service",
  })
}

// ============================================================
// END TICKET LIFECYCLE MANAGEMENT
// ============================================================

// Initialize with sample data if empty
export function initializeSampleData() {
  // Only initialize if storage is empty
  if (staffDb.getAll().length === 0) {
    // Add sample staff
    const sampleStaff: Staff[] = [
      {
        id: "staff-1",
        name: "Sarah Wilson",
        email: "sarah.wilson@company.com",
        phone: "+1 (555) 111-2222",
        department: "Sales",
        position: "Sales Manager",
        isAvailable: true,
        notificationPreferences: { email: true, sms: true, push: true },
      },
      {
        id: "staff-2",
        name: "John Smith",
        email: "john.smith@company.com",
        phone: "+1 (555) 222-3333",
        department: "IT",
        position: "IT Manager",
        isAvailable: true,
        notificationPreferences: { email: true, sms: false, push: true },
      },
    ]
    saveToStorage(STORAGE_KEYS.STAFF, sampleStaff)
  }
  
  // Add sample waiting visitors for testing
  if (visitorDb.getByStatus("waiting").length === 0) {
    const sampleVisitors: Omit<Visitor, "id" | "ticketNumber" | "createdAt" | "updatedAt">[] = [
      {
        name: "Michael Johnson",
        phone: "+1 (555) 333-4444",
        email: "michael.j@email.com",
        company: "Tech Corp",
        purposeOfVisit: "Sales consultation",
        priority: "high",
        checkInTime: new Date().toISOString(),
        status: "waiting",
        notes: "Interested in enterprise solutions",
      },
      {
        name: "Emily Davis",
        phone: "+1 (555) 444-5555",
        email: "emily.davis@email.com",
        company: "Digital Inc",
        purposeOfVisit: "IT Technical Support",
        priority: "urgent",
        checkInTime: new Date().toISOString(),
        status: "waiting",
        notes: "Server connectivity issues",
      },
    ]
    
    sampleVisitors.forEach(visitor => {
      visitorDb.create(visitor)
    })
  }
}
