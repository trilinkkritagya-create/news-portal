// export const CATEGORY_COLORS: Record<string, string> = {
//   technology: "#7c3aed",
//   "world-politics": "#2563eb",
//   "business-markets": "#059669",
//   "science-space": "#8b5cf6",
//   sports: "#ea580c",
//   "culture-arts": "#db2777",
// };

// const DEFAULT_CATEGORY_COLOR = "#64748b";

// function normalizeCategory(value: string): string {
//   return value
//     .trim()
//     .toLowerCase()
//     .replace(/&/g, "and")
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// }

// export function getCategoryColor(category?: string | null): string {
//   if (!category) {
//     return DEFAULT_CATEGORY_COLOR;
//   }

//   const key = normalizeCategory(category);

//   return CATEGORY_COLORS[key] ?? DEFAULT_CATEGORY_COLOR;
// }
// lib/constants/category-colors.ts

export const CATEGORY_COLORS: Record<string, string> = {
  technology: "#7c3aed",
  "world-politics": "#2563eb",
  "business-markets": "#059669",
  "science-space": "#8b5cf6",
  sports: "#ea580c",
  "culture-arts": "#db2777",
};

const DEFAULT_CATEGORY_COLOR = "#64748b";

export function getCategoryColor(slug?: string | null): string {
  if (!slug) return DEFAULT_CATEGORY_COLOR;

  return CATEGORY_COLORS[slug.toLowerCase()] ?? DEFAULT_CATEGORY_COLOR;
}
