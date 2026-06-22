# Hampiq

> **Plataforma nacional de interoperabilidad del historial clínico — prototipo funcional.**
> Proyecto académico · Universidad Nacional Mayor de San Marcos (UNMSM) · Facultad de Ingeniería
> de Sistemas e Informática · Grupo 5 · v1.0 (2026).

Hampiq le devuelve al **paciente el control de su historia clínica**: decide quién accede a su
información, por cuánto tiempo y cuántas veces, y cada acceso queda registrado en una **auditoría
inmutable**.

> ⚠️ **Proyecto de prueba universitario.** Usa **datos de demostración (mock)** y un backend local;
> **no es un sistema clínico real** ni debe usarse con datos de pacientes reales.

## Características

- 🔑 **Token médico temporal** (`HMPQ-XXXX-XXXX`) con tiempo de vida (TTL) y número de usos; el
  paciente lo genera, comparte y revoca cuando quiere.
- 🚑 **Modo emergencia** por código/QR (`EMG-…`) que expone **solo** los datos vitales del paciente,
  sin necesidad de iniciar sesión.
- 📋 **Auditoría inmutable** (append-only) de cada acceso, generación o revocación.
- 🩺 **Cuatro roles**: Paciente, Médico, Administrador y Emergencia.
- 💊 **Buscar medicina** con comparador de farmacias y enlace de compra a la tienda real de cada cadena.

## Stack

| Capa      | Tecnologías                                                        |
| --------- | ------------------------------------------------------------------ |
| Frontend  | React 19 · TypeScript · Tailwind CSS v4 · Vite · Zustand           |
| Backend   | Python · FastAPI · SQLAlchemy · SQLite · JWT (PyJWT) + RBAC        |

Arquitectura en capas según el DAS (modelo de vistas 4+1 / RUP): presentación (SPA) → API REST
(routers · servicios · repositorios) → datos.

## Estructura del repositorio

```
HAMPIQ/
├─ frontend/                  # SPA React + TS + Tailwind  (ver frontend/README.md)
├─ backend/                   # API FastAPI + SQLite        (ver backend/README.md)
├─ HAMPIQ_FUNCIONALIDADES.md  # Especificación funcional (casos de uso CU-01…CU-06)
├─ Hampiq_DAS_v1.0.pdf        # Documento de Arquitectura de Software
└─ hampiq/                    # Prototipo de diseño original (referencia)
```

## Requisitos

- **Node.js** 20+ (probado con 24 LTS)
- **Python** 3.11+ (probado con 3.12)

## Cómo ejecutar (local)

Se necesitan **dos terminales**: el backend y el frontend corriendo a la vez.

**1) Backend** → http://127.0.0.1:8000 (documentación interactiva en `/docs`)

```powershell
cd backend
python -m venv .venv                                              # solo la 1ª vez
.\.venv\Scripts\python.exe -m pip install -r requirements.txt    # solo la 1ª vez
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000
```

**2) Frontend** → http://localhost:5173

```powershell
cd frontend
npm install      # solo la 1ª vez
npm run dev
```

Abre **http://localhost:5173** en el navegador. La base de datos SQLite del backend (`hampiq.db`)
se crea y se siembra automáticamente en el primer arranque. Más detalles y solución de problemas en
[`frontend/README.md`](frontend/README.md) y [`backend/README.md`](backend/README.md).

## Credenciales de demostración

| Rol           | DNI        | Contraseña  |
| ------------- | ---------- | ----------- |
| Paciente      | `45872136` | `hampiq123` |
| Médico        | `40221785` | `medico123` |
| Administrador | `10000001` | `admin123`  |

- DNIs de prueba para registro / RENIEC: `45872136`, `70112233`, `08456712`.
- Código de emergencia: **aleatorio por paciente** (visible en su *Tarjeta de emergencia*).
  Para que el botón «Simular escaneo de QR» de la pantalla de Emergencia resuelva un
  código real, arranca el backend con `HAMPIQ_DEMO_EMERGENCY=1`.

## Estado y alcance

- Todos los datos son de **demostración (mock)**; el backend usa **SQLite local**.
- Las integraciones reales (RENIEC, establecimientos de salud, farmacias y precios en vivo) y la
  migración a **PostgreSQL + Redis** están planificadas como evolución futura (ver el DAS).

---

Universidad Nacional Mayor de San Marcos · Proyecto Hampiq v1.0 — Prototipo funcional
