"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Calendar, CheckCircle, Clock } from "lucide-react"

export function AssignmentDetailsDialog({ open, onOpenChange, assignment, onUpdateProgress, onUpdateStatus }) {
  const [progress, setProgress] = useState(assignment.progress)

  const handleSaveProgress = () => {
    onUpdateProgress(assignment.id, progress)
    onOpenChange(false)
  }

  const handleMarkComplete = () => {
    onUpdateStatus(assignment.id, "completed")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{assignment.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                assignment.priority === "high"
                  ? "bg-red-100 text-red-700"
                  : assignment.priority === "medium"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
              }`}
            >
              {assignment.priority} priority
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                assignment.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
              }`}
            >
              {assignment.status}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Course:</span>
              <span>{assignment.course}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Due Date:</span>
              <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
            </div>
          </div>

          {assignment.description && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{assignment.description}</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Progress</h4>
              <span className="text-2xl font-bold text-blue-600">{progress}%</span>
            </div>
            <Progress value={progress} className="mb-4" />
            {assignment.status !== "completed" && (
              <div className="space-y-2">
                <Label>Update Progress</Label>
                <Slider value={[progress]} onValueChange={(value) => setProgress(value[0])} max={100} step={5} />
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {assignment.status !== "completed" && (
              <>
                <Button onClick={handleSaveProgress} className="bg-blue-600 hover:bg-blue-700">
                  Save Progress
                </Button>
                <Button onClick={handleMarkComplete} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Label({ children }) {
  return <label className="text-sm font-medium text-gray-700">{children}</label>
}
