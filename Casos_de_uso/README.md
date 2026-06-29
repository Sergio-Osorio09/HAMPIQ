# Casos de uso — Pruebas automatizadas de HAMPIQ con Selenium

> **Grupo 5** · Universidad Nacional Mayor de San Marcos · Facultad de Ingeniería de Sistemas e Informática
> Pruebas funcionales automatizadas (end-to-end) sobre el proyecto **HAMPIQ** usando **Selenium WebDriver + C# (.NET) + NUnit**, ejecutables desde **Visual Studio Community**.

Este documento explica **todo** lo que hicimos: qué herramientas usamos (las mismas de las guías de laboratorio de Selenium), cómo está estructurado el proyecto de pruebas, qué hace cada caso de prueba **en función de las pantallas reales de HAMPIQ**, y cómo ejecutarlo paso a paso.

---

## 1. ¿Qué estamos probando?

**HAMPIQ** es una plataforma que le devuelve al paciente el control de su historia clínica. De todas sus funciones, automatizamos los **tres flujos más importantes** del sistema:

| Caso | Código de Uso | Pantalla de HAMPIQ | Por qué es importante |
|------|---------------|--------------------|------------------------|
| **CP-01 · Inicio de sesión** | CU-02 | `Auth` (formulario de login) | Es la puerta de entrada: sin autenticación válida no hay acceso al historial. |
| **CP-02 · Generación de token médico** | CU-03 | `Share` (Compartir acceso) | Es la función estrella: el paciente comparte su historial con un token temporal `HMPQ-XXXX-XXXX`. |
| **CP-03 · Modo emergencia** | CU-05 | `Emergency` (sin login) | Permite a personal de emergencia ver **solo** los datos vitales del paciente vía QR/código. |

Cada caso prueba el **flujo principal** (camino feliz) y un **flujo alterno** (manejo de error), igual que la estructura del documento de casos de prueba.

---

## 2. Herramientas utilizadas (según las guías de laboratorio)

Estas son exactamente las herramientas que se enseñan en los laboratorios de Selenium (Lab 1 y Lab 2):

| Herramienta | Para qué sirve |
|-------------|----------------|
| **Selenium WebDriver** | Automatiza un navegador real (Chrome): hace clics, escribe en campos, lee textos. Traduce el código C# a llamadas que entiende el driver del navegador (protocolo W3C). |
| **C# (.NET 9)** | Lenguaje en el que escribimos las pruebas, interpretado por Visual Studio. |
| **NUnit + NUnit3TestAdapter** | Framework de pruebas: define los `[Test]`, los descubre y los corre desde el *Explorador de pruebas* de Visual Studio. |
| **FluentAssertions** | Permite escribir las verificaciones de forma natural y legible: `codigo.Should().MatchRegex(...)`. |
| **Selenium Manager** | Incluido en Selenium 4.6+. **Descarga automáticamente el ChromeDriver** correcto; ya no hay que bajar `chromedriver.exe` a mano. |
| **Microsoft.Extensions.Configuration** | Lee `appsettings.json` para configurar navegador, URL y timeouts sin tocar el código (igual que en el Lab 2). |

### Patrones aplicados (del Laboratorio 2)

- **Page Object Pattern (POP):** cada pantalla de HAMPIQ tiene una clase que encapsula sus elementos y acciones (`LoginPage`, `SharePage`, `EmergencyPage`, …). Los tests quedan limpios y, si la interfaz cambia, solo se actualiza el Page Object, no los tests.
- **`UiTestContext : IDisposable`:** administra el ciclo de vida del navegador. Cada test crea su propio contexto con `using`, de modo que el navegador se abre y se **cierra (`Driver.Quit()`)** automáticamente, evitando instancias colgadas en memoria.
- **`WebDriverFactory`:** crea el driver del navegador indicado en `appsettings.json` (chrome/edge/firefox).
- **`TestBase` + `appsettings.json`:** la configuración se lee una sola vez (`[OneTimeSetUp]`) y se comparte con todas las clases de prueba.
- **Esperas explícitas (`WebDriverWait`):** en lugar de `Thread.Sleep`, esperamos a que cada elemento aparezca/sea clickeable. Esto da **estabilidad**: el test funciona aunque la SPA tarde en renderizar o el backend en responder (que es justo el problema de inestabilidad que muestra el Lab 1).

---

## 3. El reto de los selectores y nuestra solución (`data-testid`)

En las guías, la página de práctica tenía elementos con `id` (`By.Id("NormalWeb")`). **HAMPIQ no tiene `id` ni `name`** en su HTML: usa estilos en línea, y sus elementos solo se distinguen por el texto visible.

Para tener selectores **estables** (que no se rompan si cambia el estilo o el texto), añadimos a HAMPIQ el atributo estándar de pruebas **`data-testid`** en los elementos clave. Es un cambio mínimo y aditivo (no altera el comportamiento ni la apariencia). Así, en Selenium localizamos por:

```csharp
By.CssSelector("[data-testid='login-submit']")
```

que es el equivalente moderno y robusto al `By.Id` de las guías.

