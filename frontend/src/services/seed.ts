/**
 * Hampiq mock data layer (DAS `services/`).
 *
 * Today everything is seeded in the client. Each constant maps to a future
 * backend entity (see HAMPIQ_FUNCIONALIDADES.md §6): users → usuarios,
 * reniec → external identity service, tokens → tokens_acceso, etc. When the
 * FastAPI backend exists, these readers become API calls without changing the
 * UI layer.
 */

// ---------- domain types ----------
export type Role = 'paciente' | 'medico' | 'admin'

export interface User {
  dni: string
  password: string
  role: Role
  nombres: string
  apellidos: string
  extra?: string
}

export interface Session {
  role: Role
  nombres: string
  apellidos: string
  dni: string
  extra?: string
}

export interface ReniecRecord {
  nombres: string
  apellidos: string
  nacimiento: string
  sexo: string
}

export interface Vitals {
  sangre: string
  alergias: string[]
  enfermedades: string[]
  medicacion: string[]
  contacto: { nombre: string; relacion: string; telefono: string }
}

export interface Patient {
  dni: string
  nombre: string
  edad: number
  sexo: string
  sangre: string
  cond: string
  ultimo: string
  eventos: number
  iniciales: string
  color: string
}

export interface LabRow {
  p: string
  v: string
  u: string
  r: string
  e: 'normal' | 'alto' | 'bajo'
}

export type Estudio =
  | { t: 'lab'; n: string; lab: string; rows: LabRow[] }
  | { t: 'img'; n: string; modalidad: string; equipo: string; hallazgos: string }

export interface Signos {
  pa: string
  fc: string
  fr: string
  temp: string
  sat: string
  peso: string
  talla: string
  imc: string
}

export interface Medicamento {
  nombre: string
  dosis: string
  indicacion: string
}

export interface ClinicalEvent {
  id: string
  ts: string
  tipo: string
  titulo: string
  medico: string
  colegiatura: string
  especialidad: string
  estab: string
  sev: string
  motivo: string
  diagnostico: string
  examen: string
  signos: Signos
  medicamentos: Medicamento[]
  indicaciones: string
  estudios: Estudio[]
  nuevo?: boolean
}

export interface Farmacia {
  nombre: string
  precio: number
  stock: string
  dist: string
}

export interface Medicine {
  id: string
  nombre: string
  principio: string
  forma: string
  categoria: string
  receta: boolean
  farmacias: Farmacia[]
}

export type TokenStatus = 'activa' | 'expirada' | 'agotada' | 'revocada'

export interface Token {
  code: string
  createdAt: number
  expiresAt: number
  durationMin: number
  uses: number
  usesLeft: number
  status: TokenStatus
  medico: string
}

export type AuditRole = 'medico' | 'emergencia' | 'paciente'

export interface AuditEntry {
  ts: number
  actor: string
  rol: AuditRole
  accion: string
  ref: string
  ip: string
  disp: string
}

export interface SessionDevice {
  id: string
  disp: string
  ip: string
  lugar: string
  actual: boolean
  ultimo: string
}

export interface RecetaItem {
  nombre: string
  dosis: string
  duracion: string
}

export interface Receta {
  id: string
  ts: string
  paciente: string
  medico: string
  estado: string
  nuevo?: boolean
  items: RecetaItem[]
}

export interface PendingStudy {
  id: string
  ts: string
  tipo: string
  nombre: string
  indicacion: string
  medico: string
  estado: string
}

// ---------- static seed ----------
export const SEED_USERS: User[] = [
  { dni: '45872136', password: 'hampiq123', role: 'paciente', nombres: 'Juan Carlos', apellidos: 'Pérez Quispe' },
  { dni: '40221785', password: 'medico123', role: 'medico', nombres: 'Ana María', apellidos: 'Flores Ríos', extra: 'CMP 58213' },
  { dni: '10000001', password: 'admin123', role: 'admin', nombres: 'Carlos', apellidos: 'Mendoza Vargas' },
]

export const RENIEC: Record<string, ReniecRecord> = {
  '45872136': { nombres: 'Juan Carlos', apellidos: 'Pérez Quispe', nacimiento: '1991-04-18', sexo: 'Masculino' },
  '40221785': { nombres: 'Ana María', apellidos: 'Flores Ríos', nacimiento: '1985-09-02', sexo: 'Femenino' },
  '70112233': { nombres: 'Lucía Fernanda', apellidos: 'Rojas Medina', nacimiento: '1998-12-11', sexo: 'Femenino' },
  '08456712': { nombres: 'Pedro Antonio', apellidos: 'Huamán Soto', nacimiento: '1976-06-30', sexo: 'Masculino' },
}

