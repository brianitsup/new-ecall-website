"use client"

import type React from "react"
import { LayoutDashboard, FileText, Settings, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navigation = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: "LayoutDashboard",
    },
    {
      href: "/dashboard/transactions",
      label: "Transactions",
      icon: "ListChecks",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: "Gear",
    },
    {
      href: "/dashboard/messages",
      label: "Messages",
      icon: MessageSquare,
    },
  ]

  const setSidebarOpen = (open: boolean) => {
    // Placeholder for sidebar open state management
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 border-r border-gray-200">
        <div className="p-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <nav className="mt-6">
            <ul>
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-sky-600"
                  onClick={() => setSidebarOpen(false)}
                >
                  <LayoutDashboard className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/posts"
                  className="flex items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-sky-600"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FileText className="mr-3 h-5 w-5" />
                  Blog Posts
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/messages"
                  className="flex items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-sky-600"
                  onClick={() => setSidebarOpen(false)}
                >
                  <MessageSquare className="mr-3 h-5 w-5" />
                  Messages
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-sky-600"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}
