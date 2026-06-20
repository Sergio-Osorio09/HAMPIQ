# Hampiq — Especificación funcional

> Documento de contexto para desarrollo (Claude Code).
> Describe **qué hace** cada funcionalidad del prototipo Hampiq, **para qué sirve**, **cómo se usa** y **qué reglas** la gobiernan. Pensado como referencia para implementar el backend/API real o portar el prototipo a una app de producción.

---

## 1. Visión general

**Hampiq** es una plataforma de **interoperabilidad clínica / historial médico nacional** (contexto: Perú). Su propósito central es **devolverle al paciente el control sobre su historia clínica**: el paciente decide quién accede a su información, por cuánto tiempo y cuántas veces, y cada acceso queda registrado en una **auditoría inmutable**.

Tres mecanismos de acceso son el corazón del sistema:

1. **Token temporal** — el paciente genera un código de un solo uso (o pocos usos) con tiempo de vida limitado (TTL) para que un médico consulte su historial.
2. **QR / código de emergencia** — acceso restringido a datos vitales (grupo sanguíneo, alergias, enfermedades, contacto) sin necesidad de que el paciente intervenga.
3. **Auditoría de accesos** — registro inmutable de cada consulta, generación de token, revocación, acceso de emergencia y registro clínico.

El prototipo es un **SPA de una sola pantalla** con navegación interna por estado (no hay routing por URL). Toda la lógica vive en cliente con datos sembrados (mock); no hay persistencia ni backend real todavía.

### Stack actual del prototipo
- Componente único `Hampiq.dc.html` (Design Component, render con React vía runtime propio).
- Estado centralizado en `class Component` (`this.state`), sin librerías externas.
- Tipografías: Public Sans (UI) y JetBrains Mono (códigos/tokens).
- Datos mock embebidos: usuarios, RENIEC simulado, historial clínico, medicinas, farmacias, auditoría, sesiones.

---

## 2. Roles de usuario

| Rol | Pantalla de inicio | Capacidades |
|-----|--------------------|-------------|
| **Paciente** | `dashboard` | Ver/gestionar su historial, generar y revocar tokens, tarjeta de emergencia, buscar medicinas, auditoría de accesos, perfil y seguridad. |
| **Médico** | `med-home` | Validar token de paciente, consultar historial autorizado, registrar notas clínicas / recetas / solicitudes de estudio, ver sus pacientes y consultas. |
| **Administrador** | `admin` | Panel general, auditoría global, gestión de tokens y usuarios del sistema. |
| **Emergencia** | `emergency` (sin login) | Escanear QR o ingresar código de emergencia para ver **solo** datos vitales del paciente. |

---

## 3. Mapa de pantallas

El estado `screen` controla la vista de nivel superior; `pscreen` controla la sub-pantalla dentro de la app autenticada.

- `screen`: `landing` · `auth` · `emergency` · `app`
- `pscreen` (paciente): `dashboard` · `history` · `share` · `medicines` · `card` · `audit` · `profile`
- `pscreen` (médico): `med-home` · `doctor` · `med-patients` · `audit-med` · `med-rx`
- `pscreen` (admin): `admin` · `admin-audit` · `admin-tokens` · `admin-users`

La **landing** ofrece accesos rápidos por rol (demo) que saltan el login: `quickPaciente`, `quickMedico`, `goEmergency`, `quickAdmin`.

---

## 4. Funcionalidades detalladas (casos de uso)

### CU-01 · Registro de paciente con validación RENIEC

**Propósito.** Crear una cuenta de paciente verificando su identidad contra RENIEC (simulado) a partir del DNI, evitando datos falsos.

