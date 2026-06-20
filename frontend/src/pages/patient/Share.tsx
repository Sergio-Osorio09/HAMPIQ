import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'
import { computeLiveTokens } from '@/store/selectors'

const optStyle = (active: boolean) =>
  `flex:1;border:1.5px solid ${active ? '#0d7d74' : '#d4e0de'};background:${active ? '#e7f3f1' : '#fff'};color:${active ? '#0a5c55' : '#516160'};font-size:13.5px;font-weight:700;padding:11px 0;border-radius:10px;cursor:pointer;`

const DURATIONS = [{ v: 15, l: '15 min' }, { v: 30, l: '30 min' }, { v: 60, l: '1 hora' }, { v: 240, l: '4 horas' }]
const USES = [{ v: 1, l: '1 uso' }, { v: 3, l: '3 usos' }, { v: 5, l: '5 usos' }, { v: 10, l: '10 usos' }]

export function Share() {
  const { share, tokens, now, setShare, generarToken, copiarToken, revocarToken } = useStore()
  const liveTokens = computeLiveTokens(tokens, now)
  const shareGenerated = share.generated ? liveTokens.find((t) => t.code === share.generated!.code) || null : null

  return (
    <div style={s('animation:hq-fade .35s ease both;max-width:760px;')}>
      <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0 0 6px;')}>Compartir acceso</h1>
      <p style={s('font-size:14.5px;color:#516160;margin:0 0 26px;')}>Genera un token temporal para que un médico consulte tu historial. Tú defines cuánto dura y cuántas veces puede usarse.</p>

      <div style={s('display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start;')}>
        <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:24px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
          <div style={s('font-size:13px;font-weight:700;letter-spacing:.04em;margin-bottom:18px;')}>CONFIGURAR TOKEN</div>
          <label style={s('display:block;font-size:13.5px;font-weight:600;margin-bottom:10px;')}>Duración del acceso</label>
          <div style={s('display:flex;gap:8px;margin-bottom:20px;')}>
            {DURATIONS.map((d) => (
              <button key={d.v} onClick={() => setShare('duration', d.v)} style={s(optStyle(share.duration === d.v))}>{d.l}</button>
            ))}
          </div>
          <label style={s('display:block;font-size:13.5px;font-weight:600;margin-bottom:10px;')}>Número de usos permitidos</label>
          <div style={s('display:flex;gap:8px;margin-bottom:24px;')}>
            {USES.map((u) => (
              <button key={u.v} onClick={() => setShare('uses', u.v)} style={s(optStyle(share.uses === u.v))}>{u.l}</button>
            ))}
          </div>
          <button onClick={generarToken} style={s('width:100%;border:none;background:#0d7d74;color:#fff;font-size:15px;font-weight:700;padding:14px;border-radius:11px;cursor:pointer;box-shadow:0 12px 24px -10px #0d7d74cc;')}>Generar token</button>
        </div>

        {shareGenerated ? (
          <div style={s('background:#0f211f;border-radius:18px;padding:24px;color:#fff;animation:hq-pop .35s ease both;position:relative;overflow:hidden;')}>
            <div style={s('position:absolute;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,#0d7d7444,transparent 70%);top:-70px;right:-50px;')} />
            <div style={s('position:relative;')}>
              <div style={s('font-size:12px;font-weight:700;color:#7fb8b2;letter-spacing:.06em;margin-bottom:14px;')}>TOKEN GENERADO</div>
              <div style={s('background:#16302c;border-radius:12px;padding:16px;text-align:center;margin-bottom:16px;')}>
                <div style={s("font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:700;letter-spacing:.06em;color:#5fd6cb;")}>{shareGenerated.code}</div>
              </div>
              <div style={s('display:flex;gap:20px;margin-bottom:18px;')}>
                <div><div style={s('font-size:11px;color:#7fb8b2;')}>Vigencia</div><div style={s("font-size:18px;font-weight:700;font-family:'JetBrains Mono',monospace;color:#5fd6cb;")}>{shareGenerated.remText}</div></div>
                <div><div style={s('font-size:11px;color:#7fb8b2;')}>Usos</div><div style={s("font-size:18px;font-weight:700;font-family:'JetBrains Mono',monospace;")}>{shareGenerated.usesText}</div></div>
              </div>
              <div style={s('display:flex;gap:10px;')}>
                <button onClick={() => copiarToken(shareGenerated.code)} style={s('flex:1;border:none;background:#0d7d74;color:#fff;font-size:13.5px;font-weight:700;padding:11px;border-radius:9px;cursor:pointer;')}>Copiar</button>
                <button onClick={() => revocarToken(shareGenerated.code)} style={s('flex:1;border:1px solid #5a2b30;background:transparent;color:#ff9aa3;font-size:13.5px;font-weight:600;padding:11px;border-radius:9px;cursor:pointer;')}>Revocar</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={s('background:#f7faf9;border:1.5px dashed #d4e0de;border-radius:18px;padding:32px 24px;text-align:center;color:#8a9a98;')}>
            <div style={s('font-size:40px;margin-bottom:10px;')}>🔑</div>
            <div style={s('font-size:14px;line-height:1.55;')}>Tu token aparecerá aquí una vez generado, con su cuenta regresiva en vivo.</div>
          </div>
        )}
      </div>

      <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:8px 22px;margin-top:18px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
        <div style={s('font-size:13px;font-weight:700;letter-spacing:.04em;padding:16px 0 10px;border-bottom:1px solid #f0f3f2;')}>TOKENS EMITIDOS</div>
        {liveTokens.map((t) => (
          <div key={t.code} style={s('display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #f5f7f6;')}>
            <span style={s("font-family:'JetBrains Mono',monospace;font-size:14.5px;font-weight:700;flex:none;width:150px;")}>{t.code}</span>
            <span style={s(`display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;background:${t.badgeBg};color:${t.badgeFg};padding:4px 10px;border-radius:7px;`)}><span style={s(`width:6px;height:6px;border-radius:50%;background:${t.badgeDot};`)} />{t.statusLabel}</span>
            <span style={s('font-size:12.5px;color:#8a9a98;flex:1;')}>{t.durLabel} · {t.usesText} · creado {t.createdRel}</span>
            <span style={s("font-size:13px;font-family:'JetBrains Mono',monospace;color:#516160;")}>{t.remText}</span>
            {t.isActiva && (
              <button onClick={() => revocarToken(t.code)} style={s('border:1px solid #f0d0d4;background:#fff;color:#c0202f;font-size:12px;font-weight:600;padding:6px 12px;border-radius:8px;cursor:pointer;')}>Revocar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
