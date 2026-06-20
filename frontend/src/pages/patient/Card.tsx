import { s } from '@/lib/style'
import { VITALS } from '@/services/seed'

const QR_PATTERN = [
  1, 1, 1, 0, 1, 1, 1,
  1, 0, 1, 0, 0, 0, 1,
  1, 1, 0, 1, 1, 0, 1,
  0, 0, 1, 0, 1, 1, 0,
  1, 1, 0, 1, 0, 0, 1,
  1, 0, 0, 0, 1, 1, 0,
  1, 1, 1, 0, 1, 0, 1,
]

export function Card() {
  const alergiasStr = VITALS.alergias.join(', ')
  const enfermedadesStr = VITALS.enfermedades.join(', ')

  return (
    <div style={s('animation:hq-fade .35s ease both;max-width:760px;')}>
      <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0 0 6px;')}>Tarjeta de emergencia</h1>
      <p style={s('font-size:14.5px;color:#516160;margin:0 0 26px;')}>El personal de emergencia puede escanear este QR para ver únicamente tus datos vitales, sin acceder a tu historial completo.</p>
      <div style={s('display:grid;grid-template-columns:300px 1fr;gap:24px;align-items:start;')}>
        <div style={s('background:linear-gradient(160deg,#0f211f,#0a3b37);border-radius:20px;padding:26px;text-align:center;color:#fff;box-shadow:0 24px 50px -22px #0a3b3766;')}>
          <div style={s('display:flex;align-items:center;justify-content:center;gap:7px;font-size:12px;font-weight:700;color:#ff9aa3;letter-spacing:.08em;margin-bottom:16px;')}><span style={s('width:8px;height:8px;border-radius:50%;background:#e23b48;')} />EMERGENCIA</div>
          <div style={s('background:#fff;border-radius:14px;padding:14px;display:inline-block;margin-bottom:16px;')}>
            <div style={s('width:150px;height:150px;display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(7,1fr);gap:2px;')}>
              {QR_PATTERN.map((c, i) => (
                <span key={i} style={{ background: c ? '#0f211f' : 'transparent', borderRadius: '2px' }} />
              ))}
            </div>
          </div>
          <div style={s("font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;color:#5fd6cb;")}>EMG-45872136</div>
          <div style={s('font-size:12px;color:#7fb8b2;margin-top:4px;')}>Juan Carlos Pérez Quispe</div>
        </div>
        <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:24px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
          <div style={s('font-size:12px;font-weight:700;letter-spacing:.06em;color:#c0202f;margin-bottom:18px;')}>INFORMACIÓN QUE VERÁ EL PERSONAL DE EMERGENCIA</div>
          <div style={s('display:flex;flex-direction:column;gap:16px;')}>
            <div style={s('display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;border-bottom:1px solid #f0f3f2;')}><span style={s('font-size:14px;color:#516160;')}>🩸 Grupo sanguíneo</span><span style={s('font-size:16px;font-weight:800;color:#c0202f;')}>{VITALS.sangre}</span></div>
            <div style={s('display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding-bottom:14px;border-bottom:1px solid #f0f3f2;')}><span style={s('font-size:14px;color:#516160;')}>⚠️ Alergias</span><span style={s('font-size:14px;font-weight:700;text-align:right;')}>{alergiasStr}</span></div>
            <div style={s('display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding-bottom:14px;border-bottom:1px solid #f0f3f2;')}><span style={s('font-size:14px;color:#516160;')}>🫁 Enfermedades críticas</span><span style={s('font-size:14px;font-weight:700;text-align:right;')}>{enfermedadesStr}</span></div>
            <div style={s('display:flex;justify-content:space-between;align-items:flex-start;gap:16px;')}><span style={s('font-size:14px;color:#516160;')}>📞 Contacto de emergencia</span><span style={s('font-size:14px;font-weight:700;text-align:right;')}>{VITALS.contacto.nombre}<br /><span style={s('font-size:12.5px;color:#8a9a98;font-weight:500;')}>{VITALS.contacto.telefono}</span></span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
