import { fmtRemaining, fmtDate, fmtDateTime, relTime } from '@/lib/format'
import type {
  AuditEntry,
  ClinicalEvent,
  Estudio,
  Token,
  TokenStatus,
} from '@/services/seed'

// ---------- shared color maps ----------
export const TIPO_C: Record<string, { bg: string; fg: string }> = {
  Consulta: { bg: '#e7f3f1', fg: '#0a5c55' },
  Emergencia: { bg: '#fdeaec', fg: '#c0202f' },
  Laboratorio: { bg: '#eaf2ff', fg: '#1d4ed8' },
  Vacunación: { bg: '#f3ecfc', fg: '#7c3aed' },
}
export const SEV_C: Record<string, { bg: string; fg: string }> = {
  Leve: { bg: '#fff7e8', fg: '#9a6700' },
  Grave: { bg: '#fdeaec', fg: '#c0202f' },
  Normal: { bg: '#e7f3f1', fg: '#0a5c55' },
}
export const EST_C: Record<string, { bg: string; fg: string; l: string }> = {
  normal: { bg: '#e7f3f1', fg: '#0a5c55', l: 'Normal' },
  alto: { bg: '#fdeaec', fg: '#c0202f', l: 'Alto' },
  bajo: { bg: '#fff7e8', fg: '#9a6700', l: 'Bajo' },
}
const ROLE_C: Record<string, { bg: string; fg: string; i: string }> = {
  medico: { bg: '#eaf2ff', fg: '#1d4ed8', i: '🩺' },
  emergencia: { bg: '#fdeaec', fg: '#c0202f', i: '🚑' },
  paciente: { bg: '#e7f3f1', fg: '#0a5c55', i: '👤' },
}
const fallback = { bg: '#eef1f1', fg: '#516160' }

// ---------- tokens (live, recomputed from `now`) ----------
export interface LiveToken extends Token {
  statusLabel: TokenStatus
  isActiva: boolean
  isRevocada: boolean
  remText: string
  pct: number
  usesText: string
  durLabel: string
  badgeBg: string
  badgeFg: string
  badgeDot: string
  createdRel: string
}

export function computeLiveTokens(tokens: Token[], now: number): LiveToken[] {
  return tokens.map((t) => {
    const expired = now > t.expiresAt || t.status === 'expirada'
    const status: TokenStatus = t.status === 'revocada' ? 'revocada' : expired ? 'expirada' : t.usesLeft <= 0 ? 'agotada' : 'activa'
    const remMs = Math.max(0, t.expiresAt - now)
    const pct = Math.max(0, Math.min(100, (remMs / (t.durationMin * 60000)) * 100))
    const c = status === 'activa'
      ? { bg: '#e7f3f1', fg: '#0a5c55', dot: '#0d7d74' }
      : status === 'revocada'
        ? { bg: '#fdeaec', fg: '#c0202f', dot: '#c0202f' }
        : { bg: '#eef1f1', fg: '#6b7b79', dot: '#9aabaa' }
    return {
      ...t,
      statusLabel: status,
      isActiva: status === 'activa',
      isRevocada: status === 'revocada',
      remText: fmtRemaining(remMs),
      pct,
      usesText: `${t.usesLeft}/${t.uses} usos`,
      durLabel: `${t.durationMin} min`,
      badgeBg: c.bg,
      badgeFg: c.fg,
      badgeDot: c.dot,
      createdRel: relTime(t.createdAt),
    }
  })
}

// ---------- audit ----------
export function computeAuditView(audit: AuditEntry[]) {
  return audit.map((a) => {
    const rc = ROLE_C[a.rol] || { ...fallback, i: '•' }
    return { ...a, fecha: fmtDateTime(a.ts), rel: relTime(a.ts), rolBg: rc.bg, rolFg: rc.fg, rolIcon: rc.i }
  })
}

// ---------- history ----------
export function computeHistoryView(extra: ClinicalEvent[], history: ClinicalEvent[]) {
  return [...extra, ...history].map((e) => {
    const tc = TIPO_C[e.tipo] || fallback
    const sc = SEV_C[e.sev] || fallback
    return {
      ...e,
      fecha: fmtDate(e.ts),
      tipoBg: tc.bg,
      tipoFg: tc.fg,
      sevBg: sc.bg,
      sevFg: sc.fg,
      hasEstudios: e.estudios.length > 0,
      estudiosCount: e.estudios.length,
      medCount: e.medicamentos.length,
      estudios: e.estudios.map((st: Estudio) => ({ icon: st.t === 'img' ? '🖼️' : '🧪', n: st.n })),
    }
  })
}

// ---------- doctor consultas ----------
export function computeMedConsultas(audit: AuditEntry[]) {
  return audit
    .filter((a) => a.rol === 'medico')
    .map((a, i) => ({
      ...a,
      fecha: fmtDateTime(a.ts),
      rel: relTime(a.ts),
      paciente: 'Juan Carlos Pérez Quispe',
      dni: '45872136',
      secciones: 'Historial clínico completo · 5 eventos',
      duracion: 8 + i * 3 + ' min',
      accesoTipo: 'Solo lectura',
    }))
}