**Cómo se usa.**
1. El usuario ingresa su **DNI (8 dígitos)** y pulsa *Validar*.
2. El sistema valida formato (`/^\d{8}$/`) y consulta el padrón RENIEC simulado (`reniec[dni]`), con un retardo artificial (~900 ms) que simula la llamada al servicio.
3. Si existe, **autocompleta y bloquea** nombres, apellidos, fecha de nacimiento y sexo (datos oficiales, no editables).
4. El usuario completa **correo, teléfono y contraseña** y pulsa *Crear cuenta*.
5. Validaciones: correo con formato válido, teléfono ≥ 9 dígitos, contraseña ≥ 8 caracteres, DNI no registrado previamente.
6. Al éxito → crea el usuario, lo agrega a `users`, muestra toast de bienvenida e inicia sesión como paciente (`screen: app`, `pscreen: dashboard`).

**DNIs de prueba (RENIEC):** `45872136`, `40221785`, `70112233`, `08456712`.

**Métodos clave:** `validarDni`, `crearCuenta`, `setReg`.

---

### CU-02 · Inicio de sesión

**Propósito.** Autenticar a un usuario existente y enrutarlo a su pantalla según rol.

**Cómo se usa.**
1. Ingresa DNI + contraseña.
2. Se busca coincidencia exacta en `users`.
3. Si falla → "DNI o contraseña incorrectos". Si acierta → enruta:
   - paciente → `dashboard`
   - médico → `med-home`
   - admin → `admin`

**Credenciales de prueba:**
| Rol | DNI | Contraseña |
|-----|-----|-----------|
| Paciente | `45872136` | `hampiq123` |
| Médico | `40221785` | `medico123` |
| Admin | `10000001` | `admin123` |

**Métodos clave:** `doLogin`, `setLogin`.

---

### CU-03 · Generación y gestión de token médico (paciente)

**Propósito.** Permitir que el paciente comparta su historial de forma controlada: el médico solo accede con un código que **caduca** y tiene **usos limitados**, y que el paciente puede **revocar** en cualquier momento.

**Cómo se usa.**
1. En *Compartir acceso*, el paciente elige **duración** (15 min / 30 min / 1 h / 4 h) y **número de usos** (1 / 3 / 5 / 10).
2. Pulsa *Generar token*. Se crea un código con formato `HMPQ-XXXX-XXXX` (alfabeto sin caracteres ambiguos), con `expiresAt = now + duración`, `usesLeft = usos`, estado `activa`.
3. El token muestra **cuenta regresiva en vivo** y barra de progreso del TTL (actualizada cada segundo).
4. Acciones por token: **Copiar** al portapapeles, **Revocar** (invalida el acceso de inmediato).
5. Cada generación y revocación se registra en la **auditoría**.

**Estados de token:** `activa` · `expirada` (por TTL) · `agotada` (usos = 0) · `revocada` (manual).

**Métodos clave:** `generarToken`, `genCode`, `copiarToken`, `revocarToken`, `setShare`. Helper de tiempo: `fmtRemaining`.

---

### CU-04 · Acceso del médico mediante token

**Propósito.** Que un médico consulte el historial de un paciente **solo** con autorización vigente, dejando rastro en auditoría.

**Cómo se usa.**
1. En *Acceso por token*, el médico escribe el código (se normaliza a mayúsculas, sin espacios) y pulsa *Validar*.
2. Validación (con retardo ~1 s) contra `tokens`. Rechaza si: no existe, fue revocado, expiró/`expirada`, o `usesLeft <= 0` — con mensaje específico en cada caso.
3. Al conceder: **descuenta un uso**, asigna el nombre del médico al token, marca `agotada` si llega a 0, y registra el acceso en auditoría.
4. Se muestra el **historial completo en solo lectura** con una **cuenta regresiva de la sesión de acceso** (`grantExpires`). Cuando expira, el acceso se cierra automáticamente (`docExpiredNow`).
5. Durante el acceso, el médico puede **registrar nota clínica, emitir receta y solicitar estudios** (ver CU-06).

**Métodos clave:** `validarTokenMedico`, `cerrarAccesoMedico`, `setDoc`.

