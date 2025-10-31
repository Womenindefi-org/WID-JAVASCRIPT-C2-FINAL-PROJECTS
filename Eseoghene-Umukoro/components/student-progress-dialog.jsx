"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Calendar } from "lucide-react"

export function StudentProgressDialog({ open, onOpenChange, student }) {
  const pendingAssignments = student.assignments.filter((a) => a.status === "pending")
  const completedAssignments = student.assignments.filter((a) => a.status === "completed")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{student.name}'s Progress Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600 mb-1">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{student.totalAssignments}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">{student.completedAssignments}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{student.pendingAssignments}</p>
            </Card>
          </div>

          {/* Overall Progress */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Overall Completion Rate</h3>
              <span className="text-2xl font-bold text-blue-600">{student.completionRate}%</span>
            </div>
            <Progress value={student.completionRate} className="h-3" />
          </Card>

          {/* Pending Assignments */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Pending Assignments ({pendingAssignments.length})
            </h3>
            <div className="space-y-2">
              {pendingAssignments.length === 0 ? (
                <p className="text-sm text-gray-600">No pending assignments</p>
              ) : (
                pendingAssignments.map((assignment) => (
                  <Card key={assignment.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
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
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Completed Assignments */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Completed Assignments ({completedAssignments.length})
            </h3>
            <div className="space-y-2">
              {completedAssignments.length === 0 ? (
                <p className="text-sm text-gray-600">No completed assignments yet</p>
              ) : (
                completedAssignments.map((assignment) => (
                  <Card key={assignment.id} className="p-3 bg-green-50 border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-600">{assignment.course}</p>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