### `data-testid` agregados a HAMPIQ

| Pantalla / archivo | `data-testid` | Elemento |
|--------------------|---------------|----------|
| `Landing.tsx` | `landing-login`, `landing-emergency` | Botones "Iniciar sesión" y "🚑 Emergencia" |
| `Auth.tsx` | `login-dni`, `login-password`, `login-submit`, `login-error` | Campos y botón del login + mensaje de error |
| `Sidebar.tsx` | `nav-share`, `sidebar-username`, `logout` | Navegación, nombre del usuario y cerrar sesión |
| `Dashboard.tsx` | `patient-dashboard` | Contenedor del panel del paciente |
| `Share.tsx` | `share-duration-{15\|30\|60\|240}`, `share-uses-{1\|3\|5\|10}`, `share-generate`, `share-token-code` | Opciones, botón generar y código del token |
| `Emergency.tsx` | `emg-scan`, `emg-code`, `emg-submit`, `emg-error`, `emg-vitals`, `emg-blood-group`, `emg-allergies` | Escaneo, código, datos vitales |
| `Toast.tsx` | `toast` | Notificación de confirmación |

---

## 4. Estructura del proyecto de pruebas

```
Casos_de_uso/
├─ HampiqUiTests.sln               ← Solución que se abre en Visual Studio
├─ README.md                       ← Este documento
├─ CASOS_DE_PRUEBA_Grupo5.docx     ← Documento de casos de prueba y evidencia
├─ Evidencias/                     ← Capturas generadas al ejecutar los tests
└─ HampiqUiTests/
   ├─ HampiqUiTests.csproj
   ├─ appsettings.json             ← Navegador, URL base, timeout, headless
   ├─ TestBase.cs                  ← Lee la configuración (OneTimeSetUp)
   ├─ Config/TestSettings.cs       ← Modelo de configuración
   ├─ Factories/WebDriverFactory.cs← Crea el driver (chrome/edge/firefox)
   ├─ Support/UiTestContext.cs     ← Ciclo de vida del navegador (IDisposable) + captura de evidencia
   ├─ PageObjects/
   │  ├─ BasePage.cs               ← Esperas explícitas + localización por data-testid
   │  ├─ LandingPage.cs
   │  ├─ LoginPage.cs
   │  ├─ PatientDashboardPage.cs
   │  ├─ SharePage.cs
   │  └─ EmergencyPage.cs
   └─ Tests/
      ├─ LoginTests.cs             ← CP-01 (CU-02)
      ├─ ShareTokenTests.cs        ← CP-02 (CU-03)
      └─ EmergencyTests.cs         ← CP-03 (CU-05)
```

---

## 5. Los casos de prueba explicados en función de HAMPIQ

> 📄 **Documentación detallada de cada prueba** (objetivo, precondiciones, pasos, datos, resultado esperado/obtenido y evidencia con capturas): ver **[DOCUMENTACION_PRUEBAS.md](DOCUMENTACION_PRUEBAS.md)**.

### CP-01 · Inicio de sesión (CU-02) — `LoginTests.cs`

**Flujo principal — `Login_ConCredencialesValidas_RedirigeAlDashboard`**
1. Abre HAMPIQ (landing) y pulsa **"Iniciar sesión"**.
2. Escribe el DNI `45872136` y la contraseña `hampiq123` (credenciales de demo del paciente) y pulsa **"Ingresar"**.
3. **Verifica** que aparece el panel del paciente (`patient-dashboard`) y que la barra lateral muestra el nombre **"Juan Carlos Pérez"**.

**Flujo alterno — `Login_ConCredencialesInvalidas_MuestraMensajeDeError`**
1. Igual, pero con una contraseña incorrecta.
2. **Verifica** que el sistema muestra exactamente: *"DNI o contraseña incorrectos."* y **no** deja entrar.

> Esto valida la autenticación contra el backend real (`POST /api/auth/login`) y el ruteo por rol del store de HAMPIQ.

### CP-02 · Generación de token médico (CU-03) — `ShareTokenTests.cs`

**Flujo principal — `GenerarToken_ConDuracionYUsos_CreaTokenConFormatoValido`**
1. Inicia sesión como paciente.
2. En la barra lateral entra a **"Compartir acceso"** (`nav-share`).
3. Elige **duración = 30 min** y **usos = 1**, y pulsa **"Generar token"**.
4. **Verifica** que:
   - aparece el toast *"Token generado y almacenado con TTL."*, y
   - el código cumple el formato oficial `HMPQ-XXXX-XXXX` (regex `^HMPQ-[A-Z0-9]{4}-[A-Z0-9]{4}$`).

> Esto valida la regla de negocio central de HAMPIQ: el paciente genera un token temporal con TTL y usos limitados (`POST /api/tokens`), con un código generado por CSPRNG en el backend.

### CP-03 · Modo emergencia (CU-05) — `EmergencyTests.cs`

**Flujo principal — `Emergencia_SimularEscaneoQr_MuestraSoloDatosVitales`**
1. Desde la landing pulsa **"🚑 Emergencia"** (no requiere login).
2. Pulsa **"Simular escaneo de QR"**.
3. **Verifica** que aparece la tarjeta de datos vitales con **Grupo sanguíneo = "O+"** y alergias que contienen **"Penicilina"**.