---

### CU-05 · Modo emergencia (QR / código)

**Propósito.** Dar a personal de emergencia acceso inmediato a **datos vitales** del paciente sin login ni intervención del paciente, exponiendo el mínimo de información clínica necesaria.

**Cómo se usa.**
1. Desde la landing → *Emergencia* (no requiere sesión).
2. Dos vías: **Escanear QR** (`escanearQR`, simulación ~1.4 s) o **ingresar código** de emergencia y validarlo (`validarCodigoEmergencia`).
3. Código de demo válido: `EMG-45872136`. Cualquier otro → "Código de emergencia inválido".
4. Al validar muestra **solo**: grupo sanguíneo, alergias, enfermedades crónicas, medicación actual y contacto de emergencia. **No** expone consultas, diagnósticos ni el historial completo.
5. El acceso se registra en auditoría como "Acceso en modo emergencia (datos vitales)".

**Datos vitales (mock `vitals`):** Grupo O+, alergias (Penicilina, Mariscos), Asma bronquial, Salbutamol inhalador, contacto: madre +51 998 123 456.

**Métodos clave:** `escanearQR`, `validarCodigoEmergencia`, `resetEmergencia`, `setEmg`.

---

### CU-06 · Registros clínicos del médico (nota / receta / estudio)

**Propósito.** Que el médico documente la atención dentro del acceso autorizado, agregando información al historial del paciente.

**Cómo se usa.** Tres modales (`medModal`: `nota` | `receta` | `estudio`):

- **Nota clínica** (`guardarNota`): tipo (Consulta/…), título y diagnóstico obligatorios, indicaciones opcionales. Se agrega a `extraHistory` (aparece marcada como nueva al inicio del historial) y se audita.
- **Receta electrónica** (`emitirReceta`): medicamento + dosis obligatorios, duración opcional. Se agrega a `recetas` con estado `Vigente`. Las opciones de medicamento provienen del catálogo (`medicines`).
- **Solicitud de estudio** (`solicitarEstudio`): tipo (Laboratorio/Imagen), nombre obligatorio, indicación opcional. Se agrega a `pendingStudies` con estado `Pendiente`.

Todas las acciones quedan **referenciadas al token de acceso** (`grantCode`) en la auditoría.

**Métodos clave:** `openMedModal`, `closeMedModal`, `guardarNota`, `emitirReceta`, `solicitarEstudio`, `medName`, `todayISO`.

---

## 5. Funcionalidades de soporte

### 5.1 Historial clínico (paciente / médico)
Lista de eventos (`history` + `extraHistory`) con tipo (Consulta, Emergencia, Laboratorio, Vacunación), severidad, médico, establecimiento. Cada evento abre un **modal de detalle** (`modalEvent`) con: motivo, diagnóstico, examen físico, **signos vitales**, medicamentos, indicaciones y **estudios** (laboratorio con tabla de resultados marcados normal/alto/bajo, e imágenes con hallazgos).
**Métodos:** `openEvent`, `closeEvent`.

### 5.2 Tarjeta de emergencia (paciente)
Vista propia del paciente con su QR de emergencia y resumen de datos vitales — equivalente a lo que vería el personal de emergencia.

### 5.3 Buscar medicina + comparador de farmacias
Catálogo `medicines` (7 fármacos) con búsqueda por nombre/principio/categoría. Al seleccionar uno, muestra el **comparador de precios** entre farmacias: ordena por precio, marca la más barata, calcula ahorro vs. mínimo, precio promedio, y estado de stock (En stock / Pocas unidades / Agotado). Indica si el fármaco **requiere receta** o es **venta libre**.
**Métodos:** `setMedQuery`, `selectMed`, `clearMed`.

