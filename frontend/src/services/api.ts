/**
 * Cliente HTTP del backend Hampiq (FastAPI). Adjunta el JWT y normaliza errores.
 * La URL base se puede sobreescribir con VITE_API_URL; por defecto apunta al backend local.
 */
const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://127.0.0.1:8000/api'

const TOKEN_KEY = 'hampiq_token'
let authToken: string | null = localStorage.getItem(TOKEN_KEY)

export function setToken(t: string | null): void {
  authToken = t
  if (t) localStorage.setItem(TOKEN_KEY, t)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getToken(): string | null {
  return authToken
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  let res: Response
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. ¿Está corriendo el backend en el puerto 8000?', 0)
  }

  if (!res.ok) {
    let detail = `Error ${res.status}`
    try {
      const j = await res.json()
      if (j && typeof j.detail === 'string') detail = j.detail
    } catch {
      /* respuesta sin cuerpo JSON */
    }
    throw new ApiError(detail, res.status)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  del: <T>(path: string) => request<T>('DELETE', path),
}