> ⚠️ Este flujo necesita que el backend corra con `HAMPIQ_DEMO_EMERGENCY=1` (ver §6), porque el código de emergencia es aleatorio por paciente y la pantalla es previa al login; ese modo permite que el botón "Simular escaneo de QR" resuelva el código del paciente semilla.

**Flujo alterno — `Emergencia_CodigoInvalido_MuestraErrorYNoRevelaDatos`**
1. Igual, pero ingresa el código inexistente `EMG-00000000` y pulsa **"Ver"**.
2. **Verifica** que se muestra el error *"Código de emergencia inválido…"* y que **no** se revela ningún dato vital.

> Esto valida la promesa de seguridad de HAMPIQ: en emergencia solo se expone el subconjunto vital y nunca con un código inválido.

---

## 6. Requisitos y cómo ejecutarlo

### Requisitos
- **Visual Studio Community 2022 (17.12+) o 2026** con la carga **".NET desktop development"**.
- **.NET SDK 9** (incluido en Visual Studio actual).
- **Google Chrome** instalado (el driver se descarga solo con Selenium Manager).
- **Node.js 20+** y **Python 3.11+** (para levantar HAMPIQ).

> Las pruebas corren contra HAMPIQ **en ejecución**. Hay que levantar el backend y el frontend antes de correr los tests.

### Paso 1 — Levantar el backend de HAMPIQ (con modo emergencia demo)
```powershell
cd backend
python -m venv .venv                                           # solo la 1ª vez
.\.venv\Scripts\python.exe -m pip install -r requirements.txt  # solo la 1ª vez
$env:HAMPIQ_DEMO_EMERGENCY = "1"
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000
```
El backend queda en `http://127.0.0.1:8000`. La variable `HAMPIQ_DEMO_EMERGENCY=1` habilita el escaneo de QR de demostración para CP-03.

### Paso 2 — Levantar el frontend de HAMPIQ
```powershell
cd frontend
npm install        # solo la 1ª vez
npm run dev
```
El frontend queda en `http://localhost:5173` (la URL configurada en `appsettings.json`).

### Paso 3 — Ejecutar las pruebas en Visual Studio Community
1. Abre **`Casos_de_uso/HampiqUiTests.sln`**.
2. Espera a que Visual Studio restaure los paquetes NuGet (Selenium, NUnit, FluentAssertions).
3. Menú **Prueba → Explorador de pruebas**.
4. Pulsa **Ejecutar todas**. Se abrirá Chrome y verás los 5 tests ejecutarse. Al terminar deben quedar todos en verde.

> **Alternativa por consola:** desde `Casos_de_uso/` ejecuta `dotnet test`.

---

## 7. Configuración (`appsettings.json`)

```json
{
  "AutomationSettings": {
    "Browser": "chrome",          // "chrome" | "edge" | "firefox"
    "BaseUrl": "http://localhost:5173",
    "WaitTimeoutSeconds": 15,
    "Headless": false             // true para ejecutar sin ventana (CI)
  }
}
```

Cambia `Browser` a `edge` o `firefox` para correr en otro navegador (igual que el Lab 2). También puedes forzar headless con la variable de entorno `HAMPIQ_HEADLESS=1` sin editar el archivo.

---

## 8. Resultado de la ejecución

Ejecutamos la batería contra HAMPIQ en marcha y el resultado fue **5/5 pruebas correctas**:

| Test | Caso | Resultado |
|------|------|-----------|
| `Login_ConCredencialesValidas_RedirigeAlDashboard` | CP-01 principal | ✅ Correcto |
| `Login_ConCredencialesInvalidas_MuestraMensajeDeError` | CP-01 alterno | ✅ Correcto |
| `GenerarToken_ConDuracionYUsos_CreaTokenConFormatoValido` | CP-02 principal | ✅ Correcto |
| `Emergencia_SimularEscaneoQr_MuestraSoloDatosVitales` | CP-03 principal | ✅ Correcto |
| `Emergencia_CodigoInvalido_MuestraErrorYNoRevelaDatos` | CP-03 alterno | ✅ Correcto |

Las capturas de evidencia se guardan en `Evidencias/` (se generan automáticamente al definir la variable de entorno `HAMPIQ_EVIDENCE_DIR`) y están incrustadas en **`CASOS_DE_PRUEBA_Grupo5.docx`**.

---

## 9. Notas y limitaciones
- HAMPIQ usa **datos de demostración (mock)**; las credenciales y los datos vitales son fijos de la semilla del backend.
- Cada ejecución de CP-02 genera un token nuevo (se acumulan en la BD SQLite local; no afecta a las pruebas).
- Las pruebas corren de forma **secuencial**. Para ejecutarlas en paralelo (como en el Lab 2) se puede añadir `[Parallelizable(ParallelScope.Fixtures)]`; dado que comparten la misma cuenta de paciente, lo dejamos secuencial para máxima estabilidad.
