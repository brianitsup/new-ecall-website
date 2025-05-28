/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      // Replace special characters with spaces
      .replace(/[^\w\s-]/g, " ")
      // Replace multiple spaces/hyphens with single hyphen
      .replace(/[\s_-]+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
      // Limit length
      .substring(0, 100)
  )
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100
}

/**
 * Clean and validate slug input
 */
export function cleanSlug(input: string): string {
  const cleaned = generateSlug(input)
  return isValidSlug(cleaned) ? cleaned : ""
}
