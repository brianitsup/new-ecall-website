-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  author TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Set up storage policy to allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Set up storage policy to allow public to view images
CREATE POLICY "Allow public to view images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'images');
