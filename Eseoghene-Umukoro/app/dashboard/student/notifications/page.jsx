"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CheckCircle, ArrowLeft, LogOut, Settings, Bell, Trash2, Mail, MessageSquare } from "lucide-react"
import { NotificationBell } from "@/components/notification-bell"
import Link from "next/link"

export default function NotificationsPage() {
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [whatsappEnabled, setWhatsappEnabled] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`notifications_${user?.id}`)
    if (stored) {
      setNotifications(JSON.parse(stored))
    } else {
      // Initialize with sample notifications
      const sampleNotifications = [
        {
          id: "1",
          title: "Assignment Due Soon",
          message: "React Fundamentals Project is due in 2 days",
          time: "2 hours ago",
          read: false,
          type: "reminder",
        },
        {
          id: "2",
          title: "New Assignment Added",
          message: "JavaScript ES6 Assignment has been added",
          time: "1 day ago",
          read: false,
          type: "info",
        },
        {
          id: "3",
          title: "Assignment Completed",
          message: "You completed HTML & CSS Basics",
          time: "3 days ago",
          read: true,
          type: "success",
        },
      ]
      setNotifications(sampleNotifications)
      localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(sampleNotifications))
    }

    // Load notification settings
    const settings = localStorage.getItem(`notification_settings_${user?.id}`)
    if (settings) {
      const parsed = JSON.parse(settings)
      setEmailEnabled(parsed.email)
      setWhatsappEnabled(parsed.whatsapp)
    }
  }, [user])

  const markAsRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    setNotifications(updated)
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated))
  }

  const deleteNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated))
  }

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updated))
  }

  const saveSettings = () => {
    const settings = {
      email: emailEnabled,
      whatsapp: whatsappEnabled,
    }
    localStorage.setItem(`notification_settings_${user?.id}`, JSON.stringify(settings))
    alert("Notification settings saved!")
  }

  const unreadNotifications = notifications.filter((n) => !n.read)

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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/dashboard/student">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
                <p className="text-gray-600">Stay updated with your assignment reminders and updates</p>
              </div>
              {unreadNotifications.length > 0 && (
                <Button onClick={markAllAsRead} variant="outline">
                  Mark All as Read
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="unread" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="unread">Unread ({unreadNotifications.length})</TabsTrigger>
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="unread" className="space-y-4">
              {unreadNotifications.length === 0 ? (
                <Card className="p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No unread notifications</p>
                </Card>
              ) : (
                unreadNotifications.map((notification) => (
                  <Card key={notification.id} className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-sm text-gray-500">{notification.time}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => markAsRead(notification.id)}>
                          Mark as Read
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {notifications.length === 0 ? (
                <Card className="p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No notifications yet</p>
                </Card>
              ) : (
                notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`p-4 ${!notification.read ? "bg-blue-50 border-blue-200" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-sm text-gray-500">{notification.time}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* Notification Settings */}
          <Card className="p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Customize Your Notifications</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">
                      Email Reminders
                    </Label>
                    <p className="text-sm text-gray-600">Receive assignment reminders via email</p>
                  </div>
                </div>
                <Switch id="email" checked={emailEnabled} onCheckedChange={setEmailEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <div>
                    <Label htmlFor="whatsapp" className="text-base font-medium">
                      WhatsApp Reminders
                    </Label>
                    <p className="text-sm text-gray-600">Receive assignment reminders via WhatsApp</p>
                  </div>
                </div>
                <Switch id="whatsapp" checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
              </div>

              <Button onClick={saveSettings} className="w-full bg-blue-600 hover:bg-blue-700">
                Save Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
