"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Plus, Calendar, CheckCircle, Clock, AlertCircle, LogOut, Settings, Bell, BarChart3 } from "lucide-react"
import { AddAssignmentDialog } from "./add-assignment-dialog"
import { AssignmentDetailsDialog } from "./assignment-details-dialog"
import { NotificationBell } from "./notification-bell"
import Link from "next/link"

export function StudentDashboard() {
  const { user, logout } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  useEffect(() => {
    // Load assignments from localStorage
    const stored = localStorage.getItem(`assignments_${user?.id}`)
    if (stored) {
      setAssignments(JSON.parse(stored))
    } else {
      // Initialize with sample data
      const sampleAssignments = [
        {
          id: "1",
          title: "React Fundamentals Project",
          course: "Web Development",
          dueDate: "2025-01-15",
          priority: "high",
          status: "pending",
          description: "Build a complete React application demonstrating core concepts",
          progress: 60,
        },
        {
          id: "2",
          title: "JavaScript ES6 Assignment",
          course: "Programming",
          dueDate: "2025-01-20",
          priority: "medium",
          status: "pending",
          description: "Complete exercises on arrow functions, destructuring, and promises",
          progress: 30,
        },
      ]
      setAssignments(sampleAssignments)
      localStorage.setItem(`assignments_${user?.id}`, JSON.stringify(sampleAssignments))
    }
  }, [user])

  const saveAssignments = (newAssignments) => {
    setAssignments(newAssignments)
    localStorage.setItem(`assignments_${user?.id}`, JSON.stringify(newAssignments))
  }

  const addAssignment = (newAssignment) => {
    const assignment = {
      ...newAssignment,
      id: Date.now().toString(),
      status: "pending",
      progress: 0,
    }
    saveAssignments([...assignments, assignment])
  }

  const updateAssignmentStatus = (id, status) => {
    const updated = assignments.map((a) =>
      a.id === id ? { ...a, status, progress: status === "completed" ? 100 : a.progress } : a,
    )
    saveAssignments(updated)
  }

  const updateAssignmentProgress = (id, progress) => {
    const updated = assignments.map((a) =>
      a.id === id ? { ...a, progress, status: progress === 100 ? "completed" : "pending" } : a,
    )
    saveAssignments(updated)
  }

  const pendingAssignments = assignments.filter((a) => a.status === "pending")
  const completedAssignments = assignments.filter((a) => a.status === "completed")
  const completionRate =
    assignments.length > 0 ? Math.round((completedAssignments.length / assignments.length) * 100) : 0

  const upcomingDeadlines = pendingAssignments
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3)

  return (
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600">Here's an overview of your assignments and progress</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Total Assignments</span>
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{assignments.length}</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Pending</span>
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{pendingAssignments.length}</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Completed</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{completedAssignments.length}</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Completion Rate</span>
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{completionRate}%</div>
                <Progress value={completionRate} className="mt-2" />
              </Card>
            </div>

            {/* Assignments Tabs */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Assignments</h2>
                <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Assignment
                </Button>
              </div>

              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({completedAssignments.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                  {pendingAssignments.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No pending assignments</p>
                    </div>
                  ) : (
                    pendingAssignments.map((assignment) => (
                      <Card key={assignment.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  assignment.priority === "high"
                                    ? "bg-red-100 text-red-700"
                                    : assignment.priority === "medium"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {assignment.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </span>
                              <span>Progress: {assignment.progress}%</span>
                            </div>
                            <Progress value={assignment.progress} className="mt-2" />
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAssignment(assignment)
                                setShowDetailsDialog(true)
                              }}
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateAssignmentStatus(assignment.id, "completed")}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  {completedAssignments.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No completed assignments yet</p>
                    </div>
                  ) : (
                    completedAssignments.map((assignment) => (
                      <Card key={assignment.id} className="p-4 bg-green-50 border-green-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Completed: {new Date(assignment.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAssignment(assignment)
                              setShowDetailsDialog(true)
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Upcoming Deadlines */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-sm text-gray-600">No upcoming deadlines</p>
                ) : (
                  upcomingDeadlines.map((assignment) => (
                    <div key={assignment.id} className="border-l-4 border-orange-500 pl-3">
                      <p className="font-medium text-sm text-gray-900">{assignment.title}</p>
                      <p className="text-xs text-gray-600">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/dashboard/student/calendar">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </Link>
                <Link href="/dashboard/student/notifications">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddAssignmentDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={addAssignment} />

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
  )
}
