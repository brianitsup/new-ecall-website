"use client"

import { useEffect, useState } from "react"

export function DevEnvStatus() {
  const [envStatus, setEnvStatus] = useState<{
    supabaseUrl: boolean
    supabaseKey: boolean
    urlValid: boolean
  }>({
    supabaseUrl: false,
    supabaseKey: false,
    urlValid: false,
  })

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    let urlValid = false
    if (supabaseUrl) {
      try {
        new URL(supabaseUrl)
        urlValid = true
      } catch (error) {
        urlValid = false
      }
    }

    setEnvStatus({
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey,
      urlValid,
    })
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  const allGood = envStatus.supabaseUrl && envStatus.supabaseKey && envStatus.urlValid

  if (allGood) {
    return null // Don't show anything if everything is working
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-sm">
      <div className="font-bold">Environment Issues Detected:</div>
      <ul className="text-sm mt-2">
        {!envStatus.supabaseUrl && <li>• Missing NEXT_PUBLIC_SUPABASE_URL</li>}
        {!envStatus.supabaseKey && <li>• Missing NEXT_PUBLIC_SUPABASE_ANON_KEY</li>}
        {envStatus.supabaseUrl && !envStatus.urlValid && <li>• Invalid NEXT_PUBLIC_SUPABASE_URL format</li>}
      </ul>
      <div className="text-xs mt-2">Check your .env.local file</div>
    </div>
  )
}
