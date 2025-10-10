"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { StudentDashboard } from "@/components/student-dashboard"

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentDashboard />
    </ProtectedRoute>
  )
}
