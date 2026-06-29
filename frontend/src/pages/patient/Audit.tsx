import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'
import { computeAuditView } from '@/store/selectors'

const GRID = 'display:grid;grid-template-columns:1.6fr 1.4fr 1fr 1fr;gap:12px;'

export function Audit() {
  const { audit, sessions, cerrarSesionDisp } = useStore()
  const auditView = computeAuditView(audit)

  return (
    <div style={s('animation:hq-fade .35s ease both;')}>
      <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0 0 6px;')}>Auditoría de accesos</h1>
      <p style={s('font-size:14.5px;color:#516160;margin:0 0 26px;')}>Registro inmutable de cada acceso a tu historial, y control de tus sesiones y dispositivos.</p>

      <div data-testid="audit-list" style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;overflow:hidden;box-shadow:0 1px 2px rgba(15,33,31,.03);margin-bottom:22px;')}>
        <div style={s(GRID + 'padding:14px 22px;background:#f7faf9;border-bottom:1px solid #eaeeed;font-size:11.5px;font-weight:700;color:#6b7b79;letter-spacing:.04em;')}>
          <span>ACCIÓN</span><span>ACTOR</span><span>DISPOSITIVO / IP</span><span style={s('text-align:right;')}>FECHA</span>
        </div>
        {auditView.map((a, i) => (
          <div key={i} data-testid="audit-row" style={s(GRID + 'padding:15px 22px;border-bottom:1px solid #f5f7f6;align-items:center;')}>
            <div style={s('display:flex;align-items:center;gap:10px;min-width:0;')}><span style={s(`width:30px;height:30px;border-radius:8px;background:${a.rolBg};display:flex;align-items:center;justify-content:center;font-size:14px;flex:none;`)}>{a.rolIcon}</span><span style={s('font-size:13.5px;font-weight:600;')}>{a.accion}</span></div>
            <div style={s('font-size:13px;color:#3a4a48;')}>{a.actor}<div style={s("font-size:11.5px;color:#a3b1af;font-family:'JetBrains Mono',monospace;")}>{a.ref}</div></div>
            <div style={s('font-size:12.5px;color:#516160;')}>{a.disp}<div style={s("font-size:11.5px;color:#a3b1af;font-family:'JetBrains Mono',monospace;")}>{a.ip}</div></div>
            <div style={s('font-size:12.5px;color:#516160;text-align:right;')}>{a.fecha}</div>
          </div>
        ))}
      </div>

      <div style={s('font-size:13px;font-weight:700;letter-spacing:.04em;color:#0f211f;margin-bottom:14px;')}>SESIONES Y DISPOSITIVOS ACTIVOS</div>
      <div style={s('display:flex;flex-direction:column;gap:12px;')}>
        {sessions.map((sess) => (
          <div key={sess.id} style={s('background:#fff;border:1px solid #eaeeed;border-radius:14px;padding:16px 20px;display:flex;align-items:center;gap:16px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
            <span style={s('width:40px;height:40px;border-radius:11px;background:#f4f7f6;display:flex;align-items:center;justify-content:center;font-size:18px;flex:none;')}>💻</span>
            <div style={s('flex:1;')}><div style={s('font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;')}>{sess.disp}{sess.actual && <span style={s('font-size:10.5px;font-weight:700;background:#e7f3f1;color:#0a5c55;padding:3px 8px;border-radius:6px;')}>ESTE DISPOSITIVO</span>}</div><div style={s('font-size:12.5px;color:#8a9a98;')}>{sess.lugar} · {sess.ip} · {sess.ultimo}</div></div>
            {!sess.actual && (
              <button onClick={() => cerrarSesionDisp(sess.id)} style={s('border:1px solid #f0d0d4;background:#fff;color:#c0202f;font-size:12.5px;font-weight:600;padding:8px 14px;border-radius:9px;cursor:pointer;')}>Cerrar sesión</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
