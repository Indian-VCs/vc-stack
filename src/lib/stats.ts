/**
 * Client-safe stats derived from the static catalog.
 * Use this in client components (like Navbar) so counts stay in sync
 * without needing server props everywhere.
 *
 * Imports from `./static-catalog`, NOT `./data`. data.ts pulls in the D1
 * driver via queries.ts; static-catalog.ts is constants only and is safe to
 * include in the browser bundle.
 */

import { STATIC_CATEGORIES, STATIC_TOOLS, categorySlugsForTool } from './static-catalog'

export const TOTAL_UNIQUE_TOOLS = STATIC_TOOLS.length
export const TOTAL_CATEGORIES = STATIC_CATEGORIES.length
export const TOTAL_TOOL_APPEARANCES = STATIC_TOOLS.reduce(
  (acc, t) => acc + categorySlugsForTool(t).length,
  0,
)

/** Category name + tool count pairs, sorted by count (desc). Used for JSON-LD ItemList. */
export const CATEGORY_COUNTS: { name: string; slug: string; count: number }[] = STATIC_CATEGORIES
  .map((c) => ({
    name: c.name,
    slug: c.slug,
    count: STATIC_TOOLS.filter((t) => categorySlugsForTool(t).includes(c.slug)).length,
  }))
  .sort((a, b) => b.count - a.count)
