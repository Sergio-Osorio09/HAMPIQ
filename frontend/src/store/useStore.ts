import { create } from 'zustand'
import { api, ApiError, getToken, setToken } from '@/services/api'
import {
  MEDICINES,
  VITALS,
  type AuditEntry,
  type ClinicalEvent,
  type Medicine,
  type PendingStudy,
  type Receta,
  type Role,
  type SessionDevice,
  type Token,
  type Vitals,
} from '@/services/seed'

export type Screen = 'landing' | 'auth' | 'emergency' | 'app'
export type AuthMode = 'login' | 'register'
export type PScreen =
  | 'dashboard' | 'history' | 'share' | 'medicines' | 'card' | 'audit' | 'profile'
  | 'med-home' | 'doctor' | 'med-patients' | 'audit-med' | 'med-rx'
  | 'admin' | 'admin-audit' | 'admin-tokens' | 'admin-users'
export type MedModalKind = 'nota' | 'receta' | 'estudio' | null

/** Cuenta de usuario tal como la devuelve el backend (sin contraseña). */
export interface Account {
  dni: string
  role: Role
  nombres: string
  apellidos: string
  extra?: string | null
}

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

const emptyReg = (): RegForm => ({
  dni: '', validated: false, loading: false, nombres: '', apellidos: '', nacimiento: '',
  sexo: '', correo: '', telefono: '', password: '', error: '', okFields: false,
})
const emptyDoc = (): DocState => ({ tokenInput: '', error: '', granted: false, validating: false })
const emptyEmg = (): EmgState => ({ codeInput: '', error: '', loaded: false, scanning: false })

const errMsg = (e: unknown): string =>
  e instanceof ApiError ? e.message : 'Ocurrió un error. Inténtalo de nuevo.'

const TOAST_MAP = {
  ok: { bg: '#0d7d74', icon: '✓' },
  err: { bg: '#c0202f', icon: '✕' },
  info: { bg: '#0f211f', icon: 'ℹ' },
}
let toastTimer: ReturnType<typeof setTimeout> | undefined

interface AuthResponse { token: string; user: Account }

export interface Store {
  // navigation / session
  screen: Screen
  pscreen: PScreen
  authMode: AuthMode
  session: Account | null
  token: string | null
  now: number
  booting: boolean

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

  // datos del backend
  tokens: Token[]
  audit: AuditEntry[]
  sessions: SessionDevice[]
  recetas: Receta[]
  pendingStudies: PendingStudy[]
  history: ClinicalEvent[]
  allUsers: Account[]
  vitals: Vitals
  medicines: Medicine[]
  emgVitals: Vitals | null

  // ---- actions ----
  tick: () => void
  go: (s: Screen) => void
  pgo: (s: PScreen) => void
  goLogin: () => void
  goRegister: () => void
  goEmergency: () => void
  goHome: () => void
  showToast: (msg: string, type?: 'ok' | 'err' | 'info') => void

  restore: () => Promise<void>
  bootstrap: () => Promise<void>
  quickPaciente: () => Promise<void>
  quickMedico: () => Promise<void>
  quickAdmin: () => Promise<void>
  logout: () => void

  setReg: (k: keyof RegForm, v: string) => void
  validarDni: () => Promise<void>
  crearCuenta: () => Promise<void>

  setLogin: (k: keyof LoginForm, v: string) => void
  doLogin: () => Promise<void>

  setShare: (k: 'duration' | 'uses', v: number) => void
  generarToken: () => Promise<void>
  copiarToken: (code: string) => void
  revocarToken: (code: string) => Promise<void>

  setDoc: (k: 'tokenInput', v: string) => void
  validarTokenMedico: () => Promise<void>
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
  guardarNota: () => Promise<void>
  setRx: (k: keyof RxForm, v: string) => void
  emitirReceta: () => Promise<void>
  setStudy: (k: keyof StudyForm, v: string) => void
  solicitarEstudio: () => Promise<void>

  cerrarSesionDisp: (id: string) => Promise<void>
}

function routeByRole(role: Role): Partial<Store> {
  if (role === 'medico') return { screen: 'app', pscreen: 'med-home', doc: emptyDoc() }
  if (role === 'admin') return { screen: 'app', pscreen: 'admin' }
  return { screen: 'app', pscreen: 'dashboard' }
}

