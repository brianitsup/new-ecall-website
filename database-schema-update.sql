-- Add slug column to posts table
ALTER TABLE posts ADD COLUMN slug TEXT;

-- Create unique index for slugs
CREATE UNIQUE INDEX idx_posts_slug ON posts(slug);

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert title to lowercase, replace spaces and special chars with hyphens
  base_slug := lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
  
  -- Remove leading/trailing hyphens
  base_slug := trim(both '-' from base_slug);
  
  -- Limit length to 100 characters
  base_slug := left(base_slug, 100);
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM posts WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Update existing posts to have slugs (run this after adding the column)
UPDATE posts 
SET slug = generate_slug(title) 
WHERE slug IS NULL;

-- Make slug NOT NULL after updating existing records
ALTER TABLE posts ALTER COLUMN slug SET NOT NULL;

-- Update the posts table indexes
DROP INDEX IF EXISTS idx_posts_title_search;
DROP INDEX IF EXISTS idx_posts_content_search;
DROP INDEX IF EXISTS idx_posts_excerpt_search;
DROP INDEX IF EXISTS idx_posts_full_search;

-- Recreate search indexes
CREATE INDEX IF NOT EXISTS idx_posts_title_search ON posts USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_posts_content_search ON posts USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_posts_excerpt_search ON posts USING gin(to_tsvector('english', excerpt));
CREATE INDEX IF NOT EXISTS idx_posts_full_search ON posts USING gin(
  to_tsvector('english', title || ' ' || excerpt || ' ' || content)
);

-- Update search function to include slug
CREATE OR REPLACE FUNCTION search_posts(search_query TEXT)
RETURNS TABLE(
  id UUID,
  title TEXT,
  excerpt TEXT,
  category TEXT,
  image TEXT,
  author TEXT,
  slug TEXT,
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
    p.slug,
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

-- Update other functions to include slug
CREATE OR REPLACE FUNCTION get_recent_posts(limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
  id UUID,
  title TEXT,
  excerpt TEXT,
  category TEXT,
  image TEXT,
  author TEXT,
  slug TEXT,
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
    p.slug,
    p.created_at
  FROM posts p
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_related_posts(
  post_category TEXT,
  exclude_slug TEXT,
  limit_count INTEGER DEFAULT 3
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  excerpt TEXT,
  category TEXT,
  image TEXT,
  slug TEXT,
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
    p.slug,
    p.created_at
  FROM posts p
  WHERE p.category = post_category 
    AND p.slug != exclude_slug
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