export const VITALS: Vitals = {
  sangre: 'O+ (O positivo)',
  alergias: ['Penicilina', 'Mariscos'],
  enfermedades: ['Asma bronquial'],
  medicacion: ['Salbutamol inhalador'],
  contacto: { nombre: 'María Quispe Ramos', relacion: 'Madre', telefono: '+51 998 123 456' },
}

export const PATIENTS: Patient[] = [
  { dni: '45872136', nombre: 'Juan Carlos Pérez Quispe', edad: 35, sexo: 'M', sangre: 'O+', cond: 'Asma bronquial', ultimo: 'Hace 2 horas', eventos: 5, iniciales: 'JP', color: 'linear-gradient(150deg,#0d7d74,#0a5c55)' },
  { dni: '70112233', nombre: 'Lucía Fernanda Rojas Medina', edad: 27, sexo: 'F', sangre: 'A+', cond: 'Sin antecedentes', ultimo: 'Hace 5 días', eventos: 2, iniciales: 'LR', color: '#7c3aed' },
  { dni: '08456712', nombre: 'Pedro Antonio Huamán Soto', edad: 49, sexo: 'M', sangre: 'B+', cond: 'Hipertensión arterial', ultimo: 'Hace 2 semanas', eventos: 8, iniciales: 'PH', color: '#1d4ed8' },
]

