"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Mail,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  RefreshCw,
  Database,
  MessageSquare,
  Users,
  Send,
} from "lucide-react"
import { contactLogger, type ContactSubmissionLog, type ContactAnalytics } from "@/lib/contact-logger"

export function MessagesDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    successRate: 0,
  })
  const [recentMessages, setRecentMessages] = useState<ContactSubmissionLog[]>([])
  const [analytics, setAnalytics] = useState<ContactAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [hasData, setHasData] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log("Loading messages data...")

      // First check if we can connect to the database
      const testConnection = await contactLogger.getSubmissionStats()
      console.log("Database connection test:", testConnection)

      const [statsData, messagesData, analyticsData] = await Promise.all([
        contactLogger.getSubmissionStats(),
        contactLogger.getRecentSubmissions(20),
        contactLogger.getAnalytics(7),
      ])

      console.log("Stats data received:", statsData)
      console.log("Messages data received:", messagesData.length, "items")
      console.log("Analytics data received:", analyticsData.length, "items")

      setStats(statsData)
      setRecentMessages(messagesData)
      setAnalytics(analyticsData)

      // Check if we have any data at all
      const hasAnyData = statsData.total > 0 || messagesData.length > 0
      console.log("Has data:", hasAnyData)
      setHasData(hasAnyData)
    } catch (error) {
      console.error("Failed to load messages data:", error)
      // Set default values instead of failing completely
      setStats({
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        successRate: 0,
      })
      setRecentMessages([])
      setAnalytics([])
      setHasData(false)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Send className="w-3 h-3 mr-1" />
            Responded
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            New
          </Badge>
        )
      case "received":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Received
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Messages", icon: MessageSquare },
            { title: "Today", icon: Calendar },
            { title: "This Month", icon: Users },
            { title: "Response Rate", icon: Send },
          ].map((item, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading Messages...</CardTitle>
            <CardDescription>Please wait while we fetch your messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 border rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Setup Alert */}
      {!hasData && (
        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            The messages system is ready, but no messages have been received yet. The database table will be created
            automatically when the first contact form is submitted.
            <br />
            <br />
            To set up the messages table manually, run the SQL commands from the <code>database-contact-logs.sql</code>{" "}
            file in your Supabase dashboard.
          </AlertDescription>
        </Alert>
      )}

      {/* Debug Info - Remove this after testing */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-yellow-800">Debug Info:</h3>
          <p className="text-sm text-yellow-700">
            Stats: {JSON.stringify(stats)} | Has Data: {hasData.toString()} | Loading: {loading.toString()} | Recent
            Messages: {recentMessages.length}
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time {!loading && stats.total === 0 && hasData === false ? "(No messages yet)" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-muted-foreground">This week: {stats.thisWeek}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">Monthly messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">Messages responded to</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Messages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Latest messages from website visitors</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMessages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No messages found</p>
                <p className="text-sm text-gray-400">
                  Messages from the contact form will appear here once visitors start submitting inquiries.
                </p>
              </div>
            ) : (
              recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{message.name}</span>
                      {getStatusBadge(message.status)}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">{message.email}</span>
                      {message.phone && <span className="ml-2">• {message.phone}</span>}
                      {message.service && <span className="ml-2 text-sky-600">• {message.service}</span>}
                    </div>
                    <div className="text-sm text-gray-700 mb-2 line-clamp-2">{message.message}</div>
                    <div className="text-xs text-gray-500">
                      {message.created_at && formatTimeAgo(message.created_at)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {message.status === "sent" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {message.status === "failed" && <AlertCircle className="h-5 w-5 text-red-500" />}
                    {message.status === "pending" && <Clock className="h-5 w-5 text-yellow-500" />}
                    {message.status === "received" && <Mail className="h-5 w-5 text-blue-500" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Message activity over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No activity data available</p>
                <p className="text-sm text-gray-400">Activity charts will be generated once messages are received.</p>
              </div>
            ) : (
              analytics.map((day) => (
                <div key={day.submission_date} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{new Date(day.submission_date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-600">
                      {day.total_submissions} messages • {day.success_rate}% response rate
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {day.successful_submissions} responded
                    </Badge>
                    {day.failed_submissions > 0 && (
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        {day.failed_submissions} failed
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
