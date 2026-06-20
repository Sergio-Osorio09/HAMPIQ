import { create } from 'zustand'
import { todayISO } from '@/lib/format'
import {
  SEED_USERS,
  SEED_RECETAS,
  RENIEC,
  seedDynamic,
  type AuditEntry,
  type AuditRole,
  type PendingStudy,
  type Receta,
  type SessionDevice,
  type Session,
  type Token,
  type User,
} from '@/services/seed'

export type Screen = 'landing' | 'auth' | 'emergency' | 'app'
export type AuthMode = 'login' | 'register'
export type PScreen =
  | 'dashboard' | 'history' | 'share' | 'medicines' | 'card' | 'audit' | 'profile'
  | 'med-home' | 'doctor' | 'med-patients' | 'audit-med' | 'med-rx'
  | 'admin' | 'admin-audit' | 'admin-tokens' | 'admin-users'
export type MedModalKind = 'nota' | 'receta' | 'estudio' | null

interface RegForm {
  dni: string; validated: boolean; loading: boolean
  nombres: string; apellidos: string; nacimiento: string; sexo: string
  correo: string; telefono: string; password: string; error: string; okFields: boolean
}
interface LoginForm { dni: string; password: string; error: string }
interface ShareForm { duration: number; uses: number; generated: Token | null; error: string }
interface DocState {
  tokenInput: string; error: string; granted: boolean; validating: boolean
  grantedAt?: number; grantExpires?: number; grantCode?: string
}
interface EmgState { codeInput: string; error: string; loaded: boolean; scanning: boolean }
interface ProfileState {
  mfa: boolean; notifEmail: boolean; notifSMS: boolean; notifPush: boolean
  correo: string; telefono: string; direccion: string
}
interface ToastState { msg: string; bg: string; icon: string }
interface NoteForm { tipo: string; titulo: string; diagnostico: string; indicaciones: string; error: string }
interface RxForm { medNombre: string; dosis: string; duracion: string; error: string }
interface StudyForm { tipo: string; nombre: string; indicacion: string; error: string }

const now0 = Date.now()
const seeded = seedDynamic(now0)

const emptyReg = (): RegForm => ({
  dni: '', validated: false, loading: false, nombres: '', apellidos: '', nacimiento: '',
  sexo: '', correo: '', telefono: '', password: '', error: '', okFields: false,
})
const emptyDoc = (): DocState => ({ tokenInput: '', error: '', granted: false, validating: false })
const emptyEmg = (): EmgState => ({ codeInput: '', error: '', loaded: false, scanning: false })

export interface Store {
  // navigation
  screen: Screen
  pscreen: PScreen
  authMode: AuthMode
  session: Session | null
  now: number

  // forms / transient
  reg: RegForm
  login: LoginForm
  share: ShareForm
  doc: DocState
  emg: EmgState
  toast: ToastState | null
  modalEvent: string | null
  med: { query: string; selectedId: string | null }
  profile: ProfileState
  medModal: MedModalKind
  noteForm: NoteForm
  rxForm: RxForm
  studyForm: StudyForm

  // collections (mutable)
  users: User[]
  tokens: Token[]
  audit: AuditEntry[]
  sessions: SessionDevice[]
  extraHistory: import('@/services/seed').ClinicalEvent[]
  pendingStudies: PendingStudy[]
  recetas: Receta[]

  // ---- actions ----
  tick: () => void
  go: (s: Screen) => void
  pgo: (s: PScreen) => void
  goLogin: () => void
  goRegister: () => void
  goEmergency: () => void
  goHome: () => void
  showToast: (msg: string, type?: 'ok' | 'err' | 'info') => void
  quickPaciente: () => void
  quickMedico: () => void
  quickAdmin: () => void
  logout: () => void

  setReg: (k: keyof RegForm, v: string) => void
  validarDni: () => void
  crearCuenta: () => void

  setLogin: (k: keyof LoginForm, v: string) => void
  doLogin: () => void

  setShare: (k: 'duration' | 'uses', v: number) => void
  generarToken: () => void
  copiarToken: (code: string) => void
  revocarToken: (code: string) => void

  setDoc: (k: 'tokenInput', v: string) => void
  validarTokenMedico: () => void
  cerrarAccesoMedico: () => void

  setEmg: (k: 'codeInput', v: string) => void
  escanearQR: () => void
  validarCodigoEmergencia: () => void
  resetEmergencia: () => void

  openEvent: (id: string) => void
  closeEvent: () => void

