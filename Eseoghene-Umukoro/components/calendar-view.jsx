"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

export function CalendarView({ assignments, onAssignmentClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getAssignmentsForDate = (date) => {
    return assignments.filter((assignment) => {
      const assignmentDate = new Date(assignment.dueDate)
      return (
        assignmentDate.getDate() === date.getDate() &&
        assignmentDate.getMonth() === date.getMonth() &&
        assignmentDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const today = new Date()
  const isToday = (day) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              <Calendar className="w-4 h-4 mr-2" />
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const date = new Date(year, month, day)
            const dayAssignments = getAssignmentsForDate(date)
            const hasAssignments = dayAssignments.length > 0

            return (
              <div
                key={day}
                className={`aspect-square border rounded-lg p-2 ${
                  isToday(day) ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200"
                } ${hasAssignments ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
              >
                <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                <div className="space-y-1">
                  {dayAssignments.slice(0, 2).map((assignment) => (
                    <div
                      key={assignment.id}
                      onClick={() => onAssignmentClick(assignment)}
                      className={`text-xs px-2 py-1 rounded truncate ${
                        assignment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : assignment.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : assignment.priority === "medium"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {assignment.title}
                    </div>
                  ))}
                  {dayAssignments.length > 2 && (
                    <div className="text-xs text-gray-500 px-2">+{dayAssignments.length - 2} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-sm text-gray-600">High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
            <span className="text-sm text-gray-600">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
            <span className="text-sm text-gray-600">Low Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
