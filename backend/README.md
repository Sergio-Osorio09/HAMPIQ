# Hampiq — Backend (FastAPI)

API REST de Hampiq. **Arranque local con SQLite** (sin instalar Postgres/Redis): implementa
los casos de uso del DAS (auth, tokens médicos con TTL, historial clínico, auditoría
inmutable, modo emergencia, medicinas) con FastAPI + SQLAlchemy + JWT/RBAC.

> Migración prevista (DAS): SQLite → **PostgreSQL** y el TTL de tokens → **Redis**. La capa
> de acceso (SQLAlchemy) y los routers no cambian al migrar el motor.

## Requisitos
- Python 3.11+ (probado con 3.12)

## Cómo ejecutar (Windows / PowerShell)

**Primera vez (instalar dependencias):**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

**Arrancar el servidor (recomendado, estable):**
```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000
```

- API: http://127.0.0.1:8000/api
- Documentación interactiva (OpenAPI/Swagger): http://127.0.0.1:8000/docs
- La base de datos `hampiq.db` se crea y siembra automáticamente al primer arranque.
  Para reiniciar los datos, borra `hampiq.db` y vuelve a arrancar.

> ⚠️ **No uses `--reload` en Windows aquí.** El watcher vigila toda la carpeta `backend/` y,
> al crearse `hampiq.db` durante el arranque (el seed), tumba el proceso (el server se apaga
> apenas inicia). Si necesitas auto-recarga mientras editas el código del backend, limita el
> watch a la carpeta `app/`:
> ```powershell
> .\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000 --reload --reload-dir app
> ```

## Cómo apagarlo / suspenderlo

- En la terminal donde corre: **`Ctrl + C`** (apagado limpio). Para volver a levantarlo, repite el
  comando de arranque.
- Si el puerto quedó ocupado por un proceso anterior (p. ej. error `WinError 10013` al reiniciar),
  libéralo:
  ```powershell
  Get-NetTCPConnection -LocalPort 8000 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
  ```
- O usa otro puerto: `--port 8001`. Si cambias el puerto, ajusta también el frontend con
  `VITE_API_URL` (p. ej. `http://127.0.0.1:8001/api`) y, si hace falta, `CORS_ORIGINS` en `app/config.py`.

## Credenciales de demostración
| Rol      | DNI        | Contraseña  |
| -------- | ---------- | ----------- |
| Paciente | `45872136` | `hampiq123` |
| Médico   | `40221785` | `medico123` |
| Admin    | `10000001` | `admin123`  |

## Endpoints principales (prefijo `/api`)
- **Auth:** `GET /reniec/{dni}` · `POST /auth/register` · `POST /auth/login` · `GET /me`
- **Tokens (paciente):** `GET /tokens` · `POST /tokens` · `POST /tokens/{code}/revoke`
- **Acceso médico:** `POST /access/validate`
- **Historial:** `GET /history` · `POST /history` (médico)
- **Recetas / Estudios:** `GET|POST /recetas` · `GET|POST /studies`
- **Auditoría / Sesiones:** `GET /audit` · `GET /sessions` · `DELETE /sessions/{id}`
- **Emergencia (público):** `POST /emergency/validate`
- **Vitales / Medicinas:** `GET /vitals` · `GET /medicines`
- **Admin:** `GET /admin/users` · `GET /admin/tokens` · `GET /admin/audit`

## Estructura (DAS §7.3)
```
app/
  main.py          # FastAPI, CORS, arranque + seed
  config.py        # configuración (JWT, DB, CORS)
  database.py      # engine/session SQLAlchemy
  models.py        # entidades ORM (Vista de Datos)
  schemas.py       # validación de entrada (Pydantic)
  security.py      # hash de contraseñas (PBKDF2) + JWT
  deps.py          # autenticación + RBAC por rol
  serializers.py   # ORM → JSON (timestamps en ms para el frontend)
  data.py          # datos sembrados (mock)
  seed.py          # carga inicial de la BD
  routers/         # auth, catalog, tokens, clinical, audit, emergency, admin
```

## Reglas de negocio preservadas (DAS)
- Token: se valida TTL **y** usos en cada consulta; descuento de usos; revocación inmediata.
- Auditoría: **append-only** (nunca se edita ni borra); registra cada operación.
- Emergencia: expone **solo** el subconjunto vital, nunca el historial completo.
- Eventos clínicos: **sin borrado físico** (`deleted_at` para archivado lógico).
- Contraseñas: almacenadas con hash (PBKDF2), nunca en texto plano.