export const useStore = create<Store>((set, get) => ({
  screen: 'landing',
  pscreen: 'dashboard',
  authMode: 'login',
  session: null,
  token: getToken(),
  now: Date.now(),
  booting: false,

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

  tokens: [],
  audit: [],
  sessions: [],
  recetas: [],
  pendingStudies: [],
  history: [],
  allUsers: [],
  vitals: VITALS, // default; se reemplaza con el de la API tras iniciar sesión
  medicines: MEDICINES, // default; se reemplaza con el catálogo de la API
  emgVitals: null,

  // ---------- navegación ----------
  tick: () => set({ now: Date.now() }),
  go: (s) => set({ screen: s }),
  pgo: (s) => set({ pscreen: s }),
  goLogin: () => set({ screen: 'auth', authMode: 'login', login: { dni: '', password: '', error: '' } }),
  goRegister: () => set({ screen: 'auth', authMode: 'register', reg: emptyReg() }),
  goEmergency: () => set({ screen: 'emergency', emg: emptyEmg(), emgVitals: null }),
  goHome: () => set({ screen: 'landing' }),

  showToast: (msg, type = 'ok') => {
    const t = TOAST_MAP[type] || TOAST_MAP.ok
    set({ toast: { msg, bg: t.bg, icon: t.icon } })
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => set({ toast: null }), 3200)
  },

  // ---------- sesión / carga de datos ----------
  restore: async () => {
    const tok = get().token
    if (!tok) return
    try {
      const user = await api.get<Account>('/me')
      set({ session: user, ...routeByRole(user.role) })
      await get().bootstrap()
    } catch {
      setToken(null)
      set({ token: null, session: null, screen: 'landing' })
    }
  },

  bootstrap: async () => {
    const role = get().session?.role
    if (!role) return
    set({ booting: true })
    try {
      if (role === 'paciente') {
        const [medicines, vitals, tokens, history, audit, sessions, recetas, pendingStudies] = await Promise.all([
          api.get<Medicine[]>('/medicines'), api.get<Vitals>('/vitals'), api.get<Token[]>('/tokens'),
          api.get<ClinicalEvent[]>('/history'), api.get<AuditEntry[]>('/audit'),
          api.get<SessionDevice[]>('/sessions'), api.get<Receta[]>('/recetas'), api.get<PendingStudy[]>('/studies'),
        ])
        set({ medicines, vitals, tokens, history, audit, sessions, recetas, pendingStudies })
      } else if (role === 'medico') {
        // El historial NO se carga aquí: el médico solo accede tras validar un token
        // (la concesión se obtiene en validarTokenMedico, que entonces sí carga el historial).
        const [medicines, vitals, audit, recetas, pendingStudies] = await Promise.all([
          api.get<Medicine[]>('/medicines'), api.get<Vitals>('/vitals'),
          api.get<AuditEntry[]>('/audit'), api.get<Receta[]>('/recetas'), api.get<PendingStudy[]>('/studies'),
        ])
        set({ medicines, vitals, audit, recetas, pendingStudies })
      } else {
        const [medicines, allUsers, tokens, audit, history] = await Promise.all([
          api.get<Medicine[]>('/medicines'), api.get<Account[]>('/admin/users'), api.get<Token[]>('/admin/tokens'),
          api.get<AuditEntry[]>('/admin/audit'), api.get<ClinicalEvent[]>('/history'),
        ])
        set({ medicines, allUsers, tokens, audit, history })
      }
    } catch (e) {
      get().showToast(errMsg(e), 'err')
    } finally {
      set({ booting: false })
    }
  },

  quickPaciente: () => demoLogin('45872136', 'hampiq123'),
  quickMedico: () => demoLogin('40221785', 'medico123'),
  quickAdmin: () => demoLogin('10000001', 'admin123'),

  logout: () => {
    setToken(null)
    set({
      token: null, session: null, screen: 'landing',
      tokens: [], audit: [], sessions: [], recetas: [], pendingStudies: [], history: [], allUsers: [],
      doc: emptyDoc(), share: { duration: 30, uses: 1, generated: null, error: '' },
    })
  },

  // ---------- CU-01 registro ----------
  setReg: (k, v) => set((s) => ({ reg: { ...s.reg, [k]: v } })),
  validarDni: async () => {
    const dni = get().reg.dni.trim()
    if (!/^\d{8}$/.test(dni)) {
      set((s) => ({ reg: { ...s.reg, error: 'El DNI debe tener exactamente 8 dígitos.', validated: false } }))
      return
    }
    set((s) => ({ reg: { ...s.reg, loading: true, error: '' } }))
    try {
      const r = await api.get<{ nombres: string; apellidos: string; nacimiento: string; sexo: string }>(`/reniec/${dni}`)
      set((s) => ({ reg: { ...s.reg, loading: false, validated: true, error: '', ...r } }))
    } catch (e) {
      set((s) => ({ reg: { ...s.reg, loading: false, validated: false, error: errMsg(e) } }))
    }
  },
  crearCuenta: async () => {
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
    try {
      const res = await api.post<AuthResponse>('/auth/register', { dni: r.dni.trim(), correo: r.correo, telefono: r.telefono, password: r.password })
      setToken(res.token)
      set({ token: res.token, session: res.user, ...routeByRole(res.user.role) })
      get().showToast('Cuenta creada con éxito. ¡Bienvenido a Hampiq!', 'ok')
      await get().bootstrap()
    } catch (e) {
      set((s) => ({ reg: { ...s.reg, error: errMsg(e) } }))
    }
  },

  // ---------- CU-02 login ----------
  setLogin: (k, v) => set((s) => ({ login: { ...s.login, [k]: v } })),
  doLogin: async () => {
    const { dni, password } = get().login
    if (!dni || !password) { set((s) => ({ login: { ...s.login, error: 'Completa ambos campos.' } })); return }
    try {
      const res = await api.post<AuthResponse>('/auth/login', { dni: dni.trim(), password })
      setToken(res.token)
      set({ token: res.token, session: res.user, login: { dni: '', password: '', error: '' }, ...routeByRole(res.user.role) })
      await get().bootstrap()
    } catch (e) {
      set((s) => ({ login: { ...s.login, error: errMsg(e) } }))
    }
  },

  // ---------- CU-03 token ----------
  setShare: (k, v) => set((s) => ({ share: { ...s.share, [k]: v } })),
  generarToken: async () => {
    const { duration, uses } = get().share
    try {
      const tok = await api.post<Token>('/tokens', { duration, uses })
      const tokens = await api.get<Token[]>('/tokens')
      const audit = await api.get<AuditEntry[]>('/audit')
      set((s) => ({ share: { ...s.share, generated: tok, error: '' }, tokens, audit }))
      get().showToast('Token generado y almacenado con TTL.', 'ok')
    } catch (e) {
      get().showToast(errMsg(e), 'err')
    }
  },
  copiarToken: (code) => {
    try { navigator.clipboard?.writeText(code) } catch { /* ignore */ }
    get().showToast('Token copiado al portapapeles.', 'info')
  },
  revocarToken: async (code) => {
    try {
      await api.post(`/tokens/${code}/revoke`)
      const tokens = await api.get<Token[]>('/tokens')
      const audit = await api.get<AuditEntry[]>('/audit')
      set((s) => ({
        tokens, audit,
        share: s.share.generated && s.share.generated.code === code
          ? { ...s.share, generated: { ...s.share.generated, status: 'revocada' } }
          : s.share,
      }))
      get().showToast('Token revocado. El acceso fue invalidado.', 'err')
    } catch (e) {
      get().showToast(errMsg(e), 'err')
    }
  },

  // ---------- CU-04 médico ----------
  setDoc: (k, v) => set((s) => ({ doc: { ...s.doc, [k]: v } })),
  validarTokenMedico: async () => {
    const raw = (get().doc.tokenInput || '').toUpperCase().replace(/\s/g, '')
    if (!raw) { set((s) => ({ doc: { ...s.doc, error: 'Ingresa un token.' } })); return }
    set((s) => ({ doc: { ...s.doc, validating: true, error: '' } }))
    try {
      const g = await api.post<{ granted: boolean; grantCode: string; grantExpires: number }>('/access/validate', { code: raw })
      const history = await api.get<ClinicalEvent[]>('/history')
      const audit = await api.get<AuditEntry[]>('/audit')
      set((s) => ({
        doc: { ...s.doc, validating: false, granted: true, grantedAt: Date.now(), grantExpires: g.grantExpires, grantCode: g.grantCode },
        history, audit,
      }))
      get().showToast('Acceso concedido. Consulta registrada en auditoría.', 'ok')
    } catch (e) {
      set((s) => ({ doc: { ...s.doc, validating: false, error: errMsg(e) } }))
    }
  },
  cerrarAccesoMedico: () => set((s) => ({ doc: { ...s.doc, granted: false, tokenInput: '' } })),

  // ---------- CU-05 emergencia ----------
  setEmg: (k, v) => set((s) => ({ emg: { ...s.emg, [k]: v } })),
  escanearQR: () => {
    set((s) => ({ emg: { ...s.emg, scanning: true, error: '' } }))
    setTimeout(() => { void emergencyValidate('EMG-45872136', true) }, 1400)
  },
  validarCodigoEmergencia: () => {
    const raw = (get().emg.codeInput || '').toUpperCase().replace(/\s/g, '')
    void emergencyValidate(raw, false)
  },
  resetEmergencia: () => set({ emg: emptyEmg(), emgVitals: null }),

  // ---------- modal de evento ----------
  openEvent: (id) => set({ modalEvent: id }),
  closeEvent: () => set({ modalEvent: null }),

  // ---------- buscar medicina ----------
  setMedQuery: (v) => set((s) => ({ med: { ...s.med, query: v, selectedId: null } })),
  selectMed: (id) => set((s) => ({ med: { ...s.med, selectedId: id } })),
  clearMed: () => set((s) => ({ med: { ...s.med, selectedId: null } })),

  // ---------- perfil (solo cliente) ----------
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
  guardarNota: async () => {
    const f = get().noteForm
    if (!f.titulo.trim() || !f.diagnostico.trim()) { set((s) => ({ noteForm: { ...s.noteForm, error: 'Completa al menos el título y el diagnóstico.' } })); return }
    try {
      await api.post('/history', { tipo: f.tipo, titulo: f.titulo, diagnostico: f.diagnostico, indicaciones: f.indicaciones })
      const history = await api.get<ClinicalEvent[]>('/history')
      const audit = await api.get<AuditEntry[]>('/audit')
      set({ history, audit, medModal: null })
      get().showToast('Nota clínica registrada en el historial del paciente.', 'ok')
    } catch (e) {
      set((s) => ({ noteForm: { ...s.noteForm, error: errMsg(e) } }))
    }
  },
  setRx: (k, v) => set((s) => ({ rxForm: { ...s.rxForm, [k]: v } })),
  emitirReceta: async () => {
    const f = get().rxForm
    if (!f.medNombre.trim() || !f.dosis.trim()) { set((s) => ({ rxForm: { ...s.rxForm, error: 'Indica el medicamento y la dosis.' } })); return }
    try {
      await api.post('/recetas', { medNombre: f.medNombre, dosis: f.dosis, duracion: f.duracion })
      const recetas = await api.get<Receta[]>('/recetas')
      const audit = await api.get<AuditEntry[]>('/audit')
      set({ recetas, audit, medModal: null })
      get().showToast('Receta electrónica emitida.', 'ok')
    } catch (e) {
      set((s) => ({ rxForm: { ...s.rxForm, error: errMsg(e) } }))
    }
  },
  setStudy: (k, v) => set((s) => ({ studyForm: { ...s.studyForm, [k]: v } })),
  solicitarEstudio: async () => {
    const f = get().studyForm
    if (!f.nombre.trim()) { set((s) => ({ studyForm: { ...s.studyForm, error: 'Indica el estudio a solicitar.' } })); return }
    try {
      await api.post('/studies', { tipo: f.tipo, nombre: f.nombre, indicacion: f.indicacion })
      const pendingStudies = await api.get<PendingStudy[]>('/studies')
      const audit = await api.get<AuditEntry[]>('/audit')
      set({ pendingStudies, audit, medModal: null })
      get().showToast('Solicitud de estudio registrada.', 'ok')
    } catch (e) {
      set((s) => ({ studyForm: { ...s.studyForm, error: errMsg(e) } }))
    }
  },

  // ---------- sesiones ----------
  cerrarSesionDisp: async (id) => {
    try {
      await api.del(`/sessions/${id}`)
      const sessions = await api.get<SessionDevice[]>('/sessions')
      set({ sessions })
      get().showToast('Sesión cerrada en el dispositivo.', 'info')
    } catch (e) {
      get().showToast(errMsg(e), 'err')
    }
  },
}))

// ---- helpers (usan el store directamente) ----
async function demoLogin(dni: string, password: string): Promise<void> {
  const { bootstrap, showToast } = useStore.getState()
  try {
    const res = await api.post<AuthResponse>('/auth/login', { dni, password })
    setToken(res.token)
    useStore.setState({ token: res.token, session: res.user, ...routeByRole(res.user.role) })
    await bootstrap()
  } catch (e) {
    showToast(errMsg(e), 'err')
  }
}

async function emergencyValidate(code: string, fromScan: boolean): Promise<void> {
  try {
    const res = await api.post<{ vitals: Vitals }>('/emergency/validate', { code })
    useStore.setState((s) => ({ emg: { ...s.emg, scanning: false, loaded: true, error: '' }, emgVitals: res.vitals }))
  } catch (e) {
    useStore.setState((s) => ({ emg: { ...s.emg, scanning: false, error: fromScan ? errMsg(e) : 'Código de emergencia inválido. No se muestra información del paciente.' } }))
  }
}
