/**
 * Client-safe stats derived from the static catalog.
 * Use this in client components (like Navbar) so counts stay in sync
 * without needing server props everywhere.
 */

import { STATIC_CATEGORIES, STATIC_TOOLS, categorySlugsForTool } from './data'

export const TOTAL_UNIQUE_TOOLS = STATIC_TOOLS.length
export const TOTAL_CATEGORIES = STATIC_CATEGORIES.length
export const TOTAL_TOOL_APPEARANCES = STATIC_TOOLS.reduce(
  (acc, t) => acc + categorySlugsForTool(t).length,
  0,
)
