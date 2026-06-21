/**
 * Tipos del dominio y datos de respaldo del frontend.
 *
 * Tras conectar el backend, los datos reales vienen de la API (services/api.ts).
 * Aquí solo quedan: los **tipos** compartidos, y unos pocos valores usados como
 * defaults antes de iniciar sesión (VITALS, MEDICINES) o como datos de UI que aún
 * no tienen endpoint (PATIENTS — lista de "Mis pacientes" del médico, demo).
 */

// ---------- tipos del dominio ----------
export type Role = 'paciente' | 'medico' | 'admin'

export interface Session {
  role: Role
  nombres: string
  apellidos: string
  dni: string
  extra?: string
}

export interface Vitals {
  sangre: string
  alergias: string[]
  enfermedades: string[]
  medicacion: string[]
  contacto: { nombre: string; relacion: string; telefono: string }
  /** Solo lo recibe el paciente dueño desde GET /vitals. */
  emergencyCode?: string
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

// ---------- defaults / datos de UI ----------
/** Default mostrado antes de cargar los vitales reales desde la API. */
export const VITALS: Vitals = {
  sangre: 'O+ (O positivo)',
  alergias: ['Penicilina', 'Mariscos'],
  enfermedades: ['Asma bronquial'],
  medicacion: ['Salbutamol inhalador'],
  contacto: { nombre: 'María Quispe Ramos', relacion: 'Madre', telefono: '+51 998 123 456' },
}

/** Lista de "Mis pacientes" del médico (demo; aún sin endpoint). */
export const PATIENTS: Patient[] = [
  { dni: '45872136', nombre: 'Juan Carlos Pérez Quispe', edad: 35, sexo: 'M', sangre: 'O+', cond: 'Asma bronquial', ultimo: 'Hace 2 horas', eventos: 5, iniciales: 'JP', color: 'linear-gradient(150deg,#0d7d74,#0a5c55)' },
  { dni: '70112233', nombre: 'Lucía Fernanda Rojas Medina', edad: 27, sexo: 'F', sangre: 'A+', cond: 'Sin antecedentes', ultimo: 'Hace 5 días', eventos: 2, iniciales: 'LR', color: '#7c3aed' },
  { dni: '08456712', nombre: 'Pedro Antonio Huamán Soto', edad: 49, sexo: 'M', sangre: 'B+', cond: 'Hipertensión arterial', ultimo: 'Hace 2 semanas', eventos: 8, iniciales: 'PH', color: '#1d4ed8' },
]

/** Default del catálogo antes de cargar /medicines desde la API. */
export const MEDICINES: Medicine[] = [
  { id: 'm1', nombre: 'Salbutamol', principio: 'Salbutamol 100 mcg', forma: 'Inhalador · 200 dosis', categoria: 'Broncodilatador', receta: true,
    farmacias: [{ nombre: 'Boticas BTL', precio: 16.9, stock: 'En stock', dist: '1.2 km' }, { nombre: 'Inkafarma', precio: 18.5, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Boticas Perú', precio: 17.2, stock: 'Pocas unidades', dist: '0.9 km' }, { nombre: 'Farmacias Universal', precio: 19.5, stock: 'En stock', dist: '2.1 km' }, { nombre: 'Mifarma', precio: 21.9, stock: 'En stock', dist: '0.6 km' }] },
  { id: 'm2', nombre: 'Budesonida', principio: 'Budesonida 200 mcg', forma: 'Inhalador · 120 dosis', categoria: 'Corticoide inhalado', receta: true,
    farmacias: [{ nombre: 'Inkafarma', precio: 42.9, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Mifarma', precio: 45.5, stock: 'En stock', dist: '0.6 km' }, { nombre: 'Boticas BTL', precio: 39.9, stock: 'Pocas unidades', dist: '1.2 km' }, { nombre: 'Farmacias Universal', precio: 47.0, stock: 'En stock', dist: '2.1 km' }] },
  { id: 'm3', nombre: 'Paracetamol', principio: 'Paracetamol 500 mg', forma: 'Caja · 100 tabletas', categoria: 'Analgésico / Antipirético', receta: false,
    farmacias: [{ nombre: 'Inkafarma', precio: 8.9, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Mifarma', precio: 9.5, stock: 'En stock', dist: '0.6 km' }, { nombre: 'Boticas BTL', precio: 6.5, stock: 'En stock', dist: '1.2 km' }, { nombre: 'Boticas Perú', precio: 7.2, stock: 'En stock', dist: '0.9 km' }, { nombre: 'Farmacias Universal', precio: 8.0, stock: 'Pocas unidades', dist: '2.1 km' }] },
  { id: 'm4', nombre: 'Amoxicilina', principio: 'Amoxicilina 500 mg', forma: 'Caja · 21 cápsulas', categoria: 'Antibiótico', receta: true,
    farmacias: [{ nombre: 'Inkafarma', precio: 14.9, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Mifarma', precio: 13.9, stock: 'En stock', dist: '0.6 km' }, { nombre: 'Boticas BTL', precio: 12.5, stock: 'En stock', dist: '1.2 km' }, { nombre: 'Boticas Perú', precio: 15.0, stock: 'Agotado', dist: '0.9 km' }] },
  { id: 'm5', nombre: 'Ibuprofeno', principio: 'Ibuprofeno 400 mg', forma: 'Caja · 100 tabletas', categoria: 'Antiinflamatorio (AINE)', receta: false,
    farmacias: [{ nombre: 'Inkafarma', precio: 11.9, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Mifarma', precio: 12.5, stock: 'En stock', dist: '0.6 km' }, { nombre: 'Boticas BTL', precio: 9.9, stock: 'En stock', dist: '1.2 km' }, { nombre: 'Farmacias Universal', precio: 10.5, stock: 'En stock', dist: '2.1 km' }] },
  { id: 'm6', nombre: 'Loratadina', principio: 'Loratadina 10 mg', forma: 'Caja · 10 tabletas', categoria: 'Antihistamínico', receta: false,
    farmacias: [{ nombre: 'Inkafarma', precio: 7.5, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Mifarma', precio: 6.9, stock: 'En stock', dist: '0.6 km' }, { nombre: 'Boticas BTL', precio: 5.9, stock: 'En stock', dist: '1.2 km' }, { nombre: 'Boticas Perú', precio: 6.5, stock: 'Pocas unidades', dist: '0.9 km' }] },
  { id: 'm7', nombre: 'Omeprazol', principio: 'Omeprazol 20 mg', forma: 'Caja · 14 cápsulas', categoria: 'Inhibidor de bomba de protones', receta: false,
    farmacias: [{ nombre: 'Inkafarma', precio: 10.9, stock: 'En stock', dist: '0.4 km' }, { nombre: 'Mifarma', precio: 11.5, stock: 'En stock', dist: '0.6 km' }, { nombre: 'Boticas BTL', precio: 8.9, stock: 'En stock', dist: '1.2 km' }, { nombre: 'Farmacias Universal', precio: 9.9, stock: 'En stock', dist: '2.1 km' }] },
]
