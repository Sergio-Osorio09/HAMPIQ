# Hampiq — Frontend

SPA del prototipo **Hampiq**, plataforma nacional de interoperabilidad del historial
clínico (Perú). Migración fiel del prototipo de Claude Design (`Hampiq.dc.html`) a un
proyecto **React + TypeScript + Tailwind + Vite**, siguiendo la arquitectura del DAS
(`pages/`, `components/`, `services/`, `store/`).

> Estado actual: **todo en el cliente con datos mock**. No hay backend todavía; está
> previsto un backend FastAPI + PostgreSQL + Redis (ver `Hampiq_DAS_v1.0.pdf`).

## Requisitos

- Node.js 20+ (probado con Node 24 LTS)

## Cómo ejecutar

```bash
cd frontend
npm install      # solo la primera vez
npm run dev      # servidor de desarrollo en http://localhost:5173
```

Otros scripts:

```bash
npm run build    # type-check (tsc) + build de producción en dist/
npm run preview  # sirve el build de producción
```

## Credenciales de demostración

| Rol     | DNI        | Contraseña  |
| ------- | ---------- | ----------- |
| Paciente| `45872136` | `hampiq123` |
| Médico  | `40221785` | `medico123` |
| Admin   | `10000001` | `admin123`  |

Desde la landing también hay accesos rápidos por rol (saltan el login) y un modo
**Emergencia** (código demo `EMG-45872136`). DNIs de prueba para registro/RENIEC:
`45872136`, `70112233`, `08456712`.

## Estructura

```
src/
  pages/        # pantallas: Landing, Auth, Emergency, AppShell + patient/ doctor/ admin/ modals/
  components/   # Sidebar, Toast, Icon, Toggle, Box (helper de estilos)
  store/        # estado central (Zustand) + selectores derivados (renderVals del prototipo)
  services/     # seed.ts — datos mock y tipos (futuras entidades del backend)
  lib/          # style.ts (s() → estilos del prototipo), format.ts (fechas/TTL)
```

### Notas de implementación

- **Fidelidad pixel**: los estilos del prototipo se portan tal cual mediante el helper
  `s()` (`src/lib/style.ts`), que convierte strings CSS a objetos de estilo React.
  `Box` (`src/components/Box.tsx`) reemplaza `style-hover` / `style-focus` del runtime original.
- **Estado**: `src/store/useStore.ts` replica `this.state` y los métodos del prototipo
  (CU-01…CU-06, registros médicos, perfil). Un tick de 1 s alimenta las cuentas
  regresivas de TTL (igual que el `forceUpdate` del prototipo).
- **Datos mock → backend**: cada constante de `services/seed.ts` mapea a una entidad
  futura (usuarios, tokens_acceso, auditoria, eventos_clinicos, etc.).
