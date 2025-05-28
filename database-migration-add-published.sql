-- Add published column to existing posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- Update existing posts to be published
UPDATE posts SET published = true WHERE published IS NULL;

-- Add index for published column
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts(published);

-- Update RLS policy to include published filter
DROP POLICY IF EXISTS "Allow public read access to published posts" ON posts;
CREATE POLICY "Allow public read access to published posts" ON posts
  FOR SELECT USING (published = true);
