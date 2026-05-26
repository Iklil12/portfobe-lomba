/**
 * Safely parse a JSON string with a typed fallback.
 * Prevents crashes from corrupt or null data stored in Text columns.
 *
 * @example
 * safeParseJson<string[]>(row.favoriteThemes, [])  // → string[]
 */
export function safeParseJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== 'string') {
    // Already parsed (e.g. from a Json column or in-memory mock)
    return value as unknown as T;
  }
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === 'null') return fallback;
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    console.warn('[safeParseJson] Failed to parse JSON string:', value);
    return fallback;
  }
}

/**
 * Safely stringify a value for storage in a Text column.
 * Falls back to the default string if serialization fails.
 */
export function safeStringifyJson(value: unknown, fallback = '[]'): string {
  try {
    return JSON.stringify(value);
  } catch {
    console.warn('[safeStringifyJson] Failed to stringify value:', value);
    return fallback;
  }
}
