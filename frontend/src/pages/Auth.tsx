import { Box } from '@/components/Box'
import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'

const FIELD = 'width:100%;border:1.5px solid #d4e0de;border-radius:10px;padding:13px 14px;font-size:15px;background:#fff;'
const FOCUS = 'border-color:#0d7d74;box-shadow:0 0 0 3px #0d7d7422;'

export function Auth() {
  const { authMode, reg, login, setReg, validarDni, crearCuenta, setLogin, doLogin, goHome } = useStore()
  const isRegister = authMode === 'register'
  const isLogin = authMode === 'login'

  return (
    <div style={s('min-height:100vh;display:flex;')}>
      <div style={s('flex:1;background:linear-gradient(160deg,#0f211f,#0a3b37);color:#fff;padding:48px 56px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;max-width:46%;')}>
        <div style={s('position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,#0d7d7455,transparent 70%);top:-120px;right:-120px;')} />
        <button onClick={goHome} style={s('display:flex;align-items:center;gap:10px;background:transparent;border:none;cursor:pointer;align-self:flex-start;z-index:1;')}>
          <div style={s('width:34px;height:34px;border-radius:10px;background:linear-gradient(150deg,#0d7d74,#0a5c55);display:flex;align-items:center;justify-content:center;position:relative;')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>
            <span style={s('position:absolute;top:-2px;right:-2px;width:8px;height:8px;border-radius:50%;background:#e23b48;border:2px solid #0f211f;')} />
          </div>
          <span style={s('font-size:18px;font-weight:800;color:#fff;')}>Hampiq</span>
        </button>
        <div style={s('z-index:1;')}>
          <h2 style={s('font-size:33px;line-height:1.15;font-weight:800;letter-spacing:-.02em;margin:0 0 18px;text-wrap:balance;')}>El historial clínico que viaja contigo, no con las instituciones.</h2>
          <p style={s('font-size:15.5px;line-height:1.65;color:#9fc4bf;margin:0 0 28px;max-width:400px;')}>Una identidad, un historial unificado y control total sobre quién accede y cuándo.</p>
          <div style={s('display:flex;flex-direction:column;gap:14px;')}>
            <div style={s('display:flex;align-items:center;gap:13px;font-size:14.5px;color:#dff0ed;')}><span style={s('width:30px;height:30px;border-radius:9px;background:#16302c;display:flex;align-items:center;justify-content:center;flex:none;')}>🔑</span>Tokens médicos temporales con expiración automática</div>
            <div style={s('display:flex;align-items:center;gap:13px;font-size:14.5px;color:#dff0ed;')}><span style={s('width:30px;height:30px;border-radius:9px;background:#16302c;display:flex;align-items:center;justify-content:center;flex:none;')}>🚑</span>Modo emergencia con datos vitales por QR</div>
            <div style={s('display:flex;align-items:center;gap:13px;font-size:14.5px;color:#dff0ed;')}><span style={s('width:30px;height:30px;border-radius:9px;background:#16302c;display:flex;align-items:center;justify-content:center;flex:none;')}>📋</span>Auditoría inmutable de cada acceso</div>
          </div>
        </div>
        <div style={s('z-index:1;font-size:12px;color:#6f9b96;')}>Universidad Nacional Mayor de San Marcos · Hampiq v1.0</div>
      </div>

      <div className="hq-scroll" style={s('flex:1;display:flex;align-items:center;justify-content:center;padding:40px;overflow-y:auto;')}>
        <div style={s('width:100%;max-width:420px;animation:hq-fade .4s ease both;')}>

          {isRegister && (
            <div>
              <h1 style={s('font-size:28px;font-weight:800;letter-spacing:-.02em;margin:0 0 6px;')}>Crear cuenta</h1>
              <p style={s('font-size:14.5px;color:#516160;margin:0 0 26px;')}>Te identificamos con tu DNI y autocompletamos tus datos.</p>

              <label style={s('display:block;font-size:13px;font-weight:600;color:#0f211f;margin-bottom:7px;')}>Documento de identidad (DNI)</label>
              <div style={s('display:flex;gap:9px;margin-bottom:6px;')}>
                <Box as="input" data-testid="reg-dni" value={reg.dni} onChange={(e) => setReg('dni', e.target.value)} placeholder="8 dígitos" maxLength={8} inputMode="numeric"
                  css="flex:1;border:1.5px solid #d4e0de;border-radius:10px;padding:13px 14px;font-size:15px;font-family:'JetBrains Mono',monospace;letter-spacing:.05em;background:#fff;" focus={FOCUS} />
                <button data-testid="reg-validar" onClick={validarDni} style={s('border:none;background:#0f211f;color:#fff;font-weight:600;font-size:14px;padding:0 20px;border-radius:10px;cursor:pointer;white-space:nowrap;')}>Validar</button>
              </div>
              <div style={s('font-size:12px;color:#8a9a98;margin-bottom:16px;')}>Demo RENIEC: prueba <strong>45872136</strong>, <strong>70112233</strong> u <strong>08456712</strong>.</div>

              {reg.loading && (
                <div style={s('display:flex;align-items:center;gap:10px;font-size:13.5px;color:#0d7d74;font-weight:600;margin-bottom:16px;')}><span style={s('width:15px;height:15px;border:2px solid #0d7d74;border-top-color:transparent;border-radius:50%;display:inline-block;animation:hq-spin .7s linear infinite;')} />Consultando RENIEC…</div>
              )}

              {reg.validated && (
                <div style={s('animation:hq-fade .35s ease both;')}>
                  <div data-testid="reg-verified" style={s('background:#e7f3f1;border:1px solid #c9e6e1;border-radius:12px;padding:14px 16px;margin-bottom:18px;')}>
                    <div style={s('display:flex;align-items:center;gap:7px;font-size:12px;font-weight:700;color:#0a5c55;margin-bottom:10px;')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#0a5c55" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>IDENTIDAD VERIFICADA</div>
                    <div style={s('display:grid;grid-template-columns:1fr 1fr;gap:10px 16px;')}>
                      <div><div style={s('font-size:11px;color:#5a7a76;')}>Nombres</div><div data-testid="reg-nombres" style={s('font-size:14px;font-weight:600;')}>{reg.nombres}</div></div>
                      <div><div style={s('font-size:11px;color:#5a7a76;')}>Apellidos</div><div style={s('font-size:14px;font-weight:600;')}>{reg.apellidos}</div></div>
                      <div><div style={s('font-size:11px;color:#5a7a76;')}>Nacimiento</div><div style={s('font-size:14px;font-weight:600;')}>{reg.nacimiento}</div></div>
                      <div><div style={s('font-size:11px;color:#5a7a76;')}>Sexo</div><div style={s('font-size:14px;font-weight:600;')}>{reg.sexo}</div></div>
                    </div>
                  </div>

                  <label style={s('display:block;font-size:13px;font-weight:600;margin-bottom:7px;')}>Correo electrónico</label>
                  <Box as="input" value={reg.correo} onChange={(e) => setReg('correo', e.target.value)} type="email" placeholder="tu@correo.com" css={FIELD + 'margin-bottom:14px;'} focus={FOCUS} />
                  <label style={s('display:block;font-size:13px;font-weight:600;margin-bottom:7px;')}>Teléfono</label>
                  <Box as="input" value={reg.telefono} onChange={(e) => setReg('telefono', e.target.value)} inputMode="tel" placeholder="9XX XXX XXX" css={FIELD + 'margin-bottom:14px;'} focus={FOCUS} />
                  <label style={s('display:block;font-size:13px;font-weight:600;margin-bottom:7px;')}>Contraseña</label>
                  <Box as="input" value={reg.password} onChange={(e) => setReg('password', e.target.value)} type="password" placeholder="Mínimo 8 caracteres" css={FIELD + 'margin-bottom:18px;'} focus={FOCUS} />
                  <button onClick={crearCuenta} style={s('width:100%;border:none;background:#0d7d74;color:#fff;font-size:15.5px;font-weight:700;padding:14px;border-radius:11px;cursor:pointer;box-shadow:0 12px 24px -10px #0d7d74cc;')}>Crear cuenta</button>
                </div>
              )}

              {reg.error && (
                <div style={s('background:#fdeaec;border:1px solid #f5c9ce;color:#c0202f;font-size:13px;font-weight:500;padding:11px 14px;border-radius:10px;margin-top:14px;display:flex;align-items:flex-start;gap:8px;')}><span style={s('font-weight:700;')}>!</span><span data-testid="reg-error">{reg.error}</span></div>
              )}

              <div style={s('text-align:center;margin-top:22px;font-size:14px;color:#516160;')}>¿Ya tienes cuenta? <button onClick={() => useStore.setState({ authMode: 'login' })} style={s('border:none;background:transparent;color:#0d7d74;font-weight:700;cursor:pointer;font-size:14px;')}>Inicia sesión</button></div>
            </div>
          )}

          {isLogin && (
            <div>
              <h1 style={s('font-size:28px;font-weight:800;letter-spacing:-.02em;margin:0 0 6px;')}>Iniciar sesión</h1>
              <p style={s('font-size:14.5px;color:#516160;margin:0 0 26px;')}>Ingresa con tu DNI y contraseña.</p>

              <label style={s('display:block;font-size:13px;font-weight:600;margin-bottom:7px;')}>DNI</label>
              <Box as="input" data-testid="login-dni" value={login.dni} onChange={(e) => setLogin('dni', e.target.value)} placeholder="Número de documento" inputMode="numeric"
                css="width:100%;border:1.5px solid #d4e0de;border-radius:10px;padding:13px 14px;font-size:15px;font-family:'JetBrains Mono',monospace;margin-bottom:16px;background:#fff;" focus={FOCUS} />
              <label style={s('display:block;font-size:13px;font-weight:600;margin-bottom:7px;')}>Contraseña</label>
              <Box as="input" data-testid="login-password" value={login.password} onChange={(e) => setLogin('password', e.target.value)} type="password" placeholder="••••••••" css={FIELD + 'margin-bottom:20px;'} focus={FOCUS} />
              <button data-testid="login-submit" onClick={doLogin} style={s('width:100%;border:none;background:#0d7d74;color:#fff;font-size:15.5px;font-weight:700;padding:14px;border-radius:11px;cursor:pointer;box-shadow:0 12px 24px -10px #0d7d74cc;')}>Ingresar</button>

              {login.error && (
                <div style={s('background:#fdeaec;border:1px solid #f5c9ce;color:#c0202f;font-size:13px;font-weight:500;padding:11px 14px;border-radius:10px;margin-top:14px;display:flex;align-items:center;gap:8px;')}><span style={s('font-weight:700;')}>!</span><span data-testid="login-error">{login.error}</span></div>
              )}

              <div style={s('background:#f7faf9;border:1px solid #e6eeed;border-radius:12px;padding:14px 16px;margin-top:20px;font-size:12.5px;color:#516160;line-height:1.7;')}>
                <div style={s('font-weight:700;color:#0f211f;margin-bottom:5px;')}>Credenciales de demostración</div>
                Paciente — DNI <strong>45872136</strong> / <strong>hampiq123</strong><br />
                Médico — DNI <strong>40221785</strong> / <strong>medico123</strong><br />
                Admin — DNI <strong>10000001</strong> / <strong>admin123</strong>
              </div>

              <div style={s('text-align:center;margin-top:22px;font-size:14px;color:#516160;')}>¿No tienes cuenta? <button onClick={() => useStore.setState({ authMode: 'register' })} style={s('border:none;background:transparent;color:#0d7d74;font-weight:700;cursor:pointer;font-size:14px;')}>Crea una</button></div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
