import { Toggle } from '@/components/Toggle'
import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'

const PFIELD = 'width:100%;border:1.5px solid #e6eeed;border-radius:10px;padding:12px 14px;font-size:14px;background:#fbfcfc;'
const PRIV = 'display:flex;align-items:center;gap:10px;border:1px solid #eaeeed;background:#fbfcfc;border-radius:11px;padding:13px 15px;cursor:pointer;font-size:13.5px;font-weight:600;color:#0f211f;'

export function Profile() {
  const { profile, vitals, pgo, toggleProfile } = useStore()
  const alergiasStr = vitals.alergias.join(', ')
  const enfermedadesStr = vitals.enfermedades.join(', ')

  return (
    <div style={s('animation:hq-fade .35s ease both;max-width:820px;')}>
      <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0 0 6px;')}>Mi perfil</h1>
      <p style={s('font-size:14.5px;color:#516160;margin:0 0 24px;')}>Gestiona tu identidad, tus datos médicos base, tu seguridad y tus preferencias.</p>

      <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:24px;margin-bottom:16px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
        <div style={s('display:flex;align-items:center;gap:16px;margin-bottom:22px;')}>
          <div style={s('width:64px;height:64px;border-radius:50%;background:linear-gradient(150deg,#0d7d74,#0a5c55);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:22px;')}>JP</div>
          <div style={s('flex:1;')}><div style={s('font-size:20px;font-weight:800;')}>Juan Carlos Pérez Quispe</div><div style={s('display:flex;align-items:center;gap:8px;font-size:13px;color:#8a9a98;')}>DNI 45872136 <span style={s('font-size:11px;font-weight:700;background:#e7f3f1;color:#0a5c55;padding:3px 8px;border-radius:6px;')}>✓ Verificado con RENIEC</span></div></div>
        </div>
        <div style={s('display:grid;grid-template-columns:1fr 1fr;gap:16px;')}>
          <div><label style={s('display:block;font-size:12px;font-weight:600;color:#8a9a98;margin-bottom:6px;')}>Correo electrónico</label><input value={profile.correo} readOnly style={s(PFIELD)} /></div>
          <div><label style={s('display:block;font-size:12px;font-weight:600;color:#8a9a98;margin-bottom:6px;')}>Teléfono</label><input value={profile.telefono} readOnly style={s(PFIELD)} /></div>
          <div style={s('grid-column:span 2;')}><label style={s('display:block;font-size:12px;font-weight:600;color:#8a9a98;margin-bottom:6px;')}>Dirección</label><input value={profile.direccion} readOnly style={s(PFIELD)} /></div>
        </div>
      </div>

      <div style={s('display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;')}>
        <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:22px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
          <div style={s('font-size:12.5px;font-weight:700;letter-spacing:.04em;color:#0f211f;margin-bottom:16px;')}>🩺 DATOS MÉDICOS BASE</div>
          <div style={s('display:flex;flex-direction:column;gap:13px;')}>
            <div style={s('display:flex;justify-content:space-between;')}><span style={s('font-size:13.5px;color:#516160;')}>Grupo sanguíneo</span><span style={s('font-size:13.5px;font-weight:700;color:#c0202f;')}>{vitals.sangre}</span></div>
            <div style={s('display:flex;justify-content:space-between;gap:12px;')}><span style={s('font-size:13.5px;color:#516160;')}>Alergias</span><span style={s('font-size:13.5px;font-weight:600;text-align:right;')}>{alergiasStr}</span></div>
            <div style={s('display:flex;justify-content:space-between;gap:12px;')}><span style={s('font-size:13.5px;color:#516160;')}>Enfermedades</span><span style={s('font-size:13.5px;font-weight:600;text-align:right;')}>{enfermedadesStr}</span></div>
            <div style={s('display:flex;justify-content:space-between;gap:12px;')}><span style={s('font-size:13.5px;color:#516160;')}>Contacto emergencia</span><span style={s('font-size:13.5px;font-weight:600;text-align:right;')}>{vitals.contacto.nombre}</span></div>
          </div>
        </div>
        <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:22px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
          <div style={s('font-size:12.5px;font-weight:700;letter-spacing:.04em;color:#0f211f;margin-bottom:16px;')}>🔒 SEGURIDAD</div>
          <div style={s('display:flex;flex-direction:column;gap:8px;')}>
            <button style={s('display:flex;align-items:center;justify-content:space-between;width:100%;border:1px solid #eaeeed;background:#fbfcfc;border-radius:11px;padding:13px 15px;cursor:pointer;font-size:13.5px;font-weight:600;color:#0f211f;')}>Cambiar contraseña <span style={s('color:#8a9a98;')}>→</span></button>
            <div style={s('display:flex;align-items:center;justify-content:space-between;border:1px solid #eaeeed;border-radius:11px;padding:13px 15px;')}>
              <div><div style={s('font-size:13.5px;font-weight:600;')}>Verificación en dos pasos</div><div style={s('font-size:11.5px;color:#8a9a98;')}>Código adicional al iniciar sesión</div></div>
              <Toggle on={profile.mfa} onClick={() => toggleProfile('mfa')} />
            </div>
            <button onClick={() => pgo('audit')} style={s('display:flex;align-items:center;justify-content:space-between;width:100%;border:1px solid #eaeeed;background:#fbfcfc;border-radius:11px;padding:13px 15px;cursor:pointer;font-size:13.5px;font-weight:600;color:#0f211f;')}>Sesiones y dispositivos <span style={s('color:#8a9a98;')}>→</span></button>
          </div>
        </div>
      </div>

      <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:22px;margin-bottom:16px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
        <div style={s('font-size:12.5px;font-weight:700;letter-spacing:.04em;color:#0f211f;margin-bottom:8px;')}>🔔 PREFERENCIAS DE NOTIFICACIÓN</div>
        <div style={s('font-size:12.5px;color:#8a9a98;margin-bottom:16px;')}>Te avisamos cuando alguien accede a tu historial.</div>
        <div style={s('display:flex;flex-direction:column;')}>
          <div style={s('display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid #f5f7f6;')}><span style={s('font-size:14px;font-weight:500;')}>Correo electrónico</span><Toggle on={profile.notifEmail} onClick={() => toggleProfile('notifEmail')} /></div>
          <div style={s('display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid #f5f7f6;')}><span style={s('font-size:14px;font-weight:500;')}>SMS</span><Toggle on={profile.notifSMS} onClick={() => toggleProfile('notifSMS')} /></div>
          <div style={s('display:flex;align-items:center;justify-content:space-between;padding:13px 0;')}><span style={s('font-size:14px;font-weight:500;')}>Notificaciones push</span><Toggle on={profile.notifPush} onClick={() => toggleProfile('notifPush')} /></div>
        </div>
      </div>

      <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:22px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
        <div style={s('font-size:12.5px;font-weight:700;letter-spacing:.04em;color:#0f211f;margin-bottom:16px;')}>🛡️ PRIVACIDAD Y DATOS</div>
        <div style={s('display:grid;grid-template-columns:1fr 1fr;gap:10px;')}>
          <button style={s(PRIV)}>📥 Descargar mi historial</button>
          <button style={s(PRIV)}>📋 Gestionar consentimientos</button>
          <button style={s(PRIV)}>🚑 Configurar modo emergencia</button>
          <button style={s('display:flex;align-items:center;gap:10px;border:1px solid #f0d0d4;background:#fff;border-radius:11px;padding:13px 15px;cursor:pointer;font-size:13.5px;font-weight:600;color:#c0202f;')}>⚠️ Desactivar cuenta</button>
        </div>
      </div>
    </div>
  )
}