### 5.4 Auditoría de accesos
Registro `audit` ordenado por fecha (más reciente primero). Cada entrada: actor, rol (con icono/color), acción, referencia (token o código), IP y dispositivo. Es el **log inmutable** que respalda la promesa de transparencia. Existe versión paciente (`audit`), médico (`audit-med`, sus propias consultas) y admin (`admin-audit`, global).
**Helpers:** `fmtDateTime`, `relTime`.

### 5.5 Perfil y seguridad (paciente)
Toggles de **MFA**, notificaciones (email/SMS/push), datos de contacto, y **gestión de sesiones activas** por dispositivo (`sessions`) con opción de cerrar sesión remota (`cerrarSesionDisp`). La sesión actual no se puede cerrar.
**Métodos:** `toggleProfile`, `cerrarSesionDisp`.

### 5.6 Médico: pacientes, consultas y recetas
- **Mis pacientes** (`patients`): lista con edad, sexo, grupo sanguíneo, condición y nº de eventos.
- **Mis consultas** (`med-home` / `audit-med`): consultas realizadas con duración, tipo de acceso (solo lectura) y estadísticas (`medStats`).
- **Recetas emitidas** (`med-rx`): listado con estado Vigente/Vencida.

### 5.7 Administrador
Panel con métricas (tokens activos, accesos en 24 h, usuarios totales, eventos), auditoría global, gestión de tokens y de usuarios del sistema (`allUsers` con rol etiquetado).

---

## 6. Modelo de datos (mock → guía para el backend)

Colecciones sembradas hoy en cliente que deberían volverse entidades/tablas:

| Mock | Entidad sugerida | Notas |
|------|------------------|-------|
| `users` | `usuarios` | DNI, password (→ hash), rol, nombres, apellidos, colegiatura (`extra`). |
| `reniec` | servicio externo | Validación de identidad; reemplazar por API RENIEC real. |
| `tokens` | `tokens_acceso` | code, createdAt, expiresAt, durationMin, uses, usesLeft, status, medico. |
| `audit` | `auditoria` (inmutable / append-only) | ts, actor, rol, accion, ref, ip, disp. |
| `history` / `extraHistory` | `eventos_clinicos` | tipo, diagnóstico, signos, medicamentos, estudios. |
| `recetas` | `recetas` | items (medicamento/dosis/duración), estado. |
| `pendingStudies` | `solicitudes_estudio` | tipo, nombre, indicación, estado. |
| `medicines` | `catalogo_medicamentos` + `farmacias` | precios y stock por farmacia. |
| `sessions` | `sesiones` | dispositivo, ip, lugar, último acceso. |
| `vitals` | `datos_vitales` | subconjunto expuesto en emergencia. |

**Reglas de negocio a preservar en backend:**
- Token: validar TTL **y** usos en cada consulta; descuento atómico de `usesLeft`; revocación inmediata.
- Auditoría: **append-only**, nunca editable ni borrable; registrar toda generación/revocación/consulta/emergencia/registro clínico.
- Emergencia: exponer **únicamente** el subconjunto `vitals`, nunca el historial completo.
- RENIEC: campos de identidad oficiales **no editables** por el usuario.

---

## 7. Notas para portar a producción

- **Sin persistencia hoy:** todo se reinicia al recargar. Falta backend, base de datos y API.
- **Seguridad real pendiente:** las contraseñas están en texto plano (mock); MFA es solo un toggle visual; falta cifrado real, JWT/sesión, rate-limiting de validación de tokens.
- **Servicios externos a integrar:** RENIEC (identidad), establecimientos de salud (interoperabilidad de historiales), farmacias (precios/stock en vivo).
- **Tiempo:** las cuentas regresivas usan `Date.now()` en cliente; en producción la autoridad del TTL debe estar en el servidor.
- **Navegación:** hoy por estado interno; considerar routing por URL para enlaces profundos y back/forward del navegador.

---

*Universidad Nacional Mayor de San Marcos · Proyecto Hampiq v1.0 — Prototipo funcional*
