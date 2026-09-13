import slugify from "slugify";

export function generateSlug(title?: string): string {
  if (!title) return "";
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}