export const HISTORY: ClinicalEvent[] = [
  {
    id: 'e1', ts: '2026-05-12', tipo: 'Consulta', titulo: 'Control de asma bronquial', medico: 'Dra. Ana María Flores Ríos', colegiatura: 'CMP 58213', especialidad: 'Neumología', estab: 'Hospital Nacional Arzobispo Loayza', sev: 'Leve',
    motivo: 'Control programado de asma. Refiere disnea ocasional nocturna y uso de inhalador de rescate 2 veces/semana.',
    diagnostico: 'Asma bronquial parcialmente controlada (J45.9). Se ajusta tratamiento de mantenimiento con corticoide inhalado en dosis baja.',
    examen: 'Paciente en buen estado general, afebril. Murmullo vesicular conservado con sibilancias espiratorias aisladas en bases. SatO2 97% al aire ambiente.',
    signos: { pa: '118/76 mmHg', fc: '78 lpm', fr: '18 rpm', temp: '36.6 °C', sat: '97 %', peso: '74 kg', talla: '1.74 m', imc: '24.4' },
    medicamentos: [
      { nombre: 'Budesonida 200 mcg', dosis: '1 inhalación c/12 h', indicacion: 'Mantenimiento, 8 semanas' },
      { nombre: 'Salbutamol 100 mcg', dosis: '2 inhalaciones de rescate', indicacion: 'Solo en crisis' },
    ],
    indicaciones: 'Continuar mantenimiento. Evitar exposición a polvo y ácaros. Control en 8 semanas con espirometría.',
    estudios: [
      { t: 'lab', n: 'Hemograma completo', lab: 'Laboratorio Central — Loayza', rows: [
        { p: 'Hemoglobina', v: '14.2', u: 'g/dL', r: '13.0 – 17.0', e: 'normal' },
        { p: 'Leucocitos', v: '7.8', u: '10³/µL', r: '4.0 – 10.0', e: 'normal' },
        { p: 'Plaquetas', v: '250', u: '10³/µL', r: '150 – 400', e: 'normal' },
        { p: 'Eosinófilos', v: '6.0', u: '%', r: '1.0 – 4.0', e: 'alto' },
      ] },
      { t: 'img', n: 'Radiografía de tórax PA', modalidad: 'Rayos X · Proyección PA', equipo: 'Siemens Multix · 2026-05-12', hallazgos: 'Campos pulmonares bien ventilados, sin consolidaciones ni derrame. Silueta cardiaca de tamaño normal. Senos costofrénicos libres.' },
    ],
  },
  {
    id: 'e2', ts: '2026-03-02', tipo: 'Emergencia', titulo: 'Crisis asmática aguda', medico: 'Dr. Luis Tello Vega', colegiatura: 'CMP 41027', especialidad: 'Medicina de Emergencia', estab: 'Clínica Internacional — Emergencias', sev: 'Grave',
    motivo: 'Acude a emergencia por dificultad respiratoria de inicio súbito tras exposición a humo.',
    diagnostico: 'Crisis asmática moderada-severa (J46) resuelta con nebulización y corticoide sistémico. Buena respuesta al tratamiento.',
    examen: 'Ingresa taquipneico, con tiraje intercostal leve y sibilancias difusas. Mejora tras 3 nebulizaciones. Se da de alta estable.',
    signos: { pa: '132/84 mmHg', fc: '104 lpm', fr: '26 rpm', temp: '36.9 °C', sat: '93 %', peso: '74 kg', talla: '1.74 m', imc: '24.4' },
    medicamentos: [
      { nombre: 'Salbutamol + Ipratropio', dosis: 'Nebulización c/20 min x3', indicacion: 'Crisis aguda' },
      { nombre: 'Prednisona 50 mg', dosis: '1 tableta/día', indicacion: '5 días' },
    ],
    indicaciones: 'Reposo relativo 48 h. Completar corticoide oral. Control con neumología en 7 días.',
    estudios: [
      { t: 'lab', n: 'Gasometría arterial', lab: 'Emergencia — Clínica Internacional', rows: [
        { p: 'pH', v: '7.36', u: '', r: '7.35 – 7.45', e: 'normal' },
        { p: 'PaO₂', v: '78', u: 'mmHg', r: '80 – 100', e: 'bajo' },
        { p: 'PaCO₂', v: '38', u: 'mmHg', r: '35 – 45', e: 'normal' },
        { p: 'SatO₂', v: '93', u: '%', r: '95 – 100', e: 'bajo' },
      ] },
    ],
  },
  {
    id: 'e3', ts: '2025-11-20', tipo: 'Laboratorio', titulo: 'Perfil bioquímico anual', medico: 'Lab. SedeSalud', colegiatura: '—', especialidad: 'Laboratorio clínico', estab: 'Laboratorio SedeSalud', sev: 'Normal',
    motivo: 'Chequeo preventivo anual solicitado por medicina general.',
    diagnostico: 'Valores dentro de rangos normales. Sin hallazgos patológicos en el perfil bioquímico.',
    examen: 'Muestra obtenida en ayunas de 12 horas. Procesamiento automatizado.',
    signos: { pa: '—', fc: '—', fr: '—', temp: '—', sat: '—', peso: '73 kg', talla: '1.74 m', imc: '24.1' },
    medicamentos: [],
    indicaciones: 'Mantener dieta equilibrada y actividad física regular. Repetir perfil en 12 meses.',
    estudios: [
      { t: 'lab', n: 'Perfil lipídico', lab: 'Laboratorio SedeSalud', rows: [
        { p: 'Colesterol total', v: '178', u: 'mg/dL', r: '< 200', e: 'normal' },
        { p: 'LDL', v: '110', u: 'mg/dL', r: '< 130', e: 'normal' },
        { p: 'HDL', v: '48', u: 'mg/dL', r: '> 40', e: 'normal' },
        { p: 'Triglicéridos', v: '140', u: 'mg/dL', r: '< 150', e: 'normal' },
      ] },
      { t: 'lab', n: 'Glucosa en ayunas', lab: 'Laboratorio SedeSalud', rows: [
        { p: 'Glucosa', v: '92', u: 'mg/dL', r: '70 – 100', e: 'normal' },
      ] },
    ],
  },
  {
    id: 'e4', ts: '2025-08-09', tipo: 'Consulta', titulo: 'Consulta dermatológica', medico: 'Dr. Jorge Salas Núñez', colegiatura: 'CMP 33890', especialidad: 'Dermatología', estab: 'Centro Médico San Pablo', sev: 'Leve',
    motivo: 'Lesión eritematosa pruriginosa en antebrazo derecho de 4 días de evolución.',
    diagnostico: 'Dermatitis de contacto alérgica (L23) en antebrazo derecho. Se indica corticoide tópico.',
    examen: 'Placa eritematosa con descamación fina, bordes definidos, sin signos de infección secundaria.',
    signos: { pa: '120/78 mmHg', fc: '72 lpm', fr: '16 rpm', temp: '36.5 °C', sat: '98 %', peso: '73 kg', talla: '1.74 m', imc: '24.1' },
    medicamentos: [
      { nombre: 'Hidrocortisona 1% crema', dosis: 'Aplicar c/12 h', indicacion: 'Zona afectada, 7 días' },
      { nombre: 'Loratadina 10 mg', dosis: '1 tableta/día', indicacion: 'Si hay prurito' },
    ],
    indicaciones: 'Evitar el contacto con el agente irritante. Control si no mejora en una semana.',
    estudios: [],
  },
  {
    id: 'e5', ts: '2025-02-14', tipo: 'Vacunación', titulo: 'Vacuna antigripal estacional', medico: 'Enf. Rosa Díaz Campos', colegiatura: 'CEP 12044', especialidad: 'Enfermería', estab: 'Posta Médica Magdalena', sev: 'Normal',
    motivo: 'Campaña de inmunización antigripal estacional.',
    diagnostico: 'Inmunización antigripal (Z25.1) aplicada sin reacciones adversas inmediatas.',
    examen: 'Paciente afebril, sin contraindicaciones. Observación post-vacunal de 20 minutos sin incidentes.',
    signos: { pa: '118/74 mmHg', fc: '70 lpm', fr: '16 rpm', temp: '36.4 °C', sat: '98 %', peso: '72 kg', talla: '1.74 m', imc: '23.8' },
    medicamentos: [{ nombre: 'Vacuna influenza tetravalente', dosis: '0.5 mL IM', indicacion: 'Dosis única anual' }],
    indicaciones: 'Próxima dosis en la campaña del siguiente año. Acudir si presenta fiebre alta.',
    estudios: [],
  },
]

