import { s } from '@/lib/style'
import { useStore } from '@/store/useStore'
import { computeAuditView, computeLiveTokens } from '@/store/selectors'
import { HISTORY, VITALS } from '@/services/seed'

export function Dashboard() {
  const { tokens, audit, now, pgo, copiarToken, revocarToken } = useStore()
  const liveTokens = computeLiveTokens(tokens, now)
  const activeToken = liveTokens.find((t) => t.isActiva) || null
  const tokensActivos = liveTokens.filter((t) => t.isActiva).length
  const auditView = computeAuditView(audit)
  const alergiasStr = VITALS.alergias.join(', ')
  const enfermedadesStr = VITALS.enfermedades.join(', ')

  return (
    <div style={s('animation:hq-fade .35s ease both;')}>
      <div style={s('display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:26px;')}>
        <div>
          <div style={s('font-size:13.5px;color:#516160;font-weight:500;margin-bottom:4px;')}>Buen día,</div>
          <h1 style={s('font-size:30px;font-weight:800;letter-spacing:-.025em;margin:0;')}>Juan Carlos Pérez</h1>
        </div>
        <button onClick={() => pgo('share')} style={s('border:none;background:#0d7d74;color:#fff;font-size:14.5px;font-weight:700;padding:12px 20px;border-radius:11px;cursor:pointer;box-shadow:0 10px 22px -10px #0d7d74cc;display:flex;align-items:center;gap:8px;')}>＋ Compartir mi historial</button>
      </div>

      <div style={s('display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:18px;')}>
        <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:16px;padding:20px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
          <div style={s('font-size:13px;color:#516160;font-weight:500;margin-bottom:10px;')}>Tokens activos</div>
          <div style={s('font-size:32px;font-weight:800;letter-spacing:-.02em;color:#0d7d74;')}>{tokensActivos}</div>
          <div style={s('font-size:12px;color:#8a9a98;margin-top:2px;')}>acceso compartido vigente</div>
        </div>
        <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:16px;padding:20px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
          <div style={s('font-size:13px;color:#516160;font-weight:500;margin-bottom:10px;')}>Eventos en mi historial</div>
          <div style={s('font-size:32px;font-weight:800;letter-spacing:-.02em;')}>{HISTORY.length}</div>
          <div style={s('font-size:12px;color:#8a9a98;margin-top:2px;')}>registros clínicos</div>
        </div>
        <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:16px;padding:20px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
          <div style={s('font-size:13px;color:#516160;font-weight:500;margin-bottom:10px;')}>Accesos auditados</div>
          <div style={s('font-size:32px;font-weight:800;letter-spacing:-.02em;')}>{auditView.length}</div>
          <div style={s('font-size:12px;color:#8a9a98;margin-top:2px;')}>registrados en total</div>
        </div>
      </div>

      <div style={s('display:grid;grid-template-columns:1.4fr 1fr;gap:16px;')}>
        <div style={s('background:#0f211f;border-radius:18px;padding:24px;color:#fff;position:relative;overflow:hidden;')}>
          <div style={s('position:absolute;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,#0d7d7444,transparent 70%);top:-80px;right:-60px;')} />
          <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;position:relative;')}>
            <span style={s('font-size:12px;font-weight:700;color:#7fb8b2;letter-spacing:.08em;')}>TOKEN MÉDICO ACTIVO</span>
            <span style={s('display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;background:#16302c;color:#5fd6cb;padding:5px 10px;border-radius:7px;')}><span style={s('width:6px;height:6px;border-radius:50%;background:#5fd6cb;animation:hq-pulse 1.6s infinite;')} />VIGENTE</span>
          </div>
          {activeToken ? (
            <div style={s('position:relative;')}>
              <div style={s("font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:700;letter-spacing:.04em;margin-bottom:18px;")}>{activeToken.code}</div>
              <div style={s('display:flex;gap:28px;margin-bottom:18px;')}>
                <div><div style={s('font-size:11px;color:#7fb8b2;margin-bottom:3px;')}>Tiempo restante</div><div style={s("font-size:22px;font-weight:800;color:#5fd6cb;font-family:'JetBrains Mono',monospace;")}>{activeToken.remText}</div></div>
                <div><div style={s('font-size:11px;color:#7fb8b2;margin-bottom:3px;')}>Usos disponibles</div><div style={s("font-size:22px;font-weight:800;font-family:'JetBrains Mono',monospace;")}>{activeToken.usesText}</div></div>
              </div>
              <div style={s('display:flex;gap:10px;')}>
                <button onClick={() => copiarToken(activeToken.code)} style={s('flex:1;border:none;background:#16302c;color:#dff0ed;font-size:13.5px;font-weight:600;padding:11px;border-radius:9px;cursor:pointer;')}>Copiar token</button>
                <button onClick={() => revocarToken(activeToken.code)} style={s('flex:1;border:1px solid #5a2b30;background:transparent;color:#ff9aa3;font-size:13.5px;font-weight:600;padding:11px;border-radius:9px;cursor:pointer;')}>Revocar</button>
              </div>
            </div>
          ) : (
            <div style={s('position:relative;padding:14px 0;')}>
              <div style={s('font-size:14.5px;color:#9fc4bf;margin-bottom:16px;line-height:1.5;')}>No tienes tokens activos. Genera uno para que un médico consulte tu historial de forma temporal.</div>
              <button onClick={() => pgo('share')} style={s('border:none;background:#0d7d74;color:#fff;font-size:13.5px;font-weight:700;padding:11px 18px;border-radius:9px;cursor:pointer;')}>Generar token</button>
            </div>
          )}
        </div>

        <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:22px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
          <div style={s('display:flex;align-items:center;gap:8px;margin-bottom:16px;')}><span style={s('width:8px;height:8px;border-radius:50%;background:#e23b48;')} /><span style={s('font-size:12px;font-weight:700;color:#0f211f;letter-spacing:.04em;')}>DATOS VITALES</span></div>
          <div style={s('display:flex;flex-direction:column;gap:12px;')}>
            <div style={s('display:flex;justify-content:space-between;align-items:center;')}><span style={s('font-size:13.5px;color:#516160;')}>Grupo sanguíneo</span><span style={s('font-size:14px;font-weight:700;color:#c0202f;')}>{VITALS.sangre}</span></div>
            <div style={s('display:flex;justify-content:space-between;align-items:flex-start;gap:12px;')}><span style={s('font-size:13.5px;color:#516160;')}>Alergias</span><span style={s('font-size:13.5px;font-weight:600;text-align:right;')}>{alergiasStr}</span></div>
            <div style={s('display:flex;justify-content:space-between;align-items:flex-start;gap:12px;')}><span style={s('font-size:13.5px;color:#516160;')}>Enfermedades</span><span style={s('font-size:13.5px;font-weight:600;text-align:right;')}>{enfermedadesStr}</span></div>
          </div>
          <button onClick={() => pgo('card')} style={s('width:100%;margin-top:18px;border:1px solid #d4e0de;background:#f7faf9;color:#0f211f;font-size:13px;font-weight:600;padding:10px;border-radius:9px;cursor:pointer;')}>Ver tarjeta de emergencia →</button>
        </div>
      </div>

      <div style={s('background:#fff;border:1px solid #eaeeed;border-radius:18px;padding:8px 22px;margin-top:18px;box-shadow:0 1px 2px rgba(15,33,31,.03);')}>
        <div style={s('font-size:13px;font-weight:700;color:#0f211f;letter-spacing:.04em;padding:16px 0 10px;border-bottom:1px solid #f0f3f2;')}>ACTIVIDAD RECIENTE</div>
        {auditView.map((a, i) => (
          <div key={i} style={s('display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #f5f7f6;')}>
            <span style={s(`width:36px;height:36px;border-radius:10px;background:${a.rolBg};display:flex;align-items:center;justify-content:center;font-size:16px;flex:none;`)}>{a.rolIcon}</span>
            <div style={s('flex:1;min-width:0;')}><div style={s('font-size:14px;font-weight:600;')}>{a.accion}</div><div style={s('font-size:12.5px;color:#8a9a98;')}>{a.actor} · {a.rel}</div></div>
            <span style={s("font-size:12px;color:#a3b1af;font-family:'JetBrains Mono',monospace;white-space:nowrap;")}>{a.ref}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
