import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'
import { computeLiveTokens } from '@/store/selectors'

export function AdminTokens() {
  const { tokens, now } = useStore()
  const liveTokens = computeLiveTokens(tokens, now)

  return (
    <div style={s('animation:hq-fade .35s ease both;')}>
      <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0 0 6px;')}>Tokens del sistema</h1>
      <p style={s('font-size:14.5px;color:#516160;margin:0 0 26px;')}>Todos los tokens médicos emitidos y su estado de expiración por TTL.</p>
      <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:8px 22px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
        {liveTokens.map((t) => (
          <div key={t.code} style={s('display:flex;align-items:center;gap:14px;padding:15px 0;border-bottom:1px solid #f5f7f6;')}>
            <span style={s("font-family:'JetBrains Mono',monospace;font-size:14.5px;font-weight:700;flex:none;width:150px;")}>{t.code}</span>
            <span style={s(`display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;background:${t.badgeBg};color:${t.badgeFg};padding:4px 10px;border-radius:7px;`)}><span style={s(`width:6px;height:6px;border-radius:50%;background:${t.badgeDot};`)} />{t.statusLabel}</span>
            <span style={s('font-size:12.5px;color:#8a9a98;flex:1;')}>Paciente: Juan Pérez · médico: {t.medico}</span>
            <span style={s('font-size:12.5px;color:#516160;')}>{t.durLabel} · {t.usesText}</span>
            <span style={s("font-size:13px;font-family:'JetBrains Mono',monospace;color:#516160;width:64px;text-align:right;")}>{t.remText}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
