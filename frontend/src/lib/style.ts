import type { CSSProperties } from 'react'

/**
 * Convert a raw CSS declaration string (as used in the Hampiq prototype's
 * inline `style="..."` attributes) into a React style object. This lets us
 * port the prototype's markup verbatim and keep pixel-for-pixel fidelity.
 *
 * Example: s("display:flex;gap:10px;border-radius:11px")
 */
export function s(css: string): CSSProperties {
  const out: Record<string, string> = {}
  for (const decl of css.split(';')) {
    const idx = decl.indexOf(':')
    if (idx === -1) continue
    const rawKey = decl.slice(0, idx).trim()
    const value = decl.slice(idx + 1).trim()
    if (!rawKey || !value) continue
    const key = rawKey.startsWith('--')
      ? rawKey
      : rawKey.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    out[key] = value
  }
  return out as CSSProperties
}

/** Merge several style strings / objects into one React style object. */
export function sx(...parts: Array<string | CSSProperties | undefined | false>): CSSProperties {
  let merged: CSSProperties = {}
  for (const part of parts) {
    if (!part) continue
    merged = { ...merged, ...(typeof part === 'string' ? s(part) : part) }
  }
  return merged
}
