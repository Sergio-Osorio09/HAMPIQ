const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const pad = (n: number) => String(n).padStart(2, '0')

/** Countdown formatter: mm:ss or h:mm:ss. */
export function fmtRemaining(ms: number): string {
  if (ms <= 0) return '00:00'
  const tot = Math.floor(ms / 1000)
  const h = Math.floor(tot / 3600)
  const m = Math.floor((tot % 3600) / 60)
  const sec = tot % 60
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

/** "12 may 2026" from an ISO date string or timestamp. */
export function fmtDate(ts: string | number): string {
  const d = typeof ts === 'string' ? new Date(ts + 'T00:00:00') : new Date(ts)
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

/** "12 may 2026, 14:52" from a timestamp. */
export function fmtDateTime(ts: number): string {
  const d = new Date(ts)
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Relative time: "hace 2 h", "hace 3 días". */
export function relTime(ts: number): string {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'hace instantes'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.floor(h / 24)
  return `hace ${d} día${d > 1 ? 's' : ''}`
}

/** Today's date as YYYY-MM-DD. */
export function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
