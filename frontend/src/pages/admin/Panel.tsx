import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'
import { computeAuditView, computeLiveTokens } from '@/store/selectors'
import { HISTORY } from '@/services/seed'

const STAT = 'background:#fff;border:1px solid #eaeeed;border-radius:16px;padding:20px;'

export function AdminPanel() {
  const { users, tokens, audit, now } = useStore()
  const liveTokens = computeLiveTokens(tokens, now)
  const tokensActivos = liveTokens.filter((t) => t.isActiva).length
  const accesosHoy = audit.filter((a) => now - a.ts < 86400000).length
  const auditView = computeAuditView(audit)

  return (
    <div style={s('animation:hq-fade .35s ease both;')}>
      <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0 0 6px;')}>Panel general</h1>
      <p style={s('font-size:14.5px;color:#516160;margin:0 0 26px;')}>Supervisión operativa de la plataforma Hampiq.</p>
      <div style={s('display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:18px;')}>
        <div style={s(STAT)}><div style={s('font-size:12.5px;color:#516160;margin-bottom:8px;')}>Usuarios registrados</div><div style={s('font-size:30px;font-weight:800;')}>{users.length}</div></div>
        <div style={s(STAT)}><div style={s('font-size:12.5px;color:#516160;margin-bottom:8px;')}>Tokens activos</div><div style={s('font-size:30px;font-weight:800;color:#0d7d74;')}>{tokensActivos}</div></div>
        <div style={s(STAT)}><div style={s('font-size:12.5px;color:#516160;margin-bottom:8px;')}>Accesos (24h)</div><div style={s('font-size:30px;font-weight:800;')}>{accesosHoy}</div></div>
        <div style={s(STAT)}><div style={s('font-size:12.5px;color:#516160;margin-bottom:8px;')}>Eventos clínicos</div><div style={s('font-size:30px;font-weight:800;')}>{HISTORY.length}</div></div>
      </div>
      <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:8px 22px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
        <div style={s('font-size:13px;font-weight:700;letter-spacing:.04em;padding:16px 0 10px;border-bottom:1px solid #f0f3f2;')}>AUDITORÍA GLOBAL RECIENTE</div>
        {auditView.map((a, i) => (
          <div key={i} style={s('display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #f5f7f6;')}>
            <span style={s(`width:34px;height:34px;border-radius:9px;background:${a.rolBg};display:flex;align-items:center;justify-content:center;font-size:15px;flex:none;`)}>{a.rolIcon}</span>
            <div style={s('flex:1;')}><div style={s('font-size:13.5px;font-weight:600;')}>{a.accion}</div><div style={s('font-size:12px;color:#8a9a98;')}>{a.actor} · {a.ip}</div></div>
            <span style={s('font-size:12.5px;color:#8a9a98;')}>{a.fecha}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
