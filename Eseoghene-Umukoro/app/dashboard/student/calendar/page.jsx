"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { CalendarView } from "@/components/calendar-view"
import { AssignmentDetailsDialog } from "@/components/assignment-details-dialog"
import { CheckCircle, ArrowLeft, LogOut, Settings } from "lucide-react"
import { NotificationBell } from "@/components/notification-bell"
import Link from "next/link"

export default function CalendarPage() {
  const { user, logout } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`assignments_${user?.id}`)
    if (stored) {
      setAssignments(JSON.parse(stored))
    }
  }, [user])

  const updateAssignmentProgress = (id, progress) => {
    const updated = assignments.map((a) =>
      a.id === id ? { ...a, progress, status: progress === 100 ? "completed" : "pending" } : a,
    )
    setAssignments(updated)
    localStorage.setItem(`assignments_${user?.id}`, JSON.stringify(updated))
  }

  const updateAssignmentStatus = (id, status) => {
    const updated = assignments.map((a) =>
      a.id === id ? { ...a, status, progress: status === "completed" ? 100 : a.progress } : a,
    )
    setAssignments(updated)
    localStorage.setItem(`assignments_${user?.id}`, JSON.stringify(updated))
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">AssignTrack</span>
              </div>
              <div className="flex items-center gap-4">
                <NotificationBell />
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
                <Button variant="ghost" onClick={logout} className="text-gray-700">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/dashboard/student">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignment Calendar</h1>
            <p className="text-gray-600">View all your assignments across different months</p>
          </div>

          <CalendarView
            assignments={assignments}
            onAssignmentClick={(assignment) => {
              setSelectedAssignment(assignment)
              setShowDetailsDialog(true)
            }}
          />
        </div>

        {selectedAssignment && (
          <AssignmentDetailsDialog
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
            assignment={selectedAssignment}
            onUpdateProgress={updateAssignmentProgress}
            onUpdateStatus={updateAssignmentStatus}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
