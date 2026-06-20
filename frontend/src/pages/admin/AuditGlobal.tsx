import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'
import { computeAuditView } from '@/store/selectors'

const GRID = 'display:grid;grid-template-columns:1.6fr 1.4fr 1fr 1fr;gap:12px;'

export function AdminAudit() {
  const { audit } = useStore()
  const auditView = computeAuditView(audit)

  return (
    <div style={s('animation:hq-fade .35s ease both;')}>
      <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0 0 6px;')}>Auditoría global</h1>
      <p style={s('font-size:14.5px;color:#516160;margin:0 0 26px;')}>Registro inmutable de todas las operaciones del sistema.</p>
      <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;overflow:hidden;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
        <div style={s(GRID + 'padding:14px 22px;background:#f7faf9;border-bottom:1px solid #eaeeed;font-size:11.5px;font-weight:700;color:#6b7b79;letter-spacing:.04em;')}><span>ACCIÓN</span><span>ACTOR</span><span>DISPOSITIVO / IP</span><span style={s('text-align:right;')}>FECHA</span></div>
        {auditView.map((a, i) => (
          <div key={i} style={s(GRID + 'padding:15px 22px;border-bottom:1px solid #f5f7f6;align-items:center;')}>
            <div style={s('display:flex;align-items:center;gap:10px;')}><span style={s(`width:30px;height:30px;border-radius:8px;background:${a.rolBg};display:flex;align-items:center;justify-content:center;font-size:14px;flex:none;`)}>{a.rolIcon}</span><span style={s('font-size:13.5px;font-weight:600;')}>{a.accion}</span></div>
            <div style={s('font-size:13px;color:#3a4a48;')}>{a.actor}<div style={s("font-size:11.5px;color:#a3b1af;font-family:'JetBrains Mono',monospace;")}>{a.ref}</div></div>
            <div style={s('font-size:12.5px;color:#516160;')}>{a.disp}<div style={s("font-size:11.5px;color:#a3b1af;font-family:'JetBrains Mono',monospace;")}>{a.ip}</div></div>
            <div style={s('font-size:12.5px;color:#516160;text-align:right;')}>{a.fecha}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
