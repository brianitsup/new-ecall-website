import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MessagesDashboard } from "@/components/messages-dashboard"
import { Loader2 } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-gray-600 mt-2">
          View and manage messages from website visitors and contact form submissions.
        </p>
      </div>

      <Suspense
        fallback={
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading messages...</span>
            </CardContent>
          </Card>
        }
      >
        <MessagesDashboard />
      </Suspense>
    </div>
  )
}
