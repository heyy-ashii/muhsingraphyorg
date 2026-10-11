import { DEFAULT_CONTENT } from "./defaults";
import { SECTION_KEYS, type SectionKey, type SiteContent } from "./schema";

type AnyRecord = Record<string, unknown>;

const isPlainObject = (v: unknown): v is AnyRecord =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Merges a stored document over the defaults. Arrays are replaced wholesale
 * (they represent curated lists, not bags of properties) while objects merge
 * key-by-key, so a partial document still yields a complete `SiteContent`.
 */
export function mergeContent(stored: unknown): SiteContent {
  return merge(DEFAULT_CONTENT as unknown as AnyRecord, stored) as unknown as SiteContent;
}

function merge(base: AnyRecord, override: unknown): AnyRecord {
  if (!isPlainObject(override)) return base;

  const out: AnyRecord = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = base[key];
    if (Array.isArray(value)) {
      out[key] = value;
    } else if (isPlainObject(value) && isPlainObject(current)) {
      out[key] = merge(current, value);
    } else if (value !== undefined && value !== null) {
      out[key] = value;
    }
  }

  // Drop sections the curator has switched off from the render path entirely.
  if (isPlainObject(out.visibility)) {
    out.visibility = { ...out.visibility };
  }
  return out;
}

/** Reads the visibility flag for a section, defaulting to visible. */
export function isSectionVisible(content: SiteContent, key: SectionKey): boolean {
  return content.visibility?.[key] ?? true;
}

/** Normalises a stored row into a full document, tolerating any shape. */
export function coerceContent(row: unknown): SiteContent {
  if (isPlainObject(row) && "content" in row) return mergeContent((row as AnyRecord).content);
  return mergeContent(row);
}

export { SECTION_KEYS };
