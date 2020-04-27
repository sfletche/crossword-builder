
export function slugify(str: string): string {
  return str.replace(/^\s+|\s+$/g, '')
  // Make the string lowercase
  .toLowerCase()
  // Remove invalid chars
  .replace(/[^a-z0-9 -]/g, '')
  // Collapse whitespace and replace by -
  .replace(/\s+/g, '-')
  // Collapse dashes
  .replace(/-+/g, '-');
}
