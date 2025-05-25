-- Database Performance Optimizations for eCall Health Center
-- Run these commands in your Supabase SQL Editor

-- 1. Create the posts table with optimized structure
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

-- 2. Create performance indexes
-- Index for ordering by creation date (most common query)
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- Composite index for category + date queries
CREATE INDEX IF NOT EXISTS idx_posts_category_created_at ON posts(category, created_at DESC);

-- Full-text search indexes for title and content
CREATE INDEX IF NOT EXISTS idx_posts_title_search ON posts USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_posts_content_search ON posts USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_posts_excerpt_search ON posts USING gin(to_tsvector('english', excerpt));

-- Combined search index for all text fields
CREATE INDEX IF NOT EXISTS idx_posts_full_search ON posts USING gin(
  to_tsvector('english', title || ' ' || excerpt || ' ' || content)
);

-- 3. Create a function for better search performance
CREATE OR REPLACE FUNCTION search_posts(search_query TEXT)
RETURNS TABLE(
  id UUID,
  title TEXT,
  excerpt TEXT,
  category TEXT,
  image TEXT,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.excerpt,
    p.category,
    p.image,
    p.author,
    p.created_at,
    ts_rank(
      to_tsvector('english', p.title || ' ' || p.excerpt || ' ' || p.content),
      plainto_tsquery('english', search_query)
    ) as rank
  FROM posts p
  WHERE to_tsvector('english', p.title || ' ' || p.excerpt || ' ' || p.content) 
        @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 4. Create a view for post statistics (for dashboard)
CREATE OR REPLACE VIEW post_stats AS
SELECT 
  COUNT(*) as total_posts,
  COUNT(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE) THEN 1 END) as posts_this_month,
  COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as posts_this_week,
  (
    SELECT category 
    FROM posts 
    GROUP BY category 
    ORDER BY COUNT(*) DESC 
    LIMIT 1
  ) as most_popular_category
FROM posts;

-- 5. Create a function to get recent posts efficiently
CREATE OR REPLACE FUNCTION get_recent_posts(limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
  id UUID,
  title TEXT,
  excerpt TEXT,
  category TEXT,
  image TEXT,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.excerpt,
    p.category,
    p.image,
    p.author,
    p.created_at
  FROM posts p
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 6. Create a function to get related posts efficiently
CREATE OR REPLACE FUNCTION get_related_posts(
  post_category TEXT,
  exclude_id UUID,
  limit_count INTEGER DEFAULT 3
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  excerpt TEXT,
  category TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.excerpt,
    p.category,
    p.image,
    p.created_at
  FROM posts p
  WHERE p.category = post_category 
    AND p.id != exclude_id
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 7. Update the updated_at column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. Create storage policies for images (if not already created)
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Allow public to view images
CREATE POLICY "Allow public to view images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'images');

-- 9. Create RLS policies for posts table (optional security)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow public to read posts
CREATE POLICY "Allow public to read posts"
  ON posts FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage posts
CREATE POLICY "Allow authenticated users to manage posts"
  ON posts FOR ALL
  TO authenticated
  USING (true);

-- 10. Analyze tables for better query planning
ANALYZE posts;

-- Performance monitoring queries (run these to check performance)
-- Check index usage:
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch 
-- FROM pg_stat_user_indexes WHERE tablename = 'posts';

-- Check table statistics:
-- SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del, n_live_tup, n_dead_tup
-- FROM pg_stat_user_tables WHERE tablename = 'posts';
