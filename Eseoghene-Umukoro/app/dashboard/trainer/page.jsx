"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { TrainerDashboard } from "@/components/trainer-dashboard"

export default function TrainerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["trainer"]}>
      <TrainerDashboard />
    </ProtectedRoute>
  )
}
