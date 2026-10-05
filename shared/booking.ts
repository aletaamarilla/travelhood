/** Keep the supplied payment URL intact, including MyGoQu's booking code. */
export function normalizeBookingUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed || /\s/.test(trimmed)) return undefined
  try {
    const url = new URL(trimmed)
    if (!trimmed.startsWith('https://') || !url.hostname || url.username || url.password) return undefined
    return trimmed
  } catch {
    return undefined
  }
}
