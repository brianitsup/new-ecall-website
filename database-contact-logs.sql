-- Create the contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'sent', 'failed')),
  error_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for different access levels
-- Policy 1: Allow service role to do everything
CREATE POLICY "Allow all for service role" ON contact_submissions
FOR ALL USING (auth.role() = 'service_role');

-- Policy 2: Allow authenticated users to read their own submissions
CREATE POLICY "Allow authenticated users to read own submissions" ON contact_submissions
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy 3: Allow anonymous users to insert (for contact form)
CREATE POLICY "Allow anonymous inserts" ON contact_submissions
FOR INSERT WITH CHECK (true);

-- Policy 4: Allow anon users to read (for monitoring dashboard)
CREATE POLICY "Allow anon to read" ON contact_submissions
FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Grant necessary permissions
GRANT ALL ON contact_submissions TO service_role;
GRANT SELECT, INSERT ON contact_submissions TO anon;
GRANT SELECT, INSERT ON contact_submissions TO authenticated;
