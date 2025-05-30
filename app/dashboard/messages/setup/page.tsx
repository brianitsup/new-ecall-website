"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MessagesSetupPage() {
  const sqlScript = `-- Contact form submissions and messages table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  recaptcha_verified BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admin access)
CREATE POLICY "Admin can view all contact submissions" ON contact_submissions
  FOR ALL USING (auth.role() = 'authenticated');`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages Setup</h1>
        <p className="text-gray-600 mt-2">
          Set up the database table for storing website messages and contact form submissions
        </p>
      </div>

      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          The messages system requires a database table to store contact form submissions and visitor messages. Run the
          SQL script below in your Supabase SQL editor to set up the messages system.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Database Setup Instructions</CardTitle>
          <CardDescription>Follow these steps to set up message storage in your Supabase database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Step 1: Access Supabase Dashboard</h3>
            <p className="text-sm text-gray-600">
              Go to your Supabase project dashboard and navigate to the SQL Editor.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Step 2: Run the SQL Script</h3>
            <p className="text-sm text-gray-600">
              Copy and paste the following SQL script into the SQL Editor and run it:
            </p>
          </div>

          <div className="relative">
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{sqlScript}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => navigator.clipboard.writeText(sqlScript)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Step 3: Verify Setup</h3>
            <p className="text-sm text-gray-600">
              After running the script, return to the messages dashboard to verify that the setup is complete.
            </p>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Note:</strong> The table will also be created automatically when the first contact form is
              submitted, but setting it up manually allows you to see the messages dashboard immediately.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
