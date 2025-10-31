"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function NotificationBell() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem(`notifications_${user?.id}`)
    if (stored) {
      const allNotifications = JSON.parse(stored)
      setNotifications(allNotifications.slice(0, 5))
      setUnreadCount(allNotifications.filter((n) => !n.read).length)
    }
  }, [user])

  const markAsRead = (id) => {
    const stored = localStorage.getItem(`notifications_${user?.id}`)
    if (stored) {
      const allNotifications = JSON.parse(stored)
      const updated = allNotifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated))
      setNotifications(updated.slice(0, 5))
      setUnreadCount(updated.filter((n) => !n.read).length)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-600 py-4 text-center">No notifications</p>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="font-medium text-sm">{notification.title}</span>
                    {!notification.read && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                  </div>
                  <span className="text-xs text-gray-600">{notification.message}</span>
                  <span className="text-xs text-gray-400 mt-1">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
