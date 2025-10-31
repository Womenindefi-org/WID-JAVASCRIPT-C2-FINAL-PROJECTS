"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, LogOut, Settings, Users, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react"
import { StudentProgressDialog } from "./student-progress-dialog"

export function TrainerDashboard() {
  const { user, logout } = useAuth()
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showProgressDialog, setShowProgressDialog] = useState(false)

  useEffect(() => {
    // Load all users and their assignments
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const studentUsers = allUsers.filter((u) => u.userType === "student")

    const studentsWithProgress = studentUsers.map((student) => {
      const assignments = JSON.parse(localStorage.getItem(`assignments_${student.id}`) || "[]")
      const completed = assignments.filter((a) => a.status === "completed").length
      const total = assignments.length
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

      return {
        ...student,
        assignments,
        totalAssignments: total,
        completedAssignments: completed,
        pendingAssignments: total - completed,
        completionRate,
      }
    })

    setStudents(studentsWithProgress)
  }, [])

  const topPerformers = students
    .filter((s) => s.completionRate >= 70)
    .sort((a, b) => b.completionRate - a.completionRate)

  const atRiskStudents = students.filter((s) => s.completionRate < 50 && s.totalAssignments > 0)

  const totalAssignments = students.reduce((sum, s) => sum + s.totalAssignments, 0)
  const totalCompleted = students.reduce((sum, s) => sum + s.completedAssignments, 0)
  const overallCompletion = totalAssignments > 0 ? Math.round((totalCompleted / totalAssignments) * 100) : 0

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Monitor your students' progress and provide support where needed</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Students</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{students.length}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Assignments</span>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalAssignments}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Completed</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalCompleted}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Overall Completion</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{overallCompletion}%</div>
            <Progress value={overallCompletion} className="mt-2" />
          </Card>
        </div>

        {/* Students Tabs */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Student Progress Overview</h2>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">All Students ({students.length})</TabsTrigger>
              <TabsTrigger value="top">Top Performers ({topPerformers.length})</TabsTrigger>
              <TabsTrigger value="risk">At Risk ({atRiskStudents.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {students.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No students enrolled yet</p>
                </div>
              ) : (
                students.map((student) => (
                  <Card key={student.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{student.name}</h3>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-lg font-semibold text-gray-900">{student.totalAssignments}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Completed</p>
                            <p className="text-lg font-semibold text-green-600">{student.completedAssignments}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-lg font-semibold text-orange-600">{student.pendingAssignments}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Completion Rate</span>
                            <span className="font-semibold text-gray-900">{student.completionRate}%</span>
                          </div>
                          <Progress value={student.completionRate} />
                        </div>
                      </div>
                      <div className="ml-6">
                        <Button
                          onClick={() => {
                            setSelectedStudent(student)
                            setShowProgressDialog(true)
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="top" className="space-y-4">
              {topPerformers.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No top performers yet</p>
                </div>
              ) : (
                topPerformers.map((student, index) => (
                  <Card key={student.id} className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{student.name}</h3>
                          <div className="flex items-center gap-6 text-sm">
                            <span className="text-gray-600">
                              {student.completedAssignments}/{student.totalAssignments} completed
                            </span>
                            <span className="font-semibold text-green-600">{student.completionRate}% completion</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedStudent(student)
                          setShowProgressDialog(true)
                        }}
                        variant="outline"
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              {atRiskStudents.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">All students are on track!</p>
                </div>
              ) : (
                atRiskStudents.map((student) => (
                  <Card key={student.id} className="p-4 bg-red-50 border-red-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{student.name}</h3>
                          <div className="flex items-center gap-6 text-sm mb-2">
                            <span className="text-gray-600">
                              {student.completedAssignments}/{student.totalAssignments} completed
                            </span>
                            <span className="font-semibold text-red-600">{student.completionRate}% completion</span>
                          </div>
                          <p className="text-sm text-red-700">
                            Recommendation: Schedule a check-in to provide additional support
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedStudent(student)
                          setShowProgressDialog(true)
                        }}
                        variant="outline"
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

      {selectedStudent && (
        <StudentProgressDialog
          open={showProgressDialog}
          onOpenChange={setShowProgressDialog}
          student={selectedStudent}
        />
      )}
    </div>
  )
}