export const MEDICINES: Medicine[] = [
  { id: 'm1', nombre: 'Salbutamol', principio: 'Salbutamol 100 mcg', forma: 'Inhalador · 200 dosis', categoria: 'Broncodilatador', receta: true,
    farmacias: [ { nombre: 'Boticas BTL', precio: 16.9, stock: 'En stock', dist: '1.2 km' }, { nombre: 'Inkafarma', precio: 18.5, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Boticas Perú', precio: 17.2, stock: 'Pocas unidades', dist: '0.9 km' }, { nombre: 'Farmacias Universal', precio: 19.5, stock: 'En stock', dist: '2.1 km' }, { nombre: 'Mifarma', precio: 21.9, stock: 'En stock', dist: '0.6 km' } ] },
  { id: 'm2', nombre: 'Budesonida', principio: 'Budesonida 200 mcg', forma: 'Inhalador · 120 dosis', categoria: 'Corticoide inhalado', receta: true,
    farmacias: [ { nombre: 'Inkafarma', precio: 42.9, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Mifarma', precio: 45.5, stock: 'En stock', dist: '0.6 km' }, { nombre: 'Boticas BTL', precio: 39.9, stock: 'Pocas unidades', dist: '1.2 km' }, { nombre: 'Farmacias Universal', precio: 47.0, stock: 'En stock', dist: '2.1 km' } ] },
  { id: 'm3', nombre: 'Paracetamol', principio: 'Paracetamol 500 mg', forma: 'Caja · 100 tabletas', categoria: 'Analgésico / Antipirético', receta: false,
    farmacias: [ { nombre: 'Inkafarma', precio: 8.9, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Mifarma', precio: 9.5, stock: 'En stock', dist: '0.6 km' }, { nombre: 'Boticas BTL', precio: 6.5, stock: 'En stock', dist: '1.2 km' }, { nombre: 'Boticas Perú', precio: 7.2, stock: 'En stock', dist: '0.9 km' }, { nombre: 'Farmacias Universal', precio: 8.0, stock: 'Pocas unidades', dist: '2.1 km' } ] },
  { id: 'm4', nombre: 'Amoxicilina', principio: 'Amoxicilina 500 mg', forma: 'Caja · 21 cápsulas', categoria: 'Antibiótico', receta: true,
    farmacias: [ { nombre: 'Inkafarma', precio: 14.9, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Mifarma', precio: 13.9, stock: 'En stock', dist: '0.6 km' }, { nombre: 'Boticas BTL', precio: 12.5, stock: 'En stock', dist: '1.2 km' }, { nombre: 'Boticas Perú', precio: 15.0, stock: 'Agotado', dist: '0.9 km' } ] },
  { id: 'm5', nombre: 'Ibuprofeno', principio: 'Ibuprofeno 400 mg', forma: 'Caja · 100 tabletas', categoria: 'Antiinflamatorio (AINE)', receta: false,
    farmacias: [ { nombre: 'Inkafarma', precio: 11.9, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Mifarma', precio: 12.5, stock: 'En stock', dist: '0.6 km' }, { nombre: 'Boticas BTL', precio: 9.9, stock: 'En stock', dist: '1.2 km' }, { nombre: 'Farmacias Universal', precio: 10.5, stock: 'En stock', dist: '2.1 km' } ] },
  { id: 'm6', nombre: 'Loratadina', principio: 'Loratadina 10 mg', forma: 'Caja · 10 tabletas', categoria: 'Antihistamínico', receta: false,
    farmacias: [ { nombre: 'Inkafarma', precio: 7.5, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Mifarma', precio: 6.9, stock: 'En stock', dist: '0.6 km' }, { nombre: 'Boticas BTL', precio: 5.9, stock: 'En stock', dist: '1.2 km' }, { nombre: 'Boticas Perú', precio: 6.5, stock: 'Pocas unidades', dist: '0.9 km' } ] },
  { id: 'm7', nombre: 'Omeprazol', principio: 'Omeprazol 20 mg', forma: 'Caja · 14 cápsulas', categoria: 'Inhibidor de bomba de protones', receta: false,
    farmacias: [ { nombre: 'Inkafarma', precio: 10.9, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Mifarma', precio: 11.5, stock: 'En stock', dist: '0.6 km' }, { nombre: 'Boticas BTL', precio: 8.9, stock: 'En stock', dist: '1.2 km' }, { nombre: 'Farmacias Universal', precio: 9.9, stock: 'En stock', dist: '2.1 km' } ] },
]

export const SEED_RECETAS: Receta[] = [
  { id: 'rx1', ts: '2026-05-12', paciente: 'Juan Carlos Pérez Quispe', medico: 'Dra. Ana María Flores Ríos', estado: 'Vigente', items: [
    { nombre: 'Budesonida 200 mcg', dosis: '1 inhalación c/12 h', duracion: '8 semanas' },
    { nombre: 'Salbutamol 100 mcg', dosis: '2 inhalaciones de rescate', duracion: 'Según necesidad' },
  ] },
  { id: 'rx2', ts: '2026-03-02', paciente: 'Juan Carlos Pérez Quispe', medico: 'Dr. Luis Tello Vega', estado: 'Vencida', items: [
    { nombre: 'Prednisona 50 mg', dosis: '1 tableta/día', duracion: '5 días' },
  ] },
]

/** Time-relative seed data (tokens / audit / sessions), built from `now`. */
export function seedDynamic(now: number): {
  tokens: Token[]
  audit: AuditEntry[]
  sessions: SessionDevice[]
} {
  return {
    tokens: [
      { code: 'HMPQ-7K2D-9F4X', createdAt: now - 8 * 60000, expiresAt: now + 892000, durationMin: 30, uses: 3, usesLeft: 2, status: 'activa', medico: '—' },
      { code: 'HMPQ-3B8M-2P5T', createdAt: now - 3 * 86400000, expiresAt: now - 3 * 86400000 + 1800000, durationMin: 30, uses: 1, usesLeft: 0, status: 'expirada', medico: 'Dra. Ana Flores' },
    ],
    audit: [
      { ts: now - 2 * 3600000, actor: 'Dra. Ana Flores', rol: 'medico', accion: 'Consultó historial mediante token', ref: 'HMPQ-3B8M-2P5T', ip: '190.233.45.18', disp: 'Chrome · Windows 11' },
      { ts: now - 3 * 86400000, actor: 'Personal de emergencia', rol: 'emergencia', accion: 'Acceso en modo emergencia (datos vitales)', ref: 'EMG-45872136', ip: '191.98.12.4', disp: 'Tablet · Hospital Loayza' },
      { ts: now - 6 * 86400000, actor: 'Juan C. Pérez', rol: 'paciente', accion: 'Generó token médico', ref: 'HMPQ-9X1K-7L2N', ip: '190.233.45.12', disp: 'Chrome · Windows 11' },
      { ts: now - 9 * 86400000, actor: 'Dr. Luis Tello', rol: 'medico', accion: 'Consultó historial mediante token', ref: 'HMPQ-5R4D-8C3V', ip: '200.48.225.9', disp: 'Edge · Windows 10' },
    ],
    sessions: [
      { id: 's1', disp: 'Chrome · Windows 11', ip: '190.233.45.12', lugar: 'Lima, Perú', actual: true, ultimo: 'Activa ahora' },
      { id: 's2', disp: 'App móvil · Android 14', ip: '190.233.46.77', lugar: 'Lima, Perú', actual: false, ultimo: 'Hace 2 horas' },
      { id: 's3', disp: 'Safari · iPhone', ip: '181.65.20.3', lugar: 'Arequipa, Perú', actual: false, ultimo: 'Hace 5 días' },
    ],
  }
}