  setMedQuery: (v: string) => void
  selectMed: (id: string) => void
  clearMed: () => void

  toggleProfile: (k: 'mfa' | 'notifEmail' | 'notifSMS' | 'notifPush') => void

  openMedModal: (kind: 'nota' | 'receta' | 'estudio') => void
  closeMedModal: () => void
  setNote: (k: keyof NoteForm, v: string) => void
  guardarNota: () => void
  setRx: (k: keyof RxForm, v: string) => void
  emitirReceta: () => void
  setStudy: (k: keyof StudyForm, v: string) => void
  solicitarEstudio: () => void

  cerrarSesionDisp: (id: string) => void
}

const TOAST_MAP = {
  ok: { bg: '#0d7d74', icon: '✓' },
  err: { bg: '#c0202f', icon: '✕' },
  info: { bg: '#0f211f', icon: 'ℹ' },
}
let toastTimer: ReturnType<typeof setTimeout> | undefined

const genCode = (): string => {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const part = () => Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
  return `HMPQ-${part()}-${part()}`
}

export const useStore = create<Store>((set, get) => ({
  screen: 'landing',
  pscreen: 'dashboard',
  authMode: 'login',
  session: null,
  now: now0,

  reg: emptyReg(),
  login: { dni: '', password: '', error: '' },
  share: { duration: 30, uses: 1, generated: null, error: '' },
  doc: emptyDoc(),
  emg: emptyEmg(),
  toast: null,
  modalEvent: null,
  med: { query: '', selectedId: null },
  profile: {
    mfa: false, notifEmail: true, notifSMS: true, notifPush: false,
    correo: 'juan.perez@correo.com', telefono: '+51 998 123 456',
    direccion: 'Av. Brasil 1234, Magdalena del Mar, Lima',
  },
  medModal: null,
  noteForm: { tipo: 'Consulta', titulo: '', diagnostico: '', indicaciones: '', error: '' },
  rxForm: { medNombre: '', dosis: '', duracion: '', error: '' },
  studyForm: { tipo: 'Laboratorio', nombre: '', indicacion: '', error: '' },

  users: SEED_USERS.map((u) => ({ ...u })),
  tokens: seeded.tokens,
  audit: seeded.audit,
  sessions: seeded.sessions,
  extraHistory: [],
  pendingStudies: [],
  recetas: SEED_RECETAS.map((r) => ({ ...r })),

  // ---------- navigation ----------
  tick: () => set({ now: Date.now() }),
  go: (s) => set({ screen: s }),
  pgo: (s) => set({ pscreen: s }),
  goLogin: () => set({ screen: 'auth', authMode: 'login', login: { dni: '', password: '', error: '' } }),
  goRegister: () => set({ screen: 'auth', authMode: 'register', reg: emptyReg() }),
  goEmergency: () => set({ screen: 'emergency', emg: emptyEmg() }),
  goHome: () => set({ screen: 'landing' }),

  showToast: (msg, type = 'ok') => {
    const t = TOAST_MAP[type] || TOAST_MAP.ok
    set({ toast: { msg, bg: t.bg, icon: t.icon } })
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => set({ toast: null }), 3200)
  },

  quickPaciente: () => set({ session: { role: 'paciente', nombres: 'Juan Carlos', apellidos: 'Pérez Quispe', dni: '45872136' }, screen: 'app', pscreen: 'dashboard' }),
  quickMedico: () => set({ session: { role: 'medico', nombres: 'Ana María', apellidos: 'Flores Ríos', dni: '40221785', extra: 'CMP 58213' }, screen: 'app', pscreen: 'med-home', doc: emptyDoc() }),
  quickAdmin: () => set({ session: { role: 'admin', nombres: 'Carlos', apellidos: 'Mendoza Vargas', dni: '10000001' }, screen: 'app', pscreen: 'admin' }),
  logout: () => set({ session: null, screen: 'landing' }),

  // ---------- CU-01 registro ----------
  setReg: (k, v) => set((s) => ({ reg: { ...s.reg, [k]: v } })),
  validarDni: () => {
    const dni = get().reg.dni.trim()
    if (!/^\d{8}$/.test(dni)) {
      set((s) => ({ reg: { ...s.reg, error: 'El DNI debe tener exactamente 8 dígitos.', validated: false } }))
      return
    }
    set((s) => ({ reg: { ...s.reg, loading: true, error: '' } }))
    setTimeout(() => {
      const r = RENIEC[dni]
      if (!r) {
        set((s) => ({ reg: { ...s.reg, loading: false, error: 'No se encontraron datos para este DNI en RENIEC (demo: prueba 45872136, 70112233 u 08456712).', validated: false } }))
        return
      }
      set((s) => ({ reg: { ...s.reg, loading: false, validated: true, error: '', nombres: r.nombres, apellidos: r.apellidos, nacimiento: r.nacimiento, sexo: r.sexo } }))
    }, 900)
  },
  crearCuenta: () => {
    const r = get().reg
    if (!r.correo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.correo)) {
      set((s) => ({ reg: { ...s.reg, error: 'Ingresa un correo electrónico válido.' } })); return
    }
    if (!r.telefono || r.telefono.replace(/\D/g, '').length < 9) {
      set((s) => ({ reg: { ...s.reg, error: 'Ingresa un teléfono válido (9 dígitos).' } })); return
    }
    if (!r.password || r.password.length < 8) {
      set((s) => ({ reg: { ...s.reg, error: 'La contraseña debe tener al menos 8 caracteres.' } })); return
    }
    if (get().users.some((u) => u.dni === r.dni.trim())) {
      set((s) => ({ reg: { ...s.reg, error: 'Ya existe una cuenta asociada a este DNI. Inicia sesión.' } })); return
    }
    set((s) => ({ users: [...s.users, { dni: r.dni.trim(), password: r.password, role: 'paciente', nombres: r.nombres, apellidos: r.apellidos }] }))
    get().showToast('Cuenta creada con éxito. ¡Bienvenido a Hampiq!', 'ok')
    set({ session: { role: 'paciente', nombres: r.nombres, apellidos: r.apellidos, dni: r.dni.trim() }, screen: 'app', pscreen: 'dashboard' })
  },

  // ---------- CU-02 login ----------
  setLogin: (k, v) => set((s) => ({ login: { ...s.login, [k]: v } })),
  doLogin: () => {
    const { dni, password } = get().login
    if (!dni || !password) { set((s) => ({ login: { ...s.login, error: 'Completa ambos campos.' } })); return }
    const u = get().users.find((x) => x.dni === dni.trim() && x.password === password)
    if (!u) { set((s) => ({ login: { ...s.login, error: 'DNI o contraseña incorrectos.' } })); return }
    const sess: Session = { role: u.role, nombres: u.nombres, apellidos: u.apellidos, dni: u.dni, extra: u.extra }
    if (u.role === 'paciente') set({ session: sess, screen: 'app', pscreen: 'dashboard', login: { dni: '', password: '', error: '' } })
    else if (u.role === 'medico') set({ session: sess, screen: 'app', pscreen: 'med-home', login: { dni: '', password: '', error: '' }, doc: emptyDoc() })
    else set({ session: sess, screen: 'app', pscreen: 'admin', login: { dni: '', password: '', error: '' } })
  },

  // ---------- CU-03 token ----------
  setShare: (k, v) => set((s) => ({ share: { ...s.share, [k]: v } })),
  generarToken: () => {
    const { duration, uses } = get().share
    const now = Date.now()
    const tok: Token = { code: genCode(), createdAt: now, expiresAt: now + duration * 60000, durationMin: duration, uses, usesLeft: uses, status: 'activa', medico: '—' }
    const entry: AuditEntry = { ts: now, actor: 'Juan C. Pérez', rol: 'paciente', accion: 'Generó token médico', ref: tok.code, ip: '190.233.45.12', disp: 'Chrome · Windows 11' }
    set((s) => ({ share: { ...s.share, generated: tok, error: '' }, tokens: [tok, ...s.tokens], audit: [entry, ...s.audit] }))
    get().showToast('Token generado y almacenado con TTL.', 'ok')
  },
  copiarToken: (code) => {
    try { navigator.clipboard?.writeText(code) } catch { /* ignore */ }
    get().showToast('Token copiado al portapapeles.', 'info')
  },
  revocarToken: (code) => {
    const now = Date.now()
    set((s) => ({
      tokens: s.tokens.map((t) => (t.code === code ? { ...t, status: 'revocada' } : t)),
      share: s.share.generated && s.share.generated.code === code
        ? { ...s.share, generated: { ...s.share.generated, status: 'revocada' } }
        : s.share,
      audit: [{ ts: now, actor: 'Juan C. Pérez', rol: 'paciente', accion: 'Revocó token médico', ref: code, ip: '190.233.45.12', disp: 'Chrome · Windows 11' } as AuditEntry, ...s.audit],
    }))
    get().showToast('Token revocado. El acceso fue invalidado.', 'err')
  },

  // ---------- CU-04 médico ----------
  setDoc: (k, v) => set((s) => ({ doc: { ...s.doc, [k]: v } })),
  validarTokenMedico: () => {
    const raw = (get().doc.tokenInput || '').toUpperCase().replace(/\s/g, '')
    if (!raw) { set((s) => ({ doc: { ...s.doc, error: 'Ingresa un token.' } })); return }
    set((s) => ({ doc: { ...s.doc, validating: true, error: '' } }))
    setTimeout(() => {
      const now = Date.now()
      const tok = get().tokens.find((t) => t.code === raw)
      if (!tok) { set((s) => ({ doc: { ...s.doc, validating: false, error: 'Token no encontrado. Verifica el código con el paciente.' } })); return }
      if (tok.status === 'revocada') { set((s) => ({ doc: { ...s.doc, validating: false, error: 'Este token fue revocado por el paciente.' } })); return }
      if (now > tok.expiresAt || tok.status === 'expirada') { set((s) => ({ doc: { ...s.doc, validating: false, error: 'El token ha expirado. Solicita uno nuevo al paciente.' } })); return }
      if (tok.usesLeft <= 0) { set((s) => ({ doc: { ...s.doc, validating: false, error: 'El token agotó su número de usos.' } })); return }
      const sess = get().session
      const medName = sess ? `${sess.nombres} ${sess.apellidos}` : 'Dra. Ana Flores'
      set((s) => ({
        doc: { ...s.doc, validating: false, granted: true, grantedAt: now, grantExpires: tok.expiresAt, grantCode: tok.code },
        tokens: s.tokens.map((t) => (t.code === raw ? { ...t, usesLeft: t.usesLeft - 1, medico: medName, status: (t.usesLeft - 1 <= 0 ? 'agotada' : t.status) } : t)),
        audit: [{ ts: now, actor: medName, rol: 'medico', accion: 'Consultó historial mediante token', ref: raw, ip: '190.233.45.18', disp: 'Chrome · Consultorio' } as AuditEntry, ...s.audit],
      }))
      get().showToast('Acceso concedido. Consulta registrada en auditoría.', 'ok')
    }, 1000)
  },
  cerrarAccesoMedico: () => set((s) => ({ doc: { ...s.doc, granted: false, tokenInput: '' } })),

  // ---------- CU-05 emergencia ----------
  setEmg: (k, v) => set((s) => ({ emg: { ...s.emg, [k]: v } })),
  escanearQR: () => {
    set((s) => ({ emg: { ...s.emg, scanning: true, error: '' } }))
    setTimeout(() => {
      const now = Date.now()
      set((s) => ({
        emg: { ...s.emg, scanning: false, loaded: true },
        audit: [{ ts: now, actor: 'Personal de emergencia', rol: 'emergencia', accion: 'Acceso en modo emergencia (datos vitales)', ref: 'EMG-45872136', ip: '191.98.12.4', disp: 'Tablet · Emergencias' } as AuditEntry, ...s.audit],
      }))
    }, 1400)
  },
  validarCodigoEmergencia: () => {
    const raw = (get().emg.codeInput || '').toUpperCase().replace(/\s/g, '')
    if (raw !== 'EMG-45872136') { set((s) => ({ emg: { ...s.emg, error: 'Código de emergencia inválido. No se muestra información del paciente.' } })); return }
    get().escanearQR()
  },
  resetEmergencia: () => set({ emg: emptyEmg() }),

  // ---------- event detail modal ----------
  openEvent: (id) => set({ modalEvent: id }),
  closeEvent: () => set({ modalEvent: null }),

  // ---------- buscar medicina ----------
  setMedQuery: (v) => set((s) => ({ med: { ...s.med, query: v } })),
  selectMed: (id) => set((s) => ({ med: { ...s.med, selectedId: id } })),
  clearMed: () => set((s) => ({ med: { ...s.med, selectedId: null } })),

  // ---------- perfil ----------
  toggleProfile: (k) => set((s) => ({ profile: { ...s.profile, [k]: !s.profile[k] } })),

  // ---------- médico: registros clínicos ----------
  openMedModal: (kind) => set({
    medModal: kind,
    noteForm: { tipo: 'Consulta', titulo: '', diagnostico: '', indicaciones: '', error: '' },
    rxForm: { medNombre: '', dosis: '', duracion: '', error: '' },
    studyForm: { tipo: 'Laboratorio', nombre: '', indicacion: '', error: '' },
  }),
  closeMedModal: () => set({ medModal: null }),
  setNote: (k, v) => set((s) => ({ noteForm: { ...s.noteForm, [k]: v } })),
  guardarNota: () => {
    const f = get().noteForm
    if (!f.titulo.trim() || !f.diagnostico.trim()) { set((s) => ({ noteForm: { ...s.noteForm, error: 'Completa al menos el título y el diagnóstico.' } })); return }
    const now = Date.now()
    const sess = get().session
    const medName = sess ? `${sess.nombres} ${sess.apellidos}` : 'Dra. Ana María Flores Ríos'
    const ev: import('@/services/seed').ClinicalEvent = {
      id: 'x' + now, ts: todayISO(), tipo: f.tipo, titulo: f.titulo.trim(), medico: medName,
      colegiatura: (sess && sess.extra) || 'CMP 58213', especialidad: 'Neumología', estab: 'Hospital Nacional Arzobispo Loayza', sev: 'Leve',
      motivo: 'Registro clínico generado durante el acceso autorizado por token.', diagnostico: f.diagnostico.trim(),
      examen: '—', signos: { pa: '—', fc: '—', fr: '—', temp: '—', sat: '—', peso: '—', talla: '—', imc: '—' },
      medicamentos: [], indicaciones: f.indicaciones.trim() || 'Sin indicaciones adicionales.', estudios: [], nuevo: true,
    }
    set((s) => ({
      extraHistory: [ev, ...s.extraHistory], medModal: null,
      audit: [{ ts: now, actor: medName, rol: 'medico', accion: 'Registró nota clínica en el historial', ref: s.doc.grantCode || '—', ip: '190.233.45.18', disp: 'Chrome · Consultorio' } as AuditEntry, ...s.audit],
    }))
    get().showToast('Nota clínica registrada en el historial del paciente.', 'ok')
  },
  setRx: (k, v) => set((s) => ({ rxForm: { ...s.rxForm, [k]: v } })),
  emitirReceta: () => {
    const f = get().rxForm
    if (!f.medNombre.trim() || !f.dosis.trim()) { set((s) => ({ rxForm: { ...s.rxForm, error: 'Indica el medicamento y la dosis.' } })); return }
    const now = Date.now()
    const sess = get().session
    const medName = sess ? `${sess.nombres} ${sess.apellidos}` : 'Dra. Ana María Flores Ríos'
    const rx: Receta = { id: 'rx' + now, ts: todayISO(), paciente: 'Juan Carlos Pérez Quispe', medico: medName, estado: 'Vigente', nuevo: true, items: [{ nombre: f.medNombre.trim(), dosis: f.dosis.trim(), duracion: f.duracion.trim() || 'Según indicación' }] }
    set((s) => ({
      recetas: [rx, ...s.recetas], medModal: null,
      audit: [{ ts: now, actor: medName, rol: 'medico', accion: 'Emitió receta electrónica', ref: s.doc.grantCode || '—', ip: '190.233.45.18', disp: 'Chrome · Consultorio' } as AuditEntry, ...s.audit],
    }))
    get().showToast('Receta electrónica emitida.', 'ok')
  },
  setStudy: (k, v) => set((s) => ({ studyForm: { ...s.studyForm, [k]: v } })),
  solicitarEstudio: () => {
    const f = get().studyForm
    if (!f.nombre.trim()) { set((s) => ({ studyForm: { ...s.studyForm, error: 'Indica el estudio a solicitar.' } })); return }
    const now = Date.now()
    const sess = get().session
    const medName = sess ? `${sess.nombres} ${sess.apellidos}` : 'Dra. Ana María Flores Ríos'
    const ps: PendingStudy = { id: 'ps' + now, ts: todayISO(), tipo: f.tipo, nombre: f.nombre.trim(), indicacion: f.indicacion.trim(), medico: medName, estado: 'Pendiente' }
    set((s) => ({
      pendingStudies: [ps, ...s.pendingStudies], medModal: null,
      audit: [{ ts: now, actor: medName, rol: 'medico', accion: 'Solicitó estudio: ' + f.nombre.trim(), ref: s.doc.grantCode || '—', ip: '190.233.45.18', disp: 'Chrome · Consultorio' } as AuditEntry, ...s.audit],
    }))
    get().showToast('Solicitud de estudio registrada.', 'ok')
  },

  // ---------- session mgmt ----------
  cerrarSesionDisp: (id) => {
    set((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) }))
    get().showToast('Sesión cerrada en el dispositivo.', 'info')
  },
}))

export type { AuditRole }
